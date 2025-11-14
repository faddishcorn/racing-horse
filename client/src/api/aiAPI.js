import api from "./axios"

// AI 분석 요청
export const analyzeHorse = async (hrNo) => {
  const { data } = await api.post("/ai/analyze", { hrNo })
  return data // { success, analysis, model?, heuristic? }
}
