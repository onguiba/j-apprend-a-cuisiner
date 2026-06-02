import { SearchModal } from './SearchModal';

export class SearchBar {
  private element: HTMLElement;
  private searchModal: SearchModal;

  constructor() {
    this.element = this.createElement();
    this.searchModal = new SearchModal();
    this.setupEventListeners();
  }

  private createElement(): HTMLElement {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-bar-container';
    
    searchContainer.innerHTML = `
      <div class="search-bar-wrapper">
        <div class="search-input-container">
          <div class="search-input-wrapper">
            <span class="material-symbols-outlined search-icon">search</span>
            <input 
              id="search-input"
              class="search-input" 
              placeholder="Rechercher une recette (Ndolé, Achu...)"
              readonly
            />
          </div>
        </div>
        <button id="advanced-search-btn" class="advanced-search-btn">
          <span class="material-symbols-outlined">tune</span>
          <span class="btn-text">Recherche avancée</span>
        </button>
      </div>
      
      <div class="quick-filters">
        <button class="quick-filter-btn active" data-filter="all">
          <span class="material-symbols-outlined">restaurant</span>
          Toutes
        </button>
        <button class="quick-filter-btn" data-filter="facile">
          <span class="material-symbols-outlined">signal_cellular_1_bar</span>
          Faciles
        </button>
        <button class="quick-filter-btn" data-filter="rapide">
          <span class="material-symbols-outlined">schedule</span>
          Rapides
        </button>
        <button class="quick-filter-btn" data-filter="populaire">
          <span class="material-symbols-outlined">trending_up</span>
          Populaires
        </button>
      </div>
    `;

    return searchContainer;
  }

  private setupEventListeners(): void {
    // Clic sur le champ de recherche ouvre la modal
    this.element.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('#search-input') || target.closest('#advanced-search-btn')) {
        this.openSearchModal();
      }

      // Gestion des filtres rapides
      const quickFilter = target.closest('.quick-filter-btn');
      if (quickFilter) {
        this.handleQuickFilter(quickFilter as HTMLElement);
      }
    });

    // Empêcher la saisie directe dans le champ
    const searchInput = this.element.querySelector('#search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('focus', () => {
        searchInput.blur();
        this.openSearchModal();
      });
    }
  }

  private openSearchModal(): void {
    this.searchModal.show();
  }

  private handleQuickFilter(filterBtn: HTMLElement): void {
    // Retirer la classe active de tous les boutons
    this.element.querySelectorAll('.quick-filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Ajouter la classe active au bouton cliqué
    filterBtn.classList.add('active');

    const filter = filterBtn.getAttribute('data-filter');
    
    // Émettre un événement personnalisé pour que la page puisse réagir
    const event = new CustomEvent('quick-filter-change', { 
      detail: { filter } 
    });
    document.dispatchEvent(event);

    // Animation du bouton
    filterBtn.classList.add('pulse');
    setTimeout(() => filterBtn.classList.remove('pulse'), 300);
  }

  render(): HTMLElement {
    return this.element;
  }
}