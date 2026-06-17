import styled from 'styled-components'
import { statusOptions, statusConfig } from '../styles/theme'

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(14, 19, 10, 0.96);
  color: #f7f3df;
  appearance: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(213, 180, 90, 0.18);
    border-color: rgba(213, 180, 90, 0.32);
  }
`

export default function StatusSelect({ value, onChange }) {
  return (
    <Select value={value} onChange={onChange}>
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </Select>
  )
}
