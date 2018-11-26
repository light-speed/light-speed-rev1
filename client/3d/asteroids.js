import loadingManager from './loadingManager'

export let NUM_ASTEROIDS, asteroids

export default (scene) => {
  //Load Asteroids
  var loader = new THREE.OBJLoader(loadingManager)

  var Asteroid = function(rockType) {
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

      obj.scale.set(30, 30, 30)

      mesh.add(obj)

      mesh.position.set(
        100, 100, 100
      )
      self.loaded = true
      self.BBox.setFromObject(obj)
    })

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

  NUM_ASTEROIDS = 5
  asteroids = []
  for (var i = 0; i < NUM_ASTEROIDS; i++) {
    asteroids.push(new Asteroid(Math.floor(Math.random() * 5) + 1))
    // asteroids[i].name = `asteroid${i}`
    // asteroids[i].index = i
    scene.add(asteroids[i].getMesh())
  }

}
