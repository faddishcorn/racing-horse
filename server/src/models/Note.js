import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        hrNo: { type: String, required: true }, // Horse Number
        content: { type: String, default: '' },
    },
    { timestamps: true }
)

// 한 유저가 같은 말에 대해 하나의 노트만 가짐
noteSchema.index({ user: 1, hrNo: 1 }, { unique: true })

export default mongoose.model('Note', noteSchema)
