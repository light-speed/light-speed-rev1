import {HUD, LOADING_SCREEN} from './domElements'
import store, {startGame} from '../store'

const loadingManager = new THREE.LoadingManager()

export let RESOURCES_LOADED = false

let resources = 0
loadingManager.onProgress = () => resources++

loadingManager.onLoad = function () {
  RESOURCES_LOADED = true
  LOADING_SCREEN.style.display = 'none'
  HUD.style.display = 'flex'

  // tell client/server to start the game
  if (!store.getState().game.ongoing)
    store.dispatch(startGame())
}

export default loadingManager