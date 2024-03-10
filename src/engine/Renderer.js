import * as THREE from 'three'

export default class Renderer
{
    constructor(ubik){
    
        this.logger = ubik.logger
        this.logger.info("Sizes constructor called")
        this.window=ubik.window
        this.scene=ubik.scene
        this.camera =stan.camera

        //This instance will be responsible for rendering the scene in the browser using WebGL.
        this.instance = new THREE.WebGLRenderer()
        document.body.appendChild(this.instance.domElement)//places the WebGL rendering canvas on the web page so that the scene can be displayed.
        this.instance.setSize(
            this.window.width,
            this.window.height, 
        )
        this.instance.setPixelRatio(this.window.pixelRatio)
    }

    resize()
    {
        this.instance.setSize(
            this.window.width,
            this.window.height
        )
        this.instance.setPixelRatio(this.window.pixelRatio)
    }

    //render the scene
    frame()
    {
        this.instance.render(
            this.scene,
            this.camera.instance
        )
    }

}