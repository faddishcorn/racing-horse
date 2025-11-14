import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export function signToken(payload, options = {}) {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign(payload, JWT_SECRET, { expiresIn, ...options })
}

export function verifyToken(req, res, next) {
  // HTTP-only 쿠키에서 토큰 가져오기
  const token = req.cookies?.token
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
