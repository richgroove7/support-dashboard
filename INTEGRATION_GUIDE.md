# Support Dashboard - Backend Integration Guide

This document outlines the necessary steps to connect the `support-dashboard` frontend to the `tig-casino-admin-backend`.

## 1. Overview
Currently, the dashboard runs in **Simulation Mode** using mock data (`src/data/demoTickets.json`) and a local Auth Context (`src/context/AuthContext.tsx`).
To go live on Staging, you must connect it to the real REST API and Socket server.

## 2. Configuration

### Environment Variables
Create a `.env` file in the root of `support-dashboard`:

```env
VITE_API_URL=https://your-staging-api.com/api/v1
VITE_SOCKET_URL=https://your-staging-api.com
```

## 3. Authentication Implementation

The backend uses JWT Authentication. You must replace the mock `AuthContext` logic with real API calls.

### Endpoint
`POST /auth/login`

### Request Body
```json
{
  "email": "admin@example.com",
  "password": "secure_password"
}
```

### Implementation Class (`src/api/auth.ts`)
Create this file to handle the request:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  // Store token
  localStorage.setItem('token', data.token);
  return data.user;
};
```

## 4. Ticket Management Integration

Replace `src/data/demoTickets.json` imports with API calls.

### Endpoints
- **List Tickets**: `GET /ticket-management/tickets`
- **Ticket Details**: `GET /ticket-management/tickets/:id`
- **Messages**: `GET /ticket-management/ticket/message?ticketId=:id`
- **Send Message**: `POST /ticket-management/ticket/message`

### Data Mapping
The backend returns keys in `snake_case` (e.g., `user_id`, `owner_id`).
**Action**: You must map these to the frontend's `camelCase` `Ticket` interface in `src/types/index.ts`.

## 5. Real-Time Chat (Socket.IO)

The backend uses Socket.IO. The dashboard currently simulates this.

1.  **Install Client**: `npm install socket.io-client`
2.  **Connect**:
    ```typescript
    import { io } from 'socket.io-client';
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: localStorage.getItem('token') }
    });
    ```
3.  **Events**:
    - Listen for `ticket:message` to append new messages live.
    - Listen for `ticket:update` to update status/priority.

## 6. Removing Simulation Code

1.  **Remove** `src/data/demoTickets.json`.
2.  **Update** `src/App.tsx`: Remove `demoData` imports and use `useEffect` to fetch initial data.
3.  **Update** `ChatWindow.tsx`: Remove `setTimeout` simulations and use the real data flow.
