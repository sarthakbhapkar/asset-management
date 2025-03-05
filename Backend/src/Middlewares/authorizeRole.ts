import { Request, Response, NextFunction, RequestHandler } from 'express';

const authorizeRole = (roles: string[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
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

export default authorizeRole;
