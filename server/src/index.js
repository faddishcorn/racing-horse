import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import horseRouter from './routes/horses.js'
import healthRouter from './routes/health.js'
import userRouter from './routes/users.js'
import commentRouter from './routes/comments.js'
import aiRouter from './routes/ai.js'
import authRouter from './routes/auth.js'

const app = express()

// 기본 미들웨어
app.use(helmet())
// CORS: 배포/개발 모두 지원 (쿠키 사용을 위해 allowlist 기반)
const defaultOrigins = ['http://localhost:5173', 'http://localhost:3000']
const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)
const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultOrigins

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // 비브라우저/서버 간 통신(예: 서버 헬스체크)에서는 origin이 없을 수 있음
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error(`Not allowed by CORS: ${origin}`))
  },
}
app.use(cors(corsOptions))
// 사전 요청(OPTIONS) 처리 보장
app.options('*', cors(corsOptions))
// 로깅: 개발은 간단한 'dev', 배포는 표준 'combined' 또는 비활성화 선택
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}
app.use(express.json())
app.use(cookieParser())

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
const HOST = process.env.HOST || '0.0.0.0'

async function start() {
  try {
    if (!MONGO_URI) throw new Error('MONGO_URI is not defined')
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected')
    if (process.env.NODE_ENV === 'production') {
      app.set('trust proxy', 1)
    }
    app.listen(PORT, HOST, () => {
      const env = process.env.NODE_ENV || 'development'
      console.log(`Server listening on ${HOST}:${PORT} (env: ${env})`)
    })
  } catch (e) {
    console.error('Startup error:', e)
    process.exit(1)
  }
}

start()
