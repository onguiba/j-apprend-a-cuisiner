const pool = require('../config/database');

class SubscriptionService {
  // Récupérer l'abonnement actif d'un utilisateur
  static async getActiveSubscription(userId) {
    const result = await pool.query(
      `SELECT * FROM subscriptions 
       WHERE user_id = $1 AND status = 'active' 
       ORDER BY end_date DESC LIMIT 1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  // Créer un nouvel abonnement
  static async createSubscription(userId, plan, amount = 0, paymentMethod = null) {
    const endDate = this.calculateEndDate(plan);
    
    const result = await pool.query(
      `INSERT INTO subscriptions 
       (user_id, plan, end_date, payment_method, amount, status) 
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING *`,
      [userId, plan, endDate, paymentMethod, amount]
    );

    // Mettre à jour le statut d'abonnement de l'utilisateur
    await pool.query(
      `UPDATE users 
       SET subscription_status = $1, subscription_end_date = $2 
       WHERE id = $3`,
      [plan, endDate, userId]
    );

    return result.rows[0];
  }

  // Renouveler un abonnement
  static async renewSubscription(subscriptionId) {
    const subscription = await pool.query(
      'SELECT * FROM subscriptions WHERE id = $1',
      [subscriptionId]
    );

    if (!subscription.rows[0]) {
      throw new Error('Abonnement non trouvé');
    }

    const sub = subscription.rows[0];
    const endDate = this.calculateEndDate(sub.plan);

    const result = await pool.query(
      `UPDATE subscriptions 
       SET end_date = $1, status = 'active', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [endDate, subscriptionId]
    );

    // Mettre à jour l'utilisateur
    await pool.query(
      `UPDATE users 
       SET subscription_status = $1, subscription_end_date = $2 
       WHERE id = $3`,
      [sub.plan, endDate, sub.user_id]
    );

    return result.rows[0];
  }

  // Annuler un abonnement
  static async cancelSubscription(subscriptionId) {
    const result = await pool.query(
      `UPDATE subscriptions 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [subscriptionId]
    );

    if (result.rows[0]) {
      await pool.query(
        `UPDATE users 
         SET subscription_status = 'free' 
         WHERE id = $1`,
        [result.rows[0].user_id]
      );
    }

    return result.rows[0];
  }

  // Vérifier et mettre à jour les abonnements expirés
  static async checkExpiredSubscriptions() {
    const result = await pool.query(
      `UPDATE subscriptions 
       SET status = 'expired' 
       WHERE status = 'active' AND end_date < CURRENT_TIMESTAMP 
       RETURNING user_id`
    );

    // Mettre à jour les utilisateurs avec abonnements expirés
    for (const row of result.rows) {
      await pool.query(
        `UPDATE users 
         SET subscription_status = 'free' 
         WHERE id = $1`,
        [row.user_id]
      );
    }

    return result.rows.length;
  }

  // Obtenir l'historique des abonnements
  static async getSubscriptionHistory(userId) {
    const result = await pool.query(
      `SELECT * FROM subscriptions 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  // Calculer la date de fin d'abonnement
  static calculateEndDate(plan) {
    const now = new Date();
    const endDate = new Date(now);

    switch (plan) {
      case 'premium':
        endDate.setMonth(endDate.getMonth() + 1); // 1 mois
        break;
      case 'pro':
        endDate.setFullYear(endDate.getFullYear() + 1); // 1 an
        break;
      case 'free':
      default:
        return null;
    }

    return endDate;
  }

  // Obtenir les statistiques des abonnements
  static async getSubscriptionStats() {
    const result = await pool.query(
      `SELECT 
        plan,
        COUNT(*) as count,
        SUM(amount) as total_revenue
       FROM subscriptions 
       WHERE status = 'active'
       GROUP BY plan`
    );
    return result.rows;
  }
}

module.exports = SubscriptionService;
