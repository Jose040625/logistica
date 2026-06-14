// ═══════════════════════════════════════════════════════════════════
// db.js — SQLite database layer using better-sqlite3
// Gestión Comedor v4.0
// ═══════════════════════════════════════════════════════════════════
const Database = require('better-sqlite3');
const bcrypt   = require('bcryptjs');
const path     = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'comedor.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
    seedData();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS logisticas (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT    UNIQUE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS usuarios (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      username  TEXT    UNIQUE NOT NULL,
      password  TEXT    NOT NULL,
      rol       TEXT    NOT NULL DEFAULT 'operador',
      logistica TEXT    NOT NULL DEFAULT 'Principal'
    );
    CREATE TABLE IF NOT EXISTS categorias (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT    UNIQUE NOT NULL,
      icono  TEXT    DEFAULT '📦'
    );
    CREATE TABLE IF NOT EXISTS proveedores (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre   TEXT    UNIQUE NOT NULL,
      telefono TEXT    DEFAULT '',
      email    TEXT    DEFAULT '',
      notas    TEXT    DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS inventario (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      producto            TEXT    NOT NULL,
      logistica           TEXT    NOT NULL DEFAULT 'Principal',
      stock               INTEGER NOT NULL DEFAULT 0,
      minimo              INTEGER NOT NULL DEFAULT 5,
      categoria           TEXT    DEFAULT 'General',
      unidad              TEXT    DEFAULT 'unidades',
      precio              REAL    DEFAULT 0,
      proveedor           TEXT    DEFAULT '',
      fecha_creacion      TEXT    DEFAULT '',
      ultima_modificacion TEXT    DEFAULT '',
      UNIQUE(producto, logistica)
    );
    CREATE TABLE IF NOT EXISTS historial (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha       TEXT    NOT NULL,
      usuario     TEXT    NOT NULL,
      producto    TEXT    NOT NULL,
      logistica   TEXT    NOT NULL DEFAULT 'Principal',
      cambio      INTEGER NOT NULL,
      stock_final INTEGER NOT NULL,
      nota        TEXT    DEFAULT '',
      tipo        TEXT    DEFAULT 'movimiento'
    );
    CREATE TABLE IF NOT EXISTS ajustes (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      clave TEXT    UNIQUE NOT NULL,
      valor TEXT    NOT NULL
    );
  `);
}

function seedData() {
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');

  // Logísticas
  const insertLog = db.prepare('INSERT OR IGNORE INTO logisticas (nombre) VALUES (?)');
  insertLog.run('Principal');
  insertLog.run('Todas');

  // Categorías
  const insertCat = db.prepare('INSERT OR IGNORE INTO categorias (nombre, icono) VALUES (?, ?)');
  [['Bebidas','🥤'], ['Alimentos','🍽️'], ['Insumos','🧴'], ['General','📦']].forEach(([n,i]) => insertCat.run(n,i));

  // Ajustes por defecto
  const insertAj = db.prepare('INSERT OR IGNORE INTO ajustes (clave, valor) VALUES (?, ?)');
  insertAj.run('app_name', 'COMEDOR');
  insertAj.run('app_logo', '🍽');
  insertAj.run('telegram_token', '');
  insertAj.run('telegram_chat_id', '');
  insertAj.run('telegram_enabled', '0');
  insertAj.run('telegram_last_sent', '0');

  // Usuario admin por defecto
  const existUser = db.prepare('SELECT COUNT(*) as c FROM usuarios').get();
  if (existUser.c === 0) {
    const hash = bcrypt.hashSync('admin', 10);
    db.prepare('INSERT INTO usuarios (username, password, rol, logistica) VALUES (?,?,?,?)').run('admin', hash, 'admin', 'Todas');
  }

  // Productos de ejemplo
  const existInv = db.prepare('SELECT COUNT(*) as c FROM inventario').get();
  if (existInv.c === 0) {
    const ins = db.prepare('INSERT OR IGNORE INTO inventario (producto, logistica, stock, minimo, categoria, unidad, fecha_creacion) VALUES (?,?,?,?,?,?,?)');
    ins.run('Botellitas Agua',  'Principal', 100, 20, 'Bebidas',   'unidades', now);
    ins.run('Cajas Jugo',       'Principal',  20,  5, 'Bebidas',   'cajas',    now);
    ins.run('Botellones',       'Principal',  10,  3, 'Bebidas',   'unidades', now);
    ins.run('Almuerzos',        'Principal',  50, 10, 'Alimentos', 'porciones',now);
  }
}

// ── CRUD helpers ─────────────────────────────────────────────────────────────

function getConfig() {
  const rows = getDb().prepare('SELECT clave, valor FROM ajustes').all();
  return Object.fromEntries(rows.map(r => [r.clave, r.valor]));
}

function setConfig(clave, valor) {
  getDb().prepare('INSERT OR REPLACE INTO ajustes (clave, valor) VALUES (?,?)').run(clave, String(valor));
}

function findUser(username) {
  return getDb().prepare('SELECT * FROM usuarios WHERE username = ?').get(username);
}

function getUsers() {
  return getDb().prepare('SELECT id, username, rol, logistica FROM usuarios ORDER BY username').all();
}

function createUser(username, password, rol, logistica) {
  const hash = bcrypt.hashSync(password, 10);
  try {
    getDb().prepare('INSERT INTO usuarios (username, password, rol, logistica) VALUES (?,?,?,?)').run(username, hash, rol, logistica);
    return true;
  } catch { return false; }
}

function updateUser(id, password, rol, logistica) {
  try {
    if (password) {
      const hash = bcrypt.hashSync(password, 10);
      getDb().prepare('UPDATE usuarios SET password = ?, rol = ?, logistica = ? WHERE id = ?').run(hash, rol, logistica, id);
    } else {
      getDb().prepare('UPDATE usuarios SET rol = ?, logistica = ? WHERE id = ?').run(rol, logistica, id);
    }
    return true;
  } catch { return false; }
}

function deleteUser(id) {
  getDb().prepare('DELETE FROM usuarios WHERE id = ?').run(id);
}

function getLogisticas() {
  return getDb().prepare('SELECT * FROM logisticas ORDER BY nombre').all();
}

function addLogistica(nombre) {
  try { getDb().prepare('INSERT INTO logisticas (nombre) VALUES (?)').run(nombre); return true; }
  catch { return false; }
}

function deleteLogistica(id) {
  getDb().prepare('DELETE FROM logisticas WHERE id = ?').run(id);
}

function getCategorias() {
  return getDb().prepare('SELECT * FROM categorias ORDER BY nombre').all();
}

function addCategoria(nombre, icono = '📦') {
  try { getDb().prepare('INSERT INTO categorias (nombre, icono) VALUES (?,?)').run(nombre, icono); return true; }
  catch { return false; }
}

function getProveedores() {
  return getDb().prepare('SELECT * FROM proveedores ORDER BY nombre').all();
}

function addProveedor(nombre, telefono, email, notas) {
  try { getDb().prepare('INSERT INTO proveedores (nombre, telefono, email, notas) VALUES (?,?,?,?)').run(nombre, telefono||'', email||'', notas||''); return true; }
  catch { return false; }
}

function deleteProveedor(id) {
  getDb().prepare('DELETE FROM proveedores WHERE id = ?').run(id);
}

function getInventario({ logistica, categoria, q } = {}) {
  let sql = 'SELECT * FROM inventario WHERE 1=1';
  const params = [];
  if (logistica && logistica !== 'Todas') { sql += ' AND logistica = ?'; params.push(logistica); }
  if (categoria && categoria !== 'Todas') { sql += ' AND categoria = ?'; params.push(categoria); }
  if (q) { sql += ' AND producto LIKE ?'; params.push(`%${q}%`); }
  sql += ' ORDER BY producto';
  return getDb().prepare(sql).all(...params);
}

function addProducto({ producto, logistica, stock, minimo, categoria, unidad, precio, proveedor }) {
  if (logistica === 'Todas') logistica = 'Principal';
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
  try {
    getDb().prepare('INSERT INTO inventario (producto, logistica, stock, minimo, categoria, unidad, precio, proveedor, fecha_creacion) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(producto, logistica, stock||0, minimo||5, categoria||'General', unidad||'unidades', precio||0, proveedor||'', now);
    return true;
  } catch { return false; }
}

function deleteProducto(id) {
  getDb().prepare('DELETE FROM inventario WHERE id = ?').run(id);
}

function moveStock(id, cambio, usuario, nota, tipo, logistica) {
  if (logistica === 'Todas') logistica = 'Principal';
  const row = getDb().prepare('SELECT * FROM inventario WHERE id = ? AND logistica = ?').get(id, logistica)
           || getDb().prepare('SELECT * FROM inventario WHERE id = ?').get(id);
  if (!row) return { error: 'Producto no encontrado' };
  const nuevo = row.stock + cambio;
  if (nuevo < 0) return { error: 'Stock no puede quedar negativo' };
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
  getDb().prepare('UPDATE inventario SET stock = ?, ultima_modificacion = ? WHERE id = ?').run(nuevo, now, row.id);
  getDb().prepare('INSERT INTO historial (fecha, usuario, producto, logistica, cambio, stock_final, nota, tipo) VALUES (?,?,?,?,?,?,?,?)')
    .run(now, usuario, row.producto, row.logistica, cambio, nuevo, nota||'', tipo||'movimiento');
  return { stock: nuevo, producto: row.producto };
}

function getCriticos(logistica) {
  let sql = 'SELECT * FROM inventario WHERE stock <= minimo';
  const params = [];
  if (logistica && logistica !== 'Todas') { sql += ' AND logistica = ?'; params.push(logistica); }
  return getDb().prepare(sql).all(...params);
}

function getHistorial({ logistica, producto, usuario, tipo, limit = 300 } = {}) {
  let sql = 'SELECT * FROM historial WHERE 1=1';
  const params = [];
  if (logistica && logistica !== 'Todas') { sql += ' AND logistica = ?'; params.push(logistica); }
  if (producto) { sql += ' AND producto = ?'; params.push(producto); }
  if (usuario) { sql += ' AND usuario = ?'; params.push(usuario); }
  if (tipo && tipo !== 'Todos') { sql += ' AND tipo = ?'; params.push(tipo); }
  sql += ' ORDER BY id DESC LIMIT ?';
  params.push(limit);
  return getDb().prepare(sql).all(...params);
}

function getStats(logistica) {
  const cond = (logistica && logistica !== 'Todas') ? 'WHERE logistica = ?' : '';
  const p = (logistica && logistica !== 'Todas') ? [logistica] : [];
  const total    = getDb().prepare(`SELECT COUNT(*) as c, COALESCE(SUM(stock),0) as s FROM inventario ${cond}`).get(...p);
  const criticos = getDb().prepare(`SELECT COUNT(*) as c FROM inventario WHERE stock <= minimo ${cond ? 'AND logistica = ?' : ''}`).get(...p);
  const movs     = getDb().prepare(`SELECT COUNT(*) as c FROM historial ${cond}`).get(...p);
  const ultimo   = getDb().prepare(`SELECT fecha, producto, cambio, usuario FROM historial ${cond} ORDER BY id DESC LIMIT 1`).get(...p);
  return { total_productos: total.c, stock_total: total.s, criticos: criticos.c, movimientos: movs.c, ultimo };
}

module.exports = {
  getDb, getConfig, setConfig,
  findUser, getUsers, createUser, updateUser, deleteUser,
  getLogisticas, addLogistica, deleteLogistica,
  getCategorias, addCategoria,
  getProveedores, addProveedor, deleteProveedor,
  getInventario, addProducto, deleteProducto, moveStock, getCriticos,
  getHistorial, getStats,
};
