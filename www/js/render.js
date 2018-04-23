/*var group, camera, scene, renderer, container;
var transformControl;
var vertexHelperObjects = [];
var vertices = [];
var chords = [];
var points;
var ws = new WebSocket("ws://127.0.0.1:5678/");

init();
animate();

function init() {
	container = document.getElementById( 'container' );

	scene =  new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set( 15, 30, 40 );
	scene.add(camera);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	container.appendChild( renderer.domElement );

	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.minDistance = 5;
	controls.maxDistance = 50;
	controls.maxPolarAngle = Math.PI / 2;

	// light
	scene.add( new THREE.AmbientLight( 0x000000 ) );
	var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( pointLight );

	group = new THREE.Group();
	

	transformControl = new THREE.TransformControls( camera, renderer.domElement );
	transformControl.addEventListener( 'change', render );
	scene.add( transformControl );
	
	transformControl.addEventListener( 'change', function( e ) {
		cancelHideTransorm();
	} );
	transformControl.addEventListener( 'mouseDown', function( e ) {
		cancelHideTransorm();
	} );
	transformControl.addEventListener( 'mouseUp', function( e ) {
		delayHideTransform();
	} );
	transformControl.addEventListener( 'objectChange', function( e ) {
		updateChordPolyhedron(chord);
	} );

	window.addEventListener( 'resize', onWindowResize, false );

	var dragcontrols = new THREE.DragControls( vertexHelperObjects, camera, renderer.domElement ); //
	dragcontrols.enabled = false;
	
	dragcontrols.addEventListener( 'change', function ( event ) {
		console.log("DragControls changes");
	} );

	dragcontrols.addEventListener( 'hoveron', function ( event ) {
		transformControl.attach( event.object );
		cancelHideTransorm();
	} );
	dragcontrols.addEventListener( 'hoveroff', function ( event ) {
		delayHideTransform();
	} );
	
	var hiding;
	
	function delayHideTransform() {
		cancelHideTransorm();
		hideTransform();
	}
	function hideTransform() {
		hiding = setTimeout( function() {
			transformControl.detach( transformControl.object );
		}, 2500 )
	}
	function cancelHideTransorm() {
		if ( hiding ) clearTimeout( hiding );
	}
}

function drawChords() {
	console.log('number of chords : ' + chords.length);
	for(var i=0; i<90; i++) {
		chords[i].drawChord();
		group.add(chords[i].group);
	}
	scene.add(group);
	console.log('chords rendered');
	render();
}

function render() {
	renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame(animate);

	render();
}*/