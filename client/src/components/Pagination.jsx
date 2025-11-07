import styled from "styled-components"

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 1rem 0 2rem;
`

const Button = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--foreground);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s, opacity 0.2s;

  &:hover:not(:disabled) {
    background: var(--secondary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
