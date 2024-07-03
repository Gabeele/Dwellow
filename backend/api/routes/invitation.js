const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { generateCode, sendCodeByEmail } = require('../utils/helper');
const {
    associateUnitWithUser,
    createCode,
    associateUserWithInviteCode,
    getUser } = require('../utils/connector');

router.get('/:code', async (req, res) => {
    console.log("Getting invitation information");
    const { code } = req.params;

    associateUserWithInviteCode(req.user_id, code);
    res.status(200).send("Invitation information");
});

router.post('/', async (req, res) => {
    const { email, unitId, id } = req.body;

    const code = generateCode();
    console.log(req.body);
    createCode(id, unitId, email, code);

    sendCodeByEmail(email, code);

    res.status(201).json({ message: "Invitation sent", email: email, code: code });
});



//accept invite
module.exports = router;