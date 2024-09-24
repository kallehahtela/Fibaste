import { RequestHandler } from "express";
import UserModel from "src/models/user";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import AuthVerificationTokenModel from "src/models/authVerificationToken";
import { sendErrorRes } from "src/utils/helper";
import jwt from 'jsonwebtoken';
import mail from "src/utils/mail";
import PasswordResetTokenModel from "src/models/passwordResetToken";
import { isValidObjectId } from "mongoose";
import cloudUploader from 'src/cloud/index';

const VERIFICATION_LINK = process.env.VERIFICATION_LINK;
const JWT_SECRET = process.env.JWT_SECRET!
const PASSWORD_RESET_LINK = process.env.PASSWORD_RESET_LINK;


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

    const payload = { id: user.id };
    const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1m'
    });
    const refreshToken = jwt.sign(payload, JWT_SECRET);

    // Store refresh token inside DB.
    if (!user.tokens) user.tokens = [refreshToken];
    else user.tokens.push(refreshToken);

    await user.save();

    // Send both tokens to user.
    res.json({
        profile: {
            id: user.id,
            email: user.email,
            name: user.name,
            verified: user.verified,
            avatar: user.avatar?.url,
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
    const payload = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
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
    const newAccessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: '15m'
    });
    const newRefreshToken = jwt.sign({ id: user._id }, JWT_SECRET);

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

export const generateForgetPassLink: RequestHandler = async (req, res) => {
    // Ask for users email.
    const { email } = req.body;

    // Find user with the given email.
    const user = await UserModel.findOne({ email });

    // Send error if there is no user.
    if (!user) return sendErrorRes(res, 'Account not found!', 404);

    // Else generate password reset token (first remove if there is any).
    // Reset Token
    await PasswordResetTokenModel.findOneAndDelete({ owner: user._id });

    // Create new token
    const token = crypto.randomBytes(36).toString('hex');
    await PasswordResetTokenModel.create({ owner: user._id, token });

    // Send the link to user's email
    const passResetLink = `${PASSWORD_RESET_LINK}?id=${user._id}&token=${token}`;
    await mail.sendPasswordResetLink(user.email, passResetLink);

    // Send response back
    res.json({ message: 'Please check your email!' });

};

export const grantValid: RequestHandler = async (req, res) => {
    res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
    // Read user id, reset pass token and password.
    // Validate all these things.

    // If valid find user with the given id.
    const { id, password } = req.body;

    const user = await UserModel.findById(id);
    if (!user) return sendErrorRes(res, 'Unauthorized access!', 403);

    // Check if user is using same password.
    const matched = await user.comparePassword(password);

    // If there is no user or user is using the same password send error res.
    if (matched) return sendErrorRes(res, 'The new password should be different!', 422);

    // Else update new password.
    user.password = password;
    await user.save();

    // Remove password reset token.
    await PasswordResetTokenModel.findOneAndDelete({ owner: user._id });

    // Send confirmation email.
    await mail.sendPasswordUpdateMessage(user.email);

    // Send response back.
    res.json({ message: 'Password reset successfully.' });
};

export const updateProfile: RequestHandler = async (req, res) => {
    // User must be logged in (authenticated).
    // Name must be valid.
    const { name } = req.body;
    if (typeof name !== 'string' || name.trim().length < 3) {
        return sendErrorRes(res, 'Invalid name!', 422);
    }

    // Find user and update the name.
    await UserModel.findByIdAndUpdate(req.user.id, { name });

    // Send new profile back.
    res.json({ profile: { ...req.user, name } });
};

export const updateAvatar: RequestHandler = async (req, res) => {
    const { avatar } = req.files;

    // Check if there is a multiple files
    if (Array.isArray(avatar)) {
        return sendErrorRes(res, 'Multiple files are not allowed!', 422);
    }

    // File type must be image.
    if (!avatar.mimetype?.startsWith('image')) {
        return sendErrorRes(res, 'Invalid image file!', 422);
    }

    // Check if user already have avatar or not.
    const user = await UserModel.findById(req.user.id);
    if (!user) {
        return sendErrorRes(res, 'User not found!', 404);
    }

    // If yes remove the old avatar.
    if (user.avatar?.id) {
        // remove avatar file
        await cloudUploader.destroy(user.avatar.id);
    }

    // Upload new avatar
    const { secure_url: url, public_id: id } = await cloudUploader.upload(
        avatar.filepath,
        {
            width: 300,
            height: 300,
            crop: 'thumb',
            gravity: 'face',
        }
    );
    user.avatar = { url, id };
    await user.save();

    // Update the user
    res.json({
        profile: {
            ...req.user,
            avatar: user.avatar.url
        }
    });
};

export const sendPublicProfile: RequestHandler = async (req, res) => {
    const profileId = req.params.id;
    if (!isValidObjectId(profileId)) {
        return sendErrorRes(res, 'Invalid profile id!', 422);
    }

    const user = await UserModel.findById(profileId);
    if (!user) {
        return sendErrorRes(res, 'Profile not found!', 422);
    }

    res.json({
        profile: {
            id: user._id,
            name: user.name,
            avatar: user.avatar?.url,
        }
    });
};