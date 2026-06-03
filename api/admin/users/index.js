const { getPool } = require('../../../lib/db');
const { handleCors } = require('../../../lib/cors');
const { requireAdmin } = require('../../../lib/auth');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  if (!requireAdmin(req, res)) return;

  const pool = getPool();

  // GET /api/admin/users
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT id, nom, email, role, avatar_url, created_at FROM users ORDER BY created_at DESC'
      );
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // POST /api/admin/users
  if (req.method === 'POST') {
    try {
      const { nom, email, password, role } = req.body;

      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const result = await pool.query(
        `INSERT INTO users (nom, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, nom, email, role`,
        [nom, email, passwordHash, role || 'user']
      );
      return res.status(201).json({ success: true, message: 'Utilisateur créé', data: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
};
