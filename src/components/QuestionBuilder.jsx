import { useState } from 'react'

const TYPES = [
  { value: 'mcq', label: 'Multiple Choice' },
  { value: 'truefalse', label: 'True / False' },
  { value: 'short', label: 'Short Answer' },
]

function emptyQuestion() {
  return { id: Date.now(), type: 'mcq', text: '', points: 1, hint: '', explanation: '', options: ['', '', '', ''], correct: 0 }
}

export default function QuestionBuilder({ questions, onChange }) {
  const add = () => onChange([...questions, emptyQuestion()])
  const remove = (idx) => onChange(questions.filter((_, i) => i !== idx))
  const update = (idx, patch) => onChange(questions.map((q, i) => i === idx ? { ...q, ...patch } : q))

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Q{idx + 1}</span>
            <div className="flex gap-2 items-center ml-auto">
              <select value={q.type} onChange={(e) => update(idx, { type: e.target.value })} className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-violet-400">
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <input type="number" min={1} value={q.points} onChange={(e) => update(idx, { points: Number(e.target.value) })} className="w-14 text-xs border border-slate-200 rounded-lg px-2 py-1 text-center focus:outline-none focus:border-violet-400" placeholder="pts" />
              <button onClick={() => remove(idx)} className="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none">✕</button>
            </div>
          </div>

          <textarea value={q.text} onChange={(e) => update(idx, { text: e.target.value })} rows={2}
            placeholder="Enter question text…"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400 resize-none" />

          {q.type === 'mcq' && (
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input type="radio" name={`correct-${q.id}`} checked={q.correct === oi} onChange={() => update(idx, { correct: oi })} className="accent-violet-600" />
                  <input value={opt} onChange={(e) => { const opts = [...q.options]; opts[oi] = e.target.value; update(idx, { options: opts }) }}
                    placeholder={`Option ${oi + 1}`}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-400" />
                </div>
              ))}
              <button onClick={() => update(idx, { options: [...q.options, ''] })} className="text-xs text-violet-600 hover:underline">+ Add option</button>
            </div>
          )}

          {q.type === 'truefalse' && (
            <div className="flex gap-4">
              {['True', 'False'].map((opt, oi) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name={`tf-${q.id}`} checked={q.correct === oi} onChange={() => update(idx, { correct: oi })} className="accent-violet-600" />
                  <span className="text-sm font-medium text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {q.type === 'short' && (
            <input value={q.explanation} onChange={(e) => update(idx, { explanation: e.target.value })}
              placeholder="Model answer / keywords…"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
          )}

          <div className="grid grid-cols-2 gap-3">
            <input value={q.hint} onChange={(e) => update(idx, { hint: e.target.value })} placeholder="Hint (optional)" className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-violet-400" />
            <input value={q.explanation} onChange={(e) => update(idx, { explanation: e.target.value })} placeholder="Explanation (shown after)" className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-violet-400" />
          </div>
        </div>
      ))}

      <button onClick={add} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl text-sm font-medium text-slate-500 hover:border-violet-400 hover:text-violet-600 transition-colors">
        + Add Question
      </button>
    </div>
  )
}
