import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext.js'

export default function GuestRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}
