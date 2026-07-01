import { useState } from 'react'
import { useApi } from '@shared/hooks/useApi'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useMutation } from '@shared/hooks/useMutation'
import { useToast } from '@/components/NotificationContext'
import SearchInput from '../../components/SearchInput'
import Badge from '@shared/components/ui/Badge'
import FileUpload from '../../components/FileUpload'
import Modal, { ModalFooter } from '@shared/components/ui/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'

const mockResources = [
  { id: 1, name: 'Python Reference Guide.pdf', type: 'pdf', size: '2.1 MB', visibility: 'students', course: 'Python', uploaded: '2025-01-10' },
  { id: 2, name: 'Web Dev Cheatsheet.pdf', type: 'pdf', size: '540 KB', visibility: 'students', course: 'Web Dev', uploaded: '2025-01-15' },
  { id: 3, name: 'DSA Slides Week 1.pptx', type: 'pptx', size: '8.4 MB', visibility: 'instructors', course: 'DSA', uploaded: '2025-01-20' },
  { id: 4, name: 'Database ER Diagram Template.pdf', type: 'pdf', size: '312 KB', visibility: 'public', course: 'Database', uploaded: '2025-02-01' },
  { id: 5, name: 'Supplementary Reading List.docx', type: 'docx', size: '180 KB', visibility: 'students', course: null, uploaded: '2025-02-05' },
]

const typeIcon = { pdf: '📄', pptx: '📊', docx: '📝', xlsx: '📈', zip: '🗜️' }
const visibilityVariant = { students: 'blue', instructors: 'violet', public: 'green' }

export default function LibraryPage() {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [uploadModal, setUploadModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [visibility, setVisibility] = useState('students')

  const { data: resources, loading, error, refetch } = useApi('/studio/library/', { mockData: mockResources })
  const { upload, uploading, progress } = useFileUpload('/studio/library/upload/')
  const { mutate: del } = useMutation(null, 'delete')

  const list = resources ?? []
  const filtered = list.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))

  const handleUpload = async () => {
    if (!selectedFile) { toast.error('Please select a file.'); return }
    try {
      // Real multipart/form-data upload with progress, not just metadata.
      await upload(selectedFile, { visibility })
      toast.success('Resource uploaded.')
      setUploadModal(false)
      setSelectedFile(null)
      refetch()
    } catch {
      toast.error('Upload failed. Please try again.')
    }
  }

  const handleDelete = async () => {
    try { await del(null, `/studio/library/${deleteTarget}/`); toast.success('Resource deleted.'); refetch() }
    catch { toast.error('Failed to delete.') }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">🗂️ Digital Library</h2>
          <p className="text-slate-500 text-sm mt-1">Manage course resources, PDFs, and study materials.</p>
        </div>
        <button onClick={() => setUploadModal(true)} className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
          + Upload resource
        </button>
      </div>

      <div className="max-w-xs">
        <SearchInput value={search} onChange={setSearch} placeholder="Search resources..." />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filtered.length === 0 && !loading ? (
        <EmptyState icon="🗂️" title="No resources found" message="Upload your first resource to get started."
          action={{ label: 'Upload', onClick: () => setUploadModal(true) }} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {filtered.map((res, i) => (
            <div key={res.id} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? 'border-t border-slate-100' : ''}`}>
              <span className="text-2xl">{typeIcon[res.type] || '📁'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{res.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {res.size} · {res.course || 'Platform-wide'} · {res.uploaded}
                </p>
              </div>
              <Badge variant={visibilityVariant[res.visibility] || 'slate'}>{res.visibility}</Badge>
              <div className="flex gap-2">
                <a href={res.url || '#'} className="text-xs px-3 py-1.5 text-violet-600 hover:bg-violet-50 rounded-lg font-medium transition-colors">Download</a>
                <button onClick={() => setDeleteTarget(res.id)} className="text-xs px-3 py-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={uploadModal} onClose={() => !uploading && setUploadModal(false)} title="Upload resource">
        <div className="space-y-4">
          <FileUpload label="Select file to upload" accept=".pdf,.doc,.docx,.pptx,.xlsx,.zip" maxSizeMB={50} onFileSelect={setSelectedFile} progress={uploading ? progress : null} />
          {selectedFile && !uploading && <p className="text-sm text-emerald-600">✓ {selectedFile.name}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Visibility</label>
            <select value={visibility} onChange={(e) => setVisibility(e.target.value)} disabled={uploading} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 disabled:opacity-60">
              <option value="students">Students only</option>
              <option value="instructors">Instructors only</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>
        <ModalFooter>
          <button onClick={() => setUploadModal(false)} disabled={uploading} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 disabled:opacity-60">Cancel</button>
          <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 disabled:opacity-60">
            {uploading ? `Uploading… ${progress}%` : 'Upload'}
          </button>
        </ModalFooter>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete resource?" message="Students will no longer be able to access this file." confirmLabel="Delete" />
    </div>
  )
}
