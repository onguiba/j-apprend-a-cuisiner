export interface CookingReminder {
  id: string;
  recipeId: number;
  recipeName: string;
  step: string;
  scheduledTime: Date;
  type: 'start' | 'step' | 'timer' | 'finish';
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private reminders: Map<string, CookingReminder> = new Map();
  private timers: Map<string, number> = new Map();
  private isSupported: boolean = false;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.checkSupport();
    this.loadReminders();
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  private checkSupport(): void {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    if (this.isSupported) {
      this.permission = Notification.permission;
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Les notifications push ne sont pas supportées par ce navigateur');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }

  public async scheduleReminder(reminder: CookingReminder): Promise<boolean> {
    if (!await this.requestPermission()) {
      return false;
    }

    this.reminders.set(reminder.id, reminder);
    this.saveReminders();

    const now = new Date();
    const delay = reminder.scheduledTime.getTime() - now.getTime();

    if (delay > 0) {
      const timerId = window.setTimeout(() => {
        this.showNotification(reminder);
        this.reminders.delete(reminder.id);
        this.timers.delete(reminder.id);
        this.saveReminders();
      }, delay);

      this.timers.set(reminder.id, timerId);
      return true;
    } else {
      // Si le temps est déjà passé, afficher immédiatement
      this.showNotification(reminder);
      return true;
    }
  }

  public cancelReminder(reminderId: string): void {
    const timerId = this.timers.get(reminderId);
    if (timerId) {
      clearTimeout(timerId);
      this.timers.delete(reminderId);
    }
    
    this.reminders.delete(reminderId);
    this.saveReminders();
  }

  public cancelAllReminders(): void {
    this.timers.forEach(timerId => clearTimeout(timerId));
    this.timers.clear();
    this.reminders.clear();
    this.saveReminders();
  }

  private showNotification(reminder: CookingReminder): void {
    if (!this.isSupported || this.permission !== 'granted') {
      return;
    }

    const options: any = {
      body: this.getNotificationBody(reminder),
      icon: '/vite.svg', // Remplacer par l'icône de l'app
      badge: '/vite.svg',
      tag: reminder.id,
      requireInteraction: true,
      actions: this.getNotificationActions(reminder),
      data: {
        reminderId: reminder.id,
        recipeId: reminder.recipeId,
        type: reminder.type
      }
    };

    const notification = new Notification(
      this.getNotificationTitle(reminder),
      options
    );

    // Gérer les clics sur la notification
    notification.onclick = () => {
      window.focus();
      this.handleNotificationClick(reminder);
      notification.close();
    };

    // Auto-fermeture après 10 secondes pour les notifications non-critiques
    if (reminder.type !== 'timer') {
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  }

  private getNotificationTitle(reminder: CookingReminder): string {
    switch (reminder.type) {
      case 'start':
        return '🍳 Temps de cuisiner !';
      case 'step':
        return '👨‍🍳 Prochaine étape';
      case 'timer':
        return '⏰ Minuteur terminé';
      case 'finish':
        return '✅ Recette terminée !';
      default:
        return 'Cuisine du Cameroun';
    }
  }

  private getNotificationBody(reminder: CookingReminder): string {
    switch (reminder.type) {
      case 'start':
        return `Il est temps de commencer à préparer ${reminder.recipeName}`;
      case 'step':
        return `${reminder.recipeName}: ${reminder.step}`;
      case 'timer':
        return `Minuteur terminé pour ${reminder.recipeName}`;
      case 'finish':
        return `Félicitations ! Votre ${reminder.recipeName} est prêt à être dégusté`;
      default:
        return reminder.step;
    }
  }

  private getNotificationActions(reminder: CookingReminder): any[] {
    const actions: any[] = [];

    switch (reminder.type) {
      case 'start':
        actions.push(
          { action: 'open', title: 'Ouvrir la recette' },
          { action: 'snooze', title: 'Reporter (5 min)' }
        );
        break;
      case 'step':
        actions.push(
          { action: 'next', title: 'Étape suivante' },
          { action: 'timer', title: 'Démarrer minuteur' }
        );
        break;
      case 'timer':
        actions.push(
          { action: 'open', title: 'Voir la recette' },
          { action: 'restart', title: 'Redémarrer minuteur' }
        );
        break;
      case 'finish':
        actions.push(
          { action: 'rate', title: 'Noter la recette' },
          { action: 'share', title: 'Partager' }
        );
        break;
    }

    return actions;
  }

  private handleNotificationClick(reminder: CookingReminder): void {
    // Émettre un événement personnalisé pour que l'application puisse réagir
    const event = new CustomEvent('notification-clicked', {
      detail: {
        reminderId: reminder.id,
        recipeId: reminder.recipeId,
        type: reminder.type
      }
    });
    document.dispatchEvent(event);
  }

  // Méthodes utilitaires pour créer des rappels courants
  public scheduleRecipeStart(recipeId: number, recipeName: string, startTime: Date): string {
    const reminderId = `start-${recipeId}-${Date.now()}`;
    const reminder: CookingReminder = {
      id: reminderId,
      recipeId,
      recipeName,
      step: 'Commencer la préparation',
      scheduledTime: startTime,
      type: 'start'
    };

    this.scheduleReminder(reminder);
    return reminderId;
  }

  public scheduleStepReminder(recipeId: number, recipeName: string, step: string, time: Date): string {
    const reminderId = `step-${recipeId}-${Date.now()}`;
    const reminder: CookingReminder = {
      id: reminderId,
      recipeId,
      recipeName,
      step,
      scheduledTime: time,
      type: 'step'
    };

    this.scheduleReminder(reminder);
    return reminderId;
  }

  public scheduleTimer(recipeId: number, recipeName: string, duration: number, description: string): string {
    const reminderId = `timer-${recipeId}-${Date.now()}`;
    const scheduledTime = new Date(Date.now() + duration * 1000);
    
    const reminder: CookingReminder = {
      id: reminderId,
      recipeId,
      recipeName,
      step: description,
      scheduledTime,
      type: 'timer'
    };

    this.scheduleReminder(reminder);
    return reminderId;
  }

  public scheduleRecipeFinish(recipeId: number, recipeName: string, finishTime: Date): string {
    const reminderId = `finish-${recipeId}-${Date.now()}`;
    const reminder: CookingReminder = {
      id: reminderId,
      recipeId,
      recipeName,
      step: 'Recette terminée',
      scheduledTime: finishTime,
      type: 'finish'
    };

    this.scheduleReminder(reminder);
    return reminderId;
  }

  // Méthodes de persistance
  private saveReminders(): void {
    const remindersData = Array.from(this.reminders.values()).map((reminder) => ({
      ...reminder,
      scheduledTime: reminder.scheduledTime.toISOString()
    }));
    
    localStorage.setItem('cookingReminders', JSON.stringify(remindersData));
  }

  private loadReminders(): void {
    const stored = localStorage.getItem('cookingReminders');
    if (!stored) return;

    try {
      const remindersData = JSON.parse(stored);
      const now = new Date();

      remindersData.forEach((data: any) => {
        const reminder: CookingReminder = {
          ...data,
          scheduledTime: new Date(data.scheduledTime)
        };

        // Ne recharger que les rappels futurs
        if (reminder.scheduledTime > now) {
          this.scheduleReminder(reminder);
        }
      });
    } catch (error) {
      console.error('Erreur lors du chargement des rappels:', error);
    }
  }

  // Méthodes d'information
  public getActiveReminders(): CookingReminder[] {
    return Array.from(this.reminders.values());
  }

  public isNotificationSupported(): boolean {
    return this.isSupported;
  }

  public getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  // Méthode pour tester les notifications
  public async testNotification(): Promise<void> {
    if (!await this.requestPermission()) {
      throw new Error('Permission refusée pour les notifications');
    }

    const testReminder: CookingReminder = {
      id: 'test-' + Date.now(),
      recipeId: 0,
      recipeName: 'Test de notification',
      step: 'Ceci est un test de notification push',
      scheduledTime: new Date(),
      type: 'start'
    };

    this.showNotification(testReminder);
  }
}