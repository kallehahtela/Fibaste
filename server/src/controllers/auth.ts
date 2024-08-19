import { RequestHandler } from "express";

export const createNewUser: RequestHandler = (req, res) => {
    /*
4. Check if we already have an account with same user.
5. Send error if yes otherwise create new account and save user inside DB
6. Generate and Store verification token.
7. Send verification link with token to register email
8. Send message back to check email
    */

    // Read incoming data like: name, email, password
    const { name, email, password } = req.body;

    // Validate if the data is ok or not
    // Send error if not
    if (!name) return res.status(422).json({ message: 'Name is missing!' });
    if (!email) return res.status(422).json({ message: 'Email is missing!' });
    if (!password) return res.status(422).json({ message: 'Password is missing!' });
    res.send('Ok!');
}