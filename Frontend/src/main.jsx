import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="943955036773-tjobdnt3o9rklbn1a0huijcefomujsgv.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>  
  </StrictMode>,
)
