import styled from 'styled-components'
import { getFileIcon, getFileType } from '../utils/fileHelpers'

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size || 48}px;
  height: ${(props) => props.size || 48}px;
  background: ${(props) => {
    const type = getFileType(props.fileName)
    switch (type) {
      case 'pdf':
        return 'rgba(255, 106, 0, 0.1)'
      case 'word':
        return 'rgba(66, 165, 245, 0.1)'
      case 'text':
        return 'rgba(255, 167, 38, 0.1)'
      case 'image':
        return 'rgba(102, 187, 106, 0.1)'
      case 'video':
        return 'rgba(171, 71, 188, 0.1)'
      case 'audio':
        return 'rgba(236, 64, 122, 0.1)'
      case 'excel':
        return 'rgba(38, 194, 129, 0.1)'
      case 'powerpoint':
        return 'rgba(216, 67, 21, 0.1)'
      case 'archive':
        return 'rgba(156, 39, 176, 0.1)'
      default:
        return 'rgba(122, 128, 136, 0.1)'
    }
  }};
  border-radius: 4px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`

export function FileIcon({ fileName, size = 48 }) {
  const iconSvg = getFileIcon(fileName, size)

  return (
    <IconWrapper
      fileName={fileName}
      size={size}
      dangerouslySetInnerHTML={{ __html: iconSvg }}
    />
  )
}
