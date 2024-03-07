import Logger from '../engine/Logger.js';

const logger = new Logger();

console.log('Hello, world!');

logger.info('Initializing engine...');
logger.error('Engine failed to initialize!');
logger.debug('Engine initialized!');

