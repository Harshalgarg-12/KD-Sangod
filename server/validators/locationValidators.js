const { body } = require('express-validator');

const createLocationRules = [
  body('areaName')
    .trim()
    .notEmpty()
    .withMessage('Area name is required')
    .isLength({ max: 100 })
    .withMessage('Area name must be at most 100 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

const updateLocationRules = [
  body('areaName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Area name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Area name must be at most 100 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

module.exports = { createLocationRules, updateLocationRules };
