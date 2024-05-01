
const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const accountRoutes = require('./routes/account');
const loginRoutes = require('./routes/login');
const announcementRoutes = require('./routes/announcement');
const propertyRoutes = require('./routes/property');
const { authenticate } = require('./utils/authenticate');
const logger = require('./utils/logger');
const publicRoutes = require('./routes/public');




require('dotenv').config();

// Create an app
const app = express();
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Dwellow API Documentation',
            version: '1.0.0',
            description: 'Welcome to the Dwellow API Documentation. This is a RESTful API for the Dwellow application.',
            contact: {
                name: 'Dwellow Support',
                email: 'hello@dwellow.com',
            },
        },
        servers: [
            {
                url: 'http://127.0.0.1:23450',
                description: 'Your Local Development Server',
            },
            {
                url: 'https://api.dwellow.ca',
                description: 'The Production Server',
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
    },
    apis: ['server.js', './routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const swaggerUIOptions = {
    explorer: false,
    swaggerOptions: {
        supportedSubmitMethods: []
    }
};

app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, swaggerUIOptions));

// Middleware to log all requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Server System Routes ------------------------------------------------------

app.get('/', (req, res) => {
    logger.info('Redirected to Dwellow.ca');
    res.redirect('https://dwellow.ca');
});

app.get('/health', (req, res) => {
    logger.info('Health check accessed');
    res.send("Server is online");
});

// app.use('') // This would be routes for public apis
app.use('/public', publicRoutes);

// Routing  -------------------------------------------------------
app.use('/account', authenticate, accountRoutes);
app.use('/login', authenticate, loginRoutes);
app.use('/announcements', authenticate, announcementRoutes);
app.use('/properties', authenticate, propertyRoutes);


// Error handling middleware

app.use((err, req, res, next) => {
    logger.error(`${err.message}`);
    res.status(500).send('Something broke!');
});

const PORT = 8080; // In docker this runs on port 23450

app.listen(PORT);
console.log(`Running on port ${PORT}`);

