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
    // let link
    let link = 'images/spc3.jpg'
    for (var i = 0; i < 6; i++) {
      // link = imagePrefix + directions[i] + imageSuffix
      loader.load(link, function(texture) {
        materialArray.push(
          new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
          })
        )
      })
    }

    // var cubeMaterials = [
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/customspace-front.png'),
    //     side: THREE.DoubleSide
    //   }), //front side
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/customspace-back.png'),
    //     side: THREE.DoubleSide
    //   }), //back side
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/customspace-top.png'),
    //     side: THREE.DoubleSide
    //   }), //up side
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/customspace-bottom.png'),
    //     side: THREE.DoubleSide
    //   }), //down side
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/customspace-right.png'),
    //     side: THREE.DoubleSide
    //   }), //right side
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/customspace-left.png'),
    //     side: THREE.DoubleSide
    //   }) //left side
    // ]
    var skyGeometry = new THREE.CubeGeometry(50000, 50000, 50000)
    // var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );

    var skyboxMesh = new THREE.Mesh(skyGeometry, materialArray)
    // skyBox.rotation.x = Math.PI / 2
    skyboxObject.add(skyboxMesh)
    // console.log('scene', scene)

    this.getMesh = function() {
      return skyboxObject
    }
  }
  var skybox = new Skybox()
  scene.add(skybox.getMesh())

  // scene.registerBeforeRender(function() {skybox.getMesh().position = camera.position})
}
