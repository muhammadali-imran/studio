export default function AttendanceGrid({ students, attendance, onChange }) {
  const toggle = (studentId) => {
    onChange({ ...attendance, [studentId]: !attendance[studentId] })
  }
  const markAll = (present) => {
    const next = {}
    students.forEach((s) => { next[s.id] = present })
    onChange(next)
  }

  const presentCount = Object.values(attendance).filter(Boolean).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{presentCount} / {students.length} present</p>
        <div className="flex gap-2">
          <button onClick={() => markAll(true)} className="text-xs px-3 py-1.5 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200 transition-colors">All present</button>
          <button onClick={() => markAll(false)} className="text-xs px-3 py-1.5 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors">All absent</button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        {students.map((student, i) => {
          const isPresent = !!attendance[student.id]
          return (
            <div key={student.id} className={`flex items-center justify-between px-5 py-3 ${i > 0 ? 'border-t border-slate-100' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-6 text-right font-mono">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-slate-800">{student.name}</p>
                  <p className="text-xs text-slate-400">{student.roll || student.email}</p>
                </div>
              </div>
              <button onClick={() => toggle(student.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${isPresent ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600'}`}>
                {isPresent ? '✓ Present' : '✗ Absent'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
