import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            photo: req.body.photo
        })

        await newUser.save()
        res.status(200).json({ success: true, message: 'Successfully created' })

    } catch (error) {
        res.status(500).json({ success: false, message: 'failed to create. Try again!' })
    }
}


export const login = async (req, res) => {
    try {

        const email = req.body.email
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password)

        if (!checkCorrectPassword) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' })
        }

        const { password, role, ...rest } = user._doc

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15d' }
        )

//set token in browser cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        }).status(200).json({
            success: true,
            message: 'Successfully logged in',
            token,
            data: { ...rest },
            role,
        })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to login. Try again!' })
    }
}
