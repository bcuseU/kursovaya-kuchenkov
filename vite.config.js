import { useState, useEffect } from 'react'
import { getGroups, getCurators, createGroup, updateGroup, deleteGroup } from '../api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import Confirm from '../components/Confirm'
import { IconPlus, IconEdit, IconTrash, IconSearch } from '../components/Icons'

const emptyForm = { groupNumber: '', faculty: '', course: '', curatorId: '' }

export default function GroupsPage() {
  const { isAdmin } = useAuth()
  const [groups, setGroups] = useState([])
  const [curators, setCurators] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([getGroups(), isAdmin() ? getCurators() : Promise.resolve({ data: [] })])
      .then(([gr, cr]) => { setGroups(gr.data); setCurators(cr.data) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const filtered = groups.filter(g =>
    !search || g.groupNumber.toLowerCase().includes(search.toLowerCase()) || g.faculty?.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm(emptyForm); setEditing(null); setError(''); setModal(true)
  }
  const openEdit = (g) => {
    setForm({ groupNumber: g.groupNumber, faculty: g.faculty || '', course: g.course || '', curatorId: g.curatorId || '' })
    setEditing(g); setError(''); setModal(true)
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const dto = { ...form, course: form.course ? Number(form.course) : null, curatorId: form.curatorId ? Number(form.curatorId) : null }
      if (editing) await updateGroup(editing.id, dto)
      else await createGroup(dto)
      setModal(false); load()
    } catch (e) {
      setError(e.response?.data || 'Ошибка сохранения')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await deleteGroup(deleting.id); setDeleting(null); load() }
    catch (e) { alert(e.response?.data || 'Ошибка: группа не пустая') }
    finally { setSaving(false) }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Группы</div>
          <div className="page-subtitle">{groups.length} групп в системе</div>
        </div>
        {isAdmin() && (
          <button className="btn btn-primary" onClick={openAdd}>
            <IconPlus /> Создать группу
          </button>
        )}
      </div>

      <div className="page-body">
        <div className="toolbar">
          <div className="search-wrap">
            <IconSearch size={15} />
            <input className="search-input" placeholder="Поиск по названию или факультету..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 12, color: 'var(--text-muted)' }}>
            <div className="spinner" /> Загрузка...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><h3>Групп нет</h3></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map(g => (
              <div key={g.id} className="card" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                      {g.groupNumber}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{g.faculty}</div>
                  </div>
                  {g.course && <span className="badge badge-blue">Курс {g.course}</span>}
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)' }}>{g.activeStudentCount ?? 0}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Активных</div>
                  </div>
                  <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-muted)' }}>{g.studentCount ?? 0}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Всего</div>
                  </div>
                </div>
                {g.curatorName && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    👤 {g.curatorName}
                  </div>
                )}
                {isAdmin() && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => openEdit(g)}>
                      <IconEdit size={12} /> Изменить
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleting(g)}>
                      <IconTrash size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={editing ? 'Редактировать группу' : 'Новая группа'}
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
            <div className="form-group">
              <label className="form-label">Номер группы *</label>
              <input className="form-input" placeholder="ИТ-21" value={form.groupNumber} onChange={e => setForm({ ...form, groupNumber: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Курс</label>
              <input className="form-input" type="number" min={1} max={6} value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} />
            </div>
            <div className="form-group form-full">
              <label className="form-label">Факультет *</label>
              <input className="form-input" placeholder="Институт информационных технологий" value={form.faculty} onChange={e => setForm({ ...form, faculty: e.target.value })} />
            </div>
            {curators.length > 0 && (
              <div className="form-group form-full">
                <label className="form-label">Куратор</label>
                <select className="form-select" value={form.curatorId} onChange={e => setForm({ ...form, curatorId: e.target.value })}>
                  <option value="">— не назначен —</option>
                  {curators.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                </select>
              </div>
            )}
          </div>
        </Modal>
      )}

      {deleting && (
        <Confirm
          message={`Удалить группу «${deleting.groupNumber}»? Это возможно только если в группе нет студентов.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          loading={saving}
        />
      )}
    </div>
  )
}
