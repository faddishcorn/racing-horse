export async function analyzeHorse(horseData) {
  // 실제 분석하는 것처럼 약간의 지연 추가
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // 말 데이터를 기반으로 mock 분석 생성
  const winRate = Number.parseFloat(horseData.winRateT)
  const qnlRate = Number.parseFloat(horseData.qnlRateT)
  const recentOrd = Number.parseInt(horseData.recentOrd)
  const ord1Cnt = Number.parseInt(horseData.ord1CntT)
  const rcCnt = Number.parseInt(horseData.rcCntT)

  const strengths = []
  const weaknesses = []

  // 승률 기반 분석
  if (winRate > 20) {
    strengths.push("통산 승률이 매우 높아 안정적인 경기력을 보유하고 있습니다.")
  } else if (winRate > 10) {
    strengths.push("준수한 승률로 꾸준한 성적을 유지하고 있습니다.")
  } else {
    weaknesses.push("승률이 다소 낮아 일관성 있는 성적 향상이 필요합니다.")
  }

  // 연대율 기반 분석
  if (qnlRate > 50) {
    strengths.push("높은 연대율로 상위권 진입 능력이 뛰어납니다.")
  } else if (qnlRate < 30) {
    weaknesses.push("연대율이 낮아 상위권 경쟁력 강화가 필요합니다.")
  }

  // 최근 성적 기반 분석
  if (recentOrd <= 3) {
    strengths.push("최근 경기에서 좋은 성적을 거두며 상승세를 보이고 있습니다.")
  } else if (recentOrd >= 8) {
    weaknesses.push("최근 경기 성적이 부진하여 컨디션 조절이 필요해 보입니다.")
  }

  // 경험 기반 분석
  if (rcCnt > 30) {
    strengths.push("풍부한 출주 경험으로 다양한 상황에 대처할 수 있습니다.")
  } else if (rcCnt < 10) {
    weaknesses.push("출주 경험이 부족하여 경기 적응력 향상이 필요합니다.")
  }

  // 우승 경험 기반 분석
  if (ord1Cnt > 5) {
    strengths.push("다수의 우승 경험으로 승부처에서 강한 모습을 보입니다.")
  } else if (ord1Cnt === 0) {
    weaknesses.push("아직 우승 경험이 없어 결정적 순간의 돌파력이 필요합니다.")
  }

  // 기본값 설정
  if (strengths.length === 0) {
    strengths.push("꾸준한 출주로 경험을 쌓아가고 있습니다.")
  }
  if (weaknesses.length === 0) {
    weaknesses.push("전반적으로 안정적인 모습이나, 더 높은 성적을 위한 노력이 필요합니다.")
  }

  // 종합 평가
  let summary = ""
  if (winRate > 15 && qnlRate > 40) {
    summary = "전체적으로 우수한 능력을 갖춘 경쟁력 있는 경주마입니다."
  } else if (winRate > 10 || qnlRate > 30) {
    summary = "중상위권 실력을 보유하고 있으며, 꾸준한 관리로 더 나은 성적을 기대할 수 있습니다."
  } else {
    summary = "발전 가능성이 있으며, 체계적인 훈련과 관리가 필요한 단계입니다."
  }

  const analysis = `강점:
${strengths.map((s) => `- ${s}`).join("\n")}

약점:
${weaknesses.map((w) => `- ${w}`).join("\n")}

종합 평가:
${summary}`

  return { success: true, analysis }
}
