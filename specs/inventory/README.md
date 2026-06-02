# Especificación de Inventario (Inventory Specification)

Este documento define la arquitectura, el modelo de datos, la lógica de reservas y la estrategia de sincronización con SAP para la gestión de inventario en la plataforma de e-commerce.

---

## 1. Modelo de Datos (Data Model)

Para cumplir con las necesidades de escalabilidad y la futura expansión del e-commerce (como retiro en tienda o múltiples centros de distribución en B2B), la plataforma utiliza una arquitectura **Multi-Bodega (Multi-Warehouse)**. SAP gestiona de forma nativa el inventario segmentado por Centros (Plants) y Almacenes (Storage Locations); reflejar esta estructura en nuestra base de datos local evita la desincronización lógica.

### 1.1. Modelos en Prisma ORM (PostgreSQL)

Para dar soporte a múltiples bodegas y al rastreo de reservas, se añaden los modelos `Warehouse`, `Stock` y `StockReservation` a nuestro esquema de base de datos. El modelo `Variant` se relaciona con `Stock` de manera de admitir múltiples ubicaciones.

```prisma
// ─── Bodegas/Centros (SAP Plants / Locations) ───
model Warehouse {
  id        String    @id @default(cuid())
  code      String    @unique // Código identificador de SAP (ej: "CENTRO_01", "ALM_VALPO")
  name      String
  city      String?
  isActive  Boolean   @default(true)
  deletedAt DateTime?
  
  stocks    Stock[]

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([code])
}

// ─── Relación de Stock por SKU y Bodega ───
model Stock {
  id             String      @id @default(cuid())
  variantId      String
  variant        Variant     @relation(fields: [variantId], references: [id], onDelete: Cascade)
  warehouseId    String
  warehouse      Warehouse   @relation(fields: [warehouseId], references: [id], onDelete: Cascade)
  
  physicalStock  Int         @default(0) // Stock real reportado por SAP
  reservedStock  Int         @default(0) // Stock temporalmente congelado u órdenes pagadas sin sync en SAP
  minThreshold   Int         @default(0) // Umbral crítico para alertas de bajo inventario
  
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  @@unique([variantId, warehouseId])
  @@index([variantId])
  @@index([warehouseId])
}

// ─── Registro de Reservas Temporales (Checkout) ───
model StockReservation {
  id          String    @id @default(cuid())
  variantId   String
  warehouseId String
  quantity    Int
  cartId      String?
  orderId     String?   @unique
  expiresAt   DateTime  // Timestamp límite para concretar el pago
  isReleased  Boolean   @default(false) // Si expiró y el stock fue devuelto
  isConfirmed Boolean   @default(false) // Si el pago se procesó y la orden está lista para SAP
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([expiresAt, isReleased, isConfirmed])
  @@index([variantId, warehouseId])
}
```

> [!NOTE]
> En la implementación final, los campos `availableStock`, `reservedStock` e `incomingStock` definidos directamente en `Variant` en el `schema.prisma` básico se mantendrán como campos calculados agregados para optimizar las consultas rápidas del catálogo (BFF), pero el origen de la verdad transaccional será la tabla `Stock`.

### 1.2. Estados del Inventario

Es fundamental diferenciar matemáticamente los tres estados del stock para evitar inconsistencias en el frontend y prevenir la sobreventa:

| Estado | Descripción | Origen de la Verdad |
| :--- | :--- | :--- |
| **Stock Físico** (`physicalStock`) | La cantidad de producto que realmente existe físicamente en las bodegas físicas. | **SAP ERP** |
| **Stock Comprometido** (`reservedStock`) | Stock retenido por checkouts activos (reservas temporales con TTL) más órdenes pagadas locales cuyas entregas aún no han sido procesadas o deducidas en SAP. | **E-commerce DB** |
| **Stock Disponible** | La cantidad neta de producto que se puede mostrar en la tienda para la venta al cliente final. | **Calculado localmente** |

#### Fórmula de Disponibilidad
$$\text{Stock Disponible} = \text{Stock Físico} - \text{Stock Comprometido}$$

### 1.3. Alertas y Umbrales (Alerts & Thresholds)

Para mantener una operación proactiva, cada registro en la tabla `Stock` cuenta con un campo `minThreshold`.

- **Disparador**: Cuando el **Stock Disponible** cae por debajo o igual al `minThreshold` de un SKU en una bodega específica.
- **Flujo de Eventos**:
  1. El trigger de la transacción de base de datos o el servicio de inventario detecta la condición e inserta un evento de integración del tipo `LOW_STOCK_DETECTED` en la tabla `IntegrationEvent`.
  2. El microservicio `sap-service` consume este evento.
  3. **Acciones automatizadas**:
     - Envío de notificaciones (vía webhook) a canales de administración (Slack, Teams, o correo electrónico de compras) para reposición.
     - Invalidación de caché en el BFF de Next.js para actualizar la ficha de producto con una etiqueta de *"Últimas unidades disponibles"* o *"Sin Stock"*.

---

## 2. Lógica de Reserva (Reservation Logic)

La lógica de reserva asegura que un cliente que ha decidido comprar un producto realmente pueda completar su pago sin que otro usuario le arrebate el stock en el último segundo.

### 2.1. Trigger de la Reserva

Se evaluaron tres opciones de disparo para el bloqueo de inventario:

1. **Al agregar al carrito**: Descartado debido a que expone al sistema a "secuestro de inventario" (trolling o DOS), donde los usuarios bloquean stock sin intención real de compra, agotando la disponibilidad pública.
2. **Al confirmar el pago**: Descartado por el alto riesgo de sobreventa (overselling) bajo condiciones de alta concurrencia. Dos usuarios podrían pagar al mismo tiempo por la última unidad, obligando a realizar reembolsos y dañando la experiencia del cliente.
3. **Al iniciar el checkout (Intento de Pago)**: **Seleccionado**. El stock se congela en el momento en que el usuario ingresa al flujo de pago o genera un Payment Intent. Otorga al usuario un tiempo garantizado y acotado para digitar sus datos bancarios con seguridad.

### 2.2. Tiempo de Expiración (TTL)

- **Tiempo asignado**: **15 minutos** (configurable por entorno/categoría).
- **Mecanismo de Liberación**:
  - Al iniciar el checkout, se registra la fila en `StockReservation` con `expiresAt = now() + 15 minutos` y se suma la cantidad al `reservedStock` en `Stock`.
  - **Liberación Proactiva (Redis TTL)**: Se crea una clave temporal en Redis con expiración equivalente al TTL del checkout. Al expirar la clave, se activa una tarea de fondo (`release-expired-reservations.use-case.ts`) que marca la reserva en PostgreSQL como `isReleased: true` y decrementa el `reservedStock` en `Stock`.
  - **Liberación Reactiva (Fallback)**: Si Redis no está disponible, un cron job liviano corre cada 5 minutos en PostgreSQL liberando cualquier reserva donde `expiresAt < now()` que no esté confirmada ni liberada.

### 2.3. Manejo de Concurrencia (Race Conditions & Overselling)

Para evitar que dos solicitudes concurrentes reserven el mismo producto al mismo milisegundo, se utiliza el **Bloqueo Pesimista (Pessimistic Locking)** a nivel de fila mediante la sentencia SQL `SELECT FOR UPDATE` soportada nativamente en PostgreSQL.

#### Flujo de la Transacción en Prisma (Ejemplo Conceptual)
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Bloquear la fila de stock correspondiente con SELECT FOR UPDATE
  const [stock] = await tx.$queryRaw<Stock[]>`
    SELECT * FROM "Stock" 
    WHERE "variantId" = ${variantId} AND "warehouseId" = ${warehouseId} 
    FOR UPDATE
  `;

  if (!stock) {
    throw new Error("SKU no encontrado en la bodega especificada");
  }

  // 2. Calcular la disponibilidad real dentro de la transacción aislada
  const disponible = stock.physicalStock - stock.reservedStock;

  if (disponible < requestedQuantity) {
    throw new Error("Stock insuficiente para realizar la reserva");
  }

  // 3. Registrar la reserva temporal
  await tx.stockReservation.create({
    data: {
      variantId,
      warehouseId,
      quantity: requestedQuantity,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
      cartId
    }
  });

  // 4. Actualizar el stock comprometido
  await tx.stock.update({
    where: { id: stock.id },
    data: { reservedStock: stock.reservedStock + requestedQuantity }
  });
});
```

> [!TIP]
> **Optimización para Alta Demanda (Hot Sales)**: Antes de golpear la base de datos relacional y bloquear la fila, la aplicación puede realizar un chequeo previo ultrarrápido usando operaciones atómicas en Redis (`DECR` sobre la clave de disponibilidad de stock). Si Redis indica que no hay stock, la transacción de base de datos se aborta de inmediato, previniendo cuellos de botella en PostgreSQL.

---

## 3. Estrategia de Sincronización con SAP (SAP Sync Strategy)

### 3.1. Dirección del Flujo

La sincronización de inventario opera bajo un modelo **bidireccional segmentado por responsabilidad**:

- **SAP como Maestro del Stock Físico**: SAP ERP es el único origen de verdad para lo que existe físicamente en las bodegas. Los ajustes de stock físico siempre fluyen de **SAP $\rightarrow$ E-commerce**.
- **E-commerce como Maestro de Reservas y Transacciones**: El e-commerce gestiona localmente las reservas y los pedidos en curso. Los decrementos inmediatos causados por compras fluyen de **E-commerce $\rightarrow$ SAP** en forma de pedidos de venta.

### 3.2. Método y Frecuencia de Comunicación

Se adopta una **estrategia híbrida** para balancear el consumo de recursos de SAP y garantizar la actualización del inventario:

```txt
┌────────────────┐                     ┌──────────────────────┐
│    SAP ERP     │                     │     E-commerce       │
└───────┬────────┘                     └──────────┬───────────┘
        │                                         │
        │ Webhook: Cambio Crítico (Tiempo Real)    │
        ├────────────────────────────────────────>│ Actualiza Físico
        │                                         │
        │ Cron Sync: Reconciliación (30-60 min)   │
        ├────────────────────────────────────────>│ Corrige Desvíos
        │                                         │
        │                                         │
        │ <───────────────────────────────────────┤ Evento ORDER_CREATED
        │     Procesar Orden (Outbox Queue)       │
```

1. **Tiempo Real (Inbound Webhooks / RFC)**: Cuando en SAP se realiza un ajuste manual de stock significativo o un producto se queda sin existencias físicas a nivel global, SAP envía un webhook inmediato a la ruta `/api/webhooks/sap` del BFF para actualizar el `physicalStock` local de forma instantánea.
2. **Sincronización por Lotes (Scheduled Batch/Cron)**: Un cron job en `sap-service` corre cada 30 minutos (o 60 minutos en horarios de menor tráfico) para solicitar a SAP las actualizaciones de stock de todos los SKUs activos. Esto actúa como un mecanismo de reconciliación para corregir cualquier desvío de sincronización eventual.

### 3.3. Tolerancia a Fallos y Resiliencia (Fallbacks)

El e-commerce debe permanecer operativo y permitir transacciones de checkout incluso si la conexión a SAP se interrumpe temporalmente.

1. **Uso del Outbox Pattern**:
   Al completarse una venta localmente, la orden de compra y el evento de integración `ORDER_CREATED` se guardan en la misma transacción de base de datos en PostgreSQL. La transacción garantiza que si la orden se crea, el evento de sincronización existirá de forma segura.
2. **Cola de Reintentos con Backoff Exponencial**:
   El microservicio `sap-service` lee de manera asíncrona la tabla `IntegrationEvent`. Si SAP está en mantenimiento o la llamada a su API falla, el servicio:
   - Incrementa el contador de reintentos (`retries`).
   - Calcula el tiempo del próximo reintento usando una fórmula de exponencial backoff con aleatoriedad (jitter) (ej: 1, 5, 15, 30 y 60 minutos).
   - Deja el evento en estado `PENDING` para su posterior re-procesamiento.
3. **Dead Letter Queue (DLQ) y Alertas**:
   Si un evento falla de forma persistente tras alcanzar el límite máximo de reintentos (ej: 5 intentos), el evento cambia a estado `FAILED` y se traslada lógicamente a una cola DLQ. Esto dispara inmediatamente una alerta crítica en Sentry/Slack para su análisis y reenvío manual por parte del equipo de TI.
4. **Comportamiento en Caída Extendida**:
   Si SAP está offline por varias horas, los clientes pueden seguir comprando basándose en el último snapshot de stock físico guardado localmente en PostgreSQL y respetando las reservas activas en curso. Cuando SAP vuelva a estar disponible, la cola de eventos procesará las órdenes pendientes de forma secuencial y ordenada en el ERP.
