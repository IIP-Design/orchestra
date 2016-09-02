const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'info',
      colorize: true,
      timestamp: true
    }),

    new (winston.transports.File)({
      name: 'debug',
      filename: global.debug_file,
      level: 'debug'
    }),

    new (winston.transports.File)({
      name: 'warning',
      filename: global.error_file,
      level: 'warn',
      handleExceptions: true
    })
  ],
  exitOnError: false,
});

module.exports = logger;

