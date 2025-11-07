import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    favorites: { type: [String], default: [] }, // hrNo 목록
    notes: { type: Map, of: String, default: {} }, // key: hrNo, value: note text
  },
  { timestamps: true }
)

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id
    delete ret._id
    return ret
  },
})

export default mongoose.model('User', userSchema)
