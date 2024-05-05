import * as THREE from 'three';

export default class Forces {
    // Method to generate a gravitational force between two points
    generateGravitationalForce(point1, point2, mass1, mass2, G, minDistance, maxDistance) {
        // Calculate the distance between the two points
        let distance = point2.clone().sub(point1);
        let distanceLength = distance.length();

        // Clamp the distance to the min and max distance
        distanceLength = Math.min(Math.max(distanceLength, minDistance), maxDistance);

        // Calculate the magnitude of the attraction force
        let forceMagnitude = G * mass1 * mass2 / (distanceLength * distanceLength);

        // Calculate the direction of the force
        distance.normalize();

        // Multiply the force magnitude by the direction to get a vector
        let force = distance.multiplyScalar(forceMagnitude);

        return new THREE.Vector3().copy(force);
    }
}
