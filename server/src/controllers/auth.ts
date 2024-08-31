import { RequestHandler } from "express";
import UserModel from "src/models/user";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import AuthVerificationTokenModel from "src/models/authVerificationToken";
import { sendErrorRes } from "src/utils/helper";

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
    const link = `http://localhost:8000/verify?id=${user._id}&token=${token}`;

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "a6ce5899c54285",
            pass: "b9c1a1efeff7b4"
        }
    });

    // this is just for testing
    // need to change to Email Sending later rather than Email Testing
    await transport.sendMail({
        from: 'verification@fibaste.com',
        to: user.email, // khahtela@gmail.com
        html: `<h1>Please click on <a href='${link}'>this link</a> to verify your email.</h1>`,
    });

    // Send message back to check email
    res.json({ message: 'Please check your inbox.' });
};