import express from 'express';

const app = express()

// listening the home route
app.get('/', (req, res) => {
    res.json({ message: 'This message is coming from the server' });
});


app.listen(8000, () => {
    console.log('The app is running on site http://localhost:8000');
});