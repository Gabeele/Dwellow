const sql = require('mssql');
require('dotenv').config();
const logger = require('./logger');


const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true,
        database: 'Dwellow',
        connectionRole: 'db_datawriter'
    }
};

// Test function to check the database functionality
async function executeQuery(query) {
    try {
        await sql.connect(config);
        const result = await sql.query(query);
        logger.info(`Query executed successfully: ${query}`);
        return result;
    } catch (error) {
        logger.error(`Error executing query: ${query}, Error: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}


async function createAccount(email, userType, fullName, phoneNumber, fb_uuid) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('userType', sql.NVarChar, userType);
        request.input('email', sql.NVarChar, email);
        request.input('fullName', sql.NVarChar, fullName);
        request.input('token', sql.NVarChar, fb_uuid);
        request.input('phoneNumber', sql.NVarChar, phoneNumber);

        const result = await request.execute('CreateAccount');
        logger.info('Account created successfully:', result);
        return true;
    } catch (error) {
        logger.error(`Error creating account for email ${email}: ${error}`);
        throw error;
        return false;
    } finally {
        await sql.close();
    }
}


//checks the email to see if it exists since they must be unqiue
async function checkEmail(email) {
    try {
        await sql.connect(config);
        const query = `SELECT TOP 1 1 FROM [Dwellow].[dbo].[users] WHERE [email] = '${email}'`;
        const result = await sql.query(query);
        return result.recordset.length > 0;
    } catch (error) {
        logger.error(`Error checking email ${email}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}


async function getRole(userId) {

    try {
        await sql.connect(config);
        const query = `SELECT user_type FROM users WHERE user_id = '${userId}'`;
        const result = await sql.query(query);
        if (result.recordsetlength === 0) {
            return null;
        }
        return result.recordset[0].user_type;
    } catch (error) {
        logger.error(`Error fetching user with token ${userId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
};

// gets any user from the database with a specific token, but since they are unique it will always be 1 user
async function getUser(id) {
    try {
        await sql.connect(config);
        const query = `SELECT * FROM users WHERE user_id = '${id}'`;
        const result = await sql.query(query);
        if (result.recordset.length === 0) {
            return null;
        }
        return result;
    } catch (error) {
        logger.error(`Error fetching user with user_id ${id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function getUserId(token) { // TODO: Gavin's attempt at making a user ID thing

    try {
        await sql.connect(config);
        const query = `SELECT * FROM users WHERE token = '${token}'`;
        const result = await sql.query(query);
        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset[0].user_id;
    } catch (error) {
        logger.error(`Error fetching user with token ${token}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}


// TODO: I believe this is meant to be a soft delete, so we should update the query to set a flag instead of deleting the record
async function deleteUser(id) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('id', sql.Int, id);

        const result = await request.execute('RemoveUser');
        if (result.rowsAffected[0] > 0) {
            logger.info(`User with user_id ${id} deleted successfully.`);
            return true;
        } else {
            logger.warn(`No user found with user_id ${id} to delete.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error deleting user with user_id ${id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}


async function updateUser(email, id, userType, password, fullName, phoneNumber) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('email', sql.NVarChar, email);
        request.input('id', sql.Int, id);
        request.input('userType', sql.NVarChar, userType);
        request.input('password', sql.NVarChar, password);
        request.input('fullName', sql.NVarChar, fullName);
        request.input('phoneNumber', sql.NVarChar, phoneNumber);

        const result = await request.execute('UpdateUser');
        if (result.rowsAffected[0] > 0) {
            logger.info(`User with user_id ${id} updated successfully.`);
            return true;
        } else {
            logger.warn(`No user found with user_id ${id} to update.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error updating user with user_id ${id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function getUserAnnouncements(userId) {
    try {
        await sql.connect(config);
        const query = `SELECT * FROM announcements WHERE user_id = '${id}'`;
        const result = await sql.query(query);
        if (result.recordset.length === 0) {
            return null;
        }
        return result;
    } catch (error) {
        logger.error(`Error fetching announcements with user_id ${id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function createAnnouncement(userId, title, text, datetime) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('title', sql.NVarChar, title);
        request.input('text', sql.NVarChar, text);
        request.input('datetime', sql.NVarChar, datetime);

        const result = await request.execute('CreateAnnouncement');
        logger.info('Announcements created successfully:', result);
        return result;
    } catch (error) {
        logger.error(`Error creating announcement for user ${userId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function deleteAnnouncement(announcementId) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('announcementId', sql.Int, announcementId);

        const result = await request.execute('RemoveAnnouncement');
        if (result.rowsAffected[0] > 0) {
            logger.info(`Announcement with announcement_id ${announcementId} deleted successfully.`);
            return true;
        } else {
            logger.warn(`No Announcement found with announcement_id ${announcementId} to delete.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error deleting Announcement with announcement_id ${announcementId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function getAnnouncementById(announcementId) {
    try {
        await sql.connect(config);
        const query = `SELECT * FROM announcements WHERE announcement_id = '${announcementId}'`;
        const result = await sql.query(query);
        if (result.recordset.length === 0) {
            return null;
        }
        return result;
    } catch (error) {
        logger.error(`Error fetching announcements with announcement_id ${id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function getProperties(user_id) {
    try {
        await sql.connect(config);
        const query = `
        SELECT
            p.*,
            (SELECT COUNT(*) FROM units u WHERE u.property_id = p.id) AS unit_count
        FROM
            properties p
        WHERE
            p.user_id = '${user_id}'`;
        const result = await sql.query(query);
        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset;
    } catch (error) {
        logger.error(`Error fetching properties with user_id ${user_id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function createProperty(userId, title, address, description, units) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('title', sql.NVarChar, title);
        request.input('address', sql.NVarChar, address);
        request.input('description', sql.NVarChar, description);
        request.input('numUnits', sql.Int, parseInt(units, 10));

        const result = await request.execute('CreateProperty');
        logger.info('Property created successfully:', result);
        return result;
    } catch (error) {
        logger.error(`Error creating Property for user ${userId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function updateProperty(userId, propertyData, propertyId) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('propertyData', sql.NVarChar, propertyData);
        request.input('propertyId', sql.Int, propertyId);

        const result = await request.execute('UpdateProperty');
        if (result.rowsAffected[0] > 0) {
            logger.info(`Property with property_id ${propertyId} updated successfully.`);
            return true;
        } else {
            logger.warn(`No property found with property_id ${propertyId} to update.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error updating property with property_id ${propertyId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function deleteProperty(userId, propertyId) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('propertyId', sql.Int, propertyId);

        const result = await request.execute('RemoveProperty');
        if (result.rowsAffected[0] > 0) {
            logger.info(`Property with property_id ${propertyId} deleted successfully.`);
            return true;
        } else {
            logger.warn(`No Property found with property_id ${propertyId} to delete.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error deleting Property with property_id ${propertyId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function getProperty(user_id, propertyId) {
    try {
        await sql.connect(config);
        const query = `Select * from properties where properties.id = ${propertyId}`;
        const result = await sql.query(query);
        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset[0];
    } catch (error) {
        logger.error(`Error fetching properties and units with user_id ${user_id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function getUnits(user_id, property_id) {
    try {
        await sql.connect(config);
        const query = `SELECT u.*, us.email, us.full_name, us.phone_number
        FROM units u
        LEFT JOIN users us ON u.tenant_id = us.user_id
        WHERE u.property_id = ${property_id}`;
        const result = await sql.query(query);
        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset;
    } catch (error) {
        logger.error(`Error fetching properties with user_id ${user_id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function createUnit(userId, propertyId, unit, description) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('propertyId', sql.Int, propertyId);
        request.input('unit', sql.NVarChar, unit);
        request.input('description', sql.NVarChar, description);

        const result = await request.execute('CreateUnit');
        logger.info('Unit created successfully:', result);
        return result;
    } catch (error) {
        logger.error(`Error creating Unit for user ${userId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function updateUnit(userId, unitId, unitData) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('unitId', sql.Int, unitId);
        request.input('unitData', sql.NVarChar, unitData);

        const result = await request.execute('UpdateUnit');
        if (result.rowsAffected[0] > 0) {
            logger.info(`Unit with unit_id ${unitId} updated successfully.`);
            return true;
        } else {
            logger.warn(`No Unit found with unit_id ${unitId} to update.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error updating Unit with unit_id ${unitId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function deleteUnit(userId, unitId) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('unitId', sql.Int, unitId);

        const result = await request.execute('RemoveUnit');
        if (result.rowsAffected[0] > 0) {
            logger.info(`Unit with unit_id ${unitId} deleted successfully.`);
            return true;
        } else {
            logger.warn(`No Unit found with unit_id ${unitId} to delete.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error deleting Unit with unit_id ${unitId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function createTicket(unitId, userId, description) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('unitId', sql.Int, unitId);
        request.input('userId', sql.Int, userId);
        request.input('description', sql.NVarChar(sql.MAX), description);

        const result = await request.execute('CreateTicket');
        logger.info('Ticket created successfully:', result);
        return result;
    } catch (error) {
        logger.error(`Error creating ticket for user ${userId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function updateTicket(ticketId, unitId, userId, description) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('ticketId', sql.Int, ticketId);
        request.input('unitId', sql.Int, unitId);
        request.input('userId', sql.Int, userId);
        request.input('description', sql.NVarChar(sql.MAX), description);

        const result = await request.execute('UpdateTicket');
        if (result.rowsAffected[0] > 0) {
            logger.info(`Ticket with ticket_id ${ticketId} updated successfully.`);
            return true;
        } else {
            logger.warn(`No Ticket found with ticket_id ${ticketId} to update.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error updating Ticket with ticket_id ${ticketId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function removeTicket(ticketId) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('ticketId', sql.Int, ticketId);

        const result = await request.execute('RemoveTicket');
        if (result.rowsAffected[0] > 0) {
            logger.info(`Ticket with ticket_id ${ticketId} removed successfully.`);
            return true;
        } else {
            logger.warn(`No Ticket found with ticket_id ${ticketId} to remove.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error removing Ticket with ticket_id ${ticketId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

// Modify other functions similarly

module.exports = {
    createTicket,
    updateTicket,
    removeTicket,
    // Add other functions here
};


async function associateUnitWithUser(user_id, code) {
    try {

        console.log('user_id:', user_id);
        console.log('code:', code);
        await sql.connect(config);
        const request = new sql.Request();

        request.input('UserID', sql.Int, user_id);
        request.input('Code', sql.NVarChar, code);

        const result = await request.execute('AssociateUnitWithUser');

        if (result.recordset?.[0]?.Status === 'Success') {
            const unitId = result.recordset[0].UnitId;
            logger.info(`Unit ${unitId} associated with user ${user_id}. ${result.recordset[0].Message}`);
            return { success: true, unitId: unitId };
        } else {
            logger.error(`Failed to associate unit with user ${user_id}.`);
            return { success: false };
        }

    } catch (error) {
        logger.error(`Error in associateUnitWithUser: ${error}`);
        throw error;
    } finally {
        await sql.close();

    }
}


async function createCode(propertyId, unitId, email) {
    try {
        await sql.connect(config);
        const request = new sql.Request();

        request.input('Email', sql.NVarChar, email);
        request.input('PropertyID', sql.Int, propertyId);
        request.input('UnitID', sql.Int, unitId);

        const result = await request.execute('InsertInviteCode');

        const code = result.recordset[0].InviteCode;

        logger.info(`Code ${code} created and associated with property ID ${propertyId} and unit ID ${unitId}.`);
        return code;
    } catch (error) {
        logger.error(`Error creating code for property ID ${propertyId}, unit ID ${unitId}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function deleteInviteCode(user_id, propertyId, unitId, code) {

}


module.exports = {
    getUserId,
    deleteInviteCode,
    getProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    getProperty, getUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    associateUnitWithUser,
    createCode,
    getUserAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
    getAnnouncementById,
    getRole,
    executeQuery,
    createAccount,
    checkEmail,
    getUser,
    deleteUser,
    updateUser,
    createTicket,
    updateTicket,
    removeTicket
};