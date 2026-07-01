import { Link, useParams } from 'react-router-dom'
import { useApi } from '@shared/hooks/useApi'
import Badge from '@shared/components/ui/Badge'
import DataTable from '@shared/components/ui/DataTable'
import ErrorState from '../../../components/ErrorState'

const mockSubmissions = [
  { id: 1, student_name: 'Ahmed Khan', student_email: 'ahmed@school.edu', submitted_at: '2025-03-08 14:22', late: false, grade: 18, graded: true, file: 'lab3_ahmed.pdf' },
  { id: 2, student_name: 'Sara Malik', student_email: 'sara@school.edu', submitted_at: '2025-03-09 23:55', late: false, grade: null, graded: false, file: 'assignment_sara.zip' },
  { id: 3, student_name: 'Bilal Ahmed', student_email: 'bilal@school.edu', submitted_at: '2025-03-11 02:10', late: true, grade: null, graded: false, file: 'bilal_lab3.pdf' },
  { id: 4, student_name: 'Fatima Noor', student_email: 'fatima@school.edu', submitted_at: '2025-03-09 18:05', late: false, grade: 20, graded: true, file: 'fatima_submission.pdf' },
  { id: 5, student_name: 'Usman Ali', student_email: 'usman@school.edu', submitted_at: null, late: false, grade: null, graded: false, file: null },
]

export default function SubmissionsPage() {
  const { id, aid } = useParams()
  const { data: submissions, loading, error, refetch } = useApi(`/studio/assignments/${aid}/submissions/`, { mockData: mockSubmissions })
  const list = submissions ?? []

  const graded = list.filter((s) => s.graded).length
  const pending = list.filter((s) => s.submitted_at && !s.graded).length

  const columns = [
    { field: 'student_name', header: 'Student', sortable: true, render: (row) => (
      <div>
        <p className="font-medium text-slate-800">{row.student_name}</p>
        <p className="text-xs text-slate-400">{row.student_email}</p>
      </div>
    )},
    { field: 'submitted_at', header: 'Submitted', render: (row) => row.submitted_at
      ? <span className="text-slate-600">{row.submitted_at}</span>
      : <span className="text-slate-300 italic">Not submitted</span>
    },
    { field: 'late', header: 'Status', render: (row) => {
      if (!row.submitted_at) return <Badge variant="slate">Missing</Badge>
      if (row.late) return <Badge variant="red">Late</Badge>
      return <Badge variant="green">On time</Badge>
    }},
    { field: 'grade', header: 'Grade', render: (row) => row.graded
      ? <span className="font-semibold text-slate-800">{row.grade} / 100</span>
      : <span className="text-slate-400">—</span>
    },
    { field: 'actions', header: '', render: (row) => row.submitted_at ? (
      <Link to={`/courses/${id}/assignments/${aid}/submissions/${row.id}`}
        className="text-xs px-3 py-1.5 text-violet-600 hover:bg-violet-50 rounded-lg font-medium transition-colors">
        {row.graded ? 'Review' : 'Grade →'}
      </Link>
    ) : null },
  ]

  return (
    <div className="space-y-6">
      <div>
        <Link to={`/courses/${id}/assignments`} className="text-sm text-slate-400 hover:text-slate-600">← Assignments</Link>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">Submissions</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total submissions', value: list.filter((s) => s.submitted_at).length, color: 'text-slate-800' },
          { label: 'Graded', value: graded, color: 'text-emerald-600' },
          { label: 'Pending grading', value: pending, color: pending > 0 ? 'text-amber-600' : 'text-slate-800' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <DataTable columns={columns} data={list} loading={loading} emptyMessage="No submissions yet" />
      )}
    </div>
  )
}
