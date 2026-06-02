import { Recipe } from './Recipe';

export class Region {
  private idRegion: number;
  private nomRegion: string;
  private description: string;
  private imageURL: string;
  private specialites: string[];
  private recettes: Recipe[];

  constructor(
    idRegion: number,
    nomRegion: string,
    description: string,
    imageURL: string,
    specialites: string[] = []
  ) {
    this.idRegion = idRegion;
    this.nomRegion = nomRegion;
    this.description = description;
    this.imageURL = imageURL;
    this.specialites = specialites;
    this.recettes = [];
  }

  // Getters
  public getIdRegion(): number {
    return this.idRegion;
  }

  public getNomRegion(): string {
    return this.nomRegion;
  }

  public getDescription(): string {
    return this.description;
  }

  public getImageURL(): string {
    return this.imageURL;
  }

  public getSpecialites(): string[] {
    return this.specialites;
  }

  public getRecettes(): Recipe[] {
    return this.recettes;
  }

  // Setters
  public setDescription(description: string): void {
    this.description = description;
  }

  public setImageURL(imageURL: string): void {
    this.imageURL = imageURL;
  }

  // Méthodes
  public listerRecettesRegion(): Recipe[] {
    return this.recettes.filter(recette => 
      recette.getRegionAssociee() === this.nomRegion
    );
  }

  public ajouterRecette(recette: Recipe): void {
    if (recette.getRegionAssociee() === this.nomRegion) {
      this.recettes.push(recette);
    } else {
      console.warn(`La recette ${recette.getTitre()} n'appartient pas à la région ${this.nomRegion}`);
    }
  }

  public supprimerRecette(idRecette: number): boolean {
    const index = this.recettes.findIndex(recette => recette.getIdRecette() === idRecette);
    if (index !== -1) {
      this.recettes.splice(index, 1);
      return true;
    }
    return false;
  }

  public getNombreRecettes(): number {
    return this.recettes.length;
  }

  public ajouterSpecialite(specialite: string): void {
    if (!this.specialites.includes(specialite)) {
      this.specialites.push(specialite);
    }
  }

  public supprimerSpecialite(specialite: string): boolean {
    const index = this.specialites.indexOf(specialite);
    if (index !== -1) {
      this.specialites.splice(index, 1);
      return true;
    }
    return false;
  }

  // Méthode pour générer le HTML de la carte de région
  public toCardHTML(isActive: boolean = false): string {
    return `
      <div class="region-card-modern ${isActive ? 'active' : ''}" data-region="${this.nomRegion}">
        <div class="region-image-modern" style="background-image: url('${this.imageURL}')">
          <div class="region-overlay-modern">
            <h3 class="region-name-modern">${this.nomRegion}</h3>
            <p class="region-subtitle">${this.getSubtitle()}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Méthode pour générer le HTML détaillé de la région
  public toDetailHTML(): string {
    return `
      <div class="region-detail-card" style="--region-color: ${this.getRegionColor()}">
        <div class="region-detail-image" style="background-image: url('${this.imageURL}')">
          <div class="region-overlay">
            <h4 class="region-detail-name">${this.nomRegion}</h4>
          </div>
        </div>
        <div class="region-detail-content">
          <p class="region-description">${this.description}</p>
          <div class="region-specialties">
            <h5 class="specialties-title">Spécialités :</h5>
            <div class="specialties-list">
              ${this.specialites.map(specialite => `
                <span class="specialty-tag" style="background-color: ${this.getRegionColor()}20; color: ${this.getRegionColor()}">
                  ${specialite}
                </span>
              `).join('')}
            </div>
          </div>
          <button class="explore-region-btn" style="background-color: ${this.getRegionColor()}">
            Explorer les recettes (${this.getNombreRecettes()})
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    `;
  }

  private getSubtitle(): string {
    const subtitles: { [key: string]: string } = {
      'Littoral': 'Héritage Sawa',
      'Ouest': 'Hauts Plateaux',
      'Centre': 'Cœur du pays',
      'Extrême-Nord': 'Saveurs sahéliennes',
      'Nord-Ouest': 'Traditions montagnardes',
      'Sud-Ouest': 'Richesses forestières'
    };
    return subtitles[this.nomRegion] || 'Région du Cameroun';
  }

  private getRegionColor(): string {
    const colors: { [key: string]: string } = {
      'Littoral': '#0ea5e9',
      'Ouest': '#8b5cf6',
      'Centre': '#10b981',
      'Extrême-Nord': '#f59e0b',
      'Nord-Ouest': '#ef4444',
      'Sud-Ouest': '#06b6d4'
    };
    return colors[this.nomRegion] || '#ff6b35';
  }
}