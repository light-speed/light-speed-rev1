// import * as THREE from 'three'

export function configureRenderer() {
  //renders the scene, camera, and cubes using webGL
  const renderer = new THREE.WebGLRenderer({antialias: true})
  const color = new THREE.Color(0x0d2135)
  //sets the world background color
  // renderer.setClearColor(color)
  //sets the resolution of the view
  renderer.setSize(window.innerWidth, window.innerHeight)

  // camera.controls = attachCameraControls(camera, renderer.domElement)

  const scene = new THREE.Scene()

  //create a perspective camera (field-of-view, aspect ratio, min distance, max distance)
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    60000
  )

  window.addEventListener('resize', handleResize)
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  function disposeOfResize() {
    window.removeEventListener('resize', handleResize)
  }
  return {
    renderer,
    camera,
    scene,
    disposeOfResize
  }
}
