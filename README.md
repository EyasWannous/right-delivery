# Delivery Operations Backend

## Tech Stack
- Node.js + TypeScript
- MongoDB (Mongoose)
- Express
- Socket.IO
- Zod (validation)
- tsyringe (DI)
- Jest (testing)
- Pino (structured logging)

## Architecture
Domain-Driven Design with the following layers:
- `domain/` — entities, value objects, repository interfaces, domain services
- `application/` — application services, DTOs
- `infrastructure/` — Mongoose models, repository implementations, DI container
- `interfaces/` — HTTP controllers, routes, middlewares, socket handlers

## Setup

### Prerequisites
- Node.js 20+
- MongoDB running locally or a connection string

### Steps
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy env file and fill in values:
   ```bash
   cp .env.example .env
   ```
4. Seed the database:
   ```bash
   npm run seed
   ```
5. Start in development mode:
   ```bash
   npm run dev
   ```
6. Run tests:
   ```bash
   npm test
   ```

## Environment Variables
See `.env.example` for all required variables:
- `PORT` HTTP server port (default: 3000)
- `MONGODB_URI` MongoDB connection string
- `PARTNER_API_KEY` Static API key for partner API access
- `JWT_SECRET` Reserved for future auth use

## API Overview

### Documentation
- **Swagger UI:** The full OpenAPI schema is served via Swagger UI at `/swagger/index.html` during runtime.
- **Postman:** A `postman_collection.json` resides in the project root to integrate easily mapping real-time WebSocket requests.

### Internal Admin API
- **Captain CRUD:** `/captains`
- **Order CRUD:** `/orders`
- **Assignment:** 
  - `POST /orders/:id/assign`
  - `DELETE /orders/:id/assign`
- **Order status:** `PATCH /orders/:id/status`
- **Cancel:** `PATCH /orders/:id/cancel`
- **Report:** `GET /reports/captains/order-volume-drop`

### Partner API
Requires header: `x-api-key: <PARTNER_API_KEY>`
Rate limited: 100 requests per 15 minutes per API key
- `POST /partner/orders` Create order (idempotent via externalReference)
- `GET /partner/orders/:ref` Get order by externalReference

### WebSocket
See `src/interfaces/socket/SOCKET_EVENTS.md` for full event documentation.
- Captain connects with: `?captainId=<id>`
- Admin connects with: `?role=admin`

## Running Tests
```bash
npm test
npm run test:coverage
```

## Seeding
```bash
npm run seed
```
