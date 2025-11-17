import { listComments, createComment, removeCommentOwned } from '../services/commentService.js'

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
    if (!hrNo || !content) {
      return res.status(400).json({ error: 'hrNo and content are required' })
    }
    // 인증되어 있다면 쿠키의 사용자 이메일을 우선 사용 (클라이언트 신뢰 최소화)
    const finalEmail = req.user?.email || userEmail
    if (!finalEmail) return res.status(401).json({ error: 'Unauthorized' })
    const created = await createComment({ hrNo, userEmail: finalEmail, content })
    res.status(201).json(created)
  } catch (e) {
    next(e)
  }
}

export async function deleteComment(req, res, next) {
  try {
    const { id } = req.params
    const requester = req.user?.email
    if (!requester) return res.status(401).json({ error: 'Unauthorized' })
    const { deleted } = await removeCommentOwned(id, requester)
    if (!deleted) return res.status(403).json({ error: 'Forbidden' })
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
}
