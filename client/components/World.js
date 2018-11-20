import React, {Component} from 'react'
import {withRouter} from 'react-router'
// import * as THREE from 'three'
// import {db} from '../firebase'
import HUD from './HUD';
import {
  //   BlockControl,
  //   PreviewControl,
  CameraControl,
  MotionControl
  //   AvatarControl,
  //   UndoStack,
  //   HorizonControl
} from '../3d/controls'
import {configureRenderer} from '../3d/configure'
import {showInstructions} from '../utilities/utilities'

/*********************************
 * Construct the Three World
 ********************************/

let isPaused = false
let onEsc
let loadingManager = null;
let RESOURCES_LOADED = false;

// An object to hold all the things needed for our loading screen
var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
	box: new THREE.Mesh(
		new THREE.BoxGeometry(0.5,0.5,0.5),
		new THREE.MeshBasicMaterial({ color:0x4444ff })
	)
};

function generateWorld(/*world, currentUser, guestAvatar*/) {

  const {renderer, camera, scene, disposeOfResize} = configureRenderer()

  loadingManager = new THREE.LoadingManager();
	
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};
	
	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
	};
	
  // const cameraControl = new CameraControl(camera, renderer.domElement)
  // scene.add(cameraControl.getObject())

  var control = new THREE.PointerLockControls(camera)
  scene.add(control.getObject())

  window.addEventListener(
    'click',
    function() {
      console.log(control)
      control.lock()
    },
    false
  )

  /*
      EVERYTHING OUTSIDE OF THIS CODE BLOCK IS FROM SPACECRAFT
      =======>>>>>
  */

  //this.mesh = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 16), shotMaterial);

  //Light
  // var dirLight = new THREE.DirectionalLight(0xffffff)
  // dirLight.position.set(-1, 0, 1).normalize()
  // scene.add(dirLight)

  //Load Skybox
  var Skybox = function() {
    var skyboxObject = new THREE.Object3D()

    var imagePrefix = 'images/customspace-'
    var directions = ['ypos', 'yneg', 'zpos', 'zneg', 'xpos', 'xneg']
    var imageSuffix = '.png'

    var loader = new THREE.TextureLoader(loadingManager)

    let materialArray = []
    // let link
    let link = 'images/space.png'
    for (var i = 0; i < 6; i++) {
      // link = imagePrefix + directions[i] + imageSuffix
      loader.load(link, function(texture) {
        materialArray.push(
          new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
          })
        )
      })
    }

    // var cubeMaterials = [
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/customspace-front.png'),
    //     side: THREE.DoubleSide
    //   }), //front side
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/customspace-back.png'),
    //     side: THREE.DoubleSide
    //   }), //back side
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/customspace-top.png'),
    //     side: THREE.DoubleSide
    //   }), //up side
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/customspace-bottom.png'),
    //     side: THREE.DoubleSide
    //   }), //down side
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/customspace-right.png'),
    //     side: THREE.DoubleSide
    //   }), //right side
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/customspace-left.png'),
    //     side: THREE.DoubleSide
    //   }) //left side
    // ]
    var skyGeometry = new THREE.CubeGeometry(50000, 50000, 50000)
    // var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );

    var skyboxMesh = new THREE.Mesh(skyGeometry, materialArray)
    // skyBox.rotation.x = Math.PI / 2
    skyboxObject.add(skyboxMesh)
    // console.log('scene', scene)

    this.getMesh = function() {
      return skyboxObject
    }
  }
  var skybox = new Skybox()
  scene.add(skybox.getMesh())

  // scene.registerBeforeRender(function() {skybox.getMesh().position = camera.position})

  //Load Tunnel
  // renderer.setClearColor('#000022')
  // renderer.setSize(window.innerWidth, window.innerHeight)

  // var Tunnel = function() {
  //   var tunnel = new THREE.Object3D(),
  //     meshes = []

  //   meshes.push(
  //     new THREE.Mesh(
  //       // new THREE.SphereGeometry(30, 160, 160),
  //       new THREE.CylinderGeometry(300, 300, 7000, 24, 24, true),
  //       new THREE.MeshBasicMaterial({
  //         map: new THREE.TextureLoader().load('textures/space.jpg', function(
  //           tex
  //         ) {
  //           tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  //           tex.repeat.set(5, 10)
  //           tex.needsUpdate = true
  //         }),
  //         side: THREE.BackSide
  //       })
  //     )
  //   )
  //   meshes[0].rotation.x = -Math.PI / 2
  //   // Adding the second mesh as a clone of the first mesh
  //   meshes.push(meshes[0].clone())
  //   meshes[1].position.z = -5000

  //   tunnel.add(meshes[0])
  //   tunnel.add(meshes[1])

  //   this.getMesh = function() {
  //     return tunnel
  //   }

  //   this.update = function(z) {
  //     for (var i = 0; i < 2; i++) {
  //       if (z < meshes[i].position.z - 2500) {
  //         meshes[i].position.z -= 10000
  //         break
  //       }
  //     }
  //   }

  //   return this
  // }

  // var tunnel = new Tunnel()
  // scene.add(tunnel.getMesh())
  // scene.fog = new THREE.FogExp2(0x0000022, 0.0015)

  // Player Collision Wrapper Cube

  var cubeGeometry = new THREE.BoxGeometry(10, 10, 10)
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
  })
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  cube.position.set(0, 0, -5)
  cube.name = 'cube'
  scene.add(cube)

  //Load Player Ship
  let spaceship = null

  var Player = function() {
    var playerObj = new THREE.Object3D()
    this.loaded = false
    const self = this
    this.hitbox = new THREE.Box3()
    this.canShoot = 0

    this.update = function() {
      if (!spaceship) return
      this.hitbox.setFromObject(spaceship)
    }

    var onProgress = function(xhr) {
      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100
        console.log(Math.round(percentComplete, 2) + '% downloaded')
      }
    }
    var onError = function() {}

    var keyLight = new THREE.DirectionalLight(
      new THREE.Color('hsl(30, 100%, 75%)'),
      1.0
    )
    keyLight.position.set(-100, 0, 100)

    var light = new THREE.AmbientLight(0x404040) // soft white light
    scene.add(light)

    var fillLight = new THREE.DirectionalLight(
      new THREE.Color('hsl(240, 100%, 75%)'),
      0.75
    )
    fillLight.position.set(100, 0, 100)

    var backLight = new THREE.DirectionalLight(0xffffff, 1.0)
    backLight.position.set(100, 0, -100).normalize()

    scene.add(keyLight)
    scene.add(fillLight)
    scene.add(backLight)

    new THREE.MTLLoader(loadingManager)
      // .setPath('../public/models/')
      .load('models/DevShipT.mtl', function(materials) {
        materials.preload()
        new THREE.OBJLoader(loadingManager)
          .setMaterials(materials)
          // .setPath('../public/models/')
          .load(
            'models/DevShipT.obj',
            function(mesh) {
              mesh.scale.set(3, 3, 3)
              mesh.rotation.set(0, Math.PI, 0)
              // mesh.position.set(0, -5, 0);
              spaceship = mesh

              self.player = spaceship
              playerObj.add(self.player)
              self.loaded = true
            },
            onProgress,
            onError
          )
      })

    this.getMesh = function() {
      return playerObj
    }
    return this
  }

  const player = new Player()
  // player.getMesh().position.set(0, 0, 2)s
  scene.add(player.getMesh())

  // Add Ring for Racing

  var geometry = new THREE.RingGeometry(100, 120, 20)
  var material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide
  })
  var ring = new THREE.Mesh(geometry, material)
  ring.position.set(0, 0, -200)

  scene.add(ring)

  const collisionArr = []
  ring.name = 'init-ring'
  collisionArr.push(ring)
  console.log('COLL ARR:', collisionArr)

  //Add Controls

  // control.getObject().position.set(0, 30, 70) // <-- this is relative to the player's position
  camera.position.set(0, 30, 70) // <-- this is relative to the player's position
  player.getMesh().add(camera)
  player.getMesh().add(cube)
  // player.getMesh().add(control.getObject())

  var controls = new THREE.FlyControls(player.getMesh(), renderer.domElement)

  // var controls = new THREE.PlayerControls(player.getMesh(), camera)
  // controls.init()
  // controls.addEventListener('change', render, false );

  // //Load Asteroids
  // var loader = new THREE.OBJLoader()

  // var Asteroid = function(rockType) {
  //   var mesh = new THREE.Object3D(),
  //     self = this
  //   this.loaded = false

  //   // Speed of motion and rotation
  //   mesh.velocity = Math.random() * 2 + 2
  //   mesh.vRotation = new THREE.Vector3(
  //     Math.random(),
  //     Math.random(),
  //     Math.random()
  //   )

  //   this.hitbox = new THREE.Box3()

  //   var rockMtl = new THREE.MeshBasicMaterial({
  //     map: new THREE.TextureLoader().load('textures/lunarrock.png')
  //   })

  //   loader.load('models/rock' + rockType + '.obj', function(obj) {
  //     obj.traverse(function(child) {
  //       if (child instanceof THREE.Mesh) {
  //         child.material = rockMtl
  //       }
  //     })

  //     obj.scale.set(20, 20, 20)

  //     mesh.add(obj)
  //     mesh.position.set(
  //       -150 + Math.random() * 300,
  //       -150 + Math.random() * 300,
  //       -1500 - Math.random() * 1500
  //     )
  //     self.loaded = true
  //   })

  //   this.reset = function(z) {
  //     mesh.velocity = Math.random() * 2 + 2
  //     mesh.position.set(
  //       -50 + Math.random() * 100,
  //       -50 + Math.random() * 100,
  //       z - 1500 - Math.random() * 1500
  //     )
  //   }

  //   this.update = function(z) {
  //     mesh.position.z += mesh.velocity
  //     mesh.rotation.x += mesh.vRotation.x * 0.02
  //     mesh.rotation.y += mesh.vRotation.y * 0.02
  //     mesh.rotation.z += mesh.vRotation.z * 0.02

  //     if (mesh.children.length > 0) this.hitbox.setFromObject(mesh.children[0])

  //     if (mesh.position.z > z) {
  //       this.reset(z)
  //     }
  //   }

  //   this.getMesh = function() {
  //     return mesh
  //   }

  //   return this
  // }

  // let NUM_ASTEROIDS = 10
  // let asteroids = []
  // for (var i = 0; i < NUM_ASTEROIDS; i++) {
  //   asteroids.push(new Asteroid(Math.floor(Math.random() * 5) + 1))
  //   scene.add(asteroids[i].getMesh())
  // }
  //Load Asteroids
  var loader = new THREE.OBJLoader(loadingManager)

  var Asteroid = function(rockType) {
    var mesh = new THREE.Object3D(),
      self = this
    this.loaded = false

    // Speed of motion and rotation
    mesh.velocity = Math.random() * 2 + 2
    mesh.vRotation = new THREE.Vector3(
      Math.random(),
      Math.random(),
      Math.random()
    )

    this.hitbox = new THREE.Box3()

    var rockMtl = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader(loadingManager).load('textures/lunarrock.png')
    })

    loader.load('models/rock' + rockType + '.obj', function(obj) {
      obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = rockMtl
        }
      })

      obj.scale.set(40, 40, 40)

      mesh.add(obj)
      mesh.position.set(
        -300 + Math.random() * 600,
        -300 + Math.random() * 600,
        -2000 - Math.random() * 2000
      )
      self.loaded = true
    })

    this.reset = function(z) {
      mesh.velocity = Math.random() * 4 + 4
      mesh.position.set(
        -500 + Math.random() * 1000,
        -500 + Math.random() * 1000,
        z - 3000 - Math.random() * 3000
      )
    }

    this.update = function(z) {
      mesh.position.z += mesh.velocity
      mesh.rotation.x += mesh.vRotation.x * 0.02
      mesh.rotation.y += mesh.vRotation.y * 0.02
      mesh.rotation.z += mesh.vRotation.z * 0.02

      if (mesh.children.length > 0) this.hitbox.setFromObject(mesh.children[0])

      if (mesh.position.z > z) {
        this.reset(z)
      }
    }

    this.getMesh = function() {
      return mesh
    }

    return this
  }

  let NUM_ASTEROIDS = 1
  let asteroids = []
  for (var i = 0; i < NUM_ASTEROIDS; i++) {
    asteroids.push(new Asteroid(Math.floor(Math.random() * 5) + 1))
    scene.add(asteroids[i].getMesh())
  }

  // //Add Shooting
  // const Shot = function(initialPos) {
  //   const shotMaterial = new THREE.MeshBasicMaterial({
  //     color: 0xff0000,
  //     transparent: true,
  //     opacity: 0.5
  //   })

  //   this.mesh = new THREE.Mesh(
  //     new THREE.SphereGeometry(0.7, 16, 16),
  //     shotMaterial
  //   )

  //   // var geometry = new THREE.CylinderGeometry(7.47, 9.63, 48.57, 23, 50, false)
  //   // var material = new THREE.MeshBasicMaterial({
  //   //   shading: THREE.FlatShading,
  //   //   color: 0xeb1d1d
  //   // })

  //   // this.mesh = new THREE.Mesh(geometry, material)

  //   // this.mesh.rotation.x = 10
  //   // this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = 0.0027;

  //   this.mesh.position.copy(initialPos)

  //   // this.mesh

  //   this.getMesh = function() {
  //     return this.mesh
  //   }

  //   var shotVector = new THREE.Vector3()
  //   player.getMesh().getWorldDirection(shotVector)

  //   this.update = function(z) {
  //     this.mesh.translateOnAxis(shotVector, -30)

  //     if (Math.abs(this.mesh.position.z - z) > 1000) {
  //       return false
  //       // delete this.mesh;
  //     }
  //     return true
  //   }
  //   return this
  // }

  // //Add Planet
  // var Planet = function() {
  //   var planetObj = new THREE.Object3D()
  //   planetObj.name = 'EARTH'
  //   // Speed of motion and rotation

  //   this.hitbox = new THREE.Box3()
  //   var radius = 4000
  //   var geometry = new THREE.SphereBufferGeometry(radius, 100, 50)
  //   var materialNormalMap = new THREE.MeshPhongMaterial({
  //     specular: 0x333333,
  //     shininess: 15,
  //     map: new THREE.TextureLoader().load(
  //       'textures/planets/earth_atmos_2048.jpg'
  //     ),
  //     specularMap: new THREE.TextureLoader().load(
  //       'textures/planets/earth_specular_2048.jpg'
  //     ),
  //     normalMap: new THREE.TextureLoader().load(
  //       'textures/planets/earth_normal_2048.jpg'
  //     ),
  //     normalScale: new THREE.Vector2(0.85, 0.85)
  //   })
  //   var meshPlanet = new THREE.Mesh(geometry, materialNormalMap)

  //   planetObj.add(meshPlanet)
  //   planetObj.rotation.y = 0
  //   planetObj.rotation.z = 0.41

  //   planetObj.position.set(4000, -1000, -8000)

  //   this.getMesh = function() {
  //     return planetObj
  //   }

  //   return this
  // }
  // var earth = new Planet()
  // scene.add(earth.getMesh())

  //Add Planet
  var Planet = function() {
    var planetObj = new THREE.Object3D()
    planetObj.name = 'EARTH'
    // Speed of motion and rotation

    this.hitbox = new THREE.Box3()
    var radius = 4000
    var geometry = new THREE.SphereBufferGeometry(radius, 100, 50)
    var materialNormalMap = new THREE.MeshPhongMaterial({
      specular: 0x333333,
      shininess: 15,
      map: new THREE.TextureLoader(loadingManager).load(
        'textures/planets/earth_atmos_2048.jpg'
      ),
      specularMap: new THREE.TextureLoader(loadingManager).load(
        'textures/planets/earth_specular_2048.jpg'
      ),
      normalMap: new THREE.TextureLoader(loadingManager).load(
        'textures/planets/earth_normal_2048.jpg'
      ),
      normalScale: new THREE.Vector2(0.85, 0.85)
    })
    var meshPlanet = new THREE.Mesh(geometry, materialNormalMap)

    planetObj.add(meshPlanet)
    planetObj.rotation.y = 0
    planetObj.rotation.z = 0.41

    planetObj.position.set(5000, -1000, -8000)

  this.getMesh = function() {
    return planetObj
  }

  return this
}
var earth = new Planet()
scene.add(earth.getMesh())



  //Add clouds to earth
  var materialClouds = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader(loadingManager).load(
      'textures/planets/earth_clouds_1024.png'
    ),
    transparent: true
  })
  var meshClouds = new THREE.Mesh(
    new THREE.SphereBufferGeometry(4000, 100, 50),
    materialClouds
  )
  meshClouds.scale.set(1.005, 1.005, 1.005)
  meshClouds.position.set(5000, -1000, -8000)
  meshClouds.rotation.z = 0.41
  scene.add(meshClouds)

  // function detectColl() {
  //   // collision detection
  //   collisionArr.forEach(function(e) {
  //     e.material.transparent = false
  //     e.material.opacity = 1.0
  //   })

  //   var cube2 = scene.getObjectByName('cube')
  //   var originPoint = cube2.position.clone()

  //   for (
  //     var vertexIndex = 0;
  //     vertexIndex < cube2.geometry.vertices.length;
  //     vertexIndex++
  //   ) {
  //     var localVertex = cube2.geometry.vertices[vertexIndex].clone()
  //     var globalVertex = localVertex.applyMatrix4(cube2.matrix)
  //     var directionVector = globalVertex.sub(cube2.position)

  //     var ray = new THREE.Raycaster(
  //       originPoint,
  //       directionVector.clone().normalize()
  //     )
  //     var collisionResults = ray.intersectObjects(collisionArr)
  //     // console.log('coll ARR', collisionArr)
  //     // console.log('coll Results', collisionResults)
  //     // console.log('cube2', cube2)
  //     // console.log('originpoint', originPoint)
  //     if (
  //       collisionResults.length > 0 &&
  //       collisionResults[0].distance < directionVector.length()
  //     ) {
  //       collisionResults[0].object.material.transparent = true
  //       collisionResults[0].object.material.opacity = 0.4
  //       console.log('COLLLISIIOSISN')
  //     }
  //   }
  // }

  function detectCollisions() {
    var cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    cubeBBox.setFromObject(cube)
    var ringBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    ringBBox.setFromObject(ring)
    if (cubeBBox.intersectsBox(ringBBox)) {
      console.log('collision')
    }
  }

  /*********************************
   * Render To Screen
   ********************************/
  var clock = new THREE.Clock()
  const shots = []
  function render() {

    player.update()

    skybox.getMesh.position = camera.position

    var delta = clock.getDelta()
    controls.update(delta)

    for (var i = 0; i < NUM_ASTEROIDS; i++) {
      asteroids[i].update(camera.position.z)
    }

    var rotationSpeed = 0.01
    earth.getMesh().rotation.y += rotationSpeed * delta
    meshClouds.rotation.y += rotationSpeed * delta

    //detect collisions
    // detectColl()
    detectCollisions()

    ///shooting function
    for (var index = 0; index < shots.length; index += 1) {
      if (shots[index] === undefined) continue
      if (shots[index].alive === false) {
        shots.splice(index, 1)
        continue
      }
      // shots[index].position.add(shots[index].velocity)
      var shotVector = new THREE.Vector3()
      player.getMesh().getWorldDirection(shotVector)
      shots[index].translateOnAxis(shotVector, -30)
    }
    if (player.canShoot > 0) player.canShoot -= 1

    renderer.render(scene, camera)
  }

  function animate() {
    if (isPaused) return
    
    // loading screen stuff
    if( RESOURCES_LOADED == false ){
      requestAnimationFrame(animate);
      
      loadingScreen.box.position.x -= 0.05;
      if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
      loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
        
      renderer.render(loadingScreen.scene, loadingScreen.camera);
      return;
    }
     
    requestAnimationFrame(animate)
    render() 
  }

  // window.addEventListener('keydown', function(e) {
  //   switch (e.keyCode) {
  //     case 32: // Space
  //       console.log('scene', player.getMesh().position)
  //       e.preventDefault()
  //       var playerPos = player.getMesh().position
  //       // playerPos.sub(new THREE.Vector3(0, 0, 0))
  //       var shot = new Shot(playerPos)
  //       shots.push(shot)
  //       scene.add(shot.getMesh())
  //       // console.log('p', player.getMesh())
  //       // console.log('s', shot.getMesh().position)
  //       break
  //     default:
  //   }
  // })
  window.addEventListener('keydown', function(e) {
    if (player.canShoot <= 0) {
      switch (e.keyCode) {
        case 32: // Space
          e.preventDefault()

          var cameraPos = control.getObject().position
          var playerPos = player.getMesh().position
          console.log('camera', cameraPos)
          console.log('player', playerPos)
          console.log('player const', player)
          // console.log('player mesh vertex array', player.getMesh().children[1].children[0].geometry.attributes.position.array)

          const shotMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.5
          })

          const shot = new THREE.Mesh(
            new THREE.SphereGeometry(0.7, 16, 16),
            shotMaterial
          )

          // position the bullet to come from the player's weapon
          // shot.position.set(0, 5, 30)
          shot.position.set(playerPos.x, playerPos.y, playerPos.z)

          // set the velocity of the bullet
          shot.velocity = new THREE.Vector3(
            -Math.sin(camera.rotation.y),
            0,
            Math.cos(camera.rotation.y)
          )

          // after 1000ms, set alive to false and remove from scene
          // setting alive to false flags our update code to remove
          // the bullet from the bullets array
          shot.alive = true
          setTimeout(function() {
            shot.alive = false
            scene.remove(shot)
          }, 1000)

          // add to scene, array, and set the delay to 10 frames
          shots.push(shot)
          scene.add(shot)
          player.canShoot = 10
          break
        default:
      }
    }
  })
  document.getElementById('world').appendChild(renderer.domElement)
  animate()

  /*********************************
   * Pause The World
   ********************************/

  onEsc = event => {
    if (event.which === 27) {
      isPaused = !isPaused
      showInstructions(isPaused)
      animate()
    }
  }

  window.addEventListener('keydown', onEsc, false)

  /*********************************
   * Dispose functions
   ********************************/

  return function() {
    // cameraControl.dispose()
    // motionControl.dispose()
    // blockControl.dispose()
    // previewControl.dispose()
    // horizonControl.dispose()
    // avatarControl.dispose()
    disposeOfResize()
  }
}

/*********************************
 * Render Component
 ********************************/

class World extends Component {
  constructor() {
    super()
    this.state = {
      authorized: false
    }
  }
  async componentDidMount() {
    generateWorld()
    // try {
    //     let world
    //     if (this.props.match && this.props.match.params.id) {
    //       const uri = '/worlds/' + this.props.match.params.id
    //       const worldRef = db.ref(uri)
    //       world = (await worldRef.once('value')).val()
    //       if (
    //         !world.private ||
    //         (this.props.currentUser &&
    //           world.authorizedPlayers.includes(
    //             this.props.currentUser.displayName
    //           ))
    //       ) {
    //         this.setState({
    //           authorized: true
    //         })
    //         this.unsubscribe = generateWorld(
    //           world,
    //           this.props.currentUser,
    //           this.props.guestAvatar
    //         )
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      window.removeEventListener('keydown', onEsc, false)
      this.unsubscribe()
      // if (isPaused) {
      //   isPaused = !isPaused
      //   showInstructions(isPaused)
      // }
    }
  }

  render() {
    return (
      <div id="world" className="no-cursor">
        <div id="blocker">
          <div id="pause-screen">
            <HUD />
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(World)
