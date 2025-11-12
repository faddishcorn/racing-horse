import 'dotenv/config'
import mongoose from 'mongoose'
import Horse from '../models/Horse.js'

const MONGO_URI = process.env.MONGO_URI

async function cleanup() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected\n')

    const beforeCount = await Horse.countDocuments()
    console.log(`Total horses before cleanup: ${beforeCount}`)

    // rcCntT가 0 이하인 말 삭제
    const result = await Horse.deleteMany({ rcCntT: { $lte: 0 } })
    console.log(`\n✅ Deleted ${result.deletedCount} horses without race records`)

    const afterCount = await Horse.countDocuments()
    console.log(`Total horses after cleanup: ${afterCount}`)

    // 최종 통계
    const withWins = await Horse.countDocuments({ ord1CntT: { $gt: 0 } })
    console.log(`\n📊 Final stats:`)
    console.log(`   Total: ${afterCount}`)
    console.log(`   With wins: ${withWins}`)
  } catch (e) {
    console.error('Error:', e.message)
  } finally {
    await mongoose.disconnect()
  }
}

cleanup()
