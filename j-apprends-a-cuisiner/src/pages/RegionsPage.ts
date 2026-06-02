import { DataService } from '../services/DataService';
import { RecipeService } from '../services/RecipeService';
import { AuthService } from '../services/AuthService';
import { FavoritesService } from '../services/FavoritesService';

export class RegionsPage {
  private static dataService = DataService.getInstance();
  private static recipeService = RecipeService.getInstance();
  private static authService = AuthService.getInstance();
  private static favoritesService = FavoritesService.getInstance();
  private static selectedRegion: string | null = null;

  static render(): string {
    const regions = this.dataService.getAllRegions();
    
    return `
      <div class="regions-page fade-in">
        <div class="regions-header">
          <h3 class="regions-title">Régions du Cameroun</h3>
          <p class="text-secondary">Découvrez la richesse culinaire de chaque région</p>
        </div>
        
        <div class="regions-grid" id="regions-grid">
          ${regions.map(region => this.generateRegionCardHTML(region)).join('')}
        </div>
        
        <div class="region-recipes-section" id="region-recipes-section" style="display: none;">
          <div class="section-header">
            <h3 id="region-recipes-title">Recettes de la région</h3>
            <button class="back-to-regions-btn" id="back-to-regions">
              <span class="material-symbols-outlined">arrow_back</span>
              Retour aux régions
            </button>
          </div>
          <div class="region-recipes-grid" id="region-recipes-grid">
            <!-- Les recettes seront chargées dynamiquement -->
          </div>
        </div>
        
        <div class="map-section">
          <div class="map-placeholder">
            <span class="material-symbols-outlined">map</span>
            <p>Carte interactive des régions</p>
            <small>Bientôt disponible</small>
          </div>
        </div>
      </div>
    `;
  }

  private static generateRegionCardHTML(region: any): string {
    const recipeCount = region.getNombreRecettes();
    
    return `
      <div class="region-detail-card" data-region="${region.getNomRegion()}" style="--region-color: ${this.getRegionColor(region.getNomRegion())}">
        <div class="region-detail-image" style="background-image: url('${region.getImageURL()}')">
          <div class="region-overlay">
            <h4 class="region-detail-name">${region.getNomRegion()}</h4>
          </div>
        </div>
        <div class="region-detail-content">
          <p class="region-description">${region.getDescription()}</p>
          <div class="region-specialties">
            <h5 class="specialties-title">Spécialités :</h5>
            <div class="specialties-list">
              ${region.getSpecialites().map((specialty: string) => `
                <span class="specialty-tag" style="background-color: ${this.getRegionColor(region.getNomRegion())}20; color: ${this.getRegionColor(region.getNomRegion())}">
                  ${specialty}
                </span>
              `).join('')}
            </div>
          </div>
          <button class="explore-region-btn" data-region="${region.getNomRegion()}" style="background-color: ${this.getRegionColor(region.getNomRegion())}">
            Explorer les recettes (${recipeCount})
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    `;
  }

  private static generateRecipeCardHTML(recipe: any): string {
    const currentUser = this.authService.getCurrentUser();
    const isFavorited = currentUser ? 
      this.favoritesService.isFavorite(currentUser.getIdUtilisateur(), recipe.getIdRecette()) : 
      false;

    return `
      <div class="region-recipe-card" data-recipe-id="${recipe.getIdRecette()}">
        <div class="region-recipe-image">
          <div class="recipe-bg" style="background-image: url('${recipe.getImageURL()}')"></div>
          <button class="favorite-btn" data-recipe-id="${recipe.getIdRecette()}">
            <span class="material-symbols-outlined">${isFavorited ? 'favorite' : 'favorite_border'}</span>
          </button>
        </div>
        <div class="region-recipe-content">
          <h4 class="region-recipe-title">${recipe.getTitre()}</h4>
          <p class="region-recipe-description">${recipe.getDescription()}</p>
          <div class="region-recipe-meta">
            <span class="meta-item">
              <span class="material-symbols-outlined">schedule</span>
              ${recipe.getTempsFormate()}
            </span>
            <span class="meta-item">
              <span class="material-symbols-outlined">${recipe.getDifficulteIcon()}</span>
              ${recipe.getDifficulte()}
            </span>
          </div>
          <button class="view-recipe-btn" data-recipe-id="${recipe.getIdRecette()}">
            <span class="material-symbols-outlined">visibility</span>
            Voir la recette
          </button>
        </div>
      </div>
    `;
  }

  private static getRegionColor(regionName: string): string {
    const colors: { [key: string]: string } = {
      'Littoral': '#0ea5e9',
      'Ouest': '#8b5cf6',
      'Centre': '#10b981',
      'Extrême-Nord': '#f59e0b',
      'Nord-Ouest': '#ef4444',
      'Sud-Ouest': '#06b6d4'
    };
    return colors[regionName] || '#ff6b35';
  }

  public static setupEventListeners(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      // Gestion du clic sur "Explorer les recettes"
      const exploreBtn = target.closest('.explore-region-btn');
      if (exploreBtn) {
        const regionName = exploreBtn.getAttribute('data-region');
        if (regionName) {
          this.showRegionRecipes(regionName);
        }
      }

      // Gestion du bouton "Retour aux régions"
      const backBtn = target.closest('#back-to-regions');
      if (backBtn) {
        this.showRegionsGrid();
      }

      // Gestion du clic sur "Voir la recette"
      const viewBtn = target.closest('.view-recipe-btn');
      if (viewBtn) {
        const recipeId = parseInt(viewBtn.getAttribute('data-recipe-id') || '0');
        this.showRecipeDetails(recipeId);
      }

      // Gestion des cartes de région (clic sur la carte entière)
      const regionCard = target.closest('.region-detail-card');
      if (regionCard && !target.closest('.explore-region-btn')) {
        const regionName = regionCard.getAttribute('data-region');
        if (regionName) {
          this.highlightRegion(regionName);
        }
      }
    });
  }

  private static showRegionRecipes(regionName: string): void {
    this.selectedRegion = regionName;
    const recipes = this.recipeService.rechercherRecettesParRegion(regionName);
    
    // Masquer la grille des régions
    const regionsGrid = document.getElementById('regions-grid');
    const recipesSection = document.getElementById('region-recipes-section');
    const recipesTitle = document.getElementById('region-recipes-title');
    const recipesGrid = document.getElementById('region-recipes-grid');
    
    if (regionsGrid && recipesSection && recipesTitle && recipesGrid) {
      regionsGrid.style.display = 'none';
      recipesSection.style.display = 'block';
      recipesTitle.textContent = `Recettes de la région ${regionName}`;
      
      if (recipes.length > 0) {
        recipesGrid.innerHTML = recipes.map(recipe => this.generateRecipeCardHTML(recipe)).join('');
      } else {
        recipesGrid.innerHTML = `
          <div class="no-recipes-found">
            <span class="material-symbols-outlined">restaurant_menu</span>
            <h4>Aucune recette trouvée</h4>
            <p>Il n'y a pas encore de recettes pour la région ${regionName}</p>
            <button class="add-recipe-btn">
              <span class="material-symbols-outlined">add</span>
              Proposer une recette
            </button>
          </div>
        `;
      }
    }

    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private static showRegionsGrid(): void {
    const regionsGrid = document.getElementById('regions-grid');
    const recipesSection = document.getElementById('region-recipes-section');
    
    if (regionsGrid && recipesSection) {
      regionsGrid.style.display = 'grid';
      recipesSection.style.display = 'none';
    }
    
    this.selectedRegion = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private static highlightRegion(regionName: string): void {
    // Retirer la classe active de toutes les cartes
    document.querySelectorAll('.region-detail-card').forEach(card => {
      card.classList.remove('active');
    });

    // Ajouter la classe active à la carte sélectionnée
    const selectedCard = document.querySelector(`[data-region="${regionName}"]`);
    if (selectedCard) {
      selectedCard.classList.add('active');
      
      // Animation de pulse
      selectedCard.classList.add('pulse');
      setTimeout(() => selectedCard.classList.remove('pulse'), 600);
    }
  }

  private static showRecipeDetails(recipeId: number): void {
    const recipe = this.dataService.getRecipeById(recipeId);
    if (!recipe) return;

    const modal = document.createElement('div');
    modal.className = 'recipe-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <div class="recipe-modal-header">
            <h2>${recipe.getTitre()}</h2>
            <div class="recipe-modal-meta">
              <span class="recipe-region-badge" style="background-color: ${this.getRegionColor(recipe.getRegionAssociee())}">
                ${recipe.getRegionAssociee()}
              </span>
              <span class="recipe-time">
                <span class="material-symbols-outlined">schedule</span>
                ${recipe.getTempsFormate()}
              </span>
              <span class="recipe-difficulty">
                <span class="material-symbols-outlined">${recipe.getDifficulteIcon()}</span>
                ${recipe.getDifficulte()}
              </span>
            </div>
          </div>
          <div class="recipe-modal-image" style="background-image: url('${recipe.getImageURL()}')"></div>
          <div class="recipe-modal-body">
            <div class="recipe-description">
              <h3>Description</h3>
              <p>${recipe.getDescription()}</p>
            </div>
            <div class="recipe-ingredients">
              <h3>Ingrédients</h3>
              <p>${recipe.getIngredients()}</p>
            </div>
            <div class="recipe-instructions">
              <h3>Instructions</h3>
              <p>${recipe.getInstructions()}</p>
            </div>
            <div class="recipe-author">
              <small>Par ${recipe.getAuteur()}</small>
            </div>
          </div>
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

  // Méthode pour obtenir les statistiques des régions
  public static getRegionStats(): { [regionName: string]: { recipes: number; specialties: number } } {
    const regions = this.dataService.getAllRegions();
    const stats: { [regionName: string]: { recipes: number; specialties: number } } = {};
    
    regions.forEach(region => {
      stats[region.getNomRegion()] = {
        recipes: region.getNombreRecettes(),
        specialties: region.getSpecialites().length
      };
    });
    
    return stats;
  }
}