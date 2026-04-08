const express = require('express');
const router = express.Router();
const {
  generateAllStatistics,
  getStatistics,
  exportApplications
} = require('../controllers/statisticController');
const { protect, requireRoles, ROLES } = require('../middleware/authMiddleware');

router.use(protect, requireRoles(ROLES.CONTENT_ADMIN));

router.post('/generate', generateAllStatistics);
router.get('/:type', getStatistics);
router.get('/export/applications', exportApplications);

module.exports = router;