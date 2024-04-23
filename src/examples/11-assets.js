import Ubik from '../engine/Ubik.js';
import sources from './sources-example.js';
import * as THREE from 'three';

const ubik = new Ubik({ cameraType: 'isometric' });

// Load assets
ubik.assets.loadAssets(sources);

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
const material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false, roughness: 0.4, metalness: 0.5, displacementScale: 0.01});
const boxMesh = ubik.mesh.createFromGeometry(
    new THREE.BoxGeometry(10, 10, 10, 32, 32, 32),
    material
);
boxMesh.position.set(10, 5, 0);

// 3D model
let model = null;


// Wait for assets to be loaded
ubik.assets.onAssetsLoaded((e) => {
    // Set the color texture
    boxMesh.material.map = ubik.assets.get('colorTexture');
    boxMesh.material.normalMap = ubik.assets.get('normalTexture');
    boxMesh.material.roughnessMap = ubik.assets.get('roughnessTexture');
    boxMesh.material.displacementMap = ubik.assets.get('displacementTexture');
    boxMesh.material.displacementScale = 0.01;
    boxMesh.material.displacementBias = -0.01;
    boxMesh.material.needsUpdate = true;

    // Model
    model = ubik.assets.get('model').scene;
    model.position.set(-10, 0, 0);
    ubik.scene.add(model);

});

// Add orbit controls
ubik.camera.addOrbitControls();

// Update instructions
ubik.update = (dt) => {
    // Rotate the box mesh
    boxMesh.rotation.x += 0.005;
    boxMesh.rotation.y += 0.005;
    boxMesh.rotation.z += 0.005;

    // Rotate the model
    if (model) {
        model.rotation.y += 0.01;
    }
}

// Start the engine
ubik.start();
