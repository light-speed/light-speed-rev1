import React, {Component} from 'react'
import {withRouter} from 'react-router'
// import * as THREE from 'three'
// import {db} from '../firebase'
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

function generateWorld(/*world, currentUser, guestAvatar*/) {
  //container for all 3d objects that will be affected by event
  let objects = []
  // const cubesToBeMoved = {}

  const {renderer, camera, scene, disposeOfResize} = configureRenderer()
  const handleCollision = function( collided_with, linearVelocity, angularVelocity ) {
    return console.log('collision pls')
  }


  // const cameraControl = new CameraControl(camera, renderer.domElement)
  // scene.add(cameraControl.getObject())

  var control = new THREE.PointerLockControls( camera )
  scene.add(control.getObject())
  

  window.addEventListener( 'click', function () {
    
    console.log(control)
    control.lock();
}, false );



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

    var imagePrefix = 'images/dawnmountain-'
    var directions = ['ypos', 'yneg', 'zpos', 'zneg', 'xpos', 'xneg']
    var imageSuffix = '.png'
    var skyGeometry = new THREE.CubeGeometry(50000, 50000, 50000)
    var loader = new THREE.TextureLoader()

    let materialArray = []
    let link = 'images/space-box-bright.png'
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

  //Load Tunnel
  renderer.setClearColor('#000022')
  renderer.setSize(window.innerWidth, window.innerHeight)

  var Tunnel = function() {
    var tunnel = new THREE.Object3D(),
      meshes = []

    meshes.push(
      new THREE.Mesh(
        // new THREE.SphereGeometry(30, 160, 160),
        new THREE.CylinderGeometry(300, 300, 7000, 24, 24, true),
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load('textures/space.jpg', function(
            tex
          ) {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping
            tex.repeat.set(5, 10)
            tex.needsUpdate = true
          }),
          side: THREE.BackSide
        })
      )
    )
    meshes[0].rotation.x = -Math.PI / 2
    // Adding the second mesh as a clone of the first mesh
    meshes.push(meshes[0].clone())
    meshes[1].position.z = -5000

    tunnel.add(meshes[0])
    tunnel.add(meshes[1])

    this.getMesh = function() {
      return tunnel
    }

    this.update = function(z) {
      for (var i = 0; i < 2; i++) {
        if (z < meshes[i].position.z - 2500) {
          meshes[i].position.z -= 10000
          break
        }
      }
    }

    return this
  }

  var stoneGeom = new THREE.BoxGeometry(10, 10, 2)
  var stone = new Physijs.BoxMesh(
    stoneGeom,
    Physijs.createMaterial(
      new THREE.MeshStandardMaterial({
        color: '#343f63',
        transparent: false,
        opacity: 0.8
      }),
      .8, .2
    ),
    1,
    {restitution: 0.2, friction: 0.8}
  )
  stone.position.set(0, 50, 0)
  stone.collisions = 0
  stone.addEventListener('collision', handleCollision)
  scene.add(stone)

  // var tunnel = new Tunnel()
  // scene.add(tunnel.getMesh())
  // scene.fog = new THREE.FogExp2(0x0000022, 0.0015)

  //Load Player Ship
  let spaceship = null

  var Player = function() {
    var playerObj = new THREE.Object3D()
    this.loaded = false
    const self = this
    this.hitbox = new THREE.Box3()

    var collisionMat = Physijs.createMaterial(
      new THREE.MeshStandardMaterial({
        color: '#42f483',
        transparent: false,
        opacity: 0.8
      }),
      .8, .2
    )
    var playerCollision = new Physijs.BoxMesh(new THREE.BoxGeometry(1,1,1), collisionMat, 1,
    {restitution: 0.2, friction: 0.8})
    playerCollision.collisions = 0
    playerCollision.addEventListener('collision', handleCollision)
    console.log('pcoll', playerCollision)
    
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

    new THREE.MTLLoader()
      // .setPath('../public/models/')
      .load('models/DevShipT.mtl', function(materials) {
        materials.preload()
        new THREE.OBJLoader()
          .setMaterials(materials)
          // .setPath('../public/models/')
          .load(
            'models/DevShipT.obj',
            function(mesh) {
              // mesh.scale.set(0.7, 0.7, 0.7)
              mesh.rotation.set(0, Math.PI, 0)
              // mesh.position.set(0, -5, 0);
              spaceship = mesh
              spaceship.position.set(0, -7.5, -20)
              self.player = spaceship
              playerObj.add(self.player)
              playerObj.add(playerCollision)
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
  scene.add(player.getMesh())

  //Add Controls
  // cameraControl.getObject().position.set(0, 5, 30) // <-- this is relative to the player's position
  // player.getMesh().add(cameraControl.getObject())
  // var controls = new THREE.FlyControls(player.getMesh(), renderer.domElement)

  control.getObject().position.set(0, 5, 30) // <-- this is relative to the player's position
  // camera.position.set(0, 5, 30) // <-- this is relative to the player's position
  player.getMesh().add(camera)

  // camera.lookAt(player.getMesh.position);

  var controls = new THREE.FlyControls(player.getMesh(), renderer.domElement)

  // var controls = new THREE.PlayerControls(player.getMesh(), camera)
  // controls.init()
  // controls.addEventListener('change', render, false );

  //Load Asteroids
  var loader = new THREE.OBJLoader()

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
      map: new THREE.TextureLoader().load('textures/lunarrock.png')
    })

    loader.load('models/rock' + rockType + '.obj', function(obj) {
      obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = rockMtl
        }
      })

      obj.scale.set(20, 20, 20)

      mesh.add(obj)
      mesh.position.set(
        -150 + Math.random() * 300,
        -150 + Math.random() * 300,
        -1500 - Math.random() * 1500
      )
      self.loaded = true
    })

    this.reset = function(z) {
      mesh.velocity = Math.random() * 2 + 2
      mesh.position.set(
        -50 + Math.random() * 100,
        -50 + Math.random() * 100,
        z - 1500 - Math.random() * 1500
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

  let NUM_ASTEROIDS = 10
  let asteroids = []
  for (var i = 0; i < NUM_ASTEROIDS; i++) {
    asteroids.push(new Asteroid(Math.floor(Math.random() * 5) + 1))
    scene.add(asteroids[i].getMesh())
  }

  //Add Shooting
  const Shot = function(initialPos) {
    const shotMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.5
    })

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 16, 16),
      shotMaterial
    )

    // var geometry = new THREE.CylinderGeometry(7.47, 9.63, 48.57, 23, 50, false)
    // var material = new THREE.MeshBasicMaterial({
    //   shading: THREE.FlatShading,
    //   color: 0xeb1d1d
    // })

    // this.mesh = new THREE.Mesh(geometry, material)

    // this.mesh.rotation.x = 10
    // this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = 0.0027;

    this.mesh.position.copy(initialPos)

    this.getMesh = function() {
      return this.mesh
    }

    var shotVector = new THREE.Vector3()
    player.getMesh().getWorldDirection(shotVector)

    this.update = function(z) {
      this.mesh.translateOnAxis(shotVector, -30)

      if (Math.abs(this.mesh.position.z - z) > 1000) {
        return false
        // delete this.mesh;
      }
      return true
    }
    return this
  }

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
      map: new THREE.TextureLoader().load(
        'textures/planets/earth_atmos_2048.jpg'
      ),
      specularMap: new THREE.TextureLoader().load(
        'textures/planets/earth_specular_2048.jpg'
      ),
      normalMap: new THREE.TextureLoader().load(
        'textures/planets/earth_normal_2048.jpg'
      ),
      normalScale: new THREE.Vector2(0.85, 0.85)
    })
    var meshPlanet = new THREE.Mesh(geometry, materialNormalMap)

    planetObj.add(meshPlanet)
    planetObj.rotation.y = 0
    planetObj.rotation.z = 0.41

    planetObj.position.set(4000, -1000, -8000)

    this.getMesh = function() {
      return planetObj
    }

    return this
  }
  var earth = new Planet()
  scene.add(earth.getMesh())

  /*********************************
   * Render To Screen
   ********************************/

  const shots = []
  function render() {
    // motionControl.updatePlayerPosition()
    player.update()
    // cameraControl.getObject().position.z -= 0
    // tunnel.update(cameraControl.getObject().position.z)
    
    var clock = new THREE.Clock()
    var delta = clock.getDelta()
    controls.update(delta)
    
    // controls.update()
    
    for (var i = 0; i < NUM_ASTEROIDS; i++) {
      asteroids[i].update(camera.position.z)
    }
    
    for (let i = 0; i < shots.length; i++) {
      if (!shots[i].update(player.getMesh().position.z)) {
        // if (!shots[i].update(camera.position.z)) {
          scene.remove(shots[i].getMesh())
          shots.splice(i, 1)
        }
        // shots[i].position.add(shots[i].velocity)
      }
    renderer.render(scene, camera)
    scene.simulate(); 
  }
    function animate() {
      if (isPaused) return
      requestAnimationFrame(animate)
      render()
    }

  window.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
      case 32: // Space
        // console.log('scene', player.getMesh().position)
        e.preventDefault()
        var playerPos = player.getMesh().position.clone()
        // playerPos.sub(new THREE.Vector3(0, 0, 0))
        var shot = new Shot(playerPos)
        shots.push(shot)
        scene.add(shot.getMesh())
        // console.log('p', player.getMesh())
        // console.log('s', shot.getMesh().position)
        // console.log('adding a shot to the shot array')
        break
      default:
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
            <h1>Paused</h1>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(World)
