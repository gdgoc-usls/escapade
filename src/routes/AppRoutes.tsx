import { Routes, Route } from 'react-router-dom'
import App from '../App'
import Dashboard from '../views/Dashboard'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin" element={<App adminLogin />} />
      <Route path="/home" element={<App />} />
      <Route path="/story" element={<App />} />
      <Route path="/mission" element={<App />} />
      <Route path="/tickets" element={<App />} />
      <Route path="/leaderboard" element={<App />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
