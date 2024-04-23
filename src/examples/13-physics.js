import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Ubik from '../engine/Ubik.js';
import CannonDebugger from 'cannon-es-debugger';

const ubik = new Ubik({ cameraType: 'isometric' })

//Initialize the gravity
ubik.physics.world.gravity.set(0,-9.81,0)

const cannonDebugger=new CannonDebugger(ubik.scene, ubik.physics.world,{})

// Directional light
const directionalLight = ubik.light.createDirectional('white', 10);
directionalLight.position.set(0, 70, 0);
directionalLight.target.position.set(0, -10, 0); // Set the target position
directionalLight.castShadow = true;
ubik.scene.add(directionalLight);
ubik.scene.add(directionalLight.target); // Add the light's target to the scene


// Ambient light blue light
const ambientLight = ubik.light.createAmbient('white', 1);
ubik.scene.add(ambientLight);

const ball=ubik.createObject()
ubik.addComponentToObject(
    ball,
    'mesh',
    ubik.mesh.createFromGeometry(
        new THREE.SphereGeometry(2,32,16),
        new THREE.MeshStandardMaterial({ color: 'red', roughness: 0.4, metalness: 0.5})
        
    )
)
ubik.addComponentToObject(
    ball,
    'rigidbody',
    ubik.physics.CreateBody({
        mass: 1,
        shape: new CANNON.Sphere(2),
    })
)
ball.position.set(0,20,0)
ball.mesh.castShadow = true;

console.log(ball)

const floor = ubik.createObject("floor");
ubik.addComponentToObject(
    floor,
    'mesh',
    ubik.mesh.createFromGeometry(
        new THREE.PlaneGeometry(50,50),
        new THREE.MeshStandardMaterial({ color: 'white', roughness: 0.4, metalness: 0.5})
    )
)

ubik.addComponentToObject(
    floor,
    'rigidbody',
    ubik.physics.CreateBody({
        mass: 0,
        shape: new CANNON.Plane(),
    })
)

floor.mesh.position.set(0, -20, 0);
floor.mesh.rotation.x = -Math.PI / 2;
floor.mesh.receiveShadow=true;

console.log(floor)
ubik.camera.addOrbitControls();

ubik.update = (dt) => {
    // Step de la física de Cannon
    ubik.physics.world.step(dt);

    //Actualizar la posición y rotación de la pelota basada en la física
    ball.mesh.position.copy(ball.rigidbody.position);
    ball.mesh.quaternion.copy(ball.rigidbody.quaternion);

    floor.rigidbody.position.copy(floor.mesh.position);
    floor.rigidbody.quaternion.copy(floor.mesh.quaternion);

    //console.log(floor)
    //floor.rigidbody.scale.copy(floor.mesh.scale);
    cannonDebugger.update();
}

// Start the engine
ubik.start();