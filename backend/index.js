import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.js'
import tourRoute from './routes/tours.js'
import userRoute from './routes/user.js'
import reviewRoute from './routes/reviews.js'
import bookingRoute from './routes/booking.js'
import { verifyAdmin } from './utils/verifyToken.js'
import Tour from './models/Tour.js'
import User from './models/User.js'
import Booking from './models/Booking.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8000
const NODE_ENV = process.env.NODE_ENV || 'development'

// ----- env validation (fail fast in production) -----
const requiredEnv = ['MONGO_URI', 'JWT_SECRET_KEY']
const missing = requiredEnv.filter(k => !process.env[k])
if (missing.length) {
  console.warn(`[warn] Missing env vars: ${missing.join(', ')} — see backend/.env.example`)
  if (NODE_ENV === 'production') {
    console.error('[fatal] Missing required env vars in production. Exiting.')
    process.exit(1)
  }
}

// ----- CORS: allow FRONTEND_URL (comma-separated) -----
// e.g. FRONTEND_URL=https://your-frontend.vercel.app,https://your-frontend.netlify.app,http://localhost:3000
const rawFrontend = process.env.FRONTEND_URL || process.env.FRONTEND_URLS || (NODE_ENV === 'production' ? '' : 'http://localhost:3000,http://localhost:5173')
const ALLOWED_ORIGINS = rawFrontend.split(',').map(s => s.trim()).filter(Boolean)
console.log(`[cors] NODE_ENV=${NODE_ENV} | ALLOWED_ORIGINS=${ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS.join(', ') : '(empty — CORS will block all cross-origin requests!)'} | VERCEL=${process.env.VERCEL || 'no'}`)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true) // curl/postman/no-origin
    if (ALLOWED_ORIGINS.length === 0) {
      return callback(new Error(`CORS blocked: ALLOWED_ORIGINS is empty. Set FRONTEND_URL env var in Vercel. Received origin: ${origin}`))
    }
    if (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) return callback(null, true)
    return callback(new Error(`CORS blocked: origin "${origin}" is not in ALLOWED_ORIGINS [${ALLOWED_ORIGINS.join(', ')}]`))
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
}

// ----- security headers (lightweight) -----
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '0')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  if (NODE_ENV === 'production') res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  next()
}

// ----- simple rate limiter (no extra deps) -----
const rateLimitStore = new Map()
const rateLimiter = (req, res, next) => {
  const key = req.ip || req.headers['x-forwarded-for'] || 'global'
  const now = Date.now()
  const windowMs = 15*60*1000
  const max = 300
  const entry = rateLimitStore.get(key) || { count: 0, reset: now + windowMs }
  if (now > entry.reset) { entry.count = 0; entry.reset = now + windowMs }
  entry.count += 1
  rateLimitStore.set(key, entry)
  if (entry.count > max) return res.status(429).json({ success:false, message:'Too many requests, please try again later.' })
  if (rateLimitStore.size > 10000) rateLimitStore.clear()
  next()
}

// ----- DB connect helper -----
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return          // already connected
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 })
    console.log('MongoDB database connected')
  } catch (err) {
    console.error('MongoDB connection failed:', err.message)
    // Vercel serverless: retry once, then throw (never process.exit — it kills the function)
    if (!process.env.VERCEL && NODE_ENV === 'production') {
      console.log('Retrying MongoDB in 5s...')
      await new Promise(r=>setTimeout(r,5000))
      try { await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 }); console.log('MongoDB reconnected'); return }
      catch(e){ console.error('MongoDB retry failed:', e.message); process.exit(1) }
    }
    throw err
  }
}

app.set('trust proxy', 1)
app.use(securityHeaders)
app.use(rateLimiter)
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cors(corsOptions))
// Express 5: '*' as route throws PathError — CORS middleware already handles preflights
// no need for app.options('*', ...) — handled by cors()
app.use(cookieParser())

// ----- ensure DB connected (required for Vercel serverless) -----
// On Vercel, `start()` is not called (no app.listen), so we lazy-connect per request.
// On traditional hosts, mongoose is already connected — this is a no-op.
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next()
  // Only skip DB for root '/' to keep cold-start health fast.
  // /health and /api/v1/health SHOULD try to connect so you see the real status.
  if (req.path === '/') return next()
  try {
    await connectDB()
    next()
  } catch (e) { next(e) }
})

// ----- health checks -----
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tour Management API is running',
    env: NODE_ENV,
    uptime: process.uptime(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cors: {
      nodeEnv: NODE_ENV,
      allowedOrigins: ALLOWED_ORIGINS,
      hasFrontendUrl: !!process.env.FRONTEND_URL,
      frontendUrlRaw: process.env.FRONTEND_URL ? '(set)' : '(NOT SET)',
    }
  })
})
app.get('/health', async (req, res) => {
  // Try to ensure DB is connected before reporting — this is what users expect.
  // If Atlas is unreachable this will still return quickly (15s timeout in connectDB).
  if (mongoose.connection.readyState !== 1) {
    try { await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 }) } catch {}
  }
  const state = mongoose.connection.readyState
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
  res.status(200).json({ success: true, status: 'ok', db: states[state] || state, readyState: state, timestamp: new Date().toISOString() })
})
app.get('/api/v1/health', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try { await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 }) } catch {}
  }
  const state = mongoose.connection.readyState
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
  res.status(200).json({ success: true, status: 'ok', db: states[state] || state, readyState: state })
})

// ----- CORS debug (always returns CORS headers so browser can read it) -----
app.get('/api/v1/cors-debug', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'If you can read this, CORS is working for this endpoint',
    receivedOrigin: req.headers.origin || '(none — same-origin or curl)',
    allowedOrigins: ALLOWED_ORIGINS,
    frontendUrlEnv: process.env.FRONTEND_URL || '(NOT SET)',
    nodeEnv: NODE_ENV,
  })
})

// ----- routes -----
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/tours', tourRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/reviews', reviewRoute)
app.use('/api/v1/review', reviewRoute)
app.use('/api/v1/booking', bookingRoute)

// ----- admin stats (counts for dashboard) -----
app.get('/api/v1/admin/stats', verifyAdmin, async (req, res) => {
  try {
    const [tourCount, userCount, bookingCount] = await Promise.all([
      Tour.estimatedDocumentCount(),
      User.estimatedDocumentCount(),
      Booking.estimatedDocumentCount(),
    ])
    res.status(200).json({
      success: true,
      data: { tourCount, userCount, bookingCount },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' })
  }
})

// ----- 404 -----
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// ----- global error handler (must be last) -----
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[error]', err.message)
  const status = err.statusCode || err.status || 500
  if (err.message && err.message.startsWith('CORS blocked')) {
    return res.status(403).json({ success: false, message: err.message })
  }
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(NODE_ENV !== 'production' && { stack: err.stack }),
  })
})

// ----- start (non-serverless hosts) -----
// On Vercel the server is NOT started here — vercel.json routes to the
// serverless function `api/index.js` which imports `app` directly.
let server
const start = async () => {
  await connectDB()
  server = app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} on port ${PORT}`)
    if (ALLOWED_ORIGINS.length) console.log(`Allowed CORS origins: ${ALLOWED_ORIGINS.join(', ')}`)
    else console.log('No ALLOWED_ORIGINS set — set FRONTEND_URL env for production CORS')
  })
}
if (!process.env.VERCEL) {
  start()
}

// ----- graceful shutdown -----
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`)
  try {
    if (server) server.close(() => console.log('HTTP server closed'))
    await mongoose.connection.close(false)
    console.log('MongoDB connection closed')
  } catch (e) { console.error('Shutdown error:', e.message) }
  finally { process.exit(0) }
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('unhandledRejection', (reason) => { console.error('Unhandled Rejection:', reason) })
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  if (NODE_ENV === 'production') process.exit(1)
})

export default app