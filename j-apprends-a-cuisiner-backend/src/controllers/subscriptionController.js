const SubscriptionService = require('../services/subscriptionService');

// Obtenir l'abonnement actif de l'utilisateur
exports.getActiveSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = await SubscriptionService.getActiveSubscription(userId);

    res.json({
      success: true,
      subscription: subscription || { plan: 'free', status: 'active' }
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Créer un nouvel abonnement
exports.createSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan, paymentMethod, transactionId } = req.body;

    if (!['free', 'premium', 'pro'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Plan invalide' });
    }

    // Définir le montant selon le plan
    const amounts = {
      free: 0,
      premium: 4990, // 4990 XAF (~7.50 EUR)
      pro: 19990 // 19990 XAF (~30 EUR)
    };

    const subscription = await SubscriptionService.createSubscription(
      userId,
      plan,
      amounts[plan],
      paymentMethod
    );

    res.json({
      success: true,
      message: `Abonnement ${plan} créé avec succès`,
      subscription
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Renouveler un abonnement
exports.renewSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await SubscriptionService.renewSubscription(subscriptionId);

    res.json({
      success: true,
      message: 'Abonnement renouvelé avec succès',
      subscription
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Annuler un abonnement
exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await SubscriptionService.cancelSubscription(subscriptionId);

    res.json({
      success: true,
      message: 'Abonnement annulé',
      subscription
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Obtenir l'historique des abonnements
exports.getSubscriptionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await SubscriptionService.getSubscriptionHistory(userId);

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Obtenir les statistiques (admin uniquement)
exports.getSubscriptionStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    const stats = await SubscriptionService.getSubscriptionStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Vérifier les abonnements expirés (admin/cron)
exports.checkExpiredSubscriptions = async (req, res) => {
  try {
    // Vérifier si c'est un appel admin
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    const count = await SubscriptionService.checkExpiredSubscriptions();
    res.json({
      success: true,
      message: `${count} abonnement(s) marqué(s) comme expiré(s)`
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
