const { getPool } = require('../../lib/db');
const { handleCors } = require('../../lib/cors');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  if (!requireAuth(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const pool = getPool();

  try {
    let history = [];
    try {
      const result = await pool.query(
        'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC',
        [req.user.id]
      );
      history = result.rows;
    } catch (dbError) {
      // Table n'existe pas encore
    }

    return res.json({ success: true, history });
  } catch (error) {
    console.error('Erreur subscription history:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
