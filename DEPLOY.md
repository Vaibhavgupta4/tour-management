# Deployment Guide — Tour Management (MERN)

App is now production-ready: env-driven API URL, secure cookies, strict CORS, health checks, graceful shutdown, SPA routing.

## 1) Recommended free platforms

| Layer | Easiest (recommended) | Alternatives (free tier) |
|-------|----------------------|--------------------------|
| **Frontend (React CRA)** | **Vercel** — zero-config, global CDN, auto HTTPS | Netlify, Cloudflare Pages |
| **Backend (Express)** | **Render** — free web service, auto HTTPS, health checks | Railway, Fly.io, Koyeb, Cyclic |
| **Database** | **MongoDB Atlas** (free 512 MB — already used) | — |
| **Single provider** | **Railway** or **Render** (2 services from 1 repo) | — |

Deploy frontend and backend separately (CORS). You can add a reverse proxy later, but keep separate for free tier.

## 2) Generate secrets

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
# use output as JWT_SECRET_KEY
```

**Backend env** (set in Render/Railway dashboard, not in repo):
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/tour_booking?retryWrites=true&w=majority
JWT_SECRET_KEY=<long random hex, min 32 chars>
FRONTEND_URL=https://your-frontend.vercel.app
# multiple origins:
# FRONTEND_URL=https://your-frontend.vercel.app,https://your-frontend.netlify.app
```

**Frontend env** (CRA — must start with REACT_APP_, baked at build time):
```
REACT_APP_API_URL=https://your-backend.onrender.com/api/v1
```

## 3) Backend — Render (recommended)

1. Push repo to GitHub.
2. Render dashboard → **New → Web Service → Connect repo**.
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
   - **Node**: `20`
4. Add env vars above (`NODE_ENV`, `MONGO_URI`, `JWT_SECRET_KEY`, `FRONTEND_URL`).
5. Deploy. Test: `https://your-backend.onrender.com/` → `{ success:true, message:"Tour Management API is running" }`

Atlas: Network Access → Add IP `0.0.0.0/0` (or Render outbound IPs).

Free tier sleeps after ~15 min idle; first request takes 30-50s. Keep warm with cron-job.org pinging `/health` every 10 min or upgrade.

**Railway / Fly.io alternative**: Railway → New Project → Deploy from GitHub → add vars. Fly.io → `fly launch` in `backend/` then `fly secrets set MONGO_URI=... JWT_SECRET_KEY=... FRONTEND_URL=...`.

## 4) Frontend — Vercel (recommended)

1. Vercel → **Add New → Project → Import Git Repo**.
2. Framework Preset: `Create React App`.
3. **Root Directory**: `frontend` | **Build Command**: `npm run build` | **Output**: `build`
4. Env var: `REACT_APP_API_URL=https://your-backend.onrender.com/api/v1`
5. Deploy. SPA routing handled by `frontend/vercel.json`.

**Netlify alternative**: New site from Git → `netlify.toml` auto-detected (in `frontend/`). Set `REACT_APP_API_URL` in Site settings → Build & deploy → Environment. SPA redirects via `frontend/public/_redirects`.

If frontend still hits `http://localhost:4000`: you forgot `REACT_APP_API_URL` before build — redeploy after setting it (CRA bakes env at build time).

## 5) Wire CORS correctly

`FRONTEND_URL` must exactly match deployed frontend origin:

```
FRONTEND_URL=https://tour-management-xyz.vercel.app
# multiple:
FRONTEND_URL=https://tour-management-xyz.vercel.app,https://tour-management-xyz.netlify.app
```

After changing, redeploy/restart backend.

```bash
curl -i https://your-backend.onrender.com/health
curl -i -H "Origin: https://your-frontend.vercel.app" https://your-backend.onrender.com/api/v1/tours | head
```

## 6) Cookies vs Authorization header

Login sets `httpOnly` cookie `accessToken` with `SameSite=None; Secure` in prod (cross-origin HTTPS) and also returns `token` JSON. Frontend stores it in `localStorage`; `useFetch` auto-attaches `Authorization: Bearer <token>`. Covers blocked cookies and mobile. `verifyToken` accepts either.

## 7) Custom domain

Vercel/Netlify → Domains → add domain → set DNS. Then update `FRONTEND_URL` to that custom domain and redeploy backend.

## 8) What changed for production

- `backend/index.js`: strict CORS via `FRONTEND_URL`, security headers, rate limiting, `/` `/health` `/api/v1/health`, 404, global error handler, `trust proxy`, env validation, graceful shutdown, DB retry.
- `backend/controllers/authController.js`: validation, 201/409/400, secure cookies (`SameSite=None;Secure` in prod), bearer fallback, `POST /auth/logout`.
- `backend/models/Booking.js` + `backend/controllers/bookingController.js`: guestSize clamp >=1.
- `frontend/src/utils/config.js`: `REACT_APP_API_URL` env-driven.
- `frontend/src/hooks/useFetch.js`: abort controller, auto auth header, credentials include.
- `frontend/src/components/header/header.jsx`: logout clears server cookie.
- New: `backend/.env.example`, `frontend/.env.example`, `.gitignore`, `vercel.json`, `_redirects`, `netlify.toml`, `render.yaml`, `Dockerfile.backend`, `engines` in package.json.

## 9) Local production smoke test

```bash
# backend
cd backend
NODE_ENV=production PORT=4000 FRONTEND_URL=http://localhost:3000 MONGO_URI="..." JWT_SECRET_KEY="..." npm start
curl http://localhost:4000/health

# frontend
cd frontend
REACT_APP_API_URL=http://localhost:4000/api/v1 npm run build
npx serve -s build -l 3000
# open http://localhost:3000
```

## 10) Free platform comparison

- **Vercel + Render** — best balance (recommended).
- **Netlify** — equally easy for frontend, good forms/functions.
- **Railway** — great DX for backend, one provider for both.
- **Fly.io / Koyeb** — always-on free tier, closer to VPS.
- **Cyclic / Replit** — quick but less reliable.

Single-provider free: **Railway** (2 services from 1 repo) or **Render** (Static Site + Web Service).


