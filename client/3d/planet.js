import loadingManager from './loadingManager'

export let earth

export default (scene) => {
  //Add Planet
  var Planet = function() {
    var planetObj = new THREE.Object3D()
    planetObj.name = 'EARTH'
    // Speed of motion and rotation

    var radius = 4000
    var geometry = new THREE.SphereBufferGeometry(radius, 100, 50)
    var materialNormalMap = new THREE.MeshPhongMaterial({
      specular: 0x333333,
      shininess: 15,
      map: new THREE.TextureLoader(loadingManager).load(
        'textures/planets/earth_atmos_2048.jpg'
      ),
      specularMap: new THREE.TextureLoader(loadingManager).load(
        'textures/planets/earth_specular_2048.jpg'
      ),
      normalMap: new THREE.TextureLoader(loadingManager).load(
        'textures/planets/earth_normal_2048.jpg'
      ),
      normalScale: new THREE.Vector2(0.85, 0.85)
    })
    var meshPlanet = new THREE.Mesh(geometry, materialNormalMap)

    planetObj.add(meshPlanet)
    planetObj.rotation.y = 0
    planetObj.rotation.z = 0.41

    planetObj.position.set(5000, -1000, -8000)

    this.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    this.hitbox.setFromObject(meshPlanet)

    this.getMesh = function() {
      return planetObj
    }

    this.getMeshPlanet = function() {
      return meshPlanet
    }

    this.getPlanetRadius = function() {
      return radius
    }

    return this
  }
  earth = new Planet()
  scene.add(earth.getMesh())
}