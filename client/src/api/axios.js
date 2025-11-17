import axios from "axios"

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // 쿠키 자동 전송
})

export default api