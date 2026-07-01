import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useAuth from '@/hooks/useAuth'

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')
  const from = location.state?.from?.pathname || '/dashboard'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setServerError('')
    try {
      await login(data.email, data.password)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err.message || err.response?.data?.detail || 'Invalid credentials.')
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Educator sign in</h2>
      <p className="text-slate-500 text-sm mb-7">Access your Studio dashboard</p>

      {serverError && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Field label="Email address" error={errors.email?.message}>
          <input type="email" autoComplete="email" placeholder="instructor@school.edu" {...register('email')} className={inputClass(errors.email)} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input type="password" autoComplete="current-password" placeholder="••••••••" {...register('password')} className={inputClass(errors.password)} />
        </Field>
        <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-60 transition-colors">
          {isSubmitting ? 'Signing in…' : 'Sign in to Studio'}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-400">
        Student? Visit <a href="http://localhost:5173" className="text-violet-600 hover:underline">Learner</a> instead.
      </p>
    </>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function inputClass(error) {
  return `w-full px-4 py-3 rounded-xl border text-slate-800 text-sm placeholder-slate-400 outline-none transition-shadow ${error ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'}`
}
