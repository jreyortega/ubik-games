import * as CANNON from 'cannon-es';
import gsap from 'gsap';
import Bullet from './Bullet.js';
export default class Player {
    constructor(x, y, character, ubik, WallsList, key, enemies) {
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
        this.upCollision = 1;
        this.rightCollision = 1;
        this.downCollision = 1;
        this.leftCollision = 1;
        this.WallsList = WallsList;
        this.tileSize = 2;
        this.isAttacking = false; // Track if the player is attacking
        this.canAttack = true; // Track if the player can attack
        this.key = key;
        this.hasKey = false;
        this.enemies = enemies;

        //Bullet
        this.tileSize = 2
        this.bullets = [];
        this.lastShotTime = 0

        // Light
        this.pointLightCharacter = ubik.light.createPoint('white', 2000);
        this.pointLightCharacter.position.set(x, y, 10);
        this.pointLightCharacter.distance = 20;
        this.pointLightCharacter.decay = 4;

        this.specificLightCharacter = ubik.light.createPoint('white', 7000);
        this.specificLightCharacter.position.set(x, y, 9);
        this.specificLightCharacter.distance = 10;
        this.specificLightCharacter.decay = 4;

        this.specificLightKey = ubik.light.createPoint('white', 15000);
        this.specificLightKey.distance = 9.5;
        this.specificLightKey.decay = 3.5;

        this.ubik.scene.add(this.pointLightCharacter);
        this.ubik.scene.add(this.specificLightCharacter);
        this.ubik.scene.add(this.specificLightKey);

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

        // Key collision check
        this.specificLightKey.position.set(this.key.position.x, this.key.position.y, 9);
        if (Math.abs(this.character.position.x - this.key.position.x) < this.tileSize / 2 &&
            Math.abs(this.character.position.y - this.key.position.y) < this.tileSize / 2) {
            console.log("Player has the key!");
            this.hasKey = true;
            this.key.mesh.visible = false;
            this.specificLightKey.visible = false;
        }

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

        if (this.ubik.input.isMouseClicked('left')) {
            const currentTime = performance.now();
            if (currentTime - this.lastShotTime >= 1000) { // 5000 ms = 5 segundos
                this.ubik.logger.info(`Mouse clicked at (${this.ubik.input.mouseX}, ${this.ubik.input.mouseY})`);
                const angle = Math.atan2(this.ubik.input.mouseY - this.y, this.ubik.input.mouseX - this.x);
                this.shoot(angle);
                this.lastShotTime = currentTime; // Actualizar el tiempo del último disparo
            }
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

    shoot(angle) {
        console.log("dispara============================")
        const bullet = new Bullet(this.character.position.x, this.character.position.y, 3, angle, this, this.ubik, this.enemies);

        this.bullets.push(bullet);
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

                if (texture && this.character.mesh) {
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

                if (texture && this.character.mesh) {
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

                if (texture && this.character.mesh) {
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
