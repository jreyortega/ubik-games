import Logger from './Logger';

class Stan {
  constructor() {
    // Game loop
    this.startTime = Date.now();
    this.lastFrameTime = this.startTime;
    this.dt = 1 / 60;
    this.totalElapsed = 0; // seconds
    this.totalElapsedInSeconds = 0; // seconds

    // Tools
    this.logger = new Logger();
    this.logger.info('Stan constructor called');

    // Custom update method overwritten by user
    this.update = () => {};
  }

  start() {
    this.isRunning = true;
    this.logger.info('Stan engine starts');
    // Start the game loop
    this.frame();
  }

  frame() {
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
}

export default Stan;
