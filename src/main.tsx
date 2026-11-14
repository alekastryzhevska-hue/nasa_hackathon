import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts bundled with the app (no internet on board). Same families and weights as
// design-system/tokens.css: Fira Sans 700/900, Overpass 400/700/400 italic.
import '@fontsource/fira-sans/latin-700.css'
import '@fontsource/fira-sans/latin-900.css'
import '@fontsource/overpass/latin-400.css'
import '@fontsource/overpass/latin-700.css'
import '@fontsource/overpass/latin-400-italic.css'
import '../design-system/tokens.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
