const { run } = require('./database-sqlite');
const bcrypt = require('bcryptjs');

async function setup() {
  try {
    console.log('⚙️ Configurando base de datos...');

    // Crear tablas
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

    console.log('✅ Tablas creadas');

    // Crear admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    try {
      await run(
        'INSERT INTO users (nom, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
        ['Admin', 'admin@japprends.cm', passwordHash, 'admin']
      );
      console.log('✅ Admin creado: admin@japprends.cm / admin123');
    } catch (err) {
      console.log('✅ Admin ya existe');
    }

    // Agregar regiones
    const regiones = [
      { nom: 'Adamaoua', description: 'Región savana' },
      { nom: 'Centre', description: 'Región central' },
      { nom: 'Est', description: 'Región este' },
      { nom: 'Extrême-Nord', description: 'Región norte extremo' },
      { nom: 'Littoral', description: 'Región costera' },
      { nom: 'Nord', description: 'Región norte' },
      { nom: 'Nord-Ouest', description: 'Región noroeste' },
      { nom: 'Ouest', description: 'Región oeste' },
      { nom: 'Sud', description: 'Región sur' },
      { nom: 'Sud-Ouest', description: 'Región sudoeste' }
    ];

    for (const region of regiones) {
      try {
        await run(
          'INSERT INTO regions (nom, description, created_at) VALUES (?, ?, datetime("now"))',
          [region.nom, region.description]
        );
      } catch (err) {
        // Ya existe
      }
    }

    console.log('✅ Regiones agregadas');

    // Agregar recetas de ejemplo
    const recetas = [
      {
        titre: 'Ndolé',
        description: 'Plato tradicional camerunés',
        temps_preparation: 30,
        temps_cuisson: 45,
        difficulte: 'Moyen',
        region_id: 2
      },
      {
        titre: 'Mbongo Tchobi',
        description: 'Estofado camerunés',
        temps_preparation: 20,
        temps_cuisson: 60,
        difficulte: 'Moyen',
        region_id: 4
      },
      {
        titre: 'Jama Rice',
        description: 'Arroz con vegetales',
        temps_preparation: 15,
        temps_cuisson: 30,
        difficulte: 'Facile',
        region_id: 2
      }
    ];

    for (const receta of recetas) {
      try {
        await run(
          'INSERT INTO recipes (titre, description, temps_preparation, temps_cuisson, difficulte, region_id, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now"))',
          [receta.titre, receta.description, receta.temps_preparation, receta.temps_cuisson, receta.difficulte, receta.region_id]
        );
      } catch (err) {
        // Ya existe
      }
    }

    console.log('✅ Recetas de ejemplo agregadas');
    console.log('🎉 Configuración completada');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setup();
