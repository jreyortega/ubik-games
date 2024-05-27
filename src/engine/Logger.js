// This is a class declaration for a Logger
export default class Logger {
    // Method to log messages with a specified level and style
    log(level, message, style) {
        // Constructing the output string with level, timestamp, and message
        const output = `%c[${level}] [${new Date().toISOString().replace('T', ' ').split('.')[0]}] ${message}`;
        // Logging the output to the console with specified style
        console.log(output, style);
    }

    // Method to log messages with 'INFO' level and green color style
    info(message) {
        this.log('INFO', message, 'color: green');
    }

    // Method to log messages with 'ERROR' level and red color style
    error(message) {
        this.log('ERROR', message, 'color: red');
    }

    // Method to log messages with 'DEBUG' level and blue color style
    debug(message) {
        this.log('DEBUG', message, 'color: blue');
    }
}
