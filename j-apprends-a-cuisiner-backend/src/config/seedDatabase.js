const pool = require('./database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Insertion des données initiales...');

    // Vider les tables (attention en production!)
    await client.query('TRUNCATE regions, users, recipes, favorites, comments RESTART IDENTITY CASCADE');

    // Insérer les régions
    const regionsResult = await client.query(`
      INSERT INTO regions (nom, description, image_url, plats_typiques) VALUES
      ('Adamaoua', 'Région des hauts plateaux et savanes', 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0', ARRAY['Viande grillée', 'Lait caillé', 'Bouillie de maïs']),
      ('Centre', 'Cœur culinaire du Cameroun', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', ARRAY['Poulet DG', 'Koki', 'Ngomba', 'Njama-Njama']),
      ('Est', 'Saveurs forestières authentiques', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', ARRAY['Poisson fumé', 'Chenilles', 'Manioc']),
      ('Extrême-Nord', 'Saveurs sahéliennes épicées', 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0', ARRAY['Couscous', 'Sauce gombo', 'Sauce oseille', 'Sauce tasba', 'Moringa', 'Lalo']),
      ('Littoral', 'Région côtière riche en fruits de mer', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5', ARRAY['Ndolé', 'Mbongo tchobi', 'Poisson braisé', 'Crevettes sautées']),
      ('Nord', 'Traditions pastorales et agricoles', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', ARRAY['Viande séchée', 'Bouillie de mil', 'Sauce arachide']),
      ('Nord-Ouest', 'Traditions montagnardes anglophones', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', ARRAY['Fufu corn', 'Njama-Njama', 'Water fufu', 'Achu soup']),
      ('Ouest', 'Hauts plateaux aux saveurs authentiques', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445', ARRAY['Achu', 'Taro sauce jaune', 'Njapché', 'Taro pilé']),
      ('Sud', 'Richesses forestières du sud', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', ARRAY['Poisson d''eau douce', 'Bâton de manioc', 'Feuilles de manioc']),
      ('Sud-Ouest', 'Richesses forestières et côtières anglophones', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', ARRAY['Eru', 'Kati-kati', 'Mets de pistaches', 'Pepper soup', 'Plantain frit']),
      ('Autre', 'Spécialités régionales et recettes fusion', 'https://images.unsplash.com/photo-1495521821757-a1efb6729352', ARRAY['Tchiep', 'Foutou sauce graine', 'Recettes spéciales'])
      RETURNING id;
    `);
    console.log('✅ Régions insérées');

    // Créer les comptes utilisateurs professionnels
    const hashedAdminPassword = await bcrypt.hash('Admin@2024!', 10);
    const hashedChefPassword = await bcrypt.hash('Chef@2024!', 10);
    
    await client.query(`
      INSERT INTO users (nom, email, password_hash, role) VALUES
      ('Administrateur Principal', 'admin@japprends.cm', $1, 'admin'),
      ('Chef Marie Nguema', 'marie@japprends.cm', $2, 'user'),
      ('Chef Paul Kamga', 'paul@japprends.cm', $2, 'user'),
      ('Chef Aïcha Bello', 'aicha@japprends.cm', $2, 'user'),
      ('Chef Ebenezer Sone', 'ebenezer@japprends.cm', $2, 'user')
    `, [hashedAdminPassword, hashedChefPassword]);
    console.log('✅ Utilisateurs créés');
    console.log('');
    console.log('📧 COMPTES CRÉÉS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 ADMIN:');
    console.log('   Email: admin@japprends.cm');
    console.log('   Mot de passe: Admin@2024!');
    console.log('');
    console.log('👨‍🍳 CHEFS:');
    console.log('   Email: marie@japprends.cm');
    console.log('   Email: paul@japprends.cm');
    console.log('   Email: aicha@japprends.cm');
    console.log('   Email: ebenezer@japprends.cm');
    console.log('   Mot de passe (tous): Chef@2024!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    // Insérer les recettes organisées par région
    await client.query(`
      INSERT INTO recipes (titre, description, ingredients, instructions, region_id, image_url, video_url, subtitle_url, temps_preparation, difficulte, auteur) VALUES
      
      -- RÉGION CENTRE (id: 2)
      ('Ngomba de Poisson d''Eau Douce', 'Feuilles de ngomba avec poisson frais', 'Feuilles de ngomba, poisson d''eau douce, huile de palme, oignons, ail, piment', 'Nettoyer les feuilles de ngomba. Préparer le poisson. Faire mijoter avec l''huile de palme et les épices.', 2, '/images/centre/Ngomba de poisson d''eau douce.jpeg', NULL, NULL, 45, 'Moyen', 'Chef Marie'),
      ('Njama-Njama du Centre', 'Légumes verts traditionnels du Centre', 'Feuilles de njama-njama, arachides, huile, oignons, ail, épices', 'Faire bouillir les feuilles. Préparer la pâte d''arachides. Mélanger et laisser mijoter.', 2, '/images/centre/Njama- Njama.jpeg', NULL, NULL, 45, 'Facile', 'Chef Marie'),
      
      -- RÉGION EXTRÊME-NORD (id: 4)
      ('Sauce Gombo', 'Sauce gombo traditionnelle du Sahel', 'Gombo frais, viande, huile, oignons, tomates, épices', 'Couper le gombo. Faire revenir avec la viande et les légumes. Laisser mijoter.', 4, '/images/extreme-nord/Sauce gombo.jpeg', NULL, NULL, 45, 'Facile', 'Chef Aïcha'),
      ('Sauce Oseille (Foloré) avec Couscous', 'Sauce oseille accompagnée de couscous traditionnel', 'Feuilles d''oseille (foloré), viande, huile, oignons, tomates, couscous de mil', 'Nettoyer les feuilles d''oseille. Préparer la sauce avec la viande. Servir avec le couscous de mil cuit à la vapeur.', 4, '/images/extreme-nord/sauce_oseille peparé.jpg', '/videos/extreme-nord/sauce foloré avec couscous.mp4', NULL, 45, 'Moyen', 'Chef Aïcha'),
      ('Sauce Tasba', 'Sauce traditionnelle à base de feuilles séchées', 'Feuilles de tasba, viande, huile, oignons, tomates, épices', 'Réhydrater les feuilles de tasba. Préparer avec la viande dans une sauce épicée.', 4, '/images/extreme-nord/Sauce tasba.jpeg', NULL, NULL, 45, 'Moyen', 'Chef Aïcha'),
      ('Moringa Préparé', 'Feuilles de moringa nutritives', 'Feuilles de moringa, viande ou poisson, huile, oignons, tomates', 'Nettoyer les feuilles de moringa. Cuire avec les protéines et les épices.', 4, '/images/extreme-nord/moringa prparé.jpg', NULL, NULL, 40, 'Facile', 'Chef Aïcha'),
      ('Sauce Lalo (Feuilles de Baobab)', 'Sauce aux feuilles de baobab séchées', 'Feuilles de baobab séchées, viande, huile, oignons, tomates, épices', 'Réhydrater les feuilles de baobab. Préparer une sauce onctueuse avec la viande.', 4, '/images/extreme-nord/sauce+feuilles+baobab+ou+lalo   1.webp', NULL, NULL, 45, 'Moyen', 'Chef Aïcha'),
      
      -- RÉGION LITTORAL (id: 5)
      ('Ndolé Royal', 'Feuilles amères, arachides, crevettes et poisson fumé', 'Feuilles de ndolé, arachides, crevettes, poisson fumé, huile de palme, oignons, ail, gingembre', 'Faire bouillir les feuilles de ndolé. Préparer la pâte d''arachides. Faire revenir les oignons, ajouter la pâte d''arachides, puis les feuilles et les protéines.', 5, '/images/littoral/ndolé.jpeg', '/videos/littoral/ndole-royal.mp4', '/subtitles/exemple-ndole.vtt', 45, 'Moyen', 'Chef Ebenezer'),
      ('Mbongo Tchobi', 'Poisson dans une sauce noire épicée', 'Poisson, mbongo (épice noire), oignons, tomates, piment, huile', 'Préparer la sauce mbongo. Faire cuire le poisson dans cette sauce noire parfumée.', 5, '/images/littoral/Mbongo tchobi.jpeg', NULL, NULL, 45, 'Difficile', 'Chef Ebenezer'),
      
      -- RÉGION NORD (id: 6)
      ('Sauce Boko', 'Sauce traditionnelle du Nord à base de feuilles', 'Feuilles de boko, viande, huile, oignons, tomates, épices', 'Préparer les feuilles de boko. Faire mijoter avec la viande et les épices dans une sauce savoureuse.', 6, '/images/nord/sauce-boko.jpg', '/videos/sauce boko.mp4', NULL, 45, 'Moyen', 'Chef Amadou'),
      
      -- RÉGION NORD-OUEST (id: 7)
      ('Njama-Njama du Nord-Ouest', 'Légumes verts traditionnels anglophones', 'Feuilles de njama-njama, arachides, huile, oignons, ail, épices', 'Faire bouillir les feuilles. Préparer la pâte d''arachides. Mélanger et laisser mijoter.', 7, '/images/nord-ouest/Njama- Njama.jpeg', NULL, NULL, 45, 'Facile', 'Chef Paul'),
      
      -- RÉGION OUEST (id: 8)
      ('Achu Traditionnel', 'Taro pilé accompagné de sauce jaune épicée', 'Taro, huile de palme, poisson fumé, crevettes séchées, feuilles de légumes, épices locales', 'Cuire le taro jusqu''à tendreté. Piler jusqu''à obtenir une pâte lisse. Préparer la sauce jaune avec l''huile de palme et les épices.', 8, '/images/ouest/Atchu.jpeg', '/videos/ouest/achu-traditionnel.mp4', '/subtitles/exemple-achu.vtt', 45, 'Avancé', 'Chef Paul'),
      ('Njapché', 'Haricots rouges mijotés avec huile de palme', 'Haricots rouges, huile de palme, oignons, ail, piment, épices', 'Faire tremper les haricots. Les cuire avec l''huile de palme et les épices jusqu''à tendreté.', 8, '/images/ouest/Njapché.jpeg', '/videos/ouest/ndjapche.mp4', NULL, 45, 'Moyen', 'Chef Paul'),
      ('Taro Sauce Jaune', 'Taro accompagné de sauce jaune épicée', 'Taro, huile de palme, poisson fumé, épices, légumes', 'Cuire le taro. Préparer la sauce jaune avec l''huile de palme rouge et les épices.', 8, '/images/ouest/Taro sauce jaune.jpeg', NULL, NULL, 45, 'Moyen', 'Chef Paul'),
      
      -- RÉGION SUD-OUEST (id: 10)
      ('Eru Spécial', 'Légumes verts traditionnels du Sud-Ouest', 'Feuilles d''eru, poisson fumé, crevettes, huile de palme, épices', 'Nettoyer les feuilles d''eru. Préparer avec le poisson fumé et les crevettes dans une sauce parfumée.', 10, '/images/sud-ouest/Eru and water fufu.jpeg', NULL, NULL, 40, 'Moyen', 'Chef Brice'),
      ('Kati-Kati', 'Poulet grillé épicé du Sud-Ouest', 'Poulet, piment, oignons, tomates, épices locales', 'Mariner le poulet avec les épices. Griller jusqu''à obtenir une belle coloration dorée.', 10, '/images/sud-ouest/Kati- kati.jpeg', NULL, NULL, 35, 'Facile', 'Chef Brice'),
      ('Mets de Pistaches', 'Sauce aux pistaches traditionnelle', 'Pistaches, viande ou poisson, huile, oignons, tomates, épices', 'Moudre les pistaches. Préparer une sauce onctueuse avec les protéines.', 10, '/images/sud-ouest/Mets de pistaches.jpeg', NULL, NULL, 45, 'Moyen', 'Chef Brice'),
      
      -- RÉGION AUTRE (id: 11)
      ('Tchiep', 'Riz traditionnel avec viande et légumes', 'Riz, viande, oignons, tomates, carottes, épices, huile', 'Faire revenir la viande avec les oignons. Ajouter le riz et les légumes. Laisser cuire jusqu''à absorption du liquide.', 11, '/images/autre/tchiep.jpeg', '/videos/autre/tchiep.mp4', NULL, 45, 'Moyen', 'Chef Traditionnel'),
      ('Foutou Sauce Graine', 'Foutou accompagné de sauce graine riche', 'Bananes plantains, igname ou manioc, sauce graine, viande, épices', 'Cuire et piler les bananes plantains ou l''igname. Préparer la sauce graine avec la viande et les épices. Servir ensemble.', 11, '/images/autre/foutou-sauce-graine.jpeg', '/videos/autre/foutou-sauce-graine.mp4', NULL, 45, 'Moyen', 'Chef Traditionnel'),
      
      -- RECETTE SPÉCIALE SANTÉ
      ('Bouna pour Diabétiques', 'Recette nutritive et équilibrée pour diabétiques - Bouillie de légumes sains', '1 melon mûr ou citrouille, 2 carottes, 3 pommes de terre, 1 oignon, 1 demi poivron, 40 g de beurre de chèvre, 1 pincée de sel, 1 pincée de poivre, 1 litre d''eau, Un peu de lait de soja', 'Mettre tous les ingrédients dans une casserole à feu doux. Laisser cuire jusqu''à ce que tous les légumes soient tendres. Réduire en bouillie lisse. Ajouter un peu de lait de soja pour la texture finale. Servir chaud.', 2, '/images/centre/bouna-diabetique.jpeg', '/videos/centre/bouna-diabetique.mp4', NULL, 45, 'Facile', 'Chef Marie')
    `);
    console.log('✅ Recettes insérées');

    console.log('🎉 Données initiales insérées avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
