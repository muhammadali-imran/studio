import { lazy } from 'react'

export const announcementRoutes = [
  { path: '/announcements', Component: lazy(() => import('@features/announcements/pages/AnnouncementsPage')) },
]
