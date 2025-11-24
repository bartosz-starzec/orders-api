# Server-node Exercise API

RESTful API for managing Users, Organizations, and Orders.
Tech stack: Node.js, TypeScript, NestJS, MySQL (TypeORM), Swagger, Docker.


---

## Quick start (Docker) – step by step

Prerequisites:
- Docker Desktop (with docker compose)
- curl (optional), jq (optional)

1) Create a local docker-compose override (ensures consistent env and avoids bind-mount issues)

This override:
- disables mounting the host directory into the app container (prevents node_modules from being shadowed)
- sets DB variables expected by the app
- provides a JWT secret for auth

2) Build and start containers

```
docker compose down -v
docker compose build --no-cache
docker compose up -d
docker compose ps
```

3) Run migrations

```
docker compose exec app pnpm run migration:run
```

4) Seed initial data (2 orgs, 10 users, 20 orders)

```
docker compose exec app pnpm run seed
```

5) Health checks

```
curl -s http://localhost:3005/health | jq
curl -s http://localhost:3005/readiness | jq
```

6) Get a JWT token (login with a seeded user, e.g. user1@example.com)

```
ACCESS_TOKEN=$(curl -s -X POST http://localhost:3005/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user1@example.com"}' | jq -r .access_token)
echo "$ACCESS_TOKEN"
```

7) Call the API (authorized)

- List users (paginated)

```
curl -s "http://localhost:3005/api/users?page=1&limit=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq
```

- List organizations

```
curl -s "http://localhost:3005/api/organizations" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq
```

- List orders

```
curl -s "http://localhost:3005/api/orders" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq
```

8) Swagger (OpenAPI)

- URL: http://localhost:3005/swagger
- If protected, click "Authorize" and paste the token (without "Bearer" prefix).

9) Run unit tests (inside container)

```
docker compose exec app pnpm test
```

10) Stop and clean up

```
docker compose down -v
```

---

## Local development (optional, without Docker)

Prerequisites:
- Node.js 20+
- pnpm 8.x
- MySQL 8
- A running database and a configured .env

1) Install dependencies

```
pnpm install
```

2) Configure environment

- Create a .env file based on .env.example
- Ensure the following variables exist and match your DB:
  - DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
  - JWT_SECRET

3) Run migrations and seed

```
pnpm run migration:run
pnpm run seed
```

4) Start the app

```
pnpm run start:dev
# or
pnpm run build && pnpm start
```

---

## Migrations (TypeORM CLI)

- Run migrations:
```
pnpm run migration:run
```

- Revert last migration:
```
pnpm run migration:revert
```

- Generate a new migration (example):
```
pnpm run migration:generate src/database/migrations/AddSomething
```

Note: The CLI uses data-source.ts located at the project root.

---

## Endpoints – overview

- Users
  - GET /api/users (paginated)
  - GET /api/users/{id}
  - POST /api/users
  - PUT /api/users/{id}
  - DELETE /api/users/{id}

- Organizations
  - GET /api/organizations (paginated)
  - GET /api/organizations/{id}
  - POST /api/organizations
  - PUT /api/organizations/{id}
  - DELETE /api/organizations/{id}

- Orders
  - GET /api/orders (paginated)
  - GET /api/orders/{id}  ← returns order with embedded user and organization
  - POST /api/orders
  - PUT /api/orders/{id}
  - DELETE /api/orders/{id}

- Health
  - GET /health
  - GET /readiness

- Auth
  - POST /api/auth/login (body: { "email": "user1@example.com" })

- Swagger
  - GET /swagger

---

## Notes on design decisions

- NestJS for modular structure, DI, filters/guards/interceptors, and out-of-the-box Swagger/testing ergonomics.
- TypeORM (with repositories and migrations) for clean separation and strong TS typing.
- DTOs + mappers: domain entities are not exposed directly.
- Validation via Zod schemas (with a custom validation pipe).
- Logging: Winston (DB changes at info), header logging at debug.
- Cache: in-memory LRU for GET responses (10 min TTL).
- Health checks: liveness + readiness (DB + cache).
- Tests: unit tests for services.
