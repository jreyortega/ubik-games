import Ubik from '../engine/Ubik.js';
import * as THREE from 'three';

/************** ISOMETRIC **************/
const ubik = new Ubik({ cameraType: 'isometric' });

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
    console.log('loading started')
}
loadingManager.onLoad = () => {
    console.log('loading finished')
}
loadingManager.onProgress = () => {
    console.log('loading progressing')
}
loadingManager.onError = () => {
    console.log('loading error')
}

const textureLoader = new THREE.TextureLoader();

const boxTexture = textureLoader.load('/textures/10_2-box.jpg')


// Box mesh
const boxMesh = ubik.mesh.createFromGeometry(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshBasicMaterial({ map: boxTexture })  
);

boxMesh.position.set(10, 5, 0);

ubik.update = (dt) => {
    // const totalElapsed = ubik.totalElapsedInSeconds;

    // Rotate the pivot (and thus the cube and the grid) when mouse is clicked and dragged
    if (ubik.input.isMouseClicked()) {
        const mouseDelta = ubik.input.getMouseDelta();
        boxMesh.rotation.y -= mouseDelta.deltaX * 0.001;
        boxMesh.rotation.x += mouseDelta.deltaY * 0.001;
    }
}

ubik.start();