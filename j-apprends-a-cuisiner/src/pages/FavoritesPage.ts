import { DataService } from '../services/DataService';
import { AuthService } from '../services/AuthService';
import { FavoritesService } from '../services/FavoritesService';

export class FavoritesPage {
  private static dataService = DataService.getInstance();
  private static authService = AuthService.getInstance();
  private static favoritesService = FavoritesService.getInstance();

  static render(): string {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return this.renderNotLoggedIn();
    }

    const allRecipes = this.dataService.getAllRecipes();
    const favoriteRecipes = this.favoritesService.getFavoriteRecipes(
      currentUser.getIdUtilisateur(), 
      allRecipes
    );

    if (favoriteRecipes.length === 0) {
      return this.renderEmptyState();
    }

    return `
      <div class="favorites-page fade-in">
        <div class="favorites-header">
          <h3 class="favorites-title">Mes Favoris</h3>
          <p class="text-secondary">${favoriteRecipes.length} recettes sauvegardées</p>
        </div>

        <div class="favorites-filters">
          <div class="filter-chips">
            <button class="filter-chip active" data-filter="all">Toutes</button>
            <button class="filter-chip" data-filter="facile">Faciles</button>
            <button class="filter-chip" data-filter="rapide">Rapides</button>
            <button class="filter-chip" data-filter="region">Par région</button>
          </div>
          <button class="sort-btn">
            <span class="material-symbols-outlined">sort</span>
          </button>
        </div>

        <div class="favorites-grid" id="favorites-grid">
          ${favoriteRecipes.map(recipe => this.generateFavoriteCardHTML(recipe)).join('')}
        </div>
      </div>
    `;
  }

  private static renderNotLoggedIn(): string {
    return `
      <div class="favorites-page fade-in">
        <div class="empty-state">
          <div class="empty-icon">
            <span class="material-symbols-outlined">login</span>
          </div>
          <h3>Connectez-vous pour voir vos favoris</h3>
          <p>Créez un compte ou connectez-vous pour sauvegarder vos recettes préférées</p>
          <div class="empty-actions">
            <button class="auth-action-btn" data-auth="login">
              Se connecter
            </button>
            <button class="auth-action-btn secondary" data-auth="register">
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private static renderEmptyState(): string {
    return `
      <div class="favorites-page fade-in">
        <div class="favorites-header">
          <h3 class="favorites-title">Mes Favoris</h3>
          <p class="text-secondary">0 recettes sauvegardées</p>
        </div>

        <div class="empty-state">
          <div class="empty-icon">
            <span class="material-symbols-outlined">favorite_border</span>
          </div>
          <h3>Aucun favori pour le moment</h3>
          <p>Ajoutez des recettes à vos favoris pour les retrouver facilement ici</p>
          <button class="explore-recipes-btn" data-navigate="home">
            <span class="material-symbols-outlined">explore</span>
            Découvrir des recettes
          </button>
        </div>
      </div>
    `;
  }

  private static generateFavoriteCardHTML(recipe: any): string {
    return `
      <div class="favorite-recipe-card" data-recipe-id="${recipe.getIdRecette()}">
        <div class="favorite-recipe-image">
          <div class="recipe-bg" style="background-image: url('${recipe.getImageURL()}')"></div>
          <button class="remove-favorite-btn" data-recipe-id="${recipe.getIdRecette()}">
            <span class="material-symbols-outlined">favorite</span>
          </button>
        </div>
        <div class="favorite-recipe-content">
          <h4 class="favorite-recipe-title">${recipe.getTitre()}</h4>
          <p class="favorite-recipe-region">${recipe.getRegionAssociee()}</p>
          <div class="favorite-recipe-meta">
            <span class="meta-item">
              <span class="material-symbols-outlined">schedule</span>
              ${recipe.getTempsFormate()}
            </span>
            <span class="meta-item">
              <span class="material-symbols-outlined">${recipe.getDifficulteIcon()}</span>
              ${recipe.getDifficulte()}
            </span>
          </div>
          <button class="cook-now-btn" data-recipe-id="${recipe.getIdRecette()}">
            <span class="material-symbols-outlined">play_arrow</span>
            Cuisiner maintenant
          </button>
        </div>
      </div>
    `;
  }

  public static setupEventListeners(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      // Gestion des filtres
      const filterChip = target.closest('.filter-chip');
      if (filterChip) {
        this.handleFilterChange(filterChip as HTMLElement);
      }

      // Gestion des boutons d'authentification
      const authBtn = target.closest('[data-auth]');
      if (authBtn) {
        const mode = authBtn.getAttribute('data-auth') as 'login' | 'register';
        const event = new CustomEvent('show-auth-modal', { detail: { mode } });
        document.dispatchEvent(event);
      }

      // Gestion du bouton "Cuisiner maintenant"
      const cookBtn = target.closest('.cook-now-btn');
      if (cookBtn) {
        const recipeId = parseInt(cookBtn.getAttribute('data-recipe-id') || '0');
        this.handleCookNow(recipeId);
      }
    });
  }

  private static handleFilterChange(filterChip: HTMLElement): void {
    // Retirer la classe active de tous les filtres
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.classList.remove('active');
    });

    // Ajouter la classe active au filtre cliqué
    filterChip.classList.add('active');

    const filter = filterChip.getAttribute('data-filter') || 'all';
    this.applyFilter(filter);
  }

  private static applyFilter(filter: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const allRecipes = this.dataService.getAllRecipes();
    let favoriteRecipes = this.favoritesService.getFavoriteRecipes(
      currentUser.getIdUtilisateur(), 
      allRecipes
    );

    switch (filter) {
      case 'facile':
        favoriteRecipes = favoriteRecipes.filter(recipe => 
          recipe.getDifficulte() === 'Facile'
        );
        break;
      case 'rapide':
        favoriteRecipes = favoriteRecipes.filter(recipe => 
          recipe.getTempsPreparation() <= 30
        );
        break;
      case 'region':
        // Trier par région
        favoriteRecipes.sort((a, b) => 
          a.getRegionAssociee().localeCompare(b.getRegionAssociee())
        );
        break;
      default:
        // 'all' - pas de filtre supplémentaire
        break;
    }

    this.updateFavoritesGrid(favoriteRecipes);
  }

  private static updateFavoritesGrid(recipes: any[]): void {
    const grid = document.getElementById('favorites-grid');
    if (grid) {
      grid.innerHTML = recipes.map(recipe => 
        this.generateFavoriteCardHTML(recipe)
      ).join('');
    }
  }

  private static handleCookNow(recipeId: number): void {
    const recipe = this.dataService.getRecipeById(recipeId);
    if (recipe) {
      // Ouvrir la modal de détails de recette
      this.showRecipeDetails(recipe);
    }
  }

  private static showRecipeDetails(recipe: any): void {
    const modal = document.createElement('div');
    modal.className = 'recipe-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          ${recipe.afficherDetails()}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Gérer la fermeture de la modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal.querySelector('.modal-overlay') || 
          e.target === modal.querySelector('.modal-close')) {
        document.body.removeChild(modal);
      }
    });
  }
}