import { Recipe } from '../models/Recipe';
import { DataService } from './DataService';

export interface RecipeSearchFilters {
  region?: string;
  difficulte?: string;
  tempsMax?: number;
  ingredients?: string[];
}

export class RecipeService {
  private static instance: RecipeService;
  private dataService: DataService;

  private constructor() {
    this.dataService = DataService.getInstance();
  }

  public static getInstance(): RecipeService {
    if (!RecipeService.instance) {
      RecipeService.instance = new RecipeService();
    }
    return RecipeService.instance;
  }

  // Cas d'usage: Consulter recettes
  public consulterRecettes(): Recipe[] {
    return this.dataService.getAllRecipes();
  }

  // Cas d'usage: Rechercher recettes par région
  public rechercherRecettesParRegion(regionName: string): Recipe[] {
    return this.dataService.getRecipesByRegion(regionName);
  }

  // Cas d'usage: Voir détails d'une recette
  public voirDetailsRecette(recipeId: number): Recipe | null {
    const recipe = this.dataService.getRecipeById(recipeId);
    if (recipe) {
      // Log de consultation pour les statistiques
      this.logRecipeView(recipeId);
      return recipe;
    }
    return null;
  }

  // Recherche avancée avec filtres
  public rechercherAvecFiltres(query: string, filters: RecipeSearchFilters = {}): Recipe[] {
    let recipes = this.dataService.getAllRecipes();

    // Filtrer par texte de recherche
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      recipes = recipes.filter(recipe => 
        recipe.getTitre().toLowerCase().includes(lowerQuery) ||
        recipe.getDescription().toLowerCase().includes(lowerQuery) ||
        recipe.getIngredients().toLowerCase().includes(lowerQuery) ||
        recipe.getRegionAssociee().toLowerCase().includes(lowerQuery)
      );
    }

    // Filtrer par région
    if (filters.region) {
      recipes = recipes.filter(recipe => 
        recipe.getRegionAssociee() === filters.region
      );
    }

    // Filtrer par difficulté
    if (filters.difficulte) {
      recipes = recipes.filter(recipe => 
        recipe.getDifficulte() === filters.difficulte
      );
    }

    // Filtrer par temps maximum
    if (filters.tempsMax) {
      recipes = recipes.filter(recipe => 
        recipe.getTempsPreparation() <= filters.tempsMax!
      );
    }

    // Filtrer par ingrédients
    if (filters.ingredients && filters.ingredients.length > 0) {
      recipes = recipes.filter(recipe => {
        const recipeIngredients = recipe.getIngredients().toLowerCase();
        return filters.ingredients!.some(ingredient => 
          recipeIngredients.includes(ingredient.toLowerCase())
        );
      });
    }

    return recipes;
  }

  // Obtenir les recettes populaires
  public getRecettesPopulaires(limit: number = 10): Recipe[] {
    // Dans un vrai système, ceci serait basé sur les vues/favoris
    const recipes = this.dataService.getAllRecipes();
    return recipes.slice(0, limit);
  }

  // Obtenir les recettes par difficulté
  public getRecettesParDifficulte(difficulte: string): Recipe[] {
    return this.dataService.getAllRecipes().filter(recipe => 
      recipe.getDifficulte() === difficulte
    );
  }

  // Obtenir les recettes rapides (moins de 30 min)
  public getRecettesRapides(): Recipe[] {
    return this.dataService.getAllRecipes().filter(recipe => 
      recipe.getTempsPreparation() <= 30
    );
  }

  // Obtenir les recettes par temps de préparation
  public getRecettesParTemps(tempsMin: number, tempsMax: number): Recipe[] {
    return this.dataService.getAllRecipes().filter(recipe => {
      const temps = recipe.getTempsPreparation();
      return temps >= tempsMin && temps <= tempsMax;
    });
  }

  // Obtenir des suggestions de recettes basées sur la région de l'utilisateur
  public getSuggestionsParRegion(regionUtilisateur: string, limit: number = 5): Recipe[] {
    const recettesRegion = this.rechercherRecettesParRegion(regionUtilisateur);
    const autresRecettes = this.dataService.getAllRecipes().filter(recipe => 
      recipe.getRegionAssociee() !== regionUtilisateur
    );

    // Mélanger les recettes de la région de l'utilisateur avec d'autres
    const suggestions = [
      ...recettesRegion.slice(0, Math.ceil(limit / 2)),
      ...autresRecettes.slice(0, Math.floor(limit / 2))
    ];

    return suggestions.slice(0, limit);
  }

  // Obtenir des recettes similaires
  public getRecettesSimilaires(recipeId: number, limit: number = 4): Recipe[] {
    const recipe = this.dataService.getRecipeById(recipeId);
    if (!recipe) return [];

    const allRecipes = this.dataService.getAllRecipes();
    
    // Filtrer les recettes similaires par région et difficulté
    const similaires = allRecipes.filter(r => 
      r.getIdRecette() !== recipeId && (
        r.getRegionAssociee() === recipe.getRegionAssociee() ||
        r.getDifficulte() === recipe.getDifficulte()
      )
    );

    return similaires.slice(0, limit);
  }

  // Statistiques des recettes
  public getStatistiquesRecettes(): {
    totalRecettes: number;
    recettesParRegion: { [region: string]: number };
    recettesParDifficulte: { [difficulte: string]: number };
    tempsPreparationMoyen: number;
    recetteLaPlusRapide: Recipe | null;
    recetteLaPlusLongue: Recipe | null;
  } {
    const recipes = this.dataService.getAllRecipes();
    
    const recettesParRegion: { [region: string]: number } = {};
    const recettesParDifficulte: { [difficulte: string]: number } = {};
    let tempsTotal = 0;
    let recetteLaPlusRapide: Recipe | null = null;
    let recetteLaPlusLongue: Recipe | null = null;

    recipes.forEach(recipe => {
      // Par région
      const region = recipe.getRegionAssociee();
      recettesParRegion[region] = (recettesParRegion[region] || 0) + 1;

      // Par difficulté
      const difficulte = recipe.getDifficulte();
      recettesParDifficulte[difficulte] = (recettesParDifficulte[difficulte] || 0) + 1;

      // Temps de préparation
      const temps = recipe.getTempsPreparation();
      tempsTotal += temps;

      if (!recetteLaPlusRapide || temps < recetteLaPlusRapide.getTempsPreparation()) {
        recetteLaPlusRapide = recipe;
      }

      if (!recetteLaPlusLongue || temps > recetteLaPlusLongue.getTempsPreparation()) {
        recetteLaPlusLongue = recipe;
      }
    });

    return {
      totalRecettes: recipes.length,
      recettesParRegion,
      recettesParDifficulte,
      tempsPreparationMoyen: recipes.length > 0 ? Math.round(tempsTotal / recipes.length) : 0,
      recetteLaPlusRapide,
      recetteLaPlusLongue
    };
  }

  // Valider les données d'une recette
  public validerRecette(recipeData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!recipeData.titre || recipeData.titre.trim().length < 3) {
      errors.push('Le titre doit contenir au moins 3 caractères');
    }

    if (!recipeData.description || recipeData.description.trim().length < 10) {
      errors.push('La description doit contenir au moins 10 caractères');
    }

    if (!recipeData.ingredients || recipeData.ingredients.trim().length < 5) {
      errors.push('Les ingrédients doivent être spécifiés');
    }

    if (!recipeData.instructions || recipeData.instructions.trim().length < 20) {
      errors.push('Les instructions doivent contenir au moins 20 caractères');
    }

    if (!recipeData.regionAssociee) {
      errors.push('La région doit être spécifiée');
    }

    if (!recipeData.tempsPreparation || recipeData.tempsPreparation < 1) {
      errors.push('Le temps de préparation doit être supérieur à 0');
    }

    if (!['Facile', 'Moyen', 'Difficile', 'Avancé'].includes(recipeData.difficulte)) {
      errors.push('La difficulté doit être: Facile, Moyen, Difficile ou Avancé');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Logger les vues de recettes (pour les statistiques)
  private logRecipeView(recipeId: number): void {
    try {
      const views = JSON.parse(localStorage.getItem('recipeViews') || '{}');
      views[recipeId] = (views[recipeId] || 0) + 1;
      localStorage.setItem('recipeViews', JSON.stringify(views));
    } catch (error) {
      console.error('Erreur lors du logging des vues:', error);
    }
  }

  // Obtenir les vues d'une recette
  public getRecipeViews(recipeId: number): number {
    try {
      const views = JSON.parse(localStorage.getItem('recipeViews') || '{}');
      return views[recipeId] || 0;
    } catch (error) {
      return 0;
    }
  }

  // Obtenir les recettes les plus vues
  public getRecettesLesPlusVues(limit: number = 10): Array<{recipe: Recipe, views: number}> {
    try {
      const views = JSON.parse(localStorage.getItem('recipeViews') || '{}');
      const recipes = this.dataService.getAllRecipes();
      
      return recipes
        .map(recipe => ({
          recipe,
          views: views[recipe.getIdRecette()] || 0
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    } catch (error) {
      return [];
    }
  }
}