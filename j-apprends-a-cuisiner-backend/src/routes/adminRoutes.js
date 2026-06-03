const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Toutes les routes admin nécessitent authentification + droits admin
router.use(protect);
router.use(adminOnly);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Gestion des utilisateurs
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/promote', adminController.promoteToAdmin);
router.put('/users/:id/demote', adminController.demoteToUser);

module.exports = router;
