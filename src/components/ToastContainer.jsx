import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useToast } from '../contexts/ToastContext'

const slideInUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const slideOutDown = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`

const ToastsContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 5000;
  max-width: 420px;
  pointer-events: none;

  @media (max-width: 640px) {
    bottom: 16px;
    right: 16px;
    left: 16px;
    max-width: none;
  }
`

const Toast = styled.div`
  animation: ${(props) => (props.removing ? slideOutDown : slideInUp)} 0.3s ease-out forwards;
  padding: 16px 20px;
  border-radius: 6px;
  background: ${(props) => {
    switch (props.type) {
      case 'success':
        return '#1B5E20'
      case 'error':
        return '#B71C1C'
      case 'warning':
        return '#E65100'
      case 'info':
      default:
        return '#0D47A1'
    }
  }};
  border-left: 4px solid ${(props) => {
    switch (props.type) {
      case 'success':
        return '#4CAF50'
      case 'error':
        return '#F44336'
      case 'warning':
        return '#FF9800'
      case 'info':
      default:
        return '#2196F3'
    }
  }};
  color: #FFF;
  font-size: 0.95rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: auto;

  @media (max-width: 640px) {
    margin: 0;
  }
`

const ToastIcon = styled.span`
  font-size: 1.25rem;
  flex-shrink: 0;
`

const ToastMessage = styled.p`
  margin: 0;
  flex: 1;
  word-break: break-word;
`

const ToastClose = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
  flex-shrink: 0;

  &:hover {
    opacity: 1;
  }
`

export function ToastContainer() {
  const { toasts, removeToast } = useToast()
  const [removing, setRemoving] = React.useState(new Set())

  const handleClose = (id) => {
    setRemoving((prev) => new Set([...prev, id]))
    setTimeout(() => {
      removeToast(id)
      setRemoving((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 300)
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
      default:
        return 'ℹ'
    }
  }

  return (
    <ToastsContainer>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          removing={removing.has(toast.id)}
        >
          <ToastIcon>{getIcon(toast.type)}</ToastIcon>
          <ToastMessage>{toast.message}</ToastMessage>
          <ToastClose onClick={() => handleClose(toast.id)}>×</ToastClose>
        </Toast>
      ))}
    </ToastsContainer>
  )
}
