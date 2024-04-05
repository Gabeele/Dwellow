require('dotenv').config();

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
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send({ error: 'No token provided. Provide a token in the header.' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Invalid token.' });
    }
};


module.exports = authenticate;
