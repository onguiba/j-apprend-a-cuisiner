const { getPool } = require('../../lib/db');
const { handleCors } = require('../../lib/cors');
const { requireAuth } = require('../../lib/auth');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  if (!requireAuth(req, res)) return;

  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const pool = getPool();

  try {
    const { currentPassword, newPassword } = req.body;

    const result = await pool.query(
      'SELECT password_hash, email, nom FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newHash, req.user.id]
    );

    return res.json({ success: true, message: 'Mot de passe changé avec succès' });
  } catch (error) {
    console.error('Erreur change-password:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
