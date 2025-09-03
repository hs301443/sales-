import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken';

export const generateJWT = async (payload) => {

    const token = await jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY, 
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    return token;
}