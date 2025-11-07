import { listComments, createComment } from '../services/commentService.js'

export async function getComments(req, res, next) {
  try {
    const { hrNo } = req.query
    if (!hrNo) return res.status(400).json({ error: 'hrNo is required' })
    const { page, limit } = req.query
    const data = await listComments(hrNo, page, limit)
    res.json(data)
  } catch (e) {
    next(e)
  }
}

export async function postComment(req, res, next) {
  try {
    const { hrNo, userEmail, content } = req.body || {}
    if (!hrNo || !userEmail || !content) {
      return res.status(400).json({ error: 'hrNo, userEmail, content are required' })
    }
    const created = await createComment({ hrNo, userEmail, content })
    res.status(201).json(created)
  } catch (e) {
    next(e)
  }
}
