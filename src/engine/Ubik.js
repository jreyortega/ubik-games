import * as THREE from 'three'

import Logger from './Logger';
import Input from './Input';
import Camera from './Camera';
import Renderer from './Renderer';
import Window from './Window';
// Define the Ubik class
class Ubik {
  constructor() {
    // GAME LOOP ------------------------------------
    this.startTime = Date.now();
    this.lastFrameTime = this.startTime;
    this.dt = 1 / 60;
    this.totalElapsed = 0; // seconds
    this.totalElapsedInSeconds = 0; // seconds

    //TOOLS ----------------------------------
    // Logger
    this.logger = new Logger();
    this.logger.info('Ubik constructor called');
    // Input
    this.input = new Input(this);
    //Camera
    this.camera = new Camera(this);
    //Window
    this.window = new Window(this);
    //Scene
    this.scene = new THREE.Scene();
    //Renderer
    this.renderer = new Renderer(this);

    //EVENTS ------------------------------------
    //Resizing event
    this.window.addEventListener("resize", (e) => {this.resize(e)})

    //METHODS ----------------------------------
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
      return; // Exit the frame loop if the game is not running
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

    // Check input
    // Physics update
    // Custom update
    this.update(this.dt);

    // Rendering
  }

  //Used by resizing event
  resize(e){
    this.logger.debug('Resize event: ' + this.window.width +  ', ' + this.window.height);
    this.camera.resize()
    this.renderer.resize()
  }
}

// Export the Ubik class
export default Ubik;
