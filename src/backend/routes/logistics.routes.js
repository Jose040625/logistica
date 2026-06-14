// routes/logistics.routes.js
const express = require('express');
const { requireAuth, requireAdmin } = require('../auth');
const db     = require('../db');
const router = express.Router();

router.use(requireAuth);

router.get('/',      (req, res) => res.json(db.getLogisticas()));
router.post('/',     requireAdmin, (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'nombre requerido' });
  const ok = db.addLogistica(nombre);
  if (!ok) return res.status(409).json({ error: 'Logística ya existe' });
  res.status(201).json({ ok: true });
});
router.delete('/:id', requireAdmin, (req, res) => {
  db.deleteLogistica(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
