const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => console.error('Database Connection Failed! Bad Config: ', err));

async function executeQuery(query) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

module.exports = {
    executeQuery,
};
