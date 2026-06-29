export default function ActionBar({ onSave, onCancel, onPublish, saving = false, label = 'Save changes', publishLabel = 'Publish' }) {
  return (
    <div className="sticky bottom-0 z-10 bg-white border-t border-slate-100 shadow-lg px-6 py-3 flex items-center justify-between gap-3">
      <button onClick={onCancel} type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
        Cancel
      </button>
      <div className="flex gap-3">
        {onPublish && (
          <button onClick={onPublish} type="button" disabled={saving} className="px-5 py-2 text-sm font-semibold text-violet-700 bg-violet-100 hover:bg-violet-200 rounded-xl transition-colors disabled:opacity-50">
            {publishLabel}
          </button>
        )}
        <button onClick={onSave} type="button" disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : label}
        </button>
      </div>
    </div>
  )
}
