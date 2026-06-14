// routes/users.routes.js
const express = require('express');
const { requireAuth, requireAdmin } = require('../auth');
const db     = require('../db');
const router = express.Router();

router.use(requireAuth, requireAdmin);

// GET /api/users
router.get('/', (req, res) => res.json(db.getUsers()));

// POST /api/users
router.post('/', (req, res) => {
  const { username, password, rol, logistica } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username y password requeridos' });
  const ok = db.createUser(username, password, rol || 'operador', logistica || 'Principal');
  if (!ok) return res.status(409).json({ error: 'Usuario ya existe' });
  res.status(201).json({ ok: true });
});

// PUT /api/users/:id
router.put('/:id', (req, res) => {
  const { password, rol, logistica } = req.body;
  const ok = db.updateUser(req.params.id, password, rol, logistica);
  if (!ok) return res.status(400).json({ error: 'Error al actualizar usuario' });
  res.json({ ok: true });
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  db.deleteUser(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
