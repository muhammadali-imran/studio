function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
}
Skeleton.Text = function({ lines = 3 }) {
  const widths = ['w-full', 'w-5/6', 'w-4/6']
  return <div className="flex flex-col gap-2">{Array.from({ length: lines }).map((_, i) => <Skeleton key={i} className={`h-4 ${widths[i % widths.length]}`} />)}</div>
}
Skeleton.Card = function() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
      <Skeleton className="h-4 w-1/3" /><Skeleton.Text lines={3} />
      <div className="flex gap-3 pt-2"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-16" /></div>
    </div>
  )
}
export default Skeleton
