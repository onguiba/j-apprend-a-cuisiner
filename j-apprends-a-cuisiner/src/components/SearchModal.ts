import { RecipeService, type RecipeSearchFilters } from '../services/RecipeService';
import { DataService } from '../services/DataService';
import { RecipeDetailModal } from './RecipeDetailModal';

export class SearchModal {
  private recipeService: RecipeService;
  private dataService: DataService;
  private recipeModal: RecipeDetailModal;
  private modal: HTMLElement | null = null;
  private searchResults: any[] = [];

  constructor() {
    this.recipeService = RecipeService.getInstance();
    this.dataService = DataService.getInstance();
    this.recipeModal = new RecipeDetailModal();
  }

  public show(): void {
    if (this.modal) {
      document.body.removeChild(this.modal);
    }

    this.modal = this.createModal();
    document.body.appendChild(this.modal);
    this.setupEventListeners();
    
    // Animation d'entrée
    setTimeout(() => {
      if (this.modal) {
        this.modal.classList.add('show');
      }
    }, 50);
    
    // Focus sur le champ de recherche
    const searchInput = this.modal.querySelector('#search-query') as HTMLInputElement;
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 150);
    }
  }

  private createModal(): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = this.generateHTML();
    return modal;
  }

  private generateHTML(): string {
    const regions = this.dataService.getAllRegions();
    const difficulties = ['Facile', 'Moyen', 'Difficile', 'Avancé'];

    return `
      <div class="modal-overlay">
        <div class="search-modal-content">
          <div class="search-modal-header">
            <h2>Recherche avancée</h2>
            <button class="modal-close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <form class="search-form" id="search-form">
            <div class="search-input-group">
              <label for="search-query">Rechercher une recette</label>
              <div class="search-input-wrapper">
                <span class="material-symbols-outlined search-icon">search</span>
                <input 
                  type="text" 
                  id="search-query" 
                  name="query"
                  placeholder="Nom de recette, ingrédient..."
                  class="search-input"
                />
              </div>
            </div>

            <div class="search-filters">
              <div class="filter-group">
                <label class="filter-label">Région</label>
                <select id="region-filter" class="filter-select">
                  <option value="">Toutes les régions</option>
                  ${regions.map(region => `
                    <option value="${region.getNomRegion()}">${region.getNomRegion()}</option>
                  `).join('')}
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">Difficulté</label>
                <select id="difficulty-filter" class="filter-select">
                  <option value="">Toutes les difficultés</option>
                  ${difficulties.map(difficulty => `
                    <option value="${difficulty}">${difficulty}</option>
                  `).join('')}
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">Temps maximum (minutes)</label>
                <div class="time-slider-container">
                  <input 
                    type="range" 
                    id="time-filter" 
                    min="10" 
                    max="180" 
                    value="180" 
                    class="time-slider"
                  >
                  <div class="time-display">
                    <span id="time-value">180</span> min
                  </div>
                </div>
              </div>

              <div class="filter-group">
                <label class="filter-label">Ingrédients (séparés par des virgules)</label>
                <input 
                  type="text" 
                  id="ingredients-filter" 
                  placeholder="Ex: tomate, oignon, ail"
                  class="filter-input"
                >
              </div>
            </div>

            <div class="search-actions">
              <button type="button" class="clear-filters-btn">
                <span class="material-symbols-outlined">clear_all</span>
                Effacer les filtres
              </button>
              <button type="submit" class="search-btn">
                <span class="material-symbols-outlined">search</span>
                Rechercher
              </button>
            </div>
          </form>

          <div class="search-results" id="search-results" style="display: none;">
            <div class="results-header">
              <h3 id="results-title">Résultats de recherche</h3>
              <span id="results-count" class="results-count"></span>
            </div>
            <div class="results-grid" id="results-grid">
              <!-- Les résultats seront affichés ici -->
            </div>
          </div>

          <div class="search-suggestions">
            <h4>Suggestions populaires</h4>
            <div class="suggestion-tags">
              <button class="suggestion-tag" data-query="ndolé">Ndolé</button>
              <button class="suggestion-tag" data-query="poulet">Poulet</button>
              <button class="suggestion-tag" data-query="poisson">Poisson</button>
              <button class="suggestion-tag" data-query="plantain">Plantain</button>
              <button class="suggestion-tag" data-query="arachide">Arachide</button>
              <button class="suggestion-tag" data-query="épicé">Épicé</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  private setupEventListeners(): void {
    if (!this.modal) return;

    // Fermeture de la modal
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal?.querySelector('.modal-overlay') || 
          e.target === this.modal?.querySelector('.modal-close')) {
        this.hide();
      }
    });

    // Slider de temps
    const timeSlider = this.modal.querySelector('#time-filter') as HTMLInputElement;
    const timeValue = this.modal.querySelector('#time-value') as HTMLElement;
    
    if (timeSlider && timeValue) {
      timeSlider.addEventListener('input', () => {
        timeValue.textContent = timeSlider.value;
      });
    }

    // Soumission du formulaire
    const searchForm = this.modal.querySelector('#search-form') as HTMLFormElement;
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.performSearch();
      });
    }

    // Bouton effacer les filtres
    const clearBtn = this.modal.querySelector('.clear-filters-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearFilters();
      });
    }

    // Tags de suggestion
    this.modal.addEventListener('click', (e) => {
      const suggestionTag = (e.target as HTMLElement).closest('.suggestion-tag');
      if (suggestionTag) {
        const query = suggestionTag.getAttribute('data-query') || '';
        const searchInput = this.modal?.querySelector('#search-query') as HTMLInputElement;
        if (searchInput) {
          searchInput.value = query;
          this.performSearch();
        }
      }
    });

    // Recherche en temps réel
    const searchInput = this.modal.querySelector('#search-query') as HTMLInputElement;
    if (searchInput) {
      let searchTimeout: number;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = window.setTimeout(() => {
          if (searchInput.value.length >= 2) {
            this.performSearch();
          } else if (searchInput.value.length === 0) {
            this.hideResults();
          }
        }, 300);
      });
    }
  }

  private performSearch(): void {
    if (!this.modal) return;

    const query = (this.modal.querySelector('#search-query') as HTMLInputElement).value;
    const region = (this.modal.querySelector('#region-filter') as HTMLSelectElement).value;
    const difficulty = (this.modal.querySelector('#difficulty-filter') as HTMLSelectElement).value;
    const maxTime = parseInt((this.modal.querySelector('#time-filter') as HTMLInputElement).value);
    const ingredientsInput = (this.modal.querySelector('#ingredients-filter') as HTMLInputElement).value;
    
    const ingredients = ingredientsInput
      .split(',')
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0);

    const filters: RecipeSearchFilters = {
      region: region || undefined,
      difficulte: difficulty || undefined,
      tempsMax: maxTime < 180 ? maxTime : undefined,
      ingredients: ingredients.length > 0 ? ingredients : undefined
    };

    const results = this.recipeService.rechercherAvecFiltres(query, filters);
    this.displayResults(results, query, filters);
  }

  private displayResults(results: any[], query: string, _filters: RecipeSearchFilters): void {
    if (!this.modal) return;

    const resultsSection = this.modal.querySelector('#search-results') as HTMLElement;
    const resultsTitle = this.modal.querySelector('#results-title') as HTMLElement;
    const resultsCount = this.modal.querySelector('#results-count') as HTMLElement;
    const resultsGrid = this.modal.querySelector('#results-grid') as HTMLElement;

    if (resultsSection && resultsTitle && resultsCount && resultsGrid) {
      resultsSection.style.display = 'block';
      
      // Titre et compteur
      const searchTerm = query || 'toutes les recettes';
      resultsTitle.textContent = `Résultats pour "${searchTerm}"`;
      resultsCount.textContent = `${results.length} recette${results.length > 1 ? 's' : ''} trouvée${results.length > 1 ? 's' : ''}`;

      // Affichage des résultats
      if (results.length > 0) {
        resultsGrid.innerHTML = results.map(recipe => this.generateResultCardHTML(recipe)).join('');
      } else {
        resultsGrid.innerHTML = `
          <div class="no-results">
            <span class="material-symbols-outlined">search_off</span>
            <h4>Aucun résultat trouvé</h4>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        `;
      }
    }
  }

  private generateResultCardHTML(recipe: any): string {
    return `
      <div class="search-result-card" data-recipe-id="${recipe.getIdRecette()}">
        <div class="result-image" style="background-image: url('${recipe.getImageURL()}')"></div>
        <div class="result-content">
          <h4 class="result-title">${recipe.getTitre()}</h4>
          <p class="result-region">${recipe.getRegionAssociee()}</p>
          <div class="result-meta">
            <span class="result-time">
              <span class="material-symbols-outlined">schedule</span>
              ${recipe.getTempsFormate()}
            </span>
            <span class="result-difficulty">
              <span class="material-symbols-outlined">${recipe.getDifficulteIcon()}</span>
              ${recipe.getDifficulte()}
            </span>
          </div>
          <button class="view-result-btn" data-recipe-id="${recipe.getIdRecette()}">
            Voir la recette
          </button>
        </div>
      </div>
    `;
  }

  private hideResults(): void {
    if (!this.modal) return;
    
    const resultsSection = this.modal.querySelector('#search-results') as HTMLElement;
    if (resultsSection) {
      resultsSection.style.display = 'none';
    }
  }

  private clearFilters(): void {
    if (!this.modal) return;

    (this.modal.querySelector('#search-query') as HTMLInputElement).value = '';
    (this.modal.querySelector('#region-filter') as HTMLSelectElement).value = '';
    (this.modal.querySelector('#difficulty-filter') as HTMLSelectElement).value = '';
    (this.modal.querySelector('#time-filter') as HTMLInputElement).value = '180';
    (this.modal.querySelector('#ingredients-filter') as HTMLInputElement).value = '';
    (this.modal.querySelector('#time-value') as HTMLElement).textContent = '180';
    
    this.hideResults();
  }

  public hide(): void {
    if (this.modal) {
      document.body.removeChild(this.modal);
      this.modal = null;
    }
  }
}