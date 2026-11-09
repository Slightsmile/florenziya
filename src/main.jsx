import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import MetaPixelTracker from './components/MetaPixelTracker.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <MetaPixelTracker />
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
        <Analytics />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
