const winston = require('winston');

const logger = winston.createLogger({
    level: 'info', // Minimum level to log
    format: winston.format.json(), // Log format
    defaultMeta: { service: 'backend' }, // Default metadata to include in logs
    transports: [
        //
        // - Write all logs to `combined.log`.
        // - Write all logs of level `error` and below to `error.log`.
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});


if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

module.exports = logger;
