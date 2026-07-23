const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} = require('../controllers/locationController');

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

// @route   GET /api/locations
// @access  Private
router.get('/', getLocations);

// @route   GET /api/locations/:id
// @access  Private
router.get('/:id', getLocationById);

// @route   POST /api/locations
// @access  Private
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Location name is required'),
    validateRequest,
  ],
  createLocation
);

// @route   PUT /api/locations/:id
// @access  Private
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Location name cannot be empty'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    validateRequest,
  ],
  updateLocation
);

// @route   DELETE /api/locations/:id
// @access  Private
router.delete('/:id', deleteLocation);

module.exports = router;
