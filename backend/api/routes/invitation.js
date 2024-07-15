const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { generateCode, sendCodeByEmail } = require('../utils/helper');
const {
    associateUnitWithUser,
    createCode,
    associateUserWithInviteCode,
    getUser,
    getInviteCodes } = require('../utils/connector');

router.get('/:code', async (req, res) => {
    console.log("Getting invitation information");
    const { code } = req.params;

    associateUserWithInviteCode(req.user_id, code);
    res.status(200).send("Invitation information");
});

router.get('/property/:propertyId', async (req, res) => {
    try {
        console.log("Getting all invites for property");

        const { propertyId } = req.params;
        console.log(propertyId)

        const invite_codes = await getInviteCodes(propertyId);
        res.status(200).json(invite_codes.recordset);
    } catch (error) {
        logger.error(`Error fetching the codes: ${error}`);
        res.status(404).send('Error fetching the codes');
    }
});

router.post('/', async (req, res) => {
    const { email, unit_id, property_id } = req.body;

    const code = generateCode();
    console.log(req.body);
    createCode(property_id, unit_id, email, code);

    sendCodeByEmail(email, code);

    res.send("Invitation sent", email, code);
});



//accept invite
module.exports = router;