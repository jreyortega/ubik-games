import * as THREE from 'three'

export default class Camera
{
    constructor(ubik){
    
        this.logger = ubik.logger
        this.logger.info("Sizes constructor called")
        this.window=ubik.window
        this.scene=ubik.scene
    
        //Limits of the camera (- left limits, + right limits)
        this.instance = new THREE.OrthographicCamera(
            -this.window.width, 
            this.window.width, 
            this.window.height,
            -this.window.height,
        )

        this.instance.position.set(0,0,125)//Sets the position of the camera in three-dimensional space.
        this.scene.add(this.instance) //Adds the camera (this.instance) to the stage (this.scene).

    }

    //Updates the camera configuration in order to fit new window size.
    resize()
    {
        this.instance.aspect = this.window.aspectRatio //Updates the camera aspect ratio (this.instance)
        this.instance.updateProjectionMatrix() //Updates the camera projection matrix (this.instance).
    }

}