const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateCode, sendCodeByEmail } = require('../utils/helper');
const { getProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    getProperty,
    getUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    associateUnitWithUser,
    createCode,
    deleteInviteCode, 
    getUser,
    getPropertyByAddress }= require('../utils/connector');

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Operations related to properties
 */


// Middleware to verify that the rest of the routes are only accessible to admins
const isAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        logger.warn(`User with ID: ${req.user_id} attempted to perform an admin action`);
        return res.status(403).send('Unauthorized: This action is allowed for admin only');
    }
    else {
        logger.info(`Admin with ID: ${req.user_id} is accessing admin routes`);

    }
    next();
};

/**
 * @swagger
 * /properties:
 *   get:
 *     tags: [Properties]
 *     summary: Fetch all properties
 *     description: Retrieves a list of all properties. Admin only.
 *     responses:
 *       200:
 *         description: An array of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */

router.get('/', isAdmin, async (req, res) => {
    try {
        const user = await getUser(req.user_id);
        //console.log (user.team_id);
        const properties = await getProperties(user.recordset[0].team_id);

        logger.info('Fetched all properties');

        res.json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        logger.error(`Error fetching properties: ${error}`);
        res.status(500).json({
            success: false,
            message: 'Error fetching properties',
            error: error.message
        });
    }
});


router.get('/address', isAdmin, async (req, res) => {
    try {
        const { address } = req.body;
        console.log(address);

        const property = await getPropertyByAddress(address)

        if (!property) {
            logger.warn(`Property with ID: ${req.params.propertyId} not found`);
            return res.status(404).send('Property not found');
        }
        logger.info(`Fetched property for address: ${address}`);
        res.json(property);
    } catch (error) {
        logger.error(`Error fetching property address ${address}: ${error}`);
        res.status(500).send('Error fetching property');
    }
});

/**
 * @swagger
 * /properties/{propertyId}/units:
 *   get:
 *     tags: [Properties]
 *     summary: Fetch a specific property and its units
 *     description: Retrieves a specific property along with its units. Admin only.
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the property
 *     responses:
 *       200:
 *         description: A property object along with an array of its units
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 property:
 *                   $ref: '#/components/schemas/Property'
 *                 units:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Unit'
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */

router.get('/:propertyId/units', isAdmin, async (req, res) => {
    try {
        console.log('here');
        const property_id = req.params.propertyId;
        const property = await getProperty(req.user_id, property_id)
        const units = await getUnits(req.user_id, req.params.propertyId);

        const propertyAndUnits = {
            property,
            units
        };

        if (!propertyAndUnits) {
            logger.warn(`Property with ID: ${req.params.propertyId} not found`);
            return res.status(404).send('Property not found');
        }
        logger.info(`Fetched property and units for property ID: ${req.params.propertyId}`);
        res.json(propertyAndUnits);
    } catch (error) {
        logger.error(`Error fetching property and its units with ID ${req.params.propertyId}: ${error}`);
        res.status(500).send('Error fetching property and its units');
    }
});


/**
 * @swagger
 * /properties/{propertyId}/units/{unitId}:
 *   get:
 *     tags: [Properties]
 *     summary: Fetch a specific unit by ID
 *     description: Retrieves a specific unit by its ID. Admin only.
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the property
 *       - in: path
 *         name: unitId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the unit
 *     responses:
 *       200:
 *         description: A unit object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unit'
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Unit not found
 *       500:
 *         description: Server error
 */

/*
router.get('/:propertyId/units/:unitId', isAdmin, async (req, res) => {
    try {
        const unit = await getUnit(req.user_id, req.params.unitId);
        if (!unit) {
            logger.warn(`Unit with ID: ${req.params.unitId} not found`);
            return res.status(404).send('Unit not found');
        }
        logger.info(`Fetched unit with ID: ${req.params.unitId}`);
        res.json(unit);
    } catch (error) {
        logger.error(`Error fetching unit with ID ${req.params.unitId}: ${error}`);
        res.status(500).send('Error fetching unit');
    }
});

*/

/**
 * @swagger
 * /properties:
 *   post:
 *     tags: [Properties]
 *     summary: Create a new property
 *     description: Only admins can create a new property. The user ID is taken from the user session.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Property object that needs to be added
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - address
 *           properties:
 *             address:
 *               type: string
 *     responses:
 *       201:
 *         description: Property created successfully
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/', isAdmin, async (req, res) => {
    try {
        const user = await getUser(req.user_id);
        const {title, address, description, photo_url, team_id } = req.body;
        console.log(req.body);

        const newProperty = await createProperty(title, address, description, photo_url, user.recordset[0].team_id);
        if (newProperty) {
            logger.info(`Admin with ID: ${req.user_id} created a new property with ID: ${newProperty.id}`);
            res.status(201).json(newProperty);
        } else {
            logger.warn(`Property creation failed by admin ${req.user_id}`);
            res.status(400).send('Failed to create property');
        }
    } catch (error) {
        logger.error(`Error creating property by admin ${req.user_id}: ${error}`);
        res.status(500).send('Error creating property');
    }
});

/**
 * @swagger
 * /properties/{propertyId}:
 *   put:
 *     tags: [Properties]
 *     summary: Update property details
 *     description: Only admins can update property details.
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         type: integer
 *         description: Numeric ID of the property to update
 *       - in: body
 *         name: body
 *         description: Property object that needs to be updated
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.put('/:propertyId', isAdmin, async (req, res) => {
    try {
        const user = await getUser(req.user_id);
        const property_id = req.params.propertyId;
        const {title, address, description, photo_url, team_id=user.recordset[0].team_id } = req.body;
        console.log(req.body);
        console.log(property_id);

        const updatedProperty = await updateProperty(property_id, title, address, description, photo_url, team_id);
        if (updatedProperty) {
            logger.info(`Admin with ID: ${req.user_id} updated property ID: ${req.params.propertyId}`);
            res.json(updatedProperty);
        } else {
            logger.warn(`Property update failed for ID: ${req.params.propertyId} by admin ${req.user_id}`);
            res.status(400).send('Failed to update property');
        }
    } catch (error) {
        logger.error(`Error updating property by admin ${req.user_id}: ${error}`);
        res.status(500).send('Error updating property');
    }
});

/**
 * @swagger
 * /properties/{propertyId}:
 *   delete:
 *     tags: [Properties]
 *     summary: Delete a property
 *     description: Only admins can delete a property.
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the property to delete
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.delete('/:propertyId', isAdmin, async (req, res) => {
    try {
        const result = await deleteProperty(req.params.propertyId);
        if (result) {
            logger.info(`Admin with ID: ${req.user_id} deleted property ID: ${req.params.propertyId}`);
            res.send('Property deleted successfully');
        } else {
            logger.warn(`Property deletion failed for ID: ${req.params.propertyId} by admin ${req.user_id}`);
            res.status(400).send('Failed to delete property');
        }
    } catch (error) {
        logger.error(`Error deleting property by admin ${req.user_id}: ${error}`);
        res.status(500).send('Error deleting property');
    }
});

/**
 * @swagger
 * /properties/{propertyId}/units:
 *   post:
 *     tags: [Properties]
 *     summary: Create a new unit for a property
 *     description: Only admins can create a new unit for a specific property.
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         type: integer
 *         description: Numeric ID of the property to which the unit will belong
 *       - in: body
 *         name: body
 *         description: Unit object that needs to be added to the property
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - unit_id
 *           properties:
 *             unit_id:
 *               type: integer
 *     responses:
 *       201:
 *         description: Unit created successfully
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/:propertyId/units', isAdmin, async (req, res) => {
    try {

        const property_id = req.params.propertyId;
        const { unit, description, tenant_id } = req.body;

        const newUnit = await createUnit(req.user_id, tenant_id, property_id, unit, description);
        if (newUnit) {
            logger.info(`Admin with ID: ${req.user_id} created a unit with ID: ${newUnit.id} for property ID: ${req.params.propertyId}`);
            res.status(201).json(newUnit);
        } else {
            logger.warn(`Unit creation failed for property ID: ${req.params.propertyId} by admin ${req.user_id}`);
            res.status(400).send('Failed to create unit');
        }
    } catch (error) {
        logger.error(`Error creating unit by admin ${req.user_id}: ${error}`);
        res.status(500).send('Error creating unit');
    }
});

/**
 * @swagger
 * /properties/{propertyId}/units/{unitId}:
 *   put:
 *     tags: [Properties]
 *     summary: Update unit details
 *     description: Only admins can update unit details for a specific property.
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         type: integer
 *         description: Numeric ID of the property to which the unit belongs
 *       - in: path
 *         name: unitId
 *         required: true
 *         type: integer
 *         description: Numeric ID of the unit to update
 *       - in: body
 *         name: body
 *         description: Unit object that needs to be updated
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             // Define the updatable unit properties here
 *     responses:
 *       200:
 *         description: Unit updated successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Unit not found
 *       500:
 *         description: Server error
 */
router.put('/:propertyId/units/:unitId', isAdmin, async (req, res) => {
    try {
        const updatedUnit = await updateUnit(req.user_id, req.params.unitId, req.body);
        if (updatedUnit) {
            logger.info(`Admin with ID: ${req.user_id} updated unit ID: ${req.params.unitId}`);
            res.json(updatedUnit);
        } else {
            logger.warn(`Unit update failed for ID: ${req.params.unitId} by admin ${req.user_id}`);
            res.status(400).send('Failed to update unit');
        }
    } catch (error) {
        logger.error(`Error updating unit by admin ${req.user_id}: ${error}`);
        res.status(500).send('Error updating unit');
    }
});

/**
 * @swagger
 * /properties/{propertyId}/units/{unitId}:
 *   delete:
 *     tags: [Properties]
 *     summary: Delete a unit
 *     description: Only admins can delete a unit from a specific property.
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         type: integer
 *         description: Numeric ID of the property to which the unit belongs
 *       - in: path
 *         name: unitId
 *         required: true
 *         type: integer
 *         description: Numeric ID of the unit to delete
 *     responses:
 *       200:
 *         description: Unit deleted successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Unit not found
 *       500:
 *         description: Server error
 */
router.delete('/:propertyId/units/:unitId', isAdmin, async (req, res) => {
    try {
        const result = await deleteUnit(req.user_id, req.params.unitId);
        if (result) {
            logger.info(`Admin with ID: ${req.user_id} deleted unit ID: ${req.params.unitId}`);
            res.send('Unit deleted successfully');
        } else {
            logger.warn(`Unit deletion failed for ID: ${req.params.unitId} by admin ${req.user_id}`);
            res.status(400).send('Failed to delete unit');
        }
    } catch (error) {
        logger.error(`Error deleting unit by admin ${req.user_id}: ${error}`);
        res.status(500).send('Error deleting unit');
    }
});

/**
 * @swagger
 * /properties/{propertyId}/units/{unitId}/invite:
 *   post:
 *     tags: [Properties]
 *     summary: Generate and send an invite code for a unit
 *     description: Only admins can generate and send an invite code for a unit to associate tenants.
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the property
 *       - in: path
 *         name: unitId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the unit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Invite code sent successfully
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/:propertyId/units/:unitId/invite', isAdmin, async (req, res) => {
    try {
        const { propertyId, unitId } = req.params;
        const { email } = req.body;

        const inviteCode = await createCode(propertyId, unitId, email);

        const inviteSent = await sendCodeByEmail(email, inviteCode);

        if (inviteSent) {
            logger.info(`Admin with ID: ${req.user_id} sent an invite code to ${email}`);
            res.send('Invite code sent successfully');
        } else {
            logger.warn(`Failed to send invite code to ${email}`);
            res.status(400).send('Failed to send invite code');
        }
    } catch (error) {
        logger.error(`Error sending invite code: ${error}`);
        res.status(500).send('Error sending invite code');
    }
});

/**
 * @swagger
 * /properties/{propertyId}/units/{unitId}/associate:
 *   post:
 *     tags: [Properties]
 *     summary: Associate a unit with a user using an invite code
 *     description: Associate a unit with a user using the invite code sent to the user's email.
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the property
 *       - in: path
 *         name: unitId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the unit
 *       - in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 code:
 *                   type: string
 *     responses:
 *       200:
 *         description: Unit associated with user successfully
 *       403:
 *         description: Unauthorized access or invalid code
 *       404:
 *         description: Property or unit not found
 *       500:
 *         description: Server error
 */
router.post('/associate/', async (req, res) => {
    try {
        const code = req.body.code;

        const associationResult = await associateUnitWithUser(req.user_id, code);

        if (associationResult) {
            logger.info(`Unit associated with user successfully`);
            res.send('Unit associated with user successfully');
        } else {
            logger.warn(`Failed to associate unit with user or invalid code`);
            res.status(400).send('Failed to associate unit with user or invalid code');
        }
    } catch (error) {
        logger.error(`Error associating unit with user: ${error}`);
        res.status(500).send('Error associating unit with user');
    }
});

/**
 * @swagger
 * /properties/{propertyId}/units/{unitId}/invite/{code}:
 *   delete:
 *     tags: [Properties]
 *     summary: Delete an invite code
 *     description: Allows admins to delete an invite code for a unit. Admin only.
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the property
 *       - in: path
 *         name: unitId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the unit
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The invite code to be deleted
 *     responses:
 *       200:
 *         description: Invite code deleted successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Invite code not found
 *       500:
 *         description: Server error
 */
 
router.delete('/:propertyId/units/:unitId/invite/:code', isAdmin, async (req, res) => {
    try {
        const { propertyId, unitId, code } = req.params;
        const result = await deleteInviteCode(req.user_id, propertyId, unitId, code);
        if (result) {
            logger.info(`Invite code '${code}' deleted successfully for unit ID: ${unitId} of property ID: ${propertyId}`);
            res.send('Invite code deleted successfully');
        } else {
            logger.warn(`Failed to delete invite code '${code}' for unit ID: ${unitId} of property ID: ${propertyId}`);
            res.status(404).send('Invite code not found');
        }
    } catch (error) {
        logger.error(`Error deleting invite code '${req.params.code}' by admin ${req.user_id}: ${error}`);
        res.status(500).send('Error deleting invite code');
    }
});

// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        // Generate a unique filename with timestamp
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only PDFs are allowed!');
        }
    }
}).single("contract"); 

router.post('/contract', function (req, res) {
    upload(req, res, function (err) {
        //console.log(req);
        if (err) {
            console.error('Upload Error:', err);
            return res.status(400).send(err);
        }

        try {
            console.log('File:', req.file);
            if (!req.file) {
                console.error('No file uploaded');
                return res.status(400).send('No file uploaded');
            }

            console.log('here');
            const associationResult = true; // Replace with actual association logic

            if (associationResult) {
                res.send('Unit associated with user successfully');
            } else {
                res.status(400).send('Failed to associate unit with user or invalid code');
            }
        } catch (error) {
            console.error('Error associating unit with user:', error);
            res.status(500).send('Error associating unit with user');
        }
    });
});



module.exports = router;