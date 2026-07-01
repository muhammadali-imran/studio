import { useContext } from 'react'
import SidebarContext from '@shared/contexts/SidebarContext'
export default function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used inside <SidebarProvider>')
  return ctx
}
