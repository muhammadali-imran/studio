import { lazy } from 'react'

export const attendanceRoutes = [
  { path: '/courses/:id/attendance', Component: lazy(() => import('@features/attendance/pages/AttendanceListPage')) },
  { path: '/courses/:id/attendance/new', Component: lazy(() => import('@features/attendance/pages/AttendanceSessionPage')) },
  { path: '/courses/:id/attendance/:sid', Component: lazy(() => import('@features/attendance/pages/AttendanceSessionPage')) },
]
