/**
 * Vercel serverless entry point for the Express API.
 * Vercel sets process.env.VERCEL=1, so backend/index.js will NOT call app.listen().
 * This file just re-exports the Express `app` — Vercel's @vercel/node handles the rest.
 */
import app from '../index.js'

export default app
