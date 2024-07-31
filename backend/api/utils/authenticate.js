require('dotenv').config();
const { getRole, getUserId } = require('./connector');
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
    try {
        let token = req.headers['authorization'];
        if (token && (token.toLowerCase().startsWith('bearer '))) {
            token = token.split(' ')[1];
        }

        if (!token) {
            logger.info('No token provided.');
            return res.status(401).send({ error: 'No token provided. Provide a token in the header.' });
        }

        const decodedToken = await decodeToken(token);
        req.token = decodedToken;

        req.user_id = await getUserId(req.token.user_id);
        req.role = await getRole(req.user_id);

        logger.info(`User ${req.user_id} with role ${req.role} authenticated.`);
        next();
    } catch (error) {
        logger.error(`Error authenticating user: ${error.message}`);
        res.status(401).send({ error: 'Invalid token.' });
    }
};

const decodeToken = async (token) => {
    try {
        return await admin.auth().verifyIdToken(token);
    } catch (error) {
        logger.error(`Error decoding token: ${error.message}`);
        throw new Error('Token verification failed');
    }
}

module.exports = {
    authenticate,
    decodeToken
};
