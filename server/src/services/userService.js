import User from '../models/User.js'
import Favorite from '../models/Favorite.js'
import Note from '../models/Note.js'

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

export async function getUserFavorites(userId) {
  const favorites = await Favorite.find({ user: userId }).select('hrNo')
  return favorites.map(f => f.hrNo)
}

export async function getUserNotes(userId) {
  const notes = await Note.find({ user: userId }).select('hrNo content')
  const noteMap = {}
  notes.forEach(n => {
    noteMap[n.hrNo] = n.content
  })
  return noteMap
}

export async function toggleFavorite(email, hrNo) {
  const user = await getUserByEmail(email)
  if (!user) return null

  const existing = await Favorite.findOne({ user: user._id, hrNo })
  if (existing) {
    await Favorite.deleteOne({ _id: existing._id })
  } else {
    await Favorite.create({ user: user._id, hrNo })
  }

  return getUserFavorites(user._id)
}

export async function saveNote(email, hrNo, note) {
  const user = await getUserByEmail(email)
  if (!user) return null

  await Note.findOneAndUpdate(
    { user: user._id, hrNo },
    { content: note || '' },
    { upsert: true, new: true }
  )

  return getUserNotes(user._id)
}
