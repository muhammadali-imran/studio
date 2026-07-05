import { lazy } from 'react'

export const feeRoutes = [
  { path: '/fees', Component: lazy(() => import('@features/fees/pages/FeesPage')), roles: ['admin'] },
]
