import { lazy } from 'react'

export const lectureRoutes = [
  { path: '/courses/:id/lectures', Component: lazy(() => import('@features/lectures/pages/LectureListPage')) },
  { path: '/courses/:id/lectures/new', Component: lazy(() => import('@features/lectures/pages/LectureEditorPage')) },
  { path: '/courses/:id/lectures/:lid/edit', Component: lazy(() => import('@features/lectures/pages/LectureEditorPage')) },
]
