import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`

const SkeletonCardWrapper = styled.div`
  padding: 16px;
  border: 1px solid rgba(255, 106, 0, 0.2);
  border-radius: 6px;
  background: rgba(11, 15, 20, 0.5);
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: ${shimmer} 2s infinite;
  background-image: linear-gradient(
    90deg,
    rgba(255, 106, 0, 0.1) 0%,
    rgba(255, 106, 0, 0.2) 50%,
    rgba(255, 106, 0, 0.1) 100%
  );
  background-size: 200% 100%;
  background-repeat: no-repeat;
`

const SkeletonPreview = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  background: rgba(255, 106, 0, 0.1);
`

const SkeletonLine = styled.div`
  height: ${(props) => props.height || 12}px;
  border-radius: 4px;
  background: rgba(255, 106, 0, 0.1);
  width: ${(props) => props.width || '100%'};
`

const SkeletonButton = styled.div`
  height: 36px;
  border-radius: 4px;
  background: rgba(255, 106, 0, 0.1);
  flex: 1;
`

const SkeletonButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`

export function SkeletonCard() {
  return (
    <SkeletonCardWrapper>
      <SkeletonPreview />
      <div style={{ display: 'grid', gap: 8 }}>
        <SkeletonLine height={16} width="80%" />
        <SkeletonLine height={12} width="60%" />
        <SkeletonLine height={12} width="70%" />
      </div>
      <SkeletonButtonGroup>
        <SkeletonButton />
        <SkeletonButton />
      </SkeletonButtonGroup>
    </SkeletonCardWrapper>
  )
}
