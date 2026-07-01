import { useParams, Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import CourseTabs from '../../components/CourseTabs'
import Card, { CardTitle } from '../../components/Card'
import Badge from '../../components/Badge'
import Loading from '../../components/Loading'
import ErrorState from '../../components/ErrorState'

const mockCourse = {
  id: 1,
  title: 'Introduction to Python',
  description: 'A comprehensive introduction to Python programming covering fundamentals, data structures, and practical projects. Students will build confidence writing clean, readable code and solving real-world problems.',
  instructor_name: 'Dr. Ahmed',
  status: 'active',
  students: 48,
  duration: '16 weeks',
  lectures: 24,
  quizzes: 8,
  assignments: 12,
}

export default function CoursePage() {
  const { id } = useParams()
  const { data: course, loading, error, refetch } = useApi(`/studio/courses/${id}/`, { mockData: mockCourse })

  if (loading) return <Loading fullscreen />
  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (!course) return null
  const c = course

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to="/courses" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">← Courses</Link>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">{c.title}</h2>
          <p className="text-slate-500 text-sm mt-0.5">{c.instructor_name} · {c.duration}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant={c.status === 'active' ? 'green' : c.status === 'draft' ? 'amber' : 'slate'}>{c.status}</Badge>
          <Link to={`/courses/${id}/edit`} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Edit</Link>
        </div>
      </div>

      <CourseTabs />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Students', value: c.students, icon: '👥', link: `/courses/${id}/students` },
          { label: 'Lectures', value: c.lectures, icon: '🎬', link: `/courses/${id}/lectures` },
          { label: 'Quizzes', value: c.quizzes, icon: '❓', link: `/courses/${id}/quizzes` },
          { label: 'Assignments', value: c.assignments, icon: '📝', link: `/courses/${id}/assignments` },
        ].map(({ label, value, icon, link }) => (
          <Link key={label} to={link} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow text-center group">
            <span className="text-3xl block mb-2">{icon}</span>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs font-medium text-slate-500 mt-1 group-hover:text-violet-600 transition-colors">{label}</p>
          </Link>
        ))}
      </div>

      <Card>
        <CardTitle className="mb-3">Description</CardTitle>
        <p className="text-slate-600 text-sm leading-relaxed">{c.description}</p>
      </Card>
    </div>
  )
}
