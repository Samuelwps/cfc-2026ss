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
  border-radius: 18px;
  background: rgba(14, 19, 10, 0.95);
  color: #f7f3df;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: border-color 0.15s ease;

  &::placeholder {
    color: rgba(247, 243, 223, 0.55);
  }

  &:focus {
    outline: none;
    border-color: rgba(213, 180, 90, 0.34);
    box-shadow: 0 0 0 3px rgba(213, 180, 90, 0.14);
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
