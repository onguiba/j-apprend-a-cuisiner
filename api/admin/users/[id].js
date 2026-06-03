const { getPool } = require('../../../lib/db');
const { handleCors } = require('../../../lib/cors');
const { requireAdmin } = require('../../../lib/auth');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  if (!requireAdmin(req, res)) return;

  const pool = getPool();
  const { id } = req.query;

  // GET /api/admin/users/:id
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT id, nom, email, role, avatar_url, created_at FROM users WHERE id = $1',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      return res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // PUT /api/admin/users/:id
  if (req.method === 'PUT') {
    try {
      const { action, nom, email, role, avatar_url } = req.body;

      // Actions spéciales : promote / demote
      if (action === 'promote') {
        if (parseInt(id) === req.user.id) {
          return res.status(400).json({ success: false, message: 'Impossible de se promouvoir soi-même' });
        }
        const result = await pool.query(
          `UPDATE users SET role = 'admin', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, nom, email, role`,
          [id]
        );
        return res.json({ success: true, message: 'Utilisateur promu administrateur', data: result.rows[0] });
      }

      if (action === 'demote') {
        if (parseInt(id) === req.user.id) {
          return res.status(400).json({ success: false, message: 'Impossible de se rétrograder soi-même' });
        }
        const result = await pool.query(
          `UPDATE users SET role = 'user', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, nom, email, role`,
          [id]
        );
        return res.json({ success: true, message: 'Administrateur rétrogradé', data: result.rows[0] });
      }

      // Mise à jour normale
      const result = await pool.query(
        `UPDATE users SET nom = COALESCE($1, nom), email = COALESCE($2, email), role = COALESCE($3, role), avatar_url = COALESCE($4, avatar_url), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, nom, email, role, avatar_url`,
        [nom, email, role, avatar_url, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      return res.json({ success: true, message: 'Utilisateur mis à jour', data: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // DELETE /api/admin/users/:id
  if (req.method === 'DELETE') {
    try {
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ success: false, message: 'Impossible de supprimer votre propre compte' });
      }
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      return res.json({ success: true, message: 'Utilisateur supprimé' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
};
