// ═══════════════════════════════════════════════════════════════════
// server.js — Express entry point
// Gestión Comedor Web v4.0
// ═══════════════════════════════════════════════════════════════════
const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/inventory',  require('./routes/inventory.routes'));
app.use('/api/history',    require('./routes/history.routes'));
app.use('/api/users',      require('./routes/users.routes'));
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/suppliers',  require('./routes/suppliers.routes'));
app.use('/api/logistics',  require('./routes/logistics.routes'));
app.use('/api/stats',      require('./routes/stats.routes'));
app.use('/api/config',     require('./routes/config.routes'));

// ── SPA Fallback — always serve index.html for unknown paths ──────
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  } else {
    res.status(404).json({ error: 'Endpoint no encontrado' });
  }
});

// ── Global error handler ──────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🍽  Comedor Web v4.0 corriendo en http://localhost:${PORT}`);
  console.log(`📂  Base de datos: ${path.join(__dirname, '../../comedor.db')}`);
  console.log(`🔑  Usuario por defecto: admin / admin\n`);
});

module.exports = app;
