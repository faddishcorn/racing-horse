import api from "./axios"

// 회원가입
export const register = async (email, password) => {
  const { data } = await api.post("/auth/register", { email, password })
  return data // { user }
}

// 로그인
export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password })
  return data // { user }
}

// 로그아웃
export const logout = async () => {
  const { data } = await api.post("/auth/logout")
  return data
}

// 내 정보 조회 (쿠키 자동 전송)
export const getMe = async () => {
  const { data } = await api.get("/users/me")
  return data
}

// 세션 상태 확인 (항상 200)
export const getSession = async () => {
  const { data } = await api.get("/auth/session")
  return data // { authenticated: boolean, user? }
}

// 즐겨찾기 토글 (쿠키 자동 전송)
export const toggleFavorite = async (hrNo) => {
  const { data } = await api.post("/users/favorites/toggle", { hrNo })
  return data // { favorites: [...] }
}

// 노트 저장 (쿠키 자동 전송)
export const saveNote = async (hrNo, note) => {
  const { data } = await api.post("/users/notes", { hrNo, note })
  return data // { notes: {...} }
}
