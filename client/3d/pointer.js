import loadingManager from './loadingManager'

export let pointer
const Pointer = function(scene, player) {
  this.mesh = new THREE.Object3D()
  const self = this

  new THREE.MTLLoader(loadingManager)
    // .setPath('../public/models/')
    .load('models/arrow.mtl', function(materials) {
      materials.preload()
      new THREE.OBJLoader(loadingManager)
        .setMaterials(materials)
        // .setPath('../public/models/')
        .load('models/arrow.obj', function(obj) {
          obj.scale.set(5, 5, 5)
          self.mesh.add(obj)
        })
    })

  this.getMesh = function() {
    return this.mesh
  }
}

export default (scene, player) => {
  pointer = new Pointer(scene)
  scene.add(pointer.getMesh())
  player.getMesh().add(pointer.getMesh())
}
