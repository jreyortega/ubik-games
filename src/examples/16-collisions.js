import Ubik from '../engine/Ubik.js';
import sources from './sources-lunar-lander.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

// Create a new Ubik instance (2D game)
const ubik = new Ubik({ cameraType: 'orthographic' });

// Light
const ambientLight = ubik.light.createAmbient('white', 2);
ubik.scene.add(ambientLight);

// Add orbit controls
ubik.camera.addOrbitControls();

// Create player
const player = ubik.createObject();

// Create enemie
const enemie = ubik.createObject();

//Create materials
const concreteMaterial = new CANNON.Material('concrete')
const plasticMaterial = new CANNON.Material('plastic')
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.5
    }
)

ubik.physics.world.addContactMaterial(concretePlasticContactMaterial)



class Player {
    constructor(x, y, player) {
        this.x = x;
        this.y = y;
        this.player = player;
    }

    update(dt) {

        // Move the player with the arrow keys
        if (ubik.input.isKeyPressed('ArrowUp')) {
            playerDirection.y = -1;
        } 
        if (ubik.input.isKeyPressed('ArrowDown')) {
            playerDirection.y = 1;
        } 
        if (ubik.input.isKeyPressed('ArrowLeft')) {
            playerDirection.x = -1;
        } 
        if (ubik.input.isKeyPressed('ArrowRight')) {
            playerDirection.x = 1;
        }
        
    }
}

class Enemies {
    constructor() {
        this.enemie = [];
    }

    update(dt) {

        // Vertical movement
        
    }
}

// Instantiate player
const player1 = new Player(0, 0, player);
const enemies= new Enemies();


// Update instructions
ubik.update = (dt) => {
    // Update player
    player.update(dt);
}

// Start the engine
ubik.start();