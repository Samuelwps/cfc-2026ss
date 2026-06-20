import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { supabase } from '../lib/supabase'

const DocumentsContainer = styled.main`
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 28px 18px 32px;
  display: grid;
  gap: 28px;
`

const PageHeader = styled.div`
  display: grid;
  gap: 12px;
`

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(2.25rem, 3.3vw, 3.6rem);
  line-height: 0.98;
  letter-spacing: -0.07em;
  color: #FF6A00;
  text-shadow: 0 0 15px rgba(255, 106, 0, 0.3);
`

const PageSubtitle = styled.p`
  margin: 0;
  color: #7a8088;
  font-size: 1rem;
  max-width: 740px;
  letter-spacing: 0.5px;
`

const ControlsSection = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr auto;
  align-items: end;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const SearchInput = styled.input`
  padding: 12px 16px;
  border: 1px solid #2E3B2F;
  border-left: 3px solid #FF6A00;
  border-radius: 0;
  background: rgba(11, 15, 20, 0.9);
  color: #FF6A00;
  font-size: 1rem;
  transition: all 0.2s linear;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;

  &::placeholder {
    color: #7a8088;
    text-transform: uppercase;
  }

  &:focus {
    outline: none;
    border-color: #FF6A00;
    background: rgba(11, 15, 20, 0.95);
    box-shadow: 0 0 12px rgba(255, 106, 0, 0.2);
  }
`

const UploadButton = styled.label`
  padding: 12px 24px;
  background: linear-gradient(135deg, #FF6A00, #E55A00);
  border: none;
  border-radius: 0;
  color: #0B0F14;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s linear;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 0 15px rgba(255, 106, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 25px rgba(255, 106, 0, 0.5);
    background: linear-gradient(135deg, #FF7A20, #FF6A00);
  }

  &:active {
    transform: translateY(0);
  }
`

const HiddenInput = styled.input`
  display: none;
`

const CategoryFilter = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`

const CategoryTag = styled.button`
  padding: 6px 14px;
  border: 1px solid ${(props) => (props.active ? '#FF6A00' : '#2E3B2F')};
  border-radius: 0;
  background: ${(props) => (props.active ? 'rgba(255, 106, 0, 0.2)' : 'transparent')};
  color: ${(props) => (props.active ? '#FF6A00' : '#7a8088')};
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s linear;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;

  &:hover {
    border-color: #FF6A00;
    color: #FF6A00;
    box-shadow: 0 0 8px rgba(255, 106, 0, 0.2);
  }
`

const DocumentsGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const DocumentCard = styled.div`
  padding: 24px;
  border: 2px solid #FF6A00;
  border-radius: 0;
  background: rgba(11, 15, 20, 0.95);
  display: grid;
  gap: 16px;
  transition: all 0.2s linear;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 106, 0, 0.15);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #FF6A00, transparent);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 50px rgba(255, 106, 0, 0.3), inset 0 1px 0 rgba(255, 106, 0, 0.1);
    border-color: #FF7A20;
  }
`

const DocumentTitle = styled.h3`
  margin: 0;
  color: #FF6A00;
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  text-shadow: 0 0 10px rgba(255, 106, 0, 0.2);
  text-transform: uppercase;
`

const DocumentMeta = styled.div`
  display: grid;
  gap: 8px;
  font-size: 0.9rem;
  color: #7a8088;
`

const MetaItem = styled.span`
  display: flex;
  gap: 8px;
  align-items: center;

  strong {
    color: #FF6A00;
    min-width: 100px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
`

const DocumentActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
`

const ActionButton = styled.button`
  padding: 10px 16px;
  border: 1px solid ${(props) => (props.primary ? '#FF6A00' : '#2E3B2F')};
  border-radius: 0;
  background: ${(props) => (props.primary ? 'rgba(255, 106, 0, 0.15)' : 'transparent')};
  color: ${(props) => (props.primary ? '#FF6A00' : '#7a8088')};
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s linear;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  &:hover {
    background: rgba(255, 106, 0, 0.25);
    border-color: #FF6A00;
    color: #FF6A00;
    box-shadow: 0 0 10px rgba(255, 106, 0, 0.2);
    transform: translateY(-1px);
  }
`

const DeleteButton = styled.button`
  padding: 10px 16px;
  border: 1px solid #D72638;
  border-radius: 0;
  background: transparent;
  color: #D72638;
  cursor: pointer;
  transition: all 0.2s linear;
  font-weight: 600;
  font-size: 0.9rem;
  grid-column: 1 / -1;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  &:hover {
    background: rgba(215, 38, 56, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 0 10px rgba(215, 38, 56, 0.2);
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7a8088;
  border: 1px dashed #2E3B2F;
  border-left: 3px dashed #FF6A00;
  background: rgba(11, 15, 20, 0.5);
  border-radius: 0;
  letter-spacing: 0.3px;
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 106, 0, 0.2);
  border-top-color: #FF6A00;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

// PDF viewer styles
const PdfBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 18px;
`

const PdfModal = styled.div`
  background: #0B0F14;
  border: 2px solid #FF6A00;
  width: 100%;
  max-width: 1000px;
  height: 88vh;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 30px 60px rgba(0,0,0,0.75);
  display: flex;
  flex-direction: column;
`

const PdfClose = styled.button`
  position: absolute;
  top: 8px;
  right: 10px;
  background: transparent;
  border: none;
  color: #E8EAED;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 1110;
`

const PdfIframe = styled.iframe`
  border: none;
  width: 100%;
  height: 100%;
  background: #0B0F14;
`

const categories = [
  'Ordens do Dia',
  'Escalas',
  'Regulamentos',
  'Comunicados',
  'Instruções',
  'Documentos Gerais'
]

export default function Documents() {
  const [documents, setDocuments] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  // PDF viewer state
  const [showPdf, setShowPdf] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [isPdfLoading, setIsPdfLoading] = useState(false)

  const closePdf = () => {
    setShowPdf(false)
    if (pdfUrl) {
      try { URL.revokeObjectURL(pdfUrl) } catch (e) {}
    }
    setPdfUrl(null)
    setIsPdfLoading(false)
  }

  const handleView = async (doc) => {
    if (!doc || !doc.file_url) {
      alert('Arquivo não disponível para visualização')
      return
    }

    // If public URL, open in new tab
    if (doc.file_url.startsWith('http')) {
      window.open(doc.file_url, '_blank')
      return
    }

    // Otherwise treat as storage path and download blob for viewing
    setIsPdfLoading(true)
    try {
      const bucket = 'documents'
      const path = doc.file_url
      const { data, error } = await supabase.storage.from(bucket).download(path)
      if (error) {
        console.error('Download error:', error)
        alert('Erro ao carregar PDF: ' + error.message)
        setIsPdfLoading(false)
        return
      }

      const url = URL.createObjectURL(data)
      setPdfUrl(url)
      setShowPdf(true)
    } catch (err) {
      console.error('View exception:', err)
      alert('Erro ao carregar PDF: ' + err.message)
    } finally {
      setIsPdfLoading(false)
    }
  }

  const fetchDocuments = async () => {
    try {
      setIsLoadingData(true)
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        alert('Erro ao buscar documentos: ' + error.message)
        return
      }

      setDocuments(data || [])
    } catch (error) {
      console.error('Erro ao buscar documentos:', error)
      alert('Erro ao buscar documentos: ' + error.message)
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Only allow PDF files
    if (!file.type.includes('pdf')) {
      alert('Por favor, selecione apenas arquivos PDF')
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('O arquivo é muito grande. Máximo: 10MB')
      return
    }

    const category = prompt('Selecione a categoria:\n\n' + categories.join('\n'))
    if (!category || !categories.includes(category)) {
      alert('Categoria inválida')
      return
    }

    setLoading(true)

    try {
      const fileName = `${Date.now()}-${file.name}`

      // Upload file object directly to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { contentType: file.type, upsert: false })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        alert('Erro ao fazer upload: ' + uploadError.message)
        setLoading(false)
        e.target.value = ''
        return
      }

      // Get public URL
      const { data: publicUrlData, error: publicUrlError } = await supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      if (publicUrlError) {
        console.error('Public URL error:', publicUrlError)
      }

      const file_url = publicUrlData?.publicUrl || ''

      // Store the storage path (fileName) in the DB as file_url for portability
      const { error: dbError } = await supabase
        .from('documents')
        .insert([
          {
            title: file.name,
            description: `PDF document - ${category}`,
            file_url: fileName,
            category: category
          }
        ])

      if (dbError) {
        console.error('Database error:', dbError)
        alert('Erro ao salvar documento: ' + dbError.message)
        setLoading(false)
        e.target.value = ''
        return
      }

      await fetchDocuments()
      alert('Documento enviado com sucesso!')
      e.target.value = ''
    } catch (error) {
      console.error('Error:', error)
      alert('Erro ao enviar documento: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!id) return
    if (!confirm('Tem certeza que deseja deletar este documento?')) return

    try {
      // Find document to get file_url/path before deleting DB record
      const doc = documents.find((d) => d.id === id)
      const filePath = doc?.file_url || null

      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Supabase error (delete record):', error)
        alert('Erro ao deletar documento: ' + error.message)
        return
      }

      // Delete file from storage if exists
      if (filePath) {
        // Determine storage path
        let bucket = 'documents'
        let path = filePath

        // If filePath looks like a full URL, try to extract the path
        try {
          if (filePath.startsWith('http')) {
            const u = new URL(filePath)
            // URL path like /storage/v1/object/public/{bucket}/{path}
            const parts = u.pathname.split('/')
            const idx = parts.indexOf('public')
            if (idx >= 0 && parts.length > idx + 2) {
              bucket = parts[idx + 1]
              path = parts.slice(idx + 2).join('/')
            } else {
              // fallback: assume last segment is filename
              path = parts.slice(-1)[0]
            }
          }

          const { error: storageError } = await supabase.storage
            .from(bucket)
            .remove([path])

          if (storageError) {
            console.error('Storage delete error:', storageError)
            // don't block the flow; just notify
            alert('Documento removido do banco, mas falha ao remover arquivo no storage: ' + storageError.message)
          }
        } catch (err) {
          console.error('Error removing file from storage:', err)
        }
      }

      await fetchDocuments()
      alert('Documento deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar documento:', error)
      alert('Erro ao deletar documento: ' + error.message)
    }
  }

  const handleDownload = async (file_url, fileName) => {
    if (!file_url) {
      alert('URL do arquivo não disponível')
      return
    }

    try {
      // If stored as a full public URL, open it
      if (file_url.startsWith('http')) {
        window.open(file_url, '_blank')
        return
      }

      // Otherwise treat file_url as storage path
      const bucket = 'documents'
      const path = file_url

      const { data, error } = await supabase.storage.from(bucket).download(path)
      if (error) {
        console.error('Download error:', error)
        alert('Erro ao baixar arquivo: ' + error.message)
        return
      }

      const url = URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName || path.split('/').pop()
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download exception:', err)
      alert('Erro ao baixar arquivo: ' + err.message)
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !selectedCategory || doc.category === selectedCategory
    return matchSearch && matchCategory
  })

  return (
    <DocumentsContainer>
      <PageHeader>
        <PageTitle>DOCUMENTOS</PageTitle>
        <PageSubtitle>Central de documentos militares, ordens do dia, escalas e comunicados. Organize, busque e visualize todos os materiais da turma.</PageSubtitle>
      </PageHeader>

      <ControlsSection>
        <div style={{ display: 'grid', gap: '12px' }}>
          <SearchInput
            type="text"
            placeholder="Buscar por nome do documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <CategoryFilter>
            <CategoryTag
              active={!selectedCategory}
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </CategoryTag>
            {categories.map((cat) => (
              <CategoryTag
                key={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </CategoryTag>
            ))}
          </CategoryFilter>
        </div>

        <UploadButton htmlFor="file-upload" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          {loading ? <LoadingSpinner /> : '+'} ADICIONAR PDF
        </UploadButton>
        <HiddenInput
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={loading}
        />
      </ControlsSection>

      {isLoadingData ? (
        <EmptyState>
          <p>Carregando documentos...</p>
        </EmptyState>
      ) : filteredDocuments.length > 0 ? (
        <DocumentsGrid>
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id}>
              <div>
                <DocumentTitle>{doc.title}</DocumentTitle>
                <DocumentMeta>
                  <MetaItem>
                    <strong>Categoria:</strong> {doc.category}
                  </MetaItem>
                  <MetaItem>
                    <strong>Data:</strong> {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                  </MetaItem>
                </DocumentMeta>
              </div>
              <DocumentActions>
                <ActionButton
                  primary
                  onClick={() => handleDownload(doc.file_url, doc.title)}
                >
                  📥 Download
                </ActionButton>
                <ActionButton
                  onClick={() => handleView(doc)}
                >
                  👁️ Visualizar
                </ActionButton>
                <DeleteButton onClick={() => handleDelete(doc.id)}>
                  🗑️ Deletar
                </DeleteButton>
              </DocumentActions>
            </DocumentCard>
          ))}
        </DocumentsGrid>
      ) : (
        <EmptyState>
          <p>Nenhum documento encontrado</p>
        </EmptyState>
      )}

      {showPdf && (
        <PdfBackdrop onClick={closePdf}>
          <PdfModal onClick={(e) => e.stopPropagation()}>
            <PdfClose onClick={closePdf}>✕</PdfClose>
            {isPdfLoading ? (
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}>
                <LoadingSpinner />
              </div>
            ) : (
              <PdfIframe src={pdfUrl} title="Visualizador PDF" />
            )}
          </PdfModal>
        </PdfBackdrop>
      )}
    </DocumentsContainer>
  )
}
