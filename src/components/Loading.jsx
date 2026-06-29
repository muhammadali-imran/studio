export default function Loading({ fullscreen = false, size = 'md', label = '' }) {
  const sizes = { sm: 'h-5 w-5 border-2', md: 'h-9 w-9 border-3', lg: 'h-14 w-14 border-4' }
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} rounded-full border-violet-200 border-t-violet-600 animate-spin`} />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  )
  if (fullscreen) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">{spinner}</div>
  return spinner
}
