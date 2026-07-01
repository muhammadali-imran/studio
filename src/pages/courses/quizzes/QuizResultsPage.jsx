import { Link, useParams } from 'react-router-dom'
import { useApi } from '../../../hooks/useApi'
import Card, { CardTitle } from '../../../components/Card'
import Badge from '../../../components/Badge'
import DataTable from '../../../components/DataTable'
import Loading from '../../../components/Loading'
import ErrorState from '../../../components/ErrorState'
import { BarChartWidget } from '../../../components/ChartWidget'

const mockResults = {
  quiz: { title: 'Week 1 — Python Basics', total_attempts: 42, avg_score: 74, pass_rate: 81, avg_time: '17 min' },
  attempts: [
    { id: 1, student: 'Ahmed Khan', score: 90, percentage: 90, passed: true, submitted: '2 days ago', time_taken: '14 min' },
    { id: 2, student: 'Sara Malik', score: 75, percentage: 75, passed: true, submitted: '2 days ago', time_taken: '19 min' },
    { id: 3, student: 'Bilal Ahmed', score: 55, percentage: 55, passed: false, submitted: '3 days ago', time_taken: '22 min' },
    { id: 4, student: 'Fatima Noor', score: 80, percentage: 80, passed: true, submitted: '3 days ago', time_taken: '16 min' },
  ],
  score_distribution: [
    { name: '0-49', count: 3 }, { name: '50-59', count: 5 }, { name: '60-69', count: 8 },
    { name: '70-79', count: 14 }, { name: '80-89', count: 9 }, { name: '90-100', count: 3 },
  ],
}

export default function QuizResultsPage() {
  const { id, qid } = useParams()
  const { data: results, loading, error, refetch } = useApi(`/studio/quizzes/${qid}/results/`, { mockData: mockResults })

  if (loading) return <Loading fullscreen />
  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (!results) return null

  const columns = [
    { field: 'student', header: 'Student', sortable: true },
    { field: 'score', header: 'Score', render: (r) => `${r.score} / 100` },
    { field: 'percentage', header: '%', render: (r) => <span className={r.percentage >= 70 ? 'text-emerald-600 font-semibold' : 'text-red-500'}>{r.percentage}%</span> },
    { field: 'passed', header: 'Result', render: (r) => <Badge variant={r.passed ? 'green' : 'red'}>{r.passed ? 'Passed' : 'Failed'}</Badge> },
    { field: 'time_taken', header: 'Time' },
    { field: 'submitted', header: 'Submitted' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <Link to={`/courses/${id}/quizzes`} className="text-sm text-slate-400 hover:text-slate-600">← Quizzes</Link>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">{results.quiz.title} — Results</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total attempts', value: results.quiz.total_attempts },
          { label: 'Avg. score', value: `${results.quiz.avg_score}%` },
          { label: 'Pass rate', value: `${results.quiz.pass_rate}%` },
          { label: 'Avg. time', value: results.quiz.avg_time },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardTitle className="mb-4">Score distribution</CardTitle>
        <BarChartWidget data={results.score_distribution} dataKey="count" nameKey="name" color="#7c3aed" height={200} />
      </Card>

      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">Student attempts</h3>
        <DataTable columns={columns} data={results.attempts} loading={false} emptyMessage="No attempts yet" />
      </div>
    </div>
  )
}
