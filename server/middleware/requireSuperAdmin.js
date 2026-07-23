const requireSuperAdmin = (req, res, next) => {
    if (!req.admin) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no admin token verified',
            data: null,
        });
    }

    if (req.admin.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Super Admin role required',
            data: null,
        });
    }

    next();
};

module.exports = requireSuperAdmin;
