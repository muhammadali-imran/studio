import { useState } from 'react'
import GradeInput from './GradeInput'

export default function SubmissionReview({ submission, maxGrade = 100, onGrade }) {
  const [grade, setGrade] = useState(submission?.grade ?? 0)
  const [feedback, setFeedback] = useState(submission?.feedback ?? '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    await onGrade?.({ grade, feedback })
    setSaving(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Submission content */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-slate-800">Submission</h3>
        {submission?.file ? (
          <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <span className="text-2xl">📄</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{submission.file.name}</p>
                <p className="text-xs text-slate-400">{submission.file.size}</p>
              </div>
              <a href={submission.file.url} download className="ml-auto text-xs font-medium text-violet-600 hover:underline">Download</a>
            </div>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{submission?.text || 'No submission content.'}</p>
          </div>
        )}
        <div className="text-xs text-slate-400 space-y-1">
          <p>Submitted by: <span className="font-medium text-slate-600">{submission?.student_name}</span></p>
          <p>Submitted at: <span className="font-medium text-slate-600">{submission?.submitted_at}</span></p>
          {submission?.late && <p className="text-red-500 font-semibold">⚠ Late submission</p>}
        </div>
      </div>

      {/* Grading panel */}
      <div className="space-y-5">
        <h3 className="text-base font-semibold text-slate-800">Grade & Feedback</h3>
        <GradeInput value={grade} onChange={setGrade} max={maxGrade} />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Feedback</label>
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={6}
            placeholder="Write your feedback here…"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400 resize-none" />
        </div>
        <button onClick={handleSubmit} disabled={saving}
          className="w-full py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-60 transition-colors">
          {saving ? 'Saving grade…' : 'Save grade'}
        </button>
      </div>
    </div>
  )
}
