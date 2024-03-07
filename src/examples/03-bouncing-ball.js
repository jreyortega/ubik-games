import Ubik from '../engine/Ubik.js';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class BouncingBall 
{
  constructor(x, y, radius, speedX, speedY) 
  {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  update(dt) {
    // Update position
    this.x += this.speedX * dt;
    this.y += this.speedY * dt;
  
    // Bounce off the walls
    if (this.x + this.radius >= canvas.width) {
      this.x = canvas.width - this.radius; // Move the ball inside the canvas
      this.speedX *= -1; // Reverse the x-speed
    } else if (this.x - this.radius <= 0) {
      this.x = this.radius; // Move the ball inside the canvas
      this.speedX *= -1; // Reverse the x-speed
    }
  
    if (this.y + this.radius >= canvas.height) {
      this.y = canvas.height - this.radius; // Move the ball inside the canvas
      this.speedY *= -1; // Reverse the y-speed
    } else if (this.y - this.radius <= 0) {
      this.y = this.radius; // Move the ball inside the canvas
      this.speedY *= -1; // Reverse the y-speed
    }
  }

  render() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  }
}

const ubik = new Ubik();

// Create a bouncing ball
const ball = new BouncingBall(canvas.width / 2, canvas.height / 2, 20, 100, 150);

ubik.update = (dt) => {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and render the bouncing ball
  ball.update(dt);
  ball.render();
};

ubik.start();
