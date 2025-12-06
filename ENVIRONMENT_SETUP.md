This project requires several environment variables to run.

Do NOT commit real secret values to git. Use the Vercel Dashboard to set production variables.

1) Local development
- Copy `.env.example` to `.env` at the repo root and fill the values for backend services.
- Copy `frontend/.env.local.example` to `frontend/.env.local` and fill frontend public keys.

2) Vercel
- In your Vercel project settings, add the same variables (without committing them) under Environment Variables.
- For keys that must be available to the browser, prefix them with `NEXT_PUBLIC_` and set them in Vercel as well.

3) Notes
- `.env` and `frontend/.env.local` are ignored by git. Existing tracked copies will be removed from the repository index but kept on your local filesystem.
- If you previously had secrets committed, rotate them and remove any leaked keys where appropriate.
