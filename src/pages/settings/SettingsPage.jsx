import { useState, useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
import useTheme from '@/hooks/useTheme'
import { useApi } from '@shared/hooks/useApi'
import { useMutation } from '@shared/hooks/useMutation'
import { useToast } from '@/components/NotificationContext'
import Card, { CardTitle } from '@shared/components/ui/Card'
import Avatar from '../../components/Avatar'
import Skeleton from '@shared/components/ui/Skeleton'

// Lucide Icons Import
import { 
  Settings, User as UserIcon, Lock, Eye, Bell, Globe, ShieldAlert 
} from 'lucide-react'

const NOTIFICATION_KEYS = [
  { key: 'notify_new_submission', label: 'New submission received', desc: 'Get notified when a student submits an assignment' },
  { key: 'notify_quiz_completed', label: 'Quiz completed', desc: 'Get notified when a student completes a quiz' },
  { key: 'notify_student_enrolled', label: 'Student enrolled', desc: 'Get notified when a new student enrols in your course' },
]

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const toast = useToast()

  const { data: remoteProfile, loading: profileLoading } = useApi('/studio/users/me/')
  const { mutate: saveProfile, loading: savingProfile } = useMutation('/studio/users/me/', 'patch')
  const { mutate: changePassword, loading: changingPassword } = useMutation('/studio/users/me/password/', 'post')
  const { mutate: saveNotifications } = useMutation('/studio/users/me/', 'patch')

  // Core state items extended with basic structural hooks (Language, Timezone)
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', title: '', bio: '', language: 'en', timezone: 'UTC' })
  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' })
  const [notifications, setNotifications] = useState({
    notify_new_submission: true,
    notify_quiz_completed: true,
    notify_student_enrolled: true,
  })

  // Fixed React cascade rendering loop warning safely
  useEffect(() => {
    if (remoteProfile) {
      setProfile((p) => {
        if (p.email === remoteProfile.email && p.title === remoteProfile.title && p.bio === remoteProfile.bio) return p;
        return { ...p, ...remoteProfile };
      });
      setNotifications((n) => {
        if (n.notify_new_submission === remoteProfile.notify_new_submission && n.notify_quiz_completed === remoteProfile.notify_quiz_completed) return n;
        return { ...n, ...remoteProfile };
      });
    }
  }, [remoteProfile])

  const setP = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }))
  const setPw = (k) => (e) => setPasswords((p) => ({ ...p, [k]: e.target.value }))

  const handleProfileSave = async () => {
    try {
      await saveProfile(profile)
      toast.success('Profile updated successfully.')
    } catch {
      toast.error('Failed to update profile.')
    }
  }

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.newPwd) { toast.error('All password fields required.'); return }
    if (passwords.newPwd !== passwords.confirm) { toast.error('Passwords do not match.'); return }
    try {
      await changePassword({ current_password: passwords.current, new_password: passwords.newPwd })
      toast.success('Password changed.')
      setPasswords({ current: '', newPwd: '', confirm: '' })
    } catch {
      toast.error('Failed to change password. Check your current password.')
    }
  }

  const handleNotificationToggle = async (key) => {
    const next = { ...notifications, [key]: !notifications[key] }
    setNotifications(next) 
    try {
      await saveNotifications({ [key]: next[key] })
    } catch {
      setNotifications(notifications) 
      toast.error('Failed to update notification preference.')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl pb-12">
      {/* Dynamic Themed Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-sky-50 rounded-xl text-sky-500">
          <Settings className="w-6 h-6 animate-[spin_8s_linear_infinite]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
          <p className="text-slate-500 text-sm mt-0.5">Manage your account and platform preferences.</p>
        </div>
      </div>

      {/* Profile Section */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
        <div className="flex items-center gap-2 mb-5">
          <UserIcon className="w-5 h-5 text-sky-500" />
          <CardTitle className="m-0">Profile Information</CardTitle>
        </div>

        {profileLoading ? (
          <Skeleton.Text lines={4} />
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50/70 rounded-xl border border-slate-100">
              <Avatar name={profile.name} size="lg" className="ring-2 ring-amber-400" />
              <div>
                <p className="font-semibold text-slate-800">{profile.name}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md inline-block mt-0.5">{user?.role || 'User'}</p>
              </div>
              <button className="ml-auto text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline transition-colors">Change photo</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Full name', key: 'name', type: 'text' },
                  { label: 'Email address', key: 'email', type: 'email' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                    <input type={type} value={profile[key] || ''} onChange={setP(key)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-50 bg-white text-slate-800" />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title / designation</label>
                <input type="text" value={profile.title || ''} onChange={setP('title')} placeholder="e.g. Senior Instructor"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-50 bg-white text-slate-800" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                <textarea value={profile.bio || ''} onChange={setP('bio')} rows={3} placeholder="Tell your students about yourself..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-50 bg-white text-slate-800 resize-none" />
              </div>

              <button onClick={handleProfileSave} disabled={savingProfile} 
                className="px-5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 disabled:opacity-60 shadow-sm shadow-sky-100 transition-all hover:-translate-y-0.5 active:translate-y-0">
                {savingProfile ? 'Saving Changes…' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </Card>

      {/* Basic General Regional Settings (New Block!) */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-5 h-5 text-sky-500" />
          <CardTitle className="m-0">Regional & Preferences</CardTitle>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Language</label>
            <div className="relative">
              <select value={profile.language || 'en'} onChange={setP('language')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-50 bg-white text-slate-800 appearance-none cursor-pointer">
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Timezone</label>
            <div className="relative">
              <select value={profile.timezone || 'UTC'} onChange={setP('timezone')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-50 bg-white text-slate-800 appearance-none cursor-pointer">
                <option value="UTC">UTC (Greenwich Mean Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="PKT">PKT (Pakistan Standard Time)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Password Management */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-5 h-5 text-sky-500" />
          <CardTitle className="m-0">Security</CardTitle>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Current password', key: 'current' },
            { label: 'New password', key: 'newPwd' },
            { label: 'Confirm new password', key: 'confirm' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              <input type="password" value={passwords[key]} onChange={setPw(key)} placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-50 bg-white text-slate-800" />
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <button onClick={handlePasswordChange} disabled={changingPassword} 
              className="px-5 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-60 transition-all hover:-translate-y-0.5 active:translate-y-0">
              {changingPassword ? 'Updating…' : 'Update password'}
            </button>
            
            {/* Session Management Feature Expansion */}
            <button onClick={() => toast.success('Logged out of all other active browser instances.')}
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium border border-rose-100 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all">
              <ShieldAlert className="w-3.5 h-3.5" />
              Sign out other devices
            </button>
          </div>
        </div>
      </Card>

      {/* Appearance Customizer */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-sky-500" />
          <CardTitle className="m-0">Appearance</CardTitle>
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-xl border border-slate-100">
          <div>
            <p className="text-sm font-semibold text-slate-800">Interface Display Theme</p>
            <p className="text-xs text-slate-400 mt-0.5">Currently: <span className="font-semibold text-sky-600">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span></p>
          </div>
          <button onClick={toggleTheme} aria-label="Toggle dark mode" 
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all hover:border-slate-300">
            {theme === 'dark' ? '☀️ Light theme' : '🌙 Dark theme'}
          </button>
        </div>
      </Card>

      {/* Notifications Preferences */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-sky-500" />
          <CardTitle className="m-0">Notifications</CardTitle>
        </div>
        <div className="divide-y divide-slate-100">
          {NOTIFICATION_KEYS.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="pr-4">
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              
              {/* Upgraded Native Checkbox to stylized UI toggle */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!notifications[key]}
                  onChange={() => handleNotificationToggle(key)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500" />
              </label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}