import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ReactGA from 'react-ga4'
import './styles/globals.css'
import App from './App.tsx'

// Initialize Google Analytics
// Replace 'G-XXXXXXXXXX' with your actual Measurement ID
ReactGA.initialize('G-XXXXXXXXXX')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

