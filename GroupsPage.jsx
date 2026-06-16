import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStudents, getGroups, createStudent, updateStudent, deleteStudent } from '../api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import Confirm from '../components/Confirm'
import { IconPlus, IconSearch, IconEdit, IconTrash, IconEye } from '../components/Icons'

const STATUSES = { ACTIVE: 'Активный', ACADEMIC: 'Академотпуск', EXPELLED: 'Отчислен', GRADUATE: 'Выпускник' }
const STATUS_BADGE = { ACTIVE: 'badge-green', ACADEMIC: 'badge-yellow', EXPELLED: 'badge-red', GRADUATE: 'badge-gray' }

const emptyForm = {
  firstName: '', lastName: '', patronymic: '',
  birthDate: '', phoneNumber: '', email: '', address: '',
  recordBookNumber: '', status: 'ACTIVE', note: '', groupId: ''
}

export default function StudentsPage() {
  const { isAdmin } = useAuth()
  const [students, setStudents] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterGroup, setFilterGroup] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([getStudents(), getGroups()])
      .then(([sr, gr]) => { setStudents(sr.data); setGroups(gr.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = students.filter(s => {
    const name = `${s.lastName} ${s.firstName} ${s.patronymic || ''}`.toLowerCase()
    const q = search.toLowerCase()
    if (q && !name.includes(q) && !s.recordBookNumber?.includes(q)) return false
    if (filterGroup && String(s.groupId) !== filterGroup) return false
    if (filterStatus && s.status !== filterStatus) return false
    return true
  })

  const openAdd = () => {
    setForm(emptyForm)
    setEditing(null)
    setError('')
    setModal('form')
  }
  const openEdit = (s) => {
    setForm({
      firstName: s.firstName || '', lastName: s.lastName || '',
      patronymic: s.patronymic || '', birthDate: s.birthDate || '',
      phoneNumber: s.phoneNumber || '', email: s.email || '',
      address: s.address || '', recordBookNumber: s.recordBookNumber || '',
      status: s.status || 'ACTIVE', note: s.note || '',
      groupId: s.groupId ? String(s.groupId) : ''
    })
    setEditing(s)
    setError('')
    setModal('form')
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const dto = { ...form, groupId: form.groupId ? Number(form.groupId) : null }
      if (!dto.birthDate) delete dto.birthDate
      if (editing) await updateStudent(editing.id, dto)
      else await createStudent(dto)
      setModal(null)
      load()
    } catch (e) {
      setError(e.response?.data || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await deleteStudent(deleting.id)
      setDeleting(null)
      load()
    } catch (e) {
      alert(e.response?.data || 'Ошибка удаления')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Студенты</div>
          <div className="page-subtitle">{students.length} записей в системе</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <IconPlus /> Добавить студента
        </button>
      </div>

      <div className="page-body">
        <div className="toolbar">
          <div className="search-wrap">
            <IconSearch size={15} />
            <input className="search-input" placeholder="Поиск по ФИО или зачётке..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ minWidth: 160 }} value={filterGroup}
            onChange={e => setFilterGroup(e.target.value)}>
            <option value="">Все группы</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.groupNumber}</option>)}
          </select>
          <select className="form-select" style={{ minWidth: 150 }} value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Все статусы</option>
            {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, gap: 12, color: 'var(--text-muted)' }}>
              <div className="spinner" /> Загрузка...
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>Студентов нет</h3>
              <p>Измените фильтры или добавьте первого студента</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ФИО</th>
                    <th>Группа</th>
                    <th>Зач. книжка</th>
                    <th>Email / Телефон</th>
                    <th>Статус</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id}>
                      <td>
                        <Link to={`/students/${s.id}`} style={{ color: 'var(--accent)', fontWeight: 500 }}>
                          {s.lastName} {s.firstName} {s.patronymic || ''}
                        </Link>
                      </td>
                      <td><span className="tag">{s.groupNumber || '—'}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.recordBookNumber}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {s.email && <div>{s.email}</div>}
                        {s.phoneNumber && <div>{s.phoneNumber}</div>}
                      </td>
                      <td>
                        <span className={`badge ${STATUS_BADGE[s.status] || 'badge-gray'}`}>
                          {STATUSES[s.status] || s.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <Link to={`/students/${s.id}`} className="btn-icon btn" title="Просмотр">
                            <IconEye size={13} />
                          </Link>
                          <button className="btn-icon btn" onClick={() => openEdit(s)} title="Редактировать">
                            <IconEdit size={13} />
                          </button>
                          <button className="btn-icon btn" style={{ color: 'var(--red)' }}
                            onClick={() => setDeleting(s)} title="Удалить">
                            <IconTrash size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal === 'form' && (
        <Modal
          title={editing ? 'Редактировать студента' : 'Новый студент'}
          onClose={() => setModal(null)}
          size="lg"
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Отмена</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </>
          }
        >
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Фамилия *</label>
              <input className="form-input" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Имя *</label>
              <input className="form-input" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Отчество</label>
              <input className="form-input" value={form.patronymic} onChange={e => setForm({ ...form, patronymic: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Дата рождения</label>
              <input className="form-input" type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Зач. книжка *</label>
              <input className="form-input" value={form.recordBookNumber} onChange={e => setForm({ ...form, recordBookNumber: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Статус</label>
              <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Телефон</label>
              <input className="form-input" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
            </div>
            <div className="form-group form-full">
              <label className="form-label">Адрес</label>
              <input className="form-input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            {isAdmin() && (
              <div className="form-group">
                <label className="form-label">Группа</label>
                <select className="form-select" value={form.groupId} onChange={e => setForm({ ...form, groupId: e.target.value })}>
                  <option value="">— без группы —</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.groupNumber} ({g.faculty})</option>)}
                </select>
              </div>
            )}
            <div className="form-group form-full">
              <label className="form-label">Заметка куратора</label>
              <textarea className="form-textarea" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}

      {deleting && (
        <Confirm
          message={`Удалить студента «${deleting.lastName} ${deleting.firstName}»? Это действие нельзя отменить.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          loading={saving}
        />
      )}
    </div>
  )
}
