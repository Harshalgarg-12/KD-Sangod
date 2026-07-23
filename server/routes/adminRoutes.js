const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const {
    getProfile,
    updateProfile,
    changePassword,
} = require('../controllers/adminController');

const router = express.Router();

// Helper to handle validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array().map(e => e.msg).join(', '),
            data: null,
        });
    }
    next();
};

// All routes here are protected
router.use(auth);

// @route   GET /api/admin/profile
// @access  Private
router.get('/profile', getProfile);

// @route   PUT /api/admin/profile
// @access  Private
router.put(
    '/profile',
    [
        body('shopName')
            .optional()
            .trim()
            .isLength({ max: 150 })
            .withMessage('Shop name must be under 150 characters'),
        body('fathersName')
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage("Father's name must be under 100 characters"),
        body('villageCity')
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Village/City name must be under 100 characters'),
        body('gstin')
            .optional()
            .trim()
            .custom((value) => {
                if (!value) return true;
                const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                if (!gstinRegex.test(value)) {
                    throw new Error('Please enter a valid GSTIN format');
                }
                return true;
            }),
        validateRequest,
    ],
    updateProfile
);

// @route   PUT /api/admin/change-password
// @access  Private
router.put(
    '/change-password',
    [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('New password must be at least 6 characters'),
        body('confirmPassword')
            .notEmpty()
            .withMessage('Confirmation password is required'),
        validateRequest,
    ],
    changePassword
);

module.exports = router;
