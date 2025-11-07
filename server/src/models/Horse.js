import mongoose from 'mongoose'

const horseSchema = new mongoose.Schema(
  {
    hrNo: { type: String, required: true, unique: true, index: true },
    hrName: { type: String, required: true, index: true },
    meet: { type: String },
    age: { type: Number },
    sex: { type: String }, // 예: '수', '암'
    debut: { type: String }, // 추후 Date로 전환 가능
    rcCntT: { type: Number },
    ord1CntT: { type: Number },
    ord2CntT: { type: Number },
    winRateT: { type: Number },
    qnlRateT: { type: Number },
    recentRcDate: { type: String },
    recentOrd: { type: Number },
    recentRcDist: { type: Number },
    recentRating: { type: Number },
    recentBudam: { type: Number },
    chaksunT: { type: String },
    popularity: { type: Number, default: 0 },
    // 원본 API 응답 저장용
    raw: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
)

// 색인: hrNo 고유, hrName 빠른 검색, updatedAt 최신순 정렬
horseSchema.index({ hrNo: 1 }, { unique: true })
horseSchema.index({ hrName: 1 })
horseSchema.index({ updatedAt: -1 })

// toJSON 변환: _id -> id, __v 제거
horseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id
    delete ret._id
    return ret
  },
})

export default mongoose.model('Horse', horseSchema)
