import loadingManager from './loadingManager'

export default scene => {
  //Load Skybox
  var Skybox = function() {
    var skyboxObject = new THREE.Object3D()

    var imagePrefix = 'images/spc3'
    var directions = ['ypos', 'yneg', 'zpos', 'zneg', 'xpos', 'xneg']
    var imageSuffix = '.jpg'

    var loader = new THREE.TextureLoader(loadingManager)

    let materialArray = []

    for (var i = 0; i < 6; i++) {
      loader.load('images/spc3.jpg', function(texture) {
        materialArray.push(
          new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
          })
        )
      })
    }

    var skyGeometry = new THREE.CubeGeometry(20000, 20000, 20000)

    var skyboxMesh = new THREE.Mesh(skyGeometry, materialArray)
    skyboxObject.add(skyboxMesh)

    this.getMesh = function() {
      return skyboxObject
    }
  }
  var skybox = new Skybox()
  scene.add(skybox.getMesh())

}
