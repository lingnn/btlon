const Article = require('../models/Article');

// @desc    Tạo bài viết mới (admin)
// @route   POST /api/articles
// @access  Private/Admin
const createArticle = async (req, res) => {
  try {
    const { title, content, category, tags, attachments } = req.body;
    const article = await Article.create({
      title,
      content,
      category,
      tags,
      attachments,
      authorId: req.user.id,   // lấy từ middleware protect
      isPublished: false,       // mặc định chưa xuất bản
      viewCount: 0
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách bài viết (có lọc, phân trang) - PUBLIC
// @route   GET /api/articles
// @access  Public
const getAllArticles = async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10, published = 'true' } = req.query;
    let filter = {};
    if (published === 'true') filter.isPublished = true;
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { publishedAt: -1, createdAt: -1 }
    };
    const articles = await Article.find(filter, null, options)
      .populate('authorId', 'fullName email')
      .lean();
    const total = await Article.countDocuments(filter);
    res.json({ data: articles, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy chi tiết bài viết (tăng viewCount) - PUBLIC
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('authorId', 'fullName email');
    if (!article) return res.status(404).json({ message: 'Bài viết không tồn tại' });
    // Nếu bài chưa xuất bản, chỉ admin mới xem được
    if (!article.isPublished && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Bài viết chưa được xuất bản' });
    }
    // Tăng view count
    article.viewCount += 1;
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật bài viết (admin)
// @route   PUT /api/articles/:id
// @access  Private/Admin
const updateArticle = async (req, res) => {
  try {
    const { title, content, category, tags, attachments, isPublished } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Bài viết không tồn tại' });
    if (title) article.title = title;
    if (content) article.content = content;
    if (category) article.category = category;
    if (tags) article.tags = tags;
    if (attachments) article.attachments = attachments;
    if (isPublished !== undefined && isPublished === true && article.isPublished === false) {
      article.isPublished = true;
      article.publishedAt = new Date();
    } else if (isPublished !== undefined) {
      article.isPublished = isPublished;
    }
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa bài viết (admin)
// @route   DELETE /api/articles/:id
// @access  Private/Admin
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Bài viết không tồn tại' });
    res.json({ message: 'Xóa bài viết thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xuất bản bài viết (admin)
// @route   PATCH /api/articles/:id/publish
// @access  Private/Admin
const publishArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Bài viết không tồn tại' });
    article.isPublished = true;
    article.publishedAt = new Date();
    await article.save();
    res.json({ message: 'Đã xuất bản bài viết', article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Gỡ xuất bản bài viết (admin)
// @route   PATCH /api/articles/:id/unpublish
// @access  Private/Admin
const unpublishArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Bài viết không tồn tại' });
    article.isPublished = false;
    article.publishedAt = null;
    await article.save();
    res.json({ message: 'Đã gỡ xuất bản', article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  publishArticle,
  unpublishArticle
};