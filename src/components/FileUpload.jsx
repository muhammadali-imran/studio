import { useState, useRef } from 'react'

export default function FileUpload({ onFileSelect, accept, maxSizeMB = 10, label = 'Upload file' }) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const validate = (file) => {
    if (!file) return
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) { setError(`File must be under ${maxSizeMB}MB.`); return }
    setError(null); onFileSelect?.(file)
  }

  return (
    <div>
      <div onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); validate(e.dataTransfer.files[0]) }} onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-violet-400 bg-violet-50' : 'border-slate-300 hover:border-slate-400'}`}>
        <span className="text-2xl">📁</span>
        <p className="text-sm text-slate-600 mt-2">{label}</p>
        <p className="text-xs text-slate-400 mt-1">Drag & drop or click to browse</p>
        <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={(e) => validate(e.target.files?.[0])} />
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}
