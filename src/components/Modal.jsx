import { useEffect, useRef } from 'react'

// Returns every focusable element inside a given container.
function getFocusable(container) {
  return Array.from(container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ))
}

/**
 * Modal — accessible dialog.
 *
 * Implements:
 *  - aria-modal + role="dialog" so screen readers announce it as a dialog.
 *  - Focus is moved into the modal on open and returned to the previously
 *    focused element on close.
 *  - Tab / Shift+Tab cycle is trapped inside the modal while it is open.
 *  - Escape key closes the modal.
 *  - Body scroll is locked while the modal is open.
 *  - Clicking the overlay (outside the panel) closes the modal.
 */
export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const overlayRef = useRef(null)
  const panelRef = useRef(null)
  const previousFocusRef = useRef(null)

  // Move focus into the modal when it opens; restore when it closes.
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement
      // Defer to let the panel render first
      requestAnimationFrame(() => {
        const focusable = getFocusable(panelRef.current)
        if (focusable.length) focusable[0].focus()
        else panelRef.current?.focus()
      })
    } else {
      previousFocusRef.current?.focus?.()
    }
  }, [open])

  // Trap Tab / Shift+Tab inside the modal + handle Escape.
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const focusable = getFocusable(panelRef.current)
      if (!focusable.length) { e.preventDefault(); return }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Lock body scroll.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-full mx-4' }

  return (
    <div
      ref={overlayRef}
      role="presentation"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto outline-none`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4 ${className}`}>
      {children}
    </div>
  )
}
