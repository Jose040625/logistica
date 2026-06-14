// categories.js
const Categories = (() => {
  async function load() {
    const rows  = await API.get('/categories').catch(() => []);
    const tbody = document.getElementById('categories-body');
    tbody.innerHTML = rows.map(c => `
      <tr>
        <td style="font-size:22px">${c.icono||'📦'}</td>
        <td><strong>${c.nombre}</strong></td>
      </tr>`).join('') || '<tr><td colspan="2" class="empty-state">Sin categorías</td></tr>';
  }

  async function save() {
    const nombre = document.getElementById('nc-nombre').value.trim();
    const icono  = document.getElementById('nc-icono').value.trim() || '📦';
    if (!nombre) { toast('⚠ Nombre requerido', 'danger'); return; }
    try {
      await API.post('/categories', { nombre, icono });
      closeModal('cat-modal');
      toast(`✅ Categoría "${nombre}" creada`, 'success');
      load();
    } catch (e) { toast(`❌ ${e.message}`, 'danger'); }
  }

  function _setupUI() {
    document.getElementById('btn-new-cat').addEventListener('click', () => {
      document.getElementById('nc-nombre').value = '';
      document.getElementById('nc-icono').value  = '📦';
      openModal('cat-modal');
    });
    document.getElementById('btn-cat-save').addEventListener('click', save);
  }

  return { load, _setupUI };
})();
