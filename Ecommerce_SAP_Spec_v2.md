# Ecommerce Platform Specification v2.0

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

SAP (ECC or S/4HANA) will act as the primary ERP for:

- Product Master Data
- Inventory Management
- Billing
- Dispatch and Logistics
- Financial Operations

The ecommerce platform must remain fully decoupled from SAP through asynchronous event-driven integration.

---

# 2. High Level Architecture

```txt
Client
 ↓
Next.js Application (BFF)
 ↓
PostgreSQL
 ↓
Outbox Events
 ↓
RabbitMQ
 ↓
SAP Integration Service
 ↓
SAP ERP
```

---

# 3. Architectural Principles

## Frontend Isolation

The Next.js application MUST NEVER communicate directly with SAP APIs.

## Local Persistence First

All ecommerce operations must persist locally before synchronization.

## Event Driven Integration

All ERP synchronization occurs through events.

## Eventual Consistency

Temporary desynchronization between Ecommerce and SAP is acceptable.

| Domain | Source of Truth |
|----------|----------|
| Product Master | SAP |
| Inventory | SAP |
| Customer | Ecommerce + SAP |
| Orders | Ecommerce |
| Billing | SAP |
| Shipment | SAP |

---

# 4. Technology Stack

## Frontend

- Next.js App Router
- React Server Components
- Server Actions
- TypeScript

## Styling

- TailwindCSS

## Database

- PostgreSQL

## ORM

- Prisma ORM

## Cache

- Redis

## Message Broker

- RabbitMQ

## SAP Integration Service

- Node.js
- TypeScript

Responsibilities:

- Consume events
- Synchronize orders
- Synchronize inventory
- Synchronize pricing
- Synchronize customers
- Synchronize shipments
- Retry failed integrations

---

# 5. SAP Integration Strategy

## Supported SAP Systems

- SAP ECC
- SAP S/4HANA

## Supported Integration Methods

Priority:

1. OData APIs
2. REST APIs
3. SAP CPI
4. IDoc
5. RFC/BAPI

---

# 6. Non Functional Requirements

## Performance

- Product pages < 2 seconds
- Checkout API < 500 ms

## Scalability

- Horizontal scaling
- Stateless frontend
- Queue workers

## Reliability

- Retries
- Dead Letter Queues
- Idempotency
- Rollback-safe operations

## Security

- HTTPS
- Secure cookies
- CSRF protection
- Rate limiting
- Input validation
- RBAC

---

# 7. Database Modeling Rules

All entities must include:

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

Soft delete when applicable:

```prisma
deletedAt DateTime?
isActive Boolean @default(true)
```

---

# 8. Customer Domain

```prisma
enum CustomerType {
  B2C
  B2B
}

model Customer {
  id String @id @default(cuid())

  email String @unique

  firstName String
  lastName String

  phone String?

  customerType CustomerType

  sapCustomerCode String?

  companyId String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

# 9. Company Domain

```prisma
model Company {
  id String @id @default(cuid())

  name String

  taxId String @unique

  sapBusinessPartner String?

  paymentTerms String?

  creditLimit Decimal? @db.Decimal(12,2)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

# 10. Product Domain

Product must support:

- Categories
- Variants
- Images
- Attributes
- SEO Metadata
- SAP Material Codes

Additional fields:

```prisma
brand String?
seoTitle String?
seoDescription String?
attributes Json?
```

Product images:

```prisma
model ProductImage {
  id String @id @default(cuid())

  productId String

  url String

  alt String?

  sortOrder Int @default(0)

  createdAt DateTime @default(now())
}
```

---

# 11. Multi Warehouse Inventory

```prisma
model Warehouse {
  id String @id @default(cuid())

  code String @unique

  name String
}
```

```prisma
model WarehouseStock {
  id String @id @default(cuid())

  warehouseId String

  variantId String

  availableStock Int

  reservedStock Int

  incomingStock Int

  updatedAt DateTime @updatedAt
}
```

---

# 12. Orders

Order items must store historical values:

```prisma
priceAtPurchase Decimal
taxRateAtPurchase Decimal
discountAtPurchase Decimal
```

---

# 13. Payments

```prisma
enum PaymentStatus {
  PENDING
  AUTHORIZED
  CAPTURED
  FAILED
  REFUNDED
}
```

```prisma
model Payment {
  id String @id @default(cuid())

  orderId String

  gateway String

  gatewayTransactionId String?

  amount Decimal @db.Decimal(10,2)

  status PaymentStatus

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
---

# 14. Shipments

```prisma
enum ShipmentStatus {
  PENDING
  PROCESSING
  SHIPPED
  IN_TRANSIT
  DELIVERED
  FAILED
}
```
---

# 15. Outbox Pattern

```prisma
model OutboxEvent {
  id String @id @default(cuid())

  aggregateId String
  aggregateType String

  eventType String

  payload Json

  published Boolean @default(false)

  publishedAt DateTime?

  createdAt DateTime @default(now())
}
```

Rule:

Every SAP synchronization event MUST be written in the same transaction as the business entity.

---

# 16. Integration Events

```prisma
enum IntegrationEventType {
  ORDER_CREATED
  ORDER_PAID
  ORDER_CANCELLED

  PRODUCT_SYNC

  STOCK_SYNC

  PRICE_SYNC

  CUSTOMER_SYNC

  SHIPMENT_SYNC
}
```

---

# 17. SAP Synchronization Logs

```prisma
model SapSyncLog {
  id String @id @default(cuid())

  entityType String

  entityId String

  requestPayload Json

  responsePayload Json?

  success Boolean

  errorMessage String?

  createdAt DateTime @default(now())
}
```

---

# 18. Audit Log

```prisma
model AuditLog {
  id String @id @default(cuid())

  userId String?

  action String

  entityType String

  entityId String

  metadata Json?

  createdAt DateTime @default(now())
}
```

---

# 19. Inventory Strategy

SAP is the authoritative inventory source.

Synchronization methods:

- Scheduled Jobs
- Webhooks
- Manual Trigger

Overselling prevention:

- Transactions
- Row locking
- Optimistic concurrency
- Reservation timeout

Recommended reservation timeout:

- 15 minutes

---

# 20. Authentication

Recommended:

- Auth.js or BetterAuth
- JWT Sessions
- Refresh Tokens
- RBAC

Roles:

- ADMIN
- CUSTOMER
- B2B_CUSTOMER
- SALES_AGENT

---

# 21. SEO

- ISR
- Metadata generation
- OpenGraph
- Canonical URLs
- Sitemap.xml
- Robots.txt

---

# 22. Monitoring

Mandatory:

- OpenTelemetry
- Sentry
- Pino
- Queue monitoring
- Payment monitoring
- Checkout monitoring

---

# 23. Infrastructure

Frontend:
- Vercel Enterprise

Backend:
- AWS ECS Fargate

Database:
- AWS RDS PostgreSQL

Cache:
- ElastiCache Redis

Queue:
- Amazon MQ (RabbitMQ)

Storage:
- AWS S3

Monitoring:
- Grafana
- OpenTelemetry
- Sentry

---

# 24. Acceptance Criteria

- Ecommerce works if SAP is unavailable
- Orders are never lost
- ERP synchronization is idempotent
- Inventory updates are traceable
- Checkout remains responsive
- Failed integrations retry automatically

---

# 25. Future Extensions

- Multi-currency
- Promotions Engine
- Coupons
- Wishlist
- Marketplace Integrations
- Headless Storefronts
- ERP Replacement

---

# Final Architectural Recommendation

Mandatory principles:

- Event Driven Architecture
- Eventual Consistency
- Outbox Pattern
- Queue-Based Synchronization
- Decoupled ERP Integration
- Stateless Frontend
- Multi-Warehouse Ready
- B2B/B2C Ready
