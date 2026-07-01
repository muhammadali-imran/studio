import { useState, useEffect } from 'react'
import SidebarContext from './SidebarContext'

export default function SidebarProvider({ children }) {
  const [open, setOpen] = useState(() => {
    const stored = localStorage.getItem('studio_sidebar_open')
    return stored !== null ? JSON.parse(stored) : true
  })
  useEffect(() => { localStorage.setItem('studio_sidebar_open', JSON.stringify(open)) }, [open])
  const toggle = () => setOpen((v) => !v)
  return (
    <SidebarContext.Provider value={{ open, toggle, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}
