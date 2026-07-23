const express = require('express');
const { body, validationResult } = require('express-validator');
const { login, signup } = require('../controllers/authController');

const router = express.Router();

// Helper middleware — checks if express-validator found any errors in the request.
// If yes, sends a 400 response with the error messages. If not, passes to the next handler.
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

// @route   POST /api/auth/login
// @desc    Log in an existing admin with phone + password
// @access  Public
router.post(
    '/login',
    [
        body('phone')
            .trim()
            .notEmpty()
            .withMessage('Phone number is required')
            .matches(/^[0-9]{10}$/)
            .withMessage('Please enter a valid 10-digit phone number'),
        body('password').notEmpty().withMessage('Password is required'),
        validateRequest,
    ],
    login
);

// @route   POST /api/auth/signup
// @desc    Register a new admin account
// @access  Public
router.post(
    '/signup',
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required'),
        body('phone')
            .trim()
            .notEmpty()
            .withMessage('Phone number is required')
            .matches(/^[0-9]{10}$/)
            .withMessage('Please enter a valid 10-digit phone number'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        validateRequest,
    ],
    signup
);

module.exports = router;
