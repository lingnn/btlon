const AdmissionMethod = require('../models/AdmissionMethod');

// @desc    Tạo mới phương thức (admin)
// @route   POST /api/admission-methods
const createMethod = async (req, res) => {
  try {
    const { code, name, description, fields, year } = req.body;
    const existing = await AdmissionMethod.findOne({ code });
    if (existing) return res.status(400).json({ message: 'Mã phương thức đã tồn tại' });
    const method = await AdmissionMethod.create({ code, name, description, fields, year });
    res.status(201).json(method);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách phương thức (public, có filter)
// @route   GET /api/admission-methods
const getAllMethods = async (req, res) => {
  try {
    const { year, active } = req.query;
    let filter = {};
    if (year) filter.year = parseInt(year);
    if (active === 'true') filter.isActive = true;
    const methods = await AdmissionMethod.find(filter).sort({ code: 1 });
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy chi tiết một phương thức (public)
// @route   GET /api/admission-methods/:id
const getMethodById = async (req, res) => {
  try {
    const method = await AdmissionMethod.findById(req.params.id);
    if (!method) return res.status(404).json({ message: 'Không tìm thấy phương thức' });
    res.json(method);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật phương thức (admin)
// @route   PUT /api/admission-methods/:id
const updateMethod = async (req, res) => {
  try {
    const { code, name, description, fields, isActive, year } = req.body;
    if (code) {
      const existing = await AdmissionMethod.findOne({ code, _id: { $ne: req.params.id } });
      if (existing) return res.status(400).json({ message: 'Mã phương thức đã tồn tại' });
    }
    const updated = await AdmissionMethod.findByIdAndUpdate(
      req.params.id,
      { code, name, description, fields, isActive, year },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy phương thức' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa phương thức (admin)
// @route   DELETE /api/admission-methods/:id
const deleteMethod = async (req, res) => {
  try {
    const method = await AdmissionMethod.findByIdAndDelete(req.params.id);
    if (!method) return res.status(404).json({ message: 'Không tìm thấy phương thức' });
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bật/tắt trạng thái (admin)
// @route   PATCH /api/admission-methods/:id/toggle
const toggleActive = async (req, res) => {
  try {
    const method = await AdmissionMethod.findById(req.params.id);
    if (!method) return res.status(404).json({ message: 'Không tìm thấy phương thức' });
    method.isActive = !method.isActive;
    await method.save();
    res.json({ isActive: method.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMethod,
  getAllMethods,
  getMethodById,
  updateMethod,
  deleteMethod,
  toggleActive
};