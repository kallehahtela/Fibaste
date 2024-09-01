import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import UserModel from "src/models/user";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    verified: boolean;
};

declare global {
    namespace Express {
        interface Request {
            user: UserProfile;
        }
    }
}

export const isAuth: RequestHandler = async (req, res, next) => {
    try {
        // Read authorization header.
        const authToken = req.headers.authorization;

        // See if we have the token.
        // Send error if there is no token.
        if (!authToken) return sendErrorRes(res, 'Unauthorized request', 403);

        // Verify the token (we have to use jwt.verify).
        const token = authToken.split('Bearer ')[1]; // ['', 'eyJhbGciOiJIUzI1NiIsInR5cC...']

        // Take out the user id from token (we will use it as payload).
        const payload = jwt.verify(token, 'secret') as { id: string };

        // Check if we have the user with this id.
        const user = await UserModel.findById(payload.id)

        // Send error if not.
        if (!user) return sendErrorRes(res, 'Unauthorized request', 403);

        // Attach user profile inside req object.
        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            verified: user.verified,
        };

        // Call `next` function.
        next()
    } catch (error) {
        // Handle error for expired tokens.
        if (error instanceof TokenExpiredError) {
            sendErrorRes(res, 'Session expired!', 401);
        }

        if (error instanceof JsonWebTokenError) {
            sendErrorRes(res, 'Unauthorized access', 401);
        }

        next(error);
    };
};