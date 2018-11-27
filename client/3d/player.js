import loadingManager from './loadingManager'

// Player Collision Wrapper Cube

var cubeGeometry = new THREE.BoxGeometry(3, 3, 3)
var cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x003500,
  opacity: 0,
  side: THREE.DoubleSide,
  transparent: true
})
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

cube.position.set(0, 0, 0)
cube.name = 'cube'

var Player = function(scene) {
  let spaceship = null
  this.mesh = new THREE.Object3D()
  this.loaded = false
  const self = this

  this.hitbox = cube
  scene.add(this.hitbox)
  this.canShoot = 0

  this.mesh.add(this.hitbox)

  var onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100
      // console.log(Math.round(percentComplete, 2) + '% downloaded')
    }
  }
  var onError = function() {}

  var keyLight = new THREE.DirectionalLight(
    new THREE.Color('hsl(30, 100%, 75%)'),
    1.0
  )
  keyLight.position.set(-100, 0, 100)

  var light = new THREE.AmbientLight(0x404040) // soft white light
  scene.add(light)

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

  new THREE.MTLLoader(loadingManager).load('models/DevShipT.mtl', function(
    materials
  ) {
    materials.preload()
    new THREE.OBJLoader(loadingManager)
      .setMaterials(materials)

      .load(
        'models/DevShipT.obj',
        function(mesh) {
          mesh.scale.set(3, 3, 3)
          mesh.rotation.set(0, Math.PI, 0)

          spaceship = mesh

          self.player = spaceship
          self.mesh.add(self.player)
          self.loaded = true
        },
        onProgress,
        onError
      )
  })

  this.getHitbox = function() {
    return this.hitbox
  }

  this.getMesh = function() {
    return this.mesh
  }
  return this
}

export let player, controls

export default (scene, camera, renderer) => {
  player = new Player(scene)
  player.getMesh().add(camera)
  camera.position.set(0, 45, 90) // <-- this is relative to the player's position
  scene.add(player.getMesh())

  controls = new THREE.FlyControls(
    camera,
    player.getMesh(),
    renderer.domElement
  )
}
