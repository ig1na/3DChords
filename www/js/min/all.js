function OnePoint(point, scale) {
	let group = new THREE.Group();
	let sphere = new THREE.SphereBufferGeometry(2,50,50);
	let sphereMesh = new THREE.Mesh(sphere, RGBMaterial);
	let label = makeTextSprite(point);

	sphereMesh.position.copy(point.clone().multiplyScalar(scale));

	group.add(sphereMesh);
	group.add(label);
	
	return group;
}

function showOnePoint(index) {
	spheres.get(index).visible = true;
}
function ThreePoints(points, scale) {
	this.group = new THREE.Group();
	let material = new THREE.MeshStandardMaterial( {
		opacity: 0.2,
		transparent: true,
		depthWrite: false,
		side: THREE.DoubleSide
	} );
	/*var geometry = new THREE.Geometry();
	for(var note in notes) {
		geometry.vertices.push( allPoints[notes[note]].clone().multiplyScalar(scale) );
	}

	geometry.faces.push(new THREE.Face3(0,1,2));
	geometry.faces.push(new THREE.Face3(2,1,0));
	geometry.computeFaceNormals();

	var v1 = geometry.vertices[0];
	var v2 = geometry.vertices[1];
	var v3 = geometry.vertices[2];

	this.group.add(new CylinderFromPts(v1, v2));
	this.group.add(new CylinderFromPts(v2, v3));
	this.group.add(new CylinderFromPts(v3, v1));*/

	let geometry = new THREE.BufferGeometry();
	
	let positions = [];
	let normals = [];
	
	for(let point of points) {
		positions.push(point.clone().x);
		positions.push(point.clone().y);
		positions.push(point.clone().z);
		normals.push(1,1,1);
	}

	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	//geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );

	geometry.scale(scale, scale, scale);

	var mesh = new THREE.Mesh( geometry, material.clone() );
	this.group.add( mesh );
	//this.group.add(new PolySpheresFromNotes(notes));

	// const v1 = points[0].clone().multiplyScalar(scale);
	// const v2 = points[1].clone().multiplyScalar(scale);
	// const v3 = points[2].clone().multiplyScalar(scale);

	// this.group.add(new CylinderFromPts(v1, v2));
	// this.group.add(new CylinderFromPts(v2, v3));
	// this.group.add(new CylinderFromPts(v3, v1));

	return this.group;
}

function showThreePoints(ptsIndexes) {
	//console.log(ptsIndexes);
	ptsIndexes.forEach(index => {
		showOnePoint(index);
	});

	sticks.get(keyFromPtSet([ptsIndexes[0], ptsIndexes[1]])).visible = true;
	sticks.get(keyFromPtSet([ptsIndexes[1], ptsIndexes[2]])).visible = true;
	sticks.get(keyFromPtSet([ptsIndexes[2], ptsIndexes[0]])).visible = true;

	faces.get(keyFromPtSet(ptsIndexes)).visible = true;
}
function TwoPoints(point1, point2, scale) {

	var v1 = point1.clone().multiplyScalar(scale);
	var v2 = point2.clone().multiplyScalar(scale);

	// var cylinder = new THREE.CylinderBufferGeometry(0.4, 0.4, v1.distanceTo(v2), 10, 0.5, true);

	this.group = new THREE.Group();

	/*var sphereAMesh = sphereMesh.clone();
	sphereAMesh.position.copy(v1);
	sphereAMesh.updateMatrix();

	var sphereBMesh = sphereMesh.clone();
	sphereBMesh.position.copy(v2);
	sphereBMesh.updateMatrix();*/

	var cylinderMesh = new CylinderFromPts(v1, v2);

	/*this.group.add(spheres[noteVal1]);
	this.group.add(spheres[noteVal2]);*/
	this.group.add(cylinderMesh);

	return this.group;
}	

function showTwoPoints(indexes) {
	console.log("showTwoPoints");
	
	showOnePoint(indexes[0]);
	showOnePoint(indexes[1]);
	//console.log('sticks', sticks);
	//console.log('keyFromPtSet', keyFromPtSet(indexes));
	sticks.get(keyFromPtSet(indexes)).visible = true;
}
function AllMeshes(givenScale) {
	this.meshById = new Map();
	this.labels = new THREE.Group();
	this.meshGroup = new THREE.Group();

	let scale = givenScale;

	function fromPtsNumber(number) {
		const gen = subsets(allPoints, number);
		
		for(let subset of gen) {
			let subArray = Array.from(subset);
			let sorted = subArray.sort((a, b) => allPoints.indexOf(a) - allPoints.indexOf(b));
			let key = keyFromPtArray(sorted, allPoints);

			try {
				let mesh = new MeshFromPtsArray(subArray, scale);
				mesh.visible = false;

				this.meshById.set(key, mesh);

				this.meshGroup.add(mesh);
			} catch(err) {
				console.log(err);
			}
		}
	}

	fromPtsNumber.call(this,1);
	fromPtsNumber.call(this,2);
	fromPtsNumber.call(this,3);

	

	console.log('meshById: ', this.meshById);

		//creates all point meshes
	/*allPoints.forEach((point, i) => {
		let sphere = new OnePoint(point, scale);
		sphere.visible = false;
		spheres.set(i,sphere);

		scene.add(sphere);
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
        let facePtsArray = Array.	from(facePts.value);

        let face = new ThreePoints(facePtsArray, scale);
        face.visible = false;
        
		faces.set(keyFromPtSet(facePtsArray, allPoints), face);

		scene.add(face);
	}*/
}

AllMeshes.prototype.showFromPtsArray = function(ptsArray, value) {
	let maxIter = ptsArray.length % 4;
	//console.log('ptsArray', ptsArray);
	for(let i=1; i<=maxIter; i++){
		let gen = subsets(ptsArray, i);
		for(let sub of gen) {
			let subArray = Array.from(sub);
			
			let key = keyFromPtArray(subArray);

			if(this.meshById.has(key)) {
				this.meshById.get(key).visible = value;	
			}
		}
	
	}
	
}

AllMeshes.prototype.showFromKey = function(key, value) {
	if(this.meshById.has(key))
		this.meshById.get(key).visible = value;
}

function keyFromPtArray(array, indexer) {
	let key = '';
	let index;
	let sorted;
	let isIndexed = (indexer != null);

	if(isIndexed) {
		sorted = array.sort((a, b) => indexer.indexOf(a) - indexer.indexOf(b));
	} else {
		sorted = array.sort((a, b) => a - b);
	}

	for(let point of sorted) {
		if(isIndexed)
			index = indexer.indexOf(point);
		else
			index = point;

		key += '.'+String(index);
	}

	return key;
}
const allPoints = [
	new THREE.Vector3(-0.759660693047, 0.604292704079, -0.24030388935),
	new THREE.Vector3(-0.484266848777, -0.206777047119, -0.850134619904),
	new THREE.Vector3(-0.920237918114, -0.380693391816, 0.0907453331794),
	new THREE.Vector3(0.484262805093, 0.206779975968, 0.850136210935),
	new THREE.Vector3(0.15145161988, 0.626368316073, -0.764673223969),
	new THREE.Vector3(0.920239782922, 0.380689606229, -0.0907423034545),
	new THREE.Vector3(0.553969561005, -0.344971045556, -0.757702252345),
	new THREE.Vector3(-0.108369619985, -0.967368855227, -0.229027342037),
	new THREE.Vector3(-0.151450068974, -0.626369420927, 0.764672626119),
	new THREE.Vector3(0.759659900971, -0.604292987333, 0.240305680991),
	new THREE.Vector3(0.108371805964, 0.967369703862, 0.229022723155),
	new THREE.Vector3(-0.553970326938, 0.344972441767, 0.75770105668)
];

/*
var allPoints = [
	[-0.759660693047, 0.604292704079, -0.24030388935],
	[-0.484266848777, -0.206777047119, -0.850134619904],
	[-0.920237918114, -0.380693391816, 0.0907453331794],
	[0.484262805093, 0.206779975968, 0.850136210935],
	[0.15145161988, 0.626368316073, -0.764673223969],
	[0.920239782922, 0.380689606229, -0.0907423034545],
	[0.553969561005, -0.344971045556, -0.757702252345],
	[-0.108369619985, -0.967368855227, -0.229027342037],
	[-0.151450068974, -0.626369420927, 0.764672626119],
	[0.759659900971, -0.604292987333, 0.240305680991],
	[0.108371805964, 0.967369703862, 0.229022723155],
	[-0.553970326938, 0.344972441767, 0.75770105668]
];
*/
function* subsets(array, length, start = 0) {
  if (start >= array.length || length < 1) {
    yield new Set();
  } else {
    while (start <= array.length - length) {
      let first = array[start];
      for (subset of subsets(array, length - 1, start + 1)) {
        subset.add(first);
        yield subset;
      }
      ++start;
    }
  }
}
function GlobalLights(distFromMid) {
	const distance = distFromMid;
	const lightsGroup = new THREE.Group();

	//top lights
	let pointLight1 = new THREE.PointLight(0xff0000, 1, 100);
	pointLight1.position.set(distance, distance, distance);
	lightsGroup.add(pointLight1);

	/*let helper = new THREE.PointLightHelper(pointLight1, 1);
	lightsGroup.add(helper);*/

	let pointLight2 = new THREE.PointLight(0x00ff00, 1, 100);
	pointLight2.position.set(distance, distance, -distance);
	lightsGroup.add(pointLight2);

	/*let helper = new THREE.PointLightHelper(pointLight2, 1);
	lightsGroup.add(helper);*/

	let pointLight3 = new THREE.PointLight(0xffff00, 1, 100);
	pointLight3.position.set(-distance, distance, distance);
	lightsGroup.add(pointLight3);

	/*let helper = new THREE.PointLightHelper(pointLight3, 1);
	lightsGroup.add(helper);*/

	let pointLight4 = new THREE.PointLight(0x0000ff, 1, 100);
	pointLight4.position.set(-distance, distance, -distance);
	lightsGroup.add(pointLight4);

	/*let helper = new THREE.PointLightHelper(pointLight4, 1);
	lightsGroup.add(helper);*/


	//bottom lights
	let pointLight5 = new THREE.PointLight(0x00ffff, 1, 100);
	pointLight5.position.set(distance, -distance, distance);
	lightsGroup.add(pointLight5);

	/*let helper = new THREE.PointLightHelper(pointLight5, 1);
	lightsGroup.add(helper);*/

	let pointLight6 = new THREE.PointLight(0xff00ff, 1, 100);
	pointLight6.position.set(distance, -distance, -distance);
	lightsGroup.add(pointLight6);

	/*let helper = new THREE.PointLightHelper(pointLight6, 1);
	lightsGroup.add(helper);
*/
	let pointLight7 = new THREE.PointLight(0xff8888, 1, 100);
	pointLight7.position.set(-distance, -distance, distance);
	lightsGroup.add(pointLight7);

	/*let helper = new THREE.PointLightHelper(pointLight7, 1);
	lightsGroup.add(helper);*/

	let pointLight8 = new THREE.PointLight(0x8888ff, 1, 100);
	pointLight8.position.set(-distance, -distance, -distance);
	lightsGroup.add(pointLight8);

	/*let helper = new THREE.PointLightHelper(pointLight8, 1);
	lightsGroup.add(helper);*/



	//middle light
	/*let pointLight9 = new THREE.PointLight(0xffffff, 1, 100);
	pointLight9.position.set(x, y, z);
	lightsGroup.add(pointLight9);

	let helper = new THREE.PointLightHelper(pointLight9, 1);
	group.add(helper);*/
	return lightsGroup;
}
const transparentMaterialFront = new THREE.MeshLambertMaterial( {
	color: 0xffffff,
	opacity: 0.4,
	transparent: true,
	side: THREE.DoubleSide
} );

const transparentMaterialBack = new THREE.MeshLambertMaterial( {
	color: 0xffffff,
	opacity: 0.4,
	transparent: true
} );

const pointsMaterial = new THREE.PointsMaterial( {
	color: 0x0080ff,
	size: 1,
	alphaTest: 0.5
} );

const RGBMaterial = new THREE.MeshNormalMaterial( {
	color: 0x0088ff,
	side: THREE.DoubleSide
});

const STDMaterial = new THREE.MeshStandardMaterial( {
	color: 0x0088ff
});

const flatShapeMaterial = new THREE.MeshPhongMaterial( {
	side : THREE.DoubleSide,
	transparent : true,
	opacity: 0.5
});
function CylinderFromPts(v1, v2) {
	var cylinder = new THREE.CylinderBufferGeometry(0.4, 0.4, v1.distanceTo(v2), 10, 0.5, true);
	var cylinderMesh = new THREE.Mesh(cylinder, RGBMaterial);
	cylinderMesh.position.copy(v1.clone().lerp(v2, .5));

	//creates quaternion from spheres position to rotate the cylinder
	var q = new THREE.Quaternion();
	q.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3().subVectors(v1, v2).normalize());
	cylinderMesh.setRotationFromQuaternion(q);
	return cylinderMesh;
}
function PolyMeshes(geometry, notes) {
	this.group = new THREE.Group();

	this.group.add(new TranspMeshGrp(geometry));
	//this.group.add(new PolySpheresFromNotes(notes));
	return this.group;
}

function MeshFromPtsArray(ptsArray, scale) {
	let len = ptsArray.length;
	

	switch(len) {
		case 1:
			return new OnePoint(ptsArray[0], scale);
			break;
		case 2:
			return new TwoPoints(ptsArray[0], ptsArray[1], scale);
			break;
		case 3:
			return new ThreePoints(ptsArray, scale);
			break;
		default:
			throw "Can't create mesh for so much points";
			break;
	}
}

PolyMeshes.prototype.setPos = function(x,y,z) {
	this.group.position.x = x;
	this.group.position.y = y;
	this.group.position.z = z;
}
// //creates spheres for each vertex of the geometry
// var sphere = new THREE.SphereGeometry(2,50,50);
// var sphereMesh = new THREE.Mesh(sphere, RGBMaterial);

// function PolySpheres(geometry) {
// 	this.group = new THREE.Group();
// 	var mesh = sphereMesh.clone();
// 	for(var i=0; i<geometry.vertices.length; i++) {
// 		sphereMesh.position.copy(geometry.vertices[i]);
// 		this.group.add(sphereMesh.clone());
// 	}

// 	return this.group;
// }

// function PolySpheresFromNotes(notes) {
// 	var group = new THREE.Group();
// 	for(var i in notes) {
// 		group.add(spheres.getObjectById(notes[i]).clone());
// 	}
// 	/*console.log(group);*/

// 	return group;
// }
function makeTextSprite( point, scale, parameters )
{
	let map, sprite, material;

	let textureLoader = new THREE.TextureLoader();
	let note = allPoints.indexOf(point);
	

	switch(note) {
		case 0: map = textureLoader.load('sprites/C.png');
				break;
		case 1: map = textureLoader.load('sprites/CS.png');
				break;
		case 2: map = textureLoader.load('sprites/D.png');
				break;
		case 3: map = textureLoader.load('sprites/DS.png');
				break;
		case 4: map = textureLoader.load('sprites/E.png');
				break;
		case 5: map = textureLoader.load('sprites/F.png');
				break;
		case 6: map = textureLoader.load('sprites/FS.png');
				break;
		case 7: map = textureLoader.load('sprites/G.png');
				break;
		case 8: map = textureLoader.load('sprites/GS.png');
				break;
		case 9: map = textureLoader.load('sprites/A.png');
				break;
		case 10: map = textureLoader.load('sprites/AS.png');
				break;
		case 11: map = textureLoader.load('sprites/B.png');
				break;
	}

	console.log(map);

	material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true });

	sprite = new THREE.Sprite(material);

	sprite.position.copy(point.clone().multiplyScalar(scale));

	return sprite;	
}
//creates and returns an array of two meshes to create transparency
function TranspMeshGrp(geometry) {
	var group = new THREE.Group();
	var meshGeometry = new THREE.ConvexBufferGeometry(geometry.vertices);

	var faces = meshGeometry.faces;
	for(var face in faces) {
		for(var i=0; i<3; i++) {
			var v1 = faces[face].getEdge(i).head();
			var v2 = faces[face].getEdge(i).tail();
			group.add(new CylinderFromPts(v1.point, v2.point));
		}
	}

	var mesh = new THREE.Mesh(meshGeometry, transparentMaterialBack);
	mesh.material.side = THREE.BackSide; // back faces
	mesh.renderOrder = 0;

	var mesh2 = new THREE.Mesh(meshGeometry, transparentMaterialFront.clone());
	mesh2.material.side = THREE.FrontSide; // front faces
	mesh2.renderOrder = 1;

	group.add(mesh);
	group.add(mesh2);

	return group;
}

function showPolyhedron(ptsIndexes) {
	//console.log(ptsIndexes);
	// let vertices = [];
	// ptsIndexes.forEach(index => {
	// 	vertices.push(allPoints[index].clone());
	// });
	// // console.log('vertices', vertices);

	// let geometry = new THREE.ConvexBufferGeometry(vertices);
	// // console.log('geometry', geometry);
	// geometry.faces.forEach(face => {
	// 	let pt1 = face.getEdge(0).head().point,
	// 		pt2 = face.getEdge(1).head().point,
	// 		pt3 = face.getEdge(2).head().point;
	// 	// console.log('face', face);
	// 	// console.log('pt1', pt1);
	// 	// console.log('pt2', pt2);
	// 	// console.log('pt3', pt3);
	// 	let index1 = allPoints.map(function(e) { return e.equals(pt1) }).indexOf(true),
	// 		index2 = allPoints.map(function(e) { return e.equals(pt2) }).indexOf(true),
	// 		index3 = allPoints.map(function(e) { return e.equals(pt3) }).indexOf(true);
	// 	showThreePoints([index1, index2, index3]);
	// });

	//const indexes = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];

	const gen = subsets(ptsIndexes, 3);
	let threePts;

	while(!(threePts = gen.next()).done) {
		showThreePoints(Array.from(threePts.value));
	}


}

/*function makeTransparent(geometry, group) {
	//geometry.computeVertexNormals();
	//geometry.computeFaceNormals();
	group.add(new THREE.Mesh(geometry, transparentMaterialFront));
}*/
const scale = 15;
let chordGeometry;

function Chord(notes) {
	this.notes = [];

	for(var i in notes) {
		let finalNote = notes[i] % 12;
		if(this.notes.indexOf(finalNote) == -1) 
			this.notes.push(finalNote);
	}

	this.drawChord();
}

Chord.prototype.addNote = function(note) {
	this.notes.push(note % 12);
}

Chord.prototype.show = function(bool) {
	this.polyhedron.visible = bool;
	for(var i in this.notes) {
		spheres.children[this.notes[i]].visible = bool;
	}
}

Chord.prototype.drawChord = function() {
	var nbNotes = this.notes.length;

	if(nbNotes == 1) {
		this.polyhedron = new THREE.Object3D();
	} else if(nbNotes == 2) {
		this.polyhedron = new TwoPoints(this.notes[0], this.notes[1], scale);
	} else if(nbNotes == 3) {
		this.polyhedron = new ThreePoints(this.notes, scale);
	}else {
		chordGeometry = new THREE.Geometry();
		
		for(var i=0; i<nbNotes; i++) {
			chordGeometry.vertices.push(
				allPoints[this.notes[i]].clone()
			);
		}

		// var subs = subsets(this.notes, 3);
		// var pointIds;
		// var pointId1, pointId2, pointId3;
		// var face;

		// for(sub of subs) {
		// 	pointIds = sub.entries();
			
		// 	//get the face's 3 vertices index
		// 	pointId1 = pointIds.next().value[0].value;
		// 	pointId2 = pointIds.next().value[0].value;
		// 	pointId3 = pointIds.next().value[0].value;

		// 	face = new THREE.Face3(pointId1,pointId2,pointId3);
		// 	geometry.faces.push(face);
		// }

		// var meshGeometry = new THREE.ConvexBufferGeometry(geometry.vertices);
		chordGeometry.scale(scale,scale,scale);
		this.polyhedron = new PolyMeshes(chordGeometry, this.notes);

	}
	this.polyhedron.visible = false;
	shapesGroup.add(this.polyhedron);
	

}

Chord.prototype.equals = function(chord) {
	if(this.notes.length != chord.notes.length)
		return false;

	for(let note in chord.notes) {
		if(this.notes[note] != chord.notes[note])
			return false;
	}

	return true;
}
init();

function init() {
	let mainGroup, allMeshes;
	let renderer, scene, camera, orbitControls;
	let validButton, fileInput;
	let windowHalfX, windowHalfY;
	let slider;
	let midiToChord = new MidiToChordMap();
	const ambientLight = new THREE.AmbientLight( 0x404040 ),
		  pointLight = new THREE.PointLight( 0xff0000, 1, 100 )
		  globalLights = new GlobalLights(20);
	const scale = 15;	
	
	allMeshes = new AllMeshes(scale);
	container = document.createElement('div');
	fileInput = document.getElementById('file-input');
	validButton = document.getElementById('valid-btn');
	validButton.onclick = function() {
		
		midiToChord.parse(fileInput, function() {
			console.log('creating slider..');
			console.log('chordsMap: ', midiToChord.chordsMap);
			console.log('keysMap: ', midiToChord.keysMap);
			slider = new Slider(fileInput, allMeshes, midiToChord.keysMap);
		});
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

/**
* Convert From/To Binary/Decimal/Hexadecimal in JavaScript
* https://gist.github.com/faisalman
*
* Copyright 2012-2015, Faisalman <fyzlman@gmail.com>
* Licensed under The MIT License
* http://www.opensource.org/licenses/mit-license
*/

(function(){

    var ConvertBase = function (num) {
        return {
            from : function (baseFrom) {
                return {
                    to : function (baseTo) {
                        return parseInt(num, baseFrom).toString(baseTo);
                    }
                };
            }
        };
    };
        
    // binary to decimal
    ConvertBase.bin2dec = function (num) {
        return ConvertBase(num).from(2).to(10);
    };
    
    // binary to hexadecimal
    ConvertBase.bin2hex = function (num) {
        return ConvertBase(num).from(2).to(16);
    };
    
    // decimal to binary
    ConvertBase.dec2bin = function (num) {
        return ConvertBase(num).from(10).to(2);
    };
    
    // decimal to hexadecimal
    ConvertBase.dec2hex = function (num) {
        return ConvertBase(num).from(10).to(16);
    };
    
    // hexadecimal to binary
    ConvertBase.hex2bin = function (num) {
        return ConvertBase(num).from(16).to(2);
    };
    
    // hexadecimal to decimal
    ConvertBase.hex2dec = function (num) {
        return ConvertBase(num).from(16).to(10);
    };
    
    this.ConvertBase = ConvertBase;
    
})(this);

/*
* Usage example:
* ConvertBase.bin2dec('111'); // '7'
* ConvertBase.dec2hex('42'); // '2a'
* ConvertBase.hex2bin('f8'); // '11111000'
* ConvertBase.dec2bin('22'); // '10110'
*/

/*
    Project Name: midi-parser-js
    Author: colxi
    Author URI: http://www.colxi.info/
    Description: MIDIParser library reads .MID binary files, Base64 encoded MIDI Data,
    or UInt8 Arrays, and outputs as a readable and structured JS object.

    ---     Usage Methods      ---
    ------------------------------

    * OPTION 1 NEW! (MIDIParser.parse)
    Will autodetect the source and proccess the data, using the suitable method.

    * OPTION 2 (MIDIParser.addListener)
    INPUT ELEMENT LISTENER : call MIDIParser.addListener(fileInputElement,callbacFunction) function, setting the
    Input File HTML element that will handle the file.mid opening, and callback function
    that will recieve the resulting Object formated, set of data.

    * OPTION 3 (MIDIParser.Uint8)
    Provide your own UInt8 Array to MIDIParser.Uint8(), to get an Object formated, set of data

    * OPTION 4 (MIDIParser.Base64)
    Provide a Base64 encoded Data to MIDIParser.Base64(), , to get an Object formated, set of data


    ---  Output Object Specs   ---
    ------------------------------

    MIDIObject{
        formatType: 0|1|2,                  // Midi format type
        timeDivision: (int),                // song tempo (bpm)
        tracks: (int),                      // total tracks count
        track: Array[
            [0]: Object{                    // TRACK 1!
                event: Array[               // Midi events in track 1
                    [0] : Object{           // EVENT 1
                        data: (string),
                        deltaTime: (int),
                        metaType: (int),
                        type: (int),
                    },
                    [1] : Object{...}       // EVENT 2
                    [2] : Object{...}       // EVENT 3
                    ...
                ]
            },
            [1] : Object{...}
            [2] : Object{...}
            ...
        ]
    }

Data from Event 12 of Track 2 could be easilly readed with:
OutputObject.track[2].event[12].data;

*/


'use strict';

// CROSSBROWSER & NODEjs POLYFILL for ATOB() - By: https://github.com/MaxArt2501 (modified)
const _atob = function(string) {
    // base64 character set, plus padding character (=)
    let b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    // Regular expression to check formal correctness of base64 encoded strings
    let b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
    // remove data type signatures at the begining of the string
    // eg :  "data:audio/mid;base64,"
    string = string.replace( /^.*?base64,/ , '');
    // atob can work with strings with whitespaces, even inside the encoded part,
    // but only \t, \n, \f, \r and ' ', which can be stripped.
    string = String(string).replace(/[\t\n\f\r ]+/g, '');
    if (!b64re.test(string))
        throw new TypeError('Failed to execute _atob() : The string to be decoded is not correctly encoded.');

    // Adding the padding if missing, for semplicity
    string += '=='.slice(2 - (string.length & 3));
    let bitmap, result = '';
    let r1, r2, i = 0;
    for (; i < string.length;) {
        bitmap = b64.indexOf(string.charAt(i++)) << 18 | b64.indexOf(string.charAt(i++)) << 12
                | (r1 = b64.indexOf(string.charAt(i++))) << 6 | (r2 = b64.indexOf(string.charAt(i++)));

        result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255)
                : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255)
                : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
};

const MIDIParser = {
    // debug (bool), when enabled will log in console unimplemented events
    // warnings and internal handled errors.
    debug: false,

    parse: function(input, _callback){
        if(input instanceof Uint8Array) return MIDIParser.Uint8(input);
        else if(typeof input === 'string') return MIDIParser.Base64(input);
        else if(input instanceof HTMLElement && input.type === 'file') return MIDIParser.addListener(input , _callback);
        else throw new Error('MIDIParser.parse() : Invalid input provided');
    },
    // addListener() should be called in order attach a listener to the INPUT HTML element
    // that will provide the binary data automating the conversion, and returning
    // the structured data to the provided callback function.
    addListener: function(_fileElement, _callback){
        if(!File || !FileReader) throw new Error('The File|FileReader APIs are not supported in this browser. Use instead MIDIParser.Base64() or MIDIParser.Uint8()');

        // validate provided element
        if( _fileElement === undefined ||
            !(_fileElement instanceof HTMLElement) ||
            _fileElement.tagName !== 'INPUT' ||
            _fileElement.type.toLowerCase() !== 'file' ){
                console.warn('MIDIParser.addListener() : Provided element is not a valid FILE INPUT element');
                return false;
        }
        _callback = _callback || function(){};

        _fileElement.addEventListener('change', function(InputEvt){             // set the 'file selected' event handler
            if (!InputEvt.target.files.length) return false;                    // return false if no elements where selected
            console.log('MIDIParser.addListener() : File detected in INPUT ELEMENT processing data..');
            let reader = new FileReader();                                      // prepare the file Reader
            reader.readAsArrayBuffer(InputEvt.target.files[0]);                 // read the binary data
            reader.onload =  function(e){
                _callback( MIDIParser.Uint8(new Uint8Array(e.target.result)));  // encode data with Uint8Array and call the parser
            };
        });
    },

    // convert baset4 string into uint8 array buffer, before performing the
    // parsing subroutine.
    Base64 : function(b64String){
        b64String = String(b64String);

        let raw = _atob(b64String);
        let rawLength = raw.length;
        let t_array = new Uint8Array(new ArrayBuffer(rawLength));

        for(let i=0; i<rawLength; i++) t_array[i] = raw.charCodeAt(i);
        return  MIDIParser.Uint8(t_array) ;
    },

    // parse() function reads the binary data, interpreting and spliting each chuck
    // and parsing it to a structured Object. When job is finised returns the object
    // or 'false' if any error was generated.
    Uint8: function(FileAsUint8Array){
        let file = {
            data: null,
            pointer: 0,
            movePointer: function(_bytes){                                      // move the pointer negative and positive direction
                this.pointer += _bytes;
                return this.pointer;
            },
            readInt: function(_bytes){                                          // get integer from next _bytes group (big-endian)
                _bytes = Math.min(_bytes, this.data.byteLength-this.pointer);
                if (_bytes < 1) return -1;                                                                      // EOF
                let value = 0;
                if(_bytes > 1){
                    for(let i=1; i<= (_bytes-1); i++){
                        value += this.data.getUint8(this.pointer) * Math.pow(256, (_bytes - i));
                        this.pointer++;
                    }
                }
                value += this.data.getUint8(this.pointer);
                this.pointer++;
                return value;
            },
            readStr: function(_bytes){                                          // read as ASCII chars, the followoing _bytes
                let text = '';
                for(let char=1; char <= _bytes; char++) text +=  String.fromCharCode(this.readInt(1));
                return text;
            },
            readIntVLV: function(){                                             // read a variable length value
                let value = 0;
                if ( this.pointer >= this.data.byteLength ){
                    return -1;                                                  // EOF
                }else if(this.data.getUint8(this.pointer) < 128){               // ...value in a single byte
                    value = this.readInt(1);
                }else{                                                          // ...value in multiple bytes
                    let FirstBytes = [];
                    while(this.data.getUint8(this.pointer) >= 128){
                        FirstBytes.push(this.readInt(1) - 128);
                    }
                    let lastByte  = this.readInt(1);
                    for(let dt = 1; dt <= FirstBytes.length; dt++){
                        value += FirstBytes[FirstBytes.length - dt] * Math.pow(128, dt);
                    }
                    value += lastByte;
                }
                return value;
            }
        };

        file.data = new DataView(FileAsUint8Array.buffer, FileAsUint8Array.byteOffset, FileAsUint8Array.byteLength);                                            // 8 bits bytes file data array
        //  ** read FILE HEADER
        if(file.readInt(4) !== 0x4D546864){
            console.warn('Header validation failed (not MIDI standard or file corrupt.)');
            return false;                                                       // Header validation failed (not MIDI standard or file corrupt.)
        }
        let headerSize          = file.readInt(4);                              // header size (unused var), getted just for read pointer movement
        let MIDI                = {};                                           // create new midi object
        MIDI.formatType         = file.readInt(2);                              // get MIDI Format Type
        MIDI.tracks             = file.readInt(2);                              // get ammount of track chunks
        MIDI.track              = [];                                           // create array key for track data storing
        let timeDivisionByte1   = file.readInt(1);                              // get Time Division first byte
        let timeDivisionByte2   = file.readInt(1);                              // get Time Division second byte
        if(timeDivisionByte1 >= 128){                                           // discover Time Division mode (fps or tpf)
            MIDI.timeDivision    = [];
            MIDI.timeDivision[0] = timeDivisionByte1 - 128;                     // frames per second MODE  (1st byte)
            MIDI.timeDivision[1] = timeDivisionByte2;                           // ticks in each frame     (2nd byte)
        }else MIDI.timeDivision  = (timeDivisionByte1 * 256) + timeDivisionByte2;// else... ticks per beat MODE  (2 bytes value)

        //  ** read TRACK CHUNK
        for(let t=1; t <= MIDI.tracks; t++){
            MIDI.track[t-1]     = {event: []};                                  // create new Track entry in Array
            let headerValidation = file.readInt(4);
            if ( headerValidation === -1 ) break;                               // EOF
            if(headerValidation !== 0x4D54726B) return false;                   // Track chunk header validation failed.
            file.readInt(4);                                                    // move pointer. get chunk size (bytes length)
            let e               = 0;                                            // init event counter
            let endOfTrack      = false;                                        // FLAG for track reading secuence breaking
            // ** read EVENT CHUNK
            let statusByte;
            let laststatusByte;
            while(!endOfTrack){
                e++;                                                            // increase by 1 event counter
                MIDI.track[t-1].event[e-1] = {};                                // create new event object, in events array
                MIDI.track[t-1].event[e-1].deltaTime  = file.readIntVLV();      // get DELTA TIME OF MIDI event (Variable Length Value)
                statusByte = file.readInt(1);                                   // read EVENT TYPE (STATUS BYTE)
                if(statusByte === -1) break;                                    // EOF
                else if(statusByte >= 128) laststatusByte = statusByte;         // NEW STATUS BYTE DETECTED
                else{                                                           // 'RUNNING STATUS' situation detected
                    statusByte = laststatusByte;                                // apply last loop, Status Byte
                    file.movePointer(-1);                                       // move back the pointer (cause readed byte is not status byte)
                }


                //
                // ** IS META EVENT
                //
                if(statusByte === 0xFF){                                        // Meta Event type
                    MIDI.track[t-1].event[e-1].type = 0xFF;                     // assign metaEvent code to array
                    MIDI.track[t-1].event[e-1].metaType =  file.readInt(1);     // assign metaEvent subtype
                    let metaEventLength = file.readIntVLV();                    // get the metaEvent length
                    switch(MIDI.track[t-1].event[e-1].metaType){
                        case 0x2F:                                              // end of track, has no data byte
                        case -1:                                                // EOF
                            endOfTrack = true;                                  // change FLAG to force track reading loop breaking
                            break;
                        case 0x01:                                              // Text Event
                        case 0x02:                                              // Copyright Notice
                        case 0x03:                                              // Sequence/Track Name (documentation: http://www.ta7.de/txt/musik/musi0006.htm)
                        case 0x06:                                              // Marker
                            MIDI.track[t-1].event[e-1].data = file.readStr(metaEventLength);
                            break;
                        case 0x21:                                              // MIDI PORT
                        case 0x59:                                              // Key Signature
                        case 0x51:                                              // Set Tempo
                            MIDI.track[t-1].event[e-1].data = file.readInt(metaEventLength);
                            break;
                        case 0x54:                                              // SMPTE Offset
                            MIDI.track[t-1].event[e-1].data    = [];            
                            MIDI.track[t-1].event[e-1].data[0] = file.readInt(1);
                            MIDI.track[t-1].event[e-1].data[1] = file.readInt(1);
                            MIDI.track[t-1].event[e-1].data[2] = file.readInt(1);
                            MIDI.track[t-1].event[e-1].data[3] = file.readInt(1);  
                            MIDI.track[t-1].event[e-1].data[4] = file.readInt(1);
                            break;
                        case 0x58:                                              // Time Signature
                            MIDI.track[t-1].event[e-1].data    = [];
                            MIDI.track[t-1].event[e-1].data[0] = file.readInt(1);
                            MIDI.track[t-1].event[e-1].data[1] = file.readInt(1);
                            MIDI.track[t-1].event[e-1].data[2] = file.readInt(1);
                            MIDI.track[t-1].event[e-1].data[3] = file.readInt(1);
                            break;
                        default :
                            // if user provided a custom interpreter, call it
                            // and assign to event the returned data
                            if( this.customInterpreter !== null){
                                MIDI.track[t-1].event[e-1].data = this.customInterpreter( MIDI.track[t-1].event[e-1].metaType, file, metaEventLength);
                            }
                            // if no customInterpretr is provided, or returned
                            // false (=apply default), perform default action
                            if(this.customInterpreter === null || MIDI.track[t-1].event[e-1].data === false){
                                file.readInt(metaEventLength);
                                MIDI.track[t-1].event[e-1].data = file.readInt(metaEventLength);
                                if (this.debug) console.info('Unimplemented 0xFF meta event! data block readed as Integer');
                            }
                    }
                }

                //
                // IS REGULAR EVENT
                //
                else{                                                          // MIDI Control Events OR System Exclusive Events
                    statusByte = statusByte.toString(16).split('');             // split the status byte HEX representation, to obtain 4 bits values
                    if(!statusByte[1]) statusByte.unshift('0');                 // force 2 digits
                    MIDI.track[t-1].event[e-1].type = parseInt(statusByte[0], 16);// first byte is EVENT TYPE ID
                    MIDI.track[t-1].event[e-1].channel = parseInt(statusByte[1], 16);// second byte is channel
                    switch(MIDI.track[t-1].event[e-1].type){
                        case 0xF:{                                               // System Exclusive Events

                            // if user provided a custom interpreter, call it
                            // and assign to event the returned data
                            if( this.customInterpreter !== null){
                                MIDI.track[t-1].event[e-1].data = this.customInterpreter( MIDI.track[t-1].event[e-1].type, file , false);
                            }

                            // if no customInterpretr is provided, or returned
                            // false (=apply default), perform default action
                            if(this.customInterpreter === null || MIDI.track[t-1].event[e-1].data === false){
                                let event_length = file.readIntVLV();
                                MIDI.track[t-1].event[e-1].data = file.readInt(event_length);
                                if (this.debug) console.info('Unimplemented 0xF exclusive events! data block readed as Integer');
                            }
                            break;
                        }
                        case 0xA:                                               // Note Aftertouch
                        case 0xB:                                               // Controller
                        case 0xE:                                               // Pitch Bend Event
                        case 0x8:                                               // Note off
                        case 0x9:                                               // Note On
                            MIDI.track[t-1].event[e-1].data = [];
                            MIDI.track[t-1].event[e-1].data[0] = file.readInt(1);
                            MIDI.track[t-1].event[e-1].data[1] = file.readInt(1);
                            break;
                        case 0xC:                                               // Program Change
                        case 0xD:                                               // Channel Aftertouch
                            MIDI.track[t-1].event[e-1].data = file.readInt(1);
                            break;
                        case -1:                                                // EOF
                            endOfTrack = true;                                  // change FLAG to force track reading loop breaking
                            break;
                        default:
                            // if user provided a custom interpreter, call it
                            // and assign to event the returned data
                            if( this.customInterpreter !== null){
                                MIDI.track[t-1].event[e-1].data = this.customInterpreter( MIDI.track[t-1].event[e-1].metaType, file , false);
                            }

                            // if no customInterpretr is provided, or returned
                            // false (=apply default), perform default action
                            if(this.customInterpreter === null || MIDI.track[t-1].event[e-1].data === false){
                                console.log('Unknown EVENT detected... reading cancelled!');
                                return false;
                            }
                    }
                }
            }
        }
        return MIDI;
    },

    // custom function t handle unimp,emented, or custom midi messages.If message
    // is a metaevent, the value of metaEventLength will be >0.
    // Function must return the value to store, and pointer of dataView incresed
    // If default action wants to be performed, return false
    customInterpreter : null // function( e_type , arrayByffer, metaEventLength){ return e_data_int }
};


if(typeof module !== 'undefined') module.exports = MIDIParser;

function MidiToChordMap() {
	this.chordsMap = new Map();
	this.keysMap = new Map();
}

MidiToChordMap.prototype.parse = function(domFileInput, callback) {
	const file = domFileInput.files[0];
	let reader = new FileReader();
	let thisObj = this;

	reader.onload = function(e) {
		let uint8array = new Uint8Array(e.target.result);
		// let hexArray = [];
		// uint8array.forEach(element => {
		// 	hexArray.push(ConvertBase.dec2hex(element));
		// });
		// console.log('hexArray', hexArray);
		let parsed = MIDIParser.parse(uint8array),
			oneTrack = [],
			sortedOneTrk = [],
			currNotes = [],
			prevTime = -1,
			eventTime = -1;

		parsed.track.forEach(track => {
			let currDeltaTime = 0;

			track.event.forEach(event => {
				currDeltaTime += event.deltaTime;

				oneTrack.push({ 'event': event, 'time': currDeltaTime});
			});
		});

		//console.log(oneTrack.sort((a,b) => a.time - b.time).sort((a,b) => a.event.type - b.event.type));
		sortedOneTrk = oneTrack.sort((a,b) => (a.time + a.event.type) - (b.time + b.event.type));	

		sortedOneTrk.forEach(oneTrEvent => {
			let ev = oneTrEvent.event;
			let type = ev.type;
			if(type === 9 || type === 8) {
				let note = ev.data[0] % 12;
				let velocity = ev.data[1];
				eventTime = oneTrEvent.time;
				
				if(prevTime === -1)
					prevTime = eventTime;

				if(prevTime != eventTime && currNotes.length != 0) {
					let notesArray = Array.from(new Set(currNotes));
					let keys = [];

					for(let i=1; i<=3; i++) {
						let gen = subsets(notesArray, i);
						for(let sub of gen) {
							let subArray = Array.from(sub);
							//console.log('subArray',subArray);
							let key = keyFromPtArray(subArray);
							keys.push(key);
						}
					}
					//let sorted = notesArray.sort((a, b) => a - b);

					thisObj.chordsMap.set(eventTime, notesArray);
					
					thisObj.keysMap.set(eventTime, keys);
				}
				if(type === 8 || (type === 9 && velocity === 0)) {
					currNotes.splice(currNotes.indexOf(note), 1);

				} else if(type === 9 && velocity > 0) {
					currNotes.push(note);
				} 
			}
			prevTime = eventTime;
		});

		callback();
	} 

	reader.readAsArrayBuffer(file); 
}


function testpy() {
	var result = document.getElementById('result'),
        sent_txt = document.getElementById('txt-input').value;

    ws.send(sent_txt);

    ws.onmessage = function (event) {
        result.innerHTML = event.data;

        /*var messages = document.getElementsByTagName('ul')[0],
            message = document.createElement('li'),
            content = document.createTextNode(event.data);
        message.appendChild(content);
        messages.appendChild(message);*/

    };
    document.getElementById('python-test').appendChild(result);
}
/*function midiToPy() {
	var inputElem = document.querySelector('#file-input');
	var file = inputElem.files[0];
	var reader = new FileReader();

	reader.onload = function(evt) {
		ws.send(evt.target.result);
	}

	reader.readAsDataURL(file);


}

ws.onmessage = function(event) {
	console.log('parsing json...');
	var inputChords = JSON.parse(event.data);
	console.log('json parsed');
	console.log('creating chords');
	for(var iChord in inputChords) {
		var chord = new Chord(inputChords[iChord]);
		chords.push(chord);
	}
	console.log('chords created');

	drawChords(5, 6);
}*/
function Slider(domElem, allMeshes, chordsMap) {
	const slider = document.getElementById('slider');
	let timesArray = Array.from(chordsMap.keys()).sort((a, b) => a - b);
	let lowBound = timesArray[0];
	let upBound = timesArray[timesArray.length - 1];
	let up = upBound;
	let low = lowBound;

	console.log('chordsMap', chordsMap);
	console.log('upBound', upBound);
	console.log('lowBound', lowBound);

	if(slider.noUiSlider != null)
		slider.noUiSlider.destroy();

	noUiSlider.create(slider, {
		start: [ 0, 500 ],
		connect: true,
		step: 1,
		tooltips: [ true, true ],
		range: {
			'min': lowBound,
			'max': upBound
		},
		format: wNumb({
			decimals: 0
		})
	});

	console.log(chordsMap);

	slider.noUiSlider.on('update', function(values, handle) {
		let value = values[handle];
		if(handle === 1) {
			up = parseInt(value);
		} else {
			low = parseInt(value);
		}

		for(let mesh of allMeshes.meshById.values()) {
			mesh.visible = false;
		}
		
		for(let i=low; i<up; i++) {
			if(chordsMap.has(i)) {
				//allMeshes.showFromPtsArray(chordsMap.get(i), true);
				let keys = chordsMap.get(i);
				for(let key of keys) {
					allMeshes.showFromKey(key, true);
				}
				
			}
		}

		// for(let mesh of allMeshes.meshById.values()){
		// 	mesh.visible = true;
		// }
	});


	
}
/*! nouislider - 11.1.0 - 2018-04-02 11:18:13 */

!function(a){"function"==typeof define&&define.amd?define([],a):"object"==typeof exports?module.exports=a():window.noUiSlider=a()}(function(){"use strict";function a(a){return"object"==typeof a&&"function"==typeof a.to&&"function"==typeof a.from}function b(a){a.parentElement.removeChild(a)}function c(a){return null!==a&&void 0!==a}function d(a){a.preventDefault()}function e(a){return a.filter(function(a){return!this[a]&&(this[a]=!0)},{})}function f(a,b){return Math.round(a/b)*b}function g(a,b){var c=a.getBoundingClientRect(),d=a.ownerDocument,e=d.documentElement,f=p(d);return/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(f.x=0),b?c.top+f.y-e.clientTop:c.left+f.x-e.clientLeft}function h(a){return"number"==typeof a&&!isNaN(a)&&isFinite(a)}function i(a,b,c){c>0&&(m(a,b),setTimeout(function(){n(a,b)},c))}function j(a){return Math.max(Math.min(a,100),0)}function k(a){return Array.isArray(a)?a:[a]}function l(a){a=String(a);var b=a.split(".");return b.length>1?b[1].length:0}function m(a,b){a.classList?a.classList.add(b):a.className+=" "+b}function n(a,b){a.classList?a.classList.remove(b):a.className=a.className.replace(new RegExp("(^|\\b)"+b.split(" ").join("|")+"(\\b|$)","gi")," ")}function o(a,b){return a.classList?a.classList.contains(b):new RegExp("\\b"+b+"\\b").test(a.className)}function p(a){var b=void 0!==window.pageXOffset,c="CSS1Compat"===(a.compatMode||"");return{x:b?window.pageXOffset:c?a.documentElement.scrollLeft:a.body.scrollLeft,y:b?window.pageYOffset:c?a.documentElement.scrollTop:a.body.scrollTop}}function q(){return window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"}}function r(){var a=!1;try{var b=Object.defineProperty({},"passive",{get:function(){a=!0}});window.addEventListener("test",null,b)}catch(a){}return a}function s(){return window.CSS&&CSS.supports&&CSS.supports("touch-action","none")}function t(a,b){return 100/(b-a)}function u(a,b){return 100*b/(a[1]-a[0])}function v(a,b){return u(a,a[0]<0?b+Math.abs(a[0]):b-a[0])}function w(a,b){return b*(a[1]-a[0])/100+a[0]}function x(a,b){for(var c=1;a>=b[c];)c+=1;return c}function y(a,b,c){if(c>=a.slice(-1)[0])return 100;var d=x(c,a),e=a[d-1],f=a[d],g=b[d-1],h=b[d];return g+v([e,f],c)/t(g,h)}function z(a,b,c){if(c>=100)return a.slice(-1)[0];var d=x(c,b),e=a[d-1],f=a[d],g=b[d-1];return w([e,f],(c-g)*t(g,b[d]))}function A(a,b,c,d){if(100===d)return d;var e=x(d,a),g=a[e-1],h=a[e];return c?d-g>(h-g)/2?h:g:b[e-1]?a[e-1]+f(d-a[e-1],b[e-1]):d}function B(a,b,c){var d;if("number"==typeof b&&(b=[b]),!Array.isArray(b))throw new Error("noUiSlider ("+$+"): 'range' contains invalid value.");if(d="min"===a?0:"max"===a?100:parseFloat(a),!h(d)||!h(b[0]))throw new Error("noUiSlider ("+$+"): 'range' value isn't numeric.");c.xPct.push(d),c.xVal.push(b[0]),d?c.xSteps.push(!isNaN(b[1])&&b[1]):isNaN(b[1])||(c.xSteps[0]=b[1]),c.xHighestCompleteStep.push(0)}function C(a,b,c){if(!b)return!0;c.xSteps[a]=u([c.xVal[a],c.xVal[a+1]],b)/t(c.xPct[a],c.xPct[a+1]);var d=(c.xVal[a+1]-c.xVal[a])/c.xNumSteps[a],e=Math.ceil(Number(d.toFixed(3))-1),f=c.xVal[a]+c.xNumSteps[a]*e;c.xHighestCompleteStep[a]=f}function D(a,b,c){this.xPct=[],this.xVal=[],this.xSteps=[c||!1],this.xNumSteps=[!1],this.xHighestCompleteStep=[],this.snap=b;var d,e=[];for(d in a)a.hasOwnProperty(d)&&e.push([a[d],d]);for(e.length&&"object"==typeof e[0][0]?e.sort(function(a,b){return a[0][0]-b[0][0]}):e.sort(function(a,b){return a[0]-b[0]}),d=0;d<e.length;d++)B(e[d][1],e[d][0],this);for(this.xNumSteps=this.xSteps.slice(0),d=0;d<this.xNumSteps.length;d++)C(d,this.xNumSteps[d],this)}function E(b){if(a(b))return!0;throw new Error("noUiSlider ("+$+"): 'format' requires 'to' and 'from' methods.")}function F(a,b){if(!h(b))throw new Error("noUiSlider ("+$+"): 'step' is not numeric.");a.singleStep=b}function G(a,b){if("object"!=typeof b||Array.isArray(b))throw new Error("noUiSlider ("+$+"): 'range' is not an object.");if(void 0===b.min||void 0===b.max)throw new Error("noUiSlider ("+$+"): Missing 'min' or 'max' in 'range'.");if(b.min===b.max)throw new Error("noUiSlider ("+$+"): 'range' 'min' and 'max' cannot be equal.");a.spectrum=new D(b,a.snap,a.singleStep)}function H(a,b){if(b=k(b),!Array.isArray(b)||!b.length)throw new Error("noUiSlider ("+$+"): 'start' option is incorrect.");a.handles=b.length,a.start=b}function I(a,b){if(a.snap=b,"boolean"!=typeof b)throw new Error("noUiSlider ("+$+"): 'snap' option must be a boolean.")}function J(a,b){if(a.animate=b,"boolean"!=typeof b)throw new Error("noUiSlider ("+$+"): 'animate' option must be a boolean.")}function K(a,b){if(a.animationDuration=b,"number"!=typeof b)throw new Error("noUiSlider ("+$+"): 'animationDuration' option must be a number.")}function L(a,b){var c,d=[!1];if("lower"===b?b=[!0,!1]:"upper"===b&&(b=[!1,!0]),!0===b||!1===b){for(c=1;c<a.handles;c++)d.push(b);d.push(!1)}else{if(!Array.isArray(b)||!b.length||b.length!==a.handles+1)throw new Error("noUiSlider ("+$+"): 'connect' option doesn't match handle count.");d=b}a.connect=d}function M(a,b){switch(b){case"horizontal":a.ort=0;break;case"vertical":a.ort=1;break;default:throw new Error("noUiSlider ("+$+"): 'orientation' option is invalid.")}}function N(a,b){if(!h(b))throw new Error("noUiSlider ("+$+"): 'margin' option must be numeric.");if(0!==b&&(a.margin=a.spectrum.getMargin(b),!a.margin))throw new Error("noUiSlider ("+$+"): 'margin' option is only supported on linear sliders.")}function O(a,b){if(!h(b))throw new Error("noUiSlider ("+$+"): 'limit' option must be numeric.");if(a.limit=a.spectrum.getMargin(b),!a.limit||a.handles<2)throw new Error("noUiSlider ("+$+"): 'limit' option is only supported on linear sliders with 2 or more handles.")}function P(a,b){if(!h(b)&&!Array.isArray(b))throw new Error("noUiSlider ("+$+"): 'padding' option must be numeric or array of exactly 2 numbers.");if(Array.isArray(b)&&2!==b.length&&!h(b[0])&&!h(b[1]))throw new Error("noUiSlider ("+$+"): 'padding' option must be numeric or array of exactly 2 numbers.");if(0!==b){if(Array.isArray(b)||(b=[b,b]),a.padding=[a.spectrum.getMargin(b[0]),a.spectrum.getMargin(b[1])],!1===a.padding[0]||!1===a.padding[1])throw new Error("noUiSlider ("+$+"): 'padding' option is only supported on linear sliders.");if(a.padding[0]<0||a.padding[1]<0)throw new Error("noUiSlider ("+$+"): 'padding' option must be a positive number(s).");if(a.padding[0]+a.padding[1]>=100)throw new Error("noUiSlider ("+$+"): 'padding' option must not exceed 100% of the range.")}}function Q(a,b){switch(b){case"ltr":a.dir=0;break;case"rtl":a.dir=1;break;default:throw new Error("noUiSlider ("+$+"): 'direction' option was not recognized.")}}function R(a,b){if("string"!=typeof b)throw new Error("noUiSlider ("+$+"): 'behaviour' must be a string containing options.");var c=b.indexOf("tap")>=0,d=b.indexOf("drag")>=0,e=b.indexOf("fixed")>=0,f=b.indexOf("snap")>=0,g=b.indexOf("hover")>=0;if(e){if(2!==a.handles)throw new Error("noUiSlider ("+$+"): 'fixed' behaviour must be used with 2 handles");N(a,a.start[1]-a.start[0])}a.events={tap:c||f,drag:d,fixed:e,snap:f,hover:g}}function S(a,b){if(!1!==b)if(!0===b){a.tooltips=[];for(var c=0;c<a.handles;c++)a.tooltips.push(!0)}else{if(a.tooltips=k(b),a.tooltips.length!==a.handles)throw new Error("noUiSlider ("+$+"): must pass a formatter for all handles.");a.tooltips.forEach(function(a){if("boolean"!=typeof a&&("object"!=typeof a||"function"!=typeof a.to))throw new Error("noUiSlider ("+$+"): 'tooltips' must be passed a formatter or 'false'.")})}}function T(a,b){a.ariaFormat=b,E(b)}function U(a,b){a.format=b,E(b)}function V(a,b){if("string"!=typeof b&&!1!==b)throw new Error("noUiSlider ("+$+"): 'cssPrefix' must be a string or `false`.");a.cssPrefix=b}function W(a,b){if("object"!=typeof b)throw new Error("noUiSlider ("+$+"): 'cssClasses' must be an object.");if("string"==typeof a.cssPrefix){a.cssClasses={};for(var c in b)b.hasOwnProperty(c)&&(a.cssClasses[c]=a.cssPrefix+b[c])}else a.cssClasses=b}function X(a){var b={margin:0,limit:0,padding:0,animate:!0,animationDuration:300,ariaFormat:_,format:_},d={step:{r:!1,t:F},start:{r:!0,t:H},connect:{r:!0,t:L},direction:{r:!0,t:Q},snap:{r:!1,t:I},animate:{r:!1,t:J},animationDuration:{r:!1,t:K},range:{r:!0,t:G},orientation:{r:!1,t:M},margin:{r:!1,t:N},limit:{r:!1,t:O},padding:{r:!1,t:P},behaviour:{r:!0,t:R},ariaFormat:{r:!1,t:T},format:{r:!1,t:U},tooltips:{r:!1,t:S},cssPrefix:{r:!0,t:V},cssClasses:{r:!0,t:W}},e={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal",cssPrefix:"noUi-",cssClasses:{target:"target",base:"base",origin:"origin",handle:"handle",handleLower:"handle-lower",handleUpper:"handle-upper",horizontal:"horizontal",vertical:"vertical",background:"background",connect:"connect",connects:"connects",ltr:"ltr",rtl:"rtl",draggable:"draggable",drag:"state-drag",tap:"state-tap",active:"active",tooltip:"tooltip",pips:"pips",pipsHorizontal:"pips-horizontal",pipsVertical:"pips-vertical",marker:"marker",markerHorizontal:"marker-horizontal",markerVertical:"marker-vertical",markerNormal:"marker-normal",markerLarge:"marker-large",markerSub:"marker-sub",value:"value",valueHorizontal:"value-horizontal",valueVertical:"value-vertical",valueNormal:"value-normal",valueLarge:"value-large",valueSub:"value-sub"}};a.format&&!a.ariaFormat&&(a.ariaFormat=a.format),Object.keys(d).forEach(function(f){if(!c(a[f])&&void 0===e[f]){if(d[f].r)throw new Error("noUiSlider ("+$+"): '"+f+"' is required.");return!0}d[f].t(b,c(a[f])?a[f]:e[f])}),b.pips=a.pips;var f=document.createElement("div"),g=void 0!==f.style.msTransform,h=void 0!==f.style.transform;b.transformRule=h?"transform":g?"msTransform":"webkitTransform";var i=[["left","top"],["right","bottom"]];return b.style=i[b.dir][b.ort],b}function Y(a,c,f){function h(a,b){var c=ya.createElement("div");return b&&m(c,b),a.appendChild(c),c}function l(a,b){var d=h(a,c.cssClasses.origin),e=h(d,c.cssClasses.handle);return e.setAttribute("data-handle",b),e.setAttribute("tabindex","0"),e.setAttribute("role","slider"),e.setAttribute("aria-orientation",c.ort?"vertical":"horizontal"),0===b?m(e,c.cssClasses.handleLower):b===c.handles-1&&m(e,c.cssClasses.handleUpper),d}function t(a,b){return!!b&&h(a,c.cssClasses.connect)}function u(a,b){var d=h(b,c.cssClasses.connects);ka=[],la=[],la.push(t(d,a[0]));for(var e=0;e<c.handles;e++)ka.push(l(b,e)),ta[e]=e,la.push(t(d,a[e+1]))}function v(a){m(a,c.cssClasses.target),0===c.dir?m(a,c.cssClasses.ltr):m(a,c.cssClasses.rtl),0===c.ort?m(a,c.cssClasses.horizontal):m(a,c.cssClasses.vertical),ja=h(a,c.cssClasses.base)}function w(a,b){return!!c.tooltips[b]&&h(a.firstChild,c.cssClasses.tooltip)}function x(){var a=ka.map(w);Q("update",function(b,d,e){if(a[d]){var f=b[d];!0!==c.tooltips[d]&&(f=c.tooltips[d].to(e[d])),a[d].innerHTML=f}})}function y(){Q("update",function(a,b,d,e,f){ta.forEach(function(a){var b=ka[a],e=U(sa,a,0,!0,!0,!0),g=U(sa,a,100,!0,!0,!0),h=f[a],i=c.ariaFormat.to(d[a]);b.children[0].setAttribute("aria-valuemin",e.toFixed(1)),b.children[0].setAttribute("aria-valuemax",g.toFixed(1)),b.children[0].setAttribute("aria-valuenow",h.toFixed(1)),b.children[0].setAttribute("aria-valuetext",i)})})}function z(a,b,c){if("range"===a||"steps"===a)return va.xVal;if("count"===a){if(b<2)throw new Error("noUiSlider ("+$+"): 'values' (>= 2) required for mode 'count'.");var d=b-1,e=100/d;for(b=[];d--;)b[d]=d*e;b.push(100),a="positions"}return"positions"===a?b.map(function(a){return va.fromStepping(c?va.getStep(a):a)}):"values"===a?c?b.map(function(a){return va.fromStepping(va.getStep(va.toStepping(a)))}):b:void 0}function A(a,b,c){function d(a,b){return(a+b).toFixed(7)/1}var f={},g=va.xVal[0],h=va.xVal[va.xVal.length-1],i=!1,j=!1,k=0;return c=e(c.slice().sort(function(a,b){return a-b})),c[0]!==g&&(c.unshift(g),i=!0),c[c.length-1]!==h&&(c.push(h),j=!0),c.forEach(function(e,g){var h,l,m,n,o,p,q,r,s,t,u=e,v=c[g+1];if("steps"===b&&(h=va.xNumSteps[g]),h||(h=v-u),!1!==u&&void 0!==v)for(h=Math.max(h,1e-7),l=u;l<=v;l=d(l,h)){for(n=va.toStepping(l),o=n-k,r=o/a,s=Math.round(r),t=o/s,m=1;m<=s;m+=1)p=k+m*t,f[p.toFixed(5)]=["x",0];q=c.indexOf(l)>-1?1:"steps"===b?2:0,!g&&i&&(q=0),l===v&&j||(f[n.toFixed(5)]=[l,q]),k=n}}),f}function B(a,b,d){function e(a,b){var d=b===c.cssClasses.value,e=d?k:l,f=d?i:j;return b+" "+e[c.ort]+" "+f[a]}function f(a,f){f[1]=f[1]&&b?b(f[0],f[1]):f[1];var i=h(g,!1);i.className=e(f[1],c.cssClasses.marker),i.style[c.style]=a+"%",f[1]&&(i=h(g,!1),i.className=e(f[1],c.cssClasses.value),i.setAttribute("data-value",f[0]),i.style[c.style]=a+"%",i.innerText=d.to(f[0]))}var g=ya.createElement("div"),i=[c.cssClasses.valueNormal,c.cssClasses.valueLarge,c.cssClasses.valueSub],j=[c.cssClasses.markerNormal,c.cssClasses.markerLarge,c.cssClasses.markerSub],k=[c.cssClasses.valueHorizontal,c.cssClasses.valueVertical],l=[c.cssClasses.markerHorizontal,c.cssClasses.markerVertical];return m(g,c.cssClasses.pips),m(g,0===c.ort?c.cssClasses.pipsHorizontal:c.cssClasses.pipsVertical),Object.keys(a).forEach(function(b){f(b,a[b])}),g}function C(){na&&(b(na),na=null)}function D(a){C();var b=a.mode,c=a.density||1,d=a.filter||!1,e=a.values||!1,f=a.stepped||!1,g=z(b,e,f),h=A(c,b,g),i=a.format||{to:Math.round};return na=ra.appendChild(B(h,d,i))}function E(){var a=ja.getBoundingClientRect(),b="offset"+["Width","Height"][c.ort];return 0===c.ort?a.width||ja[b]:a.height||ja[b]}function F(a,b,d,e){var f=function(f){return!!(f=G(f,e.pageOffset,e.target||b))&&(!(ra.hasAttribute("disabled")&&!e.doNotReject)&&(!(o(ra,c.cssClasses.tap)&&!e.doNotReject)&&(!(a===oa.start&&void 0!==f.buttons&&f.buttons>1)&&((!e.hover||!f.buttons)&&(qa||f.preventDefault(),f.calcPoint=f.points[c.ort],void d(f,e))))))},g=[];return a.split(" ").forEach(function(a){b.addEventListener(a,f,!!qa&&{passive:!0}),g.push([a,f])}),g}function G(a,b,c){var d,e,f=0===a.type.indexOf("touch"),g=0===a.type.indexOf("mouse"),h=0===a.type.indexOf("pointer");if(0===a.type.indexOf("MSPointer")&&(h=!0),f){var i=function(a){return a.target===c||c.contains(a.target)};if("touchstart"===a.type){var j=Array.prototype.filter.call(a.touches,i);if(j.length>1)return!1;d=j[0].pageX,e=j[0].pageY}else{var k=Array.prototype.find.call(a.changedTouches,i);if(!k)return!1;d=k.pageX,e=k.pageY}}return b=b||p(ya),(g||h)&&(d=a.clientX+b.x,e=a.clientY+b.y),a.pageOffset=b,a.points=[d,e],a.cursor=g||h,a}function H(a){var b=a-g(ja,c.ort),d=100*b/E();return d=j(d),c.dir?100-d:d}function I(a){var b=100,c=!1;return ka.forEach(function(d,e){if(!d.hasAttribute("disabled")){var f=Math.abs(sa[e]-a);(f<b||100===f&&100===b)&&(c=e,b=f)}}),c}function J(a,b){"mouseout"===a.type&&"HTML"===a.target.nodeName&&null===a.relatedTarget&&L(a,b)}function K(a,b){if(-1===navigator.appVersion.indexOf("MSIE 9")&&0===a.buttons&&0!==b.buttonsProperty)return L(a,b);var d=(c.dir?-1:1)*(a.calcPoint-b.startCalcPoint);W(d>0,100*d/b.baseSize,b.locations,b.handleNumbers)}function L(a,b){b.handle&&(n(b.handle,c.cssClasses.active),ua-=1),b.listeners.forEach(function(a){za.removeEventListener(a[0],a[1])}),0===ua&&(n(ra,c.cssClasses.drag),_(),a.cursor&&(Aa.style.cursor="",Aa.removeEventListener("selectstart",d))),b.handleNumbers.forEach(function(a){S("change",a),S("set",a),S("end",a)})}function M(a,b){var e;if(1===b.handleNumbers.length){var f=ka[b.handleNumbers[0]];if(f.hasAttribute("disabled"))return!1;e=f.children[0],ua+=1,m(e,c.cssClasses.active)}a.stopPropagation();var g=[],h=F(oa.move,za,K,{target:a.target,handle:e,listeners:g,startCalcPoint:a.calcPoint,baseSize:E(),pageOffset:a.pageOffset,handleNumbers:b.handleNumbers,buttonsProperty:a.buttons,locations:sa.slice()}),i=F(oa.end,za,L,{target:a.target,handle:e,listeners:g,doNotReject:!0,handleNumbers:b.handleNumbers}),j=F("mouseout",za,J,{target:a.target,handle:e,listeners:g,doNotReject:!0,handleNumbers:b.handleNumbers});g.push.apply(g,h.concat(i,j)),a.cursor&&(Aa.style.cursor=getComputedStyle(a.target).cursor,ka.length>1&&m(ra,c.cssClasses.drag),Aa.addEventListener("selectstart",d,!1)),b.handleNumbers.forEach(function(a){S("start",a)})}function N(a){a.stopPropagation();var b=H(a.calcPoint),d=I(b);if(!1===d)return!1;c.events.snap||i(ra,c.cssClasses.tap,c.animationDuration),aa(d,b,!0,!0),_(),S("slide",d,!0),S("update",d,!0),S("change",d,!0),S("set",d,!0),c.events.snap&&M(a,{handleNumbers:[d]})}function O(a){var b=H(a.calcPoint),c=va.getStep(b),d=va.fromStepping(c);Object.keys(xa).forEach(function(a){"hover"===a.split(".")[0]&&xa[a].forEach(function(a){a.call(ma,d)})})}function P(a){a.fixed||ka.forEach(function(a,b){F(oa.start,a.children[0],M,{handleNumbers:[b]})}),a.tap&&F(oa.start,ja,N,{}),a.hover&&F(oa.move,ja,O,{hover:!0}),a.drag&&la.forEach(function(b,d){if(!1!==b&&0!==d&&d!==la.length-1){var e=ka[d-1],f=ka[d],g=[b];m(b,c.cssClasses.draggable),a.fixed&&(g.push(e.children[0]),g.push(f.children[0])),g.forEach(function(a){F(oa.start,a,M,{handles:[e,f],handleNumbers:[d-1,d]})})}})}function Q(a,b){xa[a]=xa[a]||[],xa[a].push(b),"update"===a.split(".")[0]&&ka.forEach(function(a,b){S("update",b)})}function R(a){var b=a&&a.split(".")[0],c=b&&a.substring(b.length);Object.keys(xa).forEach(function(a){var d=a.split(".")[0],e=a.substring(d.length);b&&b!==d||c&&c!==e||delete xa[a]})}function S(a,b,d){Object.keys(xa).forEach(function(e){var f=e.split(".")[0];a===f&&xa[e].forEach(function(a){a.call(ma,wa.map(c.format.to),b,wa.slice(),d||!1,sa.slice())})})}function T(a){return a+"%"}function U(a,b,d,e,f,g){return ka.length>1&&(e&&b>0&&(d=Math.max(d,a[b-1]+c.margin)),f&&b<ka.length-1&&(d=Math.min(d,a[b+1]-c.margin))),ka.length>1&&c.limit&&(e&&b>0&&(d=Math.min(d,a[b-1]+c.limit)),f&&b<ka.length-1&&(d=Math.max(d,a[b+1]-c.limit))),c.padding&&(0===b&&(d=Math.max(d,c.padding[0])),b===ka.length-1&&(d=Math.min(d,100-c.padding[1]))),d=va.getStep(d),!((d=j(d))===a[b]&&!g)&&d}function V(a,b){var d=c.ort;return(d?b:a)+", "+(d?a:b)}function W(a,b,c,d){var e=c.slice(),f=[!a,a],g=[a,!a];d=d.slice(),a&&d.reverse(),d.length>1?d.forEach(function(a,c){var d=U(e,a,e[a]+b,f[c],g[c],!1);!1===d?b=0:(b=d-e[a],e[a]=d)}):f=g=[!0];var h=!1;d.forEach(function(a,d){h=aa(a,c[a]+b,f[d],g[d])||h}),h&&d.forEach(function(a){S("update",a),S("slide",a)})}function Y(a,b){return c.dir?100-a-b:a}function Z(a,b){sa[a]=b,wa[a]=va.fromStepping(b);var d="translate("+V(T(Y(b,0)-Ba),"0")+")";ka[a].style[c.transformRule]=d,ba(a),ba(a+1)}function _(){ta.forEach(function(a){var b=sa[a]>50?-1:1,c=3+(ka.length+b*a);ka[a].style.zIndex=c})}function aa(a,b,c,d){return!1!==(b=U(sa,a,b,c,d,!1))&&(Z(a,b),!0)}function ba(a){if(la[a]){var b=0,d=100;0!==a&&(b=sa[a-1]),a!==la.length-1&&(d=sa[a]);var e=d-b,f="translate("+V(T(Y(b,e)),"0")+")",g="scale("+V(e/100,"1")+")";la[a].style[c.transformRule]=f+" "+g}}function ca(a,b){return null===a||!1===a||void 0===a?sa[b]:("number"==typeof a&&(a=String(a)),a=c.format.from(a),a=va.toStepping(a),!1===a||isNaN(a)?sa[b]:a)}function da(a,b){var d=k(a),e=void 0===sa[0];b=void 0===b||!!b,c.animate&&!e&&i(ra,c.cssClasses.tap,c.animationDuration),ta.forEach(function(a){aa(a,ca(d[a],a),!0,!1)}),ta.forEach(function(a){aa(a,sa[a],!0,!0)}),_(),ta.forEach(function(a){S("update",a),null!==d[a]&&b&&S("set",a)})}function ea(a){da(c.start,a)}function fa(){var a=wa.map(c.format.to);return 1===a.length?a[0]:a}function ga(){for(var a in c.cssClasses)c.cssClasses.hasOwnProperty(a)&&n(ra,c.cssClasses[a]);for(;ra.firstChild;)ra.removeChild(ra.firstChild);delete ra.noUiSlider}function ha(){return sa.map(function(a,b){var c=va.getNearbySteps(a),d=wa[b],e=c.thisStep.step,f=null;!1!==e&&d+e>c.stepAfter.startValue&&(e=c.stepAfter.startValue-d),f=d>c.thisStep.startValue?c.thisStep.step:!1!==c.stepBefore.step&&d-c.stepBefore.highestStep,100===a?e=null:0===a&&(f=null);var g=va.countStepDecimals();return null!==e&&!1!==e&&(e=Number(e.toFixed(g))),null!==f&&!1!==f&&(f=Number(f.toFixed(g))),[f,e]})}function ia(a,b){var d=fa(),e=["margin","limit","padding","range","animate","snap","step","format"];e.forEach(function(b){void 0!==a[b]&&(f[b]=a[b])});var g=X(f);e.forEach(function(b){void 0!==a[b]&&(c[b]=g[b])}),va=g.spectrum,c.margin=g.margin,c.limit=g.limit,c.padding=g.padding,c.pips&&D(c.pips),sa=[],da(a.start||d,b)}var ja,ka,la,ma,na,oa=q(),pa=s(),qa=pa&&r(),ra=a,sa=[],ta=[],ua=0,va=c.spectrum,wa=[],xa={},ya=a.ownerDocument,za=ya.documentElement,Aa=ya.body,Ba="rtl"===ya.dir||1===c.ort?0:100;return v(ra),u(c.connect,ja),P(c.events),da(c.start),ma={destroy:ga,steps:ha,on:Q,off:R,get:fa,set:da,reset:ea,__moveHandles:function(a,b,c){W(a,b,sa,c)},options:f,updateOptions:ia,target:ra,removePips:C,pips:D},c.pips&&D(c.pips),c.tooltips&&x(),y(),ma}function Z(a,b){if(!a||!a.nodeName)throw new Error("noUiSlider ("+$+"): create requires a single element, got: "+a);if(a.noUiSlider)throw new Error("noUiSlider ("+$+"): Slider was already initialized.");var c=X(b,a),d=Y(a,c,b);return a.noUiSlider=d,d}var $="11.1.0";D.prototype.getMargin=function(a){var b=this.xNumSteps[0];if(b&&a/b%1!=0)throw new Error("noUiSlider ("+$+"): 'limit', 'margin' and 'padding' must be divisible by step.");return 2===this.xPct.length&&u(this.xVal,a)},D.prototype.toStepping=function(a){return a=y(this.xVal,this.xPct,a)},D.prototype.fromStepping=function(a){return z(this.xVal,this.xPct,a)},D.prototype.getStep=function(a){return a=A(this.xPct,this.xSteps,this.snap,a)},D.prototype.getNearbySteps=function(a){var b=x(a,this.xPct);return{stepBefore:{startValue:this.xVal[b-2],step:this.xNumSteps[b-2],highestStep:this.xHighestCompleteStep[b-2]},thisStep:{startValue:this.xVal[b-1],step:this.xNumSteps[b-1],highestStep:this.xHighestCompleteStep[b-1]},stepAfter:{startValue:this.xVal[b-0],step:this.xNumSteps[b-0],highestStep:this.xHighestCompleteStep[b-0]}}},D.prototype.countStepDecimals=function(){var a=this.xNumSteps.map(l);return Math.max.apply(null,a)},D.prototype.convert=function(a){return this.getStep(this.toStepping(a))};var _={to:function(a){return void 0!==a&&a.toFixed(2)},from:Number};return{version:$,create:Z}});
(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.wNumb = factory();
    }

}(function(){

	'use strict';

var FormatOptions = [
	'decimals',
	'thousand',
	'mark',
	'prefix',
	'suffix',
	'encoder',
	'decoder',
	'negativeBefore',
	'negative',
	'edit',
	'undo'
];

// General

	// Reverse a string
	function strReverse ( a ) {
		return a.split('').reverse().join('');
	}

	// Check if a string starts with a specified prefix.
	function strStartsWith ( input, match ) {
		return input.substring(0, match.length) === match;
	}

	// Check is a string ends in a specified suffix.
	function strEndsWith ( input, match ) {
		return input.slice(-1 * match.length) === match;
	}

	// Throw an error if formatting options are incompatible.
	function throwEqualError( F, a, b ) {
		if ( (F[a] || F[b]) && (F[a] === F[b]) ) {
			throw new Error(a);
		}
	}

	// Check if a number is finite and not NaN
	function isValidNumber ( input ) {
		return typeof input === 'number' && isFinite( input );
	}

	// Provide rounding-accurate toFixed method.
	// Borrowed: http://stackoverflow.com/a/21323330/775265
	function toFixed ( value, exp ) {
		value = value.toString().split('e');
		value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));
		value = value.toString().split('e');
		return (+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp))).toFixed(exp);
	}


// Formatting

	// Accept a number as input, output formatted string.
	function formatTo ( decimals, thousand, mark, prefix, suffix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

		var originalInput = input, inputIsNegative, inputPieces, inputBase, inputDecimals = '', output = '';

		// Apply user encoder to the input.
		// Expected outcome: number.
		if ( encoder ) {
			input = encoder(input);
		}

		// Stop if no valid number was provided, the number is infinite or NaN.
		if ( !isValidNumber(input) ) {
			return false;
		}

		// Rounding away decimals might cause a value of -0
		// when using very small ranges. Remove those cases.
		if ( decimals !== false && parseFloat(input.toFixed(decimals)) === 0 ) {
			input = 0;
		}

		// Formatting is done on absolute numbers,
		// decorated by an optional negative symbol.
		if ( input < 0 ) {
			inputIsNegative = true;
			input = Math.abs(input);
		}

		// Reduce the number of decimals to the specified option.
		if ( decimals !== false ) {
			input = toFixed( input, decimals );
		}

		// Transform the number into a string, so it can be split.
		input = input.toString();

		// Break the number on the decimal separator.
		if ( input.indexOf('.') !== -1 ) {
			inputPieces = input.split('.');

			inputBase = inputPieces[0];

			if ( mark ) {
				inputDecimals = mark + inputPieces[1];
			}

		} else {

		// If it isn't split, the entire number will do.
			inputBase = input;
		}

		// Group numbers in sets of three.
		if ( thousand ) {
			inputBase = strReverse(inputBase).match(/.{1,3}/g);
			inputBase = strReverse(inputBase.join( strReverse( thousand ) ));
		}

		// If the number is negative, prefix with negation symbol.
		if ( inputIsNegative && negativeBefore ) {
			output += negativeBefore;
		}

		// Prefix the number
		if ( prefix ) {
			output += prefix;
		}

		// Normal negative option comes after the prefix. Defaults to '-'.
		if ( inputIsNegative && negative ) {
			output += negative;
		}

		// Append the actual number.
		output += inputBase;
		output += inputDecimals;

		// Apply the suffix.
		if ( suffix ) {
			output += suffix;
		}

		// Run the output through a user-specified post-formatter.
		if ( edit ) {
			output = edit ( output, originalInput );
		}

		// All done.
		return output;
	}

	// Accept a sting as input, output decoded number.
	function formatFrom ( decimals, thousand, mark, prefix, suffix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

		var originalInput = input, inputIsNegative, output = '';

		// User defined pre-decoder. Result must be a non empty string.
		if ( undo ) {
			input = undo(input);
		}

		// Test the input. Can't be empty.
		if ( !input || typeof input !== 'string' ) {
			return false;
		}

		// If the string starts with the negativeBefore value: remove it.
		// Remember is was there, the number is negative.
		if ( negativeBefore && strStartsWith(input, negativeBefore) ) {
			input = input.replace(negativeBefore, '');
			inputIsNegative = true;
		}

		// Repeat the same procedure for the prefix.
		if ( prefix && strStartsWith(input, prefix) ) {
			input = input.replace(prefix, '');
		}

		// And again for negative.
		if ( negative && strStartsWith(input, negative) ) {
			input = input.replace(negative, '');
			inputIsNegative = true;
		}

		// Remove the suffix.
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
		if ( suffix && strEndsWith(input, suffix) ) {
			input = input.slice(0, -1 * suffix.length);
		}

		// Remove the thousand grouping.
		if ( thousand ) {
			input = input.split(thousand).join('');
		}

		// Set the decimal separator back to period.
		if ( mark ) {
			input = input.replace(mark, '.');
		}

		// Prepend the negative symbol.
		if ( inputIsNegative ) {
			output += '-';
		}

		// Add the number
		output += input;

		// Trim all non-numeric characters (allow '.' and '-');
		output = output.replace(/[^0-9\.\-.]/g, '');

		// The value contains no parse-able number.
		if ( output === '' ) {
			return false;
		}

		// Covert to number.
		output = Number(output);

		// Run the user-specified post-decoder.
		if ( decoder ) {
			output = decoder(output);
		}

		// Check is the output is valid, otherwise: return false.
		if ( !isValidNumber(output) ) {
			return false;
		}

		return output;
	}


// Framework

	// Validate formatting options
	function validate ( inputOptions ) {

		var i, optionName, optionValue,
			filteredOptions = {};

		if ( inputOptions['suffix'] === undefined ) {
			inputOptions['suffix'] = inputOptions['postfix'];
		}

		for ( i = 0; i < FormatOptions.length; i+=1 ) {

			optionName = FormatOptions[i];
			optionValue = inputOptions[optionName];

			if ( optionValue === undefined ) {

				// Only default if negativeBefore isn't set.
				if ( optionName === 'negative' && !filteredOptions.negativeBefore ) {
					filteredOptions[optionName] = '-';
				// Don't set a default for mark when 'thousand' is set.
				} else if ( optionName === 'mark' && filteredOptions.thousand !== '.' ) {
					filteredOptions[optionName] = '.';
				} else {
					filteredOptions[optionName] = false;
				}

			// Floating points in JS are stable up to 7 decimals.
			} else if ( optionName === 'decimals' ) {
				if ( optionValue >= 0 && optionValue < 8 ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}

			// These options, when provided, must be functions.
			} else if ( optionName === 'encoder' || optionName === 'decoder' || optionName === 'edit' || optionName === 'undo' ) {
				if ( typeof optionValue === 'function' ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}

			// Other options are strings.
			} else {

				if ( typeof optionValue === 'string' ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}
			}
		}

		// Some values can't be extracted from a
		// string if certain combinations are present.
		throwEqualError(filteredOptions, 'mark', 'thousand');
		throwEqualError(filteredOptions, 'prefix', 'negative');
		throwEqualError(filteredOptions, 'prefix', 'negativeBefore');

		return filteredOptions;
	}

	// Pass all options as function arguments
	function passAll ( options, method, input ) {
		var i, args = [];

		// Add all options in order of FormatOptions
		for ( i = 0; i < FormatOptions.length; i+=1 ) {
			args.push(options[FormatOptions[i]]);
		}

		// Append the input, then call the method, presenting all
		// options as arguments.
		args.push(input);
		return method.apply('', args);
	}

	function wNumb ( options ) {

		if ( !(this instanceof wNumb) ) {
			return new wNumb ( options );
		}

		if ( typeof options !== "object" ) {
			return;
		}

		options = validate(options);

		// Call 'formatTo' with proper arguments.
		this.to = function ( input ) {
			return passAll(options, formatTo, input);
		};

		// Call 'formatFrom' with proper arguments.
		this.from = function ( input ) {
			return passAll(options, formatFrom, input);
		};
	}

	return wNumb;

}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9uZVBvaW50LmpzIiwiVGhyZWVQb2ludHMuanMiLCJUd29Qb2ludHMuanMiLCJBbGxNZXNoZXMuanMiLCJBbGxQb2ludHMuanMiLCJDb21iaW5hdGlvbnMuanMiLCJHbG9iYWxMaWdodHMuanMiLCJNYXRlcmlhbHMuanMiLCJQb2x5Q3lsaW5kZXIuanMiLCJQb2x5TWVzaGVzLmpzIiwiUG9seVNwaGVyZS5qcyIsIlRleHRTcHJpdGUuanMiLCJUcmFuc3BNZXNoR3JwLmpzIiwiY2hvcmQuanMiLCJyZW5kZXIyLmpzIiwiYmFzZUNvbnZlcnRlci5qcyIsIm1pZGktcGFyc2VyLmpzIiwibWlkaVBhcnNlci5qcyIsInB5dGVzdC5qcyIsInNlbmRNaWRpVG9QeS5qcyIsInRpbWVsaW5lLmpzIiwibm91aXNsaWRlci5taW4uanMiLCJ3TnVtYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBPbmVQb2ludChwb2ludCwgc2NhbGUpIHtcclxuXHRsZXQgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHRsZXQgc3BoZXJlID0gbmV3IFRIUkVFLlNwaGVyZUJ1ZmZlckdlb21ldHJ5KDIsNTAsNTApO1xyXG5cdGxldCBzcGhlcmVNZXNoID0gbmV3IFRIUkVFLk1lc2goc3BoZXJlLCBSR0JNYXRlcmlhbCk7XHJcblx0bGV0IGxhYmVsID0gbWFrZVRleHRTcHJpdGUocG9pbnQpO1xyXG5cclxuXHRzcGhlcmVNZXNoLnBvc2l0aW9uLmNvcHkocG9pbnQuY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSkpO1xyXG5cclxuXHRncm91cC5hZGQoc3BoZXJlTWVzaCk7XHJcblx0Z3JvdXAuYWRkKGxhYmVsKTtcclxuXHRcclxuXHRyZXR1cm4gZ3JvdXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dPbmVQb2ludChpbmRleCkge1xyXG5cdHNwaGVyZXMuZ2V0KGluZGV4KS52aXNpYmxlID0gdHJ1ZTtcclxufSIsImZ1bmN0aW9uIFRocmVlUG9pbnRzKHBvaW50cywgc2NhbGUpIHtcclxuXHR0aGlzLmdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblx0bGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKCB7XHJcblx0XHRvcGFjaXR5OiAwLjIsXHJcblx0XHR0cmFuc3BhcmVudDogdHJ1ZSxcclxuXHRcdGRlcHRoV3JpdGU6IGZhbHNlLFxyXG5cdFx0c2lkZTogVEhSRUUuRG91YmxlU2lkZVxyXG5cdH0gKTtcclxuXHQvKnZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG5cdGZvcih2YXIgbm90ZSBpbiBub3Rlcykge1xyXG5cdFx0Z2VvbWV0cnkudmVydGljZXMucHVzaCggYWxsUG9pbnRzW25vdGVzW25vdGVdXS5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKSApO1xyXG5cdH1cclxuXHJcblx0Z2VvbWV0cnkuZmFjZXMucHVzaChuZXcgVEhSRUUuRmFjZTMoMCwxLDIpKTtcclxuXHRnZW9tZXRyeS5mYWNlcy5wdXNoKG5ldyBUSFJFRS5GYWNlMygyLDEsMCkpO1xyXG5cdGdlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscygpO1xyXG5cclxuXHR2YXIgdjEgPSBnZW9tZXRyeS52ZXJ0aWNlc1swXTtcclxuXHR2YXIgdjIgPSBnZW9tZXRyeS52ZXJ0aWNlc1sxXTtcclxuXHR2YXIgdjMgPSBnZW9tZXRyeS52ZXJ0aWNlc1syXTtcclxuXHJcblx0dGhpcy5ncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MSwgdjIpKTtcclxuXHR0aGlzLmdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYyLCB2MykpO1xyXG5cdHRoaXMuZ3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjMsIHYxKSk7Ki9cclxuXHJcblx0bGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XHJcblx0XHJcblx0bGV0IHBvc2l0aW9ucyA9IFtdO1xyXG5cdGxldCBub3JtYWxzID0gW107XHJcblx0XHJcblx0Zm9yKGxldCBwb2ludCBvZiBwb2ludHMpIHtcclxuXHRcdHBvc2l0aW9ucy5wdXNoKHBvaW50LmNsb25lKCkueCk7XHJcblx0XHRwb3NpdGlvbnMucHVzaChwb2ludC5jbG9uZSgpLnkpO1xyXG5cdFx0cG9zaXRpb25zLnB1c2gocG9pbnQuY2xvbmUoKS56KTtcclxuXHRcdG5vcm1hbHMucHVzaCgxLDEsMSk7XHJcblx0fVxyXG5cclxuXHRnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICdwb3NpdGlvbicsIG5ldyBUSFJFRS5GbG9hdDMyQnVmZmVyQXR0cmlidXRlKCBwb3NpdGlvbnMsIDMgKSApO1xyXG5cdC8vZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCAnbm9ybWFsJywgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoIG5vcm1hbHMsIDMgKSApO1xyXG5cclxuXHRnZW9tZXRyeS5zY2FsZShzY2FsZSwgc2NhbGUsIHNjYWxlKTtcclxuXHJcblx0dmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaCggZ2VvbWV0cnksIG1hdGVyaWFsLmNsb25lKCkgKTtcclxuXHR0aGlzLmdyb3VwLmFkZCggbWVzaCApO1xyXG5cdC8vdGhpcy5ncm91cC5hZGQobmV3IFBvbHlTcGhlcmVzRnJvbU5vdGVzKG5vdGVzKSk7XHJcblxyXG5cdC8vIGNvbnN0IHYxID0gcG9pbnRzWzBdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cdC8vIGNvbnN0IHYyID0gcG9pbnRzWzFdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cdC8vIGNvbnN0IHYzID0gcG9pbnRzWzJdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cclxuXHQvLyB0aGlzLmdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYxLCB2MikpO1xyXG5cdC8vIHRoaXMuZ3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjIsIHYzKSk7XHJcblx0Ly8gdGhpcy5ncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MywgdjEpKTtcclxuXHJcblx0cmV0dXJuIHRoaXMuZ3JvdXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dUaHJlZVBvaW50cyhwdHNJbmRleGVzKSB7XHJcblx0Ly9jb25zb2xlLmxvZyhwdHNJbmRleGVzKTtcclxuXHRwdHNJbmRleGVzLmZvckVhY2goaW5kZXggPT4ge1xyXG5cdFx0c2hvd09uZVBvaW50KGluZGV4KTtcclxuXHR9KTtcclxuXHJcblx0c3RpY2tzLmdldChrZXlGcm9tUHRTZXQoW3B0c0luZGV4ZXNbMF0sIHB0c0luZGV4ZXNbMV1dKSkudmlzaWJsZSA9IHRydWU7XHJcblx0c3RpY2tzLmdldChrZXlGcm9tUHRTZXQoW3B0c0luZGV4ZXNbMV0sIHB0c0luZGV4ZXNbMl1dKSkudmlzaWJsZSA9IHRydWU7XHJcblx0c3RpY2tzLmdldChrZXlGcm9tUHRTZXQoW3B0c0luZGV4ZXNbMl0sIHB0c0luZGV4ZXNbMF1dKSkudmlzaWJsZSA9IHRydWU7XHJcblxyXG5cdGZhY2VzLmdldChrZXlGcm9tUHRTZXQocHRzSW5kZXhlcykpLnZpc2libGUgPSB0cnVlO1xyXG59IiwiZnVuY3Rpb24gVHdvUG9pbnRzKHBvaW50MSwgcG9pbnQyLCBzY2FsZSkge1xyXG5cclxuXHR2YXIgdjEgPSBwb2ludDEuY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSk7XHJcblx0dmFyIHYyID0gcG9pbnQyLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cclxuXHQvLyB2YXIgY3lsaW5kZXIgPSBuZXcgVEhSRUUuQ3lsaW5kZXJCdWZmZXJHZW9tZXRyeSgwLjQsIDAuNCwgdjEuZGlzdGFuY2VUbyh2MiksIDEwLCAwLjUsIHRydWUpO1xyXG5cclxuXHR0aGlzLmdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG5cdC8qdmFyIHNwaGVyZUFNZXNoID0gc3BoZXJlTWVzaC5jbG9uZSgpO1xyXG5cdHNwaGVyZUFNZXNoLnBvc2l0aW9uLmNvcHkodjEpO1xyXG5cdHNwaGVyZUFNZXNoLnVwZGF0ZU1hdHJpeCgpO1xyXG5cclxuXHR2YXIgc3BoZXJlQk1lc2ggPSBzcGhlcmVNZXNoLmNsb25lKCk7XHJcblx0c3BoZXJlQk1lc2gucG9zaXRpb24uY29weSh2Mik7XHJcblx0c3BoZXJlQk1lc2gudXBkYXRlTWF0cml4KCk7Ki9cclxuXHJcblx0dmFyIGN5bGluZGVyTWVzaCA9IG5ldyBDeWxpbmRlckZyb21QdHModjEsIHYyKTtcclxuXHJcblx0Lyp0aGlzLmdyb3VwLmFkZChzcGhlcmVzW25vdGVWYWwxXSk7XHJcblx0dGhpcy5ncm91cC5hZGQoc3BoZXJlc1tub3RlVmFsMl0pOyovXHJcblx0dGhpcy5ncm91cC5hZGQoY3lsaW5kZXJNZXNoKTtcclxuXHJcblx0cmV0dXJuIHRoaXMuZ3JvdXA7XHJcbn1cdFxyXG5cclxuZnVuY3Rpb24gc2hvd1R3b1BvaW50cyhpbmRleGVzKSB7XHJcblx0Y29uc29sZS5sb2coXCJzaG93VHdvUG9pbnRzXCIpO1xyXG5cdFxyXG5cdHNob3dPbmVQb2ludChpbmRleGVzWzBdKTtcclxuXHRzaG93T25lUG9pbnQoaW5kZXhlc1sxXSk7XHJcblx0Ly9jb25zb2xlLmxvZygnc3RpY2tzJywgc3RpY2tzKTtcclxuXHQvL2NvbnNvbGUubG9nKCdrZXlGcm9tUHRTZXQnLCBrZXlGcm9tUHRTZXQoaW5kZXhlcykpO1xyXG5cdHN0aWNrcy5nZXQoa2V5RnJvbVB0U2V0KGluZGV4ZXMpKS52aXNpYmxlID0gdHJ1ZTtcclxufSIsImZ1bmN0aW9uIEFsbE1lc2hlcyhnaXZlblNjYWxlKSB7XHJcblx0dGhpcy5tZXNoQnlJZCA9IG5ldyBNYXAoKTtcclxuXHR0aGlzLmxhYmVscyA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cdHRoaXMubWVzaEdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG5cdGxldCBzY2FsZSA9IGdpdmVuU2NhbGU7XHJcblxyXG5cdGZ1bmN0aW9uIGZyb21QdHNOdW1iZXIobnVtYmVyKSB7XHJcblx0XHRjb25zdCBnZW4gPSBzdWJzZXRzKGFsbFBvaW50cywgbnVtYmVyKTtcclxuXHRcdFxyXG5cdFx0Zm9yKGxldCBzdWJzZXQgb2YgZ2VuKSB7XHJcblx0XHRcdGxldCBzdWJBcnJheSA9IEFycmF5LmZyb20oc3Vic2V0KTtcclxuXHRcdFx0bGV0IHNvcnRlZCA9IHN1YkFycmF5LnNvcnQoKGEsIGIpID0+IGFsbFBvaW50cy5pbmRleE9mKGEpIC0gYWxsUG9pbnRzLmluZGV4T2YoYikpO1xyXG5cdFx0XHRsZXQga2V5ID0ga2V5RnJvbVB0QXJyYXkoc29ydGVkLCBhbGxQb2ludHMpO1xyXG5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRsZXQgbWVzaCA9IG5ldyBNZXNoRnJvbVB0c0FycmF5KHN1YkFycmF5LCBzY2FsZSk7XHJcblx0XHRcdFx0bWVzaC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdHRoaXMubWVzaEJ5SWQuc2V0KGtleSwgbWVzaCk7XHJcblxyXG5cdFx0XHRcdHRoaXMubWVzaEdyb3VwLmFkZChtZXNoKTtcclxuXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmcm9tUHRzTnVtYmVyLmNhbGwodGhpcywxKTtcclxuXHRmcm9tUHRzTnVtYmVyLmNhbGwodGhpcywyKTtcclxuXHRmcm9tUHRzTnVtYmVyLmNhbGwodGhpcywzKTtcclxuXHJcblx0XHJcblxyXG5cdGNvbnNvbGUubG9nKCdtZXNoQnlJZDogJywgdGhpcy5tZXNoQnlJZCk7XHJcblxyXG5cdFx0Ly9jcmVhdGVzIGFsbCBwb2ludCBtZXNoZXNcclxuXHQvKmFsbFBvaW50cy5mb3JFYWNoKChwb2ludCwgaSkgPT4ge1xyXG5cdFx0bGV0IHNwaGVyZSA9IG5ldyBPbmVQb2ludChwb2ludCwgc2NhbGUpO1xyXG5cdFx0c3BoZXJlLnZpc2libGUgPSBmYWxzZTtcclxuXHRcdHNwaGVyZXMuc2V0KGksc3BoZXJlKTtcclxuXHJcblx0XHRzY2VuZS5hZGQoc3BoZXJlKTtcclxuXHR9KTtcclxuXHJcblx0Y29uc3Qgc3RpY2tHZW4gPSBzdWJzZXRzKGFsbFBvaW50cywgMik7XHJcblx0bGV0IHN0aWNrUHRzO1xyXG5cdHdoaWxlKCEoc3RpY2tQdHMgPSBzdGlja0dlbi5uZXh0KCkpLmRvbmUpIHtcclxuXHRcdGxldCBzdGlja1B0c0FycmF5ID0gQXJyYXkuZnJvbShzdGlja1B0cy52YWx1ZSk7XHJcblx0XHRsZXQgcDEgPSBzdGlja1B0c0FycmF5WzBdO1xyXG5cdFx0bGV0IHAyID0gc3RpY2tQdHNBcnJheVsxXTtcclxuXHRcdFxyXG5cdFx0bGV0IHN0aWNrID0gbmV3IFR3b1BvaW50cyhwMSwgcDIsIHNjYWxlKTtcclxuXHRcdHN0aWNrLnZpc2libGUgPSBmYWxzZTtcclxuXHRcdFxyXG5cdFx0c3RpY2tzLnNldChrZXlGcm9tUHRTZXQoc3RpY2tQdHNBcnJheSwgYWxsUG9pbnRzKSwgc3RpY2spO1xyXG5cclxuXHRcdHNjZW5lLmFkZChzdGljayk7XHJcblx0fVxyXG5cclxuXHRjb25zdCBmYWNlR2VuID0gc3Vic2V0cyhhbGxQb2ludHMsIDMpO1xyXG5cdGxldCBmYWNlUHRzO1xyXG5cdHdoaWxlKCEoZmFjZVB0cyA9IGZhY2VHZW4ubmV4dCgpKS5kb25lKSB7XHJcbiAgICAgICAgbGV0IGZhY2VQdHNBcnJheSA9IEFycmF5Llx0ZnJvbShmYWNlUHRzLnZhbHVlKTtcclxuXHJcbiAgICAgICAgbGV0IGZhY2UgPSBuZXcgVGhyZWVQb2ludHMoZmFjZVB0c0FycmF5LCBzY2FsZSk7XHJcbiAgICAgICAgZmFjZS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgXHJcblx0XHRmYWNlcy5zZXQoa2V5RnJvbVB0U2V0KGZhY2VQdHNBcnJheSwgYWxsUG9pbnRzKSwgZmFjZSk7XHJcblxyXG5cdFx0c2NlbmUuYWRkKGZhY2UpO1xyXG5cdH0qL1xyXG59XHJcblxyXG5BbGxNZXNoZXMucHJvdG90eXBlLnNob3dGcm9tUHRzQXJyYXkgPSBmdW5jdGlvbihwdHNBcnJheSwgdmFsdWUpIHtcclxuXHRsZXQgbWF4SXRlciA9IHB0c0FycmF5Lmxlbmd0aCAlIDQ7XHJcblx0Ly9jb25zb2xlLmxvZygncHRzQXJyYXknLCBwdHNBcnJheSk7XHJcblx0Zm9yKGxldCBpPTE7IGk8PW1heEl0ZXI7IGkrKyl7XHJcblx0XHRsZXQgZ2VuID0gc3Vic2V0cyhwdHNBcnJheSwgaSk7XHJcblx0XHRmb3IobGV0IHN1YiBvZiBnZW4pIHtcclxuXHRcdFx0bGV0IHN1YkFycmF5ID0gQXJyYXkuZnJvbShzdWIpO1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IGtleSA9IGtleUZyb21QdEFycmF5KHN1YkFycmF5KTtcclxuXHJcblx0XHRcdGlmKHRoaXMubWVzaEJ5SWQuaGFzKGtleSkpIHtcclxuXHRcdFx0XHR0aGlzLm1lc2hCeUlkLmdldChrZXkpLnZpc2libGUgPSB2YWx1ZTtcdFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHJcblx0fVxyXG5cdFxyXG59XHJcblxyXG5BbGxNZXNoZXMucHJvdG90eXBlLnNob3dGcm9tS2V5ID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG5cdGlmKHRoaXMubWVzaEJ5SWQuaGFzKGtleSkpXHJcblx0XHR0aGlzLm1lc2hCeUlkLmdldChrZXkpLnZpc2libGUgPSB2YWx1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24ga2V5RnJvbVB0QXJyYXkoYXJyYXksIGluZGV4ZXIpIHtcclxuXHRsZXQga2V5ID0gJyc7XHJcblx0bGV0IGluZGV4O1xyXG5cdGxldCBzb3J0ZWQ7XHJcblx0bGV0IGlzSW5kZXhlZCA9IChpbmRleGVyICE9IG51bGwpO1xyXG5cclxuXHRpZihpc0luZGV4ZWQpIHtcclxuXHRcdHNvcnRlZCA9IGFycmF5LnNvcnQoKGEsIGIpID0+IGluZGV4ZXIuaW5kZXhPZihhKSAtIGluZGV4ZXIuaW5kZXhPZihiKSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHNvcnRlZCA9IGFycmF5LnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcclxuXHR9XHJcblxyXG5cdGZvcihsZXQgcG9pbnQgb2Ygc29ydGVkKSB7XHJcblx0XHRpZihpc0luZGV4ZWQpXHJcblx0XHRcdGluZGV4ID0gaW5kZXhlci5pbmRleE9mKHBvaW50KTtcclxuXHRcdGVsc2VcclxuXHRcdFx0aW5kZXggPSBwb2ludDtcclxuXHJcblx0XHRrZXkgKz0gJy4nK1N0cmluZyhpbmRleCk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ga2V5O1xyXG59IiwiY29uc3QgYWxsUG9pbnRzID0gW1xyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjc1OTY2MDY5MzA0NywgMC42MDQyOTI3MDQwNzksIC0wLjI0MDMwMzg4OTM1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC40ODQyNjY4NDg3NzcsIC0wLjIwNjc3NzA0NzExOSwgLTAuODUwMTM0NjE5OTA0KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC45MjAyMzc5MTgxMTQsIC0wLjM4MDY5MzM5MTgxNiwgMC4wOTA3NDUzMzMxNzk0KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjQ4NDI2MjgwNTA5MywgMC4yMDY3Nzk5NzU5NjgsIDAuODUwMTM2MjEwOTM1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjE1MTQ1MTYxOTg4LCAwLjYyNjM2ODMxNjA3MywgLTAuNzY0NjczMjIzOTY5KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjkyMDIzOTc4MjkyMiwgMC4zODA2ODk2MDYyMjksIC0wLjA5MDc0MjMwMzQ1NDUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuNTUzOTY5NTYxMDA1LCAtMC4zNDQ5NzEwNDU1NTYsIC0wLjc1NzcwMjI1MjM0NSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuMTA4MzY5NjE5OTg1LCAtMC45NjczNjg4NTUyMjcsIC0wLjIyOTAyNzM0MjAzNyksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuMTUxNDUwMDY4OTc0LCAtMC42MjYzNjk0MjA5MjcsIDAuNzY0NjcyNjI2MTE5KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjc1OTY1OTkwMDk3MSwgLTAuNjA0MjkyOTg3MzMzLCAwLjI0MDMwNTY4MDk5MSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoMC4xMDgzNzE4MDU5NjQsIDAuOTY3MzY5NzAzODYyLCAwLjIyOTAyMjcyMzE1NSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuNTUzOTcwMzI2OTM4LCAwLjM0NDk3MjQ0MTc2NywgMC43NTc3MDEwNTY2OClcclxuXTtcclxuXHJcbi8qXHJcbnZhciBhbGxQb2ludHMgPSBbXHJcblx0Wy0wLjc1OTY2MDY5MzA0NywgMC42MDQyOTI3MDQwNzksIC0wLjI0MDMwMzg4OTM1XSxcclxuXHRbLTAuNDg0MjY2ODQ4Nzc3LCAtMC4yMDY3NzcwNDcxMTksIC0wLjg1MDEzNDYxOTkwNF0sXHJcblx0Wy0wLjkyMDIzNzkxODExNCwgLTAuMzgwNjkzMzkxODE2LCAwLjA5MDc0NTMzMzE3OTRdLFxyXG5cdFswLjQ4NDI2MjgwNTA5MywgMC4yMDY3Nzk5NzU5NjgsIDAuODUwMTM2MjEwOTM1XSxcclxuXHRbMC4xNTE0NTE2MTk4OCwgMC42MjYzNjgzMTYwNzMsIC0wLjc2NDY3MzIyMzk2OV0sXHJcblx0WzAuOTIwMjM5NzgyOTIyLCAwLjM4MDY4OTYwNjIyOSwgLTAuMDkwNzQyMzAzNDU0NV0sXHJcblx0WzAuNTUzOTY5NTYxMDA1LCAtMC4zNDQ5NzEwNDU1NTYsIC0wLjc1NzcwMjI1MjM0NV0sXHJcblx0Wy0wLjEwODM2OTYxOTk4NSwgLTAuOTY3MzY4ODU1MjI3LCAtMC4yMjkwMjczNDIwMzddLFxyXG5cdFstMC4xNTE0NTAwNjg5NzQsIC0wLjYyNjM2OTQyMDkyNywgMC43NjQ2NzI2MjYxMTldLFxyXG5cdFswLjc1OTY1OTkwMDk3MSwgLTAuNjA0MjkyOTg3MzMzLCAwLjI0MDMwNTY4MDk5MV0sXHJcblx0WzAuMTA4MzcxODA1OTY0LCAwLjk2NzM2OTcwMzg2MiwgMC4yMjkwMjI3MjMxNTVdLFxyXG5cdFstMC41NTM5NzAzMjY5MzgsIDAuMzQ0OTcyNDQxNzY3LCAwLjc1NzcwMTA1NjY4XVxyXG5dO1xyXG4qLyIsImZ1bmN0aW9uKiBzdWJzZXRzKGFycmF5LCBsZW5ndGgsIHN0YXJ0ID0gMCkge1xyXG4gIGlmIChzdGFydCA+PSBhcnJheS5sZW5ndGggfHwgbGVuZ3RoIDwgMSkge1xyXG4gICAgeWllbGQgbmV3IFNldCgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3aGlsZSAoc3RhcnQgPD0gYXJyYXkubGVuZ3RoIC0gbGVuZ3RoKSB7XHJcbiAgICAgIGxldCBmaXJzdCA9IGFycmF5W3N0YXJ0XTtcclxuICAgICAgZm9yIChzdWJzZXQgb2Ygc3Vic2V0cyhhcnJheSwgbGVuZ3RoIC0gMSwgc3RhcnQgKyAxKSkge1xyXG4gICAgICAgIHN1YnNldC5hZGQoZmlyc3QpO1xyXG4gICAgICAgIHlpZWxkIHN1YnNldDtcclxuICAgICAgfVxyXG4gICAgICArK3N0YXJ0O1xyXG4gICAgfVxyXG4gIH1cclxufSIsImZ1bmN0aW9uIEdsb2JhbExpZ2h0cyhkaXN0RnJvbU1pZCkge1xyXG5cdGNvbnN0IGRpc3RhbmNlID0gZGlzdEZyb21NaWQ7XHJcblx0Y29uc3QgbGlnaHRzR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcblx0Ly90b3AgbGlnaHRzXHJcblx0bGV0IHBvaW50TGlnaHQxID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZjAwMDAsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodDEucG9zaXRpb24uc2V0KGRpc3RhbmNlLCBkaXN0YW5jZSwgZGlzdGFuY2UpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChwb2ludExpZ2h0MSk7XHJcblxyXG5cdC8qbGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQxLCAxKTtcclxuXHRsaWdodHNHcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHRsZXQgcG9pbnRMaWdodDIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDAwZmYwMCwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0Mi5wb3NpdGlvbi5zZXQoZGlzdGFuY2UsIGRpc3RhbmNlLCAtZGlzdGFuY2UpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChwb2ludExpZ2h0Mik7XHJcblxyXG5cdC8qbGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQyLCAxKTtcclxuXHRsaWdodHNHcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHRsZXQgcG9pbnRMaWdodDMgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweGZmZmYwMCwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0My5wb3NpdGlvbi5zZXQoLWRpc3RhbmNlLCBkaXN0YW5jZSwgZGlzdGFuY2UpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChwb2ludExpZ2h0Myk7XHJcblxyXG5cdC8qbGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQzLCAxKTtcclxuXHRsaWdodHNHcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHRsZXQgcG9pbnRMaWdodDQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDAwMDBmZiwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0NC5wb3NpdGlvbi5zZXQoLWRpc3RhbmNlLCBkaXN0YW5jZSwgLWRpc3RhbmNlKTtcclxuXHRsaWdodHNHcm91cC5hZGQocG9pbnRMaWdodDQpO1xyXG5cclxuXHQvKmxldCBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0NCwgMSk7XHJcblx0bGlnaHRzR3JvdXAuYWRkKGhlbHBlcik7Ki9cclxuXHJcblxyXG5cdC8vYm90dG9tIGxpZ2h0c1xyXG5cdGxldCBwb2ludExpZ2h0NSA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4MDBmZmZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQ1LnBvc2l0aW9uLnNldChkaXN0YW5jZSwgLWRpc3RhbmNlLCBkaXN0YW5jZSk7XHJcblx0bGlnaHRzR3JvdXAuYWRkKHBvaW50TGlnaHQ1KTtcclxuXHJcblx0LypsZXQgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodDUsIDEpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdGxldCBwb2ludExpZ2h0NiA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmYwMGZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQ2LnBvc2l0aW9uLnNldChkaXN0YW5jZSwgLWRpc3RhbmNlLCAtZGlzdGFuY2UpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChwb2ludExpZ2h0Nik7XHJcblxyXG5cdC8qbGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQ2LCAxKTtcclxuXHRsaWdodHNHcm91cC5hZGQoaGVscGVyKTtcclxuKi9cclxuXHRsZXQgcG9pbnRMaWdodDcgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweGZmODg4OCwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0Ny5wb3NpdGlvbi5zZXQoLWRpc3RhbmNlLCAtZGlzdGFuY2UsIGRpc3RhbmNlKTtcclxuXHRsaWdodHNHcm91cC5hZGQocG9pbnRMaWdodDcpO1xyXG5cclxuXHQvKmxldCBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0NywgMSk7XHJcblx0bGlnaHRzR3JvdXAuYWRkKGhlbHBlcik7Ki9cclxuXHJcblx0bGV0IHBvaW50TGlnaHQ4ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHg4ODg4ZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodDgucG9zaXRpb24uc2V0KC1kaXN0YW5jZSwgLWRpc3RhbmNlLCAtZGlzdGFuY2UpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChwb2ludExpZ2h0OCk7XHJcblxyXG5cdC8qbGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQ4LCAxKTtcclxuXHRsaWdodHNHcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHJcblxyXG5cdC8vbWlkZGxlIGxpZ2h0XHJcblx0LypsZXQgcG9pbnRMaWdodDkgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweGZmZmZmZiwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0OS5wb3NpdGlvbi5zZXQoeCwgeSwgeik7XHJcblx0bGlnaHRzR3JvdXAuYWRkKHBvaW50TGlnaHQ5KTtcclxuXHJcblx0bGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQ5LCAxKTtcclxuXHRncm91cC5hZGQoaGVscGVyKTsqL1xyXG5cdHJldHVybiBsaWdodHNHcm91cDtcclxufSIsImNvbnN0IHRyYW5zcGFyZW50TWF0ZXJpYWxGcm9udCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4ZmZmZmZmLFxyXG5cdG9wYWNpdHk6IDAuNCxcclxuXHR0cmFuc3BhcmVudDogdHJ1ZSxcclxuXHRzaWRlOiBUSFJFRS5Eb3VibGVTaWRlXHJcbn0gKTtcclxuXHJcbmNvbnN0IHRyYW5zcGFyZW50TWF0ZXJpYWxCYWNrID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoIHtcclxuXHRjb2xvcjogMHhmZmZmZmYsXHJcblx0b3BhY2l0eTogMC40LFxyXG5cdHRyYW5zcGFyZW50OiB0cnVlXHJcbn0gKTtcclxuXHJcbmNvbnN0IHBvaW50c01hdGVyaWFsID0gbmV3IFRIUkVFLlBvaW50c01hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4MDA4MGZmLFxyXG5cdHNpemU6IDEsXHJcblx0YWxwaGFUZXN0OiAwLjVcclxufSApO1xyXG5cclxuY29uc3QgUkdCTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaE5vcm1hbE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4MDA4OGZmLFxyXG5cdHNpZGU6IFRIUkVFLkRvdWJsZVNpZGVcclxufSk7XHJcblxyXG5jb25zdCBTVERNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCgge1xyXG5cdGNvbG9yOiAweDAwODhmZlxyXG59KTtcclxuXHJcbmNvbnN0IGZsYXRTaGFwZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCB7XHJcblx0c2lkZSA6IFRIUkVFLkRvdWJsZVNpZGUsXHJcblx0dHJhbnNwYXJlbnQgOiB0cnVlLFxyXG5cdG9wYWNpdHk6IDAuNVxyXG59KTsiLCJmdW5jdGlvbiBDeWxpbmRlckZyb21QdHModjEsIHYyKSB7XHJcblx0dmFyIGN5bGluZGVyID0gbmV3IFRIUkVFLkN5bGluZGVyQnVmZmVyR2VvbWV0cnkoMC40LCAwLjQsIHYxLmRpc3RhbmNlVG8odjIpLCAxMCwgMC41LCB0cnVlKTtcclxuXHR2YXIgY3lsaW5kZXJNZXNoID0gbmV3IFRIUkVFLk1lc2goY3lsaW5kZXIsIFJHQk1hdGVyaWFsKTtcclxuXHRjeWxpbmRlck1lc2gucG9zaXRpb24uY29weSh2MS5jbG9uZSgpLmxlcnAodjIsIC41KSk7XHJcblxyXG5cdC8vY3JlYXRlcyBxdWF0ZXJuaW9uIGZyb20gc3BoZXJlcyBwb3NpdGlvbiB0byByb3RhdGUgdGhlIGN5bGluZGVyXHJcblx0dmFyIHEgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xyXG5cdHEuc2V0RnJvbVVuaXRWZWN0b3JzKG5ldyBUSFJFRS5WZWN0b3IzKDAsMSwwKSwgbmV3IFRIUkVFLlZlY3RvcjMoKS5zdWJWZWN0b3JzKHYxLCB2Mikubm9ybWFsaXplKCkpO1xyXG5cdGN5bGluZGVyTWVzaC5zZXRSb3RhdGlvbkZyb21RdWF0ZXJuaW9uKHEpO1xyXG5cdHJldHVybiBjeWxpbmRlck1lc2g7XHJcbn0iLCJmdW5jdGlvbiBQb2x5TWVzaGVzKGdlb21ldHJ5LCBub3Rlcykge1xyXG5cdHRoaXMuZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcblx0dGhpcy5ncm91cC5hZGQobmV3IFRyYW5zcE1lc2hHcnAoZ2VvbWV0cnkpKTtcclxuXHQvL3RoaXMuZ3JvdXAuYWRkKG5ldyBQb2x5U3BoZXJlc0Zyb21Ob3Rlcyhub3RlcykpO1xyXG5cdHJldHVybiB0aGlzLmdyb3VwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBNZXNoRnJvbVB0c0FycmF5KHB0c0FycmF5LCBzY2FsZSkge1xyXG5cdGxldCBsZW4gPSBwdHNBcnJheS5sZW5ndGg7XHJcblx0XHJcblxyXG5cdHN3aXRjaChsZW4pIHtcclxuXHRcdGNhc2UgMTpcclxuXHRcdFx0cmV0dXJuIG5ldyBPbmVQb2ludChwdHNBcnJheVswXSwgc2NhbGUpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgMjpcclxuXHRcdFx0cmV0dXJuIG5ldyBUd29Qb2ludHMocHRzQXJyYXlbMF0sIHB0c0FycmF5WzFdLCBzY2FsZSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAzOlxyXG5cdFx0XHRyZXR1cm4gbmV3IFRocmVlUG9pbnRzKHB0c0FycmF5LCBzY2FsZSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0dGhyb3cgXCJDYW4ndCBjcmVhdGUgbWVzaCBmb3Igc28gbXVjaCBwb2ludHNcIjtcclxuXHRcdFx0YnJlYWs7XHJcblx0fVxyXG59XHJcblxyXG5Qb2x5TWVzaGVzLnByb3RvdHlwZS5zZXRQb3MgPSBmdW5jdGlvbih4LHkseikge1xyXG5cdHRoaXMuZ3JvdXAucG9zaXRpb24ueCA9IHg7XHJcblx0dGhpcy5ncm91cC5wb3NpdGlvbi55ID0geTtcclxuXHR0aGlzLmdyb3VwLnBvc2l0aW9uLnogPSB6O1xyXG59IiwiLy8gLy9jcmVhdGVzIHNwaGVyZXMgZm9yIGVhY2ggdmVydGV4IG9mIHRoZSBnZW9tZXRyeVxyXG4vLyB2YXIgc3BoZXJlID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDIsNTAsNTApO1xyXG4vLyB2YXIgc3BoZXJlTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHNwaGVyZSwgUkdCTWF0ZXJpYWwpO1xyXG5cclxuLy8gZnVuY3Rpb24gUG9seVNwaGVyZXMoZ2VvbWV0cnkpIHtcclxuLy8gXHR0aGlzLmdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbi8vIFx0dmFyIG1lc2ggPSBzcGhlcmVNZXNoLmNsb25lKCk7XHJcbi8vIFx0Zm9yKHZhciBpPTA7IGk8Z2VvbWV0cnkudmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuLy8gXHRcdHNwaGVyZU1lc2gucG9zaXRpb24uY29weShnZW9tZXRyeS52ZXJ0aWNlc1tpXSk7XHJcbi8vIFx0XHR0aGlzLmdyb3VwLmFkZChzcGhlcmVNZXNoLmNsb25lKCkpO1xyXG4vLyBcdH1cclxuXHJcbi8vIFx0cmV0dXJuIHRoaXMuZ3JvdXA7XHJcbi8vIH1cclxuXHJcbi8vIGZ1bmN0aW9uIFBvbHlTcGhlcmVzRnJvbU5vdGVzKG5vdGVzKSB7XHJcbi8vIFx0dmFyIGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbi8vIFx0Zm9yKHZhciBpIGluIG5vdGVzKSB7XHJcbi8vIFx0XHRncm91cC5hZGQoc3BoZXJlcy5nZXRPYmplY3RCeUlkKG5vdGVzW2ldKS5jbG9uZSgpKTtcclxuLy8gXHR9XHJcbi8vIFx0Lypjb25zb2xlLmxvZyhncm91cCk7Ki9cclxuXHJcbi8vIFx0cmV0dXJuIGdyb3VwO1xyXG4vLyB9IiwiZnVuY3Rpb24gbWFrZVRleHRTcHJpdGUoIHBvaW50LCBzY2FsZSwgcGFyYW1ldGVycyApXHJcbntcclxuXHRsZXQgbWFwLCBzcHJpdGUsIG1hdGVyaWFsO1xyXG5cclxuXHRsZXQgdGV4dHVyZUxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XHJcblx0bGV0IG5vdGUgPSBhbGxQb2ludHMuaW5kZXhPZihwb2ludCk7XHJcblx0XHJcblxyXG5cdHN3aXRjaChub3RlKSB7XHJcblx0XHRjYXNlIDA6IG1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCgnc3ByaXRlcy9DLnBuZycpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAxOiBtYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ3Nwcml0ZXMvQ1MucG5nJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIDI6IG1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCgnc3ByaXRlcy9ELnBuZycpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAzOiBtYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ3Nwcml0ZXMvRFMucG5nJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIDQ6IG1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCgnc3ByaXRlcy9FLnBuZycpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSA1OiBtYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ3Nwcml0ZXMvRi5wbmcnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdGNhc2UgNjogbWFwID0gdGV4dHVyZUxvYWRlci5sb2FkKCdzcHJpdGVzL0ZTLnBuZycpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSA3OiBtYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ3Nwcml0ZXMvRy5wbmcnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdGNhc2UgODogbWFwID0gdGV4dHVyZUxvYWRlci5sb2FkKCdzcHJpdGVzL0dTLnBuZycpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSA5OiBtYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ3Nwcml0ZXMvQS5wbmcnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdGNhc2UgMTA6IG1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCgnc3ByaXRlcy9BUy5wbmcnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdGNhc2UgMTE6IG1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCgnc3ByaXRlcy9CLnBuZycpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdH1cclxuXHJcblx0Y29uc29sZS5sb2cobWFwKTtcclxuXHJcblx0bWF0ZXJpYWwgPSBuZXcgVEhSRUUuU3ByaXRlTWF0ZXJpYWwoIHsgbWFwOiBtYXAsIGNvbG9yOiAweGZmZmZmZiwgZm9nOiB0cnVlIH0pO1xyXG5cclxuXHRzcHJpdGUgPSBuZXcgVEhSRUUuU3ByaXRlKG1hdGVyaWFsKTtcclxuXHJcblx0c3ByaXRlLnBvc2l0aW9uLmNvcHkocG9pbnQuY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSkpO1xyXG5cclxuXHRyZXR1cm4gc3ByaXRlO1x0XHJcbn0iLCIvL2NyZWF0ZXMgYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgdHdvIG1lc2hlcyB0byBjcmVhdGUgdHJhbnNwYXJlbmN5XHJcbmZ1bmN0aW9uIFRyYW5zcE1lc2hHcnAoZ2VvbWV0cnkpIHtcclxuXHR2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHR2YXIgbWVzaEdlb21ldHJ5ID0gbmV3IFRIUkVFLkNvbnZleEJ1ZmZlckdlb21ldHJ5KGdlb21ldHJ5LnZlcnRpY2VzKTtcclxuXHJcblx0dmFyIGZhY2VzID0gbWVzaEdlb21ldHJ5LmZhY2VzO1xyXG5cdGZvcih2YXIgZmFjZSBpbiBmYWNlcykge1xyXG5cdFx0Zm9yKHZhciBpPTA7IGk8MzsgaSsrKSB7XHJcblx0XHRcdHZhciB2MSA9IGZhY2VzW2ZhY2VdLmdldEVkZ2UoaSkuaGVhZCgpO1xyXG5cdFx0XHR2YXIgdjIgPSBmYWNlc1tmYWNlXS5nZXRFZGdlKGkpLnRhaWwoKTtcclxuXHRcdFx0Z3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjEucG9pbnQsIHYyLnBvaW50KSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKG1lc2hHZW9tZXRyeSwgdHJhbnNwYXJlbnRNYXRlcmlhbEJhY2spO1xyXG5cdG1lc2gubWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkJhY2tTaWRlOyAvLyBiYWNrIGZhY2VzXHJcblx0bWVzaC5yZW5kZXJPcmRlciA9IDA7XHJcblxyXG5cdHZhciBtZXNoMiA9IG5ldyBUSFJFRS5NZXNoKG1lc2hHZW9tZXRyeSwgdHJhbnNwYXJlbnRNYXRlcmlhbEZyb250LmNsb25lKCkpO1xyXG5cdG1lc2gyLm1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Gcm9udFNpZGU7IC8vIGZyb250IGZhY2VzXHJcblx0bWVzaDIucmVuZGVyT3JkZXIgPSAxO1xyXG5cclxuXHRncm91cC5hZGQobWVzaCk7XHJcblx0Z3JvdXAuYWRkKG1lc2gyKTtcclxuXHJcblx0cmV0dXJuIGdyb3VwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93UG9seWhlZHJvbihwdHNJbmRleGVzKSB7XHJcblx0Ly9jb25zb2xlLmxvZyhwdHNJbmRleGVzKTtcclxuXHQvLyBsZXQgdmVydGljZXMgPSBbXTtcclxuXHQvLyBwdHNJbmRleGVzLmZvckVhY2goaW5kZXggPT4ge1xyXG5cdC8vIFx0dmVydGljZXMucHVzaChhbGxQb2ludHNbaW5kZXhdLmNsb25lKCkpO1xyXG5cdC8vIH0pO1xyXG5cdC8vIC8vIGNvbnNvbGUubG9nKCd2ZXJ0aWNlcycsIHZlcnRpY2VzKTtcclxuXHJcblx0Ly8gbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkNvbnZleEJ1ZmZlckdlb21ldHJ5KHZlcnRpY2VzKTtcclxuXHQvLyAvLyBjb25zb2xlLmxvZygnZ2VvbWV0cnknLCBnZW9tZXRyeSk7XHJcblx0Ly8gZ2VvbWV0cnkuZmFjZXMuZm9yRWFjaChmYWNlID0+IHtcclxuXHQvLyBcdGxldCBwdDEgPSBmYWNlLmdldEVkZ2UoMCkuaGVhZCgpLnBvaW50LFxyXG5cdC8vIFx0XHRwdDIgPSBmYWNlLmdldEVkZ2UoMSkuaGVhZCgpLnBvaW50LFxyXG5cdC8vIFx0XHRwdDMgPSBmYWNlLmdldEVkZ2UoMikuaGVhZCgpLnBvaW50O1xyXG5cdC8vIFx0Ly8gY29uc29sZS5sb2coJ2ZhY2UnLCBmYWNlKTtcclxuXHQvLyBcdC8vIGNvbnNvbGUubG9nKCdwdDEnLCBwdDEpO1xyXG5cdC8vIFx0Ly8gY29uc29sZS5sb2coJ3B0MicsIHB0Mik7XHJcblx0Ly8gXHQvLyBjb25zb2xlLmxvZygncHQzJywgcHQzKTtcclxuXHQvLyBcdGxldCBpbmRleDEgPSBhbGxQb2ludHMubWFwKGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUuZXF1YWxzKHB0MSkgfSkuaW5kZXhPZih0cnVlKSxcclxuXHQvLyBcdFx0aW5kZXgyID0gYWxsUG9pbnRzLm1hcChmdW5jdGlvbihlKSB7IHJldHVybiBlLmVxdWFscyhwdDIpIH0pLmluZGV4T2YodHJ1ZSksXHJcblx0Ly8gXHRcdGluZGV4MyA9IGFsbFBvaW50cy5tYXAoZnVuY3Rpb24oZSkgeyByZXR1cm4gZS5lcXVhbHMocHQzKSB9KS5pbmRleE9mKHRydWUpO1xyXG5cdC8vIFx0c2hvd1RocmVlUG9pbnRzKFtpbmRleDEsIGluZGV4MiwgaW5kZXgzXSk7XHJcblx0Ly8gfSk7XHJcblxyXG5cdC8vY29uc3QgaW5kZXhlcyA9IFsgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExIF07XHJcblxyXG5cdGNvbnN0IGdlbiA9IHN1YnNldHMocHRzSW5kZXhlcywgMyk7XHJcblx0bGV0IHRocmVlUHRzO1xyXG5cclxuXHR3aGlsZSghKHRocmVlUHRzID0gZ2VuLm5leHQoKSkuZG9uZSkge1xyXG5cdFx0c2hvd1RocmVlUG9pbnRzKEFycmF5LmZyb20odGhyZWVQdHMudmFsdWUpKTtcclxuXHR9XHJcblxyXG5cclxufVxyXG5cclxuLypmdW5jdGlvbiBtYWtlVHJhbnNwYXJlbnQoZ2VvbWV0cnksIGdyb3VwKSB7XHJcblx0Ly9nZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xyXG5cdC8vZ2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XHJcblx0Z3JvdXAuYWRkKG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCB0cmFuc3BhcmVudE1hdGVyaWFsRnJvbnQpKTtcclxufSovIiwiY29uc3Qgc2NhbGUgPSAxNTtcclxubGV0IGNob3JkR2VvbWV0cnk7XHJcblxyXG5mdW5jdGlvbiBDaG9yZChub3Rlcykge1xyXG5cdHRoaXMubm90ZXMgPSBbXTtcclxuXHJcblx0Zm9yKHZhciBpIGluIG5vdGVzKSB7XHJcblx0XHRsZXQgZmluYWxOb3RlID0gbm90ZXNbaV0gJSAxMjtcclxuXHRcdGlmKHRoaXMubm90ZXMuaW5kZXhPZihmaW5hbE5vdGUpID09IC0xKSBcclxuXHRcdFx0dGhpcy5ub3Rlcy5wdXNoKGZpbmFsTm90ZSk7XHJcblx0fVxyXG5cclxuXHR0aGlzLmRyYXdDaG9yZCgpO1xyXG59XHJcblxyXG5DaG9yZC5wcm90b3R5cGUuYWRkTm90ZSA9IGZ1bmN0aW9uKG5vdGUpIHtcclxuXHR0aGlzLm5vdGVzLnB1c2gobm90ZSAlIDEyKTtcclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbihib29sKSB7XHJcblx0dGhpcy5wb2x5aGVkcm9uLnZpc2libGUgPSBib29sO1xyXG5cdGZvcih2YXIgaSBpbiB0aGlzLm5vdGVzKSB7XHJcblx0XHRzcGhlcmVzLmNoaWxkcmVuW3RoaXMubm90ZXNbaV1dLnZpc2libGUgPSBib29sO1xyXG5cdH1cclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLmRyYXdDaG9yZCA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBuYk5vdGVzID0gdGhpcy5ub3Rlcy5sZW5ndGg7XHJcblxyXG5cdGlmKG5iTm90ZXMgPT0gMSkge1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XHJcblx0fSBlbHNlIGlmKG5iTm90ZXMgPT0gMikge1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFR3b1BvaW50cyh0aGlzLm5vdGVzWzBdLCB0aGlzLm5vdGVzWzFdLCBzY2FsZSk7XHJcblx0fSBlbHNlIGlmKG5iTm90ZXMgPT0gMykge1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFRocmVlUG9pbnRzKHRoaXMubm90ZXMsIHNjYWxlKTtcclxuXHR9ZWxzZSB7XHJcblx0XHRjaG9yZEdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgaT0wOyBpPG5iTm90ZXM7IGkrKykge1xyXG5cdFx0XHRjaG9yZEdlb21ldHJ5LnZlcnRpY2VzLnB1c2goXHJcblx0XHRcdFx0YWxsUG9pbnRzW3RoaXMubm90ZXNbaV1dLmNsb25lKClcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyB2YXIgc3VicyA9IHN1YnNldHModGhpcy5ub3RlcywgMyk7XHJcblx0XHQvLyB2YXIgcG9pbnRJZHM7XHJcblx0XHQvLyB2YXIgcG9pbnRJZDEsIHBvaW50SWQyLCBwb2ludElkMztcclxuXHRcdC8vIHZhciBmYWNlO1xyXG5cclxuXHRcdC8vIGZvcihzdWIgb2Ygc3Vicykge1xyXG5cdFx0Ly8gXHRwb2ludElkcyA9IHN1Yi5lbnRyaWVzKCk7XHJcblx0XHRcdFxyXG5cdFx0Ly8gXHQvL2dldCB0aGUgZmFjZSdzIDMgdmVydGljZXMgaW5kZXhcclxuXHRcdC8vIFx0cG9pbnRJZDEgPSBwb2ludElkcy5uZXh0KCkudmFsdWVbMF0udmFsdWU7XHJcblx0XHQvLyBcdHBvaW50SWQyID0gcG9pbnRJZHMubmV4dCgpLnZhbHVlWzBdLnZhbHVlO1xyXG5cdFx0Ly8gXHRwb2ludElkMyA9IHBvaW50SWRzLm5leHQoKS52YWx1ZVswXS52YWx1ZTtcclxuXHJcblx0XHQvLyBcdGZhY2UgPSBuZXcgVEhSRUUuRmFjZTMocG9pbnRJZDEscG9pbnRJZDIscG9pbnRJZDMpO1xyXG5cdFx0Ly8gXHRnZW9tZXRyeS5mYWNlcy5wdXNoKGZhY2UpO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdC8vIHZhciBtZXNoR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29udmV4QnVmZmVyR2VvbWV0cnkoZ2VvbWV0cnkudmVydGljZXMpO1xyXG5cdFx0Y2hvcmRHZW9tZXRyeS5zY2FsZShzY2FsZSxzY2FsZSxzY2FsZSk7XHJcblx0XHR0aGlzLnBvbHloZWRyb24gPSBuZXcgUG9seU1lc2hlcyhjaG9yZEdlb21ldHJ5LCB0aGlzLm5vdGVzKTtcclxuXHJcblx0fVxyXG5cdHRoaXMucG9seWhlZHJvbi52aXNpYmxlID0gZmFsc2U7XHJcblx0c2hhcGVzR3JvdXAuYWRkKHRoaXMucG9seWhlZHJvbik7XHJcblx0XHJcblxyXG59XHJcblxyXG5DaG9yZC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oY2hvcmQpIHtcclxuXHRpZih0aGlzLm5vdGVzLmxlbmd0aCAhPSBjaG9yZC5ub3Rlcy5sZW5ndGgpXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdGZvcihsZXQgbm90ZSBpbiBjaG9yZC5ub3Rlcykge1xyXG5cdFx0aWYodGhpcy5ub3Rlc1tub3RlXSAhPSBjaG9yZC5ub3Rlc1tub3RlXSlcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRydWU7XHJcbn0iLCJpbml0KCk7XHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG5cdGxldCBtYWluR3JvdXAsIGFsbE1lc2hlcztcclxuXHRsZXQgcmVuZGVyZXIsIHNjZW5lLCBjYW1lcmEsIG9yYml0Q29udHJvbHM7XHJcblx0bGV0IHZhbGlkQnV0dG9uLCBmaWxlSW5wdXQ7XHJcblx0bGV0IHdpbmRvd0hhbGZYLCB3aW5kb3dIYWxmWTtcclxuXHRsZXQgc2xpZGVyO1xyXG5cdGxldCBtaWRpVG9DaG9yZCA9IG5ldyBNaWRpVG9DaG9yZE1hcCgpO1xyXG5cdGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoIDB4NDA0MDQwICksXHJcblx0XHQgIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCggMHhmZjAwMDAsIDEsIDEwMCApXHJcblx0XHQgIGdsb2JhbExpZ2h0cyA9IG5ldyBHbG9iYWxMaWdodHMoMjApO1xyXG5cdGNvbnN0IHNjYWxlID0gMTU7XHRcclxuXHRcclxuXHRhbGxNZXNoZXMgPSBuZXcgQWxsTWVzaGVzKHNjYWxlKTtcclxuXHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1pbnB1dCcpO1xyXG5cdHZhbGlkQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZhbGlkLWJ0bicpO1xyXG5cdHZhbGlkQnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuXHRcdFxyXG5cdFx0bWlkaVRvQ2hvcmQucGFyc2UoZmlsZUlucHV0LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2NyZWF0aW5nIHNsaWRlci4uJyk7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdjaG9yZHNNYXA6ICcsIG1pZGlUb0Nob3JkLmNob3Jkc01hcCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdrZXlzTWFwOiAnLCBtaWRpVG9DaG9yZC5rZXlzTWFwKTtcclxuXHRcdFx0c2xpZGVyID0gbmV3IFNsaWRlcihmaWxlSW5wdXQsIGFsbE1lc2hlcywgbWlkaVRvQ2hvcmQua2V5c01hcCk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoL3dpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKTtcclxuXHRjYW1lcmEucG9zaXRpb24ueiA9IDUwO1xyXG5cclxuXHRzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG5cdHNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoIDB4MDAwMDAwICk7XHJcblxyXG5cdHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcclxuXHQvL3JlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xyXG5cdHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcblxyXG5cdG9yYml0Q29udHJvbHMgPSBuZXcgVEhSRUUuT3JiaXRDb250cm9scyggY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50ICk7XHJcblx0b3JiaXRDb250cm9scy5taW5EaXN0YW5jZSA9IDU7XHJcblx0b3JiaXRDb250cm9scy5tYXhEaXN0YW5jZSA9IDIwMDtcclxuXHRvcmJpdENvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJO1xyXG5cclxuXHRzY2VuZS5hZGQoIGFtYmllbnRMaWdodCApO1xyXG5cdGNhbWVyYS5hZGQocG9pbnRMaWdodCk7XHJcblx0XHJcblxyXG5cdG1haW5Hcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cdHNjZW5lLmFkZChtYWluR3JvdXApO1xyXG5cdG1haW5Hcm91cC5hZGQoZ2xvYmFsTGlnaHRzKTtcclxuXHRtYWluR3JvdXAuYWRkKGFsbE1lc2hlcy5tZXNoR3JvdXApO1xyXG5cclxuXHRzdGF0cyA9IG5ldyBTdGF0cygpO1xyXG5cdC8vY29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XHJcblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKCByZW5kZXJlci5kb21FbGVtZW50ICk7XHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplLCBmYWxzZSApO1xyXG5cclxuXHRmdW5jdGlvbiBhbmltYXRlKCkge1xyXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBhbmltYXRlICk7XHJcblx0XHRyZW5kZXIoKTtcclxuXHRcdHN0YXRzLnVwZGF0ZSgpO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiByZW5kZXIoKSB7XHJcblx0XHRyZW5kZXJlci5yZW5kZXIoIHNjZW5lLCBjYW1lcmEgKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xyXG5cdFx0d2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XHJcblx0XHR3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XHJcblx0XHRjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblx0XHRjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG5cdFx0cmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xyXG5cdH1cclxuXHJcblx0YW5pbWF0ZSgpO1x0XHJcbn1cclxuIiwiLyoqXG4qIENvbnZlcnQgRnJvbS9UbyBCaW5hcnkvRGVjaW1hbC9IZXhhZGVjaW1hbCBpbiBKYXZhU2NyaXB0XG4qIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2ZhaXNhbG1hblxuKlxuKiBDb3B5cmlnaHQgMjAxMi0yMDE1LCBGYWlzYWxtYW4gPGZ5emxtYW5AZ21haWwuY29tPlxuKiBMaWNlbnNlZCB1bmRlciBUaGUgTUlUIExpY2Vuc2VcbiogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuKi9cblxuKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgQ29udmVydEJhc2UgPSBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmcm9tIDogZnVuY3Rpb24gKGJhc2VGcm9tKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdG8gOiBmdW5jdGlvbiAoYmFzZVRvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQobnVtLCBiYXNlRnJvbSkudG9TdHJpbmcoYmFzZVRvKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcbiAgICAgICAgXG4gICAgLy8gYmluYXJ5IHRvIGRlY2ltYWxcbiAgICBDb252ZXJ0QmFzZS5iaW4yZGVjID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICByZXR1cm4gQ29udmVydEJhc2UobnVtKS5mcm9tKDIpLnRvKDEwKTtcbiAgICB9O1xuICAgIFxuICAgIC8vIGJpbmFyeSB0byBoZXhhZGVjaW1hbFxuICAgIENvbnZlcnRCYXNlLmJpbjJoZXggPSBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgIHJldHVybiBDb252ZXJ0QmFzZShudW0pLmZyb20oMikudG8oMTYpO1xuICAgIH07XG4gICAgXG4gICAgLy8gZGVjaW1hbCB0byBiaW5hcnlcbiAgICBDb252ZXJ0QmFzZS5kZWMyYmluID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICByZXR1cm4gQ29udmVydEJhc2UobnVtKS5mcm9tKDEwKS50bygyKTtcbiAgICB9O1xuICAgIFxuICAgIC8vIGRlY2ltYWwgdG8gaGV4YWRlY2ltYWxcbiAgICBDb252ZXJ0QmFzZS5kZWMyaGV4ID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICByZXR1cm4gQ29udmVydEJhc2UobnVtKS5mcm9tKDEwKS50bygxNik7XG4gICAgfTtcbiAgICBcbiAgICAvLyBoZXhhZGVjaW1hbCB0byBiaW5hcnlcbiAgICBDb252ZXJ0QmFzZS5oZXgyYmluID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICByZXR1cm4gQ29udmVydEJhc2UobnVtKS5mcm9tKDE2KS50bygyKTtcbiAgICB9O1xuICAgIFxuICAgIC8vIGhleGFkZWNpbWFsIHRvIGRlY2ltYWxcbiAgICBDb252ZXJ0QmFzZS5oZXgyZGVjID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICByZXR1cm4gQ29udmVydEJhc2UobnVtKS5mcm9tKDE2KS50bygxMCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLkNvbnZlcnRCYXNlID0gQ29udmVydEJhc2U7XG4gICAgXG59KSh0aGlzKTtcblxuLypcbiogVXNhZ2UgZXhhbXBsZTpcbiogQ29udmVydEJhc2UuYmluMmRlYygnMTExJyk7IC8vICc3J1xuKiBDb252ZXJ0QmFzZS5kZWMyaGV4KCc0MicpOyAvLyAnMmEnXG4qIENvbnZlcnRCYXNlLmhleDJiaW4oJ2Y4Jyk7IC8vICcxMTExMTAwMCdcbiogQ29udmVydEJhc2UuZGVjMmJpbignMjInKTsgLy8gJzEwMTEwJ1xuKi9cbiIsIi8qXHJcbiAgICBQcm9qZWN0IE5hbWU6IG1pZGktcGFyc2VyLWpzXHJcbiAgICBBdXRob3I6IGNvbHhpXHJcbiAgICBBdXRob3IgVVJJOiBodHRwOi8vd3d3LmNvbHhpLmluZm8vXHJcbiAgICBEZXNjcmlwdGlvbjogTUlESVBhcnNlciBsaWJyYXJ5IHJlYWRzIC5NSUQgYmluYXJ5IGZpbGVzLCBCYXNlNjQgZW5jb2RlZCBNSURJIERhdGEsXHJcbiAgICBvciBVSW50OCBBcnJheXMsIGFuZCBvdXRwdXRzIGFzIGEgcmVhZGFibGUgYW5kIHN0cnVjdHVyZWQgSlMgb2JqZWN0LlxyXG5cclxuICAgIC0tLSAgICAgVXNhZ2UgTWV0aG9kcyAgICAgIC0tLVxyXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgKiBPUFRJT04gMSBORVchIChNSURJUGFyc2VyLnBhcnNlKVxyXG4gICAgV2lsbCBhdXRvZGV0ZWN0IHRoZSBzb3VyY2UgYW5kIHByb2NjZXNzIHRoZSBkYXRhLCB1c2luZyB0aGUgc3VpdGFibGUgbWV0aG9kLlxyXG5cclxuICAgICogT1BUSU9OIDIgKE1JRElQYXJzZXIuYWRkTGlzdGVuZXIpXHJcbiAgICBJTlBVVCBFTEVNRU5UIExJU1RFTkVSIDogY2FsbCBNSURJUGFyc2VyLmFkZExpc3RlbmVyKGZpbGVJbnB1dEVsZW1lbnQsY2FsbGJhY0Z1bmN0aW9uKSBmdW5jdGlvbiwgc2V0dGluZyB0aGVcclxuICAgIElucHV0IEZpbGUgSFRNTCBlbGVtZW50IHRoYXQgd2lsbCBoYW5kbGUgdGhlIGZpbGUubWlkIG9wZW5pbmcsIGFuZCBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgdGhhdCB3aWxsIHJlY2lldmUgdGhlIHJlc3VsdGluZyBPYmplY3QgZm9ybWF0ZWQsIHNldCBvZiBkYXRhLlxyXG5cclxuICAgICogT1BUSU9OIDMgKE1JRElQYXJzZXIuVWludDgpXHJcbiAgICBQcm92aWRlIHlvdXIgb3duIFVJbnQ4IEFycmF5IHRvIE1JRElQYXJzZXIuVWludDgoKSwgdG8gZ2V0IGFuIE9iamVjdCBmb3JtYXRlZCwgc2V0IG9mIGRhdGFcclxuXHJcbiAgICAqIE9QVElPTiA0IChNSURJUGFyc2VyLkJhc2U2NClcclxuICAgIFByb3ZpZGUgYSBCYXNlNjQgZW5jb2RlZCBEYXRhIHRvIE1JRElQYXJzZXIuQmFzZTY0KCksICwgdG8gZ2V0IGFuIE9iamVjdCBmb3JtYXRlZCwgc2V0IG9mIGRhdGFcclxuXHJcblxyXG4gICAgLS0tICBPdXRwdXQgT2JqZWN0IFNwZWNzICAgLS0tXHJcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBNSURJT2JqZWN0e1xyXG4gICAgICAgIGZvcm1hdFR5cGU6IDB8MXwyLCAgICAgICAgICAgICAgICAgIC8vIE1pZGkgZm9ybWF0IHR5cGVcclxuICAgICAgICB0aW1lRGl2aXNpb246IChpbnQpLCAgICAgICAgICAgICAgICAvLyBzb25nIHRlbXBvIChicG0pXHJcbiAgICAgICAgdHJhY2tzOiAoaW50KSwgICAgICAgICAgICAgICAgICAgICAgLy8gdG90YWwgdHJhY2tzIGNvdW50XHJcbiAgICAgICAgdHJhY2s6IEFycmF5W1xyXG4gICAgICAgICAgICBbMF06IE9iamVjdHsgICAgICAgICAgICAgICAgICAgIC8vIFRSQUNLIDEhXHJcbiAgICAgICAgICAgICAgICBldmVudDogQXJyYXlbICAgICAgICAgICAgICAgLy8gTWlkaSBldmVudHMgaW4gdHJhY2sgMVxyXG4gICAgICAgICAgICAgICAgICAgIFswXSA6IE9iamVjdHsgICAgICAgICAgIC8vIEVWRU5UIDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogKHN0cmluZyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhVGltZTogKGludCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFUeXBlOiAoaW50KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogKGludCksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBbMV0gOiBPYmplY3R7Li4ufSAgICAgICAvLyBFVkVOVCAyXHJcbiAgICAgICAgICAgICAgICAgICAgWzJdIDogT2JqZWN0ey4uLn0gICAgICAgLy8gRVZFTlQgM1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLlxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBbMV0gOiBPYmplY3R7Li4ufVxyXG4gICAgICAgICAgICBbMl0gOiBPYmplY3R7Li4ufVxyXG4gICAgICAgICAgICAuLi5cclxuICAgICAgICBdXHJcbiAgICB9XHJcblxyXG5EYXRhIGZyb20gRXZlbnQgMTIgb2YgVHJhY2sgMiBjb3VsZCBiZSBlYXNpbGx5IHJlYWRlZCB3aXRoOlxyXG5PdXRwdXRPYmplY3QudHJhY2tbMl0uZXZlbnRbMTJdLmRhdGE7XHJcblxyXG4qL1xyXG5cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIENST1NTQlJPV1NFUiAmIE5PREVqcyBQT0xZRklMTCBmb3IgQVRPQigpIC0gQnk6IGh0dHBzOi8vZ2l0aHViLmNvbS9NYXhBcnQyNTAxIChtb2RpZmllZClcclxuY29uc3QgX2F0b2IgPSBmdW5jdGlvbihzdHJpbmcpIHtcclxuICAgIC8vIGJhc2U2NCBjaGFyYWN0ZXIgc2V0LCBwbHVzIHBhZGRpbmcgY2hhcmFjdGVyICg9KVxyXG4gICAgbGV0IGI2NCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XHJcbiAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb24gdG8gY2hlY2sgZm9ybWFsIGNvcnJlY3RuZXNzIG9mIGJhc2U2NCBlbmNvZGVkIHN0cmluZ3NcclxuICAgIGxldCBiNjRyZSA9IC9eKD86W0EtWmEtelxcZCtcXC9dezR9KSo/KD86W0EtWmEtelxcZCtcXC9dezJ9KD86PT0pP3xbQS1aYS16XFxkK1xcL117M309Pyk/JC87XHJcbiAgICAvLyByZW1vdmUgZGF0YSB0eXBlIHNpZ25hdHVyZXMgYXQgdGhlIGJlZ2luaW5nIG9mIHRoZSBzdHJpbmdcclxuICAgIC8vIGVnIDogIFwiZGF0YTphdWRpby9taWQ7YmFzZTY0LFwiXHJcbiAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSggL14uKj9iYXNlNjQsLyAsICcnKTtcclxuICAgIC8vIGF0b2IgY2FuIHdvcmsgd2l0aCBzdHJpbmdzIHdpdGggd2hpdGVzcGFjZXMsIGV2ZW4gaW5zaWRlIHRoZSBlbmNvZGVkIHBhcnQsXHJcbiAgICAvLyBidXQgb25seSBcXHQsIFxcbiwgXFxmLCBcXHIgYW5kICcgJywgd2hpY2ggY2FuIGJlIHN0cmlwcGVkLlxyXG4gICAgc3RyaW5nID0gU3RyaW5nKHN0cmluZykucmVwbGFjZSgvW1xcdFxcblxcZlxcciBdKy9nLCAnJyk7XHJcbiAgICBpZiAoIWI2NHJlLnRlc3Qoc3RyaW5nKSlcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGYWlsZWQgdG8gZXhlY3V0ZSBfYXRvYigpIDogVGhlIHN0cmluZyB0byBiZSBkZWNvZGVkIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC4nKTtcclxuXHJcbiAgICAvLyBBZGRpbmcgdGhlIHBhZGRpbmcgaWYgbWlzc2luZywgZm9yIHNlbXBsaWNpdHlcclxuICAgIHN0cmluZyArPSAnPT0nLnNsaWNlKDIgLSAoc3RyaW5nLmxlbmd0aCAmIDMpKTtcclxuICAgIGxldCBiaXRtYXAsIHJlc3VsdCA9ICcnO1xyXG4gICAgbGV0IHIxLCByMiwgaSA9IDA7XHJcbiAgICBmb3IgKDsgaSA8IHN0cmluZy5sZW5ndGg7KSB7XHJcbiAgICAgICAgYml0bWFwID0gYjY0LmluZGV4T2Yoc3RyaW5nLmNoYXJBdChpKyspKSA8PCAxOCB8IGI2NC5pbmRleE9mKHN0cmluZy5jaGFyQXQoaSsrKSkgPDwgMTJcclxuICAgICAgICAgICAgICAgIHwgKHIxID0gYjY0LmluZGV4T2Yoc3RyaW5nLmNoYXJBdChpKyspKSkgPDwgNiB8IChyMiA9IGI2NC5pbmRleE9mKHN0cmluZy5jaGFyQXQoaSsrKSkpO1xyXG5cclxuICAgICAgICByZXN1bHQgKz0gcjEgPT09IDY0ID8gU3RyaW5nLmZyb21DaGFyQ29kZShiaXRtYXAgPj4gMTYgJiAyNTUpXHJcbiAgICAgICAgICAgICAgICA6IHIyID09PSA2NCA/IFN0cmluZy5mcm9tQ2hhckNvZGUoYml0bWFwID4+IDE2ICYgMjU1LCBiaXRtYXAgPj4gOCAmIDI1NSlcclxuICAgICAgICAgICAgICAgIDogU3RyaW5nLmZyb21DaGFyQ29kZShiaXRtYXAgPj4gMTYgJiAyNTUsIGJpdG1hcCA+PiA4ICYgMjU1LCBiaXRtYXAgJiAyNTUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbmNvbnN0IE1JRElQYXJzZXIgPSB7XHJcbiAgICAvLyBkZWJ1ZyAoYm9vbCksIHdoZW4gZW5hYmxlZCB3aWxsIGxvZyBpbiBjb25zb2xlIHVuaW1wbGVtZW50ZWQgZXZlbnRzXHJcbiAgICAvLyB3YXJuaW5ncyBhbmQgaW50ZXJuYWwgaGFuZGxlZCBlcnJvcnMuXHJcbiAgICBkZWJ1ZzogZmFsc2UsXHJcblxyXG4gICAgcGFyc2U6IGZ1bmN0aW9uKGlucHV0LCBfY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKGlucHV0IGluc3RhbmNlb2YgVWludDhBcnJheSkgcmV0dXJuIE1JRElQYXJzZXIuVWludDgoaW5wdXQpO1xyXG4gICAgICAgIGVsc2UgaWYodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykgcmV0dXJuIE1JRElQYXJzZXIuQmFzZTY0KGlucHV0KTtcclxuICAgICAgICBlbHNlIGlmKGlucHV0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgaW5wdXQudHlwZSA9PT0gJ2ZpbGUnKSByZXR1cm4gTUlESVBhcnNlci5hZGRMaXN0ZW5lcihpbnB1dCAsIF9jYWxsYmFjayk7XHJcbiAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ01JRElQYXJzZXIucGFyc2UoKSA6IEludmFsaWQgaW5wdXQgcHJvdmlkZWQnKTtcclxuICAgIH0sXHJcbiAgICAvLyBhZGRMaXN0ZW5lcigpIHNob3VsZCBiZSBjYWxsZWQgaW4gb3JkZXIgYXR0YWNoIGEgbGlzdGVuZXIgdG8gdGhlIElOUFVUIEhUTUwgZWxlbWVudFxyXG4gICAgLy8gdGhhdCB3aWxsIHByb3ZpZGUgdGhlIGJpbmFyeSBkYXRhIGF1dG9tYXRpbmcgdGhlIGNvbnZlcnNpb24sIGFuZCByZXR1cm5pbmdcclxuICAgIC8vIHRoZSBzdHJ1Y3R1cmVkIGRhdGEgdG8gdGhlIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG4gICAgYWRkTGlzdGVuZXI6IGZ1bmN0aW9uKF9maWxlRWxlbWVudCwgX2NhbGxiYWNrKXtcclxuICAgICAgICBpZighRmlsZSB8fCAhRmlsZVJlYWRlcikgdGhyb3cgbmV3IEVycm9yKCdUaGUgRmlsZXxGaWxlUmVhZGVyIEFQSXMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyLiBVc2UgaW5zdGVhZCBNSURJUGFyc2VyLkJhc2U2NCgpIG9yIE1JRElQYXJzZXIuVWludDgoKScpO1xyXG5cclxuICAgICAgICAvLyB2YWxpZGF0ZSBwcm92aWRlZCBlbGVtZW50XHJcbiAgICAgICAgaWYoIF9maWxlRWxlbWVudCA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgICAgICEoX2ZpbGVFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8XHJcbiAgICAgICAgICAgIF9maWxlRWxlbWVudC50YWdOYW1lICE9PSAnSU5QVVQnIHx8XHJcbiAgICAgICAgICAgIF9maWxlRWxlbWVudC50eXBlLnRvTG93ZXJDYXNlKCkgIT09ICdmaWxlJyApe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdNSURJUGFyc2VyLmFkZExpc3RlbmVyKCkgOiBQcm92aWRlZCBlbGVtZW50IGlzIG5vdCBhIHZhbGlkIEZJTEUgSU5QVVQgZWxlbWVudCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfY2FsbGJhY2sgPSBfY2FsbGJhY2sgfHwgZnVuY3Rpb24oKXt9O1xyXG5cclxuICAgICAgICBfZmlsZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oSW5wdXRFdnQpeyAgICAgICAgICAgICAvLyBzZXQgdGhlICdmaWxlIHNlbGVjdGVkJyBldmVudCBoYW5kbGVyXHJcbiAgICAgICAgICAgIGlmICghSW5wdXRFdnQudGFyZ2V0LmZpbGVzLmxlbmd0aCkgcmV0dXJuIGZhbHNlOyAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIGZhbHNlIGlmIG5vIGVsZW1lbnRzIHdoZXJlIHNlbGVjdGVkXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNSURJUGFyc2VyLmFkZExpc3RlbmVyKCkgOiBGaWxlIGRldGVjdGVkIGluIElOUFVUIEVMRU1FTlQgcHJvY2Vzc2luZyBkYXRhLi4nKTtcclxuICAgICAgICAgICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwcmVwYXJlIHRoZSBmaWxlIFJlYWRlclxyXG4gICAgICAgICAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoSW5wdXRFdnQudGFyZ2V0LmZpbGVzWzBdKTsgICAgICAgICAgICAgICAgIC8vIHJlYWQgdGhlIGJpbmFyeSBkYXRhXHJcbiAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICBfY2FsbGJhY2soIE1JRElQYXJzZXIuVWludDgobmV3IFVpbnQ4QXJyYXkoZS50YXJnZXQucmVzdWx0KSkpOyAgLy8gZW5jb2RlIGRhdGEgd2l0aCBVaW50OEFycmF5IGFuZCBjYWxsIHRoZSBwYXJzZXJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY29udmVydCBiYXNldDQgc3RyaW5nIGludG8gdWludDggYXJyYXkgYnVmZmVyLCBiZWZvcmUgcGVyZm9ybWluZyB0aGVcclxuICAgIC8vIHBhcnNpbmcgc3Vicm91dGluZS5cclxuICAgIEJhc2U2NCA6IGZ1bmN0aW9uKGI2NFN0cmluZyl7XHJcbiAgICAgICAgYjY0U3RyaW5nID0gU3RyaW5nKGI2NFN0cmluZyk7XHJcblxyXG4gICAgICAgIGxldCByYXcgPSBfYXRvYihiNjRTdHJpbmcpO1xyXG4gICAgICAgIGxldCByYXdMZW5ndGggPSByYXcubGVuZ3RoO1xyXG4gICAgICAgIGxldCB0X2FycmF5ID0gbmV3IFVpbnQ4QXJyYXkobmV3IEFycmF5QnVmZmVyKHJhd0xlbmd0aCkpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxyYXdMZW5ndGg7IGkrKykgdF9hcnJheVtpXSA9IHJhdy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIHJldHVybiAgTUlESVBhcnNlci5VaW50OCh0X2FycmF5KSA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHBhcnNlKCkgZnVuY3Rpb24gcmVhZHMgdGhlIGJpbmFyeSBkYXRhLCBpbnRlcnByZXRpbmcgYW5kIHNwbGl0aW5nIGVhY2ggY2h1Y2tcclxuICAgIC8vIGFuZCBwYXJzaW5nIGl0IHRvIGEgc3RydWN0dXJlZCBPYmplY3QuIFdoZW4gam9iIGlzIGZpbmlzZWQgcmV0dXJucyB0aGUgb2JqZWN0XHJcbiAgICAvLyBvciAnZmFsc2UnIGlmIGFueSBlcnJvciB3YXMgZ2VuZXJhdGVkLlxyXG4gICAgVWludDg6IGZ1bmN0aW9uKEZpbGVBc1VpbnQ4QXJyYXkpe1xyXG4gICAgICAgIGxldCBmaWxlID0ge1xyXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxyXG4gICAgICAgICAgICBwb2ludGVyOiAwLFxyXG4gICAgICAgICAgICBtb3ZlUG9pbnRlcjogZnVuY3Rpb24oX2J5dGVzKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1vdmUgdGhlIHBvaW50ZXIgbmVnYXRpdmUgYW5kIHBvc2l0aXZlIGRpcmVjdGlvblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyICs9IF9ieXRlcztcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBvaW50ZXI7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlYWRJbnQ6IGZ1bmN0aW9uKF9ieXRlcyl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IGludGVnZXIgZnJvbSBuZXh0IF9ieXRlcyBncm91cCAoYmlnLWVuZGlhbilcclxuICAgICAgICAgICAgICAgIF9ieXRlcyA9IE1hdGgubWluKF9ieXRlcywgdGhpcy5kYXRhLmJ5dGVMZW5ndGgtdGhpcy5wb2ludGVyKTtcclxuICAgICAgICAgICAgICAgIGlmIChfYnl0ZXMgPCAxKSByZXR1cm4gLTE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVPRlxyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gMDtcclxuICAgICAgICAgICAgICAgIGlmKF9ieXRlcyA+IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaT0xOyBpPD0gKF9ieXRlcy0xKTsgaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgKz0gdGhpcy5kYXRhLmdldFVpbnQ4KHRoaXMucG9pbnRlcikgKiBNYXRoLnBvdygyNTYsIChfYnl0ZXMgLSBpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlcisrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbHVlICs9IHRoaXMuZGF0YS5nZXRVaW50OCh0aGlzLnBvaW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyKys7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlYWRTdHI6IGZ1bmN0aW9uKF9ieXRlcyl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVhZCBhcyBBU0NJSSBjaGFycywgdGhlIGZvbGxvd29pbmcgX2J5dGVzXHJcbiAgICAgICAgICAgICAgICBsZXQgdGV4dCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBjaGFyPTE7IGNoYXIgPD0gX2J5dGVzOyBjaGFyKyspIHRleHQgKz0gIFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5yZWFkSW50KDEpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZWFkSW50VkxWOiBmdW5jdGlvbigpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlYWQgYSB2YXJpYWJsZSBsZW5ndGggdmFsdWVcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMucG9pbnRlciA+PSB0aGlzLmRhdGEuYnl0ZUxlbmd0aCApe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVPRlxyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5kYXRhLmdldFVpbnQ4KHRoaXMucG9pbnRlcikgPCAxMjgpeyAgICAgICAgICAgICAgIC8vIC4uLnZhbHVlIGluIGEgc2luZ2xlIGJ5dGVcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMucmVhZEludCgxKTtcclxuICAgICAgICAgICAgICAgIH1lbHNleyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAuLi52YWx1ZSBpbiBtdWx0aXBsZSBieXRlc1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBGaXJzdEJ5dGVzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUodGhpcy5kYXRhLmdldFVpbnQ4KHRoaXMucG9pbnRlcikgPj0gMTI4KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRmlyc3RCeXRlcy5wdXNoKHRoaXMucmVhZEludCgxKSAtIDEyOCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsYXN0Qnl0ZSAgPSB0aGlzLnJlYWRJbnQoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBkdCA9IDE7IGR0IDw9IEZpcnN0Qnl0ZXMubGVuZ3RoOyBkdCsrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgKz0gRmlyc3RCeXRlc1tGaXJzdEJ5dGVzLmxlbmd0aCAtIGR0XSAqIE1hdGgucG93KDEyOCwgZHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSArPSBsYXN0Qnl0ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZpbGUuZGF0YSA9IG5ldyBEYXRhVmlldyhGaWxlQXNVaW50OEFycmF5LmJ1ZmZlciwgRmlsZUFzVWludDhBcnJheS5ieXRlT2Zmc2V0LCBGaWxlQXNVaW50OEFycmF5LmJ5dGVMZW5ndGgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gOCBiaXRzIGJ5dGVzIGZpbGUgZGF0YSBhcnJheVxyXG4gICAgICAgIC8vICAqKiByZWFkIEZJTEUgSEVBREVSXHJcbiAgICAgICAgaWYoZmlsZS5yZWFkSW50KDQpICE9PSAweDRENTQ2ODY0KXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdIZWFkZXIgdmFsaWRhdGlvbiBmYWlsZWQgKG5vdCBNSURJIHN0YW5kYXJkIG9yIGZpbGUgY29ycnVwdC4pJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGVhZGVyIHZhbGlkYXRpb24gZmFpbGVkIChub3QgTUlESSBzdGFuZGFyZCBvciBmaWxlIGNvcnJ1cHQuKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaGVhZGVyU2l6ZSAgICAgICAgICA9IGZpbGUucmVhZEludCg0KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBoZWFkZXIgc2l6ZSAodW51c2VkIHZhciksIGdldHRlZCBqdXN0IGZvciByZWFkIHBvaW50ZXIgbW92ZW1lbnRcclxuICAgICAgICBsZXQgTUlESSAgICAgICAgICAgICAgICA9IHt9OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgbmV3IG1pZGkgb2JqZWN0XHJcbiAgICAgICAgTUlESS5mb3JtYXRUeXBlICAgICAgICAgPSBmaWxlLnJlYWRJbnQoMik7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IE1JREkgRm9ybWF0IFR5cGVcclxuICAgICAgICBNSURJLnRyYWNrcyAgICAgICAgICAgICA9IGZpbGUucmVhZEludCgyKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgYW1tb3VudCBvZiB0cmFjayBjaHVua3NcclxuICAgICAgICBNSURJLnRyYWNrICAgICAgICAgICAgICA9IFtdOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgYXJyYXkga2V5IGZvciB0cmFjayBkYXRhIHN0b3JpbmdcclxuICAgICAgICBsZXQgdGltZURpdmlzaW9uQnl0ZTEgICA9IGZpbGUucmVhZEludCgxKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgVGltZSBEaXZpc2lvbiBmaXJzdCBieXRlXHJcbiAgICAgICAgbGV0IHRpbWVEaXZpc2lvbkJ5dGUyICAgPSBmaWxlLnJlYWRJbnQoMSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IFRpbWUgRGl2aXNpb24gc2Vjb25kIGJ5dGVcclxuICAgICAgICBpZih0aW1lRGl2aXNpb25CeXRlMSA+PSAxMjgpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkaXNjb3ZlciBUaW1lIERpdmlzaW9uIG1vZGUgKGZwcyBvciB0cGYpXHJcbiAgICAgICAgICAgIE1JREkudGltZURpdmlzaW9uICAgID0gW107XHJcbiAgICAgICAgICAgIE1JREkudGltZURpdmlzaW9uWzBdID0gdGltZURpdmlzaW9uQnl0ZTEgLSAxMjg7ICAgICAgICAgICAgICAgICAgICAgLy8gZnJhbWVzIHBlciBzZWNvbmQgTU9ERSAgKDFzdCBieXRlKVxyXG4gICAgICAgICAgICBNSURJLnRpbWVEaXZpc2lvblsxXSA9IHRpbWVEaXZpc2lvbkJ5dGUyOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRpY2tzIGluIGVhY2ggZnJhbWUgICAgICgybmQgYnl0ZSlcclxuICAgICAgICB9ZWxzZSBNSURJLnRpbWVEaXZpc2lvbiAgPSAodGltZURpdmlzaW9uQnl0ZTEgKiAyNTYpICsgdGltZURpdmlzaW9uQnl0ZTI7Ly8gZWxzZS4uLiB0aWNrcyBwZXIgYmVhdCBNT0RFICAoMiBieXRlcyB2YWx1ZSlcclxuXHJcbiAgICAgICAgLy8gICoqIHJlYWQgVFJBQ0sgQ0hVTktcclxuICAgICAgICBmb3IobGV0IHQ9MTsgdCA8PSBNSURJLnRyYWNrczsgdCsrKXtcclxuICAgICAgICAgICAgTUlESS50cmFja1t0LTFdICAgICA9IHtldmVudDogW119OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgbmV3IFRyYWNrIGVudHJ5IGluIEFycmF5XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJWYWxpZGF0aW9uID0gZmlsZS5yZWFkSW50KDQpO1xyXG4gICAgICAgICAgICBpZiAoIGhlYWRlclZhbGlkYXRpb24gPT09IC0xICkgYnJlYWs7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVPRlxyXG4gICAgICAgICAgICBpZihoZWFkZXJWYWxpZGF0aW9uICE9PSAweDRENTQ3MjZCKSByZXR1cm4gZmFsc2U7ICAgICAgICAgICAgICAgICAgIC8vIFRyYWNrIGNodW5rIGhlYWRlciB2YWxpZGF0aW9uIGZhaWxlZC5cclxuICAgICAgICAgICAgZmlsZS5yZWFkSW50KDQpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtb3ZlIHBvaW50ZXIuIGdldCBjaHVuayBzaXplIChieXRlcyBsZW5ndGgpXHJcbiAgICAgICAgICAgIGxldCBlICAgICAgICAgICAgICAgPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5pdCBldmVudCBjb3VudGVyXHJcbiAgICAgICAgICAgIGxldCBlbmRPZlRyYWNrICAgICAgPSBmYWxzZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRkxBRyBmb3IgdHJhY2sgcmVhZGluZyBzZWN1ZW5jZSBicmVha2luZ1xyXG4gICAgICAgICAgICAvLyAqKiByZWFkIEVWRU5UIENIVU5LXHJcbiAgICAgICAgICAgIGxldCBzdGF0dXNCeXRlO1xyXG4gICAgICAgICAgICBsZXQgbGFzdHN0YXR1c0J5dGU7XHJcbiAgICAgICAgICAgIHdoaWxlKCFlbmRPZlRyYWNrKXtcclxuICAgICAgICAgICAgICAgIGUrKzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbmNyZWFzZSBieSAxIGV2ZW50IGNvdW50ZXJcclxuICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdID0ge307ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgbmV3IGV2ZW50IG9iamVjdCwgaW4gZXZlbnRzIGFycmF5XHJcbiAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kZWx0YVRpbWUgID0gZmlsZS5yZWFkSW50VkxWKCk7ICAgICAgLy8gZ2V0IERFTFRBIFRJTUUgT0YgTUlESSBldmVudCAoVmFyaWFibGUgTGVuZ3RoIFZhbHVlKVxyXG4gICAgICAgICAgICAgICAgc3RhdHVzQnl0ZSA9IGZpbGUucmVhZEludCgxKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlYWQgRVZFTlQgVFlQRSAoU1RBVFVTIEJZVEUpXHJcbiAgICAgICAgICAgICAgICBpZihzdGF0dXNCeXRlID09PSAtMSkgYnJlYWs7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRU9GXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHN0YXR1c0J5dGUgPj0gMTI4KSBsYXN0c3RhdHVzQnl0ZSA9IHN0YXR1c0J5dGU7ICAgICAgICAgLy8gTkVXIFNUQVRVUyBCWVRFIERFVEVDVEVEXHJcbiAgICAgICAgICAgICAgICBlbHNleyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJ1JVTk5JTkcgU1RBVFVTJyBzaXR1YXRpb24gZGV0ZWN0ZWRcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNCeXRlID0gbGFzdHN0YXR1c0J5dGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcHBseSBsYXN0IGxvb3AsIFN0YXR1cyBCeXRlXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZS5tb3ZlUG9pbnRlcigtMSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbW92ZSBiYWNrIHRoZSBwb2ludGVyIChjYXVzZSByZWFkZWQgYnl0ZSBpcyBub3Qgc3RhdHVzIGJ5dGUpXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAqKiBJUyBNRVRBIEVWRU5UXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgaWYoc3RhdHVzQnl0ZSA9PT0gMHhGRil7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ldGEgRXZlbnQgdHlwZVxyXG4gICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLnR5cGUgPSAweEZGOyAgICAgICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBtZXRhRXZlbnQgY29kZSB0byBhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLm1ldGFUeXBlID0gIGZpbGUucmVhZEludCgxKTsgICAgIC8vIGFzc2lnbiBtZXRhRXZlbnQgc3VidHlwZVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtZXRhRXZlbnRMZW5ndGggPSBmaWxlLnJlYWRJbnRWTFYoKTsgICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgbWV0YUV2ZW50IGxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaChNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5tZXRhVHlwZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHgyRjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZW5kIG9mIHRyYWNrLCBoYXMgbm8gZGF0YSBieXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRU9GXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRPZlRyYWNrID0gdHJ1ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hhbmdlIEZMQUcgdG8gZm9yY2UgdHJhY2sgcmVhZGluZyBsb29wIGJyZWFraW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDAxOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUZXh0IEV2ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHgwMjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29weXJpZ2h0IE5vdGljZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDM6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlcXVlbmNlL1RyYWNrIE5hbWUgKGRvY3VtZW50YXRpb246IGh0dHA6Ly93d3cudGE3LmRlL3R4dC9tdXNpay9tdXNpMDAwNi5odG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHgwNjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFya2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkU3RyKG1ldGFFdmVudExlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDIxOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNSURJIFBPUlRcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDU5OiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLZXkgU2lnbmF0dXJlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHg1MTogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2V0IFRlbXBvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkSW50KG1ldGFFdmVudExlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDU0OiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTTVBURSBPZmZzZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgICAgPSBbXTsgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbMF0gPSBmaWxlLnJlYWRJbnQoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzFdID0gZmlsZS5yZWFkSW50KDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVsyXSA9IGZpbGUucmVhZEludCgxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbM10gPSBmaWxlLnJlYWRJbnQoMSk7ICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbNF0gPSBmaWxlLnJlYWRJbnQoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDU4OiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaW1lIFNpZ25hdHVyZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSAgICA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVswXSA9IGZpbGUucmVhZEludCgxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbMV0gPSBmaWxlLnJlYWRJbnQoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzJdID0gZmlsZS5yZWFkSW50KDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVszXSA9IGZpbGUucmVhZEludCgxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHVzZXIgcHJvdmlkZWQgYSBjdXN0b20gaW50ZXJwcmV0ZXIsIGNhbGwgaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCBhc3NpZ24gdG8gZXZlbnQgdGhlIHJldHVybmVkIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmN1c3RvbUludGVycHJldGVyICE9PSBudWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gdGhpcy5jdXN0b21JbnRlcnByZXRlciggTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0ubWV0YVR5cGUsIGZpbGUsIG1ldGFFdmVudExlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBubyBjdXN0b21JbnRlcnByZXRyIGlzIHByb3ZpZGVkLCBvciByZXR1cm5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFsc2UgKD1hcHBseSBkZWZhdWx0KSwgcGVyZm9ybSBkZWZhdWx0IGFjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5jdXN0b21JbnRlcnByZXRlciA9PT0gbnVsbCB8fCBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID09PSBmYWxzZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZS5yZWFkSW50KG1ldGFFdmVudExlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IGZpbGUucmVhZEludChtZXRhRXZlbnRMZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYnVnKSBjb25zb2xlLmluZm8oJ1VuaW1wbGVtZW50ZWQgMHhGRiBtZXRhIGV2ZW50ISBkYXRhIGJsb2NrIHJlYWRlZCBhcyBJbnRlZ2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyBJUyBSRUdVTEFSIEVWRU5UXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgZWxzZXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTUlESSBDb250cm9sIEV2ZW50cyBPUiBTeXN0ZW0gRXhjbHVzaXZlIEV2ZW50c1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c0J5dGUgPSBzdGF0dXNCeXRlLnRvU3RyaW5nKDE2KS5zcGxpdCgnJyk7ICAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBzdGF0dXMgYnl0ZSBIRVggcmVwcmVzZW50YXRpb24sIHRvIG9idGFpbiA0IGJpdHMgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIXN0YXR1c0J5dGVbMV0pIHN0YXR1c0J5dGUudW5zaGlmdCgnMCcpOyAgICAgICAgICAgICAgICAgLy8gZm9yY2UgMiBkaWdpdHNcclxuICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS50eXBlID0gcGFyc2VJbnQoc3RhdHVzQnl0ZVswXSwgMTYpOy8vIGZpcnN0IGJ5dGUgaXMgRVZFTlQgVFlQRSBJRFxyXG4gICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmNoYW5uZWwgPSBwYXJzZUludChzdGF0dXNCeXRlWzFdLCAxNik7Ly8gc2Vjb25kIGJ5dGUgaXMgY2hhbm5lbFxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaChNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS50eXBlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweEY6eyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3lzdGVtIEV4Y2x1c2l2ZSBFdmVudHNcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB1c2VyIHByb3ZpZGVkIGEgY3VzdG9tIGludGVycHJldGVyLCBjYWxsIGl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgYXNzaWduIHRvIGV2ZW50IHRoZSByZXR1cm5lZCBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5jdXN0b21JbnRlcnByZXRlciAhPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IHRoaXMuY3VzdG9tSW50ZXJwcmV0ZXIoIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLnR5cGUsIGZpbGUgLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgbm8gY3VzdG9tSW50ZXJwcmV0ciBpcyBwcm92aWRlZCwgb3IgcmV0dXJuZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZhbHNlICg9YXBwbHkgZGVmYXVsdCksIHBlcmZvcm0gZGVmYXVsdCBhY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuY3VzdG9tSW50ZXJwcmV0ZXIgPT09IG51bGwgfHwgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9PT0gZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBldmVudF9sZW5ndGggPSBmaWxlLnJlYWRJbnRWTFYoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkSW50KGV2ZW50X2xlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVidWcpIGNvbnNvbGUuaW5mbygnVW5pbXBsZW1lbnRlZCAweEYgZXhjbHVzaXZlIGV2ZW50cyEgZGF0YSBibG9jayByZWFkZWQgYXMgSW50ZWdlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweEE6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3RlIEFmdGVydG91Y2hcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweEI6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb250cm9sbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHhFOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGl0Y2ggQmVuZCBFdmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4ODogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdGUgb2ZmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHg5OiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90ZSBPblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVswXSA9IGZpbGUucmVhZEludCgxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbMV0gPSBmaWxlLnJlYWRJbnQoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweEM6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcm9ncmFtIENoYW5nZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4RDogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoYW5uZWwgQWZ0ZXJ0b3VjaFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IGZpbGUucmVhZEludCgxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVPRlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kT2ZUcmFjayA9IHRydWU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYW5nZSBGTEFHIHRvIGZvcmNlIHRyYWNrIHJlYWRpbmcgbG9vcCBicmVha2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB1c2VyIHByb3ZpZGVkIGEgY3VzdG9tIGludGVycHJldGVyLCBjYWxsIGl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgYXNzaWduIHRvIGV2ZW50IHRoZSByZXR1cm5lZCBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5jdXN0b21JbnRlcnByZXRlciAhPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IHRoaXMuY3VzdG9tSW50ZXJwcmV0ZXIoIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLm1ldGFUeXBlLCBmaWxlICwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vIGN1c3RvbUludGVycHJldHIgaXMgcHJvdmlkZWQsIG9yIHJldHVybmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmYWxzZSAoPWFwcGx5IGRlZmF1bHQpLCBwZXJmb3JtIGRlZmF1bHQgYWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmN1c3RvbUludGVycHJldGVyID09PSBudWxsIHx8IE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPT09IGZhbHNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVW5rbm93biBFVkVOVCBkZXRlY3RlZC4uLiByZWFkaW5nIGNhbmNlbGxlZCEnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBNSURJO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjdXN0b20gZnVuY3Rpb24gdCBoYW5kbGUgdW5pbXAsZW1lbnRlZCwgb3IgY3VzdG9tIG1pZGkgbWVzc2FnZXMuSWYgbWVzc2FnZVxyXG4gICAgLy8gaXMgYSBtZXRhZXZlbnQsIHRoZSB2YWx1ZSBvZiBtZXRhRXZlbnRMZW5ndGggd2lsbCBiZSA+MC5cclxuICAgIC8vIEZ1bmN0aW9uIG11c3QgcmV0dXJuIHRoZSB2YWx1ZSB0byBzdG9yZSwgYW5kIHBvaW50ZXIgb2YgZGF0YVZpZXcgaW5jcmVzZWRcclxuICAgIC8vIElmIGRlZmF1bHQgYWN0aW9uIHdhbnRzIHRvIGJlIHBlcmZvcm1lZCwgcmV0dXJuIGZhbHNlXHJcbiAgICBjdXN0b21JbnRlcnByZXRlciA6IG51bGwgLy8gZnVuY3Rpb24oIGVfdHlwZSAsIGFycmF5QnlmZmVyLCBtZXRhRXZlbnRMZW5ndGgpeyByZXR1cm4gZV9kYXRhX2ludCB9XHJcbn07XHJcblxyXG5cclxuaWYodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gTUlESVBhcnNlcjtcclxuIiwiZnVuY3Rpb24gTWlkaVRvQ2hvcmRNYXAoKSB7XHJcblx0dGhpcy5jaG9yZHNNYXAgPSBuZXcgTWFwKCk7XHJcblx0dGhpcy5rZXlzTWFwID0gbmV3IE1hcCgpO1xyXG59XHJcblxyXG5NaWRpVG9DaG9yZE1hcC5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbihkb21GaWxlSW5wdXQsIGNhbGxiYWNrKSB7XHJcblx0Y29uc3QgZmlsZSA9IGRvbUZpbGVJbnB1dC5maWxlc1swXTtcclxuXHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHRsZXQgdGhpc09iaiA9IHRoaXM7XHJcblxyXG5cdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRsZXQgdWludDhhcnJheSA9IG5ldyBVaW50OEFycmF5KGUudGFyZ2V0LnJlc3VsdCk7XHJcblx0XHQvLyBsZXQgaGV4QXJyYXkgPSBbXTtcclxuXHRcdC8vIHVpbnQ4YXJyYXkuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuXHRcdC8vIFx0aGV4QXJyYXkucHVzaChDb252ZXJ0QmFzZS5kZWMyaGV4KGVsZW1lbnQpKTtcclxuXHRcdC8vIH0pO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2hleEFycmF5JywgaGV4QXJyYXkpO1xyXG5cdFx0bGV0IHBhcnNlZCA9IE1JRElQYXJzZXIucGFyc2UodWludDhhcnJheSksXHJcblx0XHRcdG9uZVRyYWNrID0gW10sXHJcblx0XHRcdHNvcnRlZE9uZVRyayA9IFtdLFxyXG5cdFx0XHRjdXJyTm90ZXMgPSBbXSxcclxuXHRcdFx0cHJldlRpbWUgPSAtMSxcclxuXHRcdFx0ZXZlbnRUaW1lID0gLTE7XHJcblxyXG5cdFx0cGFyc2VkLnRyYWNrLmZvckVhY2godHJhY2sgPT4ge1xyXG5cdFx0XHRsZXQgY3VyckRlbHRhVGltZSA9IDA7XHJcblxyXG5cdFx0XHR0cmFjay5ldmVudC5mb3JFYWNoKGV2ZW50ID0+IHtcclxuXHRcdFx0XHRjdXJyRGVsdGFUaW1lICs9IGV2ZW50LmRlbHRhVGltZTtcclxuXHJcblx0XHRcdFx0b25lVHJhY2sucHVzaCh7ICdldmVudCc6IGV2ZW50LCAndGltZSc6IGN1cnJEZWx0YVRpbWV9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvL2NvbnNvbGUubG9nKG9uZVRyYWNrLnNvcnQoKGEsYikgPT4gYS50aW1lIC0gYi50aW1lKS5zb3J0KChhLGIpID0+IGEuZXZlbnQudHlwZSAtIGIuZXZlbnQudHlwZSkpO1xyXG5cdFx0c29ydGVkT25lVHJrID0gb25lVHJhY2suc29ydCgoYSxiKSA9PiAoYS50aW1lICsgYS5ldmVudC50eXBlKSAtIChiLnRpbWUgKyBiLmV2ZW50LnR5cGUpKTtcdFxyXG5cclxuXHRcdHNvcnRlZE9uZVRyay5mb3JFYWNoKG9uZVRyRXZlbnQgPT4ge1xyXG5cdFx0XHRsZXQgZXYgPSBvbmVUckV2ZW50LmV2ZW50O1xyXG5cdFx0XHRsZXQgdHlwZSA9IGV2LnR5cGU7XHJcblx0XHRcdGlmKHR5cGUgPT09IDkgfHwgdHlwZSA9PT0gOCkge1xyXG5cdFx0XHRcdGxldCBub3RlID0gZXYuZGF0YVswXSAlIDEyO1xyXG5cdFx0XHRcdGxldCB2ZWxvY2l0eSA9IGV2LmRhdGFbMV07XHJcblx0XHRcdFx0ZXZlbnRUaW1lID0gb25lVHJFdmVudC50aW1lO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmKHByZXZUaW1lID09PSAtMSlcclxuXHRcdFx0XHRcdHByZXZUaW1lID0gZXZlbnRUaW1lO1xyXG5cclxuXHRcdFx0XHRpZihwcmV2VGltZSAhPSBldmVudFRpbWUgJiYgY3Vyck5vdGVzLmxlbmd0aCAhPSAwKSB7XHJcblx0XHRcdFx0XHRsZXQgbm90ZXNBcnJheSA9IEFycmF5LmZyb20obmV3IFNldChjdXJyTm90ZXMpKTtcclxuXHRcdFx0XHRcdGxldCBrZXlzID0gW107XHJcblxyXG5cdFx0XHRcdFx0Zm9yKGxldCBpPTE7IGk8PTM7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRsZXQgZ2VuID0gc3Vic2V0cyhub3Rlc0FycmF5LCBpKTtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBzdWIgb2YgZ2VuKSB7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHN1YkFycmF5ID0gQXJyYXkuZnJvbShzdWIpO1xyXG5cdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ3N1YkFycmF5JyxzdWJBcnJheSk7XHJcblx0XHRcdFx0XHRcdFx0bGV0IGtleSA9IGtleUZyb21QdEFycmF5KHN1YkFycmF5KTtcclxuXHRcdFx0XHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9sZXQgc29ydGVkID0gbm90ZXNBcnJheS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcblxyXG5cdFx0XHRcdFx0dGhpc09iai5jaG9yZHNNYXAuc2V0KGV2ZW50VGltZSwgbm90ZXNBcnJheSk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHRoaXNPYmoua2V5c01hcC5zZXQoZXZlbnRUaW1lLCBrZXlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodHlwZSA9PT0gOCB8fCAodHlwZSA9PT0gOSAmJiB2ZWxvY2l0eSA9PT0gMCkpIHtcclxuXHRcdFx0XHRcdGN1cnJOb3Rlcy5zcGxpY2UoY3Vyck5vdGVzLmluZGV4T2Yobm90ZSksIDEpO1xyXG5cclxuXHRcdFx0XHR9IGVsc2UgaWYodHlwZSA9PT0gOSAmJiB2ZWxvY2l0eSA+IDApIHtcclxuXHRcdFx0XHRcdGN1cnJOb3Rlcy5wdXNoKG5vdGUpO1xyXG5cdFx0XHRcdH0gXHJcblx0XHRcdH1cclxuXHRcdFx0cHJldlRpbWUgPSBldmVudFRpbWU7XHJcblx0XHR9KTtcclxuXHJcblx0XHRjYWxsYmFjaygpO1xyXG5cdH0gXHJcblxyXG5cdHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihmaWxlKTsgXHJcbn0iLCJcclxuXHJcbmZ1bmN0aW9uIHRlc3RweSgpIHtcclxuXHR2YXIgcmVzdWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdCcpLFxyXG4gICAgICAgIHNlbnRfdHh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R4dC1pbnB1dCcpLnZhbHVlO1xyXG5cclxuICAgIHdzLnNlbmQoc2VudF90eHQpO1xyXG5cclxuICAgIHdzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHJlc3VsdC5pbm5lckhUTUwgPSBldmVudC5kYXRhO1xyXG5cclxuICAgICAgICAvKnZhciBtZXNzYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1bCcpWzBdLFxyXG4gICAgICAgICAgICBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSxcclxuICAgICAgICAgICAgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGV2ZW50LmRhdGEpO1xyXG4gICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcbiAgICAgICAgbWVzc2FnZXMuYXBwZW5kQ2hpbGQobWVzc2FnZSk7Ki9cclxuXHJcbiAgICB9O1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B5dGhvbi10ZXN0JykuYXBwZW5kQ2hpbGQocmVzdWx0KTtcclxufSIsIi8qZnVuY3Rpb24gbWlkaVRvUHkoKSB7XG5cdHZhciBpbnB1dEVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZmlsZS1pbnB1dCcpO1xuXHR2YXIgZmlsZSA9IGlucHV0RWxlbS5maWxlc1swXTtcblx0dmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cblx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2dCkge1xuXHRcdHdzLnNlbmQoZXZ0LnRhcmdldC5yZXN1bHQpO1xuXHR9XG5cblx0cmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG5cblxufVxuXG53cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuXHRjb25zb2xlLmxvZygncGFyc2luZyBqc29uLi4uJyk7XG5cdHZhciBpbnB1dENob3JkcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG5cdGNvbnNvbGUubG9nKCdqc29uIHBhcnNlZCcpO1xuXHRjb25zb2xlLmxvZygnY3JlYXRpbmcgY2hvcmRzJyk7XG5cdGZvcih2YXIgaUNob3JkIGluIGlucHV0Q2hvcmRzKSB7XG5cdFx0dmFyIGNob3JkID0gbmV3IENob3JkKGlucHV0Q2hvcmRzW2lDaG9yZF0pO1xuXHRcdGNob3Jkcy5wdXNoKGNob3JkKTtcblx0fVxuXHRjb25zb2xlLmxvZygnY2hvcmRzIGNyZWF0ZWQnKTtcblxuXHRkcmF3Q2hvcmRzKDUsIDYpO1xufSovIiwiZnVuY3Rpb24gU2xpZGVyKGRvbUVsZW0sIGFsbE1lc2hlcywgY2hvcmRzTWFwKSB7XHJcblx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsaWRlcicpO1xyXG5cdGxldCB0aW1lc0FycmF5ID0gQXJyYXkuZnJvbShjaG9yZHNNYXAua2V5cygpKS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcblx0bGV0IGxvd0JvdW5kID0gdGltZXNBcnJheVswXTtcclxuXHRsZXQgdXBCb3VuZCA9IHRpbWVzQXJyYXlbdGltZXNBcnJheS5sZW5ndGggLSAxXTtcclxuXHRsZXQgdXAgPSB1cEJvdW5kO1xyXG5cdGxldCBsb3cgPSBsb3dCb3VuZDtcclxuXHJcblx0Y29uc29sZS5sb2coJ2Nob3Jkc01hcCcsIGNob3Jkc01hcCk7XHJcblx0Y29uc29sZS5sb2coJ3VwQm91bmQnLCB1cEJvdW5kKTtcclxuXHRjb25zb2xlLmxvZygnbG93Qm91bmQnLCBsb3dCb3VuZCk7XHJcblxyXG5cdGlmKHNsaWRlci5ub1VpU2xpZGVyICE9IG51bGwpXHJcblx0XHRzbGlkZXIubm9VaVNsaWRlci5kZXN0cm95KCk7XHJcblxyXG5cdG5vVWlTbGlkZXIuY3JlYXRlKHNsaWRlciwge1xyXG5cdFx0c3RhcnQ6IFsgMCwgNTAwIF0sXHJcblx0XHRjb25uZWN0OiB0cnVlLFxyXG5cdFx0c3RlcDogMSxcclxuXHRcdHRvb2x0aXBzOiBbIHRydWUsIHRydWUgXSxcclxuXHRcdHJhbmdlOiB7XHJcblx0XHRcdCdtaW4nOiBsb3dCb3VuZCxcclxuXHRcdFx0J21heCc6IHVwQm91bmRcclxuXHRcdH0sXHJcblx0XHRmb3JtYXQ6IHdOdW1iKHtcclxuXHRcdFx0ZGVjaW1hbHM6IDBcclxuXHRcdH0pXHJcblx0fSk7XHJcblxyXG5cdGNvbnNvbGUubG9nKGNob3Jkc01hcCk7XHJcblxyXG5cdHNsaWRlci5ub1VpU2xpZGVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbih2YWx1ZXMsIGhhbmRsZSkge1xyXG5cdFx0bGV0IHZhbHVlID0gdmFsdWVzW2hhbmRsZV07XHJcblx0XHRpZihoYW5kbGUgPT09IDEpIHtcclxuXHRcdFx0dXAgPSBwYXJzZUludCh2YWx1ZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsb3cgPSBwYXJzZUludCh2YWx1ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yKGxldCBtZXNoIG9mIGFsbE1lc2hlcy5tZXNoQnlJZC52YWx1ZXMoKSkge1xyXG5cdFx0XHRtZXNoLnZpc2libGUgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Zm9yKGxldCBpPWxvdzsgaTx1cDsgaSsrKSB7XHJcblx0XHRcdGlmKGNob3Jkc01hcC5oYXMoaSkpIHtcclxuXHRcdFx0XHQvL2FsbE1lc2hlcy5zaG93RnJvbVB0c0FycmF5KGNob3Jkc01hcC5nZXQoaSksIHRydWUpO1xyXG5cdFx0XHRcdGxldCBrZXlzID0gY2hvcmRzTWFwLmdldChpKTtcclxuXHRcdFx0XHRmb3IobGV0IGtleSBvZiBrZXlzKSB7XHJcblx0XHRcdFx0XHRhbGxNZXNoZXMuc2hvd0Zyb21LZXkoa2V5LCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBmb3IobGV0IG1lc2ggb2YgYWxsTWVzaGVzLm1lc2hCeUlkLnZhbHVlcygpKXtcclxuXHRcdC8vIFx0bWVzaC52aXNpYmxlID0gdHJ1ZTtcclxuXHRcdC8vIH1cclxuXHR9KTtcclxuXHJcblxyXG5cdFxyXG59IiwiLyohIG5vdWlzbGlkZXIgLSAxMS4xLjAgLSAyMDE4LTA0LTAyIDExOjE4OjEzICovXG5cbiFmdW5jdGlvbihhKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLGEpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWEoKTp3aW5kb3cubm9VaVNsaWRlcj1hKCl9KGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYShhKXtyZXR1cm5cIm9iamVjdFwiPT10eXBlb2YgYSYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS50byYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS5mcm9tfWZ1bmN0aW9uIGIoYSl7YS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGEpfWZ1bmN0aW9uIGMoYSl7cmV0dXJuIG51bGwhPT1hJiZ2b2lkIDAhPT1hfWZ1bmN0aW9uIGQoYSl7YS5wcmV2ZW50RGVmYXVsdCgpfWZ1bmN0aW9uIGUoYSl7cmV0dXJuIGEuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiF0aGlzW2FdJiYodGhpc1thXT0hMCl9LHt9KX1mdW5jdGlvbiBmKGEsYil7cmV0dXJuIE1hdGgucm91bmQoYS9iKSpifWZ1bmN0aW9uIGcoYSxiKXt2YXIgYz1hLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLGQ9YS5vd25lckRvY3VtZW50LGU9ZC5kb2N1bWVudEVsZW1lbnQsZj1wKGQpO3JldHVybi93ZWJraXQuKkNocm9tZS4qTW9iaWxlL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSYmKGYueD0wKSxiP2MudG9wK2YueS1lLmNsaWVudFRvcDpjLmxlZnQrZi54LWUuY2xpZW50TGVmdH1mdW5jdGlvbiBoKGEpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiBhJiYhaXNOYU4oYSkmJmlzRmluaXRlKGEpfWZ1bmN0aW9uIGkoYSxiLGMpe2M+MCYmKG0oYSxiKSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bihhLGIpfSxjKSl9ZnVuY3Rpb24gaihhKXtyZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4oYSwxMDApLDApfWZ1bmN0aW9uIGsoYSl7cmV0dXJuIEFycmF5LmlzQXJyYXkoYSk/YTpbYV19ZnVuY3Rpb24gbChhKXthPVN0cmluZyhhKTt2YXIgYj1hLnNwbGl0KFwiLlwiKTtyZXR1cm4gYi5sZW5ndGg+MT9iWzFdLmxlbmd0aDowfWZ1bmN0aW9uIG0oYSxiKXthLmNsYXNzTGlzdD9hLmNsYXNzTGlzdC5hZGQoYik6YS5jbGFzc05hbWUrPVwiIFwiK2J9ZnVuY3Rpb24gbihhLGIpe2EuY2xhc3NMaXN0P2EuY2xhc3NMaXN0LnJlbW92ZShiKTphLmNsYXNzTmFtZT1hLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxcXFxcYilcIitiLnNwbGl0KFwiIFwiKS5qb2luKFwifFwiKStcIihcXFxcYnwkKVwiLFwiZ2lcIiksXCIgXCIpfWZ1bmN0aW9uIG8oYSxiKXtyZXR1cm4gYS5jbGFzc0xpc3Q/YS5jbGFzc0xpc3QuY29udGFpbnMoYik6bmV3IFJlZ0V4cChcIlxcXFxiXCIrYitcIlxcXFxiXCIpLnRlc3QoYS5jbGFzc05hbWUpfWZ1bmN0aW9uIHAoYSl7dmFyIGI9dm9pZCAwIT09d2luZG93LnBhZ2VYT2Zmc2V0LGM9XCJDU1MxQ29tcGF0XCI9PT0oYS5jb21wYXRNb2RlfHxcIlwiKTtyZXR1cm57eDpiP3dpbmRvdy5wYWdlWE9mZnNldDpjP2EuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ6YS5ib2R5LnNjcm9sbExlZnQseTpiP3dpbmRvdy5wYWdlWU9mZnNldDpjP2EuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDphLmJvZHkuc2Nyb2xsVG9wfX1mdW5jdGlvbiBxKCl7cmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQ/e3N0YXJ0OlwicG9pbnRlcmRvd25cIixtb3ZlOlwicG9pbnRlcm1vdmVcIixlbmQ6XCJwb2ludGVydXBcIn06d2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkP3tzdGFydDpcIk1TUG9pbnRlckRvd25cIixtb3ZlOlwiTVNQb2ludGVyTW92ZVwiLGVuZDpcIk1TUG9pbnRlclVwXCJ9OntzdGFydDpcIm1vdXNlZG93biB0b3VjaHN0YXJ0XCIsbW92ZTpcIm1vdXNlbW92ZSB0b3VjaG1vdmVcIixlbmQ6XCJtb3VzZXVwIHRvdWNoZW5kXCJ9fWZ1bmN0aW9uIHIoKXt2YXIgYT0hMTt0cnl7dmFyIGI9T2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LFwicGFzc2l2ZVwiLHtnZXQ6ZnVuY3Rpb24oKXthPSEwfX0pO3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidGVzdFwiLG51bGwsYil9Y2F0Y2goYSl7fXJldHVybiBhfWZ1bmN0aW9uIHMoKXtyZXR1cm4gd2luZG93LkNTUyYmQ1NTLnN1cHBvcnRzJiZDU1Muc3VwcG9ydHMoXCJ0b3VjaC1hY3Rpb25cIixcIm5vbmVcIil9ZnVuY3Rpb24gdChhLGIpe3JldHVybiAxMDAvKGItYSl9ZnVuY3Rpb24gdShhLGIpe3JldHVybiAxMDAqYi8oYVsxXS1hWzBdKX1mdW5jdGlvbiB2KGEsYil7cmV0dXJuIHUoYSxhWzBdPDA/YitNYXRoLmFicyhhWzBdKTpiLWFbMF0pfWZ1bmN0aW9uIHcoYSxiKXtyZXR1cm4gYiooYVsxXS1hWzBdKS8xMDArYVswXX1mdW5jdGlvbiB4KGEsYil7Zm9yKHZhciBjPTE7YT49YltjXTspYys9MTtyZXR1cm4gY31mdW5jdGlvbiB5KGEsYixjKXtpZihjPj1hLnNsaWNlKC0xKVswXSlyZXR1cm4gMTAwO3ZhciBkPXgoYyxhKSxlPWFbZC0xXSxmPWFbZF0sZz1iW2QtMV0saD1iW2RdO3JldHVybiBnK3YoW2UsZl0sYykvdChnLGgpfWZ1bmN0aW9uIHooYSxiLGMpe2lmKGM+PTEwMClyZXR1cm4gYS5zbGljZSgtMSlbMF07dmFyIGQ9eChjLGIpLGU9YVtkLTFdLGY9YVtkXSxnPWJbZC0xXTtyZXR1cm4gdyhbZSxmXSwoYy1nKSp0KGcsYltkXSkpfWZ1bmN0aW9uIEEoYSxiLGMsZCl7aWYoMTAwPT09ZClyZXR1cm4gZDt2YXIgZT14KGQsYSksZz1hW2UtMV0saD1hW2VdO3JldHVybiBjP2QtZz4oaC1nKS8yP2g6ZzpiW2UtMV0/YVtlLTFdK2YoZC1hW2UtMV0sYltlLTFdKTpkfWZ1bmN0aW9uIEIoYSxiLGMpe3ZhciBkO2lmKFwibnVtYmVyXCI9PXR5cGVvZiBiJiYoYj1bYl0pLCFBcnJheS5pc0FycmF5KGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncmFuZ2UnIGNvbnRhaW5zIGludmFsaWQgdmFsdWUuXCIpO2lmKGQ9XCJtaW5cIj09PWE/MDpcIm1heFwiPT09YT8xMDA6cGFyc2VGbG9hdChhKSwhaChkKXx8IWgoYlswXSkpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdyYW5nZScgdmFsdWUgaXNuJ3QgbnVtZXJpYy5cIik7Yy54UGN0LnB1c2goZCksYy54VmFsLnB1c2goYlswXSksZD9jLnhTdGVwcy5wdXNoKCFpc05hTihiWzFdKSYmYlsxXSk6aXNOYU4oYlsxXSl8fChjLnhTdGVwc1swXT1iWzFdKSxjLnhIaWdoZXN0Q29tcGxldGVTdGVwLnB1c2goMCl9ZnVuY3Rpb24gQyhhLGIsYyl7aWYoIWIpcmV0dXJuITA7Yy54U3RlcHNbYV09dShbYy54VmFsW2FdLGMueFZhbFthKzFdXSxiKS90KGMueFBjdFthXSxjLnhQY3RbYSsxXSk7dmFyIGQ9KGMueFZhbFthKzFdLWMueFZhbFthXSkvYy54TnVtU3RlcHNbYV0sZT1NYXRoLmNlaWwoTnVtYmVyKGQudG9GaXhlZCgzKSktMSksZj1jLnhWYWxbYV0rYy54TnVtU3RlcHNbYV0qZTtjLnhIaWdoZXN0Q29tcGxldGVTdGVwW2FdPWZ9ZnVuY3Rpb24gRChhLGIsYyl7dGhpcy54UGN0PVtdLHRoaXMueFZhbD1bXSx0aGlzLnhTdGVwcz1bY3x8ITFdLHRoaXMueE51bVN0ZXBzPVshMV0sdGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcD1bXSx0aGlzLnNuYXA9Yjt2YXIgZCxlPVtdO2ZvcihkIGluIGEpYS5oYXNPd25Qcm9wZXJ0eShkKSYmZS5wdXNoKFthW2RdLGRdKTtmb3IoZS5sZW5ndGgmJlwib2JqZWN0XCI9PXR5cGVvZiBlWzBdWzBdP2Uuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBhWzBdWzBdLWJbMF1bMF19KTplLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYVswXS1iWzBdfSksZD0wO2Q8ZS5sZW5ndGg7ZCsrKUIoZVtkXVsxXSxlW2RdWzBdLHRoaXMpO2Zvcih0aGlzLnhOdW1TdGVwcz10aGlzLnhTdGVwcy5zbGljZSgwKSxkPTA7ZDx0aGlzLnhOdW1TdGVwcy5sZW5ndGg7ZCsrKUMoZCx0aGlzLnhOdW1TdGVwc1tkXSx0aGlzKX1mdW5jdGlvbiBFKGIpe2lmKGEoYikpcmV0dXJuITA7dGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdmb3JtYXQnIHJlcXVpcmVzICd0bycgYW5kICdmcm9tJyBtZXRob2RzLlwiKX1mdW5jdGlvbiBGKGEsYil7aWYoIWgoYikpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdzdGVwJyBpcyBub3QgbnVtZXJpYy5cIik7YS5zaW5nbGVTdGVwPWJ9ZnVuY3Rpb24gRyhhLGIpe2lmKFwib2JqZWN0XCIhPXR5cGVvZiBifHxBcnJheS5pc0FycmF5KGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncmFuZ2UnIGlzIG5vdCBhbiBvYmplY3QuXCIpO2lmKHZvaWQgMD09PWIubWlufHx2b2lkIDA9PT1iLm1heCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogTWlzc2luZyAnbWluJyBvciAnbWF4JyBpbiAncmFuZ2UnLlwiKTtpZihiLm1pbj09PWIubWF4KXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncmFuZ2UnICdtaW4nIGFuZCAnbWF4JyBjYW5ub3QgYmUgZXF1YWwuXCIpO2Euc3BlY3RydW09bmV3IEQoYixhLnNuYXAsYS5zaW5nbGVTdGVwKX1mdW5jdGlvbiBIKGEsYil7aWYoYj1rKGIpLCFBcnJheS5pc0FycmF5KGIpfHwhYi5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdzdGFydCcgb3B0aW9uIGlzIGluY29ycmVjdC5cIik7YS5oYW5kbGVzPWIubGVuZ3RoLGEuc3RhcnQ9Yn1mdW5jdGlvbiBJKGEsYil7aWYoYS5zbmFwPWIsXCJib29sZWFuXCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnc25hcCcgb3B0aW9uIG11c3QgYmUgYSBib29sZWFuLlwiKX1mdW5jdGlvbiBKKGEsYil7aWYoYS5hbmltYXRlPWIsXCJib29sZWFuXCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnYW5pbWF0ZScgb3B0aW9uIG11c3QgYmUgYSBib29sZWFuLlwiKX1mdW5jdGlvbiBLKGEsYil7aWYoYS5hbmltYXRpb25EdXJhdGlvbj1iLFwibnVtYmVyXCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnYW5pbWF0aW9uRHVyYXRpb24nIG9wdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiKX1mdW5jdGlvbiBMKGEsYil7dmFyIGMsZD1bITFdO2lmKFwibG93ZXJcIj09PWI/Yj1bITAsITFdOlwidXBwZXJcIj09PWImJihiPVshMSwhMF0pLCEwPT09Ynx8ITE9PT1iKXtmb3IoYz0xO2M8YS5oYW5kbGVzO2MrKylkLnB1c2goYik7ZC5wdXNoKCExKX1lbHNle2lmKCFBcnJheS5pc0FycmF5KGIpfHwhYi5sZW5ndGh8fGIubGVuZ3RoIT09YS5oYW5kbGVzKzEpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdjb25uZWN0JyBvcHRpb24gZG9lc24ndCBtYXRjaCBoYW5kbGUgY291bnQuXCIpO2Q9Yn1hLmNvbm5lY3Q9ZH1mdW5jdGlvbiBNKGEsYil7c3dpdGNoKGIpe2Nhc2VcImhvcml6b250YWxcIjphLm9ydD0wO2JyZWFrO2Nhc2VcInZlcnRpY2FsXCI6YS5vcnQ9MTticmVhaztkZWZhdWx0OnRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnb3JpZW50YXRpb24nIG9wdGlvbiBpcyBpbnZhbGlkLlwiKX19ZnVuY3Rpb24gTihhLGIpe2lmKCFoKGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbWFyZ2luJyBvcHRpb24gbXVzdCBiZSBudW1lcmljLlwiKTtpZigwIT09YiYmKGEubWFyZ2luPWEuc3BlY3RydW0uZ2V0TWFyZ2luKGIpLCFhLm1hcmdpbikpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdtYXJnaW4nIG9wdGlvbiBpcyBvbmx5IHN1cHBvcnRlZCBvbiBsaW5lYXIgc2xpZGVycy5cIil9ZnVuY3Rpb24gTyhhLGIpe2lmKCFoKGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbGltaXQnIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMuXCIpO2lmKGEubGltaXQ9YS5zcGVjdHJ1bS5nZXRNYXJnaW4oYiksIWEubGltaXR8fGEuaGFuZGxlczwyKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbGltaXQnIG9wdGlvbiBpcyBvbmx5IHN1cHBvcnRlZCBvbiBsaW5lYXIgc2xpZGVycyB3aXRoIDIgb3IgbW9yZSBoYW5kbGVzLlwiKX1mdW5jdGlvbiBQKGEsYil7aWYoIWgoYikmJiFBcnJheS5pc0FycmF5KGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncGFkZGluZycgb3B0aW9uIG11c3QgYmUgbnVtZXJpYyBvciBhcnJheSBvZiBleGFjdGx5IDIgbnVtYmVycy5cIik7aWYoQXJyYXkuaXNBcnJheShiKSYmMiE9PWIubGVuZ3RoJiYhaChiWzBdKSYmIWgoYlsxXSkpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdwYWRkaW5nJyBvcHRpb24gbXVzdCBiZSBudW1lcmljIG9yIGFycmF5IG9mIGV4YWN0bHkgMiBudW1iZXJzLlwiKTtpZigwIT09Yil7aWYoQXJyYXkuaXNBcnJheShiKXx8KGI9W2IsYl0pLGEucGFkZGluZz1bYS5zcGVjdHJ1bS5nZXRNYXJnaW4oYlswXSksYS5zcGVjdHJ1bS5nZXRNYXJnaW4oYlsxXSldLCExPT09YS5wYWRkaW5nWzBdfHwhMT09PWEucGFkZGluZ1sxXSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3BhZGRpbmcnIG9wdGlvbiBpcyBvbmx5IHN1cHBvcnRlZCBvbiBsaW5lYXIgc2xpZGVycy5cIik7aWYoYS5wYWRkaW5nWzBdPDB8fGEucGFkZGluZ1sxXTwwKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncGFkZGluZycgb3B0aW9uIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXIocykuXCIpO2lmKGEucGFkZGluZ1swXSthLnBhZGRpbmdbMV0+PTEwMCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IG5vdCBleGNlZWQgMTAwJSBvZiB0aGUgcmFuZ2UuXCIpfX1mdW5jdGlvbiBRKGEsYil7c3dpdGNoKGIpe2Nhc2VcImx0clwiOmEuZGlyPTA7YnJlYWs7Y2FzZVwicnRsXCI6YS5kaXI9MTticmVhaztkZWZhdWx0OnRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnZGlyZWN0aW9uJyBvcHRpb24gd2FzIG5vdCByZWNvZ25pemVkLlwiKX19ZnVuY3Rpb24gUihhLGIpe2lmKFwic3RyaW5nXCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnYmVoYXZpb3VyJyBtdXN0IGJlIGEgc3RyaW5nIGNvbnRhaW5pbmcgb3B0aW9ucy5cIik7dmFyIGM9Yi5pbmRleE9mKFwidGFwXCIpPj0wLGQ9Yi5pbmRleE9mKFwiZHJhZ1wiKT49MCxlPWIuaW5kZXhPZihcImZpeGVkXCIpPj0wLGY9Yi5pbmRleE9mKFwic25hcFwiKT49MCxnPWIuaW5kZXhPZihcImhvdmVyXCIpPj0wO2lmKGUpe2lmKDIhPT1hLmhhbmRsZXMpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdmaXhlZCcgYmVoYXZpb3VyIG11c3QgYmUgdXNlZCB3aXRoIDIgaGFuZGxlc1wiKTtOKGEsYS5zdGFydFsxXS1hLnN0YXJ0WzBdKX1hLmV2ZW50cz17dGFwOmN8fGYsZHJhZzpkLGZpeGVkOmUsc25hcDpmLGhvdmVyOmd9fWZ1bmN0aW9uIFMoYSxiKXtpZighMSE9PWIpaWYoITA9PT1iKXthLnRvb2x0aXBzPVtdO2Zvcih2YXIgYz0wO2M8YS5oYW5kbGVzO2MrKylhLnRvb2x0aXBzLnB1c2goITApfWVsc2V7aWYoYS50b29sdGlwcz1rKGIpLGEudG9vbHRpcHMubGVuZ3RoIT09YS5oYW5kbGVzKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiBtdXN0IHBhc3MgYSBmb3JtYXR0ZXIgZm9yIGFsbCBoYW5kbGVzLlwiKTthLnRvb2x0aXBzLmZvckVhY2goZnVuY3Rpb24oYSl7aWYoXCJib29sZWFuXCIhPXR5cGVvZiBhJiYoXCJvYmplY3RcIiE9dHlwZW9mIGF8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIGEudG8pKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAndG9vbHRpcHMnIG11c3QgYmUgcGFzc2VkIGEgZm9ybWF0dGVyIG9yICdmYWxzZScuXCIpfSl9fWZ1bmN0aW9uIFQoYSxiKXthLmFyaWFGb3JtYXQ9YixFKGIpfWZ1bmN0aW9uIFUoYSxiKXthLmZvcm1hdD1iLEUoYil9ZnVuY3Rpb24gVihhLGIpe2lmKFwic3RyaW5nXCIhPXR5cGVvZiBiJiYhMSE9PWIpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdjc3NQcmVmaXgnIG11c3QgYmUgYSBzdHJpbmcgb3IgYGZhbHNlYC5cIik7YS5jc3NQcmVmaXg9Yn1mdW5jdGlvbiBXKGEsYil7aWYoXCJvYmplY3RcIiE9dHlwZW9mIGIpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdjc3NDbGFzc2VzJyBtdXN0IGJlIGFuIG9iamVjdC5cIik7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGEuY3NzUHJlZml4KXthLmNzc0NsYXNzZXM9e307Zm9yKHZhciBjIGluIGIpYi5oYXNPd25Qcm9wZXJ0eShjKSYmKGEuY3NzQ2xhc3Nlc1tjXT1hLmNzc1ByZWZpeCtiW2NdKX1lbHNlIGEuY3NzQ2xhc3Nlcz1ifWZ1bmN0aW9uIFgoYSl7dmFyIGI9e21hcmdpbjowLGxpbWl0OjAscGFkZGluZzowLGFuaW1hdGU6ITAsYW5pbWF0aW9uRHVyYXRpb246MzAwLGFyaWFGb3JtYXQ6Xyxmb3JtYXQ6X30sZD17c3RlcDp7cjohMSx0OkZ9LHN0YXJ0OntyOiEwLHQ6SH0sY29ubmVjdDp7cjohMCx0Okx9LGRpcmVjdGlvbjp7cjohMCx0OlF9LHNuYXA6e3I6ITEsdDpJfSxhbmltYXRlOntyOiExLHQ6Sn0sYW5pbWF0aW9uRHVyYXRpb246e3I6ITEsdDpLfSxyYW5nZTp7cjohMCx0Okd9LG9yaWVudGF0aW9uOntyOiExLHQ6TX0sbWFyZ2luOntyOiExLHQ6Tn0sbGltaXQ6e3I6ITEsdDpPfSxwYWRkaW5nOntyOiExLHQ6UH0sYmVoYXZpb3VyOntyOiEwLHQ6Un0sYXJpYUZvcm1hdDp7cjohMSx0OlR9LGZvcm1hdDp7cjohMSx0OlV9LHRvb2x0aXBzOntyOiExLHQ6U30sY3NzUHJlZml4OntyOiEwLHQ6Vn0sY3NzQ2xhc3Nlczp7cjohMCx0Old9fSxlPXtjb25uZWN0OiExLGRpcmVjdGlvbjpcImx0clwiLGJlaGF2aW91cjpcInRhcFwiLG9yaWVudGF0aW9uOlwiaG9yaXpvbnRhbFwiLGNzc1ByZWZpeDpcIm5vVWktXCIsY3NzQ2xhc3Nlczp7dGFyZ2V0OlwidGFyZ2V0XCIsYmFzZTpcImJhc2VcIixvcmlnaW46XCJvcmlnaW5cIixoYW5kbGU6XCJoYW5kbGVcIixoYW5kbGVMb3dlcjpcImhhbmRsZS1sb3dlclwiLGhhbmRsZVVwcGVyOlwiaGFuZGxlLXVwcGVyXCIsaG9yaXpvbnRhbDpcImhvcml6b250YWxcIix2ZXJ0aWNhbDpcInZlcnRpY2FsXCIsYmFja2dyb3VuZDpcImJhY2tncm91bmRcIixjb25uZWN0OlwiY29ubmVjdFwiLGNvbm5lY3RzOlwiY29ubmVjdHNcIixsdHI6XCJsdHJcIixydGw6XCJydGxcIixkcmFnZ2FibGU6XCJkcmFnZ2FibGVcIixkcmFnOlwic3RhdGUtZHJhZ1wiLHRhcDpcInN0YXRlLXRhcFwiLGFjdGl2ZTpcImFjdGl2ZVwiLHRvb2x0aXA6XCJ0b29sdGlwXCIscGlwczpcInBpcHNcIixwaXBzSG9yaXpvbnRhbDpcInBpcHMtaG9yaXpvbnRhbFwiLHBpcHNWZXJ0aWNhbDpcInBpcHMtdmVydGljYWxcIixtYXJrZXI6XCJtYXJrZXJcIixtYXJrZXJIb3Jpem9udGFsOlwibWFya2VyLWhvcml6b250YWxcIixtYXJrZXJWZXJ0aWNhbDpcIm1hcmtlci12ZXJ0aWNhbFwiLG1hcmtlck5vcm1hbDpcIm1hcmtlci1ub3JtYWxcIixtYXJrZXJMYXJnZTpcIm1hcmtlci1sYXJnZVwiLG1hcmtlclN1YjpcIm1hcmtlci1zdWJcIix2YWx1ZTpcInZhbHVlXCIsdmFsdWVIb3Jpem9udGFsOlwidmFsdWUtaG9yaXpvbnRhbFwiLHZhbHVlVmVydGljYWw6XCJ2YWx1ZS12ZXJ0aWNhbFwiLHZhbHVlTm9ybWFsOlwidmFsdWUtbm9ybWFsXCIsdmFsdWVMYXJnZTpcInZhbHVlLWxhcmdlXCIsdmFsdWVTdWI6XCJ2YWx1ZS1zdWJcIn19O2EuZm9ybWF0JiYhYS5hcmlhRm9ybWF0JiYoYS5hcmlhRm9ybWF0PWEuZm9ybWF0KSxPYmplY3Qua2V5cyhkKS5mb3JFYWNoKGZ1bmN0aW9uKGYpe2lmKCFjKGFbZl0pJiZ2b2lkIDA9PT1lW2ZdKXtpZihkW2ZdLnIpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdcIitmK1wiJyBpcyByZXF1aXJlZC5cIik7cmV0dXJuITB9ZFtmXS50KGIsYyhhW2ZdKT9hW2ZdOmVbZl0pfSksYi5waXBzPWEucGlwczt2YXIgZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGc9dm9pZCAwIT09Zi5zdHlsZS5tc1RyYW5zZm9ybSxoPXZvaWQgMCE9PWYuc3R5bGUudHJhbnNmb3JtO2IudHJhbnNmb3JtUnVsZT1oP1widHJhbnNmb3JtXCI6Zz9cIm1zVHJhbnNmb3JtXCI6XCJ3ZWJraXRUcmFuc2Zvcm1cIjt2YXIgaT1bW1wibGVmdFwiLFwidG9wXCJdLFtcInJpZ2h0XCIsXCJib3R0b21cIl1dO3JldHVybiBiLnN0eWxlPWlbYi5kaXJdW2Iub3J0XSxifWZ1bmN0aW9uIFkoYSxjLGYpe2Z1bmN0aW9uIGgoYSxiKXt2YXIgYz15YS5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3JldHVybiBiJiZtKGMsYiksYS5hcHBlbmRDaGlsZChjKSxjfWZ1bmN0aW9uIGwoYSxiKXt2YXIgZD1oKGEsYy5jc3NDbGFzc2VzLm9yaWdpbiksZT1oKGQsYy5jc3NDbGFzc2VzLmhhbmRsZSk7cmV0dXJuIGUuc2V0QXR0cmlidXRlKFwiZGF0YS1oYW5kbGVcIixiKSxlLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsXCIwXCIpLGUuc2V0QXR0cmlidXRlKFwicm9sZVwiLFwic2xpZGVyXCIpLGUuc2V0QXR0cmlidXRlKFwiYXJpYS1vcmllbnRhdGlvblwiLGMub3J0P1widmVydGljYWxcIjpcImhvcml6b250YWxcIiksMD09PWI/bShlLGMuY3NzQ2xhc3Nlcy5oYW5kbGVMb3dlcik6Yj09PWMuaGFuZGxlcy0xJiZtKGUsYy5jc3NDbGFzc2VzLmhhbmRsZVVwcGVyKSxkfWZ1bmN0aW9uIHQoYSxiKXtyZXR1cm4hIWImJmgoYSxjLmNzc0NsYXNzZXMuY29ubmVjdCl9ZnVuY3Rpb24gdShhLGIpe3ZhciBkPWgoYixjLmNzc0NsYXNzZXMuY29ubmVjdHMpO2thPVtdLGxhPVtdLGxhLnB1c2godChkLGFbMF0pKTtmb3IodmFyIGU9MDtlPGMuaGFuZGxlcztlKyspa2EucHVzaChsKGIsZSkpLHRhW2VdPWUsbGEucHVzaCh0KGQsYVtlKzFdKSl9ZnVuY3Rpb24gdihhKXttKGEsYy5jc3NDbGFzc2VzLnRhcmdldCksMD09PWMuZGlyP20oYSxjLmNzc0NsYXNzZXMubHRyKTptKGEsYy5jc3NDbGFzc2VzLnJ0bCksMD09PWMub3J0P20oYSxjLmNzc0NsYXNzZXMuaG9yaXpvbnRhbCk6bShhLGMuY3NzQ2xhc3Nlcy52ZXJ0aWNhbCksamE9aChhLGMuY3NzQ2xhc3Nlcy5iYXNlKX1mdW5jdGlvbiB3KGEsYil7cmV0dXJuISFjLnRvb2x0aXBzW2JdJiZoKGEuZmlyc3RDaGlsZCxjLmNzc0NsYXNzZXMudG9vbHRpcCl9ZnVuY3Rpb24geCgpe3ZhciBhPWthLm1hcCh3KTtRKFwidXBkYXRlXCIsZnVuY3Rpb24oYixkLGUpe2lmKGFbZF0pe3ZhciBmPWJbZF07ITAhPT1jLnRvb2x0aXBzW2RdJiYoZj1jLnRvb2x0aXBzW2RdLnRvKGVbZF0pKSxhW2RdLmlubmVySFRNTD1mfX0pfWZ1bmN0aW9uIHkoKXtRKFwidXBkYXRlXCIsZnVuY3Rpb24oYSxiLGQsZSxmKXt0YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3ZhciBiPWthW2FdLGU9VShzYSxhLDAsITAsITAsITApLGc9VShzYSxhLDEwMCwhMCwhMCwhMCksaD1mW2FdLGk9Yy5hcmlhRm9ybWF0LnRvKGRbYV0pO2IuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW1pblwiLGUudG9GaXhlZCgxKSksYi5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbWF4XCIsZy50b0ZpeGVkKDEpKSxiLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWVub3dcIixoLnRvRml4ZWQoMSkpLGIuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZXRleHRcIixpKX0pfSl9ZnVuY3Rpb24geihhLGIsYyl7aWYoXCJyYW5nZVwiPT09YXx8XCJzdGVwc1wiPT09YSlyZXR1cm4gdmEueFZhbDtpZihcImNvdW50XCI9PT1hKXtpZihiPDIpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICd2YWx1ZXMnICg+PSAyKSByZXF1aXJlZCBmb3IgbW9kZSAnY291bnQnLlwiKTt2YXIgZD1iLTEsZT0xMDAvZDtmb3IoYj1bXTtkLS07KWJbZF09ZCplO2IucHVzaCgxMDApLGE9XCJwb3NpdGlvbnNcIn1yZXR1cm5cInBvc2l0aW9uc1wiPT09YT9iLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gdmEuZnJvbVN0ZXBwaW5nKGM/dmEuZ2V0U3RlcChhKTphKX0pOlwidmFsdWVzXCI9PT1hP2M/Yi5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIHZhLmZyb21TdGVwcGluZyh2YS5nZXRTdGVwKHZhLnRvU3RlcHBpbmcoYSkpKX0pOmI6dm9pZCAwfWZ1bmN0aW9uIEEoYSxiLGMpe2Z1bmN0aW9uIGQoYSxiKXtyZXR1cm4oYStiKS50b0ZpeGVkKDcpLzF9dmFyIGY9e30sZz12YS54VmFsWzBdLGg9dmEueFZhbFt2YS54VmFsLmxlbmd0aC0xXSxpPSExLGo9ITEsaz0wO3JldHVybiBjPWUoYy5zbGljZSgpLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS1ifSkpLGNbMF0hPT1nJiYoYy51bnNoaWZ0KGcpLGk9ITApLGNbYy5sZW5ndGgtMV0hPT1oJiYoYy5wdXNoKGgpLGo9ITApLGMuZm9yRWFjaChmdW5jdGlvbihlLGcpe3ZhciBoLGwsbSxuLG8scCxxLHIscyx0LHU9ZSx2PWNbZysxXTtpZihcInN0ZXBzXCI9PT1iJiYoaD12YS54TnVtU3RlcHNbZ10pLGh8fChoPXYtdSksITEhPT11JiZ2b2lkIDAhPT12KWZvcihoPU1hdGgubWF4KGgsMWUtNyksbD11O2w8PXY7bD1kKGwsaCkpe2ZvcihuPXZhLnRvU3RlcHBpbmcobCksbz1uLWsscj1vL2Escz1NYXRoLnJvdW5kKHIpLHQ9by9zLG09MTttPD1zO20rPTEpcD1rK20qdCxmW3AudG9GaXhlZCg1KV09W1wieFwiLDBdO3E9Yy5pbmRleE9mKGwpPi0xPzE6XCJzdGVwc1wiPT09Yj8yOjAsIWcmJmkmJihxPTApLGw9PT12JiZqfHwoZltuLnRvRml4ZWQoNSldPVtsLHFdKSxrPW59fSksZn1mdW5jdGlvbiBCKGEsYixkKXtmdW5jdGlvbiBlKGEsYil7dmFyIGQ9Yj09PWMuY3NzQ2xhc3Nlcy52YWx1ZSxlPWQ/azpsLGY9ZD9pOmo7cmV0dXJuIGIrXCIgXCIrZVtjLm9ydF0rXCIgXCIrZlthXX1mdW5jdGlvbiBmKGEsZil7ZlsxXT1mWzFdJiZiP2IoZlswXSxmWzFdKTpmWzFdO3ZhciBpPWgoZywhMSk7aS5jbGFzc05hbWU9ZShmWzFdLGMuY3NzQ2xhc3Nlcy5tYXJrZXIpLGkuc3R5bGVbYy5zdHlsZV09YStcIiVcIixmWzFdJiYoaT1oKGcsITEpLGkuY2xhc3NOYW1lPWUoZlsxXSxjLmNzc0NsYXNzZXMudmFsdWUpLGkuc2V0QXR0cmlidXRlKFwiZGF0YS12YWx1ZVwiLGZbMF0pLGkuc3R5bGVbYy5zdHlsZV09YStcIiVcIixpLmlubmVyVGV4dD1kLnRvKGZbMF0pKX12YXIgZz15YS5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGk9W2MuY3NzQ2xhc3Nlcy52YWx1ZU5vcm1hbCxjLmNzc0NsYXNzZXMudmFsdWVMYXJnZSxjLmNzc0NsYXNzZXMudmFsdWVTdWJdLGo9W2MuY3NzQ2xhc3Nlcy5tYXJrZXJOb3JtYWwsYy5jc3NDbGFzc2VzLm1hcmtlckxhcmdlLGMuY3NzQ2xhc3Nlcy5tYXJrZXJTdWJdLGs9W2MuY3NzQ2xhc3Nlcy52YWx1ZUhvcml6b250YWwsYy5jc3NDbGFzc2VzLnZhbHVlVmVydGljYWxdLGw9W2MuY3NzQ2xhc3Nlcy5tYXJrZXJIb3Jpem9udGFsLGMuY3NzQ2xhc3Nlcy5tYXJrZXJWZXJ0aWNhbF07cmV0dXJuIG0oZyxjLmNzc0NsYXNzZXMucGlwcyksbShnLDA9PT1jLm9ydD9jLmNzc0NsYXNzZXMucGlwc0hvcml6b250YWw6Yy5jc3NDbGFzc2VzLnBpcHNWZXJ0aWNhbCksT2JqZWN0LmtleXMoYSkuZm9yRWFjaChmdW5jdGlvbihiKXtmKGIsYVtiXSl9KSxnfWZ1bmN0aW9uIEMoKXtuYSYmKGIobmEpLG5hPW51bGwpfWZ1bmN0aW9uIEQoYSl7QygpO3ZhciBiPWEubW9kZSxjPWEuZGVuc2l0eXx8MSxkPWEuZmlsdGVyfHwhMSxlPWEudmFsdWVzfHwhMSxmPWEuc3RlcHBlZHx8ITEsZz16KGIsZSxmKSxoPUEoYyxiLGcpLGk9YS5mb3JtYXR8fHt0bzpNYXRoLnJvdW5kfTtyZXR1cm4gbmE9cmEuYXBwZW5kQ2hpbGQoQihoLGQsaSkpfWZ1bmN0aW9uIEUoKXt2YXIgYT1qYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxiPVwib2Zmc2V0XCIrW1wiV2lkdGhcIixcIkhlaWdodFwiXVtjLm9ydF07cmV0dXJuIDA9PT1jLm9ydD9hLndpZHRofHxqYVtiXTphLmhlaWdodHx8amFbYl19ZnVuY3Rpb24gRihhLGIsZCxlKXt2YXIgZj1mdW5jdGlvbihmKXtyZXR1cm4hIShmPUcoZixlLnBhZ2VPZmZzZXQsZS50YXJnZXR8fGIpKSYmKCEocmEuaGFzQXR0cmlidXRlKFwiZGlzYWJsZWRcIikmJiFlLmRvTm90UmVqZWN0KSYmKCEobyhyYSxjLmNzc0NsYXNzZXMudGFwKSYmIWUuZG9Ob3RSZWplY3QpJiYoIShhPT09b2Euc3RhcnQmJnZvaWQgMCE9PWYuYnV0dG9ucyYmZi5idXR0b25zPjEpJiYoKCFlLmhvdmVyfHwhZi5idXR0b25zKSYmKHFhfHxmLnByZXZlbnREZWZhdWx0KCksZi5jYWxjUG9pbnQ9Zi5wb2ludHNbYy5vcnRdLHZvaWQgZChmLGUpKSkpKSl9LGc9W107cmV0dXJuIGEuc3BsaXQoXCIgXCIpLmZvckVhY2goZnVuY3Rpb24oYSl7Yi5hZGRFdmVudExpc3RlbmVyKGEsZiwhIXFhJiZ7cGFzc2l2ZTohMH0pLGcucHVzaChbYSxmXSl9KSxnfWZ1bmN0aW9uIEcoYSxiLGMpe3ZhciBkLGUsZj0wPT09YS50eXBlLmluZGV4T2YoXCJ0b3VjaFwiKSxnPTA9PT1hLnR5cGUuaW5kZXhPZihcIm1vdXNlXCIpLGg9MD09PWEudHlwZS5pbmRleE9mKFwicG9pbnRlclwiKTtpZigwPT09YS50eXBlLmluZGV4T2YoXCJNU1BvaW50ZXJcIikmJihoPSEwKSxmKXt2YXIgaT1mdW5jdGlvbihhKXtyZXR1cm4gYS50YXJnZXQ9PT1jfHxjLmNvbnRhaW5zKGEudGFyZ2V0KX07aWYoXCJ0b3VjaHN0YXJ0XCI9PT1hLnR5cGUpe3ZhciBqPUFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChhLnRvdWNoZXMsaSk7aWYoai5sZW5ndGg+MSlyZXR1cm4hMTtkPWpbMF0ucGFnZVgsZT1qWzBdLnBhZ2VZfWVsc2V7dmFyIGs9QXJyYXkucHJvdG90eXBlLmZpbmQuY2FsbChhLmNoYW5nZWRUb3VjaGVzLGkpO2lmKCFrKXJldHVybiExO2Q9ay5wYWdlWCxlPWsucGFnZVl9fXJldHVybiBiPWJ8fHAoeWEpLChnfHxoKSYmKGQ9YS5jbGllbnRYK2IueCxlPWEuY2xpZW50WStiLnkpLGEucGFnZU9mZnNldD1iLGEucG9pbnRzPVtkLGVdLGEuY3Vyc29yPWd8fGgsYX1mdW5jdGlvbiBIKGEpe3ZhciBiPWEtZyhqYSxjLm9ydCksZD0xMDAqYi9FKCk7cmV0dXJuIGQ9aihkKSxjLmRpcj8xMDAtZDpkfWZ1bmN0aW9uIEkoYSl7dmFyIGI9MTAwLGM9ITE7cmV0dXJuIGthLmZvckVhY2goZnVuY3Rpb24oZCxlKXtpZighZC5oYXNBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKSl7dmFyIGY9TWF0aC5hYnMoc2FbZV0tYSk7KGY8Ynx8MTAwPT09ZiYmMTAwPT09YikmJihjPWUsYj1mKX19KSxjfWZ1bmN0aW9uIEooYSxiKXtcIm1vdXNlb3V0XCI9PT1hLnR5cGUmJlwiSFRNTFwiPT09YS50YXJnZXQubm9kZU5hbWUmJm51bGw9PT1hLnJlbGF0ZWRUYXJnZXQmJkwoYSxiKX1mdW5jdGlvbiBLKGEsYil7aWYoLTE9PT1uYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiTVNJRSA5XCIpJiYwPT09YS5idXR0b25zJiYwIT09Yi5idXR0b25zUHJvcGVydHkpcmV0dXJuIEwoYSxiKTt2YXIgZD0oYy5kaXI/LTE6MSkqKGEuY2FsY1BvaW50LWIuc3RhcnRDYWxjUG9pbnQpO1coZD4wLDEwMCpkL2IuYmFzZVNpemUsYi5sb2NhdGlvbnMsYi5oYW5kbGVOdW1iZXJzKX1mdW5jdGlvbiBMKGEsYil7Yi5oYW5kbGUmJihuKGIuaGFuZGxlLGMuY3NzQ2xhc3Nlcy5hY3RpdmUpLHVhLT0xKSxiLmxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGEpe3phLnJlbW92ZUV2ZW50TGlzdGVuZXIoYVswXSxhWzFdKX0pLDA9PT11YSYmKG4ocmEsYy5jc3NDbGFzc2VzLmRyYWcpLF8oKSxhLmN1cnNvciYmKEFhLnN0eWxlLmN1cnNvcj1cIlwiLEFhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzZWxlY3RzdGFydFwiLGQpKSksYi5oYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24oYSl7UyhcImNoYW5nZVwiLGEpLFMoXCJzZXRcIixhKSxTKFwiZW5kXCIsYSl9KX1mdW5jdGlvbiBNKGEsYil7dmFyIGU7aWYoMT09PWIuaGFuZGxlTnVtYmVycy5sZW5ndGgpe3ZhciBmPWthW2IuaGFuZGxlTnVtYmVyc1swXV07aWYoZi5oYXNBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKSlyZXR1cm4hMTtlPWYuY2hpbGRyZW5bMF0sdWErPTEsbShlLGMuY3NzQ2xhc3Nlcy5hY3RpdmUpfWEuc3RvcFByb3BhZ2F0aW9uKCk7dmFyIGc9W10saD1GKG9hLm1vdmUsemEsSyx7dGFyZ2V0OmEudGFyZ2V0LGhhbmRsZTplLGxpc3RlbmVyczpnLHN0YXJ0Q2FsY1BvaW50OmEuY2FsY1BvaW50LGJhc2VTaXplOkUoKSxwYWdlT2Zmc2V0OmEucGFnZU9mZnNldCxoYW5kbGVOdW1iZXJzOmIuaGFuZGxlTnVtYmVycyxidXR0b25zUHJvcGVydHk6YS5idXR0b25zLGxvY2F0aW9uczpzYS5zbGljZSgpfSksaT1GKG9hLmVuZCx6YSxMLHt0YXJnZXQ6YS50YXJnZXQsaGFuZGxlOmUsbGlzdGVuZXJzOmcsZG9Ob3RSZWplY3Q6ITAsaGFuZGxlTnVtYmVyczpiLmhhbmRsZU51bWJlcnN9KSxqPUYoXCJtb3VzZW91dFwiLHphLEose3RhcmdldDphLnRhcmdldCxoYW5kbGU6ZSxsaXN0ZW5lcnM6Zyxkb05vdFJlamVjdDohMCxoYW5kbGVOdW1iZXJzOmIuaGFuZGxlTnVtYmVyc30pO2cucHVzaC5hcHBseShnLGguY29uY2F0KGksaikpLGEuY3Vyc29yJiYoQWEuc3R5bGUuY3Vyc29yPWdldENvbXB1dGVkU3R5bGUoYS50YXJnZXQpLmN1cnNvcixrYS5sZW5ndGg+MSYmbShyYSxjLmNzc0NsYXNzZXMuZHJhZyksQWEuYWRkRXZlbnRMaXN0ZW5lcihcInNlbGVjdHN0YXJ0XCIsZCwhMSkpLGIuaGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uKGEpe1MoXCJzdGFydFwiLGEpfSl9ZnVuY3Rpb24gTihhKXthLnN0b3BQcm9wYWdhdGlvbigpO3ZhciBiPUgoYS5jYWxjUG9pbnQpLGQ9SShiKTtpZighMT09PWQpcmV0dXJuITE7Yy5ldmVudHMuc25hcHx8aShyYSxjLmNzc0NsYXNzZXMudGFwLGMuYW5pbWF0aW9uRHVyYXRpb24pLGFhKGQsYiwhMCwhMCksXygpLFMoXCJzbGlkZVwiLGQsITApLFMoXCJ1cGRhdGVcIixkLCEwKSxTKFwiY2hhbmdlXCIsZCwhMCksUyhcInNldFwiLGQsITApLGMuZXZlbnRzLnNuYXAmJk0oYSx7aGFuZGxlTnVtYmVyczpbZF19KX1mdW5jdGlvbiBPKGEpe3ZhciBiPUgoYS5jYWxjUG9pbnQpLGM9dmEuZ2V0U3RlcChiKSxkPXZhLmZyb21TdGVwcGluZyhjKTtPYmplY3Qua2V5cyh4YSkuZm9yRWFjaChmdW5jdGlvbihhKXtcImhvdmVyXCI9PT1hLnNwbGl0KFwiLlwiKVswXSYmeGFbYV0uZm9yRWFjaChmdW5jdGlvbihhKXthLmNhbGwobWEsZCl9KX0pfWZ1bmN0aW9uIFAoYSl7YS5maXhlZHx8a2EuZm9yRWFjaChmdW5jdGlvbihhLGIpe0Yob2Euc3RhcnQsYS5jaGlsZHJlblswXSxNLHtoYW5kbGVOdW1iZXJzOltiXX0pfSksYS50YXAmJkYob2Euc3RhcnQsamEsTix7fSksYS5ob3ZlciYmRihvYS5tb3ZlLGphLE8se2hvdmVyOiEwfSksYS5kcmFnJiZsYS5mb3JFYWNoKGZ1bmN0aW9uKGIsZCl7aWYoITEhPT1iJiYwIT09ZCYmZCE9PWxhLmxlbmd0aC0xKXt2YXIgZT1rYVtkLTFdLGY9a2FbZF0sZz1bYl07bShiLGMuY3NzQ2xhc3Nlcy5kcmFnZ2FibGUpLGEuZml4ZWQmJihnLnB1c2goZS5jaGlsZHJlblswXSksZy5wdXNoKGYuY2hpbGRyZW5bMF0pKSxnLmZvckVhY2goZnVuY3Rpb24oYSl7RihvYS5zdGFydCxhLE0se2hhbmRsZXM6W2UsZl0saGFuZGxlTnVtYmVyczpbZC0xLGRdfSl9KX19KX1mdW5jdGlvbiBRKGEsYil7eGFbYV09eGFbYV18fFtdLHhhW2FdLnB1c2goYiksXCJ1cGRhdGVcIj09PWEuc3BsaXQoXCIuXCIpWzBdJiZrYS5mb3JFYWNoKGZ1bmN0aW9uKGEsYil7UyhcInVwZGF0ZVwiLGIpfSl9ZnVuY3Rpb24gUihhKXt2YXIgYj1hJiZhLnNwbGl0KFwiLlwiKVswXSxjPWImJmEuc3Vic3RyaW5nKGIubGVuZ3RoKTtPYmplY3Qua2V5cyh4YSkuZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgZD1hLnNwbGl0KFwiLlwiKVswXSxlPWEuc3Vic3RyaW5nKGQubGVuZ3RoKTtiJiZiIT09ZHx8YyYmYyE9PWV8fGRlbGV0ZSB4YVthXX0pfWZ1bmN0aW9uIFMoYSxiLGQpe09iamVjdC5rZXlzKHhhKS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciBmPWUuc3BsaXQoXCIuXCIpWzBdO2E9PT1mJiZ4YVtlXS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2EuY2FsbChtYSx3YS5tYXAoYy5mb3JtYXQudG8pLGIsd2Euc2xpY2UoKSxkfHwhMSxzYS5zbGljZSgpKX0pfSl9ZnVuY3Rpb24gVChhKXtyZXR1cm4gYStcIiVcIn1mdW5jdGlvbiBVKGEsYixkLGUsZixnKXtyZXR1cm4ga2EubGVuZ3RoPjEmJihlJiZiPjAmJihkPU1hdGgubWF4KGQsYVtiLTFdK2MubWFyZ2luKSksZiYmYjxrYS5sZW5ndGgtMSYmKGQ9TWF0aC5taW4oZCxhW2IrMV0tYy5tYXJnaW4pKSksa2EubGVuZ3RoPjEmJmMubGltaXQmJihlJiZiPjAmJihkPU1hdGgubWluKGQsYVtiLTFdK2MubGltaXQpKSxmJiZiPGthLmxlbmd0aC0xJiYoZD1NYXRoLm1heChkLGFbYisxXS1jLmxpbWl0KSkpLGMucGFkZGluZyYmKDA9PT1iJiYoZD1NYXRoLm1heChkLGMucGFkZGluZ1swXSkpLGI9PT1rYS5sZW5ndGgtMSYmKGQ9TWF0aC5taW4oZCwxMDAtYy5wYWRkaW5nWzFdKSkpLGQ9dmEuZ2V0U3RlcChkKSwhKChkPWooZCkpPT09YVtiXSYmIWcpJiZkfWZ1bmN0aW9uIFYoYSxiKXt2YXIgZD1jLm9ydDtyZXR1cm4oZD9iOmEpK1wiLCBcIisoZD9hOmIpfWZ1bmN0aW9uIFcoYSxiLGMsZCl7dmFyIGU9Yy5zbGljZSgpLGY9WyFhLGFdLGc9W2EsIWFdO2Q9ZC5zbGljZSgpLGEmJmQucmV2ZXJzZSgpLGQubGVuZ3RoPjE/ZC5mb3JFYWNoKGZ1bmN0aW9uKGEsYyl7dmFyIGQ9VShlLGEsZVthXStiLGZbY10sZ1tjXSwhMSk7ITE9PT1kP2I9MDooYj1kLWVbYV0sZVthXT1kKX0pOmY9Zz1bITBdO3ZhciBoPSExO2QuZm9yRWFjaChmdW5jdGlvbihhLGQpe2g9YWEoYSxjW2FdK2IsZltkXSxnW2RdKXx8aH0pLGgmJmQuZm9yRWFjaChmdW5jdGlvbihhKXtTKFwidXBkYXRlXCIsYSksUyhcInNsaWRlXCIsYSl9KX1mdW5jdGlvbiBZKGEsYil7cmV0dXJuIGMuZGlyPzEwMC1hLWI6YX1mdW5jdGlvbiBaKGEsYil7c2FbYV09Yix3YVthXT12YS5mcm9tU3RlcHBpbmcoYik7dmFyIGQ9XCJ0cmFuc2xhdGUoXCIrVihUKFkoYiwwKS1CYSksXCIwXCIpK1wiKVwiO2thW2FdLnN0eWxlW2MudHJhbnNmb3JtUnVsZV09ZCxiYShhKSxiYShhKzEpfWZ1bmN0aW9uIF8oKXt0YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3ZhciBiPXNhW2FdPjUwPy0xOjEsYz0zKyhrYS5sZW5ndGgrYiphKTtrYVthXS5zdHlsZS56SW5kZXg9Y30pfWZ1bmN0aW9uIGFhKGEsYixjLGQpe3JldHVybiExIT09KGI9VShzYSxhLGIsYyxkLCExKSkmJihaKGEsYiksITApfWZ1bmN0aW9uIGJhKGEpe2lmKGxhW2FdKXt2YXIgYj0wLGQ9MTAwOzAhPT1hJiYoYj1zYVthLTFdKSxhIT09bGEubGVuZ3RoLTEmJihkPXNhW2FdKTt2YXIgZT1kLWIsZj1cInRyYW5zbGF0ZShcIitWKFQoWShiLGUpKSxcIjBcIikrXCIpXCIsZz1cInNjYWxlKFwiK1YoZS8xMDAsXCIxXCIpK1wiKVwiO2xhW2FdLnN0eWxlW2MudHJhbnNmb3JtUnVsZV09ZitcIiBcIitnfX1mdW5jdGlvbiBjYShhLGIpe3JldHVybiBudWxsPT09YXx8ITE9PT1hfHx2b2lkIDA9PT1hP3NhW2JdOihcIm51bWJlclwiPT10eXBlb2YgYSYmKGE9U3RyaW5nKGEpKSxhPWMuZm9ybWF0LmZyb20oYSksYT12YS50b1N0ZXBwaW5nKGEpLCExPT09YXx8aXNOYU4oYSk/c2FbYl06YSl9ZnVuY3Rpb24gZGEoYSxiKXt2YXIgZD1rKGEpLGU9dm9pZCAwPT09c2FbMF07Yj12b2lkIDA9PT1ifHwhIWIsYy5hbmltYXRlJiYhZSYmaShyYSxjLmNzc0NsYXNzZXMudGFwLGMuYW5pbWF0aW9uRHVyYXRpb24pLHRhLmZvckVhY2goZnVuY3Rpb24oYSl7YWEoYSxjYShkW2FdLGEpLCEwLCExKX0pLHRhLmZvckVhY2goZnVuY3Rpb24oYSl7YWEoYSxzYVthXSwhMCwhMCl9KSxfKCksdGEuZm9yRWFjaChmdW5jdGlvbihhKXtTKFwidXBkYXRlXCIsYSksbnVsbCE9PWRbYV0mJmImJlMoXCJzZXRcIixhKX0pfWZ1bmN0aW9uIGVhKGEpe2RhKGMuc3RhcnQsYSl9ZnVuY3Rpb24gZmEoKXt2YXIgYT13YS5tYXAoYy5mb3JtYXQudG8pO3JldHVybiAxPT09YS5sZW5ndGg/YVswXTphfWZ1bmN0aW9uIGdhKCl7Zm9yKHZhciBhIGluIGMuY3NzQ2xhc3NlcyljLmNzc0NsYXNzZXMuaGFzT3duUHJvcGVydHkoYSkmJm4ocmEsYy5jc3NDbGFzc2VzW2FdKTtmb3IoO3JhLmZpcnN0Q2hpbGQ7KXJhLnJlbW92ZUNoaWxkKHJhLmZpcnN0Q2hpbGQpO2RlbGV0ZSByYS5ub1VpU2xpZGVyfWZ1bmN0aW9uIGhhKCl7cmV0dXJuIHNhLm1hcChmdW5jdGlvbihhLGIpe3ZhciBjPXZhLmdldE5lYXJieVN0ZXBzKGEpLGQ9d2FbYl0sZT1jLnRoaXNTdGVwLnN0ZXAsZj1udWxsOyExIT09ZSYmZCtlPmMuc3RlcEFmdGVyLnN0YXJ0VmFsdWUmJihlPWMuc3RlcEFmdGVyLnN0YXJ0VmFsdWUtZCksZj1kPmMudGhpc1N0ZXAuc3RhcnRWYWx1ZT9jLnRoaXNTdGVwLnN0ZXA6ITEhPT1jLnN0ZXBCZWZvcmUuc3RlcCYmZC1jLnN0ZXBCZWZvcmUuaGlnaGVzdFN0ZXAsMTAwPT09YT9lPW51bGw6MD09PWEmJihmPW51bGwpO3ZhciBnPXZhLmNvdW50U3RlcERlY2ltYWxzKCk7cmV0dXJuIG51bGwhPT1lJiYhMSE9PWUmJihlPU51bWJlcihlLnRvRml4ZWQoZykpKSxudWxsIT09ZiYmITEhPT1mJiYoZj1OdW1iZXIoZi50b0ZpeGVkKGcpKSksW2YsZV19KX1mdW5jdGlvbiBpYShhLGIpe3ZhciBkPWZhKCksZT1bXCJtYXJnaW5cIixcImxpbWl0XCIsXCJwYWRkaW5nXCIsXCJyYW5nZVwiLFwiYW5pbWF0ZVwiLFwic25hcFwiLFwic3RlcFwiLFwiZm9ybWF0XCJdO2UuZm9yRWFjaChmdW5jdGlvbihiKXt2b2lkIDAhPT1hW2JdJiYoZltiXT1hW2JdKX0pO3ZhciBnPVgoZik7ZS5mb3JFYWNoKGZ1bmN0aW9uKGIpe3ZvaWQgMCE9PWFbYl0mJihjW2JdPWdbYl0pfSksdmE9Zy5zcGVjdHJ1bSxjLm1hcmdpbj1nLm1hcmdpbixjLmxpbWl0PWcubGltaXQsYy5wYWRkaW5nPWcucGFkZGluZyxjLnBpcHMmJkQoYy5waXBzKSxzYT1bXSxkYShhLnN0YXJ0fHxkLGIpfXZhciBqYSxrYSxsYSxtYSxuYSxvYT1xKCkscGE9cygpLHFhPXBhJiZyKCkscmE9YSxzYT1bXSx0YT1bXSx1YT0wLHZhPWMuc3BlY3RydW0sd2E9W10seGE9e30seWE9YS5vd25lckRvY3VtZW50LHphPXlhLmRvY3VtZW50RWxlbWVudCxBYT15YS5ib2R5LEJhPVwicnRsXCI9PT15YS5kaXJ8fDE9PT1jLm9ydD8wOjEwMDtyZXR1cm4gdihyYSksdShjLmNvbm5lY3QsamEpLFAoYy5ldmVudHMpLGRhKGMuc3RhcnQpLG1hPXtkZXN0cm95OmdhLHN0ZXBzOmhhLG9uOlEsb2ZmOlIsZ2V0OmZhLHNldDpkYSxyZXNldDplYSxfX21vdmVIYW5kbGVzOmZ1bmN0aW9uKGEsYixjKXtXKGEsYixzYSxjKX0sb3B0aW9uczpmLHVwZGF0ZU9wdGlvbnM6aWEsdGFyZ2V0OnJhLHJlbW92ZVBpcHM6QyxwaXBzOkR9LGMucGlwcyYmRChjLnBpcHMpLGMudG9vbHRpcHMmJngoKSx5KCksbWF9ZnVuY3Rpb24gWihhLGIpe2lmKCFhfHwhYS5ub2RlTmFtZSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogY3JlYXRlIHJlcXVpcmVzIGEgc2luZ2xlIGVsZW1lbnQsIGdvdDogXCIrYSk7aWYoYS5ub1VpU2xpZGVyKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiBTbGlkZXIgd2FzIGFscmVhZHkgaW5pdGlhbGl6ZWQuXCIpO3ZhciBjPVgoYixhKSxkPVkoYSxjLGIpO3JldHVybiBhLm5vVWlTbGlkZXI9ZCxkfXZhciAkPVwiMTEuMS4wXCI7RC5wcm90b3R5cGUuZ2V0TWFyZ2luPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMueE51bVN0ZXBzWzBdO2lmKGImJmEvYiUxIT0wKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbGltaXQnLCAnbWFyZ2luJyBhbmQgJ3BhZGRpbmcnIG11c3QgYmUgZGl2aXNpYmxlIGJ5IHN0ZXAuXCIpO3JldHVybiAyPT09dGhpcy54UGN0Lmxlbmd0aCYmdSh0aGlzLnhWYWwsYSl9LEQucHJvdG90eXBlLnRvU3RlcHBpbmc9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9eSh0aGlzLnhWYWwsdGhpcy54UGN0LGEpfSxELnByb3RvdHlwZS5mcm9tU3RlcHBpbmc9ZnVuY3Rpb24oYSl7cmV0dXJuIHoodGhpcy54VmFsLHRoaXMueFBjdCxhKX0sRC5wcm90b3R5cGUuZ2V0U3RlcD1mdW5jdGlvbihhKXtyZXR1cm4gYT1BKHRoaXMueFBjdCx0aGlzLnhTdGVwcyx0aGlzLnNuYXAsYSl9LEQucHJvdG90eXBlLmdldE5lYXJieVN0ZXBzPWZ1bmN0aW9uKGEpe3ZhciBiPXgoYSx0aGlzLnhQY3QpO3JldHVybntzdGVwQmVmb3JlOntzdGFydFZhbHVlOnRoaXMueFZhbFtiLTJdLHN0ZXA6dGhpcy54TnVtU3RlcHNbYi0yXSxoaWdoZXN0U3RlcDp0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwW2ItMl19LHRoaXNTdGVwOntzdGFydFZhbHVlOnRoaXMueFZhbFtiLTFdLHN0ZXA6dGhpcy54TnVtU3RlcHNbYi0xXSxoaWdoZXN0U3RlcDp0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwW2ItMV19LHN0ZXBBZnRlcjp7c3RhcnRWYWx1ZTp0aGlzLnhWYWxbYi0wXSxzdGVwOnRoaXMueE51bVN0ZXBzW2ItMF0saGlnaGVzdFN0ZXA6dGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtiLTBdfX19LEQucHJvdG90eXBlLmNvdW50U3RlcERlY2ltYWxzPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy54TnVtU3RlcHMubWFwKGwpO3JldHVybiBNYXRoLm1heC5hcHBseShudWxsLGEpfSxELnByb3RvdHlwZS5jb252ZXJ0PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmdldFN0ZXAodGhpcy50b1N0ZXBwaW5nKGEpKX07dmFyIF89e3RvOmZ1bmN0aW9uKGEpe3JldHVybiB2b2lkIDAhPT1hJiZhLnRvRml4ZWQoMil9LGZyb206TnVtYmVyfTtyZXR1cm57dmVyc2lvbjokLGNyZWF0ZTpafX0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSkge1xuXG4gICAgaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG5cbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuXG4gICAgfSBlbHNlIGlmICggdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICkge1xuXG4gICAgICAgIC8vIE5vZGUvQ29tbW9uSlNcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgICAgICB3aW5kb3cud051bWIgPSBmYWN0b3J5KCk7XG4gICAgfVxuXG59KGZ1bmN0aW9uKCl7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG52YXIgRm9ybWF0T3B0aW9ucyA9IFtcblx0J2RlY2ltYWxzJyxcblx0J3Rob3VzYW5kJyxcblx0J21hcmsnLFxuXHQncHJlZml4Jyxcblx0J3N1ZmZpeCcsXG5cdCdlbmNvZGVyJyxcblx0J2RlY29kZXInLFxuXHQnbmVnYXRpdmVCZWZvcmUnLFxuXHQnbmVnYXRpdmUnLFxuXHQnZWRpdCcsXG5cdCd1bmRvJ1xuXTtcblxuLy8gR2VuZXJhbFxuXG5cdC8vIFJldmVyc2UgYSBzdHJpbmdcblx0ZnVuY3Rpb24gc3RyUmV2ZXJzZSAoIGEgKSB7XG5cdFx0cmV0dXJuIGEuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKTtcblx0fVxuXG5cdC8vIENoZWNrIGlmIGEgc3RyaW5nIHN0YXJ0cyB3aXRoIGEgc3BlY2lmaWVkIHByZWZpeC5cblx0ZnVuY3Rpb24gc3RyU3RhcnRzV2l0aCAoIGlucHV0LCBtYXRjaCApIHtcblx0XHRyZXR1cm4gaW5wdXQuc3Vic3RyaW5nKDAsIG1hdGNoLmxlbmd0aCkgPT09IG1hdGNoO1xuXHR9XG5cblx0Ly8gQ2hlY2sgaXMgYSBzdHJpbmcgZW5kcyBpbiBhIHNwZWNpZmllZCBzdWZmaXguXG5cdGZ1bmN0aW9uIHN0ckVuZHNXaXRoICggaW5wdXQsIG1hdGNoICkge1xuXHRcdHJldHVybiBpbnB1dC5zbGljZSgtMSAqIG1hdGNoLmxlbmd0aCkgPT09IG1hdGNoO1xuXHR9XG5cblx0Ly8gVGhyb3cgYW4gZXJyb3IgaWYgZm9ybWF0dGluZyBvcHRpb25zIGFyZSBpbmNvbXBhdGlibGUuXG5cdGZ1bmN0aW9uIHRocm93RXF1YWxFcnJvciggRiwgYSwgYiApIHtcblx0XHRpZiAoIChGW2FdIHx8IEZbYl0pICYmIChGW2FdID09PSBGW2JdKSApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihhKTtcblx0XHR9XG5cdH1cblxuXHQvLyBDaGVjayBpZiBhIG51bWJlciBpcyBmaW5pdGUgYW5kIG5vdCBOYU5cblx0ZnVuY3Rpb24gaXNWYWxpZE51bWJlciAoIGlucHV0ICkge1xuXHRcdHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInICYmIGlzRmluaXRlKCBpbnB1dCApO1xuXHR9XG5cblx0Ly8gUHJvdmlkZSByb3VuZGluZy1hY2N1cmF0ZSB0b0ZpeGVkIG1ldGhvZC5cblx0Ly8gQm9ycm93ZWQ6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMzIzMzMwLzc3NTI2NVxuXHRmdW5jdGlvbiB0b0ZpeGVkICggdmFsdWUsIGV4cCApIHtcblx0XHR2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJ2UnKTtcblx0XHR2YWx1ZSA9IE1hdGgucm91bmQoKyh2YWx1ZVswXSArICdlJyArICh2YWx1ZVsxXSA/ICgrdmFsdWVbMV0gKyBleHApIDogZXhwKSkpO1xuXHRcdHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKS5zcGxpdCgnZScpO1xuXHRcdHJldHVybiAoKyh2YWx1ZVswXSArICdlJyArICh2YWx1ZVsxXSA/ICgrdmFsdWVbMV0gLSBleHApIDogLWV4cCkpKS50b0ZpeGVkKGV4cCk7XG5cdH1cblxuXG4vLyBGb3JtYXR0aW5nXG5cblx0Ly8gQWNjZXB0IGEgbnVtYmVyIGFzIGlucHV0LCBvdXRwdXQgZm9ybWF0dGVkIHN0cmluZy5cblx0ZnVuY3Rpb24gZm9ybWF0VG8gKCBkZWNpbWFscywgdGhvdXNhbmQsIG1hcmssIHByZWZpeCwgc3VmZml4LCBlbmNvZGVyLCBkZWNvZGVyLCBuZWdhdGl2ZUJlZm9yZSwgbmVnYXRpdmUsIGVkaXQsIHVuZG8sIGlucHV0ICkge1xuXG5cdFx0dmFyIG9yaWdpbmFsSW5wdXQgPSBpbnB1dCwgaW5wdXRJc05lZ2F0aXZlLCBpbnB1dFBpZWNlcywgaW5wdXRCYXNlLCBpbnB1dERlY2ltYWxzID0gJycsIG91dHB1dCA9ICcnO1xuXG5cdFx0Ly8gQXBwbHkgdXNlciBlbmNvZGVyIHRvIHRoZSBpbnB1dC5cblx0XHQvLyBFeHBlY3RlZCBvdXRjb21lOiBudW1iZXIuXG5cdFx0aWYgKCBlbmNvZGVyICkge1xuXHRcdFx0aW5wdXQgPSBlbmNvZGVyKGlucHV0KTtcblx0XHR9XG5cblx0XHQvLyBTdG9wIGlmIG5vIHZhbGlkIG51bWJlciB3YXMgcHJvdmlkZWQsIHRoZSBudW1iZXIgaXMgaW5maW5pdGUgb3IgTmFOLlxuXHRcdGlmICggIWlzVmFsaWROdW1iZXIoaW5wdXQpICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIFJvdW5kaW5nIGF3YXkgZGVjaW1hbHMgbWlnaHQgY2F1c2UgYSB2YWx1ZSBvZiAtMFxuXHRcdC8vIHdoZW4gdXNpbmcgdmVyeSBzbWFsbCByYW5nZXMuIFJlbW92ZSB0aG9zZSBjYXNlcy5cblx0XHRpZiAoIGRlY2ltYWxzICE9PSBmYWxzZSAmJiBwYXJzZUZsb2F0KGlucHV0LnRvRml4ZWQoZGVjaW1hbHMpKSA9PT0gMCApIHtcblx0XHRcdGlucHV0ID0gMDtcblx0XHR9XG5cblx0XHQvLyBGb3JtYXR0aW5nIGlzIGRvbmUgb24gYWJzb2x1dGUgbnVtYmVycyxcblx0XHQvLyBkZWNvcmF0ZWQgYnkgYW4gb3B0aW9uYWwgbmVnYXRpdmUgc3ltYm9sLlxuXHRcdGlmICggaW5wdXQgPCAwICkge1xuXHRcdFx0aW5wdXRJc05lZ2F0aXZlID0gdHJ1ZTtcblx0XHRcdGlucHV0ID0gTWF0aC5hYnMoaW5wdXQpO1xuXHRcdH1cblxuXHRcdC8vIFJlZHVjZSB0aGUgbnVtYmVyIG9mIGRlY2ltYWxzIHRvIHRoZSBzcGVjaWZpZWQgb3B0aW9uLlxuXHRcdGlmICggZGVjaW1hbHMgIT09IGZhbHNlICkge1xuXHRcdFx0aW5wdXQgPSB0b0ZpeGVkKCBpbnB1dCwgZGVjaW1hbHMgKTtcblx0XHR9XG5cblx0XHQvLyBUcmFuc2Zvcm0gdGhlIG51bWJlciBpbnRvIGEgc3RyaW5nLCBzbyBpdCBjYW4gYmUgc3BsaXQuXG5cdFx0aW5wdXQgPSBpbnB1dC50b1N0cmluZygpO1xuXG5cdFx0Ly8gQnJlYWsgdGhlIG51bWJlciBvbiB0aGUgZGVjaW1hbCBzZXBhcmF0b3IuXG5cdFx0aWYgKCBpbnB1dC5pbmRleE9mKCcuJykgIT09IC0xICkge1xuXHRcdFx0aW5wdXRQaWVjZXMgPSBpbnB1dC5zcGxpdCgnLicpO1xuXG5cdFx0XHRpbnB1dEJhc2UgPSBpbnB1dFBpZWNlc1swXTtcblxuXHRcdFx0aWYgKCBtYXJrICkge1xuXHRcdFx0XHRpbnB1dERlY2ltYWxzID0gbWFyayArIGlucHV0UGllY2VzWzFdO1xuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblxuXHRcdC8vIElmIGl0IGlzbid0IHNwbGl0LCB0aGUgZW50aXJlIG51bWJlciB3aWxsIGRvLlxuXHRcdFx0aW5wdXRCYXNlID0gaW5wdXQ7XG5cdFx0fVxuXG5cdFx0Ly8gR3JvdXAgbnVtYmVycyBpbiBzZXRzIG9mIHRocmVlLlxuXHRcdGlmICggdGhvdXNhbmQgKSB7XG5cdFx0XHRpbnB1dEJhc2UgPSBzdHJSZXZlcnNlKGlucHV0QmFzZSkubWF0Y2goLy57MSwzfS9nKTtcblx0XHRcdGlucHV0QmFzZSA9IHN0clJldmVyc2UoaW5wdXRCYXNlLmpvaW4oIHN0clJldmVyc2UoIHRob3VzYW5kICkgKSk7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlIG51bWJlciBpcyBuZWdhdGl2ZSwgcHJlZml4IHdpdGggbmVnYXRpb24gc3ltYm9sLlxuXHRcdGlmICggaW5wdXRJc05lZ2F0aXZlICYmIG5lZ2F0aXZlQmVmb3JlICkge1xuXHRcdFx0b3V0cHV0ICs9IG5lZ2F0aXZlQmVmb3JlO1xuXHRcdH1cblxuXHRcdC8vIFByZWZpeCB0aGUgbnVtYmVyXG5cdFx0aWYgKCBwcmVmaXggKSB7XG5cdFx0XHRvdXRwdXQgKz0gcHJlZml4O1xuXHRcdH1cblxuXHRcdC8vIE5vcm1hbCBuZWdhdGl2ZSBvcHRpb24gY29tZXMgYWZ0ZXIgdGhlIHByZWZpeC4gRGVmYXVsdHMgdG8gJy0nLlxuXHRcdGlmICggaW5wdXRJc05lZ2F0aXZlICYmIG5lZ2F0aXZlICkge1xuXHRcdFx0b3V0cHV0ICs9IG5lZ2F0aXZlO1xuXHRcdH1cblxuXHRcdC8vIEFwcGVuZCB0aGUgYWN0dWFsIG51bWJlci5cblx0XHRvdXRwdXQgKz0gaW5wdXRCYXNlO1xuXHRcdG91dHB1dCArPSBpbnB1dERlY2ltYWxzO1xuXG5cdFx0Ly8gQXBwbHkgdGhlIHN1ZmZpeC5cblx0XHRpZiAoIHN1ZmZpeCApIHtcblx0XHRcdG91dHB1dCArPSBzdWZmaXg7XG5cdFx0fVxuXG5cdFx0Ly8gUnVuIHRoZSBvdXRwdXQgdGhyb3VnaCBhIHVzZXItc3BlY2lmaWVkIHBvc3QtZm9ybWF0dGVyLlxuXHRcdGlmICggZWRpdCApIHtcblx0XHRcdG91dHB1dCA9IGVkaXQgKCBvdXRwdXQsIG9yaWdpbmFsSW5wdXQgKTtcblx0XHR9XG5cblx0XHQvLyBBbGwgZG9uZS5cblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9XG5cblx0Ly8gQWNjZXB0IGEgc3RpbmcgYXMgaW5wdXQsIG91dHB1dCBkZWNvZGVkIG51bWJlci5cblx0ZnVuY3Rpb24gZm9ybWF0RnJvbSAoIGRlY2ltYWxzLCB0aG91c2FuZCwgbWFyaywgcHJlZml4LCBzdWZmaXgsIGVuY29kZXIsIGRlY29kZXIsIG5lZ2F0aXZlQmVmb3JlLCBuZWdhdGl2ZSwgZWRpdCwgdW5kbywgaW5wdXQgKSB7XG5cblx0XHR2YXIgb3JpZ2luYWxJbnB1dCA9IGlucHV0LCBpbnB1dElzTmVnYXRpdmUsIG91dHB1dCA9ICcnO1xuXG5cdFx0Ly8gVXNlciBkZWZpbmVkIHByZS1kZWNvZGVyLiBSZXN1bHQgbXVzdCBiZSBhIG5vbiBlbXB0eSBzdHJpbmcuXG5cdFx0aWYgKCB1bmRvICkge1xuXHRcdFx0aW5wdXQgPSB1bmRvKGlucHV0KTtcblx0XHR9XG5cblx0XHQvLyBUZXN0IHRoZSBpbnB1dC4gQ2FuJ3QgYmUgZW1wdHkuXG5cdFx0aWYgKCAhaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJyApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBJZiB0aGUgc3RyaW5nIHN0YXJ0cyB3aXRoIHRoZSBuZWdhdGl2ZUJlZm9yZSB2YWx1ZTogcmVtb3ZlIGl0LlxuXHRcdC8vIFJlbWVtYmVyIGlzIHdhcyB0aGVyZSwgdGhlIG51bWJlciBpcyBuZWdhdGl2ZS5cblx0XHRpZiAoIG5lZ2F0aXZlQmVmb3JlICYmIHN0clN0YXJ0c1dpdGgoaW5wdXQsIG5lZ2F0aXZlQmVmb3JlKSApIHtcblx0XHRcdGlucHV0ID0gaW5wdXQucmVwbGFjZShuZWdhdGl2ZUJlZm9yZSwgJycpO1xuXHRcdFx0aW5wdXRJc05lZ2F0aXZlID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBSZXBlYXQgdGhlIHNhbWUgcHJvY2VkdXJlIGZvciB0aGUgcHJlZml4LlxuXHRcdGlmICggcHJlZml4ICYmIHN0clN0YXJ0c1dpdGgoaW5wdXQsIHByZWZpeCkgKSB7XG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UocHJlZml4LCAnJyk7XG5cdFx0fVxuXG5cdFx0Ly8gQW5kIGFnYWluIGZvciBuZWdhdGl2ZS5cblx0XHRpZiAoIG5lZ2F0aXZlICYmIHN0clN0YXJ0c1dpdGgoaW5wdXQsIG5lZ2F0aXZlKSApIHtcblx0XHRcdGlucHV0ID0gaW5wdXQucmVwbGFjZShuZWdhdGl2ZSwgJycpO1xuXHRcdFx0aW5wdXRJc05lZ2F0aXZlID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBSZW1vdmUgdGhlIHN1ZmZpeC5cblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TdHJpbmcvc2xpY2Vcblx0XHRpZiAoIHN1ZmZpeCAmJiBzdHJFbmRzV2l0aChpbnB1dCwgc3VmZml4KSApIHtcblx0XHRcdGlucHV0ID0gaW5wdXQuc2xpY2UoMCwgLTEgKiBzdWZmaXgubGVuZ3RoKTtcblx0XHR9XG5cblx0XHQvLyBSZW1vdmUgdGhlIHRob3VzYW5kIGdyb3VwaW5nLlxuXHRcdGlmICggdGhvdXNhbmQgKSB7XG5cdFx0XHRpbnB1dCA9IGlucHV0LnNwbGl0KHRob3VzYW5kKS5qb2luKCcnKTtcblx0XHR9XG5cblx0XHQvLyBTZXQgdGhlIGRlY2ltYWwgc2VwYXJhdG9yIGJhY2sgdG8gcGVyaW9kLlxuXHRcdGlmICggbWFyayApIHtcblx0XHRcdGlucHV0ID0gaW5wdXQucmVwbGFjZShtYXJrLCAnLicpO1xuXHRcdH1cblxuXHRcdC8vIFByZXBlbmQgdGhlIG5lZ2F0aXZlIHN5bWJvbC5cblx0XHRpZiAoIGlucHV0SXNOZWdhdGl2ZSApIHtcblx0XHRcdG91dHB1dCArPSAnLSc7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIHRoZSBudW1iZXJcblx0XHRvdXRwdXQgKz0gaW5wdXQ7XG5cblx0XHQvLyBUcmltIGFsbCBub24tbnVtZXJpYyBjaGFyYWN0ZXJzIChhbGxvdyAnLicgYW5kICctJyk7XG5cdFx0b3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL1teMC05XFwuXFwtLl0vZywgJycpO1xuXG5cdFx0Ly8gVGhlIHZhbHVlIGNvbnRhaW5zIG5vIHBhcnNlLWFibGUgbnVtYmVyLlxuXHRcdGlmICggb3V0cHV0ID09PSAnJyApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBDb3ZlcnQgdG8gbnVtYmVyLlxuXHRcdG91dHB1dCA9IE51bWJlcihvdXRwdXQpO1xuXG5cdFx0Ly8gUnVuIHRoZSB1c2VyLXNwZWNpZmllZCBwb3N0LWRlY29kZXIuXG5cdFx0aWYgKCBkZWNvZGVyICkge1xuXHRcdFx0b3V0cHV0ID0gZGVjb2RlcihvdXRwdXQpO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIGlzIHRoZSBvdXRwdXQgaXMgdmFsaWQsIG90aGVyd2lzZTogcmV0dXJuIGZhbHNlLlxuXHRcdGlmICggIWlzVmFsaWROdW1iZXIob3V0cHV0KSApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9XG5cblxuLy8gRnJhbWV3b3JrXG5cblx0Ly8gVmFsaWRhdGUgZm9ybWF0dGluZyBvcHRpb25zXG5cdGZ1bmN0aW9uIHZhbGlkYXRlICggaW5wdXRPcHRpb25zICkge1xuXG5cdFx0dmFyIGksIG9wdGlvbk5hbWUsIG9wdGlvblZhbHVlLFxuXHRcdFx0ZmlsdGVyZWRPcHRpb25zID0ge307XG5cblx0XHRpZiAoIGlucHV0T3B0aW9uc1snc3VmZml4J10gPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdGlucHV0T3B0aW9uc1snc3VmZml4J10gPSBpbnB1dE9wdGlvbnNbJ3Bvc3RmaXgnXTtcblx0XHR9XG5cblx0XHRmb3IgKCBpID0gMDsgaSA8IEZvcm1hdE9wdGlvbnMubGVuZ3RoOyBpKz0xICkge1xuXG5cdFx0XHRvcHRpb25OYW1lID0gRm9ybWF0T3B0aW9uc1tpXTtcblx0XHRcdG9wdGlvblZhbHVlID0gaW5wdXRPcHRpb25zW29wdGlvbk5hbWVdO1xuXG5cdFx0XHRpZiAoIG9wdGlvblZhbHVlID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0Ly8gT25seSBkZWZhdWx0IGlmIG5lZ2F0aXZlQmVmb3JlIGlzbid0IHNldC5cblx0XHRcdFx0aWYgKCBvcHRpb25OYW1lID09PSAnbmVnYXRpdmUnICYmICFmaWx0ZXJlZE9wdGlvbnMubmVnYXRpdmVCZWZvcmUgKSB7XG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gJy0nO1xuXHRcdFx0XHQvLyBEb24ndCBzZXQgYSBkZWZhdWx0IGZvciBtYXJrIHdoZW4gJ3Rob3VzYW5kJyBpcyBzZXQuXG5cdFx0XHRcdH0gZWxzZSBpZiAoIG9wdGlvbk5hbWUgPT09ICdtYXJrJyAmJiBmaWx0ZXJlZE9wdGlvbnMudGhvdXNhbmQgIT09ICcuJyApIHtcblx0XHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnNbb3B0aW9uTmFtZV0gPSAnLic7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0Ly8gRmxvYXRpbmcgcG9pbnRzIGluIEpTIGFyZSBzdGFibGUgdXAgdG8gNyBkZWNpbWFscy5cblx0XHRcdH0gZWxzZSBpZiAoIG9wdGlvbk5hbWUgPT09ICdkZWNpbWFscycgKSB7XG5cdFx0XHRcdGlmICggb3B0aW9uVmFsdWUgPj0gMCAmJiBvcHRpb25WYWx1ZSA8IDggKSB7XG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gb3B0aW9uVmFsdWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKG9wdGlvbk5hbWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdC8vIFRoZXNlIG9wdGlvbnMsIHdoZW4gcHJvdmlkZWQsIG11c3QgYmUgZnVuY3Rpb25zLlxuXHRcdFx0fSBlbHNlIGlmICggb3B0aW9uTmFtZSA9PT0gJ2VuY29kZXInIHx8IG9wdGlvbk5hbWUgPT09ICdkZWNvZGVyJyB8fCBvcHRpb25OYW1lID09PSAnZWRpdCcgfHwgb3B0aW9uTmFtZSA9PT0gJ3VuZG8nICkge1xuXHRcdFx0XHRpZiAoIHR5cGVvZiBvcHRpb25WYWx1ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnNbb3B0aW9uTmFtZV0gPSBvcHRpb25WYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3Iob3B0aW9uTmFtZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0Ly8gT3RoZXIgb3B0aW9ucyBhcmUgc3RyaW5ncy5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKCB0eXBlb2Ygb3B0aW9uVmFsdWUgPT09ICdzdHJpbmcnICkge1xuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9IG9wdGlvblZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihvcHRpb25OYW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNvbWUgdmFsdWVzIGNhbid0IGJlIGV4dHJhY3RlZCBmcm9tIGFcblx0XHQvLyBzdHJpbmcgaWYgY2VydGFpbiBjb21iaW5hdGlvbnMgYXJlIHByZXNlbnQuXG5cdFx0dGhyb3dFcXVhbEVycm9yKGZpbHRlcmVkT3B0aW9ucywgJ21hcmsnLCAndGhvdXNhbmQnKTtcblx0XHR0aHJvd0VxdWFsRXJyb3IoZmlsdGVyZWRPcHRpb25zLCAncHJlZml4JywgJ25lZ2F0aXZlJyk7XG5cdFx0dGhyb3dFcXVhbEVycm9yKGZpbHRlcmVkT3B0aW9ucywgJ3ByZWZpeCcsICduZWdhdGl2ZUJlZm9yZScpO1xuXG5cdFx0cmV0dXJuIGZpbHRlcmVkT3B0aW9ucztcblx0fVxuXG5cdC8vIFBhc3MgYWxsIG9wdGlvbnMgYXMgZnVuY3Rpb24gYXJndW1lbnRzXG5cdGZ1bmN0aW9uIHBhc3NBbGwgKCBvcHRpb25zLCBtZXRob2QsIGlucHV0ICkge1xuXHRcdHZhciBpLCBhcmdzID0gW107XG5cblx0XHQvLyBBZGQgYWxsIG9wdGlvbnMgaW4gb3JkZXIgb2YgRm9ybWF0T3B0aW9uc1xuXHRcdGZvciAoIGkgPSAwOyBpIDwgRm9ybWF0T3B0aW9ucy5sZW5ndGg7IGkrPTEgKSB7XG5cdFx0XHRhcmdzLnB1c2gob3B0aW9uc1tGb3JtYXRPcHRpb25zW2ldXSk7XG5cdFx0fVxuXG5cdFx0Ly8gQXBwZW5kIHRoZSBpbnB1dCwgdGhlbiBjYWxsIHRoZSBtZXRob2QsIHByZXNlbnRpbmcgYWxsXG5cdFx0Ly8gb3B0aW9ucyBhcyBhcmd1bWVudHMuXG5cdFx0YXJncy5wdXNoKGlucHV0KTtcblx0XHRyZXR1cm4gbWV0aG9kLmFwcGx5KCcnLCBhcmdzKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHdOdW1iICggb3B0aW9ucyApIHtcblxuXHRcdGlmICggISh0aGlzIGluc3RhbmNlb2Ygd051bWIpICkge1xuXHRcdFx0cmV0dXJuIG5ldyB3TnVtYiAoIG9wdGlvbnMgKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBvcHRpb25zICE9PSBcIm9iamVjdFwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdG9wdGlvbnMgPSB2YWxpZGF0ZShvcHRpb25zKTtcblxuXHRcdC8vIENhbGwgJ2Zvcm1hdFRvJyB3aXRoIHByb3BlciBhcmd1bWVudHMuXG5cdFx0dGhpcy50byA9IGZ1bmN0aW9uICggaW5wdXQgKSB7XG5cdFx0XHRyZXR1cm4gcGFzc0FsbChvcHRpb25zLCBmb3JtYXRUbywgaW5wdXQpO1xuXHRcdH07XG5cblx0XHQvLyBDYWxsICdmb3JtYXRGcm9tJyB3aXRoIHByb3BlciBhcmd1bWVudHMuXG5cdFx0dGhpcy5mcm9tID0gZnVuY3Rpb24gKCBpbnB1dCApIHtcblx0XHRcdHJldHVybiBwYXNzQWxsKG9wdGlvbnMsIGZvcm1hdEZyb20sIGlucHV0KTtcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHdOdW1iO1xuXG59KSk7XG4iXX0=
