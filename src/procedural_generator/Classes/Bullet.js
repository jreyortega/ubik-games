import gsap from 'gsap';
import sources from '../sources-dungeon.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';


export default class Bullet {
    constructor(x, y, speed, angle,player ,ubik) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.angle = angle;
        this.ubik=ubik
        this.tileSize=2
        this.player=player

        this.bullet = this.ubik.createObject();
        const bulletGeometry = new THREE.PlaneGeometry(this.tileSize/3, this.tileSize/3);
        const bulletMaterial = new THREE.MeshStandardMaterial({ map: this.ubik.assets.get('portal_closed'), transparent: true, alphaTest: 0.5 });
        this.ubik.addComponent(this.bullet, 'mesh', this.ubik.mesh.createFromGeometry(bulletGeometry, bulletMaterial));
        const tam = new CANNON.Vec3(this.tileSize / 4, this.tileSize / 4, this.tileSize / 4);
        
        const material = new CANNON.Material('defaultMaterial');
        const contactMaterial = new CANNON.ContactMaterial(material, material, {
            friction: 0.1,
            restitution: 0.7,
        });

        this.ubik.physics.world.addContactMaterial(contactMaterial);
        this.ubik.addComponent(
            this.bullet,
            'rigidbody',
            this.ubik.physics.createBody({
                mass: 1,
                shape: new CANNON.Box(tam),
                material:contactMaterial
            })
        );

        this.bullet.position.set(this.x, this.y, 0);
        this.bullet.mesh.position.copy(this.bullet.position)
        this.bullet.rigidbody.position.copy(this.bullet.position)

        var velocityX = this.speed * Math.cos(this.angle);
        var velocityY = this.speed * Math.sin(this.angle);
        this.bullet.rigidbody.velocity.set(velocityX, velocityY, 0);
        //this.bullet.rigidbody.inertia.set(velocityX, velocityY, 0);
        this.ubik.scene.add(this.bullet);
        
        console.log("bullet==========",this.bullet)

        this.bullet.rigidbody.addEventListener("collide", (e) => {
            console.log("IS COLLIDE----------------------------------------------");});

        this.startLifetimeTimer();
    }

    update(dt)
    {
        


        
        //
     
        this.bullet.position.copy(this.bullet.rigidbody.position);
        this.bullet.mesh.position.copy(this.bullet.rigidbody.position);

        //this.bullet.mesh.position.copy(this.bullet.rigidbody.position);
        
       
    }

    

    startLifetimeTimer() {
        setTimeout(() => {
            // Eliminar la bala después de 5 segundos
            const index = this.player.bullets.indexOf(this);
            if (index !== -1) {
                this.player.bullets.splice(index, 1);
            }
            
            // Eliminar la bala de la escena
            this.ubik.scene.remove(this.bullet.mesh);
            this.ubik.physics.world.removeBody(this.bullet.rigidbody);
        }, 5000);
    }

}