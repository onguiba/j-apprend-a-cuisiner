import { Recipe } from '../models/Recipe';

export class FavoritesService {
  private static instance: FavoritesService;
  private favorites: Map<number, number[]> = new Map(); // userId -> recipeIds[]

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): FavoritesService {
    if (!FavoritesService.instance) {
      FavoritesService.instance = new FavoritesService();
    }
    return FavoritesService.instance;
  }

  // Cas d'usage: Favoriser recette (inclut "Ajouter une recette aux favoris")
  public favoriserRecette(userId: number, recipeId: number): boolean {
    try {
      if (!this.favorites.has(userId)) {
        this.favorites.set(userId, []);
      }

      const userFavorites = this.favorites.get(userId)!;
      
      if (!userFavorites.includes(recipeId)) {
        userFavorites.push(recipeId);
        this.saveToStorage();
        return true;
      }
      
      return false; // Déjà en favoris
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      return false;
    }
  }

  // Retirer une recette des favoris
  public retirerDesFavoris(userId: number, recipeId: number): boolean {
    try {
      const userFavorites = this.favorites.get(userId);
      
      if (userFavorites) {
        const index = userFavorites.indexOf(recipeId);
        if (index > -1) {
          userFavorites.splice(index, 1);
          this.saveToStorage();
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      return false;
    }
  }

  // Basculer le statut favori d'une recette
  public toggleFavorite(userId: number, recipeId: number): boolean {
    if (this.isFavorite(userId, recipeId)) {
      return this.retirerDesFavoris(userId, recipeId);
    } else {
      return this.favoriserRecette(userId, recipeId);
    }
  }

  // Vérifier si une recette est en favoris
  public isFavorite(userId: number, recipeId: number): boolean {
    const userFavorites = this.favorites.get(userId);
    return userFavorites ? userFavorites.includes(recipeId) : false;
  }

  // Obtenir tous les favoris d'un utilisateur
  public getFavoriteRecipeIds(userId: number): number[] {
    return this.favorites.get(userId) || [];
  }

  // Obtenir les recettes favorites avec leurs détails
  public getFavoriteRecipes(userId: number, allRecipes: Recipe[]): Recipe[] {
    const favoriteIds = this.getFavoriteRecipeIds(userId);
    return allRecipes.filter(recipe => favoriteIds.includes(recipe.getIdRecette()));
  }

  // Obtenir le nombre de favoris d'un utilisateur
  public getFavoritesCount(userId: number): number {
    return this.getFavoriteRecipeIds(userId).length;
  }

  // Vider tous les favoris d'un utilisateur
  public clearUserFavorites(userId: number): boolean {
    try {
      this.favorites.set(userId, []);
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      return false;
    }
  }

  // Obtenir les statistiques des favoris
  public getFavoritesStats(): {
    totalFavorites: number;
    userWithMostFavorites: number | null;
    averageFavoritesPerUser: number;
  } {
    let totalFavorites = 0;
    let maxFavorites = 0;
    let userWithMostFavorites: number | null = null;

    this.favorites.forEach((favoriteIds, userId) => {
      totalFavorites += favoriteIds.length;
      if (favoriteIds.length > maxFavorites) {
        maxFavorites = favoriteIds.length;
        userWithMostFavorites = userId;
      }
    });

    const averageFavoritesPerUser = this.favorites.size > 0 
      ? totalFavorites / this.favorites.size 
      : 0;

    return {
      totalFavorites,
      userWithMostFavorites,
      averageFavoritesPerUser: Math.round(averageFavoritesPerUser * 100) / 100
    };
  }

  // Obtenir les recettes les plus favorites
  public getMostFavoritedRecipes(allRecipes: Recipe[], limit: number = 10): Array<{recipe: Recipe, favoritesCount: number}> {
    const recipeFavoritesCount = new Map<number, number>();

    // Compter les favoris pour chaque recette
    this.favorites.forEach(favoriteIds => {
      favoriteIds.forEach(recipeId => {
        recipeFavoritesCount.set(recipeId, (recipeFavoritesCount.get(recipeId) || 0) + 1);
      });
    });

    // Trier par nombre de favoris et limiter
    return Array.from(recipeFavoritesCount.entries())
      .map(([recipeId, count]) => {
        const recipe = allRecipes.find(r => r.getIdRecette() === recipeId);
        return recipe ? { recipe, favoritesCount: count } : null;
      })
      .filter(item => item !== null)
      .sort((a, b) => b!.favoritesCount - a!.favoritesCount)
      .slice(0, limit) as Array<{recipe: Recipe, favoritesCount: number}>;
  }

  // Sauvegarder dans le localStorage
  private saveToStorage(): void {
    try {
      const favoritesData = Array.from(this.favorites.entries());
      localStorage.setItem('userFavorites', JSON.stringify(favoritesData));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  }

  // Charger depuis le localStorage
  private loadFromStorage(): void {
    try {
      const savedFavorites = localStorage.getItem('userFavorites');
      if (savedFavorites) {
        const favoritesData = JSON.parse(savedFavorites);
        this.favorites = new Map(favoritesData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      this.favorites = new Map();
    }
  }

  // Exporter les favoris d'un utilisateur
  public exportUserFavorites(userId: number, format: 'json' | 'csv' = 'json'): string {
    const favoriteIds = this.getFavoriteRecipeIds(userId);
    
    if (format === 'json') {
      return JSON.stringify({
        userId,
        favoriteRecipeIds: favoriteIds,
        exportDate: new Date().toISOString()
      }, null, 2);
    } else {
      let csv = 'Recipe ID,Date Added\n';
      favoriteIds.forEach(id => {
        csv += `${id},${new Date().toISOString()}\n`;
      });
      return csv;
    }
  }

  // Importer les favoris d'un utilisateur
  public importUserFavorites(userId: number, data: string, format: 'json' | 'csv' = 'json'): boolean {
    try {
      let recipeIds: number[] = [];

      if (format === 'json') {
        const importData = JSON.parse(data);
        recipeIds = importData.favoriteRecipeIds || [];
      } else {
        // Parser CSV simple
        const lines = data.split('\n').slice(1); // Skip header
        recipeIds = lines
          .filter(line => line.trim())
          .map(line => parseInt(line.split(',')[0]))
          .filter(id => !isNaN(id));
      }

      this.favorites.set(userId, recipeIds);
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'importation des favoris:', error);
      return false;
    }
  }
}