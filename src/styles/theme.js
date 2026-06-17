export const theme = {
  palette: {
    background: '#0b1208',
    surface: '#11190f',
    surfaceSoft: '#16220d',
    border: '#3a4a24',
    accent: '#d5b45a',
    accentSoft: '#54592e',
    text: '#f7f3df',
    muted: '#a8a58a',
    shadow: '0 18px 45px rgba(0, 0, 0, 0.28)'
  }
}

export const statusConfig = {
  CFC: { label: 'CFC', color: '#48bb78' },
  ESV: { label: 'ESV', color: '#3b82f6' },
  SSV: { label: 'SSV', color: '#facc15' },
  SDE: { label: 'SDE', color: '#f97316' },
  DSP: { label: 'DSP', color: '#6b7280' },
  FLT: { label: 'FLT', color: '#ef4444' }
}

export const statusOptions = Object.keys(statusConfig)
