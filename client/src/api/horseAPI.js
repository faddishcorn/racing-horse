import api from "./axios"

// 말 목록 조회
export const getHorses = async (params = {}) => {
  const { data } = await api.get("/horses", { params })
  return data // { page, limit, total, totalPages, sort, items }
}

// 말 상세 조회
export const getHorse = async (hrNo) => {
  const { data } = await api.get(`/horses/${hrNo}`)
  return data
}
