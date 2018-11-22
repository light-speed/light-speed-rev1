import {HUD, LOADING_SCREEN} from './domElements'

const loadingManager = new THREE.LoadingManager()

export let RESOURCES_LOADED = false

let resources = 0
loadingManager.onProgress = () => resources++

loadingManager.onLoad = function () {
  console.log(`loaded ${resources} resources`)
  RESOURCES_LOADED = true
  LOADING_SCREEN.style.display = 'none'
  HUD.style.display = 'flex'
}

export default loadingManager