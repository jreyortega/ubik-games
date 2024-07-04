import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Ubik from '../engine/Ubik.js';
import sources from './source-flappy_bird.js';

const ubik = new Ubik();

ubik.logger.info('Main.js loaded');
ubik.camera.instance.position.set(0, 10, 15);
ubik.physics.world.gravity.set(0, -30.82, 0);
ubik.assets.loadAssets(sources);

// Lights
const ambientLight = ubik.light.createAmbient('white', 1);
const directionalLight = ubik.light.createDirectional('white', 1);
directionalLight.position.set(5, 5, 5);
ubik.scene.add(ambientLight);
ubik.scene.add(directionalLight);

// Bird
const bird = ubik.createObject();
ubik.logger.info('Bird created');

// Pipes
let pipes = [];
let score = 0;

// Define window view boundaries
const windowTopBoundary = 70;
const windowBottomBoundary = -40;

// Function to create a pair of pipes
function createPipePair(x) {
    const pipeHeight = 70; // Increase height to cover the screen
    const gapHeight = 22;
    const pipeWidth = 5;
    const gapY = Math.random() * -20 + 10; // Randomize gap position

    // Top pipe
    const topPipe = ubik.createObject();
    const topPipeGeometry = new THREE.PlaneGeometry(pipeWidth, pipeHeight);
    const topPipeMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('pipe') });
    ubik.addComponent(topPipe, 'mesh', ubik.mesh.createFromGeometry(topPipeGeometry, topPipeMaterial));
    topPipe.position.set(x, gapY + pipeHeight / 2 + gapHeight / 2, 0);

    // Bottom pipe
    const bottomPipe = ubik.createObject();
    const bottomPipeGeometry = new THREE.PlaneGeometry(pipeWidth, pipeHeight);
    const bottomPipeMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('pipe2') });
    ubik.addComponent(bottomPipe, 'mesh', ubik.mesh.createFromGeometry(bottomPipeGeometry, bottomPipeMaterial));
    bottomPipe.position.set(x, gapY - pipeHeight / 2 - gapHeight / 2, 0);

    // Create rigid bodies for pipes
    const pipeShape = new CANNON.Box(new CANNON.Vec3(pipeWidth / 2, pipeHeight / 2, pipeWidth / 2));

    ubik.addComponent(topPipe,
        'rigidBody',
        ubik.physics.createBody({
            mass: 0,
            position: new CANNON.Vec3(x, gapY + pipeHeight / 2 + gapHeight / 2, 0),
            shape: pipeShape
        })
    );

    ubik.addComponent(bottomPipe,
        'rigidBody',
        ubik.physics.createBody({
            mass: 0,
            position: new CANNON.Vec3(x, gapY - pipeHeight / 2 - gapHeight / 2, 0),
            shape: pipeShape
        })
    );

    return { topPipe, bottomPipe };
}

// Function to delete a pair of pipes
function deletePipePair(pipePair) {
    // Remove from scene
    if (pipePair.topPipe.mesh) {
        pipePair.topPipe.mesh.geometry.dispose();
        pipePair.topPipe.mesh.material.dispose();
        ubik.scene.remove(pipePair.topPipe.mesh);
    }
    if (pipePair.bottomPipe.mesh) {
        pipePair.bottomPipe.mesh.geometry.dispose();
        pipePair.bottomPipe.mesh.material.dispose();
        ubik.scene.remove(pipePair.bottomPipe.mesh);
    }

    // Remove from physics world
    if (pipePair.topPipe.rigidBody) {
        ubik.physics.world.removeBody(pipePair.topPipe.rigidBody);
    }
    if (pipePair.bottomPipe.rigidBody) {
        ubik.physics.world.removeBody(pipePair.bottomPipe.rigidBody);
    }
}

// Assets loaded callback
ubik.assets.onAssetsLoaded(() => {
    ubik.logger.info('Assets loaded');

    // Load background assets
    const backgroundGeometry = new THREE.PlaneGeometry(140, 80);
    const backgroundMaterial = new THREE.MeshStandardMaterial({
        map: ubik.assets.get('background'),
    });
    const background = ubik.createObject();
    ubik.addComponent(background, 'mesh', ubik.mesh.createFromGeometry(backgroundGeometry, backgroundMaterial));
    background.position.set(0, 10, -10);
    ubik.scene.add(background); // Add background to the scene

    // Load bird assets
    const geometry = new THREE.PlaneGeometry(8, 8);
    const material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('birdbody'), alphaTest: 0.5 });
    ubik.addComponent(bird, 'mesh', ubik.mesh.createFromGeometry(geometry, material));
    bird.position.set(0, 20, 0);

    // Load bird wing assets
    const wingGeometry = new THREE.PlaneGeometry(4, 4); // Reduced size
    const wingMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('birdwingdown'), alphaTest: 0.5 });

    if (wingMaterial.map) {
        ubik.logger.info('Bird wing texture loaded');
    } else {
        ubik.logger.error('Bird wing texture not loaded');
    }

    // Add wing as a child of the bird's mesh
    const birdWingMesh = new THREE.Mesh(wingGeometry, wingMaterial);
    birdWingMesh.position.set(-5, -2, 0.1); // Position the wing at the center of the bird and slightly in back

    bird.mesh.add(birdWingMesh);

    // Create initial pipes
    for (let i = 0; i < 5; i++) {
        pipes.push(createPipePair(30 + i * 30));
    }
});

// Physics component for the bird
ubik.addComponent(bird,
    'rigidBody',
    ubik.physics.createBody({
        mass: 1,
        shape: new CANNON.Sphere(3),
        fixedRotation: true, // Prevent rotation
        allowSleep: false    // Prevent the body from being put to sleep
    })
);
bird.position.set(0, 20, 0);

// Collision detection for the bird
bird.rigidBody.addEventListener('collide', (event) => {
    gameOver();
});

// Function to handle game over
function gameOver() {
    ubik.logger.info('Game Over');
    ubik.isRunning = false;

    // Reset the game
    if (confirm('Game Over! Your score: ' + score + '\nDo you want to play again?')) {
        resetGame();
    }
}

// Function to reset the game
function resetGame() {
    // Reset score
    score = 0;
    document.getElementById('score').innerText = `Score: ${score}`;

    // Reset bird position and velocity
    bird.position.set(0, 20, 0);
    bird.rigidBody.velocity.set(0, 0, 0);
    bird.rigidBody.angularVelocity.set(0, 0, 0);

    // Remove existing pipes
    pipes.forEach(pipePair => deletePipePair(pipePair));
    pipes.length = 0; // Clear the pipes array

    // Create new pipes
    for (let i = 0; i < 5; i++) {
        pipes.push(createPipePair(30 + i * 30));
    }

    // Restart the game engine
    ubik.isRunning = true;
}

// Function to update pipe positions 
function updatePipes(pipes, dt) {
    const pipeSpeed = 5; // Adjust speed as needed
    pipes.forEach(pipePair => {
        pipePair.topPipe.position.x -= pipeSpeed * dt;
        pipePair.bottomPipe.position.x -= pipeSpeed * dt;

        // Check if bird passes between pipes
        if (!pipePair.passed && bird.position.x > pipePair.topPipe.position.x) {
            pipePair.passed = true; // Mark as passed to avoid counting multiple times
            score++; // Increase score when bird passes between pipes
            document.getElementById('score').innerText = `Score: ${score}`;
            ubik.logger.info('Score: ' + score);
        }
    });

    // Remove pipes that have moved out of view and add new pipes
    if (pipes[0].topPipe.position.x < -90) {
        const oldPipePair = pipes.shift(); // Remove the first pipe pair from the pipes array
        deletePipePair(oldPipePair);

        const lastPipeX = pipes[pipes.length - 1].topPipe.position.x;
        // Create a new pipe pair and add it to the pipes array
        pipes.push(createPipePair(lastPipeX + 30));
    }
}

// Update loop
ubik.update = (dt) => {
    const rigidBody = bird.rigidBody;

    // Reset forces and velocity for more controlled jump
    if (ubik.input.isKeyPressed(' ')) {
        rigidBody.velocity.set(0, 0, 0); // Reset velocity
        const jumpForce = new CANNON.Vec3(0, 20, 0);
        rigidBody.applyLocalImpulse(jumpForce);
        bird.mesh.children[0].material.map = ubik.assets.get('birdwingup'); // Set wing texture to up
    } else {
        bird.mesh.children[0].material.map = ubik.assets.get('birdwingdown'); // Set wing texture to down
    }

    // Update pipes
    updatePipes(pipes, dt);
};

// Start the game engine
ubik.start();
