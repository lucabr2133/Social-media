import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import AppWithProviders from './Providers'
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <BrowserRouter>
      <AppWithProviders />
    </BrowserRouter>

  </StrictMode>
)
