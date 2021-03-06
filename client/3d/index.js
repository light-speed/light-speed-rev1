import {configureRenderer} from './configure'
import {showInstructions} from '../utilities'
import getDomElements from './domElements'
import loadingManager, {RESOURCES_LOADED} from './loadingManager'
import loadSkybox from './skybox'
import loadPlayer, {player, controls, mixer1, mixer2} from './player'
import loadRing, {ring} from './ring'
import loadAsteroids, {asteroids} from './asteroids'
import loadPlanet, {earth} from './planet'
import store, {addPoints, endGame, addTime, toggleOngoing} from '../store'
import loadPointer, {pointer} from './pointer'
import {formatScore} from '../components/HUD'
import Proton from 'three.proton.js'
import addStars from './particles.js'
import socket from '../socket'


let isPaused = false,
  onEsc, isGameOver, isGameOngoing

export default function generateWorld() {
  getDomElements()
  const {renderer, camera, scene, disposeOfResize} = configureRenderer()
  loadPlayer(scene, camera, renderer)
  loadSkybox(scene)
  loadRing(scene)
  loadAsteroids(scene)
  loadPlanet(scene)
  loadPointer(scene, player)
  addStars(scene)

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
      Math.abs(player.getMesh().position.x) > 10000 ||
      Math.abs(player.getMesh().position.y) > 10000 ||
      Math.abs(player.getMesh().position.z) > 10000
    ) {
      if (store.getState().game.ongoing) store.dispatch(endGame())
      return true
    }
  }

  function shotAsteroidCollision(shot) {
    asteroids.forEach(a => {
      if (a.asteroidMesh) {
        var asteroidBBox = new THREE.Box3(
          new THREE.Vector3(),
          new THREE.Vector3()
        )
        asteroidBBox.setFromObject(a.getMesh())
        if (shot.BBox.intersectsBox(asteroidBBox)) {
          store.dispatch(addPoints(25))
          store.dispatch(addTime(500))
          a.destroy(scene)
          return true
        }
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


  var prevTime = Date.now();
  var prevTime2 = Date.now();


  /*********************************
   * Render To Screen
   ********************************/
  //Positioning/Adding
  ring.getMesh().position.set(-100, 0, -500)
  player.getMesh().add(camera)
  player.getMesh().lookAt(100, 0, 500)
  ring.getMesh().lookAt(player.getMesh().position)

  // let emitter1Pos = new THREE.Vector3()
  // let emitter2Pos = new THREE.Vector3()

  let emitter1Pos = new THREE.Object3D()
  let emitter2Pos = new THREE.Object3D()

  player.getMesh().add(emitter1Pos)
  player.getMesh().add(emitter1Pos)

  emitter1Pos.position.set(-3, 0, -2)
  emitter2Pos.position.set(3, 0, -2)

  var emitter1, emitter2, R, proton

  function addProton() {
    proton = new Proton()

    R = 10
    emitter1 = createEmitter(R, 0, '#4F1500', '#0029FF')
    emitter2 = createEmitter(-R, 0, '#004CFE', '#6600FF')

    proton.addEmitter(emitter1)
    proton.addEmitter(emitter2)
    proton.addRender(new Proton.SpriteRender(scene))

  }

  // player.getMesh().add(proton)
  // proton.position.set(0,0,-5)

  var tha = 0
  function animateEmitter1() {
    tha += 0.25
    emitter1.p.x = R * Math.cos(tha)
    emitter1.p.y = R * Math.sin(tha)
  }
  function animateEmitter2() {
    tha += 0.25
    emitter2.p.x = R * Math.cos(tha + Math.PI / 2)
    emitter2.p.y = R * Math.sin(tha + Math.PI / 2)
  }

  function createEmitter(x, y, color1, color2) {
    var emitter = new Proton.Emitter()
    emitter.rate = new Proton.Rate(
      new Proton.Span(5, 7),
      new Proton.Span(0.01, 0.02)
      // new Proton.Span(0.00000, 0.00175)
    )
    emitter.addInitialize(new Proton.Mass(1))
    emitter.addInitialize(new Proton.Life(2))
    emitter.addInitialize(new Proton.Body(createSprite()))
    emitter.addInitialize(new Proton.Radius(16.8))
    // emitter.addInitialize(new Proton.Radius(10))
    // emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0))

    emitter.addBehaviour(new Proton.Alpha(0.8, 0))
    emitter.addBehaviour(new Proton.Color(color1, color2))
    emitter.addBehaviour(new Proton.Scale(.97, 0.48))
    emitter.addBehaviour(
      new Proton.CrossZone(new Proton.ScreenZone(camera, renderer), 'dead')
    )
    emitter.addBehaviour(new Proton.RandomDrift(10, 10, 10, .05));

    // emitter.addBehaviour(new Proton.Force(0, 0, -20))
    // emitter.addBehaviour(new Proton.Attraction({
    //     x: 0,
    //     y: 0,
    //     z: 0
    // }, 5, 250));

    emitter.p.x = -100000
    emitter.p.y = y

    emitter.emit()

    return emitter
  }

  function createSprite() {
    var map = new THREE.TextureLoader().load('/images/dot.png')
    var material = new THREE.SpriteMaterial({
      map: map,
      color: 0xff0000,
      blending: THREE.AdditiveBlending,
      fog: true
    })

    return new THREE.Sprite(material)
  }

  addProton()

  var clock = new THREE.Clock()
  const shots = []

  function gameOverScreen() {
    const gameOver = document.getElementById('game-over')
    if (isGameOver === true) {
      gameOver.style.visibility = 'visible'
      gameOver.style.display = 'block'
      gameOver.style.zIndex = '99'
      document.getElementById('scoreId').innerHTML = formatScore(
        store.getState().game.score
      )
    } else {
      gameOver.style.zIndex = ''
      gameOver.style.visibility = 'hidden'
    }
  }

  const once = func => {
    let ran = 0
    return function(x) {
      if (ran < 1) {
        func()
        ran++
      }
    }
  }

  const turnTheShipIntoAHorse = () => {
    player.changeModel('horse')
    // console.log('turn me into a horse please')
  }

  const shipToHorse = once(turnTheShipIntoAHorse)

  const turnTheShipIntoAFlamingo = () => {
    player.changeModel('flamingo')
    // console.log('turn me into a horse please')
  }

  const shipToFlamingo = once(turnTheShipIntoAFlamingo)

  function render() {
    if (proton && controls.pressed[83] !== true && controls.moveState.forward > 4 ) {
      proton.update()
      animateEmitter1()

      emitter1.p.x = player.getMesh().position.x
      emitter1.p.y = player.getMesh().position.y
      emitter1.p.z = player.getMesh().position.z
    }
    if (
      controls.moveState.forward === 15 &&
      proton &&
      controls.pressed[83] !== true &&
      controls.pressed[87] === true
    ) {
      proton.update()
      animateEmitter2()

      emitter2.p.x = player.getMesh().position.x
      emitter2.p.y = player.getMesh().position.y
      emitter2.p.z = player.getMesh().position.z
    }


    // console.log(typeof store.getState().game.score)
    if (store.getState().game.score >= 4000) {
      shipToHorse()
    }
    if (store.getState().game.score >= 2000) {
      shipToFlamingo()
    }


    if ( mixer1 ) {
      var time = Date.now();
      mixer1.update( ( time - prevTime ) * 0.001 );
      prevTime = time;
    }

    if ( mixer2 ) {
      var time2 = Date.now();
      mixer2.update( ( time - prevTime2 ) * 0.001 );
      prevTime2 = time2;
    }

    if (proton && controls.pressed[83] === true) {
      proton.update()

      emitter1.p.x = -100000
      emitter2.p.x = -100000
    }

    isGameOver = store.getState().game.gameOver
    isGameOngoing = store.getState().game.ongoing

    asteroids.forEach(e => {
      if (e.asteroidMesh) {
        e.reset(player)
      }
    })

    gameOverScreen()

    pointer.getMesh().position.set(0, 125, 0)

    var delta = clock.getDelta()
    if (isGameOver !== true) {
      controls.update(delta)
    } else if (isGameOver === true) {
      return
    }

    for (var i = 0; i < asteroids.length; i++) {
      if (asteroids[i].asteroidMesh) {
        asteroids[i].update(ring.getMesh().position.z)
        asteroids[i].detectPlayerCollision()
      }
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

  window.addEventListener('keydown', function(e) {
    if (player.canShoot <= 0) {
      switch (e.keyCode) {
        case 32: // Space
          // console.log('pmesh',player.getMesh())
          e.preventDefault()
          var playerPos = player.getMesh().position

          const shotMaterial = new THREE.MeshPhongMaterial({
            color: 0xC0C0C0
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

          shot.BBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
          shot.BBox.setFromObject(shot)

          shot.update = function() {
            this.BBox.setFromObject(this)
          }

          console.log(store.getState())

          // after 1000ms, set alive to false and remove from scene
          // setting alive to false flags our update code to remove
          // the bullet from the bullets array
          shot.alive = true
          setTimeout(function() {
            shot.alive = false
            scene.remove(shot)
          }, 1000)

          // add to scene, array, and set the delay to 10 frames
          shots.push(shot)
          scene.add(shot)
          player.canShoot = 20
          break
        default:
      }
    }
  })
  document.getElementById('world').appendChild(renderer.domElement)
  animate()

  onEsc = event => {
    if (event.which === 27 && isGameOver !== true) {
      // isPaused ? controls.lock() : controls.unlock()
      isPaused ? socket.emit('unpause-game') : socket.emit('pause-game')
      store.dispatch(toggleOngoing())
      isPaused = !isPaused
      showInstructions(isPaused)
      animate()
    }
    if (player.canShoot > 0) player.canShoot -= 1

    renderer.render(scene, camera)
  }

  window.addEventListener('keydown', onEsc, false)

  return function() {
    disposeOfResize()
  }
}
