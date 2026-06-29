function initials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('')
}
const sizes = { xs: 'h-7 w-7 text-xs', sm: 'h-9 w-9 text-sm', md: 'h-11 w-11 text-base', lg: 'h-16 w-16 text-xl', xl: 'h-24 w-24 text-3xl' }

export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const sizeClass = sizes[size] || sizes.md
  if (src) return <img src={src} alt={name} className={`${sizeClass} rounded-full object-cover ring-2 ring-white ${className}`} />
  return (
    <span className={`${sizeClass} rounded-full bg-violet-600 text-white font-semibold flex items-center justify-center select-none ring-2 ring-white ${className}`}>
      {initials(name) || '?'}
    </span>
  )
}
