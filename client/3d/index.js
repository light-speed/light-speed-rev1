import {configureRenderer} from './configure'
import {showInstructions} from '../utilities'
import getDomElements from './domElements'
import loadingManager, {RESOURCES_LOADED} from './loadingManager'
import loadSkybox from './skybox'
import loadPlayer, {player, controls} from './player'
import loadRing, {ring} from './ring'
import loadAsteroids, {asteroids, NUM_ASTEROIDS} from './asteroids'
import loadPlanet, {earth} from './planet'
import store, {endGame} from '../store'
import loadPointer, {pointer} from './pointer'
// import GameOver from '../components/GameOver'

let isPaused = false

let onEsc
let isGameOver
let isGameOngoing


// this.add = function() {
//   NUM_ASTEROIDS++
//   asteroids.push(new Asteroid(Math.floor(Math.random() * 5) + 1))
//   scene.add(asteroids[NUM_ASTEROIDS-1].getMesh())
// }

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
      if (store.getState().game.ongoing) store.dispatch(endGame())

      return true
    }
  }

  function playerSkyboxCollision() {
    //player vs skybox collision
    if (
      Math.abs(player.getMesh().position.x) > 12500 ||
      Math.abs(player.getMesh().position.y) > 12500 ||
      Math.abs(player.getMesh().position.z) > 12500
    ) {
      if (store.getState().game.ongoing) store.dispatch(endGame())
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
    new THREE.SphereBufferGeometry(1500, 100, 50),
    materialClouds
  )
  meshClouds.scale.set(1.005, 1.005, 1.005)
  meshClouds.position.set(2000, -1000, -2000)
  meshClouds.rotation.z = 0.41
  earth.getMesh().add(meshClouds)
  scene.add(meshClouds)


  /*********************************
   * Render To Screen
   ********************************/
  //Positioning/Adding
  ring.getMesh().position.set(-100, 0, -500)
  player.getMesh().add(camera)
  player.getMesh().lookAt(100, 0, 500)
  ring.getMesh().lookAt(player.getMesh().position)

  var clock = new THREE.Clock()
  const shots = []

  function gameOverScreen() {
    const gameOver = document.getElementById('game-over')
      if (isGameOver === true) {
        gameOver.style.visibility = 'visible'
        gameOver.style.display = 'block'
        gameOver.style.zIndex = '99'
      } else {
        gameOver.style.zIndex = ''
        gameOver.style.visibility = 'hidden'

      }

  }

  function render() {
    isGameOver = store.getState().game.gameOver
    isGameOngoing = store.getState().game.ongoing

    // console.log('isGameOver', isGameOver)
    // console.log('isGameOngoing', isGameOngoing)


    asteroids.forEach(e => {
      e.reset(player)
    })
    console.log(asteroids)

    gameOverScreen()

    pointer.getMesh().position.set(-(window.innerWidth / 14), 1, 0)

    var delta = clock.getDelta()
    if (isGameOver !== true) {
      controls.update(delta)
    } else if (isGameOver === true) {
      return
    }

    for (var i = 0; i < NUM_ASTEROIDS; i++) {
      asteroids[i].update(ring.getMesh().position.z)
    }

    var rotationSpeed = 0.01
    earth.getMesh().rotation.y += rotationSpeed * delta
    meshClouds.rotation.y += rotationSpeed * delta

    pointer.getMesh().lookAt(ring.getMesh().position)
    ring.move()



    playerPlanetCollision()
    playerSkyboxCollision()

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


  function animate() {
    if (isPaused) return
    if (isGameOver === true) return
    requestAnimationFrame(animate)
    if (RESOURCES_LOADED) render()
  }

  // window.addEventListener('keydown', function(e) {
  //   if (player.canShoot <= 0) {
  //     switch (e.keyCode) {
  //       case 32: // Space
  //         e.preventDefault()

  //         var playerPos = player.getMesh().position

  //         const shotMaterial = new THREE.MeshBasicMaterial({
  //           color: 0xff0000,
  //           transparent: true,
  //           opacity: 0.5
  //         })

  //         const shot = new THREE.Mesh(
  //           new THREE.SphereGeometry(3, 16, 16),
  //           shotMaterial
  //         )

  //         // position the bullet to come from the player's weapon
  //         // shot.position.set(0, 5, 30)
  //         shot.position.set(playerPos.x, playerPos.y, playerPos.z)

  //         // set the velocity of the bullet
  //         shot.velocity = new THREE.Vector3(
  //           -Math.sin(camera.rotation.y),
  //           0,
  //           Math.cos(camera.rotation.y)
  //         )

  //         shot.BBox = new THREE.Box3(
  //           new THREE.Vector3(),
  //           new THREE.Vector3()
  //         )
  //         shot.BBox.setFromObject(shot)

  //         shot.update = function() {
  //           this.BBox.setFromObject(this)
  //         }

  //         // after 1000ms, set alive to false and remove from scene
  //         // setting alive to false flags our update code to remove
  //         // the bullet from the bullets array
  //         shot.alive = true
  //         setTimeout(function() {
  //           shot.alive = false
  //           scene.remove(shot)
  //         }, 1000)

  //         // console.log(scene)

  //         // add to scene, array, and set the delay to 10 frames
  //         shots.push(shot)
  //         scene.add(shot)
  //         player.canShoot = 10
  //         break
  //       default:
  //     }
  //   }
  // })
  document.getElementById('world').appendChild(renderer.domElement)
  animate()

  onEsc = event => {
    if (event.which === 27 && isGameOver !== true) {
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
