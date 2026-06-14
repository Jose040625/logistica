// history.js — Movement log table
const History = (() => {

  async function load() {
    const logistica = App.getLogistica();
    const producto  = document.getElementById('hist-producto').value;
    const usuario   = document.getElementById('hist-usuario').value;
    const tipo      = document.getElementById('hist-tipo').value;

    let qs = `?logistica=${encodeURIComponent(logistica)}&limit=300`;
    if (producto) qs += `&producto=${encodeURIComponent(producto)}`;
    if (usuario)  qs += `&usuario=${encodeURIComponent(usuario)}`;
    if (tipo)     qs += `&tipo=${encodeURIComponent(tipo)}`;

    try {
      const rows = await API.get(`/history${qs}`);
      _renderTable(rows);
    } catch (e) {
      document.getElementById('hist-body').innerHTML =
        `<tr><td colspan="8" class="empty-state">Error: ${e.message}</td></tr>`;
    }
  }

  function _renderTable(rows) {
    const tbody = document.getElementById('hist-body');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No hay registros que coincidan</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(r => {
      const sign = r.cambio > 0 ? '+' : '';
      const cls  = r.cambio > 0 ? 'cambio-pos' : 'cambio-neg';
      const tipo = r.tipo || 'movimiento';
      return `
        <tr>
          <td style="white-space:nowrap">${r.fecha}</td>
          <td><strong>${r.usuario}</strong></td>
          <td>${r.producto}</td>
          <td><span style="font-size:11px;color:var(--muted)">${r.logistica}</span></td>
          <td class="${cls}">${sign}${r.cambio}</td>
          <td><strong>${r.stock_final}</strong></td>
          <td><span class="chip ${tipo}">${tipo}</span></td>
          <td style="color:var(--muted);font-size:11px">${r.nota||'—'}</td>
        </tr>`;
    }).join('');
  }

  function _setupUI() {
    document.getElementById('btn-hist-search').addEventListener('click', load);
    document.getElementById('hist-tipo').addEventListener('change', load);
    ['hist-producto', 'hist-usuario'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') load(); });
    });
  }

  return { load, _setupUI };
})();
