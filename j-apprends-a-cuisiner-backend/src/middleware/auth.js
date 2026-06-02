const jwt = require('jsonwebtoken');

// Vérifier le token JWT
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token depuis le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token manquant'
      });
    }

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token invalide'
      });
    }
  } catch (error) {
    console.error('Erreur middleware protect:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification',
      error: error.message
    });
  }
};

// Vérifier si l'utilisateur est admin
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Accès refusé - Droits administrateur requis'
    });
  }
};

// Vérifier si l'utilisateur est propriétaire ou admin
exports.ownerOrAdmin = (req, res, next) => {
  const resourceUserId = parseInt(req.params.userId || req.body.userId);
  
  if (req.user.role === 'admin' || req.user.id === resourceUserId) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Accès refusé - Vous n\'êtes pas autorisé à effectuer cette action'
    });
  }
};
