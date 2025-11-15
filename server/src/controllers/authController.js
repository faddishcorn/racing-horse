import { registerUser, loginUser, validatePassword } from '../services/authService.js'
import { signToken } from '../middleware/auth.js'
import jwt from 'jsonwebtoken'
import { getUserByEmail } from '../services/userService.js'

export async function register(req, res, next) {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
    if (!validatePassword(password)) return res.status(400).json({ error: 'password must be >= 6 chars' })
    const result = await registerUser(email, password)
    if (result.error) return res.status(409).json({ error: result.error })
    const token = signToken({ email: result.user.email, id: result.user.id })
    
    // HTTP-only 쿠키로 토큰 설정
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송 (프로덕션)
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    })
    
    res.status(201).json({ user: result.user })
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
    
    // HTTP-only 쿠키로 토큰 설정
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    })
    
    res.json({ user: result.user })
  } catch (e) {
    next(e)
  }
}

// 로그아웃 엔드포인트 추가
export async function logout(req, res, next) {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    })
    res.json({ message: 'Logged out successfully' })
  } catch (e) {
    next(e)
  }
}

// 세션 상태 확인 (401 대신 항상 200으로 상태 반환)
export async function session(req, res, next) {
  try {
    const token = req.cookies?.token
    if (!token) return res.json({ authenticated: false })

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
      const user = await getUserByEmail(decoded.email)
      if (!user) {
        // 유저가 없으면 쿠키 정리
        res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        })
        return res.json({ authenticated: false })
      }
      return res.json({ authenticated: true, user })
    } catch (_err) {
      // 토큰 검증 실패 시 쿠키 정리 후 비인증 상태 반환
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      })
      return res.json({ authenticated: false })
    }
  } catch (e) {
    next(e)
  }
}
