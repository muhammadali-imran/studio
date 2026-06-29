import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../../../hooks/useApi'
import { useMutation } from '../../../hooks/useMutation'
import { useToast } from '../../../components/NotificationContext'
import CourseTabs from '../../../components/CourseTabs'
import Badge from '../../../components/Badge'
import ConfirmDialog from '../../../components/ConfirmDialog'
import EmptyState from '../../../components/EmptyState'

const mockQuizzes = [
  { id: 1, title: 'Week 1 — Python Basics', questions: 10, time_limit: 20, passing_score: 60, published: true, attempts: 42 },
  { id: 2, title: 'Week 3 — Control Flow', questions: 15, time_limit: 30, passing_score: 65, published: true, attempts: 38 },
  { id: 3, title: 'Week 5 — Functions Deep Dive', questions: 12, time_limit: 25, passing_score: 70, published: false, attempts: 0 },
]

export default function QuizListPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { data } = useApi(`/studio/courses/${id}/quizzes/`)
  const { mutate: deleteQuiz } = useMutation(null, 'delete')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const quizzes = data ?? mockQuizzes

  const handleDelete = async () => {
    try { await deleteQuiz(null, `/studio/quizzes/${deleteTarget}/`); toast.success('Quiz deleted.') }
    catch { toast.error('Failed to delete.') }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to={`/courses/${id}`} className="text-sm text-slate-400 hover:text-slate-600">← Overview</Link>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">Quizzes</h2>
        </div>
        <Link to={`/courses/${id}/quizzes/new`} className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">+ New Quiz</Link>
      </div>

      <CourseTabs />

      {quizzes.length === 0 ? (
        <EmptyState icon="❓" title="No quizzes yet" message="Build your first quiz to assess students." action={{ label: 'Create quiz', onClick: () => navigate(`/courses/${id}/quizzes/new`) }} />
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800">{quiz.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {quiz.questions} questions · {quiz.time_limit} min · Pass: {quiz.passing_score}% · {quiz.attempts} attempts
                </p>
              </div>
              <Badge variant={quiz.published ? 'green' : 'amber'}>{quiz.published ? 'Published' : 'Draft'}</Badge>
              <div className="flex gap-2">
                <Link to={`/courses/${id}/quizzes/${quiz.id}/results`} className="text-xs px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors">Results</Link>
                <Link to={`/courses/${id}/quizzes/${quiz.id}/edit`} className="text-xs px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Edit</Link>
                <button onClick={() => setDeleteTarget(quiz.id)} className="text-xs px-3 py-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete quiz?" message="All student attempts will also be removed." confirmLabel="Delete quiz" />
    </div>
  )
}
