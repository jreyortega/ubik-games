import * as THREE from 'three';
import * as CANNON from 'cannon-es';

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

    // Method to generate a drag force
    generateDragForce(k, velocity) {
        let dragVector = new CANNON.Vec3(0, 0, 0);

        // We only apply the drag force if the velocity is greater than 0
        if (velocity.length() > 0) {
            // Calculate drag direction
            let dragDirection = velocity.clone();
            dragDirection.normalize();
            dragDirection = dragDirection.negate();

            // Calculate drag magnitude
            let dragMagnitude = k * velocity.lengthSquared();

            // Calculate drag force
            dragVector = dragDirection.scale(dragMagnitude);
        }
        return dragVector;
    }

    // Method to generate a spring force
    generateSpringForce(point1, point2, k, restLength) {
        // Calculate the distance between the two points
        let distance = point2.clone().sub(point1);

        // Calculate the spring force
        let springForce = distance.clone().normalize().multiplyScalar(k * (distance.length() - restLength));
        springForce = springForce.negate();

        return new THREE.Vector3().copy(springForce);
    }
}
