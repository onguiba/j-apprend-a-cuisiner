const { getPool } = require('../../lib/db');
const { handleCors } = require('../../lib/cors');
const { requireAdmin } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  if (!requireAdmin(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const pool = getPool();

  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM recipes) as total_recipes,
        (SELECT COUNT(*) FROM regions) as total_regions
    `);

    const recipesByRegion = await pool.query(`
      SELECT r.nom as region, COUNT(rec.id) as count
      FROM regions r
      LEFT JOIN recipes rec ON r.id = rec.region_id
      GROUP BY r.nom ORDER BY count DESC
    `);

    const recentRecipes = await pool.query(`
      SELECT r.*, reg.nom as region_nom FROM recipes r
      LEFT JOIN regions reg ON r.region_id = reg.id
      ORDER BY r.created_at DESC LIMIT 5
    `);

    const recentUsers = await pool.query(`
      SELECT id, nom, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5
    `);

    return res.json({
      success: true,
      data: {
        stats: stats.rows[0],
        recipesByRegion: recipesByRegion.rows,
        recentRecipes: recentRecipes.rows,
        recentUsers: recentUsers.rows
      }
    });
  } catch (error) {
    console.error('Erreur dashboard:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
