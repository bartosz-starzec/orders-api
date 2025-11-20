
# Interview Task API

RESTful API for managing Users, Organizations, and Orders. Built with Node.js, TypeScript, NestJS, MySQL, and Docker.

---

## Features

- CRUD endpoints for Users, Organizations, Orders
- Pagination, validation, DTO mapping
- Special endpoint: `GET /api/orders/{id}` returns order with user and organization
- Swagger/OpenAPI docs at `/swagger`
- Health checks: `/health` (liveness), `/readiness` (readiness)
- Global exception filter (unified JSON errors)
- Logging (DB changes: info, HTTP headers: debug)
- Unit tests for business logic
- Dockerized (app + MySQL)
- Seed script for demo data

---

## Getting Started

### 1. Local Development

```bash
# Install dependencies
pnpm install

# Start MySQL (if not using Docker)
# Update .env.example for your local DB config

# Run the app (dev mode)
pnpm run start:dev

# Run the app (prod mode)
pnpm run start:prod
```

### 2. Run with Docker

```bash
# Build and start all services (app + db)
docker-compose up --build

# The app will be available at http://localhost:3000
# MySQL at localhost:3309
```

### 3. Seed the Database

```bash
# Run the seed script (inside the container or locally)
pnpm tsx src/database/seed/seed.ts
```

---

## API Documentation

- Swagger UI: [http://localhost:3000/swagger](http://localhost:3000/swagger)
- All endpoints and schemas are documented.

---

## Health Checks

- Liveness: `GET /health`
- Readiness: `GET /readiness` (checks DB connection)

---

## Running Tests

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

---

## Design Decisions

- **NestJS**: Modular, scalable, and supports dependency injection.
- **TypeORM**: For DB access and migrations.
- **Zod**: For DTO validation (strict, readable schemas).
- **DTOs & Mappers**: Domain entities are never exposed directly.
- **Logging**: Winston logger for DB changes, custom interceptor for HTTP headers.
- **Exception Filter**: Global, unified JSON error responses.
- **Testing**: Jest, strict mocks, business logic covered.
- **Docker**: One-command setup for app + DB.

---

## How to Change Configuration

- Copy `.env.example` to `.env` and adjust as needed.
- All secrets and DB credentials are loaded from env vars.

---

## License

MIT
