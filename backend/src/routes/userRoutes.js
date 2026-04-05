const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getUserSummary,
  getUserDetailWithApplications,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware.js');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes (user)
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin routes
router.get('/summary', protect, adminOnly, getUserSummary);
router.get('/:id/detail', protect, adminOnly, getUserDetailWithApplications);
router.get('/', protect, adminOnly, getAllUsers);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;