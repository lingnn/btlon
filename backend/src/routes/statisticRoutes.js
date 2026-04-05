const express = require('express');
const router = express.Router();
const {
  generateAllStatistics,
  getStatistics,
  exportApplications
} = require('../controllers/statisticController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.post('/generate', generateAllStatistics);
router.get('/:type', getStatistics);
router.get('/export/applications', exportApplications);

module.exports = router;