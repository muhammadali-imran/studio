export default function DataTable({ columns, data, loading, emptyMessage = 'No data', onRowClick, page = 1, pageSize = 10, total = 0, onPageChange, onSort, sortBy, sortOrder }) {
  const handleSort = (field) => {
    if (!onSort) return
    onSort(field, sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc')
  }
  const totalPages = Math.ceil(total / pageSize)
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              {columns.map((col) => (
                <th key={col.field} className={`px-4 py-3 ${col.sortable ? 'cursor-pointer hover:text-slate-700' : ''}`} onClick={() => col.sortable && handleSort(col.field)}>
                  <span className="flex items-center gap-1">{col.header}{col.sortable && <span className="text-[10px]">{sortBy === col.field ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}</span>}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">Loading…</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">{emptyMessage}</td></tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id ?? i} onClick={() => onRowClick?.(row)} className={`hover:bg-slate-50 ${onRowClick ? 'cursor-pointer' : ''}`}>
                  {columns.map((col) => (
                    <td key={col.field} className="px-4 py-3 text-sm text-slate-700">{col.render ? col.render(row) : row[col.field]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && onPageChange && (
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm">
          <span className="text-slate-500">Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40">Prev</button>
            <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
