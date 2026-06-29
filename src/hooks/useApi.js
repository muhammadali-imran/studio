import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../api/axios'

export function useApi(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const doFetch = useCallback(async () => {
    if (!url) { setLoading(false); return }
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(url, { params: options.params, signal: abortRef.current.signal })
      setData(res.data)
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.response?.data?.detail || err.message || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }, [url, JSON.stringify(options.params)])

  useEffect(() => { doFetch(); return () => abortRef.current?.abort() }, [doFetch])

  return { data, loading, error, refetch: doFetch }
}
