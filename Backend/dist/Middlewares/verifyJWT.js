"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(403).json({ message: 'Access denied. No token provided.' });
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ message: 'Invalid token.' });
        }
        req.user = user;
        next();
    });
};
exports.default = authenticateToken;
