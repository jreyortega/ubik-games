import Ubik from '../engine/Ubik.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

const ubik = new Ubik({ cameraType: 'isometric' });
ubik.physics.world.gravity.set(0, -9.82, 0); // Set gravity

// Light 
const directionalLight = ubik.light.createDirectional('white', 10);
const AmbientLight = ubik.light.createAmbient('white', 0.5);
directionalLight.target.position.set(7, 0, 0);
ubik.scene.add(directionalLight);
ubik.scene.add(directionalLight.target); // Add the light's target to the scene
ubik.scene.add(AmbientLight);

// Ball
const ball = ubik.createObject();
// Add mesh component to the sphere object
ubik.addComponent(
    ball,
    'mesh',
    ubik.mesh.createFromGeometry(
        new THREE.SphereGeometry(4, 32, 32),
        new THREE.MeshStandardMaterial({ color: 'red' })
    )
);
// Add rigid body component to the sphere object
ubik.addComponent(
    ball,
    'rigidBody',
    ubik.physics.createBody({
        mass: 1,
        shape: new CANNON.Sphere(4)
    })
);
ball.rigidBody.position.set(0, 40, 0); // Set the position of the sphere
ball.rigidBody.velocity.set(0, 0, 5); // Set the velocity of the sphere

// Ground
const ground = ubik.createObject();
// Add mesh component to the ground object
ubik.addComponent(
    ground,
    'mesh',
    ubik.mesh.createFromGeometry(
        new THREE.PlaneGeometry(100, 100, 32),
        new THREE.MeshStandardMaterial({ color: 'green' })
    )
);
// Add rigid body component to the ground object
ubik.addComponent(
    ground,
    'rigidBody',
    ubik.physics.createBody({
        mass: 0,
        shape: new CANNON.Plane()
    })
);
ground.rigidBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // Set the rotation of the ground

// Add orbit controls
ubik.camera.addOrbitControls();

// Update instructions
ubik.update = (dt) => {
}

// Start the engine
ubik.start();
