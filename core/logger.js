const path = require('path')
const winston = require('winston');

exports.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ 
      colorize: true,
      level: 'debug' 
    }),
    new (winston.transports.File)({
      filename:  path.join(STORAGE_PATH, 'logs/system.log'),
      level: 'error'
    })
  ]
});