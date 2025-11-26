import mongoose from 'mongoose'

const favoriteSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        hrNo: { type: String, required: true }, // Horse Number
    },
    { timestamps: true }
)

// 한 유저가 같은 말을 중복 즐겨찾기 할 수 없음
favoriteSchema.index({ user: 1, hrNo: 1 }, { unique: true })

export default mongoose.model('Favorite', favoriteSchema)
