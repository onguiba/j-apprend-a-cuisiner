const { getPool } = require('../../lib/db');
const { handleCors } = require('../../lib/cors');
const { requireAdmin } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const pool = getPool();
  const { id } = req.query;

  // GET /api/recipes/:id
  if (req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT r.*, reg.nom as region_nom 
        FROM recipes r
        LEFT JOIN regions reg ON r.region_id = reg.id
        WHERE r.id = $1
      `, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Recette non trouvée' });
      }
      return res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // PUT /api/recipes/:id (admin)
  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;

    try {
      const updates = req.body;
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updates).forEach(key => {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      });

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const result = await pool.query(
        `UPDATE recipes SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Recette non trouvée' });
      }
      return res.json({ success: true, message: 'Recette mise à jour', data: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // DELETE /api/recipes/:id (admin)
  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;

    try {
      const result = await pool.query('DELETE FROM recipes WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Recette non trouvée' });
      }
      return res.json({ success: true, message: 'Recette supprimée avec succès' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
};
