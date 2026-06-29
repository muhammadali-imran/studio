import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider from './contexts/AuthProvider'
import SidebarProvider from './contexts/SidebarProvider'
import ThemeProvider from './contexts/ThemeProvider'
import { ToastProvider } from './components/NotificationContext'
import ProtectedRoute from './components/ProtectedRoute'
import StudioLayout from './layouts/StudioLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth pages
import LoginPage from './pages/LoginPage'

// Dashboard
import Dashboard from './pages/Dashboard'

// Courses
import CourseListPage from './pages/courses/CourseListPage'
import CreateCoursePage from './pages/courses/CreateCoursePage'
import CoursePage from './pages/courses/CoursePage'
import EditCoursePage from './pages/courses/EditCoursePage'

// Lectures
import LectureListPage from './pages/courses/lectures/LectureListPage'
import LectureEditorPage from './pages/courses/lectures/LectureEditorPage'

// Quizzes
import QuizListPage from './pages/courses/quizzes/QuizListPage'
import QuizBuilderPage from './pages/courses/quizzes/QuizBuilderPage'
import QuizResultsPage from './pages/courses/quizzes/QuizResultsPage'

// Assignments
import AssignmentListPage from './pages/courses/assignments/AssignmentListPage'
import AssignmentEditorPage from './pages/courses/assignments/AssignmentEditorPage'
import SubmissionsPage from './pages/courses/assignments/SubmissionsPage'
import SubmissionDetailPage from './pages/courses/assignments/SubmissionDetailPage'

// Attendance
import AttendanceListPage from './pages/courses/attendance/AttendanceListPage'
import AttendanceSessionPage from './pages/courses/attendance/AttendanceSessionPage'

// Students per course
import CourseStudentsPage from './pages/courses/CourseStudentsPage'

// Top-level pages
import AllStudentsPage from './pages/students/AllStudentsPage'
import UserManagementPage from './pages/users/UserManagementPage'
import LibraryPage from './pages/library/LibraryPage'
import AnnouncementsPage from './pages/announcements/AnnouncementsPage'
import FeesPage from './pages/fees/FeesPage'
import ReportsPage from './pages/reports/ReportsPage'
import SettingsPage from './pages/settings/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

function Protected({ children, roles }) {
  return <ProtectedRoute roles={roles}>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <ToastProvider>
              <Routes>
                {/* Public */}
                <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Protected — instructor or admin */}
                <Route element={<StudioLayout />/*<Protected roles={['instructor', 'admin']}><StudioLayout /></Protected>*/}>
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Courses */}
                  <Route path="/courses" element={<CourseListPage />} />
                  <Route path="/courses/new" element={<CreateCoursePage />} />
                  <Route path="/courses/:id" element={<CoursePage />} />
                  <Route path="/courses/:id/edit" element={<EditCoursePage />} />

                  {/* Lectures */}
                  <Route path="/courses/:id/lectures" element={<LectureListPage />} />
                  <Route path="/courses/:id/lectures/new" element={<LectureEditorPage />} />
                  <Route path="/courses/:id/lectures/:lid/edit" element={<LectureEditorPage />} />

                  {/* Quizzes */}
                  <Route path="/courses/:id/quizzes" element={<QuizListPage />} />
                  <Route path="/courses/:id/quizzes/new" element={<QuizBuilderPage />} />
                  <Route path="/courses/:id/quizzes/:qid/edit" element={<QuizBuilderPage />} />
                  <Route path="/courses/:id/quizzes/:qid/results" element={<QuizResultsPage />} />

                  {/* Assignments */}
                  <Route path="/courses/:id/assignments" element={<AssignmentListPage />} />
                  <Route path="/courses/:id/assignments/new" element={<AssignmentEditorPage />} />
                  <Route path="/courses/:id/assignments/:aid/edit" element={<AssignmentEditorPage />} />
                  <Route path="/courses/:id/assignments/:aid/submissions" element={<SubmissionsPage />} />
                  <Route path="/courses/:id/assignments/:aid/submissions/:sid" element={<SubmissionDetailPage />} />

                  {/* Attendance */}
                  <Route path="/courses/:id/attendance" element={<AttendanceListPage />} />
                  <Route path="/courses/:id/attendance/new" element={<AttendanceSessionPage />} />
                  <Route path="/courses/:id/attendance/:sid" element={<AttendanceSessionPage />} />

                  {/* Course students */}
                  <Route path="/courses/:id/students" element={<CourseStudentsPage />} />

                  {/* Top-level */}
                  <Route path="/students" element={<AllStudentsPage />} />
                  <Route path="/users" element={<Protected roles={['admin']}><UserManagementPage /></Protected>} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/announcements" element={<AnnouncementsPage />} />
                  <Route path="/fees" element={<Protected roles={['admin']}><FeesPage /></Protected>} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ToastProvider>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
