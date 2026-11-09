import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext.js'

export default function ProtectedRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
