import api from "./axios"

// 댓글 목록 조회
export const getComments = async (hrNo, page = 1, limit = 20) => {
  const { data } = await api.get("/comments", {
    params: { hrNo, page, limit },
  })
  return data // { page, limit, total, totalPages, items }
}

// 댓글 작성
export const postComment = async (hrNo, userEmail, content) => {
  const { data } = await api.post("/comments", { hrNo, userEmail, content })
  return data
}

// 댓글 삭제
export const deleteComment = async (id) => {
  const { data } = await api.delete(`/comments/${id}`)
  return data
}
