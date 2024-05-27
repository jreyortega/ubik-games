import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Ubik from '../engine/Ubik.js';
import sources from './sources-collisions.js';


// Create a new Ubik instance
const ubik = new Ubik({ cameraType: 'orthographic' });
ubik.physics.world.gravity.set(0, -9.82, 0); // Set gravity

// Light
const ambientLight = ubik.light.createAmbient('white', 0.5);
ubik.scene.add(ambientLight);

// Add orbit controls
ubik.camera.addOrbitControls();

// Define groups
const playerGroup = 'player';
const enemyGroup = 'enemies';

const background = ubik.createObject();

// Create player
const player = ubik.createObject(playerGroup);

ubik.addComponentToObject(
    player,
    'mesh',
    ubik.mesh.createFromGeometry(
        new THREE.SphereGeometry(1),
        new THREE.MeshStandardMaterial({ color: 'blue' })
    )
);
ubik.addComponentToObject(
    player,
    'rigidbody',
    ubik.physics.createBody({
        mass: 1,
        shape: new CANNON.Sphere(1),
        material: new CANNON.Material('playerMaterial'),
        collisionFilterGroup: playerGroup, // Collision group for player
        collisionFilterMask: enemyGroup, // Collides with group 2 (enemies)
    })
);
player.position.set(0, 5, 0);
player.health = 100;

// Create enemies
const enemies = [];
for (let i = 0; i < 5; i++) {
    const enemy = ubik.createObject(enemyGroup);
    ubik.addComponentToObject(
        enemy,
        'mesh',
        ubik.mesh.createFromGeometry(
            new THREE.SphereGeometry(1),
            new THREE.MeshStandardMaterial({ color: 'red' })
        )
    );
    ubik.addComponentToObject(
        enemy,
        'rigidbody',
        ubik.physics.createBody({
            mass: 1,
            shape: new CANNON.Sphere(1),
            material: new CANNON.Material('enemyMaterial'),
            collisionFilterGroup: enemyGroup, // Collision group for enemies
            collisionFilterMask: playerGroup, // Collides with group 1 (player)
        })
    );
    enemy.position.set(Math.random() * 10 - 5, 5, Math.random() * 10 - 5);
    enemies.push(enemy);
}

// Load assets
ubik.assets.loadAssets(sources);
ubik.assets.onAssetsLoaded(() => {
    player.mesh.material.map = ubik.assets.get('player');
    player.mesh.material.transparent = true;
    player.mesh.material.alphaTest = 0.5;

    enemies.forEach((enemy) => {
        enemy.mesh.material.map = ubik.assets.get('enemy');
        enemy.mesh.material.transparent = true;
        enemy.mesh.material.alphaTest = 0.5;
    });

    // Load background assets
    const backgroundGeometry = new THREE.PlaneGeometry(200, 100);
    const backgroundMaterial = new THREE.MeshStandardMaterial({
        map: ubik.assets.get('background'),
    });
    ubik.addComponentToObject(background, 'mesh', ubik.mesh.createFromGeometry(backgroundGeometry, backgroundMaterial));
    background.position.set(0, 0, -10);
});

// Collision Event Handling
player.rigidbody.addEventListener('collide', (e) => {
    const otherBody = e.body;
    if (otherBody.userData && otherBody.userData.group === enemyGroup) {
        handlePlayerCollisionWithEnemy(otherBody);
    }
});

enemies.forEach((enemy) => {
    enemy.rigidbody.addEventListener('collide', (e) => {
        const otherBody = e.body;
        if (otherBody.userData && otherBody.userData.group === enemyGroup) {
            console.log('Enemy hits Enemy');
        } else if (otherBody.userData && otherBody.userData.group === playerGroup) {
            handlePlayerCollisionWithEnemy(enemy.rigidbody);
        }
    });
});

function handlePlayerCollisionWithEnemy(enemyBody) {
    player.health -= 10;
    document.getElementById('life').innerText = `Life: ${player.health}`;
    if (player.health <= 0) {
        window.alert('Game Over!');
        ubik.stop();
    }
}

// Player movement
ubik.update = (dt) => {
    // Move player with WASD keys
    if (ubik.input.isKeyPressed('w')) {
        player.position.y += 0.35;
    }
    if (ubik.input.isKeyPressed('s')) {
        player.position.y -= 0.35;
    }
    if (ubik.input.isKeyPressed('a')) {
        player.position.x -= 0.35;
    }
    if (ubik.input.isKeyPressed('d')) {
        player.position.x += 0.35;
    }

    // Update enemies
    // Move enemies towards the player
    const speed = 0.05; // Adjust the speed here
    enemies.forEach((enemy) => {
        const dx = player.position.x - enemy.position.x;
        const dy = player.position.y - enemy.position.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance > 0) {
            enemy.position.x += (dx / distance) * speed;
            enemy.position.y += (dy / distance) * speed;
        }
    });

    // Update HUD
    document.getElementById('life').innerText = `Life: ${player.health}`;
};

// Start the game
ubik.start();
