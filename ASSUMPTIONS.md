# Assumptions

## Logging
- A styled structured logger (`pino`) replaces standard stdout methods mimicking Serilog's structured JSON log outputs for robust runtime reporting.

## Authentication
- No real authentication system is implemented for the internal admin API. In production, all admin endpoints would be protected by JWT middleware with role-based access control.
- The partner API uses a single static API key (PARTNER_API_KEY from env). In production, each partner would have a unique key stored in the database.
- Socket.IO captain auth uses captainId in the handshake query param. In production, this would be a signed JWT token.
- Admin socket auth uses role=admin in the query param with no verification. In production, this would be a verified JWT with an admin role claim.

## Order Business Rules
- Delivered and cancelled orders cannot be reassigned or updated. This is treated as a hard terminal state. If reassignment of delivered orders is needed, a new order should be created instead.
- Orders in Assigned or PickedUp status cannot be deleted. The caller must unassign or cancel first.
- Order location (lat/lng) can only be updated if both lat and lng are provided together. Partial coordinate updates are rejected.

## Captain Business Rules
- Phone number updates are not supported after creation to keep the implementation simple. In production this would require verification.
- An inactive captain who is online cannot send location updates. Both active status AND online availability are not required for location updates — only active status is enforced (as per the task spec).

## Partner API
- externalReference is required for partner order creation and is used as the idempotency key. If the same externalReference is received twice, the existing order is returned with HTTP 200 instead of creating a duplicate.
- Rate limiting uses in-memory store (express-rate-limit default). Fallbacks utilize unauthenticated labels to guard aggressively avoiding IPv6 key extraction warnings securely. In production with multiple instances, a Redis store would be required.

## Report API
- The report only considers orders where captainId is not null (assigned orders only). Created/cancelled orders without a captain are excluded from the workload calculation.
- Periods must not overlap. The previousTo date must be before currentFrom.

## General
- Docker is not included to keep the submission within the time budget. A docker-compose.yml would be the natural next step.
- No audit logging is implemented (listed as optional/bonus in the task).
- No location history is stored — only the latest captain location is kept.
