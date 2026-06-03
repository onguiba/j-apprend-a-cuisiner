const { getPool } = require('../../../lib/db');
const { handleCors } = require('../../../lib/cors');
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const pool = getPool();
  const { token } = req.query;

  try {
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token requis' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const result = await pool.query(
      'SELECT * FROM password_reset_tokens WHERE token = $1 AND used = FALSE AND expires_at > NOW()',
      [hashedToken]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
    }

    return res.json({ success: true, message: 'Token valide' });
  } catch (error) {
    console.error('Erreur verify-reset-token:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
