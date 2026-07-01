import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../../../hooks/useApi'
import { useMutation } from '../../../hooks/useMutation'
import { useToast } from '../../../components/NotificationContext'
import CourseTabs from '../../../components/CourseTabs'
import ConfirmDialog from '../../../components/ConfirmDialog'
import EmptyState from '../../../components/EmptyState'
import ErrorState from '../../../components/ErrorState'
import Skeleton from '../../../components/Skeleton'

const mockSessions = [
  { id: 1, date: '2025-01-15', topic: 'Python Setup & Introduction', present: 45, absent: 3, total: 48 },
  { id: 2, date: '2025-01-22', topic: 'Variables & Data Types', present: 44, absent: 4, total: 48 },
  { id: 3, date: '2025-01-29', topic: 'Control Flow', present: 47, absent: 1, total: 48 },
  { id: 4, date: '2025-02-05', topic: 'Loops & Iteration', present: 40, absent: 8, total: 48 },
  { id: 5, date: '2025-02-12', topic: 'Functions', present: 46, absent: 2, total: 48 },
]

export default function AttendanceListPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { data: sessions, loading, error, refetch } = useApi(`/studio/courses/${id}/sessions/`, { mockData: mockSessions })
  const { mutate: del } = useMutation(null, 'delete')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const list = sessions ?? []

  const avgAttendance = list.length > 0
    ? Math.round(list.reduce((s, sess) => s + (sess.present / sess.total) * 100, 0) / list.length)
    : 0

  const handleDelete = async () => {
    try { await del(null, `/studio/sessions/${deleteTarget}/`); toast.success('Session deleted.'); refetch() }
    catch { toast.error('Failed to delete.') }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to={`/courses/${id}`} className="text-sm text-slate-400 hover:text-slate-600">← Overview</Link>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">Attendance</h2>
        </div>
        <Link to={`/courses/${id}/attendance/new`}
          className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
          + New Session
        </Link>
      </div>

      <CourseTabs />

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
          <p className="text-2xl font-bold text-slate-800">{list.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total sessions</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
          <p className={`text-2xl font-bold ${avgAttendance >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>{avgAttendance}%</p>
          <p className="text-xs text-slate-500 mt-1">Avg. attendance</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
          <p className="text-2xl font-bold text-slate-800">{list[0]?.total ?? 0}</p>
          <p className="text-xs text-slate-500 mt-1">Total students</p>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState icon="✅" title="No sessions yet" message="Record your first attendance session."
          action={{ label: 'New session', onClick: () => navigate(`/courses/${id}/attendance/new`) }} />
      ) : (
        <div className="space-y-2">
          {list.map((session) => {
            const pct = Math.round((session.present / session.total) * 100)
            return (
              <div key={session.id} className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
                <div className="text-center min-w-[56px]">
                  <p className="text-sm font-bold text-slate-800">{new Date(session.date).getDate()}</p>
                  <p className="text-xs text-slate-400">{new Date(session.date).toLocaleDateString('en', { month: 'short' })}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{session.topic}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{session.present} present · {session.absent} absent</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 w-10 text-right">{pct}%</span>
                </div>
                <div className="flex gap-2">
                  <Link to={`/courses/${id}/attendance/${session.id}`}
                    className="text-xs px-3 py-1.5 text-violet-600 hover:bg-violet-50 rounded-lg font-medium transition-colors">Edit</Link>
                  <button onClick={() => setDeleteTarget(session.id)}
                    className="text-xs px-3 py-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete session?" message="Attendance records for this session will be permanently removed." confirmLabel="Delete session" />
    </div>
  )
}
