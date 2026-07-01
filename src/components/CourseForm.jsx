import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import Card from './Card'
import FormField, { inputClass } from './FormField'

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.string().min(1, 'Duration is required'),
  status: z.enum(['draft', 'active', 'archived']),
})

/**
 * Shared course form used by both CreateCoursePage and EditCoursePage.
 * The parent owns submission (mutation + navigation); this component only
 * owns field state/validation and exposes `formId` so an external
 * <ActionBar> save button can trigger submit via form="formId".
 */
export default function CourseForm({ formId, initialValues, onSubmit }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: initialValues ?? { status: 'draft', title: '', description: '', duration: '' },
  })

  useEffect(() => {
    if (initialValues) reset(initialValues)
  }, [initialValues, reset])

  return (
    <Card>
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField label="Course title" error={errors.title?.message}>
          <input {...register('title')} placeholder="e.g. Introduction to Python" className={inputClass(errors.title)} />
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          <textarea {...register('description')} rows={4} placeholder="What will students learn in this course?" className={`${inputClass(errors.description)} resize-none`} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Duration" error={errors.duration?.message}>
            <input {...register('duration')} placeholder="e.g. 16 weeks" className={inputClass(errors.duration)} />
          </FormField>

          <FormField label="Status" error={errors.status?.message}>
            <select {...register('status')} className={inputClass(errors.status)}>
              <option value="draft">Draft</option>
              <option value="active">Active (visible to students)</option>
              <option value="archived">Archived</option>
            </select>
          </FormField>
        </div>
      </form>
    </Card>
  )
}
