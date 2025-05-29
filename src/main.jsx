import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import Router from './routes/Router.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Router />
  </BrowserRouter>
)
