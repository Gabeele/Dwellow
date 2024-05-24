const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

const { getUserId, getUser } = require('../utils/connector.js');
const { decodeToken } = require('../utils/authenticate.js');
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user by their user ID and logs them in.
 *     tags: [Login]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged in"
 *       400:
 *         description: No user found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No user found"
 *       401:
 *         description: Unauthorized. Token missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No token provided. Provide a token in the header."
 */
router.post('/', async (req, res) => {
    //console.log('here');
    try {
        const token = req.headers['authorization'].split(' ')[0];
        const decodedToken = await decodeToken(token);
        req.token = decodedToken;

        //console.log(req.token);

        const id = await getUserId(req.token.user_id);

        const user = getUser(id);

        if (user != null) {
            logger.info(`User ${id} logged in successfully.`);
            res.status(200).json({ message: 'Logged in ' });
        } else {
            logger.warn(`Login attempt failed for user ID: ${id}. No user found.`);
            res.status(400).json({ message: 'No user found' });
        }
    } catch (error) {
        logger.error(`An error occurred during the login process for user ID: ${req.use_idr ? id : 'unknown'} - ${error.message}`);
        res.status(500).json({ message: 'An error occurred during the login process.' });
    }
});

module.exports = router;
