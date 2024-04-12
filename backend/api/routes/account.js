
const express = require('express');
const logger = require('../utils/logger');
const { getUser, deleteUser, updateUser, createAccount, checkEmail } = require('../utils/connector.js');
const router = express.Router();
/**
 * @swagger
 * /account:
 *   get:
 *     tags: [Account]
 *     summary: Get the current user's account information.
 *     description: Retrieves detailed information about the authenticated user's account.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The account information has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                   description: The user's ID.
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                   description: The user's email address.
 *                 userType:
 *                   type: string
 *                   example: "tenant"
 *                   description: The type of the user (e.g., admin, tenant).
 *                 fullName:
 *                   type: string
 *                   example: "John Doe"
 *                   description: The full name of the user.
 *                 phoneNumber:
 *                   type: string
 *                   example: "+1234567890"
 *                   description: The phone number of the user.
 *       400:
 *         description: No user found with the provided ID.
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       500:
 *         description: Internal server error. An unexpected error occurred.
 */
router.get('/', async (req, res) => {


    try {
        const id = req.user_id;
        //console.log (req);
        const user = await getUser(id);

        if (!user) {
            logger.warn(`Get Account: No user found with id ${id}`);
            return res.status(400).json({ message: `No user found with id ${id}` });
        }

        logger.info(`Get Account: User ${id} information accessed.`); // TODO: We should return the user infromation here as json or somehting. IDK what is returned back. (Also update the comments)
        res.status(200).json(user.recordset);
    } catch (error) {
        logger.error(`Error getting account information for user ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


/**
 * @swagger
 * /account:
 *   put:
 *     tags: [Account]
 *     summary: Update the current user's account information.
 *     description: Allows authenticated users to update their account information.
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: user
 *        description: The user object to update.
 *        schema:
 *          type: objects
 *          required: [email, userType, fullName, phoneNumber]
 *          properties:
 *            email:
 *              type: string
 *              description: The new email address of the user.
 *            userType:
 *              type: string
 *              description: The new type of the user (e.g., admin, tenant).
 *            fullName:
 *              type: string
 *              description: The full name of the user.
 *            phoneNumber:
 *              type: string
 *              description: The new phone number of the user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The account has been updated successfully.
 *       400:
 *         description: Bad request. Possible reasons include invalid input data or attempting to update to an already used email.
 *       401:
 *         description: Unauthorized. User is not authenticated or does not have permission to update the account.
 *       500:
 *         description: Internal server error. An unexpected error occurred.
 */
router.put('/', async (req, res) => {

    const { email, userType, fullName, phoneNumber } = req.body;
    const id = req.user_id;

    try {
        // Validate user authorization (ensure the user is updating their own account or has admin privileges)
        const user = await getUser(id);

        if (!user) {
            logger.warn(`Update Account: No user found with id ${id}`);
            return res.status(400).json({ message: `No user found with id ${id}` });
        }

        logger.info(`Update Account: User ${id} attempting update.`);

        // Update the account
        const updated = await updateUser(email, id, userType, fullName, phoneNumber);

        if (updated) {
            logger.info(`Update Account: User ${id} account updated.`);
            res.status(200).json({ message: 'Account updated successfully' });
        }
        else {
            logger.warn(`Update Account: Error updating user ${id} account.`);
            res.status(400).json({ message: 'Error updating user account' });
        }

    } catch (error) {
        logger.error(`Error updating account for user ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

/**
 * @swagger
 * /account:
 *   delete:
 *     tags: [Account]
 *     summary: Delete the current user's account.
 *     description: Permanently deletes the authenticated user's account. This action cannot be undone.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The account has been deleted successfully.
 *       400:
 *         description: No user found with the provided ID, or the user cannot be deleted (e.g., due to constraints).
 *       401:
 *         description: Unauthorized. The user is not authenticated or does not have permission to delete the account.
 *       500:
 *         description: Internal server error. An unexpected error occurred.
 */
router.delete('/', async (req, res) => {

    try {
        const id = req.user_id;
        const user = await getUser(id);

        if (!user) {
            logger.warn(`Delete Account: No user found with id ${id}`);
            return res.status(400).json({ message: `No user found with id ${id}` });
        }

        // TODO: Add a soft delete feature instead of hard delete

        logger.info(`Delete Account: User ${id} account deleted.`);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting account for user ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;