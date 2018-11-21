import React, {Component} from 'react'
import {withRouter} from 'react-router'
import store, {addPoints} from '../store'
// import * as THREE from 'three'
// import {db} from '../firebase'
import HUD from './HUD'
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
let loadingManager = null
let RESOURCES_LOADED = false
let counter = 0

// An object to hold all the things needed for our loading screen
var loadingScreen = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 100),
  box: new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({color: 0x4444ff})
  )
}

function generateWorld(/*world, currentUser, guestAvatar*/) {
  const {renderer, camera, scene, disposeOfResize} = configureRenderer()

  loadingManager = new THREE.LoadingManager()

  var progress = document.getElementById('progress-container')
  // progress.id = 'progress-container'
  // var progressBar = document.getElementById('progress');
  var HUD = document.getElementById('hudContainer')

  // progressBar.id = 'progress'
  // progress.appendChild(progressBar);
  // document.body.appendChild(progress);

  loadingManager.onProgress = function(item, loaded, total) {
    // progressBar.style.width = (loaded / total * 100) + '%';
    console.log(`loaded resource ${loaded}/${total}`)
  }

  loadingManager.onLoad = function() {
    console.log('loaded all resources')
    RESOURCES_LOADED = true
    // progressBar.style.display = 'none'
    progress.style.display = 'none'
    HUD.style.display = 'flex'
  }

  // loadingScreen.box.position.set(0,0,5);
  // loadingScreen.camera.lookAt(loadingScreen.box.position);
  // loadingScreen.scene.add(loadingScreen.box);

  // const cameraControl = new CameraControl(camera, renderer.domElement)
  // scene.add(cameraControl.getObject())

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

  // Player Collision Wrapper Cube

  var cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  var cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    // alphaMap: new THREE,
    opacity: 0,
    side: THREE.DoubleSide,
    transparent: true
  })
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  cube.position.set(0, 0, -5)
  cube.name = 'cube'
  scene.add(cube)

  //Load Player Ship

  var Player = function() {
    let spaceship = null
    var playerObj = new THREE.Object3D()
    this.loaded = false
    const self = this
    // this.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    // this.hitbox.setFromObject(cube)
    this.hitbox = cube
    this.canShoot = 0

    playerObj.add(this.hitbox)

    var onProgress = function(xhr) {
      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100
        // console.log(Math.round(percentComplete, 2) + '% downloaded')
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

    // this.update = function() {
    //   this.hitbox.setFromObject(spaceship)
    // }
    this.getMesh = function() {
      return playerObj
    }
    return this
  }

  const player = new Player()
  // player.getMesh().position.set(0, 0, 2)s

  scene.add(player.getMesh())

  /// experimental ring array
  // var ringArray = []

  // for (let i = 0; i < 8; i++) {
  //   var ring = new THREE.Mesh(geometry, material)
  //   ring.position.x = Math.floor(Math.random() * 10 - 250)
  //   ring.position.y = Math.floor(Math.random() * 1000 - 3000)
  //   ring.position.z = Math.floor(Math.random() * 100 - 200)
  //   ringArray.push(ring)
  // }
  // ringArray.forEach(r => scene.add(r))

  //Add Controls
  //add pointerlock to camera
  // const control = new THREE.PointerLockControls(camera)
  // scene.add(control.getObject())

  // window.addEventListener(
  //   'click',
  //   function() {
  //     control.lock()
  //   },
  //   false
  // )
  var controls = new THREE.FlyControls(
    camera,
    player.getMesh(),
    renderer.domElement
  )

  // control.getObject().position.set(0, 30, 70) // <-- this is relative to the player's position
  camera.position.set(0, 30, 70) // <-- this is relative to the player's position
  player.getMesh().add(camera)
  // player.getMesh().add(cube)
  // player.getMesh().add(control.getObject())

  // Add Rings for Racing

  // var geometry = new THREE.TorusGeometry(20, 2, 20, 70)
  // var material = new THREE.MeshBasicMaterial({
  //   color: 0x7dd2d8,
  //   side: THREE.DoubleSide
  // })

  // var ring = new THREE.Mesh(geometry, material)
  // ring.position.z = -200
  // scene.add(ring)
  /////////////////////
  // ADD INITIAL RING
  var geometry = new THREE.TorusGeometry(20, 2, 20, 100)
  var material = new THREE.MeshBasicMaterial({
    color: 0x7dd2d8,
    side: THREE.DoubleSide
  })
  var ring = new THREE.Mesh(geometry, material)
  ring.position.set(0, 0, -500)
  scene.add(ring)

  // ring sound
  function ringSound() {
    var listener = new THREE.AudioListener()
    camera.add(listener)
    var audioLoader = new THREE.AudioLoader()
    var sound1 = new THREE.PositionalAudio(listener)
    audioLoader.load('./sounds/sweep.wav', function(buffer) {
      sound1.setBuffer(buffer)
      sound1.setRefDistance(20)
      sound1.play()
    })
    ring.add(sound1)
  }

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

    this.BBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())

    var rockMtl = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader(loadingManager).load(
        'textures/lunarrock.png'
      )
    })

    loader.load('models/rock' + rockType + '.obj', function(obj) {
      obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = rockMtl
        }
      })

      obj.scale.set(40, 40, 40)

      mesh.add(obj)
      // mesh.position.set(
      //   -300 + Math.random() * 600,
      //   -300 + Math.random() * 600,
      //   -2000 - Math.random() * 2000
      // )
      mesh.position.set(
        Math.random() * (ring.position.x + 300 - (ring.position.x - 300)) +
          (ring.position.x - 300),
        Math.random() * (ring.position.y + 300 - (ring.position.y - 300)) +
          (ring.position.y - 300),
        Math.random() * (ring.position.z + 300 - (ring.position.z - 300)) +
          (ring.position.z - 300)
      )
      self.loaded = true
      self.BBox.setFromObject(obj)
    })

    this.reset = function(z) {
      mesh.velocity = Math.random() * 4 + 4
      mesh.position.set(
        Math.random() * (ring.position.x + 150 - (ring.position.x - 150)) +
          (ring.position.x - 150),
        Math.random() * (ring.position.y + 150 - (ring.position.y - 150)) +
          (ring.position.y - 150),
        Math.random() * (z + 150 - (z - 150)) + (z - 150)
      )

      console.log('RESET')
    }

    this.update = function(z) {
      mesh.position.z += mesh.velocity
      mesh.rotation.x += mesh.vRotation.x * 0.02
      mesh.rotation.y += mesh.vRotation.y * 0.02
      mesh.rotation.z += mesh.vRotation.z * 0.02

      if (mesh.children.length > 0) this.BBox.setFromObject(mesh.children[0])

      // if (mesh.position.z > z) {
      //   this.reset(z)
      // }

      // if (moveRing() === true){
      //   this.reset()
      // }

      // mesh.position.set(
      //   Math.random() * ((ring.position.x + 400)-(ring.position.x - 400)) + (ring.position.x - 400),
      //   Math.random() * ((ring.position.y + 400)-(ring.position.y - 400)) + (ring.position.y - 400),
      //   Math.random() * ((ring.position.z + 400)-(ring.position.z - 400)) + (ring.position.z - 400),
      // )
    }

    this.getMesh = function() {
      return mesh
    }

    return this
  }

  let NUM_ASTEROIDS = 4
  let asteroids = []
  for (var i = 0; i < NUM_ASTEROIDS; i++) {
    asteroids.push(new Asteroid(Math.floor(Math.random() * 5) + 1))
    scene.add(asteroids[i].getMesh())
  }

  function moveRing() {
    if (detectRingCollision() === true) {
      ring.position.x =
        Math.random() *
          (player.getMesh().position.x +
            500 -
            (player.getMesh().position.x - 500)) +
        (player.getMesh().position.x - 500)
      ring.position.y =
        Math.random() *
          (player.getMesh().position.y +
            500 -
            (player.getMesh().position.y - 500)) +
        (player.getMesh().position.y - 500)
      ring.position.z -= Math.random() * (1000 - 250) + 250
      asteroids.forEach(e => {
        console.log('did this reset?')
        e.reset(ring.position.z)
      })
    }
  }

  var counter = 0

  function detectRingCollision() {
    var cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    cubeBBox.setFromObject(cube)
    var ringBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    ringBBox.setFromObject(ring)
    if (cubeBBox.intersectsBox(ringBBox)) {
      store.dispatch(addPoints(100))
      // counter += 1
      // console.log(counter)
      ringSound()
      return true
    }
  }

  //Add Planet
  var Planet = function() {
    var planetObj = new THREE.Object3D()
    planetObj.name = 'EARTH'
    // Speed of motion and rotation

    this.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
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

    this.hitbox.setFromObject(meshPlanet)
    this.getMesh = function() {
      return planetObj
    }

    return this
  }
  var earth = new Planet()
  scene.add(earth.getMesh())

  // function detectPlanetCollision(){
  //   if (player.hitbox.intersectsBox(earth.hitbox)){
  //     console.log('DEATH')
  //   }
  // }

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

  /*********************************
   * Render To Screen
   ********************************/
  var clock = new THREE.Clock()
  const shots = []
  function render() {
    // player.update()

    skybox.getMesh.position = camera.position

    var delta = clock.getDelta()
    controls.update(delta)

    for (var i = 0; i < NUM_ASTEROIDS; i++) {
      asteroids[i].update(ring.position.z)
    }

    var rotationSpeed = 0.01
    earth.getMesh().rotation.y += rotationSpeed * delta
    meshClouds.rotation.y += rotationSpeed * delta

    moveRing()
    // detectPlanetCollision()

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
      shots[index].translateOnAxis(shotVector, -75)
    }
    if (player.canShoot > 0) player.canShoot -= 1

    renderer.render(scene, camera)
  }

  function animate() {
    if (isPaused) return

    // loading screen stuff
    if (RESOURCES_LOADED === false) {
      requestAnimationFrame(animate)

      loadingScreen.box.position.x -= 0.05
      if (loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10
      loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x)

      renderer.render(loadingScreen.scene, loadingScreen.camera)
      return
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

          // var cameraPos = control.getObject().position
          var playerPos = player.getMesh().position
          // console.log('camera', cameraPos)
          // console.log('player', playerPos)
          // console.log('player const', player)
          // // console.log('player mesh vertex array', player.getMesh().children[1].children[0].geometry.attributes.position.array)

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

          // console.log(scene)

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
      authorized: false,
      loaded: false
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
        <HUD />
        <div id="pause-screen">
          <div id="progress-container">
            {/* <h1>Loading...</h1> */}
            {/* <div id='progress'/> */}
            <img src="./loading.gif" />
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(World)
