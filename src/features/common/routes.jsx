import { lazy } from 'react'

export const commonRoutes = [
  { path: '*', Component: lazy(() => import('@features/common/pages/NotFoundPage')) },
]
