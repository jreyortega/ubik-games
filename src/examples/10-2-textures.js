import Ubik from '../engine/Ubik.js';
import * as THREE from 'three';

const ubik = new Ubik({ cameraType: 'isometric' });

// Directional light
const directionalLight = ubik.light.createDirectional('white', 10);
directionalLight.position.set(0, 20, 0);
directionalLight.target.position.set(7, 0, 3); // Set the target position
ubik.scene.add(directionalLight);
ubik.scene.add(directionalLight.target); // Add the light's target to the scene

// Ambient light blue light
const ambientLight = ubik.light.createAmbient('blue', 0.02);
ubik.scene.add(ambientLight);

// Create box mesh
const boxMesh = ubik.mesh.createFromGeometry(
    new THREE.BoxGeometry(10, 10, 10, 32, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false, roughness: 0.4, metalness: 0.5, displacementScale: 0.01})
);
boxMesh.position.set(10, 5, 0);

// Define the textures
const textures = {
    color: '../textures/color.png',
    normal: '../textures/normal.png',
    roughness: '../textures/roughness.png',
    displacement: '../textures/displacement.png'
};

// Load textures for the box mesh
ubik.mesh.loadTextures(boxMesh, textures);

ubik.scene.add(boxMesh);

// Add orbit controls
ubik.camera.addOrbitControls();

// Update instructions
ubik.update = (dt) => {
    // Rotate the box mesh
    boxMesh.rotation.x += 0.005;
    boxMesh.rotation.y += 0.005;
    boxMesh.rotation.z += 0.005;
}

// Start the engine
ubik.start();
