const { getPool } = require('../../../lib/db');
const { handleCors } = require('../../../lib/cors');
const { requireAdmin } = require('../../../lib/auth');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  if (!requireAdmin(req, res)) return;

  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const pool = getPool();
  const { id } = req.query;

  try {
    const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Commentaire non trouvé' });
    }
    return res.json({ success: true, message: 'Commentaire supprimé' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
