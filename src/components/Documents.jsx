import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { supabase } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'
import { DocumentCard } from './DocumentCard'
import { PdfViewer } from './PdfViewer'
import { sanitizeFileName } from '../utils/fileHelpers'

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

const UploadGroup = styled.div`
  display: grid;
  gap: 14px;
`

const UploadSelect = styled.select`
  width: 100%;
  max-width: 360px;
  padding: 12px 16px;
  border: 1px solid #2E3B2F;
  border-left: 3px solid #FF6A00;
  background: rgba(11, 15, 20, 0.9);
  color: #FF6A00;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;

  option {
    background: #0B0F14;
    color: #FF6A00;
  }
`

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  border: none;
  border-radius: 0;
  background: linear-gradient(135deg, #FF6A00, #E55A00);
  color: #0B0F14;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s linear;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const StatusHelp = styled.p`
  margin: 0;
  color: #7a8088;
  font-size: 0.95rem;
  letter-spacing: 0.4px;
`

const ResultCount = styled.p`
  margin: 0;
  color: #7a8088;
  font-size: 0.95rem;
  letter-spacing: 0.4px;
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
  const [uploadCategory, setUploadCategory] = useState(categories[0])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [viewerUrl, setViewerUrl] = useState(null)
  const [viewerDoc, setViewerDoc] = useState(null)
  const [isViewing, setIsViewing] = useState(false)
  const [isViewLoading, setIsViewLoading] = useState(false)
  const { success, error: toastError, info } = useToast()

  useEffect(() => {
    fetchDocuments()
  }, [])

  useEffect(() => {
    return () => {
      if (viewerUrl && viewerUrl.startsWith('blob:')) {
        URL.revokeObjectURL(viewerUrl)
      }
    }
  }, [viewerUrl])

  const getPreviewUrl = (doc) => {
    if (!doc?.file_url) return null
    if (doc.file_url.startsWith('http')) {
      return doc.file_url
    }

    const { data } = supabase.storage.from('documents').getPublicUrl(doc.file_url)
    return data?.publicUrl || null
  }

  const fetchDocuments = async () => {
    try {
      setIsLoadingData(true)
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setDocuments(data || [])
    } catch (err) {
      console.error('Erro ao buscar documentos:', err)
      toastError('Erro ao buscar documentos')
      setDocuments([])
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.includes('pdf')) {
      toastError('Por favor, selecione apenas arquivos PDF')
      event.target.value = ''
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toastError('O arquivo é muito grande. Máximo: 10MB')
      event.target.value = ''
      return
    }

    if (!uploadCategory) {
      toastError('Selecione uma categoria antes de enviar')
      event.target.value = ''
      return
    }

    setIsUploading(true)

    try {
      const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { contentType: file.type, upsert: false })

      if (uploadError) {
        throw uploadError
      }

      const { error: dbError } = await supabase
        .from('documents')
        .insert([
          {
            title: file.name,
            description: uploadCategory,
            file_url: fileName,
            category: uploadCategory
          }
        ])

      if (dbError) {
        throw dbError
      }

      await fetchDocuments()
      success('Documento enviado com sucesso!')
    } catch (err) {
      console.error('Upload falhou:', err)
      toastError('Erro ao enviar documento')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const handleView = async (doc) => {
    if (!doc?.file_url) {
      toastError('Arquivo não disponível para visualização')
      return
    }

    setIsViewLoading(true)

    try {
      if (doc.file_url.startsWith('http')) {
        setViewerUrl(doc.file_url)
        setViewerDoc(doc)
        setIsViewing(true)
        return
      }

      const { data, error } = await supabase.storage.from('documents').download(doc.file_url)
      if (error) {
        throw error
      }

      const url = URL.createObjectURL(data)
      setViewerUrl(url)
      setViewerDoc(doc)
      setIsViewing(true)
    } catch (err) {
      console.error('Visualização falhou:', err)
      toastError('Erro ao carregar o documento para visualização')
    } finally {
      setIsViewLoading(false)
    }
  }

  const handleDownload = async (doc) => {
    if (!doc?.file_url) {
      toastError('URL do arquivo não disponível')
      return
    }

    try {
      if (doc.file_url.startsWith('http')) {
        window.open(doc.file_url, '_blank')
        return
      }

      const { data, error } = await supabase.storage.from('documents').download(doc.file_url)
      if (error) {
        throw error
      }

      const url = URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = doc.title || doc.file_url.split('/').pop()
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download falhou:', err)
      toastError('Erro ao baixar o documento')
    }
  }

  const handleDelete = async (id) => {
    if (!id) return
    if (!window.confirm('Tem certeza que deseja deletar este documento?')) return

    try {
      const doc = documents.find((item) => item.id === id)
      const filePath = doc?.file_url

      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      if (filePath) {
        let bucket = 'documents'
        let path = filePath

        if (filePath.startsWith('http')) {
          const url = new URL(filePath)
          const parts = url.pathname.split('/')
          const publicIndex = parts.indexOf('public')
          if (publicIndex >= 0 && parts.length > publicIndex + 2) {
            bucket = parts[publicIndex + 1]
            path = parts.slice(publicIndex + 2).join('/')
          } else {
            path = parts.slice(-1)[0]
          }
        }

        const { error: storageError } = await supabase.storage.from(bucket).remove([path])
        if (storageError) {
          console.warn('Remoção no storage falhou:', storageError)
          info('Documento removido do banco, mas falha ao remover o arquivo no storage')
        }
      }

      await fetchDocuments()
      success('Documento deletado com sucesso!')
    } catch (err) {
      console.error('Erro ao deletar documento:', err)
      toastError('Erro ao deletar documento')
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchSearch = doc.title?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !selectedCategory || doc.category === selectedCategory
    return matchSearch && matchCategory
  })

  return (
    <DocumentsContainer>
      <PageHeader>
        <PageTitle>DOCUMENTOS</PageTitle>
        <PageSubtitle>Central de documentos militares, ordens do dia, escalas e comunicados. Organize, busque e visualize todos os materiais do turno.</PageSubtitle>
      </PageHeader>

      <ControlsSection>
        <UploadGroup>
          <SearchInput
            type="text"
            placeholder="Buscar por nome do documento..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <CategoryFilter>
            <CategoryTag active={!selectedCategory} onClick={() => setSelectedCategory(null)}>
              Todos
            </CategoryTag>
            {categories.map((category) => (
              <CategoryTag
                key={category}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </CategoryTag>
            ))}
          </CategoryFilter>
        </UploadGroup>

        <UploadGroup>
          <UploadSelect
            value={uploadCategory}
            onChange={(event) => setUploadCategory(event.target.value)}
            aria-label="Categoria para upload"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </UploadSelect>

          <UploadButton htmlFor="file-upload">
            {isUploading ? <LoadingSpinner /> : '+'} ADICIONAR PDF
          </UploadButton>

          <HiddenInput
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
          />

          <StatusHelp>Categoria selecionada: {uploadCategory}</StatusHelp>
        </UploadGroup>
      </ControlsSection>

      {isLoadingData ? (
        <EmptyState>
          <p>Carregando documentos...</p>
        </EmptyState>
      ) : filteredDocuments.length > 0 ? (
        <>
          <ResultCount>
            {filteredDocuments.length} documento{filteredDocuments.length === 1 ? '' : 's'} encontrado{filteredDocuments.length === 1 ? '' : 's'}
          </ResultCount>
          <DocumentsGrid>
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                previewUrl={getPreviewUrl(doc)}
                onView={handleView}
                onDownload={handleDownload}
                onDelete={handleDelete}
                isLoading={isUploading || isViewLoading}
              />
            ))}
          </DocumentsGrid>
        </>
      ) : (
        <EmptyState>
          <p>Nenhum documento encontrado</p>
        </EmptyState>
      )}

      {isViewing && viewerUrl && (
        <PdfViewer
          pdfUrl={viewerUrl}
          fileName={viewerDoc?.title || 'Documento'}
          onClose={() => {
            setIsViewing(false)
            if (viewerUrl && viewerUrl.startsWith('blob:')) {
              URL.revokeObjectURL(viewerUrl)
            }
            setViewerUrl(null)
            setViewerDoc(null)
          }}
        />
      )}
    </DocumentsContainer>
  )
}
