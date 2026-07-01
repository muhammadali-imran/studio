import { useState, useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
import useTheme from '@/hooks/useTheme'
import { useApi } from '@shared/hooks/useApi'
import { useMutation } from '@shared/hooks/useMutation'
import { useToast } from '@/components/NotificationContext'
import Card, { CardTitle } from '@shared/components/ui/Card'
import Avatar from '../../components/Avatar'
import Skeleton from '@shared/components/ui/Skeleton'

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

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', title: '', bio: '' })
  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' })
  const [notifications, setNotifications] = useState({
    notify_new_submission: true,
    notify_quiz_completed: true,
    notify_student_enrolled: true,
  })

  useEffect(() => {
    if (remoteProfile) {
      setProfile((p) => ({ ...p, ...remoteProfile }))
      setNotifications((n) => ({ ...n, ...remoteProfile }))
    }
  }, [remoteProfile])

  const setP = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }))
  const setPw = (k) => (e) => setPasswords((p) => ({ ...p, [k]: e.target.value }))

  const handleProfileSave = async () => {
    try {
      await saveProfile(profile)
      toast.success('Profile updated.')
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
    setNotifications(next) // optimistic
    try {
      await saveNotifications({ [key]: next[key] })
    } catch {
      setNotifications(notifications) // revert on failure
      toast.error('Failed to update notification preference.')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">⚙️ Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardTitle className="mb-5">Profile</CardTitle>
        {profileLoading ? (
          <Skeleton.Text lines={4} />
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
              <Avatar name={profile.name} size="lg" />
              <div>
                <p className="font-semibold text-slate-800">{profile.name}</p>
                <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
              </div>
              <button className="ml-auto text-sm text-violet-600 hover:underline">Change photo</button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Full name', key: 'name', type: 'text' },
                { label: 'Email address', key: 'email', type: 'email' },
                { label: 'Title / designation', key: 'title', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input type={type} value={profile[key] || ''} onChange={setP(key)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                <textarea value={profile.bio || ''} onChange={setP('bio')} rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none" />
              </div>
              <button onClick={handleProfileSave} disabled={savingProfile} className="px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-60 transition-colors">
                {savingProfile ? 'Saving…' : 'Save profile'}
              </button>
            </div>
          </>
        )}
      </Card>

      {/* Password */}
      <Card>
        <CardTitle className="mb-5">Change password</CardTitle>
        <div className="space-y-4">
          {[
            { label: 'Current password', key: 'current' },
            { label: 'New password', key: 'newPwd' },
            { label: 'Confirm new password', key: 'confirm' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              <input type="password" value={passwords[key]} onChange={setPw(key)} placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>
          ))}
          <button onClick={handlePasswordChange} disabled={changingPassword} className="px-5 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-60 transition-colors">
            {changingPassword ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <CardTitle className="mb-4">Appearance</CardTitle>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-slate-800">Theme</p>
            <p className="text-xs text-slate-400 mt-0.5">Currently: {theme === 'dark' ? 'Dark' : 'Light'} mode</p>
          </div>
          <button onClick={toggleTheme} aria-label="Toggle dark mode" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
            {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
          </button>
        </div>
      </Card>

      {/* Notifications — persisted via PATCH /studio/users/me/ */}
      <Card>
        <CardTitle className="mb-4">Notifications</CardTitle>
        <div className="space-y-3">
          {NOTIFICATION_KEYS.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <input
                type="checkbox"
                checked={!!notifications[key]}
                onChange={() => handleNotificationToggle(key)}
                aria-label={label}
                className="accent-violet-600 w-4 h-4"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
