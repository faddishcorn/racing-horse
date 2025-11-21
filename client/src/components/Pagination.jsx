import styled from "styled-components"

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 2rem 0; 
  animation: fadeIn 0.8s ease-out forwards;
`

const Button = styled.button`
  padding: 0.6rem 1.1rem; 
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--foreground);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem; 
  transition: all 0.2s ease; 

  &:hover:not(:disabled) {
    background: var(--primary); 
    color: var(--primary-foreground);
    border-color: var(--primary);
    transform: translateY(-2px); 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
    background: var(--primary-shadow);
  }

  &:disabled {
    opacity: 0.6; /* More visible disabled state */
    cursor: not-allowed;
    background: var(--secondary);
    color: var(--muted-foreground);
  }
`

const Info = styled.span`
  font-size: 0.875rem;
  color: var(--muted-foreground);
`

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages

  return (
    <Bar>
      <Button disabled={prevDisabled} onClick={() => onPageChange(page - 1)}>
        이전
      </Button>
      <Info>
        페이지 {page} / {totalPages} · 총 {total}건
      </Info>
      <Button disabled={nextDisabled} onClick={() => onPageChange(page + 1)}>
        다음
      </Button>
    </Bar>
  )
}
