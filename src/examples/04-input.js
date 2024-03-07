import Ubik from '../engine/Ubik.js';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class BouncingBall {
  constructor(x, y, radius, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
    this.dead = false;
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
    if (!this.dead) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
    }
  }
}

class Player {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.input = Ubik.input;
    this.bullets = [];
  }

  update(dt) {
    if (ubik.input.isKeyPressed('ArrowUp')) {
      this.y -= this.speed * dt;
    }
    if (ubik.input.isKeyPressed('ArrowDown')) {
      this.y += this.speed * dt;
    }
    if (ubik.input.isKeyPressed('ArrowLeft')) {
      this.x -= this.speed * dt;
    }
    if (ubik.input.isKeyPressed('ArrowRight')) {
      this.x += this.speed * dt;
    }

    // Ensure the player stays within the canvas bounds
    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
    this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));

    // Handle shooting bullets when mouse is clicked
    canvas.addEventListener('mousedown', (event) => {
      const angle = Math.atan2(event.clientY - this.y, event.clientX - this.x);
      this.shoot(angle);
    });
  }

  render() {
    ctx.fillStyle = '#DD0095';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  shoot(angle) {
    const bulletSpeed = 1000; // Adjust bullet speed as needed
    const bullet = new Bullet(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, angle);
    this.bullets.push(bullet);
  }
}

class Bullet {
  constructor(x, y, speed, angle) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = angle;
    this.radius = 5;
  }

  update(dt) {
    // Move the bullet in the direction specified by the angle
    this.x += this.speed * Math.cos(this.angle) * dt;
    this.y += this.speed * Math.sin(this.angle) * dt;

    // Check if the bullet is out of bounds
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      // Remove the bullet from the player's bullets array
      const index = player.bullets.indexOf(this);
      player.bullets.splice(index, 1);
    }

    // Check for collision with the bouncing ball
    if (this.x > ball.x - ball.radius &&
        this.x < ball.x + ball.radius &&
        this.y > ball.y - ball.radius &&
        this.y < ball.y + ball.radius) {
      // Remove the bullet from the player's bullets array
      const index = player.bullets.indexOf(this);
      player.bullets.splice(index, 1);

      // Set the ball as dead
      ball.dead = true;
    }
  }

  render() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.closePath();
  }
}

// Create game engine instance
const ubik = new Ubik();

// Create a bouncing ball
const ball = new BouncingBall(canvas.width / 2, canvas.height / 2, 20, 100, 150);

// Create a player
const player = new Player(50, 400, 50, 50, 200);

ubik.update = (dt) => {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and render the bouncing ball
  ball.update(dt);
  ball.render();

  // Update and render the player
  player.update(dt);
  player.render();

  // Update and render the bullets
  player.bullets.forEach((bullet) => {
    bullet.update(dt);
    bullet.render();
  });
};

ubik.start();
