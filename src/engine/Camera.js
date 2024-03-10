import * as THREE from 'three';

export default class Camera {
    constructor(ubik) {
        this.logger = ubik.logger;
        this.logger.info('Camera constructor called');

        this.window = ubik.window;
        this.scene = ubik.scene;

        // Create an instance of OrthographicCamera
        this.instance = new THREE.OrthographicCamera(
            -this.window.width,
            this.window.width,
            this.window.height,
            -this.window.height
        );

        // Set the position of the camera
        this.instance.position.set(0, 0, 125);

        // Add the camera to the scene
        this.scene.add(this.instance);
    }

    // Resize the camera based on the window aspect ratio
    resize() {
        // Update the camera's view volume
        this.instance.left = -this.window.width;
        this.instance.right = this.window.width;
        this.instance.top = this.window.height;
        this.instance.bottom = -this.window.height;

        // Ensure the near and far planes remain unchanged
        this.instance.near = -1000;
        this.instance.far = 1000;

        this.instance.aspect = this.window.aspectRatio;
        this.instance.updateProjectionMatrix();
    }
}