const express = require('express');
const router = express.Router();
const {
  createApplication,
  updateApplication,
  submitApplication,
  deleteApplication,
  getMyApplications,
  getApplicationById,
  traCuuKetQua,
  getAllApplications,
  reviewApplication,
  exportApplications,
  statisticsByMajor
} = require('../controllers/applicationController');
const { protect, requireRoles, ROLES } = require('../middleware/authMiddleware');

// Public route (tra cứu kết quả)
router.get('/tra-cuu', traCuuKetQua);

// Routes cho thí sinh (candidate) đã đăng nhập
router.use(protect);
router.post('/', createApplication);
router.get('/my', getMyApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.post('/:id/submit', submitApplication);
router.delete('/:id', deleteApplication);

// Routes chỉ admin
router.get('/', requireRoles(ROLES.CONTENT_ADMIN), getAllApplications);
router.get('/export', requireRoles(ROLES.CONTENT_ADMIN), exportApplications);
router.get('/statistics/by-major', requireRoles(ROLES.CONTENT_ADMIN), statisticsByMajor);
router.put('/:id/review', requireRoles(ROLES.CONTENT_ADMIN), reviewApplication);

module.exports = router;