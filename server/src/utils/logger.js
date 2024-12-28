const winston = require('winston')
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: 'error.json' }),
    new winston.transports.Console(),
  ],
})

module.exports = logger