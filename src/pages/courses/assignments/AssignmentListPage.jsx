import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../../../hooks/useApi'
import { useMutation } from '../../../hooks/useMutation'
import { useToast } from '../../../components/NotificationContext'
import CourseTabs from '../../../components/CourseTabs'
import Badge from '../../../components/Badge'
import ConfirmDialog from '../../../components/ConfirmDialog'
import EmptyState from '../../../components/EmptyState'

const mockAssignments = [
  { id: 1, title: 'Lab 1 — Hello World & Variables', due_date: '2025-02-10', max_grade: 20, submissions: 44, graded: 44, status: 'closed' },
  { id: 2, title: 'Lab 2 — Control Flow Exercises', due_date: '2025-02-24', max_grade: 20, submissions: 41, graded: 38, status: 'closed' },
  { id: 3, title: 'Assignment 1 — Mini Project', due_date: '2025-03-10', max_grade: 50, submissions: 18, graded: 0, status: 'open' },
  { id: 4, title: 'Lab 3 — Functions Workshop', due_date: '2025-03-24', max_grade: 20, submissions: 0, graded: 0, status: 'upcoming' },
]
const statusVariant = { open: 'green', closed: 'slate', upcoming: 'amber' }

export default function AssignmentListPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { data } = useApi(`/studio/courses/${id}/assignments/`)
  const { mutate: del } = useMutation(null, 'delete')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const assignments = data ?? mockAssignments

  const handleDelete = async () => {
    try { await del(null, `/studio/assignments/${deleteTarget}/`); toast.success('Assignment deleted.') }
    catch { toast.error('Failed to delete.') }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to={`/courses/${id}`} className="text-sm text-slate-400 hover:text-slate-600">← Overview</Link>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">Assignments</h2>
        </div>
        <Link to={`/courses/${id}/assignments/new`} className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">+ New Assignment</Link>
      </div>

      <CourseTabs />

      {assignments.length === 0 ? (
        <EmptyState icon="📝" title="No assignments yet" message="Create your first assignment." action={{ label: 'Create assignment', onClick: () => navigate(`/courses/${id}/assignments/new`) }} />
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <div key={a.id} className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800">{a.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Due {a.due_date} · {a.max_grade} pts · {a.submissions} submissions · {a.graded} graded
                </p>
              </div>
              <Badge variant={statusVariant[a.status] || 'slate'}>{a.status}</Badge>
              <div className="flex gap-2">
                <Link to={`/courses/${id}/assignments/${a.id}/submissions`} className="text-xs px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors">
                  Submissions ({a.submissions})
                </Link>
                <Link to={`/courses/${id}/assignments/${a.id}/edit`} className="text-xs px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Edit</Link>
                <button onClick={() => setDeleteTarget(a.id)} className="text-xs px-3 py-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete assignment?" message="All student submissions will also be removed." confirmLabel="Delete" />
    </div>
  )
}
