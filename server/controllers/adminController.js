const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  // req.admin is already set by auth middleware (without password)
  res.status(200).json({
    success: true,
    message: 'Profile fetched successfully',
    data: req.admin,
  });
});

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { shopName, fathersName, villageCity, gstin } = req.body;

  const admin = await Admin.findById(req.admin._id);

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin account not found',
      data: null,
    });
  }

  // Update only allowed fields
  if (shopName !== undefined) admin.shopName = shopName;
  if (fathersName !== undefined) admin.fathersName = fathersName;
  if (villageCity !== undefined) admin.villageCity = villageCity;
  if (gstin !== undefined) admin.gstin = gstin;

  await admin.save();

  // Fetch updated profile without password
  const updatedAdmin = await Admin.findById(req.admin._id);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedAdmin,
  });
});

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current, new, and confirm passwords',
      data: null,
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'New passwords do not match',
      data: null,
    });
  }

  // Fetch admin with password select to verify current
  const admin = await Admin.findById(req.admin._id).select('+password');

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin account not found',
      data: null,
    });
  }

  const isMatch = await admin.matchPassword(currentPassword);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect',
      data: null,
    });
  }

  // Set new password (pre-save hook will hash it automatically)
  admin.password = newPassword;
  await admin.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
    data: null,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
