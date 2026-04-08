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
  deleteUser,
  updateUserRole,
} = require('../controllers/userController');
const { protect, requireRoles, ROLES } = require('../middleware/authMiddleware.js');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes (user)
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// System admin routes
router.get('/summary', protect, requireRoles(ROLES.SYSTEM_ADMIN), getUserSummary);
router.get('/:id/detail', protect, requireRoles(ROLES.SYSTEM_ADMIN), getUserDetailWithApplications);
router.get('/', protect, requireRoles(ROLES.SYSTEM_ADMIN), getAllUsers);
router.patch('/:id/role', protect, requireRoles(ROLES.SYSTEM_ADMIN), updateUserRole);
router.delete('/:id', protect, requireRoles(ROLES.SYSTEM_ADMIN), deleteUser);

module.exports = router;