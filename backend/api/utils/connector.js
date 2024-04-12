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
        const query = `DELETE FROM users WHERE user_id = '${id}'`;
        const result = await sql.query(query);
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
        const query = `
        UPDATE [dbo].[users] 
        SET 
            [user_type] = '${userType}',
            [password] = '${password}',
            [email] = '${email}',
            [full_name] = '${fullName}',
            [phone_number] = '${phoneNumber}'
        WHERE 
            [user_id] = '${id}'
    `;
        const result = await sql.query(query);
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

async function createAnnouncement(user_id, title, text, datetime) {
    try {
        await sql.connect(config);
        const query = `INSERT INTO [dbo].[announcements] ([user_id],[title],[text],[datetime]) VALUES ('${user_id}', '${title}', '${text}', '${datetime}')`;
        const result = await sql.query(query);
        logger.info('Announcements created successfully:', result);
        return result;
    } catch (error) {
        logger.error(`Error creating announcement for user ${user_id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function deleteAnnouncement(announcementId) {
    try {
        await sql.connect(config);
        const query = `DELETE FROM announcements WHERE announcement_id = '${announcementId}'`;
        const result = await sql.query(query);
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

async function createProperty(user_id, title, address, description, units) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('title', sql.NVarChar(255), title);
        request.input('address', sql.NVarChar(255), address);
        request.input('photo', sql.VarBinary(sql.MAX), null);
        request.input('description', sql.NVarChar(255), description);
        request.input('num_units', sql.Int, parseInt(units, 10));
        request.input('user_id', sql.Int, user_id);

        const result = await request.execute('AddProperty');
        logger.info('Property created successfully:', result);
        return result;
    } catch (error) {
        logger.error(`Error creating Property for user ${user_id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function updateProperty(user_id, propertyData, property_id) {
    try {
        await sql.connect(config);
        const query = `
        UPDATE [dbo].[properties] 
        SET 
            [user_id] = '${user_id}',
            [property_data] = '${propertyData}',
        WHERE 
            [property_id] = '${property_id}'
    `;
        const result = await sql.query(query);
        if (result.rowsAffected[0] > 0) {
            logger.info(`Property with property_id ${property_id} updated successfully.`);
            return true;
        } else {
            logger.warn(`No property found with property_id ${property_id} to update.`);
            return false;
        }
    } catch (error) {
        logger.error(`Error updating property with property_id ${property_id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function deleteProperty(user_id, propertyId) {
    try {
        await sql.connect(config);
        const query = `DELETE FROM properties WHERE property_id = '${propertyId}'`;
        const result = await sql.query(query);
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

async function getPropertyAndUnits(user_id, propertyId) {
    try {
        await sql.connect(config);
        const query = `SELECT 
        units.id as unit_id,
        units.unit,
        units.description,
        users.email ,
        users.full_name, 
        users.phone_number ,
        properties.id ,
        properties.title ,
        properties.address,
        properties.description AS pDescription
    FROM 
        units
    LEFT JOIN 
        users ON units.tenant_id = users.user_id
    LEFT JOIN 
        properties on units.property_id = properties.id
    WHERE
    
        units.property_id = ${propertyId}`;
        const result = await sql.query(query);
        if (result.recordset.length === 0) {
            return null;
        }
        return result;
    } catch (error) {
        logger.error(`Error fetching properties and units with user_id ${id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function getUnitById(user_id, unitId) {
    try {
        await sql.connect(config);
        const query = `SELECT * FROM properties WHERE user_id = '${user_id}'`;
        const result = await sql.query(query);
        if (result.recordset.length === 0) {
            return null;
        }
        return result;
    } catch (error) {
        logger.error(`Error fetching properties with user_id ${user_id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function createUnit(user_id, propertyId, unitData) {
    try {
        await sql.connect(config);
        const query = `INSERT INTO [dbo].[units] ([user_id],[propertyId],[unitData]) VALUES ('${user_id}', '${propertyId}', '${unitData}')`;
        const result = await sql.query(query);
        logger.info('Unit created successfully:', result);
        return result;
    } catch (error) {
        logger.error(`Error creating Unit for user ${user_id}: ${error}`);
        throw error;
    } finally {
        await sql.close();
    }
}

async function updateUnit(user_id, unitId, unitData) {
    try {
        await sql.connect(config);
        const query = `
        UPDATE [dbo].[units] 
        SET 
            [user_id] = '${user_id}',
            [unit_data] = '${unitData}',
        WHERE 
            [unit_id] = '${unitId}'
    `;
        const result = await sql.query(query);
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

async function deleteUnit(user_id, unitId) {
    try {
        await sql.connect(config);
        const query = `DELETE FROM units WHERE unit_id = '${unitId}'`;
        const result = await sql.query(query);
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

async function associateUnitWithUser(user_id, unitId, code) {

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
    getPropertyAndUnits,
    getUnitById,
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
    updateUser
};