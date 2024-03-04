
const express = require('express');

//Create an app
const app = express();

app.get('/', (req, res) => {
    res.contentType('application/json');

    res.redirect('https://dwellow.ca');


});

app.get('/api/health', (req, res) => {
    res.send("Server is online");
});


app.post('/api/account', (req, res) => {
    res.send("Account Created");
    // TODO: Add the database information to create an account
    // This would involve adding a user to a database
    // Getting the firebase token and adding it to the database
});

app.post('/api/login', (req, res) => {
    res.send("Logged in");

    // TODO Add the database information to login
});


const PORT = 8080; // In docker this runs on port 23450

app.listen(PORT);
console.log(`Running on port ${PORT}`);
