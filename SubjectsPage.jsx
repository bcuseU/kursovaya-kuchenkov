:root {
  --bg: #0e0f13;
  --bg-card: #16181f;
  --bg-hover: #1e2029;
  --border: #262933;
  --border-light: #2e3140;
  --accent: #4f8aff;
  --accent-dim: rgba(79, 138, 255, 0.12);
  --accent-glow: rgba(79, 138, 255, 0.3);
  --green: #3ecf8e;
  --green-dim: rgba(62, 207, 142, 0.12);
  --red: #f16063;
  --red-dim: rgba(241, 96, 99, 0.12);
  --yellow: #f4c542;
  --yellow-dim: rgba(244, 197, 66, 0.12);
  --text: #e8eaf0;
  --text-muted: #7c829a;
  --text-dim: #4a4f61;
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --radius: 10px;
  --radius-lg: 16px;
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
  --transition: 0.18s ease;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { font-size: 15px; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: inherit; }
input, select, textarea { font-family: inherit; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-dim); }

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.fade-in {
  animation: fadeIn 0.3s ease forwards;
}

/* Layout */
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 100;
}

.sidebar-logo {
  padding: 28px 24px 20px;
  border-bottom: 1px solid var(--border);
}
.sidebar-logo .logo-label {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
}
.sidebar-logo .logo-sub {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 2px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-section-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  padding: 10px 12px 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius);
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  transition: var(--transition);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}
.nav-item svg { opacity: 0.7; flex-shrink: 0; }
.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text);
}
.nav-item:hover svg { opacity: 1; }
.nav-item.active {
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid rgba(79,138,255,0.2);
}
.nav-item.active svg { opacity: 1; }

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid var(--border);
}
.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius);
}
.user-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--accent-dim);
  border: 1px solid rgba(79,138,255,0.3);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent);
  flex-shrink: 0;
}
.user-info { flex: 1; min-width: 0; }
.user-name { font-size: 0.8rem; font-weight: 600; truncate; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 0.68rem; color: var(--text-muted); }
.logout-btn {
  background: none; border: none;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 6px;
  transition: var(--transition);
}
.logout-btn:hover { color: var(--red); background: var(--red-dim); }

.main-content {
  margin-left: 240px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-header {
  padding: 32px 36px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text);
  line-height: 1.1;
}
.page-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.page-body {
  padding: 24px 36px 40px;
  flex: 1;
}

/* Cards */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: var(--transition);
}
.stat-card:hover { border-color: var(--border-light); }
.stat-card::before {
  content: '';
  position: absolute; top: 0; right: 0;
  width: 80px; height: 80px;
  border-radius: 50%;
  transform: translate(20px, -20px);
  opacity: 0.08;
}
.stat-card.blue::before { background: var(--accent); }
.stat-card.green::before { background: var(--green); }
.stat-card.red::before { background: var(--red); }
.stat-card.yellow::before { background: var(--yellow); }

.stat-value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 6px;
}
.stat-card.blue .stat-value { color: var(--accent); }
.stat-card.green .stat-value { color: var(--green); }
.stat-card.red .stat-value { color: var(--red); }
.stat-card.yellow .stat-value { color: var(--yellow); }

.stat-label { font-size: 0.78rem; color: var(--text-muted); font-weight: 500; }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: var(--radius);
  font-size: 0.825rem;
  font-weight: 600;
  border: 1px solid transparent;
  transition: var(--transition);
  white-space: nowrap;
}
.btn-primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.btn-primary:hover { background: #6699ff; box-shadow: 0 0 20px var(--accent-glow); }
.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border-color: var(--border);
}
.btn-ghost:hover { background: var(--bg-hover); color: var(--text); border-color: var(--border-light); }
.btn-danger {
  background: transparent;
  color: var(--red);
  border-color: var(--red-dim);
}
.btn-danger:hover { background: var(--red-dim); border-color: var(--red); }
.btn-success {
  background: var(--green);
  color: #0e1a14;
  border-color: var(--green);
}
.btn-success:hover { background: #5ad9a8; }
.btn-sm { padding: 5px 11px; font-size: 0.775rem; }
.btn-icon {
  padding: 7px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  border-radius: var(--radius);
}
.btn-icon:hover { background: var(--bg-hover); color: var(--text); }

/* Table */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
thead th {
  padding: 10px 14px;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
tbody tr {
  border-bottom: 1px solid var(--border);
  transition: var(--transition);
}
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: var(--bg-hover); }
tbody td {
  padding: 12px 14px;
  font-size: 0.85rem;
  color: var(--text);
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}
.badge-green { background: var(--green-dim); color: var(--green); }
.badge-red   { background: var(--red-dim);   color: var(--red); }
.badge-blue  { background: var(--accent-dim); color: var(--accent); }
.badge-yellow { background: var(--yellow-dim); color: var(--yellow); }
.badge-gray  { background: rgba(124,130,154,0.1); color: var(--text-muted); }

/* Forms */
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 0.78rem; font-weight: 600; color: var(--text-muted); }
.form-input, .form-select, .form-textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 9px 13px;
  color: var(--text);
  font-size: 0.875rem;
  transition: var(--transition);
  outline: none;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}
.form-select { appearance: none; cursor: pointer; }
.form-textarea { resize: vertical; min-height: 80px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.form-full { grid-column: 1 / -1; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.15s ease;
}
.modal {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow);
}
.modal-lg { max-width: 720px; }
.modal-header {
  padding: 24px 28px 0;
  display: flex; align-items: center; justify-content: space-between;
}
.modal-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.modal-close {
  background: none; border: none;
  color: var(--text-muted);
  font-size: 1.3rem;
  padding: 4px 8px;
  border-radius: 6px;
  line-height: 1;
}
.modal-close:hover { background: var(--bg-hover); color: var(--text); }
.modal-body { padding: 20px 28px; display: flex; flex-direction: column; gap: 16px; }
.modal-footer {
  padding: 0 28px 24px;
  display: flex; justify-content: flex-end; gap: 10px;
}

/* Search & Filter bar */
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.search-wrap {
  position: relative;
  flex: 1;
  min-width: 220px;
  max-width: 380px;
}
.search-wrap svg {
  position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
  color: var(--text-muted); pointer-events: none;
}
.search-input {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 12px 8px 36px;
  color: var(--text);
  font-size: 0.85rem;
  outline: none;
  width: 100%;
  transition: var(--transition);
}
.search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.search-input::placeholder { color: var(--text-dim); }

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
}
.empty-state svg { opacity: 0.3; margin-bottom: 16px; }
.empty-state h3 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; }
.empty-state p { font-size: 0.82rem; color: var(--text-dim); }

/* Spinner */
.spinner {
  width: 20px; height: 20px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}
.loading-screen {
  display: flex; align-items: center; justify-content: center;
  min-height: 100vh; gap: 12px; color: var(--text-muted);
  font-size: 0.85rem;
}

/* Alert / toast */
.alert {
  padding: 12px 16px;
  border-radius: var(--radius);
  font-size: 0.82rem;
  border: 1px solid transparent;
}
.alert-error { background: var(--red-dim); border-color: rgba(241,96,99,0.2); color: var(--red); }
.alert-success { background: var(--green-dim); border-color: rgba(62,207,142,0.2); color: var(--green); }
.alert-info { background: var(--accent-dim); border-color: rgba(79,138,255,0.2); color: var(--accent); }

/* Tag */
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: var(--bg-hover);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.72rem;
  color: var(--text-muted);
}

/* Divider */
.divider { height: 1px; background: var(--border); margin: 4px 0; }

/* Attendance grid */
.attendance-grid {
  display: grid;
  gap: 1px;
}
.att-cell {
  width: 28px; height: 28px;
  border-radius: 5px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: var(--transition);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.6rem; font-weight: 700;
}
.att-cell:hover { transform: scale(1.15); z-index: 1; }
.att-present { background: var(--green-dim); border-color: rgba(62,207,142,0.3); color: var(--green); }
.att-absent  { background: var(--red-dim);   border-color: rgba(241,96,99,0.3);  color: var(--red); }
.att-excuse  { background: var(--yellow-dim);border-color: rgba(244,197,66,0.3); color: var(--yellow); }
.att-empty   { background: transparent; }

/* Grade badge */
.grade-5 { background: var(--green-dim); color: var(--green); border: 1px solid rgba(62,207,142,0.3); }
.grade-4 { background: var(--accent-dim); color: var(--accent); border: 1px solid rgba(79,138,255,0.3); }
.grade-3 { background: var(--yellow-dim); color: var(--yellow); border: 1px solid rgba(244,197,66,0.3); }
.grade-2 { background: var(--red-dim); color: var(--red); border: 1px solid rgba(241,96,99,0.3); }
.grade-pass { background: var(--green-dim); color: var(--green); border: 1px solid rgba(62,207,142,0.3); }
.grade-fail { background: var(--red-dim); color: var(--red); border: 1px solid rgba(241,96,99,0.3); }

/* Login page */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}
.login-page::before {
  content: '';
  position: absolute;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(79,138,255,0.08) 0%, transparent 70%);
  top: -100px; left: -100px;
  pointer-events: none;
}
.login-page::after {
  content: '';
  position: absolute;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(62,207,142,0.05) 0%, transparent 70%);
  bottom: -50px; right: -50px;
  pointer-events: none;
}
.login-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  box-shadow: var(--shadow);
  animation: fadeIn 0.4s ease;
}
.login-logo {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 4px;
}
.login-tagline {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 36px;
  letter-spacing: 0.04em;
}
.login-form { display: flex; flex-direction: column; gap: 16px; }
.login-submit {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  font-family: var(--font-display);
  letter-spacing: 0.02em;
  transition: var(--transition);
  margin-top: 8px;
}
.login-submit:hover { background: #6699ff; box-shadow: 0 4px 20px var(--accent-glow); transform: translateY(-1px); }
.login-submit:active { transform: translateY(0); }
.login-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* Tabs */
.tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
.tab {
  padding: 8px 18px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: var(--transition);
}
.tab:hover { color: var(--text); }
.tab.active { color: var(--accent); border-bottom-color: var(--accent); }

/* Section header */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}
.section-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar { width: 100%; height: auto; position: relative; flex-direction: row; }
  .main-content { margin-left: 0; }
  .form-grid { grid-template-columns: 1fr; }
  .page-body { padding: 16px 20px 32px; }
  .page-header { padding: 20px 20px 0; }
}
