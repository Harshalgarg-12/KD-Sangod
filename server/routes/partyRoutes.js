const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const {
    getParties,
    getPartyById,
    createParty,
    updateParty,
    deleteParty,
} = require('../controllers/partyController');

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

// All routes here are protected
router.use(auth);

// @route   GET /api/parties
// @access  Private
router.get('/', getParties);

// @route   GET /api/parties/:id
// @access  Private
router.get('/:id', getPartyById);

// @route   POST /api/parties
// @access  Private
router.post(
    '/',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('phone')
            .trim()
            .notEmpty()
            .withMessage('Phone matches format and required')
            .matches(/^[0-9]{10}$/)
            .withMessage('Please enter a valid 10-digit phone number'),
        body('type')
            .notEmpty()
            .withMessage('Party type (type) is required')
            .isIn(['CUSTOMER', 'SUPPLIER'])
            .withMessage('Type must be CUSTOMER or SUPPLIER'),
        body('location').notEmpty().withMessage('Location is required').isMongoId().withMessage('Invalid Location ID'),
        body('fathersName')
            .custom((value, { req }) => {
                if (req.body.type === 'CUSTOMER' && (!value || !value.trim())) {
                    throw new Error("Father's name is required for customers");
                }
                return true;
            }),
        // customerCategory is optional, validated only when present
        body('customerCategory')
            .optional()
            .isIn(['REGULAR', 'SHOPKEEPER'])
            .withMessage('Customer category must be REGULAR or SHOPKEEPER'),
        validateRequest,
    ],
    createParty
);

// @route   PUT /api/parties/:id
// @access  Private
router.put(
    '/:id',
    [
        body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
        body('phone')
            .optional()
            .trim()
            .matches(/^[0-9]{10}$/)
            .withMessage('Please enter a valid 10-digit phone number'),
        body('type')
            .optional()
            .isIn(['CUSTOMER', 'SUPPLIER'])
            .withMessage('Type must be CUSTOMER or SUPPLIER'),
        body('location').optional().isMongoId().withMessage('Invalid Location ID'),
        body('fathersName')
            .optional()
            .custom((value, { req }) => {
                // Only require fathersName on update if the resulting type is CUSTOMER
                // Note: they might update father's name without specifying type, or vice versa, but we handle that in controller
                return true;
            }),
        validateRequest,
    ],
    updateParty
);

// @route   DELETE /api/parties/:id
// @access  Private
router.delete('/:id', deleteParty);

module.exports = router;
