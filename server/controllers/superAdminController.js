const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register a new sub-admin
// @route   POST /api/super-admin/add-admin
// @access  Private/SuperAdmin
const addAdmin = asyncHandler(async (req, res) => {
    const { name, phone, password, role, shopName, fathersName, villageCity, gstin } =
        req.body;

    // Phone check
    const existingAdmin = await Admin.findOne({ phone });
    if (existingAdmin) {
        return res.status(400).json({
            success: false,
            message: 'Phone number already registered',
            data: null,
        });
    }

    let assignedRole = 'ADMIN';
    if (role === 'SUPER_ADMIN') {
        if (req.admin && req.admin.role === 'SUPER_ADMIN') {
            assignedRole = 'SUPER_ADMIN';
        } else {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to create SUPER_ADMIN role',
                data: null,
            });
        }
    }

    // Create admin - role is dynamic, and password hashed via pre-save hook
    const admin = await Admin.create({
        name,
        phone,
        password,
        role: assignedRole,
        shopName: shopName || '',
        fathersName: fathersName || '',
        villageCity: villageCity || '',
        gstin: gstin || '',
    });

    const sanitizedAdmin = admin.toObject();
    delete sanitizedAdmin.password;

    res.status(201).json({
        success: true,
        message: 'Sub-admin created successfully',
        data: sanitizedAdmin,
    });
});

// @desc    Get all sub-admins (paginated)
// @route   GET /api/super-admin/admins
// @access  Private/SuperAdmin
const getAdmins = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    const filter = { role: 'ADMIN' };

    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search.trim(), 'i');
        filter.$or = [
            { name: searchRegex },
            { phone: searchRegex },
            { shopName: searchRegex },
        ];
    }

    const [results, totalCount] = await Promise.all([
        Admin.find(filter).select('-password').skip(skip).limit(limit).lean(),
        Admin.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
        success: true,
        message: 'Admins fetched successfully',
        data: {
            results,
            totalPages,
            currentPage: page,
            totalCount,
        },
    });
});

// @desc    Toggle admin active status (activate/deactivate)
// @route   PUT /api/super-admin/toggle-status/:id
// @access  Private/SuperAdmin
const toggleStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (id === String(req.admin._id)) {
        return res.status(400).json({
            success: false,
            message: 'You cannot deactivate your own account',
            data: null,
        });
    }

    const admin = await Admin.findById(id);

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: 'Admin account not found',
            data: null,
        });
    }

    admin.isActive = !admin.isActive;
    await admin.save();

    const sanitizedAdmin = admin.toObject();
    delete sanitizedAdmin.password;

    res.status(200).json({
        success: true,
        message: `Admin account has been ${admin.isActive ? 'activated' : 'deactivated'}`,
        data: sanitizedAdmin,
    });
});

module.exports = {
    addAdmin,
    getAdmins,
    toggleStatus,
};
