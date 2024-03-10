import * as THREE from 'three';

export default class Renderer {
    constructor(ubik) {
        // Initialize logger, window, scene, and camera
        this.logger = ubik.logger;
        this.logger.info('Renderer constructor called');
        this.window = ubik.window;
        this.scene = ubik.scene;
        this.camera = ubik.camera;

        // Create a new WebGLRenderer instance
        this.instance = new THREE.WebGLRenderer();

        // Append the renderer's domElement to the document body
        document.body.appendChild(this.instance.domElement);

        // Set the size and pixel ratio of the renderer
        this.instance.setSize(this.window.width, this.window.height);
        this.instance.setPixelRatio(this.window.pixelRatio);
    }

    // Resize the renderer based on the window size and pixel ratio
    resize() {
        this.instance.setSize(this.window.width, this.window.height);
        this.instance.setPixelRatio(this.window.pixelRatio);
    }

    // Render the scene using the camera instance
    frame() {
        this.instance.render(this.scene, this.camera.instance);
    }
}