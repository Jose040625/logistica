// users.js — User management (admin only)
const Users = (() => {
  let _editingUserId = null;

  async function load() {
    const rows = await API.get('/users').catch(() => []);
    const tbody = document.getElementById('users-body');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No hay usuarios</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(u => `
      <tr>
        <td><strong>${u.username}</strong></td>
        <td><span class="chip ${u.rol === 'admin' ? 'entrada' : 'ajuste'}">${u.rol === 'admin' ? '👑 admin' : '👤 operador'}</span></td>
        <td>${u.logistica}</td>
        <td>
          <button class="btn btn-accent btn-sm" onclick="Users.editUser(${u.id}, '${u.username}', '${u.rol}', '${u.logistica}')">✏️ Modificar</button>
          <button class="btn btn-danger btn-sm" onclick="Users.deleteUser(${u.id},'${u.username}')">🗑 Eliminar</button>
        </td>
      </tr>`).join('');
  }

  async function deleteUser(id, username) {
    if (!confirm(`¿Eliminar usuario "${username}"?`)) return;
    await API.del(`/users/${id}`).catch(e => toast(`❌ ${e.message}`, 'danger'));
    toast(`🗑 Usuario "${username}" eliminado`, 'info');
    load();
  }

  async function _populateLogistics() {
    const logs = await API.get('/logistics').catch(() => []);
    const sel  = document.getElementById('nu-logistica');
    sel.innerHTML = logs.filter(l => l.nombre !== 'Todas').map(l => `<option value="${l.nombre}">${l.nombre}</option>`).join('');
    sel.innerHTML += '<option value="Todas">Todas</option>';
  }

  async function openNewUserModal() {
    _editingUserId = null;
    document.getElementById('user-modal-title').textContent = '👤 Nuevo Usuario';
    document.getElementById('btn-user-save').textContent = '✅ Crear Usuario';
    await _populateLogistics();
    const inpUser = document.getElementById('nu-user');
    inpUser.value = '';
    inpUser.disabled = false;
    document.getElementById('nu-pw').value = '';
    document.getElementById('nu-rol').value = 'operador';
    openModal('user-modal');
  }

  async function editUser(id, username, rol, logistica) {
    _editingUserId = id;
    document.getElementById('user-modal-title').textContent = '✏️ Modificar Usuario';
    document.getElementById('btn-user-save').textContent = '💾 Guardar Cambios';
    await _populateLogistics();
    
    const inpUser = document.getElementById('nu-user');
    inpUser.value = username;
    inpUser.disabled = true; // No permitimos cambiar el username
    
    document.getElementById('nu-pw').value = ''; // En blanco si no se quiere cambiar
    document.getElementById('nu-pw').placeholder = 'Dejar en blanco para no cambiar';
    
    document.getElementById('nu-rol').value = rol;
    document.getElementById('nu-logistica').value = logistica;
    openModal('user-modal');
  }

  async function saveUser() {
    const username  = document.getElementById('nu-user').value.trim();
    const password  = document.getElementById('nu-pw').value;
    const rol       = document.getElementById('nu-rol').value;
    const logistica = document.getElementById('nu-logistica').value;
    
    if (!_editingUserId && (!username || !password)) { 
      toast('⚠ Completa todos los campos obligatorios', 'danger'); 
      return; 
    }
    
    try {
      if (_editingUserId) {
        await API.put(`/users/${_editingUserId}`, { password, rol, logistica });
        toast(`✅ Usuario "${username}" modificado`, 'success');
      } else {
        await API.post('/users', { username, password, rol, logistica });
        toast(`✅ Usuario "${username}" creado`, 'success');
      }
      closeModal('user-modal');
      load();
    } catch (e) {
      toast(`❌ ${e.message}`, 'danger');
    }
  }

  function _setupUI() {
    document.getElementById('btn-new-user').addEventListener('click', openNewUserModal);
    document.getElementById('btn-user-save').addEventListener('click', saveUser);
  }

  return { load, deleteUser, editUser, openNewUserModal, _setupUI };
})();
