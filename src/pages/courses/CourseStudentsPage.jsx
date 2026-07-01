import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { useMutation } from '../../hooks/useMutation'
import { useToast } from '../../components/NotificationContext'
import CourseTabs from '../../components/CourseTabs'
import SearchInput from '../../components/SearchInput'
import Avatar from '../../components/Avatar'
import ProgressBar from '../../components/ProgressBar'
import Badge from '../../components/Badge'
import Modal, { ModalFooter } from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'

const mockStudents = [
  { id: 1, name: 'Ahmed Khan', email: 'ahmed@school.edu', roll: 'CS-2021-001', progress: 82, attendance: 94, grade: 'A' },
  { id: 2, name: 'Sara Malik', email: 'sara@school.edu', roll: 'CS-2021-002', progress: 65, attendance: 88, grade: 'B+' },
  { id: 3, name: 'Bilal Ahmed', email: 'bilal@school.edu', roll: 'CS-2021-003', progress: 48, attendance: 75, grade: 'C' },
  { id: 4, name: 'Fatima Noor', email: 'fatima@school.edu', roll: 'CS-2021-004', progress: 91, attendance: 100, grade: 'A+' },
  { id: 5, name: 'Usman Ali', email: 'usman@school.edu', roll: 'CS-2021-005', progress: 55, attendance: 81, grade: 'B' },
]

const gradeColor = { 'A+': 'green', A: 'green', 'B+': 'blue', B: 'blue', C: 'amber', D: 'red', F: 'red' }

export default function CourseStudentsPage() {
  const { id } = useParams()
  const toast = useToast()
  const { data: students, loading, error, refetch } = useApi(`/studio/courses/${id}/students/`, { mockData: mockStudents })
  const { mutate: enroll } = useMutation(`/studio/courses/${id}/enroll/`, 'post')
  const { mutate: unenroll } = useMutation(null, 'delete')
  const list = students ?? []

  const [search, setSearch] = useState('')
  const [enrollModal, setEnrollModal] = useState(false)
  const [userId, setUserId] = useState('')

  const filtered = list.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.roll?.toLowerCase().includes(search.toLowerCase())
  )

  const handleEnroll = async () => {
    if (!userId.trim()) return
    try {
      await enroll({ user_id: userId })
      toast.success('Student enrolled.')
      setEnrollModal(false)
      setUserId('')
      refetch()
    } catch { toast.error('Failed to enroll student.') }
  }

  const handleUnenroll = async (studentId) => {
    try {
      await unenroll(null, `/studio/courses/${id}/enroll/${studentId}/`)
      toast.success('Student removed.')
      refetch()
    } catch { toast.error('Failed to remove student.') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to={`/courses/${id}`} className="text-sm text-slate-400 hover:text-slate-600">← Overview</Link>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">Students</h2>
        </div>
        <button onClick={() => setEnrollModal(true)}
          className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
          + Enroll student
        </button>
      </div>

      <CourseTabs />

      <div className="max-w-xs">
        <SearchInput value={search} onChange={setSearch} placeholder="Search students..." />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filtered.length === 0 && !loading ? (
        <EmptyState icon="👥" title="No students found" message="Enroll students to get started." />
      ) : (
        <div className="space-y-2">
          {filtered.map((student) => (
            <div key={student.id} className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
              <Avatar name={student.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-800 truncate">{student.name}</p>
                  <Badge variant={gradeColor[student.grade] || 'slate'}>{student.grade}</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{student.roll} · {student.email}</p>
              </div>
              <div className="hidden sm:block w-32">
                <p className="text-xs text-slate-400 mb-1">Progress</p>
                <ProgressBar value={student.progress} showValue color="violet" />
              </div>
              <div className="hidden md:block text-center min-w-[60px]">
                <p className="text-sm font-semibold text-slate-800">{student.attendance}%</p>
                <p className="text-xs text-slate-400">Attendance</p>
              </div>
              <button onClick={() => handleUnenroll(student.id)}
                className="text-xs px-3 py-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={enrollModal} onClose={() => setEnrollModal(false)} title="Enroll a student" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Enter the student's user ID to enroll them in this course.</p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">User ID</label>
            <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="e.g. 1042"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </div>
        </div>
        <ModalFooter>
          <button onClick={() => setEnrollModal(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleEnroll} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700">Enroll</button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
