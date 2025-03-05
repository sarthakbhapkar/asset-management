"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            res.status(403).send('Access denied. No role found.');
            return;
        }
        const userRole = req.user.role;
        if (!roles.includes(userRole)) {
            res.status(403).send('Access denied. You do not have the required role.');
            return;
        }
        next();
    };
};
exports.default = authorizeRole;
