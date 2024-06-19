import gsap from 'gsap'

export default class Portal{
    constructor(portal,ubik) {
         // Track the current direction of the player
         this.portal=portal
         this.ubik=ubik
         this.animationTimeline = null;
         this.initAnimation();
    }

    initAnimation() {
        this.animationTimeline = gsap.to({}, {
            duration: 1,
            repeat: -1,
            onUpdate: () => {
                const progress = this.animationTimeline.time() % 1;
                let frameIndex;

                if (progress < 0.25) {
                    frameIndex = 1;
                } else if (progress < 0.5) {
                    frameIndex = 2;
                } else if (progress < 0.75) {
                    frameIndex = 3;
                } else {
                    frameIndex = 4;
                }

                const textureName = `portal_frame${frameIndex}`;
                const texture = this.ubik.assets.get(textureName);

                if (texture) {
                    this.portal.mesh.material.map = texture;
                    this.portal.mesh.material.needsUpdate = true;
                }
            }
        });
    }

    update(dt) {
        
    }
}