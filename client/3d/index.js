import {configureRenderer} from './configure'
import {showInstructions} from '../utilities'
import getDomElements from './domElements'
import loadingManager, {RESOURCES_LOADED} from './loadingManager'
import loadSkybox from './skybox'
import loadPlayer, {player, controls} from './player'
import loadRing, {ring} from './ring'
import loadAsteroids, {asteroids, NUM_ASTEROIDS} from './asteroids'
import loadPlanet, {earth} from './planet'
import store, {endGame} from '../store';
import loadPointer, {pointer} from './pointer'

let isPaused = false
let onEsc

export default function generateWorld() {
  getDomElements()
  const {renderer, camera, scene, disposeOfResize} = configureRenderer()
  loadPlayer(scene, camera, renderer)
  loadSkybox(scene)
  loadRing(scene)
  loadAsteroids(scene)
  loadPlanet(scene)
  loadPointer(scene, player)

  function playerPlanetCollision() {
    //player vs earth collision
    var playerPos = player.getMesh().position.clone()
    var earthBSphere = new THREE.Sphere(
      earth.getMesh().position,
      earth.getPlanetRadius()
    )
    if (earthBSphere.containsPoint(playerPos)) {
      if (store.getState().game.ongoing) 
        store.dispatch(endGame())
      return true
    }
  }

  function shotAsteroidCollision(shot) {
    asteroids.forEach(a => {
      var asteroidBBox = new THREE.Box3(
        new THREE.Vector3(),
        new THREE.Vector3()
      )
      asteroidBBox.setFromObject(a.getMesh())
      if (shot.BBox.intersectsBox(asteroidBBox)) {
        console.log('HIT')
        return true
      }
    })
  }

  //Add clouds to earth
  var materialClouds = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader(loadingManager).load(
      'textures/planets/earth_clouds_1024.png'
    ),
    transparent: true
  })
  var meshClouds = new THREE.Mesh(
    new THREE.SphereBufferGeometry(4000, 100, 50),
    materialClouds
  )
  meshClouds.scale.set(1.005, 1.005, 1.005)
  meshClouds.position.set(5000, -1000, -8000)
  meshClouds.rotation.z = 0.41
  earth.getMesh().add(meshClouds)
  scene.add(meshClouds)

  // var pointerGeometry = new THREE.BoxGeometry(2, 2, 15)
  // var pointerMaterial = new THREE.MeshPhongMaterial({color: 0x00cccc})
  // var pointerMesh = new THREE.Mesh(pointerGeometry, pointerMaterial)

  // pointerMesh.position.set(-110, 1, 0)

  // scene.add(pointerMesh)
  // player.getMesh().add(pointerMesh)

/*********************************
 * Render To Screen
 ********************************/
console.log(window)
player.getMesh().add(camera)
var clock = new THREE.Clock()
const shots = []
function render() {
  pointer.getMesh().position.set(-((window.innerWidth/13.3)), 1, 0)
  // player.update()
  // skybox.getMesh.position = camera.position

  var delta = clock.getDelta()
  controls.update(delta)

  for (var i = 0; i < NUM_ASTEROIDS; i++) {
    asteroids[i].update(ring.getMesh().position.z)
  }

  var rotationSpeed = 0.01
  earth.getMesh().rotation.y += rotationSpeed * delta
  meshClouds.rotation.y += rotationSpeed * delta

  pointer.getMesh().lookAt(ring.getMesh().position)
  ring.move()
  playerPlanetCollision()

  ///shooting function
  for (var index = 0; index < shots.length; index += 1) {
    if (shots[index] === undefined) continue
    if (shots[index].alive === false) {
      shots.splice(index, 1)
      continue
    }
    var shotVector = new THREE.Vector3()
    player.getMesh().getWorldDirection(shotVector)
    shots[index].translateOnAxis(shotVector, -100)
    shots[index].update()
    shotAsteroidCollision(shots[index])
  }
  if (player.canShoot > 0) player.canShoot -= 1

  renderer.render(scene, camera)
}
// scene.add(pointer)
// player.getMesh().add(pointer)


function animate() {
  if (isPaused) return
  requestAnimationFrame(animate)
  if (RESOURCES_LOADED) render()
}

window.addEventListener('keydown', function(e) {
  if (player.canShoot <= 0) {
    switch (e.keyCode) {
      case 32: // Space
        e.preventDefault()

        var playerPos = player.getMesh().position

        const shotMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: 0.5
        })

        const shot = new THREE.Mesh(
          new THREE.SphereGeometry(3, 16, 16),
          shotMaterial
        )

        // position the bullet to come from the player's weapon
        // shot.position.set(0, 5, 30)
        shot.position.set(playerPos.x, playerPos.y, playerPos.z)

        // set the velocity of the bullet
        shot.velocity = new THREE.Vector3(
          -Math.sin(camera.rotation.y),
          0,
          Math.cos(camera.rotation.y)
        )

        shot.BBox = new THREE.Box3(
          new THREE.Vector3(),
          new THREE.Vector3()
        )
        shot.BBox.setFromObject(shot)

        shot.update = function() {
          this.BBox.setFromObject(this)
        }

        // after 1000ms, set alive to false and remove from scene
        // setting alive to false flags our update code to remove
        // the bullet from the bullets array
        shot.alive = true
        setTimeout(function() {
          shot.alive = false
          scene.remove(shot)
        }, 1000)

        // console.log(scene)

        // add to scene, array, and set the delay to 10 frames
        shots.push(shot)
        scene.add(shot)
        player.canShoot = 10
        break
      default:
    }
  }
})
document.getElementById('world').appendChild(renderer.domElement)
animate()

onEsc = event => {
  if (event.which === 27) {
    isPaused = !isPaused
    showInstructions(isPaused)
    animate()
  }
}

window.addEventListener('keydown', onEsc, false)

return function() {
  disposeOfResize()
}

}