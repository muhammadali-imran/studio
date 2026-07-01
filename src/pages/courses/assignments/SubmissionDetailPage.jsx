import { Link, useParams } from 'react-router-dom'
import { useApi } from '../../../hooks/useApi'
import { useMutation } from '../../../hooks/useMutation'
import { useToast } from '../../../components/NotificationContext'
import SubmissionReview from '../../../components/SubmissionReview'
import Loading from '../../../components/Loading'
import ErrorState from '../../../components/ErrorState'
import Badge from '../../../components/Badge'

const mockSubmission = {
  id: 2,
  student_name: 'Sara Malik',
  student_email: 'sara@school.edu',
  submitted_at: '2025-03-09 at 11:55 PM',
  late: false,
  grade: null,
  feedback: '',
  file: { name: 'assignment_sara.zip', size: '2.4 MB', url: '#' },
  text: null,
}

export default function SubmissionDetailPage() {
  const { id, aid, sid } = useParams()
  const toast = useToast()
  const { data: submission, loading, error, refetch } = useApi(`/studio/submissions/${sid}/`, { mockData: mockSubmission })
  const { mutate: grade } = useMutation(`/studio/submissions/${sid}/grade/`, 'post')

  const handleGrade = async ({ grade: g, feedback }) => {
    try {
      await grade({ grade: g, feedback })
      toast.success('Grade saved successfully.')
      refetch()
    } catch {
      toast.error('Failed to save grade.')
    }
  }

  if (loading) return <Loading fullscreen />
  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (!submission) return null

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to={`/courses/${id}/assignments/${aid}/submissions`} className="text-sm text-slate-400 hover:text-slate-600">← Submissions</Link>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">{submission.student_name}</h2>
          <p className="text-slate-500 text-sm mt-0.5">{submission.student_email}</p>
        </div>
        <div className="flex gap-2">
          {submission.late && <Badge variant="red">Late</Badge>}
          {submission.grade !== null && <Badge variant="green">Graded: {submission.grade}/100</Badge>}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <SubmissionReview submission={submission} maxGrade={100} onGrade={handleGrade} />
      </div>
    </div>
  )
}
