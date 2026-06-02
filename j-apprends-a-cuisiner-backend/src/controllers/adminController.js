const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Dashboard - Statistiques
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM recipes) as total_recipes,
        (SELECT COUNT(*) FROM regions) as total_regions,
        (SELECT COUNT(*) FROM comments) as total_comments,
        (SELECT COUNT(*) FROM favorites) as total_favorites
    `);

    // Recettes par région
    const recipesByRegion = await pool.query(`
      SELECT r.nom as region, COUNT(rec.id) as count
      FROM regions r
      LEFT JOIN recipes rec ON r.id = rec.region_id
      GROUP BY r.nom
      ORDER BY count DESC
    `);

    // Recettes récentes
    const recentRecipes = await pool.query(`
      SELECT r.*, reg.nom as region_nom
      FROM recipes r
      LEFT JOIN regions reg ON r.region_id = reg.id
      ORDER BY r.created_at DESC
      LIMIT 5
    `);

    // Utilisateurs récents
    const recentUsers = await pool.query(`
      SELECT id, nom, email, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        stats: stats.rows[0],
        recipesByRegion: recipesByRegion.rows,
        recentRecipes: recentRecipes.rows,
        recentUsers: recentUsers.rows
      }
    });
  } catch (error) {
    console.error('Erreur getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// Gestion des utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nom, email, role, avatar_url, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT id, nom, email, role, avatar_url, created_at, updated_at
      FROM users
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur getUserById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error: error.message
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { nom, email, password, role } = req.body;

    // Vérifier si l'email existe déjà
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(`
      INSERT INTO users (nom, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nom, email, role, created_at
    `, [nom, email, passwordHash, role || 'user']);

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur createUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, email, role, avatar_url } = req.body;

    const result = await pool.query(`
      UPDATE users
      SET nom = COALESCE($1, nom),
          email = COALESCE($2, email),
          role = COALESCE($3, role),
          avatar_url = COALESCE($4, avatar_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, nom, email, role, avatar_url
    `, [nom, email, role, avatar_url, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur mis à jour',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur updateUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Ne pas permettre la suppression de son propre compte
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: error.message
    });
  }
};

// Gestion des commentaires
exports.getAllComments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.nom as user_nom, r.titre as recipe_titre
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN recipes r ON c.recipe_id = r.id
      ORDER BY c.created_at DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur getAllComments:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commentaires',
      error: error.message
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Commentaire non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Commentaire supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteComment:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du commentaire',
      error: error.message
    });
  }
};

// Promouvoir un utilisateur en admin
exports.promoteToAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE users
      SET role = 'admin', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, nom, email, role
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur promu administrateur',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur promoteToAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la promotion',
      error: error.message
    });
  }
};

// Rétrograder un admin en utilisateur
exports.demoteToUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Ne pas permettre de se rétrograder soi-même
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas vous rétrograder vous-même'
      });
    }

    const result = await pool.query(`
      UPDATE users
      SET role = 'user', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, nom, email, role
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Administrateur rétrogradé en utilisateur',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur demoteToUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la rétrogradation',
      error: error.message
    });
  }
};
