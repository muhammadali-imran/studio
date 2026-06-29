import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import useTheme from '../../hooks/useTheme'
import { useToast } from '../../components/NotificationContext'
import Card, { CardTitle } from '../../components/Card'
import Avatar from '../../components/Avatar'

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const toast = useToast()

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: 'Assistant Professor',
    bio: 'Educator with 10+ years of experience in Computer Science.',
  })
  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' })

  const setP = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }))
  const setPw = (k) => (e) => setPasswords((p) => ({ ...p, [k]: e.target.value }))

  const handleProfileSave = () => toast.success('Profile updated.')
  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.newPwd) { toast.error('All password fields required.'); return }
    if (passwords.newPwd !== passwords.confirm) { toast.error('Passwords do not match.'); return }
    toast.success('Password changed.')
    setPasswords({ current: '', newPwd: '', confirm: '' })
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
        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
          <Avatar name={profile.name} size="lg" />
          <div>
            <p className="font-semibold text-slate-800">{profile.name}</p>
            <p className="text-sm text-slate-500">{user?.role}</p>
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
              <input type={type} value={profile[key]} onChange={setP(key)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <textarea value={profile.bio} onChange={setP('bio')} rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none" />
          </div>
          <button onClick={handleProfileSave} className="px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
            Save profile
          </button>
        </div>
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
          <button onClick={handlePasswordChange} className="px-5 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors">
            Update password
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
          <button onClick={toggleTheme} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
            {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
          </button>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <CardTitle className="mb-4">Notifications</CardTitle>
        <div className="space-y-3">
          {[
            { label: 'New submission received', desc: 'Get notified when a student submits an assignment' },
            { label: 'Quiz completed', desc: 'Get notified when a student completes a quiz' },
            { label: 'Student enrolled', desc: 'Get notified when a new student enrols in your course' },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-violet-600 w-4 h-4" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
