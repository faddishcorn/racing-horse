import { useState } from "react"
import { createPortal } from 'react-dom'
import styled from "styled-components"

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  backdrop-filter: blur(2px);
`

const DialogBox = styled.div`
  background-color: var(--card);
  border-radius: 0.5rem;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`

const DialogTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--foreground);
`

const DialogDescription = styled.p`
  color: var(--muted-foreground);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-weight: 500;
  color: var(--foreground);
  font-size: 0.875rem;
`

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background-color: var(--background);
  color: var(--foreground);
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(85, 115, 202, 0.1);
  }
`

const Button = styled.button`
  padding: 0.75rem;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SecondaryButton = styled(Button)`
  background-color: var(--secondary);
  color: var(--foreground);
`

const TabButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`

const TabButton = styled.button`
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-bottom: ${(props) => (props.$active ? "2px solid var(--primary)" : "none")};
  color: ${(props) => (props.$active ? "var(--primary)" : "var(--muted-foreground)")};
  font-weight: ${(props) => (props.$active ? "500" : "400")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: var(--primary);
  }
`

const ErrorMessage = styled.p`
  color: var(--destructive);
  font-size: 0.75rem;
  margin-top: -0.5rem;
`

export default function LoginDialog({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState("login") // "login" or "register"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.")
      return
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.")
      return
    }

    setIsLoading(true)

    try {
      const result = await onLogin(email, password, mode === "register")
      if (result?.success) {
        setEmail("")
        setPassword("")
        onClose()
      }
    } catch (err) {
      setError(err.message || "오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail("")
    setPassword("")
    setError("")
    setMode("login")
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <Overlay onClick={handleClose}>
      <DialogBox onClick={(e) => e.stopPropagation()}>
        <TabButtons>
          <TabButton $active={mode === "login"} onClick={() => setMode("login")}>
            로그인
          </TabButton>
          <TabButton $active={mode === "register"} onClick={() => setMode("register")}>
            회원가입
          </TabButton>
        </TabButtons>

        <DialogTitle>{mode === "login" ? "로그인" : "회원가입"}</DialogTitle>
        <DialogDescription>
          {mode === "login"
            ? "댓글, 관심마, 노트 기능을 사용하려면 로그인하세요"
            : "새 계정을 만들어 모든 기능을 이용하세요"}
        </DialogDescription>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">비밀번호 (6자 이상)</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
          </Button>
        </Form>
      </DialogBox>
    </Overlay>,
    document.body
  )
}
