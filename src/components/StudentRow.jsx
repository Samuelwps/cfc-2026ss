import styled from 'styled-components'
import StatusSelect from './StatusSelect'
import { statusConfig } from '../styles/theme'

const Row = styled.tr`
  transition: background 0.25s ease;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`

const Cell = styled.td`
  padding: 16px 14px;
  vertical-align: middle;
  color: #f7f3df;
  font-size: 0.98rem;

  &:first-child {
    font-weight: 700;
    width: 84px;
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
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 600;
  color: #f7f3df;
  background: ${({ color }) => `${color}22`};
  border: 1px solid ${({ color }) => `${color}44`};
`

export default function StudentRow({ student, onStatusChange }) {
  const status = statusConfig[student.status] || statusConfig.CFC

  return (
    <Row>
      <Cell>{String(student.number).padStart(2, '0')}</Cell>
      <Cell>{student.name}</Cell>
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
