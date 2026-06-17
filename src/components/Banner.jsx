import styled from 'styled-components'
import bannerImage from '../assets/hero.png'

const BannerWrapper = styled.section`
  position: relative;
  padding: 28px 24px 20px;
  margin: 0 auto 30px;
  max-width: 1200px;
  border-radius: 32px;
  background: linear-gradient(180deg, rgba(46, 59, 27, 0.94), rgba(17, 22, 10, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.palette.shadow};

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
  border-radius: 999px;
  background: rgba(213, 180, 90, 0.18);
  color: #f7f3df;
  font-size: 0.86rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid rgba(213, 180, 90, 0.24);
`

const Heading = styled.h1`
  margin: 0;
  color: #f7f3df;
  font-size: clamp(2.25rem, 3.3vw, 3.6rem);
  line-height: 0.98;
  letter-spacing: -0.07em;
`

const Subtitle = styled.p`
  margin: 0;
  color: rgba(247, 243, 223, 0.78);
  font-size: 1rem;
  max-width: 740px;
`

const Decoration = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(circle at 85% 20%, rgba(213, 180, 90, 0.12) 0%, transparent 18%),
    radial-gradient(circle at 10% 10%, rgba(255, 255, 255, 0.08) 0%, transparent 24%);
`

const BannerImage = styled.img`
  position: absolute;
  right: 24px;
  top: 18px;
  width: min(380px, 40%);
  max-width: 420px;
  opacity: 0.95;
  filter: drop-shadow(0 24px 40px rgba(0, 0, 0, 0.35));
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
