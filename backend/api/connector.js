const sql = require('mssql');

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
async function executeQuery(query) 
{ 
    try 
    {

        await sql.connect(config);

        const result = await sql.query(query);

        return result; 
    } 
    finally 
    {
        await sql.close();
    }
}

async function createAccount(email, token, userType, password, fullName, phoneNumber)
{
    try 
    {

        await sql.connect(config);

        const query = `insert into [dbo].[users]([user_type],[password],[email],[full_name],[token],[phone_number]) values ('${userType}', '${password}', '${email}', '${fullName}', '${token}', '${phoneNumber}')`;

        const result = await sql.query(query);

        return result; 
    } 
    finally 
    {
        await sql.close();
    }
}

//checks the email to see if it exists since they must be unqiue
async function checkEmail(email) 
{
    try 
    {
        await sql.connect(config);

        const query = `select top 1 1 from [Dwellow].[dbo].[users] where [email] = '${email}'`;

        const result = await sql.query(query);

        return result.recordset.length > 0;
    } 
    finally 
    {
        await sql.close();
    }
}

//gets any user from the database with a specific token, but since they are unique it will always be 1 user
async function getUser(token) 
{
    try 
    {
        await sql.connect(config);

        const query = `select * from users where token = '${token}'`;

        const result = await sql.query(query);

        if (result.recordset.length === 0) 
        {
            return null; 
        }
        return result;
    } 
    catch (error) 
    { 
        console.error('Error fetching user:', error);
        throw error;
    } 
    finally 
    {
        await sql.close();
    }
}

async function deleteUser(token) 
{
    try 
    {
        await sql.connect(config);

        const query = `delete from users where token = '${token}'`;

        const result = await sql.query(query);

        if (result.rowsAffected[0] > 0) {
            return true;
        } 
        else 
        {
            return false;
        }
    } 
    catch (error) 
    {
        console.error('Error deleting user:', error);
        throw error;
    } 
    finally 
    {
        await sql.close();
    }
}

async function updateUser(email, token, userType, password, fullName, phoneNumber)
{
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
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    } finally {
        await sql.close();
    }
}

module.exports = {
    executeQuery,
    createAccount,
    checkEmail,
    getUser,
    deleteUser,
    updateUser
};