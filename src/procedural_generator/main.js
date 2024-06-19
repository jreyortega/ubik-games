import { CorridorFirstDungeonGenerator } from './CorridorFirstDungeonGenerator.js';
import Ubik from '../engine/Ubik.js';
import sources from './sources-dungeon.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { inicializar_mapa } from './inicializacion_mapa.js';
import Player from './Classes/Player.js';
import Enemy from './Classes/Enemy.js';
import Portal from './Classes/Portal.js';

const ubik = new Ubik({ cameraType: 'orthographic' });

// // Gravity
ubik.physics.world.gravity.set(0, -9.82, 0);

// // Light
const ambientLight = ubik.light.createAmbient('white', 0.0025);
ubik.scene.add(ambientLight);

// Generate dungeon
const tileSize = 2;
const dungeonGenerator = new CorridorFirstDungeonGenerator({ x: 0, y: 0 }, 100, 3, true);
const dungeon = dungeonGenerator.runProceduralGeneration();

//#######INICIALIZACION DE OBJETOS
//-------Inicializacion del objeto character-----------
const tam = new CANNON.Vec3(tileSize / 2, tileSize / 2, tileSize / 2);
const character = ubik.createObject();
character.position.set(0, 0, 0);
ubik.addComponent(
    character,
    'rigidbody',
    ubik.physics.createBody({
        mass: 1,
        shape: new CANNON.Box(tam)
    })
);

//--------Inicializción del objeto portal------------
const portal = ubik.createObject();

//--------Inicialización del objeto llave--------
const key = ubik.createObject();

const enemyPositions = inicializar_mapa(dungeon, tileSize, ubik, sources, character, portal, key, THREE, CANNON);

console.log("character-------------", portal);

const player = new Player(0, 0, character, ubik);
const Portal_1 = new Portal(portal, ubik);

// Now you can use enemyPositions as needed
console.log('Enemy Positions:', enemyPositions);


ubik.update = (dt) => {
    ubik.physics.update(dt, ubik.objects); // Actualizar física
    player.update(dt);
    Portal_1.update(dt);
};

ubik.start();
