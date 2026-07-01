import { useApi } from '@shared/hooks/useApi'
import { useToast } from '@/components/NotificationContext'
import Card, { CardTitle } from '@shared/components/ui/Card'
import StatCard from '../../components/StatCard'
import Skeleton from '@shared/components/ui/Skeleton'
import ErrorState from '../../components/ErrorState'
import { BarChartWidget, LineChartWidget, PieChartWidget } from '../../components/ChartWidget'
import Badge from '@shared/components/ui/Badge'

const mockReports = {
  stats: [
    { title: 'Total students', value: '247', icon: '👥', trend: '+18 this month', trendPositive: true },
    { title: 'Active courses', value: '8', icon: '📚', trend: '2 published this week', trendPositive: true },
    { title: 'Avg. completion', value: '63%', icon: '📈', trend: '+5% vs last month', trendPositive: true },
    { title: 'Avg. quiz score', value: '72%', icon: '❓', trend: '+4% vs last week', trendPositive: true },
  ],
  enrollment_trend: [
    { name: 'Sep', students: 210 }, { name: 'Oct', students: 225 }, { name: 'Nov', students: 218 },
    { name: 'Dec', students: 230 }, { name: 'Jan', students: 247 }, { name: 'Feb', students: 255 },
  ],
  completion_by_course: [
    { name: 'Python', rate: 68 }, { name: 'Web Dev', rate: 45 }, { name: 'DSA', rate: 82 },
    { name: 'DB Mgmt', rate: 30 }, { name: 'ML Basics', rate: 91 },
  ],
  submission_status: [
    { name: 'On time', value: 68 }, { name: 'Late', value: 18 }, { name: 'Missing', value: 14 },
  ],
  quiz_score_trend: [
    { name: 'Quiz 1', avgScore: 65 }, { name: 'Quiz 2', avgScore: 71 }, { name: 'Quiz 3', avgScore: 68 },
    { name: 'Quiz 4', avgScore: 75 }, { name: 'Quiz 5', avgScore: 80 },
  ],
  top_performers: [
    { name: 'Fatima Noor', roll: 'CS-2021-004', avg: 91, grade: 'A+' },
    { name: 'Ahmed Khan', roll: 'CS-2021-001', avg: 85, grade: 'A' },
    { name: 'Ayesha Tariq', roll: 'CS-2021-006', avg: 80, grade: 'A' },
    { name: 'Sara Malik', roll: 'CS-2021-002', avg: 74, grade: 'B+' },
  ],
}

function exportCsv(rows, filename) {
  if (!rows?.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const toast = useToast()
  const { data: report, loading, error, refetch } = useApi('/studio/reports/overview/', { mockData: mockReports })

  const handleExportCsv = () => {
    if (!report?.top_performers?.length) { toast.error('Nothing to export yet.'); return }
    exportCsv(report.top_performers, `top-performers-${new Date().toISOString().slice(0, 10)}.csv`)
    toast.success('CSV exported.')
  }

  const handleExportPdf = () => {
    // No client-side PDF library is wired up yet — this calls the backend's
    // export endpoint, which is expected to stream back a PDF file.
    toast.info('Requesting PDF export from the server…')
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/studio/reports/export/?format=pdf`, '_blank')
  }

  if (loading) {
    return (
      <div className="space-y-7">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton.Card key={i} />)}</div>
      </div>
    )
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (!report) return null

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">📊 Reports & Analytics</h2>
          <p className="text-slate-500 text-sm mt-1">Platform-wide insights and performance data.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCsv} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Export CSV
          </button>
          <button onClick={handleExportPdf} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-colors">
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {report.stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle className="mb-4">Student enrollment trend</CardTitle>
          <LineChartWidget data={report.enrollment_trend} lines={[{ key: 'students', label: 'Students' }]} />
        </Card>

        <Card>
          <CardTitle className="mb-4">Course completion rates</CardTitle>
          <BarChartWidget data={report.completion_by_course} dataKey="rate" nameKey="name" color="#7c3aed" />
        </Card>

        <Card>
          <CardTitle className="mb-4">Submission status</CardTitle>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <PieChartWidget data={report.submission_status} />
            </div>
            <div className="space-y-3 min-w-[120px]">
              {report.submission_status.map(({ name, value }, i) => {
                const colors = ['bg-violet-500', 'bg-amber-500', 'bg-red-500']
                return (
                  <div key={name} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[i]}`} />
                    <div>
                      <p className="text-xs font-medium text-slate-700">{name}</p>
                      <p className="text-xs text-slate-400">{value}%</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-4">Quiz score progression</CardTitle>
          <LineChartWidget data={report.quiz_score_trend} lines={[{ key: 'avgScore', label: 'Avg. Score' }]} />
        </Card>
      </div>

      <Card>
        <CardTitle className="mb-4">Top performing students</CardTitle>
        <div className="space-y-3">
          {report.top_performers.map((s, i) => (
            <div key={s.roll} className="flex items-center gap-4 py-2">
              <span className={`text-lg font-bold w-6 text-center ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : 'text-amber-700'}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-400">{s.roll}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{s.avg}%</p>
                <Badge variant="green">{s.grade}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
