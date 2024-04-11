import * as THREE from 'three';
import Logger from './Logger';
import Input from './Input';
import Window from './Window';
import Renderer from './Renderer';
import Camera from './Camera';
import Mesh from './Mesh';
import Light from './Light';

class Ubik {
    constructor(options = {}) {
        // Options
        const { cameraType = 'orthographic', fov = 75 } = options;

        // Game loop
        this.startTime = Date.now();
        this.lastFrameTime = this.startTime;
        this.dt = 1 / 60;
        this.totalElapsed = 0; // seconds
        this.totalElapsedInSeconds = 0; // seconds

        // Logger
        this.logger = new Logger();
        this.logger.info('Ubik constructor called');

        // Input
        this.input = new Input(this);

        // Window
        this.window = new Window(this);

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new Camera(this, cameraType, fov);

        // Renderer
        this.renderer = new Renderer(this);

        // Mesh
        this.mesh = new Mesh(this);

        //Light

        this.light = new Light(this)

        // Events
        this.window.addEventListener('resize', (e) => {
            this.resize(e);
        });

        // Custom update method overwritten by user
        this.update = () => {};
    }

    // Start the game engine
    start() {
        this.isRunning = true;
        this.logger.info('Ubik engine starts');
        // Start the game loop
        this.frame();
    }

    // Game loop
    frame() {
        // Check if the game is running
        if (!this.isRunning) {
            return;
        }

        // Ask the browser to call this method ASAP
        window.requestAnimationFrame(() => {
            this.frame();
        });

        // Calculate dt
        const now = Date.now();
        this.dt = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;
        this.totalElapsed = this.lastFrameTime - this.startTime;
        this.totalElapsedInSeconds = this.totalElapsed / 1000;

        // Custom update
        this.update(this.dt);

        // Rendering
        this.renderer.frame();
    }

    // Resize the game
    resize(e) {
        this.logger.debug('Ubik resize called. Window size: ' + this.window.width + " x " + this.window.height);
        // Propagate the event
        this.camera.resize();
        this.renderer.resize();
    }
}

// Export the Ubik class
export default Ubik;
