import * as CANNON from 'cannon-es';
import gsap from 'gsap';

export default class Player {
    constructor(x, y, character, ubik, WallsList) {
        this.x = x;
        this.y = y;
        this.character = character;
        this.ubik = ubik;
        this.isWalking = false;
        this.animationStarted = false;
        this.animationTimeline = null;
        this.currentDirection = null; // Track the current direction of the player
        this.lastDirection = null; // Track the last direction of the player
        this.life = 100; // Player life
        this.upCollision = 1
        this.rightCollision = 1
        this.downCollision = 1
        this.leftCollision = 1
        this.WallsList = WallsList
        this.tileSize = 2
        this.isAttacking = false; // Track if the player is attacking
        this.canAttack = true; // Track if the player can attack

        // Light
        this.pointLightCharacter = ubik.light.createPoint('white', 2000);
        this.pointLightCharacter.position.set(x, y, 10);
        this.pointLightCharacter.distance = 20;
        this.pointLightCharacter.decay = 4;

        this.specificLightCharacter = ubik.light.createPoint('white', 7000);
        this.specificLightCharacter.position.set(x, y, 9);
        this.specificLightCharacter.distance = 10;
        this.specificLightCharacter.decay = 4;

        this.ubik.scene.add(this.pointLightCharacter);
        this.ubik.scene.add(this.specificLightCharacter);

        // Reference to the camera
        this.camera = ubik.camera;

        // Set initial camera position and zoom level
        this.updateCamera();
    }

    update(dt) {
        let isMoving = false;
        let newDirection = null;
        const speed = 8; // units per second
        let tolerancia = 0.05;
        this.leftCollision = 1;
        this.rightCollision = 1;
        this.downCollision = 1;
        this.upCollision = 1;

        this.WallsList.forEach(wall => {

            let deltaX = this.character.position.x - wall.position.x;
            let deltaY = this.character.position.y - wall.position.y;

            if (
                this.character.position.x - this.tileSize / 2 < wall.position.x + this.tileSize / 2 + tolerancia &&
                this.character.position.x - this.tileSize / 2 > wall.position.x - this.tileSize / 2 - tolerancia &&
                wall.position.y + this.tileSize / 2 > this.character.position.y && this.character.position.y > wall.position.y - this.tileSize / 2) {

                this.leftCollision = 0;
                this.character.position.x = wall.position.x + this.tileSize;

            }

            if (
                this.character.position.x + this.tileSize / 2 > wall.position.x - this.tileSize / 2 - tolerancia &&
                this.character.position.x + this.tileSize / 2 < wall.position.x + this.tileSize / 2 + tolerancia &&
                wall.position.y + this.tileSize / 2 > this.character.position.y && this.character.position.y > wall.position.y - this.tileSize / 2) {
                this.rightCollision = 0;
                this.character.position.x = wall.position.x - this.tileSize;

            }

            if (this.character.position.y + this.tileSize / 2 > wall.position.y - this.tileSize / 2 - tolerancia &&
                this.character.position.y + this.tileSize / 2 < wall.position.y + this.tileSize / 2 + tolerancia &&
                wall.position.x + this.tileSize / 2 > this.character.position.x && this.character.position.x > wall.position.x - this.tileSize / 2) {
                this.downCollision = 0;
                this.character.position.y = wall.position.y - this.tileSize;

            }

            if (this.character.position.y - this.tileSize / 2 < wall.position.y + this.tileSize / 2 + tolerancia &&
                this.character.position.y - this.tileSize / 2 > wall.position.y - this.tileSize / 2 - tolerancia &&
                wall.position.x + this.tileSize / 2 > this.character.position.x && this.character.position.x > wall.position.x - this.tileSize / 2) {
                this.upCollision = 0;
                this.character.position.y = wall.position.y + this.tileSize;

            }
        });

        if (this.ubik.input.isKeyPressed('w') && this.downCollision == 1) {
            this.y += speed * dt;
            newDirection = 'up';
            isMoving = true;
        }
        if (this.ubik.input.isKeyPressed('s') && this.upCollision == 1) {
            this.y -= speed * dt;
            newDirection = 'down';
            isMoving = true;
        }
        if (this.ubik.input.isKeyPressed('a') && this.leftCollision == 1) {
            this.x -= speed * dt;
            newDirection = 'left';
            isMoving = true;
        }
        if (this.ubik.input.isKeyPressed('d') && this.rightCollision == 1) {
            this.x += speed * dt;
            newDirection = 'right';
            isMoving = true;
        }
        if (this.ubik.input.isKeyPressed(' ') && this.canAttack) {
            this.isAttacking = true;
            this.canAttack = false;
            setTimeout(() => {
                this.isAttacking = false;
                setTimeout(() => {
                    this.canAttack = true;
                }, 200);
            }, 200);
        }

        this.character.position.set(this.x, this.y, 1);
        if (this.character.mesh) {
            this.character.mesh.position.copy(this.character.position);
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
            if (this.currentDirection !== null) {
                this.lastDirection = this.currentDirection;
                this.currentDirection = null;
                this.stopWalkingAnimation();
            }
            if (this.isAttacking) {
                if (this.lastDirection === 'right') {
                    this.character.mesh.material.map = this.ubik.assets.get('player_attacking_right');
                } else if (this.lastDirection === 'left') {
                    this.character.mesh.material.map = this.ubik.assets.get('player_attacking_left');
                } else if (this.lastDirection === 'up') {
                    this.character.mesh.material.map = this.ubik.assets.get('player_attacking_up');
                } else if (this.lastDirection === 'down') {
                    this.character.mesh.material.map = this.ubik.assets.get('player_attacking_down');
                }
            } else {
                if (this.lastDirection === 'right') {
                    this.character.mesh.material.map = this.ubik.assets.get('player_walk_right2');
                } else if (this.lastDirection === 'left') {
                    this.character.mesh.material.map = this.ubik.assets.get('player_walk_left2');
                } else if (this.lastDirection === 'up') {
                    this.character.mesh.material.map = this.ubik.assets.get('player_walk_up1');
                } else if (this.lastDirection === 'down') {
                    this.character.mesh.material.map = this.ubik.assets.get('player_walk_down1');
                }
            }
        }

        // Update character light position
        this.pointLightCharacter.position.set(this.x, this.y, 10);
        this.specificLightCharacter.position.set(this.x, this.y, 9);

        // Update the camera position and zoom level
        this.updateCamera();

        // Update HUD (uncomment if needed)
        document.getElementById('life').innerText = `Life: ${this.life}`;
    }


    updateCamera() {
        // Set the camera to follow the player
        this.camera.follow({ x: this.x, y: this.y }, { x: 0, y: 0, z: 125 }, 2.5); // Adjust offset and zoom as needed
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
                const textureName = this.isAttacking ? 'player_attacking_right' : `player_walk_right${this.animationTimeline.time() % 0.25 < 0.125 ? 1 : 2}`;
                const texture = this.ubik.assets.get(textureName);

                if (texture && this.character.mesh) {
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
                const textureName = this.isAttacking ? 'player_attacking_left' : `player_walk_left${this.animationTimeline.time() % 0.25 < 0.125 ? 1 : 2}`;
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
                const textureName = this.isAttacking ? 'player_attacking_up' : `player_walk_up${this.animationTimeline.time() % 0.25 < 0.125 ? 1 : 2}`;
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
                const textureName = this.isAttacking ? 'player_attacking_down' : `player_walk_down${this.animationTimeline.time() % 0.25 < 0.125 ? 1 : 2}`;
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
