import { DataService } from '../services/DataService';
import { AuthService } from '../services/AuthService';
import { FavoritesService } from '../services/FavoritesService';
import { RecipeDetailModal } from '../components/RecipeDetailModal';
import { NotificationService } from '../services/NotificationService';

export class HomePage {
  private dataService: DataService;
  private authService: AuthService;
  private favoritesService: FavoritesService;
  private static recipeModal: RecipeDetailModal;
  private notificationService: NotificationService;

  constructor() {
    this.dataService = DataService.getInstance();
    this.authService = AuthService.getInstance();
    this.favoritesService = FavoritesService.getInstance();
    this.notificationService = NotificationService.getInstance();
    
    if (!HomePage.recipeModal) {
      HomePage.recipeModal = new RecipeDetailModal();
    }
  }

  static render(): string {
    const homePage = new HomePage();
    return homePage.generateHTML();
  }

  private generateHTML(): string {
    const regions = this.dataService.getAllRegions();
    const recipes = this.dataService.getAllRecipes();
    const featuredRecipes = recipes.slice(0, 8);
    const currentUser = this.authService.getCurrentUser();

    return `
      <div class="catefood-home">
        <!-- Hero Section avec Vidéo de Fond -->
        <section class="hero-catefood">
          <video class="hero-video-bg" autoplay muted loop playsinline>
            <source src="/aliment pour diabetique .mp4" type="video/mp4">
          </video>
          <div class="hero-overlay"></div>
          <div class="hero-content-wrapper">
            <div class="hero-badge">
              <span class="material-symbols-outlined">restaurant</span>
              Cuisine Traditionnelle Camerounaise
            </div>
            <h1 class="hero-main-title">
              PLATS EXQUIS POUR<br>
              <span class="hero-highlight">OCCASIONS SPÉCIALES</span>
            </h1>
            <p class="hero-subtitle">
              Découvrez l'authenticité des saveurs camerounaises transmises de génération en génération
            </p>
            <button class="hero-cta-btn" id="explore-recipes-btn">
              <span class="material-symbols-outlined">explore</span>
              Explorer les Recettes
            </button>
          </div>
          
          <!-- Floating Recipe Cards -->
          <div class="floating-cards">
            ${this.generateFloatingCards(recipes.slice(0, 2))}
          </div>
        </section>

        <!-- About Section -->
        <section class="about-section">
          <div class="about-grid">
            <div class="about-image">
              <img src="/images/littoral/ndolé.jpeg" alt="Notre Histoire" />
              <div class="about-image-overlay">
                <span class="material-symbols-outlined">local_dining</span>
              </div>
            </div>
            <div class="about-content">
              <span class="section-label">À Propos</span>
              <h2 class="section-title">
                NOTRE VOYAGE DANS LE MONDE<br>
                DE LA <span class="text-highlight">CUISINE CAMEROUNAISE</span>
              </h2>
              <p class="about-text">
                Depuis des générations, la cuisine camerounaise représente un patrimoine culturel 
                riche et diversifié. Chaque région apporte ses spécialités uniques, créant une 
                mosaïque de saveurs authentiques qui racontent l'histoire de notre peuple.
              </p>
              <p class="about-text">
                Notre plateforme vous permet de découvrir et maîtriser ces recettes traditionnelles, 
                préservant ainsi notre héritage culinaire pour les générations futures.
              </p>
              <div class="about-stats">
                <div class="stat-box">
                  <span class="stat-number">${recipes.length}+</span>
                  <span class="stat-label">Recettes</span>
                </div>
                <div class="stat-box">
                  <span class="stat-number">${regions.length}</span>
                  <span class="stat-label">Régions</span>
                </div>
                <div class="stat-box">
                  <span class="stat-number">1000+</span>
                  <span class="stat-label">Utilisateurs</span>
                </div>
              </div>
              <button class="about-cta-btn" data-navigate="regions">
                Découvrir Plus
                <span class="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Featured Recipes Section -->
        <section class="featured-section">
          <div class="section-header-center">
            <span class="section-label">Nos Spécialités</span>
            <h2 class="section-title">RECETTES POPULAIRES</h2>
            <p class="section-description">
              Découvrez nos plats les plus appréciés, préparés avec passion et authenticité
            </p>
          </div>
          
          <div class="recipes-showcase-grid">
            ${featuredRecipes.map(recipe => this.generateRecipeShowcaseCard(recipe, currentUser)).join('')}
          </div>
        </section>

        <!-- Regions Explorer Section -->
        <section class="regions-showcase">
          <div class="section-header-center">
            <span class="section-label">Explorez</span>
            <h2 class="section-title">NOS RÉGIONS CULINAIRES</h2>
            <p class="section-description">
              Chaque région du Cameroun possède ses propres trésors gastronomiques
            </p>
          </div>
          
          <div class="regions-masonry">
            ${regions.slice(0, 6).map((region, index) => this.generateRegionShowcaseCard(region, index)).join('')}
          </div>
          
          <div class="section-cta">
            <button class="cta-outline-btn" data-navigate="regions">
              Voir Toutes les Régions
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </section>

        <!-- Work Examples Section -->
        <section class="work-examples-section">
          <div class="section-header-center">
            <span class="section-label">Portfolio</span>
            <h2 class="section-title">EXEMPLES DE RÉALISATIONS</h2>
          </div>
          
          <div class="work-examples-grid">
            <div class="work-example-card">
              <div class="work-image">
                <img src="/images/ouest/Atchu.jpeg" alt="Service Banquet" />
                <div class="work-overlay">
                  <span class="material-symbols-outlined">visibility</span>
                </div>
              </div>
              <div class="work-content">
                <h3>SERVICE BANQUET</h3>
                <p class="work-location">
                  <span class="material-symbols-outlined">location_on</span>
                  Région Ouest - Bamiléké
                </p>
                <p class="work-description">
                  L'Atchu est une soupe royale servie lors des grandes cérémonies. 
                  Un plat de prestige qui symbolise la générosité et l'hospitalité bamiléké.
                </p>
              </div>
            </div>
            
            <div class="work-example-card">
              <div class="work-image">
                <img src="/images/littoral/Mbongo tchobi.jpeg" alt="Cuisine Traditionnelle" />
                <div class="work-overlay">
                  <span class="material-symbols-outlined">visibility</span>
                </div>
              </div>
              <div class="work-content">
                <h3>CUISINE TRADITIONNELLE</h3>
                <p class="work-location">
                  <span class="material-symbols-outlined">location_on</span>
                  Région Littoral - Bassa
                </p>
                <p class="work-description">
                  Le Mbongo Tchobi, plat emblématique du Cameroun avec sa sauce noire 
                  caractéristique obtenue grâce aux épices mbongo carbonisées.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Booking/CTA Section -->
        <section class="booking-section">
          <div class="booking-overlay"></div>
          <div class="booking-content">
            <div class="booking-text">
              <span class="section-label-light">Rejoignez-nous</span>
              <h2 class="booking-title">COMMENCEZ VOTRE VOYAGE CULINAIRE</h2>
              <p class="booking-description">
                Inscrivez-vous gratuitement et accédez à toutes nos recettes authentiques, 
                vidéos tutoriels et conseils de chefs professionnels.
              </p>
            </div>
            <div class="booking-form-wrapper">
              <div class="booking-form">
                <div class="form-group-inline">
                  <div class="input-wrapper">
                    <span class="material-symbols-outlined">person</span>
                    <input type="text" placeholder="Votre nom" id="signup-name" />
                  </div>
                  <div class="input-wrapper">
                    <span class="material-symbols-outlined">email</span>
                    <input type="email" placeholder="Votre email" id="signup-email" />
                  </div>
                </div>
                <button class="booking-submit-btn" id="signup-cta-btn">
                  S'inscrire Maintenant
                  <span class="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer Info Section -->
        <section class="footer-info-section">
          <div class="footer-info-grid">
            <div class="footer-info-item">
              <div class="footer-icon">
                <span class="material-symbols-outlined">restaurant_menu</span>
              </div>
              <h3>Recettes Authentiques</h3>
              <p>Toutes nos recettes sont vérifiées par des chefs camerounais expérimentés</p>
            </div>
            <div class="footer-info-item">
              <div class="footer-icon">
                <span class="material-symbols-outlined">play_circle</span>
              </div>
              <h3>Vidéos Tutoriels</h3>
              <p>Apprenez pas à pas avec nos vidéos de démonstration détaillées</p>
            </div>
            <div class="footer-info-item">
              <div class="footer-icon">
                <span class="material-symbols-outlined">group</span>
              </div>
              <h3>Communauté Active</h3>
              <p>Partagez vos créations et découvrez celles des autres passionnés</p>
            </div>
            <div class="footer-info-item">
              <div class="footer-icon">
                <span class="material-symbols-outlined">favorite</span>
              </div>
              <h3>Favoris Personnalisés</h3>
              <p>Sauvegardez vos recettes préférées et créez vos propres collections</p>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  private generateFloatingCards(recipes: any[]): string {
    return recipes.map((recipe, index) => `
      <div class="floating-card floating-card-${index + 1}" data-recipe-id="${recipe.getIdRecette()}">
        <div class="floating-card-image">
          <img src="${recipe.getImageURL()}" alt="${recipe.getTitre()}" />
        </div>
        <div class="floating-card-content">
          <h4>${recipe.getTitre()}</h4>
          <p class="floating-card-price">$${(Math.random() * 10 + 5).toFixed(2)}</p>
          <p class="floating-card-description">${recipe.getDescription().substring(0, 80)}...</p>
        </div>
      </div>
    `).join('');
  }

  private generateRecipeShowcaseCard(recipe: any, currentUser: any): string {
    const isFavorited = currentUser ? 
      this.favoritesService.isFavorite(currentUser.getIdUtilisateur(), recipe.getIdRecette()) : 
      false;

    return `
      <div class="recipe-showcase-card" data-recipe-id="${recipe.getIdRecette()}">
        <div class="recipe-showcase-image">
          <img src="${recipe.getImageURL()}" alt="${recipe.getTitre()}" loading="lazy" />
          <div class="recipe-showcase-overlay">
            <button class="favorite-btn-showcase ${isFavorited ? 'favorited' : ''}" data-recipe-id="${recipe.getIdRecette()}">
              <span class="material-symbols-outlined">${isFavorited ? 'favorite' : 'favorite_border'}</span>
            </button>
            <button class="view-recipe-btn">
              <span class="material-symbols-outlined">visibility</span>
            </button>
          </div>
          <div class="recipe-showcase-badge">
            <span class="material-symbols-outlined">schedule</span>
            ${recipe.getTempsFormate()}
          </div>
        </div>
        <div class="recipe-showcase-content">
          <span class="recipe-region-tag">${recipe.getRegion()}</span>
          <h3 class="recipe-showcase-title">${recipe.getTitre()}</h3>
          <p class="recipe-showcase-description">${recipe.getDescription().substring(0, 100)}...</p>
          <div class="recipe-showcase-meta">
            <span class="difficulty-tag ${recipe.getDifficulte().toLowerCase()}">${recipe.getDifficulte()}</span>
            <span class="rating-display">
              <span class="material-symbols-outlined">star</span>
              4.8
            </span>
          </div>
        </div>
      </div>
    `;
  }

  private generateRegionShowcaseCard(region: any, index: number): string {
    const sizes = ['large', 'medium', 'medium', 'large', 'medium', 'medium'];
    const size = sizes[index % sizes.length];

    return `
      <div class="region-showcase-card region-${size}" data-region="${region.getNomRegion()}">
        <div class="region-showcase-image">
          <img src="${region.getImageURL()}" alt="${region.getNomRegion()}" loading="lazy" />
        </div>
        <div class="region-showcase-overlay">
          <div class="region-showcase-content">
            <span class="region-emoji">${region.getEmoji()}</span>
            <h3 class="region-showcase-title">${region.getNomRegion()}</h3>
            <p class="region-showcase-count">${region.getSpecialites().length} spécialités</p>
            <button class="region-explore-btn">
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  public static setupEventListeners(): void {
    const homePage = new HomePage();
    
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Hero CTA
      if (target.closest('#explore-recipes-btn')) {
        const recipesSection = document.querySelector('.featured-section');
        recipesSection?.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Signup CTA
      if (target.closest('#signup-cta-btn')) {
        homePage.handleSignupCTA();
      }
      
      // Recipe cards
      const recipeCard = target.closest('.recipe-showcase-card, .floating-card');
      if (recipeCard && !target.closest('.favorite-btn-showcase')) {
        const recipeId = parseInt(recipeCard.getAttribute('data-recipe-id') || '0');
        homePage.showRecipeDetails(recipeId);
      }
      
      // Region cards
      const regionCard = target.closest('.region-showcase-card');
      if (regionCard) {
        const regionName = regionCard.getAttribute('data-region') || '';
        homePage.exploreRegion(regionName);
      }
      
      // Favorite buttons
      const favoriteBtn = target.closest('.favorite-btn-showcase');
      if (favoriteBtn) {
        e.stopPropagation();
        const recipeId = parseInt(favoriteBtn.getAttribute('data-recipe-id') || '0');
        homePage.toggleFavorite(recipeId, favoriteBtn as HTMLElement);
      }
    });
  }

  private showRecipeDetails(recipeId: number): void {
    const recipe = this.dataService.getRecipeById(recipeId);
    if (recipe) {
      HomePage.recipeModal.show(recipe);
    }
  }

  private exploreRegion(regionName: string): void {
    document.dispatchEvent(new CustomEvent('navigate-to-region', { 
      detail: { region: regionName } 
    }));
  }

  private toggleFavorite(recipeId: number, button: HTMLElement): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.notificationService.warning('Connexion requise', 'Veuillez vous connecter pour ajouter des favoris');
      return;
    }

    const userId = currentUser.getIdUtilisateur();
    const isFavorited = this.favoritesService.isFavorite(userId, recipeId);

    if (isFavorited) {
      this.favoritesService.retirerDesFavoris(userId, recipeId);
      button.classList.remove('favorited');
      button.querySelector('.material-symbols-outlined')!.textContent = 'favorite_border';
      this.notificationService.info('Retiré', 'Recette retirée des favoris');
    } else {
      this.favoritesService.favoriserRecette(userId, recipeId);
      button.classList.add('favorited');
      button.querySelector('.material-symbols-outlined')!.textContent = 'favorite';
      this.notificationService.success('Ajouté', 'Recette ajoutée aux favoris');
    }
  }

  private handleSignupCTA(): void {
    const nameInput = document.getElementById('signup-name') as HTMLInputElement;
    const emailInput = document.getElementById('signup-email') as HTMLInputElement;
    
    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();

    if (!name || !email) {
      this.notificationService.warning('Champs requis', 'Veuillez remplir tous les champs');
      return;
    }

    if (!email.includes('@')) {
      this.notificationService.error('Email invalide', 'Veuillez saisir une adresse email valide');
      return;
    }

    // Redirect to login page for full registration
    this.notificationService.success('Bienvenue !', 'Complétez votre inscription');
    setTimeout(() => {
      window.location.hash = '#/login';
    }, 1000);
  }
}
