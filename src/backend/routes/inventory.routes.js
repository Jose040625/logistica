// routes/inventory.routes.js
const express = require('express');
const { requireAuth } = require('../auth');
const db     = require('../db');
const tg     = require('../telegram');
const router = express.Router();

router.use(requireAuth);

// GET /api/inventory
router.get('/', (req, res) => {
  const { logistica, categoria, q } = req.query;
  const items = db.getInventario({ logistica, categoria, q });
  res.json(items);
});

// POST /api/inventory
router.post('/', (req, res) => {
  const { producto, logistica, stock, minimo, categoria, unidad, precio, proveedor } = req.body;
  if (!producto) return res.status(400).json({ error: 'Nombre de producto requerido' });
  const ok = db.addProducto({ producto, logistica, stock, minimo, categoria, unidad, precio, proveedor });
  if (!ok) return res.status(409).json({ error: 'Producto ya existe en esa logística' });
  res.status(201).json({ ok: true });
});

// DELETE /api/inventory/:id
router.delete('/:id', (req, res) => {
  db.deleteProducto(req.params.id);
  res.json({ ok: true });
});

// POST /api/inventory/:id/move  { cambio, nota, tipo }
router.post('/:id/move', (req, res) => {
  const { cambio, nota, tipo } = req.body;
  const logistica = req.user.logistica;
  if (typeof cambio !== 'number') return res.status(400).json({ error: 'cambio debe ser número' });

  const result = db.moveStock(Number(req.params.id), cambio, req.user.username, nota, tipo, logistica);
  if (result.error) return res.status(400).json({ error: result.error });

  // Check critical stock and fire Telegram if needed
  const criticos = db.getCriticos(logistica);
  if (criticos.length > 0) {
    tg.sendStockAlert(db, criticos).catch(() => {});
  }

  res.json({ ok: true, stock: result.stock, criticos: criticos.length });
});

// GET /api/inventory/criticos
router.get('/criticos', (req, res) => {
  const logistica = req.query.logistica || req.user.logistica;
  res.json(db.getCriticos(logistica));
});

module.exports = router;
