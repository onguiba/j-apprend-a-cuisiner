const { run, db } = require('./database-sqlite');

async function seedDatabase() {
  try {
    console.log('Sembrando BD...');

    // Agregar regiones
    const regiones = [
      { nom: 'Adamaoua', description: 'Région savane', image_url: 'adamaoua.jpg' },
      { nom: 'Centre', description: 'Région central', image_url: 'centre.jpg' },
      { nom: 'Est', description: 'Région este', image_url: 'est.jpg' },
      { nom: 'Extrême-Nord', description: 'Región norte', image_url: 'extreme-nord.jpg' },
      { nom: 'Littoral', description: 'Región costera', image_url: 'littoral.jpg' },
      { nom: 'Nord', description: 'Región norte', image_url: 'nord.jpg' },
      { nom: 'Nord-Ouest', description: 'Región noroeste', image_url: 'nord-ouest.jpg' },
      { nom: 'Ouest', description: 'Región oeste', image_url: 'ouest.jpg' },
      { nom: 'Sud', description: 'Región sur', image_url: 'sud.jpg' },
      { nom: 'Sud-Ouest', description: 'Región sudoeste', image_url: 'sud-ouest.jpg' }
    ];

    for (const region of regiones) {
      try {
        await run(
          'INSERT INTO regions (nom, description, image_url, created_at) VALUES (?, ?, ?, datetime("now"))',
          [region.nom, region.description, region.image_url]
        );
        console.log(`✅ Región ${region.nom} agregada`);
      } catch (err) {
        // Región ya existe
      }
    }

    // Agregar algunas recetas de ejemplo
    const recetas = [
      {
        titre: 'Ndolé',
        description: 'Plato tradicional camerunés hecho con bitterleaves',
        ingredients: JSON.stringify(['Ndolé (bitterleaves)', 'Camarones', 'Carne', 'Maní molido', 'Cebolla', 'Ajo']),
        instructions: JSON.stringify(['Limpiar las hojas', 'Cocinar con camarones y carne', 'Mezclar con pasta de maní']),
        temps_preparation: 30,
        temps_cuisson: 45,
        difficulte: 'Moyen',
        region_id: 2,
        image_url: 'ndole.jpg'
      },
      {
        titre: 'Mbongo Tchobi',
        description: 'Estofado camerunés con carne y especias',
        ingredients: JSON.stringify(['Carne de res', 'Pimienta camerunesa', 'Tomate', 'Cebolla', 'Especias']),
        instructions: JSON.stringify(['Dorar la carne', 'Agregar especias', 'Cocinar a fuego lento']),
        temps_preparation: 20,
        temps_cuisson: 60,
        difficulte: 'Moyen',
        region_id: 4,
        image_url: 'mbongo.jpg'
      },
      {
        titre: 'Jama Rice',
        description: 'Arroz con vegetales y carne',
        ingredients: JSON.stringify(['Arroz', 'Zanahoria', 'Chícharo', 'Carne picada', 'Cebolla']),
        instructions: JSON.stringify(['Cocinar el arroz', 'Saltear vegetales', 'Mezclar todo']),
        temps_preparation: 15,
        temps_cuisson: 30,
        difficulte: 'Facile',
        region_id: 2,
        image_url: 'jama.jpg'
      }
    ];

    for (const receta of recetas) {
      try {
        await run(
          'INSERT INTO recipes (titre, description, ingredients, instructions, temps_preparation, temps_cuisson, difficulte, region_id, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime("now"))',
          [receta.titre, receta.description, receta.ingredients, receta.instructions, receta.temps_preparation, receta.temps_cuisson, receta.difficulte, receta.region_id, receta.image_url]
        );
        console.log(`✅ Receta ${receta.titre} agregada`);
      } catch (err) {
        // Receta ya existe
      }
    }

    console.log('✨ Siembra completada');
  } catch (error) {
    console.error('❌ Error sembrando BD:', error);
  }
}

seedDatabase().then(() => {
  process.exit(0);
}).catch(() => {
  process.exit(1);
});
