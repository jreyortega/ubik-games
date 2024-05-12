import Ubik from '../engine/Ubik.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

const ubik = new Ubik({ cameraType: 'orthographic' });

// Light
const ambientLight = ubik.light.createAmbient('white', 0.5);
ubik.scene.add(ambientLight);

// Ball 1
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
        mass: 700,
        shape: new CANNON.Sphere(4)
    })
);
ball.position.set(0, 0, 0); // Set the position of the sphere
ball.rigidBody.velocity.set(10, 0, 3); // Set the velocity of the sphere
celestial_bodies.push(ball);
// Disable collisions
ball.rigidBody.collisionFilterGroup = 0; // No collision group
ball.rigidBody.collisionFilterMask = 0; // No collision mask

// Ball 2
const ball2 = ubik.createObject();
// Add mesh component to the sphere object
ubik.addComponent(
    ball2,
    'mesh',
    ubik.mesh.createFromGeometry(
        new THREE.SphereGeometry(4, 32, 32),
        new THREE.MeshStandardMaterial({ color: 'blue' })
    )
);
// Add rigid body component to the sphere object
ubik.addComponent(
    ball2,
    'rigidBody',
    ubik.physics.createBody({
        mass: 700,
        shape: new CANNON.Sphere(4)
    })
);
ball2.position.set(-50, 0, 0); // Set the position of the sphere
ball2.rigidBody.velocity.set(-10, 0, -3); // Set the velocity of the sphere
celestial_bodies.push(ball2);
// Disable collisions
ball2.rigidBody.collisionFilterGroup = 0; // No collision group
ball2.rigidBody.collisionFilterMask = 0; // No collision mask

// Ball 3
const ball3 = ubik.createObject();
// Add mesh component to the sphere object
ubik.addComponent(
    ball3,
    'mesh',
    ubik.mesh.createFromGeometry(
        new THREE.SphereGeometry(4, 32, 32),
        new THREE.MeshStandardMaterial({ color: 'green' })
    )
);
// Add rigid body component to the sphere object
ubik.addComponent(
    ball3,
    'rigidBody',
    ubik.physics.createBody({
        mass: 700,
        shape: new CANNON.Sphere(4)
    })
);
ball3.position.set(50, 0, 20); // Set the position of the sphere
celestial_bodies.push(ball3);
// Disable collisions
ball3.rigidBody.collisionFilterGroup = 0; // No collision group
ball3.rigidBody.collisionFilterMask = 0; // No collision mask

// Create trajectory lines
const trajectoryLines = [];
const trajectoryPoints = [];
for (let i = 0; i < celestial_bodies.length; i++) {
    trajectoryPoints.push([]);
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({ color: celestial_bodies[i].mesh.material.color });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    trajectoryLines.push(line);
    ubik.scene.add(line);
}

// Grid
const grid = new THREE.GridHelper(100, 100, 0x333333, 0x333333);
ubik.scene.add(grid);

// Add orbit controls
ubik.camera.addOrbitControls();

// Update instructions
ubik.update = (dt) => {
    for (let i = 0; i < celestial_bodies.length; i++) {
        for (let j = i + 1; j < celestial_bodies.length; j++) {
            const body1 = celestial_bodies[i];
            const body2 = celestial_bodies[j];
            const force = ubik.forces.generateGravitationalForce(
                body1.position,
                body2.position,
                body1.rigidBody.mass,
                body2.rigidBody.mass,
                G,
                20,
                100
            );
            body1.rigidBody.applyForce(force);
            body2.rigidBody.applyForce(force.negate());
        }

        // Update trajectory lines
        trajectoryPoints[i].push(celestial_bodies[i].position.clone());
        const points = trajectoryPoints[i];
        const lineGeometry = trajectoryLines[i].geometry;
        const positions = new Float32Array(points.length * 3);
        for (let j = 0; j < points.length; j++) {
            positions[j * 3] = points[j].x;
            positions[j * 3 + 1] = points[j].y;
            positions[j * 3 + 2] = points[j].z;
        }
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        lineGeometry.computeBoundingSphere();
    }
}

// Start the engine
ubik.start();
