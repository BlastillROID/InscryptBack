require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'TM4hhv3oasZ4LvosqToXpV3PGlrOpduW';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '7d';

module.exports = CONFIG;