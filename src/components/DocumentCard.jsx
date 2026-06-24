import styled from 'styled-components'
import { FileIcon } from './FileIcon'
import { PdfThumbnail } from './PdfThumbnail'
import { formatFileSize, formatDateShort, isPDF, isImage } from '../utils/fileHelpers'

const CardWrapper = styled.div`
  background: rgba(11, 15, 20, 0.6);
  border: 1px solid rgba(255, 106, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  &:hover {
    border-color: rgba(255, 106, 0, 0.5);
    background: rgba(11, 15, 20, 0.8);
    box-shadow: 0 12px 32px rgba(255, 106, 0, 0.2);
    transform: translateY(-4px);
  }
`

const PreviewSection = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 106, 0, 0.05) 0%, rgba(255, 106, 0, 0.02) 100%);
  border-bottom: 1px solid rgba(255, 106, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 106, 0, 0.08) 0%, rgba(255, 106, 0, 0.04) 100%);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const IconPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`

const ContentSection = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(11, 15, 20, 0.4);
`

const FileName = styled.h3`
  margin: 0;
  color: #FF6A00;
  font-size: 0.95rem;
  font-weight: 600;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
`

const MetaInfo = styled.div`
  display: grid;
  gap: 6px;
  font-size: 0.8rem;
  color: #7a8088;
`

const MetaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  strong {
    color: #FF6A00;
    opacity: 0.8;
    flex-shrink: 0;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const ActionsSection = styled.div`
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  border-top: 1px solid rgba(255, 106, 0, 0.1);
  background: rgba(11, 15, 20, 0.2);
`

const ActionButton = styled.button`
  padding: 8px 12px;
  background: ${(props) =>
    props.danger
      ? 'rgba(215, 38, 56, 0.1)'
      : 'rgba(255, 106, 0, 0.1)'};
  border: 1px solid ${(props) =>
    props.danger
      ? 'rgba(215, 38, 56, 0.3)'
      : 'rgba(255, 106, 0, 0.3)'};
  color: ${(props) => (props.danger ? '#D72638' : '#FF6A00')};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.danger
        ? 'rgba(215, 38, 56, 0.2)'
        : 'rgba(255, 106, 0, 0.2)'};
    border-color: ${(props) =>
      props.danger ? '#D72638' : '#FF6A00'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${(props) =>
    props.fullWidth &&
    `
    grid-column: 1 / -1;
  `}
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 106, 0, 0.2);
  border-top-color: #FF6A00;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export function DocumentCard({
  document,
  onView,
  onDownload,
  onDelete,
  isLoading = false
}) {
  const fileName = document.title || document.name || 'Sem nome'
  const fileSize = document.size || document.file_size
  const createdAt = document.created_at || document.date
  const category = document.category || 'Geral'
  const fileUrl = document.file_url

  const handleView = async () => {
    if (onView && !isLoading) {
      await onView(document)
    }
  }

  const handleDownload = async () => {
    if (onDownload && !isLoading) {
      await onDownload(document)
    }
  }

  const handleDelete = async () => {
    if (onDelete && !isLoading) {
      await onDelete(document.id)
    }
  }

  const shouldShowPdfThumbnail = isPDF(fileName) && fileUrl
  const shouldShowImagePreview = isImage(fileName) && fileUrl

  return (
    <CardWrapper>
      <PreviewSection onClick={handleView} title="Clique para visualizar">
        {shouldShowPdfThumbnail ? (
          <PdfThumbnail pdfUrl={fileUrl} fileName={fileName} />
        ) : shouldShowImagePreview ? (
          <img src={fileUrl} alt={fileName} loading="lazy" />
        ) : (
          <IconPlaceholder>
            <FileIcon fileName={fileName} size={64} />
          </IconPlaceholder>
        )}
      </PreviewSection>

      <ContentSection>
        <FileName title={fileName}>{fileName}</FileName>

        <MetaInfo>
          {category && (
            <MetaItem>
              <strong>Tipo:</strong>
              <span>{category}</span>
            </MetaItem>
          )}
          {fileSize && (
            <MetaItem>
              <strong>Tamanho:</strong>
              <span>{formatFileSize(fileSize)}</span>
            </MetaItem>
          )}
          {createdAt && (
            <MetaItem>
              <strong>Data:</strong>
              <span>{formatDateShort(createdAt)}</span>
            </MetaItem>
          )}
        </MetaInfo>
      </ContentSection>

      <ActionsSection>
        <ActionButton
          onClick={handleView}
          disabled={isLoading}
          title="Visualizar arquivo"
        >
          {isLoading ? <LoadingSpinner /> : '👁'} Ver
        </ActionButton>
        <ActionButton
          onClick={handleDownload}
          disabled={isLoading}
          title="Fazer download"
        >
          {isLoading ? <LoadingSpinner /> : '⬇'} Baixar
        </ActionButton>
        <ActionButton
          danger
          fullWidth
          onClick={handleDelete}
          disabled={isLoading}
          title="Deletar arquivo"
        >
          {isLoading ? <LoadingSpinner /> : '🗑'} Deletar
        </ActionButton>
      </ActionsSection>
    </CardWrapper>
  )
}
