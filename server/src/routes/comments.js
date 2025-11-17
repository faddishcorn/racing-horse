import { Router } from 'express'
import { getComments, postComment, deleteComment } from '../controllers/commentController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

// 말별 댓글 목록: GET /api/comments?hrNo=H001&page=1&limit=20
router.get('/', getComments)

// 댓글 작성: POST /api/comments { hrNo, userEmail, content }
router.post('/', postComment)

// 댓글 삭제(본인만): DELETE /api/comments/:id
router.delete('/:id', verifyToken, deleteComment)

export default router
