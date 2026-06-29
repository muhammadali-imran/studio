import { useApi } from '../../hooks/useApi'
import { useToast } from '../../components/NotificationContext'
import Card, { CardTitle } from '../../components/Card'
import StatCard from '../../components/StatCard'
import { BarChartWidget, LineChartWidget, PieChartWidget } from '../../components/ChartWidget'
import Badge from '../../components/Badge'

const enrollmentTrend = [
  { name: 'Sep', students: 210 }, { name: 'Oct', students: 225 }, { name: 'Nov', students: 218 },
  { name: 'Dec', students: 230 }, { name: 'Jan', students: 247 }, { name: 'Feb', students: 255 },
]

const completionByCoure = [
  { name: 'Python', rate: 68 }, { name: 'Web Dev', rate: 45 }, { name: 'DSA', rate: 82 },
  { name: 'DB Mgmt', rate: 30 }, { name: 'ML Basics', rate: 91 },
]

const submissionStatus = [
  { name: 'On time', value: 68 }, { name: 'Late', value: 18 }, { name: 'Missing', value: 14 },
]

const quizScoreTrend = [
  { name: 'Quiz 1', avgScore: 65 }, { name: 'Quiz 2', avgScore: 71 }, { name: 'Quiz 3', avgScore: 68 },
  { name: 'Quiz 4', avgScore: 75 }, { name: 'Quiz 5', avgScore: 80 },
]

const topPerformers = [
  { name: 'Fatima Noor', roll: 'CS-2021-004', avg: 91, grade: 'A+' },
  { name: 'Ahmed Khan', roll: 'CS-2021-001', avg: 85, grade: 'A' },
  { name: 'Ayesha Tariq', roll: 'CS-2021-006', avg: 80, grade: 'A' },
  { name: 'Sara Malik', roll: 'CS-2021-002', avg: 74, grade: 'B+' },
]

export default function ReportsPage() {
  const toast = useToast()
  const { data: overview } = useApi('/studio/reports/overview/')

  const handleExport = (type) => {
    toast.info(`Exporting ${type} report…`)
  }

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">📊 Reports & Analytics</h2>
          <p className="text-slate-500 text-sm mt-1">Platform-wide insights and performance data.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('CSV')} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Export CSV
          </button>
          <button onClick={() => handleExport('PDF')} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-colors">
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total students" value="247" icon="👥" trend="+18 this month" trendPositive={true} />
        <StatCard title="Active courses" value="8" icon="📚" trend="2 published this week" trendPositive={true} />
        <StatCard title="Avg. completion" value="63%" icon="📈" trend="+5% vs last month" trendPositive={true} />
        <StatCard title="Avg. quiz score" value="72%" icon="❓" trend="+4% vs last week" trendPositive={true} />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle className="mb-4">Student enrollment trend</CardTitle>
          <LineChartWidget data={enrollmentTrend} lines={[{ key: 'students', label: 'Students' }]} />
        </Card>

        <Card>
          <CardTitle className="mb-4">Course completion rates</CardTitle>
          <BarChartWidget data={completionByCoure} dataKey="rate" nameKey="name" color="#7c3aed" />
        </Card>

        <Card>
          <CardTitle className="mb-4">Submission status</CardTitle>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <PieChartWidget data={submissionStatus} />
            </div>
            <div className="space-y-3 min-w-[120px]">
              {submissionStatus.map(({ name, value }, i) => {
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
          <LineChartWidget data={quizScoreTrend} lines={[{ key: 'avgScore', label: 'Avg. Score' }]} />
        </Card>
      </div>

      {/* Top performers */}
      <Card>
        <CardTitle className="mb-4">Top performing students</CardTitle>
        <div className="space-y-3">
          {topPerformers.map((s, i) => (
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
