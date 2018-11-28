
THREE.FlyControls = function(camera, object, domElement) {
  this.object = object

  this.domElement = domElement !== undefined ? domElement : document
  if (domElement) this.domElement.setAttribute('tabindex', -1)

  const control = new THREE.PointerLockControls(camera)
  this.unlock = () => control.unlock()
  this.lock = () => control.lock()
  window.addEventListener(
    'click',
    function() {
      control.lock()
    },
    false
  )

  // API

  this.pressed = {}

  this.speed = 1
  this.accelDamper = 0.33
  this.maxSpeed = 15
  this.rollSpeed = 0.01
  this.pitchDamper = 1.2
  this.yawDamper = 1.2
  this.mouseDamper = 0.02
  this.rollDamper = 0.52
  // this.keypress = false

  this.dragToLook = true
  this.autoForward = false

  // disable default target object behavior

  // internals

  this.tmpQuaternion = new THREE.Quaternion()

  this.mouseStatus = 0

  this.moveState = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    forward: 3,
    back: 0,
    pitchUp: 0,
    pitchDown: 0,
    yawLeft: 0,
    yawRight: 0,
    rollLeft: 0,
    rollRight: 0
  }
  this.moveVector = new THREE.Vector3(0, 0, 0)
  this.rotationVector = new THREE.Vector3(0, 0, 0)

  this.keydown = function(event) {
    this.pressed[event.keyCode] = true
    // this.keypress = true
    if (event.altKey) {
      return
    }

    switch (event.keyCode) {
      case 16 /* shift */:
        this.movementSpeedMultiplier = 0.1
        event.preventDefault()
        break

      case 87 /*W*/:
        // this.moveState.forward += this.speed * this.accelDamper
        event.preventDefault()
        break

      case 83 /*S*/:
        // this.moveState.back += this.speed
        // this.moveState.forward *= 0.5
        event.preventDefault()
        break

      // case 65: /*A*/
      // 	this.moveState.left = 1;
      // 	event.preventDefault();
      // 	break;
      // case 68: /*D*/
      // 	this.moveState.right = 1;
      // 	event.preventDefault();
      // 	break;

      // case 82: /*R*/
      // this.moveState.up = 1;
      // event.preventDefault();
      // break;
      // case 70: /*F*/
      // this.moveState.down = 1;
      // event.preventDefault();
      // break;

      case 38 /*up*/:
        this.moveState.pitchUp = this.speed
        event.preventDefault()
        break
      case 40 /*down*/:
        this.moveState.pitchDown = this.speed
        event.preventDefault()
        break

      case 37 /*left*/:
        this.moveState.yawLeft = this.speed
        event.preventDefault()
        break
      case 39 /*right*/:
        this.moveState.yawRight = this.speed
        event.preventDefault()
        break

      case 65 /*A*/:
        this.moveState.rollLeft = 2
        event.preventDefault()
        break
      case 68 /*D*/:
        this.moveState.rollRight = 2
        event.preventDefault()
        break
      default:
    }
    this.updateMovementVector()
    this.updateRotationVector()
  }

  this.keyup = function(event) {
    this.pressed[event.keyCode] = false
    // this.keypress = false
    switch (event.keyCode) {
      case 16:
        /* shift */ this.movementSpeedMultiplier = 1
        break

      case 87:
        /*W*/

        // if (this.moveState.forward > 9)
        //   this.moveState.forward *= 0.66

        break
      case 83:
        /*S*/ this.moveState.back = 0
        break

      // case 65: /*A*/ this.moveState.left = 0; break;
      // case 68: /*D*/ this.moveState.right = 0; break;

      case 82:
        /*R*/ this.moveState.up = 0
        break
      case 70:
        /*F*/ this.moveState.down = 0
        break

      case 38:
        /*up*/ this.moveState.pitchUp = 0
        break
      case 40:
        /*down*/ this.moveState.pitchDown = 0
        break

      case 37:
        /*left*/ this.moveState.yawLeft = 0
        break
      case 39:
        /*right*/ this.moveState.yawRight = 0
        break

      case 65:
        /*A*/ this.moveState.rollLeft = 0
        break
      case 68:
        /*D*/ this.moveState.rollRight = 0
        break
      default:
    }
    this.updateMovementVector()
    this.updateRotationVector()
  }

  this.mousemove = function(event) {
    var container = this.getContainerDimensions()


    if (control.isLocked === true) {
      if (event.movementX < 0) {
        this.moveState.yawLeft = -event.movementX * (this.yawDamper * this.mouseDamper)
        this.moveState.yawRight = 0
      }
      if (event.movementX > 0) {
        this.moveState.yawRight = event.movementX * (this.yawDamper * this.mouseDamper)
        this.moveState.yawLeft = 0
      }
      if (event.movementY > 0) {
        this.moveState.pitchUp = -event.movementY * (this.pitchDamper * this.mouseDamper)
        this.moveState.pitchDown = 0
      }
      if (event.movementY < 0) {
        this.moveState.pitchDown = event.movementY * (this.pitchDamper * this.mouseDamper)
        this.moveState.pitchUp = 0
      }

      this.updateRotationVector()
    }
  }


  this.update = function(delta) {

    // pressing forward
    if (this.pressed[87]) {
      this.moveState.forward *= 1 + (.03 * (this.moveState.forward/15) )
      if (this.moveState.forward < 3)
        this.moveState.forward = 3
    }

    // no input going fast
    if (!this.pressed[83] && !this.pressed[87] && this.moveState.forward > 3) {
      this.moveState.forward *= 1 - (.009 * (this.moveState.forward/15) )
      if (this.moveState.forward < 3)
        this.moveState.forward = 3
    }

    // no input, going slow
    if (!this.pressed[83] && !this.pressed[87] && this.moveState.forward < 3) {
      this.moveState.forward *= 1 + (.08 * (this.moveState.forward/15) )
    }

    // pressing backwards
    if (this.pressed[83] && this.moveState.forward > 1) {
      this.moveState.forward *= 1 - (.15 * ((this.moveState.forward)/15) )
    }

    this.updateMovementVector()

    var moveMult = this.speed


    var rotMult = this.rollSpeed

    this.object.translateX(this.moveVector.x * moveMult)
    this.object.translateY(this.moveVector.y * moveMult)
    this.object.translateZ(this.moveVector.z * moveMult)

    this.tmpQuaternion
      .set(
        this.rotationVector.x * rotMult,
        this.rotationVector.y * rotMult,
        this.rotationVector.z * rotMult,
        1
      )
      .normalize()

    this.object.quaternion.multiply(this.tmpQuaternion)

    // expose the rotation vector for convenience
    this.object.rotation.setFromQuaternion(
      this.object.quaternion,
      this.object.rotation.order
    )
  }

  this.updateMovementVector = function() {

    if (this.moveState.forward > this.maxSpeed) {
      this.moveState.forward = this.maxSpeed
    }
    if (this.moveState.back > this.maxSpeed) {
      this.moveState.back = this.maxSpeed
    }

    if (this.moveState.back === this.moveState.forward) {
      this.moveState.back = 0
      this.moveState.forward = 0
    }

    this.moveVector.x = -this.moveState.left + this.moveState.right
    this.moveVector.y = -this.moveState.down + this.moveState.up
    this.moveVector.z = -this.moveState.forward + this.moveState.back
  }

  this.updateRotationVector = function() {
    this.rotationVector.x =
      (-this.moveState.pitchDown + this.moveState.pitchUp) * this.pitchDamper
    this.rotationVector.y =
      (-this.moveState.yawRight + this.moveState.yawLeft) * this.yawDamper
    this.rotationVector.z =
      (-this.moveState.rollRight + this.moveState.rollLeft) * this.rollDamper
  }

  this.getContainerDimensions = function() {
    if (this.domElement != document) {
      return {
        size: [this.domElement.offsetWidth, this.domElement.offsetHeight],
        offset: [this.domElement.offsetLeft, this.domElement.offsetTop]
      }
    } else {
      return {
        size: [window.innerWidth, window.innerHeight],
        offset: [0, 0]
      }
    }
  }

  function bind(scope, fn) {
    return function() {
      fn.apply(scope, arguments)
    }
  }

  function contextmenu(event) {
    event.preventDefault()
  }

  this.dispose = function() {
    this.domElement.removeEventListener('contextmenu', contextmenu, false)

    window.removeEventListener('keydown', _keydown, false)
    window.removeEventListener('keyup', _keyup, false)
  }

  var _mousemove = bind(this, this.mousemove)
  var _keydown = bind(this, this.keydown)
  var _keyup = bind(this, this.keyup)

  this.domElement.addEventListener('contextmenu', contextmenu, false)

  window.addEventListener('keydown', _keydown, false)
  window.addEventListener('keyup', _keyup, false)
  window.addEventListener('mousemove', _mousemove, false)

  this.updateMovementVector()
  this.updateRotationVector()
}
