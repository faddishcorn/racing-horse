import bcrypt from 'bcryptjs'
import User from '../models/User.js'

export function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6
}

export async function registerUser(email, password) {
  const lower = String(email).toLowerCase()
  let existing = await User.findOne({ email: lower })
  if (existing && existing.passwordHash) {
    return { error: 'email already registered' }
  }
  const passwordHash = await bcrypt.hash(password, 10)
  if (!existing) {
    existing = await User.create({ email: lower, passwordHash })
  } else {
    existing.passwordHash = passwordHash
    await existing.save()
  }
  return { user: existing }
}

export async function loginUser(email, password) {
  const lower = String(email).toLowerCase()
  const user = await User.findOne({ email: lower })
  if (!user || !user.passwordHash) return { error: 'invalid credentials' }
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return { error: 'invalid credentials' }
  return { user }
}
