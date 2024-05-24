import { CorridorFirstDungeonGenerator } from './CorridorFirstDungeonGenerator.js';
import Ubik from '../engine/Ubik.js';
import sources from './sources-lunar-lander.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

const ubik = new Ubik({ cameraType: 'orthographic' });

// // Gravity
ubik.physics.world.gravity.set(0, -9.82, 0);

// // Light
const ambientLight = ubik.light.createAmbient('white', 2);
ubik.scene.add(ambientLight);

// Add orbit controls
//ubik.camera.addOrbitControls();

const tileSize = 1;

const dungeonGenerator = new CorridorFirstDungeonGenerator({ x: 0, y:0 }, 20, 10, true);
const dungeon = dungeonGenerator.runProceduralGeneration();


function isPositionOccupied(x, y) {
    const posKey = `${x},${y}`;
    return occupiedPositions.has(posKey);
}

const occupiedPositions= new Set();


const slabs = [];
dungeon.forEach(position => {

    const posKey = `${position.x * tileSize},${position.y * tileSize}`;

    const slab = ubik.createObject();
    slab.position.set(position.x * tileSize, position.y * tileSize, 0); // Usamos position.set para asignar las coordenadas
    slabs.push(slab);
    occupiedPositions.add(posKey);
});

slabs.forEach(slab=>{
    let posDown = slab.position.y - tileSize;
    let posUp = slab.position.y + tileSize;
    let posRight = slab.position.x + tileSize;
    let posLeft = slab.position.x - tileSize;

    if(isPositionOccupied(posRight,posUp) && !isPositionOccupied(slab.position.x,posUp) && !isPositionOccupied(posRight,slab.position.y))
    {
        const posKey = `${posRight},${slab.position.y}`;
        const newslab = ubik.createObject();
        newslab.position.set(posRight, slab.position.y, 0); // Usamos position.set para asignar las coordenadas
        slabs.push(newslab);
        occupiedPositions.add(posKey);
        

        const posKey2 = `${slab.position.x},${posUp}`;
        const newslab2 = ubik.createObject();
        newslab2.position.set(slab.position.x, posUp, 0);
        slabs.push(newslab2);
        occupiedPositions.add(posKey2);
    }
    if(isPositionOccupied(posRight,posDown) && !isPositionOccupied(slab.position.x,posDown) && !isPositionOccupied(posRight,slab.position.y))
    {
        const posKey = `${slab.position.x},${posDown}`;
        const newslab = ubik.createObject();
        newslab.position.set(slab.position.x, posDown, 0); // Usamos position.set para asignar las coordenadas
        slabs.push(newslab);
        occupiedPositions.add(posKey);

        const posKey2 = `${posRight},${slab.position.y}`;
        const newslab2 = ubik.createObject();
        newslab2.position.set(posRight, slab.position.y, 0);
        slabs.push(newslab2);
        occupiedPositions.add(posKey2);
    }
    if(isPositionOccupied(posLeft,posUp) && !isPositionOccupied(slab.position.x,posUp) && !isPositionOccupied(posLeft,slab.position.y))
    {
        const posKey = `${posLeft},${slab.position.y}`;
        const newslab = ubik.createObject();
        newslab.position.set(posLeft, slab.position.y, 0); // Usamos position.set para asignar las coordenadas
        slabs.push(newslab);
        occupiedPositions.add(posKey);

        const posKey2 = `${slab.position.x},${posUp}`;
        const newslab2 = ubik.createObject();
        newslab2.position.set(slab.position.x, posUp, 0);
        slabs.push(newslab2);
        occupiedPositions.add(posKey2);
    }
    if(isPositionOccupied(posLeft,posDown) && !isPositionOccupied(slab.position.x,posDown) && !isPositionOccupied(posLeft,slab.position.y))
    {
        const posKey = `${slab.position.x},${posDown}`;
        const newslab = ubik.createObject();
        newslab.position.set(slab.position.x, posDown, 0); // Usamos position.set para asignar las coordenadas
        slabs.push(newslab);
        occupiedPositions.add(posKey);

        const posKey2 = `${posLeft},${slab.position.y}`;
        const newslab2 = ubik.createObject();
        newslab2.position.set(posLeft, slab.position.y, 0);
        slabs.push(newslab2);
        occupiedPositions.add(posKey2);        
    }


})

const walls=[];

slabs.forEach(slab=>{
    
    let posDown = slab.position.y - tileSize;
    let posUp = slab.position.y + tileSize;
    let posRight = slab.position.x + tileSize;
    let posLeft = slab.position.x - tileSize;

    // if(isPositionOccupied(slab.position.x,posDown) && isPositionOccupied(slab.position.x, posUp) && !isPositionOccupied(posRight,posUp)
    //     && !isPositionOccupied(posRight,posDown) && !isPositionOccupied(posLeft,posDown) && !isPositionOccupied(posLeft,posUp))

    if(!isPositionOccupied(slab.position.x,posDown))
    {
        const posKey = `${slab.position.x},${posDown}`;
        const wall = ubik.createObject();
        wall.position.set(slab.position.x, posDown);
        walls.push(wall);
        occupiedPositions.add(posKey);
    }
    if(!isPositionOccupied(slab.position.x,posUp))
    {
        const posKey = `${slab.position.x},${posUp}`;
        const wall = ubik.createObject();
        wall.position.set(slab.position.x, posUp);
        walls.push(wall);
        occupiedPositions.add(posKey);
    }
    if(!isPositionOccupied(posRight,slab.position.y))
    {
        const posKey = `${posRight},${slab.position.y}`;
        const wall = ubik.createObject();
        wall.position.set(posRight,slab.position.y);
        walls.push(wall);
        occupiedPositions.add(posKey);
    }
    if(!isPositionOccupied(posLeft,slab.position.y))
    {
        const posKey = `${posLeft},${slab.position.y}`;
        const wall = ubik.createObject();
        wall.position.set(posLeft,slab.position.y);
        walls.push(wall);
        occupiedPositions.add(posKey);
    }
    if(!isPositionOccupied(posRight,posUp))
    {
        const wall = ubik.createObject();
        wall.position.set(posRight,posUp);
        walls.push(wall);
    }
    if(!isPositionOccupied(posRight,posDown))
    {
        const wall = ubik.createObject();
        wall.position.set(posRight,posDown);
        walls.push(wall);
    }

    if(!isPositionOccupied(posLeft,posUp))
    {
        const wall = ubik.createObject();
        wall.position.set(posLeft,posUp);
        walls.push(wall);
    }

    if(!isPositionOccupied(posLeft,posDown))
    {
        const wall = ubik.createObject();
        wall.position.set(posLeft,posDown);
        walls.push(wall);
    }
            

});
console.log("wall:",walls)
console.log("slabs:",slabs)


console.log('dungeon:', dungeon)

ubik.assets.loadAssets(sources);
ubik.assets.onAssetsLoaded(() => {

    const slabGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
    const slabMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('ground'), transparent: false, alphaTest: 0.5 });
    slabs.forEach((slab) => {
        ubik.addComponent(slab, 'mesh', ubik.mesh.createFromGeometry(slabGeometry, slabMaterial));
    });

    const wallsGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
    const wallsMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('background'), transparent: false, alphaTest: 0.5 });
    walls.forEach((wall) => {
        ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(wallsGeometry, wallsMaterial));
    });

});

ubik.update = (dt) => {

}

ubik.start();