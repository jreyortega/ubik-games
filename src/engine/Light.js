import * as THREE from 'three';

export default class Light {
    constructor(ubik) {
        this.scene = ubik.scene;
        this.logger = ubik.logger;
        this.logger.info("Light constructor called");
    }

    createAmbient(color, intensity) {
        const light = new THREE.AmbientLight(color, intensity);
        return light;
    }

    createDirectional(color, intensity, castShadow = false) {
        const light = new THREE.DirectionalLight(color, intensity);
        light.castShadow = castShadow;
        return light;
    }

    createPoint(color, intensity, castShadow = false) {
        const light = new THREE.PointLight(color, intensity);
        light.castShadow = castShadow;
        return light;
    }
}
