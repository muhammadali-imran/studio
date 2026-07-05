import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApi } from '@shared/hooks/useApi'
import { useMutation } from '@shared/hooks/useMutation'
import { useToast } from '@shared/contexts/NotificationContext'
import CourseForm from '@features/courses/components/CourseForm'
import ActionBar from '@shared/components/layout/ActionBar'
import Loading from '@shared/components/ui/Loading'
import ErrorState from '@shared/components/ui/ErrorState'

const FORM_ID = 'edit-course-form'

export default function EditCoursePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { data: course, loading: fetching, error, refetch } = useApi(`/studio/courses/${id}/`)
  const { mutate, loading: saving } = useMutation(`/studio/courses/${id}/`, 'put')

  const handleSubmit = async (data) => {
    try {
      await mutate(data)
      toast.success('Course updated successfully!')
      navigate(`/courses/${id}`)
    } catch {
      toast.error('Failed to update course.')
    }
  }

  if (fetching) return <Loading fullscreen />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="space-y-6 pb-20">
      <div>
        <Link to={`/courses/${id}`} className="text-sm text-slate-400 hover:text-slate-600">← Course overview</Link>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">Edit Course</h2>
      </div>

      <CourseForm formId={FORM_ID} initialValues={course} onSubmit={handleSubmit} />

      <ActionBar onCancel={() => navigate(`/courses/${id}`)} submitFormId={FORM_ID} saving={saving} />
    </div>
  )
}
