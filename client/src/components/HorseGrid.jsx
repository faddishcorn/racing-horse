import styled from "styled-components"
import { Star } from "lucide-react"

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: fadeIn 0.7s ease-out forwards;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 1rem; 
  }
`

const Card = styled.div`
  border: 1px solid var(--border);
  border-radius: 0.75rem; 
  background-color: var(--card);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); 

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); 
    transform: translateY(-5px); 
  }
`

const CardHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: start;
  justify-content: space-between;
`

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--foreground);
`

const CardDescription = styled.p`
  color: var(--muted-foreground);
  font-size: 0.875rem;
`

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem; 
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, color 0.2s ease;
  border-radius: 50%; 

  &:hover {
    transform: scale(1.2); 
    color: var(--accent); 
  }

  &:active {
    transform: scale(0.9); 
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${(props) => (props.$favorite ? "var(--accent)" : "var(--muted-foreground)")};
    fill: ${(props) => (props.$favorite ? "var(--accent)" : "none")};
  }
`

const CardContent = styled.div`
  padding: 1.25rem;
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const Label = styled.span`
  color: var(--muted-foreground);
`

const Value = styled.span`
  color: var(--foreground);
  font-weight: 500;
`

const Badge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem; 
  border-radius: 0.35rem; 
  font-size: 0.75rem;
  font-weight: 600; /* Bolder font weight */
  letter-spacing: 0.02em; /* Slight letter spacing */
  background-color: ${(props) => (props.$primary ? "var(--primary)" : "var(--secondary)")};
  color: ${(props) => (props.$primary ? "var(--primary-foreground)" : "var(--foreground)")};
  box-shadow: ${(props) => (props.$primary ? "0 2px 4px rgba(var(--primary-rgb), 0.2)" : "none")};
`

export default function HorseGrid({ horses, favorites, isLoggedIn, notes, onSelectHorse, onToggleFavorite }) {
  return (
    <GridContainer>
      {horses.map((horse) => (
        <Card key={horse.hrNo} onClick={() => onSelectHorse(horse)}>
          <CardHeader>
            <div>
              <CardTitle>{horse.hrName}</CardTitle>
              <CardDescription>마번: {horse.hrNo}</CardDescription>
            </div>
            {isLoggedIn && (
              <StarButton
                $favorite={favorites.includes(horse.hrNo)}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(horse.hrNo)
                }}
              >
                <Star />
              </StarButton>
            )}
          </CardHeader>
          <CardContent>
            <InfoRow>
              <Label>경마장</Label>
              <Badge>{horse.meet}</Badge>
            </InfoRow>
            <InfoRow>
              <Label>나이/성별</Label>
              <Value>
                {horse.age}세 / {horse.sex === "수" ? "수컷" : "암컷"}
              </Value>
            </InfoRow>
            <InfoRow>
              <Label>승률</Label>
              <Value style={{ color: "var(--primary)" }}>{horse.winRateT}%</Value>
            </InfoRow>
            <InfoRow>
              <Label>최근 순위</Label>
              <Badge $primary={horse.recentOrd === "1"}>{horse.recentOrd}위</Badge>
            </InfoRow>
          </CardContent>
        </Card>
      ))}
    </GridContainer>
  )
}
