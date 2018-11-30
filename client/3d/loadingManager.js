import {HUD1, HUD2, HUD3, LOADING_SCREEN} from './domElements'
import store, {startGame} from '../store'

const loadingManager = new THREE.LoadingManager()

export let RESOURCES_LOADED = false

let resources = 0
loadingManager.onProgress = () => {
  // console.log("I just loaded something into the game")
  resources++
}

loadingManager.onLoad = function() {
  console.log(`there are ${resources} loaded resources`)
  RESOURCES_LOADED = true

  LOADING_SCREEN.style.display = 'none'
  if (HUD1) HUD1.style.display = 'flex'
  if (HUD2) HUD2.style.display = 'flex'
  if (HUD3) HUD3.style.display = 'flex'



  // tell client/server to start the game
  if (!store.getState().game.ongoing) store.dispatch(startGame())
}

export default loadingManager
