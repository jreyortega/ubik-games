export default class Input {
    constructor(ubik) {
        // Tools
        this.logger = ubik.logger;
        this.logger.info('Input constructor called');

        // Initialize an object to keep track of pressed keys
        this.pressedKeys = {};

        // Initialize a boolean variable to track mouse click
        this.mouseClicked = false;

        // Space bar state
        this.spaceBarPressed = false;

        // Mouse position
        this.mouseX = 0;
        this.mouseY = 0;

        // Previous mouse position
        this.prevMouseX = 0;
        this.prevMouseY = 0;

        // Timeout ID for resetting delta values
        this.resetTimeoutId = null;

        // Add event listener for keydown event
        window.addEventListener('keydown', (event) => {
            this.pressedKeys[event.key] = true;
            if (event.key === ' ') {
                this.spaceBarPressed = true;
            }
        });

        // Add event listener for keyup event
        window.addEventListener('keyup', (event) => {
            this.pressedKeys[event.key] = false;
            if (event.key === ' ') {
                this.spaceBarPressed = false;
            }
        });

        // Add event listener for mousedown event
        window.addEventListener('mousedown', () => {
            this.mouseClicked = true;
            // Update previous mouse position
            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;
        });

        // Add event listener for mouseup event
        window.addEventListener('mouseup', () => {
            this.mouseClicked = false;
        });

        // Add event listener for mousemove event
        window.addEventListener('mousemove', (event) => {
            // Update previous mouse position
            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;

            // Get canvas bounding rectangle
            const canvasBounds = ubik.renderer.instance.domElement.getBoundingClientRect();

            // Calculate mouse position relative to canvas
            const mouseX = (event.clientX - canvasBounds.left) / canvasBounds.width * 2 - 1;
            const mouseY = -((event.clientY - canvasBounds.top) / canvasBounds.height * 2 - 1);

            // Transform mouse position to real coordinates
            this.mouseX = mouseX * ubik.window.width;
            this.mouseY = mouseY * ubik.window.height;

            // Calculate change in mouse position
            const deltaX = this.mouseX - this.prevMouseX;
            const deltaY = this.mouseY - this.prevMouseY;

            // Reset delta values after 1 second if not updated
            clearTimeout(this.resetTimeoutId);
            this.resetTimeoutId = setTimeout(() => {
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
            }, 100);
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

    // Get the change in mouse position since the last frame
    getMouseDelta() {
        return {
            deltaX: this.mouseX - this.prevMouseX,
            deltaY: this.mouseY - this.prevMouseY
        };
    }

    // Get the current mouse position
    getMousePosition() {
        return {
            x: this.mouseX,
            y: this.mouseY
        };
    }

    // Check if the space bar is currently pressed
    isSpaceBarPressed() {
        return this.spaceBarPressed;
    }
}
