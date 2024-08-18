import express, { RequestHandler } from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // This is for forms only

app.listen(8000, () => {
    console.log('The app is running on site http://localhost:8000');
});