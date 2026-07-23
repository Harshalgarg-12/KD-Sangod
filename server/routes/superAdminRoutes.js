const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const requireSuperAdmin = require('../middleware/requireSuperAdmin');
const {
    addAdmin,
    getAdmins,
    toggleStatus,
} = require('../controllers/superAdminController');

const router = express.Router();

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

// All routes here are protected by role authentication
router.use(auth, requireSuperAdmin);

// @route   POST /api/super-admin/add-admin
// @access  Private/SuperAdmin
router.post(
    '/add-admin',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('phone')
            .trim()
            .notEmpty()
            .withMessage('Phone is required')
            .matches(/^[0-9]{10}$/)
            .withMessage('Please enter a valid 10-digit phone number'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        body('shopName').optional().trim(),
        body('fathersName').optional().trim(),
        body('villageCity').optional().trim(),
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
    addAdmin
);

// @route   GET /api/super-admin/admins
// @access  Private/SuperAdmin
router.get('/admins', getAdmins);

// @route   PUT /api/super-admin/toggle-status/:id
// @access  Private/SuperAdmin
router.put('/toggle-status/:id', toggleStatus);

module.exports = router;
