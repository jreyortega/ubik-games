export default class Input {
    constructor(ubik) {
        // Tools
        this.logger = ubik.logger;
        this.logger.info('Input constructor called');

        // Initialize an object to keep track of pressed keys
        this.pressedKeys = {};

        // Initialize a boolean variable to track mouse click
        this.mouseClicked = false;

        // Mouse position
        this.mouseX = 0;
        this.mouseY = 0;

        // Add event listener for keydown event
        window.addEventListener('keydown', (event) => {
            this.pressedKeys[event.key] = true;
        });

        // Add event listener for keyup event
        window.addEventListener('keyup', (event) => {
            this.pressedKeys[event.key] = false;
        });

        // Add event listener for mousedown event
        window.addEventListener('mousedown', () => {
            this.mouseClicked = true;
        });

        // Add event listener for mouseup event
        window.addEventListener('mouseup', () => {
            this.mouseClicked = false;
        });

        // Add event listener for mousemove event
        window.addEventListener('mousemove', (event) => {
            // Get canvas bounding rectangle
            const canvasBounds = ubik.renderer.instance.domElement.getBoundingClientRect();

            // Calculate mouse position relative to canvas
            this.mouseX = (event.clientX - canvasBounds.left) / canvasBounds.width * 2 - 1;
            this.mouseY = -((event.clientY - canvasBounds.top) / canvasBounds.height * 2 - 1);

            // Transform mouse position to real coordinates
            this.mouseX = this.mouseX * ubik.window.width;
            this.mouseY = this.mouseY * ubik.window.height;
        });
    }

    // Check if a specific key is currently pressed
    isKeyPressed(key) {
        return this.pressedKeys[key] || false;
    }

    // Check if the mouse is currently clicked
    isMouseClicked() {
        return this.mouseClicked;
    }
}
