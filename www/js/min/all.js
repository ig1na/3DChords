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
		normals.push(0,1,2);
	}

	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );

	geometry.scale(scale, scale, scale);

	var mesh = new THREE.Mesh(geometry, transparentMaterialFront);

	this.group.add(mesh);
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
	console.log(ptsIndexes);
	ptsIndexes.forEach(index => {
		showOnePoint(index);
	});

	sticks.get(keyFromPtSet([ptsIndexes[0], ptsIndexes[1]])).visible = true;
	sticks.get(keyFromPtSet([ptsIndexes[1], ptsIndexes[2]])).visible = true;
	sticks.get(keyFromPtSet([ptsIndexes[2], ptsIndexes[0]])).visible = true;

	faces.set(keyFromPtSet(ptsIndexes)).visible = true;
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
	showOnePoint(indexes[0]);
	showOnePoint(indexes[1]);
	console.log('sticks', sticks);
	console.log('keyFromPtSet', keyFromPtSet(indexes));
	sticks.get(keyFromPtSet(indexes)).visible = true;
}
let spheres, sticks, faces;

function makeAllMeshes() {
	spheres = new Map();
	sticks = new Map();
	faces = new Map();
	labels = new THREE.Group();
	//creates all point meshes
	allPoints.forEach((point, i) => {
		let sphere = new OnePoint(point, scale);
		sphere.visible = false;
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
}

function keyFromPtSet(array, indexer) {
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
function makeLights() {
	var x = 0;
	var y = 0;
	var z = 0;

	var distance = 30;

	//top lights
	var pointLight = new THREE.PointLight(0xff0000, 1, 100);
	pointLight.position.set(x+distance, y+distance, z+distance);
	mainGroup.add(pointLight);

	/*var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);*/

	var pointLight = new THREE.PointLight(0x00ff00, 1, 100);
	pointLight.position.set(x+distance, y+distance, z-distance);
	mainGroup.add(pointLight);

	/*var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);*/

	var pointLight = new THREE.PointLight(0xffff00, 1, 100);
	pointLight.position.set(x-distance, y+distance, z+distance);
	mainGroup.add(pointLight);

	/*var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);*/

	var pointLight = new THREE.PointLight(0x0000ff, 1, 100);
	pointLight.position.set(x-distance, y+distance, z-distance);
	mainGroup.add(pointLight);

	/*var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);*/


	//bottom lights
	var pointLight = new THREE.PointLight(0x00ffff, 1, 100);
	pointLight.position.set(x+distance, y-distance, z+distance);
	mainGroup.add(pointLight);

	/*var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);*/

	var pointLight = new THREE.PointLight(0xff00ff, 1, 100);
	pointLight.position.set(x+distance, y-distance, z-distance);
	mainGroup.add(pointLight);

	/*var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);
*/
	var pointLight = new THREE.PointLight(0xff8888, 1, 100);
	pointLight.position.set(x-distance, y-distance, z+distance);
	mainGroup.add(pointLight);

	/*var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);*/

	var pointLight = new THREE.PointLight(0x8888ff, 1, 100);
	pointLight.position.set(x-distance, y-distance, z-distance);
	mainGroup.add(pointLight);

	/*var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);*/



	//middle light
	/*var pointLight = new THREE.PointLight(0xffffff, 1, 100);
	pointLight.position.set(x, y, z);
	mainGroup.add(pointLight);

	var helper = new THREE.PointLightHelper(pointLight, 1);
	group.add(helper);*/

}
var transparentMaterialFront = new THREE.MeshLambertMaterial( {
	color: 0xffffff,
	opacity: 0.4,
	transparent: true,
	side: THREE.DoubleSide
} );

var transparentMaterialBack = new THREE.MeshLambertMaterial( {
	color: 0xffffff,
	opacity: 0.4,
	transparent: true
} );

var pointsMaterial = new THREE.PointsMaterial( {
	color: 0x0080ff,
	size: 1,
	alphaTest: 0.5
} );

var RGBMaterial = new THREE.MeshNormalMaterial( {
	color: 0x0088ff
});

var STDMaterial = new THREE.MeshStandardMaterial( {
	color: 0x0088ff,
	opacity: 0.5
});

var flatShapeMaterial = new THREE.MeshPhongMaterial( {
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
	let vertices = [];
	ptsIndexes.forEach(index => {
		vertices.push(allPoints[index].clone());
	});

	let geometry = new THREE.ConvexBufferGeometry(vertices);

	geometry.faces.forEach(face => {
		console.log('face edge', face.getEdge(0).head().point);
		let index1 = allPoints.indexOf(face.getEdge(0).head().point),
			index2 = allPoints.indexOf(face.getEdge(1).head().point),
			index3 = allPoints.indexOf(face.getEdge(2).head().point);
		showThreePoints([index1, index2, index3]);
	});

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
		if(chordsMap.has(i)) {
			let length = chordsMap.get(i).length;
			console.log(chordsMap.get(i));
			if(length === 1) {
				showOnePoint(chordsMap.get(i)[0]);
			} else if(length === 2) {
				showTwoPoints(chordsMap.get(i));

			} else if(length === 3) {
				showThreePoints(chordsMap.get(i));
			} else {
				showPolyhedron(chordsMap.get(i));
			}
		}
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

	---     Usage Methods 	   ---
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
		formatType: 0|1|2, 					// Midi format type
		timeDivision: (int),				// song tempo (bpm)
		tracks: (int), 						// total tracks count
		track: Array[
			[0]: Object{					// TRACK 1!
				event: Array[				// Midi events in track 1
					[0] : Object{			// EVENT 1
						data: (string),
						deltaTime: (int),
						metaType: (int),
						type: (int),
					},
					[1] : Object{...}		// EVENT 2
					[2] : Object{...}		// EVENT 3
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
var _atob = function(string) {
	// base64 character set, plus padding character (=)
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	// Regular expression to check formal correctness of base64 encoded strings
	var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
	// remove data type signatures at the begining of the string
	// eg :  "data:audio/mid;base64,"
   	string = string.replace( /^.*?base64,/ , "");
    // atob can work with strings with whitespaces, even inside the encoded part,
    // but only \t, \n, \f, \r and ' ', which can be stripped.
    string = String(string).replace(/[\t\n\f\r ]+/g, "");
    if (!b64re.test(string))
        throw new TypeError("Failed to execute '_atob' : The string to be decoded is not correctly encoded.");

    // Adding the padding if missing, for semplicity
    string += "==".slice(2 - (string.length & 3));
    var bitmap, result = "", r1, r2, i = 0;
    for (; i < string.length;) {
        bitmap = b64.indexOf(string.charAt(i++)) << 18 | b64.indexOf(string.charAt(i++)) << 12
                | (r1 = b64.indexOf(string.charAt(i++))) << 6 | (r2 = b64.indexOf(string.charAt(i++)));

        result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255)
                : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255)
                : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
};


var MIDIParser = {
	// debug (bool), when enabled will log in console unimplemented events warnings and internal handled errors.
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

		_fileElement.addEventListener('change', function(InputEvt){				// set the 'file selected' event handler
			if (!InputEvt.target.files.length) return false;					// return false if no elements where selected
			console.log('MIDIParser.addListener() : File detected in INPUT ELEMENT processing data..');
			var reader = new FileReader();										// prepare the file Reader
			reader.readAsArrayBuffer(InputEvt.target.files[0]);					// read the binary data
			reader.onload =  function(e){
				_callback( MIDIParser.Uint8(new Uint8Array(e.target.result))); 	// encode data with Uint8Array and call the parser
			};
		});
	},

	Base64 : function(b64String){
		b64String = String(b64String);

		var raw = _atob(b64String);
		var rawLength = raw.length;
		var array = new Uint8Array(new ArrayBuffer(rawLength));

		for(var i=0; i<rawLength; i++) array[i] = raw.charCodeAt(i);
		return  MIDIParser.Uint8(array) ;
	},

	// parse() function reads the binary data, interpreting and spliting each chuck
	// and parsing it to a structured Object. When job is finised returns the object
	// or 'false' if any error was generated.
	Uint8: function(FileAsUint8Array){
		var file = {
			data: null,
			pointer: 0,
			movePointer: function(_bytes){										// move the pointer negative and positive direction
				this.pointer += _bytes;
				return this.pointer;
			},
			readInt: function(_bytes){ 											// get integer from next _bytes group (big-endian)
				_bytes = Math.min(_bytes, this.data.byteLength-this.pointer);
				if (_bytes < 1) return -1;                                                                      // EOF
				var value = 0;
				if(_bytes > 1){
					for(var i=1; i<= (_bytes-1); i++){
						value += this.data.getUint8(this.pointer) * Math.pow(256, (_bytes - i));
						this.pointer++;
					}
				}
				value += this.data.getUint8(this.pointer);
				this.pointer++;
				return value;
			},
			readStr: function(_bytes){											// read as ASCII chars, the followoing _bytes
				var text = '';
				for(var char=1; char <= _bytes; char++) text +=  String.fromCharCode(this.readInt(1));
				return text;
			},
			readIntVLV: function(){												// read a variable length value
				var value = 0;
				if ( this.pointer >= this.data.byteLength ){
					return -1;									// EOF
				}else if(this.data.getUint8(this.pointer) < 128){					// ...value in a single byte
					value = this.readInt(1);
				}else{															// ...value in multiple bytes
					var FirstBytes = [];
					while(this.data.getUint8(this.pointer) >= 128){
						FirstBytes.push(this.readInt(1) - 128);
					}
					var lastByte  = this.readInt(1);
					for(var dt = 1; dt <= FirstBytes.length; dt++){
						value = FirstBytes[FirstBytes.length - dt] * Math.pow(128, dt);
					}
					value += lastByte;
				}
				return value;
			}
		};

		file.data = new DataView(FileAsUint8Array.buffer, FileAsUint8Array.byteOffset, FileAsUint8Array.byteLength);											// 8 bits bytes file data array
		//  ** read FILE HEADER
		if(file.readInt(4) !== 0x4D546864){
			console.warn('Header validation failed (not MIDI standard or file corrupt.)');
			return false; 														// Header validation failed (not MIDI standard or file corrupt.)
		}
		var headerSize 			= file.readInt(4);								// header size (unused var), getted just for read pointer movement
		var MIDI 				= {};											// create new midi object
		MIDI.formatType   		= file.readInt(2);								// get MIDI Format Type
		MIDI.tracks 			= file.readInt(2);								// get ammount of track chunks
		MIDI.track				= [];											// create array key for track data storing
		var timeDivisionByte1   = file.readInt(1);								// get Time Division first byte
		var timeDivisionByte2   = file.readInt(1);								// get Time Division second byte
		if(timeDivisionByte1 >= 128){ 											// discover Time Division mode (fps or tpf)
			MIDI.timeDivision    = [];
			MIDI.timeDivision[0] = timeDivisionByte1 - 128;						// frames per second MODE  (1st byte)
			MIDI.timeDivision[1] = timeDivisionByte2;							// ticks in each frame     (2nd byte)
		}else MIDI.timeDivision  = (timeDivisionByte1 * 256) + timeDivisionByte2;// else... ticks per beat MODE  (2 bytes value)
		//  ** read TRACK CHUNK
		for(var t=1; t <= MIDI.tracks; t++){
			MIDI.track[t-1] 	= {event: []};									// create new Track entry in Array
			var headerValidation = file.readInt(4);
			if ( headerValidation === -1 ) break;							// EOF
			if(headerValidation !== 0x4D54726B) return false;                                       // Track chunk header validation failed.
			file.readInt(4);													// move pointer. get chunk size (bytes length)
			var e		  		= 0;											// init event counter
			var endOfTrack 		= false;										// FLAG for track reading secuence breaking
			// ** read EVENT CHUNK
			var statusByte;
			var laststatusByte;
			while(!endOfTrack){
				e++;															// increase by 1 event counter
				MIDI.track[t-1].event[e-1] = {};	 							// create new event object, in events array
				MIDI.track[t-1].event[e-1].deltaTime  = file.readIntVLV();		// get DELTA TIME OF MIDI event (Variable Length Value)
				statusByte = file.readInt(1);									// read EVENT TYPE (STATUS BYTE)
				if(statusByte === -1) break;									// EOF
                else if(statusByte >= 128) laststatusByte = statusByte;                         // NEW STATUS BYTE DETECTED
				else{															// 'RUNNING STATUS' situation detected
					statusByte = laststatusByte;								// apply last loop, Status Byte
					file.movePointer(-1); 										// move back the pointer (cause readed byte is not status byte)
				}
				// ** Identify EVENT
				if(statusByte === 0xFF){ 										// Meta Event type
					MIDI.track[t-1].event[e-1].type = 0xFF;						// assign metaEvent code to array
					MIDI.track[t-1].event[e-1].metaType =  file.readInt(1);		// assign metaEvent subtype
					var metaEventLength = file.readIntVLV();					// get the metaEvent length
					switch(MIDI.track[t-1].event[e-1].metaType){
						case 0x2F:												// end of track, has no data byte
						case -1:									// EOF
							endOfTrack = true;									// change FLAG to force track reading loop breaking
							break;
						case 0x01: 												// Text Event
						case 0x02:  											// Copyright Notice
						case 0x03:  											// Sequence/Track Name (documentation: http://www.ta7.de/txt/musik/musi0006.htm)
						case 0x06:  											// Marker
							MIDI.track[t-1].event[e-1].data = file.readStr(metaEventLength);
							break;
						case 0x21: 												// MIDI PORT
						case 0x59: 												// Key Signature
						case 0x51:												// Set Tempo
							MIDI.track[t-1].event[e-1].data = file.readInt(metaEventLength);
							break;
						case 0x54: 												// SMPTE Offset
						case 0x58: 												// Time Signature
							MIDI.track[t-1].event[e-1].data	   = [];
							MIDI.track[t-1].event[e-1].data[0] = file.readInt(1);
							MIDI.track[t-1].event[e-1].data[1] = file.readInt(1);
							MIDI.track[t-1].event[e-1].data[2] = file.readInt(1);
							MIDI.track[t-1].event[e-1].data[3] = file.readInt(1);
							break;
						default :
							file.readInt(metaEventLength);
							MIDI.track[t-1].event[e-1].data = file.readInt(metaEventLength);
							if (this.debug) console.info('Unimplemented 0xFF event! data block readed as Integer');
					}
				}else{															// MIDI Control Events OR System Exclusive Events
					statusByte = statusByte.toString(16).split('');				// split the status byte HEX representation, to obtain 4 bits values
					if(!statusByte[1]) statusByte.unshift('0');					// force 2 digits
					MIDI.track[t-1].event[e-1].type = parseInt(statusByte[0], 16);// first byte is EVENT TYPE ID
					MIDI.track[t-1].event[e-1].channel = parseInt(statusByte[1], 16);// second byte is channel
					switch(MIDI.track[t-1].event[e-1].type){
						case 0xF:												// System Exclusive Events
							var event_length = file.readIntVLV();
							MIDI.track[t-1].event[e-1].data = file.readInt(event_length);
							if (this.debug) console.info('Unimplemented 0xF exclusive events! data block readed as Integer');
							break;
						case 0xA:												// Note Aftertouch
						case 0xB:												// Controller
						case 0xE:												// Pitch Bend Event
						case 0x8:												// Note off
						case 0x9:												// Note On
							MIDI.track[t-1].event[e-1].data = [];
							MIDI.track[t-1].event[e-1].data[0] = file.readInt(1);
							MIDI.track[t-1].event[e-1].data[1] = file.readInt(1);
							break;
						case 0xC:												// Program Change
						case 0xD:												// Channel Aftertouch
							MIDI.track[t-1].event[e-1].data = file.readInt(1);
							break;
						case -1:												// EOF
							endOfTrack = true;									// change FLAG to force track reading loop breaking
							break;
 						default:
							console.warn('Unknown EVENT detected.... reading cancelled!');
							return false;
					}
				}
			}
		}
		return MIDI;
	}
};


if(typeof module !== 'undefined') module.exports = MIDIParser;

let chordsMap = new Map();

function parseMidi() {
	const inputElem = document.querySelector('#file-input');
	let file = inputElem.files[0];
	let reader = new FileReader();


	reader.onload = function(e) {
		let uint8array = new Uint8Array(e.target.result);
		let parsed = MIDIParser.Uint8(uint8array);

		for(track of parsed.track) {

			let deltaTime = 0;
			let note;
		
			for(event of track.event) {
				deltaTime += event.deltaTime;
				
				if(event.type === 9) {

					note = event.data[0] % 12;

					if(chordsMap.has(deltaTime)) {
						chordsMap.get(deltaTime).push(note);
					} else {
						chordsMap.set(deltaTime, [note]);
					}
				} 
			}
		}

		//test

		console.log(chordsMap);

		// let addedChordsMap = {};

		// Object.defineProperty(addedChordsMap, 'hasValueArray', {
		// 	enumerable: false,
		// 	value: function(array) {
		// 		const keys = Object.keys(this);
		// 		const values = Object.values(this);

		// 		for(let key of keys) {
		// 			if(JSON.stringify(this[key].sort()) === JSON.stringify(array.sort())) {
		// 				//console.log(JSON.stringify(this[key].sort()) + '   ' + JSON.stringify(array.sort()));
		// 				return key;
		// 			}
		// 		}
			
		// 		return -1;
		// 	}
		// });

		// let prev;
		// let existingChordKey;
		// let nbChords = 0;
		// let nbSameChords = 0;

		// //for every event time in the song
		// for(var time in chordsMap) {
		// 	nbChords++;

		// 	//if the chord has already been added for another time, don't create a new chord mesh
		// 	//if((existingChordKey = addedChordsMap.hasValueArray(chordsMap[time])) != -1) {
		// 		//console.log(existingChordKey);
		// 		chords[time] = chords[existingChordKey];
		// 		nbSameChords++;
		// 	//} else {
		// 		let newChord = new Chord(chordsMap[time]);
		// 		//if(prev == null || !prev.equals(newChord))
		// 		chords[time] = newChord;
		// 		//addedChordsMap[time] = chordsMap[time];
				
		// 		//prev = newChord;
		// 	}
			
		// }

		// console.log('nbChords : '+nbChords);
		// console.log('nbSameChords : '+nbSameChords);


		var keys = Array.from(chordsMap.keys()).sort((a, b) => a - b);
		createSlider(keys[0], keys[keys.length-1]);
		//drawChords(lowBound, upBound);
		
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
function createSlider(from, to) {
	const slider = document.getElementById('slider');
	let lowBound = from;
	let upBound = to/10;

	noUiSlider.create(slider, {
		start: [ 0, 500 ],
		connect: true,
		tooltips: [ true, true ],
		range: {
			'min': from,
			'max': to
		},
		format: wNumb({
			decimals: 0
		})
	});

	drawChords(lowBound, upBound);

	slider.noUiSlider.on('update', function(values, handle) {
		var value = values[handle];

		if(handle === 1) {
			upBound = parseInt(value);
		} else {
			lowBound = parseInt(value);
		}
		
		drawChords(lowBound, upBound);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9uZVBvaW50LmpzIiwiVGhyZWVQb2ludHMuanMiLCJUd29Qb2ludHMuanMiLCJBbGxNZXNoZXMuanMiLCJBbGxQb2ludHMuanMiLCJDb21iaW5hdGlvbnMuanMiLCJtYWtlTGlnaHRzLmpzIiwiTWF0ZXJpYWxzLmpzIiwiUG9seUN5bGluZGVyLmpzIiwiUG9seU1lc2hlcy5qcyIsIlBvbHlTcGhlcmUuanMiLCJUZXh0U3ByaXRlLmpzIiwiVHJhbnNwTWVzaEdycC5qcyIsImNob3JkLmpzIiwicmVuZGVyMi5qcyIsImJhc2VDb252ZXJ0ZXIuanMiLCJtaWRpLXBhcnNlci5qcy50eHQiLCJtaWRpUGFyc2VyLmpzIiwicHl0ZXN0LmpzIiwic2VuZE1pZGlUb1B5LmpzIiwidGltZWxpbmUuanMiLCJub3Vpc2xpZGVyLm1pbi5qcyIsIndOdW1iLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBPbmVQb2ludChwb2ludCwgc2NhbGUpIHtcclxuXHR2YXIgc3BoZXJlID0gbmV3IFRIUkVFLlNwaGVyZUJ1ZmZlckdlb21ldHJ5KDIsNTAsNTApO1xyXG5cdHZhciBzcGhlcmVNZXNoID0gbmV3IFRIUkVFLk1lc2goc3BoZXJlLCBSR0JNYXRlcmlhbCk7XHJcblxyXG5cdHNwaGVyZU1lc2gucG9zaXRpb24uY29weShwb2ludC5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKSk7XHJcblxyXG5cdHJldHVybiBzcGhlcmVNZXNoO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93T25lUG9pbnQoaW5kZXgpIHtcclxuXHRzcGhlcmVzLmdldChpbmRleCkudmlzaWJsZSA9IHRydWU7XHJcbn0iLCJmdW5jdGlvbiBUaHJlZVBvaW50cyhwb2ludHMsIHNjYWxlKSB7XHJcblx0dGhpcy5ncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuXHQvKnZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG5cdGZvcih2YXIgbm90ZSBpbiBub3Rlcykge1xyXG5cdFx0Z2VvbWV0cnkudmVydGljZXMucHVzaCggYWxsUG9pbnRzW25vdGVzW25vdGVdXS5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKSApO1xyXG5cdH1cclxuXHJcblx0Z2VvbWV0cnkuZmFjZXMucHVzaChuZXcgVEhSRUUuRmFjZTMoMCwxLDIpKTtcclxuXHRnZW9tZXRyeS5mYWNlcy5wdXNoKG5ldyBUSFJFRS5GYWNlMygyLDEsMCkpO1xyXG5cdGdlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscygpO1xyXG5cclxuXHR2YXIgdjEgPSBnZW9tZXRyeS52ZXJ0aWNlc1swXTtcclxuXHR2YXIgdjIgPSBnZW9tZXRyeS52ZXJ0aWNlc1sxXTtcclxuXHR2YXIgdjMgPSBnZW9tZXRyeS52ZXJ0aWNlc1syXTtcclxuXHJcblx0dGhpcy5ncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MSwgdjIpKTtcclxuXHR0aGlzLmdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYyLCB2MykpO1xyXG5cdHRoaXMuZ3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjMsIHYxKSk7Ki9cclxuXHJcblx0bGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XHJcblx0XHJcblx0bGV0IHBvc2l0aW9ucyA9IFtdO1xyXG5cdGxldCBub3JtYWxzID0gW107XHJcblx0XHJcblx0Zm9yKGxldCBwb2ludCBvZiBwb2ludHMpIHtcclxuXHRcdHBvc2l0aW9ucy5wdXNoKHBvaW50LmNsb25lKCkueCk7XHJcblx0XHRwb3NpdGlvbnMucHVzaChwb2ludC5jbG9uZSgpLnkpO1xyXG5cdFx0cG9zaXRpb25zLnB1c2gocG9pbnQuY2xvbmUoKS56KTtcclxuXHRcdG5vcm1hbHMucHVzaCgwLDEsMik7XHJcblx0fVxyXG5cclxuXHRnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICdwb3NpdGlvbicsIG5ldyBUSFJFRS5GbG9hdDMyQnVmZmVyQXR0cmlidXRlKCBwb3NpdGlvbnMsIDMgKSApO1xyXG5cdGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ25vcm1hbCcsIG5ldyBUSFJFRS5GbG9hdDMyQnVmZmVyQXR0cmlidXRlKCBub3JtYWxzLCAzICkgKTtcclxuXHJcblx0Z2VvbWV0cnkuc2NhbGUoc2NhbGUsIHNjYWxlLCBzY2FsZSk7XHJcblxyXG5cdHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHRyYW5zcGFyZW50TWF0ZXJpYWxGcm9udCk7XHJcblxyXG5cdHRoaXMuZ3JvdXAuYWRkKG1lc2gpO1xyXG5cdC8vdGhpcy5ncm91cC5hZGQobmV3IFBvbHlTcGhlcmVzRnJvbU5vdGVzKG5vdGVzKSk7XHJcblxyXG5cdC8vIGNvbnN0IHYxID0gcG9pbnRzWzBdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cdC8vIGNvbnN0IHYyID0gcG9pbnRzWzFdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cdC8vIGNvbnN0IHYzID0gcG9pbnRzWzJdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cclxuXHQvLyB0aGlzLmdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYxLCB2MikpO1xyXG5cdC8vIHRoaXMuZ3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjIsIHYzKSk7XHJcblx0Ly8gdGhpcy5ncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MywgdjEpKTtcclxuXHJcblx0cmV0dXJuIHRoaXMuZ3JvdXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dUaHJlZVBvaW50cyhwdHNJbmRleGVzKSB7XHJcblx0Y29uc29sZS5sb2cocHRzSW5kZXhlcyk7XHJcblx0cHRzSW5kZXhlcy5mb3JFYWNoKGluZGV4ID0+IHtcclxuXHRcdHNob3dPbmVQb2ludChpbmRleCk7XHJcblx0fSk7XHJcblxyXG5cdHN0aWNrcy5nZXQoa2V5RnJvbVB0U2V0KFtwdHNJbmRleGVzWzBdLCBwdHNJbmRleGVzWzFdXSkpLnZpc2libGUgPSB0cnVlO1xyXG5cdHN0aWNrcy5nZXQoa2V5RnJvbVB0U2V0KFtwdHNJbmRleGVzWzFdLCBwdHNJbmRleGVzWzJdXSkpLnZpc2libGUgPSB0cnVlO1xyXG5cdHN0aWNrcy5nZXQoa2V5RnJvbVB0U2V0KFtwdHNJbmRleGVzWzJdLCBwdHNJbmRleGVzWzBdXSkpLnZpc2libGUgPSB0cnVlO1xyXG5cclxuXHRmYWNlcy5zZXQoa2V5RnJvbVB0U2V0KHB0c0luZGV4ZXMpKS52aXNpYmxlID0gdHJ1ZTtcclxufSIsImZ1bmN0aW9uIFR3b1BvaW50cyhwb2ludDEsIHBvaW50Miwgc2NhbGUpIHtcclxuXHJcblx0dmFyIHYxID0gcG9pbnQxLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cdHZhciB2MiA9IHBvaW50Mi5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKTtcclxuXHJcblx0Ly8gdmFyIGN5bGluZGVyID0gbmV3IFRIUkVFLkN5bGluZGVyQnVmZmVyR2VvbWV0cnkoMC40LCAwLjQsIHYxLmRpc3RhbmNlVG8odjIpLCAxMCwgMC41LCB0cnVlKTtcclxuXHJcblx0dGhpcy5ncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuXHQvKnZhciBzcGhlcmVBTWVzaCA9IHNwaGVyZU1lc2guY2xvbmUoKTtcclxuXHRzcGhlcmVBTWVzaC5wb3NpdGlvbi5jb3B5KHYxKTtcclxuXHRzcGhlcmVBTWVzaC51cGRhdGVNYXRyaXgoKTtcclxuXHJcblx0dmFyIHNwaGVyZUJNZXNoID0gc3BoZXJlTWVzaC5jbG9uZSgpO1xyXG5cdHNwaGVyZUJNZXNoLnBvc2l0aW9uLmNvcHkodjIpO1xyXG5cdHNwaGVyZUJNZXNoLnVwZGF0ZU1hdHJpeCgpOyovXHJcblxyXG5cdHZhciBjeWxpbmRlck1lc2ggPSBuZXcgQ3lsaW5kZXJGcm9tUHRzKHYxLCB2Mik7XHJcblxyXG5cdC8qdGhpcy5ncm91cC5hZGQoc3BoZXJlc1tub3RlVmFsMV0pO1xyXG5cdHRoaXMuZ3JvdXAuYWRkKHNwaGVyZXNbbm90ZVZhbDJdKTsqL1xyXG5cdHRoaXMuZ3JvdXAuYWRkKGN5bGluZGVyTWVzaCk7XHJcblxyXG5cdHJldHVybiB0aGlzLmdyb3VwO1xyXG59XHRcclxuXHJcbmZ1bmN0aW9uIHNob3dUd29Qb2ludHMoaW5kZXhlcykge1xyXG5cdHNob3dPbmVQb2ludChpbmRleGVzWzBdKTtcclxuXHRzaG93T25lUG9pbnQoaW5kZXhlc1sxXSk7XHJcblx0Y29uc29sZS5sb2coJ3N0aWNrcycsIHN0aWNrcyk7XHJcblx0Y29uc29sZS5sb2coJ2tleUZyb21QdFNldCcsIGtleUZyb21QdFNldChpbmRleGVzKSk7XHJcblx0c3RpY2tzLmdldChrZXlGcm9tUHRTZXQoaW5kZXhlcykpLnZpc2libGUgPSB0cnVlO1xyXG59IiwibGV0IHNwaGVyZXMsIHN0aWNrcywgZmFjZXM7XHJcblxyXG5mdW5jdGlvbiBtYWtlQWxsTWVzaGVzKCkge1xyXG5cdHNwaGVyZXMgPSBuZXcgTWFwKCk7XHJcblx0c3RpY2tzID0gbmV3IE1hcCgpO1xyXG5cdGZhY2VzID0gbmV3IE1hcCgpO1xyXG5cdGxhYmVscyA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cdC8vY3JlYXRlcyBhbGwgcG9pbnQgbWVzaGVzXHJcblx0YWxsUG9pbnRzLmZvckVhY2goKHBvaW50LCBpKSA9PiB7XHJcblx0XHRsZXQgc3BoZXJlID0gbmV3IE9uZVBvaW50KHBvaW50LCBzY2FsZSk7XHJcblx0XHRzcGhlcmUudmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0c3BoZXJlcy5zZXQoaSxzcGhlcmUpO1xyXG5cclxuXHRcdHNjZW5lLmFkZChzcGhlcmUpO1xyXG5cdFx0Lyp2YXIgbGFiZWwgPSBuZXcgbWFrZVRleHRTcHJpdGUoaSwgc2NhbGUpO1xyXG5cdFx0bGFiZWxzLmFkZChsYWJlbCk7XHRcdCovXHJcblx0fSk7XHJcblx0XHJcblxyXG5cdGNvbnN0IHN0aWNrR2VuID0gc3Vic2V0cyhhbGxQb2ludHMsIDIpO1xyXG5cdGxldCBzdGlja1B0cztcclxuXHR3aGlsZSghKHN0aWNrUHRzID0gc3RpY2tHZW4ubmV4dCgpKS5kb25lKSB7XHJcblx0XHRsZXQgc3RpY2tQdHNBcnJheSA9IEFycmF5LmZyb20oc3RpY2tQdHMudmFsdWUpO1xyXG5cdFx0bGV0IHAxID0gc3RpY2tQdHNBcnJheVswXTtcclxuXHRcdGxldCBwMiA9IHN0aWNrUHRzQXJyYXlbMV07XHJcblx0XHRcclxuXHRcdGxldCBzdGljayA9IG5ldyBUd29Qb2ludHMocDEsIHAyLCBzY2FsZSk7XHJcblx0XHRzdGljay52aXNpYmxlID0gZmFsc2U7XHJcblx0XHRcclxuXHRcdHN0aWNrcy5zZXQoa2V5RnJvbVB0U2V0KHN0aWNrUHRzQXJyYXksIGFsbFBvaW50cyksIHN0aWNrKTtcclxuXHJcblx0XHRzY2VuZS5hZGQoc3RpY2spO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgZmFjZUdlbiA9IHN1YnNldHMoYWxsUG9pbnRzLCAzKTtcclxuXHRsZXQgZmFjZVB0cztcclxuXHR3aGlsZSghKGZhY2VQdHMgPSBmYWNlR2VuLm5leHQoKSkuZG9uZSkge1xyXG4gICAgICAgIGxldCBmYWNlUHRzQXJyYXkgPSBBcnJheS5mcm9tKGZhY2VQdHMudmFsdWUpO1xyXG5cclxuICAgICAgICBsZXQgZmFjZSA9IG5ldyBUaHJlZVBvaW50cyhmYWNlUHRzQXJyYXksIHNjYWxlKTtcclxuICAgICAgICBmYWNlLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICBcclxuXHRcdGZhY2VzLnNldChrZXlGcm9tUHRTZXQoZmFjZVB0c0FycmF5LCBhbGxQb2ludHMpLCBmYWNlKTtcclxuXHJcblx0XHRzY2VuZS5hZGQoZmFjZSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBrZXlGcm9tUHRTZXQoYXJyYXksIGluZGV4ZXIpIHtcclxuICAgIGxldCBzb3J0ZWQgPSBhcnJheS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcblxyXG5cdGlmKGluZGV4ZXIgIT0gbnVsbCl7XHJcblx0XHRyZXR1cm4gYXJyYXkucmVkdWNlKChhY2MsIHYpID0+IGFjYyArIDEgPDwgaW5kZXhlci5pbmRleE9mKHYpLCAwKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIGFycmF5LnJlZHVjZSgoYWNjLCB2KSA9PiBhY2MgKyAxIDw8IHYsIDApO1xyXG5cdH1cclxufSIsImNvbnN0IGFsbFBvaW50cyA9IFtcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC43NTk2NjA2OTMwNDcsIDAuNjA0MjkyNzA0MDc5LCAtMC4yNDAzMDM4ODkzNSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuNDg0MjY2ODQ4Nzc3LCAtMC4yMDY3NzcwNDcxMTksIC0wLjg1MDEzNDYxOTkwNCksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuOTIwMjM3OTE4MTE0LCAtMC4zODA2OTMzOTE4MTYsIDAuMDkwNzQ1MzMzMTc5NCksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoMC40ODQyNjI4MDUwOTMsIDAuMjA2Nzc5OTc1OTY4LCAwLjg1MDEzNjIxMDkzNSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoMC4xNTE0NTE2MTk4OCwgMC42MjYzNjgzMTYwNzMsIC0wLjc2NDY3MzIyMzk2OSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoMC45MjAyMzk3ODI5MjIsIDAuMzgwNjg5NjA2MjI5LCAtMC4wOTA3NDIzMDM0NTQ1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjU1Mzk2OTU2MTAwNSwgLTAuMzQ0OTcxMDQ1NTU2LCAtMC43NTc3MDIyNTIzNDUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjEwODM2OTYxOTk4NSwgLTAuOTY3MzY4ODU1MjI3LCAtMC4yMjkwMjczNDIwMzcpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjE1MTQ1MDA2ODk3NCwgLTAuNjI2MzY5NDIwOTI3LCAwLjc2NDY3MjYyNjExOSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoMC43NTk2NTk5MDA5NzEsIC0wLjYwNDI5Mjk4NzMzMywgMC4yNDAzMDU2ODA5OTEpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuMTA4MzcxODA1OTY0LCAwLjk2NzM2OTcwMzg2MiwgMC4yMjkwMjI3MjMxNTUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjU1Mzk3MDMyNjkzOCwgMC4zNDQ5NzI0NDE3NjcsIDAuNzU3NzAxMDU2NjgpXHJcbl07XHJcblxyXG4vKlxyXG52YXIgYWxsUG9pbnRzID0gW1xyXG5cdFstMC43NTk2NjA2OTMwNDcsIDAuNjA0MjkyNzA0MDc5LCAtMC4yNDAzMDM4ODkzNV0sXHJcblx0Wy0wLjQ4NDI2Njg0ODc3NywgLTAuMjA2Nzc3MDQ3MTE5LCAtMC44NTAxMzQ2MTk5MDRdLFxyXG5cdFstMC45MjAyMzc5MTgxMTQsIC0wLjM4MDY5MzM5MTgxNiwgMC4wOTA3NDUzMzMxNzk0XSxcclxuXHRbMC40ODQyNjI4MDUwOTMsIDAuMjA2Nzc5OTc1OTY4LCAwLjg1MDEzNjIxMDkzNV0sXHJcblx0WzAuMTUxNDUxNjE5ODgsIDAuNjI2MzY4MzE2MDczLCAtMC43NjQ2NzMyMjM5NjldLFxyXG5cdFswLjkyMDIzOTc4MjkyMiwgMC4zODA2ODk2MDYyMjksIC0wLjA5MDc0MjMwMzQ1NDVdLFxyXG5cdFswLjU1Mzk2OTU2MTAwNSwgLTAuMzQ0OTcxMDQ1NTU2LCAtMC43NTc3MDIyNTIzNDVdLFxyXG5cdFstMC4xMDgzNjk2MTk5ODUsIC0wLjk2NzM2ODg1NTIyNywgLTAuMjI5MDI3MzQyMDM3XSxcclxuXHRbLTAuMTUxNDUwMDY4OTc0LCAtMC42MjYzNjk0MjA5MjcsIDAuNzY0NjcyNjI2MTE5XSxcclxuXHRbMC43NTk2NTk5MDA5NzEsIC0wLjYwNDI5Mjk4NzMzMywgMC4yNDAzMDU2ODA5OTFdLFxyXG5cdFswLjEwODM3MTgwNTk2NCwgMC45NjczNjk3MDM4NjIsIDAuMjI5MDIyNzIzMTU1XSxcclxuXHRbLTAuNTUzOTcwMzI2OTM4LCAwLjM0NDk3MjQ0MTc2NywgMC43NTc3MDEwNTY2OF1cclxuXTtcclxuKi8iLCJmdW5jdGlvbiogc3Vic2V0cyhhcnJheSwgbGVuZ3RoLCBzdGFydCA9IDApIHtcclxuICBpZiAoc3RhcnQgPj0gYXJyYXkubGVuZ3RoIHx8IGxlbmd0aCA8IDEpIHtcclxuICAgIHlpZWxkIG5ldyBTZXQoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgd2hpbGUgKHN0YXJ0IDw9IGFycmF5Lmxlbmd0aCAtIGxlbmd0aCkge1xyXG4gICAgICBsZXQgZmlyc3QgPSBhcnJheVtzdGFydF07XHJcbiAgICAgIGZvciAoc3Vic2V0IG9mIHN1YnNldHMoYXJyYXksIGxlbmd0aCAtIDEsIHN0YXJ0ICsgMSkpIHtcclxuICAgICAgICBzdWJzZXQuYWRkKGZpcnN0KTtcclxuICAgICAgICB5aWVsZCBzdWJzZXQ7XHJcbiAgICAgIH1cclxuICAgICAgKytzdGFydDtcclxuICAgIH1cclxuICB9XHJcbn0iLCJmdW5jdGlvbiBtYWtlTGlnaHRzKCkge1xyXG5cdHZhciB4ID0gMDtcclxuXHR2YXIgeSA9IDA7XHJcblx0dmFyIHogPSAwO1xyXG5cclxuXHR2YXIgZGlzdGFuY2UgPSAzMDtcclxuXHJcblx0Ly90b3AgbGlnaHRzXHJcblx0dmFyIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweGZmMDAwMCwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0LnBvc2l0aW9uLnNldCh4K2Rpc3RhbmNlLCB5K2Rpc3RhbmNlLCB6K2Rpc3RhbmNlKTtcclxuXHRtYWluR3JvdXAuYWRkKHBvaW50TGlnaHQpO1xyXG5cclxuXHQvKnZhciBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0LCAxKTtcclxuXHRtYWluR3JvdXAuYWRkKGhlbHBlcik7Ki9cclxuXHJcblx0dmFyIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDAwZmYwMCwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0LnBvc2l0aW9uLnNldCh4K2Rpc3RhbmNlLCB5K2Rpc3RhbmNlLCB6LWRpc3RhbmNlKTtcclxuXHRtYWluR3JvdXAuYWRkKHBvaW50TGlnaHQpO1xyXG5cclxuXHQvKnZhciBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0LCAxKTtcclxuXHRtYWluR3JvdXAuYWRkKGhlbHBlcik7Ki9cclxuXHJcblx0dmFyIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweGZmZmYwMCwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0LnBvc2l0aW9uLnNldCh4LWRpc3RhbmNlLCB5K2Rpc3RhbmNlLCB6K2Rpc3RhbmNlKTtcclxuXHRtYWluR3JvdXAuYWRkKHBvaW50TGlnaHQpO1xyXG5cclxuXHQvKnZhciBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0LCAxKTtcclxuXHRtYWluR3JvdXAuYWRkKGhlbHBlcik7Ki9cclxuXHJcblx0dmFyIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDAwMDBmZiwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0LnBvc2l0aW9uLnNldCh4LWRpc3RhbmNlLCB5K2Rpc3RhbmNlLCB6LWRpc3RhbmNlKTtcclxuXHRtYWluR3JvdXAuYWRkKHBvaW50TGlnaHQpO1xyXG5cclxuXHQvKnZhciBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0LCAxKTtcclxuXHRtYWluR3JvdXAuYWRkKGhlbHBlcik7Ki9cclxuXHJcblxyXG5cdC8vYm90dG9tIGxpZ2h0c1xyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHgwMGZmZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeCtkaXN0YW5jZSwgeS1kaXN0YW5jZSwgeitkaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0Lyp2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZjAwZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeCtkaXN0YW5jZSwgeS1kaXN0YW5jZSwgei1kaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0Lyp2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpO1xyXG4qL1xyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZjg4ODgsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeC1kaXN0YW5jZSwgeS1kaXN0YW5jZSwgeitkaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0Lyp2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHg4ODg4ZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeC1kaXN0YW5jZSwgeS1kaXN0YW5jZSwgei1kaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0Lyp2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cclxuXHJcblx0Ly9taWRkbGUgbGlnaHRcclxuXHQvKnZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZmZmZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeCwgeSwgeik7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0dmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdGdyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG59IiwidmFyIHRyYW5zcGFyZW50TWF0ZXJpYWxGcm9udCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4ZmZmZmZmLFxyXG5cdG9wYWNpdHk6IDAuNCxcclxuXHR0cmFuc3BhcmVudDogdHJ1ZSxcclxuXHRzaWRlOiBUSFJFRS5Eb3VibGVTaWRlXHJcbn0gKTtcclxuXHJcbnZhciB0cmFuc3BhcmVudE1hdGVyaWFsQmFjayA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4ZmZmZmZmLFxyXG5cdG9wYWNpdHk6IDAuNCxcclxuXHR0cmFuc3BhcmVudDogdHJ1ZVxyXG59ICk7XHJcblxyXG52YXIgcG9pbnRzTWF0ZXJpYWwgPSBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoIHtcclxuXHRjb2xvcjogMHgwMDgwZmYsXHJcblx0c2l6ZTogMSxcclxuXHRhbHBoYVRlc3Q6IDAuNVxyXG59ICk7XHJcblxyXG52YXIgUkdCTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaE5vcm1hbE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4MDA4OGZmXHJcbn0pO1xyXG5cclxudmFyIFNURE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4MDA4OGZmLFxyXG5cdG9wYWNpdHk6IDAuNVxyXG59KTtcclxuXHJcbnZhciBmbGF0U2hhcGVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgge1xyXG5cdHNpZGUgOiBUSFJFRS5Eb3VibGVTaWRlLFxyXG5cdHRyYW5zcGFyZW50IDogdHJ1ZSxcclxuXHRvcGFjaXR5OiAwLjVcclxufSk7IiwiZnVuY3Rpb24gQ3lsaW5kZXJGcm9tUHRzKHYxLCB2Mikge1xyXG5cdHZhciBjeWxpbmRlciA9IG5ldyBUSFJFRS5DeWxpbmRlckJ1ZmZlckdlb21ldHJ5KDAuNCwgMC40LCB2MS5kaXN0YW5jZVRvKHYyKSwgMTAsIDAuNSwgdHJ1ZSk7XHJcblx0dmFyIGN5bGluZGVyTWVzaCA9IG5ldyBUSFJFRS5NZXNoKGN5bGluZGVyLCBSR0JNYXRlcmlhbCk7XHJcblx0Y3lsaW5kZXJNZXNoLnBvc2l0aW9uLmNvcHkodjEuY2xvbmUoKS5sZXJwKHYyLCAuNSkpO1xyXG5cclxuXHQvL2NyZWF0ZXMgcXVhdGVybmlvbiBmcm9tIHNwaGVyZXMgcG9zaXRpb24gdG8gcm90YXRlIHRoZSBjeWxpbmRlclxyXG5cdHZhciBxID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKTtcclxuXHRxLnNldEZyb21Vbml0VmVjdG9ycyhuZXcgVEhSRUUuVmVjdG9yMygwLDEsMCksIG5ldyBUSFJFRS5WZWN0b3IzKCkuc3ViVmVjdG9ycyh2MSwgdjIpLm5vcm1hbGl6ZSgpKTtcclxuXHRjeWxpbmRlck1lc2guc2V0Um90YXRpb25Gcm9tUXVhdGVybmlvbihxKTtcclxuXHRyZXR1cm4gY3lsaW5kZXJNZXNoO1xyXG59IiwiZnVuY3Rpb24gUG9seU1lc2hlcyhnZW9tZXRyeSwgbm90ZXMpIHtcclxuXHR0aGlzLmdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG5cdHRoaXMuZ3JvdXAuYWRkKG5ldyBUcmFuc3BNZXNoR3JwKGdlb21ldHJ5KSk7XHJcblx0Ly90aGlzLmdyb3VwLmFkZChuZXcgUG9seVNwaGVyZXNGcm9tTm90ZXMobm90ZXMpKTtcclxuXHRyZXR1cm4gdGhpcy5ncm91cDtcclxufVxyXG5cclxuUG9seU1lc2hlcy5wcm90b3R5cGUuc2V0UG9zID0gZnVuY3Rpb24oeCx5LHopIHtcclxuXHR0aGlzLmdyb3VwLnBvc2l0aW9uLnggPSB4O1xyXG5cdHRoaXMuZ3JvdXAucG9zaXRpb24ueSA9IHk7XHJcblx0dGhpcy5ncm91cC5wb3NpdGlvbi56ID0gejtcclxufSIsIi8vIC8vY3JlYXRlcyBzcGhlcmVzIGZvciBlYWNoIHZlcnRleCBvZiB0aGUgZ2VvbWV0cnlcclxuLy8gdmFyIHNwaGVyZSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgyLDUwLDUwKTtcclxuLy8gdmFyIHNwaGVyZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChzcGhlcmUsIFJHQk1hdGVyaWFsKTtcclxuXHJcbi8vIGZ1bmN0aW9uIFBvbHlTcGhlcmVzKGdlb21ldHJ5KSB7XHJcbi8vIFx0dGhpcy5ncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4vLyBcdHZhciBtZXNoID0gc3BoZXJlTWVzaC5jbG9uZSgpO1xyXG4vLyBcdGZvcih2YXIgaT0wOyBpPGdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbi8vIFx0XHRzcGhlcmVNZXNoLnBvc2l0aW9uLmNvcHkoZ2VvbWV0cnkudmVydGljZXNbaV0pO1xyXG4vLyBcdFx0dGhpcy5ncm91cC5hZGQoc3BoZXJlTWVzaC5jbG9uZSgpKTtcclxuLy8gXHR9XHJcblxyXG4vLyBcdHJldHVybiB0aGlzLmdyb3VwO1xyXG4vLyB9XHJcblxyXG4vLyBmdW5jdGlvbiBQb2x5U3BoZXJlc0Zyb21Ob3Rlcyhub3Rlcykge1xyXG4vLyBcdHZhciBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4vLyBcdGZvcih2YXIgaSBpbiBub3Rlcykge1xyXG4vLyBcdFx0Z3JvdXAuYWRkKHNwaGVyZXMuZ2V0T2JqZWN0QnlJZChub3Rlc1tpXSkuY2xvbmUoKSk7XHJcbi8vIFx0fVxyXG4vLyBcdC8qY29uc29sZS5sb2coZ3JvdXApOyovXHJcblxyXG4vLyBcdHJldHVybiBncm91cDtcclxuLy8gfSIsIi8qZnVuY3Rpb24gbWFrZVRleHRTcHJpdGUoIG5vdGUsIHNjYWxlLCBwYXJhbWV0ZXJzIClcclxue1xyXG5cdHZhciBtZXNzYWdlO1xyXG5cclxuXHRpZihub3RlID09IDApIHtcclxuXHRcdG1lc3NhZ2UgPSAnQyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gMSkge1xyXG5cdFx0bWVzc2FnZSA9ICdDIyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gMikge1xyXG5cdFx0bWVzc2FnZSA9ICdEJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSAzKSB7XHJcblx0XHRtZXNzYWdlID0gJ0QjJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSA0KSB7XHJcblx0XHRtZXNzYWdlID0gJ0UnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDUpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRic7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gNikge1xyXG5cdFx0bWVzc2FnZSA9ICdGIyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gNykge1xyXG5cdFx0bWVzc2FnZSA9ICdHJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSA4KSB7XHJcblx0XHRtZXNzYWdlID0gJ0cjJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSA5KSB7XHJcblx0XHRtZXNzYWdlID0gJ0EnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDEwKSB7XHJcblx0XHRtZXNzYWdlID0gJ0EjJztcclxuXHR9IGVsc2Uge1xyXG5cdFx0bWVzc2FnZSA9ICdCJztcclxuXHR9XHJcblxyXG5cclxuXHRpZiAoIHBhcmFtZXRlcnMgPT09IHVuZGVmaW5lZCApIHBhcmFtZXRlcnMgPSB7fTtcclxuXHRcclxuXHR2YXIgZm9udGZhY2UgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiZm9udGZhY2VcIikgPyBcclxuXHRcdHBhcmFtZXRlcnNbXCJmb250ZmFjZVwiXSA6IFwiQXJpYWxcIjtcclxuXHRcclxuXHR2YXIgZm9udHNpemUgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiZm9udHNpemVcIikgPyBcclxuXHRcdHBhcmFtZXRlcnNbXCJmb250c2l6ZVwiXSA6IDE4O1xyXG5cdFxyXG5cdHZhciBib3JkZXJUaGlja25lc3MgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiYm9yZGVyVGhpY2tuZXNzXCIpID8gXHJcblx0XHRwYXJhbWV0ZXJzW1wiYm9yZGVyVGhpY2tuZXNzXCJdIDogNDtcclxuXHRcclxuXHR2YXIgYm9yZGVyQ29sb3IgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiYm9yZGVyQ29sb3JcIikgP1xyXG5cdFx0cGFyYW1ldGVyc1tcImJvcmRlckNvbG9yXCJdIDogeyByOjAsIGc6MCwgYjowLCBhOjEuMCB9O1xyXG5cdFxyXG5cdHZhciBiYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpID9cclxuXHRcdHBhcmFtZXRlcnNbXCJiYWNrZ3JvdW5kQ29sb3JcIl0gOiB7IHI6MjU1LCBnOjI1NSwgYjoyNTUsIGE6MS4wIH07XHJcblxyXG5cdC8vdmFyIHNwcml0ZUFsaWdubWVudCA9IHBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkoXCJhbGlnbm1lbnRcIikgP1xyXG5cdC8vXHRwYXJhbWV0ZXJzW1wiYWxpZ25tZW50XCJdIDogVEhSRUUuU3ByaXRlQWxpZ25tZW50LnRvcExlZnQ7XHJcblxyXG5cdHZhciBzcHJpdGVBbGlnbm1lbnQgPSBUSFJFRS5TcHJpdGVBbGlnbm1lbnQudG9wTGVmdDtcclxuXHRcdFxyXG5cclxuXHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcblx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHRjb250ZXh0LmZvbnQgPSBcIkJvbGQgXCIgKyBmb250c2l6ZSArIFwicHggXCIgKyBmb250ZmFjZTtcclxuICAgIFxyXG5cdC8vIGdldCBzaXplIGRhdGEgKGhlaWdodCBkZXBlbmRzIG9ubHkgb24gZm9udCBzaXplKVxyXG5cdHZhciBtZXRyaWNzID0gY29udGV4dC5tZWFzdXJlVGV4dCggbWVzc2FnZSApO1xyXG5cdHZhciB0ZXh0V2lkdGggPSBtZXRyaWNzLndpZHRoO1xyXG5cdFxyXG5cdC8vIGJhY2tncm91bmQgY29sb3JcclxuXHRjb250ZXh0LmZpbGxTdHlsZSAgID0gXCJyZ2JhKFwiICsgYmFja2dyb3VuZENvbG9yLnIgKyBcIixcIiArIGJhY2tncm91bmRDb2xvci5nICsgXCIsXCJcclxuXHRcdFx0XHRcdFx0XHRcdCAgKyBiYWNrZ3JvdW5kQ29sb3IuYiArIFwiLFwiICsgYmFja2dyb3VuZENvbG9yLmEgKyBcIilcIjtcclxuXHQvLyBib3JkZXIgY29sb3JcclxuXHRjb250ZXh0LnN0cm9rZVN0eWxlID0gXCJyZ2JhKFwiICsgYm9yZGVyQ29sb3IuciArIFwiLFwiICsgYm9yZGVyQ29sb3IuZyArIFwiLFwiXHJcblx0XHRcdFx0XHRcdFx0XHQgICsgYm9yZGVyQ29sb3IuYiArIFwiLFwiICsgYm9yZGVyQ29sb3IuYSArIFwiKVwiO1xyXG5cclxuXHRjb250ZXh0LmxpbmVXaWR0aCA9IGJvcmRlclRoaWNrbmVzcztcclxuXHRyb3VuZFJlY3QoY29udGV4dCwgYm9yZGVyVGhpY2tuZXNzLzIsIGJvcmRlclRoaWNrbmVzcy8yLCB0ZXh0V2lkdGggKyBib3JkZXJUaGlja25lc3MsIGZvbnRzaXplICogMS40ICsgYm9yZGVyVGhpY2tuZXNzLCA2KTtcclxuXHQvLyAxLjQgaXMgZXh0cmEgaGVpZ2h0IGZhY3RvciBmb3IgdGV4dCBiZWxvdyBiYXNlbGluZTogZyxqLHAscS5cclxuXHRcclxuXHQvLyB0ZXh0IGNvbG9yXHJcblx0Y29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoMCwgMCwgMCwgMS4wKVwiO1xyXG5cclxuXHRjb250ZXh0LmZpbGxUZXh0KCBtZXNzYWdlLCBib3JkZXJUaGlja25lc3MsIGZvbnRzaXplICsgYm9yZGVyVGhpY2tuZXNzKTtcclxuXHRcclxuXHQvLyBjYW52YXMgY29udGVudHMgd2lsbCBiZSB1c2VkIGZvciBhIHRleHR1cmVcclxuXHR2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGNhbnZhcykgXHJcblx0dGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcblxyXG5cdHZhciBzcHJpdGVNYXRlcmlhbCA9IG5ldyBUSFJFRS5TcHJpdGVNYXRlcmlhbCggXHJcblx0XHR7IG1hcDogdGV4dHVyZSwgdXNlU2NyZWVuQ29vcmRpbmF0ZXM6IGZhbHNlLCBhbGlnbm1lbnQ6IHNwcml0ZUFsaWdubWVudCB9ICk7XHJcblx0dmFyIHNwcml0ZSA9IG5ldyBUSFJFRS5TcHJpdGUoIHNwcml0ZU1hdGVyaWFsICk7XHJcblx0c3ByaXRlLnNjYWxlLnNldCgxMDAsNTAsMS4wKTtcclxuXHRzcHJpdGUucG9zaXRpb24uY29weShhbGxQb2ludHNbbm90ZVZhbF0uY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSkpXHJcblx0cmV0dXJuIHNwcml0ZTtcdFxyXG59XHJcblxyXG4vLyBmdW5jdGlvbiBmb3IgZHJhd2luZyByb3VuZGVkIHJlY3RhbmdsZXNcclxuZnVuY3Rpb24gcm91bmRSZWN0KGN0eCwgeCwgeSwgdywgaCwgcikgXHJcbntcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5tb3ZlVG8oeCtyLCB5KTtcclxuICAgIGN0eC5saW5lVG8oeCt3LXIsIHkpO1xyXG4gICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCt3LCB5LCB4K3csIHkrcik7XHJcbiAgICBjdHgubGluZVRvKHgrdywgeStoLXIpO1xyXG4gICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCt3LCB5K2gsIHgrdy1yLCB5K2gpO1xyXG4gICAgY3R4LmxpbmVUbyh4K3IsIHkraCk7XHJcbiAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5K2gsIHgsIHkraC1yKTtcclxuICAgIGN0eC5saW5lVG8oeCwgeStyKTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHgrciwgeSk7XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBjdHguZmlsbCgpO1xyXG5cdGN0eC5zdHJva2UoKTsgICBcclxufSovIiwiLy9jcmVhdGVzIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIHR3byBtZXNoZXMgdG8gY3JlYXRlIHRyYW5zcGFyZW5jeVxyXG5mdW5jdGlvbiBUcmFuc3BNZXNoR3JwKGdlb21ldHJ5KSB7XHJcblx0dmFyIGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblx0dmFyIG1lc2hHZW9tZXRyeSA9IG5ldyBUSFJFRS5Db252ZXhCdWZmZXJHZW9tZXRyeShnZW9tZXRyeS52ZXJ0aWNlcyk7XHJcblxyXG5cdHZhciBmYWNlcyA9IG1lc2hHZW9tZXRyeS5mYWNlcztcclxuXHRmb3IodmFyIGZhY2UgaW4gZmFjZXMpIHtcclxuXHRcdGZvcih2YXIgaT0wOyBpPDM7IGkrKykge1xyXG5cdFx0XHR2YXIgdjEgPSBmYWNlc1tmYWNlXS5nZXRFZGdlKGkpLmhlYWQoKTtcclxuXHRcdFx0dmFyIHYyID0gZmFjZXNbZmFjZV0uZ2V0RWRnZShpKS50YWlsKCk7XHJcblx0XHRcdGdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYxLnBvaW50LCB2Mi5wb2ludCkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChtZXNoR2VvbWV0cnksIHRyYW5zcGFyZW50TWF0ZXJpYWxCYWNrKTtcclxuXHRtZXNoLm1hdGVyaWFsLnNpZGUgPSBUSFJFRS5CYWNrU2lkZTsgLy8gYmFjayBmYWNlc1xyXG5cdG1lc2gucmVuZGVyT3JkZXIgPSAwO1xyXG5cclxuXHR2YXIgbWVzaDIgPSBuZXcgVEhSRUUuTWVzaChtZXNoR2VvbWV0cnksIHRyYW5zcGFyZW50TWF0ZXJpYWxGcm9udC5jbG9uZSgpKTtcclxuXHRtZXNoMi5tYXRlcmlhbC5zaWRlID0gVEhSRUUuRnJvbnRTaWRlOyAvLyBmcm9udCBmYWNlc1xyXG5cdG1lc2gyLnJlbmRlck9yZGVyID0gMTtcclxuXHJcblx0Z3JvdXAuYWRkKG1lc2gpO1xyXG5cdGdyb3VwLmFkZChtZXNoMik7XHJcblxyXG5cdHJldHVybiBncm91cDtcclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd1BvbHloZWRyb24ocHRzSW5kZXhlcykge1xyXG5cdGxldCB2ZXJ0aWNlcyA9IFtdO1xyXG5cdHB0c0luZGV4ZXMuZm9yRWFjaChpbmRleCA9PiB7XHJcblx0XHR2ZXJ0aWNlcy5wdXNoKGFsbFBvaW50c1tpbmRleF0uY2xvbmUoKSk7XHJcblx0fSk7XHJcblxyXG5cdGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Db252ZXhCdWZmZXJHZW9tZXRyeSh2ZXJ0aWNlcyk7XHJcblxyXG5cdGdlb21ldHJ5LmZhY2VzLmZvckVhY2goZmFjZSA9PiB7XHJcblx0XHRjb25zb2xlLmxvZygnZmFjZSBlZGdlJywgZmFjZS5nZXRFZGdlKDApLmhlYWQoKS5wb2ludCk7XHJcblx0XHRsZXQgaW5kZXgxID0gYWxsUG9pbnRzLmluZGV4T2YoZmFjZS5nZXRFZGdlKDApLmhlYWQoKS5wb2ludCksXHJcblx0XHRcdGluZGV4MiA9IGFsbFBvaW50cy5pbmRleE9mKGZhY2UuZ2V0RWRnZSgxKS5oZWFkKCkucG9pbnQpLFxyXG5cdFx0XHRpbmRleDMgPSBhbGxQb2ludHMuaW5kZXhPZihmYWNlLmdldEVkZ2UoMikuaGVhZCgpLnBvaW50KTtcclxuXHRcdHNob3dUaHJlZVBvaW50cyhbaW5kZXgxLCBpbmRleDIsIGluZGV4M10pO1xyXG5cdH0pO1xyXG5cclxufVxyXG5cclxuLypmdW5jdGlvbiBtYWtlVHJhbnNwYXJlbnQoZ2VvbWV0cnksIGdyb3VwKSB7XHJcblx0Ly9nZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xyXG5cdC8vZ2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XHJcblx0Z3JvdXAuYWRkKG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCB0cmFuc3BhcmVudE1hdGVyaWFsRnJvbnQpKTtcclxufSovIiwiY29uc3Qgc2NhbGUgPSAxNTtcclxubGV0IGNob3JkR2VvbWV0cnk7XHJcblxyXG5mdW5jdGlvbiBDaG9yZChub3Rlcykge1xyXG5cdHRoaXMubm90ZXMgPSBbXTtcclxuXHJcblx0Zm9yKHZhciBpIGluIG5vdGVzKSB7XHJcblx0XHRsZXQgZmluYWxOb3RlID0gbm90ZXNbaV0gJSAxMjtcclxuXHRcdGlmKHRoaXMubm90ZXMuaW5kZXhPZihmaW5hbE5vdGUpID09IC0xKSBcclxuXHRcdFx0dGhpcy5ub3Rlcy5wdXNoKGZpbmFsTm90ZSk7XHJcblx0fVxyXG5cclxuXHR0aGlzLmRyYXdDaG9yZCgpO1xyXG59XHJcblxyXG5DaG9yZC5wcm90b3R5cGUuYWRkTm90ZSA9IGZ1bmN0aW9uKG5vdGUpIHtcclxuXHR0aGlzLm5vdGVzLnB1c2gobm90ZSAlIDEyKTtcclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbihib29sKSB7XHJcblx0dGhpcy5wb2x5aGVkcm9uLnZpc2libGUgPSBib29sO1xyXG5cdGZvcih2YXIgaSBpbiB0aGlzLm5vdGVzKSB7XHJcblx0XHRzcGhlcmVzLmNoaWxkcmVuW3RoaXMubm90ZXNbaV1dLnZpc2libGUgPSBib29sO1xyXG5cdH1cclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLmRyYXdDaG9yZCA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBuYk5vdGVzID0gdGhpcy5ub3Rlcy5sZW5ndGg7XHJcblxyXG5cdGlmKG5iTm90ZXMgPT0gMSkge1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XHJcblx0fSBlbHNlIGlmKG5iTm90ZXMgPT0gMikge1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFR3b1BvaW50cyh0aGlzLm5vdGVzWzBdLCB0aGlzLm5vdGVzWzFdLCBzY2FsZSk7XHJcblx0fSBlbHNlIGlmKG5iTm90ZXMgPT0gMykge1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFRocmVlUG9pbnRzKHRoaXMubm90ZXMsIHNjYWxlKTtcclxuXHR9ZWxzZSB7XHJcblx0XHRjaG9yZEdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgaT0wOyBpPG5iTm90ZXM7IGkrKykge1xyXG5cdFx0XHRjaG9yZEdlb21ldHJ5LnZlcnRpY2VzLnB1c2goXHJcblx0XHRcdFx0YWxsUG9pbnRzW3RoaXMubm90ZXNbaV1dLmNsb25lKClcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyB2YXIgc3VicyA9IHN1YnNldHModGhpcy5ub3RlcywgMyk7XHJcblx0XHQvLyB2YXIgcG9pbnRJZHM7XHJcblx0XHQvLyB2YXIgcG9pbnRJZDEsIHBvaW50SWQyLCBwb2ludElkMztcclxuXHRcdC8vIHZhciBmYWNlO1xyXG5cclxuXHRcdC8vIGZvcihzdWIgb2Ygc3Vicykge1xyXG5cdFx0Ly8gXHRwb2ludElkcyA9IHN1Yi5lbnRyaWVzKCk7XHJcblx0XHRcdFxyXG5cdFx0Ly8gXHQvL2dldCB0aGUgZmFjZSdzIDMgdmVydGljZXMgaW5kZXhcclxuXHRcdC8vIFx0cG9pbnRJZDEgPSBwb2ludElkcy5uZXh0KCkudmFsdWVbMF0udmFsdWU7XHJcblx0XHQvLyBcdHBvaW50SWQyID0gcG9pbnRJZHMubmV4dCgpLnZhbHVlWzBdLnZhbHVlO1xyXG5cdFx0Ly8gXHRwb2ludElkMyA9IHBvaW50SWRzLm5leHQoKS52YWx1ZVswXS52YWx1ZTtcclxuXHJcblx0XHQvLyBcdGZhY2UgPSBuZXcgVEhSRUUuRmFjZTMocG9pbnRJZDEscG9pbnRJZDIscG9pbnRJZDMpO1xyXG5cdFx0Ly8gXHRnZW9tZXRyeS5mYWNlcy5wdXNoKGZhY2UpO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdC8vIHZhciBtZXNoR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29udmV4QnVmZmVyR2VvbWV0cnkoZ2VvbWV0cnkudmVydGljZXMpO1xyXG5cdFx0Y2hvcmRHZW9tZXRyeS5zY2FsZShzY2FsZSxzY2FsZSxzY2FsZSk7XHJcblx0XHR0aGlzLnBvbHloZWRyb24gPSBuZXcgUG9seU1lc2hlcyhjaG9yZEdlb21ldHJ5LCB0aGlzLm5vdGVzKTtcclxuXHJcblx0fVxyXG5cdHRoaXMucG9seWhlZHJvbi52aXNpYmxlID0gZmFsc2U7XHJcblx0c2hhcGVzR3JvdXAuYWRkKHRoaXMucG9seWhlZHJvbik7XHJcblx0XHJcblxyXG59XHJcblxyXG5DaG9yZC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oY2hvcmQpIHtcclxuXHRpZih0aGlzLm5vdGVzLmxlbmd0aCAhPSBjaG9yZC5ub3Rlcy5sZW5ndGgpXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdGZvcihsZXQgbm90ZSBpbiBjaG9yZC5ub3Rlcykge1xyXG5cdFx0aWYodGhpcy5ub3Rlc1tub3RlXSAhPSBjaG9yZC5ub3Rlc1tub3RlXSlcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRydWU7XHJcbn0iLCJ2YXIgbWFpbkdyb3VwLCBzaGFwZXNHcm91cCwgbGFiZWxzLCBjb250YWluZXIsIGNhbWVyYSwgcmVuZGVyZXIsIHNjZW5lLCBzdGF0cztcclxudmFyIGNob3JkcyA9IHt9O1xyXG52YXIgbm90ZXMgPSBbXTtcclxudmFyIG1vdXNlWCA9IDAsIG1vdXNlWSA9IDA7XHJcbnZhciB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcclxudmFyIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcclxuLy92YXIgd3MgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly8xMjcuMC4wLjE6NTY3OC9cIik7XHJcbnZhciBjdWJlO1xyXG5cclxuXHJcbmluaXQoKTtcclxuYW5pbWF0ZSgpO1xyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcblx0Y2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aC93aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCk7XHJcblx0Y2FtZXJhLnBvc2l0aW9uLnogPSA1MDtcclxuXHJcblx0c2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHRzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKCAweDAwMDAwMCApO1xyXG5cclxuXHRyZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XHJcblx0Ly9yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcclxuXHRyZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG5cclxuXHR2YXIgY29udHJvbHMgPSBuZXcgVEhSRUUuT3JiaXRDb250cm9scyggY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50ICk7XHJcblx0Y29udHJvbHMubWluRGlzdGFuY2UgPSA1O1xyXG5cdGNvbnRyb2xzLm1heERpc3RhbmNlID0gMjAwO1xyXG5cdGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJO1xyXG5cclxuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQoIHJlbmRlcmVyLmRvbUVsZW1lbnQgKTtcclxuXHJcblx0bWFpbkdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblx0c2hhcGVzR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHRzY2VuZS5hZGQoc2hhcGVzR3JvdXApO1xyXG5cdHNjZW5lLmFkZChtYWluR3JvdXApO1xyXG5cclxuXHRjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KCAweDQwNDA0MCApO1xyXG5cdHNjZW5lLmFkZCggYW1iaWVudExpZ2h0ICk7XHJcblxyXG5cdGNvbnN0IHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCggMHhmZjAwMDAsIDEsIDEwMCApO1xyXG5cdC8vY2FtZXJhLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0bWFrZUFsbE1lc2hlcygpO1xyXG5cdG1ha2VMaWdodHMoKTtcclxuXHJcblx0c3RhdHMgPSBuZXcgU3RhdHMoKTtcclxuXHQvL2NvbnRhaW5lci5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuXHJcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UgKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcclxuXHR3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcclxuXHR3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XHJcblx0Y2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cdGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcblx0cmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3Q2hvcmRzKGxvdywgdXBwKSB7XHJcblx0c3BoZXJlcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwga2V5KSB7XHJcblx0XHR2YWwudmlzaWJsZSA9IGZhbHNlO1xyXG5cdH0pO1xyXG5cclxuXHRzdGlja3MuZm9yRWFjaChmdW5jdGlvbih2YWwsIGtleSkge1xyXG5cdFx0dmFsLnZpc2libGUgPSBmYWxzZTtcclxuXHR9KTtcclxuXHJcblx0ZmFjZXMuZm9yRWFjaChmdW5jdGlvbih2YWwsIGtleSkge1xyXG5cdFx0dmFsLnZpc2libGUgPSBmYWxzZTtcclxuXHR9KTtcclxuXHRcclxuXHRmb3IobGV0IGk9bG93OyBpPHVwcDsgaSsrKSB7XHJcblx0XHRpZihjaG9yZHNNYXAuaGFzKGkpKSB7XHJcblx0XHRcdGxldCBsZW5ndGggPSBjaG9yZHNNYXAuZ2V0KGkpLmxlbmd0aDtcclxuXHRcdFx0Y29uc29sZS5sb2coY2hvcmRzTWFwLmdldChpKSk7XHJcblx0XHRcdGlmKGxlbmd0aCA9PT0gMSkge1xyXG5cdFx0XHRcdHNob3dPbmVQb2ludChjaG9yZHNNYXAuZ2V0KGkpWzBdKTtcclxuXHRcdFx0fSBlbHNlIGlmKGxlbmd0aCA9PT0gMikge1xyXG5cdFx0XHRcdHNob3dUd29Qb2ludHMoY2hvcmRzTWFwLmdldChpKSk7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYobGVuZ3RoID09PSAzKSB7XHJcblx0XHRcdFx0c2hvd1RocmVlUG9pbnRzKGNob3Jkc01hcC5nZXQoaSkpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNob3dQb2x5aGVkcm9uKGNob3Jkc01hcC5nZXQoaSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBhbmltYXRlKCkge1xyXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSggYW5pbWF0ZSApO1xyXG5cdHJlbmRlcigpO1xyXG5cdHN0YXRzLnVwZGF0ZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXIoKSB7XHJcblx0cmVuZGVyZXIucmVuZGVyKCBzY2VuZSwgY2FtZXJhICk7XHJcbn1cclxuIiwiLyoqXHJcbiogQ29udmVydCBGcm9tL1RvIEJpbmFyeS9EZWNpbWFsL0hleGFkZWNpbWFsIGluIEphdmFTY3JpcHRcclxuKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9mYWlzYWxtYW5cclxuKlxyXG4qIENvcHlyaWdodCAyMDEyLTIwMTUsIEZhaXNhbG1hbiA8Znl6bG1hbkBnbWFpbC5jb20+XHJcbiogTGljZW5zZWQgdW5kZXIgVGhlIE1JVCBMaWNlbnNlXHJcbiogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxyXG4qL1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgdmFyIENvbnZlcnRCYXNlID0gZnVuY3Rpb24gKG51bSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZyb20gOiBmdW5jdGlvbiAoYmFzZUZyb20pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG8gOiBmdW5jdGlvbiAoYmFzZVRvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChudW0sIGJhc2VGcm9tKS50b1N0cmluZyhiYXNlVG8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgICAgICBcclxuICAgIC8vIGJpbmFyeSB0byBkZWNpbWFsXHJcbiAgICBDb252ZXJ0QmFzZS5iaW4yZGVjID0gZnVuY3Rpb24gKG51bSkge1xyXG4gICAgICAgIHJldHVybiBDb252ZXJ0QmFzZShudW0pLmZyb20oMikudG8oMTApO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLy8gYmluYXJ5IHRvIGhleGFkZWNpbWFsXHJcbiAgICBDb252ZXJ0QmFzZS5iaW4yaGV4ID0gZnVuY3Rpb24gKG51bSkge1xyXG4gICAgICAgIHJldHVybiBDb252ZXJ0QmFzZShudW0pLmZyb20oMikudG8oMTYpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLy8gZGVjaW1hbCB0byBiaW5hcnlcclxuICAgIENvbnZlcnRCYXNlLmRlYzJiaW4gPSBmdW5jdGlvbiAobnVtKSB7XHJcbiAgICAgICAgcmV0dXJuIENvbnZlcnRCYXNlKG51bSkuZnJvbSgxMCkudG8oMik7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAvLyBkZWNpbWFsIHRvIGhleGFkZWNpbWFsXHJcbiAgICBDb252ZXJ0QmFzZS5kZWMyaGV4ID0gZnVuY3Rpb24gKG51bSkge1xyXG4gICAgICAgIHJldHVybiBDb252ZXJ0QmFzZShudW0pLmZyb20oMTApLnRvKDE2KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIC8vIGhleGFkZWNpbWFsIHRvIGJpbmFyeVxyXG4gICAgQ29udmVydEJhc2UuaGV4MmJpbiA9IGZ1bmN0aW9uIChudW0pIHtcclxuICAgICAgICByZXR1cm4gQ29udmVydEJhc2UobnVtKS5mcm9tKDE2KS50bygyKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIC8vIGhleGFkZWNpbWFsIHRvIGRlY2ltYWxcclxuICAgIENvbnZlcnRCYXNlLmhleDJkZWMgPSBmdW5jdGlvbiAobnVtKSB7XHJcbiAgICAgICAgcmV0dXJuIENvbnZlcnRCYXNlKG51bSkuZnJvbSgxNikudG8oMTApO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGhpcy5Db252ZXJ0QmFzZSA9IENvbnZlcnRCYXNlO1xyXG4gICAgXHJcbn0pKHRoaXMpO1xyXG5cclxuLypcclxuKiBVc2FnZSBleGFtcGxlOlxyXG4qIENvbnZlcnRCYXNlLmJpbjJkZWMoJzExMScpOyAvLyAnNydcclxuKiBDb252ZXJ0QmFzZS5kZWMyaGV4KCc0MicpOyAvLyAnMmEnXHJcbiogQ29udmVydEJhc2UuaGV4MmJpbignZjgnKTsgLy8gJzExMTExMDAwJ1xyXG4qIENvbnZlcnRCYXNlLmRlYzJiaW4oJzIyJyk7IC8vICcxMDExMCdcclxuKi9cclxuIiwiLypcclxuXHRQcm9qZWN0IE5hbWU6IG1pZGktcGFyc2VyLWpzXHJcblx0QXV0aG9yOiBjb2x4aVxyXG5cdEF1dGhvciBVUkk6IGh0dHA6Ly93d3cuY29seGkuaW5mby9cclxuXHREZXNjcmlwdGlvbjogTUlESVBhcnNlciBsaWJyYXJ5IHJlYWRzIC5NSUQgYmluYXJ5IGZpbGVzLCBCYXNlNjQgZW5jb2RlZCBNSURJIERhdGEsXHJcblx0b3IgVUludDggQXJyYXlzLCBhbmQgb3V0cHV0cyBhcyBhIHJlYWRhYmxlIGFuZCBzdHJ1Y3R1cmVkIEpTIG9iamVjdC5cclxuXHJcblx0LS0tICAgICBVc2FnZSBNZXRob2RzIFx0ICAgLS0tXHJcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdCogT1BUSU9OIDEgTkVXISAoTUlESVBhcnNlci5wYXJzZSlcclxuXHRXaWxsIGF1dG9kZXRlY3QgdGhlIHNvdXJjZSBhbmQgcHJvY2Nlc3MgdGhlIGRhdGEsIHVzaW5nIHRoZSBzdWl0YWJsZSBtZXRob2QuXHJcblxyXG5cdCogT1BUSU9OIDIgKE1JRElQYXJzZXIuYWRkTGlzdGVuZXIpXHJcblx0SU5QVVQgRUxFTUVOVCBMSVNURU5FUiA6IGNhbGwgTUlESVBhcnNlci5hZGRMaXN0ZW5lcihmaWxlSW5wdXRFbGVtZW50LGNhbGxiYWNGdW5jdGlvbikgZnVuY3Rpb24sIHNldHRpbmcgdGhlXHJcblx0SW5wdXQgRmlsZSBIVE1MIGVsZW1lbnQgdGhhdCB3aWxsIGhhbmRsZSB0aGUgZmlsZS5taWQgb3BlbmluZywgYW5kIGNhbGxiYWNrIGZ1bmN0aW9uXHJcblx0dGhhdCB3aWxsIHJlY2lldmUgdGhlIHJlc3VsdGluZyBPYmplY3QgZm9ybWF0ZWQsIHNldCBvZiBkYXRhLlxyXG5cclxuXHQqIE9QVElPTiAzIChNSURJUGFyc2VyLlVpbnQ4KVxyXG5cdFByb3ZpZGUgeW91ciBvd24gVUludDggQXJyYXkgdG8gTUlESVBhcnNlci5VaW50OCgpLCB0byBnZXQgYW4gT2JqZWN0IGZvcm1hdGVkLCBzZXQgb2YgZGF0YVxyXG5cclxuXHQqIE9QVElPTiA0IChNSURJUGFyc2VyLkJhc2U2NClcclxuXHRQcm92aWRlIGEgQmFzZTY0IGVuY29kZWQgRGF0YSB0byBNSURJUGFyc2VyLkJhc2U2NCgpLCAsIHRvIGdldCBhbiBPYmplY3QgZm9ybWF0ZWQsIHNldCBvZiBkYXRhXHJcblxyXG5cclxuXHQtLS0gIE91dHB1dCBPYmplY3QgU3BlY3MgICAtLS1cclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0TUlESU9iamVjdHtcclxuXHRcdGZvcm1hdFR5cGU6IDB8MXwyLCBcdFx0XHRcdFx0Ly8gTWlkaSBmb3JtYXQgdHlwZVxyXG5cdFx0dGltZURpdmlzaW9uOiAoaW50KSxcdFx0XHRcdC8vIHNvbmcgdGVtcG8gKGJwbSlcclxuXHRcdHRyYWNrczogKGludCksIFx0XHRcdFx0XHRcdC8vIHRvdGFsIHRyYWNrcyBjb3VudFxyXG5cdFx0dHJhY2s6IEFycmF5W1xyXG5cdFx0XHRbMF06IE9iamVjdHtcdFx0XHRcdFx0Ly8gVFJBQ0sgMSFcclxuXHRcdFx0XHRldmVudDogQXJyYXlbXHRcdFx0XHQvLyBNaWRpIGV2ZW50cyBpbiB0cmFjayAxXHJcblx0XHRcdFx0XHRbMF0gOiBPYmplY3R7XHRcdFx0Ly8gRVZFTlQgMVxyXG5cdFx0XHRcdFx0XHRkYXRhOiAoc3RyaW5nKSxcclxuXHRcdFx0XHRcdFx0ZGVsdGFUaW1lOiAoaW50KSxcclxuXHRcdFx0XHRcdFx0bWV0YVR5cGU6IChpbnQpLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiAoaW50KSxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRbMV0gOiBPYmplY3R7Li4ufVx0XHQvLyBFVkVOVCAyXHJcblx0XHRcdFx0XHRbMl0gOiBPYmplY3R7Li4ufVx0XHQvLyBFVkVOVCAzXHJcblx0XHRcdFx0XHQuLi5cclxuXHRcdFx0XHRdXHJcblx0XHRcdH0sXHJcblx0XHRcdFsxXSA6IE9iamVjdHsuLi59XHJcblx0XHRcdFsyXSA6IE9iamVjdHsuLi59XHJcblx0XHRcdC4uLlxyXG5cdFx0XVxyXG5cdH1cclxuXHJcbkRhdGEgZnJvbSBFdmVudCAxMiBvZiBUcmFjayAyIGNvdWxkIGJlIGVhc2lsbHkgcmVhZGVkIHdpdGg6XHJcbk91dHB1dE9iamVjdC50cmFja1syXS5ldmVudFsxMl0uZGF0YTtcclxuXHJcbiovXHJcblxyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gQ1JPU1NCUk9XU0VSICYgTk9ERWpzIFBPTFlGSUxMIGZvciBBVE9CKCkgLSBCeTogaHR0cHM6Ly9naXRodWIuY29tL01heEFydDI1MDEgKG1vZGlmaWVkKVxyXG52YXIgX2F0b2IgPSBmdW5jdGlvbihzdHJpbmcpIHtcclxuXHQvLyBiYXNlNjQgY2hhcmFjdGVyIHNldCwgcGx1cyBwYWRkaW5nIGNoYXJhY3RlciAoPSlcclxuXHR2YXIgYjY0ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiO1xyXG5cdC8vIFJlZ3VsYXIgZXhwcmVzc2lvbiB0byBjaGVjayBmb3JtYWwgY29ycmVjdG5lc3Mgb2YgYmFzZTY0IGVuY29kZWQgc3RyaW5nc1xyXG5cdHZhciBiNjRyZSA9IC9eKD86W0EtWmEtelxcZCtcXC9dezR9KSo/KD86W0EtWmEtelxcZCtcXC9dezJ9KD86PT0pP3xbQS1aYS16XFxkK1xcL117M309Pyk/JC87XHJcblx0Ly8gcmVtb3ZlIGRhdGEgdHlwZSBzaWduYXR1cmVzIGF0IHRoZSBiZWdpbmluZyBvZiB0aGUgc3RyaW5nXHJcblx0Ly8gZWcgOiAgXCJkYXRhOmF1ZGlvL21pZDtiYXNlNjQsXCJcclxuICAgXHRzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSggL14uKj9iYXNlNjQsLyAsIFwiXCIpO1xyXG4gICAgLy8gYXRvYiBjYW4gd29yayB3aXRoIHN0cmluZ3Mgd2l0aCB3aGl0ZXNwYWNlcywgZXZlbiBpbnNpZGUgdGhlIGVuY29kZWQgcGFydCxcclxuICAgIC8vIGJ1dCBvbmx5IFxcdCwgXFxuLCBcXGYsIFxcciBhbmQgJyAnLCB3aGljaCBjYW4gYmUgc3RyaXBwZWQuXHJcbiAgICBzdHJpbmcgPSBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC9bXFx0XFxuXFxmXFxyIF0rL2csIFwiXCIpO1xyXG4gICAgaWYgKCFiNjRyZS50ZXN0KHN0cmluZykpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBleGVjdXRlICdfYXRvYicgOiBUaGUgc3RyaW5nIHRvIGJlIGRlY29kZWQgaXMgbm90IGNvcnJlY3RseSBlbmNvZGVkLlwiKTtcclxuXHJcbiAgICAvLyBBZGRpbmcgdGhlIHBhZGRpbmcgaWYgbWlzc2luZywgZm9yIHNlbXBsaWNpdHlcclxuICAgIHN0cmluZyArPSBcIj09XCIuc2xpY2UoMiAtIChzdHJpbmcubGVuZ3RoICYgMykpO1xyXG4gICAgdmFyIGJpdG1hcCwgcmVzdWx0ID0gXCJcIiwgcjEsIHIyLCBpID0gMDtcclxuICAgIGZvciAoOyBpIDwgc3RyaW5nLmxlbmd0aDspIHtcclxuICAgICAgICBiaXRtYXAgPSBiNjQuaW5kZXhPZihzdHJpbmcuY2hhckF0KGkrKykpIDw8IDE4IHwgYjY0LmluZGV4T2Yoc3RyaW5nLmNoYXJBdChpKyspKSA8PCAxMlxyXG4gICAgICAgICAgICAgICAgfCAocjEgPSBiNjQuaW5kZXhPZihzdHJpbmcuY2hhckF0KGkrKykpKSA8PCA2IHwgKHIyID0gYjY0LmluZGV4T2Yoc3RyaW5nLmNoYXJBdChpKyspKSk7XHJcblxyXG4gICAgICAgIHJlc3VsdCArPSByMSA9PT0gNjQgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJpdG1hcCA+PiAxNiAmIDI1NSlcclxuICAgICAgICAgICAgICAgIDogcjIgPT09IDY0ID8gU3RyaW5nLmZyb21DaGFyQ29kZShiaXRtYXAgPj4gMTYgJiAyNTUsIGJpdG1hcCA+PiA4ICYgMjU1KVxyXG4gICAgICAgICAgICAgICAgOiBTdHJpbmcuZnJvbUNoYXJDb2RlKGJpdG1hcCA+PiAxNiAmIDI1NSwgYml0bWFwID4+IDggJiAyNTUsIGJpdG1hcCAmIDI1NSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuXHJcbnZhciBNSURJUGFyc2VyID0ge1xyXG5cdC8vIGRlYnVnIChib29sKSwgd2hlbiBlbmFibGVkIHdpbGwgbG9nIGluIGNvbnNvbGUgdW5pbXBsZW1lbnRlZCBldmVudHMgd2FybmluZ3MgYW5kIGludGVybmFsIGhhbmRsZWQgZXJyb3JzLlxyXG5cdGRlYnVnOiBmYWxzZSxcclxuXHJcblx0cGFyc2U6IGZ1bmN0aW9uKGlucHV0LCBfY2FsbGJhY2spe1xyXG5cdFx0aWYoaW5wdXQgaW5zdGFuY2VvZiBVaW50OEFycmF5KSByZXR1cm4gTUlESVBhcnNlci5VaW50OChpbnB1dCk7XHJcblx0XHRlbHNlIGlmKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHJldHVybiBNSURJUGFyc2VyLkJhc2U2NChpbnB1dCk7XHJcblx0XHRlbHNlIGlmKGlucHV0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgaW5wdXQudHlwZSA9PT0gJ2ZpbGUnKSByZXR1cm4gTUlESVBhcnNlci5hZGRMaXN0ZW5lcihpbnB1dCAsIF9jYWxsYmFjayk7XHJcblx0XHRlbHNlIHRocm93IG5ldyBFcnJvcignTUlESVBhcnNlci5wYXJzZSgpIDogSW52YWxpZCBpbnB1dCBwcm92aWRlZCcpO1xyXG5cdH0sXHJcblx0Ly8gYWRkTGlzdGVuZXIoKSBzaG91bGQgYmUgY2FsbGVkIGluIG9yZGVyIGF0dGFjaCBhIGxpc3RlbmVyIHRvIHRoZSBJTlBVVCBIVE1MIGVsZW1lbnRcclxuXHQvLyB0aGF0IHdpbGwgcHJvdmlkZSB0aGUgYmluYXJ5IGRhdGEgYXV0b21hdGluZyB0aGUgY29udmVyc2lvbiwgYW5kIHJldHVybmluZ1xyXG5cdC8vIHRoZSBzdHJ1Y3R1cmVkIGRhdGEgdG8gdGhlIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG5cdGFkZExpc3RlbmVyOiBmdW5jdGlvbihfZmlsZUVsZW1lbnQsIF9jYWxsYmFjayl7XHJcblx0XHRpZighRmlsZSB8fCAhRmlsZVJlYWRlcikgdGhyb3cgbmV3IEVycm9yKCdUaGUgRmlsZXxGaWxlUmVhZGVyIEFQSXMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyLiBVc2UgaW5zdGVhZCBNSURJUGFyc2VyLkJhc2U2NCgpIG9yIE1JRElQYXJzZXIuVWludDgoKScpO1xyXG5cclxuXHRcdC8vIHZhbGlkYXRlIHByb3ZpZGVkIGVsZW1lbnRcclxuXHRcdGlmKCBfZmlsZUVsZW1lbnQgPT09IHVuZGVmaW5lZCB8fFxyXG5cdFx0XHQhKF9maWxlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB8fFxyXG5cdFx0XHRfZmlsZUVsZW1lbnQudGFnTmFtZSAhPT0gJ0lOUFVUJyB8fFxyXG5cdFx0XHRfZmlsZUVsZW1lbnQudHlwZS50b0xvd2VyQ2FzZSgpICE9PSAnZmlsZScgKXtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ01JRElQYXJzZXIuYWRkTGlzdGVuZXIoKSA6IFByb3ZpZGVkIGVsZW1lbnQgaXMgbm90IGEgdmFsaWQgRklMRSBJTlBVVCBlbGVtZW50Jyk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0X2NhbGxiYWNrID0gX2NhbGxiYWNrIHx8IGZ1bmN0aW9uKCl7fTtcclxuXHJcblx0XHRfZmlsZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oSW5wdXRFdnQpe1x0XHRcdFx0Ly8gc2V0IHRoZSAnZmlsZSBzZWxlY3RlZCcgZXZlbnQgaGFuZGxlclxyXG5cdFx0XHRpZiAoIUlucHV0RXZ0LnRhcmdldC5maWxlcy5sZW5ndGgpIHJldHVybiBmYWxzZTtcdFx0XHRcdFx0Ly8gcmV0dXJuIGZhbHNlIGlmIG5vIGVsZW1lbnRzIHdoZXJlIHNlbGVjdGVkXHJcblx0XHRcdGNvbnNvbGUubG9nKCdNSURJUGFyc2VyLmFkZExpc3RlbmVyKCkgOiBGaWxlIGRldGVjdGVkIGluIElOUFVUIEVMRU1FTlQgcHJvY2Vzc2luZyBkYXRhLi4nKTtcclxuXHRcdFx0dmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBwcmVwYXJlIHRoZSBmaWxlIFJlYWRlclxyXG5cdFx0XHRyZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoSW5wdXRFdnQudGFyZ2V0LmZpbGVzWzBdKTtcdFx0XHRcdFx0Ly8gcmVhZCB0aGUgYmluYXJ5IGRhdGFcclxuXHRcdFx0cmVhZGVyLm9ubG9hZCA9ICBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRfY2FsbGJhY2soIE1JRElQYXJzZXIuVWludDgobmV3IFVpbnQ4QXJyYXkoZS50YXJnZXQucmVzdWx0KSkpOyBcdC8vIGVuY29kZSBkYXRhIHdpdGggVWludDhBcnJheSBhbmQgY2FsbCB0aGUgcGFyc2VyXHJcblx0XHRcdH07XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRCYXNlNjQgOiBmdW5jdGlvbihiNjRTdHJpbmcpe1xyXG5cdFx0YjY0U3RyaW5nID0gU3RyaW5nKGI2NFN0cmluZyk7XHJcblxyXG5cdFx0dmFyIHJhdyA9IF9hdG9iKGI2NFN0cmluZyk7XHJcblx0XHR2YXIgcmF3TGVuZ3RoID0gcmF3Lmxlbmd0aDtcclxuXHRcdHZhciBhcnJheSA9IG5ldyBVaW50OEFycmF5KG5ldyBBcnJheUJ1ZmZlcihyYXdMZW5ndGgpKTtcclxuXHJcblx0XHRmb3IodmFyIGk9MDsgaTxyYXdMZW5ndGg7IGkrKykgYXJyYXlbaV0gPSByYXcuY2hhckNvZGVBdChpKTtcclxuXHRcdHJldHVybiAgTUlESVBhcnNlci5VaW50OChhcnJheSkgO1xyXG5cdH0sXHJcblxyXG5cdC8vIHBhcnNlKCkgZnVuY3Rpb24gcmVhZHMgdGhlIGJpbmFyeSBkYXRhLCBpbnRlcnByZXRpbmcgYW5kIHNwbGl0aW5nIGVhY2ggY2h1Y2tcclxuXHQvLyBhbmQgcGFyc2luZyBpdCB0byBhIHN0cnVjdHVyZWQgT2JqZWN0LiBXaGVuIGpvYiBpcyBmaW5pc2VkIHJldHVybnMgdGhlIG9iamVjdFxyXG5cdC8vIG9yICdmYWxzZScgaWYgYW55IGVycm9yIHdhcyBnZW5lcmF0ZWQuXHJcblx0VWludDg6IGZ1bmN0aW9uKEZpbGVBc1VpbnQ4QXJyYXkpe1xyXG5cdFx0dmFyIGZpbGUgPSB7XHJcblx0XHRcdGRhdGE6IG51bGwsXHJcblx0XHRcdHBvaW50ZXI6IDAsXHJcblx0XHRcdG1vdmVQb2ludGVyOiBmdW5jdGlvbihfYnl0ZXMpe1x0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gbW92ZSB0aGUgcG9pbnRlciBuZWdhdGl2ZSBhbmQgcG9zaXRpdmUgZGlyZWN0aW9uXHJcblx0XHRcdFx0dGhpcy5wb2ludGVyICs9IF9ieXRlcztcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5wb2ludGVyO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZWFkSW50OiBmdW5jdGlvbihfYnl0ZXMpeyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IGludGVnZXIgZnJvbSBuZXh0IF9ieXRlcyBncm91cCAoYmlnLWVuZGlhbilcclxuXHRcdFx0XHRfYnl0ZXMgPSBNYXRoLm1pbihfYnl0ZXMsIHRoaXMuZGF0YS5ieXRlTGVuZ3RoLXRoaXMucG9pbnRlcik7XHJcblx0XHRcdFx0aWYgKF9ieXRlcyA8IDEpIHJldHVybiAtMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRU9GXHJcblx0XHRcdFx0dmFyIHZhbHVlID0gMDtcclxuXHRcdFx0XHRpZihfYnl0ZXMgPiAxKXtcclxuXHRcdFx0XHRcdGZvcih2YXIgaT0xOyBpPD0gKF9ieXRlcy0xKTsgaSsrKXtcclxuXHRcdFx0XHRcdFx0dmFsdWUgKz0gdGhpcy5kYXRhLmdldFVpbnQ4KHRoaXMucG9pbnRlcikgKiBNYXRoLnBvdygyNTYsIChfYnl0ZXMgLSBpKSk7XHJcblx0XHRcdFx0XHRcdHRoaXMucG9pbnRlcisrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YWx1ZSArPSB0aGlzLmRhdGEuZ2V0VWludDgodGhpcy5wb2ludGVyKTtcclxuXHRcdFx0XHR0aGlzLnBvaW50ZXIrKztcclxuXHRcdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHRcdH0sXHJcblx0XHRcdHJlYWRTdHI6IGZ1bmN0aW9uKF9ieXRlcyl7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIHJlYWQgYXMgQVNDSUkgY2hhcnMsIHRoZSBmb2xsb3dvaW5nIF9ieXRlc1xyXG5cdFx0XHRcdHZhciB0ZXh0ID0gJyc7XHJcblx0XHRcdFx0Zm9yKHZhciBjaGFyPTE7IGNoYXIgPD0gX2J5dGVzOyBjaGFyKyspIHRleHQgKz0gIFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5yZWFkSW50KDEpKTtcclxuXHRcdFx0XHRyZXR1cm4gdGV4dDtcclxuXHRcdFx0fSxcclxuXHRcdFx0cmVhZEludFZMVjogZnVuY3Rpb24oKXtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyByZWFkIGEgdmFyaWFibGUgbGVuZ3RoIHZhbHVlXHJcblx0XHRcdFx0dmFyIHZhbHVlID0gMDtcclxuXHRcdFx0XHRpZiAoIHRoaXMucG9pbnRlciA+PSB0aGlzLmRhdGEuYnl0ZUxlbmd0aCApe1xyXG5cdFx0XHRcdFx0cmV0dXJuIC0xO1x0XHRcdFx0XHRcdFx0XHRcdC8vIEVPRlxyXG5cdFx0XHRcdH1lbHNlIGlmKHRoaXMuZGF0YS5nZXRVaW50OCh0aGlzLnBvaW50ZXIpIDwgMTI4KXtcdFx0XHRcdFx0Ly8gLi4udmFsdWUgaW4gYSBzaW5nbGUgYnl0ZVxyXG5cdFx0XHRcdFx0dmFsdWUgPSB0aGlzLnJlYWRJbnQoMSk7XHJcblx0XHRcdFx0fWVsc2V7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gLi4udmFsdWUgaW4gbXVsdGlwbGUgYnl0ZXNcclxuXHRcdFx0XHRcdHZhciBGaXJzdEJ5dGVzID0gW107XHJcblx0XHRcdFx0XHR3aGlsZSh0aGlzLmRhdGEuZ2V0VWludDgodGhpcy5wb2ludGVyKSA+PSAxMjgpe1xyXG5cdFx0XHRcdFx0XHRGaXJzdEJ5dGVzLnB1c2godGhpcy5yZWFkSW50KDEpIC0gMTI4KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHZhciBsYXN0Qnl0ZSAgPSB0aGlzLnJlYWRJbnQoMSk7XHJcblx0XHRcdFx0XHRmb3IodmFyIGR0ID0gMTsgZHQgPD0gRmlyc3RCeXRlcy5sZW5ndGg7IGR0Kyspe1xyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IEZpcnN0Qnl0ZXNbRmlyc3RCeXRlcy5sZW5ndGggLSBkdF0gKiBNYXRoLnBvdygxMjgsIGR0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHZhbHVlICs9IGxhc3RCeXRlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0ZmlsZS5kYXRhID0gbmV3IERhdGFWaWV3KEZpbGVBc1VpbnQ4QXJyYXkuYnVmZmVyLCBGaWxlQXNVaW50OEFycmF5LmJ5dGVPZmZzZXQsIEZpbGVBc1VpbnQ4QXJyYXkuYnl0ZUxlbmd0aCk7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIDggYml0cyBieXRlcyBmaWxlIGRhdGEgYXJyYXlcclxuXHRcdC8vICAqKiByZWFkIEZJTEUgSEVBREVSXHJcblx0XHRpZihmaWxlLnJlYWRJbnQoNCkgIT09IDB4NEQ1NDY4NjQpe1xyXG5cdFx0XHRjb25zb2xlLndhcm4oJ0hlYWRlciB2YWxpZGF0aW9uIGZhaWxlZCAobm90IE1JREkgc3RhbmRhcmQgb3IgZmlsZSBjb3JydXB0LiknKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlOyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSGVhZGVyIHZhbGlkYXRpb24gZmFpbGVkIChub3QgTUlESSBzdGFuZGFyZCBvciBmaWxlIGNvcnJ1cHQuKVxyXG5cdFx0fVxyXG5cdFx0dmFyIGhlYWRlclNpemUgXHRcdFx0PSBmaWxlLnJlYWRJbnQoNCk7XHRcdFx0XHRcdFx0XHRcdC8vIGhlYWRlciBzaXplICh1bnVzZWQgdmFyKSwgZ2V0dGVkIGp1c3QgZm9yIHJlYWQgcG9pbnRlciBtb3ZlbWVudFxyXG5cdFx0dmFyIE1JREkgXHRcdFx0XHQ9IHt9O1x0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjcmVhdGUgbmV3IG1pZGkgb2JqZWN0XHJcblx0XHRNSURJLmZvcm1hdFR5cGUgICBcdFx0PSBmaWxlLnJlYWRJbnQoMik7XHRcdFx0XHRcdFx0XHRcdC8vIGdldCBNSURJIEZvcm1hdCBUeXBlXHJcblx0XHRNSURJLnRyYWNrcyBcdFx0XHQ9IGZpbGUucmVhZEludCgyKTtcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IGFtbW91bnQgb2YgdHJhY2sgY2h1bmtzXHJcblx0XHRNSURJLnRyYWNrXHRcdFx0XHQ9IFtdO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjcmVhdGUgYXJyYXkga2V5IGZvciB0cmFjayBkYXRhIHN0b3JpbmdcclxuXHRcdHZhciB0aW1lRGl2aXNpb25CeXRlMSAgID0gZmlsZS5yZWFkSW50KDEpO1x0XHRcdFx0XHRcdFx0XHQvLyBnZXQgVGltZSBEaXZpc2lvbiBmaXJzdCBieXRlXHJcblx0XHR2YXIgdGltZURpdmlzaW9uQnl0ZTIgICA9IGZpbGUucmVhZEludCgxKTtcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IFRpbWUgRGl2aXNpb24gc2Vjb25kIGJ5dGVcclxuXHRcdGlmKHRpbWVEaXZpc2lvbkJ5dGUxID49IDEyOCl7IFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBkaXNjb3ZlciBUaW1lIERpdmlzaW9uIG1vZGUgKGZwcyBvciB0cGYpXHJcblx0XHRcdE1JREkudGltZURpdmlzaW9uICAgID0gW107XHJcblx0XHRcdE1JREkudGltZURpdmlzaW9uWzBdID0gdGltZURpdmlzaW9uQnl0ZTEgLSAxMjg7XHRcdFx0XHRcdFx0Ly8gZnJhbWVzIHBlciBzZWNvbmQgTU9ERSAgKDFzdCBieXRlKVxyXG5cdFx0XHRNSURJLnRpbWVEaXZpc2lvblsxXSA9IHRpbWVEaXZpc2lvbkJ5dGUyO1x0XHRcdFx0XHRcdFx0Ly8gdGlja3MgaW4gZWFjaCBmcmFtZSAgICAgKDJuZCBieXRlKVxyXG5cdFx0fWVsc2UgTUlESS50aW1lRGl2aXNpb24gID0gKHRpbWVEaXZpc2lvbkJ5dGUxICogMjU2KSArIHRpbWVEaXZpc2lvbkJ5dGUyOy8vIGVsc2UuLi4gdGlja3MgcGVyIGJlYXQgTU9ERSAgKDIgYnl0ZXMgdmFsdWUpXHJcblx0XHQvLyAgKiogcmVhZCBUUkFDSyBDSFVOS1xyXG5cdFx0Zm9yKHZhciB0PTE7IHQgPD0gTUlESS50cmFja3M7IHQrKyl7XHJcblx0XHRcdE1JREkudHJhY2tbdC0xXSBcdD0ge2V2ZW50OiBbXX07XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY3JlYXRlIG5ldyBUcmFjayBlbnRyeSBpbiBBcnJheVxyXG5cdFx0XHR2YXIgaGVhZGVyVmFsaWRhdGlvbiA9IGZpbGUucmVhZEludCg0KTtcclxuXHRcdFx0aWYgKCBoZWFkZXJWYWxpZGF0aW9uID09PSAtMSApIGJyZWFrO1x0XHRcdFx0XHRcdFx0Ly8gRU9GXHJcblx0XHRcdGlmKGhlYWRlclZhbGlkYXRpb24gIT09IDB4NEQ1NDcyNkIpIHJldHVybiBmYWxzZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcmFjayBjaHVuayBoZWFkZXIgdmFsaWRhdGlvbiBmYWlsZWQuXHJcblx0XHRcdGZpbGUucmVhZEludCg0KTtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIG1vdmUgcG9pbnRlci4gZ2V0IGNodW5rIHNpemUgKGJ5dGVzIGxlbmd0aClcclxuXHRcdFx0dmFyIGVcdFx0ICBcdFx0PSAwO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBpbml0IGV2ZW50IGNvdW50ZXJcclxuXHRcdFx0dmFyIGVuZE9mVHJhY2sgXHRcdD0gZmFsc2U7XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBGTEFHIGZvciB0cmFjayByZWFkaW5nIHNlY3VlbmNlIGJyZWFraW5nXHJcblx0XHRcdC8vICoqIHJlYWQgRVZFTlQgQ0hVTktcclxuXHRcdFx0dmFyIHN0YXR1c0J5dGU7XHJcblx0XHRcdHZhciBsYXN0c3RhdHVzQnl0ZTtcclxuXHRcdFx0d2hpbGUoIWVuZE9mVHJhY2spe1xyXG5cdFx0XHRcdGUrKztcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBpbmNyZWFzZSBieSAxIGV2ZW50IGNvdW50ZXJcclxuXHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXSA9IHt9O1x0IFx0XHRcdFx0XHRcdFx0Ly8gY3JlYXRlIG5ldyBldmVudCBvYmplY3QsIGluIGV2ZW50cyBhcnJheVxyXG5cdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRlbHRhVGltZSAgPSBmaWxlLnJlYWRJbnRWTFYoKTtcdFx0Ly8gZ2V0IERFTFRBIFRJTUUgT0YgTUlESSBldmVudCAoVmFyaWFibGUgTGVuZ3RoIFZhbHVlKVxyXG5cdFx0XHRcdHN0YXR1c0J5dGUgPSBmaWxlLnJlYWRJbnQoMSk7XHRcdFx0XHRcdFx0XHRcdFx0Ly8gcmVhZCBFVkVOVCBUWVBFIChTVEFUVVMgQllURSlcclxuXHRcdFx0XHRpZihzdGF0dXNCeXRlID09PSAtMSkgYnJlYWs7XHRcdFx0XHRcdFx0XHRcdFx0Ly8gRU9GXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHN0YXR1c0J5dGUgPj0gMTI4KSBsYXN0c3RhdHVzQnl0ZSA9IHN0YXR1c0J5dGU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5FVyBTVEFUVVMgQllURSBERVRFQ1RFRFxyXG5cdFx0XHRcdGVsc2V7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gJ1JVTk5JTkcgU1RBVFVTJyBzaXR1YXRpb24gZGV0ZWN0ZWRcclxuXHRcdFx0XHRcdHN0YXR1c0J5dGUgPSBsYXN0c3RhdHVzQnl0ZTtcdFx0XHRcdFx0XHRcdFx0Ly8gYXBwbHkgbGFzdCBsb29wLCBTdGF0dXMgQnl0ZVxyXG5cdFx0XHRcdFx0ZmlsZS5tb3ZlUG9pbnRlcigtMSk7IFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gbW92ZSBiYWNrIHRoZSBwb2ludGVyIChjYXVzZSByZWFkZWQgYnl0ZSBpcyBub3Qgc3RhdHVzIGJ5dGUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vICoqIElkZW50aWZ5IEVWRU5UXHJcblx0XHRcdFx0aWYoc3RhdHVzQnl0ZSA9PT0gMHhGRil7IFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTWV0YSBFdmVudCB0eXBlXHJcblx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS50eXBlID0gMHhGRjtcdFx0XHRcdFx0XHQvLyBhc3NpZ24gbWV0YUV2ZW50IGNvZGUgdG8gYXJyYXlcclxuXHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLm1ldGFUeXBlID0gIGZpbGUucmVhZEludCgxKTtcdFx0Ly8gYXNzaWduIG1ldGFFdmVudCBzdWJ0eXBlXHJcblx0XHRcdFx0XHR2YXIgbWV0YUV2ZW50TGVuZ3RoID0gZmlsZS5yZWFkSW50VkxWKCk7XHRcdFx0XHRcdC8vIGdldCB0aGUgbWV0YUV2ZW50IGxlbmd0aFxyXG5cdFx0XHRcdFx0c3dpdGNoKE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLm1ldGFUeXBlKXtcclxuXHRcdFx0XHRcdFx0Y2FzZSAweDJGOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGVuZCBvZiB0cmFjaywgaGFzIG5vIGRhdGEgYnl0ZVxyXG5cdFx0XHRcdFx0XHRjYXNlIC0xOlx0XHRcdFx0XHRcdFx0XHRcdC8vIEVPRlxyXG5cdFx0XHRcdFx0XHRcdGVuZE9mVHJhY2sgPSB0cnVlO1x0XHRcdFx0XHRcdFx0XHRcdC8vIGNoYW5nZSBGTEFHIHRvIGZvcmNlIHRyYWNrIHJlYWRpbmcgbG9vcCBicmVha2luZ1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDB4MDE6IFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFRleHQgRXZlbnRcclxuXHRcdFx0XHRcdFx0Y2FzZSAweDAyOiAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIENvcHlyaWdodCBOb3RpY2VcclxuXHRcdFx0XHRcdFx0Y2FzZSAweDAzOiAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFNlcXVlbmNlL1RyYWNrIE5hbWUgKGRvY3VtZW50YXRpb246IGh0dHA6Ly93d3cudGE3LmRlL3R4dC9tdXNpay9tdXNpMDAwNi5odG0pXHJcblx0XHRcdFx0XHRcdGNhc2UgMHgwNjogIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBNYXJrZXJcclxuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkU3RyKG1ldGFFdmVudExlbmd0aCk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMHgyMTogXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTUlESSBQT1JUXHJcblx0XHRcdFx0XHRcdGNhc2UgMHg1OTogXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gS2V5IFNpZ25hdHVyZVxyXG5cdFx0XHRcdFx0XHRjYXNlIDB4NTE6XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gU2V0IFRlbXBvXHJcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IGZpbGUucmVhZEludChtZXRhRXZlbnRMZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDB4NTQ6IFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFNNUFRFIE9mZnNldFxyXG5cdFx0XHRcdFx0XHRjYXNlIDB4NTg6IFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFRpbWUgU2lnbmF0dXJlXHJcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVx0ICAgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzBdID0gZmlsZS5yZWFkSW50KDEpO1xyXG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbMV0gPSBmaWxlLnJlYWRJbnQoMSk7XHJcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVsyXSA9IGZpbGUucmVhZEludCgxKTtcclxuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzNdID0gZmlsZS5yZWFkSW50KDEpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRkZWZhdWx0IDpcclxuXHRcdFx0XHRcdFx0XHRmaWxlLnJlYWRJbnQobWV0YUV2ZW50TGVuZ3RoKTtcclxuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkSW50KG1ldGFFdmVudExlbmd0aCk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuZGVidWcpIGNvbnNvbGUuaW5mbygnVW5pbXBsZW1lbnRlZCAweEZGIGV2ZW50ISBkYXRhIGJsb2NrIHJlYWRlZCBhcyBJbnRlZ2VyJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2V7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTUlESSBDb250cm9sIEV2ZW50cyBPUiBTeXN0ZW0gRXhjbHVzaXZlIEV2ZW50c1xyXG5cdFx0XHRcdFx0c3RhdHVzQnl0ZSA9IHN0YXR1c0J5dGUudG9TdHJpbmcoMTYpLnNwbGl0KCcnKTtcdFx0XHRcdC8vIHNwbGl0IHRoZSBzdGF0dXMgYnl0ZSBIRVggcmVwcmVzZW50YXRpb24sIHRvIG9idGFpbiA0IGJpdHMgdmFsdWVzXHJcblx0XHRcdFx0XHRpZighc3RhdHVzQnl0ZVsxXSkgc3RhdHVzQnl0ZS51bnNoaWZ0KCcwJyk7XHRcdFx0XHRcdC8vIGZvcmNlIDIgZGlnaXRzXHJcblx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS50eXBlID0gcGFyc2VJbnQoc3RhdHVzQnl0ZVswXSwgMTYpOy8vIGZpcnN0IGJ5dGUgaXMgRVZFTlQgVFlQRSBJRFxyXG5cdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uY2hhbm5lbCA9IHBhcnNlSW50KHN0YXR1c0J5dGVbMV0sIDE2KTsvLyBzZWNvbmQgYnl0ZSBpcyBjaGFubmVsXHJcblx0XHRcdFx0XHRzd2l0Y2goTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0udHlwZSl7XHJcblx0XHRcdFx0XHRcdGNhc2UgMHhGOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFN5c3RlbSBFeGNsdXNpdmUgRXZlbnRzXHJcblx0XHRcdFx0XHRcdFx0dmFyIGV2ZW50X2xlbmd0aCA9IGZpbGUucmVhZEludFZMVigpO1xyXG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBmaWxlLnJlYWRJbnQoZXZlbnRfbGVuZ3RoKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5kZWJ1ZykgY29uc29sZS5pbmZvKCdVbmltcGxlbWVudGVkIDB4RiBleGNsdXNpdmUgZXZlbnRzISBkYXRhIGJsb2NrIHJlYWRlZCBhcyBJbnRlZ2VyJyk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMHhBOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIE5vdGUgQWZ0ZXJ0b3VjaFxyXG5cdFx0XHRcdFx0XHRjYXNlIDB4QjpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBDb250cm9sbGVyXHJcblx0XHRcdFx0XHRcdGNhc2UgMHhFOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFBpdGNoIEJlbmQgRXZlbnRcclxuXHRcdFx0XHRcdFx0Y2FzZSAweDg6XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTm90ZSBvZmZcclxuXHRcdFx0XHRcdFx0Y2FzZSAweDk6XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTm90ZSBPblxyXG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzBdID0gZmlsZS5yZWFkSW50KDEpO1xyXG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbMV0gPSBmaWxlLnJlYWRJbnQoMSk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMHhDOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFByb2dyYW0gQ2hhbmdlXHJcblx0XHRcdFx0XHRcdGNhc2UgMHhEOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIENoYW5uZWwgQWZ0ZXJ0b3VjaFxyXG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBmaWxlLnJlYWRJbnQoMSk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgLTE6XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gRU9GXHJcblx0XHRcdFx0XHRcdFx0ZW5kT2ZUcmFjayA9IHRydWU7XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2hhbmdlIEZMQUcgdG8gZm9yY2UgdHJhY2sgcmVhZGluZyBsb29wIGJyZWFraW5nXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybignVW5rbm93biBFVkVOVCBkZXRlY3RlZC4uLi4gcmVhZGluZyBjYW5jZWxsZWQhJyk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIE1JREk7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbmlmKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IE1JRElQYXJzZXI7XHJcbiIsImxldCBjaG9yZHNNYXAgPSBuZXcgTWFwKCk7XHJcblxyXG5mdW5jdGlvbiBwYXJzZU1pZGkoKSB7XHJcblx0Y29uc3QgaW5wdXRFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpbGUtaW5wdXQnKTtcclxuXHRsZXQgZmlsZSA9IGlucHV0RWxlbS5maWxlc1swXTtcclxuXHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblxyXG5cdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRsZXQgdWludDhhcnJheSA9IG5ldyBVaW50OEFycmF5KGUudGFyZ2V0LnJlc3VsdCk7XHJcblx0XHRsZXQgcGFyc2VkID0gTUlESVBhcnNlci5VaW50OCh1aW50OGFycmF5KTtcclxuXHJcblx0XHRmb3IodHJhY2sgb2YgcGFyc2VkLnRyYWNrKSB7XHJcblxyXG5cdFx0XHRsZXQgZGVsdGFUaW1lID0gMDtcclxuXHRcdFx0bGV0IG5vdGU7XHJcblx0XHRcclxuXHRcdFx0Zm9yKGV2ZW50IG9mIHRyYWNrLmV2ZW50KSB7XHJcblx0XHRcdFx0ZGVsdGFUaW1lICs9IGV2ZW50LmRlbHRhVGltZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZihldmVudC50eXBlID09PSA5KSB7XHJcblxyXG5cdFx0XHRcdFx0bm90ZSA9IGV2ZW50LmRhdGFbMF0gJSAxMjtcclxuXHJcblx0XHRcdFx0XHRpZihjaG9yZHNNYXAuaGFzKGRlbHRhVGltZSkpIHtcclxuXHRcdFx0XHRcdFx0Y2hvcmRzTWFwLmdldChkZWx0YVRpbWUpLnB1c2gobm90ZSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRjaG9yZHNNYXAuc2V0KGRlbHRhVGltZSwgW25vdGVdKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly90ZXN0XHJcblxyXG5cdFx0Y29uc29sZS5sb2coY2hvcmRzTWFwKTtcclxuXHJcblx0XHQvLyBsZXQgYWRkZWRDaG9yZHNNYXAgPSB7fTtcclxuXHJcblx0XHQvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkoYWRkZWRDaG9yZHNNYXAsICdoYXNWYWx1ZUFycmF5Jywge1xyXG5cdFx0Ly8gXHRlbnVtZXJhYmxlOiBmYWxzZSxcclxuXHRcdC8vIFx0dmFsdWU6IGZ1bmN0aW9uKGFycmF5KSB7XHJcblx0XHQvLyBcdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpO1xyXG5cdFx0Ly8gXHRcdGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXModGhpcyk7XHJcblxyXG5cdFx0Ly8gXHRcdGZvcihsZXQga2V5IG9mIGtleXMpIHtcclxuXHRcdC8vIFx0XHRcdGlmKEpTT04uc3RyaW5naWZ5KHRoaXNba2V5XS5zb3J0KCkpID09PSBKU09OLnN0cmluZ2lmeShhcnJheS5zb3J0KCkpKSB7XHJcblx0XHQvLyBcdFx0XHRcdC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodGhpc1trZXldLnNvcnQoKSkgKyAnICAgJyArIEpTT04uc3RyaW5naWZ5KGFycmF5LnNvcnQoKSkpO1xyXG5cdFx0Ly8gXHRcdFx0XHRyZXR1cm4ga2V5O1xyXG5cdFx0Ly8gXHRcdFx0fVxyXG5cdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHJcblx0XHQvLyBcdFx0cmV0dXJuIC0xO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyB9KTtcclxuXHJcblx0XHQvLyBsZXQgcHJldjtcclxuXHRcdC8vIGxldCBleGlzdGluZ0Nob3JkS2V5O1xyXG5cdFx0Ly8gbGV0IG5iQ2hvcmRzID0gMDtcclxuXHRcdC8vIGxldCBuYlNhbWVDaG9yZHMgPSAwO1xyXG5cclxuXHRcdC8vIC8vZm9yIGV2ZXJ5IGV2ZW50IHRpbWUgaW4gdGhlIHNvbmdcclxuXHRcdC8vIGZvcih2YXIgdGltZSBpbiBjaG9yZHNNYXApIHtcclxuXHRcdC8vIFx0bmJDaG9yZHMrKztcclxuXHJcblx0XHQvLyBcdC8vaWYgdGhlIGNob3JkIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgZm9yIGFub3RoZXIgdGltZSwgZG9uJ3QgY3JlYXRlIGEgbmV3IGNob3JkIG1lc2hcclxuXHRcdC8vIFx0Ly9pZigoZXhpc3RpbmdDaG9yZEtleSA9IGFkZGVkQ2hvcmRzTWFwLmhhc1ZhbHVlQXJyYXkoY2hvcmRzTWFwW3RpbWVdKSkgIT0gLTEpIHtcclxuXHRcdC8vIFx0XHQvL2NvbnNvbGUubG9nKGV4aXN0aW5nQ2hvcmRLZXkpO1xyXG5cdFx0Ly8gXHRcdGNob3Jkc1t0aW1lXSA9IGNob3Jkc1tleGlzdGluZ0Nob3JkS2V5XTtcclxuXHRcdC8vIFx0XHRuYlNhbWVDaG9yZHMrKztcclxuXHRcdC8vIFx0Ly99IGVsc2Uge1xyXG5cdFx0Ly8gXHRcdGxldCBuZXdDaG9yZCA9IG5ldyBDaG9yZChjaG9yZHNNYXBbdGltZV0pO1xyXG5cdFx0Ly8gXHRcdC8vaWYocHJldiA9PSBudWxsIHx8ICFwcmV2LmVxdWFscyhuZXdDaG9yZCkpXHJcblx0XHQvLyBcdFx0Y2hvcmRzW3RpbWVdID0gbmV3Q2hvcmQ7XHJcblx0XHQvLyBcdFx0Ly9hZGRlZENob3Jkc01hcFt0aW1lXSA9IGNob3Jkc01hcFt0aW1lXTtcclxuXHRcdFx0XHRcclxuXHRcdC8vIFx0XHQvL3ByZXYgPSBuZXdDaG9yZDtcclxuXHRcdC8vIFx0fVxyXG5cdFx0XHRcclxuXHRcdC8vIH1cclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnbmJDaG9yZHMgOiAnK25iQ2hvcmRzKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCduYlNhbWVDaG9yZHMgOiAnK25iU2FtZUNob3Jkcyk7XHJcblxyXG5cclxuXHRcdHZhciBrZXlzID0gQXJyYXkuZnJvbShjaG9yZHNNYXAua2V5cygpKS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcblx0XHRjcmVhdGVTbGlkZXIoa2V5c1swXSwga2V5c1trZXlzLmxlbmd0aC0xXSk7XHJcblx0XHQvL2RyYXdDaG9yZHMobG93Qm91bmQsIHVwQm91bmQpO1xyXG5cdFx0XHJcblx0fSBcclxuXHJcblx0cmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGZpbGUpOyBcclxufSIsIlxyXG5cclxuZnVuY3Rpb24gdGVzdHB5KCkge1xyXG5cdHZhciByZXN1bHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0JyksXHJcbiAgICAgICAgc2VudF90eHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHh0LWlucHV0JykudmFsdWU7XHJcblxyXG4gICAgd3Muc2VuZChzZW50X3R4dCk7XHJcblxyXG4gICAgd3Mub25tZXNzYWdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgcmVzdWx0LmlubmVySFRNTCA9IGV2ZW50LmRhdGE7XHJcblxyXG4gICAgICAgIC8qdmFyIG1lc3NhZ2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0sXHJcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpLFxyXG4gICAgICAgICAgICBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZXZlbnQuZGF0YSk7XHJcbiAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuICAgICAgICBtZXNzYWdlcy5hcHBlbmRDaGlsZChtZXNzYWdlKTsqL1xyXG5cclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHl0aG9uLXRlc3QnKS5hcHBlbmRDaGlsZChyZXN1bHQpO1xyXG59IiwiLypmdW5jdGlvbiBtaWRpVG9QeSgpIHtcclxuXHR2YXIgaW5wdXRFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpbGUtaW5wdXQnKTtcclxuXHR2YXIgZmlsZSA9IGlucHV0RWxlbS5maWxlc1swXTtcclxuXHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2dCkge1xyXG5cdFx0d3Muc2VuZChldnQudGFyZ2V0LnJlc3VsdCk7XHJcblx0fVxyXG5cclxuXHRyZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuXHJcblxyXG59XHJcblxyXG53cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdGNvbnNvbGUubG9nKCdwYXJzaW5nIGpzb24uLi4nKTtcclxuXHR2YXIgaW5wdXRDaG9yZHMgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xyXG5cdGNvbnNvbGUubG9nKCdqc29uIHBhcnNlZCcpO1xyXG5cdGNvbnNvbGUubG9nKCdjcmVhdGluZyBjaG9yZHMnKTtcclxuXHRmb3IodmFyIGlDaG9yZCBpbiBpbnB1dENob3Jkcykge1xyXG5cdFx0dmFyIGNob3JkID0gbmV3IENob3JkKGlucHV0Q2hvcmRzW2lDaG9yZF0pO1xyXG5cdFx0Y2hvcmRzLnB1c2goY2hvcmQpO1xyXG5cdH1cclxuXHRjb25zb2xlLmxvZygnY2hvcmRzIGNyZWF0ZWQnKTtcclxuXHJcblx0ZHJhd0Nob3Jkcyg1LCA2KTtcclxufSovIiwiZnVuY3Rpb24gY3JlYXRlU2xpZGVyKGZyb20sIHRvKSB7XHJcblx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsaWRlcicpO1xyXG5cdGxldCBsb3dCb3VuZCA9IGZyb207XHJcblx0bGV0IHVwQm91bmQgPSB0by8xMDtcclxuXHJcblx0bm9VaVNsaWRlci5jcmVhdGUoc2xpZGVyLCB7XHJcblx0XHRzdGFydDogWyAwLCA1MDAgXSxcclxuXHRcdGNvbm5lY3Q6IHRydWUsXHJcblx0XHR0b29sdGlwczogWyB0cnVlLCB0cnVlIF0sXHJcblx0XHRyYW5nZToge1xyXG5cdFx0XHQnbWluJzogZnJvbSxcclxuXHRcdFx0J21heCc6IHRvXHJcblx0XHR9LFxyXG5cdFx0Zm9ybWF0OiB3TnVtYih7XHJcblx0XHRcdGRlY2ltYWxzOiAwXHJcblx0XHR9KVxyXG5cdH0pO1xyXG5cclxuXHRkcmF3Q2hvcmRzKGxvd0JvdW5kLCB1cEJvdW5kKTtcclxuXHJcblx0c2xpZGVyLm5vVWlTbGlkZXIub24oJ3VwZGF0ZScsIGZ1bmN0aW9uKHZhbHVlcywgaGFuZGxlKSB7XHJcblx0XHR2YXIgdmFsdWUgPSB2YWx1ZXNbaGFuZGxlXTtcclxuXHJcblx0XHRpZihoYW5kbGUgPT09IDEpIHtcclxuXHRcdFx0dXBCb3VuZCA9IHBhcnNlSW50KHZhbHVlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxvd0JvdW5kID0gcGFyc2VJbnQodmFsdWUpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRkcmF3Q2hvcmRzKGxvd0JvdW5kLCB1cEJvdW5kKTtcclxuXHR9KTtcclxuXHJcblxyXG5cdFxyXG59IiwiLyohIG5vdWlzbGlkZXIgLSAxMS4xLjAgLSAyMDE4LTA0LTAyIDExOjE4OjEzICovXHJcblxyXG4hZnVuY3Rpb24oYSl7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxhKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1hKCk6d2luZG93Lm5vVWlTbGlkZXI9YSgpfShmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGEoYSl7cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIGEmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEudG8mJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEuZnJvbX1mdW5jdGlvbiBiKGEpe2EucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChhKX1mdW5jdGlvbiBjKGEpe3JldHVybiBudWxsIT09YSYmdm9pZCAwIT09YX1mdW5jdGlvbiBkKGEpe2EucHJldmVudERlZmF1bHQoKX1mdW5jdGlvbiBlKGEpe3JldHVybiBhLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4hdGhpc1thXSYmKHRoaXNbYV09ITApfSx7fSl9ZnVuY3Rpb24gZihhLGIpe3JldHVybiBNYXRoLnJvdW5kKGEvYikqYn1mdW5jdGlvbiBnKGEsYil7dmFyIGM9YS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxkPWEub3duZXJEb2N1bWVudCxlPWQuZG9jdW1lbnRFbGVtZW50LGY9cChkKTtyZXR1cm4vd2Via2l0LipDaHJvbWUuKk1vYmlsZS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkmJihmLng9MCksYj9jLnRvcCtmLnktZS5jbGllbnRUb3A6Yy5sZWZ0K2YueC1lLmNsaWVudExlZnR9ZnVuY3Rpb24gaChhKXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgYSYmIWlzTmFOKGEpJiZpc0Zpbml0ZShhKX1mdW5jdGlvbiBpKGEsYixjKXtjPjAmJihtKGEsYiksc2V0VGltZW91dChmdW5jdGlvbigpe24oYSxiKX0sYykpfWZ1bmN0aW9uIGooYSl7cmV0dXJuIE1hdGgubWF4KE1hdGgubWluKGEsMTAwKSwwKX1mdW5jdGlvbiBrKGEpe3JldHVybiBBcnJheS5pc0FycmF5KGEpP2E6W2FdfWZ1bmN0aW9uIGwoYSl7YT1TdHJpbmcoYSk7dmFyIGI9YS5zcGxpdChcIi5cIik7cmV0dXJuIGIubGVuZ3RoPjE/YlsxXS5sZW5ndGg6MH1mdW5jdGlvbiBtKGEsYil7YS5jbGFzc0xpc3Q/YS5jbGFzc0xpc3QuYWRkKGIpOmEuY2xhc3NOYW1lKz1cIiBcIitifWZ1bmN0aW9uIG4oYSxiKXthLmNsYXNzTGlzdD9hLmNsYXNzTGlzdC5yZW1vdmUoYik6YS5jbGFzc05hbWU9YS5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58XFxcXGIpXCIrYi5zcGxpdChcIiBcIikuam9pbihcInxcIikrXCIoXFxcXGJ8JClcIixcImdpXCIpLFwiIFwiKX1mdW5jdGlvbiBvKGEsYil7cmV0dXJuIGEuY2xhc3NMaXN0P2EuY2xhc3NMaXN0LmNvbnRhaW5zKGIpOm5ldyBSZWdFeHAoXCJcXFxcYlwiK2IrXCJcXFxcYlwiKS50ZXN0KGEuY2xhc3NOYW1lKX1mdW5jdGlvbiBwKGEpe3ZhciBiPXZvaWQgMCE9PXdpbmRvdy5wYWdlWE9mZnNldCxjPVwiQ1NTMUNvbXBhdFwiPT09KGEuY29tcGF0TW9kZXx8XCJcIik7cmV0dXJue3g6Yj93aW5kb3cucGFnZVhPZmZzZXQ6Yz9hLmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0OmEuYm9keS5zY3JvbGxMZWZ0LHk6Yj93aW5kb3cucGFnZVlPZmZzZXQ6Yz9hLmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A6YS5ib2R5LnNjcm9sbFRvcH19ZnVuY3Rpb24gcSgpe3JldHVybiB3aW5kb3cubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkP3tzdGFydDpcInBvaW50ZXJkb3duXCIsbW92ZTpcInBvaW50ZXJtb3ZlXCIsZW5kOlwicG9pbnRlcnVwXCJ9OndpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZD97c3RhcnQ6XCJNU1BvaW50ZXJEb3duXCIsbW92ZTpcIk1TUG9pbnRlck1vdmVcIixlbmQ6XCJNU1BvaW50ZXJVcFwifTp7c3RhcnQ6XCJtb3VzZWRvd24gdG91Y2hzdGFydFwiLG1vdmU6XCJtb3VzZW1vdmUgdG91Y2htb3ZlXCIsZW5kOlwibW91c2V1cCB0b3VjaGVuZFwifX1mdW5jdGlvbiByKCl7dmFyIGE9ITE7dHJ5e3ZhciBiPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSxcInBhc3NpdmVcIix7Z2V0OmZ1bmN0aW9uKCl7YT0hMH19KTt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRlc3RcIixudWxsLGIpfWNhdGNoKGEpe31yZXR1cm4gYX1mdW5jdGlvbiBzKCl7cmV0dXJuIHdpbmRvdy5DU1MmJkNTUy5zdXBwb3J0cyYmQ1NTLnN1cHBvcnRzKFwidG91Y2gtYWN0aW9uXCIsXCJub25lXCIpfWZ1bmN0aW9uIHQoYSxiKXtyZXR1cm4gMTAwLyhiLWEpfWZ1bmN0aW9uIHUoYSxiKXtyZXR1cm4gMTAwKmIvKGFbMV0tYVswXSl9ZnVuY3Rpb24gdihhLGIpe3JldHVybiB1KGEsYVswXTwwP2IrTWF0aC5hYnMoYVswXSk6Yi1hWzBdKX1mdW5jdGlvbiB3KGEsYil7cmV0dXJuIGIqKGFbMV0tYVswXSkvMTAwK2FbMF19ZnVuY3Rpb24geChhLGIpe2Zvcih2YXIgYz0xO2E+PWJbY107KWMrPTE7cmV0dXJuIGN9ZnVuY3Rpb24geShhLGIsYyl7aWYoYz49YS5zbGljZSgtMSlbMF0pcmV0dXJuIDEwMDt2YXIgZD14KGMsYSksZT1hW2QtMV0sZj1hW2RdLGc9YltkLTFdLGg9YltkXTtyZXR1cm4gZyt2KFtlLGZdLGMpL3QoZyxoKX1mdW5jdGlvbiB6KGEsYixjKXtpZihjPj0xMDApcmV0dXJuIGEuc2xpY2UoLTEpWzBdO3ZhciBkPXgoYyxiKSxlPWFbZC0xXSxmPWFbZF0sZz1iW2QtMV07cmV0dXJuIHcoW2UsZl0sKGMtZykqdChnLGJbZF0pKX1mdW5jdGlvbiBBKGEsYixjLGQpe2lmKDEwMD09PWQpcmV0dXJuIGQ7dmFyIGU9eChkLGEpLGc9YVtlLTFdLGg9YVtlXTtyZXR1cm4gYz9kLWc+KGgtZykvMj9oOmc6YltlLTFdP2FbZS0xXStmKGQtYVtlLTFdLGJbZS0xXSk6ZH1mdW5jdGlvbiBCKGEsYixjKXt2YXIgZDtpZihcIm51bWJlclwiPT10eXBlb2YgYiYmKGI9W2JdKSwhQXJyYXkuaXNBcnJheShiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3JhbmdlJyBjb250YWlucyBpbnZhbGlkIHZhbHVlLlwiKTtpZihkPVwibWluXCI9PT1hPzA6XCJtYXhcIj09PWE/MTAwOnBhcnNlRmxvYXQoYSksIWgoZCl8fCFoKGJbMF0pKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncmFuZ2UnIHZhbHVlIGlzbid0IG51bWVyaWMuXCIpO2MueFBjdC5wdXNoKGQpLGMueFZhbC5wdXNoKGJbMF0pLGQ/Yy54U3RlcHMucHVzaCghaXNOYU4oYlsxXSkmJmJbMV0pOmlzTmFOKGJbMV0pfHwoYy54U3RlcHNbMF09YlsxXSksYy54SGlnaGVzdENvbXBsZXRlU3RlcC5wdXNoKDApfWZ1bmN0aW9uIEMoYSxiLGMpe2lmKCFiKXJldHVybiEwO2MueFN0ZXBzW2FdPXUoW2MueFZhbFthXSxjLnhWYWxbYSsxXV0sYikvdChjLnhQY3RbYV0sYy54UGN0W2ErMV0pO3ZhciBkPShjLnhWYWxbYSsxXS1jLnhWYWxbYV0pL2MueE51bVN0ZXBzW2FdLGU9TWF0aC5jZWlsKE51bWJlcihkLnRvRml4ZWQoMykpLTEpLGY9Yy54VmFsW2FdK2MueE51bVN0ZXBzW2FdKmU7Yy54SGlnaGVzdENvbXBsZXRlU3RlcFthXT1mfWZ1bmN0aW9uIEQoYSxiLGMpe3RoaXMueFBjdD1bXSx0aGlzLnhWYWw9W10sdGhpcy54U3RlcHM9W2N8fCExXSx0aGlzLnhOdW1TdGVwcz1bITFdLHRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXA9W10sdGhpcy5zbmFwPWI7dmFyIGQsZT1bXTtmb3IoZCBpbiBhKWEuaGFzT3duUHJvcGVydHkoZCkmJmUucHVzaChbYVtkXSxkXSk7Zm9yKGUubGVuZ3RoJiZcIm9iamVjdFwiPT10eXBlb2YgZVswXVswXT9lLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYVswXVswXS1iWzBdWzBdfSk6ZS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGFbMF0tYlswXX0pLGQ9MDtkPGUubGVuZ3RoO2QrKylCKGVbZF1bMV0sZVtkXVswXSx0aGlzKTtmb3IodGhpcy54TnVtU3RlcHM9dGhpcy54U3RlcHMuc2xpY2UoMCksZD0wO2Q8dGhpcy54TnVtU3RlcHMubGVuZ3RoO2QrKylDKGQsdGhpcy54TnVtU3RlcHNbZF0sdGhpcyl9ZnVuY3Rpb24gRShiKXtpZihhKGIpKXJldHVybiEwO3Rocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnZm9ybWF0JyByZXF1aXJlcyAndG8nIGFuZCAnZnJvbScgbWV0aG9kcy5cIil9ZnVuY3Rpb24gRihhLGIpe2lmKCFoKGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnc3RlcCcgaXMgbm90IG51bWVyaWMuXCIpO2Euc2luZ2xlU3RlcD1ifWZ1bmN0aW9uIEcoYSxiKXtpZihcIm9iamVjdFwiIT10eXBlb2YgYnx8QXJyYXkuaXNBcnJheShiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3JhbmdlJyBpcyBub3QgYW4gb2JqZWN0LlwiKTtpZih2b2lkIDA9PT1iLm1pbnx8dm9pZCAwPT09Yi5tYXgpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6IE1pc3NpbmcgJ21pbicgb3IgJ21heCcgaW4gJ3JhbmdlJy5cIik7aWYoYi5taW49PT1iLm1heCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3JhbmdlJyAnbWluJyBhbmQgJ21heCcgY2Fubm90IGJlIGVxdWFsLlwiKTthLnNwZWN0cnVtPW5ldyBEKGIsYS5zbmFwLGEuc2luZ2xlU3RlcCl9ZnVuY3Rpb24gSChhLGIpe2lmKGI9ayhiKSwhQXJyYXkuaXNBcnJheShiKXx8IWIubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnc3RhcnQnIG9wdGlvbiBpcyBpbmNvcnJlY3QuXCIpO2EuaGFuZGxlcz1iLmxlbmd0aCxhLnN0YXJ0PWJ9ZnVuY3Rpb24gSShhLGIpe2lmKGEuc25hcD1iLFwiYm9vbGVhblwiIT10eXBlb2YgYil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3NuYXAnIG9wdGlvbiBtdXN0IGJlIGEgYm9vbGVhbi5cIil9ZnVuY3Rpb24gSihhLGIpe2lmKGEuYW5pbWF0ZT1iLFwiYm9vbGVhblwiIT10eXBlb2YgYil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2FuaW1hdGUnIG9wdGlvbiBtdXN0IGJlIGEgYm9vbGVhbi5cIil9ZnVuY3Rpb24gSyhhLGIpe2lmKGEuYW5pbWF0aW9uRHVyYXRpb249YixcIm51bWJlclwiIT10eXBlb2YgYil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2FuaW1hdGlvbkR1cmF0aW9uJyBvcHRpb24gbXVzdCBiZSBhIG51bWJlci5cIil9ZnVuY3Rpb24gTChhLGIpe3ZhciBjLGQ9WyExXTtpZihcImxvd2VyXCI9PT1iP2I9WyEwLCExXTpcInVwcGVyXCI9PT1iJiYoYj1bITEsITBdKSwhMD09PWJ8fCExPT09Yil7Zm9yKGM9MTtjPGEuaGFuZGxlcztjKyspZC5wdXNoKGIpO2QucHVzaCghMSl9ZWxzZXtpZighQXJyYXkuaXNBcnJheShiKXx8IWIubGVuZ3RofHxiLmxlbmd0aCE9PWEuaGFuZGxlcysxKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnY29ubmVjdCcgb3B0aW9uIGRvZXNuJ3QgbWF0Y2ggaGFuZGxlIGNvdW50LlwiKTtkPWJ9YS5jb25uZWN0PWR9ZnVuY3Rpb24gTShhLGIpe3N3aXRjaChiKXtjYXNlXCJob3Jpem9udGFsXCI6YS5vcnQ9MDticmVhaztjYXNlXCJ2ZXJ0aWNhbFwiOmEub3J0PTE7YnJlYWs7ZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ29yaWVudGF0aW9uJyBvcHRpb24gaXMgaW52YWxpZC5cIil9fWZ1bmN0aW9uIE4oYSxiKXtpZighaChiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ21hcmdpbicgb3B0aW9uIG11c3QgYmUgbnVtZXJpYy5cIik7aWYoMCE9PWImJihhLm1hcmdpbj1hLnNwZWN0cnVtLmdldE1hcmdpbihiKSwhYS5tYXJnaW4pKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbWFyZ2luJyBvcHRpb24gaXMgb25seSBzdXBwb3J0ZWQgb24gbGluZWFyIHNsaWRlcnMuXCIpfWZ1bmN0aW9uIE8oYSxiKXtpZighaChiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2xpbWl0JyBvcHRpb24gbXVzdCBiZSBudW1lcmljLlwiKTtpZihhLmxpbWl0PWEuc3BlY3RydW0uZ2V0TWFyZ2luKGIpLCFhLmxpbWl0fHxhLmhhbmRsZXM8Mil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2xpbWl0JyBvcHRpb24gaXMgb25seSBzdXBwb3J0ZWQgb24gbGluZWFyIHNsaWRlcnMgd2l0aCAyIG9yIG1vcmUgaGFuZGxlcy5cIil9ZnVuY3Rpb24gUChhLGIpe2lmKCFoKGIpJiYhQXJyYXkuaXNBcnJheShiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMgb3IgYXJyYXkgb2YgZXhhY3RseSAyIG51bWJlcnMuXCIpO2lmKEFycmF5LmlzQXJyYXkoYikmJjIhPT1iLmxlbmd0aCYmIWgoYlswXSkmJiFoKGJbMV0pKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncGFkZGluZycgb3B0aW9uIG11c3QgYmUgbnVtZXJpYyBvciBhcnJheSBvZiBleGFjdGx5IDIgbnVtYmVycy5cIik7aWYoMCE9PWIpe2lmKEFycmF5LmlzQXJyYXkoYil8fChiPVtiLGJdKSxhLnBhZGRpbmc9W2Euc3BlY3RydW0uZ2V0TWFyZ2luKGJbMF0pLGEuc3BlY3RydW0uZ2V0TWFyZ2luKGJbMV0pXSwhMT09PWEucGFkZGluZ1swXXx8ITE9PT1hLnBhZGRpbmdbMV0pdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdwYWRkaW5nJyBvcHRpb24gaXMgb25seSBzdXBwb3J0ZWQgb24gbGluZWFyIHNsaWRlcnMuXCIpO2lmKGEucGFkZGluZ1swXTwwfHxhLnBhZGRpbmdbMV08MCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyKHMpLlwiKTtpZihhLnBhZGRpbmdbMF0rYS5wYWRkaW5nWzFdPj0xMDApdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdwYWRkaW5nJyBvcHRpb24gbXVzdCBub3QgZXhjZWVkIDEwMCUgb2YgdGhlIHJhbmdlLlwiKX19ZnVuY3Rpb24gUShhLGIpe3N3aXRjaChiKXtjYXNlXCJsdHJcIjphLmRpcj0wO2JyZWFrO2Nhc2VcInJ0bFwiOmEuZGlyPTE7YnJlYWs7ZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2RpcmVjdGlvbicgb3B0aW9uIHdhcyBub3QgcmVjb2duaXplZC5cIil9fWZ1bmN0aW9uIFIoYSxiKXtpZihcInN0cmluZ1wiIT10eXBlb2YgYil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2JlaGF2aW91cicgbXVzdCBiZSBhIHN0cmluZyBjb250YWluaW5nIG9wdGlvbnMuXCIpO3ZhciBjPWIuaW5kZXhPZihcInRhcFwiKT49MCxkPWIuaW5kZXhPZihcImRyYWdcIik+PTAsZT1iLmluZGV4T2YoXCJmaXhlZFwiKT49MCxmPWIuaW5kZXhPZihcInNuYXBcIik+PTAsZz1iLmluZGV4T2YoXCJob3ZlclwiKT49MDtpZihlKXtpZigyIT09YS5oYW5kbGVzKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnZml4ZWQnIGJlaGF2aW91ciBtdXN0IGJlIHVzZWQgd2l0aCAyIGhhbmRsZXNcIik7TihhLGEuc3RhcnRbMV0tYS5zdGFydFswXSl9YS5ldmVudHM9e3RhcDpjfHxmLGRyYWc6ZCxmaXhlZDplLHNuYXA6Zixob3ZlcjpnfX1mdW5jdGlvbiBTKGEsYil7aWYoITEhPT1iKWlmKCEwPT09Yil7YS50b29sdGlwcz1bXTtmb3IodmFyIGM9MDtjPGEuaGFuZGxlcztjKyspYS50b29sdGlwcy5wdXNoKCEwKX1lbHNle2lmKGEudG9vbHRpcHM9ayhiKSxhLnRvb2x0aXBzLmxlbmd0aCE9PWEuaGFuZGxlcyl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogbXVzdCBwYXNzIGEgZm9ybWF0dGVyIGZvciBhbGwgaGFuZGxlcy5cIik7YS50b29sdGlwcy5mb3JFYWNoKGZ1bmN0aW9uKGEpe2lmKFwiYm9vbGVhblwiIT10eXBlb2YgYSYmKFwib2JqZWN0XCIhPXR5cGVvZiBhfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBhLnRvKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3Rvb2x0aXBzJyBtdXN0IGJlIHBhc3NlZCBhIGZvcm1hdHRlciBvciAnZmFsc2UnLlwiKX0pfX1mdW5jdGlvbiBUKGEsYil7YS5hcmlhRm9ybWF0PWIsRShiKX1mdW5jdGlvbiBVKGEsYil7YS5mb3JtYXQ9YixFKGIpfWZ1bmN0aW9uIFYoYSxiKXtpZihcInN0cmluZ1wiIT10eXBlb2YgYiYmITEhPT1iKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnY3NzUHJlZml4JyBtdXN0IGJlIGEgc3RyaW5nIG9yIGBmYWxzZWAuXCIpO2EuY3NzUHJlZml4PWJ9ZnVuY3Rpb24gVyhhLGIpe2lmKFwib2JqZWN0XCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnY3NzQ2xhc3NlcycgbXVzdCBiZSBhbiBvYmplY3QuXCIpO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBhLmNzc1ByZWZpeCl7YS5jc3NDbGFzc2VzPXt9O2Zvcih2YXIgYyBpbiBiKWIuaGFzT3duUHJvcGVydHkoYykmJihhLmNzc0NsYXNzZXNbY109YS5jc3NQcmVmaXgrYltjXSl9ZWxzZSBhLmNzc0NsYXNzZXM9Yn1mdW5jdGlvbiBYKGEpe3ZhciBiPXttYXJnaW46MCxsaW1pdDowLHBhZGRpbmc6MCxhbmltYXRlOiEwLGFuaW1hdGlvbkR1cmF0aW9uOjMwMCxhcmlhRm9ybWF0Ol8sZm9ybWF0Ol99LGQ9e3N0ZXA6e3I6ITEsdDpGfSxzdGFydDp7cjohMCx0Okh9LGNvbm5lY3Q6e3I6ITAsdDpMfSxkaXJlY3Rpb246e3I6ITAsdDpRfSxzbmFwOntyOiExLHQ6SX0sYW5pbWF0ZTp7cjohMSx0Okp9LGFuaW1hdGlvbkR1cmF0aW9uOntyOiExLHQ6S30scmFuZ2U6e3I6ITAsdDpHfSxvcmllbnRhdGlvbjp7cjohMSx0Ok19LG1hcmdpbjp7cjohMSx0Ok59LGxpbWl0OntyOiExLHQ6T30scGFkZGluZzp7cjohMSx0OlB9LGJlaGF2aW91cjp7cjohMCx0OlJ9LGFyaWFGb3JtYXQ6e3I6ITEsdDpUfSxmb3JtYXQ6e3I6ITEsdDpVfSx0b29sdGlwczp7cjohMSx0OlN9LGNzc1ByZWZpeDp7cjohMCx0OlZ9LGNzc0NsYXNzZXM6e3I6ITAsdDpXfX0sZT17Y29ubmVjdDohMSxkaXJlY3Rpb246XCJsdHJcIixiZWhhdmlvdXI6XCJ0YXBcIixvcmllbnRhdGlvbjpcImhvcml6b250YWxcIixjc3NQcmVmaXg6XCJub1VpLVwiLGNzc0NsYXNzZXM6e3RhcmdldDpcInRhcmdldFwiLGJhc2U6XCJiYXNlXCIsb3JpZ2luOlwib3JpZ2luXCIsaGFuZGxlOlwiaGFuZGxlXCIsaGFuZGxlTG93ZXI6XCJoYW5kbGUtbG93ZXJcIixoYW5kbGVVcHBlcjpcImhhbmRsZS11cHBlclwiLGhvcml6b250YWw6XCJob3Jpem9udGFsXCIsdmVydGljYWw6XCJ2ZXJ0aWNhbFwiLGJhY2tncm91bmQ6XCJiYWNrZ3JvdW5kXCIsY29ubmVjdDpcImNvbm5lY3RcIixjb25uZWN0czpcImNvbm5lY3RzXCIsbHRyOlwibHRyXCIscnRsOlwicnRsXCIsZHJhZ2dhYmxlOlwiZHJhZ2dhYmxlXCIsZHJhZzpcInN0YXRlLWRyYWdcIix0YXA6XCJzdGF0ZS10YXBcIixhY3RpdmU6XCJhY3RpdmVcIix0b29sdGlwOlwidG9vbHRpcFwiLHBpcHM6XCJwaXBzXCIscGlwc0hvcml6b250YWw6XCJwaXBzLWhvcml6b250YWxcIixwaXBzVmVydGljYWw6XCJwaXBzLXZlcnRpY2FsXCIsbWFya2VyOlwibWFya2VyXCIsbWFya2VySG9yaXpvbnRhbDpcIm1hcmtlci1ob3Jpem9udGFsXCIsbWFya2VyVmVydGljYWw6XCJtYXJrZXItdmVydGljYWxcIixtYXJrZXJOb3JtYWw6XCJtYXJrZXItbm9ybWFsXCIsbWFya2VyTGFyZ2U6XCJtYXJrZXItbGFyZ2VcIixtYXJrZXJTdWI6XCJtYXJrZXItc3ViXCIsdmFsdWU6XCJ2YWx1ZVwiLHZhbHVlSG9yaXpvbnRhbDpcInZhbHVlLWhvcml6b250YWxcIix2YWx1ZVZlcnRpY2FsOlwidmFsdWUtdmVydGljYWxcIix2YWx1ZU5vcm1hbDpcInZhbHVlLW5vcm1hbFwiLHZhbHVlTGFyZ2U6XCJ2YWx1ZS1sYXJnZVwiLHZhbHVlU3ViOlwidmFsdWUtc3ViXCJ9fTthLmZvcm1hdCYmIWEuYXJpYUZvcm1hdCYmKGEuYXJpYUZvcm1hdD1hLmZvcm1hdCksT2JqZWN0LmtleXMoZCkuZm9yRWFjaChmdW5jdGlvbihmKXtpZighYyhhW2ZdKSYmdm9pZCAwPT09ZVtmXSl7aWYoZFtmXS5yKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnXCIrZitcIicgaXMgcmVxdWlyZWQuXCIpO3JldHVybiEwfWRbZl0udChiLGMoYVtmXSk/YVtmXTplW2ZdKX0pLGIucGlwcz1hLnBpcHM7dmFyIGY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxnPXZvaWQgMCE9PWYuc3R5bGUubXNUcmFuc2Zvcm0saD12b2lkIDAhPT1mLnN0eWxlLnRyYW5zZm9ybTtiLnRyYW5zZm9ybVJ1bGU9aD9cInRyYW5zZm9ybVwiOmc/XCJtc1RyYW5zZm9ybVwiOlwid2Via2l0VHJhbnNmb3JtXCI7dmFyIGk9W1tcImxlZnRcIixcInRvcFwiXSxbXCJyaWdodFwiLFwiYm90dG9tXCJdXTtyZXR1cm4gYi5zdHlsZT1pW2IuZGlyXVtiLm9ydF0sYn1mdW5jdGlvbiBZKGEsYyxmKXtmdW5jdGlvbiBoKGEsYil7dmFyIGM9eWEuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm4gYiYmbShjLGIpLGEuYXBwZW5kQ2hpbGQoYyksY31mdW5jdGlvbiBsKGEsYil7dmFyIGQ9aChhLGMuY3NzQ2xhc3Nlcy5vcmlnaW4pLGU9aChkLGMuY3NzQ2xhc3Nlcy5oYW5kbGUpO3JldHVybiBlLnNldEF0dHJpYnV0ZShcImRhdGEtaGFuZGxlXCIsYiksZS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLFwiMFwiKSxlLnNldEF0dHJpYnV0ZShcInJvbGVcIixcInNsaWRlclwiKSxlLnNldEF0dHJpYnV0ZShcImFyaWEtb3JpZW50YXRpb25cIixjLm9ydD9cInZlcnRpY2FsXCI6XCJob3Jpem9udGFsXCIpLDA9PT1iP20oZSxjLmNzc0NsYXNzZXMuaGFuZGxlTG93ZXIpOmI9PT1jLmhhbmRsZXMtMSYmbShlLGMuY3NzQ2xhc3Nlcy5oYW5kbGVVcHBlciksZH1mdW5jdGlvbiB0KGEsYil7cmV0dXJuISFiJiZoKGEsYy5jc3NDbGFzc2VzLmNvbm5lY3QpfWZ1bmN0aW9uIHUoYSxiKXt2YXIgZD1oKGIsYy5jc3NDbGFzc2VzLmNvbm5lY3RzKTtrYT1bXSxsYT1bXSxsYS5wdXNoKHQoZCxhWzBdKSk7Zm9yKHZhciBlPTA7ZTxjLmhhbmRsZXM7ZSsrKWthLnB1c2gobChiLGUpKSx0YVtlXT1lLGxhLnB1c2godChkLGFbZSsxXSkpfWZ1bmN0aW9uIHYoYSl7bShhLGMuY3NzQ2xhc3Nlcy50YXJnZXQpLDA9PT1jLmRpcj9tKGEsYy5jc3NDbGFzc2VzLmx0cik6bShhLGMuY3NzQ2xhc3Nlcy5ydGwpLDA9PT1jLm9ydD9tKGEsYy5jc3NDbGFzc2VzLmhvcml6b250YWwpOm0oYSxjLmNzc0NsYXNzZXMudmVydGljYWwpLGphPWgoYSxjLmNzc0NsYXNzZXMuYmFzZSl9ZnVuY3Rpb24gdyhhLGIpe3JldHVybiEhYy50b29sdGlwc1tiXSYmaChhLmZpcnN0Q2hpbGQsYy5jc3NDbGFzc2VzLnRvb2x0aXApfWZ1bmN0aW9uIHgoKXt2YXIgYT1rYS5tYXAodyk7UShcInVwZGF0ZVwiLGZ1bmN0aW9uKGIsZCxlKXtpZihhW2RdKXt2YXIgZj1iW2RdOyEwIT09Yy50b29sdGlwc1tkXSYmKGY9Yy50b29sdGlwc1tkXS50byhlW2RdKSksYVtkXS5pbm5lckhUTUw9Zn19KX1mdW5jdGlvbiB5KCl7UShcInVwZGF0ZVwiLGZ1bmN0aW9uKGEsYixkLGUsZil7dGEuZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgYj1rYVthXSxlPVUoc2EsYSwwLCEwLCEwLCEwKSxnPVUoc2EsYSwxMDAsITAsITAsITApLGg9ZlthXSxpPWMuYXJpYUZvcm1hdC50byhkW2FdKTtiLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWVtaW5cIixlLnRvRml4ZWQoMSkpLGIuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW1heFwiLGcudG9GaXhlZCgxKSksYi5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbm93XCIsaC50b0ZpeGVkKDEpKSxiLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWV0ZXh0XCIsaSl9KX0pfWZ1bmN0aW9uIHooYSxiLGMpe2lmKFwicmFuZ2VcIj09PWF8fFwic3RlcHNcIj09PWEpcmV0dXJuIHZhLnhWYWw7aWYoXCJjb3VudFwiPT09YSl7aWYoYjwyKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAndmFsdWVzJyAoPj0gMikgcmVxdWlyZWQgZm9yIG1vZGUgJ2NvdW50Jy5cIik7dmFyIGQ9Yi0xLGU9MTAwL2Q7Zm9yKGI9W107ZC0tOyliW2RdPWQqZTtiLnB1c2goMTAwKSxhPVwicG9zaXRpb25zXCJ9cmV0dXJuXCJwb3NpdGlvbnNcIj09PWE/Yi5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIHZhLmZyb21TdGVwcGluZyhjP3ZhLmdldFN0ZXAoYSk6YSl9KTpcInZhbHVlc1wiPT09YT9jP2IubWFwKGZ1bmN0aW9uKGEpe3JldHVybiB2YS5mcm9tU3RlcHBpbmcodmEuZ2V0U3RlcCh2YS50b1N0ZXBwaW5nKGEpKSl9KTpiOnZvaWQgMH1mdW5jdGlvbiBBKGEsYixjKXtmdW5jdGlvbiBkKGEsYil7cmV0dXJuKGErYikudG9GaXhlZCg3KS8xfXZhciBmPXt9LGc9dmEueFZhbFswXSxoPXZhLnhWYWxbdmEueFZhbC5sZW5ndGgtMV0saT0hMSxqPSExLGs9MDtyZXR1cm4gYz1lKGMuc2xpY2UoKS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEtYn0pKSxjWzBdIT09ZyYmKGMudW5zaGlmdChnKSxpPSEwKSxjW2MubGVuZ3RoLTFdIT09aCYmKGMucHVzaChoKSxqPSEwKSxjLmZvckVhY2goZnVuY3Rpb24oZSxnKXt2YXIgaCxsLG0sbixvLHAscSxyLHMsdCx1PWUsdj1jW2crMV07aWYoXCJzdGVwc1wiPT09YiYmKGg9dmEueE51bVN0ZXBzW2ddKSxofHwoaD12LXUpLCExIT09dSYmdm9pZCAwIT09dilmb3IoaD1NYXRoLm1heChoLDFlLTcpLGw9dTtsPD12O2w9ZChsLGgpKXtmb3Iobj12YS50b1N0ZXBwaW5nKGwpLG89bi1rLHI9by9hLHM9TWF0aC5yb3VuZChyKSx0PW8vcyxtPTE7bTw9czttKz0xKXA9ayttKnQsZltwLnRvRml4ZWQoNSldPVtcInhcIiwwXTtxPWMuaW5kZXhPZihsKT4tMT8xOlwic3RlcHNcIj09PWI/MjowLCFnJiZpJiYocT0wKSxsPT09diYmanx8KGZbbi50b0ZpeGVkKDUpXT1bbCxxXSksaz1ufX0pLGZ9ZnVuY3Rpb24gQihhLGIsZCl7ZnVuY3Rpb24gZShhLGIpe3ZhciBkPWI9PT1jLmNzc0NsYXNzZXMudmFsdWUsZT1kP2s6bCxmPWQ/aTpqO3JldHVybiBiK1wiIFwiK2VbYy5vcnRdK1wiIFwiK2ZbYV19ZnVuY3Rpb24gZihhLGYpe2ZbMV09ZlsxXSYmYj9iKGZbMF0sZlsxXSk6ZlsxXTt2YXIgaT1oKGcsITEpO2kuY2xhc3NOYW1lPWUoZlsxXSxjLmNzc0NsYXNzZXMubWFya2VyKSxpLnN0eWxlW2Muc3R5bGVdPWErXCIlXCIsZlsxXSYmKGk9aChnLCExKSxpLmNsYXNzTmFtZT1lKGZbMV0sYy5jc3NDbGFzc2VzLnZhbHVlKSxpLnNldEF0dHJpYnV0ZShcImRhdGEtdmFsdWVcIixmWzBdKSxpLnN0eWxlW2Muc3R5bGVdPWErXCIlXCIsaS5pbm5lclRleHQ9ZC50byhmWzBdKSl9dmFyIGc9eWEuY3JlYXRlRWxlbWVudChcImRpdlwiKSxpPVtjLmNzc0NsYXNzZXMudmFsdWVOb3JtYWwsYy5jc3NDbGFzc2VzLnZhbHVlTGFyZ2UsYy5jc3NDbGFzc2VzLnZhbHVlU3ViXSxqPVtjLmNzc0NsYXNzZXMubWFya2VyTm9ybWFsLGMuY3NzQ2xhc3Nlcy5tYXJrZXJMYXJnZSxjLmNzc0NsYXNzZXMubWFya2VyU3ViXSxrPVtjLmNzc0NsYXNzZXMudmFsdWVIb3Jpem9udGFsLGMuY3NzQ2xhc3Nlcy52YWx1ZVZlcnRpY2FsXSxsPVtjLmNzc0NsYXNzZXMubWFya2VySG9yaXpvbnRhbCxjLmNzc0NsYXNzZXMubWFya2VyVmVydGljYWxdO3JldHVybiBtKGcsYy5jc3NDbGFzc2VzLnBpcHMpLG0oZywwPT09Yy5vcnQ/Yy5jc3NDbGFzc2VzLnBpcHNIb3Jpem9udGFsOmMuY3NzQ2xhc3Nlcy5waXBzVmVydGljYWwpLE9iamVjdC5rZXlzKGEpLmZvckVhY2goZnVuY3Rpb24oYil7ZihiLGFbYl0pfSksZ31mdW5jdGlvbiBDKCl7bmEmJihiKG5hKSxuYT1udWxsKX1mdW5jdGlvbiBEKGEpe0MoKTt2YXIgYj1hLm1vZGUsYz1hLmRlbnNpdHl8fDEsZD1hLmZpbHRlcnx8ITEsZT1hLnZhbHVlc3x8ITEsZj1hLnN0ZXBwZWR8fCExLGc9eihiLGUsZiksaD1BKGMsYixnKSxpPWEuZm9ybWF0fHx7dG86TWF0aC5yb3VuZH07cmV0dXJuIG5hPXJhLmFwcGVuZENoaWxkKEIoaCxkLGkpKX1mdW5jdGlvbiBFKCl7dmFyIGE9amEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksYj1cIm9mZnNldFwiK1tcIldpZHRoXCIsXCJIZWlnaHRcIl1bYy5vcnRdO3JldHVybiAwPT09Yy5vcnQ/YS53aWR0aHx8amFbYl06YS5oZWlnaHR8fGphW2JdfWZ1bmN0aW9uIEYoYSxiLGQsZSl7dmFyIGY9ZnVuY3Rpb24oZil7cmV0dXJuISEoZj1HKGYsZS5wYWdlT2Zmc2V0LGUudGFyZ2V0fHxiKSkmJighKHJhLmhhc0F0dHJpYnV0ZShcImRpc2FibGVkXCIpJiYhZS5kb05vdFJlamVjdCkmJighKG8ocmEsYy5jc3NDbGFzc2VzLnRhcCkmJiFlLmRvTm90UmVqZWN0KSYmKCEoYT09PW9hLnN0YXJ0JiZ2b2lkIDAhPT1mLmJ1dHRvbnMmJmYuYnV0dG9ucz4xKSYmKCghZS5ob3Zlcnx8IWYuYnV0dG9ucykmJihxYXx8Zi5wcmV2ZW50RGVmYXVsdCgpLGYuY2FsY1BvaW50PWYucG9pbnRzW2Mub3J0XSx2b2lkIGQoZixlKSkpKSkpfSxnPVtdO3JldHVybiBhLnNwbGl0KFwiIFwiKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2IuYWRkRXZlbnRMaXN0ZW5lcihhLGYsISFxYSYme3Bhc3NpdmU6ITB9KSxnLnB1c2goW2EsZl0pfSksZ31mdW5jdGlvbiBHKGEsYixjKXt2YXIgZCxlLGY9MD09PWEudHlwZS5pbmRleE9mKFwidG91Y2hcIiksZz0wPT09YS50eXBlLmluZGV4T2YoXCJtb3VzZVwiKSxoPTA9PT1hLnR5cGUuaW5kZXhPZihcInBvaW50ZXJcIik7aWYoMD09PWEudHlwZS5pbmRleE9mKFwiTVNQb2ludGVyXCIpJiYoaD0hMCksZil7dmFyIGk9ZnVuY3Rpb24oYSl7cmV0dXJuIGEudGFyZ2V0PT09Y3x8Yy5jb250YWlucyhhLnRhcmdldCl9O2lmKFwidG91Y2hzdGFydFwiPT09YS50eXBlKXt2YXIgaj1BcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoYS50b3VjaGVzLGkpO2lmKGoubGVuZ3RoPjEpcmV0dXJuITE7ZD1qWzBdLnBhZ2VYLGU9alswXS5wYWdlWX1lbHNle3ZhciBrPUFycmF5LnByb3RvdHlwZS5maW5kLmNhbGwoYS5jaGFuZ2VkVG91Y2hlcyxpKTtpZighaylyZXR1cm4hMTtkPWsucGFnZVgsZT1rLnBhZ2VZfX1yZXR1cm4gYj1ifHxwKHlhKSwoZ3x8aCkmJihkPWEuY2xpZW50WCtiLngsZT1hLmNsaWVudFkrYi55KSxhLnBhZ2VPZmZzZXQ9YixhLnBvaW50cz1bZCxlXSxhLmN1cnNvcj1nfHxoLGF9ZnVuY3Rpb24gSChhKXt2YXIgYj1hLWcoamEsYy5vcnQpLGQ9MTAwKmIvRSgpO3JldHVybiBkPWooZCksYy5kaXI/MTAwLWQ6ZH1mdW5jdGlvbiBJKGEpe3ZhciBiPTEwMCxjPSExO3JldHVybiBrYS5mb3JFYWNoKGZ1bmN0aW9uKGQsZSl7aWYoIWQuaGFzQXR0cmlidXRlKFwiZGlzYWJsZWRcIikpe3ZhciBmPU1hdGguYWJzKHNhW2VdLWEpOyhmPGJ8fDEwMD09PWYmJjEwMD09PWIpJiYoYz1lLGI9Zil9fSksY31mdW5jdGlvbiBKKGEsYil7XCJtb3VzZW91dFwiPT09YS50eXBlJiZcIkhUTUxcIj09PWEudGFyZ2V0Lm5vZGVOYW1lJiZudWxsPT09YS5yZWxhdGVkVGFyZ2V0JiZMKGEsYil9ZnVuY3Rpb24gSyhhLGIpe2lmKC0xPT09bmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIk1TSUUgOVwiKSYmMD09PWEuYnV0dG9ucyYmMCE9PWIuYnV0dG9uc1Byb3BlcnR5KXJldHVybiBMKGEsYik7dmFyIGQ9KGMuZGlyPy0xOjEpKihhLmNhbGNQb2ludC1iLnN0YXJ0Q2FsY1BvaW50KTtXKGQ+MCwxMDAqZC9iLmJhc2VTaXplLGIubG9jYXRpb25zLGIuaGFuZGxlTnVtYmVycyl9ZnVuY3Rpb24gTChhLGIpe2IuaGFuZGxlJiYobihiLmhhbmRsZSxjLmNzc0NsYXNzZXMuYWN0aXZlKSx1YS09MSksYi5saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihhKXt6YS5yZW1vdmVFdmVudExpc3RlbmVyKGFbMF0sYVsxXSl9KSwwPT09dWEmJihuKHJhLGMuY3NzQ2xhc3Nlcy5kcmFnKSxfKCksYS5jdXJzb3ImJihBYS5zdHlsZS5jdXJzb3I9XCJcIixBYS5yZW1vdmVFdmVudExpc3RlbmVyKFwic2VsZWN0c3RhcnRcIixkKSkpLGIuaGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uKGEpe1MoXCJjaGFuZ2VcIixhKSxTKFwic2V0XCIsYSksUyhcImVuZFwiLGEpfSl9ZnVuY3Rpb24gTShhLGIpe3ZhciBlO2lmKDE9PT1iLmhhbmRsZU51bWJlcnMubGVuZ3RoKXt2YXIgZj1rYVtiLmhhbmRsZU51bWJlcnNbMF1dO2lmKGYuaGFzQXR0cmlidXRlKFwiZGlzYWJsZWRcIikpcmV0dXJuITE7ZT1mLmNoaWxkcmVuWzBdLHVhKz0xLG0oZSxjLmNzc0NsYXNzZXMuYWN0aXZlKX1hLnN0b3BQcm9wYWdhdGlvbigpO3ZhciBnPVtdLGg9RihvYS5tb3ZlLHphLEsse3RhcmdldDphLnRhcmdldCxoYW5kbGU6ZSxsaXN0ZW5lcnM6ZyxzdGFydENhbGNQb2ludDphLmNhbGNQb2ludCxiYXNlU2l6ZTpFKCkscGFnZU9mZnNldDphLnBhZ2VPZmZzZXQsaGFuZGxlTnVtYmVyczpiLmhhbmRsZU51bWJlcnMsYnV0dG9uc1Byb3BlcnR5OmEuYnV0dG9ucyxsb2NhdGlvbnM6c2Euc2xpY2UoKX0pLGk9RihvYS5lbmQsemEsTCx7dGFyZ2V0OmEudGFyZ2V0LGhhbmRsZTplLGxpc3RlbmVyczpnLGRvTm90UmVqZWN0OiEwLGhhbmRsZU51bWJlcnM6Yi5oYW5kbGVOdW1iZXJzfSksaj1GKFwibW91c2VvdXRcIix6YSxKLHt0YXJnZXQ6YS50YXJnZXQsaGFuZGxlOmUsbGlzdGVuZXJzOmcsZG9Ob3RSZWplY3Q6ITAsaGFuZGxlTnVtYmVyczpiLmhhbmRsZU51bWJlcnN9KTtnLnB1c2guYXBwbHkoZyxoLmNvbmNhdChpLGopKSxhLmN1cnNvciYmKEFhLnN0eWxlLmN1cnNvcj1nZXRDb21wdXRlZFN0eWxlKGEudGFyZ2V0KS5jdXJzb3Isa2EubGVuZ3RoPjEmJm0ocmEsYy5jc3NDbGFzc2VzLmRyYWcpLEFhLmFkZEV2ZW50TGlzdGVuZXIoXCJzZWxlY3RzdGFydFwiLGQsITEpKSxiLmhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbihhKXtTKFwic3RhcnRcIixhKX0pfWZ1bmN0aW9uIE4oYSl7YS5zdG9wUHJvcGFnYXRpb24oKTt2YXIgYj1IKGEuY2FsY1BvaW50KSxkPUkoYik7aWYoITE9PT1kKXJldHVybiExO2MuZXZlbnRzLnNuYXB8fGkocmEsYy5jc3NDbGFzc2VzLnRhcCxjLmFuaW1hdGlvbkR1cmF0aW9uKSxhYShkLGIsITAsITApLF8oKSxTKFwic2xpZGVcIixkLCEwKSxTKFwidXBkYXRlXCIsZCwhMCksUyhcImNoYW5nZVwiLGQsITApLFMoXCJzZXRcIixkLCEwKSxjLmV2ZW50cy5zbmFwJiZNKGEse2hhbmRsZU51bWJlcnM6W2RdfSl9ZnVuY3Rpb24gTyhhKXt2YXIgYj1IKGEuY2FsY1BvaW50KSxjPXZhLmdldFN0ZXAoYiksZD12YS5mcm9tU3RlcHBpbmcoYyk7T2JqZWN0LmtleXMoeGEpLmZvckVhY2goZnVuY3Rpb24oYSl7XCJob3ZlclwiPT09YS5zcGxpdChcIi5cIilbMF0mJnhhW2FdLmZvckVhY2goZnVuY3Rpb24oYSl7YS5jYWxsKG1hLGQpfSl9KX1mdW5jdGlvbiBQKGEpe2EuZml4ZWR8fGthLmZvckVhY2goZnVuY3Rpb24oYSxiKXtGKG9hLnN0YXJ0LGEuY2hpbGRyZW5bMF0sTSx7aGFuZGxlTnVtYmVyczpbYl19KX0pLGEudGFwJiZGKG9hLnN0YXJ0LGphLE4se30pLGEuaG92ZXImJkYob2EubW92ZSxqYSxPLHtob3ZlcjohMH0pLGEuZHJhZyYmbGEuZm9yRWFjaChmdW5jdGlvbihiLGQpe2lmKCExIT09YiYmMCE9PWQmJmQhPT1sYS5sZW5ndGgtMSl7dmFyIGU9a2FbZC0xXSxmPWthW2RdLGc9W2JdO20oYixjLmNzc0NsYXNzZXMuZHJhZ2dhYmxlKSxhLmZpeGVkJiYoZy5wdXNoKGUuY2hpbGRyZW5bMF0pLGcucHVzaChmLmNoaWxkcmVuWzBdKSksZy5mb3JFYWNoKGZ1bmN0aW9uKGEpe0Yob2Euc3RhcnQsYSxNLHtoYW5kbGVzOltlLGZdLGhhbmRsZU51bWJlcnM6W2QtMSxkXX0pfSl9fSl9ZnVuY3Rpb24gUShhLGIpe3hhW2FdPXhhW2FdfHxbXSx4YVthXS5wdXNoKGIpLFwidXBkYXRlXCI9PT1hLnNwbGl0KFwiLlwiKVswXSYma2EuZm9yRWFjaChmdW5jdGlvbihhLGIpe1MoXCJ1cGRhdGVcIixiKX0pfWZ1bmN0aW9uIFIoYSl7dmFyIGI9YSYmYS5zcGxpdChcIi5cIilbMF0sYz1iJiZhLnN1YnN0cmluZyhiLmxlbmd0aCk7T2JqZWN0LmtleXMoeGEpLmZvckVhY2goZnVuY3Rpb24oYSl7dmFyIGQ9YS5zcGxpdChcIi5cIilbMF0sZT1hLnN1YnN0cmluZyhkLmxlbmd0aCk7YiYmYiE9PWR8fGMmJmMhPT1lfHxkZWxldGUgeGFbYV19KX1mdW5jdGlvbiBTKGEsYixkKXtPYmplY3Qua2V5cyh4YSkuZm9yRWFjaChmdW5jdGlvbihlKXt2YXIgZj1lLnNwbGl0KFwiLlwiKVswXTthPT09ZiYmeGFbZV0uZm9yRWFjaChmdW5jdGlvbihhKXthLmNhbGwobWEsd2EubWFwKGMuZm9ybWF0LnRvKSxiLHdhLnNsaWNlKCksZHx8ITEsc2Euc2xpY2UoKSl9KX0pfWZ1bmN0aW9uIFQoYSl7cmV0dXJuIGErXCIlXCJ9ZnVuY3Rpb24gVShhLGIsZCxlLGYsZyl7cmV0dXJuIGthLmxlbmd0aD4xJiYoZSYmYj4wJiYoZD1NYXRoLm1heChkLGFbYi0xXStjLm1hcmdpbikpLGYmJmI8a2EubGVuZ3RoLTEmJihkPU1hdGgubWluKGQsYVtiKzFdLWMubWFyZ2luKSkpLGthLmxlbmd0aD4xJiZjLmxpbWl0JiYoZSYmYj4wJiYoZD1NYXRoLm1pbihkLGFbYi0xXStjLmxpbWl0KSksZiYmYjxrYS5sZW5ndGgtMSYmKGQ9TWF0aC5tYXgoZCxhW2IrMV0tYy5saW1pdCkpKSxjLnBhZGRpbmcmJigwPT09YiYmKGQ9TWF0aC5tYXgoZCxjLnBhZGRpbmdbMF0pKSxiPT09a2EubGVuZ3RoLTEmJihkPU1hdGgubWluKGQsMTAwLWMucGFkZGluZ1sxXSkpKSxkPXZhLmdldFN0ZXAoZCksISgoZD1qKGQpKT09PWFbYl0mJiFnKSYmZH1mdW5jdGlvbiBWKGEsYil7dmFyIGQ9Yy5vcnQ7cmV0dXJuKGQ/YjphKStcIiwgXCIrKGQ/YTpiKX1mdW5jdGlvbiBXKGEsYixjLGQpe3ZhciBlPWMuc2xpY2UoKSxmPVshYSxhXSxnPVthLCFhXTtkPWQuc2xpY2UoKSxhJiZkLnJldmVyc2UoKSxkLmxlbmd0aD4xP2QuZm9yRWFjaChmdW5jdGlvbihhLGMpe3ZhciBkPVUoZSxhLGVbYV0rYixmW2NdLGdbY10sITEpOyExPT09ZD9iPTA6KGI9ZC1lW2FdLGVbYV09ZCl9KTpmPWc9WyEwXTt2YXIgaD0hMTtkLmZvckVhY2goZnVuY3Rpb24oYSxkKXtoPWFhKGEsY1thXStiLGZbZF0sZ1tkXSl8fGh9KSxoJiZkLmZvckVhY2goZnVuY3Rpb24oYSl7UyhcInVwZGF0ZVwiLGEpLFMoXCJzbGlkZVwiLGEpfSl9ZnVuY3Rpb24gWShhLGIpe3JldHVybiBjLmRpcj8xMDAtYS1iOmF9ZnVuY3Rpb24gWihhLGIpe3NhW2FdPWIsd2FbYV09dmEuZnJvbVN0ZXBwaW5nKGIpO3ZhciBkPVwidHJhbnNsYXRlKFwiK1YoVChZKGIsMCktQmEpLFwiMFwiKStcIilcIjtrYVthXS5zdHlsZVtjLnRyYW5zZm9ybVJ1bGVdPWQsYmEoYSksYmEoYSsxKX1mdW5jdGlvbiBfKCl7dGEuZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgYj1zYVthXT41MD8tMToxLGM9Mysoa2EubGVuZ3RoK2IqYSk7a2FbYV0uc3R5bGUuekluZGV4PWN9KX1mdW5jdGlvbiBhYShhLGIsYyxkKXtyZXR1cm4hMSE9PShiPVUoc2EsYSxiLGMsZCwhMSkpJiYoWihhLGIpLCEwKX1mdW5jdGlvbiBiYShhKXtpZihsYVthXSl7dmFyIGI9MCxkPTEwMDswIT09YSYmKGI9c2FbYS0xXSksYSE9PWxhLmxlbmd0aC0xJiYoZD1zYVthXSk7dmFyIGU9ZC1iLGY9XCJ0cmFuc2xhdGUoXCIrVihUKFkoYixlKSksXCIwXCIpK1wiKVwiLGc9XCJzY2FsZShcIitWKGUvMTAwLFwiMVwiKStcIilcIjtsYVthXS5zdHlsZVtjLnRyYW5zZm9ybVJ1bGVdPWYrXCIgXCIrZ319ZnVuY3Rpb24gY2EoYSxiKXtyZXR1cm4gbnVsbD09PWF8fCExPT09YXx8dm9pZCAwPT09YT9zYVtiXTooXCJudW1iZXJcIj09dHlwZW9mIGEmJihhPVN0cmluZyhhKSksYT1jLmZvcm1hdC5mcm9tKGEpLGE9dmEudG9TdGVwcGluZyhhKSwhMT09PWF8fGlzTmFOKGEpP3NhW2JdOmEpfWZ1bmN0aW9uIGRhKGEsYil7dmFyIGQ9ayhhKSxlPXZvaWQgMD09PXNhWzBdO2I9dm9pZCAwPT09Ynx8ISFiLGMuYW5pbWF0ZSYmIWUmJmkocmEsYy5jc3NDbGFzc2VzLnRhcCxjLmFuaW1hdGlvbkR1cmF0aW9uKSx0YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2FhKGEsY2EoZFthXSxhKSwhMCwhMSl9KSx0YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2FhKGEsc2FbYV0sITAsITApfSksXygpLHRhLmZvckVhY2goZnVuY3Rpb24oYSl7UyhcInVwZGF0ZVwiLGEpLG51bGwhPT1kW2FdJiZiJiZTKFwic2V0XCIsYSl9KX1mdW5jdGlvbiBlYShhKXtkYShjLnN0YXJ0LGEpfWZ1bmN0aW9uIGZhKCl7dmFyIGE9d2EubWFwKGMuZm9ybWF0LnRvKTtyZXR1cm4gMT09PWEubGVuZ3RoP2FbMF06YX1mdW5jdGlvbiBnYSgpe2Zvcih2YXIgYSBpbiBjLmNzc0NsYXNzZXMpYy5jc3NDbGFzc2VzLmhhc093blByb3BlcnR5KGEpJiZuKHJhLGMuY3NzQ2xhc3Nlc1thXSk7Zm9yKDtyYS5maXJzdENoaWxkOylyYS5yZW1vdmVDaGlsZChyYS5maXJzdENoaWxkKTtkZWxldGUgcmEubm9VaVNsaWRlcn1mdW5jdGlvbiBoYSgpe3JldHVybiBzYS5tYXAoZnVuY3Rpb24oYSxiKXt2YXIgYz12YS5nZXROZWFyYnlTdGVwcyhhKSxkPXdhW2JdLGU9Yy50aGlzU3RlcC5zdGVwLGY9bnVsbDshMSE9PWUmJmQrZT5jLnN0ZXBBZnRlci5zdGFydFZhbHVlJiYoZT1jLnN0ZXBBZnRlci5zdGFydFZhbHVlLWQpLGY9ZD5jLnRoaXNTdGVwLnN0YXJ0VmFsdWU/Yy50aGlzU3RlcC5zdGVwOiExIT09Yy5zdGVwQmVmb3JlLnN0ZXAmJmQtYy5zdGVwQmVmb3JlLmhpZ2hlc3RTdGVwLDEwMD09PWE/ZT1udWxsOjA9PT1hJiYoZj1udWxsKTt2YXIgZz12YS5jb3VudFN0ZXBEZWNpbWFscygpO3JldHVybiBudWxsIT09ZSYmITEhPT1lJiYoZT1OdW1iZXIoZS50b0ZpeGVkKGcpKSksbnVsbCE9PWYmJiExIT09ZiYmKGY9TnVtYmVyKGYudG9GaXhlZChnKSkpLFtmLGVdfSl9ZnVuY3Rpb24gaWEoYSxiKXt2YXIgZD1mYSgpLGU9W1wibWFyZ2luXCIsXCJsaW1pdFwiLFwicGFkZGluZ1wiLFwicmFuZ2VcIixcImFuaW1hdGVcIixcInNuYXBcIixcInN0ZXBcIixcImZvcm1hdFwiXTtlLmZvckVhY2goZnVuY3Rpb24oYil7dm9pZCAwIT09YVtiXSYmKGZbYl09YVtiXSl9KTt2YXIgZz1YKGYpO2UuZm9yRWFjaChmdW5jdGlvbihiKXt2b2lkIDAhPT1hW2JdJiYoY1tiXT1nW2JdKX0pLHZhPWcuc3BlY3RydW0sYy5tYXJnaW49Zy5tYXJnaW4sYy5saW1pdD1nLmxpbWl0LGMucGFkZGluZz1nLnBhZGRpbmcsYy5waXBzJiZEKGMucGlwcyksc2E9W10sZGEoYS5zdGFydHx8ZCxiKX12YXIgamEsa2EsbGEsbWEsbmEsb2E9cSgpLHBhPXMoKSxxYT1wYSYmcigpLHJhPWEsc2E9W10sdGE9W10sdWE9MCx2YT1jLnNwZWN0cnVtLHdhPVtdLHhhPXt9LHlhPWEub3duZXJEb2N1bWVudCx6YT15YS5kb2N1bWVudEVsZW1lbnQsQWE9eWEuYm9keSxCYT1cInJ0bFwiPT09eWEuZGlyfHwxPT09Yy5vcnQ/MDoxMDA7cmV0dXJuIHYocmEpLHUoYy5jb25uZWN0LGphKSxQKGMuZXZlbnRzKSxkYShjLnN0YXJ0KSxtYT17ZGVzdHJveTpnYSxzdGVwczpoYSxvbjpRLG9mZjpSLGdldDpmYSxzZXQ6ZGEscmVzZXQ6ZWEsX19tb3ZlSGFuZGxlczpmdW5jdGlvbihhLGIsYyl7VyhhLGIsc2EsYyl9LG9wdGlvbnM6Zix1cGRhdGVPcHRpb25zOmlhLHRhcmdldDpyYSxyZW1vdmVQaXBzOkMscGlwczpEfSxjLnBpcHMmJkQoYy5waXBzKSxjLnRvb2x0aXBzJiZ4KCkseSgpLG1hfWZ1bmN0aW9uIFooYSxiKXtpZighYXx8IWEubm9kZU5hbWUpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6IGNyZWF0ZSByZXF1aXJlcyBhIHNpbmdsZSBlbGVtZW50LCBnb3Q6IFwiK2EpO2lmKGEubm9VaVNsaWRlcil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogU2xpZGVyIHdhcyBhbHJlYWR5IGluaXRpYWxpemVkLlwiKTt2YXIgYz1YKGIsYSksZD1ZKGEsYyxiKTtyZXR1cm4gYS5ub1VpU2xpZGVyPWQsZH12YXIgJD1cIjExLjEuMFwiO0QucHJvdG90eXBlLmdldE1hcmdpbj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLnhOdW1TdGVwc1swXTtpZihiJiZhL2IlMSE9MCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2xpbWl0JywgJ21hcmdpbicgYW5kICdwYWRkaW5nJyBtdXN0IGJlIGRpdmlzaWJsZSBieSBzdGVwLlwiKTtyZXR1cm4gMj09PXRoaXMueFBjdC5sZW5ndGgmJnUodGhpcy54VmFsLGEpfSxELnByb3RvdHlwZS50b1N0ZXBwaW5nPWZ1bmN0aW9uKGEpe3JldHVybiBhPXkodGhpcy54VmFsLHRoaXMueFBjdCxhKX0sRC5wcm90b3R5cGUuZnJvbVN0ZXBwaW5nPWZ1bmN0aW9uKGEpe3JldHVybiB6KHRoaXMueFZhbCx0aGlzLnhQY3QsYSl9LEQucHJvdG90eXBlLmdldFN0ZXA9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9QSh0aGlzLnhQY3QsdGhpcy54U3RlcHMsdGhpcy5zbmFwLGEpfSxELnByb3RvdHlwZS5nZXROZWFyYnlTdGVwcz1mdW5jdGlvbihhKXt2YXIgYj14KGEsdGhpcy54UGN0KTtyZXR1cm57c3RlcEJlZm9yZTp7c3RhcnRWYWx1ZTp0aGlzLnhWYWxbYi0yXSxzdGVwOnRoaXMueE51bVN0ZXBzW2ItMl0saGlnaGVzdFN0ZXA6dGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtiLTJdfSx0aGlzU3RlcDp7c3RhcnRWYWx1ZTp0aGlzLnhWYWxbYi0xXSxzdGVwOnRoaXMueE51bVN0ZXBzW2ItMV0saGlnaGVzdFN0ZXA6dGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtiLTFdfSxzdGVwQWZ0ZXI6e3N0YXJ0VmFsdWU6dGhpcy54VmFsW2ItMF0sc3RlcDp0aGlzLnhOdW1TdGVwc1tiLTBdLGhpZ2hlc3RTdGVwOnRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXBbYi0wXX19fSxELnByb3RvdHlwZS5jb3VudFN0ZXBEZWNpbWFscz1mdW5jdGlvbigpe3ZhciBhPXRoaXMueE51bVN0ZXBzLm1hcChsKTtyZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCxhKX0sRC5wcm90b3R5cGUuY29udmVydD1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5nZXRTdGVwKHRoaXMudG9TdGVwcGluZyhhKSl9O3ZhciBfPXt0bzpmdW5jdGlvbihhKXtyZXR1cm4gdm9pZCAwIT09YSYmYS50b0ZpeGVkKDIpfSxmcm9tOk51bWJlcn07cmV0dXJue3ZlcnNpb246JCxjcmVhdGU6Wn19KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpIHtcclxuXHJcbiAgICBpZiAoIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcclxuXHJcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxyXG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XHJcblxyXG4gICAgfSBlbHNlIGlmICggdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICkge1xyXG5cclxuICAgICAgICAvLyBOb2RlL0NvbW1vbkpTXHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzXHJcbiAgICAgICAgd2luZG93LndOdW1iID0gZmFjdG9yeSgpO1xyXG4gICAgfVxyXG5cclxufShmdW5jdGlvbigpe1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG52YXIgRm9ybWF0T3B0aW9ucyA9IFtcclxuXHQnZGVjaW1hbHMnLFxyXG5cdCd0aG91c2FuZCcsXHJcblx0J21hcmsnLFxyXG5cdCdwcmVmaXgnLFxyXG5cdCdzdWZmaXgnLFxyXG5cdCdlbmNvZGVyJyxcclxuXHQnZGVjb2RlcicsXHJcblx0J25lZ2F0aXZlQmVmb3JlJyxcclxuXHQnbmVnYXRpdmUnLFxyXG5cdCdlZGl0JyxcclxuXHQndW5kbydcclxuXTtcclxuXHJcbi8vIEdlbmVyYWxcclxuXHJcblx0Ly8gUmV2ZXJzZSBhIHN0cmluZ1xyXG5cdGZ1bmN0aW9uIHN0clJldmVyc2UgKCBhICkge1xyXG5cdFx0cmV0dXJuIGEuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKTtcclxuXHR9XHJcblxyXG5cdC8vIENoZWNrIGlmIGEgc3RyaW5nIHN0YXJ0cyB3aXRoIGEgc3BlY2lmaWVkIHByZWZpeC5cclxuXHRmdW5jdGlvbiBzdHJTdGFydHNXaXRoICggaW5wdXQsIG1hdGNoICkge1xyXG5cdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCBtYXRjaC5sZW5ndGgpID09PSBtYXRjaDtcclxuXHR9XHJcblxyXG5cdC8vIENoZWNrIGlzIGEgc3RyaW5nIGVuZHMgaW4gYSBzcGVjaWZpZWQgc3VmZml4LlxyXG5cdGZ1bmN0aW9uIHN0ckVuZHNXaXRoICggaW5wdXQsIG1hdGNoICkge1xyXG5cdFx0cmV0dXJuIGlucHV0LnNsaWNlKC0xICogbWF0Y2gubGVuZ3RoKSA9PT0gbWF0Y2g7XHJcblx0fVxyXG5cclxuXHQvLyBUaHJvdyBhbiBlcnJvciBpZiBmb3JtYXR0aW5nIG9wdGlvbnMgYXJlIGluY29tcGF0aWJsZS5cclxuXHRmdW5jdGlvbiB0aHJvd0VxdWFsRXJyb3IoIEYsIGEsIGIgKSB7XHJcblx0XHRpZiAoIChGW2FdIHx8IEZbYl0pICYmIChGW2FdID09PSBGW2JdKSApIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gQ2hlY2sgaWYgYSBudW1iZXIgaXMgZmluaXRlIGFuZCBub3QgTmFOXHJcblx0ZnVuY3Rpb24gaXNWYWxpZE51bWJlciAoIGlucHV0ICkge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUoIGlucHV0ICk7XHJcblx0fVxyXG5cclxuXHQvLyBQcm92aWRlIHJvdW5kaW5nLWFjY3VyYXRlIHRvRml4ZWQgbWV0aG9kLlxyXG5cdC8vIEJvcnJvd2VkOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTMyMzMzMC83NzUyNjVcclxuXHRmdW5jdGlvbiB0b0ZpeGVkICggdmFsdWUsIGV4cCApIHtcclxuXHRcdHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKS5zcGxpdCgnZScpO1xyXG5cdFx0dmFsdWUgPSBNYXRoLnJvdW5kKCsodmFsdWVbMF0gKyAnZScgKyAodmFsdWVbMV0gPyAoK3ZhbHVlWzFdICsgZXhwKSA6IGV4cCkpKTtcclxuXHRcdHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKS5zcGxpdCgnZScpO1xyXG5cdFx0cmV0dXJuICgrKHZhbHVlWzBdICsgJ2UnICsgKHZhbHVlWzFdID8gKCt2YWx1ZVsxXSAtIGV4cCkgOiAtZXhwKSkpLnRvRml4ZWQoZXhwKTtcclxuXHR9XHJcblxyXG5cclxuLy8gRm9ybWF0dGluZ1xyXG5cclxuXHQvLyBBY2NlcHQgYSBudW1iZXIgYXMgaW5wdXQsIG91dHB1dCBmb3JtYXR0ZWQgc3RyaW5nLlxyXG5cdGZ1bmN0aW9uIGZvcm1hdFRvICggZGVjaW1hbHMsIHRob3VzYW5kLCBtYXJrLCBwcmVmaXgsIHN1ZmZpeCwgZW5jb2RlciwgZGVjb2RlciwgbmVnYXRpdmVCZWZvcmUsIG5lZ2F0aXZlLCBlZGl0LCB1bmRvLCBpbnB1dCApIHtcclxuXHJcblx0XHR2YXIgb3JpZ2luYWxJbnB1dCA9IGlucHV0LCBpbnB1dElzTmVnYXRpdmUsIGlucHV0UGllY2VzLCBpbnB1dEJhc2UsIGlucHV0RGVjaW1hbHMgPSAnJywgb3V0cHV0ID0gJyc7XHJcblxyXG5cdFx0Ly8gQXBwbHkgdXNlciBlbmNvZGVyIHRvIHRoZSBpbnB1dC5cclxuXHRcdC8vIEV4cGVjdGVkIG91dGNvbWU6IG51bWJlci5cclxuXHRcdGlmICggZW5jb2RlciApIHtcclxuXHRcdFx0aW5wdXQgPSBlbmNvZGVyKGlucHV0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTdG9wIGlmIG5vIHZhbGlkIG51bWJlciB3YXMgcHJvdmlkZWQsIHRoZSBudW1iZXIgaXMgaW5maW5pdGUgb3IgTmFOLlxyXG5cdFx0aWYgKCAhaXNWYWxpZE51bWJlcihpbnB1dCkgKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSb3VuZGluZyBhd2F5IGRlY2ltYWxzIG1pZ2h0IGNhdXNlIGEgdmFsdWUgb2YgLTBcclxuXHRcdC8vIHdoZW4gdXNpbmcgdmVyeSBzbWFsbCByYW5nZXMuIFJlbW92ZSB0aG9zZSBjYXNlcy5cclxuXHRcdGlmICggZGVjaW1hbHMgIT09IGZhbHNlICYmIHBhcnNlRmxvYXQoaW5wdXQudG9GaXhlZChkZWNpbWFscykpID09PSAwICkge1xyXG5cdFx0XHRpbnB1dCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRm9ybWF0dGluZyBpcyBkb25lIG9uIGFic29sdXRlIG51bWJlcnMsXHJcblx0XHQvLyBkZWNvcmF0ZWQgYnkgYW4gb3B0aW9uYWwgbmVnYXRpdmUgc3ltYm9sLlxyXG5cdFx0aWYgKCBpbnB1dCA8IDAgKSB7XHJcblx0XHRcdGlucHV0SXNOZWdhdGl2ZSA9IHRydWU7XHJcblx0XHRcdGlucHV0ID0gTWF0aC5hYnMoaW5wdXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlZHVjZSB0aGUgbnVtYmVyIG9mIGRlY2ltYWxzIHRvIHRoZSBzcGVjaWZpZWQgb3B0aW9uLlxyXG5cdFx0aWYgKCBkZWNpbWFscyAhPT0gZmFsc2UgKSB7XHJcblx0XHRcdGlucHV0ID0gdG9GaXhlZCggaW5wdXQsIGRlY2ltYWxzICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVHJhbnNmb3JtIHRoZSBudW1iZXIgaW50byBhIHN0cmluZywgc28gaXQgY2FuIGJlIHNwbGl0LlxyXG5cdFx0aW5wdXQgPSBpbnB1dC50b1N0cmluZygpO1xyXG5cclxuXHRcdC8vIEJyZWFrIHRoZSBudW1iZXIgb24gdGhlIGRlY2ltYWwgc2VwYXJhdG9yLlxyXG5cdFx0aWYgKCBpbnB1dC5pbmRleE9mKCcuJykgIT09IC0xICkge1xyXG5cdFx0XHRpbnB1dFBpZWNlcyA9IGlucHV0LnNwbGl0KCcuJyk7XHJcblxyXG5cdFx0XHRpbnB1dEJhc2UgPSBpbnB1dFBpZWNlc1swXTtcclxuXHJcblx0XHRcdGlmICggbWFyayApIHtcclxuXHRcdFx0XHRpbnB1dERlY2ltYWxzID0gbWFyayArIGlucHV0UGllY2VzWzFdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHQvLyBJZiBpdCBpc24ndCBzcGxpdCwgdGhlIGVudGlyZSBudW1iZXIgd2lsbCBkby5cclxuXHRcdFx0aW5wdXRCYXNlID0gaW5wdXQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gR3JvdXAgbnVtYmVycyBpbiBzZXRzIG9mIHRocmVlLlxyXG5cdFx0aWYgKCB0aG91c2FuZCApIHtcclxuXHRcdFx0aW5wdXRCYXNlID0gc3RyUmV2ZXJzZShpbnB1dEJhc2UpLm1hdGNoKC8uezEsM30vZyk7XHJcblx0XHRcdGlucHV0QmFzZSA9IHN0clJldmVyc2UoaW5wdXRCYXNlLmpvaW4oIHN0clJldmVyc2UoIHRob3VzYW5kICkgKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWYgdGhlIG51bWJlciBpcyBuZWdhdGl2ZSwgcHJlZml4IHdpdGggbmVnYXRpb24gc3ltYm9sLlxyXG5cdFx0aWYgKCBpbnB1dElzTmVnYXRpdmUgJiYgbmVnYXRpdmVCZWZvcmUgKSB7XHJcblx0XHRcdG91dHB1dCArPSBuZWdhdGl2ZUJlZm9yZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBQcmVmaXggdGhlIG51bWJlclxyXG5cdFx0aWYgKCBwcmVmaXggKSB7XHJcblx0XHRcdG91dHB1dCArPSBwcmVmaXg7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTm9ybWFsIG5lZ2F0aXZlIG9wdGlvbiBjb21lcyBhZnRlciB0aGUgcHJlZml4LiBEZWZhdWx0cyB0byAnLScuXHJcblx0XHRpZiAoIGlucHV0SXNOZWdhdGl2ZSAmJiBuZWdhdGl2ZSApIHtcclxuXHRcdFx0b3V0cHV0ICs9IG5lZ2F0aXZlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFwcGVuZCB0aGUgYWN0dWFsIG51bWJlci5cclxuXHRcdG91dHB1dCArPSBpbnB1dEJhc2U7XHJcblx0XHRvdXRwdXQgKz0gaW5wdXREZWNpbWFscztcclxuXHJcblx0XHQvLyBBcHBseSB0aGUgc3VmZml4LlxyXG5cdFx0aWYgKCBzdWZmaXggKSB7XHJcblx0XHRcdG91dHB1dCArPSBzdWZmaXg7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUnVuIHRoZSBvdXRwdXQgdGhyb3VnaCBhIHVzZXItc3BlY2lmaWVkIHBvc3QtZm9ybWF0dGVyLlxyXG5cdFx0aWYgKCBlZGl0ICkge1xyXG5cdFx0XHRvdXRwdXQgPSBlZGl0ICggb3V0cHV0LCBvcmlnaW5hbElucHV0ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQWxsIGRvbmUuXHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH1cclxuXHJcblx0Ly8gQWNjZXB0IGEgc3RpbmcgYXMgaW5wdXQsIG91dHB1dCBkZWNvZGVkIG51bWJlci5cclxuXHRmdW5jdGlvbiBmb3JtYXRGcm9tICggZGVjaW1hbHMsIHRob3VzYW5kLCBtYXJrLCBwcmVmaXgsIHN1ZmZpeCwgZW5jb2RlciwgZGVjb2RlciwgbmVnYXRpdmVCZWZvcmUsIG5lZ2F0aXZlLCBlZGl0LCB1bmRvLCBpbnB1dCApIHtcclxuXHJcblx0XHR2YXIgb3JpZ2luYWxJbnB1dCA9IGlucHV0LCBpbnB1dElzTmVnYXRpdmUsIG91dHB1dCA9ICcnO1xyXG5cclxuXHRcdC8vIFVzZXIgZGVmaW5lZCBwcmUtZGVjb2Rlci4gUmVzdWx0IG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nLlxyXG5cdFx0aWYgKCB1bmRvICkge1xyXG5cdFx0XHRpbnB1dCA9IHVuZG8oaW5wdXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRlc3QgdGhlIGlucHV0LiBDYW4ndCBiZSBlbXB0eS5cclxuXHRcdGlmICggIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycgKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBJZiB0aGUgc3RyaW5nIHN0YXJ0cyB3aXRoIHRoZSBuZWdhdGl2ZUJlZm9yZSB2YWx1ZTogcmVtb3ZlIGl0LlxyXG5cdFx0Ly8gUmVtZW1iZXIgaXMgd2FzIHRoZXJlLCB0aGUgbnVtYmVyIGlzIG5lZ2F0aXZlLlxyXG5cdFx0aWYgKCBuZWdhdGl2ZUJlZm9yZSAmJiBzdHJTdGFydHNXaXRoKGlucHV0LCBuZWdhdGl2ZUJlZm9yZSkgKSB7XHJcblx0XHRcdGlucHV0ID0gaW5wdXQucmVwbGFjZShuZWdhdGl2ZUJlZm9yZSwgJycpO1xyXG5cdFx0XHRpbnB1dElzTmVnYXRpdmUgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlcGVhdCB0aGUgc2FtZSBwcm9jZWR1cmUgZm9yIHRoZSBwcmVmaXguXHJcblx0XHRpZiAoIHByZWZpeCAmJiBzdHJTdGFydHNXaXRoKGlucHV0LCBwcmVmaXgpICkge1xyXG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UocHJlZml4LCAnJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQW5kIGFnYWluIGZvciBuZWdhdGl2ZS5cclxuXHRcdGlmICggbmVnYXRpdmUgJiYgc3RyU3RhcnRzV2l0aChpbnB1dCwgbmVnYXRpdmUpICkge1xyXG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UobmVnYXRpdmUsICcnKTtcclxuXHRcdFx0aW5wdXRJc05lZ2F0aXZlID0gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZW1vdmUgdGhlIHN1ZmZpeC5cclxuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1N0cmluZy9zbGljZVxyXG5cdFx0aWYgKCBzdWZmaXggJiYgc3RyRW5kc1dpdGgoaW5wdXQsIHN1ZmZpeCkgKSB7XHJcblx0XHRcdGlucHV0ID0gaW5wdXQuc2xpY2UoMCwgLTEgKiBzdWZmaXgubGVuZ3RoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZW1vdmUgdGhlIHRob3VzYW5kIGdyb3VwaW5nLlxyXG5cdFx0aWYgKCB0aG91c2FuZCApIHtcclxuXHRcdFx0aW5wdXQgPSBpbnB1dC5zcGxpdCh0aG91c2FuZCkuam9pbignJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2V0IHRoZSBkZWNpbWFsIHNlcGFyYXRvciBiYWNrIHRvIHBlcmlvZC5cclxuXHRcdGlmICggbWFyayApIHtcclxuXHRcdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKG1hcmssICcuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUHJlcGVuZCB0aGUgbmVnYXRpdmUgc3ltYm9sLlxyXG5cdFx0aWYgKCBpbnB1dElzTmVnYXRpdmUgKSB7XHJcblx0XHRcdG91dHB1dCArPSAnLSc7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQWRkIHRoZSBudW1iZXJcclxuXHRcdG91dHB1dCArPSBpbnB1dDtcclxuXHJcblx0XHQvLyBUcmltIGFsbCBub24tbnVtZXJpYyBjaGFyYWN0ZXJzIChhbGxvdyAnLicgYW5kICctJyk7XHJcblx0XHRvdXRwdXQgPSBvdXRwdXQucmVwbGFjZSgvW14wLTlcXC5cXC0uXS9nLCAnJyk7XHJcblxyXG5cdFx0Ly8gVGhlIHZhbHVlIGNvbnRhaW5zIG5vIHBhcnNlLWFibGUgbnVtYmVyLlxyXG5cdFx0aWYgKCBvdXRwdXQgPT09ICcnICkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ292ZXJ0IHRvIG51bWJlci5cclxuXHRcdG91dHB1dCA9IE51bWJlcihvdXRwdXQpO1xyXG5cclxuXHRcdC8vIFJ1biB0aGUgdXNlci1zcGVjaWZpZWQgcG9zdC1kZWNvZGVyLlxyXG5cdFx0aWYgKCBkZWNvZGVyICkge1xyXG5cdFx0XHRvdXRwdXQgPSBkZWNvZGVyKG91dHB1dCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ2hlY2sgaXMgdGhlIG91dHB1dCBpcyB2YWxpZCwgb3RoZXJ3aXNlOiByZXR1cm4gZmFsc2UuXHJcblx0XHRpZiAoICFpc1ZhbGlkTnVtYmVyKG91dHB1dCkgKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH1cclxuXHJcblxyXG4vLyBGcmFtZXdvcmtcclxuXHJcblx0Ly8gVmFsaWRhdGUgZm9ybWF0dGluZyBvcHRpb25zXHJcblx0ZnVuY3Rpb24gdmFsaWRhdGUgKCBpbnB1dE9wdGlvbnMgKSB7XHJcblxyXG5cdFx0dmFyIGksIG9wdGlvbk5hbWUsIG9wdGlvblZhbHVlLFxyXG5cdFx0XHRmaWx0ZXJlZE9wdGlvbnMgPSB7fTtcclxuXHJcblx0XHRpZiAoIGlucHV0T3B0aW9uc1snc3VmZml4J10gPT09IHVuZGVmaW5lZCApIHtcclxuXHRcdFx0aW5wdXRPcHRpb25zWydzdWZmaXgnXSA9IGlucHV0T3B0aW9uc1sncG9zdGZpeCddO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAoIGkgPSAwOyBpIDwgRm9ybWF0T3B0aW9ucy5sZW5ndGg7IGkrPTEgKSB7XHJcblxyXG5cdFx0XHRvcHRpb25OYW1lID0gRm9ybWF0T3B0aW9uc1tpXTtcclxuXHRcdFx0b3B0aW9uVmFsdWUgPSBpbnB1dE9wdGlvbnNbb3B0aW9uTmFtZV07XHJcblxyXG5cdFx0XHRpZiAoIG9wdGlvblZhbHVlID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG5cdFx0XHRcdC8vIE9ubHkgZGVmYXVsdCBpZiBuZWdhdGl2ZUJlZm9yZSBpc24ndCBzZXQuXHJcblx0XHRcdFx0aWYgKCBvcHRpb25OYW1lID09PSAnbmVnYXRpdmUnICYmICFmaWx0ZXJlZE9wdGlvbnMubmVnYXRpdmVCZWZvcmUgKSB7XHJcblx0XHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnNbb3B0aW9uTmFtZV0gPSAnLSc7XHJcblx0XHRcdFx0Ly8gRG9uJ3Qgc2V0IGEgZGVmYXVsdCBmb3IgbWFyayB3aGVuICd0aG91c2FuZCcgaXMgc2V0LlxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoIG9wdGlvbk5hbWUgPT09ICdtYXJrJyAmJiBmaWx0ZXJlZE9wdGlvbnMudGhvdXNhbmQgIT09ICcuJyApIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9ICcuJztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gRmxvYXRpbmcgcG9pbnRzIGluIEpTIGFyZSBzdGFibGUgdXAgdG8gNyBkZWNpbWFscy5cclxuXHRcdFx0fSBlbHNlIGlmICggb3B0aW9uTmFtZSA9PT0gJ2RlY2ltYWxzJyApIHtcclxuXHRcdFx0XHRpZiAoIG9wdGlvblZhbHVlID49IDAgJiYgb3B0aW9uVmFsdWUgPCA4ICkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gb3B0aW9uVmFsdWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihvcHRpb25OYW1lKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBUaGVzZSBvcHRpb25zLCB3aGVuIHByb3ZpZGVkLCBtdXN0IGJlIGZ1bmN0aW9ucy5cclxuXHRcdFx0fSBlbHNlIGlmICggb3B0aW9uTmFtZSA9PT0gJ2VuY29kZXInIHx8IG9wdGlvbk5hbWUgPT09ICdkZWNvZGVyJyB8fCBvcHRpb25OYW1lID09PSAnZWRpdCcgfHwgb3B0aW9uTmFtZSA9PT0gJ3VuZG8nICkge1xyXG5cdFx0XHRcdGlmICggdHlwZW9mIG9wdGlvblZhbHVlID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gb3B0aW9uVmFsdWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihvcHRpb25OYW1lKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBPdGhlciBvcHRpb25zIGFyZSBzdHJpbmdzLlxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvcHRpb25WYWx1ZSA9PT0gJ3N0cmluZycgKSB7XHJcblx0XHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnNbb3B0aW9uTmFtZV0gPSBvcHRpb25WYWx1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKG9wdGlvbk5hbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNvbWUgdmFsdWVzIGNhbid0IGJlIGV4dHJhY3RlZCBmcm9tIGFcclxuXHRcdC8vIHN0cmluZyBpZiBjZXJ0YWluIGNvbWJpbmF0aW9ucyBhcmUgcHJlc2VudC5cclxuXHRcdHRocm93RXF1YWxFcnJvcihmaWx0ZXJlZE9wdGlvbnMsICdtYXJrJywgJ3Rob3VzYW5kJyk7XHJcblx0XHR0aHJvd0VxdWFsRXJyb3IoZmlsdGVyZWRPcHRpb25zLCAncHJlZml4JywgJ25lZ2F0aXZlJyk7XHJcblx0XHR0aHJvd0VxdWFsRXJyb3IoZmlsdGVyZWRPcHRpb25zLCAncHJlZml4JywgJ25lZ2F0aXZlQmVmb3JlJyk7XHJcblxyXG5cdFx0cmV0dXJuIGZpbHRlcmVkT3B0aW9ucztcclxuXHR9XHJcblxyXG5cdC8vIFBhc3MgYWxsIG9wdGlvbnMgYXMgZnVuY3Rpb24gYXJndW1lbnRzXHJcblx0ZnVuY3Rpb24gcGFzc0FsbCAoIG9wdGlvbnMsIG1ldGhvZCwgaW5wdXQgKSB7XHJcblx0XHR2YXIgaSwgYXJncyA9IFtdO1xyXG5cclxuXHRcdC8vIEFkZCBhbGwgb3B0aW9ucyBpbiBvcmRlciBvZiBGb3JtYXRPcHRpb25zXHJcblx0XHRmb3IgKCBpID0gMDsgaSA8IEZvcm1hdE9wdGlvbnMubGVuZ3RoOyBpKz0xICkge1xyXG5cdFx0XHRhcmdzLnB1c2gob3B0aW9uc1tGb3JtYXRPcHRpb25zW2ldXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQXBwZW5kIHRoZSBpbnB1dCwgdGhlbiBjYWxsIHRoZSBtZXRob2QsIHByZXNlbnRpbmcgYWxsXHJcblx0XHQvLyBvcHRpb25zIGFzIGFyZ3VtZW50cy5cclxuXHRcdGFyZ3MucHVzaChpbnB1dCk7XHJcblx0XHRyZXR1cm4gbWV0aG9kLmFwcGx5KCcnLCBhcmdzKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHdOdW1iICggb3B0aW9ucyApIHtcclxuXHJcblx0XHRpZiAoICEodGhpcyBpbnN0YW5jZW9mIHdOdW1iKSApIHtcclxuXHRcdFx0cmV0dXJuIG5ldyB3TnVtYiAoIG9wdGlvbnMgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHR5cGVvZiBvcHRpb25zICE9PSBcIm9iamVjdFwiICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0b3B0aW9ucyA9IHZhbGlkYXRlKG9wdGlvbnMpO1xyXG5cclxuXHRcdC8vIENhbGwgJ2Zvcm1hdFRvJyB3aXRoIHByb3BlciBhcmd1bWVudHMuXHJcblx0XHR0aGlzLnRvID0gZnVuY3Rpb24gKCBpbnB1dCApIHtcclxuXHRcdFx0cmV0dXJuIHBhc3NBbGwob3B0aW9ucywgZm9ybWF0VG8sIGlucHV0KTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gQ2FsbCAnZm9ybWF0RnJvbScgd2l0aCBwcm9wZXIgYXJndW1lbnRzLlxyXG5cdFx0dGhpcy5mcm9tID0gZnVuY3Rpb24gKCBpbnB1dCApIHtcclxuXHRcdFx0cmV0dXJuIHBhc3NBbGwob3B0aW9ucywgZm9ybWF0RnJvbSwgaW5wdXQpO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB3TnVtYjtcclxuXHJcbn0pKTtcclxuIl19
