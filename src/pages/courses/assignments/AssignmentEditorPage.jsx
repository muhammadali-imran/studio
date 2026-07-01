import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useApi } from '@shared/hooks/useApi'
import { useMutation } from '@shared/hooks/useMutation'
import { useToast } from '@/components/NotificationContext'
import Card, { CardTitle } from '@shared/components/ui/Card'
import ActionBar from '../../../components/ActionBar'
import RichTextEditor from '../../../components/RichTextEditor'

export default function AssignmentEditorPage() {
  const { id, aid } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = !!aid
  const { data: existing } = useApi(isEdit ? `/studio/assignments/${aid}/` : null)
  const { mutate: save, loading: saving } = useMutation(
    isEdit ? `/studio/assignments/${aid}/` : `/studio/courses/${id}/assignments/`,
    isEdit ? 'put' : 'post'
  )

  const [form, setForm] = useState({
    title: '', description: '', due_date: '', max_grade: 100,
    allowed_file_types: '.pdf,.doc,.docx', instructions: '',
  })

  useEffect(() => { if (existing) setForm(existing) }, [existing])
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target ? e.target.value : e }))

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Assignment title is required.'); return }
    try {
      await save(form)
      toast.success(isEdit ? 'Assignment updated.' : 'Assignment created.')
      navigate(`/courses/${id}/assignments`)
    } catch { toast.error('Failed to save.') }
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <Link to={`/courses/${id}/assignments`} className="text-sm text-slate-400 hover:text-slate-600">← Assignments</Link>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">{isEdit ? 'Edit Assignment' : 'New Assignment'}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input value={form.title} onChange={set('title')} placeholder="e.g. Lab 3 — Functions Workshop"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Instructions</label>
                <RichTextEditor value={form.instructions} onChange={set('instructions')} placeholder="Describe what students need to do…" rows={10} />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardTitle className="mb-4">Settings</CardTitle>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Due date</label>
                <input type="date" value={form.due_date} onChange={set('due_date')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Maximum grade</label>
                <input type="number" min={1} max={1000} value={form.max_grade} onChange={set('max_grade')}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Allowed file types</label>
                <input value={form.allowed_file_types} onChange={set('allowed_file_types')} placeholder=".pdf,.doc,.docx"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                <p className="text-xs text-slate-400 mt-1">Comma-separated extensions</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ActionBar onCancel={() => navigate(`/courses/${id}/assignments`)} onSave={handleSave} saving={saving} />
    </div>
  )
}
