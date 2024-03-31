import * as THREE from 'three';

export default class Mesh {
    constructor(ubik) {
        this.scene = ubik.scene;
        this.logger = ubik.logger;
        this.logger.info("Mesh constructor called");
    }

    // Create a mesh from vertices and color
    createFromVertices(vertices, color, size = 1) {
        const geometry = new THREE.BufferGeometry();
        const positionsAttribute = new THREE.BufferAttribute(vertices, 3);
        geometry.setAttribute('position', positionsAttribute);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);
        this.resizeMesh(mesh, size); // Resize the mesh
        this.scene.add(mesh);

        return mesh;
    }

    // Create a mesh from geometry and material
    createFromGeometry(geometry, material) {
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        return mesh;
    }

    // Resize the mesh by multiplying its size by a scalar
    resizeMesh(mesh, size) {
        // Ensure mesh has a geometry
        if (!mesh.geometry) {
            this.logger.error("Mesh does not have geometry to resize.");
            return;
        }

        // Scale the geometry by the provided size scalar
        mesh.geometry.scale(size, size, size);
    }
}
