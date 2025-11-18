import 'dotenv/config'
import mongoose from 'mongoose'
import Horse from '../models/Horse.js'

const MONGO_URI = process.env.MONGO_URI
const SERVICE_KEY = process.env.SERVICE_KEY
const BASE_URL = process.env.BASE_URL

/**
 * 공공 API에서 경주마 데이터를 가져와 DB에 저장
 * @param {number} pageNo - 페이지 번호
 * @param {number} numOfRows - 페이지당 결과 수
 * @param {object} filters - 추가 검색 필터 (meet, fromRcDate, toRcDate 등)
 */
async function fetchHorses(pageNo = 1, numOfRows = 100, filters = {}) {
  const url = new URL(BASE_URL)
  url.searchParams.set('serviceKey', SERVICE_KEY)
  url.searchParams.set('pageNo', String(pageNo))
  url.searchParams.set('numOfRows', String(numOfRows))
  url.searchParams.set('_type', 'json')

  // 추가 필터 적용
  Object.entries(filters).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, String(value))
  })

  console.log(`Fetching: ${url.toString().substring(0, 120)}...`)

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}

/**
 * 공공 API 응답 아이템을 Horse 스키마 형식으로 변환
 * "-" 문자열은 null/0으로 처리
 */
function parseValue(val, defaultVal = '') {
  if (val === '-' || val === null || val === undefined) return defaultVal
  return val
}

function parseNumber(val, defaultVal = 0) {
  if (val === '-' || val === null || val === undefined || val === '') return defaultVal
  const parsed = Number(val)
  return isNaN(parsed) ? defaultVal : parsed
}

function mapToHorse(item) {
  return {
    hrNo: parseValue(item.hrNo, `H${Date.now()}_${Math.random()}`),
    hrName: parseValue(item.hrName, '이름없음'),
    meet: parseValue(item.meet),
    age: parseNumber(item.age),
    sex: parseValue(item.sex),
    debut: parseValue(item.debut),
    rcCntT: parseNumber(item.rcCntT),
    ord1CntT: parseNumber(item.ord1CntT),
    ord2CntT: parseNumber(item.ord2CntT),
    winRateT: parseNumber(item.winRateT),
    qnlRateT: parseNumber(item.qnlRateT),
    recentRcDate: parseValue(item.recentRcDate),
    recentOrd: parseNumber(item.recentOrd),
    recentRcDist: parseNumber(item.recentRcDist),
    recentRating: parseNumber(item.recentRating),
    recentBudam: parseValue(item.recentBudam), // "핸디캡", "별정A" 등 문자열
    chaksunT: parseNumber(item.chaksunT), // 상금 (숫자)
    // popularity 계산: 1위 횟수 + 승률 가중
    popularity: parseNumber(item.ord1CntT) * 10 + parseNumber(item.winRateT),
    raw: item,
  }
}

async function run() {
  try {
    if (!MONGO_URI) throw new Error('MONGO_URI is not defined')
    if (!SERVICE_KEY) throw new Error('SERVICE_KEY is not defined')

    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected')

    const allHorses = []
    // 동적 페이지 범위 및 딜레이 (환경변수로 조정 가능)
    const startPage = parseInt(process.env.SEED_START_PAGE || '1', 10)
    const endPage = parseInt(process.env.SEED_END_PAGE || '41', 10) // totalCount 4055 / 100 = ~41페이지 기본값
    const delayMs = parseInt(process.env.SEED_DELAY_MS || '300', 10)
    
    console.log(`Fetching all pages (${startPage} to ${endPage})...`)

    // 전체 페이지 가져오기
    for (let page = startPage; page <= endPage; page++) {
      console.log(`Fetching page ${page}/${endPage}...`)
      const data = await fetchHorses(page, 100, {})

      // 응답 구조에서 items 추출
      let items = []
      if (data?.response?.body?.items?.item) {
        items = Array.isArray(data.response.body.items.item)
          ? data.response.body.items.item
          : [data.response.body.items.item]
      } else if (data?.items) {
        items = Array.isArray(data.items) ? data.items : [data.items]
      } else {
        console.warn(`Page ${page}: No items found`)
        continue
      }

      const horses = items.map(mapToHorse)
      allHorses.push(...horses)

      // API 부하 방지 딜레이
      if (page < endPage && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }

    if (allHorses.length === 0) {
      console.log('No horses fetched from API.')
      return
    }

    console.log(`\n✅ Fetched ${allHorses.length} horses from API`)

    // 경주 기록이 있는 말만 필터링 (rcCntT > 0)
    const validHorses = allHorses.filter((h) => h.rcCntT > 0)
    console.log(`📊 Filtered ${validHorses.length} horses with race records (rcCntT > 0)`)

    if (validHorses.length === 0) {
      console.log('No horses with race records to sync.')
      return
    }

    // bulkWrite로 Upsert (hrNo 기준)
    const operations = validHorses.map((horse) => ({
      updateOne: {
        filter: { hrNo: horse.hrNo },
        update: { $set: horse },
        upsert: true,
      },
    }))

    console.log(`\n🔄 Starting bulkWrite upsert for ${operations.length} horses...`)
    const result = await Horse.bulkWrite(operations, { ordered: false })
    
    console.log(`\n✅ Sync completed!`)
    console.log(`   - Inserted: ${result.insertedCount || result.upsertedCount}`)
    console.log(`   - Updated: ${result.modifiedCount}`)
    console.log(`   - Total matched: ${result.matchedCount}`)

    // 최종 DB 통계
    const totalInDB = await Horse.countDocuments()
    const withWins = await Horse.countDocuments({ ord1CntT: { $gt: 0 } })
    console.log(`\n📈 Database stats:`)
    console.log(`   - Total horses: ${totalInDB}`)
    console.log(`   - With wins: ${withWins}`)
  } catch (e) {
    console.error('❌ Sync error:', e.message)
    if (e.writeErrors) {
      console.error('Write errors (first 3):', e.writeErrors.slice(0, 3))
    }
  } finally {
    await mongoose.disconnect()
    console.log('\nMongoDB disconnected')
  }
}

run()
