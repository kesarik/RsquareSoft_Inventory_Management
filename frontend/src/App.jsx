import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './views/pages/Login/LoginPage'
import DashboardPage from './views/pages/Dashboard/DashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/assets" element={<DashboardPage />} />
      <Route path="/facility" element={<DashboardPage />} />
      <Route path="/employees" element={<DashboardPage />} />
      <Route path="/allocations" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
