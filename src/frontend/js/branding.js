// branding.js — App name/logo customization
const Branding = (() => {
  async function load() {
    try {
      const cfg = await API.get('/config');
      document.getElementById('brand-name').value  = cfg.app_name || 'COMEDOR';
      document.getElementById('brand-logo').value  = cfg.app_logo || '🍽';
      _updatePreview(cfg.app_logo, cfg.app_name);
    } catch {}
  }

  function _updatePreview(logo, name) {
    document.getElementById('preview-emoji').textContent = logo || '🍽';
    document.getElementById('preview-name').textContent  = name || 'COMEDOR';
  }

  async function save() {
    const name = document.getElementById('brand-name').value.trim() || 'COMEDOR';
    const logo = document.getElementById('brand-logo').value.trim() || '🍽';
    try {
      await API.put('/config', { app_name: name, app_logo: logo });
      _updatePreview(logo, name);
      // Also update sidebar
      document.getElementById('sb-logo').textContent  = logo;
      document.getElementById('sb-name').textContent  = name;
      document.getElementById('login-logo').textContent  = logo;
      document.getElementById('login-title').textContent = name;
      toast('✅ Apariencia actualizada', 'success');
    } catch (e) { toast(`❌ ${e.message}`, 'danger'); }
  }

  function _setupUI() {
    document.getElementById('btn-brand-save').addEventListener('click', save);
    document.getElementById('brand-logo').addEventListener('input', e => {
      _updatePreview(e.target.value, document.getElementById('brand-name').value);
    });
    document.getElementById('brand-name').addEventListener('input', e => {
      _updatePreview(document.getElementById('brand-logo').value, e.target.value);
    });
  }

  return { load, _setupUI };
})();
