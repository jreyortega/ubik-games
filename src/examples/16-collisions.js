import Ubik from '../engine/Ubik.js';
import sources from './sources-lunar-lander.js'; // Choose one source
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

// Create a new Ubik instance (2D game)
const ubik = new Ubik({ cameraType: 'orthographic' });

// Light
const ambientLight = ubik.light.createAmbient('white', 2); // Choose one ambient light intensity
ubik.scene.add(ambientLight);

const pointLightCharacter = ubik.light.createPoint('white', 70);
pointLightCharacter.position.set(0, 0, 0);
pointLightCharacter.distance = 30;
pointLightCharacter.decay = 2.6;
ubik.scene.add(pointLightCharacter);

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
ubik.assets.loadAssets(sources);
ubik.assets.onAssetsLoaded(() => {
    // Load character assets
    const geometry = new THREE.PlaneGeometry(8, 8);
    const material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('player'), transparent: true, alphaTest: 0.5 });
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
});

// Create player
const player = ubik.createObject();

// Create materials
const concreteMaterial = new CANNON.Material('concrete');
const plasticMaterial = new CANNON.Material('plastic');
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.5,
    }
);

ubik.physics.world.addContactMaterial(concretePlasticContactMaterial);

// Player class
class Player {
    constructor(x, y, character) {
        this.x = x;
        this.y = y;
        this.character = character;
        this.life = 100;
    }

    update(dt) {
        // Move player with WASD keys
        if (ubik.input.isKeyPressed('w')) {
            this.y += 0.35;
        }
        if (ubik.input.isKeyPressed('s')) {
            this.y -= 0.35;
        }
        if (ubik.input.isKeyPressed('a')) {
            this.x -= 0.35;
        }
        if (ubik.input.isKeyPressed('d')) {
            this.x += 0.35;
        }

        // Update player position
        this.character.position.set(this.x, this.y, -5);

        // Update character light position
        pointLightCharacter.position.set(this.x, this.y, 0);

        // Update HUD
        document.getElementById('life').innerText = `Life: ${this.life}`;
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
const playerInstance = new Player(0, 0, character);

// Instantiate enemies
const enemyInstances = enemies.map((enemy, index) => new Enemy((index - 2) * 20, 10, enemy));

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
    playerInstance.update(dt);

    // Update enemies
    enemyInstances.forEach(enemy => enemy.update(dt));

    // Collision avoidance
    collisionAvoidance(enemyInstances);
}

// Start the engine
ubik.start();
