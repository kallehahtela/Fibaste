import 'dotenv/config';
import 'express-async-errors';
import 'src/db';
import express from 'express';
import authRouter from 'routes/auth';
import productRouter from 'routes/product';
import { sendErrorRes } from './utils/helper';

const app = express();

app.use(express.static('src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // This is for forms only

// API ROUTES
app.use('/auth', authRouter);
app.use('/product', productRouter);

// Error handling middleware
app.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ message: err.message });
} as express.ErrorRequestHandler);

// Catch-all route for 404 errors
app.use('*', (req, res) => {
    sendErrorRes(res, 'Not Found!', 404);
});

app.listen(8000, () => {
    console.log('The app is running on site http://localhost:8000');
});