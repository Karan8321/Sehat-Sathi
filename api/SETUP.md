# Backend Server Setup

## Quick Start

1. **Get a Groq API Key** (Free):
   - Go to https://console.groq.com/
   - Sign up or log in
   - Create an API key
   - Copy the key

2. **Configure the API Key**:
   - Open the file `api/.env` in this directory
   - Find the line: `GROQ_API_KEY=your_groq_api_key_here`
   - Replace `your_groq_api_key_here` with your actual Groq API key
   - Save the file

3. **Restart the Server**:
   - Stop the current server (Ctrl+C in the terminal where it's running)
   - Run `npm start` again from the `api` directory

## Example .env file:

```env
PORT=4000
GROQ_API_KEY=gsk_your_actual_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
VAPI_API_KEY=your_vapi_api_key_here
VAPI_BASE_URL=https://api.vapi.ai
VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
```

## Verify Setup

After adding your API key and restarting, test the server:
- Health check: http://localhost:4000/api/health
- The frontend should now be able to process voice messages

## Troubleshooting

- **"GROQ_API_KEY is not configured"**: Make sure you've replaced the placeholder in `.env` and restarted the server
- **Server not starting**: Check that port 4000 is not already in use
- **Still getting errors**: Make sure the `.env` file is in the `api` directory (same folder as `index.js`)

