const { getPool } = require('../../lib/db');
const { handleCors } = require('../../lib/cors');
const { requireAuth, requireAdmin } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const pool = getPool();

  // GET /api/recipes
  if (req.method === 'GET') {
    try {
      const { region, search, difficulty } = req.query;

      let query = `
        SELECT r.*, reg.nom as region_nom 
        FROM recipes r
        LEFT JOIN regions reg ON r.region_id = reg.id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (region) {
        query += ` AND reg.nom = $${paramCount}`;
        params.push(region);
        paramCount++;
      }
      if (search) {
        query += ` AND (r.titre ILIKE $${paramCount} OR r.description ILIKE $${paramCount})`;
        params.push(`%${search}%`);
        paramCount++;
      }
      if (difficulty) {
        query += ` AND r.difficulte = $${paramCount}`;
        params.push(difficulty);
        paramCount++;
      }

      query += ' ORDER BY r.created_at DESC';

      const result = await pool.query(query, params);
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
      console.error('Erreur GET /api/recipes:', error);
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // POST /api/recipes (admin uniquement)
  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;

    try {
      const { titre, description, ingredients, instructions, region_id, image_url, video_url, subtitle_url, temps_preparation, difficulte, auteur } = req.body;

      const result = await pool.query(`
        INSERT INTO recipes (titre, description, ingredients, instructions, region_id, image_url, video_url, subtitle_url, temps_preparation, difficulte, auteur)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [titre, description, ingredients, instructions, region_id, image_url, video_url, subtitle_url, temps_preparation, difficulte, auteur]);

      return res.status(201).json({ success: true, message: 'Recette créée avec succès', data: result.rows[0] });
    } catch (error) {
      console.error('Erreur POST /api/recipes:', error);
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
};
