import { useState, useEffect } from 'react'
import { getSubjects, getGroups, createSubject, updateSubject, deleteSubject } from '../api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import Confirm from '../components/Confirm'
import { IconPlus, IconEdit, IconTrash, IconSearch } from '../components/Icons'

const emptyForm = { name: '', semester: '1', type: 'EXAM', groupId: '' }

export default function SubjectsPage() {
  const { isAdmin, user } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterSem, setFilterSem] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([getSubjects(), getGroups()])
      .then(([sr, gr]) => { setSubjects(sr.data); setGroups(gr.data) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const filtered = subjects.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterSem && String(s.semester) !== filterSem) return false
    return true
  })

  const groupMap = Object.fromEntries(groups.map(g => [g.id, g]))

  const openAdd = () => {
    setForm({ ...emptyForm, groupId: isAdmin() ? '' : String(user?.groupId || '') })
    setEditing(null); setError(''); setModal(true)
  }
  const openEdit = (s) => {
    setForm({ name: s.name, semester: String(s.semester), type: s.type, groupId: s.groupId ? String(s.groupId) : '' })
    setEditing(s); setError(''); setModal(true)
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const dto = { ...form, semester: Number(form.semester), groupId: form.groupId ? Number(form.groupId) : null }
      if (editing) await updateSubject(editing.id, dto)
      else await createSubject(dto)
      setModal(false); load()
    } catch (e) {
      setError(e.response?.data || 'Ошибка сохранения')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await deleteSubject(deleting.id); setDeleting(null); load() }
    catch { alert('Ошибка удаления') }
    finally { setSaving(false) }
  }

  const semesters = [...new Set(subjects.map(s => s.semester))].sort((a, b) => a - b)

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Предметы</div>
          <div className="page-subtitle">{subjects.length} предметов</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <IconPlus /> Добавить предмет
        </button>
      </div>

      <div className="page-body">
        <div className="toolbar">
          <div className="search-wrap">
            <IconSearch size={15} />
            <input className="search-input" placeholder="Поиск по названию..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ minWidth: 140 }} value={filterSem} onChange={e => setFilterSem(e.target.value)}>
            <option value="">Все семестры</option>
            {semesters.map(s => <option key={s} value={s}>{s} семестр</option>)}
          </select>
        </div>

        <div className="card" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, gap: 12, color: 'var(--text-muted)' }}>
              <div className="spinner" /> Загрузка...
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><h3>Предметов нет</h3></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Семестр</th>
                    <th>Тип</th>
                    <th>Группа</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 500 }}>{s.name}</td>
                      <td><span className="badge badge-blue">{s.semester} сем.</span></td>
                      <td>
                        <span className={`badge ${s.type === 'EXAM' ? 'badge-yellow' : 'badge-green'}`}>
                          {s.type === 'EXAM' ? 'Экзамен' : 'Зачёт'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {s.groupId ? (groupMap[s.groupId]?.groupNumber || `#${s.groupId}`) : '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button className="btn-icon btn" onClick={() => openEdit(s)}><IconEdit size={13} /></button>
                          <button className="btn-icon btn" style={{ color: 'var(--red)' }} onClick={() => setDeleting(s)}><IconTrash size={13} /></button>
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

      {modal && (
        <Modal
          title={editing ? 'Редактировать предмет' : 'Новый предмет'}
          onClose={() => setModal(false)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Отмена</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </>
          }
        >
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-grid">
            <div className="form-group form-full">
              <label className="form-label">Название предмета *</label>
              <input className="form-input" placeholder="Математический анализ" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Семестр *</label>
              <select className="form-select" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s} семестр</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Тип контроля *</label>
              <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="EXAM">Экзамен</option>
                <option value="PASS">Зачёт</option>
              </select>
            </div>
            <div className="form-group form-full">
              <label className="form-label">Группа</label>
              <select className="form-select" value={form.groupId} onChange={e => setForm({ ...form, groupId: e.target.value })}>
                <option value="">— глобальный —</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.groupNumber} ({g.faculty})</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {deleting && (
        <Confirm
          message={`Удалить предмет «${deleting.name}»? Все связанные оценки будут удалены.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          loading={saving}
        />
      )}
    </div>
  )
}
