init();
animate();

function init() {
	let mainGroup, allMeshes;
	let renderer, scene, camera, orbitControls;
	const ambientLight, pointLight, globalLights;
	let validButton, fileInput;
	const scale = 15;
	let windowHalfX, windowHalfY;
	let midiToChord = new MidiToChordMap();

	container = document.createElement('div');
	fileInput = document.getElementById('file-input');
	validButton = document.getElementById('valid-btn');
	validButton.onclick = function() {
		midiToChord.parse(fileInput);
	};

	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera.position.z = 50;

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );

	renderer = new THREE.WebGLRenderer();
	//renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	orbitControls = new THREE.OrbitControls( camera, renderer.domElement );
	orbitControls.minDistance = 5;
	orbitControls.maxDistance = 200;
	orbitControls.maxPolarAngle = Math.PI;

	ambientLight = new THREE.AmbientLight( 0x404040 );
	scene.add( ambientLight );

	pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
	camera.add(pointLight);

	mainGroup = new THREE.Group();
	scene.add(mainGroup);

	globalLights = new GlobalLights();
	mainGroup.add(globalLights);

	allMeshes = new allMeshes(scale);
	mainGroup.add(allMeshes.meshGroup);
	

	stats = new Stats();
	//container.appendChild(stats.dom);
	container.appendChild( renderer.domElement );
	document.body.appendChild(container);

	window.addEventListener( 'resize', onWindowResize, false );
}



function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function drawChords(low, upp) {
	
}




function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}

function render() {
	renderer.render( scene, camera );
}
