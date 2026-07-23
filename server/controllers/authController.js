const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Authenticate admin & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide phone and password',
            data: null,
        });
    }

    // Find admin by phone, explicitly include password field for comparison
    const admin = await Admin.findOne({ phone }).select('+password');

    if (!admin || !admin.isActive) {
        return res.status(401).json({
            success: false,
            message: 'Invalid phone or password',
            data: null,
        });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid phone or password',
            data: null,
        });
    }

    // Generate a JWT token containing the admin's ID and role
    const token = generateToken(admin._id, admin.role);

    // Remove password from the response object before sending
    const sanitizedAdmin = admin.toObject();
    delete sanitizedAdmin.password;

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            token,
            admin: sanitizedAdmin,
        },
    });
});

// @desc    Register a new admin account
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
    const { name, phone, password, shopName, fathersName, villageCity, gstin } = req.body;

    // Check if an admin with this phone already exists
    const existingAdmin = await Admin.findOne({ phone });
    if (existingAdmin) {
        return res.status(400).json({
            success: false,
            message: 'An account with this phone number already exists',
            data: null,
        });
    }

    // Create the new admin — password is automatically hashed by the pre-save hook in Admin model
    const admin = await Admin.create({
        name,
        phone,
        password,
        shopName: shopName || '',
        fathersName: fathersName || '',
        villageCity: villageCity || '',
        gstin: gstin || '',
        role: 'ADMIN', // New signups are always regular admins, not super admins
    });

    // Generate a JWT token so they're immediately logged in after signup
    const token = generateToken(admin._id, admin.role);

    // Return the admin without the password
    const sanitizedAdmin = admin.toObject();
    delete sanitizedAdmin.password;

    res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
            token,
            admin: sanitizedAdmin,
        },
    });
});

module.exports = { login, signup };
