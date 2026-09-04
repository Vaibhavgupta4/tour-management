import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { username, email, password, photo } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Username, email and password are required' })
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({ username, email, password: hash, photo })
        await newUser.save()
        res.status(201).json({ success: true, message: 'Successfully created — please login' })

    } catch (error) {
        // duplicate key (username/email)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || 'field'
            return res.status(409).json({ success: false, message: `${field} already exists` })
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message })
        }
        console.error('[register]', error.message)
        res.status(500).json({ success: false, message: 'Failed to create. Try again!' })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const checkCorrectPassword = await bcrypt.compare(password, user.password)
        if (!checkCorrectPassword) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' })
        }

        const { password: _pwd, ...rest } = user._doc

        if (!process.env.JWT_SECRET_KEY) {
            console.error('[login] JWT_SECRET_KEY missing')
            return res.status(500).json({ success: false, message: 'Server misconfiguration' })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15d' }
        )

        const isProd = process.env.NODE_ENV === 'production'
        // In production (cross-origin frontend/backend) cookies need SameSite=None + Secure
        // In dev, Lax is fine and works over http://localhost
        const cookieOpts = {
            httpOnly: true,
            secure: isProd, // true only over https
            sameSite: isProd ? 'None' : 'Lax',
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            path: '/',
        }

        res.cookie('accessToken', token, cookieOpts).status(200).json({
            success: true,
            message: 'Successfully logged in',
            token, // also return for Authorization: Bearer fallback (mobile / cross-site)
            data: { ...rest }, // rest now includes role field
        })

    } catch (error) {
        console.error('[login]', error.message)
        res.status(500).json({ success: false, message: 'Failed to login. Try again!' })
    }
}
