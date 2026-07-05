import { lazy } from 'react'

export const userRoutes = [
  { path: '/users', Component: lazy(() => import('@features/users/pages/UserManagementPage')), roles: ['admin'] },
]
