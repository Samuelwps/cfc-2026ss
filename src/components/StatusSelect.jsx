import styled from 'styled-components'
import { statusOptions, statusConfig } from '../styles/theme'

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border-radius: 0;
  border: 1px solid #2E3B2F;
  background: rgba(11, 15, 20, 0.9);
  color: #FF6A00;
  appearance: none;
  transition: all 0.2s linear;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  padding-right: 28px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23FF6A00' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;

  &:hover {
    border-color: #FF6A00;
    box-shadow: 0 0 12px rgba(255, 106, 0, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.25), inset 0 0 0 1px #FF6A00;
    border-color: #FF6A00;
  }

  option {
    background: #0B0F14;
    color: #E8EAED;
    padding: 8px 12px;
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
