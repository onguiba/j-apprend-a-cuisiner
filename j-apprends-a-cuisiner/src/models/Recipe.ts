export class Recipe {
  private idRecette: number;
  private titre: string;
  private description: string;
  private ingredients: string;
  private instructions: string;
  private regionAssociee: string;
  private imageURL: string;
  private videoURL?: string; // URL de la vidéo de la recette
  private subtitleURL?: string; // URL des sous-titres (format WebVTT)
  private tempsPreparation: number; // en minutes
  private difficulte: 'Facile' | 'Moyen' | 'Difficile' | 'Avancé';
  private dateCreation: Date;
  private auteur: string;

  constructor(
    idRecette: number,
    titre: string,
    description: string,
    ingredients: string,
    instructions: string,
    regionAssociee: string,
    imageURL: string,
    tempsPreparation: number,
    difficulte: 'Facile' | 'Moyen' | 'Difficile' | 'Avancé',
    auteur: string,
    dateCreation: Date = new Date(),
    videoURL?: string,
    subtitleURL?: string
  ) {
    this.idRecette = idRecette;
    this.titre = titre;
    this.description = description;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.regionAssociee = regionAssociee;
    this.imageURL = imageURL;
    this.videoURL = videoURL;
    this.subtitleURL = subtitleURL;
    this.tempsPreparation = tempsPreparation;
    this.difficulte = difficulte;
    this.auteur = auteur;
    this.dateCreation = dateCreation;
  }

  // Getters
  public getIdRecette(): number {
    return this.idRecette;
  }

  public getTitre(): string {
    return this.titre;
  }

  public getDescription(): string {
    return this.description;
  }

  public getIngredients(): string {
    return this.ingredients;
  }

  public getInstructions(): string {
    return this.instructions;
  }

  public getRegionAssociee(): string {
    return this.regionAssociee;
  }

  public getImageURL(): string {
    return this.imageURL;
  }

  public getTempsPreparation(): number {
    return this.tempsPreparation;
  }

  public getDifficulte(): string {
    return this.difficulte;
  }

  public getAuteur(): string {
    return this.auteur;
  }

  public getDateCreation(): Date {
    return this.dateCreation;
  }

  public getVideoURL(): string | undefined {
    return this.videoURL;
  }

  public getSubtitleURL(): string | undefined {
    return this.subtitleURL;
  }

  public hasVideo(): boolean {
    return !!this.videoURL;
  }

  public hasSubtitles(): boolean {
    return !!this.subtitleURL;
  }

  // Méthodes
  public afficherDetails(): string {
    return `
      <div class="recipe-details">
        <h2>${this.titre}</h2>
        <p><strong>Région:</strong> ${this.regionAssociee}</p>
        <p><strong>Temps:</strong> ${this.tempsPreparation} min</p>
        <p><strong>Difficulté:</strong> ${this.difficulte}</p>
        <p><strong>Description:</strong> ${this.description}</p>
        <div class="ingredients">
          <h3>Ingrédients:</h3>
          <p>${this.ingredients}</p>
        </div>
        <div class="instructions">
          <h3>Instructions:</h3>
          <p>${this.instructions}</p>
        </div>
      </div>
    `;
  }

  public getTempsFormate(): string {
    if (this.tempsPreparation < 60) {
      return `${this.tempsPreparation} min`;
    } else {
      const heures = Math.floor(this.tempsPreparation / 60);
      const minutes = this.tempsPreparation % 60;
      return minutes > 0 ? `${heures}h ${minutes}min` : `${heures}h`;
    }
  }

  public getDifficulteIcon(): string {
    switch (this.difficulte) {
      case 'Facile':
        return 'signal_cellular_1_bar';
      case 'Moyen':
        return 'signal_cellular_alt';
      case 'Difficile':
        return 'signal_cellular_4_bar';
      case 'Avancé':
        return 'signal_cellular_4_bar';
      default:
        return 'signal_cellular_alt';
    }
  }

  // Méthode pour générer le HTML de la carte de recette
  public toCardHTML(): string {
    const videoIcon = this.hasVideo() ? '<span class="video-badge" title="Vidéo disponible">🎥</span>' : '';
    
    return `
      <div class="recipe-card-modern" data-recipe-id="${this.idRecette}">
        <div class="recipe-image-modern">
          <div class="recipe-bg" style="background-image: url('${this.imageURL}')"></div>
          ${videoIcon}
          <button class="favorite-btn" data-recipe-id="${this.idRecette}">
            <span class="material-symbols-outlined">favorite_border</span>
          </button>
          <div class="recipe-overlay">
            <h3 class="recipe-name">${this.titre}</h3>
            <div class="recipe-details">
              <span class="recipe-time">
                <span class="material-symbols-outlined">schedule</span>
                ${this.getTempsFormate()}
              </span>
              <span class="recipe-difficulty">
                <span class="material-symbols-outlined">${this.getDifficulteIcon()}</span>
                ${this.difficulte}
              </span>
            </div>
            <p class="recipe-description">${this.description}</p>
          </div>
        </div>
      </div>
    `;
  }
}