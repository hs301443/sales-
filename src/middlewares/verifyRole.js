import { ForbiddenError } from "../Errors/forbiddenError.js";

export const verifyRole = (...roles) => {    
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)) {
            return next(new ForbiddenError("You don't have permission to perform this action"));
        }
        next();
    }
}