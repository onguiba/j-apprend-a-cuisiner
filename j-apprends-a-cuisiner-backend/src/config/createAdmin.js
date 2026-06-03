const { run, get } = require('./database-sqlite');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    console.log('Creando usuario admin...');

    // Verificar si el admin ya existe
    const existingAdmin = await get('SELECT id FROM users WHERE email = ?', ['admin@japprends.cm']);

    if (existingAdmin) {
      console.log('✅ Admin ya existe');
      process.exit(0);
    }

    // Crear el admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    await run(
      'INSERT INTO users (nom, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
      ['Admin User', 'admin@japprends.cm', passwordHash, 'admin']
    );

    console.log('✅ Admin creado exitosamente');
    console.log('Email: admin@japprends.cm');
    console.log('Contraseña: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando admin:', error);
    process.exit(1);
  }
}

createAdmin();
