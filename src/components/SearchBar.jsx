import styled from 'styled-components'

const SearchWrapper = styled.div`
  display: grid;
  gap: 14px;
  width: 100%;
  max-width: 540px;
`

const Input = styled.input`
  width: 100%;
  padding: 16px 18px;
  border-radius: 0;
  background: rgba(11, 15, 20, 0.9);
  color: #FF6A00;
  border: 1px solid #2E3B2F;
  border-left: 3px solid #FF6A00;
  transition: all 0.2s linear;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &::placeholder {
    color: #7a8088;
    text-transform: uppercase;
    font-weight: 500;
  }

  &:focus {
    outline: none;
    border-color: #FF6A00;
    box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.2), inset 0 1px 0 rgba(255, 106, 0, 0.15);
  }
`

export default function SearchBar({ value, onChange }) {
  return (
    <SearchWrapper>
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por número ou nome"
        aria-label="Buscar aluno"
      />
    </SearchWrapper>
  )
}
