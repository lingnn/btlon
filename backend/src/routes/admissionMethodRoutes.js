const express = require('express');
const router = express.Router();
const {
  createMethod,
  getAllMethods,
  getMethodById,
  updateMethod,
  deleteMethod,
  toggleActive
} = require('../controllers/admissionMethodController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Công khai - dùng cho form đăng ký của thí sinh (có thể cần đăng nhập? Thường là công khai)
router.get('/', getAllMethods);
router.get('/:id', getMethodById);

// Admin only
router.post('/', protect, adminOnly, createMethod);
router.put('/:id', protect, adminOnly, updateMethod);
router.delete('/:id', protect, adminOnly, deleteMethod);
router.patch('/:id/toggle', protect, adminOnly, toggleActive);

module.exports = router;