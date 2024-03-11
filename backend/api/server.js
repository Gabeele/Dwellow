
const express = require('express');
const cors = require('cors');
const { getUser, generateCode, sendCodeByEmail } = require('./helper.js');


// Create an app
const app = express();

app.use(cors());
app.use(express.json());

// Server System Routes ------------------------------------------------------

app.get('/', (req, res) => {
    res.contentType('application/json');
    res.redirect('https://dwellow.ca');
});

app.get('/health', (req, res) => {
    res.send("Server is online");
});

// Account Routes ------------------------------------------------------------

app.get('/account/:id', (req, res) => {
    console.log("Getting account information");
    const { id } = req.params;
    // const { token } = req.headers;
    const token = 1;
    const user = getUser(token);

    if (user.id !== Number(id)) {
        res.status(401).send("Unauthorized");
    }
    else {
        res.send("Account information");
    }

});

app.put('/account/:id', (req, res) => {
    console.log("Updating account information");
    const { id } = req.params;
    // const { token } = req.headers;
    const token = 1;
    const user = getUser(token);

    if (user.id !== Number(id)) {
        res.status(401).send("Unauthorized");
    }
    else {
        res.send("Account updated");
    }
});

app.delete('/account/:id', (req, res) => {
    console.log("Deleting account information");
    const { id } = req.params;
    // const { token } = req.headers;
    const token = 1;
    const user = getUser(token);

    if (user.id !== Number(id)) {
        res.status(401).send("Unauthorized");
    }
    else {
        res.send("Account deleted");
    }
});

app.post('/account', (req, res) => {
    const { email, token } = req.body;

    console.log(email, token);

    // TODO Add the database information to register

    res.send("Account created", email, token);
});

// Login Routes --------------------------------------------------------------

app.post('/login', (req, res) => {
    res.send("Logged in");

    // TODO Add the database information to login
});

// Invitation Routes ----------------------------------------------------------

app.get('/invitation/:id', (req, res) => {
    console.log("Getting invitation information");
    const { id } = req.params;
    // const { token } = req.headers;
    const token = 1;
    const user = getUser(token);

    if (user.id !== Number(id)) {
        res.status(401).send("Unauthorized");
    }
    else {
        // TODO make the assosication with the code and user in the database 
        res.send("Invitation information");
    }
});

app.post('/invitation', (req, res) => {
    // const { email, token } = req.body;
    // const user = getUser(token);

    const email = "abeee.s.gavin@icloud.com";

    const code = generateCode();

    sendCodeByEmail(email, code);

    // TODO make association with code and user in the database
    // Email the code to the user

    res.send("Invitation sent", email, code);
});

// Property Routes ------------------------------------------------------------

app.get('/properties', (req, res) => {
    console.log("Getting properties");
    // const { token } = req.headers;
    const token = 1;
    const user = getUser(token);

    // TODO get the properties from the database

    res.send("Properties");

});

app.get('/property/:id', (req, res) => {
    console.log("Getting property information");
    const { id } = req.params;
    // const { token } = req.headers;
    const token = 1;
    const user = getUser(token);

    // TODO get the property information from the database

    res.send("Property information");
});

app.delete('/property/:id', (req, res) => {
    console.log("Deleting property");
    const { id } = req.params;
    // const { token } = req.headers;
    const token = 1;
    const user = getUser(token);

    // TODO delete the property from the database

    res.send("Property deleted");
});

app.post('/property', (req, res) => {
    const { name, token } = req.body;
    const user = getUser(token);

    // TODO add the property to the database

    res.send("Property created", name);
});

app.put('/property/:id', (req, res) => {
    console.log("Updating property information");
    const { id } = req.params;
    const { name, token } = req.body;
    const user = getUser(token);

    // TODO update the property in the database

    res.send("Property updated", name);
});


const PORT = 8080; // In docker this runs on port 23450

app.listen(PORT);
console.log(`Running on port ${PORT}`);

