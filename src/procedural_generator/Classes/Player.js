import * as CANNON from 'cannon-es';
import gsap from 'gsap';

export default class Player {
    constructor(x, y, character, ubik) {
        this.x = x;
        this.y = y;
        this.character = character;
        this.ubik = ubik;
        this.isWalking = false;
        this.animationStarted = false;
        this.animationTimeline = null;
        this.currentDirection = null; // Track the current direction of the player
    }

    update(dt) {
        let isMoving = false;
        let newDirection = null;
        const speed = 8; // units per second

        if (this.ubik.input.isKeyPressed('w')) {
            this.y += speed * dt;
            newDirection = 'up';
            isMoving = true;
        }
        if (this.ubik.input.isKeyPressed('s')) {
            this.y -= speed * dt;
            newDirection = 'down';
            isMoving = true;
        }
        if (this.ubik.input.isKeyPressed('a')) {
            this.x -= speed * dt;
            newDirection = 'left';
            isMoving = true;
        }
        if (this.ubik.input.isKeyPressed('d')) {
            this.x += speed * dt;
            newDirection = 'right';
            isMoving = true;
        }

        if (isMoving) {
            this.isWalking = true;
            if (newDirection !== this.currentDirection) {
                this.currentDirection = newDirection;
                this.stopWalkingAnimation();
                this.startWalkingAnimation(newDirection);
            }
        } else {
            this.isWalking = false;
            this.currentDirection = null;
            this.stopWalkingAnimation();
        }

        // Update character position
        this.character.position.set(this.x, this.y, 1);

        // Update character light position (uncomment if needed)
        // pointLightCharacter.position.set(this.x, this.y, 0);

        // Update HUD (uncomment if needed)
        // document.getElementById('life').innerText = `Life: ${this.life}`;
    }


    startWalkingAnimation(direction) {
        let animationFunction;
        switch (direction) {
            case 'right':
                animationFunction = this.startWalkingAnimationRight;
                break;
            case 'left':
                animationFunction = this.startWalkingAnimationLeft;
                break;
            case 'up':
                animationFunction = this.startWalkingAnimationUp;
                break;
            case 'down':
                animationFunction = this.startWalkingAnimationDown;
                break;
        }

        if (typeof animationFunction === 'function') {
            animationFunction.call(this);
            this.animationStarted = true;
        }
    }

    startWalkingAnimationRight() {
        this.animationTimeline = gsap.to({}, {
            duration: 0.25,
            repeat: -1,
            onUpdate: () => {
                const progress = this.animationTimeline.time() % 0.25;
                const frameIndex = progress < 0.125 ? 1 : 2;
                const textureName = `player_walk_right${frameIndex}`;
                const texture = this.ubik.assets.get(textureName);

                if (texture) {
                    this.character.mesh.material.map = texture;
                    this.character.mesh.material.needsUpdate = true;
                }
            }
        });
    }

    startWalkingAnimationLeft() {
        this.animationTimeline = gsap.to({}, {
            duration: 0.25,
            repeat: -1,
            onUpdate: () => {
                const progress = this.animationTimeline.time() % 0.25;
                const frameIndex = progress < 0.125 ? 1 : 2;
                const textureName = `player_walk_left${frameIndex}`;
                const texture = this.ubik.assets.get(textureName);

                if (texture) {
                    this.character.mesh.material.map = texture;
                    this.character.mesh.material.needsUpdate = true;
                }
            }
        });
    }

    startWalkingAnimationUp() {
        this.animationTimeline = gsap.to({}, {
            duration: 0.25,
            repeat: -1,
            onUpdate: () => {
                const progress = this.animationTimeline.time() % 0.25;
                const frameIndex = progress < 0.125 ? 1 : 2;
                const textureName = `player_walk_up${frameIndex}`;
                const texture = this.ubik.assets.get(textureName);

                if (texture) {
                    this.character.mesh.material.map = texture;
                    this.character.mesh.material.needsUpdate = true;
                }
            }
        });
    }

    startWalkingAnimationDown() {
        this.animationTimeline = gsap.to({}, {
            duration: 0.25,
            repeat: -1,
            onUpdate: () => {
                const progress = this.animationTimeline.time() % 0.25;
                const frameIndex = progress < 0.125 ? 1 : 2;
                const textureName = `player_walk_down${frameIndex}`;
                const texture = this.ubik.assets.get(textureName);

                if (texture) {
                    this.character.mesh.material.map = texture;
                    this.character.mesh.material.needsUpdate = true;
                }
            }
        });
    }

    stopWalkingAnimation() {
        if (this.animationTimeline) {
            this.animationTimeline.kill();
            this.animationTimeline = null;
            this.animationStarted = false;
        }
    }
}