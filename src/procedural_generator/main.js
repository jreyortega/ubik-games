import { SimpleRandomWalkDungeonGenerator } from './SimpleRandomWalkDungeonGenerator.js';

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("dungeonCanvas");
    const ctx = canvas.getContext("2d");
    const tileSize = 40;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const generator = new SimpleRandomWalkDungeonGenerator(
        { x: Math.floor(canvas.width / 2 / tileSize), y: Math.floor(canvas.height / 2 / tileSize)  }, 
        50, 
        20, 
        true
    );
    const floorPositions = generator.runProceduralGeneration();

    if (!floorPositions) {
        console.error('No floor positions generated.');
        return;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the dungeon
    floorPositions.forEach(position => {
        ctx.fillStyle = 'white';
        ctx.fillRect(position.x * tileSize, position.y * tileSize, tileSize, tileSize);
    });
});