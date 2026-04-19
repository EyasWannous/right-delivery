# Tradeoffs

## DDD Complexity vs. Task Size
Applying full DDD (entities, value objects, domain services, application services, repository interfaces) to a task of this size adds more structure than strictly necessary. The benefit is a codebase that is safe to extend — adding new business rules, new fields, or new workflows does not require touching multiple unrelated layers. The cost is more files and more indirection than a simple CRUD service would need.

## Domain Services vs. Use Cases
The task uses Application Services instead of individual Use Case classes. This reduces the number of files while keeping the same layer separation. The tradeoff is that a single application service file grows larger over time compared to one-class-per-use-case. For a project of this size, the application service approach is more pragmatic.

## MongoDB vs. Relational DB
MongoDB was specified by the task. The main tradeoff relevant to this project is the report aggregation: the order-volume-drop report uses a multi-stage aggregation pipeline that runs entirely in MongoDB. This is efficient but couples the report logic tightly to MongoDB internals. With a relational DB, the same query would be a more portable SQL GROUP BY with CASE expressions.

## In-Memory Rate Limiting
The partner API uses express-rate-limit with the default in-memory store. This is simple and requires no extra infrastructure. The tradeoff is that rate limit counters reset on server restart and do not work correctly with multiple server instances. A Redis store would solve this at the cost of an additional dependency.

## Static API Key Auth for Partner API
A single static API key is simpler than per-partner key management but means all partners share the same key and rate limit. In production, each partner would have a unique key stored in the database, allowing individual revocation and separate rate limits.

## Idempotency via externalReference
Using externalReference as the idempotency key avoids needing a separate idempotency table or Redis cache. The tradeoff is that the key has no expiry — a partner cannot reuse an externalReference for a genuinely new order once one exists with that reference. In production, idempotency keys typically expire after 24-48 hours.

## No Real-Time Order Room
The socket implementation broadcasts location updates only to the admin room. The task mentioned an order room as an example. Implementing per-order rooms would allow customers or dispatchers to track a specific delivery in real time, but was skipped to stay within the time budget. The room structure (captain:{id}, admin) is already designed to be extended with order:{id} rooms.

## Tests Scope
Tests cover domain entities, value objects, and one critical application service flow (assignment). Integration tests against a real MongoDB instance were not included to keep the test suite fast and dependency-free. The domain layer is the highest-value testing target because it contains all business rules and has no external dependencies.
