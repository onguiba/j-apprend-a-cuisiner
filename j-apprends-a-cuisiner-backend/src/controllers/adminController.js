const { run, get, all } = require('../config/database-sqlite');
const bcrypt = require('bcryptjs');

// Dashboard - Statistiques
exports.getDashboard = async (req, res) => {
  try {
    const stats = await get(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM recipes) as total_recipes,
        (SELECT COUNT(*) FROM regions) as total_regions
    `);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erreur getDashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur dashboard',
      error: error.message
    });
  }
};

// Gestion des utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const result = await all(`
      SELECT id, nom, email, role, avatar_url, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error('Erreur getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur recup users',
      error: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await get(`SELECT id, nom, email, role FROM users WHERE id = ?`, [id]);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erreur getUserById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur recup user',
      error: error.message
    });
  }
};

exports.promoteToAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await run(`UPDATE users SET role = 'admin', updated_at = datetime('now') WHERE id = ?`, [id]);

    const result = await get('SELECT id, nom, email, role FROM users WHERE id = ?', [id]);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur promu admin',
      data: result
    });
  } catch (error) {
    console.error('Erreur promoteToAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur promotion',
      error: error.message
    });
  }
};

exports.demoteToUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de se rétrograder'
      });
    }

    await run(`UPDATE users SET role = 'user', updated_at = datetime('now') WHERE id = ?`, [id]);

    const result = await get('SELECT id, nom, email, role FROM users WHERE id = ?', [id]);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Administrateur rétrogradé',
      data: result
    });
  } catch (error) {
    console.error('Erreur demoteToUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur rétrogradation',
      error: error.message
    });
  }
};
