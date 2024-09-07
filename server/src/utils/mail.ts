import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASS,
    },
});

const sendVerification = async (email: string, link: string) => {
    // this is just for testing
    // need to change to Email Sending later rather than Email Testing
    await transport.sendMail({
        from: 'verification@fibaste.com',
        to: email, // khahtela@gmail.com
        html: `<h1>Please click on <a href='${link}'>this link</a> to verify your email.</h1>`,
    });
}

const sendPasswordResetLink = async (email: string, link: string) => {
    // this is just for testing
    // need to change to Email Sending later rather than Email Testing
    await transport.sendMail({
        from: 'security@fibaste.com',
        to: email, // khahtela@gmail.com
        html: `<h1>Please click on <a href='${link}'>this link</a> to update your password.</h1>`,
    });
}

const mail = {
    sendVerification,
    sendPasswordResetLink,
};

export default mail;