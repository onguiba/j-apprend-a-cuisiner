import { Recipe } from '../models/Recipe';
import { VideoPlayer } from './VideoPlayer';

export class RecipeDetailModal {
  private modal: HTMLElement | null = null;
  private videoPlayer: VideoPlayer | null = null;

  public show(recipe: Recipe): void {
    this.close(); // Fermer toute modal existante

    // Créer la modal
    this.modal = document.createElement('div');
    this.modal.className = 'recipe-detail-modal';
    this.modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close-btn">
          <span class="material-symbols-outlined">close</span>
        </button>
        
        <div class="modal-header">
          <h2>${recipe.getTitre()}</h2>
          <div class="recipe-meta">
            <span class="meta-item">
              <span class="material-symbols-outlined">location_on</span>
              ${recipe.getRegionAssociee()}
            </span>
            <span class="meta-item">
              <span class="material-symbols-outlined">schedule</span>
              ${recipe.getTempsFormate()}
            </span>
            <span class="meta-item">
              <span class="material-symbols-outlined">${recipe.getDifficulteIcon()}</span>
              ${recipe.getDifficulte()}
            </span>
            <span class="meta-item">
              <span class="material-symbols-outlined">person</span>
              ${recipe.getAuteur()}
            </span>
          </div>
        </div>

        <div class="modal-body">
          ${recipe.hasVideo() ? `
            <div class="recipe-video-section">
              <h3>
                <span class="material-symbols-outlined">play_circle</span>
                Vidéo de préparation
                ${recipe.hasSubtitles() ? '<span class="subtitle-badge">Sous-titres disponibles</span>' : ''}
              </h3>
              <div id="recipe-video-player"></div>
            </div>
          ` : ''}

          <div class="recipe-image-section">
            <img src="${recipe.getImageURL()}" alt="${recipe.getTitre()}" />
          </div>

          <div class="recipe-description-section">
            <h3>
              <span class="material-symbols-outlined">description</span>
              Description
            </h3>
            <p>${recipe.getDescription()}</p>
          </div>

          <div class="recipe-ingredients-section">
            <h3>
              <span class="material-symbols-outlined">shopping_cart</span>
              Ingrédients
            </h3>
            <div class="ingredients-list">
              ${this.formatIngredients(recipe.getIngredients())}
            </div>
          </div>

          <div class="recipe-instructions-section">
            <h3>
              <span class="material-symbols-outlined">menu_book</span>
              Instructions
            </h3>
            <div class="instructions-list">
              ${this.formatInstructions(recipe.getInstructions())}
            </div>
          </div>

          <div class="recipe-actions">
            <button class="action-btn favorite-btn" data-recipe-id="${recipe.getIdRecette()}">
              <span class="material-symbols-outlined">favorite_border</span>
              Ajouter aux favoris
            </button>
            <button class="action-btn share-btn">
              <span class="material-symbols-outlined">share</span>
              Partager
            </button>
            <button class="action-btn print-btn">
              <span class="material-symbols-outlined">print</span>
              Imprimer
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    // Charger la vidéo si disponible
    if (recipe.hasVideo()) {
      this.videoPlayer = new VideoPlayer('recipe-video-player');
      this.videoPlayer.loadVideo(
        recipe.getVideoURL()!,
        recipe.getSubtitleURL(),
        recipe.getIdRecette()
      );
    }

    // Ajouter les événements
    this.attachEventListeners();

    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';

    // Animation d'entrée
    setTimeout(() => {
      this.modal?.classList.add('active');
    }, 10);
  }

  private formatIngredients(ingredients: string): string {
    const items = ingredients.split(',').map(item => item.trim());
    return items.map(item => `
      <div class="ingredient-item">
        <span class="material-symbols-outlined">check_circle</span>
        <span>${item}</span>
      </div>
    `).join('');
  }

  private formatInstructions(instructions: string): string {
    const steps = instructions.split('.').filter(step => step.trim().length > 0);
    return steps.map((step, index) => `
      <div class="instruction-step">
        <div class="step-number">${index + 1}</div>
        <div class="step-content">${step.trim()}.</div>
      </div>
    `).join('');
  }

  private attachEventListeners(): void {
    if (!this.modal) return;

    // Bouton de fermeture
    const closeBtn = this.modal.querySelector('.modal-close-btn');
    closeBtn?.addEventListener('click', () => this.close());

    // Clic sur l'overlay
    const overlay = this.modal.querySelector('.modal-overlay');
    overlay?.addEventListener('click', () => this.close());

    // Bouton partager
    const shareBtn = this.modal.querySelector('.share-btn');
    shareBtn?.addEventListener('click', () => this.shareRecipe());

    // Bouton imprimer
    const printBtn = this.modal.querySelector('.print-btn');
    printBtn?.addEventListener('click', () => this.printRecipe());

    // Touche Échap pour fermer
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  private handleEscapeKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      this.close();
    }
  };

  private shareRecipe(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Recette camerounaise',
        text: 'Découvrez cette délicieuse recette !',
        url: window.location.href
      }).catch(err => console.log('Erreur de partage:', err));
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  }

  private printRecipe(): void {
    window.print();
  }

  public close(): void {
    if (!this.modal) return;

    // Animation de sortie
    this.modal.classList.remove('active');

    setTimeout(() => {
      // Nettoyer le lecteur vidéo
      if (this.videoPlayer) {
        this.videoPlayer.destroy();
        this.videoPlayer = null;
      }

      // Supprimer la modal
      this.modal?.remove();
      this.modal = null;

      // Réactiver le scroll
      document.body.style.overflow = '';

      // Retirer l'écouteur d'événement
      document.removeEventListener('keydown', this.handleEscapeKey);
    }, 300);
  }
}
