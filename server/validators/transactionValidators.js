const { body } = require('express-validator');

const createTransactionRules = [
  body('party')
    .notEmpty()
    .withMessage('Party is required')
    .isMongoId()
    .withMessage('Invalid party ID'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than zero'),
  body('transactionType')
    .notEmpty()
    .withMessage('Transaction type is required')
    .isIn(['PAYMENT_IN', 'PAYMENT_OUT'])
    .withMessage('Transaction type must be PAYMENT_IN or PAYMENT_OUT'),
  body('remarks')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Remarks must be at most 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
];

module.exports = { createTransactionRules };
