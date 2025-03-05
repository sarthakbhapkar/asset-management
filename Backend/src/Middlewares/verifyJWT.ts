import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface User {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(403).json({ message: 'Access denied. No token provided.' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ message: 'Invalid token.' });
        }

        req.user = user as User;
        next();
    });
};

export default authenticateToken;
