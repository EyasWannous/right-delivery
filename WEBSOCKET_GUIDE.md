# WebSocket API Guide (Socket.io)

This project uses **Socket.io** for real-time location tracking. This guide explains how to connect and interact with the two available socket roles.

---

## 1. General Connection Details
- **Base URL**: `ws://localhost:3000` (Socket.io handles the protocol upgrade internally)
- **Path**: `/socket.io/` (Standard)
- **Engine**: Socket.io **v4**

---

## 2. Captain: Location Update
Captains connect to the server to broadcast their real-time coordinates.

### Connection
- **URL**: `ws://localhost:3000?captainId=YOUR_CAPTAIN_ID`
- **Requirement**: The Captain must exist in the database and have its status set to `active`.

### Events to Listen For (Events Tab)
Add these listeners to monitor your connection:
- `connected`: Received upon successful authentication.
- `location:updated`: Received as a confirmation after you send a valid location.
- `location:error`: Received if the payload is invalid or the captain is inactive.

### Events to Send (Message Tab)
- **Event Name**: `location:update`
- **Payload (JSON)**:
  ```json
  {
    "lat": 25.123,
    "lng": 55.456
  }
  ```

---

## 3. Admin: Live Monitor
Admins connect to listen to all location updates from all active captains across the system.

### Connection
- **URL**: `ws://localhost:3000?role=admin`

### Events to Listen For (Events Tab)
Add this listener to see live data:
- `location:updated`: You will receive an object every time any captain updates their location.
- `connected`: Confirmation that you've joined the admin room.

### Expected Data Format
When a captain updates their location, you will receive:
```json
{
  "captainId": "uuid-string",
  "lat": 25.123,
  "lng": 55.456,
  "updatedAt": "2026-04-19T14:45:00.000Z"
}
```

---

## Testing with Postman (Step-by-Step)
1. Click **New** > **WebSocket**.
2. Change the dropdown from `WebSocket` to **`Socket.io`**.
3. Enter the URL (e.g., `ws://localhost:3000?role=admin`).
4. Go to the **Events** tab and add `location:updated`.
5. Click **Connect**.
6. You are now monitoring the system!
