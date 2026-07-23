const Party = require('../models/Party');
const Location = require('../models/Location');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all active parties (paginated, searchable, filterable)
// @route   GET /api/parties
// @access  Private
const getParties = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  const filter = { isActive: true };

  if (req.query.type) {
    const allowedTypes = ['CUSTOMER', 'SUPPLIER'];
    const queryType = req.query.type.toUpperCase();
    if (allowedTypes.includes(queryType)) {
      filter.type = queryType;
    }
  }

  if (req.query.location) {
    filter.location = req.query.location;
  }

  // Filter by customerCategory (only for CUSTOMER type)
  if (req.query.customerCategory) {
    const allowedCategories = ['REGULAR', 'SHOPKEEPER'];
    const queryCat = req.query.customerCategory.toUpperCase();
    if (allowedCategories.includes(queryCat)) {
      filter.customerCategory = queryCat;
    }
  }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search.trim(), 'i');
    filter.$or = [{ name: searchRegex }, { phone: searchRegex }];
  }

  let sort = { createdAt: -1 };
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort = { [parts[0]]: parts[1] === 'desc' ? -1 : 1 };
  }

  const [results, totalCount] = await Promise.all([
    Party.find(filter)
      .populate('location')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Party.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    success: true,
    message: 'Parties fetched successfully',
    data: {
      results,
      totalPages,
      currentPage: page,
      totalCount,
    },
  });
});

// @desc    Get a single party details
// @route   GET /api/parties/:id
// @access  Private
const getPartyById = asyncHandler(async (req, res) => {
  const party = await Party.findOne({ _id: req.params.id, isActive: true })
    .populate('location')
    .populate('createdBy', 'name')
    .lean();

  if (!party) {
    return res.status(404).json({
      success: false,
      message: 'Party not found',
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Party details fetched successfully',
    data: party,
  });
});

// @desc    Create a new party (customer or supplier)
// @route   POST /api/parties
// @access  Private
const createParty = asyncHandler(async (req, res) => {
  const { name, phone, type, location, fathersName } = req.body;

  // Check for duplicate active phone number
  const existingParty = await Party.findOne({ phone, isActive: true });
  if (existingParty) {
    return res.status(400).json({
      success: false,
      message: `An active party with this phone number already exists as a ${existingParty.type}`,
      data: null,
    });
  }

  // Verify location is valid and active
  const locationExists = await Location.findOne({ _id: location, isActive: true });
  if (!locationExists) {
    return res.status(400).json({
      success: false,
      message: 'Valid location is required',
      data: null,
    });
  }

  const partyData = {
    name,
    phone,
    type: type ? type.toUpperCase() : undefined,
    location,
    createdBy: req.admin._id,
  };

  if (partyData.type === 'CUSTOMER') {
    partyData.fathersName = fathersName;
    // Save customer category (REGULAR or SHOPKEEPER)
    partyData.customerCategory = req.body.customerCategory || undefined;
  } else {
    // Explicitly delete and suppress fathersName and category for SUPPLIER
    partyData.fathersName = undefined;
    partyData.customerCategory = undefined;
  }

  const party = await Party.create(partyData);

  const populatedParty = await Party.findById(party._id)
    .populate('location')
    .lean();

  res.status(201).json({
    success: true,
    message: 'Party status created successfully',
    data: populatedParty,
  });
});

// @desc    Update party details
// @route   PUT /api/parties/:id
// @access  Private
const updateParty = asyncHandler(async (req, res) => {
  const { name, phone, type, location, fathersName } = req.body;

  const party = await Party.findOne({ _id: req.params.id, isActive: true });
  if (!party) {
    return res.status(404).json({
      success: false,
      message: 'Party not found',
      data: null,
    });
  }

  if (name !== undefined) party.name = name;
  if (phone !== undefined) party.phone = phone;
  if (type !== undefined) party.type = type.toUpperCase();

  if (location !== undefined) {
    const locationExists = await Location.findOne({ _id: location, isActive: true });
    if (!locationExists) {
      return res.status(400).json({
        success: false,
        message: 'Valid location is required',
        data: null,
      });
    }
    party.location = location;
  }

  if (party.type === 'CUSTOMER') {
    if (fathersName !== undefined) party.fathersName = fathersName;
    // Update customer category if provided
    if (req.body.customerCategory !== undefined) {
      party.customerCategory = req.body.customerCategory;
    }
  } else {
    // Explicitly handle SUPPLIER
    party.fathersName = undefined;
    party.customerCategory = undefined;
  }

  await party.save();

  const populatedParty = await Party.findById(party._id)
    .populate('location')
    .lean();

  res.status(200).json({
    success: true,
    message: 'Party updated successfully',
    data: populatedParty,
  });
});

// @desc    Soft delete (deactivate) party
// @route   DELETE /api/parties/:id
// @access  Private
const deleteParty = asyncHandler(async (req, res) => {
  const party = await Party.findOne({ _id: req.params.id, isActive: true });
  if (!party) {
    return res.status(404).json({
      success: false,
      message: 'Party not found',
      data: null,
    });
  }

  party.isActive = false;
  await party.save();

  res.status(200).json({
    success: true,
    message: 'Party deactivated successfully',
    data: { id: party._id },
  });
});

module.exports = {
  getParties,
  getPartyById,
  createParty,
  updateParty,
  deleteParty,
};
