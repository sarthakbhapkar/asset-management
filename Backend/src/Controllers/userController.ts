import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {sendEmail} from '../nodeMailer';
import {LoginUser, PostUser, SendMail, UpdateUser} from "../Interfaces/interface";
import {
    checkUser as checkUserModel,
    deleteUser as deleteUserModel,
    forgotPassword as forgotPasswordModel,
    getAllAssets as getAllAssetsModel,
    getCurrentAssets as getAllCurrentAssetsModel,
    getUserCurrentAssetsByType,
    getUsers as getUsersModel,
    loginUser as loginUserModel,
    postUser as postUserModel,
    updateUser as updateUserModel
} from '../Models/userModel';

dotenv.config();

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsersModel();
        res.status(200).json(users.rows);
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch users', details: err});
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (!id) {
        res.status(404).json({error: 'Please enter User-id'});
        return;
    }
    try {
        const user = await getUsersModel(id);

        if (user.rows.length > 0) {
            res.status(200).json(user.rows[0]);
        } else {
            res.status(404).json({error: 'User not found'});
        }
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch user', details: err});
    }
};

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const postUser = async (req: Request, res: Response): Promise<void> => {
    const {firstName, lastName, email, password, seat_n}: PostUser = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.status(404).json({error: 'Please fill all the fields'});
        return;
    }
    if (!isValidEmail(email)) {
        res.status(400).json({error: 'Please provide a valid email address'});
        return;
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const users = await postUserModel(firstName, lastName, email, hashedPassword, seat_n);
        res.status(200).json({message: 'User Added Successfully'});
    } catch (err) {
        res.status(500).json({error: 'Failed to create user', details: err});
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const {firstName, lastName, email}: UpdateUser = req.body;
    const userId = parseInt(req.params.id, 10);
    if (!firstName || !lastName || !email || !userId) {
        res.status(404).json({error: 'Please fill all the fields'});
        return;
    }
    try {
        const user = await getUsersModel(userId);
        if (user.rows.length > 0) {
            const users = await updateUserModel(firstName, lastName, email, userId);
        }
        res.status(200).json({message: 'User updated Successfully'});
    } catch (err) {
        res.status(500).json({error: 'Failed to update user', details: err});
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.body.userId;
    if (!userId) {
        res.status(404).json({error: 'Please enter user-id'});
        return;
    }
    try {
        const user = await getUsersModel(userId);
        if (user.rows.length > 0 && user.rows[0].role !== 'admin') {
            await deleteUserModel(userId);
            res.status(200).json({message: 'User Deleted Successfully'});
        } else {
            res.status(401).json({message: 'Can not delete Admin'});
        }
    } catch (err) {
        res.status(500).json({error: 'Failed to delete user', details: err});
    }
};

export const getUserCurrentAssets = async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const type = req.query.type;
    try {
        const assets = await getUserCurrentAssetsByType(parseInt(userId as string, 10), type as string);
        res.json(assets.rows);
    } catch (error) {
        console.error('Error retrieving user assets:', error);
        res.status(500).json({error: 'An error occurred while retrieving user assets'});
    }
};

export const getAllUsersAssetHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const assets = await getAllAssetsModel();
        res.json(assets.rows);
    } catch (error) {
        console.error('Error retrieving user assets:', error);
        res.status(500).json({error: 'An error occurred while retrieving user assets'});
    }
};

export const getAllUsersCurrentAssets = async (req: Request, res: Response): Promise<void> => {
    try {
        const assets = await getAllCurrentAssetsModel();
        res.status(200).send(assets.rows);
    } catch (error) {
        console.error('Error retrieving user assets:', error);
        res.status(500).json({error: 'An error occurred while retrieving user assets'});
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const {email, password}: LoginUser = req.body;

    if (!email || !password) {
        res.status(400).json({error: 'Please fill all the fields'});
        return;
    }

    try {
        const user = await loginUserModel(email);

        if (!user || !user.rows || user.rows.length === 0) {
            res.status(400).json({message: 'Invalid email or password'});
            return;
        }

        const userPassword = user.rows[0]?.password;

        if (!userPassword) {
            res.status(400).json({message: 'Invalid email or password'});
            return;
        }

        const validPassword = await bcrypt.compare(
            password.trim(),
            userPassword.trim()
        );

        if (!validPassword) {
            res.status(400).json({message: 'Invalid email or password'});
            return;
        }

        const jwtSecret = process.env.JWT_SECRET as string;

        if (!jwtSecret) {
            res.status(500).json({error: 'Internal server error: JWT secret is not defined'});
            return;
        }

        const token = jwt.sign(
            {
                id: user.rows[0].id,
                role: user.rows[0].role,
                first_name: user.rows[0].firstName,
                last_name: user.rows[0].lastName,
                email: user.rows[0].email
            },
            jwtSecret,
            {expiresIn: '3h'}
        );

        res.json({token, active: user.rows[0].active, role: user.rows[0].role, id: user.rows[0].id});
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({error: 'Login failed', details: err});
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const {email, password}: LoginUser = req.body;

    if (!email || !password) {
        res.status(400).json({error: 'Please fill all the fields'});
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const users = await forgotPasswordModel(email, hashedPassword);
        res.status(200).json('Password Changed Successfully');
    } catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({error: 'An error occurred while retrieving user'});
    }
};

const otpStore: { [key: string]: string } = {};

export const sendMail = async (req: Request, res: Response): Promise<void> => {
    const {email}: SendMail = req.body;
    if (!email) {
        res.status(400).json({error: 'Please fill all the fields'});
        return;
    }
    try {
        const users = await checkUserModel(email);
        if (users.rows.length > 0) {
            const otp = generateOTP(6);
            otpStore[email] = otp;
            await sendEmail(users.rows[0].email, 'OTP Verification', otp);
            res.status(200).json('Email Sent Successfully');
        } else {
            res.status(404).json({error: 'User not found'});
        }
    } catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({error: 'An error occurred while retrieving user'});
    }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const {email, otp}: { email: string, otp: string } = req.body;
    try {
        const storedOtp = otpStore[email];
        if (storedOtp === otp) {
            res.status(200).json({message: 'OTP verified successfully'});
            delete otpStore[email];
        } else {
            res.status(400).json({error: 'Invalid OTP'});
        }
    } catch (error) {
        console.error('Error verifying OTP', error);
        res.status(500).json({error: 'An error occurred while verifying OTP'});
    }
};

function generateOTP(length: number): string {
    let otp = '';
    const digits = '0123456789';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }
    return otp;
}