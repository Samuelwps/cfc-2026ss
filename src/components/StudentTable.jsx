import styled from 'styled-components'
import StudentRow from './StudentRow'
import StatusSelect from './StatusSelect'
import { statusConfig } from '../styles/theme'

const TableWrapper = styled.div`
  display: grid;
  gap: 18px;
`

const DesktopTable = styled.div`
  overflow-x: auto;
  border-radius: 0;
  border: 1px solid #2E3B2F;
  border-top: 2px solid #FF6A00;
  border-left: 3px solid #FF6A00;
  background: rgba(11, 15, 20, 0.95);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 106, 0, 0.1);
  padding: 0;

  @media (max-width: 870px) {
    display: none;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
`

const Head = styled.thead`
  background: rgba(46, 59, 45, 0.3);
  border-bottom: 2px solid #2E3B2F;
`

const HeadRow = styled.tr``

const HeadCell = styled.th`
  text-align: left;
  padding: 18px 16px;
  color: #FF6A00;
  font-size: 0.92rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.2;
  font-weight: 700;
  border-right: 1px solid #2E3B2F;

  &:last-child {
    border-right: none;
  }

  &::before {
    content: '» ';
    opacity: 0.6;
  }
`

const Body = styled.tbody``

const CardList = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 871px) {
    display: none;
  }
`

const Card = styled.article`
  display: grid;
  gap: 16px;
  padding: 20px;
  border-radius: 0;
  background: rgba(11, 15, 20, 0.95);
  border: 1px solid #2E3B2F;
  border-left: 3px solid #FF6A00;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 106, 0, 0.1);
  transition: all 0.2s linear;

  &:hover {
    border-color: #FF6A00;
    box-shadow: 0 20px 50px rgba(255, 106, 0, 0.2), inset 0 1px 0 rgba(255, 106, 0, 0.15);
    transform: translateY(-2px);
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  border-bottom: 1px solid #2E3B2F;
  padding-bottom: 12px;
`

const CardTitle = styled.div`
  display: grid;
  gap: 6px;
`

const CardLabel = styled.span`
  color: #7a8088;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
`

const CardValue = styled.p`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #FF6A00;
  text-shadow: 0 0 10px rgba(255, 106, 0, 0.3);
`

const CardFields = styled.div`
  display: grid;
  gap: 14px;
`

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`

const CardField = styled.span`
  color: #E8EAED;
  font-size: 0.97rem;
  min-width: 110px;
`

const CardChip = styled.span`
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
`

const EmptyState = styled.div`
  padding: 28px 24px;
  border-radius: 0;
  background: rgba(11, 15, 20, 0.95);
  border: 1px dashed #2E3B2F;
  border-left: 3px dashed #FF6A00;
  color: #7a8088;
  text-align: center;
  letter-spacing: 0.3px;
`

export default function StudentTable({ students, onStatusChange }) {
  if (students.length === 0) {
    return <EmptyState>Nenhum aluno encontrado. Ajuste a pesquisa ou verifique os filtros.</EmptyState>
  }

  return (
    <TableWrapper>
      <DesktopTable>
        <Table>
          <Head>
            <HeadRow>
              <HeadCell>Número</HeadCell>
              <HeadCell>Nome de Guerra</HeadCell>
              <HeadCell>Status atual</HeadCell>
              <HeadCell>Alterar status</HeadCell>
            </HeadRow>
          </Head>
          <Body>
            {students.map((student) => (
              <StudentRow key={student.id} student={student} onStatusChange={onStatusChange} />
            ))}
          </Body>
        </Table>
      </DesktopTable>

      <CardList>
        {students.map((student) => {
          const status = statusConfig[student.status] || statusConfig.CFC
          return (
            <Card key={student.id}>
              <CardHeader>
                <CardTitle>
                  <CardLabel>Número</CardLabel>
                  <CardValue>{String(student.numero).padStart(2, '0')}</CardValue>
                </CardTitle>
                <CardChip color={status.color}>{student.status}</CardChip>
              </CardHeader>

              <CardFields>
                <CardRow>
                  <CardField>Nome de Guerra</CardField>
                  <CardField>{student.nome}</CardField>
                </CardRow>
                <CardRow>
                  <CardField>Alterar status</CardField>
                  <StatusSelect
                    value={student.status}
                    onChange={(event) => onStatusChange(student.id, event.target.value)}
                  />
                </CardRow>
              </CardFields>
            </Card>
          )
        })}
      </CardList>
    </TableWrapper>
  )
}
