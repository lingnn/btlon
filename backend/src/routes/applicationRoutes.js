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
const { protect, adminOnly } = require('../middleware/authMiddleware');

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
router.get('/', adminOnly, getAllApplications);
router.get('/export', adminOnly, exportApplications);
router.get('/statistics/by-major', adminOnly, statisticsByMajor);
router.put('/:id/review', adminOnly, reviewApplication);

module.exports = router;