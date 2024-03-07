/**
 * Represents an input handler for the game engine.
 */
export default class Input {
    /**
     * Constructs a new Input instance.
     * @param {object} ubik - The ubik object.
     */
    constructor(ubik) {
        this.logger = ubik.logger;
        this.logger.info('Input constructor called');

        this.pressedKeys = {};

        // Add event listener for keydown event
        window.addEventListener('keydown', (event) => {
            this.pressedKeys[event.key] = true;
        });

        // Add event listener for keyup event
        window.addEventListener('keyup', (event) => {
            this.pressedKeys[event.key] = false;
        });
    }

    /**
     * Checks if a specific key is currently pressed.
     * @param {string} key - The key to check.
     * @returns {boolean} - True if the key is pressed, false otherwise.
     */
    isKeyPressed(key) {
        return this.pressedKeys[key] || false;
    }
}
