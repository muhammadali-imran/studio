import { lazy } from 'react'

export const assignmentRoutes = [
  { path: '/courses/:id/assignments', Component: lazy(() => import('@features/assignments/pages/AssignmentListPage')) },
  { path: '/courses/:id/assignments/new', Component: lazy(() => import('@features/assignments/pages/AssignmentEditorPage')) },
  { path: '/courses/:id/assignments/:aid/edit', Component: lazy(() => import('@features/assignments/pages/AssignmentEditorPage')) },
  { path: '/courses/:id/assignments/:aid/submissions', Component: lazy(() => import('@features/assignments/pages/SubmissionsPage')) },
  { path: '/courses/:id/assignments/:aid/submissions/:sid', Component: lazy(() => import('@features/assignments/pages/SubmissionDetailPage')) },
]
