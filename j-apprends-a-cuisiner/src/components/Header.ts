import { AuthService } from '../services/AuthService';
import { NotificationService } from '../services/NotificationService';

export class Header {
  private authService: AuthService;
  private notificationService: NotificationService;

  constructor() {
    this.authService = AuthService.getInstance();
    this.notificationService = NotificationService.getInstance();
  }

  render(): HTMLElement {
    const header = document.createElement('header');
    header.className = 'app-header';
    header.innerHTML = this.generateHTML();
    return header;
  }

  private generateHTML(): string {
    const currentUser = this.authService.getCurrentUser();
    
    return `
      <div class="header-container">
        <div class="header-brand">
          <div class="brand-logo">
            <div class="logo-icon">
              <span class="material-symbols-outlined">restaurant</span>
            </div>
          </div>
          <div class="brand-text">
            <h1 class="brand-title">NLAMB-SARRE</h1>
            <p class="brand-subtitle">Saveurs du Cameroun</p>
          </div>
        </div>
        
        <div class="header-actions">
          ${this.renderUserSection(currentUser)}
          <button class="theme-toggle-btn" id="theme-toggle" aria-label="Basculer le thème">
            <span class="material-symbols-outlined theme-icon">dark_mode</span>
          </button>
        </div>
      </div>
    `;
  }

  private renderUserSection(currentUser: any): string {
    if (currentUser) {
      return `
        <div class="user-menu">
          <button class="user-avatar" id="user-menu-trigger">
            <div class="avatar-image">
              <span class="material-symbols-outlined">person</span>
            </div>
            <div class="user-info">
              <span class="user-name">${currentUser.getPrenom()}</span>
              <span class="user-role">${currentUser.constructor.name === 'Administrator' ? 'Admin' : 'Membre'}</span>
            </div>
            <span class="material-symbols-outlined dropdown-icon">expand_more</span>
          </button>
          
          <div class="user-dropdown" id="user-dropdown">
            <div class="dropdown-header">
              <div class="user-avatar-large">
                <span class="material-symbols-outlined">person</span>
              </div>
              <div class="user-details">
                <h3>${currentUser.getPrenom()} ${currentUser.getNom()}</h3>
                <p>${currentUser.getEmail()}</p>
                <span class="user-badge ${currentUser.constructor.name === 'Administrator' ? 'admin' : 'member'}">
                  ${currentUser.constructor.name === 'Administrator' ? 'Administrateur' : 'Membre'}
                </span>
              </div>
            </div>
            
            <div class="dropdown-menu">
              <a href="#" class="dropdown-item" data-navigate="profile">
                <span class="material-symbols-outlined">person</span>
                Mon Profil
              </a>
              <a href="#" class="dropdown-item" data-navigate="favorites">
                <span class="material-symbols-outlined">favorite</span>
                Mes Favoris
              </a>
              ${currentUser.constructor.name === 'Administrator' ? `
                <a href="#" class="dropdown-item" id="admin-panel">
                  <span class="material-symbols-outlined">admin_panel_settings</span>
                  Administration
                </a>
              ` : ''}
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout-btn" id="logout-btn">
                <span class="material-symbols-outlined">logout</span>
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
        
        <button class="notification-btn" id="notification-btn">
          <span class="material-symbols-outlined">notifications</span>
          <div class="notification-badge"></div>
        </button>
      `;
    } else {
      return `
        <div class="auth-buttons">
          <button class="btn-secondary" id="login-btn">
            <span class="material-symbols-outlined">login</span>
            Connexion
          </button>
          <button class="btn-primary" id="register-btn">
            <span class="material-symbols-outlined">person_add</span>
            S'inscrire
          </button>
        </div>
      `;
    }
  }

  updateHeader(): void {
    this.setupEventListeners();
    this.updateThemeIcon();
  }

  private setupEventListeners(): void {
    // Toggle du menu utilisateur
    const userMenuTrigger = document.getElementById('user-menu-trigger');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userMenuTrigger && userDropdown) {
      userMenuTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
      });

      // Fermer le dropdown en cliquant ailleurs
      document.addEventListener('click', (e) => {
        if (!userMenuTrigger.contains(e.target as Node)) {
          userDropdown.classList.remove('show');
        }
      });
    }

    // Boutons d'authentification
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('show-auth-modal', { 
          detail: { mode: 'login' } 
        }));
      });
    }
    
    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('show-auth-modal', { 
          detail: { mode: 'register' } 
        }));
      });
    }

    // Déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        const result = await this.authService.seDeconnecter();
        if (result.success) {
          document.dispatchEvent(new CustomEvent('user-logout'));
        }
      });
    }

    // Toggle thème
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Notifications
    const notificationBtn = document.getElementById('notification-btn');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', () => {
        this.showNotifications();
      });
    }

    // Panel admin
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
      adminPanel.addEventListener('click', (e) => {
        e.preventDefault();
        this.showAdminPanel();
      });
    }
  }

  private toggleTheme(): void {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
      html.classList.remove('dark');
      html.classList.add('light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
    }
    
    this.updateThemeIcon();
    
    // Sauvegarder la préférence
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  }

  private updateThemeIcon(): void {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      const isDark = document.documentElement.classList.contains('dark');
      themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
    }
  }

  private showNotifications(): void {
    // Simuler des notifications
    const notifications = [
      {
        id: 1,
        title: 'Nouvelle recette',
        message: 'Découvrez le Ndolé revisité',
        time: '5 min',
        type: 'info'
      },
      {
        id: 2,
        title: 'Favori ajouté',
        message: 'Poulet DG ajouté à vos favoris',
        time: '1h',
        type: 'success'
      }
    ];

    this.notificationService.showNotificationPanel(notifications);
  }

  private showAdminPanel(): void {
    // Créer et afficher le panel d'administration
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="admin-panel">
          <div class="panel-header">
            <h2>Panel d'Administration</h2>
            <button class="close-btn">&times;</button>
          </div>
          <div class="panel-content">
            <div class="admin-stats">
              <div class="stat-card">
                <h3>156</h3>
                <p>Utilisateurs</p>
              </div>
              <div class="stat-card">
                <h3>89</h3>
                <p>Recettes</p>
              </div>
              <div class="stat-card">
                <h3>1.2k</h3>
                <p>Vues</p>
              </div>
            </div>
            <div class="admin-actions">
              <button class="admin-btn">
                <span class="material-symbols-outlined">group</span>
                Gérer les utilisateurs
              </button>
              <button class="admin-btn">
                <span class="material-symbols-outlined">restaurant_menu</span>
                Gérer les recettes
              </button>
              <button class="admin-btn">
                <span class="material-symbols-outlined">analytics</span>
                Voir les statistiques
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners pour le modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal.querySelector('.modal-overlay') || 
          e.target === modal.querySelector('.close-btn')) {
        document.body.removeChild(modal);
      }
    });
  }
}