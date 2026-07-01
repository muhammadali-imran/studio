import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../../../hooks/useApi'
import { useMutation } from '../../../hooks/useMutation'
import { useToast } from '../../../components/NotificationContext'
import CourseTabs from '../../../components/CourseTabs'
import Badge from '../../../components/Badge'
import ConfirmDialog from '../../../components/ConfirmDialog'
import EmptyState from '../../../components/EmptyState'
import ErrorState from '../../../components/ErrorState'
import Skeleton from '../../../components/Skeleton'

const mockLectures = [
  { id: 1, title: 'Python Setup & Your First Program', order: 1, published: true, video_url: 'https://youtube.com/watch?v=xyz', duration: '22 min' },
  { id: 2, title: 'Variables and Data Types', order: 2, published: true, video_url: '', duration: '35 min' },
  { id: 3, title: 'Control Flow: if, elif, else', order: 3, published: true, video_url: '', duration: '28 min' },
  { id: 4, title: 'Loops: for and while', order: 4, published: false, video_url: '', duration: '31 min' },
  { id: 5, title: 'Functions and Scope', order: 5, published: false, video_url: '', duration: '40 min' },
]

export default function LectureListPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { data: lectures, loading, error, refetch } = useApi(`/studio/courses/${id}/lectures/`, { mockData: mockLectures })
  const { mutate: deleteLecture } = useMutation(null, 'delete')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const list = lectures ?? []

  const handleDelete = async () => {
    try {
      await deleteLecture(null, `/studio/lectures/${deleteTarget}/`)
      toast.success('Lecture deleted.')
      refetch()
    } catch {
      toast.error('Failed to delete lecture.')
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to={`/courses/${id}`} className="text-sm text-slate-400 hover:text-slate-600">← Overview</Link>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">Lectures</h2>
        </div>
        <Link to={`/courses/${id}/lectures/new`} className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
          + New Lecture
        </Link>
      </div>

      <CourseTabs />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState icon="🎬" title="No lectures yet" message="Add your first lecture to get started." action={{ label: 'Add lecture', onClick: () => navigate(`/courses/${id}/lectures/new`) }} />
      ) : (
        <div className="space-y-2">
          {list.map((lecture) => (
            <div key={lecture.id} className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <span className="text-slate-300 text-sm font-mono w-6 text-center select-none">⠿</span>
              <span className="text-sm font-mono text-slate-400 w-6 text-center">{lecture.order}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{lecture.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{lecture.duration} {lecture.video_url && '· has video'}</p>
              </div>
              <Badge variant={lecture.published ? 'green' : 'amber'}>{lecture.published ? 'Published' : 'Draft'}</Badge>
              <div className="flex gap-2">
                <Link to={`/courses/${id}/lectures/${lecture.id}/edit`} className="text-xs px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Edit</Link>
                <button onClick={() => setDeleteTarget(lecture.id)} className="text-xs px-3 py-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete lecture?" message="This will permanently remove the lecture and all associated content." confirmLabel="Delete lecture" />
    </div>
  )
}
