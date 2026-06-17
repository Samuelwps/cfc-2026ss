import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: dark;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    background: #071004;
    color: #f7f3df;
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background: radial-gradient(circle at top, rgba(230, 204, 110, 0.16) 0%, transparent 40%),
      linear-gradient(180deg, #0b1208 0%, #060906 100%);
    color: #f7f3df;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  input,
  select {
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(13, 17, 10, 0.88);
    color: #f7f3df;
    border-radius: 12px;
  }

  ::selection {
    background: rgba(196, 161, 63, 0.35);
    color: #f8f5dc;
  }
`
