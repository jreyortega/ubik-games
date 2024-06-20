import { CorridorFirstDungeonGenerator } from './CorridorFirstDungeonGenerator.js';
import Ubik from '../engine/Ubik.js';
import sources from './sources-dungeon.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { inicializar_mapa } from './inicializacion_mapa.js';
import Player from './Classes/Player.js';
import Enemy from './Classes/Enemy.js';
import Portal from './Classes/Portal.js';

// Function to get the current level from the URL parameters
function getLevelFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('level')) || 1;
}

// Function to reload the page with the next level
function loadNextLevel() {
    const currentLevel = getLevelFromURL();
    const nextLevel = currentLevel + 1;
    window.location.search = `?level=${nextLevel}`;
}

// Get the current level
const currentLevel = getLevelFromURL();

// Update the level display
function updateLevelDisplay(level) {
    const levelElement = document.getElementById('level');
    if (levelElement) {
        levelElement.textContent = `Level: ${level}`;
    }
}

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

    // Update the level display on page load
    updateLevelDisplay(currentLevel);
});

const ubik = new Ubik({ cameraType: 'orthographic' });


// Light
const ambientLight = ubik.light.createAmbient('white', 0.0025);
ubik.scene.add(ambientLight);

// Generate dungeon
const tileSize = 2;
const dungeonGenerator = new CorridorFirstDungeonGenerator({ x: 0, y: 0 }, 100, 3, true);
const dungeon = dungeonGenerator.runProceduralGeneration();

// Initialization of objects
const tam = new CANNON.Vec3(tileSize / 2, tileSize / 2, tileSize / 2);
const character = ubik.createObject();
character.position.set(0, 0, 0);


const portal = ubik.createObject();
const key = ubik.createObject();
const WallsList = [];
const player = new Player(0, 0, character, ubik, WallsList, key);
const [enemies, WallsList2] = inicializar_mapa(dungeon, tileSize, ubik, sources, character, player, portal, key, THREE, CANNON);
player.WallsList = WallsList2;
player.enemies = enemies;
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

    // Check if the player has entered the portal and move to the next level
    for (let i = 0; i < player.bullets.length; i++) {
        player.bullets[i].update(dt);
    }
    // Check if the next level should be loaded
    if (Portal_1.getNextLevel()) {
        console.log("Moving to the next level!");
        loadNextLevel(); // Load the next level
    }
};

ubik.start();

window.addEventListener('load', () => {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }
});
