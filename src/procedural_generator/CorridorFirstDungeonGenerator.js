import { SimpleRandomWalkDungeonGenerator } from './SimpleRandomWalkDungeonGenerator.js';
import { ProceduralGenerationAlgorithms } from './ProceduralGenerationAlgorithms.js';

class CorridorFirstDungeonGenerator extends SimpleRandomWalkDungeonGenerator {
    constructor(startPosition, iterations, walkLength, startRandomEachIteration, corridorLength = 14, corridorCount = 5, roomPercent = 0.8) {
        super(startPosition, iterations, walkLength, startRandomEachIteration);
        this.corridorLength = corridorLength;
        this.corridorCount = corridorCount;
        this.roomPercent = roomPercent;
    }

    runProceduralGeneration() {
        return this.corridorFirstDungeonGeneration();
    }

    corridorFirstDungeonGeneration() {
        let floorPositions = new Set();
        let potentialRoomPositions = new Set();

        this.createCorridors(floorPositions, potentialRoomPositions);
        const roomPositions = this.createRooms(potentialRoomPositions);

        roomPositions.forEach(pos => floorPositions.add(pos));

        return Array.from(floorPositions).map(pos => JSON.parse(pos));
    }

    createRooms(potentialRoomPositions) {
        let roomPositions = new Set();
        const roomToCreateCount = Math.round(potentialRoomPositions.size * this.roomPercent);
        const roomsToCreate = Array.from(potentialRoomPositions).sort(() => 0.5 - Math.random()).slice(0, roomToCreateCount);

        roomsToCreate.forEach(roomPosition => {
            const roomFloor = this.runRandomWalk(JSON.parse(roomPosition));
            roomFloor.forEach(pos => roomPositions.add(JSON.stringify(pos)));
        });

        return roomPositions;
    }

    createCorridors(floorPositions, potentialRoomPositions) {
        let currentPosition = { ...this.startPosition };
        potentialRoomPositions.add(JSON.stringify(currentPosition));

        // for (let i = 0; i < this.corridorCount; i++) {
        //     const path = ProceduralGenerationAlgorithms.runRandomWalkCorridor(currentPosition, this.corridorLength);
        //     path.forEach(pos => {
        //         potentialRoomPositions.add(JSON.stringify(pos));
        //         floorPositions.add(JSON.stringify(pos));
        //     });

        //     currentPosition = path[path.length - 1];
        // }
        for (let i = 0; i < this.corridorCount; i++) {
            const corridor = ProceduralGenerationAlgorithms.runRandomWalkCorridor(currentPosition, this.corridorLength);
            currentPosition = corridor[corridor.length - 1];
        
            // Adding the positions to the potential room positions and floor positions
            potentialRoomPositions.add(JSON.stringify(currentPosition));
            corridor.forEach(pos => floorPositions.add(JSON.stringify(pos)));
        }
    }
}

export { CorridorFirstDungeonGenerator };