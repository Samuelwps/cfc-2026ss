import { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { supabase } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'
import {
  isImage,
  isPDF,
  isPreviewable,
  formatFileSize,
  sanitizeFileName
} from '../utils/fileHelpers'
import { DocumentCard } from './DocumentCard'
import { SkeletonCard } from './SkeletonCard'
import { PdfViewer } from './PdfViewer'
import { ImageViewer } from './ImageViewer'

const DocumentsContainer = styled.main`
  width: min(1280px, 100%);
  margin: 0 auto;
  padding: 28px 18px 32px;
  display: grid;
  gap: 28px;

  @media (max-width: 640px) {
    padding: 20px 14px 28px;
    gap: 24px;
  }
`

const PageHeader = styled.div`
  display: grid;
  gap: 12px;
`

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.6rem);
  line-height: 0.98;
  letter-spacing: -0.07em;
  color: #FF6A00;
  text-shadow: 0 0 15px rgba(255, 106, 0, 0.3);
  word-break: break-word;
`

const PageSubtitle = styled.p`
  margin: 0;
  color: #7a8088;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  max-width: 740px;
  letter-spacing: 0.5px;
  line-height: 1.5;
`

const ControlsSection = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr auto;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  @media (max-width: 640px) {
    gap: 12px;
  }
`

const SearchBox = styled.div`
  display: grid;
  gap: 12px;
`

const SearchInput = styled.input`
  padding: 12px 16px;
  border: 1px solid #2E3B2F;
  border-left: 3px solid #FF6A00;
  border-radius: 4px;
  background: rgba(11, 15, 20, 0.9);
  color: #FF6A00;
  font-size: clamp(0.9rem, 2vw, 1rem);
  transition: all 0.2s linear;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  width: 100%;

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

  @media (max-width: 640px) {
    padding: 10px 14px;
    font-size: 1rem;
  }
`

const CategoryFilter = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`

const CategoryTag = styled.button`
  padding: 6px 12px;
  border: 1px solid ${(props) => (props.active ? '#FF6A00' : '#2E3B2F')};
  border-radius: 4px;
  background: ${(props) => (props.active ? 'rgba(255, 106, 0, 0.2)' : 'transparent')};
  color: ${(props) => (props.active ? '#FF6A00' : '#7a8088')};
  cursor: pointer;
  font-size: clamp(0.75rem, 1.5vw, 0.85rem);
  transition: all 0.2s linear;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
  white-space: nowrap;

  &:hover {
    border-color: #FF6A00;
    color: #FF6A00;
    box-shadow: 0 0 8px rgba(255, 106, 0, 0.2);
  }

  @media (max-width: 640px) {
    padding: 6px 10px;
    font-size: 0.75rem;
  }
`

const UploadButton = styled.label`
  padding: 12px 24px;
  background: linear-gradient(135deg, #FF6A00, #E55A00);
  border: none;
  border-radius: 4px;
  color: #0B0F14;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s linear;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 0 15px rgba(255, 106, 0, 0.3);
  font-size: clamp(0.85rem, 2vw, 1rem);
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 25px rgba(255, 106, 0, 0.5);
    background: linear-gradient(135deg, #FF7A20, #FF6A00);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 640px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
`

const HiddenInput = styled.input`
  display: none;
`

const DocumentsGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7a8088;
  border: 1px dashed #2E3B2F;
  border-left: 3px dashed #FF6A00;
  background: rgba(11, 15, 20, 0.5);
  border-radius: 6px;
  letter-spacing: 0.3px;
  grid-column: 1 / -1;

  h3 {
    margin: 0 0 8px 0;
    color: #FF6A00;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
  }

  @media (max-width: 640px) {
    padding: 40px 20px;
  }
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

const ConfirmModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1999;
  padding: 16px;
  backdrop-filter: blur(2px);
`

const ConfirmContent = styled.div`
  background: #0B0F14;
  border: 1px solid rgba(255, 106, 0, 0.3);
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  display: grid;
  gap: 16px;

  h3 {
    margin: 0;
    color: #FF6A00;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    color: #7a8088;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    padding: 20px;
    max-width: 100%;
  }
`

const ConfirmButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const ConfirmButton = styled.button`
  padding: 10px 16px;
  border: 1px solid ${(props) => (props.danger ? '#D72638' : '#FF6A00')};
  background: ${(props) =>
    props.danger
      ? 'rgba(215, 38, 56, 0.1)'
      : 'rgba(255, 106, 0, 0.1)'};
  color: ${(props) => (props.danger ? '#D72638' : '#FF6A00')};
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
      props.danger
        ? 'rgba(215, 38, 56, 0.2)'
        : 'rgba(255, 106, 0, 0.2)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const InfoBar = styled.div`
  background: rgba(255, 106, 0, 0.05);
  border: 1px solid rgba(255, 106, 0, 0.2);
  border-left: 3px solid #FF6A00;
  border-radius: 4px;
  padding: 12px 16px;
  color: #7a8088;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    color: #FF6A00;
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
  const { success, error: showError, warning } = useToast()
  const [documents, setDocuments] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [loadingActions, setLoadingActions] = useState(new Set())

  // Viewer state
  const [viewerState, setViewerState] = useState({
    type: null, // 'pdf', 'image'
    url: null,
    fileName: null,
    isLoading: false
  })

  // Close viewers
  const closeViewer = useCallback(() => {
    if (viewerState.url?.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(viewerState.url)
      } catch (e) {
        console.error('Error revoking URL:', e)
      }
    }
    setViewerState({ type: null, url: null, fileName: null, isLoading: false })
  }, [viewerState.url])

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoadingData(true)
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        showError(`Erro ao buscar documentos: ${error.message}`)
        return
      }

      setDocuments(data || [])
    } catch (err) {
      console.error('Erro ao buscar documentos:', err)
      showError('Erro ao carregar documentos')
    } finally {
      setIsLoadingData(false)
    }
  }, [showError])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  // Handle file upload
  const handleFileUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.includes('pdf')) {
        warning('Por favor, selecione apenas arquivos PDF')
        e.target.value = ''
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showError('O arquivo é muito grande (máximo 10MB)')
        e.target.value = ''
        return
      }

      // Get category via modal
      const category = prompt(
        'Selecione a categoria:\n\n' + categories.join('\n'),
        categories[0]
      )
      if (!category || !categories.includes(category)) {
        warning('Categoria não selecionada')
        e.target.value = ''
        return
      }

      setLoading(true)

      try {
        const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file, { 
            contentType: file.type,
            upsert: false 
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          showError(`Erro ao fazer upload: ${uploadError.message}`)
          e.target.value = ''
          return
        }

        // Get file size
        const fileSize = file.size

        // Insert into database
        const { error: dbError } = await supabase
          .from('documents')
          .insert([
            {
              title: file.name,
              description: `Documento PDF - ${category}`,
              file_url: fileName,
              category,
              size: fileSize,
              mime_type: file.type
            }
          ])

        if (dbError) {
          console.error('Database error:', dbError)
          
          // Try to delete the uploaded file
          await supabase.storage
            .from('documents')
            .remove([fileName])
            .catch(err => console.error('Error cleanup:', err))

          showError(`Erro ao salvar documento: ${dbError.message}`)
          e.target.value = ''
          return
        }

        await fetchDocuments()
        success(`Documento "${file.name}" enviado com sucesso!`)
        e.target.value = ''
      } catch (err) {
        console.error('Upload error:', err)
        showError('Erro ao enviar documento')
      } finally {
        setLoading(false)
      }
    },
    [success, showError, warning, fetchDocuments]
  )

  // Handle view
  const handleView = useCallback(
    async (doc) => {
      if (!doc?.file_url) {
        showError('Arquivo não disponível')
        return
      }

      const fileName = doc.title || 'arquivo'
      const fileType = isImage(fileName) ? 'image' : isPDF(fileName) ? 'pdf' : null

      if (!fileType) {
        showError('Tipo de arquivo não suportado para visualização')
        return
      }

      setViewerState(prev => ({ ...prev, isLoading: true }))

      try {
        let url = doc.file_url

        // If it's not a full URL, download from storage
        if (!url.startsWith('http')) {
          const { data, error } = await supabase.storage
            .from('documents')
            .download(url)

          if (error) {
            console.error('Download error:', error)
            showError(`Erro ao carregar arquivo: ${error.message}`)
            setViewerState(prev => ({ ...prev, isLoading: false }))
            return
          }

          url = URL.createObjectURL(data)
        }

        setViewerState({
          type: fileType,
          url,
          fileName,
          isLoading: false
        })
      } catch (err) {
        console.error('View error:', err)
        showError('Erro ao visualizar arquivo')
        setViewerState(prev => ({ ...prev, isLoading: false }))
      }
    },
    [showError]
  )

  // Handle download
  const handleDownload = useCallback(
    async (doc) => {
      if (!doc?.file_url) {
        showError('URL do arquivo não disponível')
        return
      }

      const fileName = doc.title || 'arquivo'
      const actionKey = `download-${doc.id}`

      try {
        setLoadingActions(prev => new Set([...prev, actionKey]))

        let downloadUrl = doc.file_url

        // If it's not a full URL, download from storage
        if (!downloadUrl.startsWith('http')) {
          const { data, error } = await supabase.storage
            .from('documents')
            .download(downloadUrl)

          if (error) {
            console.error('Download error:', error)
            showError(`Erro ao baixar arquivo: ${error.message}`)
            return
          }

          downloadUrl = URL.createObjectURL(data)
        }

        // Create download link
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        link.remove()

        // Clean up blob URL if it's temporary
        if (downloadUrl.startsWith('blob:') && !doc.file_url.startsWith('blob:')) {
          URL.revokeObjectURL(downloadUrl)
        }

        success(`${fileName} baixado com sucesso!`)
      } catch (err) {
        console.error('Download error:', err)
        showError('Erro ao fazer download do arquivo')
      } finally {
        setLoadingActions(prev => {
          const next = new Set(prev)
          next.delete(actionKey)
          return next
        })
      }
    },
    [success, showError]
  )

  // Handle delete
  const handleDelete = useCallback(
    async (id) => {
      if (!id) return

      const doc = documents.find(d => d.id === id)
      const filePath = doc?.file_url
      const actionKey = `delete-${id}`

      try {
        setLoadingActions(prev => new Set([...prev, actionKey]))

        // Delete from database
        const { error: dbError } = await supabase
          .from('documents')
          .delete()
          .eq('id', id)

        if (dbError) {
          console.error('Delete error:', dbError)
          showError(`Erro ao deletar documento: ${dbError.message}`)
          return
        }

        // Delete from storage if exists
        if (filePath) {
          try {
            let path = filePath
            let bucket = 'documents'

            // Extract path if it's a full URL
            if (filePath.startsWith('http')) {
              const url = new URL(filePath)
              const parts = url.pathname.split('/')
              const idx = parts.indexOf('public')
              if (idx >= 0 && parts.length > idx + 2) {
                bucket = parts[idx + 1]
                path = parts.slice(idx + 2).join('/')
              } else {
                path = parts[parts.length - 1]
              }
            }

            const { error: storageError } = await supabase.storage
              .from(bucket)
              .remove([path])

            if (storageError) {
              console.warn('Storage delete warning:', storageError)
              // Don't fail completely if file deletion fails
            }
          } catch (err) {
            console.warn('Error removing file:', err)
          }
        }

        await fetchDocuments()
        success('Documento deletado com sucesso!')
        setDeleteConfirm(null)
      } catch (err) {
        console.error('Delete error:', err)
        showError('Erro ao deletar documento')
      } finally {
        setLoadingActions(prev => {
          const next = new Set(prev)
          next.delete(actionKey)
          return next
        })
      }
    },
    [documents, fetchDocuments, success, showError]
  )

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchSearch = (doc.title || '')
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchCategory =
        !selectedCategory || doc.category === selectedCategory
      return matchSearch && matchCategory
    })
  }, [documents, search, selectedCategory])

  const isActionLoading = (id, action) => {
    return loadingActions.has(`${action}-${id}`)
  }

  return (
    <DocumentsContainer>
      <PageHeader>
        <PageTitle>DOCUMENTOS</PageTitle>
        <PageSubtitle>
          Central de documentos, ordens do dia, escalas e comunicados. Organize,
          busque e visualize todos os materiais do turno.
        </PageSubtitle>
      </PageHeader>

      <ControlsSection>
        <SearchBox>
          <SearchInput
            type="text"
            placeholder="Buscar por nome do documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar documentos"
          />
          <CategoryFilter role="group" aria-label="Filtrar por categoria">
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
        </SearchBox>

        <UploadButton
          htmlFor="file-upload"
          disabled={loading}
          title="Adicionar novo PDF"
        >
          {loading ? <LoadingSpinner /> : '+'} {loading ? 'ENVIANDO' : 'ADICIONAR'}
        </UploadButton>
        <HiddenInput
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={loading}
          aria-label="Selecionar arquivo PDF"
        />
      </ControlsSection>

      {filteredDocuments.length > 0 && (
        <InfoBar>
          <strong>{filteredDocuments.length}</strong>
          {filteredDocuments.length === 1
            ? ' documento encontrado'
            : ' documentos encontrados'}
        </InfoBar>
      )}

      {isLoadingData ? (
        <DocumentsGrid>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </DocumentsGrid>
      ) : filteredDocuments.length > 0 ? (
        <DocumentsGrid>
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={() => handleView(doc)}
              onDownload={() => handleDownload(doc)}
              onDelete={() => setDeleteConfirm(doc.id)}
              isLoading={isActionLoading(doc.id, 'delete') || isActionLoading(doc.id, 'download')}
              isImagePreview={isImage(doc.title)}
            />
          ))}
        </DocumentsGrid>
      ) : (
        <EmptyState>
          <h3>Nenhum documento encontrado</h3>
          <p>
            {search
              ? 'Tente ajustar sua busca ou criar um novo documento'
              : 'Comece adicionando documentos usando o botão acima'}
          </p>
        </EmptyState>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <ConfirmModal onClick={() => setDeleteConfirm(null)}>
          <ConfirmContent onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar exclusão</h3>
            <p>
              Tem certeza que deseja deletar "{documents.find(d => d.id === deleteConfirm)?.title || 'este documento'}"?
              Esta ação não pode ser desfeita.
            </p>
            <ConfirmButtons>
              <ConfirmButton
                onClick={() => setDeleteConfirm(null)}
                disabled={isActionLoading(deleteConfirm, 'delete')}
              >
                Cancelar
              </ConfirmButton>
              <ConfirmButton
                danger
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isActionLoading(deleteConfirm, 'delete')}
              >
                {isActionLoading(deleteConfirm, 'delete') ? <LoadingSpinner /> : 'Deletar'}
              </ConfirmButton>
            </ConfirmButtons>
          </ConfirmContent>
        </ConfirmModal>
      )}

      {/* PDF Viewer */}
      {viewerState.type === 'pdf' && viewerState.url && (
        <PdfViewer
          pdfUrl={viewerState.url}
          fileName={viewerState.fileName}
          onClose={closeViewer}
        />
      )}

      {/* Image Viewer */}
      {viewerState.type === 'image' && viewerState.url && (
        <ImageViewer
          imageUrl={viewerState.url}
          fileName={viewerState.fileName}
          onClose={closeViewer}
        />
      )}
    </DocumentsContainer>
  )
}
