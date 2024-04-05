
const express = require('express');
const jwt = require('jsonwebtoken');

const { getUser, deleteUser, updateUser, createAccount, checkEmail } = require('../utils/connector.js');

const router = express.Router();

/**
 * @swagger
 * /account/{id}:
 *  get:
 *      description: Use to get account information
 *      parameters:
 *          - name: id
 *          - token: token
 *            in: headers
 *      responses:
 *          '200':
 *              description: A successful response
 *          '400':
 *              description: No user found with id
 *          '401':
 *              description: Unauthorized
 */
router.get('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

router.post('/', async (req, res) => {
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

module.exports = router;