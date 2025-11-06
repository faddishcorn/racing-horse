"use client"

import { useState, useEffect } from "react"
import { Search, Star, TrendingUp, User, LogIn, LogOut, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { analyzeHorse } from "./actions"

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

export default function HorseRacingApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHorse, setSelectedHorse] = useState<(typeof mockHorses)[0] | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState("")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<string>("")
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

  const filteredHorses = searchQuery
    ? mockHorses.filter(
        (horse) =>
          horse.hrName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          horse.hrNo.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : mockHorses.sort((a, b) => b.popularity - a.popularity).slice(0, 5)

  const handleLogin = () => {
    if (loginEmail && loginPassword) {
      setIsLoggedIn(true)
      setCurrentUser(loginEmail)
      localStorage.setItem("currentUser", loginEmail)
      setShowLoginDialog(false)
      setLoginEmail("")
      setLoginPassword("")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser("")
    localStorage.removeItem("currentUser")
  }

  const toggleFavorite = (hrNo: string) => {
    const newFavorites = favorites.includes(hrNo) ? favorites.filter((f) => f !== hrNo) : [...favorites, hrNo]
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  const saveNote = (hrNo: string, note: string) => {
    const newNotes = { ...notes, [hrNo]: note }
    setNotes(newNotes)
    localStorage.setItem("notes", JSON.stringify(newNotes))
  }

  const addComment = () => {
    if (newComment && selectedHorse && isLoggedIn) {
      const comment = {
        id: comments.length + 1,
        hrNo: selectedHorse.hrNo,
        user: currentUser,
        content: newComment,
        date: new Date().toISOString().split("T")[0],
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  const horseComments = selectedHorse ? comments.filter((c) => c.hrNo === selectedHorse.hrNo) : []

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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">경주마 정보</h1>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground hidden sm:inline">{currentUser}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </Button>
              </>
            ) : (
              <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    로그인
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>로그인</DialogTitle>
                    <DialogDescription>댓글, 관심마, 노트 기능을 사용하려면 로그인하세요</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">이메일</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">비밀번호</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    <Button className="w-full" onClick={handleLogin}>
                      로그인
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="마명 또는 마번으로 검색..."
              className="pl-10 h-12 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {searchQuery ? `"${searchQuery}" 검색 결과` : "인기 경주마"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredHorses.map((horse) => (
            <Card
              key={horse.hrNo}
              className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
              onClick={() => setSelectedHorse(horse)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{horse.hrName}</CardTitle>
                    <CardDescription>마번: {horse.hrNo}</CardDescription>
                  </div>
                  {isLoggedIn && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(horse.hrNo)
                      }}
                    >
                      <Star
                        className={`h-5 w-5 ${favorites.includes(horse.hrNo) ? "fill-accent text-accent" : "text-muted-foreground"}`}
                      />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">경마장</span>
                    <Badge variant="secondary">{horse.meet}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">나이/성별</span>
                    <span>
                      {horse.age}세 / {horse.sex === "수" ? "수컷" : "암컷"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">승률</span>
                    <span className="font-semibold text-primary">{horse.winRateT}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">최근 순위</span>
                    <Badge variant={horse.recentOrd === "1" ? "default" : "outline"}>{horse.recentOrd}위</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedHorse && (
          <Dialog
            open={!!selectedHorse}
            onOpenChange={() => {
              setSelectedHorse(null)
              setAiAnalysis("")
            }}
          >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl">{selectedHorse.hrName}</DialogTitle>
                  {isLoggedIn && (
                    <Button variant="ghost" size="icon" onClick={() => toggleFavorite(selectedHorse.hrNo)}>
                      <Star
                        className={`h-6 w-6 ${favorites.includes(selectedHorse.hrNo) ? "fill-accent text-accent" : "text-muted-foreground"}`}
                      />
                    </Button>
                  )}
                </div>
                <DialogDescription>마번: {selectedHorse.hrNo}</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">기본 정보</TabsTrigger>
                  <TabsTrigger value="comments">댓글</TabsTrigger>
                  {isLoggedIn && <TabsTrigger value="note">내 노트</TabsTrigger>}
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <Card className="border-primary/30 bg-primary/5 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI 말 분석
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button onClick={handleAIAnalysis} disabled={isAnalyzing} className="w-full">
                        {isAnalyzing ? (
                          <>
                            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                            분석 중...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            AI로 말 분석하기
                          </>
                        )}
                      </Button>
                      {aiAnalysis && (
                        <div className="bg-card rounded-lg p-4 text-sm whitespace-pre-line border shadow-sm">
                          {aiAnalysis}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">기본 정보</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">경마장</span>
                          <span>{selectedHorse.meet}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">나이</span>
                          <span>{selectedHorse.age}세</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">성별</span>
                          <span>{selectedHorse.sex === "수" ? "수컷" : "암컷"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">데뷔</span>
                          <span>{selectedHorse.debut}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">통산 성적</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">출주</span>
                          <span>{selectedHorse.rcCntT}회</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">1위</span>
                          <span className="text-primary font-semibold">{selectedHorse.ord1CntT}회</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">2위</span>
                          <span>{selectedHorse.ord2CntT}회</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">승률</span>
                          <span className="text-primary font-semibold">{selectedHorse.winRateT}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">연대율</span>
                          <span>{selectedHorse.qnlRateT}%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="col-span-2">
                      <CardHeader>
                        <CardTitle className="text-sm">최근 경주</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">경주일</span>
                            <span>{selectedHorse.recentRcDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">순위</span>
                            <Badge variant={selectedHorse.recentOrd === "1" ? "default" : "outline"}>
                              {selectedHorse.recentOrd}위
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">거리</span>
                            <span>{selectedHorse.recentRcDist}m</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">레이팅</span>
                            <span>{selectedHorse.recentRating}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">부담중량</span>
                            <span>{selectedHorse.recentBudam}kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">착순</span>
                            <span>{selectedHorse.chaksunT}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="space-y-4">
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="comment">댓글 작성</Label>
                        <Textarea
                          id="comment"
                          placeholder="이 말에 대한 의견을 남겨주세요..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button onClick={addComment} disabled={!newComment}>
                          댓글 등록
                        </Button>
                      </div>
                      <div className="border-t pt-4 space-y-4">
                        {horseComments.length > 0 ? (
                          horseComments.map((comment) => (
                            <Card key={comment.id}>
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="bg-secondary text-xs">
                                        {comment.user[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{comment.user}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{comment.date}</span>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <p className="text-center text-muted-foreground py-8">
                            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">댓글을 작성하려면 로그인이 필요합니다</p>
                      <Button
                        onClick={() => {
                          setSelectedHorse(null)
                          setShowLoginDialog(true)
                        }}
                      >
                        로그인하기
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {isLoggedIn && (
                  <TabsContent value="note" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="note">분석 노트</Label>
                      <Textarea
                        id="note"
                        placeholder="이 말에 대한 개인 분석을 작성하세요..."
                        value={notes[selectedHorse.hrNo] || ""}
                        onChange={(e) => saveNote(selectedHorse.hrNo, e.target.value)}
                        rows={10}
                      />
                      <p className="text-xs text-muted-foreground">노트는 자동으로 저장됩니다</p>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </DialogContent>
          </Dialog>
        )}

        {isLoggedIn && favorites.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-accent fill-accent" />내 관심마
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockHorses
                .filter((horse) => favorites.includes(horse.hrNo))
                .map((horse) => (
                  <Card
                    key={horse.hrNo}
                    className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
                    onClick={() => setSelectedHorse(horse)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{horse.hrName}</CardTitle>
                          <CardDescription>마번: {horse.hrNo}</CardDescription>
                        </div>
                        <Star className="h-5 w-5 fill-accent text-accent" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">승률</span>
                          <span className="font-semibold text-primary">{horse.winRateT}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">최근 순위</span>
                          <Badge variant={horse.recentOrd === "1" ? "default" : "outline"}>{horse.recentOrd}위</Badge>
                        </div>
                        {notes[horse.hrNo] && (
                          <div className="mt-3 p-2 bg-muted rounded text-xs">
                            <p className="text-muted-foreground line-clamp-2">{notes[horse.hrNo]}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
