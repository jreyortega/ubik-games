import Ubik from '../engine/Ubik.js';
import * as THREE from 'three';

/************** ISOMETRIC **************/
const ubik = new Ubik({ cameraType: 'isometric' });

// Speed of the player and enemy
const speed = 50;
// Player and enemy direction vectors
let playerDirection = new THREE.Vector3();
let enemyDirection = new THREE.Vector3();

// Enemy facing direction
let enemyFacingDirection = new THREE.Vector3(0, 0, 1);

// Enemy seen flag
let seen = false;

// Enemy
const enemy = ubik.mesh.createFromGeometry(
    new THREE.CylinderGeometry(5, 5, 10, 32),
    new THREE.MeshBasicMaterial({ color: 0xff0000})
);
enemy.position.set(10, 5, 0);
ubik.scene.add(enemy);

// Player
const player = ubik.mesh.createFromGeometry(
    new THREE.CylinderGeometry(5, 5, 10, 32),
    new THREE.MeshBasicMaterial({ color: 0x00ff00})
);
player.position.set(30, 5, 5);
ubik.scene.add(player);

// Grid mesh
const grid = ubik.mesh.createFromGeometry(
    new THREE.PlaneGeometry(500, 500, 75, 75),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 0.25, transparent: true })
);
grid.position.set(0, 0, 0);
grid.rotation.order = 'YXZ';
grid.rotation.y = Math.PI / 2;
grid.rotation.x = Math.PI / 2;
ubik.scene.add(grid);

// Add orbit controls
ubik.camera.addOrbitControls();

// Directional helpers
const playerDirectionalHelper = new THREE.ArrowHelper(playerDirection, player.position, 20, 0x00ff00);
ubik.scene.add(playerDirectionalHelper);
const enemyDirectionalHelper = new THREE.ArrowHelper(enemyDirection, enemy.position, 20, 0xff0000);
ubik.scene.add(enemyDirectionalHelper);
const enemyFacingDirectionalHelper = new THREE.ArrowHelper(enemyFacingDirection, enemy.position, 20, 0xffff00);
ubik.scene.add(enemyFacingDirectionalHelper);

// Vision cone parameters
const visionAngle = Math.PI / 4; // Angle of vision in radians

// Create vision cone geometry
const coneAngle = visionAngle;
const coneHeight = 20;
const coneRadius = Math.tan(coneAngle) * coneHeight;
const visionCone = ubik.mesh.createFromGeometry(
    new THREE.ConeGeometry(coneRadius, coneHeight, 32),
    new THREE.MeshBasicMaterial({ color: 0xffff00, opacity: 0.25, transparent: true })
);

visionCone.rotateX(-Math.PI / 2);

function updateVisionCone() {
    const coneTopPosition = enemy.position.clone();
    coneTopPosition.z += 10;
    visionCone.position.copy(coneTopPosition);
}

ubik.scene.add(visionCone);

// Update instructions
ubik.update = (dt) => {
    // Clear the previous direction
    playerDirection.set(0, 0, 0);

    // Move the player with the arrow keys
    if (ubik.input.isKeyPressed('ArrowUp')) {
        playerDirection.z = -1;
    } 
    if (ubik.input.isKeyPressed('ArrowDown')) {
        playerDirection.z = 1;
    } 
    if (ubik.input.isKeyPressed('ArrowLeft')) {
        playerDirection.x = -1;
    } 
    if (ubik.input.isKeyPressed('ArrowRight')) {
        playerDirection.x = 1;
    }

    // Normalize the player diagonal movement
    if (playerDirection.x !== 0 && playerDirection.z !== 0) {
        // Normalize the direction vector to ensure consistent speed in all directions
        playerDirection.normalize();
    }

    // Move the player
    player.position.x += playerDirection.x * speed * dt;
    player.position.z += playerDirection.z * speed * dt;

    // Move the enemy towards the player
    const playerPosition = player.position.clone();
    const enemyPosition = enemy.position.clone();
    enemyDirection = playerPosition.sub(enemyPosition).normalize();

    // Move the enemy if the dot product of the enemy - player direction and enemy facing direction is greater than 0.5
    if (enemyDirection.dot(enemyFacingDirection) > Math.cos(visionAngle)) {
        seen = true;
    }

    if (seen) {
        enemy.position.x += enemyDirection.x * speed * 0.5 * dt;
        enemy.position.z += enemyDirection.z * speed * 0.5 * dt;
    }

    // Update the directional helpers
    playerDirectionalHelper.setDirection(playerDirection);
    playerDirectionalHelper.position.copy(player.position);
    enemyDirectionalHelper.setDirection(enemyDirection);
    enemyDirectionalHelper.position.copy(enemy.position);
    enemyFacingDirectionalHelper.setDirection(enemyFacingDirection);
    enemyFacingDirectionalHelper.position.copy(enemy.position);

    // If the player is moving, show its directional helper
    if (playerDirection.lengthSq() > 0) {
        playerDirectionalHelper.visible = true;
    } else {
        playerDirectionalHelper.visible = false;
    }

    // If the enemy is very close to the player, hide its directional helper
    if (enemy.position.distanceTo(player.position) < 2) {
        enemyDirectionalHelper.visible = false;
    } else {
        enemyDirectionalHelper.visible = true;
    }

    // Update the vision cone
    updateVisionCone();
}

// Start the engine
ubik.start();
