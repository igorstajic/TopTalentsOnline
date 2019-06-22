const { createLogger, format, transports } = require('winston');
const { combine, timestamp, colorize, printf } = format;
const appConfig = require('./configs')();

const myFormat = printf(({ level, message }) => {
  return `${level}: ${message}`;
});
const logger = createLogger({
  level: appConfig.logs.level || 'silly',
  format: combine(colorize(), timestamp(), myFormat),
  transports: [
    new transports.Console({
      colorize: true,
      name: 'console',
      timestamp: () => new Date(),
    }),
  ],
});

if (process.env.SILENCE_ERRORS === 'true') logger.error = () => {};
module.exports.logger = logger;
