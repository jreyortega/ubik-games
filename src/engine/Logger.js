export default class Logger {
    // Method to log messages with a specified level
    log(level, message) {
        // Constructing the output string with level, timestamp, and message
        const output = `[${level}] [${new Date().toISOString().replace('T', ' ').split('.')[0]}] ${message}`;
        // Logging the output to the console
        console.log(output);
    }

    // Method to log messages with 'INFO' level
    info(message) {
        this.log('INFO', message);
    }

    // Method to log messages with 'ERROR' level
    error(message) {
        this.log('ERROR', message);
    }

    // Method to log messages with 'DEBUG' level
    debug(message) {
        this.log('DEBUG', message);
    }
}
