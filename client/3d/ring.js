import loadingManager from './loadingManager'
import {player} from './player'
import store, {addPoints} from '../store'
import {earth} from './planet'
import {configureRenderer} from './configure'

export let ring, NUM_ASTEROIDS

const {camera} = configureRenderer()
const Ring = function(scene) {
  var geometry = new THREE.TorusGeometry(60, 2, 20, 100)
  var material = new THREE.MeshBasicMaterial({
    color: 0x7dd2d8,
    side: THREE.DoubleSide
  })
  this.mesh = new THREE.Mesh(geometry, material)
  // this.mesh.position.set(0, 0, -500)
  this.counter = 0

  this.getMesh = function() {
    return this.mesh
  }

  // ring sound
  this.ringSound = function() {
    var listener = new THREE.AudioListener()
    camera.add(listener)
    var audioLoader = new THREE.AudioLoader(loadingManager)
    var sound1 = new THREE.PositionalAudio(listener)
    audioLoader.load('./sounds/sweep2.wav', function(buffer) {
      sound1.setBuffer(buffer)
      sound1.setRefDistance(20)
      sound1.play()
    })
    this.mesh.add(sound1)
  }

  this.move = function() {
    let prevX = this.mesh.position.x
    let prevY = this.mesh.position.y
    let prevZ = this.mesh.position.z

    if (
      this.detectRingCollision() === true ||
      this.ringPlanetCollision() === true
    ) {


      this.mesh.position.x =
        Math.random() *
          (player.getMesh().position.x +
            1500 -
            (player.getMesh().position.x - 1500)) +
        (player.getMesh().position.x - 1500)

      this.mesh.position.y =
        Math.random() *
          (player.getMesh().position.y +
            1500 -
            (player.getMesh().position.y - 1500)) +
        (player.getMesh().position.y - 1500)

      this.mesh.position.z =
        Math.random() *
          (player.getMesh().position.z +
            1500 -
            (player.getMesh().position.z - 1500)) +
        (player.getMesh().position.z - 1500)

      this.mesh.lookAt(prevX, prevY, prevZ)
    }
  }

  this.ringPlanetCollision = function() {
    //ring vs earth collision
    var earthBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    // earthBBox.setFromObject(earth.getMeshPlanet())
    earthBBox.setFromObject(earth.getHitbox())

    var ringBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    ringBBox.setFromObject(this.mesh)

    if (earth.sphereBBox.intersectsBox(ringBBox)) {
      console.log('ring-planet collision', this.counter)
      console.log('earthBBox', earthBBox, 'ringBBox', ringBBox, 'ring pos', ring.getMesh().position, 'sphereBBox', earth.sphereBBox)
      return true
    }
  }

  this.detectRingCollision = function() {
    var cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    cubeBBox.setFromObject(player.getHitbox())
    var ringBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    ringBBox.setFromObject(this.mesh)

    if (cubeBBox.intersectsBox(ringBBox)) {
      store.dispatch(addPoints(100))
      this.ringSound()
      this.counter++
      console.log('ring collision', this.counter)
      return true
    }
  }
  return this
}

export default scene => {
  ring = new Ring(scene)
  scene.add(ring.getMesh())
}
