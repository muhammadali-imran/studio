export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      {message && <p className="text-slate-500 text-sm max-w-sm">{message}</p>}
      {action && (
        <button onClick={action.onClick} className="mt-5 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">{action.label}</button>
      )}
    </div>
  )
}
