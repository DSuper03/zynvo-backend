import winston from 'winston';

let level: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly' =
  'silly';

switch (process.env.NODE_ENV) {
  case 'production':
    level = 'info';
    break;
  case 'development':
    level = 'debug';
    break;
  case 'staging':
    level = 'debug';
    break;
}

export const logger = winston.createLogger({
  level,
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
