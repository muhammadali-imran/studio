import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { useMutation } from '../../hooks/useMutation'
import { useDebounce } from '../../hooks/useDebounce'
import { usePagination } from '../../hooks/usePagination'
import { useToast } from '../../components/NotificationContext'
import SearchInput from '../../components/SearchInput'
import DataTable from '../../components/DataTable'
import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'
import Modal, { ModalFooter } from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import ErrorState from '../../components/ErrorState'

const mockUsers = {
  results: [
    { id: 1, name: 'Dr. Ahmed Hassan', email: 'ahmed.h@school.edu', role: 'instructor', status: 'active', joined: '2023-08-01' },
    { id: 2, name: 'Prof. Sara Malik', email: 'sara.m@school.edu', role: 'instructor', status: 'active', joined: '2023-08-01' },
    { id: 3, name: 'Admin User', email: 'admin@school.edu', role: 'admin', status: 'active', joined: '2022-01-01' },
    { id: 4, name: 'Ahmed Khan', email: 'ahmed@school.edu', role: 'student', status: 'active', joined: '2024-09-01' },
    { id: 5, name: 'Sara Student', email: 'sara@school.edu', role: 'student', status: 'inactive', joined: '2024-09-01' },
  ],
  count: 5,
}

const roleVariant = { admin: 'violet', instructor: 'indigo', student: 'blue' }

export default function UserManagementPage() {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const { page, pageSize, setPage, paginationParams } = usePagination()
  const { data, loading, error, refetch } = useApi('/studio/users/', {
    params: { ...paginationParams, search: debouncedSearch, role: roleFilter },
    mockData: mockUsers,
  })
  const { mutate: createUser, loading: creating } = useMutation('/studio/users/', 'post')
  const { mutate: deleteUser } = useMutation(null, 'delete')

  const users = data?.results ?? []
  const total = data?.count ?? 0

  const [createModal, setCreateModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student', password: '' })

  const handleCreate = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) { toast.error('All fields are required.'); return }
    try {
      await createUser(newUser)
      toast.success('User created successfully.')
      setCreateModal(false)
      setNewUser({ name: '', email: '', role: 'student', password: '' })
      refetch()
    } catch { toast.error('Failed to create user.') }
  }

  const handleDelete = async () => {
    try {
      await deleteUser(null, `/studio/users/${deleteTarget}/`)
      toast.success('User deactivated.')
      refetch()
    } catch { toast.error('Failed to deactivate user.') }
    setDeleteTarget(null)
  }

  const columns = [
    { field: 'name', header: 'User', sortable: true, render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.name} size="xs" />
        <div>
          <p className="font-medium text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">{row.email}</p>
        </div>
      </div>
    )},
    { field: 'role', header: 'Role', render: (row) => <Badge variant={roleVariant[row.role] || 'slate'}>{row.role}</Badge> },
    { field: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'active' ? 'green' : 'red'}>{row.status}</Badge> },
    { field: 'joined', header: 'Joined' },
    { field: 'actions', header: '', render: (row) => (
      <div className="flex gap-2">
        <button className="text-xs px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Edit</button>
        <button onClick={() => setDeleteTarget(row.id)} className="text-xs px-3 py-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">Deactivate</button>
      </div>
    )},
  ]

  const setF = (k) => (e) => setNewUser((u) => ({ ...u, [k]: e.target.value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">🛡️ User Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage all platform users and roles.</p>
        </div>
        <button onClick={() => setCreateModal(true)} className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
          + Add user
        </button>
      </div>

      <div className="flex gap-3 items-center">
        <div className="max-w-xs flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search users..." />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-violet-400">
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="instructor">Instructors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <DataTable columns={columns} data={users} loading={loading} page={page} pageSize={pageSize} total={total} onPageChange={setPage} emptyMessage="No users found" />
      )}

      {/* Create user modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Create user" size="sm">
        <div className="space-y-4">
          {[
            { label: 'Full name', key: 'name', type: 'text', placeholder: 'Dr. Ahmed Hassan' },
            { label: 'Email address', key: 'email', type: 'email', placeholder: 'user@school.edu' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 8 characters' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              <input type={type} value={newUser[key]} onChange={setF(key)} placeholder={placeholder}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
            <select value={newUser.role} onChange={setF('role')} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400">
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <ModalFooter>
          <button onClick={() => setCreateModal(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleCreate} disabled={creating} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 disabled:opacity-60">
            {creating ? 'Creating…' : 'Create user'}
          </button>
        </ModalFooter>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Deactivate user?" message="The user will lose access to the platform. This can be reversed." confirmLabel="Deactivate" />
    </div>
  )
}
