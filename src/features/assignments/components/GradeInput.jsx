export default function GradeInput({ value, onChange, max = 100, label = 'Grade' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  const color = pct >= 70 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className={`text-sm font-bold ${color}`}>{value}/{max} ({pct}%)</span>
      </div>
      <input
        type="range" min={0} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-violet-600"
      />
      <input
        type="number" min={0} max={max} value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(0, Number(e.target.value))))}
        className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-center font-semibold focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none"
      />
    </div>
  )
}
