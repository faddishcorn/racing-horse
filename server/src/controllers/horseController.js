import { normalizeListParams, listHorses, getHorse as svcGetHorse } from '../services/horseService.js'

export async function getHorseList(req, res, next) {
  try {
    const params = normalizeListParams(req.query)
    const data = await listHorses(params)
    res.json(data)
  } catch (e) {
    next(e)
  }
}

export async function getHorse(req, res, next) {
  try {
    const horse = await svcGetHorse(req.params.hrNo)
    if (!horse) return res.status(404).json({ error: 'Not Found' })
    res.json(horse)
  } catch (e) {
    next(e)
  }
}
