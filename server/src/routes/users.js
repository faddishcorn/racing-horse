import { Router } from 'express'
import { verifyToken } from '../middleware/auth.js'
import { registerUpsert, me, toggleFavoriteCtl, saveNoteCtl } from '../controllers/userController.js'

const router = Router()

// 간단 인증 대체: 헤더 X-User-Email로 사용자 식별 (프로토타입 용)
function getUserEmail(req) {
  const email = req.header('X-User-Email')
  if (!email) return null
  return String(email).toLowerCase()
}

// 등록/업서트: POST /api/users/register { email }
router.post('/register', registerUpsert)

// 내 정보: GET /api/users/me
router.get('/me', verifyToken, me)

// 즐겨찾기 토글: POST /api/users/favorites/toggle { hrNo }
router.post('/favorites/toggle', verifyToken, toggleFavoriteCtl)

// 노트 저장: POST /api/users/notes { hrNo, note }
router.post('/notes', verifyToken, saveNoteCtl)

export default router
