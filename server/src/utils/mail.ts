import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "a6ce5899c54285",
        pass: "b9c1a1efeff7b4"
    }
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

const mail = {
    sendVerification
};

export default mail;