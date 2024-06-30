const express = require('express');
const logger = require('../utils/logger');
const { getTickets, getOneTicket, updateTicket, createTicket, deleteTicket, getOneComment, createComment, getComments, getTicketsStatus } = require('../utils/connector.js');
const router = express.Router();
/**
 * @swagger
 * /Ticket:
 *   get:
 *     tags: [Ticket]
 *     summary: Get the current ticket's Ticket information.
 *     description: Retrieves detailed information about the authenticated ticket's Ticket.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The Ticket information has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               tickets:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                   description: The ticket's ID.
 *                 email:
 *                   type: string
 *                   example: "ticket@example.com"
 *                   description: The ticket's email address.
 *                 ticketType:
 *                   type: string
 *                   example: "tenant"
 *                   description: The type of the ticket (e.g., admin, tenant).
 *                 fullName:
 *                   type: string
 *                   example: "John Doe"
 *                   description: The full name of the ticket.
 *                 phoneNumber:
 *                   type: string
 *                   example: "+1234567890"
 *                   description: The phone number of the ticket.
 *       400:
 *         description: No ticket found with the provided ID.
 *       401:
 *         description: Unauthorized. The ticket is not authenticated.
 *       500:
 *         description: Internal server error. An unexpected error occurred.
 */
router.get('/', async (req, res) => {
//console.log("hello")
    try {
        const id = req.user_id;

        const ticket = await getTickets(id);

        if (!ticket) {
            logger.warn(`Get Ticket: No ticket found with id ${id}`);
            return res.status(400).json({ message: `No ticket found with id ${id}` });
        }

        logger.info(`Get Ticket: ticket ${id} information accessed.`); // TODO: We should return the ticket infromation here as json or somehting. IDK what is returned back. (Also update the comments)
        res.status(200).json(ticket.recordset);
    } catch (error) {
        logger.error(`Error getting Ticket information for ticket ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/:ticket_id', async (req, res) => {
    //console.log("hello")
        try {
            const id = req.params.ticket_id;
    
            const ticket = await getOneTicket(id);
    
            if (!ticket) {
                logger.warn(`Get Ticket: No ticket found with id ${id}`);
                return res.status(400).json({ message: `No ticket found with id ${id}` });
            }
    
            logger.info(`Get Ticket: ticket ${id} information accessed.`); // TODO: We should return the ticket infromation here as json or somehting. IDK what is returned back. (Also update the comments)
            res.status(200).json(ticket.recordset);
        } catch (error) {
            logger.error(`Error getting Ticket information for ticket ${id}: ${error.message}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

/**
 * @swagger
 * /Ticket:
 *   put:
 *     tags: [Ticket]
 *     summary: Update the current ticket's Ticket information.
 *     description: Allows authenticated tickets to update their Ticket information.
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: ticket
 *        description: The ticket object to update.
 *        schema:
 *          type: objects
 *          required: [email, ticketType, fullName, phoneNumber]
 *          tickets:
 *            email:
 *              type: string
 *              description: The new email address of the ticket.
 *            ticketType:
 *              type: string
 *              description: The new type of the ticket (e.g., admin, tenant).
 *            fullName:
 *              type: string
 *              description: The full name of the ticket.
 *            phoneNumber:
 *              type: string
 *              description: The new phone number of the ticket.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The Ticket has been updated successfully.
 *       400:
 *         description: Bad request. Possible reasons include invalid input data or attempting to update to an already used email.
 *       401:
 *         description: Unauthorized. ticket is not authenticated or does not have permission to update the Ticket.
 *       500:
 *         description: Internal server error. An unexpected error occurred.
 */
router.put('/:ticket_id', async (req, res) => {

    const {unit_id, user_id, description, length, priority, issue_area, photo_url, special_instructions, status } = req.body;
    const ticket_id = req.params.ticket_id;

    try {
        // Validate ticket authorization (ensure the ticket is updating their own Ticket or has admin privileges)
        const ticket = await getOneTicket(ticket_id);

        if (!ticket) {
            logger.warn(`Update Ticket: No ticket found with id ${ticket_id}`);
            return res.status(400).json({ message: `No ticket found with id ${ticket_id}` });
        }

        logger.info(`Update Ticket: ticket ${ticket_id} attempting update.`);

        // Update the Ticket
        const updated = await updateTicket( ticket_id, unit_id, user_id, description, length, priority, issue_area, photo_url, special_instructions, status);

        if (updated) {
            logger.info(`Update Ticket: ticket ${ticket_id} Ticket updated.`);
            res.status(200).json({ message: 'Ticket updated successfully' });
        }
        else {
            logger.warn(`Update Ticket: Error updating ticket ${ticket_id} Ticket.`);
            res.status(400).json({ message: 'Error updating ticket Ticket' });
        }

    } catch (error) {
        logger.error(`Error updating Ticket for ticket ${ticket_id}: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

/**
 * @swagger
 * /Ticket:
 *   delete:
 *     tags: [Ticket]
 *     summary: Delete the current ticket's Ticket.
 *     description: Permanently deletes the authenticated ticket's Ticket. This action cannot be undone.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The Ticket has been deleted successfully.
 *       400:
 *         description: No ticket found with the provided ID, or the ticket cannot be deleted (e.g., due to constraints).
 *       401:
 *         description: Unauthorized. The ticket is not authenticated or does not have permission to delete the Ticket.
 *       500:
 *         description: Internal server error. An unexpected error occurred.
 */
router.delete('/:ticket_id', async (req, res) => {

    try {
        const id = req.params.ticket_id;
        console.log(id);
        const ticket = await getOneTicket(id);

        if (!ticket) {
            logger.warn(`Delete Ticket: No ticket found with id ${id}`);
            return res.status(400).json({ message: `No ticket found with id ${id}` });
        }

        // TODO: Add a soft delete feature instead of hard delete

        logger.info(`Delete Ticket: ticket ${id} Ticket deleted.`);
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting Ticket for ticket ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /tickets:
 *   post:
 *     tags: [Ticket]
 *     summary: Create a new ticket
 *     description: Only admins can create a new ticket. The user ID is taken from the user session.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: ticket object that needs to be added
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - address
 *           tickets:
 *             address:
 *               type: string
 *     responses:
 *       201:
 *         description: ticket created successfully
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
    try {

        const {unit_id, user_id, description, length, priority, issue_area, photo_url, special_instructions } = req.body;

        console.log(req.body);

        const newticket = await createTicket( unit_id, user_id, description, length, priority, issue_area, photo_url, special_instructions);
        if (newticket) {
            logger.info(`User with ID: ${req.user_id} created a new ticket with ID: ${newticket.ticket_id}`);
            res.status(201).json(newticket);
        } else {
            logger.warn(`ticket creation failed by user ${req.user_id}`);
            res.status(400).send('Failed to create ticket');
        }
    } catch (error) {
        logger.error(`Error creating ticket by admin ${req.user_id}: ${error}`);
        res.status(500).send('Error creating ticket');
    }
});


router.post('/:ticket_id/comments', async (req, res) => {
    try {

        const {description} = req.body;
        
        const ticket_id = req.params.ticket_id;
        const user_id = req.user_id;

        console.log(req.body);
        console.log(req.user_id);

        const newcomment = await createComment(ticket_id, user_id, description);
        if (newcomment) {
            logger.info(`User with ID: ${req.user_id} created a new comment with ID: ${newcomment.comment_id}`);
            res.status(201).json(newcomment);
        } else {
            logger.warn(`comment creation failed by user ${req.user_id}`);
            res.status(400).send('Failed to create comment');
        }
    } catch (error) {
        logger.error(`Error creating comment by admin ${req.user_id}: ${error}`);
        res.status(500).send('Error creating comment');
    }
});


router.get('/:ticket_id/comments/:comment_id', async (req, res) => { // can change to delete

    try {
        const id = req.params.comment_id;
        console.log(id);
        const ticket = await getOneComment(id);

        if (!ticket) {
            logger.warn(`Delete Ticket: No ticket found with id ${id}`);
            return res.status(400).json({ message: `No ticket found with id ${id}` });
        }

        // TODO: Add a soft delete feature instead of hard delete

        logger.info(`Delete Ticket: ticket ${id} Ticket deleted.`);
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting Ticket for ticket ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:ticket_id/comments', async (req, res) => {
    //console.log("hello")
        try {
            const id = req.params.ticket_id;
    
            const ticket = await getComments(id);
    
            if (!ticket) {
                logger.warn(`Get Comment: No ticket found with id ${id}`);
                return res.status(400).json({ message: `No Comment found with id ${id}` });
            }
    
            logger.info(`Get Comment: ticket ${id} information accessed.`); // TODO: We should return the ticket infromation here as json or somehting. IDK what is returned back. (Also update the comments)
            res.status(200).json(ticket.recordset);
        } catch (error) {
            logger.error(`Error getting Comment information for ticket ${id}: ${error.message}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.get('/status/:status', async (req, res) => {
        //console.log("hello")
            try {
                const status = req.params.status;
        
                const ticket = await getTicketsStatus(status);
        
                if (!ticket) {
                    logger.warn(`Get Ticket: No ticket found`);
                    return res.status(400).json({ message: `No Ticket found` });
                }
        
                logger.info(`Get Ticket: information accessed.`); // TODO: We should return the ticket infromation here as json or somehting. IDK what is returned back. (Also update the comments)
                res.status(200).json(ticket.recordset);
            } catch (error) {
                logger.error(`Error getting Ticket information for Ticket: ${error.message}`);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });


module.exports = router;