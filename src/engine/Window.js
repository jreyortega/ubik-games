import {EventDispatcher} from 'three'

export default class Window extends EventDispatcher
{
    constructor(ubik)
    {
        super()

        this.logger =ubik.logger
        this.logger.info("Sizes constructor called")
        this.width=window.innerWidth
        this.height=window.innerHeight
        this.aspectRatio=this.width/this.height //relation between the width and the height
        this.pixelRatio=Math.min(window.devicePixelRatio,2) //ralation between physics pixsels and logic pixels
                                                            //there are 2 physics pxl for each logic pxl
        //Resize event listener
        //Get the new width, height, aspectRatio and PixelRatio value
        window.addEventListener( 'resize', () =>{
            this.width=window.innerWidth 
            this.height=window.innerHeight
            this.aspectRatio=this.width/this.height
            this.pixelRatio=Math.min(window.devicePixelRatio,2)

            //Emit an event
            this.dispatchEvent({
                type:'resize'
            })

        }) 
    }
}