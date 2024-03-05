
const express = require('express');
const cors = require('cors');


// Create an app
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.contentType('application/json');
    res.redirect('https://dwellow.ca');
});

app.get('/api/health', (req, res) => {
    res.send("Server is online");
});

app.post('/api/account', (req, res) => {
    const { email, token } = req.body;

    console.log(email, token);

    // TODO Add the database information to register

    res.send("Account created", email, token);
});

app.post('/api/login', (req, res) => {
    res.send("Logged in");

    // TODO Add the database information to login
});

const PORT = 8080; // In docker this runs on port 23450

app.listen(PORT);
console.log(`Running on port ${PORT}`);

