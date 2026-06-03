const { getPool } = require('../../../lib/db');
const { handleCors } = require('../../../lib/cors');
const { requireAdmin } = require('../../../lib/auth');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  if (!requireAdmin(req, res)) return;

  const pool = getPool();

  // GET /api/admin/comments
  if (req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT c.*, u.nom as user_nom, r.titre as recipe_titre
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN recipes r ON c.recipe_id = r.id
        ORDER BY c.created_at DESC
      `);
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
};
