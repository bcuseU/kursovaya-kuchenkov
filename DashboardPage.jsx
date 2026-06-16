import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('sus_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sus_token')
      localStorage.removeItem('sus_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authLogin = (username, password) =>
  api.post('/auth/login', { username, password })
export const authMe = () => api.get('/auth/me')
export const authChangePassword = (currentPassword, newPassword) =>
  api.put('/auth/password', { currentPassword, newPassword })

// Students
export const getStudents = () => api.get('/students')
export const getStudentById = (id) => api.get(`/students/${id}`)
export const getStudentsByGroup = (groupId) => api.get(`/students/group/${groupId}`)
export const createStudent = (dto) => api.post('/students', dto)
export const updateStudent = (id, dto) => api.put(`/students/${id}`, dto)
export const deleteStudent = (id) => api.delete(`/students/${id}`)

// Groups
export const getGroups = () => api.get('/groups')
export const getGroupById = (id) => api.get(`/groups/${id}`)
export const createGroup = (dto) => api.post('/groups', dto)
export const updateGroup = (id, dto) => api.put(`/groups/${id}`, dto)
export const deleteGroup = (id) => api.delete(`/groups/${id}`)

// Subjects
export const getSubjects = (semester, groupId) => {
  const params = {}
  if (semester !== undefined && semester !== null) params.semester = semester
  if (groupId !== undefined && groupId !== null) params.groupId = groupId
  return api.get('/subjects', { params })
}
export const createSubject = (dto) => api.post('/subjects', dto)
export const updateSubject = (id, dto) => api.put(`/subjects/${id}`, dto)
export const deleteSubject = (id) => api.delete(`/subjects/${id}`)

// Grades
export const getGrades = (semester) => {
  const params = semester ? { semester } : {}
  return api.get('/grades', { params })
}
export const upsertGrade = (dto) => api.put('/grades', dto)
export const deleteGrade = (studentId, subjectId) =>
  api.delete('/grades', { params: { studentId, subjectId } })

// Attendance
export const getAttendance = (month) => {
  const params = month ? { month } : {}
  return api.get('/attendance', { params })
}
export const upsertAttendance = (dto) => api.put('/attendance', dto)
export const deleteAttendance = (studentId, date) =>
  api.delete('/attendance', { params: { studentId, date } })

// Users
export const getUsers = () => api.get('/users')
export const getCurators = () => api.get('/users/curators')
export const createUser = (dto) => api.post('/users', dto)
export const updateUser = (id, dto) => api.put(`/users/${id}`, dto)
export const deleteUser = (id) => api.delete(`/users/${id}`)

export default api
