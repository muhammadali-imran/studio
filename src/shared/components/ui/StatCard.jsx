export default function StatCard({ title, value, icon, trend, trendPositive = true, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {trend && <p className={`text-xs mt-1.5 font-medium ${trendPositive ? 'text-emerald-600' : 'text-red-500'}`}>{trendPositive ? '↑' : '↓'} {trend}</p>}
        </div>
        {icon && <span className="text-3xl bg-violet-50 rounded-xl p-2.5 leading-none">{icon}</span>}
      </div>
    </div>
  )
}
