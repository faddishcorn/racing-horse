import { useState } from "react"
import styled from "styled-components"

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$open ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
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
`

export default function LoginDialog({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      onLogin(email, password)
      setEmail("")
      setPassword("")
    }
  }

  return (
    <Overlay $open={isOpen} onClick={onClose}>
      <DialogBox onClick={(e) => e.stopPropagation()}>
        <DialogTitle>로그인</DialogTitle>
        <DialogDescription>댓글, 관심마, 노트 기능을 사용하려면 로그인하세요</DialogDescription>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <Button type="submit">로그인</Button>
        </Form>
      </DialogBox>
    </Overlay>
  )
}
