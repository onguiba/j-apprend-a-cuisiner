import { AuthService } from '../services/AuthService';
import { FavoritesService } from '../services/FavoritesService';
import { DataService } from '../services/DataService';
import { Administrator } from '../models/Administrator';
import { StatsWidget } from '../components/StatsWidget';

export class ProfilePage {
  private static authService = AuthService.getInstance();
  private static favoritesService = FavoritesService.getInstance();
  private static dataService = DataService.getInstance();
  private static statsWidget = new StatsWidget();

  static render(): string {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return this.renderNotLoggedIn();
    }

    return this.renderUserProfile(currentUser);
  }

  private static renderNotLoggedIn(): string {
    return `
      <div class="profile-page fade-in">
        <div class="empty-state">
          <div class="empty-icon">
            <span class="material-symbols-outlined">person</span>
          </div>
          <h3>Connectez-vous pour accéder à votre profil</h3>
          <p>Créez un compte ou connectez-vous pour gérer vos recettes et préférences</p>
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

  private static renderUserProfile(user: any): string {
    const isAdmin = user instanceof Administrator;
    const favoriteCount = this.favoritesService.getFavoritesCount(user.getIdUtilisateur());
    const allRecipes = this.dataService.getAllRecipes();
    const userRecipes = allRecipes.filter(recipe => recipe.getAuteur() === user.getNomComplet());

    return `
      <div class="profile-page fade-in">
        <div class="profile-header">
          <div class="profile-avatar">
            <div class="avatar-image">
              <span class="material-symbols-outlined">account_circle</span>
            </div>
            ${isAdmin ? '<div class="admin-badge">Admin</div>' : ''}
          </div>
          <div class="profile-info">
            <h2 class="profile-name">${user.getNomComplet()}</h2>
            <p class="profile-subtitle">${user.getEmail()}</p>
            <p class="profile-region">Région: ${user.getRegionOrigine()}</p>
            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-number">${userRecipes.length}</span>
                <span class="stat-label">Recettes</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${favoriteCount}</span>
                <span class="stat-label">Favoris</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">6</span>
                <span class="stat-label">Régions</span>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-content">
          ${isAdmin ? this.renderAdminSection(user as Administrator) : ''}
          
          <div class="profile-section">
            <h3 class="section-title">
              <span class="material-symbols-outlined">restaurant</span>
              Mes Recettes Récentes
            </h3>
            ${userRecipes.length > 0 ? this.renderUserRecipes(userRecipes) : this.renderNoRecipes()}
          </div>

          <div class="profile-section">
            <h3 class="section-title">
              <span class="material-symbols-outlined">settings</span>
              Paramètres
            </h3>
            <div class="settings-list">
              <div class="setting-item">
                <div class="setting-info">
                  <span class="material-symbols-outlined">notifications</span>
                  <div>
                    <h4>Notifications</h4>
                    <p>Recevoir les nouvelles recettes</p>
                  </div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="setting-item">
                <div class="setting-info">
                  <span class="material-symbols-outlined">dark_mode</span>
                  <div>
                    <h4>Mode sombre</h4>
                    <p>Thème sombre pour l'application</p>
                  </div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" id="dark-mode-toggle">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="setting-item clickable" data-action="language">
                <div class="setting-info">
                  <span class="material-symbols-outlined">language</span>
                  <div>
                    <h4>Langue</h4>
                    <p>Français</p>
                  </div>
                </div>
                <span class="material-symbols-outlined">chevron_right</span>
              </div>
              
              <div class="setting-item clickable" data-action="help">
                <div class="setting-info">
                  <span class="material-symbols-outlined">help</span>
                  <div>
                    <h4>Aide & Support</h4>
                    <p>FAQ et contact</p>
                  </div>
                </div>
                <span class="material-symbols-outlined">chevron_right</span>
              </div>

              <div class="setting-item clickable danger" data-action="logout">
                <div class="setting-info">
                  <span class="material-symbols-outlined">logout</span>
                  <div>
                    <h4>Se déconnecter</h4>
                    <p>Fermer la session</p>
                  </div>
                </div>
                <span class="material-symbols-outlined">chevron_right</span>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h3 class="section-title">
              <span class="material-symbols-outlined">info</span>
              À propos
            </h3>
            <div class="about-info">
              <p>J'apprends à cuisiner - Version 1.0.0</p>
              <p>Découvrez la richesse de la cuisine camerounaise</p>
              <div class="app-links">
                <a href="#" class="app-link">Politique de confidentialité</a>
                <a href="#" class="app-link">Conditions d'utilisation</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private static renderAdminSection(admin: Administrator): string {
    return `
      <div class="profile-section admin-section">
        <h3 class="section-title">
          <span class="material-symbols-outlined">admin_panel_settings</span>
          Administration
        </h3>
        
        ${this.statsWidget.generateStatsHTML(true)}
        
        <div class="admin-tabs">
          <button class="admin-tab active" data-tab="overview">
            <span class="material-symbols-outlined">dashboard</span>
            Vue d'ensemble
          </button>
          <button class="admin-tab" data-tab="recipes">
            <span class="material-symbols-outlined">restaurant_menu</span>
            Recettes
          </button>
          <button class="admin-tab" data-tab="users">
            <span class="material-symbols-outlined">group</span>
            Utilisateurs
          </button>
          <button class="admin-tab" data-tab="analytics">
            <span class="material-symbols-outlined">analytics</span>
            Analyses
          </button>
        </div>

        <div class="admin-content">
          <div class="admin-panel active" id="admin-overview">
            <div class="admin-overview-grid">
              <div class="admin-quick-actions">
                <h4>Actions rapides</h4>
                <div class="quick-actions-grid">
                  <button class="quick-action-btn" data-action="add-recipe">
                    <span class="material-symbols-outlined">add</span>
                    <span>Ajouter une recette</span>
                  </button>
                  <button class="quick-action-btn" data-action="moderate-content">
                    <span class="material-symbols-outlined">moderation</span>
                    <span>Modérer le contenu</span>
                  </button>
                  <button class="quick-action-btn" data-action="export-data">
                    <span class="material-symbols-outlined">download</span>
                    <span>Exporter les données</span>
                  </button>
                  <button class="quick-action-btn" data-action="system-settings">
                    <span class="material-symbols-outlined">settings</span>
                    <span>Paramètres système</span>
                  </button>
                </div>
              </div>
              
              <div class="admin-recent-activity">
                <h4>Activité récente</h4>
                <div class="activity-list">
                  <div class="activity-item">
                    <span class="material-symbols-outlined">person_add</span>
                    <div class="activity-content">
                      <span class="activity-text">Nouvel utilisateur inscrit</span>
                      <span class="activity-time">Il y a 2h</span>
                    </div>
                  </div>
                  <div class="activity-item">
                    <span class="material-symbols-outlined">restaurant_menu</span>
                    <div class="activity-content">
                      <span class="activity-text">Nouvelle recette ajoutée</span>
                      <span class="activity-time">Il y a 4h</span>
                    </div>
                  </div>
                  <div class="activity-item">
                    <span class="material-symbols-outlined">favorite</span>
                    <div class="activity-content">
                      <span class="activity-text">100 nouveaux favoris aujourd'hui</span>
                      <span class="activity-time">Il y a 6h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="admin-panel" id="admin-recipes">
            <div class="admin-recipes-header">
              <h4>Gestion des recettes</h4>
              <button class="admin-action-btn" data-action="add-recipe">
                <span class="material-symbols-outlined">add</span>
                Ajouter une recette
              </button>
            </div>
            <div class="admin-recipes-list">
              ${this.generateAdminRecipesList()}
            </div>
          </div>

          <div class="admin-panel" id="admin-users">
            <div class="admin-users-header">
              <h4>Gestion des utilisateurs</h4>
              <div class="admin-filters">
                <select class="admin-filter-select">
                  <option value="all">Tous les utilisateurs</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                  <option value="admin">Administrateurs</option>
                </select>
              </div>
            </div>
            <div class="admin-users-list">
              ${this.generateAdminUsersList()}
            </div>
          </div>

          <div class="admin-panel" id="admin-analytics">
            <div class="admin-analytics-content">
              ${this.statsWidget.generateStatsHTML(false)}
              ${this.statsWidget.generateQuickInsights()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private static renderUserRecipes(recipes: any[]): string {
    const allRecipes = this.dataService.getAllRecipes();
    return `
      <div class="user-recipes-fullscreen-grid">
        ${allRecipes.map(recipe => `
          <div class="user-recipe-fullscreen-card" data-recipe-id="${recipe.getIdRecette()}">
            <div class="user-recipe-image-wrapper">
              <img src="${recipe.getImageURL()}" alt="${recipe.getTitre()}" loading="lazy" />
              <div class="user-recipe-overlay">
                <button class="user-recipe-view-btn">
                  <span class="material-symbols-outlined">visibility</span>
                  Voir la recette
                </button>
              </div>
            </div>
            <div class="user-recipe-content">
              <span class="user-recipe-region">${recipe.getRegionAssociee()}</span>
              <h3 class="user-recipe-title">${recipe.getTitre()}</h3>
              <p class="user-recipe-description">${recipe.getDescription().substring(0, 120)}...</p>
              <div class="user-recipe-meta">
                <span class="user-recipe-time">
                  <span class="material-symbols-outlined">schedule</span>
                  ${recipe.getTempsFormate()}
                </span>
                <span class="user-recipe-difficulty ${recipe.getDifficulte().toLowerCase()}">
                  ${recipe.getDifficulte()}
                </span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private static renderNoRecipes(): string {
    return `
      <div class="no-recipes">
        <span class="material-symbols-outlined">restaurant_menu</span>
        <p>Vous n'avez pas encore créé de recettes</p>
        <button class="create-recipe-btn">
          <span class="material-symbols-outlined">add</span>
          Créer ma première recette
        </button>
      </div>
    `;
  }

  public static setupEventListeners(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      // Gestion des boutons d'authentification
      const authBtn = target.closest('[data-auth]');
      if (authBtn) {
        const mode = authBtn.getAttribute('data-auth') as 'login' | 'register';
        const event = new CustomEvent('show-auth-modal', { detail: { mode } });
        document.dispatchEvent(event);
      }

      // Gestion des actions de paramètres
      const settingItem = target.closest('[data-action]');
      if (settingItem) {
        const action = settingItem.getAttribute('data-action');
        this.handleSettingAction(action!);
      }

      // Gestion des actions admin
      const adminBtn = target.closest('.admin-action-btn[data-action], .quick-action-btn[data-action]');
      if (adminBtn) {
        const action = adminBtn.getAttribute('data-action');
        this.handleAdminAction(action!);
      }

      // Gestion des onglets admin
      const adminTab = target.closest('.admin-tab');
      if (adminTab) {
        const tab = adminTab.getAttribute('data-tab');
        this.switchAdminTab(tab!);
      }
    });
  }

  private static handleSettingAction(action: string): void {
    switch (action) {
      case 'logout':
        this.handleLogout();
        break;
      case 'language':
        console.log('Changement de langue');
        break;
      case 'help':
        console.log('Aide et support');
        break;
    }
  }

  private static handleAdminAction(action: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!(currentUser instanceof Administrator)) return;

    switch (action) {
      case 'manage-recipes':
      case 'add-recipe':
        this.showRecipeManagement();
        break;
      case 'manage-users':
        this.showUserManagement();
        break;
      case 'export-data':
        this.handleDataExport(currentUser);
        break;
      case 'moderate-content':
        this.showContentModeration();
        break;
      case 'system-settings':
        this.showSystemSettings();
        break;
    }
  }

  private static switchAdminTab(tab: string): void {
    // Retirer la classe active de tous les onglets
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));

    // Activer l'onglet et le panneau sélectionnés
    const selectedTab = document.querySelector(`[data-tab="${tab}"]`);
    const selectedPanel = document.getElementById(`admin-${tab}`);
    
    if (selectedTab && selectedPanel) {
      selectedTab.classList.add('active');
      selectedPanel.classList.add('active');
    }
  }

  private static generateAdminRecipesList(): string {
    const recipes = this.dataService.getAllRecipes().slice(0, 10); // Limiter à 10 pour l'exemple
    
    return `
      <div class="admin-table">
        <div class="admin-table-header">
          <div class="admin-table-cell">Recette</div>
          <div class="admin-table-cell">Région</div>
          <div class="admin-table-cell">Auteur</div>
          <div class="admin-table-cell">Statut</div>
          <div class="admin-table-cell">Actions</div>
        </div>
        ${recipes.map(recipe => `
          <div class="admin-table-row">
            <div class="admin-table-cell">
              <div class="recipe-cell">
                <div class="recipe-image-small" style="background-image: url('${recipe.getImageURL()}')"></div>
                <div class="recipe-info-small">
                  <span class="recipe-title-small">${recipe.getTitre()}</span>
                  <span class="recipe-meta-small">${recipe.getTempsFormate()} • ${recipe.getDifficulte()}</span>
                </div>
              </div>
            </div>
            <div class="admin-table-cell">${recipe.getRegionAssociee()}</div>
            <div class="admin-table-cell">${recipe.getAuteur()}</div>
            <div class="admin-table-cell">
              <span class="status-badge status-published">Publié</span>
            </div>
            <div class="admin-table-cell">
              <div class="admin-actions-small">
                <button class="admin-btn-small" data-action="edit-recipe" data-recipe-id="${recipe.getIdRecette()}">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="admin-btn-small danger" data-action="delete-recipe" data-recipe-id="${recipe.getIdRecette()}">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private static generateAdminUsersList(): string {
    const users = this.authService.getAllUsers().slice(0, 10); // Limiter à 10 pour l'exemple
    
    return `
      <div class="admin-table">
        <div class="admin-table-header">
          <div class="admin-table-cell">Utilisateur</div>
          <div class="admin-table-cell">Email</div>
          <div class="admin-table-cell">Région</div>
          <div class="admin-table-cell">Type</div>
          <div class="admin-table-cell">Actions</div>
        </div>
        ${users.map(user => `
          <div class="admin-table-row">
            <div class="admin-table-cell">
              <div class="user-cell">
                <div class="user-avatar-small">
                  <span class="material-symbols-outlined">account_circle</span>
                </div>
                <div class="user-info-small">
                  <span class="user-name-small">${user.getNomComplet()}</span>
                  <span class="user-meta-small">Inscrit le ${user.getDateInscription().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div class="admin-table-cell">${user.getEmail()}</div>
            <div class="admin-table-cell">${user.getRegionOrigine()}</div>
            <div class="admin-table-cell">
              <span class="status-badge ${user instanceof Administrator ? 'status-admin' : 'status-user'}">
                ${user instanceof Administrator ? 'Admin' : 'Utilisateur'}
              </span>
            </div>
            <div class="admin-table-cell">
              <div class="admin-actions-small">
                <button class="admin-btn-small" data-action="edit-user" data-user-id="${user.getIdUtilisateur()}">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                ${!(user instanceof Administrator) ? `
                  <button class="admin-btn-small warning" data-action="promote-user" data-user-id="${user.getIdUtilisateur()}">
                    <span class="material-symbols-outlined">admin_panel_settings</span>
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private static showRecipeManagement(): void {
    console.log('Gestion des recettes');
    // Ici on pourrait ouvrir une modal de gestion des recettes
  }

  private static showUserManagement(): void {
    console.log('Gestion des utilisateurs');
    // Ici on pourrait ouvrir une modal de gestion des utilisateurs
  }

  private static showContentModeration(): void {
    console.log('Modération du contenu');
    // Ici on pourrait ouvrir une interface de modération
  }

  private static showSystemSettings(): void {
    console.log('Paramètres système');
    // Ici on pourrait ouvrir les paramètres système
  }

  private static handleLogout(): void {
    this.authService.seDeconnecter();
    const event = new CustomEvent('user-logout');
    document.dispatchEvent(event);
  }

  private static handleDataExport(admin: Administrator): void {
    const data = admin.exporterDonnees('json');
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuisine-cameroun-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Données exportées avec succès');
  }
}