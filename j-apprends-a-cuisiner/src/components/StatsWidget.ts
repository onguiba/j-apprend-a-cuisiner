import { DataService } from '../services/DataService';
import { AuthService } from '../services/AuthService';
import { FavoritesService } from '../services/FavoritesService';
import { RecipeService } from '../services/RecipeService';

export interface AppStats {
  totalRecipes: number;
  totalRegions: number;
  totalUsers: number;
  totalFavorites: number;
  popularRecipes: Array<{ recipe: any; views: number }>;
  recipesByRegion: { [region: string]: number };
  userActivity: {
    activeUsers: number;
    newUsersThisWeek: number;
  };
}

export class StatsWidget {
  private dataService: DataService;
  private authService: AuthService;
  private favoritesService: FavoritesService;
  private recipeService: RecipeService;

  constructor() {
    this.dataService = DataService.getInstance();
    this.authService = AuthService.getInstance();
    this.favoritesService = FavoritesService.getInstance();
    this.recipeService = RecipeService.getInstance();
  }

  public generateStatsHTML(compact: boolean = false): string {
    const stats = this.getAppStats();
    
    if (compact) {
      return this.generateCompactStats(stats);
    } else {
      return this.generateDetailedStats(stats);
    }
  }

  private getAppStats(): AppStats {
    const recipes = this.dataService.getAllRecipes();
    const regions = this.dataService.getAllRegions();
    const users = this.authService.getAllUsers();
    const favoritesStats = this.favoritesService.getFavoritesStats();
    const popularRecipes = this.recipeService.getRecettesLesPlusVues(5);
    const recipeStats = this.recipeService.getStatistiquesRecettes();

    return {
      totalRecipes: recipes.length,
      totalRegions: regions.length,
      totalUsers: users.length,
      totalFavorites: favoritesStats.totalFavorites,
      popularRecipes,
      recipesByRegion: recipeStats.recettesParRegion,
      userActivity: {
        activeUsers: users.length, // Simulation
        newUsersThisWeek: Math.floor(users.length * 0.1) // Simulation
      }
    };
  }

  private generateCompactStats(stats: AppStats): string {
    return `
      <div class="stats-widget-compact">
        <div class="compact-stat">
          <span class="material-symbols-outlined">restaurant_menu</span>
          <div class="stat-info">
            <span class="stat-number">${stats.totalRecipes}</span>
            <span class="stat-label">Recettes</span>
          </div>
        </div>
        <div class="compact-stat">
          <span class="material-symbols-outlined">explore</span>
          <div class="stat-info">
            <span class="stat-number">${stats.totalRegions}</span>
            <span class="stat-label">Régions</span>
          </div>
        </div>
        <div class="compact-stat">
          <span class="material-symbols-outlined">group</span>
          <div class="stat-info">
            <span class="stat-number">${stats.totalUsers}</span>
            <span class="stat-label">Utilisateurs</span>
          </div>
        </div>
        <div class="compact-stat">
          <span class="material-symbols-outlined">favorite</span>
          <div class="stat-info">
            <span class="stat-number">${stats.totalFavorites}</span>
            <span class="stat-label">Favoris</span>
          </div>
        </div>
      </div>
    `;
  }

  private generateDetailedStats(stats: AppStats): string {
    return `
      <div class="stats-widget-detailed">
        <div class="stats-header">
          <h3>Statistiques de l'application</h3>
          <span class="stats-timestamp">Mis à jour maintenant</span>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon">
              <span class="material-symbols-outlined">restaurant_menu</span>
            </div>
            <div class="stat-content">
              <div class="stat-number">${stats.totalRecipes}</div>
              <div class="stat-label">Recettes disponibles</div>
              <div class="stat-trend positive">
                <span class="material-symbols-outlined">trending_up</span>
                +${Math.floor(stats.totalRecipes * 0.05)} cette semaine
              </div>
            </div>
          </div>

          <div class="stat-card secondary">
            <div class="stat-icon">
              <span class="material-symbols-outlined">group</span>
            </div>
            <div class="stat-content">
              <div class="stat-number">${stats.totalUsers}</div>
              <div class="stat-label">Utilisateurs inscrits</div>
              <div class="stat-trend positive">
                <span class="material-symbols-outlined">person_add</span>
                +${stats.userActivity.newUsersThisWeek} nouveaux
              </div>
            </div>
          </div>

          <div class="stat-card accent">
            <div class="stat-icon">
              <span class="material-symbols-outlined">favorite</span>
            </div>
            <div class="stat-content">
              <div class="stat-number">${stats.totalFavorites}</div>
              <div class="stat-label">Favoris ajoutés</div>
              <div class="stat-trend neutral">
                <span class="material-symbols-outlined">bookmark</span>
                ${Math.round(stats.totalFavorites / stats.totalUsers)} par utilisateur
              </div>
            </div>
          </div>

          <div class="stat-card info">
            <div class="stat-icon">
              <span class="material-symbols-outlined">explore</span>
            </div>
            <div class="stat-content">
              <div class="stat-number">${stats.totalRegions}</div>
              <div class="stat-label">Régions couvertes</div>
              <div class="stat-trend neutral">
                <span class="material-symbols-outlined">map</span>
                Cameroun complet
              </div>
            </div>
          </div>
        </div>

        <div class="stats-charts">
          <div class="chart-section">
            <h4>Recettes par région</h4>
            <div class="region-chart">
              ${this.generateRegionChart(stats.recipesByRegion)}
            </div>
          </div>

          <div class="chart-section">
            <h4>Recettes populaires</h4>
            <div class="popular-recipes">
              ${stats.popularRecipes.map((item, index) => `
                <div class="popular-recipe-item">
                  <span class="recipe-rank">#${index + 1}</span>
                  <div class="recipe-info">
                    <span class="recipe-name">${item.recipe.getTitre()}</span>
                    <span class="recipe-views">${item.views} vues</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private generateRegionChart(recipesByRegion: { [region: string]: number }): string {
    const maxRecipes = Math.max(...Object.values(recipesByRegion));
    
    return Object.entries(recipesByRegion)
      .sort(([,a], [,b]) => b - a)
      .map(([region, count]) => {
        const percentage = (count / maxRecipes) * 100;
        return `
          <div class="region-bar">
            <div class="region-label">${region}</div>
            <div class="region-progress">
              <div class="region-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="region-count">${count}</div>
          </div>
        `;
      }).join('');
  }

  public generateLiveStats(): string {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return '';

    const userFavorites = this.favoritesService.getFavoritesCount(currentUser.getIdUtilisateur());
    const allRecipes = this.dataService.getAllRecipes();
    const userRegion = currentUser.getRegionOrigine();
    const regionalRecipes = allRecipes.filter(recipe => recipe.getRegionAssociee() === userRegion);

    return `
      <div class="live-stats">
        <div class="live-stat">
          <span class="material-symbols-outlined">bookmark</span>
          <span>${userFavorites} favoris</span>
        </div>
        <div class="live-stat">
          <span class="material-symbols-outlined">location_on</span>
          <span>${regionalRecipes.length} recettes de ${userRegion}</span>
        </div>
        <div class="live-stat">
          <span class="material-symbols-outlined">schedule</span>
          <span>Connecté depuis ${this.getConnectionTime()}</span>
        </div>
      </div>
    `;
  }

  private getConnectionTime(): string {
    // Simulation du temps de connexion
    const minutes = Math.floor(Math.random() * 60) + 1;
    return minutes < 60 ? `${minutes}min` : `${Math.floor(minutes / 60)}h${minutes % 60}min`;
  }

  public generateQuickInsights(): string {
    const stats = this.getAppStats();
    const insights = this.generateInsights(stats);

    return `
      <div class="quick-insights">
        <h4>Aperçus rapides</h4>
        <div class="insights-list">
          ${insights.map(insight => `
            <div class="insight-item ${insight.type}">
              <span class="material-symbols-outlined">${insight.icon}</span>
              <span class="insight-text">${insight.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private generateInsights(stats: AppStats): Array<{
    type: 'positive' | 'neutral' | 'info';
    icon: string;
    text: string;
  }> {
    const insights = [];

    // Insight sur la région la plus populaire
    const topRegion = Object.entries(stats.recipesByRegion)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topRegion) {
      insights.push({
        type: 'positive' as const,
        icon: 'trending_up',
        text: `${topRegion[0]} est la région avec le plus de recettes (${topRegion[1]})`
      });
    }

    // Insight sur l'activité des utilisateurs
    const avgFavorites = Math.round(stats.totalFavorites / stats.totalUsers);
    insights.push({
      type: 'info' as const,
      icon: 'analytics',
      text: `En moyenne, chaque utilisateur a ${avgFavorites} recettes favorites`
    });

    // Insight sur la croissance
    insights.push({
      type: 'positive' as const,
      icon: 'group_add',
      text: `${stats.userActivity.newUsersThisWeek} nouveaux utilisateurs cette semaine`
    });

    return insights;
  }
}