import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  IconDashboard, IconStudents, IconGroups,
  IconSubjects, IconGrades, IconAttendance,
  IconUsers, IconProfile, IconLogout
} from './Icons'

const navItems = [
  { to: '/', label: 'Обзор', icon: IconDashboard, end: true },
  { to: '/students', label: 'Студенты', icon: IconStudents },
  { to: '/groups', label: 'Группы', icon: IconGroups },
  { to: '/subjects', label: 'Предметы', icon: IconSubjects },
  { to: '/grades', label: 'Успеваемость', icon: IconGrades },
  { to: '/attendance', label: 'Посещаемость', icon: IconAttendance },
]

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const initials = user?.fullName
    ? user.fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : user?.username?.[0]?.toUpperCase() ?? '?'

  const roleName = isAdmin() ? 'Администратор' : 'Куратор'

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-label">СУС</div>
          <div className="logo-sub">Система управления студентами</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Навигация</div>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}

          {isAdmin() && (
            <>
              <div className="divider" style={{ margin: '8px 0' }} />
              <div className="nav-section-label">Администрирование</div>
              <NavLink
                to="/users"
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <IconUsers size={16} />
                Пользователи
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            style={{ marginBottom: 4 }}
          >
            <IconProfile size={16} />
            Профиль
          </NavLink>
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user?.fullName || user?.username}</div>
              <div className="user-role">{roleName}{user?.groupNumber ? ` · ${user.groupNumber}` : ''}</div>
            </div>
            <button
              className="logout-btn"
              onClick={() => { logout(); navigate('/login') }}
              title="Выйти"
            >
              <IconLogout size={15} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
