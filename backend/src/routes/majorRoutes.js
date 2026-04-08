// routes/majorRoutes.js
const express = require('express');
const router = express.Router();
const {
  createMajor,
  getAllMajors,
  getMajorById,
  updateMajor,
  deleteMajor,
  toggleActive
} = require('../controllers/majorController');
const { protect, requireRoles, ROLES } = require('../middleware/authMiddleware');

// Public routes (dành cho thí sinh xem)
router.get('/', getAllMajors);
router.get('/:id', getMajorById);

// Admin only
router.post('/', protect, requireRoles(ROLES.CONTENT_ADMIN), createMajor);
router.put('/:id', protect, requireRoles(ROLES.CONTENT_ADMIN), updateMajor);
router.delete('/:id', protect, requireRoles(ROLES.CONTENT_ADMIN), deleteMajor);
router.patch('/:id/toggle', protect, requireRoles(ROLES.CONTENT_ADMIN), toggleActive);

module.exports = router;