// dashboard.js — Stats + last movement + best sellers + critical stock
const Dashboard = (() => {

  let _lastCriticosHash = '';

  async function load() {
    const logistica = App.getLogistica();
    const qs = logistica && logistica !== 'Todas' ? `?logistica=${encodeURIComponent(logistica)}` : '';
    try {
      const data = await API.get(`/stats${qs}`);
      _renderStats(data);
      _renderLastMovement(data.ultimo);
      _renderCriticos(data.criticos_lista || []);
      _renderBestSellers(logistica);
      _checkAlarm(data.criticos_lista || []);
    } catch (e) {
      console.error('Dashboard load error', e);
    }
  }

  function _renderStats(data) {
    document.getElementById('stat-total').textContent    = data.total_productos ?? '—';
    document.getElementById('stat-stock').textContent    = data.stock_total ?? '—';
    document.getElementById('stat-criticos').textContent = data.criticos ?? '—';
    document.getElementById('stat-movs').textContent     = data.movimientos ?? '—';

    // Update sidebar badge
    const badge = document.getElementById('sb-critical');
    if (data.criticos > 0) {
      badge.textContent = `🚨 ${data.criticos} producto${data.criticos > 1 ? 's' : ''} crítico${data.criticos > 1 ? 's' : ''}`;
    } else {
      badge.textContent = '';
    }
  }

  function _renderLastMovement(ultimo) {
    const el = document.getElementById('last-movement');
    if (!ultimo) { el.innerHTML = '<span class="text-muted">Sin movimientos aún</span>'; return; }
    const sign = ultimo.cambio > 0 ? '+' : '';
    const cls  = ultimo.cambio > 0 ? 'success' : 'danger';
    el.innerHTML = `
      <div style="font-size:14px;font-weight:700;color:var(--text)">${ultimo.producto}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">
        <span class="text-${cls}">${sign}${ultimo.cambio}</span> · ${ultimo.usuario} · ${ultimo.fecha}
      </div>`;
  }

  async function _renderBestSellers(logistica) {
    // We'll query history grouped by product to find top movers
    // Using a simple approach: fetch history, count by product
    const qs = logistica && logistica !== 'Todas' ? `&logistica=${encodeURIComponent(logistica)}` : '';
    const periods = [
      { id: 'best-30',  dias: 30,  label: '30 días'  },
      { id: 'best-90',  dias: 90,  label: '90 días'  },
      { id: 'best-180', dias: 180, label: '180 días' },
    ];
    for (const p of periods) {
      try {
        const rows = await API.get(`/history?tipo=salida&limit=500${qs}`);
        const cutoff = Date.now() - p.dias * 86_400_000;
        const filtered = rows.filter(r => {
          const d = new Date(r.fecha.replace(' ', 'T')).getTime();
          return d >= cutoff && r.cambio < 0;
        });
        // Group by product
        const map = {};
        filtered.forEach(r => { map[r.producto] = (map[r.producto] || 0) + Math.abs(r.cambio); });
        const top = Object.entries(map).sort((a,b) => b[1]-a[1])[0];
        document.getElementById(p.id).textContent = top ? `${top[0]} (${top[1]})` : 'N/A';
      } catch { document.getElementById(p.id).textContent = 'N/A'; }
    }
  }

  function _renderCriticos(criticos) {
    const el = document.getElementById('criticos-list');
    if (!criticos.length) {
      el.innerHTML = '<span class="text-success" style="font-size:13px">✅ Todos los productos tienen stock suficiente</span>';
      return;
    }
    el.innerHTML = criticos.map(r => {
      const pct = Math.min(r.stock / Math.max(r.minimo, 1), 1);
      return `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(30,48,80,.4)">
          <span style="font-size:18px">🔴</span>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:700">${r.producto}</div>
            <div style="font-size:11px;color:var(--muted)">Stock: ${r.stock} / Mín: ${r.minimo} ${r.unidad||''}</div>
          </div>
          <button class="btn btn-success btn-sm" onclick="Inventory.quickMove(${r.id},'${r.producto}','entrada')">+ Reponer</button>
        </div>`;
    }).join('');
  }

  function _checkAlarm(criticos) {
    const hash = criticos.map(r => r.id).join(',');
    if (hash && hash !== _lastCriticosHash) {
      _lastCriticosHash = hash;
      if (!Alarm.isRunning()) {
        showAlarmModal(criticos);
      }
    } else if (!criticos.length) {
      _lastCriticosHash = '';
    }
  }

  return { load };
})();
