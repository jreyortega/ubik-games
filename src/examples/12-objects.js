import Ubik from '../engine/Ubik.js';
import * as THREE from 'three';

const ubik = new Ubik({ cameraType: 'isometric' });

// Light 
const directionalLight = ubik.light.createDirectional('white', 10);
const AmbientLight = ubik.light.createAmbient('white', 0.5);
directionalLight.target.position.set(0, 0, 0);
ubik.scene.add(directionalLight);
ubik.scene.add(directionalLight.target); // Add the light's target to the scene
ubik.scene.add(AmbientLight);

// Player
const player = ubik.createObject();
ubik.addComponent(player, 'mesh', ubik.mesh.createFromGeometry(
    new THREE.BoxGeometry(20, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: false, roughness: 0.2, metalness: 0.5 })
));

console.log(player);

// Add orbit controls
ubik.camera.addOrbitControls();

// Update instructions
ubik.update = (dt) => {
    player.mesh.position.x = Math.sin(ubik.totalElapsedInSeconds) * 50;
    player.mesh.position.z = Math.cos(ubik.totalElapsedInSeconds) * 50;
    player.mesh.rotation.y = ubik.totalElapsedInSeconds;
    player.mesh.rotation.x = ubik.totalElapsedInSeconds;
    player.mesh.rotation.z = ubik.totalElapsedInSeconds;
}

// Start the engine
ubik.start();