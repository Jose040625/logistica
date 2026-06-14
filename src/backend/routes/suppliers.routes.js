// routes/suppliers.routes.js
const express = require('express');
const { requireAuth, requireAdmin } = require('../auth');
const db     = require('../db');
const router = express.Router();

router.use(requireAuth);

router.get('/',      (req, res) => res.json(db.getProveedores()));
router.post('/',     requireAdmin, (req, res) => {
  const { nombre, telefono, email, notas } = req.body;
  if (!nombre) return res.status(400).json({ error: 'nombre requerido' });
  const ok = db.addProveedor(nombre, telefono, email, notas);
  if (!ok) return res.status(409).json({ error: 'Proveedor ya existe' });
  res.status(201).json({ ok: true });
});
router.delete('/:id', requireAdmin, (req, res) => {
  db.deleteProveedor(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
