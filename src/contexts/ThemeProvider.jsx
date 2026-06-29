import { useState, useEffect } from 'react'
import ThemeContext from './ThemeContext'

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('studio_theme') || 'light')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('studio_theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
