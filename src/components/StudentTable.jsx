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
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(18, 26, 12, 0.88);
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.24);
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
  background: rgba(255, 255, 255, 0.06);
`

const HeadRow = styled.tr``

const HeadCell = styled.th`
  text-align: left;
  padding: 18px 16px;
  color: rgba(247, 243, 223, 0.8);
  font-size: 0.92rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.2;
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
  border-radius: 26px;
  background: rgba(18, 26, 12, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.18);
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

const CardTitle = styled.div`
  display: grid;
  gap: 6px;
`

const CardLabel = styled.span`
  color: rgba(247, 243, 223, 0.68);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const CardValue = styled.p`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #f7f3df;
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
  color: rgba(247, 243, 223, 0.86);
  font-size: 0.97rem;
  min-width: 110px;
`

const CardChip = styled.span`
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

const EmptyState = styled.div`
  padding: 28px 24px;
  border-radius: 24px;
  background: rgba(23, 32, 16, 0.96);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  color: rgba(247, 243, 223, 0.78);
  text-align: center;
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
