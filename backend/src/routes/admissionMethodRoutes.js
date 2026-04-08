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
const { protect, requireRoles, ROLES } = require('../middleware/authMiddleware');

router.get('/', getAllMethods);
router.get('/:id', getMethodById);

// Admin only
router.post('/', protect, requireRoles(ROLES.CONTENT_ADMIN), createMethod);
router.put('/:id', protect, requireRoles(ROLES.CONTENT_ADMIN), updateMethod);
router.delete('/:id', protect, requireRoles(ROLES.CONTENT_ADMIN), deleteMethod);
router.patch('/:id/toggle', protect, requireRoles(ROLES.CONTENT_ADMIN), toggleActive);

module.exports = router;