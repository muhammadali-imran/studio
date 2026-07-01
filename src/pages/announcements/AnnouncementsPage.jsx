import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { useMutation } from '../../hooks/useMutation'
import { useToast } from '../../components/NotificationContext'
import Modal, { ModalFooter } from '../../components/Modal'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import ConfirmDialog from '../../components/ConfirmDialog'

const mockAnnouncements = [
  { id: 1, title: 'Mid-term exam schedule released', body: 'Please check the schedule on the notice board. Mid-terms begin on March 15th.', course: 'Platform-wide', created_at: '2025-03-01', pinned: true },
  { id: 2, title: 'Lab session moved to Friday', body: 'This week\'s Python lab has been rescheduled from Wednesday to Friday, same time.', course: 'Introduction to Python', created_at: '2025-02-28', pinned: false },
  { id: 3, title: 'Assignment 1 deadline extended', body: 'Due to the public holiday, the deadline for Assignment 1 is extended to March 12th.', course: 'Web Development', created_at: '2025-02-25', pinned: false },
]

export default function AnnouncementsPage() {
  const toast = useToast()
  const { data: announcements, loading, error, refetch } = useApi('/studio/announcements/', { mockData: mockAnnouncements })
  const { mutate: create, loading: creating } = useMutation('/studio/announcements/', 'post')
  const { mutate: del } = useMutation(null, 'delete')
  const list = announcements ?? []

  const [modal, setModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ title: '', body: '', course: '', pinned: false })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleCreate = async () => {
    if (!form.title.trim() || !form.body.trim()) { toast.error('Title and message are required.'); return }
    try {
      await create(form)
      toast.success('Announcement posted.')
      setModal(false)
      setForm({ title: '', body: '', course: '', pinned: false })
      refetch()
    } catch { toast.error('Failed to post announcement.') }
  }

  const handleDelete = async () => {
    try { await del(null, `/studio/announcements/${deleteTarget}/`); toast.success('Deleted.'); refetch() }
    catch { toast.error('Failed to delete.') }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">📢 Announcements</h2>
          <p className="text-slate-500 text-sm mt-1">Post announcements for your courses or the whole platform.</p>
        </div>
        <button onClick={() => setModal(true)} className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
          + New announcement
        </button>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : list.length === 0 && !loading ? (
        <EmptyState icon="📢" title="No announcements" message="Post an announcement to notify your students." action={{ label: 'Post announcement', onClick: () => setModal(true) }} />
      ) : (
        <div className="space-y-4">
          {list.map((a) => (
            <div key={a.id} className={`bg-white rounded-2xl border shadow-sm p-6 ${a.pinned ? 'border-violet-200 bg-violet-50/30' : 'border-slate-100'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {a.pinned && <span className="text-xs font-semibold text-violet-600">📌 Pinned</span>}
                    <Badge variant="slate">{a.course}</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">{a.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{a.body}</p>
                  <p className="text-xs text-slate-400 mt-3">{a.created_at}</p>
                </div>
                <button onClick={() => setDeleteTarget(a.id)} className="text-slate-300 hover:text-red-400 text-lg leading-none flex-shrink-0 transition-colors">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="New announcement">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input value={form.title} onChange={set('title')} placeholder="e.g. Mid-term exam schedule"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
            <textarea value={form.body} onChange={set('body')} rows={4} placeholder="Write your announcement…"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Course (leave blank for platform-wide)</label>
            <input value={form.course} onChange={set('course')} placeholder="e.g. Introduction to Python"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.pinned} onChange={set('pinned')} className="accent-violet-600" />
            <span className="text-sm text-slate-700">Pin this announcement</span>
          </label>
        </div>
        <ModalFooter>
          <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleCreate} disabled={creating} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 disabled:opacity-60">
            {creating ? 'Posting…' : 'Post announcement'}
          </button>
        </ModalFooter>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete announcement?" message="Students will no longer see this announcement." confirmLabel="Delete" />
    </div>
  )
}
