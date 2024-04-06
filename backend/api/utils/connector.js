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


async function createAccount(email, token, userType, fullName, phoneNumber) {
    try {
        await sql.connect(config);
        const query = `INSERT INTO [dbo].[users] ([user_type],[email],[full_name],[token],[phone_number]) VALUES ('${userType}', '${email}', '${fullName}', '${token}', '${phoneNumber}')`;
        const result = await sql.query(query);
        logger.info('Account created successfully:', result);
        return result;
    } catch (error) {
        logger.error(`Error creating account for email ${email}: ${error}`);
        throw error;
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
        const query = `SELECT user_type FROM users WHERE token = '${token}'`;
        const result = await sql.query(query);
        if (result.recordset.length === 0) {
            return null;
        }
        return result;
    } catch (error) {
        logger.error(`Error fetching user with token ${token}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
};

// gets any user from the database with a specific token, but since they are unique it will always be 1 user
async function getUser(token) {
    try {
        await sql.connect(config);
        const query = `SELECT * FROM users WHERE token = '${token}'`;
        const result = await sql.query(query);
        if (result.recordset.length === 0) {
            return null;
        }
        return result;
    } catch (error) {
        logger.error(`Error fetching user with token ${token}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

// TODO: I believe this is meant to be a soft delete, so we should update the query to set a flag instead of deleting the record
async function deleteUser(token) {
    try {
        await sql.connect(config);
        const query = `DELETE FROM users WHERE token = '${token}'`;
        const result = await sql.query(query);
        if (result.rowsAffected[0] > 0) {
            logger.info(`User with token ${token} deleted successfully.`);
            return true;
        } else {
            logger.warn(`No user found with token ${token} to delete.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error deleting user with token ${token}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}


async function updateUser(email, token, userType, password, fullName, phoneNumber) {
    try {
        await sql.connect(config);
        const query = `
        UPDATE [dbo].[users] 
        SET 
            [user_type] = '${userType}',
            [password] = '${password}',
            [email] = '${email}',
            [full_name] = '${fullName}',
            [phone_number] = '${phoneNumber}'
        WHERE 
            [token] = '${token}'
    `;
        const result = await sql.query(query);
        if (result.rowsAffected[0] > 0) {
            logger.info(`User with token ${token} updated successfully.`);
            return true;
        } else {
            logger.warn(`No user found with token ${token} to update.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error updating user with token ${token}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function getUserAnnouncements(userId) {

}

async function createAnnouncement(announcement) {

}

async function deleteAnnouncement(announcementId) {

}

async function getAnnouncementById(announcementId) {

}

async function getProperties(user_id) {

}

async function createProperty(user_id, propertyData) {

}

async function updateProperty(user_id, propertyId, propertyData) {

}

async function deleteProperty(user_id, propertyId) {

}

async function getPropertyAndUnits(user_id, propertyId) {

}

async function getUnitById(user_id, unitId) {

}

async function createUnit(user_id, propertyId, unitData) {

}

async function updateUnit(user_id, unitId, unitData) {

}

async function deleteUnit(user_id, unitId) {

}


async function associateUnitWithUser(user_id, unitId, code) {

}

async function saveCodeToDB(code, propertyId, unitId) {

}


module.exports = {
    getProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyAndUnits,
    getUnitById,
    createUnit,
    updateUnit,
    deleteUnit,
    associateUnitWithUser,
    saveCodeToDB,
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
    updateUser
};