// ═══════════════════════════════════════════════════════════════════
// auth.js — JWT middleware for Express
// ═══════════════════════════════════════════════════════════════════
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'comedor_secret_key_v4';
const EXPIRES = '8h';

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}

function verifyToken(token) {
  try { return jwt.verify(token, SECRET); }
  catch { return null; }
}

/** Express middleware — attaches req.user or sends 401 */
function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: 'Token inválido o expirado' });
  req.user = decoded;
  next();
}

/** Middleware — 403 if not admin */
function requireAdmin(req, res, next) {
  if (req.user?.rol !== 'admin') return res.status(403).json({ error: 'Requiere rol admin' });
  next();
}

module.exports = { signToken, verifyToken, requireAuth, requireAdmin };
