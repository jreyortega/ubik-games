import Ubik from '../engine/Ubik.js';
import * as THREE from 'three';

const ubik = new Ubik({ cameraType: 'isometric' });

// /************* DIRECTIONAL LIGHT *************/

// // Directional light
// const directionalLight = ubik.light.createDirectional('white', 10);
// directionalLight.position.set(0, 20, 0);
// directionalLight.target.position.set(7, 0, 3); // Set the target position
// ubik.scene.add(directionalLight);
// ubik.scene.add(directionalLight.target); // Add the light's target to the scene

// // Helper to visualize the light
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0x00ff00);
// directionalLightHelper.material = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 3 });
// ubik.scene.add(directionalLightHelper);

// // Box mesh
// const boxMesh = ubik.mesh.createFromGeometry(
//     new THREE.BoxGeometry(10, 10, 10),
//     new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: false ,roughness: 0.4, metalness: 0.5 }) //Change to Standard Material 
// );

// boxMesh.position.set(10, 5, 0);
// ubik.scene.add(boxMesh);

// // Plane mesh
// const plane = ubik.mesh.createFromGeometry(
//     new THREE.PlaneGeometry(100, 100),
//     new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false, roughness: 0.4, metalness: 0.5 })
// );
// plane.position.set(0, 0, 0);
// plane.rotation.x = -Math.PI / 2;
// ubik.scene.add(plane);

// // Add orbit controls
// ubik.camera.addOrbitControls();

// // Update instructions
// ubik.update = (dt) => {
//     const totalElapsed = ubik.totalElapsedInSeconds;
//     boxMesh.position.x = 20 * Math.cos(totalElapsed);
//     directionalLight.position.x = 20 * Math.sin(totalElapsed);
// }

// // Start the engine
// ubik.start();

/************* POINT LIGHT *************/

// // Point light
// const pointLight = ubik.light.createPoint('white', 700)
// pointLight.position.set(5, 10, 10)
// ubik.scene.add(pointLight);

// // Helper to visualize the light
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
// ubik.scene.add(pointLightHelper);

// // Box mesh
// const boxMesh = ubik.mesh.createFromGeometry(
//     new THREE.BoxGeometry(10, 10, 10),
//     new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: false ,roughness: 0.4, metalness: 0.5 }) //Change to Standard Material 
// );

// boxMesh.position.set(10, 5, 0);
// ubik.scene.add(boxMesh);

// // Plane mesh
// const plane = ubik.mesh.createFromGeometry(
//     new THREE.PlaneGeometry(100, 100),
//     new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false, roughness: 0.4, metalness: 0.5 })
// );
// plane.position.set(0, 0, 0);
// plane.rotation.x = -Math.PI / 2;
// ubik.scene.add(plane);

// // Add orbit controls
// ubik.camera.addOrbitControls();

// // Update instructions
// ubik.update = (dt) => {
//     const totalElapsed = ubik.totalElapsedInSeconds;
//     boxMesh.position.x = 20 * Math.cos(totalElapsed);
//     pointLight.position.x = 40 * Math.cos(totalElapsed);
//     pointLight.position.z = 20 * Math.sin(totalElapsed);    
// }

// // Start the engine
// ubik.start();

/************* AMBIENT LIGHT *************/

// Ambient light
const ambientLight = ubik.light.createAmbient(0xffffff, 1)
ubik.scene.add(ambientLight);

// Box mesh
const boxMesh = ubik.mesh.createFromGeometry(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false ,roughness: 0.4, metalness: 0.5 })
);

boxMesh.position.set(10, 5, 0);
ubik.scene.add(boxMesh);

// Plane mesh
const plane = ubik.mesh.createFromGeometry(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false, roughness: 0.4, metalness: 0.5 })
);
plane.position.set(0, 0, 0);
plane.rotation.x = -Math.PI / 2;
ubik.scene.add(plane);

// Add orbit controls
ubik.camera.addOrbitControls();

// Update instructions
ubik.update = (dt) => {
    const totalElapsed = ubik.totalElapsedInSeconds;
    boxMesh.position.x = 20 * Math.cos(totalElapsed);
}

// Start the engine
ubik.start();
