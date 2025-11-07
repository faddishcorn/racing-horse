import Comment from '../models/Comment.js'

export async function listComments(hrNo, page = 1, limit = 20) {
  page = Math.max(1, parseInt(page, 10))
  limit = Math.min(100, Math.max(1, parseInt(limit, 10)))
  const skip = (page - 1) * limit
  const [items, total] = await Promise.all([
    Comment.find({ hrNo }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Comment.countDocuments({ hrNo }),
  ])
  return { page, limit, total, totalPages: Math.ceil(total / limit), items }
}

export async function createComment({ hrNo, userEmail, content }) {
  const created = await Comment.create({ hrNo, userEmail, content })
  return created
}
