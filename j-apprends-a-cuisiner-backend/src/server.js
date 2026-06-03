const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('./config/passport');
require('dotenv').config();

const recipeRoutes = require('./routes/recipeRoutes');
const regionRoutes = require('./routes/regionRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const { seedCompleteRecipes } = require('./config/completeRecipesData');
const { seedRecipesWithVideos } = require('./config/recipesWithVideos');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar base de datos SQLite
const { run } = require('./config/database-sqlite');

async function initializeDatabase() {
  try {
    console.log('🗄️ Inicializando base de datos SQLite...');
    
    // Crear tablas si no existen
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        avatar_url TEXT,
        facebook_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        used INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS regions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        description TEXT,
        ingredients TEXT,
        instructions TEXT,
        temps_preparation INTEGER,
        temps_cuisson INTEGER,
        difficulte TEXT,
        region_id INTEGER,
        image_url TEXT,
        video_url TEXT,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        FOREIGN KEY (region_id) REFERENCES regions(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    console.log('✅ Base de datos SQLite inicializada');
  } catch (error) {
    console.error('❌ Error inicializando BD:', error);
  }
}

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:5176',
      'http://127.0.0.1:5177',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (para Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'votre-secret-session-tres-securise',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API NLAMB-SARRE',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      recipes: '/api/recipes',
      regions: '/api/regions',
      subscriptions: '/api/subscriptions'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error servidor:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Inicializar servidor
initializeDatabase().then(() => {
  // Ajouter les recettes complètes et vidéos
  seedCompleteRecipes().catch(err => console.error('Erreur recettes:', err));
  seedRecipesWithVideos().catch(err => console.error('Erreur vidéos:', err));
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
});

// Manejo del cierre graceful
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido, apagando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT recibido, apagando servidor...');
  process.exit(0);
});

module.exports = app;
