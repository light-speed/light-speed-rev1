
export const CameraControl = function(_camera, _domElement) {
  let pitchObject = new THREE.Object3D()
  pitchObject.add(_camera)

  let yawObject = new THREE.Object3D()
  yawObject.add(pitchObject)

  function onError(error) {
    console.log(error)
  }


  function activate() {
    _domElement.addEventListener('mousemove', onMouseMove, false)
  }

  function deactivate() {
    _domElement.removeEventListener('mousemove', onMouseMove, false)
  }



  function onMouseMove(event) {
    event.preventDefault()

    const movementX = event.movementX
    const movementY = event.movementY

    // yawObject.rotation.y -= movementX * 0.004
    // pitchObject.rotation.x -= movementY * 0.004

    // pitchObject.rotation.x = Math.max(
    //   -Math.PI / 2,
    //   Math.min(Math.PI / 2, pitchObject.rotation.x)
    // )

    yawObject.rotation.y -= 0
    pitchObject.rotation.x -= 0


  }

  function dispose() {
    deactivate()
  }

  // PL.requestPointerLock(document.body, activate(), deactivate(), onError())


  activate()

  // API
  this.getObject = function() {
    return yawObject
  }

  this.getRotationXY = function() {
    return {
      x: yawObject.rotation.y,
      y: pitchObject.rotation.x
    }
  }
  this.enabled = true

  this.activate = activate
  this.deactivate = deactivate
  this.dispose = dispose
}
