import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: dark;
    font-family: 'Courier New', 'Courier', monospace;
    font-size: 16px;
    line-height: 1.5;
    background: #0B0F14;
    color: #E8EAED;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
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
    background: linear-gradient(135deg, #0B0F14 0%, #1a1f27 50%, #0B0F14 100%);
    background-attachment: fixed;
    color: #E8EAED;
    letter-spacing: 0.3px;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
    letter-spacing: inherit;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  input,
  select,
  textarea {
    border: 1px solid #2E3B2F;
    background: rgba(11, 15, 20, 0.9);
    color: #E8EAED;
    border-radius: 0;
    padding: 10px 12px;
    transition: all 0.2s linear;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);

    &:focus {
      outline: none;
      border-color: #FF6A00;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 106, 0, 0.3);
    }

    &::placeholder {
      color: #7a8088;
    }
  }

  textarea {
    resize: vertical;
    font-family: 'Courier New', 'Courier', monospace;
  }

  ::selection {
    background: rgba(255, 106, 0, 0.4);
    color: #E8EAED;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(11, 15, 20, 0.8);
  }

  ::-webkit-scrollbar-thumb {
    background: #2E3B2F;
    border-radius: 0;

    &:hover {
      background: #FF6A00;
    }
  }
`
