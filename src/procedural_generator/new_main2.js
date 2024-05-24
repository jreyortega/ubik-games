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
ubik.camera.addOrbitControls();

const tileSize = 2;

const dungeonGenerator = new CorridorFirstDungeonGenerator({ x: 0, y:0 }, 20, 10, true);
const dungeon = dungeonGenerator.runProceduralGeneration();

const ship = ubik.createObject();

ship.position.set(0,0,0);

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

//Array para sprites laterales
const sideWalls=[];

slabs.forEach(slab=>{
    
    let posDown = slab.position.y - tileSize;
    let posUp = slab.position.y + tileSize;
    let posRight = slab.position.x + tileSize;
    let posLeft = slab.position.x - tileSize;

    if(!isPositionOccupied(posLeft,posDown) && !isPositionOccupied(posLeft,posUp) && !isPositionOccupied(posLeft,slab.position.y))
    {
        if(isPositionOccupied(slab.position.x,posDown) && isPositionOccupied(slab.position.x, posUp) && !isPositionOccupied(posRight,slab.position.y) && !isPositionOccupied(posLeft,slab.position.y)
            && !isPositionOccupied(posRight,posUp) && !isPositionOccupied(posRight,posDown) && !isPositionOccupied(posLeft,posDown) && !isPositionOccupied(posLeft,posUp))
        {
            // const posKey = `${posRight},${slab.position.y}`;
            const newslab = ubik.createObject();
            newslab.position.set(posRight, slab.position.y, 0); // Usamos position.set para asignar las coordenadas
            sideWalls.push(newslab);
            // occupiedPositions.add(posKey);

            // const posKey2 = `${posLeft},${slab.position.y}`;
            const newslab2 = ubik.createObject();
            newslab2.position.set(posLeft, slab.position.y, 0);
            sideWalls.push(newslab2);
            // occupiedPositions.add(posKey2); 
        }
        else
        {
            const newslab2 = ubik.createObject();
            newslab2.position.set(posLeft, slab.position.y, 0);
            sideWalls.push(newslab2);
        }
    }

    if(!isPositionOccupied(posRight,posDown) && !isPositionOccupied(posRight,posUp) && !isPositionOccupied(posRight,slab.position.y))
        {
            if(isPositionOccupied(slab.position.x,posDown) && isPositionOccupied(slab.position.x, posUp) && !isPositionOccupied(posRight,slab.position.y) && !isPositionOccupied(posLeft,slab.position.y)
                && !isPositionOccupied(posRight,posUp) && !isPositionOccupied(posRight,posDown) && !isPositionOccupied(posLeft,posDown) && !isPositionOccupied(posLeft,posUp))
            {
                // const posKey = `${posRight},${slab.position.y}`;
                const newslab = ubik.createObject();
                newslab.position.set(posRight, slab.position.y, 0); // Usamos position.set para asignar las coordenadas
                sideWalls.push(newslab);
                // occupiedPositions.add(posKey);
    
                // const posKey2 = `${posLeft},${slab.position.y}`;
                const newslab2 = ubik.createObject();
                newslab2.position.set(posLeft, slab.position.y, 0);
                sideWalls.push(newslab2);
                // occupiedPositions.add(posKey2); 
            }
            else
            {
                const newslab2 = ubik.createObject();
                newslab2.position.set(posRight, slab.position.y, 0);
                sideWalls.push(newslab2);
            }
        }

    // if(isPositionOccupied(slab.position.x,posDown) && isPositionOccupied(slab.position.x, posUp) && !isPositionOccupied(posRight,slab.position.y) && isPositionOccupied(posLeft,slab.position.y)
    //     && !isPositionOccupied(posRight,posUp) && !isPositionOccupied(posRight,posDown) && isPositionOccupied(posLeft,posDown) && isPositionOccupied(posLeft,posUp))
    // {
    //     // const posKey = `${posRight},${slab.position.y}`;
    //     const newslab = ubik.createObject();
    //     newslab.position.set(posRight, slab.position.y, 0); // Usamos position.set para asignar las coordenadas
    //     sideWalls.push(newslab);
    //     // occupiedPositions.add(posKey);
    // }

    // if(isPositionOccupied(slab.position.x,posDown) && isPositionOccupied(slab.position.x, posUp) && isPositionOccupied(posRight,slab.position.y) && !isPositionOccupied(posLeft,slab.position.y)
    //     && isPositionOccupied(posRight,posUp) && isPositionOccupied(posRight,posDown) && !isPositionOccupied(posLeft,posDown) && !isPositionOccupied(posLeft,posUp))
    // {
    //     // const posKey2 = `${posLeft},${slab.position.y}`;
    //     const newslab2 = ubik.createObject();
    //     newslab2.position.set(posLeft, slab.position.y, 0);
    //     sideWalls.push(newslab2);
    //     // occupiedPositions.add(posKey2); 
    // }           

});

//Array para sprites arriba y abajo
const downUpWalls=[];

slabs.forEach(slab=>{
    
    let posDown = slab.position.y - tileSize;
    let posUp = slab.position.y + tileSize;
    let posRight = slab.position.x + tileSize;
    let posLeft = slab.position.x - tileSize;

    if(!isPositionOccupied(posRight,posUp) && !isPositionOccupied(posLeft,posUp) && !isPositionOccupied(slab.position.x, posUp))
    {
        if(!isPositionOccupied(slab.position.x,posDown) && !isPositionOccupied(slab.position.x, posUp) && isPositionOccupied(posRight,slab.position.y) && isPositionOccupied(posLeft,slab.position.y)
            && !isPositionOccupied(posRight,posUp) && !isPositionOccupied(posRight,posDown) && !isPositionOccupied(posLeft,posDown) && !isPositionOccupied(posLeft,posUp))
        {
            // const posKey = `${slab.position.x},${posUp}`;
            const newslab = ubik.createObject();
            newslab.position.set(slab.position.x, posUp, 0); // Usamos position.set para asignar las coordenadas
            downUpWalls.push(newslab);
            // occupiedPositions.add(posKey);

            // const posKey2 = `${slab.position.x},${posDown}`;
            const newslab2 = ubik.createObject();
            newslab2.position.set(slab.position.x, posDown, 0);
            downUpWalls.push(newslab2);
            // occupiedPositions.add(posKey2); 
        }
        else
        {
            const newslab = ubik.createObject();
            newslab.position.set(slab.position.x, posUp, 0); // Usamos position.set para asignar las coordenadas
            downUpWalls.push(newslab);
        }
    }

    if(!isPositionOccupied(posRight,posDown) && !isPositionOccupied(posLeft,posDown) && !isPositionOccupied(slab.position.x, posDown))
        {
            if(!isPositionOccupied(slab.position.x,posDown) && !isPositionOccupied(slab.position.x, posUp) && isPositionOccupied(posRight,slab.position.y) && isPositionOccupied(posLeft,slab.position.y)
                && !isPositionOccupied(posRight,posUp) && !isPositionOccupied(posRight,posDown) && !isPositionOccupied(posLeft,posDown) && !isPositionOccupied(posLeft,posUp))
            {
                // const posKey = `${slab.position.x},${posUp}`;
                const newslab = ubik.createObject();
                newslab.position.set(slab.position.x, posUp, 0); // Usamos position.set para asignar las coordenadas
                downUpWalls.push(newslab);
                // occupiedPositions.add(posKey);
    
                // const posKey2 = `${slab.position.x},${posDown}`;
                const newslab2 = ubik.createObject();
                newslab2.position.set(slab.position.x, posDown, 0);
                downUpWalls.push(newslab2);
                // occupiedPositions.add(posKey2); 
            }
            else
            {
                const newslab = ubik.createObject();
                newslab.position.set(slab.position.x, posDown, 0); // Usamos position.set para asignar las coordenadas
                downUpWalls.push(newslab);
            }
        }
          

});

//Array para sprite esquinas

const LeftDownCornerWalls=[];

slabs.forEach(slab=>{
    
    let posDown = slab.position.y - tileSize;
    let posUp = slab.position.y + tileSize;
    let posRight = slab.position.x + tileSize;
    let posLeft = slab.position.x - tileSize;

    if(!isPositionOccupied(posLeft,slab.position.y) && !isPositionOccupied(slab.position.x,posDown) && !isPositionOccupied(posLeft,posDown))
    {
        const newslab = ubik.createObject();
        newslab.position.set(posLeft,posDown, 0); // Usamos position.set para asignar las coordenadas
        LeftDownCornerWalls.push(newslab);
    }

    if(isPositionOccupied(slab.position.x,posUp) && isPositionOccupied(posRight,slab.position.y) && !isPositionOccupied(posRight,posUp))
    {
        const newslab = ubik.createObject();
        newslab.position.set(posRight,posUp, 0); // Usamos position.set para asignar las coordenadas
        LeftDownCornerWalls.push(newslab);
    }
});

const RightDownCornerWalls=[];

slabs.forEach(slab=>{
    
    let posDown = slab.position.y - tileSize;
    let posUp = slab.position.y + tileSize;
    let posRight = slab.position.x + tileSize;
    let posLeft = slab.position.x - tileSize;

    if(!isPositionOccupied(posRight,slab.position.y) && !isPositionOccupied(slab.position.x,posDown) && !isPositionOccupied(posRight,posDown))
    {
        const newslab = ubik.createObject();
        newslab.position.set(posRight,posDown, 0); // Usamos position.set para asignar las coordenadas
        RightDownCornerWalls.push(newslab);
    }

    if(isPositionOccupied(slab.position.x,posUp) && isPositionOccupied(posLeft,slab.position.y) && !isPositionOccupied(posLeft,posUp))
    {
        const newslab = ubik.createObject();
        newslab.position.set(posLeft,posUp, 0); // Usamos position.set para asignar las coordenadas
        RightDownCornerWalls.push(newslab);
    }
});

const RightUpCornerWalls=[];

slabs.forEach(slab=>{
    
    let posDown = slab.position.y - tileSize;
    let posUp = slab.position.y + tileSize;
    let posRight = slab.position.x + tileSize;
    let posLeft = slab.position.x - tileSize;

    if(!isPositionOccupied(posRight,slab.position.y) && !isPositionOccupied(slab.position.x,posUp) && !isPositionOccupied(posRight,posUp))
    {
        const newslab = ubik.createObject();
        newslab.position.set(posRight,posUp, 0); // Usamos position.set para asignar las coordenadas
        RightUpCornerWalls.push(newslab);
    }

    if(isPositionOccupied(posLeft,slab.position.y) && isPositionOccupied(slab.position.x,posDown) && !isPositionOccupied(posLeft,posDown))
    {
        const newslab = ubik.createObject();
        newslab.position.set(posLeft,posDown, 0); // Usamos position.set para asignar las coordenadas
        RightUpCornerWalls.push(newslab);
    }
});

const LeftUpCornerWalls=[];

slabs.forEach(slab=>{
    
    let posDown = slab.position.y - tileSize;
    let posUp = slab.position.y + tileSize;
    let posRight = slab.position.x + tileSize;
    let posLeft = slab.position.x - tileSize;

    if(!isPositionOccupied(posLeft,slab.position.y) && !isPositionOccupied(slab.position.x,posUp) && !isPositionOccupied(posLeft,posUp))
    {
        const newslab = ubik.createObject();
        newslab.position.set(posLeft,posUp, 0); // Usamos position.set para asignar las coordenadas
        LeftUpCornerWalls.push(newslab);
    }

    if(isPositionOccupied(posRight,slab.position.y) && isPositionOccupied(slab.position.x,posDown) && !isPositionOccupied(posRight,posDown))
    {
        const newslab = ubik.createObject();
        newslab.position.set(posRight,posDown, 0); // Usamos position.set para asignar las coordenadas
        LeftUpCornerWalls.push(newslab);
    }
});

ubik.assets.loadAssets(sources);
ubik.assets.onAssetsLoaded(() => {

    const slabGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
    const slabMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('ground'), transparent: false, alphaTest: 0.5 });
    slabs.forEach((slab) => {
        ubik.addComponent(slab, 'mesh', ubik.mesh.createFromGeometry(slabGeometry, slabMaterial));
    });

    const walls1Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
    const walls1Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('up-down'), transparent: false, alphaTest: 0.5 });
    downUpWalls.forEach((wall) => {
        ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls1Geometry, walls1Material));
    });

    const wallsGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
    const wallsMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('leftright'), transparent: false, alphaTest: 0.5 });
    sideWalls.forEach((wall) => {
        ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(wallsGeometry, wallsMaterial));
    });

    const walls2Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
    const walls2Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('left-down-corner'), transparent: false, alphaTest: 0.5 });
    LeftDownCornerWalls.forEach((wall) => {
        ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls2Geometry, walls2Material));
    });

    const walls3Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
    const walls3Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('right-down-corner'), transparent: false, alphaTest: 0.5 });
    RightDownCornerWalls.forEach((wall) => {
        ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls3Geometry, walls3Material));
    });

    const walls4Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
    const walls4Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('right-up-corner'), transparent: false, alphaTest: 0.5 });
    RightUpCornerWalls.forEach((wall) => {
        ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls4Geometry, walls4Material));
    });
       
    const walls5Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
    const walls5Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('left-up-corner'), transparent: false, alphaTest: 0.5 });
    LeftUpCornerWalls.forEach((wall) => {
        ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls5Geometry, walls5Material));
    });

    const shipGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
    const shipMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('player'), transparent: false, alphaTest: 0.5 });
    ubik.addComponent(ship, 'mesh', ubik.mesh.createFromGeometry(shipGeometry, shipMaterial));

});

ubik.update = (dt) => {

}

ubik.start();