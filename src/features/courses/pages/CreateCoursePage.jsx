import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@shared/hooks/useMutation'
import { useToast } from '@shared/contexts/NotificationContext'
import CourseForm from '@features/courses/components/CourseForm'
import ActionBar from '@shared/components/layout/ActionBar'

const FORM_ID = 'create-course-form'

export default function CreateCoursePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { mutate, loading } = useMutation('/studio/courses/', 'post')

  const handleSubmit = async (data) => {
    try {
      const result = await mutate(data)
      toast.success('Course created successfully!')
      navigate(`/courses/${result?.id ?? ''}`.replace(/\/$/, '') || '/courses')
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

      <CourseForm formId={FORM_ID} onSubmit={handleSubmit} />

      <ActionBar onCancel={() => navigate('/courses')} submitFormId={FORM_ID} saving={loading} label="Create Course" />
    </div>
  )
}
