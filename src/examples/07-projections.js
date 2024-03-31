import Ubik from '../engine/Ubik.js';
import * as THREE from 'three';

/************** ISOMETRIC **************/
const ubik = new Ubik({ cameraType: 'isometric' });

// Box mesh
const boxMesh = ubik.mesh.createFromGeometry(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
boxMesh.position.set(10, 5, 0);

// Grid mesh
const grid = ubik.mesh.createFromGeometry(
    new THREE.PlaneGeometry(100, 100, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
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

/************** PERSPECTIVE **************/
// const ubik = new Ubik({ cameraType: 'perspective', fov: 20000 });

// // Box mesh
// const boxMesh = ubik.mesh.createFromGeometry(
//     new THREE.BoxGeometry(10, 10, 10),
//     new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
// );
// boxMesh.position.set(10, 10, 100);

// // Grid mesh
// const grid = ubik.mesh.createFromGeometry(
//     new THREE.PlaneGeometry(100, 100, 10, 10),
//     new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
// );
// grid.position.set(0, 0, 100);

// // Pivot point
// const pivot = new THREE.Object3D();
// pivot.add(grid);
// pivot.add(boxMesh);
// ubik.scene.add(pivot);

// // Update instructions
// ubik.update = (dt) => {
//     const totalElapsed = ubik.totalElapsedInSeconds;
//     boxMesh.position.x = 20 * Math.cos(totalElapsed);

//     // Rotate the pivot (and thus the cube and the grid) when mouse is clicked and dragged
//     if (ubik.input.isMouseClicked()) {
//         const mouseDelta = ubik.input.getMouseDelta();
//         pivot.rotation.y -= mouseDelta.deltaX * 0.001;
//         pivot.rotation.x += mouseDelta.deltaY * 0.001;
//     }
// }

// // Start the engine
// ubik.start();
