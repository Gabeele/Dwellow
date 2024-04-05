
const express = require('express');
const jwt = require('jsonwebtoken');

const { getUser, deleteUser, updateUser, createAccount, checkEmail } = require('../utils/connector.js');

const router = express.Router();
/**
 * @swagger
 * /account/{id}:
 *   get:
 *     description: Use to get account information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to get.
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response with user data.
 *       '400':
 *         description: No user found with id.
 *       '401':
 *         description: Unauthorized
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.user_id; // Assuming req.user is populated with user_id from decoded token

    try {
        const user = await getUser(userId);

        if (!user) {
            return res.status(400).json({ message: `No user found with id ${id}` });
        }

        if (user.recordset[0].user_id !== Number(id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.status(200).json(user.recordset);
    } catch (error) {
        console.error('Error getting account information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


/**
 * @swagger
 * /account/{id}:
 *   put:
 *     description: Update a user account.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: New email of the user.
 *               userType:
 *                 type: string
 *                 description: New type of the user (admin or tenant).
 *               fullName:
 *                 type: string
 *                 description: New full name of the user.
 *               phoneNumber:
 *                 type: string
 *                 description: New phone number of the user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Account updated successfully.
 *       '400':
 *         description: Error updating user or invalid user role.
 *       '401':
 *         description: Unauthorized attempt to update an account.
 *       '500':
 *         description: Internal server error.
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { email, userType, fullName, phoneNumber } = req.body;
    const userId = req.user.user_id; // Assuming req.user contains user_id from the decoded token

    try {
        // Validate user authorization (ensure the user is updating their own account or has admin privileges)
        const user = await getUser(userId);

        if (!user || user.recordset[0].user_id !== Number(id)) {
            return res.status(user ? 401 : 400).json({ message: user ? 'Unauthorized' : `No user found with id ${id}` });
        }

        // Optionally, validate userType or other fields as required
        if (userType && userType !== 'admin' && userType !== 'tenant') {
            return res.status(400).json({ message: 'Invalid user role (admin or tenant)' });
        }

        // Update the account
        const updated = await updateUser(email, userId, userType, fullName, phoneNumber);
        if (updated) {
            res.status(200).json({ message: 'Account updated successfully' });
        } else {
            res.status(400).json({ message: 'Error updating the account' });
        }
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /account/{id}:
 *   delete:
 *     description: Delete a user account.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to delete.
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Account deleted successfully.
 *       '400':
 *         description: No user found with the provided ID.
 *       '401':
 *         description: Unauthorized attempt to delete an account.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.user_id; // Assume req.user contains user_id

    try {
        // Fetch the user to verify existence and authorization
        const user = await getUser(userId);

        if (!user || user.recordset[0].user_id !== Number(id)) {
            return res.status(user ? 401 : 400).json({ message: user ? 'Unauthorized' : `No user found with id ${id}` });
        }

        // Delete the account
        const deleted = await deleteUser(userId);
        if (deleted) {
            res.status(200).json({ message: 'Account deleted successfully' });
        } else {
            res.status(400).json({ message: 'Error deleting the account' });
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /account:
 *   post:
 *     description: Create a new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               userType:
 *                 type: string
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Account created successfully.
 *       '400':
 *         description: Email already exists or invalid user role.
 *       '500':
 *         description: Internal Server Error
 */
router.post('/', async (req, res) => {
    const { email, userType, fullName, phoneNumber } = req.body;
    const userId = req.user.user_id; // Use userId from authenticated user

    try {
        const emailExists = await checkEmail(email);

        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (userType !== 'admin' && userType !== 'tenant') {
            return res.status(400).json({ message: 'Invalid user role (admin or tenant)' });
        }

        const result = await createAccount(email, userId, userType, fullName, phoneNumber);
        res.status(200).json({ message: 'Account Created', result });
    } catch (error) {
        console.error('Error in account creation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;