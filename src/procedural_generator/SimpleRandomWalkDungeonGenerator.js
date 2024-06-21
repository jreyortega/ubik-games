import { ProceduralGenerationAlgorithms } from './ProceduralGenerationAlgorithms.js';
import { CorridorFirstDungeonGenerator } from './CorridorFirstDungeonGenerator.js';

class SimpleRandomWalkDungeonGenerator {
    constructor(startPosition = { x: 0, y: 0 }, iterations = 10, walkLength = 10, startRandomEachIteration = true) {
        this.startPosition = startPosition;
        this.iterations = iterations;
        this.walkLength = walkLength;
        this.startRandomEachIteration = startRandomEachIteration;
    }

    runProceduralGeneration() {
        const floorPositions = this.runRandomWalk(this.startPosition);
        floorPositions.forEach(position => {
            console.log(`Floor position: x: ${position.x}, y: ${position.y}`);
        });
        return floorPositions;
    }

    runRandomWalk(position) {
        let currentPosition = { ...position };
        let floorPositions = new Set();

        for (let i = 0; i < this.iterations; i++) {
            const path = ProceduralGenerationAlgorithms.simpleRandomWalk(currentPosition, this.walkLength);
            path.forEach(pos => floorPositions.add(JSON.stringify(pos)));

            if (this.startRandomEachIteration && floorPositions.size > 0) {
                const randomIndex = Math.floor(Math.random() * floorPositions.size);
                currentPosition = JSON.parse(Array.from(floorPositions)[randomIndex]);
            }
        }

        return Array.from(floorPositions).map(pos => JSON.parse(pos));
    }
}

export { SimpleRandomWalkDungeonGenerator };
