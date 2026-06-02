const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const pool = require('./database');
const jwt = require('jsonwebtoken');

// Configuration de la stratégie Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'YOUR_FACEBOOK_APP_SECRET',
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      const nom = profile.displayName;
      const facebookId = profile.id;
      const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

      if (!email) {
        return done(null, false, { message: 'Email non fourni par Facebook' });
      }

      // Vérifier si l'utilisateur existe déjà
      let result = await pool.query(
        'SELECT * FROM users WHERE email = $1 OR facebook_id = $2',
        [email, facebookId]
      );

      let user;

      if (result.rows.length > 0) {
        // Utilisateur existe, mettre à jour les infos Facebook si nécessaire
        user = result.rows[0];
        
        if (!user.facebook_id) {
          await pool.query(
            'UPDATE users SET facebook_id = $1, avatar_url = COALESCE(avatar_url, $2) WHERE id = $3',
            [facebookId, avatarUrl, user.id]
          );
        }
      } else {
        // Créer un nouvel utilisateur
        result = await pool.query(
          `INSERT INTO users (nom, email, facebook_id, avatar_url, role, password_hash)
           VALUES ($1, $2, $3, $4, 'user', '')
           RETURNING *`,
          [nom, email, facebookId, avatarUrl]
        );
        user = result.rows[0];
      }

      // Générer le token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      user.token = token;
      return done(null, user);
    } catch (error) {
      console.error('Erreur Facebook OAuth:', error);
      return done(error, null);
    }
  }
));

// Sérialisation de l'utilisateur
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Désérialisation de l'utilisateur
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query(
      'SELECT id, nom, email, role, avatar_url FROM users WHERE id = $1',
      [id]
    );
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
