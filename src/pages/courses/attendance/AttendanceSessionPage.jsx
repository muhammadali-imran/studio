import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../../../hooks/useApi'
import { useMutation } from '../../../hooks/useMutation'
import { useToast } from '../../../components/NotificationContext'
import AttendanceGrid from '../../../components/AttendanceGrid'
import Card, { CardTitle } from '../../../components/Card'
import ActionBar from '../../../components/ActionBar'

const mockStudents = [
  { id: 1, name: 'Ahmed Khan', roll: 'CS-2021-001', email: 'ahmed@school.edu' },
  { id: 2, name: 'Sara Malik', roll: 'CS-2021-002', email: 'sara@school.edu' },
  { id: 3, name: 'Bilal Ahmed', roll: 'CS-2021-003', email: 'bilal@school.edu' },
  { id: 4, name: 'Fatima Noor', roll: 'CS-2021-004', email: 'fatima@school.edu' },
  { id: 5, name: 'Usman Ali', roll: 'CS-2021-005', email: 'usman@school.edu' },
  { id: 6, name: 'Ayesha Tariq', roll: 'CS-2021-006', email: 'ayesha@school.edu' },
  { id: 7, name: 'Hassan Raza', roll: 'CS-2021-007', email: 'hassan@school.edu' },
  { id: 8, name: 'Zara Sheikh', roll: 'CS-2021-008', email: 'zara@school.edu' },
]

export default function AttendanceSessionPage() {
  const { id, sid } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = !!sid && sid !== 'new'

  const { data: students } = useApi(`/studio/courses/${id}/students/`)
  const { data: existingSession } = useApi(isEdit ? `/studio/sessions/${sid}/` : null)
  const { mutate: save, loading: saving } = useMutation(
    isEdit ? `/studio/sessions/${sid}/mark/` : `/studio/courses/${id}/sessions/`,
    isEdit ? 'post' : 'post'
  )

  const studentList = students ?? mockStudents
  const today = new Date().toISOString().split('T')[0]

  const [date, setDate] = useState(today)
  const [topic, setTopic] = useState('')
  const [attendance, setAttendance] = useState({})

  // Initialise all students as present
  useEffect(() => {
    const init = {}
    studentList.forEach((s) => { init[s.id] = true })
    setAttendance(init)
  }, [studentList.length])

  useEffect(() => {
    if (existingSession) {
      setDate(existingSession.date)
      setTopic(existingSession.topic)
      const map = {}
      existingSession.records?.forEach((r) => { map[r.student_id] = r.present })
      setAttendance(map)
    }
  }, [existingSession])

  const handleSave = async () => {
    if (!topic.trim()) { toast.error('Session topic is required.'); return }
    const records = studentList.map((s) => ({ id: s.id, present: !!attendance[s.id] }))
    try {
      await save({ date, topic, students: records })
      toast.success('Attendance saved successfully.')
      navigate(`/courses/${id}/attendance`)
    } catch { toast.error('Failed to save attendance.') }
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <Link to={`/courses/${id}/attendance`} className="text-sm text-slate-400 hover:text-slate-600">← Attendance</Link>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">{isEdit ? 'Edit Session' : 'New Session'}</h2>
      </div>

      <Card>
        <CardTitle className="mb-4">Session details</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Topic</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Functions & Scope"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">Mark attendance</h3>
        <AttendanceGrid students={studentList} attendance={attendance} onChange={setAttendance} />
      </div>

      <ActionBar onCancel={() => navigate(`/courses/${id}/attendance`)} onSave={handleSave} saving={saving} label="Save attendance" />
    </div>
  )
}
