const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { generateCode, sendCodeByEmail } = require('../utils/helper');
const {
    associateUnitWithUser,
    createCode,
    deleteInviteCode, 
    getUser} = require('../utils/connector');

router.get('/:id', async  (req, res) => {
    console.log("Getting invitation information");
    const { id } = req.params;
    const { token } = req.headers;
    const user = getUser(token);

    if (user.id !== Number(id)) {
        res.status(401).send("Unauthorized");
    }
    else {
        // TODO make the assosication with the code and user in the database
        res.send("Invitation information");
    }
});

router.post('/', async (req, res) => {
    const { email, unit_id, property_id } = req.body;
    const user = getUser(req.user_id);

    //const email = "abeee.s.gavin@icloud.com";
    const code = generateCode();
    // TODO make association with code and user in the database
    createCode(email, unit_id, property_id, code);

    sendCodeByEmail(email, code);

    res.send("Invitation sent", email, code);
});

//accept invite
