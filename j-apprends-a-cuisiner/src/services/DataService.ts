import { Recipe } from '../models/Recipe';
import { Region } from '../models/Region';
import { User } from '../models/User';

export class DataService {
  private static instance: DataService;
  private recipes: Recipe[] = [];
  private regions: Region[] = [];
  private users: User[] = [];

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private initializeData(): void {
    // Initialisation des régions (11 régions : 10 du Cameroun + Autre)
    this.regions = [
      new Region(1, 'Adamaoua', 'Région des hauts plateaux et savanes',
        'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&h=600&fit=crop&crop=center',
        ['Viande grillée', 'Lait caillé', 'Bouillie de maïs']),
      
      new Region(2, 'Centre', 'Cœur culinaire du Cameroun',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center',
        ['Poulet DG', 'Koki', 'Ngomba', 'Njama-Njama']),
      
      new Region(3, 'Est', 'Saveurs forestières authentiques',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center',
        ['Poisson fumé', 'Chenilles', 'Manioc']),
      
      new Region(4, 'Extrême-Nord', 'Saveurs sahéliennes épicées',
        'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&h=600&fit=crop&crop=center',
        ['Couscous', 'Sauce gombo', 'Sauce oseille', 'Sauce tasba', 'Moringa', 'Lalo']),
      
      new Region(5, 'Littoral', 'Région côtière riche en fruits de mer', 
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
        ['Ndolé', 'Mbongo tchobi', 'Poisson braisé', 'Crevettes sautées']),
      
      new Region(6, 'Nord', 'Traditions pastorales et agricoles',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center',
        ['Viande séchée', 'Bouillie de mil', 'Sauce arachide']),
      
      new Region(7, 'Nord-Ouest', 'Traditions montagnardes anglophones',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center',
        ['Fufu corn', 'Njama-Njama', 'Water fufu', 'Achu soup']),
      
      new Region(8, 'Ouest', 'Hauts plateaux aux saveurs authentiques',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&crop=center',
        ['Achu', 'Taro sauce jaune', 'Njapché', 'Taro pilé']),
      
      new Region(9, 'Sud', 'Richesses forestières du sud',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center',
        ['Poisson d\'eau douce', 'Bâton de manioc', 'Feuilles de manioc']),
      
      new Region(10, 'Sud-Ouest', 'Richesses forestières et côtières anglophones',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center',
        ['Eru', 'Kati-kati', 'Mets de pistaches', 'Pepper soup', 'Plantain frit']),
      
      new Region(11, 'Autre', 'Recettes diverses et cuisine fusion',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&crop=center',
        ['Cuisine Fusion', 'Desserts', 'Boissons'])
    ];

    // Initialisation des recettes (organisées par région)
    this.recipes = [
      // Région Centre (images disponibles)
      new Recipe(2, 'Poulet DG', 'Poulet sauté aux légumes et plantains',
        'Poulet, plantains mûrs, carottes, haricots verts, poivrons, oignons, ail, gingembre, huile, épices',
        'Découper le poulet en morceaux. Faire revenir avec les légumes. Ajouter les plantains en fin de cuisson.',
        'Centre', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&h=600&fit=crop&crop=center',
        35, 'Facile', 'Chef Diane'),

      new Recipe(3, 'Koki', 'Haricots pilés cuits à la vapeur dans des feuilles',
        'Haricots blancs, huile de palme, crevettes séchées, feuilles de bananier, épices, sel',
        'Piler les haricots. Mélanger avec l\'huile et les épices. Emballer dans les feuilles et cuire à la vapeur.',
        'Centre', 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop&crop=center',
        90, 'Moyen', 'Chef Samuel'),

      new Recipe(4, 'Ngomba de Poisson', 'Poisson d\'eau douce dans une sauce aux feuilles',
        'Poisson d\'eau douce, feuilles de ngomba, huile de palme, épices, oignons',
        'Nettoyer le poisson. Préparer les feuilles. Cuire ensemble dans une sauce parfumée.',
        'Centre', '/images/centre/Ngomba de poisson d\'eau douce.jpeg',
        50, 'Moyen', 'Chef Marie'),

      new Recipe(5, 'Njama-Njama du Centre', 'Feuilles d\'huckleberry africain en sauce',
        'Feuilles de njama-njama, huile de palme, poisson fumé, épices',
        'Laver les feuilles. Cuire avec le poisson fumé et les épices dans l\'huile de palme.',
        'Centre', '/images/centre/Njama- Njama.jpeg',
        40, 'Facile', 'Chef Paul'),

      // Région Extrême-Nord (images disponibles)
      new Recipe(7, 'Couscous du Nord', 'Couscous traditionnel aux épices sahéliennes',
        'Semoule de blé, viande de bœuf, légumes, épices du Sahel',
        'Préparer la semoule à la vapeur. Cuire la viande avec les épices. Servir ensemble avec les légumes.',
        'Extrême-Nord', 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&h=600&fit=crop&crop=center',
        75, 'Difficile', 'Chef Amadou'),

      new Recipe(8, 'Sauce Gombo', 'Sauce gombo traditionnelle du Sahel',
        'Gombo frais, viande, huile, oignons, tomates, épices',
        'Couper le gombo. Faire revenir avec la viande et les légumes. Laisser mijoter.',
        'Extrême-Nord', '/images/extreme-nord/Sauce gombo.jpeg',
        45, 'Facile', 'Chef Aïcha'),

      new Recipe(9, 'Sauce Oseille (Foloré)', 'Sauce aux feuilles d\'oseille',
        'Feuilles d\'oseille, viande, huile, oignons, tomates, épices',
        'Laver les feuilles d\'oseille. Cuire avec la viande dans une sauce tomate épicée.',
        'Extrême-Nord', '/images/extreme-nord/oseill ou foloré.jpeg',
        50, 'Moyen', 'Chef Fatima'),

      new Recipe(10, 'Sauce Tasba', 'Sauce traditionnelle épicée du Nord',
        'Viande séchée, pâte d\'arachide, épices, oignons, tomates',
        'Préparer la pâte d\'arachide. Ajouter la viande et les épices. Laisser mijoter.',
        'Extrême-Nord', '/images/extreme-nord/Sauce tasba.jpeg',
        60, 'Moyen', 'Chef Ibrahim'),

      new Recipe(11, 'Moringa Préparé', 'Feuilles de moringa en sauce',
        'Feuilles de moringa, viande, huile, oignons, épices',
        'Laver les feuilles de moringa. Cuire avec la viande dans une sauce parfumée.',
        'Extrême-Nord', '/images/extreme-nord/moringa prparé.jpg',
        40, 'Facile', 'Chef Aïssatou'),

      new Recipe(12, 'Lalo (Sauce Feuilles de Baobab)', 'Sauce aux feuilles de baobab séchées',
        'Feuilles de baobab séchées, viande, huile, oignons, tomates',
        'Réhydrater les feuilles. Cuire avec la viande dans une sauce onctueuse.',
        'Extrême-Nord', '/images/extreme-nord/sauce+feuilles+baobab+ou+lalo   1.webp',
        55, 'Moyen', 'Chef Hawa'),

      // Région Littoral (images disponibles)
      new Recipe(13, 'Ndolé Royal', 'Feuilles amères, arachides, crevettes et poisson fumé',
        'Feuilles de ndolé, arachides, crevettes, poisson fumé, huile de palme, oignons, ail, gingembre',
        'Faire bouillir les feuilles de ndolé. Préparer la pâte d\'arachides. Faire revenir les oignons, ajouter la pâte d\'arachides, puis les feuilles et les protéines.',
        'Littoral', '/images/littoral/ndolé.jpeg',
        45, 'Moyen', 'Chef Marie',
        new Date(),
        '/videos/littoral/ndole-royal.mp4',
        '/subtitles/exemple-ndole.vtt'),

      new Recipe(14, 'Mbongo Tchobi', 'Poisson dans une sauce noire épicée',
        'Poisson, mbongo (épice noire), oignons, tomates, piment, huile',
        'Préparer la sauce mbongo. Faire cuire le poisson dans cette sauce noire parfumée.',
        'Littoral', '/images/littoral/Mbongo tchobi.jpeg',
        50, 'Difficile', 'Chef Ebenezer'),

      // Région Nord-Ouest (images disponibles)
      new Recipe(16, 'Njama-Njama du Nord-Ouest', 'Feuilles d\'huckleberry en sauce',
        'Feuilles de njama-njama, huile de palme, poisson fumé, crevettes, épices',
        'Laver les feuilles. Cuire avec le poisson fumé dans une sauce à l\'huile de palme.',
        'Nord-Ouest', '/images/nord-ouest/Njama- Njama.jpeg',
        40, 'Facile', 'Chef Ngwa'),

      // Région Ouest (images disponibles)
      new Recipe(17, 'Achu Traditionnel', 'Taro pilé accompagné de sauce jaune épicée',
        'Taro, huile de palme, poisson fumé, crevettes séchées, feuilles de légumes, épices locales',
        'Cuire le taro jusqu\'à tendreté. Piler jusqu\'à obtenir une pâte lisse. Préparer la sauce jaune avec l\'huile de palme et les épices.',
        'Ouest', '/images/ouest/Atchu.jpeg',
        60, 'Avancé', 'Chef Paul',
        new Date(),
        '/videos/ouest/achu-traditionnel.mp4',
        '/subtitles/exemple-achu.vtt'),

      new Recipe(18, 'Taro Sauce Jaune', 'Taro accompagné de sauce jaune',
        'Taro, huile de palme, poisson fumé, épices, sel',
        'Cuire le taro. Préparer la sauce jaune avec l\'huile de palme et le poisson fumé.',
        'Ouest', '/images/ouest/Taro sauce jaune.jpeg',
        50, 'Moyen', 'Chef Fotso'),

      new Recipe(19, 'Njapché', 'Haricots blancs en sauce',
        'Haricots blancs, huile de palme, poisson fumé, épices',
        'Cuire les haricots. Préparer une sauce avec l\'huile de palme et le poisson fumé.',
        'Ouest', '/images/ouest/Njapché.jpeg',
        70, 'Moyen', 'Chef Kamga'),

      // Région Sud-Ouest (images disponibles)
      new Recipe(21, 'Eru Spécial', 'Légumes verts traditionnels du Sud-Ouest',
        'Feuilles d\'eru, poisson fumé, crevettes, huile de palme, épices',
        'Nettoyer les feuilles d\'eru. Préparer avec le poisson fumé et les crevettes dans une sauce parfumée.',
        'Sud-Ouest', '/images/sud-ouest/Eru and water fufu.jpeg',
        40, 'Moyen', 'Chef Brice'),

      new Recipe(22, 'Kati-Kati', 'Poisson grillé épicé',
        'Poisson frais, piment, oignons, tomates, épices, huile',
        'Mariner le poisson avec les épices. Griller et servir avec une sauce pimentée.',
        'Sud-Ouest', '/images/sud-ouest/Kati- kati.jpeg',
        30, 'Facile', 'Chef Ekema'),

      new Recipe(23, 'Mets de Pistaches', 'Sauce aux pistaches africaines',
        'Pistaches africaines, viande, poisson fumé, épices, huile de palme',
        'Piler les pistaches. Préparer une sauce avec la viande et le poisson fumé.',
        'Sud-Ouest', '/images/sud-ouest/Mets de pistaches.jpeg',
        60, 'Difficile', 'Chef Motomby'),

      // Autres régions (avec images placeholder)
      new Recipe(1, 'Viande Grillée de l\'Adamaoua', 'Viande de bœuf grillée aux épices locales',
        'Viande de bœuf, épices locales, sel, poivre, oignons',
        'Mariner la viande avec les épices. Griller sur feu de bois. Servir avec des oignons frais.',
        'Adamaoua', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop&crop=center',
        30, 'Facile', 'Chef Amadou'),

      new Recipe(6, 'Poisson Fumé de l\'Est', 'Poisson fumé traditionnel de la forêt',
        'Poisson frais, sel, épices forestières',
        'Nettoyer le poisson. Fumer lentement sur feu de bois. Servir avec du manioc.',
        'Est', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=600&fit=crop&crop=center',
        120, 'Moyen', 'Chef Joseph'),

      new Recipe(15, 'Viande Séchée du Nord', 'Viande de bœuf séchée traditionnelle',
        'Viande de bœuf, sel, épices locales',
        'Découper la viande en lanières. Saler et sécher au soleil. Conserver pour usage ultérieur.',
        'Nord', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop&crop=center',
        240, 'Moyen', 'Chef Oumarou'),

      new Recipe(20, 'Poisson d\'Eau Douce du Sud', 'Poisson frais des rivières',
        'Poisson d\'eau douce, épices, oignons, tomates, huile',
        'Nettoyer le poisson. Faire cuire avec les épices et les légumes.',
        'Sud', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=600&fit=crop&crop=center',
        35, 'Facile', 'Chef Mvondo')
    ];

    // Associer les recettes aux régions
    this.associateRecipesToRegions();
  }

  private associateRecipesToRegions(): void {
    this.recipes.forEach(recipe => {
      const region = this.regions.find(r => r.getNomRegion() === recipe.getRegionAssociee());
      if (region) {
        region.ajouterRecette(recipe);
      }
    });
  }

  // Méthodes pour les recettes
  public getAllRecipes(): Recipe[] {
    return this.recipes;
  }

  public getRecipeById(id: number): Recipe | undefined {
    return this.recipes.find(recipe => recipe.getIdRecette() === id);
  }

  public getRecipesByRegion(regionName: string): Recipe[] {
    return this.recipes.filter(recipe => recipe.getRegionAssociee() === regionName);
  }

  public searchRecipes(query: string): Recipe[] {
    const lowerQuery = query.toLowerCase();
    return this.recipes.filter(recipe => 
      recipe.getTitre().toLowerCase().includes(lowerQuery) ||
      recipe.getDescription().toLowerCase().includes(lowerQuery) ||
      recipe.getRegionAssociee().toLowerCase().includes(lowerQuery)
    );
  }

  public addRecipe(recipe: Recipe): boolean {
    try {
      this.recipes.push(recipe);
      
      // Associer à la région
      const region = this.regions.find(r => r.getNomRegion() === recipe.getRegionAssociee());
      if (region) {
        region.ajouterRecette(recipe);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la recette:', error);
      return false;
    }
  }

  // Méthodes pour les régions
  public getAllRegions(): Region[] {
    return this.regions;
  }

  public getRegionById(id: number): Region | undefined {
    return this.regions.find(region => region.getIdRegion() === id);
  }

  public getRegionByName(name: string): Region | undefined {
    return this.regions.find(region => region.getNomRegion() === name);
  }

  // Méthodes pour les utilisateurs
  public getAllUsers(): User[] {
    return this.users;
  }

  public getUserById(id: number): User | undefined {
    return this.users.find(user => user.getIdUtilisateur() === id);
  }

  public addUser(user: User): boolean {
    try {
      this.users.push(user);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      return false;
    }
  }

  // Méthodes utilitaires
  public getStatistics(): {
    totalRecipes: number;
    totalRegions: number;
    totalUsers: number;
    recipesByRegion: { [region: string]: number };
  } {
    const recipesByRegion: { [region: string]: number } = {};
    
    this.regions.forEach(region => {
      recipesByRegion[region.getNomRegion()] = region.getNombreRecettes();
    });

    return {
      totalRecipes: this.recipes.length,
      totalRegions: this.regions.length,
      totalUsers: this.users.length,
      recipesByRegion
    };
  }
}