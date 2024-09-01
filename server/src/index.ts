import 'express-async-errors';
import 'src/db';
import express from 'express';
import authRouter from 'routes/auth';

const app = express();

app.use(express.static('src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // This is for forms only

// API ROUTES
app.use('/auth', authRouter);

app.use(function (err, req, res, next) {
    res.status(500).json({ message: err.message });
} as express.ErrorRequestHandler);

app.listen(8000, () => {
    console.log('The app is running on site http://localhost:8000');
});