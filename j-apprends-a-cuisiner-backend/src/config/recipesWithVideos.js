const { run } = require('./database-sqlite');

async function seedRecipesWithVideos() {
  try {
    console.log('🎬 Intégration des recettes avec vidéos...');

    const recettes = [
      // RÉGION: LITTORAL
      {
        titre: 'Ndolé',
        description: 'Plat traditionnel à base de feuilles amères, carevans et arachides',
        ingredients: JSON.stringify(['500g de feuilles de ndolé', '300g de carevans', '300g de viande', '200g de pâte d\'arachide', '2 oignons', 'Ail, tomates, sel, poivre']),
        instructions: JSON.stringify(['Laver les feuilles', 'Cuire la viande', 'Ajouter les carevans', 'Incorporer les feuilles', 'Ajouter la sauce arachide', 'Laisser mijoter 15 min', 'Assaisonner et servir']),
        temps_preparation: 30,
        temps_cuisson: 60,
        difficulte: 'Moyen',
        region_id: 5,
        image_url: '/images/littoral/ndolé.jpeg',
        video_url: '/videos/littoral/ndole.mp4'
      },

      {
        titre: 'Mbongo Tchobi',
        description: 'Ragoût savoureux de viande avec épices camerounaises traditionnelles',
        ingredients: JSON.stringify(['800g de viande de boeuf', 'Piment camerounais', '4 tomates', '3 oignons', 'Ail, huile, bouillon']),
        instructions: JSON.stringify(['Saisir la viande', 'Ajouter les épices', 'Verser l\'eau', 'Ajouter les tomates', 'Cuire 45 min', 'Assaisonner', 'Servir chaud']),
        temps_preparation: 25,
        temps_cuisson: 75,
        difficulte: 'Moyen',
        region_id: 5,
        image_url: '/images/littoral/Mbongo tchobi.jpeg',
        video_url: '/videos/littoral/mbongo-tchobi.mp4'
      },

      // RÉGION: CENTRE
      {
        titre: 'Ngomba de poisson d\'eau douce',
        description: 'Poisson d\'eau douce préparé à la camerounaise',
        ingredients: JSON.stringify(['800g de poisson frais', 'Poivre camerounais', 'Tomates', 'Oignons', 'Ail', 'Huile']),
        instructions: JSON.stringify(['Nettoyer le poisson', 'Préparer la sauce', 'Cuire le poisson', 'Ajouter les épices', 'Mijoter', 'Servir']),
        temps_preparation: 20,
        temps_cuisson: 40,
        difficulte: 'Facile',
        region_id: 2,
        image_url: '/images/centre/Ngomba de poisson d\'eau douce.jpeg',
        video_url: '/videos/centre/ngomba-poisson.mp4'
      },

      {
        titre: 'Njama-Njama',
        description: 'Légumes verts traditionnels avec sauce arachide généreuse',
        ingredients: JSON.stringify(['400g de feuilles de njama', '300g de viande fumée', '200g de pâte d\'arachide', '2 oignons', 'Tomates, ail']),
        instructions: JSON.stringify(['Réhydrater la viande', 'Laver les feuilles', 'Faire chauffer l\'huile', 'Cuire la viande', 'Ajouter les feuilles', 'Ajouter sauce arachide', 'Laisser mijoter']),
        temps_preparation: 20,
        temps_cuisson: 45,
        difficulte: 'Facile',
        region_id: 2,
        image_url: '/images/centre/Njama- Njama.jpeg',
        video_url: '/videos/centre/njama-njama.mp4'
      },

      // RÉGION: EXTRÊME-NORD
      {
        titre: 'Sauce Gombo',
        description: 'Sauce onctueuse à base de gombos avec viande et épices',
        ingredients: JSON.stringify(['600g de gombos frais', '400g de viande', '2 oignons', 'Ail', 'Sauce tomate', 'Tomates', 'Épices']),
        instructions: JSON.stringify(['Nettoyer les gombos', 'Couper les gombos', 'Saisir la viande', 'Ajouter épices', 'Verser l\'eau', 'Ajouter gombos', 'Mijoter 15 min']),
        temps_preparation: 25,
        temps_cuisson: 50,
        difficulte: 'Moyen',
        region_id: 4,
        image_url: '/images/extreme-nord/Sauce gombo.jpeg',
        video_url: '/videos/extreme-nord/sauce-gombo.mp4'
      },

      {
        titre: 'Sauce Feuilles de Moringa',
        description: 'Sauce délicate avec feuilles de moringa, cacahuètes et viande',
        ingredients: JSON.stringify(['250g de feuilles de moringa', '400g de viande', '200g de pâte d\'arachide', '2 oignons', 'Tomates', 'Ail']),
        instructions: JSON.stringify(['Réhydrater si séchées', 'Découper la viande', 'Faire chauffer l\'huile', 'Revenir la viande', 'Ajouter l\'eau', 'Ajouter les feuilles', 'Ajouter sauce arachide']),
        temps_preparation: 20,
        temps_cuisson: 55,
        difficulte: 'Moyen',
        region_id: 4,
        image_url: '/images/extreme-nord/moringa prparé.jpg',
        video_url: '/videos/extreme-nord/sauce-moringa.mp4'
      },

      {
        titre: 'Sauce Oseille (Foloré)',
        description: 'Sauce traditionnelle avec feuilles d\'oseille et épices locales',
        ingredients: JSON.stringify(['400g de feuilles d\'oseille', '300g de viande', '2 oignons', '200g pâte arachide', 'Tomates', 'Ail']),
        instructions: JSON.stringify(['Laver les feuilles', 'Hacher les feuilles', 'Découper la viande', 'Chauffer l\'huile', 'Revenir la viande', 'Ajouter l\'eau', 'Incorporer les feuilles']),
        temps_preparation: 20,
        temps_cuisson: 50,
        difficulte: 'Facile',
        region_id: 4,
        image_url: '/images/extreme-nord/oseill ou foloré.jpeg',
        video_url: '/videos/extreme-nord/sauce-oseille.mp4'
      },

      {
        titre: 'Sauce Feuilles de Baobab (Lalo)',
        description: 'Sauce délicate avec feuilles de baobab, cacahuètes et viande',
        ingredients: JSON.stringify(['250g de feuilles de baobab', '400g de viande', '200g de pâte d\'arachide', '2 oignons', 'Tomates', 'Ail']),
        instructions: JSON.stringify(['Réhydrater les feuilles', 'Découper la viande', 'Chauffer l\'huile', 'Revenir la viande', 'Ajouter l\'eau', 'Incorporer les feuilles', 'Ajouter sauce arachide']),
        temps_preparation: 20,
        temps_cuisson: 55,
        difficulte: 'Moyen',
        region_id: 4,
        image_url: '/images/extreme-nord/sauce+feuilles+baobab+ou+lalo   1.webp',
        video_url: '/videos/extreme-nord/sauce-lalo.mp4'
      },

      {
        titre: 'Sauce Tasba',
        description: 'Sauce riche avec sauce arachide et viande locale',
        ingredients: JSON.stringify(['500g de viande', '250g pâte arachide', 'Sauce tomate', 'Oignons', 'Tomates', 'Ail', 'Épices']),
        instructions: JSON.stringify(['Découper la viande', 'Saisir la viande', 'Ajouter les épices', 'Verser l\'eau', 'Ajouter tomates', 'Ajouter pâte arachide', 'Mijoter 20 min']),
        temps_preparation: 25,
        temps_cuisson: 55,
        difficulte: 'Moyen',
        region_id: 4,
        image_url: '/images/extreme-nord/Sauce tasba.jpeg',
        video_url: '/videos/extreme-nord/sauce-tasba.mp4'
      },

      // RÉGION: OUEST
      {
        titre: 'Njapché',
        description: 'Ragoût avec sauce cacahuète et légumes traditionnels',
        ingredients: JSON.stringify(['600g de viande', '250g pâte arachide', '400g de chou', '200g courges', '2 oignons', 'Tomates', 'Ail']),
        instructions: JSON.stringify(['Découper la viande', 'Chauffer l\'huile', 'Saisir la viande', 'Ajouter oignons', 'Verser l\'eau', 'Ajouter légumes', 'Ajouter pâte arachide']),
        temps_preparation: 30,
        temps_cuisson: 60,
        difficulte: 'Moyen',
        region_id: 8,
        image_url: '/images/ouest/Njapché.jpeg',
        video_url: '/videos/ouest/ndjapche.mp4'
      },

      {
        titre: 'Atchu',
        description: 'Plat riche avec haricots, maïs et légumes racines',
        ingredients: JSON.stringify(['500g haricots rouges', '300g maïs', '400g patates douces', '300g viande fumée', 'Tomates', 'Oignons', 'Ail']),
        instructions: JSON.stringify(['Tremper haricots', 'Cuire haricots', 'Préparer la viande', 'Ajouter aux haricots', 'Ajouter légumes', 'Ajouter maïs', 'Mijoter 20 min']),
        temps_preparation: 30,
        temps_cuisson: 90,
        difficulte: 'Moyen',
        region_id: 8,
        image_url: '/images/ouest/Atchu.jpeg',
        video_url: '/videos/ouest/atchu.mp4'
      },

      // RÉGION: NORD
      {
        titre: 'Sauce Boko',
        description: 'Sauce nordiste avec arachides, viande et épices subtiles',
        ingredients: JSON.stringify(['500g de viande', '200g pâte arachide', '3 oignons', 'Tomates', '100g cacahuètes grillées', 'Menthe fraîche']),
        instructions: JSON.stringify(['Découper la viande', 'Saisir la viande', 'Ajouter oignons', 'Verser l\'eau', 'Ajouter tomates', 'Ajouter pâte arachide', 'Ajouter cacahuètes']),
        temps_preparation: 20,
        temps_cuisson: 55,
        difficulte: 'Moyen',
        region_id: 6,
        image_url: '/images/nord/sauce-boko.jpg',
        video_url: '/videos/nord/sauce-boko.mp4'
      }
    ];

    // Insérer les recettes
    for (const recette of recettes) {
      try {
        await run(
          `INSERT INTO recipes 
           (titre, description, ingredients, instructions, temps_preparation, temps_cuisson, difficulte, region_id, image_url, video_url, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          [
            recette.titre,
            recette.description,
            recette.ingredients,
            recette.instructions,
            recette.temps_preparation,
            recette.temps_cuisson,
            recette.difficulte,
            recette.region_id,
            recette.image_url,
            recette.video_url
          ]
        );
        console.log(`✅ Recette "${recette.titre}" ajoutée avec vidéo`);
      } catch (err) {
        console.log(`⚠️ "${recette.titre}": ${err.message.substring(0, 50)}`);
      }
    }

    console.log('✨ Recettes avec vidéos intégrées');
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

module.exports = { seedRecipesWithVideos };
