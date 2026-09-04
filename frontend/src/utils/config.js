// Production-ready: use CRA env var REACT_APP_API_URL (set at build time)
// Vercel/Netlify: set REACT_APP_API_URL=https://your-backend.onrender.com/api/v1
// Fallbacks to localhost for local dev
const raw = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000/api/v1'
// strip trailing slash so callers can do `${BASE_URL}/tours` safely
export const BASE_URL = raw.replace(/\/$/, '')