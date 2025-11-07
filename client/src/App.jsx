import { useState, useEffect } from "react"
import styled from "styled-components"
import Header from "./components/Header"
import SearchSection from "./components/SearchSection"
import HorseGrid from "./components/HorseGrid"
import DetailModal from "./components/DetailModal"
import FavoritesSection from "./components/FavoriteSection"
import Pagination from "./components/Pagination"
import { analyzeHorse } from "./utils/analysisService"

const mockHorses = [
  {
    hrNo: "H001",
    hrName: "썬더볼트",
    meet: "서울",
    age: "5",
    sex: "수",
    debut: "2020-03-15",
    rcCntT: "45",
    ord1CntT: "12",
    ord2CntT: "8",
    winRateT: "26.7",
    qnlRateT: "44.4",
    recentRcDate: "2025-01-15",
    recentOrd: "1",
    recentRcDist: "1800",
    recentRating: "95",
    recentBudam: "58",
    chaksunT: "1-2-3",
    popularity: 95,
  },
  {
    hrNo: "H002",
    hrName: "골든스타",
    meet: "부산경남",
    age: "4",
    sex: "암",
    debut: "2021-05-20",
    rcCntT: "32",
    ord1CntT: "10",
    ord2CntT: "6",
    winRateT: "31.3",
    qnlRateT: "50.0",
    recentRcDate: "2025-01-20",
    recentOrd: "2",
    recentRcDist: "1400",
    recentRating: "92",
    recentBudam: "56",
    chaksunT: "2-1-1",
    popularity: 88,
  },
  {
    hrNo: "H003",
    hrName: "스피드킹",
    meet: "서울",
    age: "6",
    sex: "수",
    debut: "2019-08-10",
    rcCntT: "58",
    ord1CntT: "15",
    ord2CntT: "12",
    winRateT: "25.9",
    qnlRateT: "46.6",
    recentRcDate: "2025-01-18",
    recentOrd: "3",
    recentRcDist: "2000",
    recentRating: "90",
    recentBudam: "60",
    chaksunT: "3-2-1",
    popularity: 82,
  },
  {
    hrNo: "H004",
    hrName: "블루윈드",
    meet: "제주",
    age: "3",
    sex: "암",
    debut: "2022-11-05",
    rcCntT: "18",
    ord1CntT: "5",
    ord2CntT: "4",
    winRateT: "27.8",
    qnlRateT: "50.0",
    recentRcDate: "2025-01-22",
    recentOrd: "1",
    recentRcDist: "1200",
    recentRating: "88",
    recentBudam: "54",
    chaksunT: "1-1-2",
    popularity: 75,
  },
  {
    hrNo: "H005",
    hrName: "다이아몬드",
    meet: "서울",
    age: "5",
    sex: "수",
    debut: "2020-07-12",
    rcCntT: "42",
    ord1CntT: "8",
    ord2CntT: "10",
    winRateT: "19.0",
    qnlRateT: "42.9",
    recentRcDate: "2025-01-10",
    recentOrd: "4",
    recentRcDist: "1600",
    recentRating: "85",
    recentBudam: "57",
    chaksunT: "4-2-1",
    popularity: 68,
  },
]

const mockComments = [
  { id: 1, hrNo: "H001", user: "경마팬123", content: "최근 컨디션이 정말 좋아 보입니다!", date: "2025-01-25" },
  { id: 2, hrNo: "H001", user: "말분석가", content: "장거리에서 강한 모습을 보여주네요", date: "2025-01-24" },
  { id: 3, hrNo: "H002", user: "골든팬", content: "다음 경주가 기대됩니다", date: "2025-01-23" },
]

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: var(--background);
  color: var(--foreground);
`

const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

export default function App() {
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedHorse, setSelectedHorse] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const [favorites, setFavorites] = useState([])
  const [notes, setNotes] = useState({})
  const [comments, setComments] = useState(mockComments)
  const [aiAnalysis, setAiAnalysis] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    const savedFavorites = localStorage.getItem("favorites")
    const savedNotes = localStorage.getItem("notes")

    if (savedUser) {
      setIsLoggedIn(true)
      setCurrentUser(savedUser)
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // 검색어 변경 시 페이지를 1로 리셋
  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  // 전체 리스트(검색 적용, 기본은 인기순 정렬). 준비 단계에선 클라이언트 페이징.
  const filteredHorses = searchQuery
    ? mockHorses.filter(
        (horse) =>
          horse.hrName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          horse.hrNo.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [...mockHorses].sort((a, b) => b.popularity - a.popularity)

  const totalCount = filteredHorses.length
  const startIdx = (page - 1) * pageSize
  const paginatedHorses = filteredHorses.slice(startIdx, startIdx + pageSize)

  const handleLogin = (email, password) => {
    if (email && password) {
      setIsLoggedIn(true)
      setCurrentUser(email)
      localStorage.setItem("currentUser", email)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser("")
    localStorage.removeItem("currentUser")
  }

  const toggleFavorite = (hrNo) => {
    const newFavorites = favorites.includes(hrNo) ? favorites.filter((f) => f !== hrNo) : [...favorites, hrNo]
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  const saveNote = (hrNo, note) => {
    const newNotes = { ...notes, [hrNo]: note }
    setNotes(newNotes)
    localStorage.setItem("notes", JSON.stringify(newNotes))
  }

  const addComment = (content) => {
    if (content && selectedHorse && isLoggedIn) {
      const comment = {
        id: comments.length + 1,
        hrNo: selectedHorse.hrNo,
        user: currentUser,
        content: content,
        date: new Date().toISOString().split("T")[0],
      }
      setComments([...comments, comment])
    }
  }

  const handleAIAnalysis = async () => {
    if (!selectedHorse) return

    setIsAnalyzing(true)
    setAiAnalysis("")

    const result = await analyzeHorse({
      hrName: selectedHorse.hrName,
      age: selectedHorse.age,
      sex: selectedHorse.sex,
      rcCntT: selectedHorse.rcCntT,
      ord1CntT: selectedHorse.ord1CntT,
      winRateT: selectedHorse.winRateT,
      qnlRateT: selectedHorse.qnlRateT,
      recentOrd: selectedHorse.recentOrd,
      recentRating: selectedHorse.recentRating,
      recentBudam: selectedHorse.recentBudam,
      chaksunT: selectedHorse.chaksunT,
    })

    setIsAnalyzing(false)

    if (result.success) {
      setAiAnalysis(result.analysis)
    } else {
      setAiAnalysis("분석 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <AppContainer>
      <Header isLoggedIn={isLoggedIn} currentUser={currentUser} onLogin={handleLogin} onLogout={handleLogout} />

      <Main>
        <SearchSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <HorseGrid
          horses={paginatedHorses}
          favorites={favorites}
          isLoggedIn={isLoggedIn}
          notes={notes}
          onSelectHorse={setSelectedHorse}
          onToggleFavorite={toggleFavorite}
        />

        {totalCount > pageSize && (
          <Pagination page={page} pageSize={pageSize} total={totalCount} onPageChange={setPage} />)
        }

        {selectedHorse && (
          <DetailModal
            horse={selectedHorse}
            favorites={favorites}
            isLoggedIn={isLoggedIn}
            notes={notes}
            comments={comments}
            aiAnalysis={aiAnalysis}
            isAnalyzing={isAnalyzing}
            onClose={() => {
              setSelectedHorse(null)
              setAiAnalysis("")
            }}
            onToggleFavorite={toggleFavorite}
            onSaveNote={saveNote}
            onAddComment={addComment}
            onAnalyze={handleAIAnalysis}
          />
        )}

        {isLoggedIn && favorites.length > 0 && (
          <FavoritesSection horses={mockHorses} favorites={favorites} notes={notes} onSelectHorse={setSelectedHorse} />
        )}
      </Main>
    </AppContainer>
  )
}
