import { useState, useCallback } from 'react'
import api from '../api/axios'

export function useMutation(url, method = 'post') {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = useCallback(async (body, overrideUrl) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api[method](overrideUrl || url, body)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Request failed'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, method])

  return { mutate, loading, error }
}
