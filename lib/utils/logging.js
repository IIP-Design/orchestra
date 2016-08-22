const winston = require('winston');

module.exports = (config) => {
  const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: 'info',
        colorize: true,
        timestamp: true
      }),

      new (winston.transports.File)({
        name: 'debug',
        filename: config.logging.debug_file,
        level: 'debug'
      }),

      new (winston.transports.File)({
        name: 'warning',
        filename: config.logging.error_file,
        level: 'warn',
        handleExceptions: true
      })
    ],
    exitOnError: false,
  });

  return logger;
};

