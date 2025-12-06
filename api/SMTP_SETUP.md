# SMTP Email Configuration Guide

The email alert feature requires SMTP configuration to send triage summaries to hospitals.

## Quick Setup for Gmail

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to Security
3. Enable 2-Step Verification (required for App Passwords)

### Step 2: Generate an App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other (Custom name)" as the device
4. Enter "SehatSathi" as the name
5. Click "Generate"
6. Copy the 16-character password (no spaces)

### Step 3: Update .env File
Open `api/.env` and update these values:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_actual_email@gmail.com
SMTP_PASS=your_16_character_app_password
EMAIL_FROM=your_actual_email@gmail.com
HOSPITAL_ALERT_TO=recipient@example.com
```

### Step 4: Restart the Server
After updating `.env`, restart the server:
```bash
# Stop the server (Ctrl+C)
npm start
```

## Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your_email@yahoo.com
SMTP_PASS=your_app_password
```

### Custom SMTP Server
```env
SMTP_HOST=your.smtp.server.com
SMTP_PORT=587  # or 465 for SSL
SMTP_USER=your_username
SMTP_PASS=your_password
EMAIL_FROM=your_email@domain.com
```

## Testing

After configuration, test the email endpoint:
```bash
curl -X POST http://localhost:4000/api/alert/email \
  -H "Content-Type: application/json" \
  -d '{"body": "Test email from SehatSathi"}'
```

## Troubleshooting

- **"SMTP configuration is missing"**: Make sure all SMTP_* variables are set in `.env`
- **"Invalid login"**: Check that you're using an App Password for Gmail, not your regular password
- **"Connection timeout"**: Check your firewall/network allows SMTP connections on port 587
- **"Authentication failed"**: Verify your credentials and that 2FA is enabled (for Gmail)

## Optional: Disable Email Alerts

If you don't need email alerts, you can leave the SMTP configuration as placeholders. The email alert button in the frontend will show an error, but the rest of the application will work normally.

