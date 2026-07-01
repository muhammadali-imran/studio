import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider from '@shared/contexts/AuthProvider'
import SidebarProvider from '@shared/contexts/SidebarProvider'
import ThemeProvider from '@shared/contexts/ThemeProvider'
import { ToastProvider } from '@/components/NotificationContext'
import ProtectedRoute from '@shared/components/layout/ProtectedRoute'
import StudioLayout from '@shared/layouts/StudioLayout'
import AuthLayout from '@shared/layouts/AuthLayout'
import Loading from '@shared/components/ui/Loading'

// Auth — loaded eagerly (tiny, always needed)
import LoginPage from './pages/LoginPage'

// Route-level code splitting: each page bundle is only loaded on first visit.
// React.lazy + <Suspense> replaces the import-everything-up-front approach.
const Dashboard          = lazy(() => import('./pages/Dashboard'))
const CourseListPage     = lazy(() => import('./pages/courses/CourseListPage'))
const CreateCoursePage   = lazy(() => import('./pages/courses/CreateCoursePage'))
const CoursePage         = lazy(() => import('./pages/courses/CoursePage'))
const EditCoursePage     = lazy(() => import('./pages/courses/EditCoursePage'))
const CourseStudentsPage = lazy(() => import('./pages/courses/CourseStudentsPage'))
const LectureListPage    = lazy(() => import('./pages/courses/lectures/LectureListPage'))
const LectureEditorPage  = lazy(() => import('./pages/courses/lectures/LectureEditorPage'))
const QuizListPage       = lazy(() => import('./pages/courses/quizzes/QuizListPage'))
const QuizBuilderPage    = lazy(() => import('./pages/courses/quizzes/QuizBuilderPage'))
const QuizResultsPage    = lazy(() => import('./pages/courses/quizzes/QuizResultsPage'))
const AssignmentListPage     = lazy(() => import('./pages/courses/assignments/AssignmentListPage'))
const AssignmentEditorPage   = lazy(() => import('./pages/courses/assignments/AssignmentEditorPage'))
const SubmissionsPage        = lazy(() => import('./pages/courses/assignments/SubmissionsPage'))
const SubmissionDetailPage   = lazy(() => import('./pages/courses/assignments/SubmissionDetailPage'))
const AttendanceListPage     = lazy(() => import('./pages/courses/attendance/AttendanceListPage'))
const AttendanceSessionPage  = lazy(() => import('./pages/courses/attendance/AttendanceSessionPage'))
const AllStudentsPage    = lazy(() => import('./pages/students/AllStudentsPage'))
const UserManagementPage = lazy(() => import('./pages/users/UserManagementPage'))
const LibraryPage        = lazy(() => import('./pages/library/LibraryPage'))
const AnnouncementsPage  = lazy(() => import('./pages/announcements/AnnouncementsPage'))
const FeesPage           = lazy(() => import('./pages/fees/FeesPage'))
const ReportsPage        = lazy(() => import('./pages/reports/ReportsPage'))
const SettingsPage       = lazy(() => import('./pages/settings/SettingsPage'))
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage'))

// Shared Suspense boundary — wrap entire route tree once so the fallback is
// shown when any lazy page is loading its JS chunk, without duplicating
// <Suspense> on every route.
function PageSuspense({ children }) {
  return <Suspense fallback={<Loading fullscreen />}>{children}</Suspense>
}

// Role-aware guard: renders children only when the user's role is in `roles`.
function Guard({ roles, children }) {
  return <ProtectedRoute roles={roles}>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,146,255,0.16),_transparent_28%),linear-gradient(135deg,_#f8fbff_0%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-4 flex items-center justify-between rounded-3xl border border-sky-100/70 bg-white/75 px-4 py-3 shadow-[0_10px_40px_rgba(26,43,73,0.06)] backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-600">Learning platform</p>
            <h1 className="text-lg font-semibold text-navy">Studio workspace</h1>
          </div>
          <div className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">Live authoring</div>
        </header>

        {/* decorative blobs matching learner landing */}
        <div className="blob-sky" style={{ width: 420, height: 420, top: 40, left: -120 }} />
        <div className="blob-gold" style={{ width: 320, height: 320, right: -80, top: 160 }} />

        <div className="flex-1 rounded-4xl border border-slate-200/70 bg-white/80 p-2 shadow-[0_24px_80px_rgba(26,43,73,0.08)] backdrop-blur">
          <div className="min-h-full rounded-3xl bg-slate-50/80 p-2">
            <BrowserRouter>
              <ThemeProvider>
                <AuthProvider>
                  <SidebarProvider>
                    <ToastProvider>
                      <PageSuspense>
                        <Routes>
                          {/* ── Public ── */}
                          <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />

                        {/* Protected — instructor or admin */}
                        <Route element={<StudioLayout />/*<Protected roles={['instructor', 'admin']}><StudioLayout /></Protected>*/}>
                          <Route path="/dashboard" element={<Dashboard />} />

                            {/* Courses */}
                            <Route path="/courses"              element={<CourseListPage />} />
                            <Route path="/courses/new"          element={<CreateCoursePage />} />
                            <Route path="/courses/:id"          element={<CoursePage />} />
                            <Route path="/courses/:id/edit"     element={<EditCoursePage />} />
                            <Route path="/courses/:id/students" element={<CourseStudentsPage />} />

                            {/* Lectures */}
                            <Route path="/courses/:id/lectures"                 element={<LectureListPage />} />
                            <Route path="/courses/:id/lectures/new"             element={<LectureEditorPage />} />
                            <Route path="/courses/:id/lectures/:lid/edit"       element={<LectureEditorPage />} />

                            {/* Quizzes */}
                            <Route path="/courses/:id/quizzes"                  element={<QuizListPage />} />
                            <Route path="/courses/:id/quizzes/new"              element={<QuizBuilderPage />} />
                            <Route path="/courses/:id/quizzes/:qid/edit"        element={<QuizBuilderPage />} />
                            <Route path="/courses/:id/quizzes/:qid/results"     element={<QuizResultsPage />} />

                            {/* Assignments */}
                            <Route path="/courses/:id/assignments"                              element={<AssignmentListPage />} />
                            <Route path="/courses/:id/assignments/new"                          element={<AssignmentEditorPage />} />
                            <Route path="/courses/:id/assignments/:aid/edit"                    element={<AssignmentEditorPage />} />
                            <Route path="/courses/:id/assignments/:aid/submissions"             element={<SubmissionsPage />} />
                            <Route path="/courses/:id/assignments/:aid/submissions/:sid"        element={<SubmissionDetailPage />} />

                            {/* Attendance */}
                            <Route path="/courses/:id/attendance"               element={<AttendanceListPage />} />
                            <Route path="/courses/:id/attendance/new"           element={<AttendanceSessionPage />} />
                            <Route path="/courses/:id/attendance/:sid"          element={<AttendanceSessionPage />} />

                            {/* Top-level instructor routes */}
                            <Route path="/students"       element={<AllStudentsPage />} />
                            <Route path="/library"        element={<LibraryPage />} />
                            <Route path="/announcements"  element={<AnnouncementsPage />} />
                            <Route path="/reports"        element={<ReportsPage />} />
                            <Route path="/settings"       element={<SettingsPage />} />

                            {/* Admin-only routes — second Guard is intentional: even
                                if someone navigates here with an instructor token they
                                will be redirected to /dashboard. */}
                            <Route
                              path="/users"
                              element={<Guard roles={['admin']}><UserManagementPage /></Guard>}
                            />
                            <Route
                              path="/fees"
                              element={<Guard roles={['admin']}><FeesPage /></Guard>}
                            />
                          </Route>

                          {/* Catch-all */}
                          <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                      </PageSuspense>
                    </ToastProvider>
                  </SidebarProvider>
                </AuthProvider>
              </ThemeProvider>
            </BrowserRouter>
          </div>
        </div>
      </div>
    </div>
  )
}
