const { run, get, all } = require('../config/database-sqlite');

exports.getAllRecipes = async (req, res) => {
  try {
    const { region, search, difficulty } = req.query;
    let query = 'SELECT * FROM recipes WHERE 1=1';
    let params = [];

    if (region) {
      query += ' AND region_id = ?';
      params.push(region);
    }

    if (search) {
      query += ' AND (titre LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (difficulty) {
      query += ' AND difficulte = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY created_at DESC';

    const recipes = await all(query, params);

    res.json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Erreur getAllRecipes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur recup recettes',
      error: error.message
    });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await get('SELECT * FROM recipes WHERE id = ?', [id]);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recette non trouvée'
      });
    }

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Erreur getRecipeById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur recup recette',
      error: error.message
    });
  }
};

exports.getRecipesByRegion = async (req, res) => {
  try {
    const { regionId } = req.params;
    const recipes = await all(
      'SELECT * FROM recipes WHERE region_id = ? ORDER BY created_at DESC',
      [regionId]
    );

    res.json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Erreur getRecipesByRegion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur recup recettes région',
      error: error.message
    });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const { titre, description, ingredients, instructions, temps_preparation, temps_cuisson, difficulte, region_id, image_url } = req.body;

    const result = await run(`
      INSERT INTO recipes (titre, description, ingredients, instructions, temps_preparation, temps_cuisson, difficulte, region_id, image_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, [titre, description, JSON.stringify(ingredients), JSON.stringify(instructions), temps_preparation, temps_cuisson, difficulte, region_id, image_url]);

    const recipe = await get('SELECT * FROM recipes WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Recette créée',
      data: recipe
    });
  } catch (error) {
    console.error('Erreur createRecipe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur création recette',
      error: error.message
    });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, ingredients, instructions, temps_preparation, temps_cuisson, difficulte, image_url } = req.body;

    await run(`
      UPDATE recipes
      SET titre = COALESCE(?, titre),
          description = COALESCE(?, description),
          ingredients = COALESCE(?, ingredients),
          instructions = COALESCE(?, instructions),
          temps_preparation = COALESCE(?, temps_preparation),
          temps_cuisson = COALESCE(?, temps_cuisson),
          difficulte = COALESCE(?, difficulte),
          image_url = COALESCE(?, image_url),
          updated_at = datetime('now')
      WHERE id = ?
    `, [titre, description, ingredients ? JSON.stringify(ingredients) : null, instructions ? JSON.stringify(instructions) : null, temps_preparation, temps_cuisson, difficulte, image_url, id]);

    const recipe = await get('SELECT * FROM recipes WHERE id = ?', [id]);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recette non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Recette mise à jour',
      data: recipe
    });
  } catch (error) {
    console.error('Erreur updateRecipe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur update recette',
      error: error.message
    });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    await run('DELETE FROM recipes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Recette supprimée'
    });
  } catch (error) {
    console.error('Erreur deleteRecipe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur suppression recette',
      error: error.message
    });
  }
};
