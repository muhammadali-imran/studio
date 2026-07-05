import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApi } from '@shared/hooks/useApi'
import { useDebounce } from '@shared/hooks/useDebounce'
import { usePagination } from '@shared/hooks/usePagination'
import SearchInput from '@shared/components/ui/SearchInput'
import DataTable from '@shared/components/ui/DataTable'
import Badge from '@shared/components/ui/Badge'
import ErrorState from '@shared/components/ui/ErrorState'

const mockCourses = {
  results: [
    { id: 1, title: 'Introduction to Python', instructor_name: 'Dr. Ahmed', status: 'active', students: 48, duration: '16 weeks' },
    { id: 2, title: 'Web Development Fundamentals', instructor_name: 'Dr. Ahmed', status: 'active', students: 62, duration: '14 weeks' },
    { id: 3, title: 'Data Structures & Algorithms', instructor_name: 'Dr. Ahmed', status: 'active', students: 39, duration: '18 weeks' },
    { id: 4, title: 'Database Management', instructor_name: 'Dr. Ahmed', status: 'draft', students: 0, duration: '12 weeks' },
    { id: 5, title: 'Machine Learning Basics', instructor_name: 'Dr. Ahmed', status: 'archived', students: 74, duration: '20 weeks' },
  ],
  count: 5,
}

const statusVariant = { active: 'green', draft: 'amber', archived: 'slate' }

export default function CourseListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const { page, pageSize, setPage, paginationParams } = usePagination()
  const { data, loading, error, refetch } = useApi('/studio/courses/', {
    params: { ...paginationParams, search: debouncedSearch },
    mockData: mockCourses,
  })

  const columns = [
    { field: 'title', header: 'Course', sortable: true, render: (row) => (
      <div>
        <p className="font-medium text-slate-800">{row.title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{row.instructor_name}</p>
      </div>
    )},
    { field: 'status', header: 'Status', render: (row) => <Badge variant={statusVariant[row.status] || 'slate'}>{row.status}</Badge> },
    { field: 'students', header: 'Students', render: (row) => <span className="text-slate-600">{row.students ?? 0}</span> },
    { field: 'duration', header: 'Duration' },
    { field: 'actions', header: '', render: (row) => (
      <div className="flex gap-2">
        <Link to={`/courses/${row.id}/lectures`} onClick={(e) => e.stopPropagation()} className="text-xs px-3 py-1.5 text-violet-600 hover:bg-violet-50 rounded-lg font-medium transition-colors">Lectures</Link>
        <Link to={`/courses/${row.id}/edit`} onClick={(e) => e.stopPropagation()} className="text-xs px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Edit</Link>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">📚 Courses</h2>
          <p className="text-slate-500 text-sm mt-1">Manage all your courses.</p>
        </div>
        <Link to="/courses/new" className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">+ New Course</Link>
      </div>
      <div className="max-w-xs">
        <SearchInput value={search} onChange={setSearch} placeholder="Search courses..." />
      </div>
      {error ? <ErrorState message={error} onRetry={refetch} /> : (
        <DataTable columns={columns} data={data?.results ?? []} loading={loading} onRowClick={(row) => navigate(`/courses/${row.id}`)} page={page} pageSize={pageSize} total={data?.count ?? 0} onPageChange={setPage} emptyMessage="No courses found" />
      )}
    </div>
  )
}
