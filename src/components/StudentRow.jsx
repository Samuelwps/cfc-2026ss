import styled from 'styled-components'
import StatusSelect from './StatusSelect'
import { statusConfig } from '../styles/theme'

const Row = styled.tr`
  transition: all 0.2s linear;
  background: rgba(46, 59, 45, 0.1);
  border-bottom: 1px solid #2E3B2F;

  &:hover {
    background: rgba(46, 59, 45, 0.2);
    box-shadow: inset 3px 0 0 #FF6A00;
  }
`

const Cell = styled.td`
  padding: 16px 14px;
  vertical-align: middle;
  color: #E8EAED;
  font-size: 0.98rem;
  border-right: 1px solid #2E3B2F;

  &:last-child {
    border-right: none;
  }

  &:first-child {
    font-weight: 700;
    width: 84px;
    color: #FF6A00;
    text-shadow: 0 0 8px rgba(255, 106, 0, 0.2);
  }

  &:nth-child(2) {
    min-width: 220px;
  }
`

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 0;
  font-size: 0.92rem;
  font-weight: 600;
  color: #E8EAED;
  background: ${({ color }) => `${color}20`};
  border: 1px solid ${({ color }) => color};
  box-shadow: 0 0 8px ${({ color }) => `${color}40`};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export default function StudentRow({ student, onStatusChange }) {
  const status = statusConfig[student.status] || statusConfig.CFC

  return (
    <Row>
      <Cell>{String(student.numero).padStart(2, '0')}</Cell>
      <Cell>{student.nome}</Cell>
      <Cell>
        <Chip color={status.color}>{student.status}</Chip>
      </Cell>
      <Cell>
        <StatusSelect
          value={student.status}
          onChange={(event) => onStatusChange(student.id, event.target.value)}
        />
      </Cell>
    </Row>
  )
}
