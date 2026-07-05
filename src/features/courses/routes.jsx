import { lazy } from 'react'

export const courseRoutes = [
  { path: '/courses', Component: lazy(() => import('@features/courses/pages/CourseListPage')) },
  { path: '/courses/new', Component: lazy(() => import('@features/courses/pages/CreateCoursePage')) },
  { path: '/courses/:id', Component: lazy(() => import('@features/courses/pages/CoursePage')) },
  { path: '/courses/:id/edit', Component: lazy(() => import('@features/courses/pages/EditCoursePage')) },
  { path: '/courses/:id/students', Component: lazy(() => import('@features/courses/pages/CourseStudentsPage')) },
]
