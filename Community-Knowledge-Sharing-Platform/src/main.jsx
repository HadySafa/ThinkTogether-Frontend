import { createRoot } from 'react-dom/client'
import { MyProvider } from './Context/index.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <MyProvider>
    <App />
  </MyProvider>
)
