import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useApi } from '@shared/hooks/useApi'
import { useMutation } from '@shared/hooks/useMutation'
import { useToast } from '@shared/contexts/NotificationContext'
import QuestionBuilder from '@features/quizzes/components/QuestionBuilder'
import Card, { CardTitle } from '@shared/components/ui/Card'
import ActionBar from '@shared/components/layout/ActionBar'

export default function QuizBuilderPage() {
  const { id, qid } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = !!qid

  const { data: existing } = useApi(isEdit ? `/studio/quizzes/${qid}/` : null)
  const { mutate: save, loading: saving } = useMutation(
    isEdit ? `/studio/quizzes/${qid}/` : `/studio/courses/${id}/quizzes/`,
    isEdit ? 'put' : 'post'
  )

  const [meta, setMeta] = useState({ title: '', time_limit: 30, passing_score: 60, published: false })
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    if (existing) {
      setMeta({ title: existing.title, time_limit: existing.time_limit, passing_score: existing.passing_score, published: existing.published })
      setQuestions(existing.questions ?? [])
    }
  }, [existing])

  const setM = (key) => (e) => setMeta((m) => ({ ...m, [key]: e.target ? (e.target.type === 'number' ? Number(e.target.value) : e.target.value) : e }))

  const handleSave = async () => {
    if (!meta.title.trim()) { toast.error('Quiz title is required.'); return }
    if (questions.length === 0) { toast.error('Add at least one question.'); return }
    try {
      await save({ ...meta, questions })
      toast.success(isEdit ? 'Quiz updated.' : 'Quiz created.')
      navigate(`/courses/${id}/quizzes`)
    } catch {
      toast.error('Failed to save quiz.')
    }
  }

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0)

  return (
    <div className="space-y-6 pb-20">
      <div>
        <Link to={`/courses/${id}/quizzes`} className="text-sm text-slate-400 hover:text-slate-600">← Quizzes</Link>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">{isEdit ? 'Edit Quiz' : 'New Quiz'}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Quiz title</label>
              <input value={meta.title} onChange={setM('title')} placeholder="e.g. Week 3 — Control Flow"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-slate-800">Questions</h3>
              <span className="text-xs text-slate-400">{questions.length} questions · {totalPoints} total points</span>
            </div>
            <QuestionBuilder questions={questions} onChange={setQuestions} />
          </div>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-5">
          <Card>
            <CardTitle className="mb-4">Quiz settings</CardTitle>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Time limit (minutes)</label>
                <input type="number" min={5} max={180} value={meta.time_limit} onChange={setM('time_limit')}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Passing score (%)</label>
                <input type="number" min={0} max={100} value={meta.passing_score} onChange={setM('passing_score')}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle className="mb-3">Visibility</CardTitle>
            <div className={`flex items-center justify-between p-3 rounded-xl ${meta.published ? 'bg-emerald-50' : 'bg-slate-50'}`}>
              <div>
                <p className="text-sm font-medium text-slate-800">{meta.published ? 'Published' : 'Draft'}</p>
                <p className="text-xs text-slate-400">{meta.published ? 'Open to students' : 'Hidden'}</p>
              </div>
              <button onClick={() => setMeta((m) => ({ ...m, published: !m.published }))}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${meta.published ? 'bg-slate-200 text-slate-600' : 'bg-violet-600 text-white hover:bg-violet-700'}`}>
                {meta.published ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </Card>

          <Card>
            <CardTitle className="mb-3">Summary</CardTitle>
            <dl className="text-sm space-y-2">
              <div className="flex justify-between"><dt className="text-slate-500">Questions</dt><dd className="font-medium">{questions.length}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Total points</dt><dd className="font-medium">{totalPoints}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Time limit</dt><dd className="font-medium">{meta.time_limit} min</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Pass threshold</dt><dd className="font-medium">{meta.passing_score}%</dd></div>
            </dl>
          </Card>
        </div>
      </div>

      <ActionBar onCancel={() => navigate(`/courses/${id}/quizzes`)} onSave={handleSave} saving={saving} />
    </div>
  )
}
