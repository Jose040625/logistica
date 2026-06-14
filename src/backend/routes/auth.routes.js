// routes/auth.routes.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const { signToken } = require('../auth');
const db      = require('../db');
const router  = express.Router();

// Brute-force protection: track failed attempts per IP
const attempts = new Map(); // ip -> { count, until }

router.post('/login', (req, res) => {
  const ip  = req.ip;
  const now = Date.now();
  const rec = attempts.get(ip) || { count: 0, until: 0 };

  if (rec.until > now) {
    const secs = Math.ceil((rec.until - now) / 1000);
    return res.status(429).json({ error: `Bloqueado. Espera ${secs}s`, blocked: true });
  }

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Campos requeridos' });

  const user = db.findUser(username.trim());
  if (!user || !bcrypt.compareSync(password, user.password)) {
    rec.count++;
    if (rec.count >= 3) {
      rec.until = now + 30_000;
      rec.count = 0;
      attempts.set(ip, rec);
      return res.status(401).json({ error: 'Demasiados intentos. Bloqueado 30s.', blocked: true });
    }
    attempts.set(ip, rec);
    return res.status(401).json({ error: `Credenciales incorrectas. (${3 - rec.count} intentos restantes)` });
  }

  // Success
  attempts.delete(ip);
  const token = signToken({ id: user.id, username: user.username, rol: user.rol, logistica: user.logistica });
  res.json({ token, user: { id: user.id, username: user.username, rol: user.rol, logistica: user.logistica } });
});

module.exports = router;
