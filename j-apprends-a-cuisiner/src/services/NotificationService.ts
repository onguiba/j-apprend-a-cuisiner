export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationOptions {
  title?: string;
  message: string;
  type: NotificationType;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export class NotificationService {
  private static instance: NotificationService;
  private notifications: Map<string, HTMLElement> = new Map();
  private container: HTMLElement | null = null;

  private constructor() {
    this.createContainer();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private createContainer(): void {
    this.container = document.createElement('div');
    this.container.className = 'notifications-container';
    document.body.appendChild(this.container);
  }

  public show(options: NotificationOptions): string {
    const id = this.generateId();
    const notification = this.createNotification(id, options);
    
    if (this.container) {
      this.container.appendChild(notification);
      this.notifications.set(id, notification);
      
      // Animation d'entrée
      setTimeout(() => notification.classList.add('show'), 100);
      
      // Auto-suppression si pas persistante
      if (!options.persistent) {
        const duration = options.duration || 5000;
        setTimeout(() => this.hide(id), duration);
      }
    }
    
    return id;
  }

  public hide(id: string): void {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.classList.remove('show');
      notification.classList.add('hide');
      
      setTimeout(() => {
        if (this.container && notification.parentNode === this.container) {
          this.container.removeChild(notification);
        }
        this.notifications.delete(id);
      }, 300);
    }
  }

  public hideAll(): void {
    this.notifications.forEach((_, id) => this.hide(id));
  }

  private createNotification(id: string, options: NotificationOptions): HTMLElement {
    const notification = document.createElement('div');
    notification.className = `notification notification-${options.type}`;
    notification.setAttribute('data-id', id);
    
    const icon = this.getIcon(options.type);
    
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          <span class="material-symbols-outlined">${icon}</span>
        </div>
        <div class="notification-body">
          ${options.title ? `<div class="notification-title">${options.title}</div>` : ''}
          <div class="notification-message">${options.message}</div>
          ${options.actions ? this.generateActions(options.actions) : ''}
        </div>
        <button class="notification-close" data-action="close">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="notification-progress"></div>
    `;

    // Gestion des événements
    notification.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const closeBtn = target.closest('.notification-close');
      const actionBtn = target.closest('[data-action]');
      
      if (closeBtn) {
        this.hide(id);
      } else if (actionBtn && actionBtn.getAttribute('data-action') !== 'close') {
        const actionIndex = parseInt(actionBtn.getAttribute('data-action-index') || '0');
        if (options.actions && options.actions[actionIndex]) {
          options.actions[actionIndex].action();
          this.hide(id);
        }
      }
    });

    // Animation de la barre de progression
    if (!options.persistent) {
      const duration = options.duration || 5000;
      const progressBar = notification.querySelector('.notification-progress') as HTMLElement;
      if (progressBar) {
        progressBar.style.animationDuration = `${duration}ms`;
      }
    }

    return notification;
  }

  private generateActions(actions: Array<{ label: string; action: () => void }>): string {
    return `
      <div class="notification-actions">
        ${actions.map((action, index) => `
          <button class="notification-action-btn" data-action="action" data-action-index="${index}">
            ${action.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  private getIcon(type: NotificationType): string {
    const icons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return icons[type] || 'info';
  }

  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Méthodes de convenance
  public success(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  public error(message: string, title?: string, persistent = false): string {
    return this.show({
      type: 'error',
      title,
      message,
      persistent,
      duration: persistent ? undefined : 8000
    });
  }

  public warning(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'warning',
      title,
      message,
      duration: duration || 6000
    });
  }

  public info(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  // Notifications spécialisées
  public showRecipeAdded(recipeName: string): string {
    return this.success(
      `La recette "${recipeName}" a été ajoutée avec succès`,
      'Recette ajoutée'
    );
  }

  public showFavoriteAdded(recipeName: string): string {
    return this.success(
      `"${recipeName}" a été ajoutée à vos favoris`,
      'Favori ajouté'
    );
  }

  public showFavoriteRemoved(recipeName: string): string {
    return this.info(
      `"${recipeName}" a été retirée de vos favoris`,
      'Favori retiré'
    );
  }

  public showLoginRequired(): string {
    return this.warning(
      'Vous devez être connecté pour effectuer cette action',
      'Connexion requise',
      4000
    );
  }

  public showNetworkError(): string {
    return this.error(
      'Problème de connexion. Vérifiez votre connexion internet.',
      'Erreur réseau',
      true
    );
  }

  public showActionConfirmation(
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ): string {
    return this.show({
      type: 'warning',
      title: 'Confirmation',
      message,
      persistent: true,
      actions: [
        {
          label: 'Confirmer',
          action: onConfirm
        },
        {
          label: 'Annuler',
          action: onCancel || (() => {})
        }
      ]
    });
  }
}