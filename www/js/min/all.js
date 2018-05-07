function OnePoint(point, scale) {
	var sphere = new THREE.SphereBufferGeometry(2,50,50);
	var sphereMesh = new THREE.Mesh(sphere, RGBMaterial);

	sphereMesh.position.copy(point.clone().multiplyScalar(scale));

	return sphereMesh;
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

			try {
				let mesh = new MeshFromPtsArray(subArray, scale);
				mesh.visible = true;

				this.meshById.set(keyFromPtArray(subArray, allPoints), mesh);

				this.meshGroup.add(mesh);
			} catch(err) {
				console.log(err);
			}
		}
	}

	fromPtsNumber.call(this,1);
	fromPtsNumber.call(this,2);
	fromPtsNumber.call(this,3);

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
	for(let i=1; i<=3; i++){
		let gen = subsets(ptsArray, i);
		for(let sub of gen) {
			let array = Array.from(sub);
			//console.log(array);
			let key = keyFromPtArray(array);
			
			if(this.meshById.has(key))
				this.meshById.get(key).visible = value;
		}
		
	
	}
	//console.log(this.meshById);
	
}

function keyFromPtArray(array, indexer) {
    let sorted = array.sort((a, b) => a - b);

	if(indexer != null){
		return array.reduce((acc, v) => acc + 1 << indexer.indexOf(v), 0);
	} else {
		return array.reduce((acc, v) => acc + 1 << v, 0);
	}
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
/*function makeTextSprite( note, scale, parameters )
{
	var message;

	if(note == 0) {
		message = 'C';
	} else if(note == 1) {
		message = 'C#';
	} else if(note == 2) {
		message = 'D';
	} else if(note == 3) {
		message = 'D#';
	} else if(note == 4) {
		message = 'E';
	} else if(note == 5) {
		message = 'F';
	} else if(note == 6) {
		message = 'F#';
	} else if(note == 7) {
		message = 'G';
	} else if(note == 8) {
		message = 'G#';
	} else if(note == 9) {
		message = 'A';
	} else if(note == 10) {
		message = 'A#';
	} else {
		message = 'B';
	}


	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 18;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 4;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	//var spriteAlignment = parameters.hasOwnProperty("alignment") ?
	//	parameters["alignment"] : THREE.SpriteAlignment.topLeft;

	var spriteAlignment = THREE.SpriteAlignment.topLeft;
		

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	sprite.position.copy(allPoints[noteVal].clone().multiplyScalar(scale))
	return sprite;	
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}*/
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
			
			slider = new Slider(fileInput, allMeshes, midiToChord.chordsMap);
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

				if(prevTime != eventTime && currNotes.length != 0)
					thisObj.chordsMap.set(eventTime, Array.from(new Set(currNotes)));

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

	if(slider.noUiSlider != null)
		slider.noUiSlider.destroy();

	noUiSlider.create(slider, {
		start: [ 0, 500 ],
		connect: true,
		tooltips: [ true, true ],
		range: {
			'min': lowBound,
			'max': upBound
		},
		format: wNumb({
			decimals: 0
		})
	});

	slider.noUiSlider.on('update', function(values, handle) {
		let value = values[handle];
		if(handle === 1) {
			up = parseInt(value);
		} else {
			low = parseInt(value);
		}
		
		// allMeshes.meshesById.values().forEach(function(val, key) {
		// 	val.visible = false;
		// });
		
		for(let i=lowBound; i<upBound; i++) {
			if(i>=low && i<=up) {
				if(chordsMap.has(i)) {				
					allMeshes.showFromPtsArray(chordsMap.get(i), true);
				}
			} else {
				if(chordsMap.has(i)) {				
					allMeshes.showFromPtsArray(chordsMap.get(i), false);
				}
			}
			
		}
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9uZVBvaW50LmpzIiwiVGhyZWVQb2ludHMuanMiLCJUd29Qb2ludHMuanMiLCJBbGxNZXNoZXMuanMiLCJBbGxQb2ludHMuanMiLCJDb21iaW5hdGlvbnMuanMiLCJHbG9iYWxMaWdodHMuanMiLCJNYXRlcmlhbHMuanMiLCJQb2x5Q3lsaW5kZXIuanMiLCJQb2x5TWVzaGVzLmpzIiwiUG9seVNwaGVyZS5qcyIsIlRleHRTcHJpdGUuanMiLCJUcmFuc3BNZXNoR3JwLmpzIiwiY2hvcmQuanMiLCJyZW5kZXIyLmpzIiwiYmFzZUNvbnZlcnRlci5qcyIsIm1pZGktcGFyc2VyLmpzIiwibWlkaVBhcnNlci5qcyIsInB5dGVzdC5qcyIsInNlbmRNaWRpVG9QeS5qcyIsInRpbWVsaW5lLmpzIiwibm91aXNsaWRlci5taW4uanMiLCJ3TnVtYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BEQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBPbmVQb2ludChwb2ludCwgc2NhbGUpIHtcclxuXHR2YXIgc3BoZXJlID0gbmV3IFRIUkVFLlNwaGVyZUJ1ZmZlckdlb21ldHJ5KDIsNTAsNTApO1xyXG5cdHZhciBzcGhlcmVNZXNoID0gbmV3IFRIUkVFLk1lc2goc3BoZXJlLCBSR0JNYXRlcmlhbCk7XHJcblxyXG5cdHNwaGVyZU1lc2gucG9zaXRpb24uY29weShwb2ludC5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKSk7XHJcblxyXG5cdHJldHVybiBzcGhlcmVNZXNoO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93T25lUG9pbnQoaW5kZXgpIHtcclxuXHRzcGhlcmVzLmdldChpbmRleCkudmlzaWJsZSA9IHRydWU7XHJcbn0iLCJmdW5jdGlvbiBUaHJlZVBvaW50cyhwb2ludHMsIHNjYWxlKSB7XHJcblx0dGhpcy5ncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cdGxldCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCgge1xyXG5cdFx0b3BhY2l0eTogMC4yLFxyXG5cdFx0dHJhbnNwYXJlbnQ6IHRydWUsXHJcblx0XHRkZXB0aFdyaXRlOiBmYWxzZSxcclxuXHRcdHNpZGU6IFRIUkVFLkRvdWJsZVNpZGVcclxuXHR9ICk7XHJcblx0Lyp2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuXHRmb3IodmFyIG5vdGUgaW4gbm90ZXMpIHtcclxuXHRcdGdlb21ldHJ5LnZlcnRpY2VzLnB1c2goIGFsbFBvaW50c1tub3Rlc1tub3RlXV0uY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSkgKTtcclxuXHR9XHJcblxyXG5cdGdlb21ldHJ5LmZhY2VzLnB1c2gobmV3IFRIUkVFLkZhY2UzKDAsMSwyKSk7XHJcblx0Z2VvbWV0cnkuZmFjZXMucHVzaChuZXcgVEhSRUUuRmFjZTMoMiwxLDApKTtcclxuXHRnZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTtcclxuXHJcblx0dmFyIHYxID0gZ2VvbWV0cnkudmVydGljZXNbMF07XHJcblx0dmFyIHYyID0gZ2VvbWV0cnkudmVydGljZXNbMV07XHJcblx0dmFyIHYzID0gZ2VvbWV0cnkudmVydGljZXNbMl07XHJcblxyXG5cdHRoaXMuZ3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjEsIHYyKSk7XHJcblx0dGhpcy5ncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MiwgdjMpKTtcclxuXHR0aGlzLmdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYzLCB2MSkpOyovXHJcblxyXG5cdGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdGxldCBwb3NpdGlvbnMgPSBbXTtcclxuXHRsZXQgbm9ybWFscyA9IFtdO1xyXG5cdFxyXG5cdGZvcihsZXQgcG9pbnQgb2YgcG9pbnRzKSB7XHJcblx0XHRwb3NpdGlvbnMucHVzaChwb2ludC5jbG9uZSgpLngpO1xyXG5cdFx0cG9zaXRpb25zLnB1c2gocG9pbnQuY2xvbmUoKS55KTtcclxuXHRcdHBvc2l0aW9ucy5wdXNoKHBvaW50LmNsb25lKCkueik7XHJcblx0XHRub3JtYWxzLnB1c2goMSwxLDEpO1xyXG5cdH1cclxuXHJcblx0Z2VvbWV0cnkuYWRkQXR0cmlidXRlKCAncG9zaXRpb24nLCBuZXcgVEhSRUUuRmxvYXQzMkJ1ZmZlckF0dHJpYnV0ZSggcG9zaXRpb25zLCAzICkgKTtcclxuXHQvL2dlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ25vcm1hbCcsIG5ldyBUSFJFRS5GbG9hdDMyQnVmZmVyQXR0cmlidXRlKCBub3JtYWxzLCAzICkgKTtcclxuXHJcblx0Z2VvbWV0cnkuc2NhbGUoc2NhbGUsIHNjYWxlLCBzY2FsZSk7XHJcblxyXG5cdHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbC5jbG9uZSgpICk7XHJcblx0dGhpcy5ncm91cC5hZGQoIG1lc2ggKTtcclxuXHQvL3RoaXMuZ3JvdXAuYWRkKG5ldyBQb2x5U3BoZXJlc0Zyb21Ob3Rlcyhub3RlcykpO1xyXG5cclxuXHQvLyBjb25zdCB2MSA9IHBvaW50c1swXS5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKTtcclxuXHQvLyBjb25zdCB2MiA9IHBvaW50c1sxXS5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKTtcclxuXHQvLyBjb25zdCB2MyA9IHBvaW50c1syXS5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKTtcclxuXHJcblx0Ly8gdGhpcy5ncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MSwgdjIpKTtcclxuXHQvLyB0aGlzLmdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYyLCB2MykpO1xyXG5cdC8vIHRoaXMuZ3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjMsIHYxKSk7XHJcblxyXG5cdHJldHVybiB0aGlzLmdyb3VwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93VGhyZWVQb2ludHMocHRzSW5kZXhlcykge1xyXG5cdC8vY29uc29sZS5sb2cocHRzSW5kZXhlcyk7XHJcblx0cHRzSW5kZXhlcy5mb3JFYWNoKGluZGV4ID0+IHtcclxuXHRcdHNob3dPbmVQb2ludChpbmRleCk7XHJcblx0fSk7XHJcblxyXG5cdHN0aWNrcy5nZXQoa2V5RnJvbVB0U2V0KFtwdHNJbmRleGVzWzBdLCBwdHNJbmRleGVzWzFdXSkpLnZpc2libGUgPSB0cnVlO1xyXG5cdHN0aWNrcy5nZXQoa2V5RnJvbVB0U2V0KFtwdHNJbmRleGVzWzFdLCBwdHNJbmRleGVzWzJdXSkpLnZpc2libGUgPSB0cnVlO1xyXG5cdHN0aWNrcy5nZXQoa2V5RnJvbVB0U2V0KFtwdHNJbmRleGVzWzJdLCBwdHNJbmRleGVzWzBdXSkpLnZpc2libGUgPSB0cnVlO1xyXG5cclxuXHRmYWNlcy5nZXQoa2V5RnJvbVB0U2V0KHB0c0luZGV4ZXMpKS52aXNpYmxlID0gdHJ1ZTtcclxufSIsImZ1bmN0aW9uIFR3b1BvaW50cyhwb2ludDEsIHBvaW50Miwgc2NhbGUpIHtcclxuXHJcblx0dmFyIHYxID0gcG9pbnQxLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cdHZhciB2MiA9IHBvaW50Mi5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKTtcclxuXHJcblx0Ly8gdmFyIGN5bGluZGVyID0gbmV3IFRIUkVFLkN5bGluZGVyQnVmZmVyR2VvbWV0cnkoMC40LCAwLjQsIHYxLmRpc3RhbmNlVG8odjIpLCAxMCwgMC41LCB0cnVlKTtcclxuXHJcblx0dGhpcy5ncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuXHQvKnZhciBzcGhlcmVBTWVzaCA9IHNwaGVyZU1lc2guY2xvbmUoKTtcclxuXHRzcGhlcmVBTWVzaC5wb3NpdGlvbi5jb3B5KHYxKTtcclxuXHRzcGhlcmVBTWVzaC51cGRhdGVNYXRyaXgoKTtcclxuXHJcblx0dmFyIHNwaGVyZUJNZXNoID0gc3BoZXJlTWVzaC5jbG9uZSgpO1xyXG5cdHNwaGVyZUJNZXNoLnBvc2l0aW9uLmNvcHkodjIpO1xyXG5cdHNwaGVyZUJNZXNoLnVwZGF0ZU1hdHJpeCgpOyovXHJcblxyXG5cdHZhciBjeWxpbmRlck1lc2ggPSBuZXcgQ3lsaW5kZXJGcm9tUHRzKHYxLCB2Mik7XHJcblxyXG5cdC8qdGhpcy5ncm91cC5hZGQoc3BoZXJlc1tub3RlVmFsMV0pO1xyXG5cdHRoaXMuZ3JvdXAuYWRkKHNwaGVyZXNbbm90ZVZhbDJdKTsqL1xyXG5cdHRoaXMuZ3JvdXAuYWRkKGN5bGluZGVyTWVzaCk7XHJcblxyXG5cdHJldHVybiB0aGlzLmdyb3VwO1xyXG59XHRcclxuXHJcbmZ1bmN0aW9uIHNob3dUd29Qb2ludHMoaW5kZXhlcykge1xyXG5cdGNvbnNvbGUubG9nKFwic2hvd1R3b1BvaW50c1wiKTtcclxuXHRcclxuXHRzaG93T25lUG9pbnQoaW5kZXhlc1swXSk7XHJcblx0c2hvd09uZVBvaW50KGluZGV4ZXNbMV0pO1xyXG5cdC8vY29uc29sZS5sb2coJ3N0aWNrcycsIHN0aWNrcyk7XHJcblx0Ly9jb25zb2xlLmxvZygna2V5RnJvbVB0U2V0Jywga2V5RnJvbVB0U2V0KGluZGV4ZXMpKTtcclxuXHRzdGlja3MuZ2V0KGtleUZyb21QdFNldChpbmRleGVzKSkudmlzaWJsZSA9IHRydWU7XHJcbn0iLCJmdW5jdGlvbiBBbGxNZXNoZXMoZ2l2ZW5TY2FsZSkge1xyXG5cdHRoaXMubWVzaEJ5SWQgPSBuZXcgTWFwKCk7XHJcblx0dGhpcy5sYWJlbHMgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHR0aGlzLm1lc2hHcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuXHRsZXQgc2NhbGUgPSBnaXZlblNjYWxlO1xyXG5cclxuXHRmdW5jdGlvbiBmcm9tUHRzTnVtYmVyKG51bWJlcikge1xyXG5cdFx0Y29uc3QgZ2VuID0gc3Vic2V0cyhhbGxQb2ludHMsIG51bWJlcik7XHJcblx0XHRcclxuXHRcdGZvcihsZXQgc3Vic2V0IG9mIGdlbikge1xyXG5cdFx0XHRsZXQgc3ViQXJyYXkgPSBBcnJheS5mcm9tKHN1YnNldCk7XHJcblxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGxldCBtZXNoID0gbmV3IE1lc2hGcm9tUHRzQXJyYXkoc3ViQXJyYXksIHNjYWxlKTtcclxuXHRcdFx0XHRtZXNoLnZpc2libGUgPSB0cnVlO1xyXG5cclxuXHRcdFx0XHR0aGlzLm1lc2hCeUlkLnNldChrZXlGcm9tUHRBcnJheShzdWJBcnJheSwgYWxsUG9pbnRzKSwgbWVzaCk7XHJcblxyXG5cdFx0XHRcdHRoaXMubWVzaEdyb3VwLmFkZChtZXNoKTtcclxuXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmcm9tUHRzTnVtYmVyLmNhbGwodGhpcywxKTtcclxuXHRmcm9tUHRzTnVtYmVyLmNhbGwodGhpcywyKTtcclxuXHRmcm9tUHRzTnVtYmVyLmNhbGwodGhpcywzKTtcclxuXHJcblx0XHQvL2NyZWF0ZXMgYWxsIHBvaW50IG1lc2hlc1xyXG5cdC8qYWxsUG9pbnRzLmZvckVhY2goKHBvaW50LCBpKSA9PiB7XHJcblx0XHRsZXQgc3BoZXJlID0gbmV3IE9uZVBvaW50KHBvaW50LCBzY2FsZSk7XHJcblx0XHRzcGhlcmUudmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0c3BoZXJlcy5zZXQoaSxzcGhlcmUpO1xyXG5cclxuXHRcdHNjZW5lLmFkZChzcGhlcmUpO1xyXG5cdH0pO1xyXG5cclxuXHRjb25zdCBzdGlja0dlbiA9IHN1YnNldHMoYWxsUG9pbnRzLCAyKTtcclxuXHRsZXQgc3RpY2tQdHM7XHJcblx0d2hpbGUoIShzdGlja1B0cyA9IHN0aWNrR2VuLm5leHQoKSkuZG9uZSkge1xyXG5cdFx0bGV0IHN0aWNrUHRzQXJyYXkgPSBBcnJheS5mcm9tKHN0aWNrUHRzLnZhbHVlKTtcclxuXHRcdGxldCBwMSA9IHN0aWNrUHRzQXJyYXlbMF07XHJcblx0XHRsZXQgcDIgPSBzdGlja1B0c0FycmF5WzFdO1xyXG5cdFx0XHJcblx0XHRsZXQgc3RpY2sgPSBuZXcgVHdvUG9pbnRzKHAxLCBwMiwgc2NhbGUpO1xyXG5cdFx0c3RpY2sudmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0XHJcblx0XHRzdGlja3Muc2V0KGtleUZyb21QdFNldChzdGlja1B0c0FycmF5LCBhbGxQb2ludHMpLCBzdGljayk7XHJcblxyXG5cdFx0c2NlbmUuYWRkKHN0aWNrKTtcclxuXHR9XHJcblxyXG5cdGNvbnN0IGZhY2VHZW4gPSBzdWJzZXRzKGFsbFBvaW50cywgMyk7XHJcblx0bGV0IGZhY2VQdHM7XHJcblx0d2hpbGUoIShmYWNlUHRzID0gZmFjZUdlbi5uZXh0KCkpLmRvbmUpIHtcclxuICAgICAgICBsZXQgZmFjZVB0c0FycmF5ID0gQXJyYXkuXHRmcm9tKGZhY2VQdHMudmFsdWUpO1xyXG5cclxuICAgICAgICBsZXQgZmFjZSA9IG5ldyBUaHJlZVBvaW50cyhmYWNlUHRzQXJyYXksIHNjYWxlKTtcclxuICAgICAgICBmYWNlLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICBcclxuXHRcdGZhY2VzLnNldChrZXlGcm9tUHRTZXQoZmFjZVB0c0FycmF5LCBhbGxQb2ludHMpLCBmYWNlKTtcclxuXHJcblx0XHRzY2VuZS5hZGQoZmFjZSk7XHJcblx0fSovXHJcbn1cclxuXHJcbkFsbE1lc2hlcy5wcm90b3R5cGUuc2hvd0Zyb21QdHNBcnJheSA9IGZ1bmN0aW9uKHB0c0FycmF5LCB2YWx1ZSkge1xyXG5cdGZvcihsZXQgaT0xOyBpPD0zOyBpKyspe1xyXG5cdFx0bGV0IGdlbiA9IHN1YnNldHMocHRzQXJyYXksIGkpO1xyXG5cdFx0Zm9yKGxldCBzdWIgb2YgZ2VuKSB7XHJcblx0XHRcdGxldCBhcnJheSA9IEFycmF5LmZyb20oc3ViKTtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyhhcnJheSk7XHJcblx0XHRcdGxldCBrZXkgPSBrZXlGcm9tUHRBcnJheShhcnJheSk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZih0aGlzLm1lc2hCeUlkLmhhcyhrZXkpKVxyXG5cdFx0XHRcdHRoaXMubWVzaEJ5SWQuZ2V0KGtleSkudmlzaWJsZSA9IHZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHJcblx0fVxyXG5cdC8vY29uc29sZS5sb2codGhpcy5tZXNoQnlJZCk7XHJcblx0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGtleUZyb21QdEFycmF5KGFycmF5LCBpbmRleGVyKSB7XHJcbiAgICBsZXQgc29ydGVkID0gYXJyYXkuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG5cclxuXHRpZihpbmRleGVyICE9IG51bGwpe1xyXG5cdFx0cmV0dXJuIGFycmF5LnJlZHVjZSgoYWNjLCB2KSA9PiBhY2MgKyAxIDw8IGluZGV4ZXIuaW5kZXhPZih2KSwgMCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiBhcnJheS5yZWR1Y2UoKGFjYywgdikgPT4gYWNjICsgMSA8PCB2LCAwKTtcclxuXHR9XHJcbn0iLCJjb25zdCBhbGxQb2ludHMgPSBbXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuNzU5NjYwNjkzMDQ3LCAwLjYwNDI5MjcwNDA3OSwgLTAuMjQwMzAzODg5MzUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjQ4NDI2Njg0ODc3NywgLTAuMjA2Nzc3MDQ3MTE5LCAtMC44NTAxMzQ2MTk5MDQpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjkyMDIzNzkxODExNCwgLTAuMzgwNjkzMzkxODE2LCAwLjA5MDc0NTMzMzE3OTQpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuNDg0MjYyODA1MDkzLCAwLjIwNjc3OTk3NTk2OCwgMC44NTAxMzYyMTA5MzUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuMTUxNDUxNjE5ODgsIDAuNjI2MzY4MzE2MDczLCAtMC43NjQ2NzMyMjM5NjkpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuOTIwMjM5NzgyOTIyLCAwLjM4MDY4OTYwNjIyOSwgLTAuMDkwNzQyMzAzNDU0NSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoMC41NTM5Njk1NjEwMDUsIC0wLjM0NDk3MTA0NTU1NiwgLTAuNzU3NzAyMjUyMzQ1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC4xMDgzNjk2MTk5ODUsIC0wLjk2NzM2ODg1NTIyNywgLTAuMjI5MDI3MzQyMDM3KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC4xNTE0NTAwNjg5NzQsIC0wLjYyNjM2OTQyMDkyNywgMC43NjQ2NzI2MjYxMTkpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuNzU5NjU5OTAwOTcxLCAtMC42MDQyOTI5ODczMzMsIDAuMjQwMzA1NjgwOTkxKSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjEwODM3MTgwNTk2NCwgMC45NjczNjk3MDM4NjIsIDAuMjI5MDIyNzIzMTU1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC41NTM5NzAzMjY5MzgsIDAuMzQ0OTcyNDQxNzY3LCAwLjc1NzcwMTA1NjY4KVxyXG5dO1xyXG5cclxuLypcclxudmFyIGFsbFBvaW50cyA9IFtcclxuXHRbLTAuNzU5NjYwNjkzMDQ3LCAwLjYwNDI5MjcwNDA3OSwgLTAuMjQwMzAzODg5MzVdLFxyXG5cdFstMC40ODQyNjY4NDg3NzcsIC0wLjIwNjc3NzA0NzExOSwgLTAuODUwMTM0NjE5OTA0XSxcclxuXHRbLTAuOTIwMjM3OTE4MTE0LCAtMC4zODA2OTMzOTE4MTYsIDAuMDkwNzQ1MzMzMTc5NF0sXHJcblx0WzAuNDg0MjYyODA1MDkzLCAwLjIwNjc3OTk3NTk2OCwgMC44NTAxMzYyMTA5MzVdLFxyXG5cdFswLjE1MTQ1MTYxOTg4LCAwLjYyNjM2ODMxNjA3MywgLTAuNzY0NjczMjIzOTY5XSxcclxuXHRbMC45MjAyMzk3ODI5MjIsIDAuMzgwNjg5NjA2MjI5LCAtMC4wOTA3NDIzMDM0NTQ1XSxcclxuXHRbMC41NTM5Njk1NjEwMDUsIC0wLjM0NDk3MTA0NTU1NiwgLTAuNzU3NzAyMjUyMzQ1XSxcclxuXHRbLTAuMTA4MzY5NjE5OTg1LCAtMC45NjczNjg4NTUyMjcsIC0wLjIyOTAyNzM0MjAzN10sXHJcblx0Wy0wLjE1MTQ1MDA2ODk3NCwgLTAuNjI2MzY5NDIwOTI3LCAwLjc2NDY3MjYyNjExOV0sXHJcblx0WzAuNzU5NjU5OTAwOTcxLCAtMC42MDQyOTI5ODczMzMsIDAuMjQwMzA1NjgwOTkxXSxcclxuXHRbMC4xMDgzNzE4MDU5NjQsIDAuOTY3MzY5NzAzODYyLCAwLjIyOTAyMjcyMzE1NV0sXHJcblx0Wy0wLjU1Mzk3MDMyNjkzOCwgMC4zNDQ5NzI0NDE3NjcsIDAuNzU3NzAxMDU2NjhdXHJcbl07XHJcbiovIiwiZnVuY3Rpb24qIHN1YnNldHMoYXJyYXksIGxlbmd0aCwgc3RhcnQgPSAwKSB7XHJcbiAgaWYgKHN0YXJ0ID49IGFycmF5Lmxlbmd0aCB8fCBsZW5ndGggPCAxKSB7XHJcbiAgICB5aWVsZCBuZXcgU2V0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdoaWxlIChzdGFydCA8PSBhcnJheS5sZW5ndGggLSBsZW5ndGgpIHtcclxuICAgICAgbGV0IGZpcnN0ID0gYXJyYXlbc3RhcnRdO1xyXG4gICAgICBmb3IgKHN1YnNldCBvZiBzdWJzZXRzKGFycmF5LCBsZW5ndGggLSAxLCBzdGFydCArIDEpKSB7XHJcbiAgICAgICAgc3Vic2V0LmFkZChmaXJzdCk7XHJcbiAgICAgICAgeWllbGQgc3Vic2V0O1xyXG4gICAgICB9XHJcbiAgICAgICsrc3RhcnQ7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiZnVuY3Rpb24gR2xvYmFsTGlnaHRzKGRpc3RGcm9tTWlkKSB7XHJcblx0Y29uc3QgZGlzdGFuY2UgPSBkaXN0RnJvbU1pZDtcclxuXHRjb25zdCBsaWdodHNHcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuXHQvL3RvcCBsaWdodHNcclxuXHRsZXQgcG9pbnRMaWdodDEgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweGZmMDAwMCwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0MS5wb3NpdGlvbi5zZXQoZGlzdGFuY2UsIGRpc3RhbmNlLCBkaXN0YW5jZSk7XHJcblx0bGlnaHRzR3JvdXAuYWRkKHBvaW50TGlnaHQxKTtcclxuXHJcblx0LypsZXQgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodDEsIDEpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdGxldCBwb2ludExpZ2h0MiA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4MDBmZjAwLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQyLnBvc2l0aW9uLnNldChkaXN0YW5jZSwgZGlzdGFuY2UsIC1kaXN0YW5jZSk7XHJcblx0bGlnaHRzR3JvdXAuYWRkKHBvaW50TGlnaHQyKTtcclxuXHJcblx0LypsZXQgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodDIsIDEpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdGxldCBwb2ludExpZ2h0MyA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmZmZjAwLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQzLnBvc2l0aW9uLnNldCgtZGlzdGFuY2UsIGRpc3RhbmNlLCBkaXN0YW5jZSk7XHJcblx0bGlnaHRzR3JvdXAuYWRkKHBvaW50TGlnaHQzKTtcclxuXHJcblx0LypsZXQgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodDMsIDEpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdGxldCBwb2ludExpZ2h0NCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4MDAwMGZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQ0LnBvc2l0aW9uLnNldCgtZGlzdGFuY2UsIGRpc3RhbmNlLCAtZGlzdGFuY2UpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChwb2ludExpZ2h0NCk7XHJcblxyXG5cdC8qbGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQ0LCAxKTtcclxuXHRsaWdodHNHcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHJcblx0Ly9ib3R0b20gbGlnaHRzXHJcblx0bGV0IHBvaW50TGlnaHQ1ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHgwMGZmZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodDUucG9zaXRpb24uc2V0KGRpc3RhbmNlLCAtZGlzdGFuY2UsIGRpc3RhbmNlKTtcclxuXHRsaWdodHNHcm91cC5hZGQocG9pbnRMaWdodDUpO1xyXG5cclxuXHQvKmxldCBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0NSwgMSk7XHJcblx0bGlnaHRzR3JvdXAuYWRkKGhlbHBlcik7Ki9cclxuXHJcblx0bGV0IHBvaW50TGlnaHQ2ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZjAwZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodDYucG9zaXRpb24uc2V0KGRpc3RhbmNlLCAtZGlzdGFuY2UsIC1kaXN0YW5jZSk7XHJcblx0bGlnaHRzR3JvdXAuYWRkKHBvaW50TGlnaHQ2KTtcclxuXHJcblx0LypsZXQgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodDYsIDEpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChoZWxwZXIpO1xyXG4qL1xyXG5cdGxldCBwb2ludExpZ2h0NyA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmY4ODg4LCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQ3LnBvc2l0aW9uLnNldCgtZGlzdGFuY2UsIC1kaXN0YW5jZSwgZGlzdGFuY2UpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChwb2ludExpZ2h0Nyk7XHJcblxyXG5cdC8qbGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQ3LCAxKTtcclxuXHRsaWdodHNHcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHRsZXQgcG9pbnRMaWdodDggPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDg4ODhmZiwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0OC5wb3NpdGlvbi5zZXQoLWRpc3RhbmNlLCAtZGlzdGFuY2UsIC1kaXN0YW5jZSk7XHJcblx0bGlnaHRzR3JvdXAuYWRkKHBvaW50TGlnaHQ4KTtcclxuXHJcblx0LypsZXQgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodDgsIDEpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cclxuXHJcblx0Ly9taWRkbGUgbGlnaHRcclxuXHQvKmxldCBwb2ludExpZ2h0OSA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmZmZmZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQ5LnBvc2l0aW9uLnNldCh4LCB5LCB6KTtcclxuXHRsaWdodHNHcm91cC5hZGQocG9pbnRMaWdodDkpO1xyXG5cclxuXHRsZXQgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodDksIDEpO1xyXG5cdGdyb3VwLmFkZChoZWxwZXIpOyovXHJcblx0cmV0dXJuIGxpZ2h0c0dyb3VwO1xyXG59IiwiY29uc3QgdHJhbnNwYXJlbnRNYXRlcmlhbEZyb250ID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoIHtcclxuXHRjb2xvcjogMHhmZmZmZmYsXHJcblx0b3BhY2l0eTogMC40LFxyXG5cdHRyYW5zcGFyZW50OiB0cnVlLFxyXG5cdHNpZGU6IFRIUkVFLkRvdWJsZVNpZGVcclxufSApO1xyXG5cclxuY29uc3QgdHJhbnNwYXJlbnRNYXRlcmlhbEJhY2sgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCgge1xyXG5cdGNvbG9yOiAweGZmZmZmZixcclxuXHRvcGFjaXR5OiAwLjQsXHJcblx0dHJhbnNwYXJlbnQ6IHRydWVcclxufSApO1xyXG5cclxuY29uc3QgcG9pbnRzTWF0ZXJpYWwgPSBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoIHtcclxuXHRjb2xvcjogMHgwMDgwZmYsXHJcblx0c2l6ZTogMSxcclxuXHRhbHBoYVRlc3Q6IDAuNVxyXG59ICk7XHJcblxyXG5jb25zdCBSR0JNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTm9ybWFsTWF0ZXJpYWwoIHtcclxuXHRjb2xvcjogMHgwMDg4ZmYsXHJcblx0c2lkZTogVEhSRUUuRG91YmxlU2lkZVxyXG59KTtcclxuXHJcbmNvbnN0IFNURE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4MDA4OGZmXHJcbn0pO1xyXG5cclxuY29uc3QgZmxhdFNoYXBlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoIHtcclxuXHRzaWRlIDogVEhSRUUuRG91YmxlU2lkZSxcclxuXHR0cmFuc3BhcmVudCA6IHRydWUsXHJcblx0b3BhY2l0eTogMC41XHJcbn0pOyIsImZ1bmN0aW9uIEN5bGluZGVyRnJvbVB0cyh2MSwgdjIpIHtcclxuXHR2YXIgY3lsaW5kZXIgPSBuZXcgVEhSRUUuQ3lsaW5kZXJCdWZmZXJHZW9tZXRyeSgwLjQsIDAuNCwgdjEuZGlzdGFuY2VUbyh2MiksIDEwLCAwLjUsIHRydWUpO1xyXG5cdHZhciBjeWxpbmRlck1lc2ggPSBuZXcgVEhSRUUuTWVzaChjeWxpbmRlciwgUkdCTWF0ZXJpYWwpO1xyXG5cdGN5bGluZGVyTWVzaC5wb3NpdGlvbi5jb3B5KHYxLmNsb25lKCkubGVycCh2MiwgLjUpKTtcclxuXHJcblx0Ly9jcmVhdGVzIHF1YXRlcm5pb24gZnJvbSBzcGhlcmVzIHBvc2l0aW9uIHRvIHJvdGF0ZSB0aGUgY3lsaW5kZXJcclxuXHR2YXIgcSA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCk7XHJcblx0cS5zZXRGcm9tVW5pdFZlY3RvcnMobmV3IFRIUkVFLlZlY3RvcjMoMCwxLDApLCBuZXcgVEhSRUUuVmVjdG9yMygpLnN1YlZlY3RvcnModjEsIHYyKS5ub3JtYWxpemUoKSk7XHJcblx0Y3lsaW5kZXJNZXNoLnNldFJvdGF0aW9uRnJvbVF1YXRlcm5pb24ocSk7XHJcblx0cmV0dXJuIGN5bGluZGVyTWVzaDtcclxufSIsImZ1bmN0aW9uIFBvbHlNZXNoZXMoZ2VvbWV0cnksIG5vdGVzKSB7XHJcblx0dGhpcy5ncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuXHR0aGlzLmdyb3VwLmFkZChuZXcgVHJhbnNwTWVzaEdycChnZW9tZXRyeSkpO1xyXG5cdC8vdGhpcy5ncm91cC5hZGQobmV3IFBvbHlTcGhlcmVzRnJvbU5vdGVzKG5vdGVzKSk7XHJcblx0cmV0dXJuIHRoaXMuZ3JvdXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIE1lc2hGcm9tUHRzQXJyYXkocHRzQXJyYXksIHNjYWxlKSB7XHJcblx0bGV0IGxlbiA9IHB0c0FycmF5Lmxlbmd0aDtcclxuXHRcclxuXHJcblx0c3dpdGNoKGxlbikge1xyXG5cdFx0Y2FzZSAxOlxyXG5cdFx0XHRyZXR1cm4gbmV3IE9uZVBvaW50KHB0c0FycmF5WzBdLCBzY2FsZSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAyOlxyXG5cdFx0XHRyZXR1cm4gbmV3IFR3b1BvaW50cyhwdHNBcnJheVswXSwgcHRzQXJyYXlbMV0sIHNjYWxlKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIDM6XHJcblx0XHRcdHJldHVybiBuZXcgVGhyZWVQb2ludHMocHRzQXJyYXksIHNjYWxlKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHR0aHJvdyBcIkNhbid0IGNyZWF0ZSBtZXNoIGZvciBzbyBtdWNoIHBvaW50c1wiO1xyXG5cdFx0XHRicmVhaztcclxuXHR9XHJcbn1cclxuXHJcblBvbHlNZXNoZXMucHJvdG90eXBlLnNldFBvcyA9IGZ1bmN0aW9uKHgseSx6KSB7XHJcblx0dGhpcy5ncm91cC5wb3NpdGlvbi54ID0geDtcclxuXHR0aGlzLmdyb3VwLnBvc2l0aW9uLnkgPSB5O1xyXG5cdHRoaXMuZ3JvdXAucG9zaXRpb24ueiA9IHo7XHJcbn0iLCIvLyAvL2NyZWF0ZXMgc3BoZXJlcyBmb3IgZWFjaCB2ZXJ0ZXggb2YgdGhlIGdlb21ldHJ5XHJcbi8vIHZhciBzcGhlcmUgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMiw1MCw1MCk7XHJcbi8vIHZhciBzcGhlcmVNZXNoID0gbmV3IFRIUkVFLk1lc2goc3BoZXJlLCBSR0JNYXRlcmlhbCk7XHJcblxyXG4vLyBmdW5jdGlvbiBQb2x5U3BoZXJlcyhnZW9tZXRyeSkge1xyXG4vLyBcdHRoaXMuZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuLy8gXHR2YXIgbWVzaCA9IHNwaGVyZU1lc2guY2xvbmUoKTtcclxuLy8gXHRmb3IodmFyIGk9MDsgaTxnZW9tZXRyeS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4vLyBcdFx0c3BoZXJlTWVzaC5wb3NpdGlvbi5jb3B5KGdlb21ldHJ5LnZlcnRpY2VzW2ldKTtcclxuLy8gXHRcdHRoaXMuZ3JvdXAuYWRkKHNwaGVyZU1lc2guY2xvbmUoKSk7XHJcbi8vIFx0fVxyXG5cclxuLy8gXHRyZXR1cm4gdGhpcy5ncm91cDtcclxuLy8gfVxyXG5cclxuLy8gZnVuY3Rpb24gUG9seVNwaGVyZXNGcm9tTm90ZXMobm90ZXMpIHtcclxuLy8gXHR2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuLy8gXHRmb3IodmFyIGkgaW4gbm90ZXMpIHtcclxuLy8gXHRcdGdyb3VwLmFkZChzcGhlcmVzLmdldE9iamVjdEJ5SWQobm90ZXNbaV0pLmNsb25lKCkpO1xyXG4vLyBcdH1cclxuLy8gXHQvKmNvbnNvbGUubG9nKGdyb3VwKTsqL1xyXG5cclxuLy8gXHRyZXR1cm4gZ3JvdXA7XHJcbi8vIH0iLCIvKmZ1bmN0aW9uIG1ha2VUZXh0U3ByaXRlKCBub3RlLCBzY2FsZSwgcGFyYW1ldGVycyApXHJcbntcclxuXHR2YXIgbWVzc2FnZTtcclxuXHJcblx0aWYobm90ZSA9PSAwKSB7XHJcblx0XHRtZXNzYWdlID0gJ0MnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDEpIHtcclxuXHRcdG1lc3NhZ2UgPSAnQyMnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDIpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRCc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gMykge1xyXG5cdFx0bWVzc2FnZSA9ICdEIyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gNCkge1xyXG5cdFx0bWVzc2FnZSA9ICdFJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSA1KSB7XHJcblx0XHRtZXNzYWdlID0gJ0YnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDYpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRiMnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDcpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gOCkge1xyXG5cdFx0bWVzc2FnZSA9ICdHIyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gOSkge1xyXG5cdFx0bWVzc2FnZSA9ICdBJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSAxMCkge1xyXG5cdFx0bWVzc2FnZSA9ICdBIyc7XHJcblx0fSBlbHNlIHtcclxuXHRcdG1lc3NhZ2UgPSAnQic7XHJcblx0fVxyXG5cclxuXHJcblx0aWYgKCBwYXJhbWV0ZXJzID09PSB1bmRlZmluZWQgKSBwYXJhbWV0ZXJzID0ge307XHJcblx0XHJcblx0dmFyIGZvbnRmYWNlID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImZvbnRmYWNlXCIpID8gXHJcblx0XHRwYXJhbWV0ZXJzW1wiZm9udGZhY2VcIl0gOiBcIkFyaWFsXCI7XHJcblx0XHJcblx0dmFyIGZvbnRzaXplID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImZvbnRzaXplXCIpID8gXHJcblx0XHRwYXJhbWV0ZXJzW1wiZm9udHNpemVcIl0gOiAxODtcclxuXHRcclxuXHR2YXIgYm9yZGVyVGhpY2tuZXNzID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImJvcmRlclRoaWNrbmVzc1wiKSA/IFxyXG5cdFx0cGFyYW1ldGVyc1tcImJvcmRlclRoaWNrbmVzc1wiXSA6IDQ7XHJcblx0XHJcblx0dmFyIGJvcmRlckNvbG9yID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImJvcmRlckNvbG9yXCIpID9cclxuXHRcdHBhcmFtZXRlcnNbXCJib3JkZXJDb2xvclwiXSA6IHsgcjowLCBnOjAsIGI6MCwgYToxLjAgfTtcclxuXHRcclxuXHR2YXIgYmFja2dyb3VuZENvbG9yID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKSA/XHJcblx0XHRwYXJhbWV0ZXJzW1wiYmFja2dyb3VuZENvbG9yXCJdIDogeyByOjI1NSwgZzoyNTUsIGI6MjU1LCBhOjEuMCB9O1xyXG5cclxuXHQvL3ZhciBzcHJpdGVBbGlnbm1lbnQgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiYWxpZ25tZW50XCIpID9cclxuXHQvL1x0cGFyYW1ldGVyc1tcImFsaWdubWVudFwiXSA6IFRIUkVFLlNwcml0ZUFsaWdubWVudC50b3BMZWZ0O1xyXG5cclxuXHR2YXIgc3ByaXRlQWxpZ25tZW50ID0gVEhSRUUuU3ByaXRlQWxpZ25tZW50LnRvcExlZnQ7XHJcblx0XHRcclxuXHJcblx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0Y29udGV4dC5mb250ID0gXCJCb2xkIFwiICsgZm9udHNpemUgKyBcInB4IFwiICsgZm9udGZhY2U7XHJcbiAgICBcclxuXHQvLyBnZXQgc2l6ZSBkYXRhIChoZWlnaHQgZGVwZW5kcyBvbmx5IG9uIGZvbnQgc2l6ZSlcclxuXHR2YXIgbWV0cmljcyA9IGNvbnRleHQubWVhc3VyZVRleHQoIG1lc3NhZ2UgKTtcclxuXHR2YXIgdGV4dFdpZHRoID0gbWV0cmljcy53aWR0aDtcclxuXHRcclxuXHQvLyBiYWNrZ3JvdW5kIGNvbG9yXHJcblx0Y29udGV4dC5maWxsU3R5bGUgICA9IFwicmdiYShcIiArIGJhY2tncm91bmRDb2xvci5yICsgXCIsXCIgKyBiYWNrZ3JvdW5kQ29sb3IuZyArIFwiLFwiXHJcblx0XHRcdFx0XHRcdFx0XHQgICsgYmFja2dyb3VuZENvbG9yLmIgKyBcIixcIiArIGJhY2tncm91bmRDb2xvci5hICsgXCIpXCI7XHJcblx0Ly8gYm9yZGVyIGNvbG9yXHJcblx0Y29udGV4dC5zdHJva2VTdHlsZSA9IFwicmdiYShcIiArIGJvcmRlckNvbG9yLnIgKyBcIixcIiArIGJvcmRlckNvbG9yLmcgKyBcIixcIlxyXG5cdFx0XHRcdFx0XHRcdFx0ICArIGJvcmRlckNvbG9yLmIgKyBcIixcIiArIGJvcmRlckNvbG9yLmEgKyBcIilcIjtcclxuXHJcblx0Y29udGV4dC5saW5lV2lkdGggPSBib3JkZXJUaGlja25lc3M7XHJcblx0cm91bmRSZWN0KGNvbnRleHQsIGJvcmRlclRoaWNrbmVzcy8yLCBib3JkZXJUaGlja25lc3MvMiwgdGV4dFdpZHRoICsgYm9yZGVyVGhpY2tuZXNzLCBmb250c2l6ZSAqIDEuNCArIGJvcmRlclRoaWNrbmVzcywgNik7XHJcblx0Ly8gMS40IGlzIGV4dHJhIGhlaWdodCBmYWN0b3IgZm9yIHRleHQgYmVsb3cgYmFzZWxpbmU6IGcsaixwLHEuXHJcblx0XHJcblx0Ly8gdGV4dCBjb2xvclxyXG5cdGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDEuMClcIjtcclxuXHJcblx0Y29udGV4dC5maWxsVGV4dCggbWVzc2FnZSwgYm9yZGVyVGhpY2tuZXNzLCBmb250c2l6ZSArIGJvcmRlclRoaWNrbmVzcyk7XHJcblx0XHJcblx0Ly8gY2FudmFzIGNvbnRlbnRzIHdpbGwgYmUgdXNlZCBmb3IgYSB0ZXh0dXJlXHJcblx0dmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShjYW52YXMpIFxyXG5cdHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG5cclxuXHR2YXIgc3ByaXRlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuU3ByaXRlTWF0ZXJpYWwoIFxyXG5cdFx0eyBtYXA6IHRleHR1cmUsIHVzZVNjcmVlbkNvb3JkaW5hdGVzOiBmYWxzZSwgYWxpZ25tZW50OiBzcHJpdGVBbGlnbm1lbnQgfSApO1xyXG5cdHZhciBzcHJpdGUgPSBuZXcgVEhSRUUuU3ByaXRlKCBzcHJpdGVNYXRlcmlhbCApO1xyXG5cdHNwcml0ZS5zY2FsZS5zZXQoMTAwLDUwLDEuMCk7XHJcblx0c3ByaXRlLnBvc2l0aW9uLmNvcHkoYWxsUG9pbnRzW25vdGVWYWxdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpKVxyXG5cdHJldHVybiBzcHJpdGU7XHRcclxufVxyXG5cclxuLy8gZnVuY3Rpb24gZm9yIGRyYXdpbmcgcm91bmRlZCByZWN0YW5nbGVzXHJcbmZ1bmN0aW9uIHJvdW5kUmVjdChjdHgsIHgsIHksIHcsIGgsIHIpIFxyXG57XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKHgrciwgeSk7XHJcbiAgICBjdHgubGluZVRvKHgrdy1yLCB5KTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgrdywgeSwgeCt3LCB5K3IpO1xyXG4gICAgY3R4LmxpbmVUbyh4K3csIHkraC1yKTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgrdywgeStoLCB4K3ctciwgeStoKTtcclxuICAgIGN0eC5saW5lVG8oeCtyLCB5K2gpO1xyXG4gICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCwgeStoLCB4LCB5K2gtcik7XHJcbiAgICBjdHgubGluZVRvKHgsIHkrcik7XHJcbiAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4K3IsIHkpO1xyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuXHRjdHguc3Ryb2tlKCk7ICAgXHJcbn0qLyIsIi8vY3JlYXRlcyBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiB0d28gbWVzaGVzIHRvIGNyZWF0ZSB0cmFuc3BhcmVuY3lcclxuZnVuY3Rpb24gVHJhbnNwTWVzaEdycChnZW9tZXRyeSkge1xyXG5cdHZhciBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cdHZhciBtZXNoR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29udmV4QnVmZmVyR2VvbWV0cnkoZ2VvbWV0cnkudmVydGljZXMpO1xyXG5cclxuXHR2YXIgZmFjZXMgPSBtZXNoR2VvbWV0cnkuZmFjZXM7XHJcblx0Zm9yKHZhciBmYWNlIGluIGZhY2VzKSB7XHJcblx0XHRmb3IodmFyIGk9MDsgaTwzOyBpKyspIHtcclxuXHRcdFx0dmFyIHYxID0gZmFjZXNbZmFjZV0uZ2V0RWRnZShpKS5oZWFkKCk7XHJcblx0XHRcdHZhciB2MiA9IGZhY2VzW2ZhY2VdLmdldEVkZ2UoaSkudGFpbCgpO1xyXG5cdFx0XHRncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MS5wb2ludCwgdjIucG9pbnQpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2gobWVzaEdlb21ldHJ5LCB0cmFuc3BhcmVudE1hdGVyaWFsQmFjayk7XHJcblx0bWVzaC5tYXRlcmlhbC5zaWRlID0gVEhSRUUuQmFja1NpZGU7IC8vIGJhY2sgZmFjZXNcclxuXHRtZXNoLnJlbmRlck9yZGVyID0gMDtcclxuXHJcblx0dmFyIG1lc2gyID0gbmV3IFRIUkVFLk1lc2gobWVzaEdlb21ldHJ5LCB0cmFuc3BhcmVudE1hdGVyaWFsRnJvbnQuY2xvbmUoKSk7XHJcblx0bWVzaDIubWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkZyb250U2lkZTsgLy8gZnJvbnQgZmFjZXNcclxuXHRtZXNoMi5yZW5kZXJPcmRlciA9IDE7XHJcblxyXG5cdGdyb3VwLmFkZChtZXNoKTtcclxuXHRncm91cC5hZGQobWVzaDIpO1xyXG5cclxuXHRyZXR1cm4gZ3JvdXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dQb2x5aGVkcm9uKHB0c0luZGV4ZXMpIHtcclxuXHQvL2NvbnNvbGUubG9nKHB0c0luZGV4ZXMpO1xyXG5cdC8vIGxldCB2ZXJ0aWNlcyA9IFtdO1xyXG5cdC8vIHB0c0luZGV4ZXMuZm9yRWFjaChpbmRleCA9PiB7XHJcblx0Ly8gXHR2ZXJ0aWNlcy5wdXNoKGFsbFBvaW50c1tpbmRleF0uY2xvbmUoKSk7XHJcblx0Ly8gfSk7XHJcblx0Ly8gLy8gY29uc29sZS5sb2coJ3ZlcnRpY2VzJywgdmVydGljZXMpO1xyXG5cclxuXHQvLyBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29udmV4QnVmZmVyR2VvbWV0cnkodmVydGljZXMpO1xyXG5cdC8vIC8vIGNvbnNvbGUubG9nKCdnZW9tZXRyeScsIGdlb21ldHJ5KTtcclxuXHQvLyBnZW9tZXRyeS5mYWNlcy5mb3JFYWNoKGZhY2UgPT4ge1xyXG5cdC8vIFx0bGV0IHB0MSA9IGZhY2UuZ2V0RWRnZSgwKS5oZWFkKCkucG9pbnQsXHJcblx0Ly8gXHRcdHB0MiA9IGZhY2UuZ2V0RWRnZSgxKS5oZWFkKCkucG9pbnQsXHJcblx0Ly8gXHRcdHB0MyA9IGZhY2UuZ2V0RWRnZSgyKS5oZWFkKCkucG9pbnQ7XHJcblx0Ly8gXHQvLyBjb25zb2xlLmxvZygnZmFjZScsIGZhY2UpO1xyXG5cdC8vIFx0Ly8gY29uc29sZS5sb2coJ3B0MScsIHB0MSk7XHJcblx0Ly8gXHQvLyBjb25zb2xlLmxvZygncHQyJywgcHQyKTtcclxuXHQvLyBcdC8vIGNvbnNvbGUubG9nKCdwdDMnLCBwdDMpO1xyXG5cdC8vIFx0bGV0IGluZGV4MSA9IGFsbFBvaW50cy5tYXAoZnVuY3Rpb24oZSkgeyByZXR1cm4gZS5lcXVhbHMocHQxKSB9KS5pbmRleE9mKHRydWUpLFxyXG5cdC8vIFx0XHRpbmRleDIgPSBhbGxQb2ludHMubWFwKGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUuZXF1YWxzKHB0MikgfSkuaW5kZXhPZih0cnVlKSxcclxuXHQvLyBcdFx0aW5kZXgzID0gYWxsUG9pbnRzLm1hcChmdW5jdGlvbihlKSB7IHJldHVybiBlLmVxdWFscyhwdDMpIH0pLmluZGV4T2YodHJ1ZSk7XHJcblx0Ly8gXHRzaG93VGhyZWVQb2ludHMoW2luZGV4MSwgaW5kZXgyLCBpbmRleDNdKTtcclxuXHQvLyB9KTtcclxuXHJcblx0Ly9jb25zdCBpbmRleGVzID0gWyAwLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEgXTtcclxuXHJcblx0Y29uc3QgZ2VuID0gc3Vic2V0cyhwdHNJbmRleGVzLCAzKTtcclxuXHRsZXQgdGhyZWVQdHM7XHJcblxyXG5cdHdoaWxlKCEodGhyZWVQdHMgPSBnZW4ubmV4dCgpKS5kb25lKSB7XHJcblx0XHRzaG93VGhyZWVQb2ludHMoQXJyYXkuZnJvbSh0aHJlZVB0cy52YWx1ZSkpO1xyXG5cdH1cclxuXHJcblxyXG59XHJcblxyXG4vKmZ1bmN0aW9uIG1ha2VUcmFuc3BhcmVudChnZW9tZXRyeSwgZ3JvdXApIHtcclxuXHQvL2dlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XHJcblx0Ly9nZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTtcclxuXHRncm91cC5hZGQobmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHRyYW5zcGFyZW50TWF0ZXJpYWxGcm9udCkpO1xyXG59Ki8iLCJjb25zdCBzY2FsZSA9IDE1O1xyXG5sZXQgY2hvcmRHZW9tZXRyeTtcclxuXHJcbmZ1bmN0aW9uIENob3JkKG5vdGVzKSB7XHJcblx0dGhpcy5ub3RlcyA9IFtdO1xyXG5cclxuXHRmb3IodmFyIGkgaW4gbm90ZXMpIHtcclxuXHRcdGxldCBmaW5hbE5vdGUgPSBub3Rlc1tpXSAlIDEyO1xyXG5cdFx0aWYodGhpcy5ub3Rlcy5pbmRleE9mKGZpbmFsTm90ZSkgPT0gLTEpIFxyXG5cdFx0XHR0aGlzLm5vdGVzLnB1c2goZmluYWxOb3RlKTtcclxuXHR9XHJcblxyXG5cdHRoaXMuZHJhd0Nob3JkKCk7XHJcbn1cclxuXHJcbkNob3JkLnByb3RvdHlwZS5hZGROb3RlID0gZnVuY3Rpb24obm90ZSkge1xyXG5cdHRoaXMubm90ZXMucHVzaChub3RlICUgMTIpO1xyXG59XHJcblxyXG5DaG9yZC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKGJvb2wpIHtcclxuXHR0aGlzLnBvbHloZWRyb24udmlzaWJsZSA9IGJvb2w7XHJcblx0Zm9yKHZhciBpIGluIHRoaXMubm90ZXMpIHtcclxuXHRcdHNwaGVyZXMuY2hpbGRyZW5bdGhpcy5ub3Rlc1tpXV0udmlzaWJsZSA9IGJvb2w7XHJcblx0fVxyXG59XHJcblxyXG5DaG9yZC5wcm90b3R5cGUuZHJhd0Nob3JkID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIG5iTm90ZXMgPSB0aGlzLm5vdGVzLmxlbmd0aDtcclxuXHJcblx0aWYobmJOb3RlcyA9PSAxKSB7XHJcblx0XHR0aGlzLnBvbHloZWRyb24gPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcclxuXHR9IGVsc2UgaWYobmJOb3RlcyA9PSAyKSB7XHJcblx0XHR0aGlzLnBvbHloZWRyb24gPSBuZXcgVHdvUG9pbnRzKHRoaXMubm90ZXNbMF0sIHRoaXMubm90ZXNbMV0sIHNjYWxlKTtcclxuXHR9IGVsc2UgaWYobmJOb3RlcyA9PSAzKSB7XHJcblx0XHR0aGlzLnBvbHloZWRyb24gPSBuZXcgVGhyZWVQb2ludHModGhpcy5ub3Rlcywgc2NhbGUpO1xyXG5cdH1lbHNlIHtcclxuXHRcdGNob3JkR2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBpPTA7IGk8bmJOb3RlczsgaSsrKSB7XHJcblx0XHRcdGNob3JkR2VvbWV0cnkudmVydGljZXMucHVzaChcclxuXHRcdFx0XHRhbGxQb2ludHNbdGhpcy5ub3Rlc1tpXV0uY2xvbmUoKVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHZhciBzdWJzID0gc3Vic2V0cyh0aGlzLm5vdGVzLCAzKTtcclxuXHRcdC8vIHZhciBwb2ludElkcztcclxuXHRcdC8vIHZhciBwb2ludElkMSwgcG9pbnRJZDIsIHBvaW50SWQzO1xyXG5cdFx0Ly8gdmFyIGZhY2U7XHJcblxyXG5cdFx0Ly8gZm9yKHN1YiBvZiBzdWJzKSB7XHJcblx0XHQvLyBcdHBvaW50SWRzID0gc3ViLmVudHJpZXMoKTtcclxuXHRcdFx0XHJcblx0XHQvLyBcdC8vZ2V0IHRoZSBmYWNlJ3MgMyB2ZXJ0aWNlcyBpbmRleFxyXG5cdFx0Ly8gXHRwb2ludElkMSA9IHBvaW50SWRzLm5leHQoKS52YWx1ZVswXS52YWx1ZTtcclxuXHRcdC8vIFx0cG9pbnRJZDIgPSBwb2ludElkcy5uZXh0KCkudmFsdWVbMF0udmFsdWU7XHJcblx0XHQvLyBcdHBvaW50SWQzID0gcG9pbnRJZHMubmV4dCgpLnZhbHVlWzBdLnZhbHVlO1xyXG5cclxuXHRcdC8vIFx0ZmFjZSA9IG5ldyBUSFJFRS5GYWNlMyhwb2ludElkMSxwb2ludElkMixwb2ludElkMyk7XHJcblx0XHQvLyBcdGdlb21ldHJ5LmZhY2VzLnB1c2goZmFjZSk7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0Ly8gdmFyIG1lc2hHZW9tZXRyeSA9IG5ldyBUSFJFRS5Db252ZXhCdWZmZXJHZW9tZXRyeShnZW9tZXRyeS52ZXJ0aWNlcyk7XHJcblx0XHRjaG9yZEdlb21ldHJ5LnNjYWxlKHNjYWxlLHNjYWxlLHNjYWxlKTtcclxuXHRcdHRoaXMucG9seWhlZHJvbiA9IG5ldyBQb2x5TWVzaGVzKGNob3JkR2VvbWV0cnksIHRoaXMubm90ZXMpO1xyXG5cclxuXHR9XHJcblx0dGhpcy5wb2x5aGVkcm9uLnZpc2libGUgPSBmYWxzZTtcclxuXHRzaGFwZXNHcm91cC5hZGQodGhpcy5wb2x5aGVkcm9uKTtcclxuXHRcclxuXHJcbn1cclxuXHJcbkNob3JkLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihjaG9yZCkge1xyXG5cdGlmKHRoaXMubm90ZXMubGVuZ3RoICE9IGNob3JkLm5vdGVzLmxlbmd0aClcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0Zm9yKGxldCBub3RlIGluIGNob3JkLm5vdGVzKSB7XHJcblx0XHRpZih0aGlzLm5vdGVzW25vdGVdICE9IGNob3JkLm5vdGVzW25vdGVdKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdHJ1ZTtcclxufSIsImluaXQoKTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcblx0bGV0IG1haW5Hcm91cCwgYWxsTWVzaGVzO1xyXG5cdGxldCByZW5kZXJlciwgc2NlbmUsIGNhbWVyYSwgb3JiaXRDb250cm9scztcclxuXHRsZXQgdmFsaWRCdXR0b24sIGZpbGVJbnB1dDtcclxuXHRsZXQgd2luZG93SGFsZlgsIHdpbmRvd0hhbGZZO1xyXG5cdGxldCBzbGlkZXI7XHJcblx0bGV0IG1pZGlUb0Nob3JkID0gbmV3IE1pZGlUb0Nob3JkTWFwKCk7XHJcblx0Y29uc3QgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCggMHg0MDQwNDAgKSxcclxuXHRcdCAgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KCAweGZmMDAwMCwgMSwgMTAwIClcclxuXHRcdCAgZ2xvYmFsTGlnaHRzID0gbmV3IEdsb2JhbExpZ2h0cygyMCk7XHJcblx0Y29uc3Qgc2NhbGUgPSAxNTtcdFxyXG5cdFxyXG5cdGFsbE1lc2hlcyA9IG5ldyBBbGxNZXNoZXMoc2NhbGUpO1xyXG5cclxuXHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1pbnB1dCcpO1xyXG5cdHZhbGlkQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZhbGlkLWJ0bicpO1xyXG5cdHZhbGlkQnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuXHRcdFxyXG5cdFx0bWlkaVRvQ2hvcmQucGFyc2UoZmlsZUlucHV0LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2NyZWF0aW5nIHNsaWRlci4uJyk7XHJcblx0XHRcdFxyXG5cdFx0XHRzbGlkZXIgPSBuZXcgU2xpZGVyKGZpbGVJbnB1dCwgYWxsTWVzaGVzLCBtaWRpVG9DaG9yZC5jaG9yZHNNYXApO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Y2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aC93aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCk7XHJcblx0Y2FtZXJhLnBvc2l0aW9uLnogPSA1MDtcclxuXHJcblx0c2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHRzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKCAweDAwMDAwMCApO1xyXG5cclxuXHRyZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XHJcblx0Ly9yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcclxuXHRyZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG5cclxuXHRvcmJpdENvbnRyb2xzID0gbmV3IFRIUkVFLk9yYml0Q29udHJvbHMoIGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCApO1xyXG5cdG9yYml0Q29udHJvbHMubWluRGlzdGFuY2UgPSA1O1xyXG5cdG9yYml0Q29udHJvbHMubWF4RGlzdGFuY2UgPSAyMDA7XHJcblx0b3JiaXRDb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSTtcclxuXHJcblx0c2NlbmUuYWRkKCBhbWJpZW50TGlnaHQgKTtcclxuXHRjYW1lcmEuYWRkKHBvaW50TGlnaHQpO1xyXG5cdFxyXG5cclxuXHRtYWluR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHRzY2VuZS5hZGQobWFpbkdyb3VwKTtcclxuXHRtYWluR3JvdXAuYWRkKGdsb2JhbExpZ2h0cyk7XHJcblx0bWFpbkdyb3VwLmFkZChhbGxNZXNoZXMubWVzaEdyb3VwKTtcclxuXHJcblx0c3RhdHMgPSBuZXcgU3RhdHMoKTtcclxuXHQvL2NvbnRhaW5lci5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xyXG5cdGNvbnRhaW5lci5hcHBlbmRDaGlsZCggcmVuZGVyZXIuZG9tRWxlbWVudCApO1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuXHJcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UgKTtcclxuXHJcblx0ZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSggYW5pbWF0ZSApO1xyXG5cdFx0cmVuZGVyKCk7XHJcblx0XHRzdGF0cy51cGRhdGUoKTtcclxuXHR9XHJcblx0XHJcblx0ZnVuY3Rpb24gcmVuZGVyKCkge1xyXG5cdFx0cmVuZGVyZXIucmVuZGVyKCBzY2VuZSwgY2FtZXJhICk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcclxuXHRcdHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xyXG5cdFx0d2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xyXG5cdFx0Y2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cdFx0Y2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuXHRcdHJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcclxuXHR9XHJcblxyXG5cdGFuaW1hdGUoKTtcdFxyXG59XHJcbiIsIi8qKlxyXG4qIENvbnZlcnQgRnJvbS9UbyBCaW5hcnkvRGVjaW1hbC9IZXhhZGVjaW1hbCBpbiBKYXZhU2NyaXB0XHJcbiogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZmFpc2FsbWFuXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxMi0yMDE1LCBGYWlzYWxtYW4gPGZ5emxtYW5AZ21haWwuY29tPlxyXG4qIExpY2Vuc2VkIHVuZGVyIFRoZSBNSVQgTGljZW5zZVxyXG4qIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcclxuKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG5cclxuICAgIHZhciBDb252ZXJ0QmFzZSA9IGZ1bmN0aW9uIChudW0pIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmcm9tIDogZnVuY3Rpb24gKGJhc2VGcm9tKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvIDogZnVuY3Rpb24gKGJhc2VUbykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQobnVtLCBiYXNlRnJvbSkudG9TdHJpbmcoYmFzZVRvKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAvLyBiaW5hcnkgdG8gZGVjaW1hbFxyXG4gICAgQ29udmVydEJhc2UuYmluMmRlYyA9IGZ1bmN0aW9uIChudW0pIHtcclxuICAgICAgICByZXR1cm4gQ29udmVydEJhc2UobnVtKS5mcm9tKDIpLnRvKDEwKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIC8vIGJpbmFyeSB0byBoZXhhZGVjaW1hbFxyXG4gICAgQ29udmVydEJhc2UuYmluMmhleCA9IGZ1bmN0aW9uIChudW0pIHtcclxuICAgICAgICByZXR1cm4gQ29udmVydEJhc2UobnVtKS5mcm9tKDIpLnRvKDE2KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIC8vIGRlY2ltYWwgdG8gYmluYXJ5XHJcbiAgICBDb252ZXJ0QmFzZS5kZWMyYmluID0gZnVuY3Rpb24gKG51bSkge1xyXG4gICAgICAgIHJldHVybiBDb252ZXJ0QmFzZShudW0pLmZyb20oMTApLnRvKDIpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLy8gZGVjaW1hbCB0byBoZXhhZGVjaW1hbFxyXG4gICAgQ29udmVydEJhc2UuZGVjMmhleCA9IGZ1bmN0aW9uIChudW0pIHtcclxuICAgICAgICByZXR1cm4gQ29udmVydEJhc2UobnVtKS5mcm9tKDEwKS50bygxNik7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAvLyBoZXhhZGVjaW1hbCB0byBiaW5hcnlcclxuICAgIENvbnZlcnRCYXNlLmhleDJiaW4gPSBmdW5jdGlvbiAobnVtKSB7XHJcbiAgICAgICAgcmV0dXJuIENvbnZlcnRCYXNlKG51bSkuZnJvbSgxNikudG8oMik7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAvLyBoZXhhZGVjaW1hbCB0byBkZWNpbWFsXHJcbiAgICBDb252ZXJ0QmFzZS5oZXgyZGVjID0gZnVuY3Rpb24gKG51bSkge1xyXG4gICAgICAgIHJldHVybiBDb252ZXJ0QmFzZShudW0pLmZyb20oMTYpLnRvKDEwKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRoaXMuQ29udmVydEJhc2UgPSBDb252ZXJ0QmFzZTtcclxuICAgIFxyXG59KSh0aGlzKTtcclxuXHJcbi8qXHJcbiogVXNhZ2UgZXhhbXBsZTpcclxuKiBDb252ZXJ0QmFzZS5iaW4yZGVjKCcxMTEnKTsgLy8gJzcnXHJcbiogQ29udmVydEJhc2UuZGVjMmhleCgnNDInKTsgLy8gJzJhJ1xyXG4qIENvbnZlcnRCYXNlLmhleDJiaW4oJ2Y4Jyk7IC8vICcxMTExMTAwMCdcclxuKiBDb252ZXJ0QmFzZS5kZWMyYmluKCcyMicpOyAvLyAnMTAxMTAnXHJcbiovXHJcbiIsIi8qXG4gICAgUHJvamVjdCBOYW1lOiBtaWRpLXBhcnNlci1qc1xuICAgIEF1dGhvcjogY29seGlcbiAgICBBdXRob3IgVVJJOiBodHRwOi8vd3d3LmNvbHhpLmluZm8vXG4gICAgRGVzY3JpcHRpb246IE1JRElQYXJzZXIgbGlicmFyeSByZWFkcyAuTUlEIGJpbmFyeSBmaWxlcywgQmFzZTY0IGVuY29kZWQgTUlESSBEYXRhLFxuICAgIG9yIFVJbnQ4IEFycmF5cywgYW5kIG91dHB1dHMgYXMgYSByZWFkYWJsZSBhbmQgc3RydWN0dXJlZCBKUyBvYmplY3QuXG5cbiAgICAtLS0gICAgIFVzYWdlIE1ldGhvZHMgICAgICAtLS1cbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICogT1BUSU9OIDEgTkVXISAoTUlESVBhcnNlci5wYXJzZSlcbiAgICBXaWxsIGF1dG9kZXRlY3QgdGhlIHNvdXJjZSBhbmQgcHJvY2Nlc3MgdGhlIGRhdGEsIHVzaW5nIHRoZSBzdWl0YWJsZSBtZXRob2QuXG5cbiAgICAqIE9QVElPTiAyIChNSURJUGFyc2VyLmFkZExpc3RlbmVyKVxuICAgIElOUFVUIEVMRU1FTlQgTElTVEVORVIgOiBjYWxsIE1JRElQYXJzZXIuYWRkTGlzdGVuZXIoZmlsZUlucHV0RWxlbWVudCxjYWxsYmFjRnVuY3Rpb24pIGZ1bmN0aW9uLCBzZXR0aW5nIHRoZVxuICAgIElucHV0IEZpbGUgSFRNTCBlbGVtZW50IHRoYXQgd2lsbCBoYW5kbGUgdGhlIGZpbGUubWlkIG9wZW5pbmcsIGFuZCBjYWxsYmFjayBmdW5jdGlvblxuICAgIHRoYXQgd2lsbCByZWNpZXZlIHRoZSByZXN1bHRpbmcgT2JqZWN0IGZvcm1hdGVkLCBzZXQgb2YgZGF0YS5cblxuICAgICogT1BUSU9OIDMgKE1JRElQYXJzZXIuVWludDgpXG4gICAgUHJvdmlkZSB5b3VyIG93biBVSW50OCBBcnJheSB0byBNSURJUGFyc2VyLlVpbnQ4KCksIHRvIGdldCBhbiBPYmplY3QgZm9ybWF0ZWQsIHNldCBvZiBkYXRhXG5cbiAgICAqIE9QVElPTiA0IChNSURJUGFyc2VyLkJhc2U2NClcbiAgICBQcm92aWRlIGEgQmFzZTY0IGVuY29kZWQgRGF0YSB0byBNSURJUGFyc2VyLkJhc2U2NCgpLCAsIHRvIGdldCBhbiBPYmplY3QgZm9ybWF0ZWQsIHNldCBvZiBkYXRhXG5cblxuICAgIC0tLSAgT3V0cHV0IE9iamVjdCBTcGVjcyAgIC0tLVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgTUlESU9iamVjdHtcbiAgICAgICAgZm9ybWF0VHlwZTogMHwxfDIsICAgICAgICAgICAgICAgICAgLy8gTWlkaSBmb3JtYXQgdHlwZVxuICAgICAgICB0aW1lRGl2aXNpb246IChpbnQpLCAgICAgICAgICAgICAgICAvLyBzb25nIHRlbXBvIChicG0pXG4gICAgICAgIHRyYWNrczogKGludCksICAgICAgICAgICAgICAgICAgICAgIC8vIHRvdGFsIHRyYWNrcyBjb3VudFxuICAgICAgICB0cmFjazogQXJyYXlbXG4gICAgICAgICAgICBbMF06IE9iamVjdHsgICAgICAgICAgICAgICAgICAgIC8vIFRSQUNLIDEhXG4gICAgICAgICAgICAgICAgZXZlbnQ6IEFycmF5WyAgICAgICAgICAgICAgIC8vIE1pZGkgZXZlbnRzIGluIHRyYWNrIDFcbiAgICAgICAgICAgICAgICAgICAgWzBdIDogT2JqZWN0eyAgICAgICAgICAgLy8gRVZFTlQgMVxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogKHN0cmluZyksXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWx0YVRpbWU6IChpbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YVR5cGU6IChpbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogKGludCksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFsxXSA6IE9iamVjdHsuLi59ICAgICAgIC8vIEVWRU5UIDJcbiAgICAgICAgICAgICAgICAgICAgWzJdIDogT2JqZWN0ey4uLn0gICAgICAgLy8gRVZFTlQgM1xuICAgICAgICAgICAgICAgICAgICAuLi5cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWzFdIDogT2JqZWN0ey4uLn1cbiAgICAgICAgICAgIFsyXSA6IE9iamVjdHsuLi59XG4gICAgICAgICAgICAuLi5cbiAgICAgICAgXVxuICAgIH1cblxuRGF0YSBmcm9tIEV2ZW50IDEyIG9mIFRyYWNrIDIgY291bGQgYmUgZWFzaWxseSByZWFkZWQgd2l0aDpcbk91dHB1dE9iamVjdC50cmFja1syXS5ldmVudFsxMl0uZGF0YTtcblxuKi9cblxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIENST1NTQlJPV1NFUiAmIE5PREVqcyBQT0xZRklMTCBmb3IgQVRPQigpIC0gQnk6IGh0dHBzOi8vZ2l0aHViLmNvbS9NYXhBcnQyNTAxIChtb2RpZmllZClcbmNvbnN0IF9hdG9iID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgLy8gYmFzZTY0IGNoYXJhY3RlciBzZXQsIHBsdXMgcGFkZGluZyBjaGFyYWN0ZXIgKD0pXG4gICAgbGV0IGI2NCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG4gICAgLy8gUmVndWxhciBleHByZXNzaW9uIHRvIGNoZWNrIGZvcm1hbCBjb3JyZWN0bmVzcyBvZiBiYXNlNjQgZW5jb2RlZCBzdHJpbmdzXG4gICAgbGV0IGI2NHJlID0gL14oPzpbQS1aYS16XFxkK1xcL117NH0pKj8oPzpbQS1aYS16XFxkK1xcL117Mn0oPzo9PSk/fFtBLVphLXpcXGQrXFwvXXszfT0/KT8kLztcbiAgICAvLyByZW1vdmUgZGF0YSB0eXBlIHNpZ25hdHVyZXMgYXQgdGhlIGJlZ2luaW5nIG9mIHRoZSBzdHJpbmdcbiAgICAvLyBlZyA6ICBcImRhdGE6YXVkaW8vbWlkO2Jhc2U2NCxcIlxuICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKCAvXi4qP2Jhc2U2NCwvICwgJycpO1xuICAgIC8vIGF0b2IgY2FuIHdvcmsgd2l0aCBzdHJpbmdzIHdpdGggd2hpdGVzcGFjZXMsIGV2ZW4gaW5zaWRlIHRoZSBlbmNvZGVkIHBhcnQsXG4gICAgLy8gYnV0IG9ubHkgXFx0LCBcXG4sIFxcZiwgXFxyIGFuZCAnICcsIHdoaWNoIGNhbiBiZSBzdHJpcHBlZC5cbiAgICBzdHJpbmcgPSBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC9bXFx0XFxuXFxmXFxyIF0rL2csICcnKTtcbiAgICBpZiAoIWI2NHJlLnRlc3Qoc3RyaW5nKSlcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmFpbGVkIHRvIGV4ZWN1dGUgX2F0b2IoKSA6IFRoZSBzdHJpbmcgdG8gYmUgZGVjb2RlZCBpcyBub3QgY29ycmVjdGx5IGVuY29kZWQuJyk7XG5cbiAgICAvLyBBZGRpbmcgdGhlIHBhZGRpbmcgaWYgbWlzc2luZywgZm9yIHNlbXBsaWNpdHlcbiAgICBzdHJpbmcgKz0gJz09Jy5zbGljZSgyIC0gKHN0cmluZy5sZW5ndGggJiAzKSk7XG4gICAgbGV0IGJpdG1hcCwgcmVzdWx0ID0gJyc7XG4gICAgbGV0IHIxLCByMiwgaSA9IDA7XG4gICAgZm9yICg7IGkgPCBzdHJpbmcubGVuZ3RoOykge1xuICAgICAgICBiaXRtYXAgPSBiNjQuaW5kZXhPZihzdHJpbmcuY2hhckF0KGkrKykpIDw8IDE4IHwgYjY0LmluZGV4T2Yoc3RyaW5nLmNoYXJBdChpKyspKSA8PCAxMlxuICAgICAgICAgICAgICAgIHwgKHIxID0gYjY0LmluZGV4T2Yoc3RyaW5nLmNoYXJBdChpKyspKSkgPDwgNiB8IChyMiA9IGI2NC5pbmRleE9mKHN0cmluZy5jaGFyQXQoaSsrKSkpO1xuXG4gICAgICAgIHJlc3VsdCArPSByMSA9PT0gNjQgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJpdG1hcCA+PiAxNiAmIDI1NSlcbiAgICAgICAgICAgICAgICA6IHIyID09PSA2NCA/IFN0cmluZy5mcm9tQ2hhckNvZGUoYml0bWFwID4+IDE2ICYgMjU1LCBiaXRtYXAgPj4gOCAmIDI1NSlcbiAgICAgICAgICAgICAgICA6IFN0cmluZy5mcm9tQ2hhckNvZGUoYml0bWFwID4+IDE2ICYgMjU1LCBiaXRtYXAgPj4gOCAmIDI1NSwgYml0bWFwICYgMjU1KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNvbnN0IE1JRElQYXJzZXIgPSB7XG4gICAgLy8gZGVidWcgKGJvb2wpLCB3aGVuIGVuYWJsZWQgd2lsbCBsb2cgaW4gY29uc29sZSB1bmltcGxlbWVudGVkIGV2ZW50c1xuICAgIC8vIHdhcm5pbmdzIGFuZCBpbnRlcm5hbCBoYW5kbGVkIGVycm9ycy5cbiAgICBkZWJ1ZzogZmFsc2UsXG5cbiAgICBwYXJzZTogZnVuY3Rpb24oaW5wdXQsIF9jYWxsYmFjayl7XG4gICAgICAgIGlmKGlucHV0IGluc3RhbmNlb2YgVWludDhBcnJheSkgcmV0dXJuIE1JRElQYXJzZXIuVWludDgoaW5wdXQpO1xuICAgICAgICBlbHNlIGlmKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHJldHVybiBNSURJUGFyc2VyLkJhc2U2NChpbnB1dCk7XG4gICAgICAgIGVsc2UgaWYoaW5wdXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBpbnB1dC50eXBlID09PSAnZmlsZScpIHJldHVybiBNSURJUGFyc2VyLmFkZExpc3RlbmVyKGlucHV0ICwgX2NhbGxiYWNrKTtcbiAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ01JRElQYXJzZXIucGFyc2UoKSA6IEludmFsaWQgaW5wdXQgcHJvdmlkZWQnKTtcbiAgICB9LFxuICAgIC8vIGFkZExpc3RlbmVyKCkgc2hvdWxkIGJlIGNhbGxlZCBpbiBvcmRlciBhdHRhY2ggYSBsaXN0ZW5lciB0byB0aGUgSU5QVVQgSFRNTCBlbGVtZW50XG4gICAgLy8gdGhhdCB3aWxsIHByb3ZpZGUgdGhlIGJpbmFyeSBkYXRhIGF1dG9tYXRpbmcgdGhlIGNvbnZlcnNpb24sIGFuZCByZXR1cm5pbmdcbiAgICAvLyB0aGUgc3RydWN0dXJlZCBkYXRhIHRvIHRoZSBwcm92aWRlZCBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICBhZGRMaXN0ZW5lcjogZnVuY3Rpb24oX2ZpbGVFbGVtZW50LCBfY2FsbGJhY2spe1xuICAgICAgICBpZighRmlsZSB8fCAhRmlsZVJlYWRlcikgdGhyb3cgbmV3IEVycm9yKCdUaGUgRmlsZXxGaWxlUmVhZGVyIEFQSXMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyLiBVc2UgaW5zdGVhZCBNSURJUGFyc2VyLkJhc2U2NCgpIG9yIE1JRElQYXJzZXIuVWludDgoKScpO1xuXG4gICAgICAgIC8vIHZhbGlkYXRlIHByb3ZpZGVkIGVsZW1lbnRcbiAgICAgICAgaWYoIF9maWxlRWxlbWVudCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAhKF9maWxlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB8fFxuICAgICAgICAgICAgX2ZpbGVFbGVtZW50LnRhZ05hbWUgIT09ICdJTlBVVCcgfHxcbiAgICAgICAgICAgIF9maWxlRWxlbWVudC50eXBlLnRvTG93ZXJDYXNlKCkgIT09ICdmaWxlJyApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignTUlESVBhcnNlci5hZGRMaXN0ZW5lcigpIDogUHJvdmlkZWQgZWxlbWVudCBpcyBub3QgYSB2YWxpZCBGSUxFIElOUFVUIGVsZW1lbnQnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgX2NhbGxiYWNrID0gX2NhbGxiYWNrIHx8IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICBfZmlsZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oSW5wdXRFdnQpeyAgICAgICAgICAgICAvLyBzZXQgdGhlICdmaWxlIHNlbGVjdGVkJyBldmVudCBoYW5kbGVyXG4gICAgICAgICAgICBpZiAoIUlucHV0RXZ0LnRhcmdldC5maWxlcy5sZW5ndGgpIHJldHVybiBmYWxzZTsgICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiBmYWxzZSBpZiBubyBlbGVtZW50cyB3aGVyZSBzZWxlY3RlZFxuICAgICAgICAgICAgY29uc29sZS5sb2coJ01JRElQYXJzZXIuYWRkTGlzdGVuZXIoKSA6IEZpbGUgZGV0ZWN0ZWQgaW4gSU5QVVQgRUxFTUVOVCBwcm9jZXNzaW5nIGRhdGEuLicpO1xuICAgICAgICAgICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwcmVwYXJlIHRoZSBmaWxlIFJlYWRlclxuICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKElucHV0RXZ0LnRhcmdldC5maWxlc1swXSk7ICAgICAgICAgICAgICAgICAvLyByZWFkIHRoZSBiaW5hcnkgZGF0YVxuICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBfY2FsbGJhY2soIE1JRElQYXJzZXIuVWludDgobmV3IFVpbnQ4QXJyYXkoZS50YXJnZXQucmVzdWx0KSkpOyAgLy8gZW5jb2RlIGRhdGEgd2l0aCBVaW50OEFycmF5IGFuZCBjYWxsIHRoZSBwYXJzZXJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyBjb252ZXJ0IGJhc2V0NCBzdHJpbmcgaW50byB1aW50OCBhcnJheSBidWZmZXIsIGJlZm9yZSBwZXJmb3JtaW5nIHRoZVxuICAgIC8vIHBhcnNpbmcgc3Vicm91dGluZS5cbiAgICBCYXNlNjQgOiBmdW5jdGlvbihiNjRTdHJpbmcpe1xuICAgICAgICBiNjRTdHJpbmcgPSBTdHJpbmcoYjY0U3RyaW5nKTtcblxuICAgICAgICBsZXQgcmF3ID0gX2F0b2IoYjY0U3RyaW5nKTtcbiAgICAgICAgbGV0IHJhd0xlbmd0aCA9IHJhdy5sZW5ndGg7XG4gICAgICAgIGxldCB0X2FycmF5ID0gbmV3IFVpbnQ4QXJyYXkobmV3IEFycmF5QnVmZmVyKHJhd0xlbmd0aCkpO1xuXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHJhd0xlbmd0aDsgaSsrKSB0X2FycmF5W2ldID0gcmF3LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIHJldHVybiAgTUlESVBhcnNlci5VaW50OCh0X2FycmF5KSA7XG4gICAgfSxcblxuICAgIC8vIHBhcnNlKCkgZnVuY3Rpb24gcmVhZHMgdGhlIGJpbmFyeSBkYXRhLCBpbnRlcnByZXRpbmcgYW5kIHNwbGl0aW5nIGVhY2ggY2h1Y2tcbiAgICAvLyBhbmQgcGFyc2luZyBpdCB0byBhIHN0cnVjdHVyZWQgT2JqZWN0LiBXaGVuIGpvYiBpcyBmaW5pc2VkIHJldHVybnMgdGhlIG9iamVjdFxuICAgIC8vIG9yICdmYWxzZScgaWYgYW55IGVycm9yIHdhcyBnZW5lcmF0ZWQuXG4gICAgVWludDg6IGZ1bmN0aW9uKEZpbGVBc1VpbnQ4QXJyYXkpe1xuICAgICAgICBsZXQgZmlsZSA9IHtcbiAgICAgICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgICAgICBwb2ludGVyOiAwLFxuICAgICAgICAgICAgbW92ZVBvaW50ZXI6IGZ1bmN0aW9uKF9ieXRlcyl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtb3ZlIHRoZSBwb2ludGVyIG5lZ2F0aXZlIGFuZCBwb3NpdGl2ZSBkaXJlY3Rpb25cbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXIgKz0gX2J5dGVzO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBvaW50ZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVhZEludDogZnVuY3Rpb24oX2J5dGVzKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgaW50ZWdlciBmcm9tIG5leHQgX2J5dGVzIGdyb3VwIChiaWctZW5kaWFuKVxuICAgICAgICAgICAgICAgIF9ieXRlcyA9IE1hdGgubWluKF9ieXRlcywgdGhpcy5kYXRhLmJ5dGVMZW5ndGgtdGhpcy5wb2ludGVyKTtcbiAgICAgICAgICAgICAgICBpZiAoX2J5dGVzIDwgMSkgcmV0dXJuIC0xOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFT0ZcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgIGlmKF9ieXRlcyA+IDEpe1xuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGk9MTsgaTw9IChfYnl0ZXMtMSk7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSArPSB0aGlzLmRhdGEuZ2V0VWludDgodGhpcy5wb2ludGVyKSAqIE1hdGgucG93KDI1NiwgKF9ieXRlcyAtIGkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlcisrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhbHVlICs9IHRoaXMuZGF0YS5nZXRVaW50OCh0aGlzLnBvaW50ZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlcisrO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWFkU3RyOiBmdW5jdGlvbihfYnl0ZXMpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlYWQgYXMgQVNDSUkgY2hhcnMsIHRoZSBmb2xsb3dvaW5nIF9ieXRlc1xuICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBjaGFyPTE7IGNoYXIgPD0gX2J5dGVzOyBjaGFyKyspIHRleHQgKz0gIFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5yZWFkSW50KDEpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWFkSW50VkxWOiBmdW5jdGlvbigpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlYWQgYSB2YXJpYWJsZSBsZW5ndGggdmFsdWVcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgIGlmICggdGhpcy5wb2ludGVyID49IHRoaXMuZGF0YS5ieXRlTGVuZ3RoICl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVPRlxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKHRoaXMuZGF0YS5nZXRVaW50OCh0aGlzLnBvaW50ZXIpIDwgMTI4KXsgICAgICAgICAgICAgICAvLyAuLi52YWx1ZSBpbiBhIHNpbmdsZSBieXRlXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5yZWFkSW50KDEpO1xuICAgICAgICAgICAgICAgIH1lbHNleyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAuLi52YWx1ZSBpbiBtdWx0aXBsZSBieXRlc1xuICAgICAgICAgICAgICAgICAgICBsZXQgRmlyc3RCeXRlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSh0aGlzLmRhdGEuZ2V0VWludDgodGhpcy5wb2ludGVyKSA+PSAxMjgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgRmlyc3RCeXRlcy5wdXNoKHRoaXMucmVhZEludCgxKSAtIDEyOCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RCeXRlICA9IHRoaXMucmVhZEludCgxKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBkdCA9IDE7IGR0IDw9IEZpcnN0Qnl0ZXMubGVuZ3RoOyBkdCsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICs9IEZpcnN0Qnl0ZXNbRmlyc3RCeXRlcy5sZW5ndGggLSBkdF0gKiBNYXRoLnBvdygxMjgsIGR0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSArPSBsYXN0Qnl0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZpbGUuZGF0YSA9IG5ldyBEYXRhVmlldyhGaWxlQXNVaW50OEFycmF5LmJ1ZmZlciwgRmlsZUFzVWludDhBcnJheS5ieXRlT2Zmc2V0LCBGaWxlQXNVaW50OEFycmF5LmJ5dGVMZW5ndGgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gOCBiaXRzIGJ5dGVzIGZpbGUgZGF0YSBhcnJheVxuICAgICAgICAvLyAgKiogcmVhZCBGSUxFIEhFQURFUlxuICAgICAgICBpZihmaWxlLnJlYWRJbnQoNCkgIT09IDB4NEQ1NDY4NjQpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdIZWFkZXIgdmFsaWRhdGlvbiBmYWlsZWQgKG5vdCBNSURJIHN0YW5kYXJkIG9yIGZpbGUgY29ycnVwdC4pJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhlYWRlciB2YWxpZGF0aW9uIGZhaWxlZCAobm90IE1JREkgc3RhbmRhcmQgb3IgZmlsZSBjb3JydXB0LilcbiAgICAgICAgfVxuICAgICAgICBsZXQgaGVhZGVyU2l6ZSAgICAgICAgICA9IGZpbGUucmVhZEludCg0KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBoZWFkZXIgc2l6ZSAodW51c2VkIHZhciksIGdldHRlZCBqdXN0IGZvciByZWFkIHBvaW50ZXIgbW92ZW1lbnRcbiAgICAgICAgbGV0IE1JREkgICAgICAgICAgICAgICAgPSB7fTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIG5ldyBtaWRpIG9iamVjdFxuICAgICAgICBNSURJLmZvcm1hdFR5cGUgICAgICAgICA9IGZpbGUucmVhZEludCgyKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgTUlESSBGb3JtYXQgVHlwZVxuICAgICAgICBNSURJLnRyYWNrcyAgICAgICAgICAgICA9IGZpbGUucmVhZEludCgyKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgYW1tb3VudCBvZiB0cmFjayBjaHVua3NcbiAgICAgICAgTUlESS50cmFjayAgICAgICAgICAgICAgPSBbXTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIGFycmF5IGtleSBmb3IgdHJhY2sgZGF0YSBzdG9yaW5nXG4gICAgICAgIGxldCB0aW1lRGl2aXNpb25CeXRlMSAgID0gZmlsZS5yZWFkSW50KDEpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBUaW1lIERpdmlzaW9uIGZpcnN0IGJ5dGVcbiAgICAgICAgbGV0IHRpbWVEaXZpc2lvbkJ5dGUyICAgPSBmaWxlLnJlYWRJbnQoMSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IFRpbWUgRGl2aXNpb24gc2Vjb25kIGJ5dGVcbiAgICAgICAgaWYodGltZURpdmlzaW9uQnl0ZTEgPj0gMTI4KXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGlzY292ZXIgVGltZSBEaXZpc2lvbiBtb2RlIChmcHMgb3IgdHBmKVxuICAgICAgICAgICAgTUlESS50aW1lRGl2aXNpb24gICAgPSBbXTtcbiAgICAgICAgICAgIE1JREkudGltZURpdmlzaW9uWzBdID0gdGltZURpdmlzaW9uQnl0ZTEgLSAxMjg7ICAgICAgICAgICAgICAgICAgICAgLy8gZnJhbWVzIHBlciBzZWNvbmQgTU9ERSAgKDFzdCBieXRlKVxuICAgICAgICAgICAgTUlESS50aW1lRGl2aXNpb25bMV0gPSB0aW1lRGl2aXNpb25CeXRlMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aWNrcyBpbiBlYWNoIGZyYW1lICAgICAoMm5kIGJ5dGUpXG4gICAgICAgIH1lbHNlIE1JREkudGltZURpdmlzaW9uICA9ICh0aW1lRGl2aXNpb25CeXRlMSAqIDI1NikgKyB0aW1lRGl2aXNpb25CeXRlMjsvLyBlbHNlLi4uIHRpY2tzIHBlciBiZWF0IE1PREUgICgyIGJ5dGVzIHZhbHVlKVxuXG4gICAgICAgIC8vICAqKiByZWFkIFRSQUNLIENIVU5LXG4gICAgICAgIGZvcihsZXQgdD0xOyB0IDw9IE1JREkudHJhY2tzOyB0Kyspe1xuICAgICAgICAgICAgTUlESS50cmFja1t0LTFdICAgICA9IHtldmVudDogW119OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgbmV3IFRyYWNrIGVudHJ5IGluIEFycmF5XG4gICAgICAgICAgICBsZXQgaGVhZGVyVmFsaWRhdGlvbiA9IGZpbGUucmVhZEludCg0KTtcbiAgICAgICAgICAgIGlmICggaGVhZGVyVmFsaWRhdGlvbiA9PT0gLTEgKSBicmVhazsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRU9GXG4gICAgICAgICAgICBpZihoZWFkZXJWYWxpZGF0aW9uICE9PSAweDRENTQ3MjZCKSByZXR1cm4gZmFsc2U7ICAgICAgICAgICAgICAgICAgIC8vIFRyYWNrIGNodW5rIGhlYWRlciB2YWxpZGF0aW9uIGZhaWxlZC5cbiAgICAgICAgICAgIGZpbGUucmVhZEludCg0KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbW92ZSBwb2ludGVyLiBnZXQgY2h1bmsgc2l6ZSAoYnl0ZXMgbGVuZ3RoKVxuICAgICAgICAgICAgbGV0IGUgICAgICAgICAgICAgICA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbml0IGV2ZW50IGNvdW50ZXJcbiAgICAgICAgICAgIGxldCBlbmRPZlRyYWNrICAgICAgPSBmYWxzZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRkxBRyBmb3IgdHJhY2sgcmVhZGluZyBzZWN1ZW5jZSBicmVha2luZ1xuICAgICAgICAgICAgLy8gKiogcmVhZCBFVkVOVCBDSFVOS1xuICAgICAgICAgICAgbGV0IHN0YXR1c0J5dGU7XG4gICAgICAgICAgICBsZXQgbGFzdHN0YXR1c0J5dGU7XG4gICAgICAgICAgICB3aGlsZSghZW5kT2ZUcmFjayl7XG4gICAgICAgICAgICAgICAgZSsrOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluY3JlYXNlIGJ5IDEgZXZlbnQgY291bnRlclxuICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdID0ge307ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgbmV3IGV2ZW50IG9iamVjdCwgaW4gZXZlbnRzIGFycmF5XG4gICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGVsdGFUaW1lICA9IGZpbGUucmVhZEludFZMVigpOyAgICAgIC8vIGdldCBERUxUQSBUSU1FIE9GIE1JREkgZXZlbnQgKFZhcmlhYmxlIExlbmd0aCBWYWx1ZSlcbiAgICAgICAgICAgICAgICBzdGF0dXNCeXRlID0gZmlsZS5yZWFkSW50KDEpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVhZCBFVkVOVCBUWVBFIChTVEFUVVMgQllURSlcbiAgICAgICAgICAgICAgICBpZihzdGF0dXNCeXRlID09PSAtMSkgYnJlYWs7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRU9GXG4gICAgICAgICAgICAgICAgZWxzZSBpZihzdGF0dXNCeXRlID49IDEyOCkgbGFzdHN0YXR1c0J5dGUgPSBzdGF0dXNCeXRlOyAgICAgICAgIC8vIE5FVyBTVEFUVVMgQllURSBERVRFQ1RFRFxuICAgICAgICAgICAgICAgIGVsc2V7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAnUlVOTklORyBTVEFUVVMnIHNpdHVhdGlvbiBkZXRlY3RlZFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNCeXRlID0gbGFzdHN0YXR1c0J5dGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcHBseSBsYXN0IGxvb3AsIFN0YXR1cyBCeXRlXG4gICAgICAgICAgICAgICAgICAgIGZpbGUubW92ZVBvaW50ZXIoLTEpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1vdmUgYmFjayB0aGUgcG9pbnRlciAoY2F1c2UgcmVhZGVkIGJ5dGUgaXMgbm90IHN0YXR1cyBieXRlKVxuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyAqKiBJUyBNRVRBIEVWRU5UXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICBpZihzdGF0dXNCeXRlID09PSAweEZGKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWV0YSBFdmVudCB0eXBlXG4gICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLnR5cGUgPSAweEZGOyAgICAgICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBtZXRhRXZlbnQgY29kZSB0byBhcnJheVxuICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5tZXRhVHlwZSA9ICBmaWxlLnJlYWRJbnQoMSk7ICAgICAvLyBhc3NpZ24gbWV0YUV2ZW50IHN1YnR5cGVcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1ldGFFdmVudExlbmd0aCA9IGZpbGUucmVhZEludFZMVigpOyAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBtZXRhRXZlbnQgbGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaChNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5tZXRhVHlwZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MkY6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVuZCBvZiB0cmFjaywgaGFzIG5vIGRhdGEgYnl0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAtMTogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFT0ZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRPZlRyYWNrID0gdHJ1ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hhbmdlIEZMQUcgdG8gZm9yY2UgdHJhY2sgcmVhZGluZyBsb29wIGJyZWFraW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDE6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRleHQgRXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHgwMjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29weXJpZ2h0IE5vdGljZVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDAzOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXF1ZW5jZS9UcmFjayBOYW1lIChkb2N1bWVudGF0aW9uOiBodHRwOi8vd3d3LnRhNy5kZS90eHQvbXVzaWsvbXVzaTAwMDYuaHRtKVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDA2OiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNYXJrZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkU3RyKG1ldGFFdmVudExlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MjE6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1JREkgUE9SVFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDU5OiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLZXkgU2lnbmF0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4NTE6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCBUZW1wb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBmaWxlLnJlYWRJbnQobWV0YUV2ZW50TGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHg1NDogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU01QVEUgT2Zmc2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSAgICA9IFtdOyAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbMF0gPSBmaWxlLnJlYWRJbnQoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVsxXSA9IGZpbGUucmVhZEludCgxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzJdID0gZmlsZS5yZWFkSW50KDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbM10gPSBmaWxlLnJlYWRJbnQoMSk7ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzRdID0gZmlsZS5yZWFkSW50KDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDU4OiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaW1lIFNpZ25hdHVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgICAgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzBdID0gZmlsZS5yZWFkSW50KDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbMV0gPSBmaWxlLnJlYWRJbnQoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVsyXSA9IGZpbGUucmVhZEludCgxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzNdID0gZmlsZS5yZWFkSW50KDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdXNlciBwcm92aWRlZCBhIGN1c3RvbSBpbnRlcnByZXRlciwgY2FsbCBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCBhc3NpZ24gdG8gZXZlbnQgdGhlIHJldHVybmVkIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5jdXN0b21JbnRlcnByZXRlciAhPT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSB0aGlzLmN1c3RvbUludGVycHJldGVyKCBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5tZXRhVHlwZSwgZmlsZSwgbWV0YUV2ZW50TGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgbm8gY3VzdG9tSW50ZXJwcmV0ciBpcyBwcm92aWRlZCwgb3IgcmV0dXJuZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmYWxzZSAoPWFwcGx5IGRlZmF1bHQpLCBwZXJmb3JtIGRlZmF1bHQgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5jdXN0b21JbnRlcnByZXRlciA9PT0gbnVsbCB8fCBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUucmVhZEludChtZXRhRXZlbnRMZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkSW50KG1ldGFFdmVudExlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYnVnKSBjb25zb2xlLmluZm8oJ1VuaW1wbGVtZW50ZWQgMHhGRiBtZXRhIGV2ZW50ISBkYXRhIGJsb2NrIHJlYWRlZCBhcyBJbnRlZ2VyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBJUyBSRUdVTEFSIEVWRU5UXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICBlbHNleyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNSURJIENvbnRyb2wgRXZlbnRzIE9SIFN5c3RlbSBFeGNsdXNpdmUgRXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c0J5dGUgPSBzdGF0dXNCeXRlLnRvU3RyaW5nKDE2KS5zcGxpdCgnJyk7ICAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBzdGF0dXMgYnl0ZSBIRVggcmVwcmVzZW50YXRpb24sIHRvIG9idGFpbiA0IGJpdHMgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgIGlmKCFzdGF0dXNCeXRlWzFdKSBzdGF0dXNCeXRlLnVuc2hpZnQoJzAnKTsgICAgICAgICAgICAgICAgIC8vIGZvcmNlIDIgZGlnaXRzXG4gICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLnR5cGUgPSBwYXJzZUludChzdGF0dXNCeXRlWzBdLCAxNik7Ly8gZmlyc3QgYnl0ZSBpcyBFVkVOVCBUWVBFIElEXG4gICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmNoYW5uZWwgPSBwYXJzZUludChzdGF0dXNCeXRlWzFdLCAxNik7Ly8gc2Vjb25kIGJ5dGUgaXMgY2hhbm5lbFxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2goTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0udHlwZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4Rjp7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTeXN0ZW0gRXhjbHVzaXZlIEV2ZW50c1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdXNlciBwcm92aWRlZCBhIGN1c3RvbSBpbnRlcnByZXRlciwgY2FsbCBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCBhc3NpZ24gdG8gZXZlbnQgdGhlIHJldHVybmVkIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5jdXN0b21JbnRlcnByZXRlciAhPT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSB0aGlzLmN1c3RvbUludGVycHJldGVyKCBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS50eXBlLCBmaWxlICwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vIGN1c3RvbUludGVycHJldHIgaXMgcHJvdmlkZWQsIG9yIHJldHVybmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFsc2UgKD1hcHBseSBkZWZhdWx0KSwgcGVyZm9ybSBkZWZhdWx0IGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuY3VzdG9tSW50ZXJwcmV0ZXIgPT09IG51bGwgfHwgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9PT0gZmFsc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXZlbnRfbGVuZ3RoID0gZmlsZS5yZWFkSW50VkxWKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBmaWxlLnJlYWRJbnQoZXZlbnRfbGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVidWcpIGNvbnNvbGUuaW5mbygnVW5pbXBsZW1lbnRlZCAweEYgZXhjbHVzaXZlIGV2ZW50cyEgZGF0YSBibG9jayByZWFkZWQgYXMgSW50ZWdlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHhBOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90ZSBBZnRlcnRvdWNoXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4QjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbnRyb2xsZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHhFOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGl0Y2ggQmVuZCBFdmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDg6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3RlIG9mZlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDk6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3RlIE9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbMF0gPSBmaWxlLnJlYWRJbnQoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVsxXSA9IGZpbGUucmVhZEludCgxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHhDOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJvZ3JhbSBDaGFuZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHhEOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hhbm5lbCBBZnRlcnRvdWNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IGZpbGUucmVhZEludCgxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRU9GXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kT2ZUcmFjayA9IHRydWU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYW5nZSBGTEFHIHRvIGZvcmNlIHRyYWNrIHJlYWRpbmcgbG9vcCBicmVha2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB1c2VyIHByb3ZpZGVkIGEgY3VzdG9tIGludGVycHJldGVyLCBjYWxsIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIGFzc2lnbiB0byBldmVudCB0aGUgcmV0dXJuZWQgZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmN1c3RvbUludGVycHJldGVyICE9PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IHRoaXMuY3VzdG9tSW50ZXJwcmV0ZXIoIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLm1ldGFUeXBlLCBmaWxlICwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vIGN1c3RvbUludGVycHJldHIgaXMgcHJvdmlkZWQsIG9yIHJldHVybmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFsc2UgKD1hcHBseSBkZWZhdWx0KSwgcGVyZm9ybSBkZWZhdWx0IGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuY3VzdG9tSW50ZXJwcmV0ZXIgPT09IG51bGwgfHwgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9PT0gZmFsc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVW5rbm93biBFVkVOVCBkZXRlY3RlZC4uLiByZWFkaW5nIGNhbmNlbGxlZCEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTUlESTtcbiAgICB9LFxuXG4gICAgLy8gY3VzdG9tIGZ1bmN0aW9uIHQgaGFuZGxlIHVuaW1wLGVtZW50ZWQsIG9yIGN1c3RvbSBtaWRpIG1lc3NhZ2VzLklmIG1lc3NhZ2VcbiAgICAvLyBpcyBhIG1ldGFldmVudCwgdGhlIHZhbHVlIG9mIG1ldGFFdmVudExlbmd0aCB3aWxsIGJlID4wLlxuICAgIC8vIEZ1bmN0aW9uIG11c3QgcmV0dXJuIHRoZSB2YWx1ZSB0byBzdG9yZSwgYW5kIHBvaW50ZXIgb2YgZGF0YVZpZXcgaW5jcmVzZWRcbiAgICAvLyBJZiBkZWZhdWx0IGFjdGlvbiB3YW50cyB0byBiZSBwZXJmb3JtZWQsIHJldHVybiBmYWxzZVxuICAgIGN1c3RvbUludGVycHJldGVyIDogbnVsbCAvLyBmdW5jdGlvbiggZV90eXBlICwgYXJyYXlCeWZmZXIsIG1ldGFFdmVudExlbmd0aCl7IHJldHVybiBlX2RhdGFfaW50IH1cbn07XG5cblxuaWYodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gTUlESVBhcnNlcjtcbiIsImZ1bmN0aW9uIE1pZGlUb0Nob3JkTWFwKCkge1xyXG5cdHRoaXMuY2hvcmRzTWFwID0gbmV3IE1hcCgpO1xyXG59XHJcblxyXG5NaWRpVG9DaG9yZE1hcC5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbihkb21GaWxlSW5wdXQsIGNhbGxiYWNrKSB7XHJcblx0Y29uc3QgZmlsZSA9IGRvbUZpbGVJbnB1dC5maWxlc1swXTtcclxuXHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHRsZXQgdGhpc09iaiA9IHRoaXM7XHJcblxyXG5cdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRsZXQgdWludDhhcnJheSA9IG5ldyBVaW50OEFycmF5KGUudGFyZ2V0LnJlc3VsdCk7XHJcblx0XHQvLyBsZXQgaGV4QXJyYXkgPSBbXTtcclxuXHRcdC8vIHVpbnQ4YXJyYXkuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuXHRcdC8vIFx0aGV4QXJyYXkucHVzaChDb252ZXJ0QmFzZS5kZWMyaGV4KGVsZW1lbnQpKTtcclxuXHRcdC8vIH0pO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2hleEFycmF5JywgaGV4QXJyYXkpO1xyXG5cdFx0bGV0IHBhcnNlZCA9IE1JRElQYXJzZXIucGFyc2UodWludDhhcnJheSksXHJcblx0XHRcdG9uZVRyYWNrID0gW10sXHJcblx0XHRcdHNvcnRlZE9uZVRyayA9IFtdLFxyXG5cdFx0XHRjdXJyTm90ZXMgPSBbXSxcclxuXHRcdFx0cHJldlRpbWUgPSAtMSxcclxuXHRcdFx0ZXZlbnRUaW1lID0gLTE7XHJcblxyXG5cdFx0cGFyc2VkLnRyYWNrLmZvckVhY2godHJhY2sgPT4ge1xyXG5cdFx0XHRsZXQgY3VyckRlbHRhVGltZSA9IDA7XHJcblxyXG5cdFx0XHR0cmFjay5ldmVudC5mb3JFYWNoKGV2ZW50ID0+IHtcclxuXHRcdFx0XHRjdXJyRGVsdGFUaW1lICs9IGV2ZW50LmRlbHRhVGltZTtcclxuXHJcblx0XHRcdFx0b25lVHJhY2sucHVzaCh7ICdldmVudCc6IGV2ZW50LCAndGltZSc6IGN1cnJEZWx0YVRpbWV9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvL2NvbnNvbGUubG9nKG9uZVRyYWNrLnNvcnQoKGEsYikgPT4gYS50aW1lIC0gYi50aW1lKS5zb3J0KChhLGIpID0+IGEuZXZlbnQudHlwZSAtIGIuZXZlbnQudHlwZSkpO1xyXG5cdFx0c29ydGVkT25lVHJrID0gb25lVHJhY2suc29ydCgoYSxiKSA9PiAoYS50aW1lICsgYS5ldmVudC50eXBlKSAtIChiLnRpbWUgKyBiLmV2ZW50LnR5cGUpKTtcdFxyXG5cdFx0c29ydGVkT25lVHJrLmZvckVhY2gob25lVHJFdmVudCA9PiB7XHJcblx0XHRcdGxldCBldiA9IG9uZVRyRXZlbnQuZXZlbnQ7XHJcblx0XHRcdGxldCB0eXBlID0gZXYudHlwZTtcclxuXHJcblx0XHRcdGlmKHR5cGUgPT09IDkgfHwgdHlwZSA9PT0gOCkge1xyXG5cdFx0XHRcdGxldCBub3RlID0gZXYuZGF0YVswXSAlIDEyO1xyXG5cdFx0XHRcdGxldCB2ZWxvY2l0eSA9IGV2LmRhdGFbMV07XHJcblx0XHRcdFx0ZXZlbnRUaW1lID0gb25lVHJFdmVudC50aW1lO1xyXG5cclxuXHRcdFx0XHRpZihwcmV2VGltZSA9PT0gLTEpXHJcblx0XHRcdFx0XHRwcmV2VGltZSA9IGV2ZW50VGltZTtcclxuXHJcblx0XHRcdFx0aWYocHJldlRpbWUgIT0gZXZlbnRUaW1lICYmIGN1cnJOb3Rlcy5sZW5ndGggIT0gMClcclxuXHRcdFx0XHRcdHRoaXNPYmouY2hvcmRzTWFwLnNldChldmVudFRpbWUsIEFycmF5LmZyb20obmV3IFNldChjdXJyTm90ZXMpKSk7XHJcblxyXG5cdFx0XHRcdGlmKHR5cGUgPT09IDggfHwgKHR5cGUgPT09IDkgJiYgdmVsb2NpdHkgPT09IDApKSB7XHJcblx0XHRcdFx0XHRjdXJyTm90ZXMuc3BsaWNlKGN1cnJOb3Rlcy5pbmRleE9mKG5vdGUpLCAxKTtcclxuXHJcblx0XHRcdFx0fSBlbHNlIGlmKHR5cGUgPT09IDkgJiYgdmVsb2NpdHkgPiAwKSB7XHJcblx0XHRcdFx0XHRjdXJyTm90ZXMucHVzaChub3RlKTtcclxuXHRcdFx0XHR9IFxyXG5cdFx0XHR9XHJcblx0XHRcdHByZXZUaW1lID0gZXZlbnRUaW1lO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Y2FsbGJhY2soKTtcclxuXHR9IFxyXG5cclxuXHRyZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoZmlsZSk7IFxyXG59IiwiXHJcblxyXG5mdW5jdGlvbiB0ZXN0cHkoKSB7XHJcblx0dmFyIHJlc3VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHQnKSxcclxuICAgICAgICBzZW50X3R4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0eHQtaW5wdXQnKS52YWx1ZTtcclxuXHJcbiAgICB3cy5zZW5kKHNlbnRfdHh0KTtcclxuXHJcbiAgICB3cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICByZXN1bHQuaW5uZXJIVE1MID0gZXZlbnQuZGF0YTtcclxuXHJcbiAgICAgICAgLyp2YXIgbWVzc2FnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSxcclxuICAgICAgICAgICAgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyksXHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShldmVudC5kYXRhKTtcclxuICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICAgIG1lc3NhZ2VzLmFwcGVuZENoaWxkKG1lc3NhZ2UpOyovXHJcblxyXG4gICAgfTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdweXRob24tdGVzdCcpLmFwcGVuZENoaWxkKHJlc3VsdCk7XHJcbn0iLCIvKmZ1bmN0aW9uIG1pZGlUb1B5KCkge1xyXG5cdHZhciBpbnB1dEVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZmlsZS1pbnB1dCcpO1xyXG5cdHZhciBmaWxlID0gaW5wdXRFbGVtLmZpbGVzWzBdO1xyXG5cdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZ0KSB7XHJcblx0XHR3cy5zZW5kKGV2dC50YXJnZXQucmVzdWx0KTtcclxuXHR9XHJcblxyXG5cdHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG5cclxuXHJcbn1cclxuXHJcbndzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0Y29uc29sZS5sb2coJ3BhcnNpbmcganNvbi4uLicpO1xyXG5cdHZhciBpbnB1dENob3JkcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XHJcblx0Y29uc29sZS5sb2coJ2pzb24gcGFyc2VkJyk7XHJcblx0Y29uc29sZS5sb2coJ2NyZWF0aW5nIGNob3JkcycpO1xyXG5cdGZvcih2YXIgaUNob3JkIGluIGlucHV0Q2hvcmRzKSB7XHJcblx0XHR2YXIgY2hvcmQgPSBuZXcgQ2hvcmQoaW5wdXRDaG9yZHNbaUNob3JkXSk7XHJcblx0XHRjaG9yZHMucHVzaChjaG9yZCk7XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKCdjaG9yZHMgY3JlYXRlZCcpO1xyXG5cclxuXHRkcmF3Q2hvcmRzKDUsIDYpO1xyXG59Ki8iLCJmdW5jdGlvbiBTbGlkZXIoZG9tRWxlbSwgYWxsTWVzaGVzLCBjaG9yZHNNYXApIHtcclxuXHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2xpZGVyJyk7XHJcblx0bGV0IHRpbWVzQXJyYXkgPSBBcnJheS5mcm9tKGNob3Jkc01hcC5rZXlzKCkpLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcclxuXHRsZXQgbG93Qm91bmQgPSB0aW1lc0FycmF5WzBdO1xyXG5cdGxldCB1cEJvdW5kID0gdGltZXNBcnJheVt0aW1lc0FycmF5Lmxlbmd0aCAtIDFdO1xyXG5cdGxldCB1cCA9IHVwQm91bmQ7XHJcblx0bGV0IGxvdyA9IGxvd0JvdW5kO1xyXG5cclxuXHRpZihzbGlkZXIubm9VaVNsaWRlciAhPSBudWxsKVxyXG5cdFx0c2xpZGVyLm5vVWlTbGlkZXIuZGVzdHJveSgpO1xyXG5cclxuXHRub1VpU2xpZGVyLmNyZWF0ZShzbGlkZXIsIHtcclxuXHRcdHN0YXJ0OiBbIDAsIDUwMCBdLFxyXG5cdFx0Y29ubmVjdDogdHJ1ZSxcclxuXHRcdHRvb2x0aXBzOiBbIHRydWUsIHRydWUgXSxcclxuXHRcdHJhbmdlOiB7XHJcblx0XHRcdCdtaW4nOiBsb3dCb3VuZCxcclxuXHRcdFx0J21heCc6IHVwQm91bmRcclxuXHRcdH0sXHJcblx0XHRmb3JtYXQ6IHdOdW1iKHtcclxuXHRcdFx0ZGVjaW1hbHM6IDBcclxuXHRcdH0pXHJcblx0fSk7XHJcblxyXG5cdHNsaWRlci5ub1VpU2xpZGVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbih2YWx1ZXMsIGhhbmRsZSkge1xyXG5cdFx0bGV0IHZhbHVlID0gdmFsdWVzW2hhbmRsZV07XHJcblx0XHRpZihoYW5kbGUgPT09IDEpIHtcclxuXHRcdFx0dXAgPSBwYXJzZUludCh2YWx1ZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsb3cgPSBwYXJzZUludCh2YWx1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIGFsbE1lc2hlcy5tZXNoZXNCeUlkLnZhbHVlcygpLmZvckVhY2goZnVuY3Rpb24odmFsLCBrZXkpIHtcclxuXHRcdC8vIFx0dmFsLnZpc2libGUgPSBmYWxzZTtcclxuXHRcdC8vIH0pO1xyXG5cdFx0XHJcblx0XHRmb3IobGV0IGk9bG93Qm91bmQ7IGk8dXBCb3VuZDsgaSsrKSB7XHJcblx0XHRcdGlmKGk+PWxvdyAmJiBpPD11cCkge1xyXG5cdFx0XHRcdGlmKGNob3Jkc01hcC5oYXMoaSkpIHtcdFx0XHRcdFxyXG5cdFx0XHRcdFx0YWxsTWVzaGVzLnNob3dGcm9tUHRzQXJyYXkoY2hvcmRzTWFwLmdldChpKSwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmKGNob3Jkc01hcC5oYXMoaSkpIHtcdFx0XHRcdFxyXG5cdFx0XHRcdFx0YWxsTWVzaGVzLnNob3dGcm9tUHRzQXJyYXkoY2hvcmRzTWFwLmdldChpKSwgZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG5cdFxyXG59IiwiLyohIG5vdWlzbGlkZXIgLSAxMS4xLjAgLSAyMDE4LTA0LTAyIDExOjE4OjEzICovXHJcblxyXG4hZnVuY3Rpb24oYSl7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxhKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1hKCk6d2luZG93Lm5vVWlTbGlkZXI9YSgpfShmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGEoYSl7cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIGEmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEudG8mJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEuZnJvbX1mdW5jdGlvbiBiKGEpe2EucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChhKX1mdW5jdGlvbiBjKGEpe3JldHVybiBudWxsIT09YSYmdm9pZCAwIT09YX1mdW5jdGlvbiBkKGEpe2EucHJldmVudERlZmF1bHQoKX1mdW5jdGlvbiBlKGEpe3JldHVybiBhLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4hdGhpc1thXSYmKHRoaXNbYV09ITApfSx7fSl9ZnVuY3Rpb24gZihhLGIpe3JldHVybiBNYXRoLnJvdW5kKGEvYikqYn1mdW5jdGlvbiBnKGEsYil7dmFyIGM9YS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxkPWEub3duZXJEb2N1bWVudCxlPWQuZG9jdW1lbnRFbGVtZW50LGY9cChkKTtyZXR1cm4vd2Via2l0LipDaHJvbWUuKk1vYmlsZS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkmJihmLng9MCksYj9jLnRvcCtmLnktZS5jbGllbnRUb3A6Yy5sZWZ0K2YueC1lLmNsaWVudExlZnR9ZnVuY3Rpb24gaChhKXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgYSYmIWlzTmFOKGEpJiZpc0Zpbml0ZShhKX1mdW5jdGlvbiBpKGEsYixjKXtjPjAmJihtKGEsYiksc2V0VGltZW91dChmdW5jdGlvbigpe24oYSxiKX0sYykpfWZ1bmN0aW9uIGooYSl7cmV0dXJuIE1hdGgubWF4KE1hdGgubWluKGEsMTAwKSwwKX1mdW5jdGlvbiBrKGEpe3JldHVybiBBcnJheS5pc0FycmF5KGEpP2E6W2FdfWZ1bmN0aW9uIGwoYSl7YT1TdHJpbmcoYSk7dmFyIGI9YS5zcGxpdChcIi5cIik7cmV0dXJuIGIubGVuZ3RoPjE/YlsxXS5sZW5ndGg6MH1mdW5jdGlvbiBtKGEsYil7YS5jbGFzc0xpc3Q/YS5jbGFzc0xpc3QuYWRkKGIpOmEuY2xhc3NOYW1lKz1cIiBcIitifWZ1bmN0aW9uIG4oYSxiKXthLmNsYXNzTGlzdD9hLmNsYXNzTGlzdC5yZW1vdmUoYik6YS5jbGFzc05hbWU9YS5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58XFxcXGIpXCIrYi5zcGxpdChcIiBcIikuam9pbihcInxcIikrXCIoXFxcXGJ8JClcIixcImdpXCIpLFwiIFwiKX1mdW5jdGlvbiBvKGEsYil7cmV0dXJuIGEuY2xhc3NMaXN0P2EuY2xhc3NMaXN0LmNvbnRhaW5zKGIpOm5ldyBSZWdFeHAoXCJcXFxcYlwiK2IrXCJcXFxcYlwiKS50ZXN0KGEuY2xhc3NOYW1lKX1mdW5jdGlvbiBwKGEpe3ZhciBiPXZvaWQgMCE9PXdpbmRvdy5wYWdlWE9mZnNldCxjPVwiQ1NTMUNvbXBhdFwiPT09KGEuY29tcGF0TW9kZXx8XCJcIik7cmV0dXJue3g6Yj93aW5kb3cucGFnZVhPZmZzZXQ6Yz9hLmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0OmEuYm9keS5zY3JvbGxMZWZ0LHk6Yj93aW5kb3cucGFnZVlPZmZzZXQ6Yz9hLmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A6YS5ib2R5LnNjcm9sbFRvcH19ZnVuY3Rpb24gcSgpe3JldHVybiB3aW5kb3cubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkP3tzdGFydDpcInBvaW50ZXJkb3duXCIsbW92ZTpcInBvaW50ZXJtb3ZlXCIsZW5kOlwicG9pbnRlcnVwXCJ9OndpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZD97c3RhcnQ6XCJNU1BvaW50ZXJEb3duXCIsbW92ZTpcIk1TUG9pbnRlck1vdmVcIixlbmQ6XCJNU1BvaW50ZXJVcFwifTp7c3RhcnQ6XCJtb3VzZWRvd24gdG91Y2hzdGFydFwiLG1vdmU6XCJtb3VzZW1vdmUgdG91Y2htb3ZlXCIsZW5kOlwibW91c2V1cCB0b3VjaGVuZFwifX1mdW5jdGlvbiByKCl7dmFyIGE9ITE7dHJ5e3ZhciBiPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSxcInBhc3NpdmVcIix7Z2V0OmZ1bmN0aW9uKCl7YT0hMH19KTt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRlc3RcIixudWxsLGIpfWNhdGNoKGEpe31yZXR1cm4gYX1mdW5jdGlvbiBzKCl7cmV0dXJuIHdpbmRvdy5DU1MmJkNTUy5zdXBwb3J0cyYmQ1NTLnN1cHBvcnRzKFwidG91Y2gtYWN0aW9uXCIsXCJub25lXCIpfWZ1bmN0aW9uIHQoYSxiKXtyZXR1cm4gMTAwLyhiLWEpfWZ1bmN0aW9uIHUoYSxiKXtyZXR1cm4gMTAwKmIvKGFbMV0tYVswXSl9ZnVuY3Rpb24gdihhLGIpe3JldHVybiB1KGEsYVswXTwwP2IrTWF0aC5hYnMoYVswXSk6Yi1hWzBdKX1mdW5jdGlvbiB3KGEsYil7cmV0dXJuIGIqKGFbMV0tYVswXSkvMTAwK2FbMF19ZnVuY3Rpb24geChhLGIpe2Zvcih2YXIgYz0xO2E+PWJbY107KWMrPTE7cmV0dXJuIGN9ZnVuY3Rpb24geShhLGIsYyl7aWYoYz49YS5zbGljZSgtMSlbMF0pcmV0dXJuIDEwMDt2YXIgZD14KGMsYSksZT1hW2QtMV0sZj1hW2RdLGc9YltkLTFdLGg9YltkXTtyZXR1cm4gZyt2KFtlLGZdLGMpL3QoZyxoKX1mdW5jdGlvbiB6KGEsYixjKXtpZihjPj0xMDApcmV0dXJuIGEuc2xpY2UoLTEpWzBdO3ZhciBkPXgoYyxiKSxlPWFbZC0xXSxmPWFbZF0sZz1iW2QtMV07cmV0dXJuIHcoW2UsZl0sKGMtZykqdChnLGJbZF0pKX1mdW5jdGlvbiBBKGEsYixjLGQpe2lmKDEwMD09PWQpcmV0dXJuIGQ7dmFyIGU9eChkLGEpLGc9YVtlLTFdLGg9YVtlXTtyZXR1cm4gYz9kLWc+KGgtZykvMj9oOmc6YltlLTFdP2FbZS0xXStmKGQtYVtlLTFdLGJbZS0xXSk6ZH1mdW5jdGlvbiBCKGEsYixjKXt2YXIgZDtpZihcIm51bWJlclwiPT10eXBlb2YgYiYmKGI9W2JdKSwhQXJyYXkuaXNBcnJheShiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3JhbmdlJyBjb250YWlucyBpbnZhbGlkIHZhbHVlLlwiKTtpZihkPVwibWluXCI9PT1hPzA6XCJtYXhcIj09PWE/MTAwOnBhcnNlRmxvYXQoYSksIWgoZCl8fCFoKGJbMF0pKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncmFuZ2UnIHZhbHVlIGlzbid0IG51bWVyaWMuXCIpO2MueFBjdC5wdXNoKGQpLGMueFZhbC5wdXNoKGJbMF0pLGQ/Yy54U3RlcHMucHVzaCghaXNOYU4oYlsxXSkmJmJbMV0pOmlzTmFOKGJbMV0pfHwoYy54U3RlcHNbMF09YlsxXSksYy54SGlnaGVzdENvbXBsZXRlU3RlcC5wdXNoKDApfWZ1bmN0aW9uIEMoYSxiLGMpe2lmKCFiKXJldHVybiEwO2MueFN0ZXBzW2FdPXUoW2MueFZhbFthXSxjLnhWYWxbYSsxXV0sYikvdChjLnhQY3RbYV0sYy54UGN0W2ErMV0pO3ZhciBkPShjLnhWYWxbYSsxXS1jLnhWYWxbYV0pL2MueE51bVN0ZXBzW2FdLGU9TWF0aC5jZWlsKE51bWJlcihkLnRvRml4ZWQoMykpLTEpLGY9Yy54VmFsW2FdK2MueE51bVN0ZXBzW2FdKmU7Yy54SGlnaGVzdENvbXBsZXRlU3RlcFthXT1mfWZ1bmN0aW9uIEQoYSxiLGMpe3RoaXMueFBjdD1bXSx0aGlzLnhWYWw9W10sdGhpcy54U3RlcHM9W2N8fCExXSx0aGlzLnhOdW1TdGVwcz1bITFdLHRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXA9W10sdGhpcy5zbmFwPWI7dmFyIGQsZT1bXTtmb3IoZCBpbiBhKWEuaGFzT3duUHJvcGVydHkoZCkmJmUucHVzaChbYVtkXSxkXSk7Zm9yKGUubGVuZ3RoJiZcIm9iamVjdFwiPT10eXBlb2YgZVswXVswXT9lLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYVswXVswXS1iWzBdWzBdfSk6ZS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGFbMF0tYlswXX0pLGQ9MDtkPGUubGVuZ3RoO2QrKylCKGVbZF1bMV0sZVtkXVswXSx0aGlzKTtmb3IodGhpcy54TnVtU3RlcHM9dGhpcy54U3RlcHMuc2xpY2UoMCksZD0wO2Q8dGhpcy54TnVtU3RlcHMubGVuZ3RoO2QrKylDKGQsdGhpcy54TnVtU3RlcHNbZF0sdGhpcyl9ZnVuY3Rpb24gRShiKXtpZihhKGIpKXJldHVybiEwO3Rocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnZm9ybWF0JyByZXF1aXJlcyAndG8nIGFuZCAnZnJvbScgbWV0aG9kcy5cIil9ZnVuY3Rpb24gRihhLGIpe2lmKCFoKGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnc3RlcCcgaXMgbm90IG51bWVyaWMuXCIpO2Euc2luZ2xlU3RlcD1ifWZ1bmN0aW9uIEcoYSxiKXtpZihcIm9iamVjdFwiIT10eXBlb2YgYnx8QXJyYXkuaXNBcnJheShiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3JhbmdlJyBpcyBub3QgYW4gb2JqZWN0LlwiKTtpZih2b2lkIDA9PT1iLm1pbnx8dm9pZCAwPT09Yi5tYXgpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6IE1pc3NpbmcgJ21pbicgb3IgJ21heCcgaW4gJ3JhbmdlJy5cIik7aWYoYi5taW49PT1iLm1heCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3JhbmdlJyAnbWluJyBhbmQgJ21heCcgY2Fubm90IGJlIGVxdWFsLlwiKTthLnNwZWN0cnVtPW5ldyBEKGIsYS5zbmFwLGEuc2luZ2xlU3RlcCl9ZnVuY3Rpb24gSChhLGIpe2lmKGI9ayhiKSwhQXJyYXkuaXNBcnJheShiKXx8IWIubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnc3RhcnQnIG9wdGlvbiBpcyBpbmNvcnJlY3QuXCIpO2EuaGFuZGxlcz1iLmxlbmd0aCxhLnN0YXJ0PWJ9ZnVuY3Rpb24gSShhLGIpe2lmKGEuc25hcD1iLFwiYm9vbGVhblwiIT10eXBlb2YgYil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3NuYXAnIG9wdGlvbiBtdXN0IGJlIGEgYm9vbGVhbi5cIil9ZnVuY3Rpb24gSihhLGIpe2lmKGEuYW5pbWF0ZT1iLFwiYm9vbGVhblwiIT10eXBlb2YgYil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2FuaW1hdGUnIG9wdGlvbiBtdXN0IGJlIGEgYm9vbGVhbi5cIil9ZnVuY3Rpb24gSyhhLGIpe2lmKGEuYW5pbWF0aW9uRHVyYXRpb249YixcIm51bWJlclwiIT10eXBlb2YgYil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2FuaW1hdGlvbkR1cmF0aW9uJyBvcHRpb24gbXVzdCBiZSBhIG51bWJlci5cIil9ZnVuY3Rpb24gTChhLGIpe3ZhciBjLGQ9WyExXTtpZihcImxvd2VyXCI9PT1iP2I9WyEwLCExXTpcInVwcGVyXCI9PT1iJiYoYj1bITEsITBdKSwhMD09PWJ8fCExPT09Yil7Zm9yKGM9MTtjPGEuaGFuZGxlcztjKyspZC5wdXNoKGIpO2QucHVzaCghMSl9ZWxzZXtpZighQXJyYXkuaXNBcnJheShiKXx8IWIubGVuZ3RofHxiLmxlbmd0aCE9PWEuaGFuZGxlcysxKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnY29ubmVjdCcgb3B0aW9uIGRvZXNuJ3QgbWF0Y2ggaGFuZGxlIGNvdW50LlwiKTtkPWJ9YS5jb25uZWN0PWR9ZnVuY3Rpb24gTShhLGIpe3N3aXRjaChiKXtjYXNlXCJob3Jpem9udGFsXCI6YS5vcnQ9MDticmVhaztjYXNlXCJ2ZXJ0aWNhbFwiOmEub3J0PTE7YnJlYWs7ZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ29yaWVudGF0aW9uJyBvcHRpb24gaXMgaW52YWxpZC5cIil9fWZ1bmN0aW9uIE4oYSxiKXtpZighaChiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ21hcmdpbicgb3B0aW9uIG11c3QgYmUgbnVtZXJpYy5cIik7aWYoMCE9PWImJihhLm1hcmdpbj1hLnNwZWN0cnVtLmdldE1hcmdpbihiKSwhYS5tYXJnaW4pKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbWFyZ2luJyBvcHRpb24gaXMgb25seSBzdXBwb3J0ZWQgb24gbGluZWFyIHNsaWRlcnMuXCIpfWZ1bmN0aW9uIE8oYSxiKXtpZighaChiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2xpbWl0JyBvcHRpb24gbXVzdCBiZSBudW1lcmljLlwiKTtpZihhLmxpbWl0PWEuc3BlY3RydW0uZ2V0TWFyZ2luKGIpLCFhLmxpbWl0fHxhLmhhbmRsZXM8Mil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2xpbWl0JyBvcHRpb24gaXMgb25seSBzdXBwb3J0ZWQgb24gbGluZWFyIHNsaWRlcnMgd2l0aCAyIG9yIG1vcmUgaGFuZGxlcy5cIil9ZnVuY3Rpb24gUChhLGIpe2lmKCFoKGIpJiYhQXJyYXkuaXNBcnJheShiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMgb3IgYXJyYXkgb2YgZXhhY3RseSAyIG51bWJlcnMuXCIpO2lmKEFycmF5LmlzQXJyYXkoYikmJjIhPT1iLmxlbmd0aCYmIWgoYlswXSkmJiFoKGJbMV0pKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncGFkZGluZycgb3B0aW9uIG11c3QgYmUgbnVtZXJpYyBvciBhcnJheSBvZiBleGFjdGx5IDIgbnVtYmVycy5cIik7aWYoMCE9PWIpe2lmKEFycmF5LmlzQXJyYXkoYil8fChiPVtiLGJdKSxhLnBhZGRpbmc9W2Euc3BlY3RydW0uZ2V0TWFyZ2luKGJbMF0pLGEuc3BlY3RydW0uZ2V0TWFyZ2luKGJbMV0pXSwhMT09PWEucGFkZGluZ1swXXx8ITE9PT1hLnBhZGRpbmdbMV0pdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdwYWRkaW5nJyBvcHRpb24gaXMgb25seSBzdXBwb3J0ZWQgb24gbGluZWFyIHNsaWRlcnMuXCIpO2lmKGEucGFkZGluZ1swXTwwfHxhLnBhZGRpbmdbMV08MCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyKHMpLlwiKTtpZihhLnBhZGRpbmdbMF0rYS5wYWRkaW5nWzFdPj0xMDApdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdwYWRkaW5nJyBvcHRpb24gbXVzdCBub3QgZXhjZWVkIDEwMCUgb2YgdGhlIHJhbmdlLlwiKX19ZnVuY3Rpb24gUShhLGIpe3N3aXRjaChiKXtjYXNlXCJsdHJcIjphLmRpcj0wO2JyZWFrO2Nhc2VcInJ0bFwiOmEuZGlyPTE7YnJlYWs7ZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2RpcmVjdGlvbicgb3B0aW9uIHdhcyBub3QgcmVjb2duaXplZC5cIil9fWZ1bmN0aW9uIFIoYSxiKXtpZihcInN0cmluZ1wiIT10eXBlb2YgYil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2JlaGF2aW91cicgbXVzdCBiZSBhIHN0cmluZyBjb250YWluaW5nIG9wdGlvbnMuXCIpO3ZhciBjPWIuaW5kZXhPZihcInRhcFwiKT49MCxkPWIuaW5kZXhPZihcImRyYWdcIik+PTAsZT1iLmluZGV4T2YoXCJmaXhlZFwiKT49MCxmPWIuaW5kZXhPZihcInNuYXBcIik+PTAsZz1iLmluZGV4T2YoXCJob3ZlclwiKT49MDtpZihlKXtpZigyIT09YS5oYW5kbGVzKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnZml4ZWQnIGJlaGF2aW91ciBtdXN0IGJlIHVzZWQgd2l0aCAyIGhhbmRsZXNcIik7TihhLGEuc3RhcnRbMV0tYS5zdGFydFswXSl9YS5ldmVudHM9e3RhcDpjfHxmLGRyYWc6ZCxmaXhlZDplLHNuYXA6Zixob3ZlcjpnfX1mdW5jdGlvbiBTKGEsYil7aWYoITEhPT1iKWlmKCEwPT09Yil7YS50b29sdGlwcz1bXTtmb3IodmFyIGM9MDtjPGEuaGFuZGxlcztjKyspYS50b29sdGlwcy5wdXNoKCEwKX1lbHNle2lmKGEudG9vbHRpcHM9ayhiKSxhLnRvb2x0aXBzLmxlbmd0aCE9PWEuaGFuZGxlcyl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogbXVzdCBwYXNzIGEgZm9ybWF0dGVyIGZvciBhbGwgaGFuZGxlcy5cIik7YS50b29sdGlwcy5mb3JFYWNoKGZ1bmN0aW9uKGEpe2lmKFwiYm9vbGVhblwiIT10eXBlb2YgYSYmKFwib2JqZWN0XCIhPXR5cGVvZiBhfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBhLnRvKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3Rvb2x0aXBzJyBtdXN0IGJlIHBhc3NlZCBhIGZvcm1hdHRlciBvciAnZmFsc2UnLlwiKX0pfX1mdW5jdGlvbiBUKGEsYil7YS5hcmlhRm9ybWF0PWIsRShiKX1mdW5jdGlvbiBVKGEsYil7YS5mb3JtYXQ9YixFKGIpfWZ1bmN0aW9uIFYoYSxiKXtpZihcInN0cmluZ1wiIT10eXBlb2YgYiYmITEhPT1iKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnY3NzUHJlZml4JyBtdXN0IGJlIGEgc3RyaW5nIG9yIGBmYWxzZWAuXCIpO2EuY3NzUHJlZml4PWJ9ZnVuY3Rpb24gVyhhLGIpe2lmKFwib2JqZWN0XCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnY3NzQ2xhc3NlcycgbXVzdCBiZSBhbiBvYmplY3QuXCIpO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBhLmNzc1ByZWZpeCl7YS5jc3NDbGFzc2VzPXt9O2Zvcih2YXIgYyBpbiBiKWIuaGFzT3duUHJvcGVydHkoYykmJihhLmNzc0NsYXNzZXNbY109YS5jc3NQcmVmaXgrYltjXSl9ZWxzZSBhLmNzc0NsYXNzZXM9Yn1mdW5jdGlvbiBYKGEpe3ZhciBiPXttYXJnaW46MCxsaW1pdDowLHBhZGRpbmc6MCxhbmltYXRlOiEwLGFuaW1hdGlvbkR1cmF0aW9uOjMwMCxhcmlhRm9ybWF0Ol8sZm9ybWF0Ol99LGQ9e3N0ZXA6e3I6ITEsdDpGfSxzdGFydDp7cjohMCx0Okh9LGNvbm5lY3Q6e3I6ITAsdDpMfSxkaXJlY3Rpb246e3I6ITAsdDpRfSxzbmFwOntyOiExLHQ6SX0sYW5pbWF0ZTp7cjohMSx0Okp9LGFuaW1hdGlvbkR1cmF0aW9uOntyOiExLHQ6S30scmFuZ2U6e3I6ITAsdDpHfSxvcmllbnRhdGlvbjp7cjohMSx0Ok19LG1hcmdpbjp7cjohMSx0Ok59LGxpbWl0OntyOiExLHQ6T30scGFkZGluZzp7cjohMSx0OlB9LGJlaGF2aW91cjp7cjohMCx0OlJ9LGFyaWFGb3JtYXQ6e3I6ITEsdDpUfSxmb3JtYXQ6e3I6ITEsdDpVfSx0b29sdGlwczp7cjohMSx0OlN9LGNzc1ByZWZpeDp7cjohMCx0OlZ9LGNzc0NsYXNzZXM6e3I6ITAsdDpXfX0sZT17Y29ubmVjdDohMSxkaXJlY3Rpb246XCJsdHJcIixiZWhhdmlvdXI6XCJ0YXBcIixvcmllbnRhdGlvbjpcImhvcml6b250YWxcIixjc3NQcmVmaXg6XCJub1VpLVwiLGNzc0NsYXNzZXM6e3RhcmdldDpcInRhcmdldFwiLGJhc2U6XCJiYXNlXCIsb3JpZ2luOlwib3JpZ2luXCIsaGFuZGxlOlwiaGFuZGxlXCIsaGFuZGxlTG93ZXI6XCJoYW5kbGUtbG93ZXJcIixoYW5kbGVVcHBlcjpcImhhbmRsZS11cHBlclwiLGhvcml6b250YWw6XCJob3Jpem9udGFsXCIsdmVydGljYWw6XCJ2ZXJ0aWNhbFwiLGJhY2tncm91bmQ6XCJiYWNrZ3JvdW5kXCIsY29ubmVjdDpcImNvbm5lY3RcIixjb25uZWN0czpcImNvbm5lY3RzXCIsbHRyOlwibHRyXCIscnRsOlwicnRsXCIsZHJhZ2dhYmxlOlwiZHJhZ2dhYmxlXCIsZHJhZzpcInN0YXRlLWRyYWdcIix0YXA6XCJzdGF0ZS10YXBcIixhY3RpdmU6XCJhY3RpdmVcIix0b29sdGlwOlwidG9vbHRpcFwiLHBpcHM6XCJwaXBzXCIscGlwc0hvcml6b250YWw6XCJwaXBzLWhvcml6b250YWxcIixwaXBzVmVydGljYWw6XCJwaXBzLXZlcnRpY2FsXCIsbWFya2VyOlwibWFya2VyXCIsbWFya2VySG9yaXpvbnRhbDpcIm1hcmtlci1ob3Jpem9udGFsXCIsbWFya2VyVmVydGljYWw6XCJtYXJrZXItdmVydGljYWxcIixtYXJrZXJOb3JtYWw6XCJtYXJrZXItbm9ybWFsXCIsbWFya2VyTGFyZ2U6XCJtYXJrZXItbGFyZ2VcIixtYXJrZXJTdWI6XCJtYXJrZXItc3ViXCIsdmFsdWU6XCJ2YWx1ZVwiLHZhbHVlSG9yaXpvbnRhbDpcInZhbHVlLWhvcml6b250YWxcIix2YWx1ZVZlcnRpY2FsOlwidmFsdWUtdmVydGljYWxcIix2YWx1ZU5vcm1hbDpcInZhbHVlLW5vcm1hbFwiLHZhbHVlTGFyZ2U6XCJ2YWx1ZS1sYXJnZVwiLHZhbHVlU3ViOlwidmFsdWUtc3ViXCJ9fTthLmZvcm1hdCYmIWEuYXJpYUZvcm1hdCYmKGEuYXJpYUZvcm1hdD1hLmZvcm1hdCksT2JqZWN0LmtleXMoZCkuZm9yRWFjaChmdW5jdGlvbihmKXtpZighYyhhW2ZdKSYmdm9pZCAwPT09ZVtmXSl7aWYoZFtmXS5yKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnXCIrZitcIicgaXMgcmVxdWlyZWQuXCIpO3JldHVybiEwfWRbZl0udChiLGMoYVtmXSk/YVtmXTplW2ZdKX0pLGIucGlwcz1hLnBpcHM7dmFyIGY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxnPXZvaWQgMCE9PWYuc3R5bGUubXNUcmFuc2Zvcm0saD12b2lkIDAhPT1mLnN0eWxlLnRyYW5zZm9ybTtiLnRyYW5zZm9ybVJ1bGU9aD9cInRyYW5zZm9ybVwiOmc/XCJtc1RyYW5zZm9ybVwiOlwid2Via2l0VHJhbnNmb3JtXCI7dmFyIGk9W1tcImxlZnRcIixcInRvcFwiXSxbXCJyaWdodFwiLFwiYm90dG9tXCJdXTtyZXR1cm4gYi5zdHlsZT1pW2IuZGlyXVtiLm9ydF0sYn1mdW5jdGlvbiBZKGEsYyxmKXtmdW5jdGlvbiBoKGEsYil7dmFyIGM9eWEuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm4gYiYmbShjLGIpLGEuYXBwZW5kQ2hpbGQoYyksY31mdW5jdGlvbiBsKGEsYil7dmFyIGQ9aChhLGMuY3NzQ2xhc3Nlcy5vcmlnaW4pLGU9aChkLGMuY3NzQ2xhc3Nlcy5oYW5kbGUpO3JldHVybiBlLnNldEF0dHJpYnV0ZShcImRhdGEtaGFuZGxlXCIsYiksZS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLFwiMFwiKSxlLnNldEF0dHJpYnV0ZShcInJvbGVcIixcInNsaWRlclwiKSxlLnNldEF0dHJpYnV0ZShcImFyaWEtb3JpZW50YXRpb25cIixjLm9ydD9cInZlcnRpY2FsXCI6XCJob3Jpem9udGFsXCIpLDA9PT1iP20oZSxjLmNzc0NsYXNzZXMuaGFuZGxlTG93ZXIpOmI9PT1jLmhhbmRsZXMtMSYmbShlLGMuY3NzQ2xhc3Nlcy5oYW5kbGVVcHBlciksZH1mdW5jdGlvbiB0KGEsYil7cmV0dXJuISFiJiZoKGEsYy5jc3NDbGFzc2VzLmNvbm5lY3QpfWZ1bmN0aW9uIHUoYSxiKXt2YXIgZD1oKGIsYy5jc3NDbGFzc2VzLmNvbm5lY3RzKTtrYT1bXSxsYT1bXSxsYS5wdXNoKHQoZCxhWzBdKSk7Zm9yKHZhciBlPTA7ZTxjLmhhbmRsZXM7ZSsrKWthLnB1c2gobChiLGUpKSx0YVtlXT1lLGxhLnB1c2godChkLGFbZSsxXSkpfWZ1bmN0aW9uIHYoYSl7bShhLGMuY3NzQ2xhc3Nlcy50YXJnZXQpLDA9PT1jLmRpcj9tKGEsYy5jc3NDbGFzc2VzLmx0cik6bShhLGMuY3NzQ2xhc3Nlcy5ydGwpLDA9PT1jLm9ydD9tKGEsYy5jc3NDbGFzc2VzLmhvcml6b250YWwpOm0oYSxjLmNzc0NsYXNzZXMudmVydGljYWwpLGphPWgoYSxjLmNzc0NsYXNzZXMuYmFzZSl9ZnVuY3Rpb24gdyhhLGIpe3JldHVybiEhYy50b29sdGlwc1tiXSYmaChhLmZpcnN0Q2hpbGQsYy5jc3NDbGFzc2VzLnRvb2x0aXApfWZ1bmN0aW9uIHgoKXt2YXIgYT1rYS5tYXAodyk7UShcInVwZGF0ZVwiLGZ1bmN0aW9uKGIsZCxlKXtpZihhW2RdKXt2YXIgZj1iW2RdOyEwIT09Yy50b29sdGlwc1tkXSYmKGY9Yy50b29sdGlwc1tkXS50byhlW2RdKSksYVtkXS5pbm5lckhUTUw9Zn19KX1mdW5jdGlvbiB5KCl7UShcInVwZGF0ZVwiLGZ1bmN0aW9uKGEsYixkLGUsZil7dGEuZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgYj1rYVthXSxlPVUoc2EsYSwwLCEwLCEwLCEwKSxnPVUoc2EsYSwxMDAsITAsITAsITApLGg9ZlthXSxpPWMuYXJpYUZvcm1hdC50byhkW2FdKTtiLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWVtaW5cIixlLnRvRml4ZWQoMSkpLGIuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW1heFwiLGcudG9GaXhlZCgxKSksYi5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbm93XCIsaC50b0ZpeGVkKDEpKSxiLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWV0ZXh0XCIsaSl9KX0pfWZ1bmN0aW9uIHooYSxiLGMpe2lmKFwicmFuZ2VcIj09PWF8fFwic3RlcHNcIj09PWEpcmV0dXJuIHZhLnhWYWw7aWYoXCJjb3VudFwiPT09YSl7aWYoYjwyKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAndmFsdWVzJyAoPj0gMikgcmVxdWlyZWQgZm9yIG1vZGUgJ2NvdW50Jy5cIik7dmFyIGQ9Yi0xLGU9MTAwL2Q7Zm9yKGI9W107ZC0tOyliW2RdPWQqZTtiLnB1c2goMTAwKSxhPVwicG9zaXRpb25zXCJ9cmV0dXJuXCJwb3NpdGlvbnNcIj09PWE/Yi5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIHZhLmZyb21TdGVwcGluZyhjP3ZhLmdldFN0ZXAoYSk6YSl9KTpcInZhbHVlc1wiPT09YT9jP2IubWFwKGZ1bmN0aW9uKGEpe3JldHVybiB2YS5mcm9tU3RlcHBpbmcodmEuZ2V0U3RlcCh2YS50b1N0ZXBwaW5nKGEpKSl9KTpiOnZvaWQgMH1mdW5jdGlvbiBBKGEsYixjKXtmdW5jdGlvbiBkKGEsYil7cmV0dXJuKGErYikudG9GaXhlZCg3KS8xfXZhciBmPXt9LGc9dmEueFZhbFswXSxoPXZhLnhWYWxbdmEueFZhbC5sZW5ndGgtMV0saT0hMSxqPSExLGs9MDtyZXR1cm4gYz1lKGMuc2xpY2UoKS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEtYn0pKSxjWzBdIT09ZyYmKGMudW5zaGlmdChnKSxpPSEwKSxjW2MubGVuZ3RoLTFdIT09aCYmKGMucHVzaChoKSxqPSEwKSxjLmZvckVhY2goZnVuY3Rpb24oZSxnKXt2YXIgaCxsLG0sbixvLHAscSxyLHMsdCx1PWUsdj1jW2crMV07aWYoXCJzdGVwc1wiPT09YiYmKGg9dmEueE51bVN0ZXBzW2ddKSxofHwoaD12LXUpLCExIT09dSYmdm9pZCAwIT09dilmb3IoaD1NYXRoLm1heChoLDFlLTcpLGw9dTtsPD12O2w9ZChsLGgpKXtmb3Iobj12YS50b1N0ZXBwaW5nKGwpLG89bi1rLHI9by9hLHM9TWF0aC5yb3VuZChyKSx0PW8vcyxtPTE7bTw9czttKz0xKXA9ayttKnQsZltwLnRvRml4ZWQoNSldPVtcInhcIiwwXTtxPWMuaW5kZXhPZihsKT4tMT8xOlwic3RlcHNcIj09PWI/MjowLCFnJiZpJiYocT0wKSxsPT09diYmanx8KGZbbi50b0ZpeGVkKDUpXT1bbCxxXSksaz1ufX0pLGZ9ZnVuY3Rpb24gQihhLGIsZCl7ZnVuY3Rpb24gZShhLGIpe3ZhciBkPWI9PT1jLmNzc0NsYXNzZXMudmFsdWUsZT1kP2s6bCxmPWQ/aTpqO3JldHVybiBiK1wiIFwiK2VbYy5vcnRdK1wiIFwiK2ZbYV19ZnVuY3Rpb24gZihhLGYpe2ZbMV09ZlsxXSYmYj9iKGZbMF0sZlsxXSk6ZlsxXTt2YXIgaT1oKGcsITEpO2kuY2xhc3NOYW1lPWUoZlsxXSxjLmNzc0NsYXNzZXMubWFya2VyKSxpLnN0eWxlW2Muc3R5bGVdPWErXCIlXCIsZlsxXSYmKGk9aChnLCExKSxpLmNsYXNzTmFtZT1lKGZbMV0sYy5jc3NDbGFzc2VzLnZhbHVlKSxpLnNldEF0dHJpYnV0ZShcImRhdGEtdmFsdWVcIixmWzBdKSxpLnN0eWxlW2Muc3R5bGVdPWErXCIlXCIsaS5pbm5lclRleHQ9ZC50byhmWzBdKSl9dmFyIGc9eWEuY3JlYXRlRWxlbWVudChcImRpdlwiKSxpPVtjLmNzc0NsYXNzZXMudmFsdWVOb3JtYWwsYy5jc3NDbGFzc2VzLnZhbHVlTGFyZ2UsYy5jc3NDbGFzc2VzLnZhbHVlU3ViXSxqPVtjLmNzc0NsYXNzZXMubWFya2VyTm9ybWFsLGMuY3NzQ2xhc3Nlcy5tYXJrZXJMYXJnZSxjLmNzc0NsYXNzZXMubWFya2VyU3ViXSxrPVtjLmNzc0NsYXNzZXMudmFsdWVIb3Jpem9udGFsLGMuY3NzQ2xhc3Nlcy52YWx1ZVZlcnRpY2FsXSxsPVtjLmNzc0NsYXNzZXMubWFya2VySG9yaXpvbnRhbCxjLmNzc0NsYXNzZXMubWFya2VyVmVydGljYWxdO3JldHVybiBtKGcsYy5jc3NDbGFzc2VzLnBpcHMpLG0oZywwPT09Yy5vcnQ/Yy5jc3NDbGFzc2VzLnBpcHNIb3Jpem9udGFsOmMuY3NzQ2xhc3Nlcy5waXBzVmVydGljYWwpLE9iamVjdC5rZXlzKGEpLmZvckVhY2goZnVuY3Rpb24oYil7ZihiLGFbYl0pfSksZ31mdW5jdGlvbiBDKCl7bmEmJihiKG5hKSxuYT1udWxsKX1mdW5jdGlvbiBEKGEpe0MoKTt2YXIgYj1hLm1vZGUsYz1hLmRlbnNpdHl8fDEsZD1hLmZpbHRlcnx8ITEsZT1hLnZhbHVlc3x8ITEsZj1hLnN0ZXBwZWR8fCExLGc9eihiLGUsZiksaD1BKGMsYixnKSxpPWEuZm9ybWF0fHx7dG86TWF0aC5yb3VuZH07cmV0dXJuIG5hPXJhLmFwcGVuZENoaWxkKEIoaCxkLGkpKX1mdW5jdGlvbiBFKCl7dmFyIGE9amEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksYj1cIm9mZnNldFwiK1tcIldpZHRoXCIsXCJIZWlnaHRcIl1bYy5vcnRdO3JldHVybiAwPT09Yy5vcnQ/YS53aWR0aHx8amFbYl06YS5oZWlnaHR8fGphW2JdfWZ1bmN0aW9uIEYoYSxiLGQsZSl7dmFyIGY9ZnVuY3Rpb24oZil7cmV0dXJuISEoZj1HKGYsZS5wYWdlT2Zmc2V0LGUudGFyZ2V0fHxiKSkmJighKHJhLmhhc0F0dHJpYnV0ZShcImRpc2FibGVkXCIpJiYhZS5kb05vdFJlamVjdCkmJighKG8ocmEsYy5jc3NDbGFzc2VzLnRhcCkmJiFlLmRvTm90UmVqZWN0KSYmKCEoYT09PW9hLnN0YXJ0JiZ2b2lkIDAhPT1mLmJ1dHRvbnMmJmYuYnV0dG9ucz4xKSYmKCghZS5ob3Zlcnx8IWYuYnV0dG9ucykmJihxYXx8Zi5wcmV2ZW50RGVmYXVsdCgpLGYuY2FsY1BvaW50PWYucG9pbnRzW2Mub3J0XSx2b2lkIGQoZixlKSkpKSkpfSxnPVtdO3JldHVybiBhLnNwbGl0KFwiIFwiKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2IuYWRkRXZlbnRMaXN0ZW5lcihhLGYsISFxYSYme3Bhc3NpdmU6ITB9KSxnLnB1c2goW2EsZl0pfSksZ31mdW5jdGlvbiBHKGEsYixjKXt2YXIgZCxlLGY9MD09PWEudHlwZS5pbmRleE9mKFwidG91Y2hcIiksZz0wPT09YS50eXBlLmluZGV4T2YoXCJtb3VzZVwiKSxoPTA9PT1hLnR5cGUuaW5kZXhPZihcInBvaW50ZXJcIik7aWYoMD09PWEudHlwZS5pbmRleE9mKFwiTVNQb2ludGVyXCIpJiYoaD0hMCksZil7dmFyIGk9ZnVuY3Rpb24oYSl7cmV0dXJuIGEudGFyZ2V0PT09Y3x8Yy5jb250YWlucyhhLnRhcmdldCl9O2lmKFwidG91Y2hzdGFydFwiPT09YS50eXBlKXt2YXIgaj1BcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoYS50b3VjaGVzLGkpO2lmKGoubGVuZ3RoPjEpcmV0dXJuITE7ZD1qWzBdLnBhZ2VYLGU9alswXS5wYWdlWX1lbHNle3ZhciBrPUFycmF5LnByb3RvdHlwZS5maW5kLmNhbGwoYS5jaGFuZ2VkVG91Y2hlcyxpKTtpZighaylyZXR1cm4hMTtkPWsucGFnZVgsZT1rLnBhZ2VZfX1yZXR1cm4gYj1ifHxwKHlhKSwoZ3x8aCkmJihkPWEuY2xpZW50WCtiLngsZT1hLmNsaWVudFkrYi55KSxhLnBhZ2VPZmZzZXQ9YixhLnBvaW50cz1bZCxlXSxhLmN1cnNvcj1nfHxoLGF9ZnVuY3Rpb24gSChhKXt2YXIgYj1hLWcoamEsYy5vcnQpLGQ9MTAwKmIvRSgpO3JldHVybiBkPWooZCksYy5kaXI/MTAwLWQ6ZH1mdW5jdGlvbiBJKGEpe3ZhciBiPTEwMCxjPSExO3JldHVybiBrYS5mb3JFYWNoKGZ1bmN0aW9uKGQsZSl7aWYoIWQuaGFzQXR0cmlidXRlKFwiZGlzYWJsZWRcIikpe3ZhciBmPU1hdGguYWJzKHNhW2VdLWEpOyhmPGJ8fDEwMD09PWYmJjEwMD09PWIpJiYoYz1lLGI9Zil9fSksY31mdW5jdGlvbiBKKGEsYil7XCJtb3VzZW91dFwiPT09YS50eXBlJiZcIkhUTUxcIj09PWEudGFyZ2V0Lm5vZGVOYW1lJiZudWxsPT09YS5yZWxhdGVkVGFyZ2V0JiZMKGEsYil9ZnVuY3Rpb24gSyhhLGIpe2lmKC0xPT09bmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIk1TSUUgOVwiKSYmMD09PWEuYnV0dG9ucyYmMCE9PWIuYnV0dG9uc1Byb3BlcnR5KXJldHVybiBMKGEsYik7dmFyIGQ9KGMuZGlyPy0xOjEpKihhLmNhbGNQb2ludC1iLnN0YXJ0Q2FsY1BvaW50KTtXKGQ+MCwxMDAqZC9iLmJhc2VTaXplLGIubG9jYXRpb25zLGIuaGFuZGxlTnVtYmVycyl9ZnVuY3Rpb24gTChhLGIpe2IuaGFuZGxlJiYobihiLmhhbmRsZSxjLmNzc0NsYXNzZXMuYWN0aXZlKSx1YS09MSksYi5saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihhKXt6YS5yZW1vdmVFdmVudExpc3RlbmVyKGFbMF0sYVsxXSl9KSwwPT09dWEmJihuKHJhLGMuY3NzQ2xhc3Nlcy5kcmFnKSxfKCksYS5jdXJzb3ImJihBYS5zdHlsZS5jdXJzb3I9XCJcIixBYS5yZW1vdmVFdmVudExpc3RlbmVyKFwic2VsZWN0c3RhcnRcIixkKSkpLGIuaGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uKGEpe1MoXCJjaGFuZ2VcIixhKSxTKFwic2V0XCIsYSksUyhcImVuZFwiLGEpfSl9ZnVuY3Rpb24gTShhLGIpe3ZhciBlO2lmKDE9PT1iLmhhbmRsZU51bWJlcnMubGVuZ3RoKXt2YXIgZj1rYVtiLmhhbmRsZU51bWJlcnNbMF1dO2lmKGYuaGFzQXR0cmlidXRlKFwiZGlzYWJsZWRcIikpcmV0dXJuITE7ZT1mLmNoaWxkcmVuWzBdLHVhKz0xLG0oZSxjLmNzc0NsYXNzZXMuYWN0aXZlKX1hLnN0b3BQcm9wYWdhdGlvbigpO3ZhciBnPVtdLGg9RihvYS5tb3ZlLHphLEsse3RhcmdldDphLnRhcmdldCxoYW5kbGU6ZSxsaXN0ZW5lcnM6ZyxzdGFydENhbGNQb2ludDphLmNhbGNQb2ludCxiYXNlU2l6ZTpFKCkscGFnZU9mZnNldDphLnBhZ2VPZmZzZXQsaGFuZGxlTnVtYmVyczpiLmhhbmRsZU51bWJlcnMsYnV0dG9uc1Byb3BlcnR5OmEuYnV0dG9ucyxsb2NhdGlvbnM6c2Euc2xpY2UoKX0pLGk9RihvYS5lbmQsemEsTCx7dGFyZ2V0OmEudGFyZ2V0LGhhbmRsZTplLGxpc3RlbmVyczpnLGRvTm90UmVqZWN0OiEwLGhhbmRsZU51bWJlcnM6Yi5oYW5kbGVOdW1iZXJzfSksaj1GKFwibW91c2VvdXRcIix6YSxKLHt0YXJnZXQ6YS50YXJnZXQsaGFuZGxlOmUsbGlzdGVuZXJzOmcsZG9Ob3RSZWplY3Q6ITAsaGFuZGxlTnVtYmVyczpiLmhhbmRsZU51bWJlcnN9KTtnLnB1c2guYXBwbHkoZyxoLmNvbmNhdChpLGopKSxhLmN1cnNvciYmKEFhLnN0eWxlLmN1cnNvcj1nZXRDb21wdXRlZFN0eWxlKGEudGFyZ2V0KS5jdXJzb3Isa2EubGVuZ3RoPjEmJm0ocmEsYy5jc3NDbGFzc2VzLmRyYWcpLEFhLmFkZEV2ZW50TGlzdGVuZXIoXCJzZWxlY3RzdGFydFwiLGQsITEpKSxiLmhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbihhKXtTKFwic3RhcnRcIixhKX0pfWZ1bmN0aW9uIE4oYSl7YS5zdG9wUHJvcGFnYXRpb24oKTt2YXIgYj1IKGEuY2FsY1BvaW50KSxkPUkoYik7aWYoITE9PT1kKXJldHVybiExO2MuZXZlbnRzLnNuYXB8fGkocmEsYy5jc3NDbGFzc2VzLnRhcCxjLmFuaW1hdGlvbkR1cmF0aW9uKSxhYShkLGIsITAsITApLF8oKSxTKFwic2xpZGVcIixkLCEwKSxTKFwidXBkYXRlXCIsZCwhMCksUyhcImNoYW5nZVwiLGQsITApLFMoXCJzZXRcIixkLCEwKSxjLmV2ZW50cy5zbmFwJiZNKGEse2hhbmRsZU51bWJlcnM6W2RdfSl9ZnVuY3Rpb24gTyhhKXt2YXIgYj1IKGEuY2FsY1BvaW50KSxjPXZhLmdldFN0ZXAoYiksZD12YS5mcm9tU3RlcHBpbmcoYyk7T2JqZWN0LmtleXMoeGEpLmZvckVhY2goZnVuY3Rpb24oYSl7XCJob3ZlclwiPT09YS5zcGxpdChcIi5cIilbMF0mJnhhW2FdLmZvckVhY2goZnVuY3Rpb24oYSl7YS5jYWxsKG1hLGQpfSl9KX1mdW5jdGlvbiBQKGEpe2EuZml4ZWR8fGthLmZvckVhY2goZnVuY3Rpb24oYSxiKXtGKG9hLnN0YXJ0LGEuY2hpbGRyZW5bMF0sTSx7aGFuZGxlTnVtYmVyczpbYl19KX0pLGEudGFwJiZGKG9hLnN0YXJ0LGphLE4se30pLGEuaG92ZXImJkYob2EubW92ZSxqYSxPLHtob3ZlcjohMH0pLGEuZHJhZyYmbGEuZm9yRWFjaChmdW5jdGlvbihiLGQpe2lmKCExIT09YiYmMCE9PWQmJmQhPT1sYS5sZW5ndGgtMSl7dmFyIGU9a2FbZC0xXSxmPWthW2RdLGc9W2JdO20oYixjLmNzc0NsYXNzZXMuZHJhZ2dhYmxlKSxhLmZpeGVkJiYoZy5wdXNoKGUuY2hpbGRyZW5bMF0pLGcucHVzaChmLmNoaWxkcmVuWzBdKSksZy5mb3JFYWNoKGZ1bmN0aW9uKGEpe0Yob2Euc3RhcnQsYSxNLHtoYW5kbGVzOltlLGZdLGhhbmRsZU51bWJlcnM6W2QtMSxkXX0pfSl9fSl9ZnVuY3Rpb24gUShhLGIpe3hhW2FdPXhhW2FdfHxbXSx4YVthXS5wdXNoKGIpLFwidXBkYXRlXCI9PT1hLnNwbGl0KFwiLlwiKVswXSYma2EuZm9yRWFjaChmdW5jdGlvbihhLGIpe1MoXCJ1cGRhdGVcIixiKX0pfWZ1bmN0aW9uIFIoYSl7dmFyIGI9YSYmYS5zcGxpdChcIi5cIilbMF0sYz1iJiZhLnN1YnN0cmluZyhiLmxlbmd0aCk7T2JqZWN0LmtleXMoeGEpLmZvckVhY2goZnVuY3Rpb24oYSl7dmFyIGQ9YS5zcGxpdChcIi5cIilbMF0sZT1hLnN1YnN0cmluZyhkLmxlbmd0aCk7YiYmYiE9PWR8fGMmJmMhPT1lfHxkZWxldGUgeGFbYV19KX1mdW5jdGlvbiBTKGEsYixkKXtPYmplY3Qua2V5cyh4YSkuZm9yRWFjaChmdW5jdGlvbihlKXt2YXIgZj1lLnNwbGl0KFwiLlwiKVswXTthPT09ZiYmeGFbZV0uZm9yRWFjaChmdW5jdGlvbihhKXthLmNhbGwobWEsd2EubWFwKGMuZm9ybWF0LnRvKSxiLHdhLnNsaWNlKCksZHx8ITEsc2Euc2xpY2UoKSl9KX0pfWZ1bmN0aW9uIFQoYSl7cmV0dXJuIGErXCIlXCJ9ZnVuY3Rpb24gVShhLGIsZCxlLGYsZyl7cmV0dXJuIGthLmxlbmd0aD4xJiYoZSYmYj4wJiYoZD1NYXRoLm1heChkLGFbYi0xXStjLm1hcmdpbikpLGYmJmI8a2EubGVuZ3RoLTEmJihkPU1hdGgubWluKGQsYVtiKzFdLWMubWFyZ2luKSkpLGthLmxlbmd0aD4xJiZjLmxpbWl0JiYoZSYmYj4wJiYoZD1NYXRoLm1pbihkLGFbYi0xXStjLmxpbWl0KSksZiYmYjxrYS5sZW5ndGgtMSYmKGQ9TWF0aC5tYXgoZCxhW2IrMV0tYy5saW1pdCkpKSxjLnBhZGRpbmcmJigwPT09YiYmKGQ9TWF0aC5tYXgoZCxjLnBhZGRpbmdbMF0pKSxiPT09a2EubGVuZ3RoLTEmJihkPU1hdGgubWluKGQsMTAwLWMucGFkZGluZ1sxXSkpKSxkPXZhLmdldFN0ZXAoZCksISgoZD1qKGQpKT09PWFbYl0mJiFnKSYmZH1mdW5jdGlvbiBWKGEsYil7dmFyIGQ9Yy5vcnQ7cmV0dXJuKGQ/YjphKStcIiwgXCIrKGQ/YTpiKX1mdW5jdGlvbiBXKGEsYixjLGQpe3ZhciBlPWMuc2xpY2UoKSxmPVshYSxhXSxnPVthLCFhXTtkPWQuc2xpY2UoKSxhJiZkLnJldmVyc2UoKSxkLmxlbmd0aD4xP2QuZm9yRWFjaChmdW5jdGlvbihhLGMpe3ZhciBkPVUoZSxhLGVbYV0rYixmW2NdLGdbY10sITEpOyExPT09ZD9iPTA6KGI9ZC1lW2FdLGVbYV09ZCl9KTpmPWc9WyEwXTt2YXIgaD0hMTtkLmZvckVhY2goZnVuY3Rpb24oYSxkKXtoPWFhKGEsY1thXStiLGZbZF0sZ1tkXSl8fGh9KSxoJiZkLmZvckVhY2goZnVuY3Rpb24oYSl7UyhcInVwZGF0ZVwiLGEpLFMoXCJzbGlkZVwiLGEpfSl9ZnVuY3Rpb24gWShhLGIpe3JldHVybiBjLmRpcj8xMDAtYS1iOmF9ZnVuY3Rpb24gWihhLGIpe3NhW2FdPWIsd2FbYV09dmEuZnJvbVN0ZXBwaW5nKGIpO3ZhciBkPVwidHJhbnNsYXRlKFwiK1YoVChZKGIsMCktQmEpLFwiMFwiKStcIilcIjtrYVthXS5zdHlsZVtjLnRyYW5zZm9ybVJ1bGVdPWQsYmEoYSksYmEoYSsxKX1mdW5jdGlvbiBfKCl7dGEuZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgYj1zYVthXT41MD8tMToxLGM9Mysoa2EubGVuZ3RoK2IqYSk7a2FbYV0uc3R5bGUuekluZGV4PWN9KX1mdW5jdGlvbiBhYShhLGIsYyxkKXtyZXR1cm4hMSE9PShiPVUoc2EsYSxiLGMsZCwhMSkpJiYoWihhLGIpLCEwKX1mdW5jdGlvbiBiYShhKXtpZihsYVthXSl7dmFyIGI9MCxkPTEwMDswIT09YSYmKGI9c2FbYS0xXSksYSE9PWxhLmxlbmd0aC0xJiYoZD1zYVthXSk7dmFyIGU9ZC1iLGY9XCJ0cmFuc2xhdGUoXCIrVihUKFkoYixlKSksXCIwXCIpK1wiKVwiLGc9XCJzY2FsZShcIitWKGUvMTAwLFwiMVwiKStcIilcIjtsYVthXS5zdHlsZVtjLnRyYW5zZm9ybVJ1bGVdPWYrXCIgXCIrZ319ZnVuY3Rpb24gY2EoYSxiKXtyZXR1cm4gbnVsbD09PWF8fCExPT09YXx8dm9pZCAwPT09YT9zYVtiXTooXCJudW1iZXJcIj09dHlwZW9mIGEmJihhPVN0cmluZyhhKSksYT1jLmZvcm1hdC5mcm9tKGEpLGE9dmEudG9TdGVwcGluZyhhKSwhMT09PWF8fGlzTmFOKGEpP3NhW2JdOmEpfWZ1bmN0aW9uIGRhKGEsYil7dmFyIGQ9ayhhKSxlPXZvaWQgMD09PXNhWzBdO2I9dm9pZCAwPT09Ynx8ISFiLGMuYW5pbWF0ZSYmIWUmJmkocmEsYy5jc3NDbGFzc2VzLnRhcCxjLmFuaW1hdGlvbkR1cmF0aW9uKSx0YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2FhKGEsY2EoZFthXSxhKSwhMCwhMSl9KSx0YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2FhKGEsc2FbYV0sITAsITApfSksXygpLHRhLmZvckVhY2goZnVuY3Rpb24oYSl7UyhcInVwZGF0ZVwiLGEpLG51bGwhPT1kW2FdJiZiJiZTKFwic2V0XCIsYSl9KX1mdW5jdGlvbiBlYShhKXtkYShjLnN0YXJ0LGEpfWZ1bmN0aW9uIGZhKCl7dmFyIGE9d2EubWFwKGMuZm9ybWF0LnRvKTtyZXR1cm4gMT09PWEubGVuZ3RoP2FbMF06YX1mdW5jdGlvbiBnYSgpe2Zvcih2YXIgYSBpbiBjLmNzc0NsYXNzZXMpYy5jc3NDbGFzc2VzLmhhc093blByb3BlcnR5KGEpJiZuKHJhLGMuY3NzQ2xhc3Nlc1thXSk7Zm9yKDtyYS5maXJzdENoaWxkOylyYS5yZW1vdmVDaGlsZChyYS5maXJzdENoaWxkKTtkZWxldGUgcmEubm9VaVNsaWRlcn1mdW5jdGlvbiBoYSgpe3JldHVybiBzYS5tYXAoZnVuY3Rpb24oYSxiKXt2YXIgYz12YS5nZXROZWFyYnlTdGVwcyhhKSxkPXdhW2JdLGU9Yy50aGlzU3RlcC5zdGVwLGY9bnVsbDshMSE9PWUmJmQrZT5jLnN0ZXBBZnRlci5zdGFydFZhbHVlJiYoZT1jLnN0ZXBBZnRlci5zdGFydFZhbHVlLWQpLGY9ZD5jLnRoaXNTdGVwLnN0YXJ0VmFsdWU/Yy50aGlzU3RlcC5zdGVwOiExIT09Yy5zdGVwQmVmb3JlLnN0ZXAmJmQtYy5zdGVwQmVmb3JlLmhpZ2hlc3RTdGVwLDEwMD09PWE/ZT1udWxsOjA9PT1hJiYoZj1udWxsKTt2YXIgZz12YS5jb3VudFN0ZXBEZWNpbWFscygpO3JldHVybiBudWxsIT09ZSYmITEhPT1lJiYoZT1OdW1iZXIoZS50b0ZpeGVkKGcpKSksbnVsbCE9PWYmJiExIT09ZiYmKGY9TnVtYmVyKGYudG9GaXhlZChnKSkpLFtmLGVdfSl9ZnVuY3Rpb24gaWEoYSxiKXt2YXIgZD1mYSgpLGU9W1wibWFyZ2luXCIsXCJsaW1pdFwiLFwicGFkZGluZ1wiLFwicmFuZ2VcIixcImFuaW1hdGVcIixcInNuYXBcIixcInN0ZXBcIixcImZvcm1hdFwiXTtlLmZvckVhY2goZnVuY3Rpb24oYil7dm9pZCAwIT09YVtiXSYmKGZbYl09YVtiXSl9KTt2YXIgZz1YKGYpO2UuZm9yRWFjaChmdW5jdGlvbihiKXt2b2lkIDAhPT1hW2JdJiYoY1tiXT1nW2JdKX0pLHZhPWcuc3BlY3RydW0sYy5tYXJnaW49Zy5tYXJnaW4sYy5saW1pdD1nLmxpbWl0LGMucGFkZGluZz1nLnBhZGRpbmcsYy5waXBzJiZEKGMucGlwcyksc2E9W10sZGEoYS5zdGFydHx8ZCxiKX12YXIgamEsa2EsbGEsbWEsbmEsb2E9cSgpLHBhPXMoKSxxYT1wYSYmcigpLHJhPWEsc2E9W10sdGE9W10sdWE9MCx2YT1jLnNwZWN0cnVtLHdhPVtdLHhhPXt9LHlhPWEub3duZXJEb2N1bWVudCx6YT15YS5kb2N1bWVudEVsZW1lbnQsQWE9eWEuYm9keSxCYT1cInJ0bFwiPT09eWEuZGlyfHwxPT09Yy5vcnQ/MDoxMDA7cmV0dXJuIHYocmEpLHUoYy5jb25uZWN0LGphKSxQKGMuZXZlbnRzKSxkYShjLnN0YXJ0KSxtYT17ZGVzdHJveTpnYSxzdGVwczpoYSxvbjpRLG9mZjpSLGdldDpmYSxzZXQ6ZGEscmVzZXQ6ZWEsX19tb3ZlSGFuZGxlczpmdW5jdGlvbihhLGIsYyl7VyhhLGIsc2EsYyl9LG9wdGlvbnM6Zix1cGRhdGVPcHRpb25zOmlhLHRhcmdldDpyYSxyZW1vdmVQaXBzOkMscGlwczpEfSxjLnBpcHMmJkQoYy5waXBzKSxjLnRvb2x0aXBzJiZ4KCkseSgpLG1hfWZ1bmN0aW9uIFooYSxiKXtpZighYXx8IWEubm9kZU5hbWUpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6IGNyZWF0ZSByZXF1aXJlcyBhIHNpbmdsZSBlbGVtZW50LCBnb3Q6IFwiK2EpO2lmKGEubm9VaVNsaWRlcil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogU2xpZGVyIHdhcyBhbHJlYWR5IGluaXRpYWxpemVkLlwiKTt2YXIgYz1YKGIsYSksZD1ZKGEsYyxiKTtyZXR1cm4gYS5ub1VpU2xpZGVyPWQsZH12YXIgJD1cIjExLjEuMFwiO0QucHJvdG90eXBlLmdldE1hcmdpbj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLnhOdW1TdGVwc1swXTtpZihiJiZhL2IlMSE9MCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2xpbWl0JywgJ21hcmdpbicgYW5kICdwYWRkaW5nJyBtdXN0IGJlIGRpdmlzaWJsZSBieSBzdGVwLlwiKTtyZXR1cm4gMj09PXRoaXMueFBjdC5sZW5ndGgmJnUodGhpcy54VmFsLGEpfSxELnByb3RvdHlwZS50b1N0ZXBwaW5nPWZ1bmN0aW9uKGEpe3JldHVybiBhPXkodGhpcy54VmFsLHRoaXMueFBjdCxhKX0sRC5wcm90b3R5cGUuZnJvbVN0ZXBwaW5nPWZ1bmN0aW9uKGEpe3JldHVybiB6KHRoaXMueFZhbCx0aGlzLnhQY3QsYSl9LEQucHJvdG90eXBlLmdldFN0ZXA9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9QSh0aGlzLnhQY3QsdGhpcy54U3RlcHMsdGhpcy5zbmFwLGEpfSxELnByb3RvdHlwZS5nZXROZWFyYnlTdGVwcz1mdW5jdGlvbihhKXt2YXIgYj14KGEsdGhpcy54UGN0KTtyZXR1cm57c3RlcEJlZm9yZTp7c3RhcnRWYWx1ZTp0aGlzLnhWYWxbYi0yXSxzdGVwOnRoaXMueE51bVN0ZXBzW2ItMl0saGlnaGVzdFN0ZXA6dGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtiLTJdfSx0aGlzU3RlcDp7c3RhcnRWYWx1ZTp0aGlzLnhWYWxbYi0xXSxzdGVwOnRoaXMueE51bVN0ZXBzW2ItMV0saGlnaGVzdFN0ZXA6dGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtiLTFdfSxzdGVwQWZ0ZXI6e3N0YXJ0VmFsdWU6dGhpcy54VmFsW2ItMF0sc3RlcDp0aGlzLnhOdW1TdGVwc1tiLTBdLGhpZ2hlc3RTdGVwOnRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXBbYi0wXX19fSxELnByb3RvdHlwZS5jb3VudFN0ZXBEZWNpbWFscz1mdW5jdGlvbigpe3ZhciBhPXRoaXMueE51bVN0ZXBzLm1hcChsKTtyZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCxhKX0sRC5wcm90b3R5cGUuY29udmVydD1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5nZXRTdGVwKHRoaXMudG9TdGVwcGluZyhhKSl9O3ZhciBfPXt0bzpmdW5jdGlvbihhKXtyZXR1cm4gdm9pZCAwIT09YSYmYS50b0ZpeGVkKDIpfSxmcm9tOk51bWJlcn07cmV0dXJue3ZlcnNpb246JCxjcmVhdGU6Wn19KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpIHtcclxuXHJcbiAgICBpZiAoIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcclxuXHJcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxyXG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XHJcblxyXG4gICAgfSBlbHNlIGlmICggdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICkge1xyXG5cclxuICAgICAgICAvLyBOb2RlL0NvbW1vbkpTXHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzXHJcbiAgICAgICAgd2luZG93LndOdW1iID0gZmFjdG9yeSgpO1xyXG4gICAgfVxyXG5cclxufShmdW5jdGlvbigpe1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG52YXIgRm9ybWF0T3B0aW9ucyA9IFtcclxuXHQnZGVjaW1hbHMnLFxyXG5cdCd0aG91c2FuZCcsXHJcblx0J21hcmsnLFxyXG5cdCdwcmVmaXgnLFxyXG5cdCdzdWZmaXgnLFxyXG5cdCdlbmNvZGVyJyxcclxuXHQnZGVjb2RlcicsXHJcblx0J25lZ2F0aXZlQmVmb3JlJyxcclxuXHQnbmVnYXRpdmUnLFxyXG5cdCdlZGl0JyxcclxuXHQndW5kbydcclxuXTtcclxuXHJcbi8vIEdlbmVyYWxcclxuXHJcblx0Ly8gUmV2ZXJzZSBhIHN0cmluZ1xyXG5cdGZ1bmN0aW9uIHN0clJldmVyc2UgKCBhICkge1xyXG5cdFx0cmV0dXJuIGEuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKTtcclxuXHR9XHJcblxyXG5cdC8vIENoZWNrIGlmIGEgc3RyaW5nIHN0YXJ0cyB3aXRoIGEgc3BlY2lmaWVkIHByZWZpeC5cclxuXHRmdW5jdGlvbiBzdHJTdGFydHNXaXRoICggaW5wdXQsIG1hdGNoICkge1xyXG5cdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCBtYXRjaC5sZW5ndGgpID09PSBtYXRjaDtcclxuXHR9XHJcblxyXG5cdC8vIENoZWNrIGlzIGEgc3RyaW5nIGVuZHMgaW4gYSBzcGVjaWZpZWQgc3VmZml4LlxyXG5cdGZ1bmN0aW9uIHN0ckVuZHNXaXRoICggaW5wdXQsIG1hdGNoICkge1xyXG5cdFx0cmV0dXJuIGlucHV0LnNsaWNlKC0xICogbWF0Y2gubGVuZ3RoKSA9PT0gbWF0Y2g7XHJcblx0fVxyXG5cclxuXHQvLyBUaHJvdyBhbiBlcnJvciBpZiBmb3JtYXR0aW5nIG9wdGlvbnMgYXJlIGluY29tcGF0aWJsZS5cclxuXHRmdW5jdGlvbiB0aHJvd0VxdWFsRXJyb3IoIEYsIGEsIGIgKSB7XHJcblx0XHRpZiAoIChGW2FdIHx8IEZbYl0pICYmIChGW2FdID09PSBGW2JdKSApIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gQ2hlY2sgaWYgYSBudW1iZXIgaXMgZmluaXRlIGFuZCBub3QgTmFOXHJcblx0ZnVuY3Rpb24gaXNWYWxpZE51bWJlciAoIGlucHV0ICkge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUoIGlucHV0ICk7XHJcblx0fVxyXG5cclxuXHQvLyBQcm92aWRlIHJvdW5kaW5nLWFjY3VyYXRlIHRvRml4ZWQgbWV0aG9kLlxyXG5cdC8vIEJvcnJvd2VkOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTMyMzMzMC83NzUyNjVcclxuXHRmdW5jdGlvbiB0b0ZpeGVkICggdmFsdWUsIGV4cCApIHtcclxuXHRcdHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKS5zcGxpdCgnZScpO1xyXG5cdFx0dmFsdWUgPSBNYXRoLnJvdW5kKCsodmFsdWVbMF0gKyAnZScgKyAodmFsdWVbMV0gPyAoK3ZhbHVlWzFdICsgZXhwKSA6IGV4cCkpKTtcclxuXHRcdHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKS5zcGxpdCgnZScpO1xyXG5cdFx0cmV0dXJuICgrKHZhbHVlWzBdICsgJ2UnICsgKHZhbHVlWzFdID8gKCt2YWx1ZVsxXSAtIGV4cCkgOiAtZXhwKSkpLnRvRml4ZWQoZXhwKTtcclxuXHR9XHJcblxyXG5cclxuLy8gRm9ybWF0dGluZ1xyXG5cclxuXHQvLyBBY2NlcHQgYSBudW1iZXIgYXMgaW5wdXQsIG91dHB1dCBmb3JtYXR0ZWQgc3RyaW5nLlxyXG5cdGZ1bmN0aW9uIGZvcm1hdFRvICggZGVjaW1hbHMsIHRob3VzYW5kLCBtYXJrLCBwcmVmaXgsIHN1ZmZpeCwgZW5jb2RlciwgZGVjb2RlciwgbmVnYXRpdmVCZWZvcmUsIG5lZ2F0aXZlLCBlZGl0LCB1bmRvLCBpbnB1dCApIHtcclxuXHJcblx0XHR2YXIgb3JpZ2luYWxJbnB1dCA9IGlucHV0LCBpbnB1dElzTmVnYXRpdmUsIGlucHV0UGllY2VzLCBpbnB1dEJhc2UsIGlucHV0RGVjaW1hbHMgPSAnJywgb3V0cHV0ID0gJyc7XHJcblxyXG5cdFx0Ly8gQXBwbHkgdXNlciBlbmNvZGVyIHRvIHRoZSBpbnB1dC5cclxuXHRcdC8vIEV4cGVjdGVkIG91dGNvbWU6IG51bWJlci5cclxuXHRcdGlmICggZW5jb2RlciApIHtcclxuXHRcdFx0aW5wdXQgPSBlbmNvZGVyKGlucHV0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTdG9wIGlmIG5vIHZhbGlkIG51bWJlciB3YXMgcHJvdmlkZWQsIHRoZSBudW1iZXIgaXMgaW5maW5pdGUgb3IgTmFOLlxyXG5cdFx0aWYgKCAhaXNWYWxpZE51bWJlcihpbnB1dCkgKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSb3VuZGluZyBhd2F5IGRlY2ltYWxzIG1pZ2h0IGNhdXNlIGEgdmFsdWUgb2YgLTBcclxuXHRcdC8vIHdoZW4gdXNpbmcgdmVyeSBzbWFsbCByYW5nZXMuIFJlbW92ZSB0aG9zZSBjYXNlcy5cclxuXHRcdGlmICggZGVjaW1hbHMgIT09IGZhbHNlICYmIHBhcnNlRmxvYXQoaW5wdXQudG9GaXhlZChkZWNpbWFscykpID09PSAwICkge1xyXG5cdFx0XHRpbnB1dCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRm9ybWF0dGluZyBpcyBkb25lIG9uIGFic29sdXRlIG51bWJlcnMsXHJcblx0XHQvLyBkZWNvcmF0ZWQgYnkgYW4gb3B0aW9uYWwgbmVnYXRpdmUgc3ltYm9sLlxyXG5cdFx0aWYgKCBpbnB1dCA8IDAgKSB7XHJcblx0XHRcdGlucHV0SXNOZWdhdGl2ZSA9IHRydWU7XHJcblx0XHRcdGlucHV0ID0gTWF0aC5hYnMoaW5wdXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlZHVjZSB0aGUgbnVtYmVyIG9mIGRlY2ltYWxzIHRvIHRoZSBzcGVjaWZpZWQgb3B0aW9uLlxyXG5cdFx0aWYgKCBkZWNpbWFscyAhPT0gZmFsc2UgKSB7XHJcblx0XHRcdGlucHV0ID0gdG9GaXhlZCggaW5wdXQsIGRlY2ltYWxzICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVHJhbnNmb3JtIHRoZSBudW1iZXIgaW50byBhIHN0cmluZywgc28gaXQgY2FuIGJlIHNwbGl0LlxyXG5cdFx0aW5wdXQgPSBpbnB1dC50b1N0cmluZygpO1xyXG5cclxuXHRcdC8vIEJyZWFrIHRoZSBudW1iZXIgb24gdGhlIGRlY2ltYWwgc2VwYXJhdG9yLlxyXG5cdFx0aWYgKCBpbnB1dC5pbmRleE9mKCcuJykgIT09IC0xICkge1xyXG5cdFx0XHRpbnB1dFBpZWNlcyA9IGlucHV0LnNwbGl0KCcuJyk7XHJcblxyXG5cdFx0XHRpbnB1dEJhc2UgPSBpbnB1dFBpZWNlc1swXTtcclxuXHJcblx0XHRcdGlmICggbWFyayApIHtcclxuXHRcdFx0XHRpbnB1dERlY2ltYWxzID0gbWFyayArIGlucHV0UGllY2VzWzFdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHQvLyBJZiBpdCBpc24ndCBzcGxpdCwgdGhlIGVudGlyZSBudW1iZXIgd2lsbCBkby5cclxuXHRcdFx0aW5wdXRCYXNlID0gaW5wdXQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gR3JvdXAgbnVtYmVycyBpbiBzZXRzIG9mIHRocmVlLlxyXG5cdFx0aWYgKCB0aG91c2FuZCApIHtcclxuXHRcdFx0aW5wdXRCYXNlID0gc3RyUmV2ZXJzZShpbnB1dEJhc2UpLm1hdGNoKC8uezEsM30vZyk7XHJcblx0XHRcdGlucHV0QmFzZSA9IHN0clJldmVyc2UoaW5wdXRCYXNlLmpvaW4oIHN0clJldmVyc2UoIHRob3VzYW5kICkgKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWYgdGhlIG51bWJlciBpcyBuZWdhdGl2ZSwgcHJlZml4IHdpdGggbmVnYXRpb24gc3ltYm9sLlxyXG5cdFx0aWYgKCBpbnB1dElzTmVnYXRpdmUgJiYgbmVnYXRpdmVCZWZvcmUgKSB7XHJcblx0XHRcdG91dHB1dCArPSBuZWdhdGl2ZUJlZm9yZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBQcmVmaXggdGhlIG51bWJlclxyXG5cdFx0aWYgKCBwcmVmaXggKSB7XHJcblx0XHRcdG91dHB1dCArPSBwcmVmaXg7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTm9ybWFsIG5lZ2F0aXZlIG9wdGlvbiBjb21lcyBhZnRlciB0aGUgcHJlZml4LiBEZWZhdWx0cyB0byAnLScuXHJcblx0XHRpZiAoIGlucHV0SXNOZWdhdGl2ZSAmJiBuZWdhdGl2ZSApIHtcclxuXHRcdFx0b3V0cHV0ICs9IG5lZ2F0aXZlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFwcGVuZCB0aGUgYWN0dWFsIG51bWJlci5cclxuXHRcdG91dHB1dCArPSBpbnB1dEJhc2U7XHJcblx0XHRvdXRwdXQgKz0gaW5wdXREZWNpbWFscztcclxuXHJcblx0XHQvLyBBcHBseSB0aGUgc3VmZml4LlxyXG5cdFx0aWYgKCBzdWZmaXggKSB7XHJcblx0XHRcdG91dHB1dCArPSBzdWZmaXg7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUnVuIHRoZSBvdXRwdXQgdGhyb3VnaCBhIHVzZXItc3BlY2lmaWVkIHBvc3QtZm9ybWF0dGVyLlxyXG5cdFx0aWYgKCBlZGl0ICkge1xyXG5cdFx0XHRvdXRwdXQgPSBlZGl0ICggb3V0cHV0LCBvcmlnaW5hbElucHV0ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQWxsIGRvbmUuXHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH1cclxuXHJcblx0Ly8gQWNjZXB0IGEgc3RpbmcgYXMgaW5wdXQsIG91dHB1dCBkZWNvZGVkIG51bWJlci5cclxuXHRmdW5jdGlvbiBmb3JtYXRGcm9tICggZGVjaW1hbHMsIHRob3VzYW5kLCBtYXJrLCBwcmVmaXgsIHN1ZmZpeCwgZW5jb2RlciwgZGVjb2RlciwgbmVnYXRpdmVCZWZvcmUsIG5lZ2F0aXZlLCBlZGl0LCB1bmRvLCBpbnB1dCApIHtcclxuXHJcblx0XHR2YXIgb3JpZ2luYWxJbnB1dCA9IGlucHV0LCBpbnB1dElzTmVnYXRpdmUsIG91dHB1dCA9ICcnO1xyXG5cclxuXHRcdC8vIFVzZXIgZGVmaW5lZCBwcmUtZGVjb2Rlci4gUmVzdWx0IG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nLlxyXG5cdFx0aWYgKCB1bmRvICkge1xyXG5cdFx0XHRpbnB1dCA9IHVuZG8oaW5wdXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRlc3QgdGhlIGlucHV0LiBDYW4ndCBiZSBlbXB0eS5cclxuXHRcdGlmICggIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycgKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBJZiB0aGUgc3RyaW5nIHN0YXJ0cyB3aXRoIHRoZSBuZWdhdGl2ZUJlZm9yZSB2YWx1ZTogcmVtb3ZlIGl0LlxyXG5cdFx0Ly8gUmVtZW1iZXIgaXMgd2FzIHRoZXJlLCB0aGUgbnVtYmVyIGlzIG5lZ2F0aXZlLlxyXG5cdFx0aWYgKCBuZWdhdGl2ZUJlZm9yZSAmJiBzdHJTdGFydHNXaXRoKGlucHV0LCBuZWdhdGl2ZUJlZm9yZSkgKSB7XHJcblx0XHRcdGlucHV0ID0gaW5wdXQucmVwbGFjZShuZWdhdGl2ZUJlZm9yZSwgJycpO1xyXG5cdFx0XHRpbnB1dElzTmVnYXRpdmUgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlcGVhdCB0aGUgc2FtZSBwcm9jZWR1cmUgZm9yIHRoZSBwcmVmaXguXHJcblx0XHRpZiAoIHByZWZpeCAmJiBzdHJTdGFydHNXaXRoKGlucHV0LCBwcmVmaXgpICkge1xyXG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UocHJlZml4LCAnJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQW5kIGFnYWluIGZvciBuZWdhdGl2ZS5cclxuXHRcdGlmICggbmVnYXRpdmUgJiYgc3RyU3RhcnRzV2l0aChpbnB1dCwgbmVnYXRpdmUpICkge1xyXG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UobmVnYXRpdmUsICcnKTtcclxuXHRcdFx0aW5wdXRJc05lZ2F0aXZlID0gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZW1vdmUgdGhlIHN1ZmZpeC5cclxuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1N0cmluZy9zbGljZVxyXG5cdFx0aWYgKCBzdWZmaXggJiYgc3RyRW5kc1dpdGgoaW5wdXQsIHN1ZmZpeCkgKSB7XHJcblx0XHRcdGlucHV0ID0gaW5wdXQuc2xpY2UoMCwgLTEgKiBzdWZmaXgubGVuZ3RoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZW1vdmUgdGhlIHRob3VzYW5kIGdyb3VwaW5nLlxyXG5cdFx0aWYgKCB0aG91c2FuZCApIHtcclxuXHRcdFx0aW5wdXQgPSBpbnB1dC5zcGxpdCh0aG91c2FuZCkuam9pbignJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2V0IHRoZSBkZWNpbWFsIHNlcGFyYXRvciBiYWNrIHRvIHBlcmlvZC5cclxuXHRcdGlmICggbWFyayApIHtcclxuXHRcdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKG1hcmssICcuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUHJlcGVuZCB0aGUgbmVnYXRpdmUgc3ltYm9sLlxyXG5cdFx0aWYgKCBpbnB1dElzTmVnYXRpdmUgKSB7XHJcblx0XHRcdG91dHB1dCArPSAnLSc7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQWRkIHRoZSBudW1iZXJcclxuXHRcdG91dHB1dCArPSBpbnB1dDtcclxuXHJcblx0XHQvLyBUcmltIGFsbCBub24tbnVtZXJpYyBjaGFyYWN0ZXJzIChhbGxvdyAnLicgYW5kICctJyk7XHJcblx0XHRvdXRwdXQgPSBvdXRwdXQucmVwbGFjZSgvW14wLTlcXC5cXC0uXS9nLCAnJyk7XHJcblxyXG5cdFx0Ly8gVGhlIHZhbHVlIGNvbnRhaW5zIG5vIHBhcnNlLWFibGUgbnVtYmVyLlxyXG5cdFx0aWYgKCBvdXRwdXQgPT09ICcnICkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ292ZXJ0IHRvIG51bWJlci5cclxuXHRcdG91dHB1dCA9IE51bWJlcihvdXRwdXQpO1xyXG5cclxuXHRcdC8vIFJ1biB0aGUgdXNlci1zcGVjaWZpZWQgcG9zdC1kZWNvZGVyLlxyXG5cdFx0aWYgKCBkZWNvZGVyICkge1xyXG5cdFx0XHRvdXRwdXQgPSBkZWNvZGVyKG91dHB1dCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ2hlY2sgaXMgdGhlIG91dHB1dCBpcyB2YWxpZCwgb3RoZXJ3aXNlOiByZXR1cm4gZmFsc2UuXHJcblx0XHRpZiAoICFpc1ZhbGlkTnVtYmVyKG91dHB1dCkgKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH1cclxuXHJcblxyXG4vLyBGcmFtZXdvcmtcclxuXHJcblx0Ly8gVmFsaWRhdGUgZm9ybWF0dGluZyBvcHRpb25zXHJcblx0ZnVuY3Rpb24gdmFsaWRhdGUgKCBpbnB1dE9wdGlvbnMgKSB7XHJcblxyXG5cdFx0dmFyIGksIG9wdGlvbk5hbWUsIG9wdGlvblZhbHVlLFxyXG5cdFx0XHRmaWx0ZXJlZE9wdGlvbnMgPSB7fTtcclxuXHJcblx0XHRpZiAoIGlucHV0T3B0aW9uc1snc3VmZml4J10gPT09IHVuZGVmaW5lZCApIHtcclxuXHRcdFx0aW5wdXRPcHRpb25zWydzdWZmaXgnXSA9IGlucHV0T3B0aW9uc1sncG9zdGZpeCddO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAoIGkgPSAwOyBpIDwgRm9ybWF0T3B0aW9ucy5sZW5ndGg7IGkrPTEgKSB7XHJcblxyXG5cdFx0XHRvcHRpb25OYW1lID0gRm9ybWF0T3B0aW9uc1tpXTtcclxuXHRcdFx0b3B0aW9uVmFsdWUgPSBpbnB1dE9wdGlvbnNbb3B0aW9uTmFtZV07XHJcblxyXG5cdFx0XHRpZiAoIG9wdGlvblZhbHVlID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG5cdFx0XHRcdC8vIE9ubHkgZGVmYXVsdCBpZiBuZWdhdGl2ZUJlZm9yZSBpc24ndCBzZXQuXHJcblx0XHRcdFx0aWYgKCBvcHRpb25OYW1lID09PSAnbmVnYXRpdmUnICYmICFmaWx0ZXJlZE9wdGlvbnMubmVnYXRpdmVCZWZvcmUgKSB7XHJcblx0XHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnNbb3B0aW9uTmFtZV0gPSAnLSc7XHJcblx0XHRcdFx0Ly8gRG9uJ3Qgc2V0IGEgZGVmYXVsdCBmb3IgbWFyayB3aGVuICd0aG91c2FuZCcgaXMgc2V0LlxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoIG9wdGlvbk5hbWUgPT09ICdtYXJrJyAmJiBmaWx0ZXJlZE9wdGlvbnMudGhvdXNhbmQgIT09ICcuJyApIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9ICcuJztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gRmxvYXRpbmcgcG9pbnRzIGluIEpTIGFyZSBzdGFibGUgdXAgdG8gNyBkZWNpbWFscy5cclxuXHRcdFx0fSBlbHNlIGlmICggb3B0aW9uTmFtZSA9PT0gJ2RlY2ltYWxzJyApIHtcclxuXHRcdFx0XHRpZiAoIG9wdGlvblZhbHVlID49IDAgJiYgb3B0aW9uVmFsdWUgPCA4ICkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gb3B0aW9uVmFsdWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihvcHRpb25OYW1lKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBUaGVzZSBvcHRpb25zLCB3aGVuIHByb3ZpZGVkLCBtdXN0IGJlIGZ1bmN0aW9ucy5cclxuXHRcdFx0fSBlbHNlIGlmICggb3B0aW9uTmFtZSA9PT0gJ2VuY29kZXInIHx8IG9wdGlvbk5hbWUgPT09ICdkZWNvZGVyJyB8fCBvcHRpb25OYW1lID09PSAnZWRpdCcgfHwgb3B0aW9uTmFtZSA9PT0gJ3VuZG8nICkge1xyXG5cdFx0XHRcdGlmICggdHlwZW9mIG9wdGlvblZhbHVlID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gb3B0aW9uVmFsdWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihvcHRpb25OYW1lKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBPdGhlciBvcHRpb25zIGFyZSBzdHJpbmdzLlxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvcHRpb25WYWx1ZSA9PT0gJ3N0cmluZycgKSB7XHJcblx0XHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnNbb3B0aW9uTmFtZV0gPSBvcHRpb25WYWx1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKG9wdGlvbk5hbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNvbWUgdmFsdWVzIGNhbid0IGJlIGV4dHJhY3RlZCBmcm9tIGFcclxuXHRcdC8vIHN0cmluZyBpZiBjZXJ0YWluIGNvbWJpbmF0aW9ucyBhcmUgcHJlc2VudC5cclxuXHRcdHRocm93RXF1YWxFcnJvcihmaWx0ZXJlZE9wdGlvbnMsICdtYXJrJywgJ3Rob3VzYW5kJyk7XHJcblx0XHR0aHJvd0VxdWFsRXJyb3IoZmlsdGVyZWRPcHRpb25zLCAncHJlZml4JywgJ25lZ2F0aXZlJyk7XHJcblx0XHR0aHJvd0VxdWFsRXJyb3IoZmlsdGVyZWRPcHRpb25zLCAncHJlZml4JywgJ25lZ2F0aXZlQmVmb3JlJyk7XHJcblxyXG5cdFx0cmV0dXJuIGZpbHRlcmVkT3B0aW9ucztcclxuXHR9XHJcblxyXG5cdC8vIFBhc3MgYWxsIG9wdGlvbnMgYXMgZnVuY3Rpb24gYXJndW1lbnRzXHJcblx0ZnVuY3Rpb24gcGFzc0FsbCAoIG9wdGlvbnMsIG1ldGhvZCwgaW5wdXQgKSB7XHJcblx0XHR2YXIgaSwgYXJncyA9IFtdO1xyXG5cclxuXHRcdC8vIEFkZCBhbGwgb3B0aW9ucyBpbiBvcmRlciBvZiBGb3JtYXRPcHRpb25zXHJcblx0XHRmb3IgKCBpID0gMDsgaSA8IEZvcm1hdE9wdGlvbnMubGVuZ3RoOyBpKz0xICkge1xyXG5cdFx0XHRhcmdzLnB1c2gob3B0aW9uc1tGb3JtYXRPcHRpb25zW2ldXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQXBwZW5kIHRoZSBpbnB1dCwgdGhlbiBjYWxsIHRoZSBtZXRob2QsIHByZXNlbnRpbmcgYWxsXHJcblx0XHQvLyBvcHRpb25zIGFzIGFyZ3VtZW50cy5cclxuXHRcdGFyZ3MucHVzaChpbnB1dCk7XHJcblx0XHRyZXR1cm4gbWV0aG9kLmFwcGx5KCcnLCBhcmdzKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHdOdW1iICggb3B0aW9ucyApIHtcclxuXHJcblx0XHRpZiAoICEodGhpcyBpbnN0YW5jZW9mIHdOdW1iKSApIHtcclxuXHRcdFx0cmV0dXJuIG5ldyB3TnVtYiAoIG9wdGlvbnMgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHR5cGVvZiBvcHRpb25zICE9PSBcIm9iamVjdFwiICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0b3B0aW9ucyA9IHZhbGlkYXRlKG9wdGlvbnMpO1xyXG5cclxuXHRcdC8vIENhbGwgJ2Zvcm1hdFRvJyB3aXRoIHByb3BlciBhcmd1bWVudHMuXHJcblx0XHR0aGlzLnRvID0gZnVuY3Rpb24gKCBpbnB1dCApIHtcclxuXHRcdFx0cmV0dXJuIHBhc3NBbGwob3B0aW9ucywgZm9ybWF0VG8sIGlucHV0KTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gQ2FsbCAnZm9ybWF0RnJvbScgd2l0aCBwcm9wZXIgYXJndW1lbnRzLlxyXG5cdFx0dGhpcy5mcm9tID0gZnVuY3Rpb24gKCBpbnB1dCApIHtcclxuXHRcdFx0cmV0dXJuIHBhc3NBbGwob3B0aW9ucywgZm9ybWF0RnJvbSwgaW5wdXQpO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB3TnVtYjtcclxuXHJcbn0pKTtcclxuIl19
