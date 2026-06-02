const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

// Routes publiques (nécessitent authentification)
router.get('/active', protect, subscriptionController.getActiveSubscription);
router.post('/create', protect, subscriptionController.createSubscription);
router.get('/history', protect, subscriptionController.getSubscriptionHistory);

// Routes d'administration
router.put('/:subscriptionId/renew', protect, subscriptionController.renewSubscription);
router.delete('/:subscriptionId/cancel', protect, subscriptionController.cancelSubscription);
router.get('/admin/stats', protect, subscriptionController.getSubscriptionStats);
router.post('/admin/check-expired', protect, subscriptionController.checkExpiredSubscriptions);

module.exports = router;
