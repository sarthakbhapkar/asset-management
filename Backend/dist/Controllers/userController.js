"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.sendMail = exports.forgotPassword = exports.loginUser = exports.getAllUsersCurrentAssets = exports.getAllUsersAssetHistory = exports.getUserCurrentAssets = exports.deleteUser = exports.updateUser = exports.postUser = exports.getUserById = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodeMailer_1 = require("../nodeMailer");
const userModel_1 = require("../Models/userModel");
dotenv_1.default.config();
const getAllUsers = async (req, res) => {
    try {
        const users = await (0, userModel_1.getUsers)();
        res.status(200).json(users.rows);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch users', details: err });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) {
        res.status(404).json({ error: 'Please enter User-id' });
        return;
    }
    try {
        const user = await (0, userModel_1.getUsers)(id);
        if (user.rows.length > 0) {
            res.status(200).json(user.rows[0]);
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch user', details: err });
    }
};
exports.getUserById = getUserById;
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const postUser = async (req, res) => {
    const { firstName, lastName, email, password, seat_n } = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.status(404).json({ error: 'Please fill all the fields' });
        return;
    }
    if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Please provide a valid email address' });
        return;
    }
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const users = await (0, userModel_1.postUser)(firstName, lastName, email, hashedPassword, seat_n);
        res.status(200).json({ message: 'User Added Successfully' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create user', details: err });
    }
};
exports.postUser = postUser;
const updateUser = async (req, res) => {
    const { firstName, lastName, email } = req.body;
    const userId = parseInt(req.params.id, 10);
    if (!firstName || !lastName || !email || !userId) {
        res.status(404).json({ error: 'Please fill all the fields' });
        return;
    }
    try {
        const user = await (0, userModel_1.getUsers)(userId);
        if (user.rows.length > 0) {
            const users = await (0, userModel_1.updateUser)(firstName, lastName, email, userId);
        }
        res.status(200).json({ message: 'User updated Successfully' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update user', details: err });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const userId = req.body.userId;
    if (!userId) {
        res.status(404).json({ error: 'Please enter user-id' });
        return;
    }
    try {
        const user = await (0, userModel_1.getUsers)(userId);
        if (user.rows.length > 0 && user.rows[0].role !== 'admin') {
            await (0, userModel_1.deleteUser)(userId);
            res.status(200).json({ message: 'User Deleted Successfully' });
        }
        else {
            res.status(401).json({ message: 'Can not delete Admin' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete user', details: err });
    }
};
exports.deleteUser = deleteUser;
const getUserCurrentAssets = async (req, res) => {
    const userId = req.query.userId;
    const type = req.query.type;
    try {
        const assets = await (0, userModel_1.getUserCurrentAssetsByType)(parseInt(userId, 10), type);
        res.json(assets.rows);
    }
    catch (error) {
        console.error('Error retrieving user assets:', error);
        res.status(500).json({ error: 'An error occurred while retrieving user assets' });
    }
};
exports.getUserCurrentAssets = getUserCurrentAssets;
const getAllUsersAssetHistory = async (req, res) => {
    try {
        const assets = await (0, userModel_1.getAllAssets)();
        res.json(assets.rows);
    }
    catch (error) {
        console.error('Error retrieving user assets:', error);
        res.status(500).json({ error: 'An error occurred while retrieving user assets' });
    }
};
exports.getAllUsersAssetHistory = getAllUsersAssetHistory;
const getAllUsersCurrentAssets = async (req, res) => {
    try {
        const assets = await (0, userModel_1.getCurrentAssets)();
        res.status(200).send(assets.rows);
    }
    catch (error) {
        console.error('Error retrieving user assets:', error);
        res.status(500).json({ error: 'An error occurred while retrieving user assets' });
    }
};
exports.getAllUsersCurrentAssets = getAllUsersCurrentAssets;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Please fill all the fields' });
        return;
    }
    try {
        const user = await (0, userModel_1.loginUser)(email);
        if (!user || !user.rows || user.rows.length === 0) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        const userPassword = user.rows[0]?.password;
        if (!userPassword) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        const validPassword = await bcrypt_1.default.compare(password.trim(), userPassword.trim());
        if (!validPassword) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ error: 'Internal server error: JWT secret is not defined' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.rows[0].id,
            role: user.rows[0].role,
            first_name: user.rows[0].firstName,
            last_name: user.rows[0].lastName,
            email: user.rows[0].email
        }, jwtSecret, { expiresIn: '3h' });
        res.json({ token, active: user.rows[0].active, role: user.rows[0].role, id: user.rows[0].id });
    }
    catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Login failed', details: err });
    }
};
exports.loginUser = loginUser;
const forgotPassword = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Please fill all the fields' });
        return;
    }
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const users = await (0, userModel_1.forgotPassword)(email, hashedPassword);
        res.status(200).json('Password Changed Successfully');
    }
    catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'An error occurred while retrieving user' });
    }
};
exports.forgotPassword = forgotPassword;
const otpStore = {};
const sendMail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: 'Please fill all the fields' });
        return;
    }
    try {
        const users = await (0, userModel_1.checkUser)(email);
        if (users.rows.length > 0) {
            const otp = generateOTP(6);
            otpStore[email] = otp;
            await (0, nodeMailer_1.sendEmail)(users.rows[0].email, 'OTP Verification', otp);
            res.status(200).json('Email Sent Successfully');
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'An error occurred while retrieving user' });
    }
};
exports.sendMail = sendMail;
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const storedOtp = otpStore[email];
        if (storedOtp === otp) {
            res.status(200).json({ message: 'OTP verified successfully' });
            delete otpStore[email];
        }
        else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    }
    catch (error) {
        console.error('Error verifying OTP', error);
        res.status(500).json({ error: 'An error occurred while verifying OTP' });
    }
};
exports.verifyOtp = verifyOtp;
function generateOTP(length) {
    let otp = '';
    const digits = '0123456789';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }
    return otp;
}
