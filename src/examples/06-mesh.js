import Ubik from '../engine/Ubik.js';
import * as THREE from 'three';

const ubik = new Ubik({ cameraType: 'perspective' });

// Create a mesh from geometry and material
const capsuleMesh = ubik.mesh.createFromGeometry(
    new THREE.CapsuleGeometry(5, 5, 32),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
capsuleMesh.position.set(0, 0, 100);

// Define vertices and color for a square
const vertices = new Float32Array( [
    // Triangle 1
	-1.0, -1.0,  1.0, // v0
	 1.0, -1.0,  1.0, // v1
	 1.0,  1.0,  1.0, // v2

     // Triangle 2
	 1.0,  1.0,  1.0, // v3
	-1.0,  1.0,  1.0, // v4
	-1.0, -1.0,  1.0  // v5
] );
const size = 5;
const color = 0x0000ff; // Blue
const squareMesh = ubik.mesh.createFromVertices(vertices, color, size);
squareMesh.position.set(0, 0, 50);

// Update instructions
ubik.update = (dt) => {
    capsuleMesh.rotateZ(dt);
    capsuleMesh.rotateX(dt);
    capsuleMesh.rotateY(dt);

    squareMesh.rotateZ(dt);
}

// Start the engine
ubik.start();
