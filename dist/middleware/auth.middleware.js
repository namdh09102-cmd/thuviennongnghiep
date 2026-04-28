"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const token_1 = require("../utils/token");
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
    try {
        const decoded = (0, token_1.verifyAccessToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Not authorized, token failed or expired',
            error: error.message
        });
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user?.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
exports.authorize = authorize;
