## Medical Triage Voice AI Backend

Node.js + Express backend for a medical triage voice AI system.  
It uses the Groq API (model `llama-3.1-70b-versatile`) for AI triage and a Vapi-style API for initiating voice calls.

> Note: This project is scaffolded only. Dependencies are listed in `package.json` but not installed yet.

### Project Structure

- **`package.json`**: Node project metadata and scripts.
- **`src/server.js`**: Express app entrypoint (CORS, JSON parsing, routes, error handling).
- **`src/routes/triage.js`**: `POST /api/triage` – triage symptoms via Groq AI.
- **`src/routes/hospitals.js`**: `GET /api/hospitals` – nearby hospitals with mocked availability.
- **`src/routes/call.js`**: `POST /api/call` – initiate a Vapi voice call.
- **`src/services/groqService.js`**: Groq chat-completion integration.
- **`src/services/hospitalService.js`**: Mock hospital lookup service.
- **`src/services/vapiService.js`**: Vapi call initiation stub.

### Environment Variables

Create a `.env` file in the project root (same folder as `package.json`) with values like:

```bash
PORT=4000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-70b-versatile
VAPI_API_KEY=your_vapi_api_key_here
VAPI_BASE_URL=https://api.vapi.ai
```

These are read in `src/server.js`, `src/services/groqService.js`, and `src/services/vapiService.js`.

### Endpoints

- **POST `/api/triage`**
  - **Body**:
    - `symptoms` (string, required)
    - `age` (number, optional)
    - `sex` (string, optional)
    - `duration` (string, optional)
    - `additionalNotes` (string, optional)
  - **Response** (example):
    - `urgencyLevel`: `"emergency" | "urgent" | "non-urgent"`
    - `advice`: string
    - `rawResponse`: full Groq response object

- **GET `/api/hospitals`**
  - **Query params**:
    - `lat` (number, required)
    - `lng` (number, required)
    - `radiusKm` (number, optional, default 10)
  - **Response**:
    - `hospitals`: array of mocked hospital objects with distance and availability info.

- **POST `/api/call`**
  - **Body**:
    - `to` (string, required) – phone number or identifier to call.
    - `patientId` (string, optional)
    - `metadata` (object, optional)
  - **Response** (example):
    - `success`: boolean
    - `callId`: provider call identifier (if available)
    - `providerResponse`: raw Vapi response

### Error Handling and CORS

- **CORS**: Enabled globally in `src/server.js` using the `cors` middleware.
- **JSON parsing**: Handled via `express.json()`.
- **Global error handler**: Any thrown errors in routes/services are caught and returned as JSON:
  - Shape: `{ error: { message, details? } }`
  - External API failures (Groq/Vapi) are surfaced as `502` where possible.

### How to Run (When Ready)

When you decide to run this backend:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` with your real values.
3. Start the server:
   ```bash
   npm run start
   # or for dev with auto-reload (requires nodemon):
   npm run dev
   ```
4. The API will be available at `http://localhost:PORT` (default `4000`).


