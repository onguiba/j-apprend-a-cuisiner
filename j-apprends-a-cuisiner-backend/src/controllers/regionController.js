const pool = require('../config/database');

// Récupérer toutes les régions
exports.getAllRegions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, COUNT(rec.id) as nombre_recettes
      FROM regions r
      LEFT JOIN recipes rec ON r.id = rec.region_id
      GROUP BY r.id
      ORDER BY r.nom
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur getAllRegions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des régions',
      error: error.message
    });
  }
};

// Récupérer une région par ID
exports.getRegionById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT r.*, COUNT(rec.id) as nombre_recettes
      FROM regions r
      LEFT JOIN recipes rec ON r.id = rec.region_id
      WHERE r.id = $1
      GROUP BY r.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Région non trouvée'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur getRegionById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la région',
      error: error.message
    });
  }
};

// Créer une nouvelle région
exports.createRegion = async (req, res) => {
  try {
    const { nom, description, image_url, plats_typiques } = req.body;

    const result = await pool.query(`
      INSERT INTO regions (nom, description, image_url, plats_typiques)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [nom, description, image_url, plats_typiques]);

    res.status(201).json({
      success: true,
      message: 'Région créée avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur createRegion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la région',
      error: error.message
    });
  }
};

// Mettre à jour une région
exports.updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
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
      return res.status(404).json({
        success: false,
        message: 'Région non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Région mise à jour avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur updateRegion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la région',
      error: error.message
    });
  }
};

// Supprimer une région
exports.deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM regions WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Région non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Région supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteRegion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la région',
      error: error.message
    });
  }
};
