import { lazy } from 'react'

export const settingsRoutes = [
  { path: '/settings', Component: lazy(() => import('@features/settings/pages/SettingsPage')) },
]
