import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import AuthContext from './AuthContext'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => !!localStorage.getItem('studio_access_token'))

  useEffect(() => {
    const token = localStorage.getItem('studio_access_token')
    if (!token) return
    api.get('/auth/me/')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('studio_access_token')
        localStorage.removeItem('studio_refresh_token')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login/', { email, password })
    if (!['instructor', 'admin'].includes(data.user?.role)) {
      throw new Error('Access denied. Studio is for instructors and administrators only.')
    }
    localStorage.setItem('studio_access_token', data.access)
    localStorage.setItem('studio_refresh_token', data.refresh)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('studio_access_token')
    localStorage.removeItem('studio_refresh_token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
