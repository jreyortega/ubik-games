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
const ambientLight = ubik.light.createAmbient('white', 1);
ubik.scene.add(ambientLight);

const player = ubik.createObject()
ubik.addComponentToObject(
    player,
    'mesh',
    ubik.mesh.createFromGeometry(
        new THREE.BoxGeometry(10,10,10),
        new THREE.MeshStandardMaterial({ color: 'red'})
    )
)

//ubik.scene.add(player)

// Add orbit controls
ubik.camera.addOrbitControls();

console.log(player)

// Update instructions
ubik.update = (dt) => {
    // Rotate the box mesh
    player.mesh.rotation.x += 0.005;

}

// Start the engine
ubik.start();