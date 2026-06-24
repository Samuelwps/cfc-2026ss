import styled from 'styled-components'
import { usePdfThumbnail } from '../hooks/usePdfThumbnail'
import { FileIcon } from './FileIcon'

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background: linear-gradient(135deg, rgba(255, 106, 0, 0.05) 0%, rgba(255, 106, 0, 0.02) 100%);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 106, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 106, 0, 0.3);
  }
`

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

const FallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 8px;
  padding: 12px;
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 106, 0, 0.08) 0%, rgba(255, 106, 0, 0.03) 100%);
`

const SkeletonLoader = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 106, 0, 0.1),
    rgba(255, 106, 0, 0.2),
    rgba(255, 106, 0, 0.1)
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`

const ErrorMessage = styled.div`
  color: #D72638;
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.8;
`

const PageBadge = styled.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(255, 106, 0, 0.9);
  color: #0B0F14;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
`

export function PdfThumbnail({ pdfUrl, fileName = 'PDF', showPageBadge = true }) {
  const { thumbnail, isLoading, error } = usePdfThumbnail(pdfUrl, {
    width: 280,
    height: 350,
    quality: 1.5
  })

  if (isLoading) {
    return (
      <ThumbnailContainer>
        <SkeletonLoader />
      </ThumbnailContainer>
    )
  }

  if (error || !thumbnail) {
    return (
      <ThumbnailContainer>
        <FallbackContainer>
          <FileIcon fileName={fileName} size={56} />
          <div style={{ color: '#7a8088', fontSize: '0.8rem' }}>
            PDF
          </div>
          {error && <ErrorMessage>Erro ao gerar preview</ErrorMessage>}
        </FallbackContainer>
      </ThumbnailContainer>
    )
  }

  return (
    <ThumbnailContainer>
      <ThumbnailImage src={thumbnail} alt={`Thumbnail: ${fileName}`} />
      {showPageBadge && <PageBadge>Página 1</PageBadge>}
    </ThumbnailContainer>
  )
}
