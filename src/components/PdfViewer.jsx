import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

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
  background: rgba(0, 0, 0, 0.9);
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
`

const PdfTitle = styled.h2`
  margin: 0;
  color: #FF6A00;
  font-size: 1rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const PdfControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const PdfButton = styled.button`
  padding: 6px 12px;
  background: rgba(255, 106, 0, 0.1);
  border: 1px solid rgba(255, 106, 0, 0.3);
  color: #FF6A00;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 106, 0, 0.2);
    border-color: #FF6A00;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.85rem;
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

  &:hover {
    background: rgba(255, 106, 0, 0.1);
  }
`

const PdfContent = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);

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

const PdfIframe = styled.iframe`
  border: none;
  width: 100%;
  height: 100%;
  background: #0B0F14;
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

export function PdfViewer({ pdfUrl, fileName, onClose }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
  }, [pdfUrl])

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

  return (
    <PdfBackdrop onClick={handleBackdropClick}>
      <PdfModalWrapper onClick={(e) => e.stopPropagation()}>
        <PdfHeader>
          <PdfTitle title={fileName}>{fileName}</PdfTitle>
          <PdfControls>
            <PdfButton onClick={handleDownload} disabled={isLoading}>
              ⬇ Download
            </PdfButton>
            <PdfCloseButton onClick={onClose} title="Fechar">
              ✕
            </PdfCloseButton>
          </PdfControls>
        </PdfHeader>

        <PdfContent>
          {isLoading && <LoadingSpinner />}
          <PdfIframe
            src={pdfUrl}
            title={`PDF: ${fileName}`}
            onLoad={() => setIsLoading(false)}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        </PdfContent>
      </PdfModalWrapper>
    </PdfBackdrop>
  )
}
