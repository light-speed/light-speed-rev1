import loadingManager from './loadingManager'
// Player Collision Wrapper Cube
var cubeGeometry = new THREE.BoxGeometry(10, 10, 10)
var cubeMaterial = new THREE.MeshBasicMaterial({
  // color: 0xff9900,
  color: 0x003500,
  opacity: 0,
  side: THREE.DoubleSide,
  transparent: true
})
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

// cube.position.set(0, 0, 0)
cube.name = 'cube'

export var mesh, mixer1, mixer2

var Player = function(scene) {
  this.activeMesh = 'ship'
  let spaceship = null
  this.mesh = new THREE.Object3D()
  this.loaded = false
  const self = this

  const getChild = function(name) {
    return self.getMesh().children.filter(child => child.name === name)[0]
  }

  this.changeModel = function(name) {
    getChild(this.activeMesh).visible = false
    this.activeMesh = name
    getChild(name).visible = true
  }

  this.hitbox = cube
  scene.add(this.hitbox)
  this.canShoot = 0

  this.mesh.add(this.hitbox)

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


  this.player2 = null

new THREE.GLTFLoader(loadingManager)
				.load( "models/Horse.glb", function( gltf ) {
          mesh = gltf.scene.children[ 0 ];
          mesh.visible = false
          mesh.scale.set( .25, .25, .25 );
          mesh.rotation.set(0, Math.PI, 0)

          scene.add( mesh );
          spaceship = mesh

          mesh.name = 'horse'
          self.player = spaceship
          self.mesh.add(self.player)
          self.loaded = true
          mixer1 = new THREE.AnimationMixer( self.player );
					mixer1.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
        } );

new THREE.GLTFLoader(loadingManager)
				.load( "models/Flamingo.glb", function( gltf ) {
          mesh = gltf.scene.children[ 0 ];
          mesh.visible = false
          mesh.scale.set( .4, .4, .4 );
          mesh.rotation.set(0, Math.PI, 0)

          scene.add( mesh );
          spaceship = mesh

          mesh.name = 'flamingo'
          self.player2 = spaceship
          self.mesh.add(self.player2)
          self.loaded = true
          mixer2 = new THREE.AnimationMixer( self.player2 );
					mixer2.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
        } );


  new THREE.MTLLoader(loadingManager).load('models/DevShipT.mtl', function(
    materials
  ) {
    materials.preload()
    new THREE.OBJLoader(loadingManager)
      .setMaterials(materials)

      .load('models/DevShipT.obj', function(mesh) {
        mesh.visible = true; // ship visibility
        mesh.scale.set(7, 7, 7)
        mesh.rotation.set(0, Math.PI, 0)
        mesh.name = 'ship'
        spaceship = mesh
        self.player = spaceship
        self.mesh.add(self.player)
        self.loaded = true
      })
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
  camera.position.set(0, 60, 150) // <-- this is relative to the player's position
  scene.add(player.getMesh())

  controls = new THREE.FlyControls(
    camera,
    player.getMesh(),
    renderer.domElement
  )
}
