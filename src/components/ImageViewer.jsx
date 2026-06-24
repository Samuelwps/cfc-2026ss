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

const ImageBackdrop = styled.div`
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

const ImageModalWrapper = styled.div`
  width: 100%;
  height: auto;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 100%;
  }
`

const ImageHeader = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(11, 15, 20, 0.9);
  border-bottom: 1px solid rgba(255, 106, 0, 0.2);
  border-radius: 8px 8px 0 0;
`

const ImageTitle = styled.h2`
  margin: 0;
  color: #FF6A00;
  font-size: 0.95rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ImageControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const ImageButton = styled.button`
  padding: 6px 12px;
  background: rgba(255, 106, 0, 0.1);
  border: 1px solid rgba(255, 106, 0, 0.3);
  color: #FF6A00;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 106, 0, 0.2);
    border-color: #FF6A00;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
`

const ImageCloseButton = styled.button`
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

const ImageContainer = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  flex: 1;
  min-height: 300px;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
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

const ImageElement = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
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

export function ImageViewer({ imageUrl, fileName, onClose }) {
  const [isLoading, setIsLoading] = useState(true)
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    setIsLoading(true)
  }, [imageUrl])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleZoom = (delta) => {
    setZoom((prev) => Math.max(50, Math.min(300, prev + delta)))
  }

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = fileName || 'imagem'
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }

  return (
    <ImageBackdrop onClick={handleBackdropClick}>
      <ImageModalWrapper onClick={(e) => e.stopPropagation()}>
        <ImageHeader>
          <ImageTitle title={fileName}>{fileName}</ImageTitle>
          <ImageControls>
            <ImageButton onClick={() => handleZoom(-10)} disabled={zoom <= 50}>
              −
            </ImageButton>
            <span style={{ color: '#FF6A00', fontSize: '0.9rem', minWidth: '45px', textAlign: 'center' }}>
              {zoom}%
            </span>
            <ImageButton onClick={() => handleZoom(10)} disabled={zoom >= 300}>
              +
            </ImageButton>
            <ImageButton onClick={handleDownload}>⬇</ImageButton>
            <ImageCloseButton onClick={onClose} title="Fechar">
              ✕
            </ImageCloseButton>
          </ImageControls>
        </ImageHeader>

        <ImageContainer>
          {isLoading && <LoadingSpinner />}
          <ImageElement
            src={imageUrl}
            alt={fileName}
            onLoad={() => setIsLoading(false)}
            style={{
              display: isLoading ? 'none' : 'block',
              transform: `scale(${zoom / 100})`
            }}
          />
        </ImageContainer>
      </ImageModalWrapper>
    </ImageBackdrop>
  )
}
