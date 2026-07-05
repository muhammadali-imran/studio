import { lazy } from 'react'

export const authRoutes = [
  { path: '/login', Component: lazy(() => import('@features/auth/pages/LoginPage')) },
]
