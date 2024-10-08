import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel.js'
import nodemailer from 'nodemailer'

const registerUser = async (req, res) => {
  //bcrypt
  const salt = await bcrypt.genSalt(10)
  const hassedPassword = await bcrypt.hash(req.body.password, salt)

  const newUser = new UserModel({ ...req.body, password: hassedPassword })
  const { username } = req.body

  try {
    const oldUser = await UserModel.findOne({ username: username })
    if (oldUser) {
      return res.status(400).json({ error: 'User already exists' })
    }
    const user = await newUser.save()

    const { _id } = user
    const accessToken = generateAccessToken({ _id })
    const refreshToken = generateRefreshToken({ _id })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(200).json({ user, accessToken })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const loginUser = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserModel.findOne({ username: username })

    if (user) {
      const validity = await bcrypt.compare(password, user.password)
      if (!validity) {
        res.status(400).json({ error: 'Invalid password' })
      } else {
        const { _id } = user
        const accessToken = generateAccessToken({ _id })
        const refreshToken = generateRefreshToken({ _id })

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'Strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

        res.status(200).json({ user: user, accessToken })
      }
    } else {
      res.status(400).json({ error: 'Username does not exist' })
    }
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    const user = await UserModel.findOne({ username: email })
    if (!user) {
      return res.status(400).json({ error: 'Email does not exist' })
    }
    // otp generation logic here (otp is a 6 digit number)
    const otp = Math.floor(100000 + Math.random() * 900000)
    user.resetPasswordOTP = otp
    // 60000 milliseconds = 1 minute
    user.resetPasswordExpires = Date.now() + 3600000 //10 minutes
    await user.save()
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      service: 'gmail',
      secure: true,
      auth: {
        user: 'phamthaihoc008@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      to: user.username,
      from: 'studystreamSystem',
      subject: 'Password Reset OTP Study Stream',
      text: `Your OTP for password reset is ${otp} `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(process.env.EMAIL_PASSWORD)
        console.log(error)
        return res.status(500).json({ message: 'Error sending email' })
      }
      res.status(200).json({ message: 'OTP đã được gửi đến email của bạn' })
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body
  const user = await UserModel.findOne({ username: email })
  if (!user) {
    return res.status(400).json({ error: 'Email does not exist' })
  }
  if (user.resetPasswordOTP !== otp || user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ message: 'OTP is invalid' })
  }
  return res.status(200).json({ message: 'OTP is valid' })
}

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body
  const user = await UserModel.findOne({ username: email })

  try {
    if (!user) {
      return res.status(400).json({ error: 'Email does not exist' })
    }
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP is expires' })
    }
    const salt = await bcrypt.genSalt(10)
    const hassedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hassedPassword
    user.resetPasswordOTP = null
    user.resetPasswordExpires = null
    await user.save()

    return res.status(200).json({ message: 'Password has been reset' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_KEY,
    { expiresIn: '15m' }
  )
}

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: '7d' }
  )
}

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.status(401).json({ error: 'Token is required' })

  try {
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY)
    const accessToken = generateAccessToken(user)
    res.status(200).json({ accessToken })
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' })
  }
}

export {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyOTP,
  refreshToken,
}
