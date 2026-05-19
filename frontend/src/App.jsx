import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './views/pages/Login/LoginPage'
import DashboardPage from './views/pages/Dashboard/DashboardPage'
import AssetList from './views/pages/Assets/AssetList'

function App() {
  return (
    <Routes>
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/dashboard"   element={<DashboardPage />} />
      <Route path="/assets"      element={<AssetList />} />
      <Route path="/facility"    element={<DashboardPage />} />
      <Route path="/employees"   element={<DashboardPage />} />
      <Route path="/allocations" element={<DashboardPage />} />
      <Route path="*"            element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
