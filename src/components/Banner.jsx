import styled from 'styled-components'
import bannerImage from '../assets/hero.png'

const BannerWrapper = styled.section`
  position: relative;
  padding: 28px 24px 20px;
  margin: 0 auto 30px;
  max-width: 1200px;
  border-radius: 0;
  background: linear-gradient(135deg, rgba(11, 15, 20, 0.98), rgba(26, 31, 39, 0.98));
  border: 1px solid #2E3B2F;
  border-left: 3px solid #FF6A00;
  border-top: 2px solid #FF6A00;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.palette.shadowIntense};

  @media (max-width: 780px) {
    padding: 22px 18px 18px;
  }
`

const TitleGroup = styled.div`
  display: grid;
  gap: 12px;
  max-width: 720px;
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 0;
  background: rgba(255, 106, 0, 0.12);
  color: #E8EAED;
  font-size: 0.86rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid #FF6A00;
  font-weight: 600;
  box-shadow: 0 0 10px rgba(255, 106, 0, 0.2);
`

const Heading = styled.h1`
  margin: 0;
  color: #E8EAED;
  font-size: clamp(2.25rem, 3.3vw, 3.6rem);
  line-height: 0.98;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
  text-shadow: 0 0 15px rgba(255, 106, 0, 0.3);
`

const Subtitle = styled.p`
  margin: 0;
  color: #7a8088;
  font-size: 1rem;
  max-width: 740px;
  letter-spacing: 0.3px;
  line-height: 1.6;
`

const Decoration = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(circle at 85% 20%, rgba(255, 106, 0, 0.08) 0%, transparent 18%),
    radial-gradient(circle at 10% 10%, rgba(46, 59, 45, 0.1) 0%, transparent 24%);
`

const BannerImage = styled.img`
  position: absolute;
  right: 24px;
  top: 18px;
  width: min(380px, 40%);
  max-width: 420px;
  opacity: 0.9;
  filter: drop-shadow(0 0 20px rgba(255, 106, 0, 0.25));
  
  @media (max-width: 780px) {
    position: static;
    width: 100%;
    max-width: 100%;
    margin-top: 24px;
  }
`

export default function Banner() {
  return (
    <BannerWrapper>
      <Decoration />
      <Badge>CFC 2026 • Tiragem de Faltas</Badge>
      <TitleGroup>
        <Heading>TIRAGEM DE FALTAS</Heading>
        <Subtitle>Controle rápido e visível para conferência da turma de Formação de Cabos. Todas as alterações são persistidas no banco e atualizadas automaticamente.</Subtitle>
      </TitleGroup>
      <BannerImage src={bannerImage} alt="Banner da turma CFC 2026" />
    </BannerWrapper>
  )
}
