// SubscriptionService - désactivé pour le déploiement frontend
// Ce service nécessite un backend connecté
import { ApiService } from './ApiService';
import { Subscription } from '../models/Subscription';

export class SubscriptionService {
  private static apiService = ApiService.getInstance();

  /**
   * Récupérer l'abonnement actif de l'utilisateur
   */
  static async getActiveSubscription(): Promise<Subscription | null> {
    try {
      const response = await this.apiService.getAdminDashboard(); // fallback
      if (response && (response as any).subscription) {
        const sub = (response as any).subscription;
        return new Subscription(
          sub.id,
          sub.user_id,
          sub.plan,
          new Date(sub.start_date),
          sub.amount,
          sub.status,
          sub.end_date ? new Date(sub.end_date) : undefined
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
    _plan: 'free' | 'premium' | 'pro',
    _paymentMethod?: string
  ): Promise<Subscription | null> {
    console.warn('createSubscription: backend non disponible');
    return null;
  }

  /**
   * Renouveler un abonnement
   */
  static async renewSubscription(_subscriptionId: number): Promise<Subscription | null> {
    console.warn('renewSubscription: backend non disponible');
    return null;
  }

  /**
   * Annuler un abonnement
   */
  static async cancelSubscription(_subscriptionId: number): Promise<boolean> {
    console.warn('cancelSubscription: backend non disponible');
    return false;
  }

  /**
   * Obtenir l'historique des abonnements
   */
  static async getSubscriptionHistory(): Promise<Subscription[]> {
    console.warn('getSubscriptionHistory: backend non disponible');
    return [];
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
