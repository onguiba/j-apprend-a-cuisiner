import { ApiService } from '../services/ApiService';

export class ForgotPasswordPage {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(): void {
    this.container.innerHTML = `
      <div class="forgot-password-page">
        <div class="forgot-password-container">
          <div class="forgot-password-card">
            <div class="forgot-password-header">
              <h1>🔐 Mot de passe oublié</h1>
              <p>Entrez votre email pour recevoir un lien de réinitialisation</p>
            </div>

            <form id="forgotPasswordForm" class="forgot-password-form">
              <div class="form-group">
                <label for="email">
                  <i class="fas fa-envelope"></i>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="votre@email.com"
                  required
                  autocomplete="email"
                />
              </div>

              <div id="messageContainer" class="message-container"></div>

              <button type="submit" class="btn-primary" id="submitBtn">
                <i class="fas fa-paper-plane"></i>
                Envoyer le lien
              </button>

              <div class="form-footer">
                <a href="#" id="backToLogin" class="link">
                  <i class="fas fa-arrow-left"></i>
                  Retour à la connexion
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    const form = document.getElementById('forgotPasswordForm') as HTMLFormElement;
    const backToLogin = document.getElementById('backToLogin');

    form?.addEventListener('submit', (e) => this.handleSubmit(e));
    backToLogin?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#login';
    });
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const emailInput = form.querySelector('#email') as HTMLInputElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    const messageContainer = document.getElementById('messageContainer');

    if (!emailInput || !submitBtn || !messageContainer) return;

    const email = emailInput.value.trim();

    if (!email) {
      this.showMessage('Veuillez entrer votre email', 'error');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showMessage('Email invalide', 'error');
      return;
    }

    // Désactiver le bouton pendant l'envoi
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

    try {
      const response = await ApiService.forgotPassword(email);

      if (response.success) {
        this.showMessage(
          '✅ Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception.',
          'success'
        );
        emailInput.value = '';
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          window.location.hash = '#login';
        }, 3000);
      } else {
        this.showMessage(response.message || 'Erreur lors de l\'envoi', 'error');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      this.showMessage(
        error.message || 'Erreur lors de l\'envoi. Veuillez réessayer.',
        'error'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le lien';
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

    // Masquer après 5 secondes pour les erreurs
    if (type === 'error') {
      setTimeout(() => {
        messageContainer.style.display = 'none';
      }, 5000);
    }
  }
}
