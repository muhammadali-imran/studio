import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import StudioLayout from '@shared/layouts/StudioLayout'
import AuthLayout from '@shared/layouts/AuthLayout'
import ProtectedRoute from '@shared/components/layout/ProtectedRoute'
import Loading from '@shared/components/ui/Loading'
import { publicRoutes } from './publicRoutes'
import { protectedRoutes } from './protectedRoutes'
import { commonRoutes } from '@features/common/routes'

function LazyLoad({ children }) {
  return <Suspense fallback={<Loading fullscreen />}>{children}</Suspense>
}

function renderAuthRoute({ path, Component }) {
  return (
    <Route
      key={path}
      path={path}
      element={
        <AuthLayout>
          <LazyLoad>
            <Component />
          </LazyLoad>
        </AuthLayout>
      }
    />
  )
}

function renderProtectedRoute({ path, Component, roles }) {
  const page = (
    <LazyLoad>
      <Component />
    </LazyLoad>
  )

  return (
    <Route
      key={path}
      path={path}
      element={roles ? <ProtectedRoute roles={roles}>{page}</ProtectedRoute> : page}
    />
  )
}

export default function AppRouter() {
  const notFoundRoute = commonRoutes.find((route) => route.path === '*')
  const NotFoundPage = notFoundRoute?.Component

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {publicRoutes.map(renderAuthRoute)}

      <Route element={<StudioLayout />}>
        {protectedRoutes.map(renderProtectedRoute)}
      </Route>

      {NotFoundPage && (
        <Route
          path="*"
          element={
            <LazyLoad>
              <NotFoundPage />
            </LazyLoad>
          }
        />
      )}
    </Routes>
  )
}
