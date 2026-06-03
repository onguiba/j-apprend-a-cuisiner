const { run } = require('./database-sqlite');

async function createTables() {
  try {
    console.log('📋 Création des tables...');

    // Table users
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
    console.log('✅ Table users créée');

    // Table password_reset_tokens
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
    console.log('✅ Table password_reset_tokens créée');

    // Table regions
    await run(`
      CREATE TABLE IF NOT EXISTS regions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table regions créée');

    // Table recipes
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
        FOREIGN KEY (region_id) REFERENCES regions(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);
    console.log('✅ Table recipes créée');

    console.log('✨ Toutes les tables ont été créées avec succès!');
  } catch (error) {
    console.error('❌ Erreur création tables:', error);
    throw error;
  }
}

// Exécuter l'initialisation
createTables().then(() => {
  console.log('🎉 Base de données initialisée!');
  process.exit(0);
}).catch((error) => {
  console.error('🚫 Erreur:', error);
  process.exit(1);
});
