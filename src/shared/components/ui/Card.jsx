export default function Card({ children, className = '', padding = 'md', shadow = 'sm', onClick }) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
  const shadows  = { none: '', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg' }
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl border border-slate-100 ${paddings[padding]} ${shadows[shadow]} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}>
      {children}
    </div>
  )
}
export function CardHeader({ children, className = '' }) { return <div className={`mb-4 ${className}`}>{children}</div> }
export function CardTitle({ children, className = '' }) { return <h3 className={`text-lg font-semibold text-slate-800 ${className}`}>{children}</h3> }
export function CardBody({ children, className = '' }) { return <div className={className}>{children}</div> }
