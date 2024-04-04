
const express = require('express');
const cors = require('cors');
const { generateCode, sendCodeByEmail } = require('./helper.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const { checkEmail, createAccount, getUser, deleteUser, updateUser } = require('./connector.js')

// Create an app
const app = express();
const specs = swaggerJsdoc(options);


app.use(cors());
app.use(express.json());

// Server System Routes ------------------------------------------------------

app.get('/', (req, res) => {
    res.redirect('https://dwellow.ca');
});

app.get('/health', (req, res) => {
    res.send("Server is online");
});


// Account Routes ------------------------------------------------------------

app.get('/account/:id', async (req, res) => {
    console.log("Getting account information");
    const { id } = req.params;

    const decoded = jwt.decode(token, { complete: true });

    const user = await getUser(decoded);

    if (user != null) {
        if (user.recordset[0].user_id != Number(id)) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        else {
            res.status(200).json(user.recordset);
        }
    }
    else {
        res.status(400).json({ message: 'No user found with id' + id });
    }
});

app.put('/account/:id', async (req, res) => {
    console.log("Updating account information");

    const { id } = req.params;
    const { email, token, userType, fullName, phoneNumber } = req.body;
    // const { token } = req.headers;
    // we probably want to check what user is currently logged in to update an account
    // i.e. anyone can update their own but admins can update any tenant

    const decoded = jwt.decode(token, { complete: true });

    const user = await getUser(decoded);

    if (user != null) {
        if (user.recordset[0].user_id != Number(id)) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        else {
            if (userType == 'admin' || userType == 'tenant') {
                const updated = await updateUser(email, decoded, userType, fullName, phoneNumber);
                if (updated) {
                    res.status(200).json({ message: 'Account updated' });
                }
                else {
                    res.status(400).json({ message: 'Error updated user ' + id });
                }
            }
            else {
                res.status(400).json({ message: 'Invalid user role (admin or tenant)' });
            }
        }
    }
    else {
        res.status(400).json({ message: 'No user found with id ' + id });
    }
});

app.delete('/account/:id', async (req, res) => {
    console.log("Deleting account information");
    const { id } = req.params;
    // const { token } = req.headers;
    // we probably want to check what user is currently logged in to delete an account
    // i.e. anyone can delete their own but admins can delete any tenant

    const decoded = jwt.decode(token, { complete: true });

    const user = await getUser(decoded);

    if (user != null) {
        if (user.recordset[0].user_id != Number(id)) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        else {
            const deleted = await deleteUser(decoded);
            if (deleted) {
                res.status(200).json({ message: 'Account deleted' });
            }
            else {
                res.status(400).json({ message: 'Error deleting user' + id });
            }
        }
    }
    else {
        res.status(400).json({ message: 'No user found with id ' + id });
    }
});

app.post('/account', async (req, res) => {
    console.log("Creating account");

    const { email, token, userType, fullName, phoneNumber } = req.body;
    try {
        const decoded = jwt.decode(token, { complete: true });
        console.log(decoded)
        const user_id = decoded.payload.user_id;

        const emailExists = await checkEmail(email);

        if (emailExists) {
            res.status(400).json({ message: 'Email already exists' });
        }
        else {

            if (userType == 'admin' || userType == 'tenant') {
                const result = await createAccount(email, user_id, userType, fullName, phoneNumber);
                res.status(200).json({ message: 'Account Created' });
            }
            else {
                res.status(400).json({ message: 'Invalid user role (admin or tenant)' });
            }
        }
    } catch (error) {
        //error, will just display the sql error thats recieved
        console.error('Error in account creation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login Routes --------------------------------------------------------------

app.post('/login', async (req, res) => {
    console.log("Logging into account");
    const { email, token } = req.body;

    const decoded = jwt.decode(token, { complete: true });

    console.log(token)
    console.log("decoded:")
    console.log(decoded)

    const user = await getUser(decoded.payload.user_id);

    if (user != null) {
        res.status(200).json({ message: 'Logged ' });
    }
    else {
        res.status(400).json({ message: 'No user found' });
    }

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

