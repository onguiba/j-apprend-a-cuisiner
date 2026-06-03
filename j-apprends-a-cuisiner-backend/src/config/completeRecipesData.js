const { run } = require('./database-sqlite');

async function seedCompleteRecipes() {
  try {
    console.log('📝 Ajout des recettes complètes...');

    const recettes = [
      // RÉGION: LITTORAL
      {
        titre: 'Ndolé',
        description: 'Plat traditionnel à base de feuilles amères, carevans et arachides',
        ingredients: JSON.stringify([
          '500g de feuilles de ndolé (feuilles amères)',
          '300g de carevans (crevettes)',
          '300g de viande de boeuf',
          '200g de pâte d\'arachide',
          '2 oignons',
          '4 gousses d\'ail',
          '3 tomates',
          '2 cuillères à soupe d\'huile',
          'Sel et poivre',
          '1L d\'eau'
        ]),
        instructions: JSON.stringify([
          '1. Laver les feuilles de ndolé plusieurs fois à l\'eau froide pour enlever l\'amertume',
          '2. Découper la viande en morceaux et la placer dans une casserole',
          '3. Ajouter 1L d\'eau et porter à ébullition pendant 15 minutes',
          '4. Ajouter les oignons hachés et les gousses d\'ail écrasées',
          '5. Laisser cuire 20 minutes supplémentaires',
          '6. Incorporer les carevans et continuer la cuisson 10 minutes',
          '7. Ajouter les feuilles de ndolé et bien mélanger',
          '8. Verser la pâte d\'arachide diluée dans 100ml d\'eau chaude',
          '9. Mélanger bien et laisser mijoter 15 minutes',
          '10. Assaisonner avec le sel et le poivre',
          '11. Servir chaud avec du riz ou du fufu'
        ]),
        temps_preparation: 30,
        temps_cuisson: 60,
        difficulte: 'Moyen',
        region_id: 5,
        image_url: 'ndole.jpg',
        servings: 4
      },

      {
        titre: 'Mbongo Tchobi',
        description: 'Ragoût savoureux de viande avec épices camerounaises traditionnelles',
        ingredients: JSON.stringify([
          '800g de viande de boeuf',
          '2 cuillères à soupe de piment camerounais en poudre',
          '4 tomates fraiches',
          '3 oignons',
          '4 gousses d\'ail',
          '2 poivrons rouges',
          '3 cuillères à soupe d\'huile de palme',
          '1 litre d\'eau ou bouillon',
          'Sel et poivre',
          '2 cuillères à café d\'extrait de tomate',
          'Maggi ou bouillon cube'
        ]),
        instructions: JSON.stringify([
          '1. Découper la viande en gros morceaux réguliers',
          '2. Faire chauffer l\'huile de palme dans une cocotte',
          '3. Saisir la viande de tous les côtés pendant 5 minutes',
          '4. Ajouter les oignons hachés et laisser revenir 3 minutes',
          '5. Ajouter le piment camerounais et mélanger bien',
          '6. Verser l\'extrait de tomate et mélanger',
          '7. Ajouter le bouillon ou l\'eau',
          '8. Porter à ébullition puis réduire le feu',
          '9. Ajouter l\'ail écrasé et continuer la cuisson 30 minutes',
          '10. Ajouter les tomates et les poivrons coupés en morceaux',
          '11. Continuer la cuisson 20 minutes jusqu\'à ce que la viande soit tendre',
          '12. Rectifier l\'assaisonnement',
          '13. Servir avec du riz blanc, de la purée ou des bananes plantains'
        ]),
        temps_preparation: 25,
        temps_cuisson: 75,
        difficulte: 'Moyen',
        region_id: 5,
        image_url: 'mbongo-tchobi.jpg',
        servings: 4
      },

      // RÉGION: CENTRE
      {
        titre: 'Njama-Njama',
        description: 'Légumes verts traditionnels avec sauce arachide généreuse',
        ingredients: JSON.stringify([
          '400g de feuilles de njama-njama (épinards ou feuilles similaires)',
          '300g de viande fumée ou séchée',
          '200g de pâte d\'arachide',
          '2 oignons',
          '3 gousses d\'ail',
          '3 tomates',
          '2 cuillères à soupe d\'huile',
          'Sel et poivre',
          '1 litre d\'eau',
          'Piment selon le goût'
        ]),
        instructions: JSON.stringify([
          '1. Réhydrater la viande fumée dans 500ml d\'eau tiède pendant 10 minutes',
          '2. Laver les feuilles de njama-njama et les hacher grossièrement',
          '3. Faire chauffer l\'huile dans une grande casserole',
          '4. Ajouter les oignons hachés et l\'ail écrasé',
          '5. Laisser revenir 2 minutes',
          '6. Ajouter la viande fumée avec son eau de trempage',
          '7. Ajouter les tomates hachées et l\'eau',
          '8. Laisser mijoter 15 minutes',
          '9. Incorporer les feuilles de njama-njama',
          '10. Délayer la pâte d\'arachide dans 100ml d\'eau chaude',
          '11. Verser la pâte d\'arachide dans la casserole',
          '12. Mélanger bien et laisser cuire 15 minutes',
          '13. Assaisonner avec sel, poivre et piment',
          '14. Servir avec du riz, du fonio ou de la bouillie de maïs'
        ]),
        temps_preparation: 20,
        temps_cuisson: 45,
        difficulte: 'Facile',
        region_id: 2,
        image_url: 'njama-njama.jpg',
        servings: 4
      },

      // RÉGION: EXTRÊME-NORD
      {
        titre: 'Sauce Gombo',
        description: 'Sauce onctueuse à base de gombos avec viande et épices',
        ingredients: JSON.stringify([
          '600g de gombos frais',
          '400g de viande de boeuf',
          '2 oignons',
          '3 gousses d\'ail',
          '200g de sauce tomate',
          '2 tomates fraîches',
          '3 cuillères à soupe d\'huile',
          '1 litre d\'eau',
          'Sel et poivre',
          'Maggi ou bouillon cube',
          '1 piment frais'
        ]),
        instructions: JSON.stringify([
          '1. Nettoyer les gombos en les frottant délicatement',
          '2. Couper les gombos en rondelles d\'environ 1cm',
          '3. Découper la viande en petits morceaux',
          '4. Faire chauffer l\'huile dans une cocotte',
          '5. Faire revenir la viande 5 minutes',
          '6. Ajouter les oignons hachés et l\'ail écrasé',
          '7. Laisser cuire 3 minutes',
          '8. Ajouter la sauce tomate et les tomates fraîches coupées',
          '9. Verser l\'eau et porter à ébullition',
          '10. Réduire le feu et laisser mijoter 20 minutes',
          '11. Incorporer les gombos en rondelles',
          '12. Continuer la cuisson 15 minutes jusqu\'à ce que les gombos soient tendres',
          '13. Assaisonner avec sel, poivre et bouillon cube',
          '14. Ajouter le piment frais entier (à retirer avant de servir)',
          '15. Laisser mijoter 5 minutes supplémentaires',
          '16. Servir avec de la polenta, du riz ou de l\'attiéké'
        ]),
        temps_preparation: 25,
        temps_cuisson: 50,
        difficulte: 'Moyen',
        region_id: 4,
        image_url: 'sauce-gombo.jpg',
        servings: 4
      },

      {
        titre: 'Sauce Feuilles de Baobab (Lalo)',
        description: 'Sauce délicate avec feuilles de baobab, cacahuètes et viande',
        ingredients: JSON.stringify([
          '250g de feuilles de baobab séchées',
          '400g de viande de boeuf',
          '200g de pâte d\'arachide',
          '2 oignons',
          '3 gousses d\'ail',
          '3 tomates',
          '2 cuillères à soupe d\'huile',
          '1 litre d\'eau',
          'Sel et poivre',
          '1 cube de bouillon',
          '100ml de lait de coco (optionnel)'
        ]),
        instructions: JSON.stringify([
          '1. Réhydrater les feuilles de baobab séchées dans 300ml d\'eau pendant 15 minutes',
          '2. Découper la viande en petits morceaux',
          '3. Faire chauffer l\'huile et faire revenir la viande 5 minutes',
          '4. Ajouter les oignons hachés et l\'ail écrasé',
          '5. Laisser cuire 3 minutes',
          '6. Ajouter l\'eau et porter à ébullition',
          '7. Ajouter les tomates hachées',
          '8. Laisser mijoter 20 minutes',
          '9. Incorporer les feuilles de baobab réhydratées',
          '10. Verser la pâte d\'arachide diluée',
          '11. Ajouter le cube de bouillon',
          '12. Continuer la cuisson 15 minutes',
          '13. Ajouter le lait de coco si désiré',
          '14. Assaisonner avec sel et poivre',
          '15. Laisser mijoter 5 minutes',
          '16. Servir avec du riz blanc ou de la bouillie de millet'
        ]),
        temps_preparation: 20,
        temps_cuisson: 55,
        difficulte: 'Moyen',
        region_id: 4,
        image_url: 'sauce-lalo.jpg',
        servings: 4
      },

      // RÉGION: OUEST
      {
        titre: 'Njapché',
        description: 'Ragoût avec sauce cacahuète et légumes traditionnels',
        ingredients: JSON.stringify([
          '600g de viande de boeuf ou de porc',
          '250g de pâte d\'arachide',
          '400g de chou',
          '200g de courges',
          '2 oignons',
          '3 gousses d\'ail',
          '3 tomates',
          '2 cuillères à soupe d\'huile',
          '1 litre d\'eau',
          'Sel et poivre',
          '1 cube de bouillon',
          '2 piments frais'
        ]),
        instructions: JSON.stringify([
          '1. Découper la viande en morceaux réguliers',
          '2. Faire chauffer l\'huile dans une grande marmite',
          '3. Saisir la viande 5 minutes',
          '4. Ajouter les oignons hachés et l\'ail écrasé',
          '5. Laisser revenir 3 minutes',
          '6. Ajouter l\'eau et les tomates hachées',
          '7. Porter à ébullition et cuire 20 minutes',
          '8. Découper le chou en lanières et la courge en cubes',
          '9. Ajouter les légumes',
          '10. Continuer la cuisson 15 minutes',
          '11. Délayer la pâte d\'arachide dans 100ml d\'eau chaude',
          '12. Verser la pâte d\'arachide dans la marmite',
          '13. Ajouter le cube de bouillon',
          '14. Mélanger bien et laisser mijoter 15 minutes',
          '15. Ajouter les piments frais',
          '16. Assaisonner avec sel et poivre',
          '17. Servir avec du riz, de la polenta ou du pain de maïs'
        ]),
        temps_preparation: 30,
        temps_cuisson: 60,
        difficulte: 'Moyen',
        region_id: 8,
        image_url: 'njapche.jpg',
        servings: 4
      },

      {
        titre: 'Atchu',
        description: 'Plat riche avec haricots, maïs et légumes racines',
        ingredients: JSON.stringify([
          '500g de haricots rouges secs',
          '300g de maïs (grain ou frais)',
          '400g de patates douces',
          '300g de viande ou poisson fumé',
          '2 oignons',
          '3 gousses d\'ail',
          '3 tomates',
          '2 cuillères à soupe d\'huile',
          'Sel et poivre',
          '1 cube de bouillon',
          'Eau (environ 2 litres)'
        ]),
        instructions: JSON.stringify([
          '1. Laver les haricots et les faire tremper toute une nuit',
          '2. Égoutter les haricots et les placer dans une grande marmite',
          '3. Couvrir d\'eau et porter à ébullition',
          '4. Laisser cuire 45 minutes jusqu\'à semi-cuisson',
          '5. Faire chauffer l\'huile dans une autre casserole',
          '6. Faire revenir les oignons hachés et l\'ail écrasé',
          '7. Ajouter la viande/poisson fumé détaillé',
          '8. Laisser cuire 5 minutes',
          '9. Ajouter les tomates hachées',
          '10. Ajouter ce mélange aux haricots',
          '11. Découper les patates douces en cubes',
          '12. Ajouter les patates douces et le maïs',
          '13. Ajouter le cube de bouillon',
          '14. Continuer la cuisson 20 minutes',
          '15. Assaisonner avec sel et poivre',
          '16. Laisser mijoter 10 minutes',
          '17. Servir chaud en plat unique ou avec du riz'
        ]),
        temps_preparation: 30,
        temps_cuisson: 90,
        difficulte: 'Moyen',
        region_id: 8,
        image_url: 'atchu.jpg',
        servings: 6
      },

      // RÉGION: NORD
      {
        titre: 'Sauce Boko',
        description: 'Sauce nordiste avec arachides, viande et épices subtiles',
        ingredients: JSON.stringify([
          '500g de viande de boeuf',
          '200g de pâte d\'arachide',
          '3 oignons',
          '4 gousses d\'ail',
          '2 tomates fraiches',
          '2 cuillères à soupe d\'huile',
          '1 litre d\'eau',
          'Sel et poivre',
          '1 cube de bouillon',
          '1 poignée de feuilles de menthe fraîche',
          '100g de cacahuètes grillées concassées'
        ]),
        instructions: JSON.stringify([
          '1. Découper la viande en morceaux réguliers',
          '2. Faire chauffer l\'huile dans une cocotte',
          '3. Saisir la viande 5 minutes de chaque côté',
          '4. Ajouter les oignons émincés et l\'ail écrasé',
          '5. Laisser revenir 3 minutes',
          '6. Verser l\'eau et porter à ébullition',
          '7. Ajouter les tomates coupées en quartiers',
          '8. Laisser mijoter 20 minutes',
          '9. Délayer la pâte d\'arachide dans 100ml d\'eau chaude',
          '10. Verser dans la cocotte et mélanger bien',
          '11. Ajouter le cube de bouillon',
          '12. Continuer la cuisson 15 minutes',
          '13. Ajouter les cacahuètes concassées',
          '14. Incorporer les feuilles de menthe fraiches',
          '15. Assaisonner avec sel et poivre',
          '16. Laisser mijoter 5 minutes',
          '17. Servir avec du riz blanc ou du couscous'
        ]),
        temps_preparation: 20,
        temps_cuisson: 55,
        difficulte: 'Moyen',
        region_id: 6,
        image_url: 'sauce-boko.jpg',
        servings: 4
      }
    ];

    // Insérer les recettes
    for (const recette of recettes) {
      try {
        await run(
          `INSERT INTO recipes 
           (titre, description, ingredients, instructions, temps_preparation, temps_cuisson, difficulte, region_id, image_url, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          [
            recette.titre,
            recette.description,
            recette.ingredients,
            recette.instructions,
            recette.temps_preparation,
            recette.temps_cuisson,
            recette.difficulte,
            recette.region_id,
            recette.image_url
          ]
        );
        console.log(`✅ Recette "${recette.titre}" ajoutée avec succès`);
      } catch (err) {
        console.log(`⚠️ Recette "${recette.titre}" existe déjà ou erreur: ${err.message}`);
      }
    }

    console.log('✨ Ajout des recettes complètes terminé');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des recettes:', error);
  }
}

module.exports = { seedCompleteRecipes };
