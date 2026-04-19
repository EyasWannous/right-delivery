# Socket.IO Events and Payloads

## Authentication

### Captain
Connect with query param: `?captainId=<id>`
Server validates the captain exists and is active before accepting the connection.

### Admin
Connect with query param: `?role=admin`
Server automatically joins the socket to the `admin` room.

## Events

### Client → Server

#### `'location:update'`
*   **Sent by:** captain
*   **Payload:** `{ lat: number, lng: number }`
*   **Description:** Captain sends their current GPS coordinates.

### Server → Client

#### `'connected'`
*   **Sent to:** captain or admin after a successful connection
*   **Payload:** `{ message: string, captainId?: string }`

#### `'location:updated'`
*   **Sent to:** `admin` room + captain's own room
*   **Payload:** `{ captainId: string, lat: number, lng: number, updatedAt: Date }`
*   **Description:** Broadcasted after a valid location update has been successfully stored.

#### `'location:error'`
*   **Sent to:** captain only (the socket that sent the corresponding invalid update)
*   **Payload:** `{ message: string, errors?: ZodIssue[] }`
*   **Description:** Emitted when payload validation or a business rule fails (e.g., captain became inactive).

## Rooms
*   `captain:{captainId}` — one room per captain, joined dynamically on successful connection.
*   `admin` — joined by any socket specifying `role=admin` in its handshake query.
