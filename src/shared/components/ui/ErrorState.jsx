export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <span className="text-5xl mb-4">⚠️</span>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Unable to load</h3>
      <p className="text-slate-500 text-sm max-w-sm">{message}</p>
      {onRetry && <button onClick={onRetry} className="mt-5 px-5 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors">Try again</button>}
    </div>
  )
}
