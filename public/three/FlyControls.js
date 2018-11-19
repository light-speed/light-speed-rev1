/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */


THREE.FlyControls = function(object, domElement) {
  this.object = object

  this.domElement = domElement !== undefined ? domElement : document
  if (domElement) this.domElement.setAttribute('tabindex', -1)

  // API

<<<<<<< HEAD
  	this.speed = 1
    this.acceleration = 0
    this.maxSpeed = 40
    this.rollSpeed = 0.01
    this.pitchDamper = 0.9
    this.yawDamper = 0.7
    this.rollDamper = 0.6
=======
	this.speed = 1
	this.acceleration = 0
	this.maxSpeed = 8
	this.rollSpeed = 0.01
	this.pitchDamper = 1
	this.yawDamper = 1
	this.rollDamper = 1

>>>>>>> f/space-box

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
    forward: 0,
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
    if (event.altKey) {
      return
    }

    switch (event.keyCode) {
      case 16 /* shift */:
        this.movementSpeedMultiplier = 0.1
        event.preventDefault()
        break

      case 87 /*W*/:
        this.moveState.forward += this.speed
        event.preventDefault()
        break

      case 83 /*S*/:
				this.moveState.back += this.speed
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
        this.moveState.rollLeft = this.speed
        event.preventDefault()
        break
      case 68 /*D*/:
        this.moveState.rollRight = this.speed
        event.preventDefault()
        break
      default:
    }
		// console.log(this.moveState)
    this.updateMovementVector()
    this.updateRotationVector()
  }

  this.keyup = function(event) {
    switch (event.keyCode) {
      case 16:
        /* shift */ this.movementSpeedMultiplier = 1
        break

      case 87:
        /*W*/ this.moveState.forward += 0
        break
      case 83:
        /*S*/ this.moveState.back += 0
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
		// console.log(this.moveState)
    this.updateMovementVector()
    this.updateRotationVector()
  }






  window.addEventListener("mousemove", onmousemove, false);
    
  var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // it's up to you how you will create THREE.Plane(), there are several methods
  var raycaster = new THREE.Raycaster(); //for reuse
  var mouse = new THREE.Vector2(); //for reuse
  var intersectPoint = new THREE.Vector3(); //for reuse
  

  
  this.mousemove = function(event) {
	//   get mouse coordinates
	//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	var container = this.getContainerDimensions();
	var halfWidth = container.size[ 0 ] / 2;
	var halfHeight = container.size[ 1 ] / 2;
	
	  
	// this.moveState.yawLeft = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth ) / halfWidth;
	// this.moveState.pitchDown = ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

	// console.log('ms', this.moveState.yawLeft, this.moveState.pitchDown)
	// console.log('event', event.pageX, event.pageY)
	// console.log('container', container.offset)
	// console.log('e.movement', event.movementX, event.movementY)


	  // raycaster.setFromCamera(mouse, camera);//set raycaster
	  // raycaster.ray.intersectPlane(plane, intersectPoint); // find the point of intersection
	//   obj.position.set(0, 0, -20)
	//   camera.add(obj).lookAt(intersectPoint); // face our arrow to this point
	if(event.movementX < 0) {
		// console.log('-x',x)
		this.moveState.yawLeft += -event.movementX * 0.004
		// this.moveState.yawLeft = mouse.x * this.yawDamper
		this.moveState.yawRight = 0
	}
	if(event.movementX > 0) {
		// console.log('+x',x)
		this.moveState.yawRight += event.movementX * 0.004
		// this.moveState.yawRight = mouse.x * this.yawDamper
		this.moveState.yawLeft = 0
	}
	if(event.movementY > 0) {
		// console.log('+y',y)
		this.moveState.pitchUp += -event.movementY * 0.004
		// this.moveState.pitchUp = mouse.y * 0.004
		this.moveState.pitchDown = 0
	}
	if(event.movementY < 0) {
		// console.log('-y',y)
		this.moveState.pitchDown += event.movementY * 0.004
		// this.moveState.pitchDown = mouse.y * this.pitchDamper
		this.moveState.pitchUp = 0
	}

	

	this.updateRotationVector();




	}










  // this.mousedown = function(event) {
  //   if (this.domElement !== document) {
  //     // console.log('mousedown')
  //     this.domElement.focus()
  //   }

  //   event.preventDefault()
  //   event.stopPropagation()

  //   if (this.dragToLook) {
  //     this.mouseStatus++
  //   } else {
  //     switch (event.button) {
  //       case 0:
  //         this.moveState.forward = 1
  //         break
  //       case 2:
  //         this.moveState.back = 1
  //         break
  //     }

  //     this.updateMovementVector()
  //   }
  // }

  // this.mousemove = function(event) {
  //   if (!this.dragToLook || this.mouseStatus > 0) {
  //     var container = this.getContainerDimensions()
  //     var halfWidth = container.size[0] / 2
  //     var halfHeight = container.size[1] / 2

  //     this.moveState.yawLeft =
  //       -(event.pageX - container.offset[0] - halfWidth) / halfWidth
  //     this.moveState.pitchDown =
  //       (event.pageY - container.offset[1] - halfHeight) / halfHeight

  //     this.updateRotationVector()
  //   }
  // }

  // this.mouseup = function(event) {
  //   event.preventDefault()
  //   event.stopPropagation()

  //   if (this.dragToLook) {
  //     this.mouseStatus--

  //     this.moveState.yawLeft = this.moveState.pitchDown = 0
  //   } else {
  //     switch (event.button) {
  //       case 0:
  //         this.moveState.forward = 0
  //         break
  //       case 2:
  //         this.moveState.back = 0
  //         break
  //     }
  //     this.updateMovementVector()
  //   }
  //   this.updateRotationVector()
  // }

  this.update = function(delta) {
    var moveMult = this.speed
    var rotMult = this.rollSpeed
    // this.object.position.x += 1000;
    // this.object.translateX(1000);

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
    // var forward =
    //   this.moveState.forward || (this.autoForward && !this.moveState.back)
    //     ? 1
		//     : 0

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
    // console.log('move state', this.moveState)
    // console.log( 'move vectors:', this.moveVector );
  }

  this.updateRotationVector = function() {
    // console.log(object)
    this.rotationVector.x = (-this.moveState.pitchDown + this.moveState.pitchUp) * this.pitchDamper
    this.rotationVector.y = (-this.moveState.yawRight + this.moveState.yawLeft) * this.yawDamper
    this.rotationVector.z = (-this.moveState.rollRight + this.moveState.rollLeft) * this.rollDamper

    //console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );
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
    // this.domElement.removeEventListener('mousedown', _mousedown, false)
    // this.domElement.removeEventListener('mousemove', _mousemove, false)
    // this.domElement.removeEventListener('mouseup', _mouseup, false)

    window.removeEventListener('keydown', _keydown, false)
    window.removeEventListener('keyup', _keyup, false)
  }

  var _mousemove = bind(this, this.mousemove)
  // var _mousedown = bind(this, this.mousedown)
  // var _mouseup = bind(this, this.mouseup)
  var _keydown = bind(this, this.keydown)
  var _keyup = bind(this, this.keyup)

  this.domElement.addEventListener('contextmenu', contextmenu, false)

  this.domElement.addEventListener('mousemove', _mousemove, false)
  // this.domElement.addEventListener('mousedown', _mousedown, false)
  // this.domElement.addEventListener('mouseup', _mouseup, false)

  window.addEventListener('keydown', _keydown, false)
  window.addEventListener('keyup', _keyup, false)
  window.addEventListener('mousemove', _mousemove, false)

  this.updateMovementVector()
  this.updateRotationVector()
}
