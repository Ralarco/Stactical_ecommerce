# Ecommerce Platform — Folder Architecture

## Goal

Generate the complete folder architecture for the SAP-integrated B2B/B2C ecommerce platform defined in `spec.md`. The architecture must enforce: frontend isolation from SAP, local persistence first, event-driven integration, and eventual consistency.

---

## Monorepo Strategy

> [!IMPORTANT]
> **Turborepo** is recommended as the monorepo tool. It provides:
> - Incremental builds with caching
> - Parallel task execution
> - Dependency-aware task ordering
> - Native to the Node.js/TypeScript ecosystem

**Why monorepo?** The spec defines two distinct runtime targets (Next.js BFF + Node.js SAP service) that share types, validation schemas, and event contracts. A monorepo enforces type safety across boundaries at build time.

---

## Top-Level Folder Tree

```
web-stactical/
├── apps/
│   ├── web/                          # Next.js App Router (BFF + Storefront)
│   └── sap-service/                  # Node.js SAP Integration Microservice
├── packages/
│   ├── shared-types/                 # Shared TypeScript types & enums
│   ├── events/                       # Event contracts & schemas
│   ├── config/                       # Shared config (env validation, constants)
│   └── ui/                           # Shared UI primitives (optional)
├── prisma/
│   ├── schema.prisma                 # Single Prisma schema
│   ├── migrations/                   # Migration history
│   └── seed.ts                       # Database seeding
├── specs/                            # Spec Driven Development docs
│   ├── architecture/
│   ├── database/
│   ├── catalog/
│   ├── inventory/
│   ├── checkout/
│   ├── payments/
│   ├── shipping/
│   ├── sap-integration/
│   ├── auth/
│   ├── admin/
│   └── observability/
├── .env.example
├── .env.local                        # Local dev (git-ignored)
├── turbo.json
├── package.json
├── tsconfig.base.json
├── docker-compose.yml                # PostgreSQL + Redis for local dev
└── README.md
```

---

## `apps/web/` — Next.js Application (BFF + Storefront)

This is the core application. It uses **feature-based architecture** with clean separation between domain, application, infrastructure, and UI layers.

```
apps/web/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (storefront)/                 # Public storefront route group
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                  # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx              # Product listing (RSC)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx          # Product detail (RSC + ISR)
│   │   │   ├── categories/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   └── checkout/
│   │   │       ├── page.tsx
│   │   │       ├── success/page.tsx
│   │   │       └── failure/page.tsx
│   │   │
│   │   ├── (auth)/                       # Auth route group
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   │
│   │   ├── (account)/                    # Customer portal (protected)
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── addresses/page.tsx
│   │   │
│   │   ├── (admin)/                      # Admin panel (RBAC protected)
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── inventory/page.tsx
│   │   │   ├── customers/page.tsx
│   │   │   └── integrations/
│   │   │       ├── page.tsx              # SAP sync dashboard
│   │   │       └── events/page.tsx       # Event log viewer
│   │   │
│   │   ├── api/                          # API routes (webhooks only)
│   │   │   ├── webhooks/
│   │   │   │   ├── payment/route.ts      # Payment gateway callbacks
│   │   │   │   └── sap/route.ts          # SAP inbound webhooks
│   │   │   └── health/route.ts
│   │   │
│   │   ├── layout.tsx                    # Root layout
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   ├── sitemap.ts                    # Dynamic sitemap generation
│   │   └── robots.ts                     # robots.txt generation
│   │
│   ├── features/                         # Feature modules (DDD-inspired)
│   │   ├── catalog/
│   │   │   ├── domain/
│   │   │   │   ├── product.entity.ts
│   │   │   │   ├── variant.entity.ts
│   │   │   │   ├── category.entity.ts
│   │   │   │   └── product.repository.ts       # Interface
│   │   │   ├── application/
│   │   │   │   ├── get-products.use-case.ts
│   │   │   │   ├── get-product-by-slug.use-case.ts
│   │   │   │   └── search-products.use-case.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── prisma-product.repository.ts # Implementation
│   │   │   │   └── redis-catalog.cache.ts
│   │   │   ├── actions/
│   │   │   │   └── catalog.actions.ts           # Server Actions
│   │   │   └── components/
│   │   │       ├── ProductCard.tsx
│   │   │       ├── ProductGrid.tsx
│   │   │       ├── ProductDetail.tsx
│   │   │       ├── VariantSelector.tsx
│   │   │       └── CategoryNav.tsx
│   │   │
│   │   ├── cart/
│   │   │   ├── domain/
│   │   │   │   ├── cart.entity.ts
│   │   │   │   ├── cart-item.entity.ts
│   │   │   │   └── cart.repository.ts
│   │   │   ├── application/
│   │   │   │   ├── add-to-cart.use-case.ts
│   │   │   │   ├── update-cart-item.use-case.ts
│   │   │   │   ├── remove-from-cart.use-case.ts
│   │   │   │   └── get-cart.use-case.ts
│   │   │   ├── infrastructure/
│   │   │   │   └── prisma-cart.repository.ts
│   │   │   ├── actions/
│   │   │   │   └── cart.actions.ts
│   │   │   └── components/
│   │   │       ├── CartDrawer.tsx
│   │   │       ├── CartItem.tsx
│   │   │       ├── CartSummary.tsx
│   │   │       └── CartProvider.tsx             # Client component
│   │   │
│   │   ├── checkout/
│   │   │   ├── domain/
│   │   │   │   ├── checkout.entity.ts
│   │   │   │   └── checkout.repository.ts
│   │   │   ├── application/
│   │   │   │   ├── create-order.use-case.ts
│   │   │   │   ├── validate-checkout.use-case.ts
│   │   │   │   └── reserve-stock.use-case.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── prisma-checkout.repository.ts
│   │   │   │   └── stock-reservation.service.ts
│   │   │   ├── actions/
│   │   │   │   └── checkout.actions.ts
│   │   │   └── components/
│   │   │       ├── CheckoutForm.tsx
│   │   │       ├── AddressForm.tsx
│   │   │       ├── OrderSummary.tsx
│   │   │       └── PaymentForm.tsx
│   │   │
│   │   ├── orders/
│   │   │   ├── domain/
│   │   │   │   ├── order.entity.ts
│   │   │   │   ├── order-item.entity.ts
│   │   │   │   └── order.repository.ts
│   │   │   ├── application/
│   │   │   │   ├── get-orders.use-case.ts
│   │   │   │   ├── get-order-detail.use-case.ts
│   │   │   │   └── cancel-order.use-case.ts
│   │   │   ├── infrastructure/
│   │   │   │   └── prisma-order.repository.ts
│   │   │   ├── actions/
│   │   │   │   └── order.actions.ts
│   │   │   └── components/
│   │   │       ├── OrderList.tsx
│   │   │       ├── OrderDetail.tsx
│   │   │       └── OrderStatusBadge.tsx
│   │   │
│   │   ├── inventory/
│   │   │   ├── domain/
│   │   │   │   ├── stock.entity.ts
│   │   │   │   └── stock.repository.ts
│   │   │   ├── application/
│   │   │   │   ├── check-availability.use-case.ts
│   │   │   │   └── release-expired-reservations.use-case.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── prisma-stock.repository.ts
│   │   │   │   └── redis-stock.cache.ts
│   │   │   └── actions/
│   │   │       └── inventory.actions.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── domain/
│   │   │   │   ├── payment.entity.ts
│   │   │   │   └── payment.repository.ts
│   │   │   ├── application/
│   │   │   │   ├── create-payment-intent.use-case.ts
│   │   │   │   └── process-payment-webhook.use-case.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── payment-gateway.adapter.ts
│   │   │   │   └── prisma-payment.repository.ts
│   │   │   └── actions/
│   │   │       └── payment.actions.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── domain/
│   │   │   │   ├── user.entity.ts
│   │   │   │   └── auth.repository.ts
│   │   │   ├── application/
│   │   │   │   ├── login.use-case.ts
│   │   │   │   ├── register.use-case.ts
│   │   │   │   └── verify-session.use-case.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── auth.config.ts             # Auth.js / BetterAuth config
│   │   │   │   └── prisma-user.repository.ts
│   │   │   ├── actions/
│   │   │   │   └── auth.actions.ts
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── AuthGuard.tsx
│   │   │   └── middleware.ts                  # Auth middleware logic
│   │   │
│   │   └── integration/
│   │       ├── domain/
│   │       │   ├── integration-event.entity.ts
│   │       │   └── integration-event.repository.ts
│   │       ├── application/
│   │       │   ├── emit-event.use-case.ts
│   │       │   ├── retry-failed-events.use-case.ts
│   │       │   └── get-sync-status.use-case.ts
│   │       └── infrastructure/
│   │           └── prisma-integration-event.repository.ts
│   │
│   ├── lib/                              # Shared infrastructure
│   │   ├── db/
│   │   │   └── prisma.ts                 # Prisma client singleton
│   │   ├── redis/
│   │   │   └── client.ts                 # Redis client singleton
│   │   ├── logger/
│   │   │   └── index.ts                  # Pino logger config
│   │   ├── monitoring/
│   │   │   ├── sentry.ts                 # Sentry init
│   │   │   └── tracing.ts               # OpenTelemetry setup
│   │   ├── errors/
│   │   │   ├── app-error.ts              # Custom error classes
│   │   │   └── error-handler.ts
│   │   ├── validation/
│   │   │   └── schemas.ts                # Zod shared schemas
│   │   └── utils/
│   │       ├── money.ts                  # Decimal helpers
│   │       ├── slug.ts
│   │       └── id.ts                     # ID generation (cuid)
│   │
│   ├── components/                       # Global shared UI
│   │   ├── ui/                           # Primitives (Button, Input, etc.)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   └── shared/
│   │       ├── Breadcrumbs.tsx
│   │       ├── Pagination.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── hooks/                            # Client-side hooks
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   └── useDebounce.ts
│   │
│   ├── styles/
│   │   └── globals.css                   # Tailwind base + custom tokens
│   │
│   ├── middleware.ts                      # Next.js root middleware
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
```

---

## `apps/sap-service/` — SAP Integration Microservice

> [!IMPORTANT]
> This is a **completely separate Node.js service**. The Next.js app NEVER calls SAP directly. This service consumes integration events from PostgreSQL and synchronizes with SAP.

```
apps/sap-service/
├── src/
│   ├── consumers/                        # Event consumers
│   │   ├── order-sync.consumer.ts
│   │   ├── stock-sync.consumer.ts
│   │   └── price-sync.consumer.ts
│   │
│   ├── adapters/                         # SAP API adapters
│   │   ├── sap-client.ts                 # HTTP/RFC client for SAP
│   │   ├── sap-order.adapter.ts
│   │   ├── sap-stock.adapter.ts
│   │   └── sap-price.adapter.ts
│   │
│   ├── mappers/                          # Data transformation
│   │   ├── order-to-sap.mapper.ts
│   │   ├── sap-stock-to-local.mapper.ts
│   │   └── sap-price-to-local.mapper.ts
│   │
│   ├── jobs/                             # Scheduled jobs
│   │   ├── poll-events.job.ts            # Poll IntegrationEvent table
│   │   ├── stock-sync.job.ts             # Scheduled inventory sync
│   │   ├── retry-failed.job.ts           # Retry failed events
│   │   └── scheduler.ts                  # Job orchestrator (node-cron)
│   │
│   ├── queue/                            # Queue management
│   │   ├── event-queue.ts
│   │   └── dead-letter.handler.ts
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   └── prisma.ts
│   │   ├── redis/
│   │   │   └── client.ts
│   │   ├── logger/
│   │   │   └── index.ts                  # Pino logger
│   │   ├── monitoring/
│   │   │   ├── sentry.ts
│   │   │   └── tracing.ts
│   │   └── errors/
│   │       └── sap-error.ts
│   │
│   ├── config/
│   │   ├── env.ts                        # Env validation (zod)
│   │   └── sap.config.ts                 # SAP connection config
│   │
│   ├── index.ts                          # Entry point
│   ├── tsconfig.json
│   └── package.json
```

---

## `packages/` — Shared Packages

### `packages/shared-types/`

```
packages/shared-types/
├── src/
│   ├── models/
│   │   ├── product.types.ts
│   │   ├── order.types.ts
│   │   ├── cart.types.ts
│   │   ├── user.types.ts
│   │   └── payment.types.ts
│   ├── enums/
│   │   ├── order-status.enum.ts          # Mirrors Prisma enums
│   │   ├── sync-status.enum.ts
│   │   ├── integration-event-type.enum.ts
│   │   ├── integration-status.enum.ts
│   │   └── user-role.enum.ts
│   ├── dto/                              # Data Transfer Objects
│   │   ├── create-order.dto.ts
│   │   ├── checkout.dto.ts
│   │   └── stock-update.dto.ts
│   └── index.ts                          # Barrel export
├── tsconfig.json
└── package.json
```

### `packages/events/`

```
packages/events/
├── src/
│   ├── schemas/
│   │   ├── order-created.schema.ts       # Zod schema for event payload
│   │   ├── stock-sync.schema.ts
│   │   └── price-sync.schema.ts
│   ├── types/
│   │   └── integration-event.types.ts
│   └── index.ts
├── tsconfig.json
└── package.json
```

### `packages/config/`

```
packages/config/
├── src/
│   ├── env.ts                            # Shared env validation with Zod
│   ├── constants.ts                      # Business constants
│   └── index.ts
├── tsconfig.json
└── package.json
```

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files (general) | `kebab-case` | `create-order.use-case.ts` |
| React components | `PascalCase` | `ProductCard.tsx` |
| Server Actions | `kebab-case` | `catalog.actions.ts` |
| Domain entities | `kebab-case` + `.entity.ts` | `order.entity.ts` |
| Repositories (interface) | `kebab-case` + `.repository.ts` | `order.repository.ts` |
| Repositories (impl) | `prisma-` prefix | `prisma-order.repository.ts` |
| Use cases | `verb-noun` + `.use-case.ts` | `create-order.use-case.ts` |
| Cache services | suffix `.cache.ts` | `redis-catalog.cache.ts` |
| Adapters | suffix `.adapter.ts` | `sap-order.adapter.ts` |
| Mappers | suffix `.mapper.ts` | `order-to-sap.mapper.ts` |
| Enums | suffix `.enum.ts` | `order-status.enum.ts` |
| DTOs | suffix `.dto.ts` | `create-order.dto.ts` |
| Zod schemas | suffix `.schema.ts` | `order-created.schema.ts` |
| Config | suffix `.config.ts` | `sap.config.ts` |
| Types/interfaces | `I` prefix for interfaces | `IProductRepository` |
| Env variables | `SCREAMING_SNAKE_CASE` | `DATABASE_URL` |

---

## Server / Client Boundaries

> [!IMPORTANT]
> Default to React Server Components. Mark `'use client'` only when necessary.

| Layer | Server/Client | Rationale |
|---|---|---|
| `app/**/page.tsx` | **Server** (RSC) | Data fetching, SEO, ISR |
| `app/**/layout.tsx` | **Server** | Static shell, metadata |
| `features/**/actions/` | **Server** | Server Actions for mutations |
| `features/**/application/` | **Server** | Business logic, DB access |
| `features/**/infrastructure/` | **Server** | Prisma, Redis, adapters |
| `features/**/domain/` | **Shared** | Pure types, no runtime deps |
| `features/**/components/` | **Mixed** | RSC by default; forms/interactivity → `'use client'` |
| `components/ui/` | **Client** | Interactive primitives |
| `components/layout/` | **Server** | Static layout shells |
| `hooks/` | **Client** | React hooks are client-only |
| `lib/` | **Server** | Infrastructure (DB, Redis, logging) |

### Client Component Candidates

These require `'use client'`:
- `CartDrawer.tsx` — interactive drawer
- `CartProvider.tsx` — React context
- `VariantSelector.tsx` — interactive state
- `CheckoutForm.tsx` — form with validation
- `PaymentForm.tsx` — payment gateway widget
- `LoginForm.tsx` / `RegisterForm.tsx` — form state
- `MobileNav.tsx` — hamburger menu state

---

## Environment Variable Strategy

### Structure

```bash
# ─── Database ───
DATABASE_URL=                    # PostgreSQL connection string
DATABASE_POOL_SIZE=              # Connection pool size

# ─── Redis ───
REDIS_URL=                       # Redis connection string

# ─── Auth ───
AUTH_SECRET=                     # Auth.js / BetterAuth secret
AUTH_URL=                        # Callback URL

# ─── Payment Gateway ───
PAYMENT_GATEWAY_SECRET_KEY=
PAYMENT_GATEWAY_PUBLIC_KEY=
PAYMENT_WEBHOOK_SECRET=

# ─── SAP (sap-service only) ───
SAP_BASE_URL=
SAP_CLIENT_ID=
SAP_CLIENT_SECRET=
SAP_API_KEY=

# ─── Observability ───
SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=

# ─── App ───
NEXT_PUBLIC_APP_URL=             # Public-facing URL
NODE_ENV=                        # development | staging | production
```

### Rules

1. **Never prefix SAP vars with `NEXT_PUBLIC_`** — SAP credentials must never reach the client
2. **Validate all env vars at startup** using Zod (`packages/config/src/env.ts`)
3. Use `.env.local` for local dev (git-ignored)
4. Use platform-level env injection for staging/production (Vercel, Railway)
5. `NEXT_PUBLIC_*` prefix only for values safe for browser exposure

---

## Scalability Considerations

| Concern | Strategy |
|---|---|
| **Horizontal scaling** | Stateless Next.js (no in-memory state). Session via JWT + Redis. |
| **Database connections** | Prisma connection pooling. PgBouncer for production. |
| **Cache invalidation** | Redis TTL-based + event-driven invalidation on stock/price sync. |
| **SAP sync throughput** | Multiple sap-service workers polling events. Configurable concurrency. |
| **Queue resilience** | Dead letter handling. Exponential backoff retries. Max retry limit. |
| **Multi-warehouse** | `Variant.availableStock` can evolve to `WarehouseStock[]` join table. |
| **Multi-currency** | `Order.currency` already present. Add `ExchangeRate` entity later. |
| **Multi-tenant** | Add `tenantId` column + RLS policies when needed. |
| **CDN / ISR** | Product pages use ISR with configurable revalidation. Static assets via CDN. |
| **Feature flags** | Add `packages/feature-flags/` when needed for progressive rollout. |

---

## Key Architectural Decisions

### 1. Feature-based modules over layer-based

Each feature (catalog, cart, checkout, orders) is self-contained with its own domain → application → infrastructure → UI stack. This prevents cross-feature coupling and enables team parallelism.

### 2. Repository pattern with interfaces

Domain layer defines repository **interfaces**. Infrastructure provides **implementations** (Prisma). This allows swapping data sources without touching business logic.

### 3. Use cases as application layer

Each business operation is a discrete use case class/function. This keeps Server Actions thin — they validate input, call a use case, and return results.

### 4. SAP service polls events (not push)

The SAP service polls `IntegrationEvent` rows from PostgreSQL. This avoids the need for a message broker (RabbitMQ/Kafka) initially while preserving the event-driven pattern. Can migrate to a broker later without changing the Next.js app.

### 5. Prisma schema at monorepo root

Single schema shared by both apps. Both generate clients from the same source of truth. Migrations are managed centrally.

---

## Open Questions

> [!IMPORTANT]
> **Auth provider**: The spec recommends Auth.js or BetterAuth. Which do you prefer? This affects the `auth` feature module structure.

> [!IMPORTANT]
> **Payment gateway**: The spec references a generic payment gateway. Do you have a specific provider (Stripe, Transbank/Webpay for Chile, MercadoPago)? This affects the `payments` adapter implementation.

> [!IMPORTANT]
> **Message broker**: The current design uses PostgreSQL polling for events (simpler). Do you want to introduce Redis Streams or BullMQ from day one for higher throughput?

> [!WARNING]
> **B2B features**: The spec mentions `B2B_CUSTOMER` and `SALES_AGENT` roles but doesn't detail B2B-specific features (custom pricing, quote requests, approval workflows). Should these be scoped into the initial architecture or deferred?

---

## Verification Plan

### Automated
- `turbo build` — full monorepo build with TypeScript strict mode
- `prisma validate` — schema validation
- `prisma generate` — client generation across apps
- Lint with ESLint strict config

### Manual
- Review folder tree against spec sections 1–23
- Verify no SAP imports exist in `apps/web/`
- Verify all monetary fields use `Decimal`
- Confirm event contracts in `packages/events/` match `IntegrationEventType` enum
