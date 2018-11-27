import loadingManager from './loadingManager'
import {ring} from './ring'

export let NUM_ASTEROIDS = 0
export let asteroids = []

export default scene => {
  //Load Asteroids
  for (var i = 0; i < NUM_ASTEROIDS; i++) {
    asteroids.push(new Asteroid(Math.floor(Math.random() * 5) + 1))
    // asteroids[i].name = `asteroid${i}`
    // asteroids[i].index = i
    scene.add(asteroids[i].getMesh())
  }
}

var loader = new THREE.OBJLoader(loadingManager)

export var Asteroid = function(rockType) {
  var mesh = new THREE.Object3D(),
    self = this
  this.loaded = false

  // Speed of motion and rotation
  mesh.velocity = Math.random() * 2 + 1
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

    obj.scale.set(20, 20, 20)

    mesh.add(obj)

    mesh.position.set(100, 100, -10000)
    self.loaded = true
    self.BBox.setFromObject(obj)
  })

  // this.reset = function(ring) {
  //   mesh.velocity = Math.random() * 2 + 1
  //   mesh.position.set(
  //     Math.random() * (ring.position.x + 250 - (ring.position.x - 250)) +
  //       (ring.position.x - 250),
  //     Math.random() * (ring.position.y + 250 - (ring.position.y - 250)) +
  //       (ring.position.y - 250),
  //     Math.random() * (ring.position.z + 100 - (ring.position.z - 100)) + (ring.position.z - 100)
  //   )
  // }

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
    let oldX = Math.random() * (prevX + 50 - (prevX - 50)) + (prevX - 50)
    self.oldAsteroidPos.x = oldX
  }

  this.getOldY = prevY => {
    let oldY = Math.random() * (prevY + 50 - (prevY - 50)) + (prevY - 50)
    self.oldAsteroidPos.y = oldY
  }

  this.getOldZ = prevZ => {
    let oldZ = Math.random() * (prevZ + 50 - (prevZ - 50)) + (prevZ - 50)
    self.oldAsteroidPos.z = oldZ
  }

  this.getNewX = ring => {
    let newX =
      Math.random() * (ring.position.x + 300 - (ring.position.x - 300)) +
      (ring.position.x - 300)
    self.newAsteroidPos.x = newX
  }
  this.getNewY = ring => {
    let newY =
      Math.random() * (ring.position.y + 300 - (ring.position.y - 300)) +
      (ring.position.y - 300)
    self.newAsteroidPos.y = newY
  }
  this.getNewZ = ring => {
    let newZ =
      Math.random() * (ring.position.z + 300 - (ring.position.z - 300)) +
      (ring.position.z - 300)
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
      return t
    }
    // function ease(t) {
    //   return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    // }

    var t = self.newAsteroidPos.t
    var dt = 0.01 // t (dt delta for demo)
    var a = self.newAsteroidPos // start position
    var b = self.oldAsteroidPos // end position
    var newX = lerp(a.x, b.x, ease(t)) // interpolate between a and b where
    var newY = lerp(a.y, b.y, ease(t)) // t is first passed through a easing
    var newZ = lerp(a.z, b.z, ease(t)) // function in this example.
    mesh.position.set(newX, newY, newZ) // set new position
    self.newAsteroidPos.t += dt
    if (t <= 0 || t >=1) dt = -dt;        // ping-pong for demo


    // example easing function (quadInOut, see link above)
    // console.log('t', t)
  }

  this.update = function(z) {
    // mesh.position.z += mesh.velocity
    mesh.rotation.x += mesh.vRotation.x * 0.02
    mesh.rotation.y += mesh.vRotation.y * 0.02
    mesh.rotation.z += mesh.vRotation.z * 0.02

    if (mesh.children.length > 0) this.BBox.setFromObject(mesh.children[0])
  }



  this.getMesh = function() {
    return mesh
  }

  // this.destroy = function() {
  //   scene.remove(this.name)
  //   asteroids.splice(this.index, 1)
  // }



  return this
}

