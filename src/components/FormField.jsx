// Reusable, accessible form field wrapper for use with react-hook-form.
// Pairs a <label htmlFor> with its control via a generated id, and renders
// a consistent error message slot underneath.
import { useId, cloneElement, isValidElement } from 'react'

export default function FormField({ label, error, children, hint }) {
  const id = useId()
  // Clone the single child input/textarea/select to inject id + aria attrs
  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        'aria-invalid': !!error,
        'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
      })
    : children

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {control}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-400">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function inputClass(error) {
  return `w-full px-4 py-3 rounded-xl border text-slate-800 text-sm placeholder-slate-400 outline-none transition-shadow ${
    error
      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
      : 'border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'
  }`
}
