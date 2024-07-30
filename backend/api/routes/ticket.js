const express = require('express');
const logger = require('../utils/logger');
const { getMaxQueue, getUser, getTickets, getOneTicket, updateTicket, createTicket, deleteTicket, getTicketsForTeam, getOneComment, createComment, getComments, getTicketsStatus, updateQueue } = require('../utils/connector.js');
const router = express.Router();

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


router.get('/max-queue', async (req, res) => {
    try {
        const user_id = req.user_id;
        const result = await getMaxQueue(user_id);
        res.status(200).json({ Max: result });
    } catch (error) {
        logger.error(`Error fetching max queue: ${error}`);
        res.status(500).send('Error fetching max queue');
    }
});


router.get('/', async (req, res) => {
    //console.log("hello")
    const id = req.user_id;

    try {
        const user = await getUser(req.user_id);

        //console.log(req.role);

        if (req.role === 'admin') {
            const team_id = user.recordset[0].team_id;
            const ticket = await getTicketsForTeam(team_id);

            if (!ticket) {
                logger.warn(`Get Team Tickets: No tickets found with team id ${team_id}`);
                return res.status(400).json({ message: `No tickets found with team id ${team_id}` });
            }
            logger.info(`Get Team Tickets: ticket ${team_id} information accessed.`);
            res.status(200).json({
                success: true,
                data: ticket
            });
        }
        else {
            const ticket = await getTickets(id);

            if (!ticket) {
                logger.warn(`Get Ticket: No ticket found with id ${id}`);
                return res.status(400).json({ message: `No ticket found with id ${id}` });
            }

            logger.info(`Get Ticket: ticket ${id} information accessed.`); // TODO: We should return the ticket infromation here as json or somehting. IDK what is returned back. (Also update the comments)
            res.status(200).json(ticket.recordset);
        }
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

router.put('/:ticket_id', async (req, res) => {

    const { unit_id, user_id, description, length, priority, issue_area, photo_url, special_instructions, status } = req.body;
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
        const updated = await updateTicket(ticket_id, unit_id, user_id, description, length, priority, issue_area, photo_url, special_instructions, status);

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

router.put('/status/:ticket_id', async (req, res) => {
    const { status, time_resolved } = req.body;
    const ticket_id = req.params.ticket_id;

    try {
        const ticketResult = await getOneTicket(ticket_id);
        if (!ticketResult) {
            logger.warn(`Update Ticket: No ticket found with id ${ticket_id}`);
            return res.status(400).json({ message: `No ticket found with id ${ticket_id}` });
        }

        const ticket = ticketResult.recordset[0];
        logger.info(`Update Ticket: ticket ${ticket_id} attempting update.`);

        const updated = await updateTicket(
            ticket_id,
            ticket.unit_id,
            ticket.user_id,
            ticket.description,
            ticket.length,
            ticket.priority,
            ticket.issue_area,
            ticket.photo_url,
            ticket.special_instructions,
            status,
            time_resolved
        );

        if (updated) {
            logger.info(`Update Ticket: ticket ${ticket_id} Ticket updated.`);
            res.status(200).json({ message: 'Ticket updated successfully' });
        } else {
            logger.warn(`Update Ticket: Error updating ticket ${ticket_id} Ticket.`);
            res.status(400).json({ message: 'Error updating ticket Ticket' });
        }
    } catch (error) {
        logger.error(`Error updating Ticket for ticket ${ticket_id}: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


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


router.post('/', async (req, res) => {
    try {

        const { unit_id, description, length, priority, issue_area, photo_url, special_instructions } = req.body;

        console.log(req.body);

        const newticket = await createTicket(unit_id, req.user_id, description, length, priority, issue_area, photo_url, special_instructions);
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

        const { description } = req.body;

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

router.post('/:ticket_id/queue', async (req, res) => {
    try {
        const { new_queue } = req.body;
        const ticket_id = req.params.ticket_id;

        // Update the ticket queue with the retrieved team_id
        const update = await updateQueue(ticket_id, new_queue, req.user_id);
        if (update) {
            res.status(201).json({ message: 'Queue updated successfully' });
        } else {
            res.status(400).send('Failed to update ticket queue');
        }
    } catch (error) {
        logger.error(`Error: ${error}`);
        res.status(500).send('Error updating queue');
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