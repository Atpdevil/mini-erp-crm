import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './Login.tsx'

const token = localStorage.getItem('token')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {token ? <App /> : <Login />}
  </StrictMode>,
)
