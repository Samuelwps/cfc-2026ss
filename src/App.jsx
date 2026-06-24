import { useEffect, useMemo, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { jsPDF } from 'jspdf'
import { supabase } from './lib/supabase'
import { GlobalStyles } from './styles/global'
import { theme } from './styles/theme'
import { ToastProvider } from './contexts/ToastContext'
import { ToastContainer } from './components/ToastContainer'
import Header from './components/Header'
import Banner from './components/Banner'
import SearchBar from './components/SearchBar'
import SummaryCard from './components/SummaryCard'
import StudentTable from './components/StudentTable'
import Documents from './components/Documents'
import Songs from './components/Songs'

const initialSummary = {
  total: 0,
  CFC: 0,
  ESV: 0,
  SSV: 0,
  SDE: 0,
  DSP: 0,
  FLT: 0
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  }).format(date)
}

const createPdf = (students, summary) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const title = 'TIRAGEM DE FALTAS CFC 2026'
  const date = formatDate(new Date())
  const headerY = 40
  const leftMargin = 40
  const lineHeight = 20

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(title, leftMargin, headerY)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Data: ${date}`, leftMargin, headerY + 24)
  doc.setDrawColor(213, 180, 90)
  doc.setLineWidth(1)
  doc.line(leftMargin, headerY + 34, 560, headerY + 34)

  let currentY = headerY + 58
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Número', leftMargin, currentY)
  doc.text('Nome de Guerra', leftMargin + 70, currentY)
  doc.text('Status', leftMargin + 380, currentY)

  doc.setFont('helvetica', 'normal')
  students.forEach((student, index) => {
    const y = currentY + lineHeight * (index + 1)
    if (y > 740) {
      doc.addPage()
      currentY = 40
    }
    doc.text(String(student.numero).padStart(2, '0'), leftMargin, y)
    doc.text(student.nome, leftMargin + 70, y)
    doc.text(student.status, leftMargin + 380, y)
  })

  const summaryY = students.length * lineHeight + headerY + 70
  doc.setPage(doc.getNumberOfPages())
  doc.setFont('helvetica', 'bold')
  doc.text('Resumo final', leftMargin, summaryY)
  doc.setFont('helvetica', 'normal')
  Object.entries(summary).forEach(([key, value], index) => {
    doc.text(`${key}: ${value}`, leftMargin, summaryY + 26 + index * 18)
  })

  return doc
}

const PageLayout = styled.main`
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 20px 18px 32px;
  display: grid;
  gap: 28px;
`

const Overview = styled.section`
  display: grid;
  gap: 18px;
`

const OverviewHeader = styled.div`
  display: grid;
  gap: 18px;
  justify-content: space-between;
  align-items: start;

  @media (min-width: 720px) {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
`

const DateLabel = styled.p`
  margin: 0;
  color: #FF6A00;
  text-transform: uppercase;
  font-size: 0.82rem;
  letter-spacing: 0.16em;
  font-weight: 600;
`

const CurrentDate = styled.h2`
  margin: 10px 0 0;
  font-size: clamp(1.85rem, 2.8vw, 2.85rem);
  line-height: 1.03;
  color: #FF6A00;
  text-shadow: 0 0 15px rgba(255, 106, 0, 0.3);
`

const ExportButton = styled.button`
  border: 1px solid #FF6A00;
  border-radius: 0;
  padding: 16px 24px;
  background: linear-gradient(135deg, #FF6A00, #E55A00);
  box-shadow: 0 0 20px rgba(255, 106, 0, 0.3);
  color: #0B0F14;
  font-weight: 700;
  min-width: 170px;
  transition: all 0.2s linear;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(255, 106, 0, 0.5);
    background: linear-gradient(135deg, #FF7A20, #FF6A00);
  }

  &:active {
    transform: translateY(0);
  }
`

const SummaryGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
`

const SearchWrapper = styled.div`
  position: sticky;
  top: 16px;
  z-index: 5;
  width: 100%;
  align-self: start;
`

const FeedbackMessage = styled.div`
  padding: 28px 24px;
  border-radius: 0;
  background: ${(props) => (props.error ? 'rgba(215, 38, 56, 0.15)' : 'rgba(11, 15, 20, 0.95)')};
  color: ${(props) => (props.error ? '#D72638' : '#FF6A00')};
  text-align: center;
  border: 1px solid ${(props) => (props.error ? '#D72638' : '#2E3B2F')};
  border-left: 3px solid ${(props) => (props.error ? '#D72638' : '#FF6A00')};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
`

const FooterNote = styled.div`
  display: grid;
  gap: 12px;
  color: #7a8088;
  font-size: 0.95rem;
  letter-spacing: 0.3px;

  @media (min-width: 720px) {
    grid-auto-flow: column;
    justify-content: space-between;
    align-items: center;
  }
`

function App() {
  const [currentPage, setCurrentPage] = useState('faltas')
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [lastUpdate, setLastUpdate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const summary = useMemo(() => {
    return students.reduce(
      (acc, student) => {
        acc.total += 1
        acc[student.status] = (acc[student.status] || 0) + 1
        return acc
      },
      { ...initialSummary }
    )
  }, [students])

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return students
    return students.filter((student) => {
      const number = String(student.numero).padStart(2, '0')
      return number.includes(query) || student.nome.toLowerCase().includes(query)
    })
  }, [search, students])

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('numero', { ascending: true })

      if (error) throw new Error(error.message)
      setStudents(data || [])
      setLastUpdate(new Date().toISOString())
      setLoading(false)
      setError(null)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    const optimistic = students.map((student) => (student.id === id ? { ...student, status } : student))
    setStudents(optimistic)
    try {
      const { error } = await supabase
        .from('students')
        .update({ status })
        .eq('id', id)

      if (error) throw new Error(error.message)
      await fetchStudents()
    } catch (err) {
      setError('Não foi possível salvar a alteração. Tente novamente.')
    }
  }

  const exportPdf = () => {
    const doc = createPdf(students, summary)
    doc.save(`tiragem-cfc-2026-${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  useEffect(() => {
    fetchStudents()
    const interval = setInterval(fetchStudents, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ToastProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ToastContainer />
        <Header currentPage={currentPage} onPageChange={setCurrentPage} />
        {currentPage === 'faltas' && (
          <PageLayout>
            <Banner />
            <Overview>
              <OverviewHeader>
                <div>
                  <DateLabel>Data atual</DateLabel>
                  <CurrentDate>{formatDate(new Date())}</CurrentDate>
                </div>
                <ExportButton onClick={exportPdf}>GERAR PDF</ExportButton>
              </OverviewHeader>
              <SummaryGrid>
                <SummaryCard label="Total alunos" value={summary.total} />
                <SummaryCard label="CFC" value={summary.CFC} />
                <SummaryCard label="ESV" value={summary.ESV} />
                <SummaryCard label="SSV" value={summary.SSV} />
                <SummaryCard label="SDE" value={summary.SDE} />
                <SummaryCard label="DSP" value={summary.DSP} />
                <SummaryCard label="FLT" value={summary.FLT} />
              </SummaryGrid>
            </Overview>

            <SearchWrapper>
              <SearchBar value={search} onChange={setSearch} />
            </SearchWrapper>

            {loading ? (
              <FeedbackMessage>
                Carregando dados da turma...
              </FeedbackMessage>
            ) : error ? (
              <FeedbackMessage error>{error}</FeedbackMessage>
            ) : (
              <StudentTable students={filteredStudents} onStatusChange={handleStatusChange} />
            )}

            <FooterNote>
              <span>Atualização automática a cada 5 segundos</span>
              <span>Última atualização: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString('pt-BR') : '--:--'}</span>
            </FooterNote>
          </PageLayout>
        )}
        {currentPage === 'documentos' && <Documents />}
        {currentPage === 'cancoes' && <Songs />}
      </ThemeProvider>
    </ToastProvider>
  )
}

export default App
