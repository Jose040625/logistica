// suppliers.js
const Suppliers = (() => {
  async function load() {
    const rows  = await API.get('/suppliers').catch(() => []);
    const tbody = document.getElementById('suppliers-body');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Sin proveedores registrados</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(s => `
      <tr>
        <td><strong>${s.nombre}</strong></td>
        <td>${s.telefono||'—'}</td>
        <td>${s.email||'—'}</td>
        <td style="font-size:11px;color:var(--muted)">${s.notas||'—'}</td>
        <td><button class="btn btn-danger btn-sm" onclick="Suppliers.delete(${s.id},'${s.nombre}')">🗑</button></td>
      </tr>`).join('');
  }

  async function _delete(id, nombre) {
    if (!confirm(`¿Eliminar proveedor "${nombre}"?`)) return;
    await API.del(`/suppliers/${id}`).catch(e => toast(`❌ ${e.message}`, 'danger'));
    toast(`🗑 "${nombre}" eliminado`, 'info');
    load();
  }

  async function save() {
    const nombre = document.getElementById('ns-nombre').value.trim();
    if (!nombre) { toast('⚠ Nombre requerido', 'danger'); return; }
    try {
      await API.post('/suppliers', {
        nombre, telefono: document.getElementById('ns-tel').value,
        email: document.getElementById('ns-email').value, notas: document.getElementById('ns-notas').value,
      });
      closeModal('supplier-modal');
      toast(`✅ Proveedor "${nombre}" guardado`, 'success');
      load();
    } catch (e) { toast(`❌ ${e.message}`, 'danger'); }
  }

  function openModal_() {
    ['ns-nombre','ns-tel','ns-email','ns-notas'].forEach(id => document.getElementById(id).value = '');
    openModal('supplier-modal');
  }

  function _setupUI() {
    document.getElementById('btn-new-supplier').addEventListener('click', openModal_);
    document.getElementById('btn-supplier-save').addEventListener('click', save);
  }

  return { load, delete: _delete, _setupUI };
})();
