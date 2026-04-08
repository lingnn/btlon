const express = require('express');
const router = express.Router();
const {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  publishArticle,
  unpublishArticle
} = require('../controllers/articleController');
const { protect, requireRoles, ROLES } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllArticles);
router.get('/:id', getArticleById);   // tự động tăng view

// Admin only routes
router.post('/', protect, requireRoles(ROLES.CONTENT_ADMIN), createArticle);
router.put('/:id', protect, requireRoles(ROLES.CONTENT_ADMIN), updateArticle);
router.delete('/:id', protect, requireRoles(ROLES.CONTENT_ADMIN), deleteArticle);
router.patch('/:id/publish', protect, requireRoles(ROLES.CONTENT_ADMIN), publishArticle);
router.patch('/:id/unpublish', protect, requireRoles(ROLES.CONTENT_ADMIN), unpublishArticle);

module.exports = router;