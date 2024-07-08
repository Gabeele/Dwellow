const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { getUserAnnouncements, createAnnouncement, deleteAnnouncement, getAnnouncementById, getAnnouncementByProperty } = require('../utils/connector');

/**
 * @swagger
 * tags:
 *   - name: Announcements
 *     description: API endpoints related to announcements
 */

/**
 * @swagger
 * /announcements:
 *   get:
 *     tags: [Announcements]
 *     summary: Retrieves all announcements for a user
 *     description: Returns a list of all announcements associated with the requesting user's ID.
 *     responses:
 *       200:
 *         description: A list of announcements
 *       500:
 *         description: Error message
 */
router.get('/all', async (req, res) => {
    try {
        const id = req.user_id;
        logger.info(`Fetching announcements for user ${id}`);
        const announcements = await getUserAnnouncements(id);
        res.json(announcements);
    } catch (error) {
        logger.error(`Error fetching announcements: ${error}`);
        res.status(404).send('Error fetching announcements');
    }
});

/**
 * @swagger
 * /announcements:
 *   post:
 *     tags: [Announcements]
 *     summary: Creates an announcement (admin only)
 *     description: Allows admins to create a new announcement by providing announcement details.
 *     parameters:
 *       - in: body
 *         name: announcement
 *         description: Announcement to create
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - text
 *             - userId
 *             - date
 *             - time
 *             - propertyId
 *           properties:
 *             title:
 *               type: string
 *             text:
 *               type: string
 *             userId:
 *               type: integer
 *             datetime:
 *               type: datetime-string
 *             propertyId:
 *               type: integer
 *     responses:
 *       200:
 *         description: Announcement created successfully
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Error message
 */
router.post('/', async (req, res) => {
    try {
        if (req.role !== 'admin') {
            logger.warn('Unauthorized attempt to create announcement');
            return res.status(403).send('Unauthorized');
        }
        logger.info('Creating announcement');
        const {user_id, title, text, property_id} = req.body;
        console.log(req.body);
        await createAnnouncement(user_id, title, text, property_id);
        res.send('Announcement created successfully');
    } catch (error) {
        logger.error(`Error creating announcement: ${error}`);
        res.status(404).send('Error creating announcement');
    }
});

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     tags: [Announcements]
 *     summary: Deletes an announcement by ID (admin only)
 *     description: Allows admins to delete an announcement by specifying its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: The ID of the announcement to delete
 *     responses:
 *       200:
 *         description: Announcement deleted successfully
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Error message
 */
router.delete('/:id', async (req, res) => {
    try {
        if (req.role !== 'admin') {
            logger.warn('Unauthorized attempt to delete announcement');
            return res.status(403).send('Unauthorized');
        }
        logger.info(`Deleting announcement with ID ${req.params.id}`);
        await deleteAnnouncement(req.params.id);
        res.send('Announcement deleted successfully');
    } catch (error) {
        logger.error(`Error deleting announcement: ${error}`);
        res.status(404).send('Error deleting announcement');
    }
});

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     tags: [Announcements]
 *     summary: Retrieves an announcement by ID
 *     description: Fetches a single announcement by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: The ID of the announcement to retrieve
 *     responses:
 *       200:
 *         description: An announcement object
 *       500:
 *         description: Error message
 */
router.get('/:id', async (req, res) => {
    try {
        logger.info(`Fetching announcement with ID ${req.params.id}`);
        const announcement = await getAnnouncementById(req.params.id);
        res.status(200).json(announcement.recordset);
    } catch (error) {
        logger.error(`Error fetching the announcement: ${error}`);
        res.status(404).send('Error fetching the announcement');
    }
});

router.get('/', async (req, res) => {
    try {
        logger.info(`Fetching announcement with user ID ${req.user_id}`);
        const announcement = await getAnnouncementByProperty(req.user_id);
        res.status(200).json(announcement.recordset);
    } catch (error) {
        logger.error(`Error fetching the announcement: ${error}`);
        res.status(404).send('Error fetching the announcement');
    }
});

module.exports = router;
