const { body } = require('express-validator');

const createPartyRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 120 })
    .withMessage('Name must be at most 120 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Enter a valid 10-digit phone number'),
  body('partyType')
    .notEmpty()
    .withMessage('Party type is required')
    .isIn(['CUSTOMER', 'SUPPLIER'])
    .withMessage('Party type must be CUSTOMER or SUPPLIER'),
  body('customerCategory')
    .if(body('partyType').equals('CUSTOMER'))
    .notEmpty()
    .withMessage('Customer category is required for customers')
    .isIn(['SHOPKEEPER', 'REGULAR'])
    .withMessage('Customer category must be SHOPKEEPER or REGULAR'),
  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .isMongoId()
    .withMessage('Invalid location ID'),
];

const updatePartyRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 120 })
    .withMessage('Name must be at most 120 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Enter a valid 10-digit phone number'),
  body('partyType')
    .optional()
    .isIn(['CUSTOMER', 'SUPPLIER'])
    .withMessage('Party type must be CUSTOMER or SUPPLIER'),
  body('customerCategory')
    .optional()
    .isIn(['SHOPKEEPER', 'REGULAR'])
    .withMessage('Customer category must be SHOPKEEPER or REGULAR'),
  body('location')
    .optional()
    .isMongoId()
    .withMessage('Invalid location ID'),
];

module.exports = { createPartyRules, updatePartyRules };
