import { CorridorFirstDungeonGenerator } from './CorridorFirstDungeonGenerator.js';
import { SimpleRandomWalkDungeonGenerator } from './SimpleRandomWalkDungeonGenerator.js';


document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("dungeonCanvas");
    const ctx = canvas.getContext("2d");
    const tileSize = 10; // Ajusta el tamaño de las celdas aquí

    // Set canvas to occupy the full window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const dungeonGenerator = new CorridorFirstDungeonGenerator({ x: 50, y:50 }, 10, 10, true);
    const dungeon = dungeonGenerator.runProceduralGeneration();

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the dungeon
    dungeon.forEach(position => {
        ctx.fillStyle = 'white';
        ctx.fillRect(position.x * tileSize, position.y * tileSize, tileSize, tileSize);
    });

    
});