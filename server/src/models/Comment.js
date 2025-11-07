import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    hrNo: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    content: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
)

// 말별 최신 댓글 페이지네이션, 사용자별 활동 조회 최적화
commentSchema.index({ hrNo: 1, createdAt: -1 })
commentSchema.index({ userEmail: 1, createdAt: -1 })

commentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id
    delete ret._id
    return ret
  },
})

export default mongoose.model('Comment', commentSchema)
