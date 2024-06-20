import * as THREE from 'three';
import Logger from './Logger';
import Input from './Input';
import Window from './Window';
import Renderer from './Renderer';
import Camera from './Camera';
import Mesh from './Mesh';
import Light from './Light';
import AssetManager from './AssetManager';
import Physics from './Physics';
import Forces from './Forces';

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

        // Light
        this.light = new Light(this)

        // Asset manager
        this.assets = new AssetManager(this);

        // Physics
        this.physics = new Physics(this);

        // Objects
        this.objects = [];

        // Forces
        this.forces = new Forces();

        // Events
        this.window.addEventListener('resize', (e) => {
            this.resize(e);
        });

        // Custom update method overwritten by user
        this.update = () => { };
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

        // Update object's position and rotation if changed in update method
        for (const object of this.objects) {
            // Update mesh
            if (object.mesh) {
                object.mesh.position.copy(object.position);
                object.mesh.quaternion.copy(object.quaternion);
            }

            // Update rigid body
            if (object.rigidBody) {
                object.rigidBody.position.copy(object.position);
                object.rigidBody.quaternion.copy(object.quaternion);
            }
        }

        // Physics
        this.physics.update(this.dt, this.objects);

        // Rendering
        this.renderer.frame();

        // Update camera
        this.camera.frame();
    }

    // Resize the game
    resize(e) {
        this.logger.debug('Ubik resize called. Window size: ' + this.window.width + " x " + this.window.height);
        // Propagate the event
        this.camera.resize();
        this.renderer.resize();
    }

    // Create a new object
    createObject() {
        const object = new THREE.Object3D();
        this.logger.debug('Created object' + object.name + ' with id ' + object.id);
        this.objects.push(object);
        this.scene.add(object);
        return object;
    }

    // Get objects
    getObjects() {
        return this.objects;
    }

    // Get an object by ID
    getObjectById(id) {
        return this.objects.find(object => object.id === id);
    }

    // Add component to object
    addComponent(object, componentName, componentData) {
        componentData.objectID = object.id;
        object[componentName] = componentData;
    }
}

// Export the Ubik class
export default Ubik;
