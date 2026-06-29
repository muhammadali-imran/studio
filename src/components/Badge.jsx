const variants = {
  violet: 'bg-violet-100 text-violet-700',
  green:  'bg-emerald-100 text-emerald-700',
  red:    'bg-red-100 text-red-700',
  amber:  'bg-amber-100 text-amber-700',
  blue:   'bg-blue-100 text-blue-700',
  slate:  'bg-slate-100 text-slate-600',
  indigo: 'bg-indigo-100 text-indigo-700',
}
export default function Badge({ children, variant = 'slate', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
