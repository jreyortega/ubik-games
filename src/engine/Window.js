import { EventDispatcher } from "three";

export default class Window extends EventDispatcher {
    constructor(ubik) {
        super();

        this.logger = ubik.logger;
        this.logger.info("Window constructor called");

        // Initialize width and height with the current window dimensions
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Calculate the aspect ratio based on the width and height
        this.aspectRatio = this.width / this.height;

        // Calculate the pixel ratio based on the device pixel ratio and a maximum value of 2
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // Listen to window resize event and call the onResize method
        window.addEventListener("resize", () => {
            this.resize();
        });
    }

    // Method called when the window is resized
    resize() {
        // Update the width and height with the new window dimensions
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Recalculate the aspect ratio based on the updated width and height
        this.aspectRatio = this.width / this.height;

        // Recalculate the pixel ratio based on the device pixel ratio and a maximum value of 2
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // Dispatch a resize event
        this.dispatchEvent({ type: "resize" });
    }
}
