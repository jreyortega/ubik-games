import * as THREE from 'three'

export default class Light{

    constructor(ubik){

        this.scene=ubik.scene
        this.logger=ubik.logger
        this.logger.info("Light constructor called")
    }

    CreateAmbient(color,intensity){

        const light  = new THREE.AmbientLight(color,intensity);
        return light
    }

    CreateDirectional(color,intensity){

        const light = new THREE.DirectionalLight(color,intensity);
        return light
    }

    CreatePoint(color,intensity){

        const light = new THREE.PointLight(color,intensity);
        return light
    }

}