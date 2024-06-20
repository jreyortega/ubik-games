class ProceduralGenerationAlgorithms {
    
    static simpleRandomWalk(startPosition, walkLength) {
        let path = new Set();
        path.add(JSON.stringify(startPosition));
        let previousPosition = { ...startPosition };

        for (let i = 0; i < walkLength; i++) {
            let newPosition = {
                x: previousPosition.x + Direction2D.getRandomCardinalDirection().x,
                y: previousPosition.y + Direction2D.getRandomCardinalDirection().y
            };
            path.add(JSON.stringify(newPosition));
            previousPosition = newPosition;
        }

        return Array.from(path).map(pos => JSON.parse(pos));
    }

    static runRandomWalkCorridor(startPosition, corridorLength) {
        let corridor = [];
        let direction = Direction2D.getRandomCardinalDirection();
        let currentPosition = { ...startPosition };
        corridor.push(currentPosition);

        for (let i = 0; i < corridorLength; i++) {
            currentPosition = {
                x: currentPosition.x + direction.x,
                y: currentPosition.y + direction.y
            };
            corridor.push(currentPosition);
        }

        return corridor;
    }
}

class Direction2D {
    static cardinalDirectionList = [
        { x: 0, y: 1 },  // Up
        { x: 1, y: 0 },  // Right
        { x: 0, y: -1 }, // Down
        { x: -1, y: 0 }  // Left
    ];

    static getRandomCardinalDirection() {
        return this.cardinalDirectionList[Math.floor(Math.random() * this.cardinalDirectionList.length)];
    }
}

export { ProceduralGenerationAlgorithms };