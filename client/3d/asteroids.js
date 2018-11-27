import loadingManager from './loadingManager'
import {ring} from './ring'
import {player} from './player'
import store, {addPoints, addTime} from '../store'

export let NUM_ASTEROIDS = 0
export let asteroids = []

let counter = 0

export default scene => {
  //Load Asteroids
  for (var i = 0; i < NUM_ASTEROIDS; i++) {
    asteroids.push(new Asteroid(Math.floor(Math.random() * 5) + 1), scene)
    // asteroids[i].name = `asteroid${i}`
    // asteroids[i].index = i
    scene.add(asteroids[i].getMesh())
  }
}

var loader = new THREE.OBJLoader(loadingManager)

var rockMtl = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader(loadingManager).load('textures/lunarrock.png')
})

export var Asteroid = function(rockType, scene) {
  this.mesh = new THREE.Object3D()
  let self = this
  this.loaded = false
  this.index = asteroids.length
  this.mesh.name = counter++
  this.asteroidMesh = null

  // Speed of motion and rotation
  this.mesh.velocity = Math.random() * 2 + 1
  this.mesh.vRotation = new THREE.Vector3(
    Math.random(),
    Math.random(),
    Math.random()
  )

  this.BBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
  loader.load('models/rock' + rockType + '.obj', function(obj) {
    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = rockMtl
      }
    })

    obj.scale.set(30, 30, 30)
    self.asteroidMesh = obj
    self.mesh.add(obj)

    self.mesh.position.set(100, 100, -10000)
    self.loaded = true
    self.BBox.setFromObject(obj)
  })

  const getHit = () => {
    store.dispatch(addPoints(-100))
    store.dispatch(addTime(-5000))
  }

  const once = func => {
    let counter = 0
    return function(x) {
      if (counter < 1) {
        func()
        counter++
      }
    }
  }

  let hitDetection = once(getHit)
  this.detectPlayerCollision = function() {
    var cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    cubeBBox.setFromObject(player.getHitbox())
    // var asteroidBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    // asteroidBBox.setFromObject(this.this.mesh)

    if (cubeBBox.intersectsBox(self.BBox)) {
      hitDetection()
      setTimeout(() => {
        hitDetection = once(getHit)
      }, 1000)
    }
  }

  self.newAsteroidPos = {
    x: 10000,
    y: 10000,
    z: -10000,
    t: 0
  }

  self.oldAsteroidPos = {
    x: 10000,
    y: 10000,
    z: -10000
  }

  this.getOldX = prevX => {
    let oldX = Math.random() * (prevX + 100 - (prevX - 100)) + (prevX - 100)
    self.oldAsteroidPos.x = oldX
  }

  this.getOldY = prevY => {
    let oldY = Math.random() * (prevY + 100 - (prevY - 100)) + (prevY - 100)
    self.oldAsteroidPos.y = oldY
  }

  this.getOldZ = prevZ => {
    let oldZ = Math.random() * (prevZ + 100 - (prevZ - 100)) + (prevZ - 100)
    self.oldAsteroidPos.z = oldZ
  }

  this.getNewX = ring => {
    let newX =
      Math.random() * (ring.position.x + 350 - (ring.position.x - 350)) +
      (ring.position.x - 350)
    self.newAsteroidPos.x = newX
  }
  this.getNewY = ring => {
    let newY =
      Math.random() * (ring.position.y + 350 - (ring.position.y - 350)) +
      (ring.position.y - 350)
    self.newAsteroidPos.y = newY
  }
  this.getNewZ = ring => {
    let newZ =
      Math.random() * (ring.position.z + 350 - (ring.position.z - 350)) +
      (ring.position.z - 350)
    self.newAsteroidPos.z = newZ
  }

  this.getNewT = () => {
    self.newAsteroidPos.t = 0
  }

  this.reset = function(player) {
    function lerp(a, b, t) {
      return a + (b - a) * t
    }

    function ease(t) {
      return t * t
    }
    // function ease(t) {
    //   return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    // }

    var t = self.newAsteroidPos.t
    var dt = 0.003 // t (dt delta for demo)
    var a = self.newAsteroidPos // start position
    var b = self.oldAsteroidPos // end position
    var newX = lerp(a.x, b.x, ease(t)) // interpolate between a and b where
    var newY = lerp(a.y, b.y, ease(t)) // t is first passed through a easing
    var newZ = lerp(a.z, b.z, ease(t)) // function in this example.
    this.mesh.position.set(newX, newY, newZ) // set new position
    self.newAsteroidPos.t += dt
    if (t <= 0 || t >= 1) dt = -dt // ping-pong for demo
  }

  this.update = function(z) {
    // this.mesh.position.z += this.mesh.velocity
    this.mesh.rotation.x += this.mesh.vRotation.x * 0.02
    this.mesh.rotation.y += this.mesh.vRotation.y * 0.02
    this.mesh.rotation.z += this.mesh.vRotation.z * 0.02

    if (this.mesh.children.length > 0)
      this.BBox.setFromObject(this.mesh.children[0])
  }

  this.getMesh = function() {
    return this.mesh
  }

  this.getAsteroidMesh = function() {
    return this.asteroidMesh
  }

  this.destroy = function() {
    asteroids = [
      ...asteroids.slice(0, this.index),
      ...asteroids.slice(this.index+1).map(a => ({...a, index: a.index - 1}))
    ]

    scene.remove(this.getMesh())
    scene.remove(this.getAsteroidMesh())
    this.asteroidMesh = undefined
    this.mesh = undefined
  }

  return this
}
