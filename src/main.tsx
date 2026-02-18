import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { AnnualReportsPage } from './pages/AnnualReportsPage'
import './highcharts-config'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/annual-reports" element={<AnnualReportsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
