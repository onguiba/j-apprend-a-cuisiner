const pool = require('../config/database');

// Récupérer toutes les recettes
exports.getAllRecipes = async (req, res) => {
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
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur getAllRecipes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des recettes',
      error: error.message
    });
  }
};

// Récupérer une recette par ID
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT r.*, reg.nom as region_nom 
      FROM recipes r
      LEFT JOIN regions reg ON r.region_id = reg.id
      WHERE r.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Recette non trouvée'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur getRecipeById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la recette',
      error: error.message
    });
  }
};

// Créer une nouvelle recette
exports.createRecipe = async (req, res) => {
  try {
    const {
      titre,
      description,
      ingredients,
      instructions,
      region_id,
      image_url,
      video_url,
      subtitle_url,
      temps_preparation,
      difficulte,
      auteur
    } = req.body;

    const result = await pool.query(`
      INSERT INTO recipes (
        titre, description, ingredients, instructions, region_id,
        image_url, video_url, subtitle_url, temps_preparation, difficulte, auteur
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      titre, description, ingredients, instructions, region_id,
      image_url, video_url, subtitle_url, temps_preparation, difficulte, auteur
    ]);

    res.status(201).json({
      success: true,
      message: 'Recette créée avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur createRecipe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la recette',
      error: error.message
    });
  }
};

// Mettre à jour une recette
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
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

    const query = `
      UPDATE recipes 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Recette non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Recette mise à jour avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur updateRecipe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la recette',
      error: error.message
    });
  }
};

// Supprimer une recette
exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM recipes WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Recette non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Recette supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteRecipe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la recette',
      error: error.message
    });
  }
};

// Récupérer les recettes par région
exports.getRecipesByRegion = async (req, res) => {
  try {
    const { regionId } = req.params;

    const result = await pool.query(`
      SELECT r.*, reg.nom as region_nom 
      FROM recipes r
      LEFT JOIN regions reg ON r.region_id = reg.id
      WHERE r.region_id = $1
      ORDER BY r.created_at DESC
    `, [regionId]);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur getRecipesByRegion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des recettes',
      error: error.message
    });
  }
};
