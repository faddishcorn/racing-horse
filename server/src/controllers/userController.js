import { upsertUserEmail, getUserByEmail, toggleFavorite, saveNote, getUserFavorites, getUserNotes } from '../services/userService.js'

export async function registerUpsert(req, res, next) {
  try {
    const email = String(req.body?.email || '').toLowerCase()
    if (!email) return res.status(400).json({ error: 'email is required' })
    const user = await upsertUserEmail(email)
    res.json(user)
  } catch (e) {
    next(e)
  }
}

export async function me(req, res, next) {
  try {
    const email = req.user?.email
    const user = await getUserByEmail(email)
    if (!user) return res.status(404).json({ error: 'Not Found' })

    const userObj = user.toJSON()
    userObj.favorites = await getUserFavorites(user._id)
    userObj.notes = await getUserNotes(user._id)

    res.json(userObj)
  } catch (e) {
    next(e)
  }
}

export async function toggleFavoriteCtl(req, res, next) {
  try {
    const email = req.user?.email
    const { hrNo } = req.body || {}
    if (!hrNo) return res.status(400).json({ error: 'hrNo is required' })
    const favorites = await toggleFavorite(email, hrNo)
    if (!favorites) return res.status(404).json({ error: 'Not Found' })
    res.json({ favorites })
  } catch (e) {
    next(e)
  }
}

export async function saveNoteCtl(req, res, next) {
  try {
    const email = req.user?.email
    const { hrNo, note } = req.body || {}
    if (!hrNo) return res.status(400).json({ error: 'hrNo is required' })
    const notes = await saveNote(email, hrNo, note)
    if (!notes) return res.status(404).json({ error: 'Not Found' })
    res.json({ notes })
  } catch (e) {
    next(e)
  }
}
