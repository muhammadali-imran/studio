export default function ProgressBar({ value = 0, label = '', showValue = true, color = 'violet', className = '' }) {
  const clamped = Math.min(100, Math.max(0, value))
  const colors = { violet: 'bg-violet-600', green: 'bg-emerald-500', blue: 'bg-blue-500', amber: 'bg-amber-500', red: 'bg-red-500' }
  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
          {showValue && <span className="text-sm text-slate-500">{clamped}%</span>}
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-500 ${colors[color] || colors.violet}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
