import { useEffect, useMemo, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { jsPDF } from 'jspdf'
import { supabase } from './lib/supabase'
import { GlobalStyles } from './styles/global'
import { theme } from './styles/theme'
import Banner from './components/Banner'
import SearchBar from './components/SearchBar'
import SummaryCard from './components/SummaryCard'
import StudentTable from './components/StudentTable'

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
    doc.text(String(student.number).padStart(2, '0'), leftMargin, y)
    doc.text(student.name, leftMargin + 70, y)
    doc.text(student.status, leftMargin + 380, y)
  })

  const summaryStart = 760
  if (summaryStart > 760) {
    doc.addPage()
  }

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

function App() {
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
      const number = String(student.number).padStart(2, '0')
      return number.includes(query) || student.name.toLowerCase().includes(query)
    })
  }, [search, students])

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('number', { ascending: true })
      
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
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <main style={{ padding: '24px 22px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <Banner />
        <section style={{ display: 'grid', gap: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, color: '#c6b876', textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.16em' }}>
                Data atual
              </p>
              <h2 style={{ margin: '10px 0 0', fontSize: 'clamp(1.85rem, 2.8vw, 2.85rem)', lineHeight: 1.03 }}>
                {formatDate(new Date())}
              </h2>
            </div>
            <button
              onClick={exportPdf}
              style={{
                border: 'none',
                borderRadius: 18,
                padding: '16px 26px',
                background: 'linear-gradient(135deg, #d5b45a, #ab8a33)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.24)',
                color: '#071004',
                fontWeight: 700,
                minWidth: 180
              }}
            >
              GERAR PDF
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))', gap: 16 }}>
            <SummaryCard label="Total alunos" value={summary.total} />
            <SummaryCard label="CFC" value={summary.CFC} />
            <SummaryCard label="ESV" value={summary.ESV} />
            <SummaryCard label="SSV" value={summary.SSV} />
            <SummaryCard label="SDE" value={summary.SDE} />
            <SummaryCard label="DSP" value={summary.DSP} />
            <SummaryCard label="FLT" value={summary.FLT} />
          </div>
        </section>

        <SearchBar value={search} onChange={setSearch} />

        {loading ? (
          <div style={{ padding: 32, borderRadius: 28, background: 'rgba(18, 26, 12, 0.94)', textAlign: 'center' }}>
            Carregando dados da turma...
          </div>
        ) : error ? (
          <div style={{ padding: 30, borderRadius: 24, background: 'rgba(183, 63, 44, 0.2)', color: '#ffe3e1' }}>
            {error}
          </div>
        ) : (
          <StudentTable students={filteredStudents} onStatusChange={handleStatusChange} />
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginTop: 20, color: '#c0b985' }}>
          <span>Atualização automática a cada 5 segundos</span>
          <span>Última atualização: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString('pt-BR') : '--:--'}</span>
        </div>
      </main>
    </ThemeProvider>
  )
}

export default App
