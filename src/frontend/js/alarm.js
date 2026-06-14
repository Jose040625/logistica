// alarm.js — AudioContext beep engine + screen flash + modal
const Alarm = (() => {
  let _running = false;
  let _ctx     = null;
  let _timeout = null;

  function _getCtx() {
    if (!_ctx || _ctx.state === 'closed') _ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  }

  function _beep() {
    if (!_running) return;
    const ctx  = _getCtx();
    const now  = ctx.currentTime;
    const seq  = [[800,.1],[0,.04],[1100,.1],[0,.04],[1500,.2],[0,.08]];
    let t = now;
    seq.forEach(([freq, dur]) => {
      if (freq > 0) {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(.4, t);
        osc.start(t); osc.stop(t + dur);
      }
      t += dur;
    });
    _timeout = setTimeout(_beep, (t - now) * 1000 + 200);
  }

  function start() {
    if (_running) return;
    _running = true;
    _beep();
    document.body.classList.add('alarm-active');
  }

  function stop() {
    _running = false;
    clearTimeout(_timeout);
    document.body.classList.remove('alarm-active');
  }

  function isRunning() { return _running; }

  return { start, stop, isRunning };
})();

// Show alarm modal
function showAlarmModal(criticos) {
  const overlay = document.getElementById('alarm-overlay');
  const list    = document.getElementById('alarm-list');
  list.innerHTML = criticos.map(r => `
    <div class="alarm-item">
      <div>
        <div class="a-name">🔴 ${r.producto}</div>
        <div class="a-info">Stock: <strong>${r.stock}</strong> / Mínimo: ${r.minimo} ${r.unidad||'unidades'}</div>
      </div>
      <button class="btn btn-success btn-sm a-btn" onclick="App.quickEntry(${r.id},'${r.producto}')">+ Reponer</button>
    </div>
  `).join('');
  overlay.classList.remove('hidden');
  Alarm.start();
  document.getElementById('btn-silence').classList.add('visible');
}

function hideAlarmModal() {
  document.getElementById('alarm-overlay').classList.add('hidden');
  Alarm.stop();
  document.getElementById('btn-silence').classList.remove('visible');
}

document.getElementById('btn-dismiss-alarm').addEventListener('click', hideAlarmModal);
document.getElementById('btn-silence').addEventListener('click', hideAlarmModal);
