import styled from "styled-components"
import { Star } from "lucide-react"

const Section = styled.div`
  margin-top: 3rem;
`

const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--foreground);
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background-color: var(--card);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props) => (props.$primary ? "var(--primary)" : "var(--secondary)")};
  color: ${(props) => (props.$primary ? "var(--primary-foreground)" : "var(--foreground)")};
`

const NoteBox = styled.div`
  margin-top: 0.75rem;
  padding: 0.5rem;
  background-color: var(--secondary);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

export default function FavoritesSection({ horses, favorites, notes, onSelectHorse }) {
  const favoriteHorses = horses.filter((horse) => favorites.includes(horse.hrNo))

  return (
    <Section>
      <SectionTitle>
        <Star size={24} style={{ fill: "var(--accent)", color: "var(--accent)" }} />내 관심마
      </SectionTitle>
      <GridContainer>
        {favoriteHorses.map((horse) => (
          <Card key={horse.hrNo} onClick={() => onSelectHorse(horse)}>
            <CardHeader>
              <div>
                <CardTitle>{horse.hrName}</CardTitle>
                <CardDescription>마번: {horse.hrNo}</CardDescription>
              </div>
              <Star size={20} style={{ fill: "var(--accent)", color: "var(--accent)" }} />
            </CardHeader>
            <CardContent>
              <InfoRow>
                <Label>승률</Label>
                <Value style={{ color: "var(--primary)" }}>{horse.winRateT}%</Value>
              </InfoRow>
              <InfoRow>
                <Label>최근 순위</Label>
                <Badge $primary={horse.recentOrd === "1"}>{horse.recentOrd}위</Badge>
              </InfoRow>
              {notes[horse.hrNo] && <NoteBox>{notes[horse.hrNo]}</NoteBox>}
            </CardContent>
          </Card>
        ))}
      </GridContainer>
    </Section>
  )
}
