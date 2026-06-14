// logistics.js
const Logistics = (() => {
  async function load() {
    const rows  = await API.get('/logistics').catch(() => []);
    const tbody = document.getElementById('logistics-body');
    tbody.innerHTML = rows.map(l => `
      <tr>
        <td><strong>${l.nombre}</strong></td>
        <td>${l.nombre !== 'Principal' && l.nombre !== 'Todas'
          ? `<button class="btn btn-danger btn-sm" onclick="Logistics.delete(${l.id},'${l.nombre}')">🗑</button>`
          : '<span class="text-muted">Sistema</span>'}</td>
      </tr>`).join('');
    // Also update logistica selector in sidebar
    App.refreshLogisticaSelector(rows);
  }

  async function _delete(id, nombre) {
    if (!confirm(`¿Eliminar logística "${nombre}"? Los productos de esta logística NO se eliminarán.`)) return;
    await API.del(`/logistics/${id}`).catch(e => toast(`❌ ${e.message}`, 'danger'));
    toast(`🗑 "${nombre}" eliminada`, 'info');
    load();
  }

  async function save() {
    const nombre = document.getElementById('nl-nombre').value.trim();
    if (!nombre) { toast('⚠ Nombre requerido', 'danger'); return; }
    try {
      await API.post('/logistics', { nombre });
      closeModal('log-modal');
      toast(`✅ Logística "${nombre}" creada`, 'success');
      load();
    } catch (e) { toast(`❌ ${e.message}`, 'danger'); }
  }

  function _setupUI() {
    document.getElementById('btn-new-log').addEventListener('click', () => {
      document.getElementById('nl-nombre').value = '';
      openModal('log-modal');
    });
    document.getElementById('btn-log-save').addEventListener('click', save);
  }

  return { load, delete: _delete, _setupUI };
})();
