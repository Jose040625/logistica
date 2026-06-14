// app.js — Main orchestrator: router, state, clock, polling
const App = (() => {
  let _currentView = null;
  let _logistica   = 'Principal';
  let _pollTimer   = null;
  const POLL_MS    = 30_000; // check criticos every 30s

  // ── Helpers ──────────────────────────────────────────────────────
  function getLogistica() { return _logistica; }

  function toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(() => el.remove(), 4200);
  }
  window.toast = toast; // make global

  function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
  }
  function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
  }
  window.openModal  = openModal;
  window.closeModal = closeModal;

  // Close modal on overlay click or [data-close] button
  document.addEventListener('click', e => {
    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) { closeModal(closeBtn.dataset.close); return; }
    const overlay = e.target.closest('.modal-overlay');
    if (overlay && e.target === overlay) {
      overlay.classList.add('hidden');
    }
  });

  // ── Clock ────────────────────────────────────────────────────────
  function _startClock() {
    const el = document.getElementById('sb-clock');
    const tick = () => {
      const now = new Date();
      el.textContent = `🕐 ${now.toLocaleTimeString('es-ES')}  ·  ${now.toLocaleDateString('es-ES')}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  // ── Navigation ───────────────────────────────────────────────────
  function navigate(view) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    // Show target
    const el = document.getElementById(`view-${view}`);
    if (el) el.classList.remove('hidden');

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    _currentView = view;

    // Load data for view
    switch (view) {
      case 'dashboard':  Dashboard.load();      break;
      case 'inventory':  Inventory.load();
                         Inventory.populateCategoryFilter(); break;
      case 'history':    History.load();        break;
      case 'users':      Users.load();          break;
      case 'suppliers':  Suppliers.load();      break;
      case 'categories': Categories.load();     break;
      case 'logistics':  Logistics.load();      break;
      case 'telegram':   TelegramConfig.load(); break;
      case 'branding':   Branding.load();       break;
    }
  }

  // ── Sidebar nav ──────────────────────────────────────────────────
  function _setupNav() {
    document.getElementById('sidebar-nav').addEventListener('click', e => {
      const btn = e.target.closest('[data-view]');
      if (btn) navigate(btn.dataset.view);
    });
  }

  // ── Logistica selector ───────────────────────────────────────────
  function refreshLogisticaSelector(rows) {
    const sel = document.getElementById('sb-logistica');
    const opts = rows.filter(l => l.nombre !== 'Todas');
    sel.innerHTML = opts.map(l => `<option value="${l.nombre}">${l.nombre}</option>`).join('');
    if (Auth.getUser()?.rol === 'admin') {
      sel.innerHTML += '<option value="Todas">Todas</option>';
    }
    sel.value = _logistica;
  }

  async function _initLogisticaSelector() {
    const user = Auth.getUser();
    const wrap = document.getElementById('sb-logistica-wrap');
    const sel  = document.getElementById('sb-logistica');

    if (user.logistica === 'Todas' || user.rol === 'admin') {
      wrap.style.display = 'block';
      const logs = await API.get('/logistics').catch(() => []);
      refreshLogisticaSelector(logs);
      sel.value = _logistica;
      sel.addEventListener('change', e => {
        _logistica = e.target.value;
        if (_currentView) navigate(_currentView);
      });
    } else {
      wrap.style.display = 'none';
      _logistica = user.logistica;
    }
  }

  // ── Admin-only elements ──────────────────────────────────────────
  function _applyRoleVisibility() {
    const isAdmin = Auth.isAdmin();
    document.querySelectorAll('.admin-only').forEach(el => {
      el.style.display = isAdmin ? '' : 'none';
    });
  }

  // ── Polling for critical stock ───────────────────────────────────
  function _startPolling() {
    clearInterval(_pollTimer);
    _pollTimer = setInterval(async () => {
      try {
        const qs = _logistica && _logistica !== 'Todas' ? `?logistica=${encodeURIComponent(_logistica)}` : '';
        const criticos = await API.get(`/inventory/criticos${qs}`);
        const badge = document.getElementById('sb-critical');
        if (criticos.length > 0) {
          badge.textContent = `🚨 ${criticos.length} crítico${criticos.length > 1 ? 's' : ''}`;
          if (!Alarm.isRunning()) showAlarmModal(criticos);
        } else {
          badge.textContent = '';
          if (Alarm.isRunning()) hideAlarmModal();
        }
      } catch { /* ignore */ }
    }, POLL_MS);
  }

  // ── Quick entry shortcut (from alarm modal) ──────────────────────
  function quickEntry(id, nombre) {
    navigate('inventory');
    setTimeout(() => Inventory.quickMove(id, nombre, 'entrada'), 200);
  }

  // ── Load branding ────────────────────────────────────────────────
  async function _loadBranding() {
    try {
      const cfg = await API.get('/config');
      const logo = cfg.app_logo || '🍽';
      const name = cfg.app_name || 'COMEDOR';
      document.getElementById('sb-logo').textContent      = logo;
      document.getElementById('sb-name').textContent      = name;
      document.getElementById('login-logo').textContent   = logo;
      document.getElementById('login-title').textContent  = name;
      document.title = `${name} · Gestión de Inventario v4.0`;
    } catch {}
  }

  // ── Init ─────────────────────────────────────────────────────────
  async function init(user) {
    // Show app, hide login
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display         = 'flex';

    // Fill sidebar user info
    const icon = user.rol === 'admin' ? '👑' : '👤';
    document.getElementById('sb-username').textContent = `${icon} ${user.username}`;
    document.getElementById('sb-role').textContent     = user.rol.charAt(0).toUpperCase() + user.rol.slice(1);

    _logistica = user.logistica === 'Todas' ? 'Principal' : user.logistica;

    _applyRoleVisibility();
    await _initLogisticaSelector();
    await _loadBranding();
    _startClock();
    _startPolling();
    navigate('dashboard');
  }

  // ── Bootstrap ────────────────────────────────────────────────────
  function boot() {
    // Setup UI handlers for all modules
    Auth._setupUI();
    Inventory._setupUI();
    History._setupUI();
    Users._setupUI();
    Suppliers._setupUI();
    Categories._setupUI();
    Logistics._setupUI();
    TelegramConfig._setupUI();
    Branding._setupUI();
    _setupNav();

    // Try auto-login from stored token
    if (Auth.loadFromStorage()) {
      init(Auth.getUser());
    }
    // Otherwise login screen is already visible
  }

  return { init, navigate, getLogistica, refreshLogisticaSelector, quickEntry, boot };
})();

// ── Boot on DOM ready ─────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.boot());
} else {
  App.boot();
}
