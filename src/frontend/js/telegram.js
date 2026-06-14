// telegram.js — Telegram config page
const TelegramConfig = (() => {
  async function load() {
    try {
      const cfg = await API.get('/config/telegram');
      document.getElementById('tg-token').value   = cfg.token   || '';
      document.getElementById('tg-chat').value    = cfg.chat_id || '';
      document.getElementById('tg-enabled').checked = !!cfg.enabled;
      _updateStatus(!!cfg.enabled);
    } catch { /* ignore */ }
  }

  function _updateStatus(enabled) {
    const bar  = document.getElementById('tg-status-bar');
    const text = document.getElementById('tg-status-text');
    if (enabled) {
      bar.className  = 'tg-status ok';
      text.textContent = 'Telegram habilitado — notificaciones activas';
    } else {
      bar.className  = 'tg-status disabled';
      text.textContent = 'Telegram deshabilitado';
    }
  }

  async function save() {
    const token   = document.getElementById('tg-token').value.trim();
    const chat_id = document.getElementById('tg-chat').value.trim();
    const enabled = document.getElementById('tg-enabled').checked;
    try {
      await API.put('/config', { telegram_token: token, telegram_chat_id: chat_id, telegram_enabled: enabled });
      toast('✅ Configuración Telegram guardada', 'success');
      _updateStatus(enabled);
    } catch (e) { toast(`❌ ${e.message}`, 'danger'); }
  }

  async function test() {
    const btn = document.getElementById('btn-tg-test');
    btn.textContent = '⏳ Enviando...'; btn.disabled = true;
    try {
      const res = await API.post('/config/telegram/test', {});
      if (res.ok) toast('✅ Mensaje de prueba enviado', 'success');
      else        toast(`❌ ${res.error}`, 'danger');
    } catch (e) { toast(`❌ ${e.message}`, 'danger'); }
    finally { btn.textContent = '📤 Probar'; btn.disabled = false; }
  }

  function _setupUI() {
    document.getElementById('btn-tg-save').addEventListener('click', save);
    document.getElementById('btn-tg-test').addEventListener('click', test);
    document.getElementById('tg-enabled').addEventListener('change', e => _updateStatus(e.target.checked));
  }

  return { load, _setupUI };
})();
