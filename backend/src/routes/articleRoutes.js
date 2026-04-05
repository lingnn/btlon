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
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllArticles);
router.get('/:id', getArticleById);   // tự động tăng view

// Admin only routes
router.post('/', protect, adminOnly, createArticle);
router.put('/:id', protect, adminOnly, updateArticle);
router.delete('/:id', protect, adminOnly, deleteArticle);
router.patch('/:id/publish', protect, adminOnly, publishArticle);
router.patch('/:id/unpublish', protect, adminOnly, unpublishArticle);

module.exports = router;