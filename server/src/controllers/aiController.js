import { analyzeHorseWithAI } from '../services/ai.js'

export async function analyze(req, res, next) {
  try {
    const { hrNo } = req.body || {}
    if (!hrNo) return res.status(400).json({ error: 'hrNo is required' })
    const result = await analyzeHorseWithAI(hrNo)
    if (!result.success) return res.status(404).json(result)
    res.json(result)
  } catch (e) {
    next(e)
  }
}
