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
    // Essayer de récupérer depuis la table subscriptions si elle existe
    let subscription = null;
    try {
      const result = await pool.query(
        `SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active' AND (expires_at IS NULL OR expires_at > NOW()) ORDER BY created_at DESC LIMIT 1`,
        [req.user.id]
      );
      subscription = result.rows[0] || null;
    } catch (dbError) {
      // Table n'existe pas encore, retourner plan free par défaut
      console.log('Table subscriptions non trouvée, retour plan free');
    }

    return res.json({
      success: true,
      subscription: subscription || { plan: 'free', status: 'active' }
    });
  } catch (error) {
    console.error('Erreur active subscription:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
