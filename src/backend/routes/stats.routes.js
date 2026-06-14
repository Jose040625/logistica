// routes/stats.routes.js
const express = require('express');
const { requireAuth } = require('../auth');
const db     = require('../db');
const router = express.Router();

router.use(requireAuth);

// GET /api/stats
router.get('/', (req, res) => {
  const logistica = req.query.logistica || req.user.logistica;
  const stats     = db.getStats(logistica);
  const criticos  = db.getCriticos(logistica);
  res.json({ ...stats, criticos_lista: criticos });
});

module.exports = router;
