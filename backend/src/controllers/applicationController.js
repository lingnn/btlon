const Application = require('../models/Application');
const User = require('../models/User');
const Major = require('../models/Major');
const AdmissionMethod = require('../models/AdmissionMethod');
const AdmissionResult = require('../models/AdmissionResult');
const { v4: uuidv4 } = require('uuid');

// Helper: sinh mã hồ sơ duy nhất
const generateApplicationCode = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `HS${year}${random}`;
};

// Helper: kiểm tra dữ liệu methodData có hợp lệ với fields của admissionMethod không
const validateMethodData = async (methodId, methodData) => {
  const method = await AdmissionMethod.findById(methodId);
  if (!method) throw new Error('Phương thức xét tuyển không tồn tại');
  const fields = Array.isArray(method.fields) ? method.fields : [];
  const safeMethodData = methodData || {};
  // Frontend multi-step currently does not collect dynamic methodData fields yet.
  // Allow submission without methodData and keep stricter validation for later updates.
  if (Object.keys(safeMethodData).length === 0) return true;

  for (const field of fields) {
    const fieldLabel = String(field?.label || field?.key || 'dữ liệu');
    const value = safeMethodData[field.key];
    if (field.required && (value === undefined || value === null || value === '')) {
      throw new Error(`Trường "${fieldLabel}" là bắt buộc`);
    }
    if (field.type === 'number' && value !== undefined && isNaN(value)) {
      throw new Error(`Trường "${fieldLabel}" phải là số`);
    }
    if (field.type === 'select' && value && Array.isArray(field.options)) {
      if (Array.isArray(value)) {
        const invalid = value.find((item) => !field.options.includes(item));
        if (invalid) {
          throw new Error(`Giá trị "${invalid}" không hợp lệ cho trường "${fieldLabel}"`);
        }
      } else if (!field.options.includes(value)) {
        throw new Error(`Giá trị "${value}" không hợp lệ cho trường "${fieldLabel}"`);
      }
    }
  }
  return true;
};

// Helper: kiểm tra phương thức có áp dụng cho ngành hay không
// Nếu major chưa cấu hình admissionMethods thì mặc định cho phép.
const isMethodApplicableToMajor = (major, methodId) => {
  const admissionMethods = Array.isArray(major?.admissionMethods) ? major.admissionMethods : [];
  if (admissionMethods.length === 0) return true;
  return admissionMethods.some((m) => m?.methodId?.toString() === methodId);
};

// @desc    Tạo mới hồ sơ (draft)
// @route   POST /api/applications
// @access  Private (candidate)
const createApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

    // Lấy thông tin từ user làm mặc định, cho phép ghi đè
    const {
      fullName = user.fullName,
      email = user.email,
      phone = user.phone,
      idNumber = user.idNumber,
      address = '',
      highSchool = '',
      graduationYear = null,
      preferences = [],
      documents = [],
      status = 'draft'
    } = req.body;

    const allowedStatuses = ['draft', 'submitted', 'under_review', 'need_more_info', 'approved', 'rejected'];
    const safeStatus = allowedStatuses.includes(status) ? status : 'draft';

    // Validate từng nguyện vọng
    for (const pref of preferences) {
      const { majorId, methodId, methodData } = pref;
      if (!majorId || !methodId) {
        return res.status(400).json({ message: 'Thiếu majorId hoặc methodId trong nguyện vọng' });
      }
      const major = await Major.findById(majorId);
      if (!major) return res.status(400).json({ message: `Ngành ${majorId} không tồn tại` });
      // Kiểm tra phương thức có được áp dụng cho ngành không
      const validMethod = isMethodApplicableToMajor(major, methodId);
      if (!validMethod) {
        return res.status(400).json({ message: `Phương thức không áp dụng cho ngành ${major.name}` });
      }
      // Validate methodData
      await validateMethodData(methodId, methodData);
    }

    const applicationCode = generateApplicationCode();
    // Kiểm tra trùng mã (trường hợp hiếm)
    const existing = await Application.findOne({ applicationCode });
    if (existing) {
      return res.status(500).json({ message: 'Lỗi tạo mã hồ sơ, vui lòng thử lại' });
    }

    const newApp = await Application.create({
      userId,
      applicationCode,
      idNumber,
      fullName,
      email,
      phone,
      address,
      highSchool,
      graduationYear,
      preferences,
      documents,
      status: safeStatus,
      submissionDate: safeStatus === 'submitted' ? new Date() : undefined,
    });

    res.status(201).json(newApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật hồ sơ (chỉ draft)
// @route   PUT /api/applications/:id
// @access  Private (candidate)
const updateApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Hồ sơ không tồn tại' });
    if (app.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền cập nhật hồ sơ này' });
    }
    if (app.status !== 'draft') {
      return res.status(400).json({ message: 'Chỉ có thể cập nhật hồ sơ ở trạng thái draft' });
    }

    const { fullName, email, phone, address, highSchool, graduationYear, preferences, documents } = req.body;

    // Validate preferences nếu có thay đổi
    if (preferences) {
      for (const pref of preferences) {
        const { majorId, methodId, methodData } = pref;
        if (!majorId || !methodId) return res.status(400).json({ message: 'Thiếu majorId hoặc methodId' });
        const major = await Major.findById(majorId);
        if (!major) return res.status(400).json({ message: `Ngành không tồn tại` });
        const validMethod = isMethodApplicableToMajor(major, methodId);
        if (!validMethod) return res.status(400).json({ message: `Phương thức không áp dụng` });
        await validateMethodData(methodId, methodData);
      }
    }

    // Cập nhật các trường
    if (fullName) app.fullName = fullName;
    if (email) app.email = email;
    if (phone) app.phone = phone;
    if (address) app.address = address;
    if (highSchool) app.highSchool = highSchool;
    if (graduationYear) app.graduationYear = graduationYear;
    if (preferences) app.preferences = preferences;
    if (documents) app.documents = documents;

    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Nộp hồ sơ (chuyển trạng thái)
// @route   POST /api/applications/:id/submit
// @access  Private (candidate)
const submitApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Hồ sơ không tồn tại' });
    if (app.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền nộp hồ sơ này' });
    }
    if (app.status !== 'draft') {
      return res.status(400).json({ message: 'Hồ sơ đã được nộp hoặc đang xử lý' });
    }

    // Kiểm tra tính đầy đủ (ví dụ: có ít nhất 1 nguyện vọng)
    if (!app.preferences || app.preferences.length === 0) {
      return res.status(400).json({ message: 'Hồ sơ phải có ít nhất một nguyện vọng' });
    }

    app.status = 'submitted';
    app.submissionDate = new Date();
    await app.save();

    res.json({ message: 'Nộp hồ sơ thành công', applicationCode: app.applicationCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa hồ sơ (chỉ draft)
// @route   DELETE /api/applications/:id
// @access  Private (candidate)
const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Hồ sơ không tồn tại' });
    if (app.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền xóa hồ sơ này' });
    }
    if (app.status !== 'draft') {
      return res.status(400).json({ message: 'Chỉ có thể xóa hồ sơ ở trạng thái draft' });
    }
    await app.deleteOne();
    res.json({ message: 'Xóa hồ sơ thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách hồ sơ của thí sinh đang đăng nhập
// @route   GET /api/applications/my
// @access  Private (candidate)
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id })
      .populate('preferences.majorId preferences.methodId')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy chi tiết một hồ sơ (candidate hoặc admin)
// @route   GET /api/applications/:id
// @access  Private (candidate hoặc admin)
const getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('preferences.majorId preferences.methodId')
      .populate('reviewLog.adminId', 'fullName email');
    if (!app) return res.status(404).json({ message: 'Hồ sơ không tồn tại' });
    // Nếu là candidate, chỉ được xem hồ sơ của mình
    if (req.user.role === 'candidate' && app.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền xem hồ sơ này' });
    }
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tra cứu kết quả (công khai)
// @route   GET /api/applications/tra-cuu
// @access  Public
const traCuuKetQua = async (req, res) => {
  try {
    const { maHoSo, soCCCD } = req.query;
    if (!maHoSo && !soCCCD) {
      return res.status(400).json({ message: 'Vui lòng cung cấp mã hồ sơ hoặc số CCCD' });
    }
    const query = {};
    if (maHoSo) query.applicationCode = maHoSo;
    if (soCCCD) query.idNumber = soCCCD;
    const app = await Application.findOne(query)
      .populate('preferences.majorId preferences.methodId');
    if (!app) return res.status(404).json({ message: 'Không tìm thấy hồ sơ' });
    // Chỉ trả về các thông tin cần thiết
    const result = {
      applicationCode: app.applicationCode,
      fullName: app.fullName,
      status: app.status,
      submissionDate: app.submissionDate,
      preferences: app.preferences.map(p => ({
        priority: p.priority,
        major: p.majorId?.name,
        method: p.methodId?.name,
        status: p.status,
        note: p.note
      }))
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== ADMIN ONLY ==================

// @desc    Lấy danh sách hồ sơ (có filter, phân trang)
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = async (req, res) => {
  try {
    const { status, majorId, methodId, year, page = 1, limit = 10 } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (majorId) filter['preferences.majorId'] = majorId;
    if (methodId) filter['preferences.methodId'] = methodId;
    if (year) filter.submissionDate = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) };

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: ['userId', 'preferences.majorId', 'preferences.methodId']
    };
    const apps = await Application.find(filter, null, options);
    const total = await Application.countDocuments(filter);
    res.json({ data: apps, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Duyệt hồ sơ (cập nhật status tổng thể và từng nguyện vọng)
// @route   PUT /api/applications/:id/review
// @access  Private/Admin
const reviewApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Hồ sơ không tồn tại' });
    const { status, preferencesStatus, comment } = req.body;
    // Cập nhật status tổng thể
    if (status && ['under_review', 'need_more_info', 'approved', 'rejected'].includes(status)) {
      app.status = status;
    }
    // Cập nhật từng nguyện vọng (nếu có)
    if (preferencesStatus && Array.isArray(preferencesStatus)) {
      for (const ps of preferencesStatus) {
        const pref = app.preferences.id(ps.id);
        if (pref) {
          pref.status = ps.status;
          pref.note = ps.note || pref.note;

          // Khi admin chấp nhận một nguyện vọng: lưu kết quả xét tuyển tương ứng
          if (ps.status === 'approved') {
            await AdmissionResult.create({
              userId: app.userId,
              majorId: pref.majorId,
              methodId: pref.methodId,
              applicationId: app._id,
              preferenceId: pref._id,
              status: 'approved',
              note: ps.note || '',
            });
          }
        }
      }
    }
    // Ghi log duyệt
    app.reviewLog.push({
      adminId: req.user.id,
      status: app.status,
      comment: comment || '',
      timestamp: new Date()
    });
    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xuất danh sách hồ sơ (dùng cho thống kê, export CSV)
// @route   GET /api/applications/export
// @access  Private/Admin
const exportApplications = async (req, res) => {
  try {
    const { status, majorId, methodId, year } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (majorId) filter['preferences.majorId'] = majorId;
    if (methodId) filter['preferences.methodId'] = methodId;
    if (year) filter.submissionDate = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) };

    const apps = await Application.find(filter)
      .populate('preferences.majorId preferences.methodId')
      .lean();
    // Chuyển thành dạng phẳng để xuất
    const flatData = apps.map(app => ({
      'Mã hồ sơ': app.applicationCode,
      'Họ tên': app.fullName,
      'CCCD': app.idNumber,
      'Email': app.email,
      'SĐT': app.phone,
      'Ngày nộp': app.submissionDate,
      'Trạng thái hồ sơ': app.status,
      'Nguyện vọng': app.preferences.map(p => `${p.priority}. ${p.majorId?.name} (${p.methodId?.name})`).join('; '),
      'Kết quả': app.preferences.map(p => `${p.majorId?.code}: ${p.status}`).join('; ')
    }));
    res.json(flatData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Thống kê số lượng hồ sơ theo ngành
// @route   GET /api/applications/statistics/by-major
// @access  Private/Admin
const statisticsByMajor = async (req, res) => {
  try {
    const stats = await Application.aggregate([
      { $unwind: '$preferences' },
      { $group: { _id: '$preferences.majorId', count: { $sum: 1 } } },
      { $lookup: { from: 'majors', localField: '_id', foreignField: '_id', as: 'major' } },
      { $unwind: { path: '$major', preserveNullAndEmptyArrays: true } },
      { $project: { majorCode: '$major.code', majorName: '$major.name', count: 1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};