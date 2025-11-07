import User from '../models/User.js'

export async function upsertUserEmail(email) {
  const lower = String(email).toLowerCase()
  const user = await User.findOneAndUpdate(
    { email: lower },
    { $setOnInsert: { email: lower } },
    { upsert: true, new: true }
  )
  return user
}

export async function getUserByEmail(email) {
  const lower = String(email).toLowerCase()
  return User.findOne({ email: lower })
}

export async function toggleFavorite(email, hrNo) {
  const user = await getUserByEmail(email)
  if (!user) return null
  const idx = user.favorites.indexOf(hrNo)
  if (idx >= 0) user.favorites.splice(idx, 1)
  else user.favorites.push(hrNo)
  await user.save()
  return user.favorites
}

export async function saveNote(email, hrNo, note) {
  const user = await User.findOneAndUpdate(
    { email: String(email).toLowerCase() },
    { $set: { [`notes.${hrNo}`]: note || '' } },
    { new: true }
  )
  return user?.notes
}
