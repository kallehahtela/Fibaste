import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import UserModel from "src/models/user";
import PasswordResetTokenModel from "src/models/passwordResetToken";

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

const JWT_SECRET = process.env.JWT_SECRET!;

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
        const payload = jwt.verify(token, JWT_SECRET) as { id: string };

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

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
    // Read token and id.
    const { id, token } = req.body;

    // Find token inside database with owner id.
    const resetPassToken = await PasswordResetTokenModel.findOne({ owner: id });

    // If there is no token send error.
    if (!resetPassToken) return sendErrorRes(res, 'Unauthorized request, invalid token', 403);

    // Else compare token with encrypted value.
    const matched = await resetPassToken.compareToken(token);

    // If not matched send error.
    if (!matched) return sendErrorRes(res, 'Unauthorized request, invalid token', 403);

    // Else call next function.
    next();
};

