import styled from 'styled-components'

const SummaryCardWrapper = styled.article`
  display: grid;
  gap: 10px;
  padding: 20px 22px;
  border-radius: 0;
  background: rgba(11, 15, 20, 0.95);
  border: 1px solid #2E3B2F;
  border-left: 3px solid #FF6A00;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 106, 0, 0.1);
  transition: all 0.2s linear;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, #FF6A00, transparent);
  }

  &:hover {
    border-color: #FF6A00;
    box-shadow: 0 15px 40px rgba(255, 106, 0, 0.2), inset 0 1px 0 rgba(255, 106, 0, 0.15);
    transform: translateY(-2px);
  }
`

const SummaryLabel = styled.span`
  font-size: 0.88rem;
  letter-spacing: 0.12em;
  color: #7a8088;
  text-transform: uppercase;
  font-weight: 600;
`

const SummaryValue = styled.strong`
  font-size: 1.95rem;
  line-height: 1;
  color: #FF6A00;
  text-shadow: 0 0 10px rgba(255, 106, 0, 0.3);
  font-weight: 700;
`

export default function SummaryCard({ label, value }) {
  return (
    <SummaryCardWrapper>
      <SummaryLabel>{label}</SummaryLabel>
      <SummaryValue>{value}</SummaryValue>
    </SummaryCardWrapper>
  )
}
