const { getPool } = require('../../../lib/db');
const { handleCors } = require('../../../lib/cors');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const pool = getPool();
  const { regionId } = req.query;

  try {
    const result = await pool.query(`
      SELECT r.*, reg.nom as region_nom 
      FROM recipes r
      LEFT JOIN regions reg ON r.region_id = reg.id
      WHERE r.region_id = $1
      ORDER BY r.created_at DESC
    `, [regionId]);

    return res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Erreur recipes/region:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
