import { lazy } from 'react'

export const dashboardRoutes = [
  { path: '/dashboard', Component: lazy(() => import('@features/dashboard/pages/Dashboard')) },
]
