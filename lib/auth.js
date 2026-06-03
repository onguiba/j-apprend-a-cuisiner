const jwt = require('jsonwebtoken');

/**
 * Vérifie le token JWT dans l'en-tête Authorization
 * Retourne { user } ou { error }
 */
function verifyToken(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Token manquant' };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-dev');
    return { user: decoded };
  } catch (err) {
    return { error: 'Token invalide ou expiré' };
  }
}

/**
 * Middleware : exige une authentification valide
 * Retourne true si OK, sinon envoie la réponse 401 et retourne false
 */
function requireAuth(req, res) {
  const { user, error } = verifyToken(req);
  if (error) {
    res.status(401).json({ success: false, message: error });
    return false;
  }
  req.user = user;
  return true;
}

/**
 * Middleware : exige le rôle admin
 */
function requireAdmin(req, res) {
  if (!requireAuth(req, res)) return false;
  if (req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs' });
    return false;
  }
  return true;
}

module.exports = { verifyToken, requireAuth, requireAdmin };
