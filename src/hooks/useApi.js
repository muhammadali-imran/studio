import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../api/axios'

const MOCKS_ENABLED = import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true'

/**
 * useApi — fetches data on mount and whenever `url` or `params` change.
 *
 * Mock data is NEVER used to silently mask a failure in production. It is only
 * ever applied when both `import.meta.env.DEV` is true AND `VITE_USE_MOCKS=true`
 * is set in the environment, and only as the *initial* value before the real
 * request resolves — if the request fails, `error` is still set so the UI can
 * show an actual error state with retry, rather than fictitious data.
 *
 * const { data, loading, error, refetch } = useApi('/studio/courses/', {
 *   params: { search },
 *   mockData: mockCourses, // only used in dev when VITE_USE_MOCKS=true
 * })
 */
export function useApi(url, options = {}) {
  const { params, mockData } = options
  const initial = MOCKS_ENABLED && mockData !== undefined ? mockData : null

  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(!!url)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const doFetch = useCallback(async () => {
    if (!url) { setLoading(false); return }
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(url, { params, signal: abortRef.current.signal })
      setData(res.data)
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.response?.data?.detail || err.message || 'Something went wrong')
        // Intentionally do NOT fall back to mockData here in any environment —
        // a failed request must surface as an error, not as fabricated content.
      }
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(params)])

  useEffect(() => { doFetch(); return () => abortRef.current?.abort() }, [doFetch])

  return { data, loading, error, refetch: doFetch }
}
