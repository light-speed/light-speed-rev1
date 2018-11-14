import React, {Component} from 'react'
import {withRouter} from 'react-router'
// import * as THREE from 'three'
// import {db} from '../firebase'
import {
//   BlockControl,
//   PreviewControl,
  CameraControl,
  MotionControl,
//   AvatarControl,
//   UndoStack,
//   HorizonControl
} from '../3d/controls'
import {configureRenderer} from '../3d/configure'
// import {showInstructions} from '../utilities'

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

  /*
      EVERYTHING OUTSIDE OF THIS CODE BLOCK IS FROM SPACECRAFT
      =======>>>>>
  */

  console.log(new THREE.TextureLoader().load('../public/textures/space.jpg'))
 
  const tunnel = new THREE.Mesh(
    new THREE.CylinderGeometry(100, 100, 50000, 24, 24, true),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('textures/space.jpg', function(tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(5, 50);
        tex.needsUpdate = true;
      }),
      side: THREE.BackSide,
    })
  );
  
  scene.add(tunnel);
  scene.fog = new THREE.FogExp2(0x0000022, 0.0015);
    
  var onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };
  var onError = function() {};
  
  new THREE.MTLLoader()
    // .setPath('../public/models/')
    .load('models/spaceship.mtl', function(materials) {
      materials.preload();
      new THREE.OBJLoader()
        .setMaterials(materials)
        // .setPath('../public/models/')
        .load(
          'models/spaceship.obj',
          function(mesh) {
            mesh.scale.set(2, 2, 2);
            mesh.rotation.set(0, Math.PI, 0);
            // mesh.position.set(0, -5, 0);
            const player = mesh;
            player.position.set(0, -10, -20)
            console.log('player', player)
            camera.add(player);
          },
          onProgress,
          onError
        );
    });

  /*
      ^^^^^^^^^^^^
      EVERYTHING OUTSIDE OF THIS CODE BLOCK IS FROM SPACECRAFT
  */

  // scene.undoStack = new UndoStack(world.id)

  const cameraControl = new CameraControl(camera, renderer.domElement)
  scene.add(cameraControl.getObject())

  const motionControl = new MotionControl(cameraControl.getObject())

  // const horizonControl = new HorizonControl(scene)

  // const previewControl = new PreviewControl(scene)

  // const previewBox = previewControl.previewBox

  const essentials = {
    _domElement: renderer.domElement,
    _objects: objects,
    _camera: camera,
    _scene: scene
  }

  // const blockControl = new BlockControl(
  //   essentials,
  //   currentUser ? currentUser : {displayName: guestAvatar},
  //   world.id,
  //   cameraControl.getObject(),
  //   previewBox,
  //   cubesToBeMoved
  // )

  // let avatarUser = currentUser ? currentUser : guestAvatar
  // const avatarControl = new AvatarControl(
  //   world.id,
  //   cameraControl.getObject(),
  //   scene,
  //   avatarUser
  // )

  // const water = new GameFlowGraph(world.water, world.cubes, scene)
  // water.connectToWorld(world.id)

  const light = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(light)
  const pointLight = new THREE.PointLight(0xffffff, 0.8)
  pointLight.position.set(0, 15, 0)
  scene.add(pointLight)

  /*********************************
   * Render To Screen
   ********************************/

  function render() {
    motionControl.updatePlayerPosition()
    renderer.render(scene, camera)
  }
  function animate() {
    if (isPaused) return
    requestAnimationFrame(animate)
    render()
  }
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
    cameraControl.dispose()
    motionControl.dispose()
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
    return <div id='world'>

    </div>
  }
}

export default withRouter(World)
