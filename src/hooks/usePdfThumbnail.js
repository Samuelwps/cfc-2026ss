import { useEffect, useState, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

// Simple in-memory cache
const thumbnailCache = new Map()

/**
 * Custom hook to generate PDF thumbnail from first page
 * Caches results to avoid reprocessing
 */
export function usePdfThumbnail(pdfUrl, options = {}) {
  const { width = 280, height = 350, quality = 1.5 } = options
  
  const [thumbnail, setThumbnail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const generateThumbnail = useCallback(async () => {
    if (!pdfUrl) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Check cache first
      const cacheKey = `${pdfUrl}-${width}-${height}`
      if (thumbnailCache.has(cacheKey)) {
        setThumbnail(thumbnailCache.get(cacheKey))
        setIsLoading(false)
        return
      }

      // Fetch PDF
      let pdfData
      if (pdfUrl.startsWith('blob:')) {
        // For blob URLs, fetch directly
        const response = await fetch(pdfUrl)
        pdfData = await response.arrayBuffer()
      } else if (pdfUrl.startsWith('http')) {
        // For URLs, fetch with timeout
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 30000) // 30s timeout
        try {
          const response = await fetch(pdfUrl, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/pdf'
            }
          })
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          pdfData = await response.arrayBuffer()
          clearTimeout(timeout)
        } catch (err) {
          clearTimeout(timeout)
          throw err
        }
      } else {
        // Assume it's stored in Supabase
        setError('Invalid PDF URL')
        setIsLoading(false)
        return
      }

      if (!pdfData || pdfData.byteLength === 0) {
        throw new Error('Empty PDF data')
      }

      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise
      
      if (!pdf || pdf.numPages === 0) {
        throw new Error('Invalid PDF document')
      }

      // Get first page
      const page = await pdf.getPage(1)
      
      // Calculate scale
      const viewport = page.getViewport({ scale: quality })
      const scale = Math.min(width / viewport.width, height / viewport.height)
      const scaledViewport = page.getViewport({ scale: scale * quality })

      // Render to canvas
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      
      canvas.width = Math.floor(scaledViewport.width)
      canvas.height = Math.floor(scaledViewport.height)

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      }

      await page.render(renderContext).promise
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      
      // Cache the result
      thumbnailCache.set(cacheKey, dataUrl)
      
      setThumbnail(dataUrl)
      setError(null)
    } catch (err) {
      console.error('Error generating PDF thumbnail:', err)
      setError(err.message || 'Failed to generate thumbnail')
      setThumbnail(null)
    } finally {
      setIsLoading(false)
    }
  }, [pdfUrl, width, height, quality])

  useEffect(() => {
    generateThumbnail()
  }, [generateThumbnail])

  return { thumbnail, isLoading, error }
}

/**
 * Clear thumbnail cache (useful for cleanup)
 */
export function clearThumbnailCache() {
  thumbnailCache.clear()
}

/**
 * Get cache size for monitoring
 */
export function getThumbnailCacheSize() {
  return thumbnailCache.size
}
