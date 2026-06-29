import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../../../hooks/useApi'
import { useMutation } from '../../../hooks/useMutation'
import { useToast } from '../../../components/NotificationContext'
import RichTextEditor from '../../../components/RichTextEditor'
import FileUpload from '../../../components/FileUpload'
import ActionBar from '../../../components/ActionBar'
import Card, { CardTitle } from '../../../components/Card'

export default function LectureEditorPage() {
  const { id, lid } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = !!lid

  const { data: existing } = useApi(isEdit ? `/studio/lectures/${lid}/` : null)
  const { mutate: save, loading: saving } = useMutation(
    isEdit ? `/studio/lectures/${lid}/` : `/studio/courses/${id}/lectures/`,
    isEdit ? 'put' : 'post'
  )
  const { mutate: publish } = useMutation(`/studio/lectures/${lid}/`, 'patch')

  const [form, setForm] = useState({
    title: '',
    content: '',
    video_url: '',
    published: false,
  })

  useEffect(() => {
    if (existing) setForm(existing)
  }, [existing])

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: typeof val === 'object' && val.target ? val.target.value : val }))

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Lecture title is required.'); return }
    try {
      await save(form)
      toast.success(isEdit ? 'Lecture saved.' : 'Lecture created.')
      navigate(`/courses/${id}/lectures`)
    } catch {
      toast.error('Failed to save lecture.')
    }
  }

  const handlePublish = async () => {
    try {
      await save({ ...form, published: !form.published })
      setForm((f) => ({ ...f, published: !f.published }))
      toast.success(form.published ? 'Lecture unpublished.' : 'Lecture published!')
    } catch {
      toast.error('Failed to update publish status.')
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <Link to={`/courses/${id}/lectures`} className="text-sm text-slate-400 hover:text-slate-600">← Lectures</Link>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">{isEdit ? 'Edit Lecture' : 'New Lecture'}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Lecture title</label>
                <input
                  value={form.title}
                  onChange={set('title')}
                  placeholder="e.g. Variables and Data Types"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Content</label>
                <RichTextEditor value={form.content} onChange={set('content')} placeholder="Write your lecture content here. Markdown is supported." rows={16} />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-5">
          <Card>
            <CardTitle className="mb-4">Video</CardTitle>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Embed URL</label>
              <input
                value={form.video_url}
                onChange={set('video_url')}
                placeholder="YouTube or Vimeo URL"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            {form.video_url && (
              <div className="mt-3 bg-slate-100 rounded-xl overflow-hidden aspect-video flex items-center justify-center text-slate-400 text-sm">
                🎬 Video preview
              </div>
            )}
          </Card>

          <Card>
            <CardTitle className="mb-4">Attachments</CardTitle>
            <FileUpload label="Upload lecture material" accept=".pdf,.doc,.docx,.pptx" maxSizeMB={20} onFileSelect={(f) => toast.info(`Uploading ${f.name}…`)} />
          </Card>

          <Card>
            <CardTitle className="mb-3">Status</CardTitle>
            <div className={`flex items-center justify-between p-3 rounded-xl ${form.published ? 'bg-emerald-50' : 'bg-slate-50'}`}>
              <div>
                <p className="text-sm font-medium text-slate-800">{form.published ? 'Published' : 'Draft'}</p>
                <p className="text-xs text-slate-400">{form.published ? 'Students can see this' : 'Hidden from students'}</p>
              </div>
              <button onClick={handlePublish} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${form.published ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-violet-600 text-white hover:bg-violet-700'}`}>
                {form.published ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </Card>
        </div>
      </div>

      <ActionBar onCancel={() => navigate(`/courses/${id}/lectures`)} onSave={handleSave} saving={saving} />
    </div>
  )
}
