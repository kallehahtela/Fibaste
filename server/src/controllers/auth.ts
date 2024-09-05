import { RequestHandler } from "express";
import UserModel from "src/models/user";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import AuthVerificationTokenModel from "src/models/authVerificationToken";
import { sendErrorRes } from "src/utils/helper";
import jwt from 'jsonwebtoken';
import mail from "src/utils/mail";

const VERIFICATION_LINK = process.env.VERIFICATION_LINK;
const JWT_SECRET = process.env.JWT_SECRET!;

export const createNewUser: RequestHandler = async (req, res) => {

    // Read incoming data like: name, email, password
    const { name, email, password } = req.body;

    // Validate if the data is ok or not
    // Send error if not
    if (!name) return sendErrorRes(res, 'Name is missing!', 422)
    if (!email) return sendErrorRes(res, 'Email is missing!', 422)
    if (!password) return sendErrorRes(res, 'Password is missing!', 422)

    // Check if we already have an account with same user.
    const existingUser = await UserModel.findOne({ email });

    // Send error if yes otherwise create new account and save user inside DB
    if (existingUser) return sendErrorRes(res, 'Unauthorized request, email is already in use!', 401)

    const user = await UserModel.create({ name, email, password });

    // Generate and Store verification token.
    // To test in CMD 1. type node 2. const crypto = require('crypto') 3. crypto.randomBytes(36).toString('hex'); 
    const token = crypto.randomBytes(36).toString('hex');
    await AuthVerificationTokenModel.create({ owner: user._id, token });

    // Send verification link with token to register email
    const link = `${VERIFICATION_LINK}?id=${user._id}&token=${token}`;

    await mail.sendVerification(user.email, link)

    // Send message back to check email
    res.json({ message: 'Please check your inbox.' });
};

export const verifyEmail: RequestHandler = async (req, res) => {
    // Read incoming data like: id and token
    const { id, token } = req.body;

    // Find the token inside DB (using owner id).
    const authToken = await AuthVerificationTokenModel.findOne({ owner: id });

    // Send error if token not found.
    if (!authToken) return sendErrorRes(res, 'Unauthorized request', 403);

    // Check if the token is valid or not (because we have the encrypted value).
    const isMatched = await authToken.compareToken(token);

    // If not valid send error otherwise update user is verified.
    if (!isMatched) return sendErrorRes(res, 'Unauthorized request, invalid token', 403);
    await UserModel.findByIdAndUpdate(id, { verified: true });

    // Remove token from database.
    await AuthVerificationTokenModel.findByIdAndDelete(authToken._id);

    // Send success message.
    res.json({ message: 'Thanks for joining Fibaste, your email is now verified.' });
};

export const generateVerificationLink: RequestHandler = async (req, res) => {
    // Check if user is authenticated or not.
    const { id } = req.user;
    const token = crypto.randomBytes(36).toString('hex');

    // Remove previous token if any.
    await AuthVerificationTokenModel.findOneAndDelete({ owner: id });

    // Create/store new token.
    await AuthVerificationTokenModel.create({ owner: id, token });

    // Send link inside users email.
    const link = `${VERIFICATION_LINK}?id=${id}&token=${token}`;
    await mail.sendVerification(req.user.email, link)

    // Send response back.
    res.json({ message: 'Please check your inbox' });
};

export const signIn: RequestHandler = async (req, res) => {
    // Read incoming data like: email and password
    const { email, password } = req.body;

    // Find user with the provided email.
    const user = await UserModel.findOne({ email });

    // Send error if user not found.
    if (!user) return sendErrorRes(res, 'Email or Password is incorrect!', 403);

    // Check if the password is valid or not (because password is in encrypted form).
    const isMatched = await user.comparePassword(password);

    // If not valid send error otherwise generate access & refresh token.
    if (!isMatched) return sendErrorRes(res, 'Email or Password is incorrect!', 403);

    const payload = { id: user._id };
    const accessToken = jwt.sign(payload, 'JWT_SECRET', {
        expiresIn: '15m'
    });
    const refreshToken = jwt.sign(payload, 'JWT_SECRET');

    // Store refresh token inside DB.
    if (!user.tokens) user.tokens = [refreshToken];
    else user.tokens.push(refreshToken);

    await user.save();

    // Send both tokens to user.
    res.json({
        profile: {
            id: user._id,
            email: user.email,
            name: user.name,
            verified: user.verified,
        },
        tokens: { refresh: refreshToken, access: accessToken }
    });
};

export const sendProfile: RequestHandler = async (req, res) => {
    res.json({
        profile: req.user,
    });
};

export const grantAccessToken: RequestHandler = async (req, res) => {
    // Read and verify refresh token.
    const { refreshToken } = req.body;
    if (!refreshToken) return sendErrorRes(res, 'Unauthorized request!', 403);

    // Find user with payload.id and refresh token.
    const payload = jwt.verify(refreshToken, 'JWT_SECRET') as { id: string };
    if (!payload.id) return sendErrorRes(res, 'Unauthorized request!', 401);

    const user = await UserModel.findOne({
        _id: payload.id,
        tokens: refreshToken,
    });

    // If the refresh token is valid and no user found, token is compromised.
    if (!user) {
        // user is compromised, remove all the previous tokens
        await UserModel.findByIdAndUpdate(payload.id, { tokens: [] });
        // Send error response.
        return sendErrorRes(res, 'Unauthorized request!', 401);

    }

    // If the token is valid and user found create new refresh and access token.
    const newAccessToken = jwt.sign({ id: user._id }, 'JWT_SECRET', {
        expiresIn: '15m'
    });
    const newRefreshToken = jwt.sign({ id: user._id }, 'JWT_SECRET');

    // Remove previous token, update user and send new tokens.
    user.tokens = user.tokens.filter((t) => t !== refreshToken);
    user.tokens.push(newRefreshToken);
    await user.save();

    res.json({
        tokens: { refresh: newRefreshToken, access: newAccessToken },
    });
};

export const signOut: RequestHandler = async (req, res) => {
    // Remove the refresh token
    const { refreshToken } = req.body;
    const user = await UserModel.findOne({
        _id: req.user.id,
        tokens: refreshToken,
    });
    if (!user) return sendErrorRes(res, 'Unauthorized request, user not found!', 403);

    const newTokens = user.tokens.filter((t) => t !== refreshToken);
    user.tokens = newTokens;
    await user.save();

    res.send();
};