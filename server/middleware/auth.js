const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
        data: null,
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token is invalid or expired',
        data: null,
      });
    }

    // Get admin from the token
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, admin account not found',
        data: null,
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, admin account is deactivated',
        data: null,
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
