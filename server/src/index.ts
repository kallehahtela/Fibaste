import express from 'express';

const app = express()

// listening the home route
app.get('/', (req, res) => {
    res.json({ message: 'This message is coming from the server' });
});

app.post('/', (req, res) => {
    req.on('data', (chunk) => {
        console.log(JSON.parse(chunk));
        console.log(req.body);
        res.json({ message: 'This message is coming from the post request' })
    });
});


app.listen(8000, () => {
    console.log('The app is running on site http://localhost:8000');
});