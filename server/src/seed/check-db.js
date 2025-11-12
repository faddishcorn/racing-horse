import 'dotenv/config'
import mongoose from 'mongoose'
import Horse from '../models/Horse.js'

const MONGO_URI = process.env.MONGO_URI

async function check() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected\n')

    const total = await Horse.countDocuments()
    const withRaces = await Horse.countDocuments({ rcCntT: { $gt: 0 } })
    const withWins = await Horse.countDocuments({ ord1CntT: { $gt: 0 } })

    console.log('📊 Current Database Stats:')
    console.log(`   Total horses: ${total}`)
    console.log(`   With race records (rcCntT > 0): ${withRaces}`)
    console.log(`   Without race records: ${total - withRaces}`)
    console.log(`   With wins (ord1CntT > 0): ${withWins}`)

    // 샘플 데이터 확인
    console.log('\n📋 Sample horses WITH races:')
    const samplesWithRaces = await Horse.find({ rcCntT: { $gt: 0 } }).limit(3)
    samplesWithRaces.forEach((h) => {
      console.log(`   - ${h.hrName} (${h.hrNo}): ${h.rcCntT} races, ${h.ord1CntT} wins`)
    })

    console.log('\n📋 Sample horses WITHOUT races:')
    const samplesNoRaces = await Horse.find({ rcCntT: { $lte: 0 } }).limit(3)
    samplesNoRaces.forEach((h) => {
      console.log(`   - ${h.hrName} (${h.hrNo}): ${h.rcCntT} races`)
    })
  } catch (e) {
    console.error('Error:', e.message)
  } finally {
    await mongoose.disconnect()
  }
}

check()
