import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera {
    constructor(ubik, cameraType = 'orthographic', fov = 75) {
        this.logger = ubik.logger;
        this.logger.info('Camera constructor called');

        this.window = ubik.window;
        this.scene = ubik.scene;
        this.renderer = ubik.renderer;

        if (cameraType === 'orthographic') {
            // Set up orthographic camera for 2D games
            const aspect = this.window.width / this.window.height;
            const zoom = 40;
            this.instance = new THREE.OrthographicCamera(
                -zoom * aspect,
                zoom * aspect,
                zoom,
                -zoom,
                1,
                1000
            );
            // Set the position of the camera
            this.instance.position.set(0, 0, 125);
            // Set the near and far planes
            this.instance.near = -1000;
            this.instance.far = 1000;
        } else if (cameraType === 'perspective') {
            // Create an instance of PerspectiveCamera
            this.instance = new THREE.PerspectiveCamera(
                fov, // Field of view
                this.window.aspectRatio, // Aspect ratio
                0.1, // Near plane
                1000 // Far plane
            );
            // Set the position of the camera
            this.instance.position.set(0, 0, 125);
        } else if (cameraType === 'isometric') {
            // Create an instance of OrthographicCamera
            this.instance = new THREE.OrthographicCamera(
                -this.window.width,
                this.window.width,
                this.window.height,
                -this.window.height
            );
            // Set the camera position and rotation for isometric view
            this.instance.position.set(100, 100, 100);
            // Set the camera rotation to isometric view
            this.instance.rotation.order = 'YXZ';
            this.instance.rotation.y = Math.PI / 4;
            this.instance.rotation.x = Math.atan(-1 / Math.sqrt(2));
            this.instance.zoom = 20;
            // Set the near and far planes
            this.instance.near = -1000;
            this.instance.far = 1000;
        } else {
            // Throw an error if the camera type is unknown
            throw new Error(`Unknown camera type: ${cameraType}`);
        }

        // Update the projection matrix
        this.instance.updateProjectionMatrix();

        // Add the camera to the scene
        this.scene.add(this.instance);
    }

    // Add orbit controls to the camera
    addOrbitControls() {
        this.controls = new OrbitControls(this.instance, document.body);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;

        // Adjust the speed of the orbit controls
        this.controls.rotateSpeed = 0.025;
        this.controls.zoomSpeed = 1;
    }

    // Resize the camera based on the window aspect ratio
    resize() {
        if (this.instance instanceof THREE.PerspectiveCamera) {
            this.resizePerspectiveCamera();
        } else if (this.instance instanceof THREE.OrthographicCamera) {
            this.resizeOrthographicCamera();
        }
    }

    // Resize the perspective camera
    resizePerspectiveCamera() {
        this.instance.aspect = this.window.aspectRatio;
        this.instance.updateProjectionMatrix();
    }

    // Resize the orthographic camera
    resizeOrthographicCamera() {
        const aspect = this.window.width / this.window.height;
        const zoom = 40;

        // Update the camera's view volume
        this.instance.left = -zoom * aspect;
        this.instance.right = zoom * aspect;
        this.instance.top = zoom;
        this.instance.bottom = -zoom;

        // Ensure the near and far planes remain unchanged
        this.instance.near = -1000;
        this.instance.far = 1000;

        this.instance.updateProjectionMatrix();
    }

    frame() {
        if (this.controls && this.controls.enabled) {
            this.controls.update();
        }
    }
}
