import Ubik from '../engine/Ubik.js';
import * as THREE from 'three';

/************** ISOMETRIC **************/
const ubik = new Ubik({ cameraType: 'isometric' });

//Light

    //Directional light
const directionalLight = ubik.light.CreateDirectional('white',10)
directionalLight.position.set(0,10,0)
ubik.scene.add(directionalLight);


    //Point light
// const pointLight = ubik.light.CreatePoint('white',10000)
// pointLight.position.set(0,20,0)
// ubik.scene.add(pointLight);

    //Ambient light
// const ambientLight = ubik.light.CreateAmbient(0xff0000,1)
// ubik.scene.add(ambientLight);


// Box mesh
const boxMesh = ubik.mesh.createFromGeometry(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: false ,roughness: 0.1, metalness: 0.5 }) //Change to Standard Material 
);

boxMesh.position.set(10, 5, 0);

// Grid mesh
const grid = ubik.mesh.createFromGeometry(
    new THREE.BoxGeometry(100, 100, 1),
    new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false, roughness: 0.1, metalness: 0.5  })
);
grid.position.set(0, 0, 0);
grid.rotation.order = 'YXZ';
grid.rotation.y = Math.PI / 2;
grid.rotation.x = Math.PI / 2;

// Pivot point
const pivot = new THREE.Object3D();
pivot.add(grid);
pivot.add(boxMesh);
ubik.scene.add(pivot);

// Update instructions
ubik.update = (dt) => {
    const totalElapsed = ubik.totalElapsedInSeconds;
    boxMesh.position.x = 20 * Math.cos(totalElapsed);

    // Rotate the pivot (and thus the cube and the grid) when mouse is clicked and dragged
    if (ubik.input.isMouseClicked()) {
        const mouseDelta = ubik.input.getMouseDelta();
        pivot.rotation.y -= mouseDelta.deltaX * 0.001;
        pivot.rotation.x += mouseDelta.deltaY * 0.001;
    }
}

// Start the engine
ubik.start();