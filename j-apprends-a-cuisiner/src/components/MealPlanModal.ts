import { DataService } from '../services/DataService';
import { AuthService } from '../services/AuthService';
import { NotificationService } from '../services/NotificationService';

interface MealPlan {
  date: string;
  breakfast?: any;
  lunch?: any;
  dinner?: any;
}

export class MealPlanModal {
  private dataService: DataService;
  private authService: AuthService;
  private notificationService: NotificationService;
  private modal: HTMLElement | null = null;
  private currentWeek: Date = new Date();
  private mealPlans: Map<string, MealPlan> = new Map();

  constructor() {
    this.dataService = DataService.getInstance();
    this.authService = AuthService.getInstance();
    this.notificationService = NotificationService.getInstance();
    this.loadMealPlans();
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
  }

  private createModal(): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'meal-plan-modal';
    modal.innerHTML = this.generateHTML();
    return modal;
  }

  private generateHTML(): string {
    const weekDays = this.getWeekDays();
    
    return `
      <div class="modal-overlay">
        <div class="meal-plan-content">
          <div class="meal-plan-header">
            <div class="header-left">
              <h2>Planificateur de repas</h2>
              <p class="week-range">${this.getWeekRange()}</p>
            </div>
            <div class="header-actions">
              <button class="week-nav-btn" id="prev-week">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <button class="week-nav-btn" id="next-week">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
              <button class="modal-close">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <div class="meal-plan-body">
            <div class="meal-plan-grid">
              ${weekDays.map(day => this.generateDayColumn(day)).join('')}
            </div>
          </div>

          <div class="meal-plan-footer">
            <div class="footer-actions">
              <button class="btn-secondary" id="generate-shopping-list">
                <span class="material-symbols-outlined">shopping_cart</span>
                Liste de courses
              </button>
              <button class="btn-secondary" id="clear-week">
                <span class="material-symbols-outlined">clear_all</span>
                Vider la semaine
              </button>
              <button class="btn-primary" id="save-meal-plan">
                <span class="material-symbols-outlined">save</span>
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private generateDayColumn(date: Date): string {
    const dateStr = this.formatDate(date);
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    const dayNumber = date.getDate();
    const mealPlan = this.mealPlans.get(dateStr) || { date: dateStr };
    
    return `
      <div class="day-column" data-date="${dateStr}">
        <div class="day-header">
          <h3 class="day-name">${dayName}</h3>
          <span class="day-number">${dayNumber}</span>
        </div>
        
        <div class="meals-container">
          <div class="meal-slot" data-meal="breakfast">
            <div class="meal-header">
              <span class="material-symbols-outlined">wb_sunny</span>
              <span class="meal-name">Petit-déjeuner</span>
            </div>
            <div class="meal-content">
              ${mealPlan.breakfast ? this.generateMealCard(mealPlan.breakfast) : this.generateEmptyMealSlot('breakfast')}
            </div>
          </div>

          <div class="meal-slot" data-meal="lunch">
            <div class="meal-header">
              <span class="material-symbols-outlined">wb_sunny</span>
              <span class="meal-name">Déjeuner</span>
            </div>
            <div class="meal-content">
              ${mealPlan.lunch ? this.generateMealCard(mealPlan.lunch) : this.generateEmptyMealSlot('lunch')}
            </div>
          </div>

          <div class="meal-slot" data-meal="dinner">
            <div class="meal-header">
              <span class="material-symbols-outlined">nights_stay</span>
              <span class="meal-name">Dîner</span>
            </div>
            <div class="meal-content">
              ${mealPlan.dinner ? this.generateMealCard(mealPlan.dinner) : this.generateEmptyMealSlot('dinner')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private generateMealCard(recipe: any): string {
    return `
      <div class="meal-card" data-recipe-id="${recipe.getIdRecette()}">
        <div class="meal-image" style="background-image: url('${recipe.getImageURL()}')"></div>
        <div class="meal-info">
          <h4 class="meal-title">${recipe.getTitre()}</h4>
          <div class="meal-meta">
            <span class="meal-time">
              <span class="material-symbols-outlined">schedule</span>
              ${recipe.getTempsFormate()}
            </span>
          </div>
        </div>
        <button class="remove-meal-btn">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    `;
  }

  private generateEmptyMealSlot(mealType: string): string {
    return `
      <div class="empty-meal-slot" data-meal-type="${mealType}">
        <span class="material-symbols-outlined">add</span>
        <span class="add-meal-text">Ajouter un plat</span>
      </div>
    `;
  }

  private getWeekDays(): Date[] {
    const startOfWeek = new Date(this.currentWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Lundi = début de semaine
    startOfWeek.setDate(diff);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  }

  private getWeekRange(): string {
    const days = this.getWeekDays();
    const start = days[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    const end = days[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${start} - ${end}`;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private setupEventListeners(): void {
    if (!this.modal) return;

    // Fermeture de la modal
    this.modal.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('modal-overlay') || target.closest('.modal-close')) {
        this.close();
      }
    });

    // Navigation entre les semaines
    const prevWeekBtn = this.modal.querySelector('#prev-week');
    const nextWeekBtn = this.modal.querySelector('#next-week');

    if (prevWeekBtn) {
      prevWeekBtn.addEventListener('click', () => {
        this.currentWeek.setDate(this.currentWeek.getDate() - 7);
        this.refreshModal();
      });
    }

    if (nextWeekBtn) {
      nextWeekBtn.addEventListener('click', () => {
        this.currentWeek.setDate(this.currentWeek.getDate() + 7);
        this.refreshModal();
      });
    }

    // Ajouter un repas
    const emptySlots = this.modal.querySelectorAll('.empty-meal-slot');
    emptySlots.forEach(slot => {
      slot.addEventListener('click', () => {
        const dayColumn = slot.closest('.day-column');
        const mealSlot = slot.closest('.meal-slot');
        const date = dayColumn?.getAttribute('data-date');
        const mealType = mealSlot?.getAttribute('data-meal');
        
        if (date && mealType) {
          this.showRecipeSelector(date, mealType);
        }
      });
    });

    // Supprimer un repas
    const removeBtns = this.modal.querySelectorAll('.remove-meal-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mealCard = btn.closest('.meal-card');
        const dayColumn = btn.closest('.day-column');
        const mealSlot = btn.closest('.meal-slot');
        const date = dayColumn?.getAttribute('data-date');
        const mealType = mealSlot?.getAttribute('data-meal');
        
        if (date && mealType) {
          this.removeMeal(date, mealType);
        }
      });
    });

    // Actions du footer
    const generateShoppingListBtn = this.modal.querySelector('#generate-shopping-list');
    const clearWeekBtn = this.modal.querySelector('#clear-week');
    const saveMealPlanBtn = this.modal.querySelector('#save-meal-plan');

    if (generateShoppingListBtn) {
      generateShoppingListBtn.addEventListener('click', () => {
        this.generateShoppingList();
      });
    }

    if (clearWeekBtn) {
      clearWeekBtn.addEventListener('click', () => {
        this.clearWeek();
      });
    }

    if (saveMealPlanBtn) {
      saveMealPlanBtn.addEventListener('click', () => {
        this.saveMealPlan();
      });
    }

    // Fermeture avec Escape
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.close();
    }
  }

  private showRecipeSelector(date: string, mealType: string): void {
    const recipes = this.dataService.getAllRecipes();
    
    // Créer une mini-modal pour sélectionner une recette
    const selectorModal = document.createElement('div');
    selectorModal.className = 'recipe-selector-modal';
    selectorModal.innerHTML = `
      <div class="selector-overlay">
        <div class="selector-content">
          <div class="selector-header">
            <h3>Choisir une recette</h3>
            <button class="selector-close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="selector-search">
            <input type="text" placeholder="Rechercher une recette..." class="selector-search-input">
          </div>
          <div class="selector-recipes">
            ${recipes.map(recipe => `
              <div class="selector-recipe-card" data-recipe-id="${recipe.getIdRecette()}">
                <div class="selector-recipe-image" style="background-image: url('${recipe.getImageURL()}')"></div>
                <div class="selector-recipe-info">
                  <h4>${recipe.getTitre()}</h4>
                  <p>${recipe.getRegion()}</p>
                  <div class="selector-recipe-meta">
                    <span>${recipe.getTempsFormate()}</span>
                    <span>${recipe.getDifficulte()}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(selectorModal);

    // Événements pour le sélecteur
    selectorModal.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('selector-overlay') || target.closest('.selector-close')) {
        document.body.removeChild(selectorModal);
        return;
      }

      const recipeCard = target.closest('.selector-recipe-card');
      if (recipeCard) {
        const recipeId = parseInt(recipeCard.getAttribute('data-recipe-id') || '0');
        const recipe = this.dataService.getRecipeById(recipeId);
        
        if (recipe) {
          this.addMeal(date, mealType, recipe);
          document.body.removeChild(selectorModal);
        }
      }
    });

    // Recherche dans le sélecteur
    const searchInput = selectorModal.querySelector('.selector-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value.toLowerCase();
        const recipeCards = selectorModal.querySelectorAll('.selector-recipe-card');
        
        recipeCards.forEach(card => {
          const title = card.querySelector('h4')?.textContent?.toLowerCase() || '';
          const region = card.querySelector('p')?.textContent?.toLowerCase() || '';
          
          if (title.includes(query) || region.includes(query)) {
            (card as HTMLElement).style.display = 'flex';
          } else {
            (card as HTMLElement).style.display = 'none';
          }
        });
      });
    }
  }

  private addMeal(date: string, mealType: string, recipe: any): void {
    let mealPlan = this.mealPlans.get(date) || { date };
    (mealPlan as any)[mealType] = recipe;
    this.mealPlans.set(date, mealPlan);
    
    this.refreshModal();
    this.notificationService.success('Repas ajouté !', `${recipe.getTitre()} ajouté au ${this.getMealTypeName(mealType)}`);
  }

  private removeMeal(date: string, mealType: string): void {
    const mealPlan = this.mealPlans.get(date);
    if (mealPlan) {
      delete (mealPlan as any)[mealType];
      this.mealPlans.set(date, mealPlan);
      this.refreshModal();
      this.notificationService.info('Repas supprimé', `Repas retiré du ${this.getMealTypeName(mealType)}`);
    }
  }

  private getMealTypeName(mealType: string): string {
    const names: { [key: string]: string } = {
      'breakfast': 'petit-déjeuner',
      'lunch': 'déjeuner',
      'dinner': 'dîner'
    };
    return names[mealType] || mealType;
  }

  private refreshModal(): void {
    if (this.modal) {
      const content = this.modal.querySelector('.meal-plan-content');
      if (content) {
        content.innerHTML = this.generateHTML().match(/<div class="meal-plan-content">([\s\S]*)<\/div>/)?.[1] || '';
        this.setupEventListeners();
      }
    }
  }

  private generateShoppingList(): void {
    const ingredients = new Map<string, number>();
    const weekDays = this.getWeekDays();
    
    weekDays.forEach(day => {
      const dateStr = this.formatDate(day);
      const mealPlan = this.mealPlans.get(dateStr);
      
      if (mealPlan) {
        [mealPlan.breakfast, mealPlan.lunch, mealPlan.dinner].forEach(recipe => {
          if (recipe) {
            // Simuler des ingrédients (dans une vraie app, ils seraient stockés avec la recette)
            const recipeIngredients = this.getRecipeIngredients(recipe);
            recipeIngredients.forEach(ingredient => {
              const current = ingredients.get(ingredient.name) || 0;
              ingredients.set(ingredient.name, current + ingredient.quantity);
            });
          }
        });
      }
    });

    this.showShoppingList(ingredients);
  }

  private getRecipeIngredients(recipe: any): Array<{name: string, quantity: number}> {
    // Simulation - dans une vraie app, les ingrédients seraient stockés avec la recette
    return [
      { name: 'Tomates', quantity: 2 },
      { name: 'Oignons', quantity: 1 },
      { name: 'Ail', quantity: 3 },
      { name: 'Huile d\'olive', quantity: 1 }
    ];
  }

  private showShoppingList(ingredients: Map<string, number>): void {
    const ingredientsList = Array.from(ingredients.entries())
      .map(([name, quantity]) => `<li>${name} (${quantity})</li>`)
      .join('');

    this.notificationService.info('Liste de courses générée', 
      `Liste créée avec ${ingredients.size} ingrédients différents`);
    
    // Ici on pourrait ouvrir une nouvelle modal avec la liste détaillée
    console.log('Liste de courses:', ingredients);
  }

  private clearWeek(): void {
    const weekDays = this.getWeekDays();
    weekDays.forEach(day => {
      const dateStr = this.formatDate(day);
      this.mealPlans.delete(dateStr);
    });
    
    this.refreshModal();
    this.notificationService.info('Semaine vidée', 'Tous les repas de la semaine ont été supprimés');
  }

  private saveMealPlan(): void {
    this.storeMealPlans();
    this.notificationService.success('Plan sauvegardé !', 'Votre planification de repas a été enregistrée');
  }

  private loadMealPlans(): void {
    const stored = localStorage.getItem('mealPlans');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.mealPlans = new Map(Object.entries(data));
      } catch (e) {
        console.error('Erreur lors du chargement des plans de repas:', e);
      }
    }
  }

  private storeMealPlans(): void {
    const data = Object.fromEntries(this.mealPlans);
    localStorage.setItem('mealPlans', JSON.stringify(data));
  }

  public close(): void {
    if (this.modal) {
      this.modal.classList.add('closing');
      setTimeout(() => {
        if (this.modal && document.body.contains(this.modal)) {
          document.body.removeChild(this.modal);
        }
        this.modal = null;
      }, 300);
    }
    
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }
}