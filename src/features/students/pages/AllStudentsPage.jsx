import { useState } from 'react'
import { useApi } from '@shared/hooks/useApi'
import { useDebounce } from '@shared/hooks/useDebounce'
import { usePagination } from '@shared/hooks/usePagination'
import SearchInput from '@shared/components/ui/SearchInput'
import DataTable from '@shared/components/ui/DataTable'
import Avatar from '@shared/components/ui/Avatar'
import Badge from '@shared/components/ui/Badge'
import ProgressBar from '@shared/components/ui/ProgressBar'
import ErrorState from '@shared/components/ui/ErrorState'

const mockStudents = {
  results: [
    { id: 1, name: 'Ahmed Khan', email: 'ahmed@school.edu', roll: 'CS-2021-001', courses: 4, avg_progress: 75, status: 'active' },
    { id: 2, name: 'Sara Malik', email: 'sara@school.edu', roll: 'CS-2021-002', courses: 3, avg_progress: 62, status: 'active' },
    { id: 3, name: 'Bilal Ahmed', email: 'bilal@school.edu', roll: 'CS-2021-003', courses: 4, avg_progress: 45, status: 'active' },
    { id: 4, name: 'Fatima Noor', email: 'fatima@school.edu', roll: 'CS-2021-004', courses: 5, avg_progress: 90, status: 'active' },
    { id: 5, name: 'Usman Ali', email: 'usman@school.edu', roll: 'CS-2021-005', courses: 2, avg_progress: 55, status: 'inactive' },
    { id: 6, name: 'Ayesha Tariq', email: 'ayesha@school.edu', roll: 'CS-2021-006', courses: 4, avg_progress: 80, status: 'active' },
  ],
  count: 6,
}

export default function AllStudentsPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const { page, pageSize, setPage, paginationParams } = usePagination()
  const { data, loading, error, refetch } = useApi('/studio/users/', {
    params: { ...paginationParams, role: 'student', search: debouncedSearch },
    mockData: mockStudents,
  })

  const columns = [
    { field: 'name', header: 'Student', sortable: true, render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.name} size="xs" />
        <div>
          <p className="font-medium text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">{row.email}</p>
        </div>
      </div>
    )},
    { field: 'roll', header: 'Roll No.' },
    { field: 'courses', header: 'Courses', render: (row) => <span className="text-slate-600">{row.courses}</span> },
    { field: 'avg_progress', header: 'Avg. Progress', render: (row) => (
      <div className="w-32">
        <ProgressBar value={row.avg_progress} showValue color="violet" />
      </div>
    )},
    { field: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'active' ? 'green' : 'slate'}>{row.status}</Badge> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">👥 All Students</h2>
        <p className="text-slate-500 text-sm mt-1">View and manage all enrolled students.</p>
      </div>

      <div className="max-w-xs">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or roll..." />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <DataTable columns={columns} data={data?.results ?? []} loading={loading} page={page} pageSize={pageSize} total={data?.count ?? 0} onPageChange={setPage} emptyMessage="No students found" />
      )}
    </div>
  )
}
