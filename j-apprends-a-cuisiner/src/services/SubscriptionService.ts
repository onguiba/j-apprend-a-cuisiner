import { ApiService } from './ApiService';
import { Subscription } from '../models/Subscription';

export class SubscriptionService {
  private static apiService = new ApiService();

  /**
   * Récupérer l'abonnement actif de l'utilisateur
   */
  static async getActiveSubscription(): Promise<Subscription | null> {
    try {
      const response = await this.apiService.get('/subscriptions/active');
      if (response.subscription) {
        return new Subscription(
          response.subscription.id,
          response.subscription.user_id,
          response.subscription.plan,
          new Date(response.subscription.start_date),
          response.subscription.amount,
          response.subscription.status,
          response.subscription.end_date ? new Date(response.subscription.end_date) : undefined
        );
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonnement:', error);
      return null;
    }
  }

  /**
   * Créer un nouvel abonnement
   */
  static async createSubscription(
    plan: 'free' | 'premium' | 'pro',
    paymentMethod?: string
  ): Promise<Subscription | null> {
    try {
      const response = await this.apiService.post('/subscriptions/create', {
        plan,
        paymentMethod
      });

      if (response.subscription) {
        return new Subscription(
          response.subscription.id,
          response.subscription.user_id,
          response.subscription.plan,
          new Date(response.subscription.start_date),
          response.subscription.amount,
          response.subscription.status,
          response.subscription.end_date ? new Date(response.subscription.end_date) : undefined
        );
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la création de l\'abonnement:', error);
      throw error;
    }
  }

  /**
   * Renouveler un abonnement
   */
  static async renewSubscription(subscriptionId: number): Promise<Subscription | null> {
    try {
      const response = await this.apiService.put(
        `/subscriptions/${subscriptionId}/renew`,
        {}
      );

      if (response.subscription) {
        return new Subscription(
          response.subscription.id,
          response.subscription.user_id,
          response.subscription.plan,
          new Date(response.subscription.start_date),
          response.subscription.amount,
          response.subscription.status,
          response.subscription.end_date ? new Date(response.subscription.end_date) : undefined
        );
      }
      return null;
    } catch (error) {
      console.error('Erreur lors du renouvellement de l\'abonnement:', error);
      throw error;
    }
  }

  /**
   * Annuler un abonnement
   */
  static async cancelSubscription(subscriptionId: number): Promise<boolean> {
    try {
      await this.apiService.delete(`/subscriptions/${subscriptionId}/cancel`);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      throw error;
    }
  }

  /**
   * Obtenir l'historique des abonnements
   */
  static async getSubscriptionHistory(): Promise<Subscription[]> {
    try {
      const response = await this.apiService.get('/subscriptions/history');
      return response.history.map((sub: any) =>
        new Subscription(
          sub.id,
          sub.user_id,
          sub.plan,
          new Date(sub.start_date),
          sub.amount,
          sub.status,
          sub.end_date ? new Date(sub.end_date) : undefined
        )
      );
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return [];
    }
  }

  /**
   * Vérifier si l'utilisateur a accès à une fonctionnalité premium
   */
  static async hasPremiumAccess(): Promise<boolean> {
    const subscription = await this.getActiveSubscription();
    return subscription ? subscription.isActive() && subscription.getPlan() !== 'free' : false;
  }

  /**
   * Vérifier si l'utilisateur a accès à une fonctionnalité pro
   */
  static async hasProAccess(): Promise<boolean> {
    const subscription = await this.getActiveSubscription();
    return subscription ? subscription.isActive() && subscription.getPlan() === 'pro' : false;
  }

  /**
   * Obtenir les détails du plan
   */
  static getPlanDetails(plan: 'free' | 'premium' | 'pro'): {
    name: string;
    price: number;
    features: string[];
    duration: string;
  } {
    const plans = {
      free: {
        name: 'Gratuit',
        price: 0,
        features: [
          'Accès à toutes les recettes',
          'Recherche basique',
          'Favoris limités (10)',
          'Pas de vidéos HD'
        ],
        duration: 'Illimité'
      },
      premium: {
        name: 'Premium',
        price: 4990,
        features: [
          'Accès à toutes les recettes',
          'Recherche avancée',
          'Favoris illimités',
          'Vidéos HD',
          'Pas de publicités',
          'Téléchargement de recettes'
        ],
        duration: '1 mois'
      },
      pro: {
        name: 'Pro',
        price: 19990,
        features: [
          'Toutes les fonctionnalités Premium',
          'Accès aux recettes exclusives',
          'Consultation avec chefs',
          'Planification de repas personnalisée',
          'Export en PDF',
          'Support prioritaire'
        ],
        duration: '1 an'
      }
    };

    return plans[plan];
  }
}
