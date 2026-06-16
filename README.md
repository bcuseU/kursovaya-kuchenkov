import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getStudentById, getGrades, getAttendance, getSubjects } from '../api'

const STATUSES = { ACTIVE: 'Активный', ACADEMIC: 'Академотпуск', EXPELLED: 'Отчислен', GRADUATE: 'Выпускник' }
const STATUS_BADGE = { ACTIVE: 'badge-green', ACADEMIC: 'badge-yellow', EXPELLED: 'badge-red', GRADUATE: 'badge-gray' }
const GRADE_CLASS = { '5': 'grade-5', '4': 'grade-4', '3': 'grade-3', '2': 'grade-2', 'зачёт': 'grade-pass', 'незачёт': 'grade-fail' }

export default function StudentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [subjects, setSubjects] = useState([])
  const [tab, setTab] = useState('info')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getStudentById(id),
      getGrades(),
      getAttendance(),
      getSubjects()
    ]).then(([sr, gr, ar, subr]) => {
      setStudent(sr.data)
      setGrades(gr.data.filter(g => g.studentId === Number(id)))
      setAttendance(ar.data.filter(a => a.studentId === Number(id)))
      setSubjects(subr.data)
    }).catch(() => navigate('/students'))
    .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12, color: 'var(--text-muted)' }}>
      <div className="spinner" /> Загрузка...
    </div>
  )
  if (!student) return null

  const subjectMap = Object.fromEntries(subjects.map(s => [s.id, s]))

  const attStats = {
    present: attendance.filter(a => a.status === 'PRESENT').length,
    absent: attendance.filter(a => a.status === 'ABSENT').length,
    excuse: attendance.filter(a => a.status === 'EXCUSE').length,
  }
  const total = attStats.present + attStats.absent + attStats.excuse
  const pct = total > 0 ? Math.round((attStats.present / total) * 100) : null

  const recentAtt = [...attendance].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20)

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
            <Link to="/students" style={{ color: 'var(--accent)' }}>Студенты</Link> / {student.lastName} {student.firstName}
          </div>
          <div className="page-title">{student.lastName} {student.firstName} {student.patronymic || ''}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
            <span className="tag">{student.groupNumber || 'Без группы'}</span>
            <span className={`badge ${STATUS_BADGE[student.status] || 'badge-gray'}`}>
              {STATUSES[student.status] || student.status}
            </span>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="tabs">
          <button className={`tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>Информация</button>
          <button className={`tab ${tab === 'grades' ? 'active' : ''}`} onClick={() => setTab('grades')}>Оценки ({grades.length})</button>
          <button className={`tab ${tab === 'attendance' ? 'active' : ''}`} onClick={() => setTab('attendance')}>Посещаемость ({attendance.length})</button>
        </div>

        {tab === 'info' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>Личные данные</div>
              {[
                ['Зач. книжка', student.recordBookNumber],
                ['Email', student.email],
                ['Телефон', student.phoneNumber],
                ['Адрес', student.address],
                ['Дата рождения', student.birthDate],
              ].map(([label, val]) => val ? (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', gap: 12 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: '0.85rem', textAlign: 'right' }}>{val}</span>
                </div>
              ) : null)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {pct !== null && (
                <div className="card">
                  <div className="section-title" style={{ marginBottom: 12 }}>Посещаемость</div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: pct >= 75 ? 'var(--green)' : 'var(--red)' }}>{pct}%</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Явка</div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                      <div><span className="badge badge-green">{attStats.present} Присут.</span></div>
                      <div><span className="badge badge-red">{attStats.absent} Отсут.</span></div>
                      <div><span className="badge badge-yellow">{attStats.excuse} Уважит.</span></div>
                    </div>
                  </div>
                </div>
              )}
              {student.note && (
                <div className="card">
                  <div className="section-title" style={{ marginBottom: 8 }}>Заметка куратора</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{student.note}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'grades' && (
          <div className="card" style={{ padding: 0 }}>
            {grades.length === 0 ? (
              <div className="empty-state"><h3>Оценок нет</h3><p>Оценки появятся после их выставления</p></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Предмет</th>
                      <th>Семестр</th>
                      <th>Тип</th>
                      <th>Оценка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g, i) => {
                      const subj = subjectMap[g.subjectId]
                      return (
                        <tr key={i}>
                          <td>{subj?.name || `Предмет #${g.subjectId}`}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{subj?.semester || '—'}</td>
                          <td><span className="tag">{subj?.type === 'EXAM' ? 'Экзамен' : 'Зачёт'}</span></td>
                          <td>
                            <span className={`badge ${GRADE_CLASS[g.value] || 'badge-gray'}`}>
                              {g.value}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'attendance' && (
          <div className="card" style={{ padding: 0 }}>
            {recentAtt.length === 0 ? (
              <div className="empty-state"><h3>Записей нет</h3></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Дата</th><th>Статус</th><th>Примечание</th></tr>
                  </thead>
                  <tbody>
                    {recentAtt.map((a, i) => (
                      <tr key={i}>
                        <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{a.date}</td>
                        <td>
                          <span className={`badge ${a.status === 'PRESENT' ? 'badge-green' : a.status === 'ABSENT' ? 'badge-red' : 'badge-yellow'}`}>
                            {a.status === 'PRESENT' ? 'Присутствовал' : a.status === 'ABSENT' ? 'Отсутствовал' : 'Уваж. причина'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{a.note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
