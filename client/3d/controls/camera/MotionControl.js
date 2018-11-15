// import * as THREE from 'three'

export class MotionControl {
  constructor(yawObject) {
    this.yawObject = yawObject
    this.pitchObject = yawObject.children[0]

    this.movingForward = false
    this.movingBackward = false
    this.movingLeft = false
    this.movingRight = false
    this.movingUp = false
    this.movingDown = false

    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)

    this.activate()
  }
  activate() {
    window.addEventListener('keydown', this.onKeyDown, false)
    window.addEventListener('keyup', this.onKeyUp, false)
  }

  deactivate() {
    window.removeEventListener('keydown', this.onKeyDown, false)
    window.removeEventListener('keyup', this.onKeyUp, false)
  }
  dispose() {
    this.deactivate()
  }
  onKeyDown(event) {
    this.setMovement(event.which, true)
  }
  onKeyUp(event) {
    this.setMovement(event.which, false)
  }
  setMovement(which, value) {
    switch (which) {
      case 87: //W
        this.movingForward = value
        break
      case 83: // S
        this.movingBackward = value
        break
      case 65: //A
        this.movingLeft = value
        break
      case 68: //D
        this.movingRight = value
        break
      case 69: //Q
        this.movingUp = value
        break
      case 81: //E
        this.movingDown = value
        break
      default:
        break
    }
  }

  isMoving() {
    return (
      this.movingForward ||
      this.movingBackward ||
      this.movingLeft ||
      this.movingRight ||
      this.movingUp ||
      this.movingDown
    )
  }
  getVectorPlayerShouldMoveIn() {
    const motionVector = this.getInputMotion()
    motionVector.normalize()
    motionVector.applyEuler(this.pitchObject.rotation)
    return motionVector
  }
  getInputMotion() {
    const motionVector = new THREE.Vector3()
    if (this.movingForward) {
      motionVector.z -= 1
    }
    if (this.movingBackward) {
      motionVector.z += 1
    }
    if (this.movingLeft) {
      motionVector.x -= 1
    }
    if (this.movingRight) {
      motionVector.x += 1
    }
    if (this.movingUp) {
      motionVector.y += 1
    }
    if (this.movingDown) {
      motionVector.y -= 1
    }
    return motionVector
  }
  movePlayer(motionVector, speed = 10) {
    this.yawObject.translateOnAxis(motionVector, speed)
  }

  updatePlayerPosition() {
    if (this.isMoving()) {
      const motionVector = this.getVectorPlayerShouldMoveIn()
      this.movePlayer(motionVector)
    }
  }
}
