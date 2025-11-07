import OpenAI from 'openai'
import Horse from '../models/Horse.js'

const apiKey = process.env.OPENAI_API_KEY
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

let client = null
if (apiKey) {
  client = new OpenAI({ apiKey })
}

// 말 데이터를 요약용 프롬프트 문자열로 변환
function buildPrompt(horse) {
  return `경주마 데이터:
마번: ${horse.hrNo}
마명: ${horse.hrName}
경마장: ${horse.meet}
나이: ${horse.age}세 성별: ${horse.sex}
통산 출주: ${horse.rcCntT}회 1위: ${horse.ord1CntT}회 2위: ${horse.ord2CntT}회 승률: ${horse.winRateT}% 연대율: ${horse.qnlRateT}%
최근 경주일: ${horse.recentRcDate} 최근 순위: ${horse.recentOrd} 최근 거리: ${horse.recentRcDist}m 레이팅: ${horse.recentRating} 부담중량: ${horse.recentBudam}kg 착순 패턴: ${horse.chaksunT}

위 정보를 바탕으로:
1) 강점 3~5개
2) 약점 또는 리스크 2~4개
3) 종합 평가 2~3문장
간결하고 한국어로 출력. 목록은 하이픈(-)으로 시작.`
}

export async function analyzeHorseWithAI(hrNo) {
  const horse = await Horse.findOne({ hrNo })
  if (!horse) {
    return { success: false, error: 'Horse not found' }
  }

  // OpenAI 키 없으면 간단한 휴리스틱 결과 반환
  if (!client) {
    return heuristicAnalysis(horse)
  }

  const prompt = buildPrompt(horse)

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })
    const text = completion.choices?.[0]?.message?.content?.trim() || ''
    return { success: true, analysis: text, model }
  } catch (e) {
    console.error('OpenAI error:', e)
    return heuristicAnalysis(horse, 'AI 호출 오류로 휴리스틱 결과 반환')
  }
}

function heuristicAnalysis(horse, note) {
  const winRate = horse.winRateT || 0
  const recentOrd = horse.recentOrd || 99
  const strengths = []
  const risks = []

  if (winRate > 25) strengths.push('우수한 승률로 꾸준한 상위권 기대')
  else if (winRate > 15) strengths.push('중상위권 승률로 안정감')
  else risks.push('승률 개선 필요')

  if (recentOrd <= 2) strengths.push('최근 경기 순위가 매우 좋음')
  else if (recentOrd >= 6) risks.push('최근 순위 하락세 가능성')

  if (horse.ord1CntT > 10) strengths.push('다수 우승 경험 보유')
  else if (horse.ord1CntT === 0) risks.push('우승 경험 부족')

  if (!strengths.length) strengths.push('데이터 기반 무난한 성적')
  if (!risks.length) risks.push('현 수준 유지가 관건')

  const summary = recentOrd <= 3
    ? '최근 흐름이 좋아 단기 성적 상승 기대.'
    : '추가 훈련/전략 조정으로 성적 개선 여지 있음.'

  const analysis = `강점:\n${strengths.map(s => '- ' + s).join('\n')}\n\n리스크:\n${risks.map(r => '- ' + r).join('\n')}\n\n종합 평가:\n${summary}${note ? '\n\n참고: ' + note : ''}`
  return { success: true, analysis, heuristic: true }
}
