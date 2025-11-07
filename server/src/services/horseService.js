import Horse from '../models/Horse.js'

export function normalizeListParams(query) {
  const pageParam = query.page || query.pageNo
  const limitParam = query.limit || query.numOfRows
  const page = Math.max(1, parseInt(pageParam || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(limitParam || '20', 10)))
  const hr_name = query.hr_name || query.hrName
  const hr_no = query.hr_no || query.hrNo
  const sort = query.sort
  return { page, limit, hr_name, hr_no, sort }
}

export function buildFilter({ hr_name, hr_no }) {
  const filter = {}
  if (hr_no) filter.hrNo = hr_no
  if (hr_name) filter.hrName = { $regex: hr_name, $options: 'i' }
  return filter
}

export function buildSort(sort) {
  let sortOption = { updatedAt: -1 }
  if (sort === 'popularity') sortOption = { popularity: -1 }
  else if (sort === 'recentOrd') sortOption = { recentOrd: 1 }
  return { sortOption, sort: sort || 'updatedAt' }
}

export async function listHorses(params) {
  const { page, limit, hr_name, hr_no, sort } = params
  const filter = buildFilter({ hr_name, hr_no })
  const skip = (page - 1) * limit
  const { sortOption, sort: sortValue } = buildSort(sort)

  const [items, total] = await Promise.all([
    Horse.find(filter).skip(skip).limit(limit).sort(sortOption),
    Horse.countDocuments(filter),
  ])

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    sort: sortValue,
    items,
  }
}

export async function getHorse(hrNo) {
  const horse = await Horse.findOne({ hrNo })
  return horse
}
