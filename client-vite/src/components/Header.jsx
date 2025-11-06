import { useState } from "react"
import styled from "styled-components"
import { TrendingUp, User, LogIn, LogOut } from "lucide-react"
import LoginDialog from "./LoginDialog"

const HeaderWrapper = styled.header`
  border-bottom: 1px solid var(--border);
  background-color: var(--card);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  transition: all 0.2s;

  &:hover {
    background-color: var(--secondary);
  }
`

export default function Header({ isLoggedIn, currentUser, onLogin, onLogout }) {
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const handleLogin = (email, password) => {
    onLogin(email, password)
    setShowLoginDialog(false)
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
            <>
              <Button onClick={() => setShowLoginDialog(true)}>
                <LogIn size={16} />
                로그인
              </Button>
              <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} onLogin={handleLogin} />
            </>
          )}
        </HeaderRight>
      </HeaderContent>
    </HeaderWrapper>
  )
}
