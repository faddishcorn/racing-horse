import { Router } from 'express'
import { analyze } from '../controllers/aiController.js'

const router = Router()

// POST /api/ai/analyze { hrNo }
router.post('/analyze', analyze)

export default router
