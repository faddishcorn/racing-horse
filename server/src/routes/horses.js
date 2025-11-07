import { Router } from 'express'
import { getHorseList, getHorse } from '../controllers/horseController.js'

const router = Router()

// GET /api/horses?page=1&limit=20&hr_name=...&hr_no=...&sort=popularity|-updatedAt|recentOrd
router.get('/', getHorseList)

// GET /api/horses/:hrNo
router.get('/:hrNo', getHorse)

export default router
