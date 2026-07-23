const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const requireSuperAdmin = require('../middleware/requireSuperAdmin');
const {
  createTransaction,
  getPartyTransactions,
  getAllTransactions,
  deleteTransaction,
} = require('../controllers/transactionController');

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

// @route   POST /api/transactions
// @access  Private
router.post(
  '/',
  [
    body('partyId').notEmpty().withMessage('Party ID is required').isMongoId().withMessage('Invalid Party ID'),
    body('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isFloat({ min: 1 })
      .withMessage('Amount must be at least 1 Rupee'),
    body('type')
      .notEmpty()
      .withMessage('Transaction type is required')
      .isIn(['DEBIT', 'CREDIT'])
      .withMessage('Type must be DEBIT or CREDIT'),
    body('date').optional().isISO8601().withMessage('Invalid ISO date format'),
    body('remarks').optional().trim(),
    validateRequest,
  ],
  createTransaction
);

// @route   GET /api/transactions/party/:partyId
// @access  Private
router.get('/party/:partyId', getPartyTransactions);

// @route   GET /api/transactions
// @access  Private
router.get('/', getAllTransactions);

// @route   DELETE /api/transactions/:id
// @access  Private/SuperAdmin
router.delete('/:id', requireSuperAdmin, deleteTransaction);

module.exports = router;
