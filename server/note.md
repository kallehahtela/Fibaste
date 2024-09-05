## Auth Routes

```
authRouter.post('/sign-up');
authRouter.post('/verify');
authRouter.post('/sign-in');
authRouter.post('/refresh-token');
authRouter.post('/sign-out');
authRouter.get('/profile');
authRouter.get('/profile/:id');
authRouter.post('/verify-token');
authRouter.post('/update-avatar');
authRouter.post('/update-profile');
authRouter.post('/forget-pass');
authRouter.post('/verify-pass-reset-token');
authRouter.post('/reset-pass');
```

- `/sign-up`
1. Read incoming data like: name, email, password
2. Validate if the ata is ok or not
3. Send error if not
4. Check if we already have an account with same user.
5. Send error if yes otherwise create new account and save user inside DB
6. Generate and Store verification token.
7. Send verification link with token to register email
8. Send message back to check email

- `/verify`
1. Read incoming data like: id and token
2. Find the token inside DB (using owner id).
3. Send error if token not found.
4. Check if the token is valid or not (because we have the encrypted value).
5. If not valid send error otherwise update user is verified.
6. Remove token from database.
7. Send success message.

- `/sign-in`
1. Read incoming data like: email and password
2. Find user with the provided email.
3. Send error if user not found.
4. Check if the password is valid or not (because password is in encrypted form).
5. If not valid send error otherwise generate access & refresh token.
6. Store refresh token inside DB.
7. Send both tokens to user.

- `/is-auth`
1. Read authorization header.
2. See if we have the token.
3. Send error if there is no token.
4. Verify the token (we have to use jwt.verify).
5. Take out the user id from token (we will use it as payload).
6. Check if we have the user with this id.
7. Send error if not.
8. Attach user profile inside req object.
9. Call `next` function.
10. Handle error for expired tokens.

- `/verify-token`
1. Check if user is authenticated or not
2. Remove previous token if any
3. Create/store new token and send response back
   
- `/refresh-token`
1. Read and verify refresh token.
2. Find user with payload.id and refresh token.
3. If the refresh token is valid and no user found, token is compromised.
4. Remove all the previous tokens and send error response.
5. If the token is valid and user found create new refresh and access token.
6. Remove previous token, update user and send new tokens.

- `/sign-out`
1. Remove the refresh token