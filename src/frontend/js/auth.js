// auth.js — Login form + session management
const Auth = (() => {
  const TOKEN_KEY = 'comedor_token';
  const USER_KEY  = 'comedor_user';

  let _user  = null;
  let _token = null;
  let _loginAttempts = 0;
  let _blockedUntil  = 0;
  let _pwVisible = false;

  function getToken() { return _token; }
  function getUser()  { return _user;  }
  function isAdmin()  { return _user?.rol === 'admin'; }
  function getLogistica() { return _user?.logistica || 'Principal'; }

  function loadFromStorage() {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t && u) {
      _token = t;
      _user  = JSON.parse(u);
      API.setToken(t);
      return true;
    }
    return false;
  }

  function _save(token, user) {
    _token = token; _user = user;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    API.setToken(token);
  }

  function logout() {
    _token = null; _user = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    API.clearToken();
    document.getElementById('app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('inp-user').value = '';
    document.getElementById('inp-pw').value   = '';
    document.getElementById('login-error').textContent = '';
  }

  async function doLogin() {
    const now = Date.now();
    if (_blockedUntil > now) {
      const s = Math.ceil((_blockedUntil - now) / 1000);
      document.getElementById('login-error').textContent = `⛔ Bloqueado. Espera ${s}s`;
      return;
    }

    const username = document.getElementById('inp-user').value.trim();
    const password = document.getElementById('inp-pw').value;
    if (!username || !password) {
      document.getElementById('login-error').textContent = '⚠ Completa los campos';
      return;
    }

    const btnLogin = document.getElementById('btn-login');
    btnLogin.textContent = 'Iniciando...';
    btnLogin.disabled = true;

    try {
      const data = await API.post('/auth/login', { username, password });
      _save(data.token, data.user);
      document.getElementById('login-error').textContent = '';
      _loginAttempts = 0;
      App.init(data.user);
    } catch (err) {
      _loginAttempts++;
      const msg = err.message || 'Credenciales incorrectas';
      document.getElementById('login-error').textContent = `⚠ ${msg}`;
      document.getElementById('login-card').classList.add('shake');
      setTimeout(() => document.getElementById('login-card').classList.remove('shake'), 600);
      if (err.data?.blocked) {
        _blockedUntil = Date.now() + 30_000;
      }
    } finally {
      btnLogin.textContent = 'INICIAR SESIÓN';
      btnLogin.disabled = false;
    }
  }

  function _setupUI() {
    document.getElementById('btn-login').addEventListener('click', doLogin);
    document.getElementById('inp-pw').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
    document.getElementById('inp-user').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('inp-pw').focus(); });
    document.getElementById('btn-logout').addEventListener('click', logout);

    document.getElementById('btn-eye').addEventListener('click', () => {
      _pwVisible = !_pwVisible;
      document.getElementById('inp-pw').type = _pwVisible ? 'text' : 'password';
      document.getElementById('btn-eye').textContent = _pwVisible ? '🙈' : '👁';
    });
  }

  return { getToken, getUser, isAdmin, getLogistica, loadFromStorage, logout, doLogin, _setupUI };
})();
