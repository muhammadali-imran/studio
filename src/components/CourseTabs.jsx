import { NavLink, useParams } from 'react-router-dom'

const tabs = [
  { label: 'Overview',    path: '' },
  { label: 'Lectures',    path: '/lectures' },
  { label: 'Quizzes',     path: '/quizzes' },
  { label: 'Assignments', path: '/assignments' },
  { label: 'Attendance',  path: '/attendance' },
  { label: 'Students',    path: '/students' },
]

export default function CourseTabs() {
  const { id } = useParams()
  return (
    <div className="flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto">
      {tabs.map(({ label, path }) => (
        <NavLink
          key={path}
          to={`/courses/${id}${path}`}
          end={path === ''}
          className={({ isActive }) =>
            `px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
              isActive ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  )
}
