import { Router } from 'express'
import { getComments, postComment } from '../controllers/commentController.js'

const router = Router()

// 말별 댓글 목록: GET /api/comments?hrNo=H001&page=1&limit=20
router.get('/', getComments)

// 댓글 작성: POST /api/comments { hrNo, userEmail, content }
router.post('/', postComment)

export default router
