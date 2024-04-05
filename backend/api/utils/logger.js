const winston = require('winston');
const { format } = winston;

const logger = winston.createLogger({
    level: 'info', // Minimum level to log
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        // - Write all logs of level `error` and below to `error.log`.
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        // - Write all logs of level `info` and below to `activity.log`.
        new winston.transports.File({ filename: './logs/activity.log', level: 'warn' }),
        // - Write all logs to `combined.log`.
        new winston.transports.File({ filename: './logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        ),
    }));
}

module.exports = logger;
