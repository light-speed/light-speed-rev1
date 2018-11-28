
export let HUD1, HUD2, HUD3, LOADING_SCREEN

export default () => {
  HUD1= document.getElementById('hudContainer')
  HUD2= document.getElementById('hudContainerAdd')
  HUD3= document.getElementById('hudContainerSub')

  LOADING_SCREEN = document.getElementById('progress-container')
}
