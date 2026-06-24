/**
 * File handling utilities for document management
 */

// File type detection
export const getFileType = (fileName) => {
  const ext = fileName?.split('.').pop()?.toLowerCase() || ''
  
  const types = {
    // Documents
    'pdf': 'pdf',
    'doc': 'word',
    'docx': 'word',
    'txt': 'text',
    'rtf': 'text',
    'odt': 'text',
    
    // Spreadsheets
    'xls': 'excel',
    'xlsx': 'excel',
    'csv': 'excel',
    'ods': 'excel',
    
    // Presentations
    'ppt': 'powerpoint',
    'pptx': 'powerpoint',
    'odp': 'powerpoint',
    
    // Images
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'webp': 'image',
    'svg': 'image',
    'bmp': 'image',
    'ico': 'image',
    
    // Videos
    'mp4': 'video',
    'avi': 'video',
    'mov': 'video',
    'mkv': 'video',
    'webm': 'video',
    
    // Audio
    'mp3': 'audio',
    'wav': 'audio',
    'flac': 'audio',
    'aac': 'audio',
    
    // Archives
    'zip': 'archive',
    'rar': 'archive',
    '7z': 'archive',
    'tar': 'archive',
    'gz': 'archive',
  }
  
  return types[ext] || 'unknown'
}

// Get file icon SVG
export const getFileIcon = (fileName, size = 48) => {
  const type = getFileType(fileName)
  
  const icons = {
    pdf: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="1" fill="#FF6A00" opacity="0.1" stroke="#FF6A00" stroke-width="1.5"/>
      <path d="M6 8h12M6 12h12M6 16h8" stroke="#FF6A00" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    
    word: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="1" fill="#42A5F5" opacity="0.1" stroke="#42A5F5" stroke-width="1.5"/>
      <path d="M5 8h2v8H5M9 8h2v8H9M13 8h4c1 0 1 1 1 2v2c0 1-1 1-1 1h-4" stroke="#42A5F5" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    
    text: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="1" fill="#FFA726" opacity="0.1" stroke="#FFA726" stroke-width="1.5"/>
      <path d="M6 8h12M6 11h12M6 14h9" stroke="#FFA726" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    
    image: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="1" fill="#66BB6A" opacity="0.1" stroke="#66BB6A" stroke-width="1.5"/>
      <circle cx="8" cy="9" r="1.5" fill="#66BB6A"/>
      <path d="M4 17l5-5 4 4 5-7" stroke="#66BB6A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    
    video: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="1" fill="#AB47BC" opacity="0.1" stroke="#AB47BC" stroke-width="1.5"/>
      <path d="M9 8v8l6-4-6-4z" fill="#AB47BC"/>
    </svg>`,
    
    audio: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="1" fill="#EC407A" opacity="0.1" stroke="#EC407A" stroke-width="1.5"/>
      <path d="M12 6v10M9 10v6M15 10v6" stroke="#EC407A" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    
    excel: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="1" fill="#26C281" opacity="0.1" stroke="#26C281" stroke-width="1.5"/>
      <rect x="5" y="7" width="3" height="3" stroke="#26C281" stroke-width="1"/>
      <rect x="9" y="7" width="3" height="3" stroke="#26C281" stroke-width="1"/>
      <rect x="5" y="11" width="3" height="3" stroke="#26C281" stroke-width="1"/>
      <rect x="9" y="11" width="3" height="3" stroke="#26C281" stroke-width="1"/>
    </svg>`,
    
    powerpoint: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="1" fill="#D84315" opacity="0.1" stroke="#D84315" stroke-width="1.5"/>
      <circle cx="12" cy="10" r="2.5" fill="#D84315"/>
      <path d="M7 18h10" stroke="#D84315" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    
    archive: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="1" fill="#9C27B0" opacity="0.1" stroke="#9C27B0" stroke-width="1.5"/>
      <path d="M7 6h10M8 8l-1 10a1 1 0 001 1h8a1 1 0 001-1l-1-10" stroke="#9C27B0" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M10 11h4M10 14h4" stroke="#9C27B0" stroke-width="1" stroke-linecap="round"/>
    </svg>`,
    
    unknown: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="1" fill="#7a8088" opacity="0.1" stroke="#7a8088" stroke-width="1.5"/>
      <path d="M12 8v4M12 15h0.01" stroke="#7a8088" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  }
  
  return icons[type]?.(size) || icons.unknown(size)
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Check if file is previewable
export const isPreviewable = (fileName) => {
  const type = getFileType(fileName)
  return ['pdf', 'image'].includes(type)
}

// Check if file is image
export const isImage = (fileName) => {
  return getFileType(fileName) === 'image'
}

// Check if file is PDF
export const isPDF = (fileName) => {
  return getFileType(fileName) === 'pdf'
}

// Get MIME type
export const getMimeType = (fileName) => {
  const ext = fileName?.split('.').pop()?.toLowerCase() || ''
  
  const mimes = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp4': 'video/mp4',
    'mp3': 'audio/mpeg',
    'zip': 'application/zip',
  }
  
  return mimes[ext] || 'application/octet-stream'
}

// Generate thumbnail URL for images
export const getImageThumbnailUrl = (url, size = 200) => {
  // If it's a data URL or blob URL, return as-is
  if (url?.startsWith('blob:') || url?.startsWith('data:')) {
    return url
  }
  
  // For URLs, you could add query parameters for thumbnails
  // This is a basic implementation
  return url
}

// Format date
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch {
    return 'Data inválida'
  }
}

// Format date short
export const formatDateShort = (dateString) => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  } catch {
    return 'Data inválida'
  }
}

// Sanitize file name
export const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .trim()
}
