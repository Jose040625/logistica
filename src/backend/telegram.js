// ═══════════════════════════════════════════════════════════════════
// telegram.js — Server-side Telegram Bot API notifier
// ═══════════════════════════════════════════════════════════════════
const https = require('https');

const ANTI_SPAM_MS = 60_000; // minimum 60s between messages

/** Send a raw message via Telegram Bot API */
function sendMessage(botToken, chatId, text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' });
    const req  = https.request({
      hostname: 'api.telegram.org',
      path:     `/bot${botToken}/sendMessage`,
      method:   'POST',
      headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { const j = JSON.parse(data); resolve(j); }
        catch { resolve({ ok: false, error: data }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/** Send critical-stock alert. Returns { ok, error? } */
async function sendStockAlert(db, criticos) {
  const cfg = db.getConfig();
  if (cfg.telegram_enabled !== '1') return { ok: false, error: 'Telegram deshabilitado' };
  if (!cfg.telegram_token || !cfg.telegram_chat_id) return { ok: false, error: 'Telegram no configurado' };

  // Anti-spam
  const lastSent = parseInt(cfg.telegram_last_sent || '0', 10);
  if (Date.now() - lastSent < ANTI_SPAM_MS) return { ok: false, error: 'Anti-spam: espera 60s' };

  const lines = [
    '🚨 <b>ALERTA STOCK CRÍTICO</b> 🚨', '',
    ...criticos.map(r => `🔴 <b>${r.producto}</b>: ${r.stock} / mín ${r.minimo}`),
    '',
    `📅 ${new Date().toLocaleString('es-ES')}`,
    '⚠ Reponer urgente',
  ];

  try {
    const result = await sendMessage(cfg.telegram_token, cfg.telegram_chat_id, lines.join('\n'));
    if (result.ok) {
      db.setConfig('telegram_last_sent', String(Date.now()));
      return { ok: true };
    }
    return { ok: false, error: result.description || 'Error desconocido' };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/** Send a test message */
async function sendTestMessage(db) {
  const cfg = db.getConfig();
  if (!cfg.telegram_token || !cfg.telegram_chat_id) return { ok: false, error: 'Token o Chat ID vacíos' };
  try {
    const result = await sendMessage(cfg.telegram_token, cfg.telegram_chat_id, '✅ <b>Comedor Web</b> — Conexión Telegram correcta 🎉');
    return result.ok ? { ok: true } : { ok: false, error: result.description };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

module.exports = { sendStockAlert, sendTestMessage };
