import styled from 'styled-components'
import logo from '../assets/logocfc2026.png'

const HeaderWrapper = styled.header`
  background: linear-gradient(135deg, #0B0F14 0%, #1a1f27 50%, #0B0F14 100%);
  border-bottom: 2px solid #2E3B2F;
  border-top: 3px solid #FF6A00;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 106, 0, 0.15);
  padding: 0 20px;
`

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 720px) {
    flex-direction: column;
    padding: 12px 0;
  }
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  padding: 0 12px;
  border-left: 3px solid #FF6A00;
  border-right: 1px solid #2E3B2F;
`

const LogoImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(255, 106, 0, 0.3));

  @media (max-width: 720px) {
    width: 40px;
    height: 40px;
  }
`

const Title = styled.h1`
  margin: 0;
  color: #E8EAED;
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 106, 0, 0.3);

  @media (max-width: 720px) {
    text-align: center;
    width: 100%;
    font-size: 1.1rem;
  }
`

const Nav = styled.nav`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 720px) {
    width: 100%;
    justify-content: space-between;
  }
`

const NavButton = styled.button`
  padding: 10px 20px;
  border: 1px solid ${(props) => (props.active ? '#FF6A00' : '#2E3B2F')};
  border-radius: 0;
  background: ${(props) => (props.active ? 'rgba(255, 106, 0, 0.15)' : 'rgba(255, 106, 0, 0)')};
  color: ${(props) => (props.active ? '#FF6A00' : '#E8EAED')};
  font-weight: ${(props) => (props.active ? '700' : '600')};
  cursor: pointer;
  transition: all 0.2s linear;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
  position: relative;
  font-size: 0.9rem;
  box-shadow: ${(props) => (props.active ? '0 0 15px rgba(255, 106, 0, 0.25), inset 0 1px 0 rgba(255, 106, 0, 0.3)' : 'none')};

  &:hover {
    background: rgba(255, 106, 0, 0.15);
    border-color: #FF6A00;
    box-shadow: 0 0 15px rgba(255, 106, 0, 0.25), inset 0 1px 0 rgba(255, 106, 0, 0.2);
    transform: translateY(-1px);
  }

  @media (max-width: 720px) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
`

export default function Header({ currentPage, onPageChange }) {
  return (
    <HeaderWrapper>
      <HeaderContent>
        <LogoContainer>
          <LogoImage src={logo} alt="Logo CFC 2026" />
          <Title>CFC 2026</Title>
        </LogoContainer>
        <Nav>
          <NavButton
            active={currentPage === 'faltas'}
            onClick={() => onPageChange('faltas')}
          >
            Tiragem de Faltas
          </NavButton>
          <NavButton
            active={currentPage === 'documentos'}
            onClick={() => onPageChange('documentos')}
          >
            Documentos
          </NavButton>
          <NavButton
            active={currentPage === 'cancoes'}
            onClick={() => onPageChange('cancoes')}
          >
            Canções
          </NavButton>
        </Nav>
      </HeaderContent>
    </HeaderWrapper>
  )
}
