import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class AssetManager extends THREE.EventDispatcher {
    constructor(ubik) {
        super();

        // Store the scene and logger from the ubik object
        this.scene = ubik.scene;
        this.logger = ubik.logger;
        this.logger.info('AssetManager constructor called');

        // Initialize asset-related variables
        this.assets = {};
        this.toLoad = 0;
        this.loaded = 0;
        this.assetsReady = false;

        // Initialize loaders
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
    }

    // Method to load assets from sources
    loadAssets(sources) {
        this.toLoad = sources.length;
        for (const source of sources) {
            if (source.type === 'gltf') {
                // Load GLTF file using gltfLoader
                this.loaders.gltfLoader.load(source.path, (file) => {
                    this.sourceLoaded(source, file);
                });
            } else if (source.type === 'texture') {
                // Load texture file using textureLoader
          
                this.loaders.textureLoader.load(source.path, (file) => {
                    this.sourceLoaded(source, file);
                });
            }
        }
    }

    // Method to get an asset by name
    get(name) {
        return this.assets[name];
    }

    // Method called when a source is loaded
    sourceLoaded(source, file) {
        this.logger.info(`AssetManager: ${source.name} loaded, path: ${source.path}`);
        this.assets[source.name] = file;
        this.loaded++;
        if (this.loaded === this.toLoad) {
            // All assets are loaded
            this.assetsReady = true;
            this.dispatchEvent({
                type: 'assetsLoaded',
                totalAssets: this.toLoad,
                assets: this.assets
            });
        }
    }

    // Method to register a callback when assets are loaded
    onAssetsLoaded(callback) {
        this.addEventListener('assetsLoaded', callback);
    }
}
