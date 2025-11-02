# RailShield - Backend

This folder contains the Express backend for RailShield.

Quick start

1. Copy `.env.example` to `.env` and fill in your secrets (do NOT commit `.env`).
2. Install dependencies:

```powershell
cd backend
npm install
```

3. Run in development:

```powershell
npm run dev
```

Notes & security
- Never commit `.env` or secrets. Use the `backend/.env.example` as a template.
- Rotate credentials if they were committed to source control.
- For production, use a secret store (e.g., GitHub Actions secrets, hosting provider secrets) and a distributed rate limiter (Redis).

Environment
- Set `FRONTEND_URL` to your frontend origin when running locally if different from `http://localhost:5173`.

