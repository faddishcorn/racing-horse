import 'dotenv/config'
import mongoose from 'mongoose'
import Horse from '../models/Horse.js'

const MONGO_URI = process.env.MONGO_URI

const sample = [
  {
    hrNo: 'H001',
    hrName: '썬더볼트',
    meet: '서울',
    age: 5,
    sex: '수',
    debut: '2020-03-15',
    rcCntT: 45,
    ord1CntT: 12,
    ord2CntT: 8,
    winRateT: 26.7,
    qnlRateT: 44.4,
    recentRcDate: '2025-01-15',
    recentOrd: 1,
    recentRcDist: 1800,
    recentRating: 95,
    recentBudam: 58,
    chaksunT: '1-2-3',
    popularity: 95,
  },
  {
    hrNo: 'H002',
    hrName: '골든스타',
    meet: '부산경남',
    age: 4,
    sex: '암',
    debut: '2021-05-20',
    rcCntT: 32,
    ord1CntT: 10,
    ord2CntT: 6,
    winRateT: 31.3,
    qnlRateT: 50.0,
    recentRcDate: '2025-01-20',
    recentOrd: 2,
    recentRcDist: 1400,
    recentRating: 92,
    recentBudam: 56,
    chaksunT: '2-1-1',
    popularity: 88,
  },
]

async function run() {
  try {
    if (!MONGO_URI) throw new Error('MONGO_URI is not defined')
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected')

    await Horse.deleteMany({})
    await Horse.insertMany(sample)
    console.log('Seed completed:', sample.length)
  } catch (e) {
    console.error(e)
  } finally {
    await mongoose.disconnect()
  }
}

run()
