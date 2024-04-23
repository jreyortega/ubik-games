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

        // Asset manager
        this.assets = new AssetManager(this);

        //Physics
        this.physics = new  Physics(this);

        // Events
        this.window.addEventListener('resize', (e) => {
            this.resize(e);
        });

        this.objects = [];

        // Custom update method overwritten by user
        this.update = () => { };
    }

    createObject() {
        let object = new THREE.Object3D();
        this.logger.info('Created object ' + object.name + ' #' + object.id);
        this.objects.push(object);
    
        return object;
      }
    
    getObjects() {
    return this.objects;
    }

    getObjectById(id) {
    return this.objects.find((object) => object.id == id);
    }

    addComponentToObject(object, componentName, data) {
    data.objectID = object.id;
    object[componentName] = data;
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

        for (const object of this.objects) 
        {
            if (object.rigidbody)
            {
                object.rigidbody.position.copy(object.position)
                object.rigidbody.quaternion.copy(object.quaternion)
            }
        }

        this.physics.Update(this.dt,this.objects)
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
