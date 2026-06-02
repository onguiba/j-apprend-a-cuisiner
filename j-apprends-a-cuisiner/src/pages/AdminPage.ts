import { ApiService } from '../services/ApiService';
import { NotificationService } from '../services/NotificationService';

export class AdminPage {
  private apiService: ApiService;
  private notificationService: NotificationService;
  private currentUser: any = null;

  constructor() {
    this.apiService = ApiService.getInstance();
    this.notificationService = NotificationService.getInstance();
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
  }

  public render(): string {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      return this.renderUnauthorized();
    }

    return `
      <div class="admin-page">
        <div class="admin-header">
          <h1>🔐 Administration</h1>
          <p>Bienvenue, ${this.currentUser.nom}</p>
        </div>

        <div class="admin-tabs">
          <button class="tab-btn active" data-tab="dashboard">📊 Dashboard</button>
          <button class="tab-btn" data-tab="users">👥 Utilisateurs</button>
          <button class="tab-btn" data-tab="recipes">🍽️ Recettes</button>
          <button class="tab-btn" data-tab="regions">🗺️ Régions</button>
          <button class="tab-btn" data-tab="comments">💬 Commentaires</button>
        </div>

        <div class="admin-content">
          <div id="dashboard-tab" class="tab-content active">
            <div class="loading">Chargement des statistiques...</div>
          </div>
          <div id="users-tab" class="tab-content">
            <div class="loading">Chargement des utilisateurs...</div>
          </div>
          <div id="recipes-tab" class="tab-content">
            <div class="loading">Chargement des recettes...</div>
          </div>
          <div id="regions-tab" class="tab-content">
            <div class="loading">Chargement des régions...</div>
          </div>
          <div id="comments-tab" class="tab-content">
            <div class="loading">Chargement des commentaires...</div>
          </div>
        </div>
      </div>
    `;
  }

  private renderUnauthorized(): string {
    return `
      <div class="unauthorized-page">
        <div class="unauthorized-content">
          <span class="material-symbols-outlined" style="font-size: 80px; color: #ff6b35;">lock</span>
          <h1>Accès Refusé</h1>
          <p>Vous devez être administrateur pour accéder à cette page.</p>
          <button class="btn-primary" onclick="window.location.href='/'">
            Retour à l'accueil
          </button>
        </div>
      </div>
    `;
  }

  public async attachEventListeners(): Promise<void> {
    // Gestion des onglets
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tabName = target.getAttribute('data-tab');
        this.switchTab(tabName!);
      });
    });

    // Charger le dashboard par défaut
    await this.loadDashboard();
  }

  private switchTab(tabName: string): void {
    // Désactiver tous les onglets
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Activer l'onglet sélectionné
    const btn = document.querySelector(`[data-tab="${tabName}"]`);
    const content = document.getElementById(`${tabName}-tab`);
    
    if (btn) btn.classList.add('active');
    if (content) content.classList.add('active');

    // Charger les données
    switch (tabName) {
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'users':
        this.loadUsers();
        break;
      case 'recipes':
        this.loadRecipes();
        break;
      case 'regions':
        this.loadRegions();
        break;
      case 'comments':
        this.loadComments();
        break;
    }
  }

  private async loadDashboard(): Promise<void> {
    try {
      const response = await this.apiService.getAdminDashboard();
      const { stats, recipesByRegion, recentRecipes, recentUsers } = response.data;

      const dashboardHTML = `
        <div class="dashboard-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>${stats.total_users}</h3>
              <p>Utilisateurs</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🍽️</div>
            <div class="stat-info">
              <h3>${stats.total_recipes}</h3>
              <p>Recettes</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🗺️</div>
            <div class="stat-info">
              <h3>${stats.total_regions}</h3>
              <p>Régions</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💬</div>
            <div class="stat-info">
              <h3>${stats.total_comments}</h3>
              <p>Commentaires</p>
            </div>
          </div>
        </div>

        <div class="dashboard-sections">
          <div class="dashboard-section">
            <h2>📊 Recettes par Région</h2>
            <div class="region-stats">
              ${recipesByRegion.map((r: any) => `
                <div class="region-stat-item">
                  <span class="region-name">${r.region}</span>
                  <span class="region-count">${r.count} recettes</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="dashboard-section">
            <h2>🆕 Recettes Récentes</h2>
            <div class="recent-list">
              ${recentRecipes.map((r: any) => `
                <div class="recent-item">
                  <strong>${r.titre}</strong>
                  <span>${r.region_nom}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="dashboard-section">
            <h2>👤 Utilisateurs Récents</h2>
            <div class="recent-list">
              ${recentUsers.map((u: any) => `
                <div class="recent-item">
                  <strong>${u.nom}</strong>
                  <span>${u.email} - ${u.role}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      const dashboardTab = document.getElementById('dashboard-tab');
      if (dashboardTab) {
        dashboardTab.innerHTML = dashboardHTML;
      }
    } catch (error) {
      console.error('Erreur loadDashboard:', error);
      const dashboardTab = document.getElementById('dashboard-tab');
      if (dashboardTab) {
        dashboardTab.innerHTML = '<div class="error">Erreur lors du chargement du dashboard</div>';
      }
    }
  }

  private async loadUsers(): Promise<void> {
    try {
      const response = await this.apiService.getAdminUsers();
      const users = response.data;

      const usersHTML = `
        <div class="admin-section-header">
          <h2>👥 Gestion des Utilisateurs</h2>
          <button class="btn-primary" id="add-user-btn">
            <span class="material-symbols-outlined">add</span>
            Ajouter un utilisateur
          </button>
        </div>

        <div class="users-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Date d'inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${users.map((user: any) => `
                <tr>
                  <td>${user.id}</td>
                  <td>${user.nom}</td>
                  <td>${user.email}</td>
                  <td>
                    <span class="role-badge role-${user.role}">${user.role}</span>
                  </td>
                  <td>${new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                  <td class="actions">
                    ${user.role === 'user' ? `
                      <button class="btn-icon" onclick="promoteUser(${user.id})" title="Promouvoir en admin">
                        <span class="material-symbols-outlined">upgrade</span>
                      </button>
                    ` : user.id !== this.currentUser.id ? `
                      <button class="btn-icon" onclick="demoteUser(${user.id})" title="Rétrograder en utilisateur">
                        <span class="material-symbols-outlined">downgrade</span>
                      </button>
                    ` : ''}
                    ${user.id !== this.currentUser.id ? `
                      <button class="btn-icon btn-danger" onclick="deleteUser(${user.id})" title="Supprimer">
                        <span class="material-symbols-outlined">delete</span>
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      const usersTab = document.getElementById('users-tab');
      if (usersTab) {
        usersTab.innerHTML = usersHTML;
      }
    } catch (error) {
      console.error('Erreur loadUsers:', error);
    }
  }

  private async loadRecipes(): Promise<void> {
    const recipesTab = document.getElementById('recipes-tab');
    if (recipesTab) {
      recipesTab.innerHTML = '<div class="info">Gestion des recettes - À implémenter</div>';
    }
  }

  private async loadRegions(): Promise<void> {
    const regionsTab = document.getElementById('regions-tab');
    if (regionsTab) {
      regionsTab.innerHTML = '<div class="info">Gestion des régions - À implémenter</div>';
    }
  }

  private async loadComments(): Promise<void> {
    const commentsTab = document.getElementById('comments-tab');
    if (commentsTab) {
      commentsTab.innerHTML = '<div class="info">Gestion des commentaires - À implémenter</div>';
    }
  }
}
