# Ecommerce Platform Specification

## SAP Integrated B2B/B2C Ecommerce

### Spec Driven Development (SDD)

---

# 1. Project Overview

## Context

Development of a custom B2B/B2C Ecommerce platform from scratch without using third-party ecommerce platforms such as Shopify or WooCommerce.

The platform will operate as:

- Ecommerce frontend
- Checkout and order capture system
- Product catalog
- Customer portal
- Integration layer with SAP ERP

SAP (S/4HANA or ECC) will act as the primary ERP for:

- Inventory management
- Billing
- Dispatch and logistics
- Financial operations
- Product synchronization

The ecommerce platform must remain decoupled from SAP through an asynchronous integration architecture.

---

# 2. High Level Architecture

```txt
Client
  ↓
Next.js Application (BFF)
  ↓
PostgreSQL Database
  ↓
Integration Events Queue
  ↓
Node.js SAP Integration Service
  ↓
SAP ERP
```

---

# 3. Architectural Principles

## Mandatory Rules

### Frontend Isolation

The Next.js application MUST NEVER communicate directly with SAP APIs.

---

### Local Persistence First

All ecommerce operations must first persist locally in PostgreSQL before synchronization with SAP.

This includes:

- carts
- orders
- payments
- inventory snapshots
- customers
- checkout data

---

### Event Driven Integration

SAP synchronization must be asynchronous using an event-driven architecture.

---

### Eventual Consistency

The system must tolerate temporary desynchronization between Ecommerce and SAP.

SAP is considered:

| Domain | Source of Truth |
|---|---|
| Inventory | SAP |
| Pricing | SAP or Ecommerce (configurable) |
| Orders | Ecommerce |
| Billing | SAP |
| Shipment Status | SAP |

---

# 4. Technology Stack

## Frontend / BFF

- Next.js (App Router)
- React Server Components (RSC)
- Server Actions
- TypeScript

---

## Styling

- TailwindCSS
- Reusable UI component architecture
- Pixel perfect responsive design

---

## Database

- PostgreSQL

---

## ORM

- Prisma ORM

---

## Cache Layer

- Redis

Used for:

- catalog caching
- inventory caching
- session caching
- rate limiting
- queue optimization

---

## SAP Integration Service

Separate microservice built in:

- Node.js
- TypeScript

Responsibilities:

- consume integration events
- synchronize orders
- synchronize stock
- synchronize prices
- retry failed integrations
- log ERP transactions

---

## Observability

Mandatory tools:

- Pino (logging)
- Sentry (error tracking)
- OpenTelemetry (distributed tracing)

---

# 5. Non Functional Requirements

## Performance

- Product pages < 2 seconds
- Checkout API < 500ms
- SAP sync asynchronous

---

## Scalability

Architecture must support:

- horizontal scaling
- stateless frontend
- queue workers
- cache invalidation

---

## Reliability

The system must support:

- retries
- dead letter queues
- idempotent operations
- rollback-safe operations

---

## Security

Mandatory:

- HTTPS
- secure cookies
- CSRF protection
- rate limiting
- input validation
- role-based access control

---

# 6. Database Modeling

## General Rules

All entities must include:

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

Soft delete required when applicable:

```prisma
deletedAt DateTime?
isActive Boolean @default(true)
```

---

# 7. Prisma Core Schema

## Category

```prisma
model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique

  products    Product[]

  isActive    Boolean   @default(true)
  deletedAt   DateTime?

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

---

## Product

```prisma
model Product {
  id            String      @id @default(cuid())

  name          String
  description   String?
  slug          String      @unique

  categoryId    String
  category      Category    @relation(fields: [categoryId], references: [id])

  variants      Variant[]

  isActive      Boolean     @default(true)
  deletedAt     DateTime?

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

---

## Variant

Each Variant represents a unique SKU mapped to SAP.

```prisma
model Variant {
  id                String      @id @default(cuid())

  productId         String
  product           Product     @relation(fields: [productId], references: [id])

  sku               String      @unique

  sapMaterialCode   String?

  size              String?
  color             String?

  barcode           String?

  price             Decimal     @db.Decimal(10,2)

  availableStock    Int         @default(0)
  reservedStock     Int         @default(0)
  incomingStock     Int         @default(0)

  weight            Decimal?    @db.Decimal(10,2)

  dimensions        Json?

  isActive          Boolean     @default(true)
  deletedAt         DateTime?

  orderItems        OrderItem[]
  cartItems         CartItem[]

  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}
```

---

# 8. Cart System

## Cart

```prisma
model Cart {
  id            String      @id @default(cuid())

  userId        String?

  items         CartItem[]

  expiresAt     DateTime?

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

---

## CartItem

```prisma
model CartItem {
  id            String      @id @default(cuid())

  cartId        String
  cart          Cart        @relation(fields: [cartId], references: [id])

  variantId     String
  variant       Variant     @relation(fields: [variantId], references: [id])

  quantity      Int

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

---

# 9. Orders

## Order Status Enum

```prisma
enum OrderStatus {
  DRAFT
  PENDING_PAYMENT
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

---

## Sync Status Enum

```prisma
enum SyncStatus {
  NOT_REQUIRED
  PENDING
  PROCESSING
  SUCCESS
  FAILED
}
```

---

## Order

```prisma
model Order {
  id                    String          @id @default(cuid())

  externalReference     String          @unique

  userId                String?

  customerName          String
  customerEmail         String
  customerPhone         String?

  billingAddress        Json
  shippingAddress       Json

  subtotal              Decimal         @db.Decimal(10,2)
  tax                   Decimal         @db.Decimal(10,2)
  shippingCost          Decimal         @db.Decimal(10,2)
  discount              Decimal         @db.Decimal(10,2)
  total                 Decimal         @db.Decimal(10,2)

  currency              String          @default("CLP")

  status                OrderStatus

  syncStatus            SyncStatus      @default(PENDING)

  sapOrderId            String?

  items                 OrderItem[]

  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt
}
```

---

## OrderItem

```prisma
model OrderItem {
  id                  String      @id @default(cuid())

  orderId             String
  order               Order       @relation(fields: [orderId], references: [id])

  variantId           String
  variant             Variant     @relation(fields: [variantId], references: [id])

  quantity            Int

  priceAtPurchase     Decimal     @db.Decimal(10,2)

  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
}
```

---

# 10. Integration Events

## Purpose

All SAP synchronization must happen through integration events.

---

## Event Types

```prisma
enum IntegrationEventType {
  ORDER_CREATED
  STOCK_SYNC
  PRICE_SYNC
}
```

---

## Integration Status

```prisma
enum IntegrationStatus {
  PENDING
  PROCESSING
  SUCCESS
  FAILED
}
```

---

## IntegrationEvent

```prisma
model IntegrationEvent {
  id              String                  @id @default(cuid())

  type            IntegrationEventType

  payload         Json

  status          IntegrationStatus      @default(PENDING)

  retries         Int                    @default(0)

  processedAt     DateTime?

  createdAt       DateTime               @default(now())
  updatedAt       DateTime               @updatedAt
}
```

---

# 11. Checkout Flow

```txt
Customer Checkout
  ↓
Create Order Locally
  ↓
Persist Order + OrderItems
  ↓
Create Integration Event
  ↓
Return Success to Customer
  ↓
Background SAP Synchronization
```

---

# 12. Inventory Strategy

## Inventory Ownership

SAP is the authoritative inventory source.

---

## Ecommerce Behavior

The ecommerce platform only:

- reads inventory
- reserves temporary stock
- displays availability

---

## Inventory Sync

Inventory synchronization must run:

- by scheduled jobs
- by webhook
- by manual trigger

---

# 13. Concurrency Rules

## Overselling Prevention

Mandatory:

- database transactions
- row locking
- optimistic concurrency
- stock reservation timeout

---

## Reservation Logic

Reserved inventory must expire automatically after configurable timeout.

Recommended:

- 15 minutes

---

# 14. SEO Strategy

Next.js implementation must include:

- ISR (Incremental Static Regeneration)
- metadata generation
- OpenGraph tags
- canonical URLs
- sitemap.xml
- robots.txt

---

# 15. Authentication

## Recommended Architecture

- Auth.js or BetterAuth
- JWT sessions
- refresh tokens
- role-based access

---

## Roles

```txt
ADMIN
CUSTOMER
B2B_CUSTOMER
SALES_AGENT
```

---

# 16. Payment Flow

```txt
Checkout
  ↓
Create Payment Intent
  ↓
Payment Gateway
  ↓
Webhook Confirmation
  ↓
Mark Order as Paid
  ↓
Create SAP Sync Event
```

---

# 17. Logging Requirements

Mandatory logging for:

- SAP requests
- SAP responses
- payment callbacks
- checkout failures
- stock sync failures

---

# 18. Monitoring

Mandatory monitoring:

- API latency
- failed syncs
- dead queues
- checkout errors
- payment failures

---

# 19. Recommended Project Structure

```txt
/specs
  /architecture
  /database
  /catalog
  /inventory
  /checkout
  /payments
  /shipping
  /sap-integration
  /auth
  /admin
  /observability
```

---

# 20. Acceptance Criteria

## Mandatory

- Ecommerce must function even if SAP is unavailable
- Orders must never be lost
- SAP sync retries must be automatic
- Inventory updates must be traceable
- Checkout must remain responsive
- ERP integration must be idempotent

---

# 21. Recommended Future Extensions

Future-ready support for:

- multi warehouse inventory
- multi currency
- multi tenant
- promotions engine
- coupons
- wishlist
- ERP replacement
- headless storefronts
- marketplace integrations

---

# 22. Recommended Infrastructure

## Hosting

Recommended:

- Vercel (Frontend)
- Railway / Render / AWS ECS (Services)
- PostgreSQL managed instance
- Redis managed instance

---

## CI/CD

Mandatory:

- GitHub Actions
- automated testing
- migration pipelines
- preview environments

---

# 23. Final Architectural Recommendation

The platform must follow:

## Event Driven Architecture

## Eventual Consistency

## Decoupled ERP Integration

## Queue Based Synchronization

## Stateless Frontend Architecture

This architecture is mandatory to ensure scalability, resiliency, maintainability, and long-term ERP interoperability.
