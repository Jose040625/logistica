// inventory.js — Product cards, modals, stock movements
const Inventory = (() => {
  let _items = [];
  let _selectedId   = null;
  let _selectedName = null;
  let _searchTimer  = null;

  async function load() {
    const logistica = App.getLogistica();
    const search    = document.getElementById('inv-search').value;
    const cat       = document.getElementById('inv-cat-filter').value;

    let qs = `?logistica=${encodeURIComponent(logistica)}`;
    if (search) qs += `&q=${encodeURIComponent(search)}`;
    if (cat)    qs += `&categoria=${encodeURIComponent(cat)}`;

    try {
      _items = await API.get(`/inventory${qs}`);
      _renderCards(_items);
    } catch (e) {
      document.getElementById('products-grid').innerHTML =
        `<div class="empty-state"><span class="empty-icon">⚠</span>${e.message}</div>`;
    }
  }

  function _renderCards(items) {
    const grid = document.getElementById('products-grid');
    if (!items.length) {
      grid.innerHTML = '<div class="empty-state"><span class="empty-icon">📦</span>No hay productos. Agrega el primero.</div>';
      return;
    }
    grid.innerHTML = items.map(r => {
      const pct    = r.stock / Math.max(r.minimo, 1);
      const pctBar = Math.min(pct / 3, 1);
      let color, icon, badge;
      if (pct <= 1)      { color = 'var(--danger)';  icon = '🔴'; badge = 'CRÍTICO'; }
      else if (pct <= 2) { color = 'var(--warning)'; icon = '🟡'; badge = 'BAJO';    }
      else               { color = 'var(--success)'; icon = '🟢'; badge = null;      }

      const extra = [
        r.precio > 0 ? `💰 $${Number(r.precio).toFixed(2)}` : null,
        r.proveedor  ? `🏭 ${r.proveedor}` : null,
      ].filter(Boolean).join('   ·   ');

      return `
        <div class="product-card">
          <div class="card-bar" style="background:${color}"></div>
          <div class="card-icon">${icon}</div>
          <div class="card-name">${r.producto}</div>
          <div class="card-info">Stock: <strong>${r.stock}</strong> ${r.unidad||''}   ·   Mín: ${r.minimo}   ·   📂 ${r.categoria||'General'}</div>
          ${extra ? `<div class="card-extra">${extra}</div>` : ''}
          <div class="card-badge">
            ${badge ? `<span class="badge-pill" style="color:${color}">${badge}</span>` : ''}
          </div>
          <div class="card-actions">
            <button class="btn-stock plus"  onclick="Inventory.quickMove(${r.id},'${r.producto}','entrada')" title="Entrada">+</button>
            <button class="btn-stock minus" onclick="Inventory.quickMove(${r.id},'${r.producto}','salida')"  title="Salida">−</button>
            ${Auth.isAdmin() ? `<button class="btn-stock delete" onclick="Inventory.deleteProduct(${r.id},'${r.producto}')" title="Eliminar">🗑</button>` : ''}
          </div>
          <div class="card-bar-row">
            <div class="bar-track"><div class="bar-fill" style="width:${Math.round(pctBar*100)}%;background:${color}"></div></div>
            <div class="bar-pct" style="color:${color}">${Math.round(pctBar*100)}%</div>
          </div>
        </div>`;
    }).join('');
  }

  function quickMove(id, nombre, tipo) {
    _selectedId   = id;
    _selectedName = nombre;
    document.getElementById('move-product-name').textContent = nombre;
    const item = _items.find(i => i.id === id);
    if (item) document.getElementById('move-product-info').textContent = `Stock actual: ${item.stock} ${item.unidad||'unidades'}`;
    document.getElementById('move-tipo').value = tipo;
    document.getElementById('qty-input').value = 1;
    document.getElementById('move-nota').value = '';
    document.getElementById('move-modal-title').textContent = tipo === 'entrada' ? '📥 Entrada de Stock' : '📤 Salida de Stock';
    openModal('move-modal');
  }

  async function confirmMove() {
    const qty  = parseInt(document.getElementById('qty-input').value) || 1;
    const tipo = document.getElementById('move-tipo').value;
    const nota = document.getElementById('move-nota').value;
    const sign = tipo === 'salida' ? -1 : 1;

    try {
      const res = await API.post(`/inventory/${_selectedId}/move`, {
        cambio: qty * sign, nota, tipo,
      });
      closeModal('move-modal');
      toast(`✅ Stock actualizado: ${_selectedName}`, 'success');
      load();
      if (res.criticos > 0) {
        const crit = await API.get(`/inventory/criticos?logistica=${encodeURIComponent(App.getLogistica())}`);
        if (!Alarm.isRunning()) showAlarmModal(crit);
      } else {
        hideAlarmModal();
      }
    } catch (e) {
      toast(`❌ ${e.message}`, 'danger');
    }
  }

  async function openNewProductModal() {
    // Fill category select
    const cats = await API.get('/categories').catch(() => []);
    const sel  = document.getElementById('np-categoria');
    sel.innerHTML = cats.map(c => `<option value="${c.nombre}">${c.icono} ${c.nombre}</option>`).join('');

    // Fill supplier select
    const sups = await API.get('/suppliers').catch(() => []);
    const selS = document.getElementById('np-proveedor');
    selS.innerHTML = '<option value="">Sin proveedor</option>' + sups.map(s => `<option value="${s.nombre}">${s.nombre}</option>`).join('');

    document.getElementById('np-nombre').value = '';
    document.getElementById('np-stock').value  = '0';
    document.getElementById('np-minimo').value = '5';
    document.getElementById('np-unidad').value = 'unidades';
    document.getElementById('np-precio').value = '0';
    openModal('product-modal');
  }

  async function saveNewProduct() {
    const nombre   = document.getElementById('np-nombre').value.trim();
    if (!nombre) { toast('⚠ Nombre requerido', 'danger'); return; }
    try {
      await API.post('/inventory', {
        producto:  nombre,
        logistica: App.getLogistica(),
        stock:     parseInt(document.getElementById('np-stock').value)  || 0,
        minimo:    parseInt(document.getElementById('np-minimo').value) || 5,
        categoria: document.getElementById('np-categoria').value,
        unidad:    document.getElementById('np-unidad').value || 'unidades',
        precio:    parseFloat(document.getElementById('np-precio').value) || 0,
        proveedor: document.getElementById('np-proveedor').value,
      });
      closeModal('product-modal');
      toast(`✅ Producto "${nombre}" creado`, 'success');
      load();
    } catch (e) {
      toast(`❌ ${e.message}`, 'danger');
    }
  }

  async function deleteProduct(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    await API.del(`/inventory/${id}`).catch(e => toast(`❌ ${e.message}`, 'danger'));
    toast(`🗑 "${nombre}" eliminado`, 'info');
    load();
  }

  async function populateCategoryFilter() {
    const cats = await API.get('/categories').catch(() => []);
    const sel  = document.getElementById('inv-cat-filter');
    sel.innerHTML = '<option value="">Todas las categorías</option>' + cats.map(c => `<option value="${c.nombre}">${c.icono} ${c.nombre}</option>`).join('');
  }

  function _setupUI() {
    document.getElementById('inv-search').addEventListener('input', () => {
      clearTimeout(_searchTimer);
      _searchTimer = setTimeout(load, 300);
    });
    document.getElementById('inv-cat-filter').addEventListener('change', load);
    document.getElementById('btn-new-product').addEventListener('click', openNewProductModal);
    document.getElementById('btn-product-save').addEventListener('click', saveNewProduct);
    document.getElementById('btn-move-confirm').addEventListener('click', confirmMove);
    document.getElementById('qty-minus').addEventListener('click', () => {
      const el = document.getElementById('qty-input');
      el.value = Math.max(1, parseInt(el.value) - 1);
    });
    document.getElementById('qty-plus').addEventListener('click', () => {
      const el = document.getElementById('qty-input');
      el.value = parseInt(el.value) + 1;
    });
  }

  return { load, quickMove, deleteProduct, openNewProductModal, populateCategoryFilter, _setupUI };
})();
