const { getPool } = require('../../lib/db');
const { handleCors } = require('../../lib/cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const pool = getPool();

  try {
    const { nom, email, password } = req.body;

    if (!nom || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nom, email et mot de passe requis' });
    }

    // Vérifier si l'email existe déjà
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const result = await pool.query(
      `INSERT INTO users (nom, email, password_hash, role) VALUES ($1, $2, $3, 'user') RETURNING id, nom, email, role, created_at`,
      [nom, email, passwordHash]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret-dev',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      token,
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Erreur register:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
