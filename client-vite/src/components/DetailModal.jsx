import { useState } from "react"
import styled from "styled-components"
import { Star, Sparkles } from "lucide-react"

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`

const Modal = styled.div`
  background-color: var(--card);
  border-radius: 0.5rem;
  width: 90%;
  max-width: 56rem;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2);
`

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  color: var(--foreground);
`

const Description = styled.p`
  color: var(--muted-foreground);
  font-size: 0.875rem;
`

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${(props) => (props.$favorite ? "var(--accent)" : "var(--muted-foreground)")};
    fill: ${(props) => (props.$favorite ? "var(--accent)" : "none")};
  }
`

const ModalContent = styled.div`
  padding: 1.5rem;
`

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
  gap: 1rem;
`

const TabButton = styled.button`
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => (props.$active ? "var(--primary)" : "var(--muted-foreground)")};
  border-bottom: ${(props) => (props.$active ? "2px solid var(--primary)" : "none")};
  font-weight: ${(props) => (props.$active ? "500" : "400")};
  transition: all 0.2s;
`

const TabContent = styled.div`
  display: ${(props) => (props.$active ? "block" : "none")};
`

const AICard = styled.div`
  border: 1px solid rgba(85, 115, 202, 0.3);
  border-radius: 0.5rem;
  background-color: rgba(85, 115, 202, 0.05);
  padding: 1rem;
  margin-bottom: 1.5rem;
`

const AIHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  h3 {
    font-size: 0.875rem;
    font-weight: bold;
    color: var(--foreground);
  }
`

const AnalyzeButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: opacity 0.2s;
  margin-bottom: 1rem;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const AnalysisBox = styled.div`
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  padding: 1rem;
  font-size: 0.875rem;
  white-space: pre-line;
  color: var(--foreground);
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const InfoCard = styled.div`
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: var(--background);

  h3 {
    font-size: 0.875rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: var(--foreground);
  }
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const InfoLabel = styled.span`
  color: var(--muted-foreground);
`

const InfoValue = styled.span`
  color: var(--foreground);
  font-weight: 500;
`

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props) => (props.$primary ? "var(--primary)" : "var(--secondary)")};
  color: ${(props) => (props.$primary ? "var(--primary-foreground)" : "var(--foreground)")};
`

const CommentSection = styled.div`
  margin-bottom: 1.5rem;
`

const CommentForm = styled.div`
  margin-bottom: 1rem;
`

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--foreground);
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background-color: var(--background);
  color: var(--foreground);
  font-family: inherit;
  font-size: 0.875rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`

const SubmitButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
`

const CommentCard = styled.div`
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: var(--background);
`

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`

const CommentUser = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  strong {
    font-size: 0.875rem;
    color: var(--foreground);
  }
`

const CommentDate = styled.span`
  font-size: 0.75rem;
  color: var(--muted-foreground);
`

const CommentContent = styled.p`
  font-size: 0.875rem;
  color: var(--foreground);
`

const EmptyMessage = styled.div`
  text-align: center;
  color: var(--muted-foreground);
  padding: 2rem 0;
`

const NoteTextarea = styled(Textarea)`
  min-height: 10rem;
`

const NoteSaveMessage = styled.p`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin-top: 0.5rem;
`

export default function DetailModal({
  horse,
  favorites,
  isLoggedIn,
  notes,
  comments,
  aiAnalysis,
  isAnalyzing,
  onClose,
  onToggleFavorite,
  onSaveNote,
  onAddComment,
  onAnalyze,
}) {
  const [activeTab, setActiveTab] = useState("info")
  const [newComment, setNewComment] = useState("")
  const horseComments = comments.filter((c) => c.hrNo === horse.hrNo)

  return (
  <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <Title>{horse.hrName}</Title>
            <Description>마번: {horse.hrNo}</Description>
          </div>
          {isLoggedIn && (
            <StarButton $favorite={favorites.includes(horse.hrNo)} onClick={() => onToggleFavorite(horse.hrNo)}>
              <Star />
            </StarButton>
          )}
        </ModalHeader>

        <ModalContent>
          <Tabs>
            <TabButton $active={activeTab === "info"} onClick={() => setActiveTab("info")}>
              기본 정보
            </TabButton>
            <TabButton $active={activeTab === "comments"} onClick={() => setActiveTab("comments")}>
              댓글
            </TabButton>
            {isLoggedIn && (
              <TabButton $active={activeTab === "note"} onClick={() => setActiveTab("note")}>
                내 노트
              </TabButton>
            )}
          </Tabs>

          <TabContent $active={activeTab === "info"}>
            <AICard>
              <AIHeader>
                <Sparkles size={16} color="var(--primary)" />
                <h3>AI 말 분석</h3>
              </AIHeader>
              <AnalyzeButton onClick={onAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Sparkles size={16} style={{ animation: "pulse 2s infinite" }} />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    AI로 말 분석하기
                  </>
                )}
              </AnalyzeButton>
              {aiAnalysis && <AnalysisBox>{aiAnalysis}</AnalysisBox>}
            </AICard>

            <InfoGrid>
              <InfoCard>
                <h3>기본 정보</h3>
                <InfoRow>
                  <InfoLabel>경마장</InfoLabel>
                  <InfoValue>{horse.meet}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>나이</InfoLabel>
                  <InfoValue>{horse.age}세</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>성별</InfoLabel>
                  <InfoValue>{horse.sex === "수" ? "수컷" : "암컷"}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>데뷔</InfoLabel>
                  <InfoValue>{horse.debut}</InfoValue>
                </InfoRow>
              </InfoCard>

              <InfoCard>
                <h3>통산 성적</h3>
                <InfoRow>
                  <InfoLabel>출주</InfoLabel>
                  <InfoValue>{horse.rcCntT}회</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>1위</InfoLabel>
                  <InfoValue style={{ color: "var(--primary)" }}>{horse.ord1CntT}회</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>2위</InfoLabel>
                  <InfoValue>{horse.ord2CntT}회</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>승률</InfoLabel>
                  <InfoValue style={{ color: "var(--primary)" }}>{horse.winRateT}%</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>연대율</InfoLabel>
                  <InfoValue>{horse.qnlRateT}%</InfoValue>
                </InfoRow>
              </InfoCard>

              <InfoCard style={{ gridColumn: "1 / -1" }}>
                <h3>최근 경주</h3>
                <InfoGrid style={{ margin: 0 }}>
                  <div>
                    <InfoRow>
                      <InfoLabel>경주일</InfoLabel>
                      <InfoValue>{horse.recentRcDate}</InfoValue>
                    </InfoRow>
                  </div>
                  <div>
                    <InfoRow>
                      <InfoLabel>순위</InfoLabel>
                      <Badge $primary={horse.recentOrd === "1"}>{horse.recentOrd}위</Badge>
                    </InfoRow>
                  </div>
                  <div>
                    <InfoRow>
                      <InfoLabel>거리</InfoLabel>
                      <InfoValue>{horse.recentRcDist}m</InfoValue>
                    </InfoRow>
                  </div>
                  <div>
                    <InfoRow>
                      <InfoLabel>레이팅</InfoLabel>
                      <InfoValue>{horse.recentRating}</InfoValue>
                    </InfoRow>
                  </div>
                  <div>
                    <InfoRow>
                      <InfoLabel>부담중량</InfoLabel>
                      <InfoValue>{horse.recentBudam}kg</InfoValue>
                    </InfoRow>
                  </div>
                  <div>
                    <InfoRow>
                      <InfoLabel>착순</InfoLabel>
                      <InfoValue>{horse.chaksunT}</InfoValue>
                    </InfoRow>
                  </div>
                </InfoGrid>
              </InfoCard>
            </InfoGrid>
          </TabContent>

          <TabContent $active={activeTab === "comments"}>
            {isLoggedIn ? (
              <CommentSection>
                <CommentForm>
                  <Label htmlFor="comment">댓글 작성</Label>
                  <Textarea
                    id="comment"
                    placeholder="이 말에 대한 의견을 남겨주세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <SubmitButton
                    disabled={!newComment}
                    onClick={() => {
                      onAddComment(newComment)
                      setNewComment("")
                    }}
                  >
                    댓글 등록
                  </SubmitButton>
                </CommentForm>

                <CommentsList>
                  {horseComments.length > 0 ? (
                    horseComments.map((comment) => (
                      <CommentCard key={comment.id}>
                        <CommentMeta>
                          <CommentUser>
                            <div
                              style={{
                                width: "1.5rem",
                                height: "1.5rem",
                                borderRadius: "50%",
                                backgroundColor: "var(--secondary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.75rem",
                              }}
                            >
                              {comment.user[0]}
                            </div>
                            <strong>{comment.user}</strong>
                          </CommentUser>
                          <CommentDate>{comment.date}</CommentDate>
                        </CommentMeta>
                        <CommentContent>{comment.content}</CommentContent>
                      </CommentCard>
                    ))
                  ) : (
                    <EmptyMessage>아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</EmptyMessage>
                  )}
                </CommentsList>
              </CommentSection>
            ) : (
              <EmptyMessage>댓글을 작성하려면 로그인이 필요합니다</EmptyMessage>
            )}
          </TabContent>

          {isLoggedIn && (
            <TabContent $active={activeTab === "note"}>
              <CommentForm>
                <Label htmlFor="note">분석 노트</Label>
                <NoteTextarea
                  id="note"
                  placeholder="이 말에 대한 개인 분석을 작성하세요..."
                  value={notes[horse.hrNo] || ""}
                  onChange={(e) => onSaveNote(horse.hrNo, e.target.value)}
                />
                <NoteSaveMessage>노트는 자동으로 저장됩니다</NoteSaveMessage>
              </CommentForm>
            </TabContent>
          )}
        </ModalContent>
      </Modal>
    </Overlay>
  )
}
