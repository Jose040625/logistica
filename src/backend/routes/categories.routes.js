// routes/categories.routes.js
const express = require('express');
const { requireAuth, requireAdmin } = require('../auth');
const db     = require('../db');
const router = express.Router();

router.use(requireAuth);

router.get('/',    (req, res) => res.json(db.getCategorias()));
router.post('/',   requireAdmin, (req, res) => {
  const { nombre, icono } = req.body;
  if (!nombre) return res.status(400).json({ error: 'nombre requerido' });
  const ok = db.addCategoria(nombre, icono);
  if (!ok) return res.status(409).json({ error: 'Categoría ya existe' });
  res.status(201).json({ ok: true });
});

module.exports = router;
