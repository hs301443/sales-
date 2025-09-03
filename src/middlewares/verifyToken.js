import dotenv from "dotenv";
dotenv.config();
import jwt  from 'jsonwebtoken';
import { UnauthorizedError } from '../Errors/unauthorizedError.js';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader) {
        
        return next(new UnauthorizedError('No token provided'));
    }

    const token = authHeader.split(' ')[1];
    try {

        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        next();

    } catch (err) {
        
        return next(new UnauthorizedError('Invalid token'));
    }   
    
}

