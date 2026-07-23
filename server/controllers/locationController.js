const Location = require('../models/Location');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all locations (paginated, filterable by isActive)
// @route   GET /api/locations
// @access  Private
const getLocations = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 50, 1);
  const skip = (page - 1) * limit;

  const filter = {};

  // By default, list active locations, but allow filtering
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  } else {
    // Default to active locations unless specified
    filter.isActive = true;
  }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search.trim(), 'i');
    filter.name = searchRegex;
  }

  const [results, totalCount] = await Promise.all([
    Location.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Location.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    success: true,
    message: 'Locations fetched successfully',
    data: {
      results,
      totalPages,
      currentPage: page,
      totalCount,
    },
  });
});

// @desc    Get single location details
// @route   GET /api/locations/:id
// @access  Private
const getLocationById = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id).lean();

  if (!location) {
    return res.status(404).json({
      success: false,
      message: 'Location not found',
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Location details fetched successfully',
    data: location,
  });
});

// @desc    Create a location
// @route   POST /api/locations
// @access  Private
const createLocation = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Location name is required',
      data: null,
    });
  }

  // Format and trim name
  const trimmedName = name.trim();

  // Check uniqueness
  const existing = await Location.findOne({ name: trimmedName });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Location name already exists',
      data: null,
    });
  }

  const location = await Location.create({
    name: trimmedName,
  });

  res.status(201).json({
    success: true,
    message: 'Location created successfully',
    data: location,
  });
});

// @desc    Update a location
// @route   PUT /api/locations/:id
// @access  Private
const updateLocation = asyncHandler(async (req, res) => {
  const { name, isActive } = req.body;

  const location = await Location.findById(req.params.id);

  if (!location) {
    return res.status(404).json({
      success: false,
      message: 'Location not found',
      data: null,
    });
  }

  if (name !== undefined) {
    const trimmedName = name.trim();

    // Uniqueness check if name changes
    if (trimmedName !== location.name) {
      const existing = await Location.findOne({ name: trimmedName });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Location name already exists',
          data: null,
        });
      }
    }
    location.name = trimmedName;
  }

  if (isActive !== undefined) {
    location.isActive = isActive;
  }

  await location.save();

  res.status(200).json({
    success: true,
    message: 'Location updated successfully',
    data: location,
  });
});

// @desc    Soft delete (deactivate) a location
// @route   DELETE /api/locations/:id
// @access  Private
const deleteLocation = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    return res.status(404).json({
      success: false,
      message: 'Location not found',
      data: null,
    });
  }

  location.isActive = false;
  await location.save();

  res.status(200).json({
    success: true,
    message: 'Location deactivated successfully',
    data: { id: location._id },
  });
});

module.exports = {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
