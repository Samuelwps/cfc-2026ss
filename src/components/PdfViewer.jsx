import { useState, useEffect, useCallback, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { Document, Page } from 'react-pdf'
import '../lib/pdfWorker'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const PdfBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease-out;
  backdrop-filter: blur(2px);
`

const PdfModalWrapper = styled.div`
  background: #0B0F14;
  border: 1px solid rgba(255, 106, 0, 0.3);
  border-radius: 8px;
  width: 100%;
  height: 90vh;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  overflow: hidden;

  @media (max-width: 768px) {
    height: 95vh;
    max-width: 100%;
  }
`

const PdfHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 106, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(11, 15, 20, 0.8);
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 640px) {
    gap: 8px;
    padding: 10px 12px;
  }
`

const PdfTitle = styled.h2`
  margin: 0;
  color: #FF6A00;
  font-size: clamp(0.9rem, 2vw, 1rem);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const PdfControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`

const PdfButton = styled.button`
  padding: 6px 12px;
  background: rgba(255, 106, 0, 0.1);
  border: 1px solid rgba(255, 106, 0, 0.3);
  color: #FF6A00;
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: rgba(255, 106, 0, 0.2);
    border-color: #FF6A00;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
`

const PdfCloseButton = styled.button`
  background: none;
  border: none;
  color: #FF6A00;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 106, 0, 0.1);
  }
`

const PageInfo = styled.div`
  color: #FF6A00;
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 80px;
  text-align: center;

  @media (max-width: 640px) {
    min-width: 60px;
    font-size: 0.75rem;
  }
`

const PdfContent = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(11, 15, 20, 0.5);
  }

  &::-webkit-scrollbar-thumb {
    background: #FF6A00;
    border-radius: 4px;

    &:hover {
      background: #FF7A20;
    }
  }
`

const CanvasContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;

  canvas {
    max-width: 100%;
    max-height: 100%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 106, 0, 0.2);
  border-top-color: #FF6A00;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const ZoomControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  background: rgba(255, 106, 0, 0.05);
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 106, 0, 0.2);

  @media (max-width: 640px) {
    padding: 4px 8px;
    gap: 4px;
  }
`

const ZoomValue = styled.span`
  color: #FF6A00;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 35px;
  text-align: center;

  @media (max-width: 640px) {
    min-width: 30px;
    font-size: 0.75rem;
  }
`

export function PdfViewer({ pdfUrl, fileName, onClose }) {
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pageWidth, setPageWidth] = useState(null)
  const contentRef = useRef(null)

  useEffect(() => {
    setError(null)
    setIsLoading(true)
    setCurrentPage(1)
    setNumPages(0)
  }, [pdfUrl])

  useEffect(() => {
    const element = contentRef.current
    if (!element) return

    const updateWidth = () => {
      const width = Math.max(280, Math.min(1040, element.clientWidth - 32))
      setPageWidth(width)
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const onDocumentLoadSuccess = useCallback((document) => {
    setNumPages(document.numPages)
    setCurrentPage(1)
    setIsLoading(false)
  }, [])

  const onDocumentLoadError = useCallback((loadError) => {
    console.error('PdfViewer load error:', loadError)
    setError(loadError?.message || 'Erro ao carregar PDF')
    setIsLoading(false)
  }, [])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = fileName || 'documento.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(numPages, prev + 1))
  }

  const handleZoom = (delta) => {
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)))
  }

  const pageDisplayWidth = pageWidth ? Math.floor(pageWidth * zoom) : undefined

  return (
    <PdfBackdrop onClick={handleBackdropClick}>
      <PdfModalWrapper onClick={(e) => e.stopPropagation()}>
        <PdfHeader>
          <PdfTitle title={fileName}>{fileName}</PdfTitle>
          <PdfControls>
            <ZoomControls>
              <PdfButton
                onClick={() => handleZoom(-0.25)}
                disabled={zoom <= 0.5}
                title="Zoom out"
              >
                −
              </PdfButton>
              <ZoomValue>{Math.round(zoom * 100)}%</ZoomValue>
              <PdfButton
                onClick={() => handleZoom(0.25)}
                disabled={zoom >= 3}
                title="Zoom in"
              >
                +
              </PdfButton>
            </ZoomControls>

            {numPages > 1 && (
              <>
                <PdfButton
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  title="Página anterior"
                >
                  ◀
                </PdfButton>
                <PageInfo>{currentPage} / {numPages}</PageInfo>
                <PdfButton
                  onClick={handleNextPage}
                  disabled={currentPage === numPages}
                  title="Próxima página"
                >
                  ▶
                </PdfButton>
              </>
            )}

            <PdfButton onClick={handleDownload} disabled={isLoading}>
              ⬇ Download
            </PdfButton>
            <PdfCloseButton onClick={onClose} title="Fechar">
              ✕
            </PdfCloseButton>
          </PdfControls>
        </PdfHeader>

        <PdfContent ref={contentRef}>
          {error ? (
            <div style={{ color: '#D72638', textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '12px' }}>❌ Erro ao carregar PDF</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{error}</div>
            </div>
          ) : (
            <CanvasContainer>
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<LoadingSpinner />}
                error={
                  <div style={{ color: '#D72638', textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '1rem', marginBottom: '8px' }}>Erro ao renderizar PDF</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{error || 'Verifique o arquivo ou a conexão.'}</div>
                  </div>
                }
                options={{
                  cMapUrl: new URL('pdfjs-dist/cmaps/', import.meta.url).toString(),
                  cMapPacked: true
                }}
              >
                <Page
                  pageNumber={currentPage}
                  width={pageDisplayWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>
            </CanvasContainer>
          )}
        </PdfContent>
      </PdfModalWrapper>
    </PdfBackdrop>
  )
}
