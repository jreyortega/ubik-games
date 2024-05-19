import { CorridorFirstDungeonGenerator } from './CorridorFirstDungeonGenerator.js';

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("dungeonCanvas");
    const ctx = canvas.getContext("2d");
    const tileSize = 10;

    // Set canvas to occupy the full window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const generator = new CorridorFirstDungeonGenerator(
        { x: Math.floor(canvas.width / 2 / tileSize), y: Math.floor(canvas.height / 2 / tileSize) },
        10, 10, true,
        14, 5, 0.8
    );

    const floorPositions = generator.corridorFirstDungeonGeneration();

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