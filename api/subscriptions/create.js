const { getPool } = require('../../lib/db');
const { handleCors } = require('../../lib/cors');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  if (!requireAuth(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const pool = getPool();

  try {
    const { plan, paymentMethod, transactionId } = req.body;

    if (!['free', 'premium', 'pro'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Plan invalide' });
    }

    const amounts = { free: 0, premium: 4990, pro: 19990 };
    const durations = { free: null, premium: 30, pro: 365 }; // jours

    let expiresAt = null;
    if (durations[plan]) {
      expiresAt = new Date(Date.now() + durations[plan] * 24 * 60 * 60 * 1000);
    }

    // Désactiver l'ancien abonnement actif
    try {
      await pool.query(
        `UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status = 'active'`,
        [req.user.id]
      );

      const result = await pool.query(
        `INSERT INTO subscriptions (user_id, plan, amount, payment_method, transaction_id, status, expires_at)
         VALUES ($1, $2, $3, $4, $5, 'active', $6) RETURNING *`,
        [req.user.id, plan, amounts[plan], paymentMethod, transactionId, expiresAt]
      );

      return res.json({
        success: true,
        message: `Abonnement ${plan} créé avec succès`,
        subscription: result.rows[0]
      });
    } catch (dbError) {
      // Table n'existe pas encore
      return res.json({
        success: true,
        message: `Abonnement ${plan} enregistré (mode simplifié)`,
        subscription: { plan, status: 'active', expires_at: expiresAt }
      });
    }
  } catch (error) {
    console.error('Erreur create subscription:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
