init();

function init() {
	let mainGroup, allMeshes;
	let renderer, scene, camera, orbitControls;
	let validButton, fileInput;
	let windowHalfX, windowHalfY;
	let slider;
	let midiToChord;
	const ambientLight = new THREE.AmbientLight( 0x404040 ),
		  pointLight = new THREE.PointLight( 0xff0000, 1, 100 )
		  globalLights = new GlobalLights(20);
	const scale = 15;	
	
	allMeshes = new AllMeshes(scale);
	container = document.createElement('div');
	fileInput = document.getElementById('file-input');
	validButton = document.getElementById('valid-btn');
	validButton.onclick = function() {
		midiToChord = new MidiToChordMap();
		midiToChord.parse(fileInput, function() {
			slider = new Slider(fileInput, allMeshes, midiToChord.keysMap);
		});
	};

	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera.position.z = 50;

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	orbitControls = new THREE.OrbitControls( camera, renderer.domElement );
	orbitControls.minDistance = 5;
	orbitControls.maxDistance = 200;
	orbitControls.maxPolarAngle = Math.PI;

	scene.add( ambientLight );
	camera.add(pointLight);

	mainGroup = new THREE.Group();
	scene.add(mainGroup);
	mainGroup.add(globalLights);
	mainGroup.add(allMeshes.meshGroup);

	stats = new Stats();
	//container.appendChild(stats.dom);
	container.appendChild( renderer.domElement );
	document.body.appendChild(container);

	window.addEventListener( 'resize', onWindowResize, false );

	function animate() {
		requestAnimationFrame( animate );
		render();
		stats.update();
	}
	
	function render() {
		renderer.render( scene, camera );
	}

	function onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	animate();	
}
