
const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const accountRoutes = require('./routes/account');
const authenticate = require('./utils/authenticate');



require('dotenv').config();

// Create an app
const app = express();
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Dwellow API',
            version: '1.0.0',
            description: 'Dwellow API Information',
            contact: {
                name: 'Dwellow'

            },
            servers: ['http://127.0.0.1:23450'],
        }
    },
    apis: ['server.js']

};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, { explorer: false }));

// Server System Routes ------------------------------------------------------

app.get('/', (req, res) => {
    res.redirect('https://dwellow.ca');
});

app.get('/health', (req, res) => {
    res.send("Server is online");
});

// Routing  -------------------------------------------------------
app.use('/account', authenticate, accountRoutes);


const PORT = 8080; // In docker this runs on port 23450

app.listen(PORT);
console.log(`Running on port ${PORT}`);

