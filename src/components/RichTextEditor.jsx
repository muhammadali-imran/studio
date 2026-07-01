import { useRef } from 'react'

// Lightweight markdown editor. The toolbar buttons are functional: each one
// wraps/prefixes the current text selection with the relevant markdown
// syntax and restores focus + selection afterwards, so it behaves the way
// people expect from a "bold/italic/list" toolbar even without a full
// WYSIWYG engine. For a richer authoring experience (true WYSIWYG, inline
// image drop, etc.) swap this out for Tiptap or Quill — the props/contract
// (`value`, `onChange`) are designed to make that swap a drop-in replacement.
export default function RichTextEditor({ value, onChange, placeholder = 'Write your content here…', rows = 12 }) {
  const textareaRef = useRef(null)

  const applyWrap = (before, after = before, placeholderText = '') => {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart, selectionEnd } = el
    const selected = value.slice(selectionStart, selectionEnd) || placeholderText
    const next = value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd)
    onChange(next)
    // Restore focus + a sensible selection after React re-renders the textarea
    requestAnimationFrame(() => {
      el.focus()
      const newStart = selectionStart + before.length
      const newEnd = newStart + selected.length
      el.setSelectionRange(newStart, newEnd)
    })
  }

  const applyLinePrefix = (prefix) => {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart } = el
    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(selectionStart + prefix.length, selectionStart + prefix.length)
    })
  }

  const applyLink = () => {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart, selectionEnd } = el
    const selected = value.slice(selectionStart, selectionEnd) || 'link text'
    const markdown = `[${selected}](https://)`
    const next = value.slice(0, selectionStart) + markdown + value.slice(selectionEnd)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      // Place cursor inside the () so the user can paste/type the URL immediately
      const urlStart = selectionStart + selected.length + 3
      el.setSelectionRange(urlStart, urlStart + 8) // selects "https://"
    })
  }

  const toolbarBtns = [
    { label: 'B', title: 'Bold', style: 'font-bold', action: () => applyWrap('**', '**', 'bold text') },
    { label: 'I', title: 'Italic', style: 'italic', action: () => applyWrap('_', '_', 'italic text') },
    { label: 'U', title: 'Underline (HTML)', style: 'underline', action: () => applyWrap('<u>', '</u>', 'underlined text') },
    { label: 'H2', title: 'Heading 2', action: () => applyLinePrefix('## ') },
    { label: '• List', title: 'Bulleted list', action: () => applyLinePrefix('- ') },
    { label: '1. List', title: 'Numbered list', action: () => applyLinePrefix('1. ') },
    { label: '🔗', title: 'Insert link', action: applyLink },
  ]

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
      <div className="flex flex-wrap gap-1 px-3 py-2 bg-slate-50 border-b border-slate-200" role="toolbar" aria-label="Formatting">
        {toolbarBtns.map((btn) => (
          <button
            key={btn.title}
            type="button"
            title={btn.title}
            aria-label={btn.title}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors text-slate-600 hover:bg-slate-200 ${btn.style || ''}`}
            onMouseDown={(e) => { e.preventDefault(); btn.action() }}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-sm text-slate-700 resize-none outline-none bg-white font-mono leading-relaxed"
      />
      <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 flex justify-end">
        <span className="text-xs text-slate-400">{value?.length ?? 0} characters · Markdown supported</span>
      </div>
    </div>
  )
}
