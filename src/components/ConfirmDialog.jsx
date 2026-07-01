import Modal, { ModalFooter } from '@shared/components/ui/Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', message = 'This action cannot be undone.', confirmLabel = 'Delete', loading = false, variant = 'danger' }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-slate-600 text-sm">{message}</p>
      <ModalFooter>
        <button onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className={`px-4 py-2 text-sm font-medium text-white rounded-xl ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-violet-600 hover:bg-violet-700'}`}>
          {loading ? 'Processing…' : confirmLabel}
        </button>
      </ModalFooter>
    </Modal>
  )
}
