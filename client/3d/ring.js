import loadingManager from './loadingManager'
import {player} from './player'
import store, {addPoints, addTime, setTime} from '../store'
import {earth} from './planet'
import {configureRenderer} from './configure'
import {asteroids, addAsteroid, increaseAsteroidCap} from './asteroids'
import {HUDalert} from './HUDalert.js'

export let ring
export let timesMoved = 0

const {camera} = configureRenderer()
const Ring = function(scene) {
  var geometry = new THREE.TorusGeometry(80, 4, 20, 100)
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
      if (timesMoved % 5 === 0) increaseAsteroidCap()
      timesMoved++
      let moveDistance = 1500 + timesMoved * 50
      if (moveDistance > 4000) moveDistance = 4000
      // console.log('md',moveDistance)
      this.mesh.position.x =
        Math.random() *
          (player.getMesh().position.x +
            moveDistance -
            (player.getMesh().position.x - moveDistance)) +
        (player.getMesh().position.x - moveDistance)

      this.mesh.position.y =
        Math.random() *
          (player.getMesh().position.y +
            moveDistance -
            (player.getMesh().position.y - moveDistance)) +
        (player.getMesh().position.y - moveDistance)

      this.mesh.position.z =
        Math.random() *
          (player.getMesh().position.z +
            moveDistance -
            (player.getMesh().position.z - moveDistance)) +
        (player.getMesh().position.z - moveDistance)

      this.mesh.lookAt(prevX, prevY, prevZ)

      asteroids.forEach(e => {
        setTimeout(() => {
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
        }, Math.random() * 1000)
        // e.reset(this.mesh, player)
      })

      addAsteroid(scene)

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
      Math.abs(this.getMesh().position.x) > 8000 ||
      Math.abs(this.getMesh().position.y) > 8000 ||
      Math.abs(this.getMesh().position.z) > 8000
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
      // this.ringSound()
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
