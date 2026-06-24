import { useEffect, useState, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc
console.log('📦 PDF thumbnail worker configured:', workerSrc)

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
      
      if (!pdfUrl.startsWith('http') && !pdfUrl.startsWith('blob:')) {
        throw new Error(`Invalid PDF URL format: ${pdfUrl}`)
      }
      
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 45000) // 45s timeout for large PDFs
        
        console.log('📄 Fetching PDF:', pdfUrl.substring(0, 50) + '...')
        
        const response = await fetch(pdfUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/pdf',
            'Cache-Control': 'no-cache'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const contentType = response.headers.get('content-type')
        console.log('✅ PDF Response:', { status: response.status, contentType, size: response.headers.get('content-length') })
        
        pdfData = await response.arrayBuffer()
        clearTimeout(timeout)
        
        if (!pdfData || pdfData.byteLength === 0) {
          throw new Error('Received empty PDF data')
        }
        
        console.log('✅ PDF downloaded:', pdfData.byteLength, 'bytes')
      } catch (err) {
        console.error('❌ PDF fetch failed:', err.message)
        throw err
      }

      // Load PDF document
      console.log('📖 Loading PDF document...')
      const pdf = await pdfjsLib.getDocument({ 
        data: pdfData,
        cMapUrl: new URL('pdfjs-dist/cmaps/', import.meta.url).toString(),
        cMapPacked: true
      }).promise
      
      console.log('✅ PDF loaded:', pdf.numPages, 'pages')
      
      if (!pdf || pdf.numPages === 0) {
        throw new Error('Invalid PDF document (no pages)')
      }

      // Get first page
      const page = await pdf.getPage(1)
      console.log('✅ First page retrieved')
      
      // Calculate optimal scale
      const viewport = page.getViewport({ scale: 1 })
      const scale = Math.min(width / viewport.width, height / viewport.height)
      const scaledViewport = page.getViewport({ scale: scale * quality })

      // Render to canvas
      console.log('🎨 Rendering page to canvas:', { width: Math.floor(scaledViewport.width), height: Math.floor(scaledViewport.height) })
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      
      if (!context) {
        throw new Error('Could not get 2D context from canvas')
      }
      
      canvas.width = Math.floor(scaledViewport.width)
      canvas.height = Math.floor(scaledViewport.height)

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      }
      
      await page.render(renderContext).promise
      console.log('✅ Page rendered to canvas')
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      console.log('✅ Thumbnail created:', dataUrl.substring(0, 50) + '...')
      
      // Cache the result
      thumbnailCache.set(cacheKey, dataUrl)
      console.log('💾 Cached thumbnail, cache size:', thumbnailCache.size)
      
      setThumbnail(dataUrl)
      setError(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('❌ PDF thumbnail error:', errorMsg, { stack: err instanceof Error ? err.stack : 'N/A' })
      setError(errorMsg || 'Failed to generate thumbnail')
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
