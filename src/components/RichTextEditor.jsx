import { useState } from 'react'

// Lightweight rich text editor — production would use TipTap or Quill
export default function RichTextEditor({ value, onChange, placeholder = 'Write your content here…', rows = 12 }) {
  const [activeFormat, setActiveFormat] = useState(null)

  const toolbarBtns = [
    { label: 'B', title: 'Bold', cmd: 'bold', style: 'font-bold' },
    { label: 'I', title: 'Italic', cmd: 'italic', style: 'italic' },
    { label: 'U', title: 'Underline', cmd: 'underline', style: 'underline' },
    { label: 'H2', title: 'Heading 2', cmd: 'h2' },
    { label: '• List', title: 'Unordered list', cmd: 'ul' },
    { label: '1. List', title: 'Ordered list', cmd: 'ol' },
    { label: '🔗', title: 'Link', cmd: 'link' },
  ]

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
      <div className="flex flex-wrap gap-1 px-3 py-2 bg-slate-50 border-b border-slate-200">
        {toolbarBtns.map((btn) => (
          <button key={btn.cmd} type="button" title={btn.title}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${btn.style || ''} ${activeFormat === btn.cmd ? 'bg-violet-100 text-violet-700' : 'text-slate-600 hover:bg-slate-200'}`}
            onMouseDown={(e) => { e.preventDefault(); setActiveFormat(activeFormat === btn.cmd ? null : btn.cmd) }}>
            {btn.label}
          </button>
        ))}
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-sm text-slate-700 resize-none outline-none bg-white font-mono leading-relaxed" />
      <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 flex justify-end">
        <span className="text-xs text-slate-400">{value?.length ?? 0} characters · Markdown supported</span>
      </div>
    </div>
  )
}
