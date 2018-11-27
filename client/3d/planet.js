import loadingManager from './loadingManager'

export let earth


var cubeGeometry = new THREE.BoxGeometry(8000, 8000, 8000)
var cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x003500,
  opacity: 0,
  side: THREE.DoubleSide,
  transparent: true
})
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

cube.position.set(5000, -1000, -8000)
cube.name = 'cube'

export default (scene) => {
  //Add Planet
  var Planet = function() {
    var planetObj = new THREE.Object3D()
    planetObj.name = 'EARTH'

    this.hitbox = cube
    scene.add(this.hitbox)
    planetObj.add(this.hitbox)





    // Speed of motion and rotation
    var radius = 1500
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

    planetObj.position.set(2000, -1000, -2000)

    this.sphereBBox = new THREE.Sphere(
      planetObj.position,
      4000)

    this.getMesh = function() {
      return planetObj
    }

    this.getMeshPlanet = function() {
      return meshPlanet
    }

    this.getPlanetRadius = function() {
      return radius
    }

    this.getHitbox = function() {
      return this.hitbox
    }

    return this
  }
  earth = new Planet()
  scene.add(earth.getMesh())
}
