var mainGroup, shapesGroup, labels, container, camera, renderer, scene, stats;
var chords = {};
var notes = [];
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
//var ws = new WebSocket("ws://127.0.0.1:5678/");
var cube;


init();
animate();

function init() {
	container = document.createElement('div');

	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera.position.z = 50;

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );

	renderer = new THREE.WebGLRenderer();
	//renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.minDistance = 5;
	controls.maxDistance = 200;
	controls.maxPolarAngle = Math.PI;

	container.appendChild( renderer.domElement );

	mainGroup = new THREE.Group();
	shapesGroup = new THREE.Group();
	scene.add(shapesGroup);
	scene.add(mainGroup);

	const ambientLight = new THREE.AmbientLight( 0x404040 );
	scene.add( ambientLight );

	const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
	//camera.add(pointLight);

	makeAllMeshes();
	makeLights();

	stats = new Stats();
	//container.appendChild(stats.dom);
	document.body.appendChild(container);

	window.addEventListener( 'resize', onWindowResize, false );
}

function makeAllMeshes() {
	spheres = new Map();
	sticks = new Map();
	faces = new Map();
	labels = new THREE.Group();
	//creates all point meshes
	allPoints.forEach((point, i) => {
		let sphere = new OnePoint(point, scale);
		point.visible = false;
		spheres.set(i,sphere);

		scene.add(sphere);
		/*var label = new makeTextSprite(i, scale);
		labels.add(label);		*/
	});
	

	const stickGen = subsets(allPoints, 2);
	let stickPts;
	while(!(stickPts = stickGen.next()).done) {
		let stickPtsArray = Array.from(stickPts.value);
		let p1 = stickPtsArray[0];
		let p2 = stickPtsArray[1];
		
		let stick = new TwoPoints(p1, p2, scale);
		stick.visible = false;
		
		sticks.set(keyFromPtSet(stickPtsArray, allPoints), stick);

		scene.add(stick);
	}

	const faceGen = subsets(allPoints, 3);
	let facePts;
	while(!(facePts = faceGen.next()).done) {
		let facePtsArray = Array.from(facePts.value);
		let face = new ThreePoints(facePtsArray, scale);
		face.visible = false;
		faces.set(keyFromPtSet(facePtsArray, allPoints), face);

		scene.add(face);
	}

	drawChords(0,100);
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function drawChords(low, upp) {
	spheres.forEach(function(val, key) {
		val.visible = false;
	});

	sticks.forEach(function(val, key) {
		val.visible = false;
	});

	faces.forEach(function(val, key) {
		val.visible = false;
	});

	for(let i=low; i<upp; i++) {
		
	}
}

function keyFromPtSet(array, indexer) {
	if(indexer !== null){
		return array.reduce((acc, v) => acc + 1 << indexer.indexOf(v), 0);
	} else {
		return array.reduce((acc, v) => acc + 1 << v, 0);
	}
	
}


function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}

function render() {
	renderer.render( scene, camera );
}
