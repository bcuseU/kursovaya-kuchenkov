import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getStudents, getGroups, getSubjects, getAttendance } from '../api'
import { IconChevronRight } from '../components/Icons'

const STATUSES = { ACTIVE: 'Активный', ACADEMIC: 'Академотпуск', EXPELLED: 'Отчислен', GRADUATE: 'Выпускник' }

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentStudents, setRecentStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getStudents(), getGroups(), getSubjects()])
      .then(([studRes, grpRes, subRes]) => {
        const students = studRes.data
        const groups = grpRes.data
        const subjects = subRes.data
        const active = students.filter(s => s.status === 'ACTIVE').length
        setStats({
          total: students.length,
          active,
          groups: groups.length,
          subjects: subjects.length,
        })
        setRecentStudents(students.slice(0, 6))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Доброе утро'
    if (h < 18) return 'Добрый день'
    return 'Добрый вечер'
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 12, color: 'var(--text-muted)' }}>
      <div className="spinner" /> Загрузка...
    </div>
  )

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">{greeting()}, {user?.fullName?.split(' ')[0] || user?.username} 👋</div>
          <div className="page-subtitle">
            {isAdmin() ? 'Панель администратора' : `Куратор группы ${user?.groupNumber || '—'}`}
          </div>
        </div>
      </div>

      <div className="page-body">
        {stats && (
          <div className="stat-grid" style={{ marginBottom: 32 }}>
            <Link to="/students" style={{ textDecoration: 'none' }}>
              <div className="stat-card blue" style={{ cursor: 'pointer' }}>
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Всего студентов</div>
              </div>
            </Link>
            <Link to="/students" style={{ textDecoration: 'none' }}>
              <div className="stat-card green" style={{ cursor: 'pointer' }}>
                <div className="stat-value">{stats.active}</div>
                <div className="stat-label">Активных</div>
              </div>
            </Link>
            <Link to="/groups" style={{ textDecoration: 'none' }}>
              <div className="stat-card yellow" style={{ cursor: 'pointer' }}>
                <div className="stat-value">{stats.groups}</div>
                <div className="stat-label">{isAdmin() ? 'Групп' : 'Ваша группа'}</div>
              </div>
            </Link>
            <Link to="/subjects" style={{ textDecoration: 'none' }}>
              <div className="stat-card red" style={{ cursor: 'pointer' }}>
                <div className="stat-value">{stats.subjects}</div>
                <div className="stat-label">Предметов</div>
              </div>
            </Link>
          </div>
        )}

        <div className="card">
          <div className="section-header">
            <div className="section-title">Студенты</div>
            <Link to="/students" className="btn btn-ghost btn-sm">
              Все студенты <IconChevronRight size={13} />
            </Link>
          </div>
          {recentStudents.length === 0 ? (
            <div className="empty-state">
              <p>Нет студентов</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ФИО</th>
                    <th>Группа</th>
                    <th>Зач. книжка</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map(s => (
                    <tr key={s.id}>
                      <td>
                        <Link to={`/students/${s.id}`} style={{ color: 'var(--accent)', fontWeight: 500 }}>
                          {s.lastName} {s.firstName} {s.patronymic || ''}
                        </Link>
                      </td>
                      <td><span className="tag">{s.groupNumber || '—'}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.recordBookNumber}</td>
                      <td>
                        <span className={`badge ${s.status === 'ACTIVE' ? 'badge-green' : s.status === 'EXPELLED' ? 'badge-red' : s.status === 'ACADEMIC' ? 'badge-yellow' : 'badge-gray'}`}>
                          {STATUSES[s.status] || s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Link to="/grades" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div className="section-title" style={{ marginBottom: 8 }}>📊 Успеваемость</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Просмотр и выставление оценок по предметам</div>
            </div>
          </Link>
          <Link to="/attendance" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div className="section-title" style={{ marginBottom: 8 }}>📅 Посещаемость</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Журнал посещаемости студентов по датам</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
