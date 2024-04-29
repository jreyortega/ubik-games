import * as CANNON from 'cannon-es';

export default class Physics {
    constructor(ubik) {
        this.scene = ubik.scene;
        this.world = new CANNON.World();
        this.logger = ubik.logger;
        this.logger.info("Physics constructor called");
    }

    update(dt, objects) {
        this.world.step(1 / 60, dt, 3);
        for (const object of objects) {
            if (object.rigidBody) {
                // Update the mesh's position and rotation
                object.mesh.position.copy(object.rigidBody.position);
                object.mesh.quaternion.copy(object.rigidBody.quaternion);

                // Update the object's position and rotation    
                object.position.copy(object.rigidBody.position);
                object.quaternion.copy(object.rigidBody.quaternion);
            }
        }
    }

    createBody(options) {
        const body = new CANNON.Body(options);
        this.world.addBody(body);
        return body;
    }
}
