import express from 'express'
import { login, register } from '../controllers/authController.js'

const router = express.Router()

// Simple logout — clears the httpOnly cookie (frontend also clears localStorage via LOGOUT dispatch)
router.post('/logout', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production'
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
    path: '/',
  })
  res.status(200).json({ success: true, message: 'Logged out' })
})

router.post('/register', register)
router.post('/login', login)

export default router