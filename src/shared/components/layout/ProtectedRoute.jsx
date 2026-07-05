import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '@shared/hooks/useAuth'
import Loading from '@shared/components/ui/Loading'

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loading fullscreen />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />

  return children
}
