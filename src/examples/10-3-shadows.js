import Ubik from '../engine/Ubik.js';
import * as THREE from 'three';

const ubik = new Ubik({ cameraType: 'isometric' });

// Point light
const pointLight = ubik.light.createPoint('white', 700)
pointLight.position.set(5, 10, 10)
pointLight.castShadow = true;
ubik.scene.add(pointLight);

// Helper to visualize the light
const pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
ubik.scene.add(pointLightHelper);

// Box mesh
const boxMesh = ubik.mesh.createFromGeometry(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: false ,roughness: 0.4, metalness: 0.5 }) //Change to Standard Material 
);
boxMesh.position.set(10, 5, 0);
boxMesh.castShadow = true;
ubik.scene.add(boxMesh);

// Plane mesh
const plane = ubik.mesh.createFromGeometry(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false, roughness: 0.4, metalness: 0.5 })
);
plane.position.set(0, 0, 0);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
ubik.scene.add(plane);

// Add orbit controls
ubik.camera.addOrbitControls();

// Update instructions
ubik.update = (dt) => {
    const totalElapsed = ubik.totalElapsedInSeconds;
    boxMesh.position.x = 20 * Math.cos(totalElapsed);
    pointLight.position.x = 40 * Math.cos(totalElapsed);
    pointLight.position.z = 20 * Math.sin(totalElapsed);    
}

// Start the engine
ubik.start();
