// routes/config.routes.js — App branding + Telegram configuration
const express = require('express');
const { requireAuth, requireAdmin } = require('../auth');
const db     = require('../db');
const tg     = require('../telegram');
const router = express.Router();

router.use(requireAuth);

// GET /api/config
router.get('/', (req, res) => {
  const cfg = db.getConfig();
  // Don't expose raw token in response (mask it)
  const safe = {
    app_name:        cfg.app_name       || 'COMEDOR',
    app_logo:        cfg.app_logo       || '🍽',
    telegram_enabled: cfg.telegram_enabled === '1',
    telegram_token:  cfg.telegram_token ? '***configured***' : '',
    telegram_chat_id: cfg.telegram_chat_id || '',
  };
  res.json(safe);
});

// PUT /api/config
router.put('/', requireAdmin, (req, res) => {
  const { app_name, app_logo, telegram_enabled, telegram_token, telegram_chat_id } = req.body;
  if (app_name)     db.setConfig('app_name', app_name);
  if (app_logo)     db.setConfig('app_logo', app_logo);
  if (typeof telegram_enabled === 'boolean') db.setConfig('telegram_enabled', telegram_enabled ? '1' : '0');
  if (typeof telegram_token   === 'string' && telegram_token !== '***configured***') db.setConfig('telegram_token', telegram_token);
  if (typeof telegram_chat_id === 'string') db.setConfig('telegram_chat_id', telegram_chat_id);
  res.json({ ok: true });
});

// POST /api/config/telegram/test
router.post('/telegram/test', requireAdmin, async (req, res) => {
  const result = await tg.sendTestMessage(db);
  res.json(result);
});

// GET /api/config/telegram  (returns actual config for admin form)
router.get('/telegram', requireAdmin, (req, res) => {
  const cfg = db.getConfig();
  res.json({
    token:    cfg.telegram_token    || '',
    chat_id:  cfg.telegram_chat_id  || '',
    enabled:  cfg.telegram_enabled === '1',
  });
});

module.exports = router;
