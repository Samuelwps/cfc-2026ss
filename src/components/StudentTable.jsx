import styled from 'styled-components'
import StudentRow from './StudentRow'

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(18, 26, 12, 0.88);
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.24);
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
  padding: 18px 14px;
  color: rgba(247, 243, 223, 0.8);
  font-size: 0.92rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.2;
`

const Body = styled.tbody``

export default function StudentTable({ students, onStatusChange }) {
  return (
    <TableWrapper>
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
    </TableWrapper>
  )
}
