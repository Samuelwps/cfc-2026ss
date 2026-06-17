import styled from 'styled-components'

const SummaryCardWrapper = styled.article`
  display: grid;
  gap: 10px;
  padding: 20px 22px;
  border-radius: 22px;
  background: rgba(18, 26, 12, 0.9);
  border: 1px solid rgba(213, 180, 90, 0.14);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.18);
`

const SummaryLabel = styled.span`
  font-size: 0.88rem;
  letter-spacing: 0.08em;
  color: rgba(247, 243, 223, 0.72);
  text-transform: uppercase;
`

const SummaryValue = styled.strong`
  font-size: 1.95rem;
  line-height: 1;
  color: #f7f3df;
`

export default function SummaryCard({ label, value }) {
  return (
    <SummaryCardWrapper>
      <SummaryLabel>{label}</SummaryLabel>
      <SummaryValue>{value}</SummaryValue>
    </SummaryCardWrapper>
  )
}
