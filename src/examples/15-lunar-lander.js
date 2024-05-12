import Ubik from '../engine/Ubik.js';
import sources from './sources-lunar-lander.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

// Create a new Ubik instance (2D game)
const ubik = new Ubik({ cameraType: 'orthographic' });

// Gravity
ubik.physics.world.gravity.set(0, -9.82, 0);

// Light
const ambientLight = ubik.light.createAmbient('white', 2);
ubik.scene.add(ambientLight);

// Add orbit controls
ubik.camera.addOrbitControls();

// Create spaceship
const ship = ubik.createObject();

// Create the ground
const ground = ubik.createObject();

// Create the background
const background = ubik.createObject();

// Load assets
ubik.assets.loadAssets(sources);
ubik.assets.onAssetsLoaded(() => {
    // Load spaceship assets
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('player'), transparent: true, alphaTest: 0.5});
    ubik.addComponent(ship, 'mesh', ubik.mesh.createFromGeometry(geometry, material));
    ubik.addComponent(
        ship,
        'rigidBody',
        ubik.physics.createBody({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(10, 10, 0.1)), // Adjust dimensions as needed
        })
    );
    ship.position.set(0, 0, 10);

    // Load ground assets
    const groundGeometry = new THREE.PlaneGeometry(200, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({
        map: ubik.assets.get('ground'),
    });
    groundMaterial.map.wrapS = THREE.RepeatWrapping;
    groundMaterial.map.wrapT = THREE.RepeatWrapping;
    groundMaterial.map.repeat.set(20, 1); // Adjust the repeat value as needed
    ubik.addComponent(ground, 'mesh', ubik.mesh.createFromGeometry(groundGeometry, groundMaterial));
    ground.position.set(0, -35, 0);

    // Load background assets
    const backgroundGeometry = new THREE.PlaneGeometry(200, 200);
    const backgroundMaterial = new THREE.MeshStandardMaterial({
        map: ubik.assets.get('background'),
    });
    backgroundMaterial.map.wrapS = THREE.RepeatWrapping;
    backgroundMaterial.map.wrapT = THREE.RepeatWrapping;
    backgroundMaterial.map.repeat.set(1, 1); // Adjust the repeat value as needed
    ubik.addComponent(background, 'mesh', ubik.mesh.createFromGeometry(backgroundGeometry, backgroundMaterial));
    background.position.set(0, 0, -50);
});

// Classes
// Player class
class Player {
    constructor(x, y, thrust, spaceship) {
        this.x = x;
        this.y = y;
        this.thrust = thrust;
        this.spaceship = spaceship;
        this.landingOrientation = new CANNON.Quaternion();
    }

    update(dt) {
        // Vertical movement
        if (ubik.input.isKeyPressed('ArrowUp')){
            const forceDirection = new CANNON.Vec3(0, this.thrust, 0);
            // Get the current orientation of the spaceship
            const quaternion = this.spaceship.rigidBody.quaternion;
            // Rotate the force direction
            quaternion.vmult(forceDirection, forceDirection);
            // Apply the force
            this.spaceship.rigidBody.applyForce(forceDirection);
        }
    
        // Torque
        if (ubik.input.isKeyPressed('ArrowRight')) {
            this.spaceship.rigidBody.applyTorque(new CANNON.Vec3(0, 0, -10 * this.thrust));
        } else if (ubik.input.isKeyPressed('ArrowLeft')) {
            this.spaceship.rigidBody.applyTorque(new CANNON.Vec3(0, 0, 10 * this.thrust));
        }

        // Collision detection
        if (this.spaceship.position.y < -27.5) {
            const quaternion = this.spaceship.rigidBody.quaternion;
            quaternion.toEuler(this.landingOrientation);
            if (Math.abs(this.landingOrientation.x) > 0.1 && Math.abs(this.landingOrientation.y) > 0.1) {
                alert('Game over');
                window.location.reload();
            } else {
                alert('You win!');
                window.location.reload();
            }
            // Reset spaceship position, velocity, angular velocity, and rotation
            this.spaceship.position.set(0, 0, 10);
            this.spaceship.rigidBody.velocity.set(0, 0, 0);
            this.spaceship.rigidBody.angularVelocity.set(0, 0, 0);
            this.spaceship.quaternion.set(0, 0, 0, 1);
        }
    }
}

// Instantiate player
const player = new Player(0, 0, 10, ship);

// Update instructions
ubik.update = (dt) => {
    // Update player
    player.update(dt);
}

// Start the engine
ubik.start();
