const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { generateCode, sendCodeByEmail } = require('../utils/helper');
const {
    associateUnitWithUser,
    createCode,
    associateUserWithInviteCode, 
    getUser} = require('../utils/connector');

router.get('/:code', async  (req, res) => {
    console.log("Getting invitation information");
    const { code } = req.params;

    associateUserWithInviteCode(req.user_id, code);
        res.send("Invitation information");
});

router.post('/', async (req, res) => {
    const { email, unit_id, property_id } = req.body;

    //const email = "abeee.s.gavin@icloud.com";
    const code = generateCode();
    // TODO make association with code and user in the database
    console.log(req.body);
    createCode(property_id, unit_id, email, code);

    sendCodeByEmail(email, code);
    //now that email sense, user must enter code and check in database whether it matches the code in the database
    //if it does then they are able to be associated, if not, error

    res.send("Invitation sent", email, code);
});

//accept invite
module.exports = router;