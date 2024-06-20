import { CorridorFirstDungeonGenerator } from './CorridorFirstDungeonGenerator.js';
import Ubik from '../engine/Ubik.js';
import sources from './sources-dungeon.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { inicializar_mapa } from './inicializacion_mapa.js';
import Player from './Classes/Player.js';
import Enemy from './Classes/Enemy.js';
import Portal from './Classes/Portal.js';

// Play background music
window.addEventListener('DOMContentLoaded', (event) => {
    const backgroundMusic = document.getElementById('background-music');
    const audioButton = document.getElementById('audio-button');

    // Function to toggle the audio
    const toggleAudio = () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(error => {
                console.error("Failed to play audio:", error);
            });
            audioButton.src = "audio.png"; // Change to an icon indicating music is playing
        } else {
            backgroundMusic.pause();
            audioButton.src = "noaudio.png"; // Change back to the default icon
        }
    };

    // Listen for the button click to toggle audio
    audioButton.addEventListener('click', toggleAudio);
});


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
const WallsList=[]
const player = new Player(0, 0, character, ubik, WallsList, key);
const [enemies,WallsList2] = inicializar_mapa(dungeon, tileSize, ubik, sources, character, player, portal, key, THREE, CANNON);
player.WallsList=WallsList2
const Portal_1 = new Portal(portal, ubik, player);

// Collision avoidance function for enemies
function collisionAvoidance(enemies) {
    const minDistance = 1; // Minimum distance between enemies
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            const speed = 0.05;
            const dx = enemies[j].x - enemies[i].x;
            const dy = enemies[j].y - enemies[i].y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
            if (distance < minDistance) {
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                enemies[i].x -= normalizedDx * speed;
                enemies[i].y -= normalizedDy * speed;
                enemies[j].x += normalizedDx * speed;
                enemies[j].y += normalizedDy * speed;
            }
        }
    }
}

// Update function
ubik.update = (dt) => {
    ubik.physics.update(dt, ubik.objects); // Update physics
    player.update(dt);
    Portal_1.update(dt);
    enemies.forEach((enemy, index) => {
        enemy.update(dt);
    });
    collisionAvoidance(enemies);
};

ubik.start();
