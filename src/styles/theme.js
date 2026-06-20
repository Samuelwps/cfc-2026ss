export const theme = {
  palette: {
    // Tactical Military Color Palette
    background: '#0B0F14',          // Charcoal black base
    surface: '#1a1f27',             // Dark steel gray
    surfaceSoft: '#252d38',         // Medium tactical gray
    border: '#2E3B2F',              // Military green accent
    accent: '#FF6A00',              // Alert orange tactical
    accentSoft: '#C2A84A',          // Muted military yellow
    text: '#E8EAED',                // Bright tactical text
    muted: '#7a8088',               // Steel gray text
    critical: '#D72638',            // Tactical red
    tactical: '#3F5A3D',            // Deep military green
    shadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 106, 0, 0.1)',
    shadowIntense: '0 0 25px rgba(255, 106, 0, 0.25)',
  }
}

export const statusConfig = {
  CFC: { label: 'CFC', color: '#66BB6A' },           // Military green
  ESV: { label: 'ESV', color: '#42A5F5' },          // Sky blue tactical
  SSV: { label: 'SSV', color: '#FFB74D' },          // Tactical yellow
  SDE: { label: 'SDE', color: '#FF6A00' },          // Alert orange
  DSP: { label: 'DSP', color: '#5A6D7C' },          // Steel gray
  FLT: { label: 'FLT', color: '#D72638' }           // Tactical red
}

export const statusOptions = Object.keys(statusConfig)
