import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { useApi } from '../../hooks/useApi'
import { useMutation } from '../../hooks/useMutation'
import { useToast } from '../../components/NotificationContext'
import Card from '../../components/Card'
import ActionBar from '../../components/ActionBar'
import Loading from '../../components/Loading'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description is required'),
  duration: z.string().min(1, 'Duration is required'),
  status: z.enum(['draft', 'active', 'archived']),
})

export default function EditCoursePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { data: course, loading: fetching } = useApi(`/studio/courses/${id}/`)
  const { mutate, loading: saving } = useMutation(`/studio/courses/${id}/`, 'put')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (course) reset(course)
  }, [course, reset])

  const onSubmit = async (data) => {
    try {
      await mutate(data)
      toast.success('Course updated successfully!')
      navigate(`/courses/${id}`)
    } catch {
      toast.error('Failed to update course.')
    }
  }

  if (fetching) return <Loading fullscreen />

  return (
    <div className="space-y-6 pb-20">
      <div>
        <Link to={`/courses/${id}`} className="text-sm text-slate-400 hover:text-slate-600">← Course overview</Link>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">Edit Course</h2>
      </div>

      <Card>
        <div className="space-y-5">
          <Field label="Course title" error={errors.title?.message}>
            <input {...register('title')} className={inputClass(errors.title)} />
          </Field>
          <Field label="Description" error={errors.description?.message}>
            <textarea {...register('description')} rows={4} className={`${inputClass(errors.description)} resize-none`} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Duration" error={errors.duration?.message}>
              <input {...register('duration')} className={inputClass(errors.duration)} />
            </Field>
            <Field label="Status" error={errors.status?.message}>
              <select {...register('status')} className={inputClass(errors.status)}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
          </div>
        </div>
      </Card>

      <ActionBar onCancel={() => navigate(`/courses/${id}`)} onSave={handleSubmit(onSubmit)} saving={saving} />
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function inputClass(error) {
  return `w-full px-4 py-3 rounded-xl border text-slate-800 text-sm placeholder-slate-400 outline-none transition-shadow ${error ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'}`
}
