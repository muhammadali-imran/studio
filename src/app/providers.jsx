import AuthProvider from '@shared/contexts/AuthProvider'
import SidebarProvider from '@shared/contexts/SidebarProvider'
import ThemeProvider from '@shared/contexts/ThemeProvider'
import { ToastProvider } from '@shared/contexts/NotificationContext'

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
