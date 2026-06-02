import { ApiService } from '../services/ApiService';

export class ResetPasswordPage {
  private container: HTMLElement;
  private token: string;

  constructor(container: HTMLElement) {
    this.container = container;
    this.token = this.getTokenFromUrl();
  }

  private getTokenFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token') || '';
  }

  async render(): Promise<void> {
    // Vérifier d'abord si le token est valide
    if (!this.token) {
      this.renderInvalidToken();
      return;
    }

    try {
      const isValid = await ApiService.verifyResetToken(this.token);
      if (isValid) {
        this.renderResetForm();
      } else {
        this.renderInvalidToken();
      }
    } catch (error) {
      this.renderInvalidToken();
    }
  }

  private renderResetForm(): void {
    this.container.innerHTML = `
      <div class="reset-password-page">
        <div class="reset-password-container">
          <div class="reset-password-card">
            <div class="reset-password-header">
              <h1>🔑 Nouveau mot de passe</h1>
              <p>Choisissez un mot de passe sécurisé</p>
            </div>

            <form id="resetPasswordForm" class="reset-password-form">
              <div class="form-group">
                <label for="newPassword">
                  <i class="fas fa-lock"></i>
                  Nouveau mot de passe
                </label>
                <div class="password-input-wrapper">
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="Minimum 8 caractères"
                    required
                    minlength="8"
                  />
                  <button type="button" class="toggle-password" data-target="newPassword">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
                <div class="password-strength" id="passwordStrength"></div>
              </div>

              <div class="form-group">
                <label for="confirmPassword">
                  <i class="fas fa-lock"></i>
                  Confirmer le mot de passe
                </label>
                <div class="password-input-wrapper">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Retapez votre mot de passe"
                    required
                    minlength="8"
                  />
                  <button type="button" class="toggle-password" data-target="confirmPassword">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
              </div>

              <div class="password-requirements">
                <p><strong>Le mot de passe doit contenir :</strong></p>
                <ul>
                  <li id="req-length">
                    <i class="fas fa-circle"></i> Au moins 8 caractères
                  </li>
                  <li id="req-uppercase">
                    <i class="fas fa-circle"></i> Une lettre majuscule
                  </li>
                  <li id="req-lowercase">
                    <i class="fas fa-circle"></i> Une lettre minuscule
                  </li>
                  <li id="req-number">
                    <i class="fas fa-circle"></i> Un chiffre
                  </li>
                </ul>
              </div>

              <div id="messageContainer" class="message-container"></div>

              <button type="submit" class="btn-primary" id="submitBtn">
                <i class="fas fa-check"></i>
                Réinitialiser le mot de passe
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private renderInvalidToken(): void {
    this.container.innerHTML = `
      <div class="reset-password-page">
        <div class="reset-password-container">
          <div class="reset-password-card error-card">
            <div class="error-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h1>Lien invalide ou expiré</h1>
            <p>Ce lien de réinitialisation n'est plus valide. Il a peut-être expiré ou a déjà été utilisé.</p>
            <div class="error-actions">
              <a href="#forgot-password" class="btn-primary">
                <i class="fas fa-redo"></i>
                Demander un nouveau lien
              </a>
              <a href="#login" class="btn-secondary">
                <i class="fas fa-arrow-left"></i>
                Retour à la connexion
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const form = document.getElementById('resetPasswordForm') as HTMLFormElement;
    const newPasswordInput = document.getElementById('newPassword') as HTMLInputElement;
    const toggleButtons = document.querySelectorAll('.toggle-password');

    form?.addEventListener('submit', (e) => this.handleSubmit(e));
    newPasswordInput?.addEventListener('input', () => this.checkPasswordStrength());

    toggleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = (e.currentTarget as HTMLElement).dataset.target;
        if (target) this.togglePasswordVisibility(target);
      });
    });
  }

  private togglePasswordVisibility(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const button = document.querySelector(`[data-target="${inputId}"]`) as HTMLElement;
    const icon = button?.querySelector('i');

    if (input && icon) {
      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
      } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
      }
    }
  }

  private checkPasswordStrength(): void {
    const passwordInput = document.getElementById('newPassword') as HTMLInputElement;
    const strengthDiv = document.getElementById('passwordStrength');
    const password = passwordInput?.value || '';

    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    };

    // Mettre à jour les indicateurs visuels
    Object.keys(requirements).forEach(key => {
      const element = document.getElementById(`req-${key}`);
      if (element) {
        if (requirements[key as keyof typeof requirements]) {
          element.classList.add('valid');
          element.querySelector('i')!.className = 'fas fa-check-circle';
        } else {
          element.classList.remove('valid');
          element.querySelector('i')!.className = 'fas fa-circle';
        }
      }
    });

    // Calculer la force
    const strength = Object.values(requirements).filter(Boolean).length;
    const strengthText = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    const strengthClass = ['very-weak', 'weak', 'medium', 'strong', 'very-strong'];

    if (strengthDiv && password.length > 0) {
      strengthDiv.innerHTML = `
        <div class="strength-bar ${strengthClass[strength]}">
          <div class="strength-fill" style="width: ${(strength / 4) * 100}%"></div>
        </div>
        <span class="strength-text">${strengthText[strength]}</span>
      `;
    }
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const newPasswordInput = form.querySelector('#newPassword') as HTMLInputElement;
    const confirmPasswordInput = form.querySelector('#confirmPassword') as HTMLInputElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;

    if (!newPasswordInput || !confirmPasswordInput || !submitBtn) return;

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation
    if (newPassword.length < 8) {
      this.showMessage('Le mot de passe doit contenir au moins 8 caractères', 'error');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      this.showMessage('Le mot de passe doit contenir au moins une majuscule', 'error');
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      this.showMessage('Le mot de passe doit contenir au moins une minuscule', 'error');
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      this.showMessage('Le mot de passe doit contenir au moins un chiffre', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showMessage('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    // Désactiver le bouton
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Réinitialisation...';

    try {
      const response = await ApiService.resetPassword(this.token, newPassword);

      if (response.success) {
        this.showMessage('✅ Mot de passe réinitialisé avec succès !', 'success');
        
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          window.location.hash = '#login';
        }, 2000);
      } else {
        this.showMessage(response.message || 'Erreur lors de la réinitialisation', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Réinitialiser le mot de passe';
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      this.showMessage(
        error.message || 'Erreur lors de la réinitialisation. Veuillez réessayer.',
        'error'
      );
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Réinitialiser le mot de passe';
    }
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    const messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) return;

    messageContainer.className = `message-container ${type}`;
    messageContainer.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      ${message}
    `;
    messageContainer.style.display = 'block';

    if (type === 'error') {
      setTimeout(() => {
        messageContainer.style.display = 'none';
      }, 5000);
    }
  }
}
