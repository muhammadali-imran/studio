import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useApi } from '../hooks/useApi'
import StatCard from '../components/StatCard'
import Card, { CardTitle } from '../components/Card'
import Badge from '../components/Badge'
import Skeleton from '../components/Skeleton'
import ProgressBar from '../components/ProgressBar'
import { BarChartWidget } from '../components/ChartWidget'

const mockStats = [
  { title: 'Active Courses', value: 8, icon: '📚', trend: '2 new this semester', trendPositive: true },
  { title: 'Total Students', value: 247, icon: '👥', trend: '+18 this month', trendPositive: true },
  { title: 'Pending Submissions', value: 34, icon: '📝', trend: '12 overdue', trendPositive: false },
  { title: 'Avg. Quiz Score', value: '72%', icon: '❓', trend: '+4% vs last week', trendPositive: true },
]

const mockCourses = [
  { id: 1, title: 'Introduction to Python', students: 48, progress: 68, status: 'active' },
  { id: 2, title: 'Web Development Fundamentals', students: 62, progress: 45, status: 'active' },
  { id: 3, title: 'Data Structures & Algorithms', students: 39, progress: 82, status: 'active' },
  { id: 4, title: 'Database Management', students: 55, progress: 30, status: 'active' },
]

const mockSubmissions = [
  { id: 1, student: 'Ahmed Khan', course: 'Python', assignment: 'Lab 3', submitted: '2h ago', late: false },
  { id: 2, student: 'Sara Malik', course: 'Web Dev', assignment: 'Assignment 2', submitted: '5h ago', late: true },
  { id: 3, student: 'Bilal Ahmed', course: 'DSA', assignment: 'Quiz 1', submitted: '1d ago', late: false },
  { id: 4, student: 'Fatima Noor', course: 'Database', assignment: 'Lab 2', submitted: '2d ago', late: true },
]

const submissionTrend = [
  { name: 'Mon', submissions: 12 }, { name: 'Tue', submissions: 19 }, { name: 'Wed', submissions: 8 },
  { name: 'Thu', submissions: 25 }, { name: 'Fri', submissions: 17 }, { name: 'Sat', submissions: 6 }, { name: 'Sun', submissions: 3 },
]

const scoreDistribution = [
  { name: '0-49', students: 18 }, { name: '50-59', students: 32 }, { name: '60-69', students: 55 },
  { name: '70-79', students: 78 }, { name: '80-89', students: 41 }, { name: '90-100', students: 23 },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { data: stats, loading: statsLoading } = useApi('/studio/reports/overview/')
  const statItems = Array.isArray(stats) ? stats : mockStats

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{greeting()}, {user?.name?.split(' ')[0] || 'Instructor'} 👋</h2>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening across your courses today.</p>
        </div>
        <Link to="/courses/new" className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
          + New Course
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton.Card key={i} />) : statItems.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle className="mb-4">Submissions this week</CardTitle>
          <BarChartWidget data={submissionTrend} dataKey="submissions" nameKey="name" color="#7c3aed" />
        </Card>
        <Card>
          <CardTitle className="mb-4">Score distribution</CardTitle>
          <BarChartWidget data={scoreDistribution} dataKey="students" nameKey="name" color="#10b981" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <CardTitle>My Courses</CardTitle>
            <Link to="/courses" className="text-sm text-violet-600 font-medium hover:underline">View all →</Link>
          </div>
          <div className="space-y-5">
            {mockCourses.map((c) => (
              <div key={c.id}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <Link to={`/courses/${c.id}`} className="text-sm font-semibold text-slate-800 hover:text-violet-600 transition-colors">{c.title}</Link>
                    <p className="text-xs text-slate-400 mt-0.5">{c.students} students enrolled</p>
                  </div>
                  <Badge variant="green">{c.status}</Badge>
                </div>
                <ProgressBar value={c.progress} showValue color="violet" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-5">Recent Submissions</CardTitle>
          <div className="space-y-3">
            {mockSubmissions.map((s) => (
              <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-xl mt-0.5">📝</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{s.student}</p>
                  <p className="text-xs text-slate-400 truncate">{s.assignment} · {s.course}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.submitted}</p>
                </div>
                {s.late && <Badge variant="red">Late</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
