import { lazy } from 'react'

export const reportRoutes = [
  { path: '/reports', Component: lazy(() => import('@features/reports/pages/ReportsPage')) },
]
