import React, {Component} from 'react'
import {withRouter} from 'react-router'
// import * as THREE from 'three'
// import {db} from '../firebase'
import {CameraControl, MotionControl} from '../3d/controls'
import {configureRenderer} from '../3d/configure'
import {showInstructions} from '../utilities/utilities'

/*********************************
 * Construct the Three World
 ********************************/

let isPaused = false
let onEsc

function generateWorld(/*world, currentUser, guestAvatar*/) {
  // Setup

  var container, scene, camera, renderer
  var controls
  var sphere, player

  container = document.getElementById('container')
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )
  renderer = new THREE.WebGLRenderer({alpha: true})
  renderer.setSize(window.innerWidth, window.innerHeight)
  // Add Objects To the Scene HERE
  // Sphere
  var sphere_geometry = new THREE.SphereGeometry(1)
  var sphere_material = new THREE.MeshNormalMaterial()
  sphere = new THREE.Mesh(sphere_geometry, sphere_material)
  sphere.position.z = -10
  scene.add(sphere)
  // Cube
  var cube_geometry = new THREE.BoxGeometry(1, 1, 1)
  var cube_material = new THREE.MeshBasicMaterial({
    color: 0x7777ff,
    wireframe: false
  })
  player = new THREE.Mesh(cube_geometry, cube_material)
  player.position.x = 0
  scene.add(player)
  controls = new THREE.PlayerControls(camera, player)
  controls.init()
  // Events
  controls.addEventListener('change', render, false)
  window.addEventListener('resize', onWindowResize, false)


  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()
  }

  function render() {
    // Render Scene
    renderer.clear()
    renderer.render(scene, camera)
  }



  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  document.getElementById('world').appendChild(renderer.domElement)
  animate()
  animate();

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
}

/*********************************
 * Render Component
 ********************************/

class World2 extends Component {
  constructor() {
    super()
    this.state = {
      authorized: false
    }
  }
  async componentDidMount() {
    generateWorld()
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

export default withRouter(World2)
