import { registerUser, loginUser, validatePassword } from '../services/authService.js'
import { signToken } from '../middleware/auth.js'

export async function register(req, res, next) {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
    if (!validatePassword(password)) return res.status(400).json({ error: 'password must be >= 6 chars' })
    const result = await registerUser(email, password)
    if (result.error) return res.status(409).json({ error: result.error })
    const token = signToken({ email: result.user.email, id: result.user.id })
    res.status(201).json({ token, user: result.user })
  } catch (e) {
    next(e)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
    const result = await loginUser(email, password)
    if (result.error) return res.status(401).json({ error: result.error })
    const token = signToken({ email: result.user.email, id: result.user.id })
    res.json({ token, user: result.user })
  } catch (e) {
    next(e)
  }
}
