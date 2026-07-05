import { dashboardRoutes } from '@features/dashboard/routes'
import { courseRoutes } from '@features/courses/routes'
import { assignmentRoutes } from '@features/assignments/routes'
import { attendanceRoutes } from '@features/attendance/routes'
import { lectureRoutes } from '@features/lectures/routes'
import { quizRoutes } from '@features/quizzes/routes'
import { studentRoutes } from '@features/students/routes'
import { libraryRoutes } from '@features/library/routes'
import { announcementRoutes } from '@features/announcements/routes'
import { reportRoutes } from '@features/reports/routes'
import { settingsRoutes } from '@features/settings/routes'
import { userRoutes } from '@features/users/routes'
import { feeRoutes } from '@features/fees/routes'

export const protectedRoutes = [
  ...dashboardRoutes,
  ...courseRoutes,
  ...lectureRoutes,
  ...quizRoutes,
  ...assignmentRoutes,
  ...attendanceRoutes,
  ...studentRoutes,
  ...libraryRoutes,
  ...announcementRoutes,
  ...reportRoutes,
  ...settingsRoutes,
  ...userRoutes,
  ...feeRoutes,
]
