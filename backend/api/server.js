
const express = require('express');

//Create an app
const app = express();

app.get('/', (req, res) => {
    res.contentType('application/json');

    res.send({ hi: 'there' });


});

const PORT = 8080;

app.listen(PORT);
console.log(`Running on port ${PORT}`);