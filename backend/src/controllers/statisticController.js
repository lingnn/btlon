const Statistic = require('../models/Statistic');
const Application = require('../models/Application');
const Major = require('../models/Major');

const getYear = (year) => year || new Date().getFullYear();

// 1. Thống kê số lượng hồ sơ theo ngành (chỉ tính hồ sơ đã nộp)
const generateStatsByMajor = async (year) => {
  const stats = await Application.aggregate([
    { $match: { status: { $ne: 'draft' }, submissionDate: { $exists: true } } },
    { $unwind: '$preferences' },
    {
      $group: {
        _id: '$preferences.majorId',
        submittedCount: { $sum: 1 },
        acceptedCount: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $eq: ['$preferences.status', 'approved'] },
                  { $eq: ['$status', 'approved'] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    { $lookup: { from: 'majors', localField: '_id', foreignField: '_id', as: 'major' } },
    { $unwind: { path: '$major', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        majorCode: '$major.code',
        majorName: '$major.name',
        submittedCount: 1,
        acceptedCount: 1,
        count: '$submittedCount'
      }
    },
    { $sort: { submittedCount: -1 } }
  ]);
  return stats;
};

// 2. Thống kê trạng thái hồ sơ (tổng, đã duyệt, chờ, từ chối)
const generateStatsByStatus = async () => {
  const stats = await Application.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  // Chuẩn hóa về dạng dễ dùng
  const result = {
    total: 0,
    approved: 0,    // trạng thái 'approved'
    pending: 0,     // 'submitted' + 'under_review' + 'need_more_info'
    rejected: 0     // 'rejected'
  };
  for (const s of stats) {
    const status = s._id;
    const cnt = s.count;
    result.total += cnt;
    if (status === 'approved') result.approved = cnt;
    else if (status === 'rejected') result.rejected = cnt;
    else if (['submitted', 'under_review', 'need_more_info'].includes(status)) result.pending += cnt;
  }
  return result;
};

// 3. Thống kê số lượng hồ sơ theo tháng (trong năm)
const generateMonthlySubmission = async (year) => {
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year}-12-31`);
  const stats = await Application.aggregate([
    { $match: { submissionDate: { $gte: start, $lte: end }, status: { $ne: 'draft' } } },
    { $group: {
        _id: { month: { $month: '$submissionDate' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.month': 1 } }
  ]);
  // Tạo mảng 12 tháng, mặc định 0
  const monthly = Array(12).fill(0);
  for (const s of stats) {
    const monthIndex = s._id.month - 1; // tháng 1 -> index 0
    monthly[monthIndex] = s.count;
  }
  // Trả về dạng [{ month: 1, count: 150 }, ...]
  return monthly.map((count, idx) => ({ month: idx + 1, count }));
};

// ========== API ==========

// @desc    Tạo/cập nhật tất cả thống kê (chạy aggregation, lưu cache)
// @route   POST /api/statistics/generate
// @access  Private/Admin
const generateAllStatistics = async (req, res) => {
  try {
    const year = getYear(req.body.year);
    const [byMajor, byStatus, monthly] = await Promise.all([
      generateStatsByMajor(year),
      generateStatsByStatus(),
      generateMonthlySubmission(year)
    ]);
    const types = ['by_major', 'by_status', 'monthly_submission'];
    const dataMap = { by_major: byMajor, by_status: byStatus, monthly_submission: monthly };
    for (const type of types) {
      await Statistic.findOneAndUpdate(
        { type, year },
        { data: dataMap[type], year },
        { upsert: true, new: true }
      );
    }
    res.json({ message: 'Thống kê đã được cập nhật', year });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy thống kê theo loại (có thể realtime)
// @route   GET /api/statistics/:type
// @access  Private/Admin
const getStatistics = async (req, res) => {
  try {
    const { type } = req.params;
    const { year, realtime } = req.query;
    const targetYear = getYear(year);
    const allowedTypes = ['by_major', 'by_status', 'monthly_submission'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Loại thống kê không hợp lệ' });
    }
    if (realtime === 'true') {
      let data;
      switch (type) {
        case 'by_major': data = await generateStatsByMajor(targetYear); break;
        case 'by_status': data = await generateStatsByStatus(); break;
        case 'monthly_submission': data = await generateMonthlySubmission(targetYear); break;
      }
      return res.json({ type, year: targetYear, data });
    } else {
      const stat = await Statistic.findOne({ type, year: targetYear });
      if (!stat) return res.status(404).json({ message: 'Chưa có thống kê, hãy tạo trước' });
      res.json(stat);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xuất danh sách thí sinh (giữ nguyên)
// @route   GET /api/statistics/export-applications
// @access  Private/Admin
const exportApplications = async (req, res) => {
  try {
    const { status, majorId, year } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (majorId) filter['preferences.majorId'] = majorId;
    if (year) filter.submissionDate = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) };
    const apps = await Application.find(filter)
      .populate('preferences.majorId preferences.methodId')
      .lean();
    const flat = apps.map(app => ({
      'Mã hồ sơ': app.applicationCode,
      'Họ tên': app.fullName,
      'CCCD': app.idNumber,
      'Email': app.email,
      'SĐT': app.phone,
      'Ngày nộp': app.submissionDate,
      'Trạng thái hồ sơ': app.status,
      'Nguyện vọng': app.preferences.map(p => `${p.priority}. ${p.majorId?.name}`).join('; ')
    }));
    res.json(flat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateAllStatistics,
  getStatistics,
  exportApplications
};