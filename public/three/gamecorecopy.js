/*
 * Game Core - Demo 1 (Simple demo)
 *
 * A simple example with basic controls (see game.core.demo1.js for a commented version of this file)
 */

window.game = window.game || {};

window.game.core = function () {
	var _game = {
		player: {
			model: null,
			controls: null,
			mesh: null,
			shape: null,
			rigidBody: null,
			orientationConstraint: null,
			mass: 3,
			isGrounded: false,
			jumpHeight: 38,
			speed: 15,
			speedMax: 45,
			rotationSpeed: 0.007,
			rotationSpeedMax: 0.04,
			rotationRadians: new THREE.Vector3(0, 0, 0),
			rotationAngleX: null,
			rotationAngleY: null,
			damping: 0.9,
			rotationDamping: 0.8,
			acceleration: 0,
			rotationAcceleration: 0,
			playerCoords: null,
			cameraCoords: null,
			cameraOffsetH: 250,
			cameraOffsetV: 80,
			playerAccelerationValues: {
				position: {
					acceleration: "acceleration",
					speed: "speed",
					speedMax: "speedMax"
				},
				rotation: {
					acceleration: "rotationAcceleration",
					speed: "rotationSpeed",
					speedMax: "rotationSpeedMax"
				}
			},
			controlKeys: {
				forward: "w",
				backward: "s",
				left: "a",
				right: "d"
			},
			create: function() {
				_cannon.playerPhysicsMaterial = new CANNON.Material("playerMaterial");

				_game.player.model = _three.createModel(window.game.models.player, 12, [
					new THREE.MeshLambertMaterial({ color: window.game.static.colors.cyan })
					,new THREE.MeshLambertMaterial({ color: window.game.static.colors.green }),
				]);

				// _game.player.model = _three.createModel(window.game.models.player2, 12);

				_game.player.shape = new CANNON.Box(_game.player.model.halfExtents);
				_game.player.rigidBody = new CANNON.RigidBody(_game.player.mass, _game.player.shape, _cannon.createPhysicsMaterial(_cannon.playerPhysicsMaterial));
				_game.player.rigidBody.position.set(0, 0, 50);
				_game.player.mesh = _cannon.addVisual(_game.player.rigidBody, null, _game.player.model.mesh);

				_game.player.orientationConstraint = new CANNON.HingeConstraint(_game.player.rigidBody, new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(0, 0, 1), _game.player.rigidBody, new CANNON.Vec3(0, 0, 1), new CANNON.Vec3(0, 0, 1));
				_cannon.world.addConstraint(_game.player.orientationConstraint);

				_game.player.rigidBody.postStep = function() {
					_game.player.rigidBody.angularVelocity.z = 0;
					_game.player.updateOrientation();
				};

				_game.player.rigidBody.addEventListener("collide", function(event) {
					if (!_game.player.isGrounded) {
						_game.player.isGrounded = (new CANNON.Ray(_game.player.mesh.position, new CANNON.Vec3(0, 0, -1)).intersectBody(event.contact.bi).length > 0);
					}
				});
			},
			update: function() {
				// _game.player.processUserInput();
				// _game.player.accelerate();
				// _game.player.rotate();

				// //disable this to unlock player from camera
				_game.player.updateCamera();

				_game.player.checkGameOver();
			},
			updateCamera: function() {
				_game.player.cameraCoords = window.game.helpers.polarToCartesian(_game.player.cameraOffsetH, _game.player.rotationRadians.z);

				//locks camera position - disable this to enable orbit control
				_three.camera.position.x = _game.player.mesh.position.x + _game.player.cameraCoords.x;
				_three.camera.position.y = _game.player.mesh.position.y + _game.player.cameraCoords.y;
				_three.camera.position.z = _game.player.mesh.position.z + _game.player.cameraOffsetV;

				_three.camera.lookAt(_game.player.mesh.position);

			},

			updateAcceleration: function(values, direction) {
				if (direction === 1) {
					if (_game.player[values.acceleration] > -_game.player[values.speedMax]) {
						if (_game.player[values.acceleration] >= _game.player[values.speedMax] / 2) {
							_game.player[values.acceleration] = -(_game.player[values.speedMax] / 4);
						} else {
							_game.player[values.acceleration] -= _game.player[values.speed];
						}
					} else {
						_game.player[values.acceleration] = -_game.player[values.speedMax];
					}
				} else {
					if (_game.player[values.acceleration] < _game.player[values.speedMax]) {
						if (_game.player[values.acceleration] <= -(_game.player[values.speedMax] / 2)) {
							_game.player[values.acceleration] = _game.player[values.speedMax] / 4;
						} else {
							_game.player[values.acceleration] += _game.player[values.speed];
						}
					} else {
						_game.player[values.acceleration] = _game.player[values.speedMax];
					}
				}
			},
			processUserInput: function() {
				if (_events.keyboard.pressed["space"]) {
					_game.player.jump();
				}

				if (_events.keyboard.pressed[_game.player.controlKeys.forward]) {
					_game.player.updateAcceleration(_game.player.playerAccelerationValues.position, 1);

					if (!_cannon.getCollisions(_game.player.rigidBody.index)) {
						_game.player.rigidBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), _game.player.rotationRadians.z);
					}
				}

				if (_events.keyboard.pressed[_game.player.controlKeys.backward]) {
					_game.player.updateAcceleration(_game.player.playerAccelerationValues.position, -1);
				}

				if (_events.keyboard.pressed[_game.player.controlKeys.right]) {
					_game.player.updateAcceleration(_game.player.playerAccelerationValues.rotation, 1);
				}

				if (_events.keyboard.pressed[_game.player.controlKeys.left]) {
					_game.player.updateAcceleration(_game.player.playerAccelerationValues.rotation, -1);
				}
			},
			accelerate: function() {
				_game.player.playerCoords = window.game.helpers.polarToCartesian(_game.player.acceleration, _game.player.rotationRadians.z);

				_game.player.rigidBody.velocity.set(_game.player.playerCoords.x, _game.player.playerCoords.y, _game.player.rigidBody.velocity.z);

				if (!_events.keyboard.pressed[_game.player.controlKeys.forward] && !_events.keyboard.pressed[_game.player.controlKeys.backward]) {
					_game.player.acceleration *= _game.player.damping;
				}
			},

			rotate: function() {
				_cannon.rotateOnAxis(_game.player.rigidBody, new CANNON.Vec3(0, 0, 1), _game.player.rotationAcceleration);

				if (!_events.keyboard.pressed[_game.player.controlKeys.left] && !_events.keyboard.pressed[_game.player.controlKeys.right]) {
					_game.player.rotationAcceleration *= _game.player.rotationDamping;
				}
			},
			jump: function() {
				if (_cannon.getCollisions(_game.player.rigidBody.index) && _game.player.isGrounded) {
					_game.player.isGrounded = false;
					_game.player.rigidBody.velocity.z = _game.player.jumpHeight;
				}
			},
			updateOrientation: function() {
				_game.player.rotationRadians = new THREE.Euler().setFromQuaternion(_game.player.rigidBody.quaternion);

				_game.player.rotationAngleX = Math.round(window.game.helpers.radToDeg(_game.player.rotationRadians.x));
				_game.player.rotationAngleY = Math.round(window.game.helpers.radToDeg(_game.player.rotationRadians.y));

				if ((_cannon.getCollisions(_game.player.rigidBody.index) &&
					((_game.player.rotationAngleX >= 90) ||
						(_game.player.rotationAngleX <= -90) ||
						(_game.player.rotationAngleY >= 90) ||
						(_game.player.rotationAngleY <= -90)))
					)
				{
					_game.player.rigidBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), _game.player.rotationRadians.z);
				}
			},
			checkGameOver: function () {
				if (_game.player.mesh.position.z <= -800) {
					_game.destroy();
				}
			}
		},
		level: {
			create: function() {
				_three.initSkybox()

				_cannon.solidMaterial = _cannon.createPhysicsMaterial(new CANNON.Material("solidMaterial"), 0, 0);



				// _cannon.createRigidBody({
				// 	shape: new CANNON.Box(new CANNON.Vec3(floorSize, floorSize, floorHeight)),
				// 	mass: 0,
				// 	position: new CANNON.Vec3(0, 0, -floorHeight),
				// 	meshMaterial: new THREE.MeshLambertMaterial({ color: window.game.static.colors.black }),
				// 	physicsMaterial: _cannon.solidMaterial
				// });

				_cannon.createRigidBody({
					shape: new CANNON.Box(new CANNON.Vec3(30, 30, 30)),
					mass: 15,
					position: new CANNON.Vec3(-200, 0, 50),
					meshMaterial: new THREE.MeshBasicMaterial({
						map: new THREE.TextureLoader().load('textures/lunarrock.png')
					}),
					physicsMaterial: _cannon.solidMaterial
				});


				// var grid = new THREE.GridHelper(floorSize, floorSize / 10);
				// grid.position.z = 0.5;
				// grid.rotation.x = window.game.helpers.degToRad(90);
				// _three.scene.add(grid);
			}
		},
		init: function(options) {
			_game.initComponents(options);
			_game.player.create();
			_game.level.create();
			_game.addControls()
			_game.loop();
		},
		destroy: function() {
			window.cancelAnimationFrame(_animationFrameLoop);

			_cannon.destroy();
			_cannon.setup();
			_three.destroy();
			_three.setup();

			_game.player = window.game.helpers.cloneObject(_gameDefaults.player);
			_game.level = window.game.helpers.cloneObject(_gameDefaults.level);

			_game.player.create();
			_game.level.create();

			_game.loop();
		},
		loop: function() {
			_animationFrameLoop = window.requestAnimationFrame(_game.loop);
			_cannon.updatePhysics();
			_game.player.update();

			var clock = new THREE.Clock();
      var delta = clock.getDelta();
      _game.controls.update( delta )
			_three.render();
		},
		    addControls: function() {
      // var controls = new THREE.OrbitControls( _three.camera, _three.renderer.domElement );
      // //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
      // controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
      // controls.dampingFactor = 0.25;
      // controls.screenSpacePanning = false;
      // controls.minDistance = 100;
      // controls.maxDistance = 500;
      // controls.maxPolarAngle = Math.PI / 2;

      _game.controls = new THREE.FlyControls( _game.player, _three.renderer.domElement );
    },
		initComponents: function (options) {
			_events = window.game.events();
			_three = window.game.three();
			_cannon = window.game.cannon();
			_ui = window.game.ui();

			_three.setupLights = function () {
				var hemiLight = new THREE.HemisphereLight(window.game.static.colors.white, window.game.static.colors.white, 0.6);
				hemiLight.position.set(0, 0, -1);
				_three.scene.add(hemiLight);

				var pointLight = new THREE.PointLight(window.game.static.colors.white, 0.5);
				pointLight.position.set(0, 0, 500);
				_three.scene.add(pointLight);
			};

			_three.init(options);
			_cannon.init(_three);
			_ui.init();
			// //inits boilerplate game controls
			// _events.init();



			_events.onKeyDown = function () {
				if (!_ui.hasClass("infoboxIntro", "fade-out")) {
					_ui.fadeOut("infoboxIntro");
				} else {
					return
				}
			};
		}
	};

	var _events;
	var _three;
	var _cannon;
	var _ui;
	var _animationFrameLoop;
	var _gameDefaults = {
		player: window.game.helpers.cloneObject(_game.player),
		level: window.game.helpers.cloneObject(_game.level)
	};

	return _game;
};
