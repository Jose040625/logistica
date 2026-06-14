// routes/history.routes.js
const express = require('express');
const { requireAuth } = require('../auth');
const db     = require('../db');
const router = express.Router();

router.use(requireAuth);

// GET /api/history
router.get('/', (req, res) => {
  const { logistica, producto, usuario, tipo, limit } = req.query;
  const rows = db.getHistorial({
    logistica: logistica || req.user.logistica,
    producto, usuario, tipo,
    limit: parseInt(limit) || 300,
  });
  res.json(rows);
});

module.exports = router;
