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

    // Change the material of a mesh from basic to standard
    changeMaterialToStandard(mesh) {
        // Ensure mesh has a material
        if (!mesh.material) {
            this.logger.error("Mesh does not have material to change.");
            return;
        }

        // Create a new standard material
        const material = new THREE.MeshStandardMaterial({
            color: mesh.material.color,
            wireframe: mesh.material.wireframe,
            roughness: 0.4,
            metalness: 0.5
        });

        // Set the new material
        mesh.material = material;
    }

    // Load textures for a mesh
    loadTextures(mesh, textures) {
        // Ensure mesh has a material
        if (!mesh.material) {
            this.logger.error("Mesh does not have material to load textures.");
            return;
        }
    
        // Load textures if they are provided
        const textureLoader = new THREE.TextureLoader();
        
        if (textures.color) {
            mesh.material.map = textureLoader.load(textures.color);
        } else {
            mesh.material.map = null; // Set map to null if color texture is not provided
        }
    
        if (textures.normal) {
            mesh.material.normalMap = textureLoader.load(textures.normal);
        } else {
            mesh.material.normalMap = null; // Set normalMap to null if normal texture is not provided
        }
    
        if (textures.roughness) {
            mesh.material.roughnessMap = textureLoader.load(textures.roughness);
        } else {
            mesh.material.roughnessMap = null; // Set roughnessMap to null if roughness texture is not provided
        }
    
        if (textures.displacement) {
            mesh.material.displacementMap = textureLoader.load(textures.displacement);
        } else {
            mesh.material.displacementMap = null; // Set displacementMap to null if displacement texture is not provided
        }
    
        if (textures.ao) {
            mesh.material.aoMap = textureLoader.load(textures.ao);
        } else {
            mesh.material.aoMap = null; // Set aoMap to null if AO texture is not provided
        }
    
        if (textures.alpha) {
            mesh.material.alphaMap = textureLoader.load(textures.alpha);
        } else {
            mesh.material.alphaMap = null; // Set alphaMap to null if alpha texture is not provided
        }
    
        if (textures.metalness) {
            mesh.material.metalnessMap = textureLoader.load(textures.metalness);
        } else {
            mesh.material.metalnessMap = null; // Set metalnessMap to null if metalness texture is not provided
        }
    }
}
