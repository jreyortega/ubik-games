import Ubik from '../engine/Ubik.js';
import sources from './sources-animation.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import gsap from 'gsap';

// Create a new Ubik instance (2D game)
const ubik = new Ubik({ cameraType: 'orthographic' });

// Light
const ambientLight = ubik.light.createAmbient('white', 0.01);
const pointLightCharacter = ubik.light.createPoint('white', 70);
pointLightCharacter.position.set(0, 0, 0);
pointLightCharacter.distance = 30;
pointLightCharacter.decay = 2.6;
ubik.scene.add(pointLightCharacter);
ubik.scene.add(ambientLight);

// Add orbit controls
ubik.camera.addOrbitControls();

// Create character
const character = ubik.createObject();

// Create enemies
const enemies = [];
for (let i = 0; i < 5; i++) {
    const enemy = ubik.createObject();
    enemies.push(enemy);
}

// Create the background
const background = ubik.createObject();

// Load assets
let onAssetsLoadedFinished = false;
ubik.assets.loadAssets(sources);
ubik.assets.onAssetsLoaded(() => {
    // Load character assets
    const geometry = new THREE.PlaneGeometry(8, 8);
    const material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('player_static'), transparent: true, alphaTest: 0.5 });
    ubik.addComponent(character, 'mesh', ubik.mesh.createFromGeometry(geometry, material));

    // Load enemy assets
    const enemyGeometry = new THREE.PlaneGeometry(8, 8);
    const enemyMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('enemy'), transparent: true, alphaTest: 0.5 });
    enemies.forEach((enemy) => {
        ubik.addComponent(enemy, 'mesh', ubik.mesh.createFromGeometry(enemyGeometry, enemyMaterial));
    });

    // Load background assets
    const backgroundGeometry = new THREE.PlaneGeometry(200, 100);
    const backgroundMaterial = new THREE.MeshStandardMaterial({
        map: ubik.assets.get('background'),
    });
    ubik.addComponent(background, 'mesh', ubik.mesh.createFromGeometry(backgroundGeometry, backgroundMaterial));
    background.position.set(0, 0, -10);

    // Set the flag to true
    onAssetsLoadedFinished = true;
});

class Player {
    constructor(x, y, character) {
        this.x = x;
        this.y = y;
        this.character = character;
        this.life = 100;
        this.isWalking = false;
        this.animationStarted = false;
        this.animationTimeline = null;
        this.currentDirection = null; // Track the current direction of the player
    }

    update(dt) {
        let isMoving = false;
        let newDirection = null;

        if (ubik.input.isKeyPressed('w')) {
            this.y += 0.25;
            newDirection = 'up';
            isMoving = true;
        }
        if (ubik.input.isKeyPressed('s')) {
            this.y -= 0.25;
            newDirection = 'down';
            isMoving = true;
        }
        if (ubik.input.isKeyPressed('a')) {
            this.x -= 0.25;
            newDirection = 'left';
            isMoving = true;
        }
        if (ubik.input.isKeyPressed('d')) {
            this.x += 0.25;
            newDirection = 'right';
            isMoving = true;
        }

        if (isMoving) {
            this.isWalking = true;
            if (newDirection !== this.currentDirection) {
                this.currentDirection = newDirection;
                this.stopWalkingAnimation();
                this.startWalkingAnimation(newDirection);
            }
        } else if (onAssetsLoadedFinished) {
            this.isWalking = false;
            this.currentDirection = null;
            this.stopWalkingAnimation();
        }

        // Update player position
        this.character.position.set(this.x, this.y, -5);

        // Update character light position
        pointLightCharacter.position.set(this.x, this.y, 0);

        // Update HUD
        document.getElementById('life').innerText = `Life: ${this.life}`;
    }

    startWalkingAnimation(direction) {
        let animationFunction;
        switch (direction) {
            case 'right':
                animationFunction = this.startWalkingAnimationRight;
                break;
            case 'left':
                animationFunction = this.startWalkingAnimationLeft;
                break;
            case 'up':
                animationFunction = this.startWalkingAnimationUp;
                break;
            case 'down':
                animationFunction = this.startWalkingAnimationDown;
                break;
        }

        if (typeof animationFunction === 'function') {
            animationFunction.call(this);
            this.animationStarted = true;
        }
    }

    startWalkingAnimationRight() {
        this.animationTimeline = gsap.to({}, {
            duration: 0.25,
            repeat: -1,
            onUpdate: () => {
                const progress = this.animationTimeline.time() % 0.25;
                const frameIndex = progress < 0.125 ? 1 : 2;
                const textureName = `player_walk_right${frameIndex}`;
                const texture = ubik.assets.get(textureName);

                if (texture) {
                    this.character.mesh.material.map = texture;
                    this.character.mesh.material.needsUpdate = true;
                }
            }
        });
    }

    startWalkingAnimationLeft() {
        this.animationTimeline = gsap.to({}, {
            duration: 0.25,
            repeat: -1,
            onUpdate: () => {
                const progress = this.animationTimeline.time() % 0.25;
                const frameIndex = progress < 0.125 ? 1 : 2;
                const textureName = `player_walk_left${frameIndex}`;
                const texture = ubik.assets.get(textureName);

                if (texture) {
                    this.character.mesh.material.map = texture;
                    this.character.mesh.material.needsUpdate = true;
                }
            }
        });
    }

    startWalkingAnimationUp() {
        this.animationTimeline = gsap.to({}, {
            duration: 0.25,
            repeat: -1,
            onUpdate: () => {
                const progress = this.animationTimeline.time() % 0.25;
                const frameIndex = progress < 0.125 ? 1 : 2;
                const textureName = `player_walk_up${frameIndex}`;
                const texture = ubik.assets.get(textureName);

                if (texture) {
                    this.character.mesh.material.map = texture;
                    this.character.mesh.material.needsUpdate = true;
                }
            }
        });
    }

    startWalkingAnimationDown() {
        this.animationTimeline = gsap.to({}, {
            duration: 0.25,
            repeat: -1,
            onUpdate: () => {
                const progress = this.animationTimeline.time() % 0.25;
                const frameIndex = progress < 0.125 ? 1 : 2;
                const textureName = `player_walk_down${frameIndex}`;
                const texture = ubik.assets.get(textureName);

                if (texture) {
                    this.character.mesh.material.map = texture;
                    this.character.mesh.material.needsUpdate = true;
                }
            }
        });
    }

    stopWalkingAnimation() {
        if (this.animationTimeline) {
            this.animationTimeline.kill();
            this.animationStarted = false;
        }
    }
}

// Enemy class
class Enemy {
    constructor(x, y, enemy) {
        this.x = x;
        this.y = y;
        this.enemy = enemy;
        this.playerSeen = false;
        this.damageCooldown = 200;
        this.lastDamageTime = 0;
    }

    update(dt) {
        // Update enemy position
        this.enemy.position.set(this.x, this.y, -6);

        // Calculate distance between player and enemy
        let distance = Math.sqrt((player.x - this.x) ** 2 + (player.y - this.y) ** 2);

        // Check for sight collision
        if (distance < 20 && !this.playerSeen) {
            // Handle collision
            console.log('Player seen!');
            this.playerSeen = true;
        }

        // Check for damage collision
        const currentTime = Date.now();
        if (distance < 5 && currentTime - this.lastDamageTime > this.damageCooldown) {
            // Handle collision
            this.lastDamageTime = currentTime;
            player.life -= 2;
            if (player.life <= 0) {
                player.life = 0;
                document.getElementById('life').innerText = `Life: ${player.life}`;
                window.alert('Game Over!');
            }
        }

        // Move enemy towards player
        if (this.playerSeen) {
            const speed = 0.1; // Adjust the speed here
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
            const normalizedDx = dx / distance;
            const normalizedDy = dy / distance;
            this.x += normalizedDx * speed;
            this.y += normalizedDy * speed;
        }
    }
}

// Instantiate player
const player = new Player(0, 0, character);

// Instantiate enemies
const enemy1 = new Enemy(50, 10, enemies[0]);
const enemy2 = new Enemy(-25, 20, enemies[1]);
const enemy3 = new Enemy(30, -34, enemies[2]);
const enemy4 = new Enemy(-40, -30, enemies[3]);
const enemy5 = new Enemy(20, 25, enemies[4]);

// Enemy instances list
const enemyInstances = [enemy1, enemy2, enemy3, enemy4, enemy5];

// Collision avoidance function for enemies
function collisionAvoidance(enemies) {
    const minDistance = 7; // Minimum distance between enemies
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            const speed = 0.1;
            const dx = enemies[j].x - enemies[i].x;
            const dy = enemies[j].y - enemies[i].y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
            if (distance < minDistance) {
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                enemies[i].x -= normalizedDx * speed;
                enemies[i].y -= normalizedDy * speed;
                enemies[j].x += normalizedDx * speed;
                enemies[j].y += normalizedDy * speed;
            }
        }
    }
}

// Update instructions
ubik.update = (dt) => {
    // Update player
    player.update(dt);

    // Update enemies
    enemy1.update(dt);
    enemy2.update(dt);
    enemy3.update(dt);
    enemy4.update(dt);
    enemy5.update(dt);

    // Collision avoidance
    collisionAvoidance(enemyInstances);
}

// Start the engine
ubik.start();
