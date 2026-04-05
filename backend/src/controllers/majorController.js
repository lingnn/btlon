// controllers/majorController.js
const Major = require('../models/Major');

// @desc    Tạo mới ngành (admin)
// @route   POST /api/majors
const createMajor = async (req, res) => {
  try {
    const { code, name, totalQuota, duration, description, year } = req.body;

    // Kiểm tra mã ngành đã tồn tại
    const existing = await Major.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Mã ngành đã tồn tại' });
    }

    const major = await Major.create({
      code,
      name,
      totalQuota,
      duration,
      description,
      year,
    });

    res.status(201).json(major);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách ngành (có filter)
// @route   GET /api/majors
const getAllMajors = async (req, res) => {
  try {
    const { year, active } = req.query;
    let filter = {};
    if (year) filter.year = parseInt(year);
    if (active === 'true') filter.isActive = true;

    const majors = await Major.find(filter).sort({ code: 1 });
    res.json(majors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy chi tiết một ngành
// @route   GET /api/majors/:id
const getMajorById = async (req, res) => {
  try {
    const major = await Major.findById(req.params.id);
    if (!major) {
      return res.status(404).json({ message: 'Không tìm thấy ngành' });
    }
    res.json(major);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật ngành (admin)
// @route   PUT /api/majors/:id
const updateMajor = async (req, res) => {
  try {
    const { code, name, totalQuota, duration, description, isActive, year } = req.body;

    // Nếu thay đổi code, kiểm tra trùng
    if (code) {
      const existing = await Major.findOne({ code, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: 'Mã ngành đã tồn tại' });
      }
    }

    const updated = await Major.findByIdAndUpdate(
      req.params.id,
      { code, name, totalQuota, duration, description, isActive, year },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy ngành' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa ngành (admin)
// @route   DELETE /api/majors/:id
const deleteMajor = async (req, res) => {
  try {
    const major = await Major.findByIdAndDelete(req.params.id);
    if (!major) {
      return res.status(404).json({ message: 'Không tìm thấy ngành' });
    }
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bật/tắt trạng thái (admin)
// @route   PATCH /api/majors/:id/toggle
const toggleActive = async (req, res) => {
  try {
    const major = await Major.findById(req.params.id);
    if (!major) {
      return res.status(404).json({ message: 'Không tìm thấy ngành' });
    }
    major.isActive = !major.isActive;
    await major.save();
    res.json({ isActive: major.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMajor,
  getAllMajors,
  getMajorById,
  updateMajor,
  deleteMajor,
  toggleActive
};