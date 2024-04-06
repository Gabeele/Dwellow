require('dotenv').config();
const getRole = require('./connector');
const logger = require('./logger');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FB_PROJECT_ID,
        privateKey: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FB_CLIENT_EMAIL,
    })
});

const authenticate = async (req, res, next) => {
    // Correctly extract the token from the Authorization header
    try {
        const token = req.headers['authorization'].split(' ')[1];

        if (!token) {
            logger.info('No token provided.');
            return res.status(401).send({ error: 'No token provided. Provide a token in the header.' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        req.role = getRole(req.user.user_id);   // Adds a role to the request object

        logger.info(`User ${req.user.user_id} authenticated.`);
        next();
    } catch (error) {
        logger.error(`Error authenticating user: ${error.message}`);
        res.status(401).send({ error: 'Invalid token.' });
    }
};


module.exports = authenticate;
