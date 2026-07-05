import { lazy } from 'react'

export const studentRoutes = [
  { path: '/students', Component: lazy(() => import('@features/students/pages/AllStudentsPage')) },
]
