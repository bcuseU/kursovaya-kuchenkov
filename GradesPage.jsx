import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authChangePassword } from '../api'

export default function ProfilePage() {
  const { user, isAdmin } = useAuth()
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) { setPwError('Пароли не совпадают'); return }
    if (pwForm.newPassword.length < 6) { setPwError('Минимум 6 символов'); return }
    setPwSaving(true); setPwError(''); setPwSuccess('')
    try {
      await authChangePassword(pwForm.currentPassword, pwForm.newPassword)
      setPwSuccess('Пароль успешно изменён')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (e) {
      setPwError(e.response?.data?.message || 'Ошибка смены пароля')
    } finally { setPwSaving(false) }
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : user?.username?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Профиль</div>
      </div>
      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 800 }}>
          <div className="card">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--accent-dim)',
                border: '2px solid rgba(79,138,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)'
              }}>{initials}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{user?.fullName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {isAdmin() ? 'Администратор' : 'Куратор'}
                  {user?.groupNumber ? ` · Группа ${user.groupNumber}` : ''}
                </div>
              </div>
            </div>

            {[
              ['Логин', user?.username],
              ['Email', user?.email],
              ['Факультет', user?.groupFaculty],
              ['Группа', user?.groupNumber],
            ].map(([label, val]) => val ? (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: '0.85rem' }}>{val}</span>
              </div>
            ) : null)}
          </div>

          <div className="card">
            <div className="section-title" style={{ marginBottom: 20 }}>Сменить пароль</div>
            {pwError && <div className="alert alert-error" style={{ marginBottom: 12 }}>{pwError}</div>}
            {pwSuccess && <div className="alert alert-success" style={{ marginBottom: 12 }}>{pwSuccess}</div>}
            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Текущий пароль</label>
                <input className="form-input" type="password" required
                  value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Новый пароль</label>
                <input className="form-input" type="password" required minLength={6}
                  value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Подтвердите пароль</label>
                <input className="form-input" type="password" required
                  value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={pwSaving}>
                {pwSaving ? 'Сохранение...' : 'Изменить пароль'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
