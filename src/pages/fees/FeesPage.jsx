import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { useMutation } from '../../hooks/useMutation'
import { useToast } from '../../components/NotificationContext'
import Badge from '../../components/Badge'
import DataTable from '../../components/DataTable'
import Modal, { ModalFooter } from '../../components/Modal'
import StatCard from '../../components/StatCard'
import Card, { CardTitle } from '../../components/Card'

const mockStructures = [
  { id: 1, name: 'Spring 2025 — BS Computer Science', amount: 45000, currency: 'PKR', due_date: '2025-02-15', students: 120 },
  { id: 2, name: 'Spring 2025 — BS Software Engineering', amount: 45000, currency: 'PKR', due_date: '2025-02-15', students: 95 },
]

const mockPayments = [
  { id: 1, student: 'Ahmed Khan', roll: 'CS-2021-001', structure: 'Spring 2025 — BS CS', amount: 45000, status: 'paid', date: '2025-02-10' },
  { id: 2, student: 'Sara Malik', roll: 'CS-2021-002', structure: 'Spring 2025 — BS CS', amount: 45000, status: 'paid', date: '2025-02-12' },
  { id: 3, student: 'Bilal Ahmed', roll: 'CS-2021-003', structure: 'Spring 2025 — BS CS', amount: 45000, status: 'pending', date: null },
  { id: 4, student: 'Fatima Noor', roll: 'CS-2021-004', structure: 'Spring 2025 — BS CS', amount: 45000, status: 'paid', date: '2025-02-08' },
  { id: 5, student: 'Usman Ali', roll: 'CS-2021-005', structure: 'Spring 2025 — BS CS', amount: 45000, status: 'overdue', date: null },
]

const statusVariant = { paid: 'green', pending: 'amber', overdue: 'red' }

export default function FeesPage() {
  const toast = useToast()
  const { data: paymentsData } = useApi('/studio/fees/payments/')
  const { mutate: createStructure, loading: creating } = useMutation('/studio/fees/structures/', 'post')
  const payments = paymentsData ?? mockPayments

  const [structureModal, setStructureModal] = useState(false)
  const [form, setForm] = useState({ name: '', amount: '', due_date: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const paid = payments.filter((p) => p.status === 'paid').length
  const pending = payments.filter((p) => p.status === 'pending').length
  const overdue = payments.filter((p) => p.status === 'overdue').length
  const totalCollected = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)

  const handleCreate = async () => {
    if (!form.name || !form.amount) { toast.error('Name and amount are required.'); return }
    try {
      await createStructure(form)
      toast.success('Fee structure created.')
      setStructureModal(false)
    } catch { toast.error('Failed to create fee structure.') }
  }

  const columns = [
    { field: 'student', header: 'Student', render: (r) => (
      <div><p className="font-medium text-slate-800">{r.student}</p><p className="text-xs text-slate-400">{r.roll}</p></div>
    )},
    { field: 'structure', header: 'Fee structure' },
    { field: 'amount', header: 'Amount', render: (r) => `PKR ${r.amount.toLocaleString()}` },
    { field: 'status', header: 'Status', render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
    { field: 'date', header: 'Paid on', render: (r) => r.date || <span className="text-slate-300">—</span> },
    { field: 'actions', header: '', render: (r) => r.status !== 'paid' && (
      <button className="text-xs px-3 py-1.5 text-violet-600 hover:bg-violet-50 rounded-lg font-medium transition-colors">Mark paid</button>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">💳 Fee Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage fee structures and track payments.</p>
        </div>
        <button onClick={() => setStructureModal(true)} className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
          + New fee structure
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total collected" value={`PKR ${(totalCollected / 1000).toFixed(0)}k`} icon="💰" />
        <StatCard title="Paid" value={paid} icon="✅" trendPositive={true} />
        <StatCard title="Pending" value={pending} icon="⏳" trendPositive={false} />
        <StatCard title="Overdue" value={overdue} icon="⚠️" trendPositive={false} />
      </div>

      <Card>
        <CardTitle className="mb-4">Fee structures</CardTitle>
        <div className="space-y-3">
          {mockStructures.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-medium text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">Due: {s.due_date} · {s.students} students</p>
              </div>
              <p className="text-lg font-bold text-violet-700">{s.currency} {s.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">Payment records</h3>
        <DataTable columns={columns} data={payments} loading={false} emptyMessage="No payments recorded" />
      </div>

      <Modal open={structureModal} onClose={() => setStructureModal(false)} title="New fee structure" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
            <input value={form.name} onChange={set('name')} placeholder="e.g. Spring 2025 — BS CS"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (PKR)</label>
            <input type="number" value={form.amount} onChange={set('amount')} placeholder="45000"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Due date</label>
            <input type="date" value={form.due_date} onChange={set('due_date')}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </div>
        </div>
        <ModalFooter>
          <button onClick={() => setStructureModal(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleCreate} disabled={creating} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 disabled:opacity-60">
            {creating ? 'Creating…' : 'Create'}
          </button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
