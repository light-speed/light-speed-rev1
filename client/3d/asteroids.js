import loadingManager from './loadingManager'
import {ring, timesMoved} from './ring'
import {player} from './player'
import store, {addPoints, addTime} from '../store'

export let asteroids = []
let hiddenAsteroids = []

const loader = new THREE.OBJLoader(loadingManager)
const rockMtl = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader(loadingManager).load('textures/lunarrock.png')
})

let uuid = 0

const Asteroid = function(rocktype) {
  this.mesh = new THREE.Object3D()
  let self = this
  this.loaded = false
  // this.index = asteroids.length
  this.mesh.name = uuid++
  this.asteroidMesh = null

  // Speed of motion and rotation
  this.mesh.velocity = Math.random() * 2 + 1
  this.mesh.vRotation = new THREE.Vector3(
    Math.random(),
    Math.random(),
    Math.random()
  )

  this.BBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())

  loader.load('models/rock' + rocktype + '.obj', function(obj) {

    obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = rockMtl
      }
    })

    obj.scale.set(40, 40, 40)
    self.asteroidMesh = obj
    self.mesh.add(obj)
    self.mesh.position.set(100, 100, -10000)
    self.BBox.setFromObject(obj)
  })

  const getHit = () => {
    // console.log('got hit!')
    store.dispatch(addPoints(-100))
    store.dispatch(addTime(-2000))
  }

  const once = func => {
    let uuid = 0
    return function(x) {
      if (uuid < 1) {
        func()
        uuid++
      }
    }
  }

  let hitDetection = once(getHit)
  this.detectPlayerCollision = function() {
    var cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    cubeBBox.setFromObject(player.getHitbox())

    if (cubeBBox.intersectsBox(self.BBox)) {
      hitDetection()
      setTimeout(() => {
        hitDetection = once(getHit)
      }, 3000)
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

  const originRadius = 400
  const destRadius = 400

  this.getOldX = prevX => {
    let oldX = Math.random() * (prevX + destRadius - (prevX - destRadius)) + (prevX - destRadius)
    self.oldAsteroidPos.x = oldX
  }

  this.getOldY = prevY => {
    let oldY = Math.random() * (prevY + destRadius - (prevY - destRadius)) + (prevY - destRadius)
    self.oldAsteroidPos.y = oldY
  }

  this.getOldZ = prevZ => {
    let oldZ = Math.random() * (prevZ + destRadius - (prevZ - destRadius)) + (prevZ - destRadius)
    self.oldAsteroidPos.z = oldZ
  }

  this.getNewX = ring => {
    let newX =
      Math.random() * (ring.position.x + originRadius - (ring.position.x - originRadius)) +
      (ring.position.x - originRadius)
    self.newAsteroidPos.x = newX
  }
  this.getNewY = ring => {
    let newY =
      Math.random() * (ring.position.y + originRadius - (ring.position.y - originRadius)) +
      (ring.position.y - originRadius)
    self.newAsteroidPos.y = newY
  }
  this.getNewZ = ring => {
    let newZ =
      Math.random() * (ring.position.z + originRadius - (ring.position.z - originRadius)) +
      (ring.position.z - originRadius)
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
    var dt = 0.005 + 0.0001*(timesMoved/2)// t (dt delta for demo)
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

  this.activate = function(scene) {
    this.index = asteroids.length
    asteroids.push(this)
    scene.add(this.getMesh())
    // scene.add(this.getAsteroidMesh())
  }

  this.destroy = function(scene) {
    asteroids = [
      ...asteroids.slice(0, this.index),
      ...asteroids.slice(this.index+1).map(a => ({...a, index: a.index - 1}))
    ]

    hiddenAsteroids.push(this)
    scene.remove(this.getMesh())
    scene.remove(this.getAsteroidMesh())
    // this.asteroidMesh = undefined
    // this.mesh = undefined
  }

  return this
}

export const addAsteroid = (scene) => {
  if (hiddenAsteroids.length)
    hiddenAsteroids.shift().activate(scene)
}

export const increaseAsteroidCap = () => {
  if (hiddenAsteroids.length + asteroids.length < 20)
    hiddenAsteroids.push(new Asteroid(Math.floor(Math.random() * 6) + 1))
}

export default scene => {
  hiddenAsteroids = [
    new Asteroid(1),
    new Asteroid(2),
    new Asteroid(3),
    new Asteroid(4),
    new Asteroid(5)
  ]
  // addAsteroid(scene)
}
