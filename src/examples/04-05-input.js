import Ubik from '../engine/Ubik.js';
import * as THREE from 'three';

const ubik = new Ubik();

class BouncingBall {
    constructor(x, y, radius, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.dead = false;

        const geometry = new THREE.CircleGeometry(this.radius, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x0095DD });
        this.circle = new THREE.Mesh(geometry, material);
        this.circle.position.set(this.x, this.y, 0);
        ubik.scene.add(this.circle);
    }

    update(dt) {
        if (!this.dead) {
            // Bounce off the walls
            if (this.x + this.radius >= ubik.window.width) {
                this.x = ubik.window.width - this.radius;
                this.speedX *= -1;
            } else if (this.x - this.radius <= -ubik.window.width) {
                this.x = -ubik.window.width + this.radius;
                this.speedX *= -1;
            }

            if (this.y + this.radius >= ubik.window.height) {
                this.y = ubik.window.height - this.radius;
                this.speedY *= -1;
            } else if (this.y - this.radius <= -ubik.window.height) {
                this.y = -ubik.window.height + this.radius;
                this.speedY *= -1;
            }

            // Update ball position
            this.x += this.speedX * dt;
            this.y += this.speedY * dt;
            this.circle.position.set(this.x, this.y, 0);
        }
        else{
            
            this.dead=false;
            this.x=0;
            this.y=0;
            this.circle.position.set(this.x, this.y, 0);
            ubik.scene.add(this.circle);
            
        }
    }
}

class Player {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.bullets = [];

        const geometry = new THREE.CircleGeometry(this.radius, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.circle = new THREE.Mesh(geometry, material);
        this.circle.position.set(this.x, this.y, 0);
        ubik.scene.add(this.circle);
    }

    update(dt) {
        if (ubik.input.isKeyPressed('ArrowUp') && this.y + this.speed * dt + this.radius <= ubik.window.height) {
            this.y += this.speed * dt;
        } else if (ubik.input.isKeyPressed('ArrowDown') && this.y - this.speed * dt - this.radius >= -ubik.window.height) {
            this.y -= this.speed * dt;
        }

        if (ubik.input.isKeyPressed('ArrowRight') && this.x + this.speed * dt + this.radius <= ubik.window.width) {
            this.x += this.speed * dt;
        } else if (ubik.input.isKeyPressed('ArrowLeft') && this.x - this.speed * dt - this.radius >= -ubik.window.width) {
            this.x -= this.speed * dt;
        }

        if (ubik.input.isMouseClicked()) {
            ubik.logger.info(`Mouse clicked at (${ubik.input.mouseX}, ${ubik.input.mouseY})`);
            const angle = Math.atan2(ubik.input.mouseY - this.y, ubik.input.mouseX - this.x);
            this.shoot(angle);
        }

        // Update player position
        this.circle.position.set(this.x, this.y, 0);
    }

    shoot(angle) {
        const bullet = new Bullet(this.x, this.y, 500, angle);
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

        const geometry = new THREE.CircleGeometry(this.radius, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.circle = new THREE.Mesh(geometry, material);
        this.circle.position.set(this.x, this.y, 0);
        ubik.scene.add(this.circle);
    }

    update(dt) {
        this.x += this.speed * Math.cos(this.angle) * dt;
        this.y += this.speed * Math.sin(this.angle) * dt;

        // Check collision with the bouncing ball
        if (
            this.x > ball.x - ball.radius &&
            this.x < ball.x + ball.radius &&
            this.y > ball.y - ball.radius &&
            this.y < ball.y + ball.radius
        ) {
            ball.dead = true;
            ubik.scene.remove(ball.circle);
        }

        // Check if the bullet is out of bounds
        if (
            this.x < -ubik.window.width ||
            this.x > ubik.window.width ||
            this.y < -ubik.window.height ||
            this.y > ubik.window.height
        ) {
            // Remove the bullet from the player's bullets array
            const index = player.bullets.indexOf(this);
            player.bullets.splice(index, 1);

            // Remove the bullet from the scene
            ubik.scene.remove(this.circle);
        }

        // Update bullet position
        this.circle.position.set(this.x, this.y, 0);
    }
}

// Create a bouncing ball
const ball = new BouncingBall(0, 0, 30, 660, 660);

// Create a player
const player = new Player(0, 0, 30, 800);

ubik.update = (dt) => {
    // Update and render the bouncing ball
    ball.update(dt);

    // Update and render the player
    player.update(dt);

    // Update and render the bullets
    for (let i = 0; i < player.bullets.length; i++) {
        player.bullets[i].update(dt);
    }
};

// Start the engine
ubik.start();