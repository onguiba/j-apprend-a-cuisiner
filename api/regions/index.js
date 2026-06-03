const { getPool } = require('../../lib/db');
const { handleCors } = require('../../lib/cors');
const { requireAdmin } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const pool = getPool();

  // GET /api/regions
  if (req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT r.*, COUNT(rec.id) as nombre_recettes
        FROM regions r
        LEFT JOIN recipes rec ON r.id = rec.region_id
        GROUP BY r.id
        ORDER BY r.nom
      `);
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
      console.error('Erreur GET /api/regions:', error);
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // POST /api/regions (admin)
  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;

    try {
      const { nom, description, image_url, plats_typiques } = req.body;
      const result = await pool.query(`
        INSERT INTO regions (nom, description, image_url, plats_typiques)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [nom, description, image_url, plats_typiques]);

      return res.status(201).json({ success: true, message: 'Région créée avec succès', data: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
};
