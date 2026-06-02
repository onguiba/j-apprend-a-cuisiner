const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendPasswordChangedEmail } = require('../config/email');

// Inscription
exports.register = async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const result = await pool.query(
      `INSERT INTO users (nom, email, password_hash, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, nom, email, role, created_at`,
      [nom, email, passwordHash]
    );

    const user = result.rows[0];

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const user = result.rows[0];

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// Connexion avec Facebook - Callback
exports.facebookCallback = (req, res) => {
  try {
    const user = req.user;
    const token = user.token;

    // Rediriger vers le frontend avec le token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url
    }))}`);
  } catch (error) {
    console.error('Erreur Facebook callback:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=auth_failed`);
  }
};

// Lier un compte Facebook existant
exports.linkFacebook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { facebookId, avatarUrl } = req.body;

    await pool.query(
      'UPDATE users SET facebook_id = $1, avatar_url = COALESCE(avatar_url, $2) WHERE id = $3',
      [facebookId, avatarUrl, userId]
    );

    res.json({
      success: true,
      message: 'Compte Facebook lié avec succès'
    });
  } catch (error) {
    console.error('Erreur linkFacebook:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la liaison du compte Facebook',
      error: error.message
    });
  }
};

// Obtenir le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, nom, email, role, avatar_url, facebook_id, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nom, avatar_url } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET nom = COALESCE($1, nom),
           avatar_url = COALESCE($2, avatar_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, nom, email, role, avatar_url`,
      [nom, avatar_url, userId]
    );

    res.json({
      success: true,
      message: 'Profil mis à jour',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};

// Changer le mot de passe
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Récupérer l'utilisateur
    const result = await pool.query(
      'SELECT password_hash, email, nom FROM users WHERE id = $1',
      [userId]
    );

    const user = result.rows[0];

    // Vérifier le mot de passe actuel
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Mettre à jour
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userId]
    );

    // Envoyer email de confirmation
    try {
      await sendPasswordChangedEmail(user.email, user.nom);
    } catch (emailError) {
      console.error('Erreur envoi email confirmation:', emailError);
      // Ne pas bloquer la réponse si l'email échoue
    }

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    console.error('Erreur changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe',
      error: error.message
    });
  }
};

// Demander la réinitialisation du mot de passe
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier si l'utilisateur existe
    const result = await pool.query(
      'SELECT id, nom, email FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return res.json({
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
      });
    }

    const user = result.rows[0];

    // Générer un token sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Expiration dans 1 heure
    const expiresAt = new Date(Date.now() + 3600000);

    // Supprimer les anciens tokens non utilisés de cet utilisateur
    await pool.query(
      'DELETE FROM password_reset_tokens WHERE user_id = $1 AND used = FALSE',
      [user.id]
    );

    // Sauvegarder le token dans la base de données
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, hashedToken, expiresAt]
    );

    // Envoyer l'email avec le token non hashé
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.nom);
      
      res.json({
        success: true,
        message: 'Un email de réinitialisation a été envoyé à votre adresse'
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      
      // Supprimer le token si l'email n'a pas pu être envoyé
      await pool.query(
        'DELETE FROM password_reset_tokens WHERE token = $1',
        [hashedToken]
      );
      
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email. Vérifiez votre configuration email.'
      });
    }
  } catch (error) {
    console.error('Erreur forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la demande de réinitialisation',
      error: error.message
    });
  }
};

// Réinitialiser le mot de passe avec le token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token et nouveau mot de passe requis'
      });
    }

    // Hasher le token reçu pour le comparer
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Vérifier le token
    const tokenResult = await pool.query(
      `SELECT prt.*, u.id as user_id, u.email, u.nom 
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = $1 AND prt.used = FALSE AND prt.expires_at > NOW()`,
      [hashedToken]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    const tokenData = tokenResult.rows[0];

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [passwordHash, tokenData.user_id]
    );

    // Marquer le token comme utilisé
    await pool.query(
      'UPDATE password_reset_tokens SET used = TRUE WHERE token = $1',
      [hashedToken]
    );

    // Envoyer email de confirmation
    try {
      await sendPasswordChangedEmail(tokenData.email, tokenData.nom);
    } catch (emailError) {
      console.error('Erreur envoi email confirmation:', emailError);
    }

    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });
  } catch (error) {
    console.error('Erreur resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation du mot de passe',
      error: error.message
    });
  }
};

// Vérifier la validité d'un token de réinitialisation
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token requis'
      });
    }

    // Hasher le token reçu
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Vérifier le token
    const result = await pool.query(
      'SELECT * FROM password_reset_tokens WHERE token = $1 AND used = FALSE AND expires_at > NOW()',
      [hashedToken]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    res.json({
      success: true,
      message: 'Token valide'
    });
  } catch (error) {
    console.error('Erreur verifyResetToken:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du token',
      error: error.message
    });
  }
};

