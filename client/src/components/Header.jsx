import { useState } from "react"
import styled from "styled-components"
import { TrendingUp, User, LogIn, LogOut } from "lucide-react"
import LoginDialog from "./LoginDialog"

const HeaderWrapper = styled.header`
  border-bottom: 1px solid var(--border);
  background-color: var(--card);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease-out forwards;
`

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--foreground);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 640px) {
    span {
      display: none;
    }
  }
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  background-color: transparent;
  color: var(--foreground);
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--secondary);
    border-color: var(--primary);
    color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
    background-color: var(--secondary);
  }

  @media (max-width: 480px) {
    span {
      display: none;
    }
    padding: 0.5rem;
  }
`

export default function Header({ isLoggedIn, currentUser, onLogin, onLogout }) {
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  // 로그인 / 회원가입 모두 처리 (LoginDialog에서 세 번째 인자로 회원가입 여부 전달)
  const handleLogin = async (email, password, isRegister = false) => {
    const result = await onLogin(email, password, isRegister)
    if (result?.success) {
      setShowLoginDialog(false)
    }
  }

  return (
    <HeaderWrapper>
      <HeaderContent>
        <Logo>
          <TrendingUp size={32} color="var(--primary)" />
          <h1>이겨보자</h1>
        </Logo>

        <HeaderRight>
          {isLoggedIn ? (
            <>
              <UserInfo>
                <User size={20} />
                <span>{currentUser}</span>
              </UserInfo>
              <Button onClick={onLogout}>
                <LogOut size={16} />
                로그아웃
              </Button>
            </>
          ) : (
            <Button onClick={() => setShowLoginDialog(true)}>
              <LogIn size={16} />
              로그인
            </Button>
          )}
        </HeaderRight>
      </HeaderContent>
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLogin={handleLogin}
      />
    </HeaderWrapper>
  )
}
