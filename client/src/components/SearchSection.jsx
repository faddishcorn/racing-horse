import styled from "styled-components"
import { Search } from "lucide-react"

const Wrapper = styled.section`
  max-width: 720px;
  margin: 0 auto 2rem;
  text-align: center;
  animation: fadeIn 0.6s ease-out forwards;
`

const SearchBox = styled.div`
  position: relative;
`

const Icon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  display: inline-flex;
  align-items: center;
`

const Input = styled.input`
  width: 100%;
  height: 3rem;
  padding: 0 0.75rem 0 2.5rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--background);
  color: var(--foreground);
  font-size: 1rem;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-shadow), 0 0 0 1px var(--primary);
  }
`

const Hint = styled.p`
  margin-top: .75rem;
  font-size: .95rem; 
  color: var(--muted-foreground);
  animation: fadeIn 0.8s ease-out forwards;
`

export default function SearchSection({ searchQuery, onSearchChange }) {
  return (
    <Wrapper>
      <SearchBox>
        <Icon>
          <Search size={18} />
        </Icon>
        <Input
          type="text"
          placeholder="마명 또는 마번으로 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </SearchBox>
      <Hint>{searchQuery ? `"${searchQuery}" 검색 결과` : "인기 경주마"}</Hint>
    </Wrapper>
  )
}
