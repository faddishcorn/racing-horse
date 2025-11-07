import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'

import horseRouter from './routes/horses.js'
import healthRouter from './routes/health.js'
import userRouter from './routes/users.js'
import commentRouter from './routes/comments.js'
import aiRouter from './routes/ai.js'
import authRouter from './routes/auth.js'

const app = express()

// 기본 미들웨어
app.use(helmet())
app.use(cors({ origin: ['http://localhost:5173'], credentials: false }))
app.use(morgan('dev'))
app.use(express.json())

// 라우트
app.use('/api/health', healthRouter)
app.use('/api/horses', horseRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/comments', commentRouter)
app.use('/api/ai', aiRouter)

// 404 처리
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

// 오류 처리
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI

async function start() {
  try {
    if (!MONGO_URI) throw new Error('MONGO_URI is not defined')
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  } catch (e) {
    console.error('Startup error:', e)
    process.exit(1)
  }
}

start()
