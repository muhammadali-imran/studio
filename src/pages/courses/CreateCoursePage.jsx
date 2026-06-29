import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '../../hooks/useMutation'
import { useToast } from '../../components/NotificationContext'
import Card from '../../components/Card'
import ActionBar from '../../components/ActionBar'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description is required'),
  duration: z.string().min(1, 'Duration is required'),
  status: z.enum(['draft', 'active', 'archived']),
})

export default function CreateCoursePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { mutate, loading } = useMutation('/studio/courses/', 'post')
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'draft' },
  })

  const onSubmit = async (data) => {
    try {
      const result = await mutate(data)
      toast.success('Course created successfully!')
      navigate(`/courses/${result?.id ?? 1}`)
    } catch {
      toast.error('Failed to create course.')
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <Link to="/courses" className="text-sm text-slate-400 hover:text-slate-600">← Courses</Link>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">Create New Course</h2>
        <p className="text-slate-500 text-sm">Fill in the details to create your course.</p>
      </div>

      <Card>
        <div className="space-y-5">
          <Field label="Course title" error={errors.title?.message}>
            <input {...register('title')} placeholder="e.g. Introduction to Python" className={inputClass(errors.title)} />
          </Field>
          <Field label="Description" error={errors.description?.message}>
            <textarea {...register('description')} rows={4} placeholder="What will students learn in this course?" className={`${inputClass(errors.description)} resize-none`} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Duration" error={errors.duration?.message}>
              <input {...register('duration')} placeholder="e.g. 16 weeks" className={inputClass(errors.duration)} />
            </Field>
            <Field label="Status" error={errors.status?.message}>
              <select {...register('status')} className={inputClass(errors.status)}>
                <option value="draft">Draft</option>
                <option value="active">Active (visible to students)</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
          </div>
        </div>
      </Card>

      <ActionBar onCancel={() => navigate('/courses')} onSave={handleSubmit(onSubmit)} saving={loading} label="Create Course" />
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
