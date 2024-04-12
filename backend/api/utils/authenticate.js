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
    // Correctly extract the token from the Authorization header
    try {
        const token = req.headers['authorization'].split(' ')[0];
        if (!token) {
            logger.info('No token provided.');
            return res.status(401).send({ error: 'No token provided. Provide a token in the header.' });
        }

        const decodedToken = await decodeToken(token);

        req.token = decodedToken;
        req.user_id = await getUserId(req.token.user_id);  // assigned the dwellow user id to the request object
        req.role = await getRole(req.user_id);   // Adds a role to the request object

        logger.info(`User ${req.user_id} ${req.role} authenticated.`);
        next();
    } catch (error) {
        logger.error(`Error authenticating user: ${error.message}`);
        res.status(401).send({ error: 'Invalid token.' });
    }
};

const decodeToken = async (token) => {
    return admin.auth().verifyIdToken(token);
}


module.exports = {
    authenticate,
    decodeToken
};
