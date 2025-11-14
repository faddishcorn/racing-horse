import { Router } from 'express'
import { register, login, logout, session } from '../controllers/authController.js'

const router = Router()

// 회원가입
router.post('/register', register)

// 로그인
router.post('/login', login)

// 로그아웃
router.post('/logout', logout)

// 세션 상태 확인 (항상 200)
router.get('/session', session)

export default router
