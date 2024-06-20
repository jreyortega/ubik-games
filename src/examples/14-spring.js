import Ubik from '../engine/Ubik.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

const ubik = new Ubik({ cameraType: 'perspective' });
ubik.physics.world.gravity.set(0, -9.82, 0); // Set gravity

// Light 
const directionalLight = ubik.light.createDirectional('white', 10);
const ambientLight = ubik.light.createAmbient('white', 0.5);
directionalLight.target.position.set(7, 0, 0);
ubik.scene.add(directionalLight);
ubik.scene.add(directionalLight.target); // Add the light's target to the scene
ubik.scene.add(ambientLight);

// Grid
const grid = new THREE.GridHelper(100, 100, 0x333333, 0x333333);
ubik.scene.add(grid);

// Add orbit controls
ubik.camera.addOrbitControls();

// Anchor
const anchor = ubik.createObject();
// Add mesh component to the anchor object
ubik.addComponent(
    anchor,
    'mesh',
    ubik.mesh.createFromGeometry(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshStandardMaterial({ color: 'white' })
    )
);
// Add rigid body component to the anchor object
ubik.addComponent(
    anchor,
    'rigidBody',
    ubik.physics.createBody({
        mass: 0,
        shape: new CANNON.Sphere(1)
    })
);
anchor.position.set(0, 40, 0); // Set the position of the anchor

// Ball
const ball = ubik.createObject();
// Add mesh component to the sphere object
ubik.addComponent(
    ball,
    'mesh',
    ubik.mesh.createFromGeometry(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshStandardMaterial({ color: 'red' })
    )
);
// Add rigid body component to the sphere object
ubik.addComponent(
    ball,
    'rigidBody',
    ubik.physics.createBody({
        mass: 7,
        shape: new CANNON.Sphere(1)
    })
);
ball.position.set(0, 30, 0); // Set the position of the sphere
ball.rigidBody.velocity.set(0, 0, 0); // Set the velocity of the sphere

// Update instructions
ubik.update = (dt) => {
    const dampingForce = ubik.forces.generateDragForce(0.05, ball.rigidBody.velocity);
    ball.rigidBody.applyForce(dampingForce);
    const springForce = ubik.forces.generateSpringForce(anchor.position, ball.position, 0.9, 4);
    ball.rigidBody.applyForce(springForce);
}

// Start the engine
ubik.start();
