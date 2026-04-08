const User = require('../models/User');
const Application = require('../models/Application');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ROLES } = require('../middleware/authMiddleware');

// Helper: generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, password, fullName, email, phone, idNumber } = req.body;

    if (!username || !password || !idNumber) {
      return res.status(400).json({ message: 'Thiếu username, password hoặc idNumber' });
    }

    // Password must be at least 6 chars and contain both letters and numbers.
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Mật khẩu phải có ít nhất 6 ký tự, gồm cả chữ và số',
      });
    }

    const duplicateChecks = [{ username }, { idNumber }];
    if (email) duplicateChecks.push({ email });
    if (phone) duplicateChecks.push({ phone });

    const existingUser = await User.findOne({ $or: duplicateChecks });
    if (existingUser) {
      const duplicateFields = [];
      if (existingUser.username === username) duplicateFields.push('Tên đăng nhập');
      if (existingUser.idNumber === idNumber) duplicateFields.push('CCCD');
      if (email && existingUser.email === email) duplicateFields.push('Email');
      if (phone && existingUser.phone === phone) duplicateFields.push('Số điện thoại');

      return res.status(400).json({
        message: `${duplicateFields.join(', ')} đã tồn tại`,
        duplicateFields,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
      fullName,
      email,
      phone,
      idNumber,
      role: ROLES.CANDIDATE,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          role: user.role
        }
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      const fieldMap = {
        username: 'Tên đăng nhập',
        idNumber: 'CCCD',
        email: 'Email',
        phone: 'Số điện thoại',
      };
      return res.status(400).json({
        message: `${fieldMap[duplicateField] || 'Thông tin'} đã tồn tại`,
        duplicateField,
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

   const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      data: {
        token: token,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['fullName', 'email', 'phone', 'address']; // chỉ cho phép cập nhật các trường này
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới' });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự, gồm cả chữ và số',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      return res.status(400).json({ message: 'Mật khẩu mới phải khác mật khẩu hiện tại' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users summary (admin only)
// @route   GET /api/users/summary
// @access  Private/Admin
const getUserSummary = async (req, res) => {
  try {
    const [
      totalUsers,
      totalSystemAdmins,
      totalContentAdmins,
      totalCandidates,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: ROLES.SYSTEM_ADMIN }),
      User.countDocuments({ role: ROLES.CONTENT_ADMIN }),
      User.countDocuments({ role: ROLES.CANDIDATE }),
    ]);

    const totalAdmins = totalSystemAdmins + totalContentAdmins;

    res.json({
      totalUsers,
      totalAdmins,
      totalSystemAdmins,
      totalContentAdmins,
      totalCandidates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update role of a user (system admin only)
// @route   PATCH /api/users/:id/role
// @access  Private/SystemAdmin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedTargetRoles = [ROLES.CANDIDATE, ROLES.CONTENT_ADMIN, ROLES.SYSTEM_ADMIN];

    if (!allowedTargetRoles.includes(role)) {
      return res.status(400).json({ message: 'Vai trò không hợp lệ' });
    }

    const targetUser = await User.findById(req.params.id).select('-password');
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const requesterId = String(req.user.id);
    const targetId = String(targetUser._id);
    const currentTargetRole = targetUser.role;

    if (requesterId === targetId && currentTargetRole === ROLES.SYSTEM_ADMIN && role !== ROLES.SYSTEM_ADMIN) {
      return res.status(400).json({ message: 'Không thể tự hạ quyền tài khoản quản trị hệ thống' });
    }

    targetUser.role = role;
    await targetUser.save();

    res.json({
      message: 'Cập nhật vai trò thành công',
      user: targetUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user detail with submitted applications (admin only)
// @route   GET /api/users/:id/detail
// @access  Private/Admin
const getUserDetailWithApplications = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const applications = await Application.find({ userId: user._id })
      .populate('preferences.majorId preferences.methodId')
      .sort({ createdAt: -1 });

    res.json({ user, applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getUserSummary,
  getUserDetailWithApplications,
  getAllUsers,
  deleteUser,
  updateUserRole,
};