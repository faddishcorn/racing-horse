import { useState, useEffect } from "react"
import styled from "styled-components"
import Header from "./components/Header"
import SearchSection from "./components/SearchSection"
import HorseGrid from "./components/HorseGrid"
import DetailModal from "./components/DetailModal"
import FavoritesSection from "./components/FavoriteSection"
import Pagination from "./components/Pagination"
import * as authAPI from "./api/authAPI"
import * as horseAPI from "./api/horseAPI"
import * as commentAPI from "./api/commentAPI"
import * as aiAPI from "./api/aiAPI"

// 말 데이터는 API에서 조회

// 댓글은 선택된 말 기준으로 API에서 로드

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
  const [pageSize, setPageSize] = useState(8) // 첫 페이지 8마리 요구사항
  const [horses, setHorses] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isHorseLoading, setIsHorseLoading] = useState(false)
  const [horseError, setHorseError] = useState("")
  const [selectedHorse, setSelectedHorse] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const [favorites, setFavorites] = useState([])
  const [favoriteHorses, setFavoriteHorses] = useState([])
  const [notes, setNotes] = useState({})
  const [comments, setComments] = useState([])
  const [commentPage, setCommentPage] = useState(1)
  const [commentLimit] = useState(20)
  const [isCommentLoading, setIsCommentLoading] = useState(false)
  const [commentError, setCommentError] = useState("")
  const [aiAnalysis, setAiAnalysis] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiError, setAiError] = useState("")

  // 페이지 로드 시 세션 상태 확인 (항상 200 응답)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { authenticated, user } = await authAPI.getSession()
        if (authenticated && user) {
          setIsLoggedIn(true)
          setCurrentUser(user.email)
          setFavorites(user.favorites || [])
          setNotes(user.notes || {})
        } else {
          setIsLoggedIn(false)
          setCurrentUser("")
          setFavorites([])
          setNotes({})
        }
      } catch (_e) {
        // 예외적으로 오류가 나더라도 비로그인으로 처리
        setIsLoggedIn(false)
        setCurrentUser("")
        setFavorites([])
        setNotes({})
      }
    }

    checkSession()
  }, [])

  // 검색어 변경 시 페이지를 1로 리셋
  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  // 말 데이터 서버에서 조회
  useEffect(() => {
    const fetchHorses = async () => {
      setIsHorseLoading(true)
      setHorseError("")
      try {
        const params = {
          page,
          limit: pageSize,
          sort: 'popularity',
          hasRecords: true,
        }
        if (searchQuery) {
          params.hr_name = searchQuery
        }
        const data = await horseAPI.getHorses(params)
        setHorses(data.items || [])
        setTotalCount(data.total || 0)
        setTotalPages(data.totalPages || 1)
      } catch (e) {
        console.error('Horse fetch error:', e)
        setHorseError(e.response?.data?.error || '말 데이터를 불러오는 데 실패했습니다.')
      } finally {
        setIsHorseLoading(false)
      }
    }
    fetchHorses()
  }, [searchQuery, page, pageSize])

  // 즐겨찾기 말 상세 별도 로드 (페이지/검색과 무관)
  useEffect(() => {
    const loadFavoriteHorses = async () => {
      if (!isLoggedIn) {
        setFavoriteHorses([])
        return
      }
      if (!favorites || favorites.length === 0) {
        setFavoriteHorses([])
        return
      }
      try {
        const results = await Promise.all(
          favorites.map((hrNo) =>
            horseAPI.getHorse(hrNo).catch(() => null)
          )
        )
        const list = results.filter(Boolean)
        // 즐겨찾기 순서 유지
        const ordered = favorites
          .map((hrNo) => list.find((h) => h.hrNo === hrNo))
          .filter(Boolean)
        setFavoriteHorses(ordered)
      } catch (e) {
        console.error('Favorite horses fetch error:', e)
      }
    }
    loadFavoriteHorses()
  }, [isLoggedIn, favorites])

  const handleLogin = async (email, password, isRegister = false) => {
    try {
      let data
      if (isRegister) {
        data = await authAPI.register(email, password)
        alert("회원가입이 완료되었습니다!")
      } else {
        data = await authAPI.login(email, password)
      }
      
      setIsLoggedIn(true)
      setCurrentUser(data.user.email)
      setFavorites(data.user.favorites || [])
      setNotes(data.user.notes || {})
      return { success: true }
    } catch (error) {
      console.error(isRegister ? "Register error:" : "Login error:", error)
      const errorMessage = error.response?.data?.error || (isRegister ? "회원가입에 실패했습니다." : "로그인에 실패했습니다.")
      alert(errorMessage)
      return { success: false, error }
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      setIsLoggedIn(false)
      setCurrentUser("")
      setFavorites([])
      setNotes({})
    } catch (error) {
      console.error("Logout error:", error)
      // 로그아웃은 클라이언트에서도 처리
      setIsLoggedIn(false)
      setCurrentUser("")
      setFavorites([])
      setNotes({})
    }
  }

  const toggleFavorite = async (hrNo) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.")
      return
    }

    try {
      const data = await authAPI.toggleFavorite(hrNo)
      setFavorites(data.favorites)
    } catch (error) {
      console.error("Toggle favorite error:", error)
      alert("즐겨찾기 업데이트에 실패했습니다.")
    }
  }

  const saveNote = async (hrNo, note) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.")
      return
    }

    try {
      const data = await authAPI.saveNote(hrNo, note)
      setNotes(data.notes)
    } catch (error) {
      console.error("Save note error:", error)
      alert("노트 저장에 실패했습니다.")
    }
  }

  // 댓글 로드 (말 선택 시 또는 페이지 변경 시)
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedHorse) return
      setIsCommentLoading(true)
      setCommentError("")
      try {
        const data = await commentAPI.getComments(selectedHorse.hrNo, commentPage, commentLimit)
        // 서버는 items에 userEmail을 제공 → UI에서 user 필드 사용 위해 매핑
        const mapped = (data.items || []).map(c => ({
          id: c.id,
            hrNo: c.hrNo,
            user: c.userEmail,
            content: c.content,
            date: new Date(c.createdAt).toISOString().split('T')[0]
        }))
        setComments(mapped)
      } catch (e) {
        console.error('Comment fetch error:', e)
        setCommentError(e.response?.data?.error || '댓글을 불러오는 데 실패했습니다.')
      } finally {
        setIsCommentLoading(false)
      }
    }
    fetchComments()
  }, [selectedHorse, commentPage, commentLimit])

  const addComment = async (content) => {
    if (!content || !selectedHorse) return
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.')
      return
    }
    try {
      const created = await commentAPI.postComment(selectedHorse.hrNo, currentUser, content)
      const newComment = {
        id: created.id,
        hrNo: created.hrNo,
        user: created.userEmail,
        content: created.content,
        date: new Date(created.createdAt).toISOString().split('T')[0]
      }
      setComments([newComment, ...comments])
    } catch (e) {
      console.error('Comment post error:', e)
      alert(e.response?.data?.error || '댓글 작성 실패')
    }
  }

  const handleAIAnalysis = async () => {
    if (!selectedHorse) return
    setIsAnalyzing(true)
    setAiAnalysis("")
    setAiError("")
    try {
      const result = await aiAPI.analyzeHorse(selectedHorse.hrNo)
      if (result.success) {
        setAiAnalysis(result.analysis)
      } else {
        setAiError(result.error || '분석 실패')
      }
    } catch (e) {
      console.error('AI analyze error:', e)
      setAiError(e.response?.data?.error || 'AI 분석 호출 실패')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <AppContainer>
      <Header isLoggedIn={isLoggedIn} currentUser={currentUser} onLogin={handleLogin} onLogout={handleLogout} />

      <Main>
        <SearchSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {horseError && <p style={{ color: 'var(--destructive)' }}>{horseError}</p>}
        {isHorseLoading && <p style={{ color: 'var(--muted-foreground)' }}>불러오는 중...</p>}
        {!isHorseLoading && !horseError && (
          <HorseGrid
            horses={horses}
            favorites={favorites}
            isLoggedIn={isLoggedIn}
            notes={notes}
            onSelectHorse={setSelectedHorse}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {totalCount > pageSize && (
          <Pagination page={page} pageSize={pageSize} total={totalCount} onPageChange={setPage} />
        )}

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
              setAiError("")
            }}
            onToggleFavorite={toggleFavorite}
            onUpdateNote={(hrNo, content) => {
              // 로컬 메모만 갱신 (API 호출 없음)
              setNotes(prev => ({ ...prev, [hrNo]: content }))
            }}
            onPersistNote={async (hrNo, content) => {
              await saveNote(hrNo, content) // 기존 API 호출 재사용
            }}
            onAddComment={addComment}
            onAnalyze={handleAIAnalysis}
          />
        )}

        {isLoggedIn && favorites.length > 0 && (
          <FavoritesSection horses={favoriteHorses} favorites={favorites} notes={notes} onSelectHorse={setSelectedHorse} />
        )}
      </Main>
    </AppContainer>
  )
}
