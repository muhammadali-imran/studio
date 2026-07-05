import { lazy } from 'react'

export const quizRoutes = [
  { path: '/courses/:id/quizzes', Component: lazy(() => import('@features/quizzes/pages/QuizListPage')) },
  { path: '/courses/:id/quizzes/new', Component: lazy(() => import('@features/quizzes/pages/QuizBuilderPage')) },
  { path: '/courses/:id/quizzes/:qid/edit', Component: lazy(() => import('@features/quizzes/pages/QuizBuilderPage')) },
  { path: '/courses/:id/quizzes/:qid/results', Component: lazy(() => import('@features/quizzes/pages/QuizResultsPage')) },
]
