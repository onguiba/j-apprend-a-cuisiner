const { getPool } = require('../../lib/db');
const { handleCors } = require('../../lib/cors');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  if (!requireAuth(req, res)) return;

  const pool = getPool();

  // GET /api/auth/profile
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT id, nom, email, role, avatar_url, facebook_id, created_at FROM users WHERE id = $1',
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      return res.json({ success: true, user: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // PUT /api/auth/profile
  if (req.method === 'PUT') {
    try {
      const { nom, avatar_url } = req.body;
      const result = await pool.query(
        `UPDATE users SET nom = COALESCE($1, nom), avatar_url = COALESCE($2, avatar_url), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, nom, email, role, avatar_url`,
        [nom, avatar_url, req.user.id]
      );
      return res.json({ success: true, message: 'Profil mis à jour', user: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
};
