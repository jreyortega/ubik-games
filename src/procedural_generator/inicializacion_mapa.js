export function inicializar_mapa(dungeon, tileSize, ubik, sources, character, portal, key, THREE, CANNON) {


    function isPositionOccupied(x, y) {
        const posKey = `${x},${y}`;
        return occupiedPositions.has(posKey);
    }

    const occupiedPositions = new Set();

    //###################################CREACIÓN DE LA MAZMORRA##################################
    var euclidean_distance = 0
    var mejor_euclidean_distance = 0
    var t = 0
    var number_enemies = 0
    var position_enemies = []
    const slabs = [];
    var doorPosition = []
    var keyPosition = []

    //====================Colocación de slabs===================
    dungeon.forEach(position => {

        const posKey = `${position.x * tileSize},${position.y * tileSize}`;

        const slab = ubik.createObject();
        slab.position.set(position.x * tileSize, position.y * tileSize, 0); // Usamos position.set para asignar las coordenadas
        slabs.push(slab);
        occupiedPositions.add(posKey);

        //-----------Posición de los enemigos------------
        if (t == 50 && number_enemies < 5) {
            position_enemies.push([position.x * tileSize, position.y * tileSize])
            t = 0
        }

        //-----------Posición Puerta----------(mas alejada de la pos del jugador)
        euclidean_distance = (Math.sqrt(position.x * position.x + position.y * position.y))

        if (euclidean_distance > mejor_euclidean_distance) {
            mejor_euclidean_distance = euclidean_distance
            doorPosition = [position.x * tileSize, position.y * tileSize]
        }

        t = t + 1
    });

    //--------Posicion objeto portal------------
    portal.position.set(doorPosition[0], doorPosition[1], 0);

    //==============Rellenar huecos de la mazmorra==================
    var euclidean_distance_portal = 0
    var euclidean_distance_player = 0
    var average_euclidean_distance = 0
    mejor_euclidean_distance = 0

    slabs.forEach(slab => {
        let posDown = slab.position.y - tileSize;
        let posUp = slab.position.y + tileSize;
        let posRight = slab.position.x + tileSize;
        let posLeft = slab.position.x - tileSize;

        euclidean_distance_portal = Math.sqrt(Math.pow((slab.position.x - doorPosition[0]), 2) + Math.pow((slab.position.y - doorPosition[1]), 2))
        euclidean_distance_player = (Math.sqrt(slab.position.x * slab.position.x + slab.position.y * slab.position.y))

        average_euclidean_distance = (euclidean_distance_player + euclidean_distance_portal) / 2

        //-------Colocaión de la llave en una distancia media entre la puerta y en jugador-----
        if (average_euclidean_distance > mejor_euclidean_distance) {
            mejor_euclidean_distance = euclidean_distance
            keyPosition = [slab.position.x, slab.position.y]
            console.log("KeyPosition", keyPosition)
        }

        if (isPositionOccupied(posRight, posUp) && !isPositionOccupied(slab.position.x, posUp) && !isPositionOccupied(posRight, slab.position.y)) {
            const posKey = `${posRight},${slab.position.y}`;
            const newslab = ubik.createObject();
            newslab.position.set(posRight, slab.position.y, 0);
            slabs.push(newslab);
            occupiedPositions.add(posKey);


            const posKey2 = `${slab.position.x},${posUp}`;
            const newslab2 = ubik.createObject();
            newslab2.position.set(slab.position.x, posUp, 0);
            slabs.push(newslab2);
            occupiedPositions.add(posKey2);
        }
        if (isPositionOccupied(posRight, posDown) && !isPositionOccupied(slab.position.x, posDown) && !isPositionOccupied(posRight, slab.position.y)) {
            const posKey = `${slab.position.x},${posDown}`;
            const newslab = ubik.createObject();
            newslab.position.set(slab.position.x, posDown, 0);
            slabs.push(newslab);
            occupiedPositions.add(posKey);

            const posKey2 = `${posRight},${slab.position.y}`;
            const newslab2 = ubik.createObject();
            newslab2.position.set(posRight, slab.position.y, 0);
            slabs.push(newslab2);
            occupiedPositions.add(posKey2);
        }
        if (isPositionOccupied(posLeft, posUp) && !isPositionOccupied(slab.position.x, posUp) && !isPositionOccupied(posLeft, slab.position.y)) {
            const posKey = `${posLeft},${slab.position.y}`;
            const newslab = ubik.createObject();
            newslab.position.set(posLeft, slab.position.y, 0);
            slabs.push(newslab);
            occupiedPositions.add(posKey);

            const posKey2 = `${slab.position.x},${posUp}`;
            const newslab2 = ubik.createObject();
            newslab2.position.set(slab.position.x, posUp, 0);
            slabs.push(newslab2);
            occupiedPositions.add(posKey2);
        }
        if (isPositionOccupied(posLeft, posDown) && !isPositionOccupied(slab.position.x, posDown) && !isPositionOccupied(posLeft, slab.position.y)) {
            const posKey = `${slab.position.x},${posDown}`;
            const newslab = ubik.createObject();
            newslab.position.set(slab.position.x, posDown, 0);
            slabs.push(newslab);
            occupiedPositions.add(posKey);

            const posKey2 = `${posLeft},${slab.position.y}`;
            const newslab2 = ubik.createObject();
            newslab2.position.set(posLeft, slab.position.y, 0);
            slabs.push(newslab2);
            occupiedPositions.add(posKey2);
        }

    })

    //--------Inicialización del objeto llave--------
    // const key=ubik.createObject()
    key.position.set(keyPosition[0], keyPosition[1], 0)

    var i = 1

    var exit = 1

    //==============Rellenar más huecos de la mazmorra==================
    while (exit) {
        console.log("--i--:", i)
        if (i == 0) {
            exit = 0
        }

        i = 0

        slabs.forEach(slab => {
            let posDown = slab.position.y - tileSize;
            let posUp = slab.position.y + tileSize;
            let posRight = slab.position.x + tileSize;
            let posLeft = slab.position.x - tileSize;



            if (!isPositionOccupied(posRight, posUp) && isPositionOccupied(posRight + tileSize, posUp + tileSize)) {
                const posKey = `${posRight},${posUp}`;
                const newslab = ubik.createObject();
                newslab.position.set(posRight, posUp, 0);
                slabs.push(newslab);
                occupiedPositions.add(posKey);
                i = i + 1;
            }
            if (!isPositionOccupied(posRight, posDown) && isPositionOccupied(posRight + tileSize, posDown - tileSize)) {
                const posKey = `${posRight},${posDown}`;
                const newslab = ubik.createObject();
                newslab.position.set(posRight, posDown, 0);
                slabs.push(newslab);
                occupiedPositions.add(posKey);
                i = i + 1;
            }
            if (!isPositionOccupied(posLeft, posUp) && isPositionOccupied(posLeft - tileSize, posUp + tileSize)) {
                const posKey = `${posLeft},${posUp}`;
                const newslab = ubik.createObject();
                newslab.position.set(posLeft, posUp, 0);
                slabs.push(newslab);
                occupiedPositions.add(posKey);
                i = i + 1;
            }
            if (!isPositionOccupied(posLeft, posDown) && isPositionOccupied(posLeft - tileSize, posDown - tileSize)) {
                const posKey = `${posLeft},${posDown}`;
                const newslab = ubik.createObject();
                newslab.position.set(posLeft, posDown, 0);
                slabs.push(newslab);
                occupiedPositions.add(posKey);
                i = i + 1;
            }
            if (!isPositionOccupied(posLeft, slab.position.y) && isPositionOccupied(posLeft - tileSize, slab.position.y)) {
                const posKey = `${posLeft},${slab.position.y}`;
                const newslab = ubik.createObject();
                newslab.position.set(posLeft, slab.position.y, 0);
                slabs.push(newslab);
                occupiedPositions.add(posKey);
                i = i + 1;
            }
            if (!isPositionOccupied(posRight, slab.position.y) && isPositionOccupied(posRight + tileSize, slab.position.y)) {
                const posKey = `${posRight},${slab.position.y}`;
                const newslab = ubik.createObject();
                newslab.position.set(posRight, slab.position.y, 0);
                slabs.push(newslab);
                occupiedPositions.add(posKey);
                i = i + 1;
            }
            if (!isPositionOccupied(slab.position.x, posDown) && isPositionOccupied(slab.position.x, posDown - tileSize)) {
                const posKey = `${slab.position.x},${posDown}`;
                const newslab = ubik.createObject();
                newslab.position.set(slab.position.x, posDown, 0);
                slabs.push(newslab);
                occupiedPositions.add(posKey);
                i = i + 1;
            }
            if (!isPositionOccupied(slab.position.x, posUp) && isPositionOccupied(slab.position.x, posUp + tileSize)) {
                const posKey = `${slab.position.x},${posUp}`;
                const newslab = ubik.createObject();
                newslab.position.set(slab.position.x, posUp, 0);
                slabs.push(newslab);
                occupiedPositions.add(posKey);
                i = i + 1;
            }

        })
    }

    const tam = new CANNON.Vec3(tileSize / 2, tileSize / 2, tileSize / 2)

    //=================Colocación paredes laterales===============
    const LeftSideWalls = [];
    const RightSideWalls = []
    slabs.forEach(slab => {

        let posDown = slab.position.y - tileSize;
        let posUp = slab.position.y + tileSize;
        let posRight = slab.position.x + tileSize;
        let posLeft = slab.position.x - tileSize;

        if (!isPositionOccupied(posLeft, posDown) && !isPositionOccupied(posLeft, posUp) && !isPositionOccupied(posLeft, slab.position.y)) {
            if (isPositionOccupied(slab.position.x, posDown) && isPositionOccupied(slab.position.x, posUp) && !isPositionOccupied(posRight, slab.position.y) && !isPositionOccupied(posLeft, slab.position.y)
                && !isPositionOccupied(posRight, posUp) && !isPositionOccupied(posRight, posDown) && !isPositionOccupied(posLeft, posDown) && !isPositionOccupied(posLeft, posUp)) {

                const newslab = ubik.createObject();
                ubik.addComponent(
                    newslab,
                    'rigidbody',
                    ubik.physics.createBody({
                        mass: 1,
                        shape: new CANNON.Box(tam)
                    }))
                newslab.position.set(posRight, slab.position.y, 0);
                RightSideWalls.push(newslab);

                const newslab2 = ubik.createObject();
                ubik.addComponent(
                    newslab2,
                    'rigidbody',
                    ubik.physics.createBody({
                        mass: 1,
                        shape: new CANNON.Box(tam)
                    }))
                newslab2.position.set(posLeft, slab.position.y, 0);
                LeftSideWalls.push(newslab2);

            }
            else {
                const newslab2 = ubik.createObject();
                ubik.addComponent(
                    newslab2,
                    'rigidbody',
                    ubik.physics.createBody({
                        mass: 0,
                        shape: new CANNON.Box(tam)
                    }))
                newslab2.position.set(posLeft, slab.position.y, 0);
                LeftSideWalls.push(newslab2);
            }
        }

        if (!isPositionOccupied(posRight, posDown) && !isPositionOccupied(posRight, posUp) && !isPositionOccupied(posRight, slab.position.y)) {
            if (isPositionOccupied(slab.position.x, posDown) && isPositionOccupied(slab.position.x, posUp) && !isPositionOccupied(posRight, slab.position.y) && !isPositionOccupied(posLeft, slab.position.y)
                && !isPositionOccupied(posRight, posUp) && !isPositionOccupied(posRight, posDown) && !isPositionOccupied(posLeft, posDown) && !isPositionOccupied(posLeft, posUp)) {

                const newslab = ubik.createObject();
                ubik.addComponent(
                    newslab,
                    'rigidbody',
                    ubik.physics.createBody({
                        mass: 0,
                        shape: new CANNON.Box(tam)
                    }))
                newslab.position.set(posRight, slab.position.y, 0);
                RightSideWalls.push(newslab);

                const newslab2 = ubik.createObject();
                ubik.addComponent(
                    newslab2,
                    'rigidbody',
                    ubik.physics.createBody({
                        mass: 0,
                        shape: new CANNON.Box(tam)
                    }))
                newslab2.position.set(posLeft, slab.position.y, 0);
                LeftSideWalls.push(newslab2);

            }
            else {
                const newslab2 = ubik.createObject();
                ubik.addComponent(
                    newslab2,
                    'rigidbody',
                    ubik.physics.createBody({
                        mass: 0,
                        shape: new CANNON.Box(tam)
                    }))
                newslab2.position.set(posRight, slab.position.y, 0);
                RightSideWalls.push(newslab2);
            }
        }

    });

    //=================Colocación paredes de arriba y abajo===============
    const UpWalls = [];
    const DownWalls = [];

    slabs.forEach(slab => {

        let posDown = slab.position.y - tileSize;
        let posUp = slab.position.y + tileSize;
        let posRight = slab.position.x + tileSize;
        let posLeft = slab.position.x - tileSize;

        if (!isPositionOccupied(posRight, posUp) && !isPositionOccupied(posLeft, posUp) && !isPositionOccupied(slab.position.x, posUp)) {
            if (!isPositionOccupied(slab.position.x, posDown) && !isPositionOccupied(slab.position.x, posUp) && isPositionOccupied(posRight, slab.position.y) && isPositionOccupied(posLeft, slab.position.y)
                && !isPositionOccupied(posRight, posUp) && !isPositionOccupied(posRight, posDown) && !isPositionOccupied(posLeft, posDown) && !isPositionOccupied(posLeft, posUp)) {

                const newslab = ubik.createObject();
                ubik.addComponent(
                    newslab,
                    'rigidbody',
                    ubik.physics.createBody({
                        mass: 0,
                        shape: new CANNON.Box(tam)
                    }))
                newslab.position.set(slab.position.x, posUp, 0);
                UpWalls.push(newslab);

                const newslab2 = ubik.createObject();
                ubik.addComponent(
                    newslab2,
                    'rigidbody',
                    ubik.physics.createBody({
                        mass: 0,
                        shape: new CANNON.Box(tam)
                    }))
                newslab2.position.set(slab.position.x, posDown, 0);
                DownWalls.push(newslab2);

            }
            else {
                const newslab = ubik.createObject();
                ubik.addComponent(
                    newslab,
                    'rigidbody',
                    ubik.physics.createBody({
                        mass: 0,
                        shape: new CANNON.Box(tam)
                    }))
                newslab.position.set(slab.position.x, posUp, 0);
                UpWalls.push(newslab);
            }
        }

        if (!isPositionOccupied(posRight, posDown) && !isPositionOccupied(posLeft, posDown) && !isPositionOccupied(slab.position.x, posDown)) {
            if (!isPositionOccupied(slab.position.x, posDown) && !isPositionOccupied(slab.position.x, posUp) && isPositionOccupied(posRight, slab.position.y) && isPositionOccupied(posLeft, slab.position.y)
                && !isPositionOccupied(posRight, posUp) && !isPositionOccupied(posRight, posDown) && !isPositionOccupied(posLeft, posDown) && !isPositionOccupied(posLeft, posUp)) {

                const newslab = ubik.createObject();
                ubik.addComponent(
                    newslab,
                    'rigidbody',
                    ubik.physics.createBody({
                        mass: 0,
                        shape: new CANNON.Box(tam)
                    }))
                newslab.position.set(slab.position.x, posUp, 0);
                UpWalls.push(newslab);

                const newslab2 = ubik.createObject();
                ubik.addComponent(
                    newslab2,
                    'rigidbody',
                    ubik.physics.createBody({
                        mass: 0,
                        shape: new CANNON.Box(tam)
                    }))
                newslab2.position.set(slab.position.x, posDown, 0);
                DownWalls.push(newslab2);

            }
            else {
                const newslab = ubik.createObject();
                ubik.addComponent(
                    newslab,
                    'rigidbody',
                    ubik.physics.createBody({
                        mass: 0,
                        shape: new CANNON.Box(tam)
                    }))
                newslab.position.set(slab.position.x, posDown, 0);
                DownWalls.push(newslab);
            }
        }


    });

    //=================Colocación paredes de las esquinas===============

    const LeftDownCornerWalls = [];

    slabs.forEach(slab => {

        let posDown = slab.position.y - tileSize;
        let posUp = slab.position.y + tileSize;
        let posRight = slab.position.x + tileSize;
        let posLeft = slab.position.x - tileSize;

        if (!isPositionOccupied(posLeft, slab.position.y) && !isPositionOccupied(slab.position.x, posDown) && !isPositionOccupied(posLeft, posDown)) {
            const newslab = ubik.createObject();
            ubik.addComponent(
                newslab,
                'rigidbody',
                ubik.physics.createBody({
                    mass: 0,
                    shape: new CANNON.Box(tam)
                }))
            newslab.position.set(posLeft, posDown, 0);
            LeftDownCornerWalls.push(newslab);
        }
        if (isPositionOccupied(slab.position.x, posUp) && isPositionOccupied(posRight, slab.position.y) && !isPositionOccupied(posRight, posUp)) {
            const newslab = ubik.createObject();
            ubik.addComponent(
                newslab,
                'rigidbody',
                ubik.physics.createBody({
                    mass: 0,
                    shape: new CANNON.Box(tam)
                }))
            newslab.position.set(posRight, posUp, 0);
            UpWalls.push(newslab);
        }
    });

    const RightDownCornerWalls = [];

    slabs.forEach(slab => {

        let posDown = slab.position.y - tileSize;
        let posUp = slab.position.y + tileSize;
        let posRight = slab.position.x + tileSize;
        let posLeft = slab.position.x - tileSize;

        if (!isPositionOccupied(posRight, slab.position.y) && !isPositionOccupied(slab.position.x, posDown) && !isPositionOccupied(posRight, posDown)) {
            const newslab = ubik.createObject();
            ubik.addComponent(
                newslab,
                'rigidbody',
                ubik.physics.createBody({
                    mass: 0,
                    shape: new CANNON.Box(tam)
                }))
            newslab.position.set(posRight, posDown, 0);
            RightDownCornerWalls.push(newslab);
        }

        if (isPositionOccupied(slab.position.x, posUp) && isPositionOccupied(posLeft, slab.position.y) && !isPositionOccupied(posLeft, posUp)) {
            const newslab = ubik.createObject();
            ubik.addComponent(
                newslab,
                'rigidbody',
                ubik.physics.createBody({
                    mass: 0,
                    shape: new CANNON.Box(tam)
                }))
            newslab.position.set(posLeft, posUp, 0);
            UpWalls.push(newslab);
        }
    });

    const RightUpCornerWalls = [];
    const RightUpCornerWallsFillUp = [];
    slabs.forEach(slab => {

        let posDown = slab.position.y - tileSize;
        let posUp = slab.position.y + tileSize;
        let posRight = slab.position.x + tileSize;
        let posLeft = slab.position.x - tileSize;

        if (!isPositionOccupied(posRight, slab.position.y) && !isPositionOccupied(slab.position.x, posUp) && !isPositionOccupied(posRight, posUp)) {
            const newslab = ubik.createObject();
            ubik.addComponent(
                newslab,
                'rigidbody',
                ubik.physics.createBody({
                    mass: 1,
                    shape: new CANNON.Box(tam)
                }))
            newslab.position.set(posRight, posUp, 0);
            RightUpCornerWalls.push(newslab);
        }

        if (isPositionOccupied(posLeft, slab.position.y) && isPositionOccupied(slab.position.x, posDown) && !isPositionOccupied(posLeft, posDown)) {
            const newslab = ubik.createObject();
            ubik.addComponent(
                newslab,
                'rigidbody',
                ubik.physics.createBody({
                    mass: 0,
                    shape: new CANNON.Box(tam)
                }))
            newslab.position.set(posLeft, posDown, 0);
            RightUpCornerWallsFillUp.push(newslab);
        }
    });

    const LeftUpCornerWalls = [];
    const LeftUpCornerWallsFillUp = [];
    slabs.forEach(slab => {

        let posDown = slab.position.y - tileSize;
        let posUp = slab.position.y + tileSize;
        let posRight = slab.position.x + tileSize;
        let posLeft = slab.position.x - tileSize;

        if (!isPositionOccupied(posLeft, slab.position.y) && !isPositionOccupied(slab.position.x, posUp) && !isPositionOccupied(posLeft, posUp)) {
            const newslab = ubik.createObject();
            ubik.addComponent(
                newslab,
                'rigidbody',
                ubik.physics.createBody({
                    mass: 0,
                    shape: new CANNON.Box(tam)
                }))
            newslab.position.set(posLeft, posUp, 0);
            LeftUpCornerWalls.push(newslab);
        }

        if (isPositionOccupied(posRight, slab.position.y) && isPositionOccupied(slab.position.x, posDown) && !isPositionOccupied(posRight, posDown)) {
            const newslab = ubik.createObject();
            ubik.addComponent(
                newslab,
                'rigidbody',
                ubik.physics.createBody({
                    mass: 0,
                    shape: new CANNON.Box(tam)
                }))
            newslab.position.set(posRight, posDown, 0);
            LeftUpCornerWallsFillUp.push(newslab);
        }
    });


    //##################################################COLOCACIÓN DE ASSETS####################################

    ubik.assets.loadAssets(sources);
    ubik.assets.onAssetsLoaded(() => {

        //-------------Assets del suelo----------------
        const slabGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const slabMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('ground'), transparent: false, alphaTest: 0.5 });
        slabs.forEach((slab) => {
            ubik.addComponent(slab, 'mesh', ubik.mesh.createFromGeometry(slabGeometry, slabMaterial));
        });
        //-------------Assets paredes de arriba----------------
        const walls1Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const walls1Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('Down_Wall'), transparent: false, alphaTest: 0.5 });
        UpWalls.forEach((wall) => {
            ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls1Geometry, walls1Material));
        });
        //-------------Assets paredes de abajo----------------
        const walls8Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const walls8Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('Down_Wall'), transparent: false, alphaTest: 0.5 });
        DownWalls.forEach((wall) => {
            ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls8Geometry, walls8Material));
        });
        //-------------Assets paredes de la derecha----------------
        const walls6Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const walls6Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('Right_side_wall'), transparent: false, alphaTest: 0.5 });
        RightSideWalls.forEach((wall) => {
            ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls6Geometry, walls6Material));
        });
        //-------------Assets paredes de la izquierda----------------
        const walls7Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const walls7Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('Left_side_wall'), transparent: false, alphaTest: 0.5 });
        LeftSideWalls.forEach((wall) => {
            ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls7Geometry, walls7Material));
        });
        //-------------Assets esquinas----------------
        const walls2Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const walls2Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('left-down-corner'), transparent: false, alphaTest: 0.5 });
        LeftDownCornerWalls.forEach((wall) => {
            ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls2Geometry, walls2Material));
        });

        const walls3Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const walls3Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('right-down-corner'), transparent: false, alphaTest: 0.5 });
        RightDownCornerWalls.forEach((wall) => {
            ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls3Geometry, walls3Material));
        });

        const walls9Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const walls9Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('Right_up_corner_fill_up'), transparent: false, alphaTest: 0.5 });
        RightUpCornerWallsFillUp.forEach((wall) => {
            ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls9Geometry, walls9Material));
        });

        const walls4Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const walls4Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('Right_side_wall'/*'right-up-corner'*/), transparent: false, alphaTest: 0.5 });
        RightUpCornerWalls.forEach((wall) => {
            ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls4Geometry, walls4Material));
        });

        const walls5Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const walls5Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('Left_side_wall'/*'left-up-corner'*/), transparent: false, alphaTest: 0.5 });
        LeftUpCornerWalls.forEach((wall) => {
            ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls5Geometry, walls5Material));
        });

        const walls11Geometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const walls11Material = new THREE.MeshStandardMaterial({ map: ubik.assets.get('Left_up_corner_fill_up'/*'left-up-corner'*/), transparent: false, alphaTest: 0.5 });
        LeftUpCornerWallsFillUp.forEach((wall) => {
            ubik.addComponent(wall, 'mesh', ubik.mesh.createFromGeometry(walls11Geometry, walls11Material));
        });

        //---------Assets jugador----------
        const playerGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const playerMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('player'), transparent: false, alphaTest: 0.5 });
        ubik.addComponent(character, 'mesh', ubik.mesh.createFromGeometry(playerGeometry, playerMaterial));

        //----------Assets portal---------
        const portalGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const portalMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('portal_closed'), transparent: true, alphaTest: 0.5 });
        ubik.addComponent(portal, 'mesh', ubik.mesh.createFromGeometry(portalGeometry, portalMaterial));

        //----------Assets llave---------
        const keyGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const keyMaterial = new THREE.MeshStandardMaterial({ map: ubik.assets.get('llave'), transparent: true, alphaTest: 0.5 });
        ubik.addComponent(key, 'mesh', ubik.mesh.createFromGeometry(keyGeometry, keyMaterial));

    });

    return position_enemies;

}