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
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes (dành cho thí sinh xem)
router.get('/', getAllMajors);
router.get('/:id', getMajorById);

// Admin only
router.post('/', protect, adminOnly, createMajor);
router.put('/:id', protect, adminOnly, updateMajor);
router.delete('/:id', protect, adminOnly, deleteMajor);
router.patch('/:id/toggle', protect, adminOnly, toggleActive);

module.exports = router;