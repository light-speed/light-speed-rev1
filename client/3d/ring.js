import loadingManager from './loadingManager'
import {player} from './player'
import store, {addPoints, addTime} from '../store'
import {earth} from './planet'
import {configureRenderer} from './configure'
import makeAsteroid, {asteroids} from './asteroids'
import {HUDalert} from './HUDalert.js'

export let ring

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
      this.ringPlanetCollision() === true ||
      this.ringSkyboxCollision() === true
    ) {
      this.mesh.position.x =
        Math.random() *
          (player.getMesh().position.x +
            2250 -
            (player.getMesh().position.x - 2250)) +
        (player.getMesh().position.x - 2250)

      this.mesh.position.y =
        Math.random() *
          (player.getMesh().position.y +
            2250 -
            (player.getMesh().position.y - 2250)) +
        (player.getMesh().position.y - 2250)

      this.mesh.position.z =
        Math.random() *
          (player.getMesh().position.z +
            2250 -
            (player.getMesh().position.z - 2250)) +
        (player.getMesh().position.z - 2250)

      this.mesh.lookAt(prevX, prevY, prevZ)

      asteroids.forEach(e => {
        // e.reset(this.mesh, player)
        e.getNewX(this.mesh)
        e.getNewY(this.mesh)
        e.getNewZ(this.mesh)
        e.getNewT()
        // e.getOldX(prevX)
        // e.getOldY(prevY)
        // e.getOldZ(prevZ)
        e.getOldX(player.getMesh().position.x)
        e.getOldY(player.getMesh().position.y)
        e.getOldZ(player.getMesh().position.z)
      })

      if (asteroids.length < 15) {
        makeAsteroid()
      }
    }
  }

  this.ringPlanetCollision = function() {
    //ring vs earth collision
    // var earthBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    // // earthBBox.setFromObject(earth.getMeshPlanet())
    // earthBBox.setFromObject(earth.getHitbox())

    var ringBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    ringBBox.setFromObject(this.mesh)

    if (earth.sphereBBox.intersectsBox(ringBBox)) {
      return true
    }
  }

  this.ringSkyboxCollision = function() {
    if (
      Math.abs(this.getMesh().position.x) > 9000 ||
      Math.abs(this.getMesh().position.y) > 9000 ||
      Math.abs(this.getMesh().position.z) > 9000
    ) {
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
      store.dispatch(addTime(3000))
      return true
    }
  }
  return this
}

export default scene => {
  ring = new Ring(scene)
  scene.add(ring.getMesh())
}
