const { getPool } = require('../../lib/db');
const { handleCors } = require('../../lib/cors');
const { requireAdmin } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const pool = getPool();
  const { id } = req.query;

  // GET /api/regions/:id
  if (req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT r.*, COUNT(rec.id) as nombre_recettes
        FROM regions r
        LEFT JOIN recipes rec ON r.id = rec.region_id
        WHERE r.id = $1
        GROUP BY r.id
      `, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Région non trouvée' });
      }
      return res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // PUT /api/regions/:id (admin)
  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;

    try {
      const { nom, description, image_url, plats_typiques } = req.body;
      const result = await pool.query(`
        UPDATE regions
        SET nom = COALESCE($1, nom),
            description = COALESCE($2, description),
            image_url = COALESCE($3, image_url),
            plats_typiques = COALESCE($4, plats_typiques),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
      `, [nom, description, image_url, plats_typiques, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Région non trouvée' });
      }
      return res.json({ success: true, message: 'Région mise à jour', data: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // DELETE /api/regions/:id (admin)
  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;

    try {
      const result = await pool.query('DELETE FROM regions WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Région non trouvée' });
      }
      return res.json({ success: true, message: 'Région supprimée' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
};
