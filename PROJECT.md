# Apna Dukaan — Local Neighborhood Shop Discovery Platform

> Product Requirements Document (PRD) + High-Level Design (HLD)

**Version:** 1.0
**Objective:** Build a hyperlocal directory that helps customers discover nearby neighborhood shops and view recent updates posted by shop owners. Initial rollout focuses on one locality at a time with manual onboarding.

---

## Table of Contents

- [Part A — Product Requirements Document (PRD)](#part-a--product-requirements-document-prd)
- [Part B — High-Level Design (HLD)](#part-b--high-level-design-hld)
- [Part C — Open Questions & Decisions Needed](#part-c--open-questions--decisions-needed)

---

# Part A — Product Requirements Document (PRD)

## 1. Vision

Create the most trusted digital directory for local offline businesses by making small neighborhood shops searchable, discoverable, and easy to contact.

## 2. Goals

- Launch in a single locality with 20–50 shops.
- Allow customers to search by category and locality.
- Provide an SEO-friendly page for every shop.
- Allow administrators to onboard shops manually.
- Defer owner self-service, payments, and inventory management.

## 3. Target Users

- Customers
- Shop Owners (Phase 2)
- Platform Administrator

## 4. Scope (MVP)

Public directory, shop detail pages, category/locality filters, admin panel, image upload, basic search.

## 5. Out of Scope

Payments, reviews, structured inventory, WhatsApp automation, geo-radius search, owner dashboard.

## 6. Functional Requirements

### Public

- Homepage with locality selector and categories.
- Shop listing by category/locality.
- Shop details including photos, contact, WhatsApp, timings, today's updates.
- Basic keyword search.

### Admin

- Login.
- CRUD for shops, categories, localities.
- Upload photos.
- Mark verified/featured.
- Create/update stock updates.

### Owner (Future)

- OTP login.
- Publish updates.
- Analytics.

## 7. Data Model

| Entity | Fields |
| --- | --- |
| Category | `id`, `name`, `slug` |
| Locality | `id`, `name`, `pincode`, `city` |
| Shop | `id`, `name`, `category_id`, `locality_id`, `address`, `lat`, `lng`, `phone`, `whatsapp`, `hours`, `description`, `verified`, `is_featured` |
| ShopPhoto | `id`, `shop_id`, `url` |
| StockUpdate | `id`, `shop_id`, `text`, `image_url`, `created_at`, `expires_at` |
| Owner | `id`, `phone`, `shop_id` |
| Admin | `id`, `name`, `email`, `password_hash` |

## 8. Non-functional Requirements

- Mobile-first.
- < 2s page load target.
- SEO-optimized SSR pages.
- Responsive.
- Secure image uploads.
- Versioned APIs.

## 9. Backend Architecture (Overview)

- **Database:** PostgreSQL
- **Storage:** S3-compatible bucket
- **API:**
  - `GET /shops`
  - `GET /shops/{id}`
  - `GET /categories`
  - `GET /localities`
  - `POST` / `PUT` / `DELETE` admin endpoints
- **Future:** OTP auth and WhatsApp webhook

## 10. Frontend

**Public**

- Homepage
- Listing
- Shop Details

**Admin**

- Dashboard
- Shop Management
- Category & Locality Management

**Future**

- Owner Dashboard

## 11. Milestones

### Phase 1

- Database
- Admin APIs
- Admin Panel
- Onboard 10 shops

### Phase 2

- Public website
- Search
- SEO
- Deploy

### Phase 3

- 50 shops
- OTP
- Owner dashboard

### Phase 4

- WhatsApp
- Premium listings

## 12. Success Metrics

- 50 live shops
- 500 monthly visitors
- 30% repeat visitors
- < 2s load time
- 90% successful searches

## 13. Risks

Low adoption, stale data, manual onboarding effort, SEO ramp-up.

## 14. Future Roadmap

Payments, featured listings, reviews, geo-search, structured inventory, analytics, WhatsApp integration.

---

# Part B — High-Level Design (HLD)

**Hyperlocal Shop Discovery Platform — Version 1.0**

## 1. Objectives

Build a scalable, SEO-first platform for discovering neighborhood shops, starting with manual onboarding and evolving into owner-managed updates.

## 2. High-Level Architecture

```
                    Clients
                       │
    ┌──────────────────┼───────────────────┐
    │                  │                    │
Public Web        Admin Panel         Owner Portal
 (Next.js)         (Next.js)           (Phase 2)
    └──────────────────┼───────────────────┘
                       │
                       ▼
          API Gateway / Backend
          (Node.js + Express)
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   PostgreSQL   Object Storage   Cache (Redis)
                    (S3)           (future)
        │
        ▼
  Search & Filtering
```

## 3. Components

- **Public Web:** Homepage, Listing, Shop Detail, Search
- **Admin Portal:** CRUD shops, categories, localities, photos, updates
- **Owner Portal (future):** OTP login, create updates
- **Backend API:** REST APIs, validation, business logic
- **Database:** PostgreSQL
- **Object Storage:** S3-compatible bucket
- **CDN:** Cloudflare
- **Analytics:** GA4 / Plausible (future)

## 4. Module Breakdown

### Shop Service

- Shop CRUD
- Featured shops
- Verification
- Search filters

### Category Service

- Category APIs

### Locality Service

- Locality APIs
- Pincode mapping

### Stock Update Service

- Free-form updates
- Image upload
- Expiry

### Media Service

- Upload
- Resize (future)
- Signed URLs

### Authentication (Phase 2)

- OTP
- JWT
- Owner sessions

## 5. Data Flow

- **Create shop:** Admin → Create Shop → PostgreSQL
- **Search:** Customer → Search → Backend → PostgreSQL → Shop List
- **Shop page:** Customer → Shop Page → Backend → Shop + Photos + Updates
- **Post update (future):** Owner → OTP → Post Update → Database → Public Page

## 6. API Layer

```
GET    /shops
GET    /shops/{id}
GET    /categories
GET    /localities
GET    /shops?category=&locality=
POST   /admin/shops
PUT    /admin/shops/{id}
DELETE /admin/shops/{id}
POST   /admin/updates
```

## 7. Database Overview

**Entities:** Shop, Category, Locality, ShopPhoto, StockUpdate, Owner, Admin.

**Relationships:**

- Category `1─N` Shop
- Locality `1─N` Shop
- Shop `1─N` Photos
- Shop `1─N` Updates
- Owner `1─1` Shop

## 8. Deployment

- **Frontend:** Vercel
- **Backend:** Railway / Render / Fly.io
- **Database:** Supabase PostgreSQL
- **Storage:** S3
- **CDN:** Cloudflare
- **CI/CD:** GitHub Actions

## 9. Security

- HTTPS only
- JWT for admin/owner
- Role-based authorization
- Input validation
- Rate limiting
- Image type validation

## 10. Scalability

- Stateless backend
- CDN for images
- Database indexes
- Redis cache (future)
- Horizontal API scaling
- Search service (Meilisearch / Elastic) when needed

## 11. Future Architecture

- WhatsApp webhook
- Payments
- Premium listings
- Geo-radius search
- Recommendation engine
- Notifications

---

# Part C — Open Questions & Decisions Needed

> Gaps identified during documentation review. These need decisions before/while building — they are **not** yet specified above.

1. **Admin auth flow (MVP).** The admin panel requires login and §9 mentions "JWT for admin," but the session model, token lifetime, and password-reset flow are undefined. The first thing being built currently has the least-specified auth.
2. **API contracts.** Endpoints are listed by path only — no request/response schemas, status codes, pagination, or error format. "Versioned APIs" is required but no versioning scheme (e.g. `/v1/`) is defined.
3. **StockUpdate expiry semantics.** Define what "today's updates" means and how `expires_at` is enforced (query-time filter vs. scheduled job).
4. **`Shop.hours` format.** Currently a single freeform field — decide on a structured schedule format if per-day timings are needed.
5. **Audit columns.** Most entities lack `created_at` / `updated_at`. Decide whether to add them universally.
6. **`ShopPhoto` ordering.** No primary-photo or display-order concept — needed for consistent listing thumbnails.
7. **Image upload flow.** "Secure image uploads" is required but the flow is undesigned: direct-to-S3 vs. proxied, size limits, content-type validation, signed-URL issuance.
8. **Metric alignment.** §2 (Goals) targets "20–50 shops"; §12 (Success Metrics) targets "50 live shops." Align the numbers.
