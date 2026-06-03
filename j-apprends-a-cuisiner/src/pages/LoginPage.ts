import { ApiService } from '../services/ApiService';

export class LoginPage {
  private apiService: ApiService;

  constructor() {
    this.apiService = ApiService.getInstance();
  }

  public render(): string {
    return `
      <div class="login-page">
        <div class="login-container">
          <div class="login-header">
            <h1>🔐 Connexion</h1>
            <p>Connectez-vous pour accéder à votre compte</p>
          </div>

          <form id="login-form" class="login-form">
            <div class="form-group">
              <label for="email">
                <span class="material-symbols-outlined">email</span>
                Email
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                placeholder="votre@email.com"
              />
            </div>

            <div class="form-group">
              <label for="password">
                <span class="material-symbols-outlined">lock</span>
                Mot de passe
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                placeholder="••••••••"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary btn-block">
                <span class="material-symbols-outlined">login</span>
                Se connecter
              </button>
            </div>

            <div id="login-message" class="message"></div>
          </form>

          <div class="login-footer">
            <p>Pas encore de compte? <a href="#register">S'inscrire</a></p>
            <p><a href="#forgot-password">Mot de passe oublié?</a></p>
          </div>

          <div class="admin-info">
            <h3>🔑 Compte Administrateur par Défaut</h3>
            <p><strong>Email:</strong> admin@japprends.cm</p>
            <p><strong>Mot de passe:</strong> admin123</p>
          </div>
        </div>
      </div>
    `;
  }

  public attachEventListeners(): void {
    const form = document.getElementById('login-form') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => this.handleLogin(e));
    }
  }

  private async handleLogin(e: Event): Promise<void> {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const messageDiv = document.getElementById('login-message');
    if (!messageDiv) return;

    try {
      messageDiv.className = 'message info';
      messageDiv.textContent = 'Connexion en cours...';

      const isLocalMode = import.meta.env.VITE_DATA_MODE === 'local';
      let response: any;

      if (isLocalMode) {
        // En mode local, utiliser le AuthService mocké
        const { AuthService } = await import('../services/AuthService');
        const authService = AuthService.getInstance();
        response = await authService.seConnecter({ email, password });
      } else {
        // En mode API, utiliser ApiService
        response = await this.apiService.login({ email, password });
      }

      if (response.success) {
        messageDiv.className = 'message success';
        messageDiv.textContent = 'Connexion réussie! Redirection...';

        // Rediriger selon le rôle
        setTimeout(() => {
          const user = response.user || {};
          if (user.role === 'admin' || email.includes('admin')) {
            window.location.href = '#admin';
          } else {
            window.location.href = '#profile';
          }
        }, 1000);
      } else {
        messageDiv.className = 'message error';
        messageDiv.textContent = response.message || 'Erreur lors de la connexion';
      }
    } catch (error: any) {
      messageDiv.className = 'message error';
      messageDiv.textContent = error.message || 'Erreur lors de la connexion';
    }
  }
}
