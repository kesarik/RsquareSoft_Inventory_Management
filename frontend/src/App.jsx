import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './views/pages/Login/LoginPage'
import DashboardPage from './views/pages/Dashboard/DashboardPage'
import AssetList from './views/pages/Assets/AssetList'
import AllocationList from './views/pages/Allocations/AllocationList'
import EmployeeList from './views/pages/Employees/EmployeeList'

function App() {
  return (
    <Routes>
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/dashboard"   element={<DashboardPage />} />
      <Route path="/assets"      element={<AssetList />} />
      <Route path="/facility"    element={<DashboardPage />} />
      <Route path="/employees"   element={<EmployeeList />} />
      <Route path="/allocations" element={<AllocationList />} />
      <Route path="*"            element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
