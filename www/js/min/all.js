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
	showOnePoint(indexes[0]);
	showOnePoint(indexes[1]);
	//console.log('sticks', sticks);
	//console.log('keyFromPtSet', keyFromPtSet(indexes));
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

	console.log('faces', faces);
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
	//console.log(ptsIndexes);
	let vertices = [];
	ptsIndexes.forEach(index => {
		vertices.push(allPoints[index].clone());
	});
	// console.log('vertices', vertices);

	let geometry = new THREE.ConvexBufferGeometry(vertices);
	// console.log('geometry', geometry);
	geometry.faces.forEach(face => {
		let pt1 = face.getEdge(0).head().point,
			pt2 = face.getEdge(1).head().point,
			pt3 = face.getEdge(2).head().point;
		// console.log('face', face);
		// console.log('pt1', pt1);
		// console.log('pt2', pt2);
		// console.log('pt3', pt3);
		let index1 = allPoints.map(function(e) { return e.equals(pt1) }).indexOf(true),
			index2 = allPoints.map(function(e) { return e.equals(pt2) }).indexOf(true),
			index3 = allPoints.map(function(e) { return e.equals(pt3) }).indexOf(true);
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
			//console.log(chordsMap.get(i));
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

		/*for(track of parsed.track) {

			let deltaTime = 0;
			let note;
			let currNotes = [];
		
			for(event of track.event) {
				deltaTime += event.deltaTime;
				
				if(event.type === 9) {

					note = event.data[0] % 12;

					if(chordsMap.has(deltaTime)) {
						if(!chordsMap.get(deltaTime).includes(note)) 
							chordsMap.get(deltaTime).push(note);
					} else {
						chordsMap.set(deltaTime, [note]);
					}
				} 
			}
		}*/

		let oneTrack = [];
		
		parsed.track.forEach(track => {
			let currDeltaTime = 0;

			track.event.forEach(event => {
				currDeltaTime += event.deltaTime;

				oneTrack.push({ 'event': event, 'time': currDeltaTime});
			});
		});


		let currNotes = [];

		oneTrack.sort((a,b) => a.time - b.time).forEach(oneTrEvent => {
			let event = oneTrEvent.event;
			let type = event.type;
			let eventTime = oneTrEvent.time;

			if(type === 9) {
				let note = event.data[0] % 12;
				if(!currNotes.includes(note))
					currNotes.push(event.data[0] % 12);
			} else if(type === 8) {
				currNotes.splice(currNotes.indexOf(event.data[0] % 12), 1);
			}

			if(currNotes.length != 0) {
				//console.log(currNotes);
				chordsMap.set(eventTime, currNotes.slice());
			}
		});

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9uZVBvaW50LmpzIiwiVGhyZWVQb2ludHMuanMiLCJUd29Qb2ludHMuanMiLCJBbGxNZXNoZXMuanMiLCJBbGxQb2ludHMuanMiLCJDb21iaW5hdGlvbnMuanMiLCJtYWtlTGlnaHRzLmpzIiwiTWF0ZXJpYWxzLmpzIiwiUG9seUN5bGluZGVyLmpzIiwiUG9seU1lc2hlcy5qcyIsIlBvbHlTcGhlcmUuanMiLCJUZXh0U3ByaXRlLmpzIiwiVHJhbnNwTWVzaEdycC5qcyIsImNob3JkLmpzIiwicmVuZGVyMi5qcyIsImJhc2VDb252ZXJ0ZXIuanMiLCJtaWRpLXBhcnNlci5qcy50eHQiLCJtaWRpUGFyc2VyLmpzIiwicHl0ZXN0LmpzIiwic2VuZE1pZGlUb1B5LmpzIiwidGltZWxpbmUuanMiLCJub3Vpc2xpZGVyLm1pbi5qcyIsIndOdW1iLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIE9uZVBvaW50KHBvaW50LCBzY2FsZSkge1xyXG5cdHZhciBzcGhlcmUgPSBuZXcgVEhSRUUuU3BoZXJlQnVmZmVyR2VvbWV0cnkoMiw1MCw1MCk7XHJcblx0dmFyIHNwaGVyZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChzcGhlcmUsIFJHQk1hdGVyaWFsKTtcclxuXHJcblx0c3BoZXJlTWVzaC5wb3NpdGlvbi5jb3B5KHBvaW50LmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpKTtcclxuXHJcblx0cmV0dXJuIHNwaGVyZU1lc2g7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dPbmVQb2ludChpbmRleCkge1xyXG5cdHNwaGVyZXMuZ2V0KGluZGV4KS52aXNpYmxlID0gdHJ1ZTtcclxufSIsImZ1bmN0aW9uIFRocmVlUG9pbnRzKHBvaW50cywgc2NhbGUpIHtcclxuXHR0aGlzLmdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG5cdC8qdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcblx0Zm9yKHZhciBub3RlIGluIG5vdGVzKSB7XHJcblx0XHRnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKCBhbGxQb2ludHNbbm90ZXNbbm90ZV1dLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpICk7XHJcblx0fVxyXG5cclxuXHRnZW9tZXRyeS5mYWNlcy5wdXNoKG5ldyBUSFJFRS5GYWNlMygwLDEsMikpO1xyXG5cdGdlb21ldHJ5LmZhY2VzLnB1c2gobmV3IFRIUkVFLkZhY2UzKDIsMSwwKSk7XHJcblx0Z2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XHJcblxyXG5cdHZhciB2MSA9IGdlb21ldHJ5LnZlcnRpY2VzWzBdO1xyXG5cdHZhciB2MiA9IGdlb21ldHJ5LnZlcnRpY2VzWzFdO1xyXG5cdHZhciB2MyA9IGdlb21ldHJ5LnZlcnRpY2VzWzJdO1xyXG5cclxuXHR0aGlzLmdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYxLCB2MikpO1xyXG5cdHRoaXMuZ3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjIsIHYzKSk7XHJcblx0dGhpcy5ncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MywgdjEpKTsqL1xyXG5cclxuXHRsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcclxuXHRcclxuXHRsZXQgcG9zaXRpb25zID0gW107XHJcblx0bGV0IG5vcm1hbHMgPSBbXTtcclxuXHRcclxuXHRmb3IobGV0IHBvaW50IG9mIHBvaW50cykge1xyXG5cdFx0cG9zaXRpb25zLnB1c2gocG9pbnQuY2xvbmUoKS54KTtcclxuXHRcdHBvc2l0aW9ucy5wdXNoKHBvaW50LmNsb25lKCkueSk7XHJcblx0XHRwb3NpdGlvbnMucHVzaChwb2ludC5jbG9uZSgpLnopO1xyXG5cdFx0bm9ybWFscy5wdXNoKDAsMSwyKTtcclxuXHR9XHJcblxyXG5cdGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoIHBvc2l0aW9ucywgMyApICk7XHJcblx0Z2VvbWV0cnkuYWRkQXR0cmlidXRlKCAnbm9ybWFsJywgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoIG5vcm1hbHMsIDMgKSApO1xyXG5cclxuXHRnZW9tZXRyeS5zY2FsZShzY2FsZSwgc2NhbGUsIHNjYWxlKTtcclxuXHJcblx0dmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgdHJhbnNwYXJlbnRNYXRlcmlhbEZyb250KTtcclxuXHJcblx0dGhpcy5ncm91cC5hZGQobWVzaCk7XHJcblx0Ly90aGlzLmdyb3VwLmFkZChuZXcgUG9seVNwaGVyZXNGcm9tTm90ZXMobm90ZXMpKTtcclxuXHJcblx0Ly8gY29uc3QgdjEgPSBwb2ludHNbMF0uY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSk7XHJcblx0Ly8gY29uc3QgdjIgPSBwb2ludHNbMV0uY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSk7XHJcblx0Ly8gY29uc3QgdjMgPSBwb2ludHNbMl0uY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSk7XHJcblxyXG5cdC8vIHRoaXMuZ3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjEsIHYyKSk7XHJcblx0Ly8gdGhpcy5ncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MiwgdjMpKTtcclxuXHQvLyB0aGlzLmdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYzLCB2MSkpO1xyXG5cclxuXHRyZXR1cm4gdGhpcy5ncm91cDtcclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd1RocmVlUG9pbnRzKHB0c0luZGV4ZXMpIHtcclxuXHQvL2NvbnNvbGUubG9nKHB0c0luZGV4ZXMpO1xyXG5cdHB0c0luZGV4ZXMuZm9yRWFjaChpbmRleCA9PiB7XHJcblx0XHRzaG93T25lUG9pbnQoaW5kZXgpO1xyXG5cdH0pO1xyXG5cclxuXHRzdGlja3MuZ2V0KGtleUZyb21QdFNldChbcHRzSW5kZXhlc1swXSwgcHRzSW5kZXhlc1sxXV0pKS52aXNpYmxlID0gdHJ1ZTtcclxuXHRzdGlja3MuZ2V0KGtleUZyb21QdFNldChbcHRzSW5kZXhlc1sxXSwgcHRzSW5kZXhlc1syXV0pKS52aXNpYmxlID0gdHJ1ZTtcclxuXHRzdGlja3MuZ2V0KGtleUZyb21QdFNldChbcHRzSW5kZXhlc1syXSwgcHRzSW5kZXhlc1swXV0pKS52aXNpYmxlID0gdHJ1ZTtcclxuXHJcblx0ZmFjZXMuZ2V0KGtleUZyb21QdFNldChwdHNJbmRleGVzKSkudmlzaWJsZSA9IHRydWU7XHJcbn0iLCJmdW5jdGlvbiBUd29Qb2ludHMocG9pbnQxLCBwb2ludDIsIHNjYWxlKSB7XHJcblxyXG5cdHZhciB2MSA9IHBvaW50MS5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKTtcclxuXHR2YXIgdjIgPSBwb2ludDIuY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSk7XHJcblxyXG5cdC8vIHZhciBjeWxpbmRlciA9IG5ldyBUSFJFRS5DeWxpbmRlckJ1ZmZlckdlb21ldHJ5KDAuNCwgMC40LCB2MS5kaXN0YW5jZVRvKHYyKSwgMTAsIDAuNSwgdHJ1ZSk7XHJcblxyXG5cdHRoaXMuZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcblx0Lyp2YXIgc3BoZXJlQU1lc2ggPSBzcGhlcmVNZXNoLmNsb25lKCk7XHJcblx0c3BoZXJlQU1lc2gucG9zaXRpb24uY29weSh2MSk7XHJcblx0c3BoZXJlQU1lc2gudXBkYXRlTWF0cml4KCk7XHJcblxyXG5cdHZhciBzcGhlcmVCTWVzaCA9IHNwaGVyZU1lc2guY2xvbmUoKTtcclxuXHRzcGhlcmVCTWVzaC5wb3NpdGlvbi5jb3B5KHYyKTtcclxuXHRzcGhlcmVCTWVzaC51cGRhdGVNYXRyaXgoKTsqL1xyXG5cclxuXHR2YXIgY3lsaW5kZXJNZXNoID0gbmV3IEN5bGluZGVyRnJvbVB0cyh2MSwgdjIpO1xyXG5cclxuXHQvKnRoaXMuZ3JvdXAuYWRkKHNwaGVyZXNbbm90ZVZhbDFdKTtcclxuXHR0aGlzLmdyb3VwLmFkZChzcGhlcmVzW25vdGVWYWwyXSk7Ki9cclxuXHR0aGlzLmdyb3VwLmFkZChjeWxpbmRlck1lc2gpO1xyXG5cclxuXHRyZXR1cm4gdGhpcy5ncm91cDtcclxufVx0XHJcblxyXG5mdW5jdGlvbiBzaG93VHdvUG9pbnRzKGluZGV4ZXMpIHtcclxuXHRzaG93T25lUG9pbnQoaW5kZXhlc1swXSk7XHJcblx0c2hvd09uZVBvaW50KGluZGV4ZXNbMV0pO1xyXG5cdC8vY29uc29sZS5sb2coJ3N0aWNrcycsIHN0aWNrcyk7XHJcblx0Ly9jb25zb2xlLmxvZygna2V5RnJvbVB0U2V0Jywga2V5RnJvbVB0U2V0KGluZGV4ZXMpKTtcclxuXHRzdGlja3MuZ2V0KGtleUZyb21QdFNldChpbmRleGVzKSkudmlzaWJsZSA9IHRydWU7XHJcbn0iLCJsZXQgc3BoZXJlcywgc3RpY2tzLCBmYWNlcztcclxuXHJcbmZ1bmN0aW9uIG1ha2VBbGxNZXNoZXMoKSB7XHJcblx0c3BoZXJlcyA9IG5ldyBNYXAoKTtcclxuXHRzdGlja3MgPSBuZXcgTWFwKCk7XHJcblx0ZmFjZXMgPSBuZXcgTWFwKCk7XHJcblx0bGFiZWxzID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblx0Ly9jcmVhdGVzIGFsbCBwb2ludCBtZXNoZXNcclxuXHRhbGxQb2ludHMuZm9yRWFjaCgocG9pbnQsIGkpID0+IHtcclxuXHRcdGxldCBzcGhlcmUgPSBuZXcgT25lUG9pbnQocG9pbnQsIHNjYWxlKTtcclxuXHRcdHNwaGVyZS52aXNpYmxlID0gZmFsc2U7XHJcblx0XHRzcGhlcmVzLnNldChpLHNwaGVyZSk7XHJcblxyXG5cdFx0c2NlbmUuYWRkKHNwaGVyZSk7XHJcblx0XHQvKnZhciBsYWJlbCA9IG5ldyBtYWtlVGV4dFNwcml0ZShpLCBzY2FsZSk7XHJcblx0XHRsYWJlbHMuYWRkKGxhYmVsKTtcdFx0Ki9cclxuXHR9KTtcclxuXHRcclxuXHJcblx0Y29uc3Qgc3RpY2tHZW4gPSBzdWJzZXRzKGFsbFBvaW50cywgMik7XHJcblx0bGV0IHN0aWNrUHRzO1xyXG5cdHdoaWxlKCEoc3RpY2tQdHMgPSBzdGlja0dlbi5uZXh0KCkpLmRvbmUpIHtcclxuXHRcdGxldCBzdGlja1B0c0FycmF5ID0gQXJyYXkuZnJvbShzdGlja1B0cy52YWx1ZSk7XHJcblx0XHRsZXQgcDEgPSBzdGlja1B0c0FycmF5WzBdO1xyXG5cdFx0bGV0IHAyID0gc3RpY2tQdHNBcnJheVsxXTtcclxuXHRcdFxyXG5cdFx0bGV0IHN0aWNrID0gbmV3IFR3b1BvaW50cyhwMSwgcDIsIHNjYWxlKTtcclxuXHRcdHN0aWNrLnZpc2libGUgPSBmYWxzZTtcclxuXHRcdFxyXG5cdFx0c3RpY2tzLnNldChrZXlGcm9tUHRTZXQoc3RpY2tQdHNBcnJheSwgYWxsUG9pbnRzKSwgc3RpY2spO1xyXG5cclxuXHRcdHNjZW5lLmFkZChzdGljayk7XHJcblx0fVxyXG5cclxuXHRjb25zdCBmYWNlR2VuID0gc3Vic2V0cyhhbGxQb2ludHMsIDMpO1xyXG5cdGxldCBmYWNlUHRzO1xyXG5cdHdoaWxlKCEoZmFjZVB0cyA9IGZhY2VHZW4ubmV4dCgpKS5kb25lKSB7XHJcbiAgICAgICAgbGV0IGZhY2VQdHNBcnJheSA9IEFycmF5LmZyb20oZmFjZVB0cy52YWx1ZSk7XHJcblxyXG4gICAgICAgIGxldCBmYWNlID0gbmV3IFRocmVlUG9pbnRzKGZhY2VQdHNBcnJheSwgc2NhbGUpO1xyXG4gICAgICAgIGZhY2UudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG5cdFx0ZmFjZXMuc2V0KGtleUZyb21QdFNldChmYWNlUHRzQXJyYXksIGFsbFBvaW50cyksIGZhY2UpO1xyXG5cclxuXHRcdHNjZW5lLmFkZChmYWNlKTtcclxuXHR9XHJcblxyXG5cdGNvbnNvbGUubG9nKCdmYWNlcycsIGZhY2VzKTtcclxufVxyXG5cclxuZnVuY3Rpb24ga2V5RnJvbVB0U2V0KGFycmF5LCBpbmRleGVyKSB7XHJcbiAgICBsZXQgc29ydGVkID0gYXJyYXkuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG5cclxuXHRpZihpbmRleGVyICE9IG51bGwpe1xyXG5cdFx0cmV0dXJuIGFycmF5LnJlZHVjZSgoYWNjLCB2KSA9PiBhY2MgKyAxIDw8IGluZGV4ZXIuaW5kZXhPZih2KSwgMCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiBhcnJheS5yZWR1Y2UoKGFjYywgdikgPT4gYWNjICsgMSA8PCB2LCAwKTtcclxuXHR9XHJcbn0iLCJjb25zdCBhbGxQb2ludHMgPSBbXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuNzU5NjYwNjkzMDQ3LCAwLjYwNDI5MjcwNDA3OSwgLTAuMjQwMzAzODg5MzUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjQ4NDI2Njg0ODc3NywgLTAuMjA2Nzc3MDQ3MTE5LCAtMC44NTAxMzQ2MTk5MDQpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjkyMDIzNzkxODExNCwgLTAuMzgwNjkzMzkxODE2LCAwLjA5MDc0NTMzMzE3OTQpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuNDg0MjYyODA1MDkzLCAwLjIwNjc3OTk3NTk2OCwgMC44NTAxMzYyMTA5MzUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuMTUxNDUxNjE5ODgsIDAuNjI2MzY4MzE2MDczLCAtMC43NjQ2NzMyMjM5NjkpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuOTIwMjM5NzgyOTIyLCAwLjM4MDY4OTYwNjIyOSwgLTAuMDkwNzQyMzAzNDU0NSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoMC41NTM5Njk1NjEwMDUsIC0wLjM0NDk3MTA0NTU1NiwgLTAuNzU3NzAyMjUyMzQ1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC4xMDgzNjk2MTk5ODUsIC0wLjk2NzM2ODg1NTIyNywgLTAuMjI5MDI3MzQyMDM3KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC4xNTE0NTAwNjg5NzQsIC0wLjYyNjM2OTQyMDkyNywgMC43NjQ2NzI2MjYxMTkpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuNzU5NjU5OTAwOTcxLCAtMC42MDQyOTI5ODczMzMsIDAuMjQwMzA1NjgwOTkxKSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjEwODM3MTgwNTk2NCwgMC45NjczNjk3MDM4NjIsIDAuMjI5MDIyNzIzMTU1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC41NTM5NzAzMjY5MzgsIDAuMzQ0OTcyNDQxNzY3LCAwLjc1NzcwMTA1NjY4KVxyXG5dO1xyXG5cclxuLypcclxudmFyIGFsbFBvaW50cyA9IFtcclxuXHRbLTAuNzU5NjYwNjkzMDQ3LCAwLjYwNDI5MjcwNDA3OSwgLTAuMjQwMzAzODg5MzVdLFxyXG5cdFstMC40ODQyNjY4NDg3NzcsIC0wLjIwNjc3NzA0NzExOSwgLTAuODUwMTM0NjE5OTA0XSxcclxuXHRbLTAuOTIwMjM3OTE4MTE0LCAtMC4zODA2OTMzOTE4MTYsIDAuMDkwNzQ1MzMzMTc5NF0sXHJcblx0WzAuNDg0MjYyODA1MDkzLCAwLjIwNjc3OTk3NTk2OCwgMC44NTAxMzYyMTA5MzVdLFxyXG5cdFswLjE1MTQ1MTYxOTg4LCAwLjYyNjM2ODMxNjA3MywgLTAuNzY0NjczMjIzOTY5XSxcclxuXHRbMC45MjAyMzk3ODI5MjIsIDAuMzgwNjg5NjA2MjI5LCAtMC4wOTA3NDIzMDM0NTQ1XSxcclxuXHRbMC41NTM5Njk1NjEwMDUsIC0wLjM0NDk3MTA0NTU1NiwgLTAuNzU3NzAyMjUyMzQ1XSxcclxuXHRbLTAuMTA4MzY5NjE5OTg1LCAtMC45NjczNjg4NTUyMjcsIC0wLjIyOTAyNzM0MjAzN10sXHJcblx0Wy0wLjE1MTQ1MDA2ODk3NCwgLTAuNjI2MzY5NDIwOTI3LCAwLjc2NDY3MjYyNjExOV0sXHJcblx0WzAuNzU5NjU5OTAwOTcxLCAtMC42MDQyOTI5ODczMzMsIDAuMjQwMzA1NjgwOTkxXSxcclxuXHRbMC4xMDgzNzE4MDU5NjQsIDAuOTY3MzY5NzAzODYyLCAwLjIyOTAyMjcyMzE1NV0sXHJcblx0Wy0wLjU1Mzk3MDMyNjkzOCwgMC4zNDQ5NzI0NDE3NjcsIDAuNzU3NzAxMDU2NjhdXHJcbl07XHJcbiovIiwiZnVuY3Rpb24qIHN1YnNldHMoYXJyYXksIGxlbmd0aCwgc3RhcnQgPSAwKSB7XHJcbiAgaWYgKHN0YXJ0ID49IGFycmF5Lmxlbmd0aCB8fCBsZW5ndGggPCAxKSB7XHJcbiAgICB5aWVsZCBuZXcgU2V0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdoaWxlIChzdGFydCA8PSBhcnJheS5sZW5ndGggLSBsZW5ndGgpIHtcclxuICAgICAgbGV0IGZpcnN0ID0gYXJyYXlbc3RhcnRdO1xyXG4gICAgICBmb3IgKHN1YnNldCBvZiBzdWJzZXRzKGFycmF5LCBsZW5ndGggLSAxLCBzdGFydCArIDEpKSB7XHJcbiAgICAgICAgc3Vic2V0LmFkZChmaXJzdCk7XHJcbiAgICAgICAgeWllbGQgc3Vic2V0O1xyXG4gICAgICB9XHJcbiAgICAgICsrc3RhcnQ7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiZnVuY3Rpb24gbWFrZUxpZ2h0cygpIHtcclxuXHR2YXIgeCA9IDA7XHJcblx0dmFyIHkgPSAwO1xyXG5cdHZhciB6ID0gMDtcclxuXHJcblx0dmFyIGRpc3RhbmNlID0gMzA7XHJcblxyXG5cdC8vdG9wIGxpZ2h0c1xyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZjAwMDAsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeCtkaXN0YW5jZSwgeStkaXN0YW5jZSwgeitkaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0Lyp2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHgwMGZmMDAsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeCtkaXN0YW5jZSwgeStkaXN0YW5jZSwgei1kaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0Lyp2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZmZmMDAsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeC1kaXN0YW5jZSwgeStkaXN0YW5jZSwgeitkaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0Lyp2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHgwMDAwZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeC1kaXN0YW5jZSwgeStkaXN0YW5jZSwgei1kaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0Lyp2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cclxuXHQvL2JvdHRvbSBsaWdodHNcclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4MDBmZmZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgrZGlzdGFuY2UsIHktZGlzdGFuY2UsIHorZGlzdGFuY2UpO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdC8qdmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmYwMGZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgrZGlzdGFuY2UsIHktZGlzdGFuY2UsIHotZGlzdGFuY2UpO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdC8qdmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTtcclxuKi9cclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmY4ODg4LCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgtZGlzdGFuY2UsIHktZGlzdGFuY2UsIHorZGlzdGFuY2UpO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdC8qdmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ODg4OGZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgtZGlzdGFuY2UsIHktZGlzdGFuY2UsIHotZGlzdGFuY2UpO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdC8qdmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHJcblxyXG5cdC8vbWlkZGxlIGxpZ2h0XHJcblx0Lyp2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmZmZmZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgsIHksIHopO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdHZhciBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0LCAxKTtcclxuXHRncm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxufSIsInZhciB0cmFuc3BhcmVudE1hdGVyaWFsRnJvbnQgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCgge1xyXG5cdGNvbG9yOiAweGZmZmZmZixcclxuXHRvcGFjaXR5OiAwLjQsXHJcblx0dHJhbnNwYXJlbnQ6IHRydWUsXHJcblx0c2lkZTogVEhSRUUuRG91YmxlU2lkZVxyXG59ICk7XHJcblxyXG52YXIgdHJhbnNwYXJlbnRNYXRlcmlhbEJhY2sgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCgge1xyXG5cdGNvbG9yOiAweGZmZmZmZixcclxuXHRvcGFjaXR5OiAwLjQsXHJcblx0dHJhbnNwYXJlbnQ6IHRydWVcclxufSApO1xyXG5cclxudmFyIHBvaW50c01hdGVyaWFsID0gbmV3IFRIUkVFLlBvaW50c01hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4MDA4MGZmLFxyXG5cdHNpemU6IDEsXHJcblx0YWxwaGFUZXN0OiAwLjVcclxufSApO1xyXG5cclxudmFyIFJHQk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hOb3JtYWxNYXRlcmlhbCgge1xyXG5cdGNvbG9yOiAweDAwODhmZlxyXG59KTtcclxuXHJcbnZhciBTVERNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCgge1xyXG5cdGNvbG9yOiAweDAwODhmZixcclxuXHRvcGFjaXR5OiAwLjVcclxufSk7XHJcblxyXG52YXIgZmxhdFNoYXBlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoIHtcclxuXHRzaWRlIDogVEhSRUUuRG91YmxlU2lkZSxcclxuXHR0cmFuc3BhcmVudCA6IHRydWUsXHJcblx0b3BhY2l0eTogMC41XHJcbn0pOyIsImZ1bmN0aW9uIEN5bGluZGVyRnJvbVB0cyh2MSwgdjIpIHtcclxuXHR2YXIgY3lsaW5kZXIgPSBuZXcgVEhSRUUuQ3lsaW5kZXJCdWZmZXJHZW9tZXRyeSgwLjQsIDAuNCwgdjEuZGlzdGFuY2VUbyh2MiksIDEwLCAwLjUsIHRydWUpO1xyXG5cdHZhciBjeWxpbmRlck1lc2ggPSBuZXcgVEhSRUUuTWVzaChjeWxpbmRlciwgUkdCTWF0ZXJpYWwpO1xyXG5cdGN5bGluZGVyTWVzaC5wb3NpdGlvbi5jb3B5KHYxLmNsb25lKCkubGVycCh2MiwgLjUpKTtcclxuXHJcblx0Ly9jcmVhdGVzIHF1YXRlcm5pb24gZnJvbSBzcGhlcmVzIHBvc2l0aW9uIHRvIHJvdGF0ZSB0aGUgY3lsaW5kZXJcclxuXHR2YXIgcSA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCk7XHJcblx0cS5zZXRGcm9tVW5pdFZlY3RvcnMobmV3IFRIUkVFLlZlY3RvcjMoMCwxLDApLCBuZXcgVEhSRUUuVmVjdG9yMygpLnN1YlZlY3RvcnModjEsIHYyKS5ub3JtYWxpemUoKSk7XHJcblx0Y3lsaW5kZXJNZXNoLnNldFJvdGF0aW9uRnJvbVF1YXRlcm5pb24ocSk7XHJcblx0cmV0dXJuIGN5bGluZGVyTWVzaDtcclxufSIsImZ1bmN0aW9uIFBvbHlNZXNoZXMoZ2VvbWV0cnksIG5vdGVzKSB7XHJcblx0dGhpcy5ncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuXHR0aGlzLmdyb3VwLmFkZChuZXcgVHJhbnNwTWVzaEdycChnZW9tZXRyeSkpO1xyXG5cdC8vdGhpcy5ncm91cC5hZGQobmV3IFBvbHlTcGhlcmVzRnJvbU5vdGVzKG5vdGVzKSk7XHJcblx0cmV0dXJuIHRoaXMuZ3JvdXA7XHJcbn1cclxuXHJcblBvbHlNZXNoZXMucHJvdG90eXBlLnNldFBvcyA9IGZ1bmN0aW9uKHgseSx6KSB7XHJcblx0dGhpcy5ncm91cC5wb3NpdGlvbi54ID0geDtcclxuXHR0aGlzLmdyb3VwLnBvc2l0aW9uLnkgPSB5O1xyXG5cdHRoaXMuZ3JvdXAucG9zaXRpb24ueiA9IHo7XHJcbn0iLCIvLyAvL2NyZWF0ZXMgc3BoZXJlcyBmb3IgZWFjaCB2ZXJ0ZXggb2YgdGhlIGdlb21ldHJ5XHJcbi8vIHZhciBzcGhlcmUgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMiw1MCw1MCk7XHJcbi8vIHZhciBzcGhlcmVNZXNoID0gbmV3IFRIUkVFLk1lc2goc3BoZXJlLCBSR0JNYXRlcmlhbCk7XHJcblxyXG4vLyBmdW5jdGlvbiBQb2x5U3BoZXJlcyhnZW9tZXRyeSkge1xyXG4vLyBcdHRoaXMuZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuLy8gXHR2YXIgbWVzaCA9IHNwaGVyZU1lc2guY2xvbmUoKTtcclxuLy8gXHRmb3IodmFyIGk9MDsgaTxnZW9tZXRyeS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4vLyBcdFx0c3BoZXJlTWVzaC5wb3NpdGlvbi5jb3B5KGdlb21ldHJ5LnZlcnRpY2VzW2ldKTtcclxuLy8gXHRcdHRoaXMuZ3JvdXAuYWRkKHNwaGVyZU1lc2guY2xvbmUoKSk7XHJcbi8vIFx0fVxyXG5cclxuLy8gXHRyZXR1cm4gdGhpcy5ncm91cDtcclxuLy8gfVxyXG5cclxuLy8gZnVuY3Rpb24gUG9seVNwaGVyZXNGcm9tTm90ZXMobm90ZXMpIHtcclxuLy8gXHR2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuLy8gXHRmb3IodmFyIGkgaW4gbm90ZXMpIHtcclxuLy8gXHRcdGdyb3VwLmFkZChzcGhlcmVzLmdldE9iamVjdEJ5SWQobm90ZXNbaV0pLmNsb25lKCkpO1xyXG4vLyBcdH1cclxuLy8gXHQvKmNvbnNvbGUubG9nKGdyb3VwKTsqL1xyXG5cclxuLy8gXHRyZXR1cm4gZ3JvdXA7XHJcbi8vIH0iLCIvKmZ1bmN0aW9uIG1ha2VUZXh0U3ByaXRlKCBub3RlLCBzY2FsZSwgcGFyYW1ldGVycyApXHJcbntcclxuXHR2YXIgbWVzc2FnZTtcclxuXHJcblx0aWYobm90ZSA9PSAwKSB7XHJcblx0XHRtZXNzYWdlID0gJ0MnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDEpIHtcclxuXHRcdG1lc3NhZ2UgPSAnQyMnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDIpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRCc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gMykge1xyXG5cdFx0bWVzc2FnZSA9ICdEIyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gNCkge1xyXG5cdFx0bWVzc2FnZSA9ICdFJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSA1KSB7XHJcblx0XHRtZXNzYWdlID0gJ0YnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDYpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRiMnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDcpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gOCkge1xyXG5cdFx0bWVzc2FnZSA9ICdHIyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gOSkge1xyXG5cdFx0bWVzc2FnZSA9ICdBJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSAxMCkge1xyXG5cdFx0bWVzc2FnZSA9ICdBIyc7XHJcblx0fSBlbHNlIHtcclxuXHRcdG1lc3NhZ2UgPSAnQic7XHJcblx0fVxyXG5cclxuXHJcblx0aWYgKCBwYXJhbWV0ZXJzID09PSB1bmRlZmluZWQgKSBwYXJhbWV0ZXJzID0ge307XHJcblx0XHJcblx0dmFyIGZvbnRmYWNlID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImZvbnRmYWNlXCIpID8gXHJcblx0XHRwYXJhbWV0ZXJzW1wiZm9udGZhY2VcIl0gOiBcIkFyaWFsXCI7XHJcblx0XHJcblx0dmFyIGZvbnRzaXplID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImZvbnRzaXplXCIpID8gXHJcblx0XHRwYXJhbWV0ZXJzW1wiZm9udHNpemVcIl0gOiAxODtcclxuXHRcclxuXHR2YXIgYm9yZGVyVGhpY2tuZXNzID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImJvcmRlclRoaWNrbmVzc1wiKSA/IFxyXG5cdFx0cGFyYW1ldGVyc1tcImJvcmRlclRoaWNrbmVzc1wiXSA6IDQ7XHJcblx0XHJcblx0dmFyIGJvcmRlckNvbG9yID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImJvcmRlckNvbG9yXCIpID9cclxuXHRcdHBhcmFtZXRlcnNbXCJib3JkZXJDb2xvclwiXSA6IHsgcjowLCBnOjAsIGI6MCwgYToxLjAgfTtcclxuXHRcclxuXHR2YXIgYmFja2dyb3VuZENvbG9yID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKSA/XHJcblx0XHRwYXJhbWV0ZXJzW1wiYmFja2dyb3VuZENvbG9yXCJdIDogeyByOjI1NSwgZzoyNTUsIGI6MjU1LCBhOjEuMCB9O1xyXG5cclxuXHQvL3ZhciBzcHJpdGVBbGlnbm1lbnQgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiYWxpZ25tZW50XCIpID9cclxuXHQvL1x0cGFyYW1ldGVyc1tcImFsaWdubWVudFwiXSA6IFRIUkVFLlNwcml0ZUFsaWdubWVudC50b3BMZWZ0O1xyXG5cclxuXHR2YXIgc3ByaXRlQWxpZ25tZW50ID0gVEhSRUUuU3ByaXRlQWxpZ25tZW50LnRvcExlZnQ7XHJcblx0XHRcclxuXHJcblx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0Y29udGV4dC5mb250ID0gXCJCb2xkIFwiICsgZm9udHNpemUgKyBcInB4IFwiICsgZm9udGZhY2U7XHJcbiAgICBcclxuXHQvLyBnZXQgc2l6ZSBkYXRhIChoZWlnaHQgZGVwZW5kcyBvbmx5IG9uIGZvbnQgc2l6ZSlcclxuXHR2YXIgbWV0cmljcyA9IGNvbnRleHQubWVhc3VyZVRleHQoIG1lc3NhZ2UgKTtcclxuXHR2YXIgdGV4dFdpZHRoID0gbWV0cmljcy53aWR0aDtcclxuXHRcclxuXHQvLyBiYWNrZ3JvdW5kIGNvbG9yXHJcblx0Y29udGV4dC5maWxsU3R5bGUgICA9IFwicmdiYShcIiArIGJhY2tncm91bmRDb2xvci5yICsgXCIsXCIgKyBiYWNrZ3JvdW5kQ29sb3IuZyArIFwiLFwiXHJcblx0XHRcdFx0XHRcdFx0XHQgICsgYmFja2dyb3VuZENvbG9yLmIgKyBcIixcIiArIGJhY2tncm91bmRDb2xvci5hICsgXCIpXCI7XHJcblx0Ly8gYm9yZGVyIGNvbG9yXHJcblx0Y29udGV4dC5zdHJva2VTdHlsZSA9IFwicmdiYShcIiArIGJvcmRlckNvbG9yLnIgKyBcIixcIiArIGJvcmRlckNvbG9yLmcgKyBcIixcIlxyXG5cdFx0XHRcdFx0XHRcdFx0ICArIGJvcmRlckNvbG9yLmIgKyBcIixcIiArIGJvcmRlckNvbG9yLmEgKyBcIilcIjtcclxuXHJcblx0Y29udGV4dC5saW5lV2lkdGggPSBib3JkZXJUaGlja25lc3M7XHJcblx0cm91bmRSZWN0KGNvbnRleHQsIGJvcmRlclRoaWNrbmVzcy8yLCBib3JkZXJUaGlja25lc3MvMiwgdGV4dFdpZHRoICsgYm9yZGVyVGhpY2tuZXNzLCBmb250c2l6ZSAqIDEuNCArIGJvcmRlclRoaWNrbmVzcywgNik7XHJcblx0Ly8gMS40IGlzIGV4dHJhIGhlaWdodCBmYWN0b3IgZm9yIHRleHQgYmVsb3cgYmFzZWxpbmU6IGcsaixwLHEuXHJcblx0XHJcblx0Ly8gdGV4dCBjb2xvclxyXG5cdGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDEuMClcIjtcclxuXHJcblx0Y29udGV4dC5maWxsVGV4dCggbWVzc2FnZSwgYm9yZGVyVGhpY2tuZXNzLCBmb250c2l6ZSArIGJvcmRlclRoaWNrbmVzcyk7XHJcblx0XHJcblx0Ly8gY2FudmFzIGNvbnRlbnRzIHdpbGwgYmUgdXNlZCBmb3IgYSB0ZXh0dXJlXHJcblx0dmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShjYW52YXMpIFxyXG5cdHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG5cclxuXHR2YXIgc3ByaXRlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuU3ByaXRlTWF0ZXJpYWwoIFxyXG5cdFx0eyBtYXA6IHRleHR1cmUsIHVzZVNjcmVlbkNvb3JkaW5hdGVzOiBmYWxzZSwgYWxpZ25tZW50OiBzcHJpdGVBbGlnbm1lbnQgfSApO1xyXG5cdHZhciBzcHJpdGUgPSBuZXcgVEhSRUUuU3ByaXRlKCBzcHJpdGVNYXRlcmlhbCApO1xyXG5cdHNwcml0ZS5zY2FsZS5zZXQoMTAwLDUwLDEuMCk7XHJcblx0c3ByaXRlLnBvc2l0aW9uLmNvcHkoYWxsUG9pbnRzW25vdGVWYWxdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpKVxyXG5cdHJldHVybiBzcHJpdGU7XHRcclxufVxyXG5cclxuLy8gZnVuY3Rpb24gZm9yIGRyYXdpbmcgcm91bmRlZCByZWN0YW5nbGVzXHJcbmZ1bmN0aW9uIHJvdW5kUmVjdChjdHgsIHgsIHksIHcsIGgsIHIpIFxyXG57XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKHgrciwgeSk7XHJcbiAgICBjdHgubGluZVRvKHgrdy1yLCB5KTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgrdywgeSwgeCt3LCB5K3IpO1xyXG4gICAgY3R4LmxpbmVUbyh4K3csIHkraC1yKTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgrdywgeStoLCB4K3ctciwgeStoKTtcclxuICAgIGN0eC5saW5lVG8oeCtyLCB5K2gpO1xyXG4gICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCwgeStoLCB4LCB5K2gtcik7XHJcbiAgICBjdHgubGluZVRvKHgsIHkrcik7XHJcbiAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4K3IsIHkpO1xyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuXHRjdHguc3Ryb2tlKCk7ICAgXHJcbn0qLyIsIi8vY3JlYXRlcyBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiB0d28gbWVzaGVzIHRvIGNyZWF0ZSB0cmFuc3BhcmVuY3lcclxuZnVuY3Rpb24gVHJhbnNwTWVzaEdycChnZW9tZXRyeSkge1xyXG5cdHZhciBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cdHZhciBtZXNoR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29udmV4QnVmZmVyR2VvbWV0cnkoZ2VvbWV0cnkudmVydGljZXMpO1xyXG5cclxuXHR2YXIgZmFjZXMgPSBtZXNoR2VvbWV0cnkuZmFjZXM7XHJcblx0Zm9yKHZhciBmYWNlIGluIGZhY2VzKSB7XHJcblx0XHRmb3IodmFyIGk9MDsgaTwzOyBpKyspIHtcclxuXHRcdFx0dmFyIHYxID0gZmFjZXNbZmFjZV0uZ2V0RWRnZShpKS5oZWFkKCk7XHJcblx0XHRcdHZhciB2MiA9IGZhY2VzW2ZhY2VdLmdldEVkZ2UoaSkudGFpbCgpO1xyXG5cdFx0XHRncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MS5wb2ludCwgdjIucG9pbnQpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2gobWVzaEdlb21ldHJ5LCB0cmFuc3BhcmVudE1hdGVyaWFsQmFjayk7XHJcblx0bWVzaC5tYXRlcmlhbC5zaWRlID0gVEhSRUUuQmFja1NpZGU7IC8vIGJhY2sgZmFjZXNcclxuXHRtZXNoLnJlbmRlck9yZGVyID0gMDtcclxuXHJcblx0dmFyIG1lc2gyID0gbmV3IFRIUkVFLk1lc2gobWVzaEdlb21ldHJ5LCB0cmFuc3BhcmVudE1hdGVyaWFsRnJvbnQuY2xvbmUoKSk7XHJcblx0bWVzaDIubWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkZyb250U2lkZTsgLy8gZnJvbnQgZmFjZXNcclxuXHRtZXNoMi5yZW5kZXJPcmRlciA9IDE7XHJcblxyXG5cdGdyb3VwLmFkZChtZXNoKTtcclxuXHRncm91cC5hZGQobWVzaDIpO1xyXG5cclxuXHRyZXR1cm4gZ3JvdXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dQb2x5aGVkcm9uKHB0c0luZGV4ZXMpIHtcclxuXHQvL2NvbnNvbGUubG9nKHB0c0luZGV4ZXMpO1xyXG5cdGxldCB2ZXJ0aWNlcyA9IFtdO1xyXG5cdHB0c0luZGV4ZXMuZm9yRWFjaChpbmRleCA9PiB7XHJcblx0XHR2ZXJ0aWNlcy5wdXNoKGFsbFBvaW50c1tpbmRleF0uY2xvbmUoKSk7XHJcblx0fSk7XHJcblx0Ly8gY29uc29sZS5sb2coJ3ZlcnRpY2VzJywgdmVydGljZXMpO1xyXG5cclxuXHRsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29udmV4QnVmZmVyR2VvbWV0cnkodmVydGljZXMpO1xyXG5cdC8vIGNvbnNvbGUubG9nKCdnZW9tZXRyeScsIGdlb21ldHJ5KTtcclxuXHRnZW9tZXRyeS5mYWNlcy5mb3JFYWNoKGZhY2UgPT4ge1xyXG5cdFx0bGV0IHB0MSA9IGZhY2UuZ2V0RWRnZSgwKS5oZWFkKCkucG9pbnQsXHJcblx0XHRcdHB0MiA9IGZhY2UuZ2V0RWRnZSgxKS5oZWFkKCkucG9pbnQsXHJcblx0XHRcdHB0MyA9IGZhY2UuZ2V0RWRnZSgyKS5oZWFkKCkucG9pbnQ7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnZmFjZScsIGZhY2UpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3B0MScsIHB0MSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygncHQyJywgcHQyKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdwdDMnLCBwdDMpO1xyXG5cdFx0bGV0IGluZGV4MSA9IGFsbFBvaW50cy5tYXAoZnVuY3Rpb24oZSkgeyByZXR1cm4gZS5lcXVhbHMocHQxKSB9KS5pbmRleE9mKHRydWUpLFxyXG5cdFx0XHRpbmRleDIgPSBhbGxQb2ludHMubWFwKGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUuZXF1YWxzKHB0MikgfSkuaW5kZXhPZih0cnVlKSxcclxuXHRcdFx0aW5kZXgzID0gYWxsUG9pbnRzLm1hcChmdW5jdGlvbihlKSB7IHJldHVybiBlLmVxdWFscyhwdDMpIH0pLmluZGV4T2YodHJ1ZSk7XHJcblx0XHRzaG93VGhyZWVQb2ludHMoW2luZGV4MSwgaW5kZXgyLCBpbmRleDNdKTtcclxuXHR9KTtcclxuXHJcbn1cclxuXHJcbi8qZnVuY3Rpb24gbWFrZVRyYW5zcGFyZW50KGdlb21ldHJ5LCBncm91cCkge1xyXG5cdC8vZ2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTtcclxuXHQvL2dlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscygpO1xyXG5cdGdyb3VwLmFkZChuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgdHJhbnNwYXJlbnRNYXRlcmlhbEZyb250KSk7XHJcbn0qLyIsImNvbnN0IHNjYWxlID0gMTU7XHJcbmxldCBjaG9yZEdlb21ldHJ5O1xyXG5cclxuZnVuY3Rpb24gQ2hvcmQobm90ZXMpIHtcclxuXHR0aGlzLm5vdGVzID0gW107XHJcblxyXG5cdGZvcih2YXIgaSBpbiBub3Rlcykge1xyXG5cdFx0bGV0IGZpbmFsTm90ZSA9IG5vdGVzW2ldICUgMTI7XHJcblx0XHRpZih0aGlzLm5vdGVzLmluZGV4T2YoZmluYWxOb3RlKSA9PSAtMSkgXHJcblx0XHRcdHRoaXMubm90ZXMucHVzaChmaW5hbE5vdGUpO1xyXG5cdH1cclxuXHJcblx0dGhpcy5kcmF3Q2hvcmQoKTtcclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLmFkZE5vdGUgPSBmdW5jdGlvbihub3RlKSB7XHJcblx0dGhpcy5ub3Rlcy5wdXNoKG5vdGUgJSAxMik7XHJcbn1cclxuXHJcbkNob3JkLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oYm9vbCkge1xyXG5cdHRoaXMucG9seWhlZHJvbi52aXNpYmxlID0gYm9vbDtcclxuXHRmb3IodmFyIGkgaW4gdGhpcy5ub3Rlcykge1xyXG5cdFx0c3BoZXJlcy5jaGlsZHJlblt0aGlzLm5vdGVzW2ldXS52aXNpYmxlID0gYm9vbDtcclxuXHR9XHJcbn1cclxuXHJcbkNob3JkLnByb3RvdHlwZS5kcmF3Q2hvcmQgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbmJOb3RlcyA9IHRoaXMubm90ZXMubGVuZ3RoO1xyXG5cclxuXHRpZihuYk5vdGVzID09IDEpIHtcclxuXHRcdHRoaXMucG9seWhlZHJvbiA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xyXG5cdH0gZWxzZSBpZihuYk5vdGVzID09IDIpIHtcclxuXHRcdHRoaXMucG9seWhlZHJvbiA9IG5ldyBUd29Qb2ludHModGhpcy5ub3Rlc1swXSwgdGhpcy5ub3Rlc1sxXSwgc2NhbGUpO1xyXG5cdH0gZWxzZSBpZihuYk5vdGVzID09IDMpIHtcclxuXHRcdHRoaXMucG9seWhlZHJvbiA9IG5ldyBUaHJlZVBvaW50cyh0aGlzLm5vdGVzLCBzY2FsZSk7XHJcblx0fWVsc2Uge1xyXG5cdFx0Y2hvcmRHZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIGk9MDsgaTxuYk5vdGVzOyBpKyspIHtcclxuXHRcdFx0Y2hvcmRHZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKFxyXG5cdFx0XHRcdGFsbFBvaW50c1t0aGlzLm5vdGVzW2ldXS5jbG9uZSgpXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdmFyIHN1YnMgPSBzdWJzZXRzKHRoaXMubm90ZXMsIDMpO1xyXG5cdFx0Ly8gdmFyIHBvaW50SWRzO1xyXG5cdFx0Ly8gdmFyIHBvaW50SWQxLCBwb2ludElkMiwgcG9pbnRJZDM7XHJcblx0XHQvLyB2YXIgZmFjZTtcclxuXHJcblx0XHQvLyBmb3Ioc3ViIG9mIHN1YnMpIHtcclxuXHRcdC8vIFx0cG9pbnRJZHMgPSBzdWIuZW50cmllcygpO1xyXG5cdFx0XHRcclxuXHRcdC8vIFx0Ly9nZXQgdGhlIGZhY2UncyAzIHZlcnRpY2VzIGluZGV4XHJcblx0XHQvLyBcdHBvaW50SWQxID0gcG9pbnRJZHMubmV4dCgpLnZhbHVlWzBdLnZhbHVlO1xyXG5cdFx0Ly8gXHRwb2ludElkMiA9IHBvaW50SWRzLm5leHQoKS52YWx1ZVswXS52YWx1ZTtcclxuXHRcdC8vIFx0cG9pbnRJZDMgPSBwb2ludElkcy5uZXh0KCkudmFsdWVbMF0udmFsdWU7XHJcblxyXG5cdFx0Ly8gXHRmYWNlID0gbmV3IFRIUkVFLkZhY2UzKHBvaW50SWQxLHBvaW50SWQyLHBvaW50SWQzKTtcclxuXHRcdC8vIFx0Z2VvbWV0cnkuZmFjZXMucHVzaChmYWNlKTtcclxuXHRcdC8vIH1cclxuXHJcblx0XHQvLyB2YXIgbWVzaEdlb21ldHJ5ID0gbmV3IFRIUkVFLkNvbnZleEJ1ZmZlckdlb21ldHJ5KGdlb21ldHJ5LnZlcnRpY2VzKTtcclxuXHRcdGNob3JkR2VvbWV0cnkuc2NhbGUoc2NhbGUsc2NhbGUsc2NhbGUpO1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFBvbHlNZXNoZXMoY2hvcmRHZW9tZXRyeSwgdGhpcy5ub3Rlcyk7XHJcblxyXG5cdH1cclxuXHR0aGlzLnBvbHloZWRyb24udmlzaWJsZSA9IGZhbHNlO1xyXG5cdHNoYXBlc0dyb3VwLmFkZCh0aGlzLnBvbHloZWRyb24pO1xyXG5cdFxyXG5cclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKGNob3JkKSB7XHJcblx0aWYodGhpcy5ub3Rlcy5sZW5ndGggIT0gY2hvcmQubm90ZXMubGVuZ3RoKVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRmb3IobGV0IG5vdGUgaW4gY2hvcmQubm90ZXMpIHtcclxuXHRcdGlmKHRoaXMubm90ZXNbbm90ZV0gIT0gY2hvcmQubm90ZXNbbm90ZV0pXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB0cnVlO1xyXG59IiwidmFyIG1haW5Hcm91cCwgc2hhcGVzR3JvdXAsIGxhYmVscywgY29udGFpbmVyLCBjYW1lcmEsIHJlbmRlcmVyLCBzY2VuZSwgc3RhdHM7XHJcbnZhciBjaG9yZHMgPSB7fTtcclxudmFyIG5vdGVzID0gW107XHJcbnZhciBtb3VzZVggPSAwLCBtb3VzZVkgPSAwO1xyXG52YXIgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XHJcbnZhciB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XHJcbi8vdmFyIHdzID0gbmV3IFdlYlNvY2tldChcIndzOi8vMTI3LjAuMC4xOjU2NzgvXCIpO1xyXG52YXIgY3ViZTtcclxuXHJcblxyXG5pbml0KCk7XHJcbmFuaW1hdGUoKTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcblx0Y29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG5cdGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGgvd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApO1xyXG5cdGNhbWVyYS5wb3NpdGlvbi56ID0gNTA7XHJcblxyXG5cdHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcblx0c2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvciggMHgwMDAwMDAgKTtcclxuXHJcblx0cmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xyXG5cdC8vcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XHJcblx0cmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuXHJcblx0dmFyIGNvbnRyb2xzID0gbmV3IFRIUkVFLk9yYml0Q29udHJvbHMoIGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCApO1xyXG5cdGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gNTtcclxuXHRjb250cm9scy5tYXhEaXN0YW5jZSA9IDIwMDtcclxuXHRjb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSTtcclxuXHJcblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKCByZW5kZXJlci5kb21FbGVtZW50ICk7XHJcblxyXG5cdG1haW5Hcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cdHNoYXBlc0dyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblx0c2NlbmUuYWRkKHNoYXBlc0dyb3VwKTtcclxuXHRzY2VuZS5hZGQobWFpbkdyb3VwKTtcclxuXHJcblx0Y29uc3QgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCggMHg0MDQwNDAgKTtcclxuXHRzY2VuZS5hZGQoIGFtYmllbnRMaWdodCApO1xyXG5cclxuXHRjb25zdCBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoIDB4ZmYwMDAwLCAxLCAxMDAgKTtcclxuXHQvL2NhbWVyYS5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdG1ha2VBbGxNZXNoZXMoKTtcclxuXHRtYWtlTGlnaHRzKCk7XHJcblxyXG5cdHN0YXRzID0gbmV3IFN0YXRzKCk7XHJcblx0Ly9jb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XHJcblxyXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgb25XaW5kb3dSZXNpemUsIGZhbHNlICk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XHJcblx0d2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XHJcblx0d2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xyXG5cdGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHRjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG5cdHJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0Nob3Jkcyhsb3csIHVwcCkge1xyXG5cdHNwaGVyZXMuZm9yRWFjaChmdW5jdGlvbih2YWwsIGtleSkge1xyXG5cdFx0dmFsLnZpc2libGUgPSBmYWxzZTtcclxuXHR9KTtcclxuXHJcblx0c3RpY2tzLmZvckVhY2goZnVuY3Rpb24odmFsLCBrZXkpIHtcclxuXHRcdHZhbC52aXNpYmxlID0gZmFsc2U7XHJcblx0fSk7XHJcblxyXG5cdGZhY2VzLmZvckVhY2goZnVuY3Rpb24odmFsLCBrZXkpIHtcclxuXHRcdHZhbC52aXNpYmxlID0gZmFsc2U7XHJcblx0fSk7XHJcblx0XHJcblx0Zm9yKGxldCBpPWxvdzsgaTx1cHA7IGkrKykge1xyXG5cdFx0aWYoY2hvcmRzTWFwLmhhcyhpKSkge1xyXG5cdFx0XHRsZXQgbGVuZ3RoID0gY2hvcmRzTWFwLmdldChpKS5sZW5ndGg7XHJcblx0XHRcdC8vY29uc29sZS5sb2coY2hvcmRzTWFwLmdldChpKSk7XHJcblx0XHRcdGlmKGxlbmd0aCA9PT0gMSkge1xyXG5cdFx0XHRcdHNob3dPbmVQb2ludChjaG9yZHNNYXAuZ2V0KGkpWzBdKTtcclxuXHRcdFx0fSBlbHNlIGlmKGxlbmd0aCA9PT0gMikge1xyXG5cdFx0XHRcdHNob3dUd29Qb2ludHMoY2hvcmRzTWFwLmdldChpKSk7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYobGVuZ3RoID09PSAzKSB7XHJcblx0XHRcdFx0c2hvd1RocmVlUG9pbnRzKGNob3Jkc01hcC5nZXQoaSkpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNob3dQb2x5aGVkcm9uKGNob3Jkc01hcC5nZXQoaSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBhbmltYXRlKCkge1xyXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSggYW5pbWF0ZSApO1xyXG5cdHJlbmRlcigpO1xyXG5cdHN0YXRzLnVwZGF0ZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXIoKSB7XHJcblx0cmVuZGVyZXIucmVuZGVyKCBzY2VuZSwgY2FtZXJhICk7XHJcbn1cclxuIiwiLyoqXHJcbiogQ29udmVydCBGcm9tL1RvIEJpbmFyeS9EZWNpbWFsL0hleGFkZWNpbWFsIGluIEphdmFTY3JpcHRcclxuKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9mYWlzYWxtYW5cclxuKlxyXG4qIENvcHlyaWdodCAyMDEyLTIwMTUsIEZhaXNhbG1hbiA8Znl6bG1hbkBnbWFpbC5jb20+XHJcbiogTGljZW5zZWQgdW5kZXIgVGhlIE1JVCBMaWNlbnNlXHJcbiogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxyXG4qL1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgdmFyIENvbnZlcnRCYXNlID0gZnVuY3Rpb24gKG51bSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZyb20gOiBmdW5jdGlvbiAoYmFzZUZyb20pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG8gOiBmdW5jdGlvbiAoYmFzZVRvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChudW0sIGJhc2VGcm9tKS50b1N0cmluZyhiYXNlVG8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgICAgICBcclxuICAgIC8vIGJpbmFyeSB0byBkZWNpbWFsXHJcbiAgICBDb252ZXJ0QmFzZS5iaW4yZGVjID0gZnVuY3Rpb24gKG51bSkge1xyXG4gICAgICAgIHJldHVybiBDb252ZXJ0QmFzZShudW0pLmZyb20oMikudG8oMTApO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLy8gYmluYXJ5IHRvIGhleGFkZWNpbWFsXHJcbiAgICBDb252ZXJ0QmFzZS5iaW4yaGV4ID0gZnVuY3Rpb24gKG51bSkge1xyXG4gICAgICAgIHJldHVybiBDb252ZXJ0QmFzZShudW0pLmZyb20oMikudG8oMTYpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLy8gZGVjaW1hbCB0byBiaW5hcnlcclxuICAgIENvbnZlcnRCYXNlLmRlYzJiaW4gPSBmdW5jdGlvbiAobnVtKSB7XHJcbiAgICAgICAgcmV0dXJuIENvbnZlcnRCYXNlKG51bSkuZnJvbSgxMCkudG8oMik7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAvLyBkZWNpbWFsIHRvIGhleGFkZWNpbWFsXHJcbiAgICBDb252ZXJ0QmFzZS5kZWMyaGV4ID0gZnVuY3Rpb24gKG51bSkge1xyXG4gICAgICAgIHJldHVybiBDb252ZXJ0QmFzZShudW0pLmZyb20oMTApLnRvKDE2KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIC8vIGhleGFkZWNpbWFsIHRvIGJpbmFyeVxyXG4gICAgQ29udmVydEJhc2UuaGV4MmJpbiA9IGZ1bmN0aW9uIChudW0pIHtcclxuICAgICAgICByZXR1cm4gQ29udmVydEJhc2UobnVtKS5mcm9tKDE2KS50bygyKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIC8vIGhleGFkZWNpbWFsIHRvIGRlY2ltYWxcclxuICAgIENvbnZlcnRCYXNlLmhleDJkZWMgPSBmdW5jdGlvbiAobnVtKSB7XHJcbiAgICAgICAgcmV0dXJuIENvbnZlcnRCYXNlKG51bSkuZnJvbSgxNikudG8oMTApO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGhpcy5Db252ZXJ0QmFzZSA9IENvbnZlcnRCYXNlO1xyXG4gICAgXHJcbn0pKHRoaXMpO1xyXG5cclxuLypcclxuKiBVc2FnZSBleGFtcGxlOlxyXG4qIENvbnZlcnRCYXNlLmJpbjJkZWMoJzExMScpOyAvLyAnNydcclxuKiBDb252ZXJ0QmFzZS5kZWMyaGV4KCc0MicpOyAvLyAnMmEnXHJcbiogQ29udmVydEJhc2UuaGV4MmJpbignZjgnKTsgLy8gJzExMTExMDAwJ1xyXG4qIENvbnZlcnRCYXNlLmRlYzJiaW4oJzIyJyk7IC8vICcxMDExMCdcclxuKi9cclxuIiwiLypcclxuXHRQcm9qZWN0IE5hbWU6IG1pZGktcGFyc2VyLWpzXHJcblx0QXV0aG9yOiBjb2x4aVxyXG5cdEF1dGhvciBVUkk6IGh0dHA6Ly93d3cuY29seGkuaW5mby9cclxuXHREZXNjcmlwdGlvbjogTUlESVBhcnNlciBsaWJyYXJ5IHJlYWRzIC5NSUQgYmluYXJ5IGZpbGVzLCBCYXNlNjQgZW5jb2RlZCBNSURJIERhdGEsXHJcblx0b3IgVUludDggQXJyYXlzLCBhbmQgb3V0cHV0cyBhcyBhIHJlYWRhYmxlIGFuZCBzdHJ1Y3R1cmVkIEpTIG9iamVjdC5cclxuXHJcblx0LS0tICAgICBVc2FnZSBNZXRob2RzIFx0ICAgLS0tXHJcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdCogT1BUSU9OIDEgTkVXISAoTUlESVBhcnNlci5wYXJzZSlcclxuXHRXaWxsIGF1dG9kZXRlY3QgdGhlIHNvdXJjZSBhbmQgcHJvY2Nlc3MgdGhlIGRhdGEsIHVzaW5nIHRoZSBzdWl0YWJsZSBtZXRob2QuXHJcblxyXG5cdCogT1BUSU9OIDIgKE1JRElQYXJzZXIuYWRkTGlzdGVuZXIpXHJcblx0SU5QVVQgRUxFTUVOVCBMSVNURU5FUiA6IGNhbGwgTUlESVBhcnNlci5hZGRMaXN0ZW5lcihmaWxlSW5wdXRFbGVtZW50LGNhbGxiYWNGdW5jdGlvbikgZnVuY3Rpb24sIHNldHRpbmcgdGhlXHJcblx0SW5wdXQgRmlsZSBIVE1MIGVsZW1lbnQgdGhhdCB3aWxsIGhhbmRsZSB0aGUgZmlsZS5taWQgb3BlbmluZywgYW5kIGNhbGxiYWNrIGZ1bmN0aW9uXHJcblx0dGhhdCB3aWxsIHJlY2lldmUgdGhlIHJlc3VsdGluZyBPYmplY3QgZm9ybWF0ZWQsIHNldCBvZiBkYXRhLlxyXG5cclxuXHQqIE9QVElPTiAzIChNSURJUGFyc2VyLlVpbnQ4KVxyXG5cdFByb3ZpZGUgeW91ciBvd24gVUludDggQXJyYXkgdG8gTUlESVBhcnNlci5VaW50OCgpLCB0byBnZXQgYW4gT2JqZWN0IGZvcm1hdGVkLCBzZXQgb2YgZGF0YVxyXG5cclxuXHQqIE9QVElPTiA0IChNSURJUGFyc2VyLkJhc2U2NClcclxuXHRQcm92aWRlIGEgQmFzZTY0IGVuY29kZWQgRGF0YSB0byBNSURJUGFyc2VyLkJhc2U2NCgpLCAsIHRvIGdldCBhbiBPYmplY3QgZm9ybWF0ZWQsIHNldCBvZiBkYXRhXHJcblxyXG5cclxuXHQtLS0gIE91dHB1dCBPYmplY3QgU3BlY3MgICAtLS1cclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0TUlESU9iamVjdHtcclxuXHRcdGZvcm1hdFR5cGU6IDB8MXwyLCBcdFx0XHRcdFx0Ly8gTWlkaSBmb3JtYXQgdHlwZVxyXG5cdFx0dGltZURpdmlzaW9uOiAoaW50KSxcdFx0XHRcdC8vIHNvbmcgdGVtcG8gKGJwbSlcclxuXHRcdHRyYWNrczogKGludCksIFx0XHRcdFx0XHRcdC8vIHRvdGFsIHRyYWNrcyBjb3VudFxyXG5cdFx0dHJhY2s6IEFycmF5W1xyXG5cdFx0XHRbMF06IE9iamVjdHtcdFx0XHRcdFx0Ly8gVFJBQ0sgMSFcclxuXHRcdFx0XHRldmVudDogQXJyYXlbXHRcdFx0XHQvLyBNaWRpIGV2ZW50cyBpbiB0cmFjayAxXHJcblx0XHRcdFx0XHRbMF0gOiBPYmplY3R7XHRcdFx0Ly8gRVZFTlQgMVxyXG5cdFx0XHRcdFx0XHRkYXRhOiAoc3RyaW5nKSxcclxuXHRcdFx0XHRcdFx0ZGVsdGFUaW1lOiAoaW50KSxcclxuXHRcdFx0XHRcdFx0bWV0YVR5cGU6IChpbnQpLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiAoaW50KSxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRbMV0gOiBPYmplY3R7Li4ufVx0XHQvLyBFVkVOVCAyXHJcblx0XHRcdFx0XHRbMl0gOiBPYmplY3R7Li4ufVx0XHQvLyBFVkVOVCAzXHJcblx0XHRcdFx0XHQuLi5cclxuXHRcdFx0XHRdXHJcblx0XHRcdH0sXHJcblx0XHRcdFsxXSA6IE9iamVjdHsuLi59XHJcblx0XHRcdFsyXSA6IE9iamVjdHsuLi59XHJcblx0XHRcdC4uLlxyXG5cdFx0XVxyXG5cdH1cclxuXHJcbkRhdGEgZnJvbSBFdmVudCAxMiBvZiBUcmFjayAyIGNvdWxkIGJlIGVhc2lsbHkgcmVhZGVkIHdpdGg6XHJcbk91dHB1dE9iamVjdC50cmFja1syXS5ldmVudFsxMl0uZGF0YTtcclxuXHJcbiovXHJcblxyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gQ1JPU1NCUk9XU0VSICYgTk9ERWpzIFBPTFlGSUxMIGZvciBBVE9CKCkgLSBCeTogaHR0cHM6Ly9naXRodWIuY29tL01heEFydDI1MDEgKG1vZGlmaWVkKVxyXG52YXIgX2F0b2IgPSBmdW5jdGlvbihzdHJpbmcpIHtcclxuXHQvLyBiYXNlNjQgY2hhcmFjdGVyIHNldCwgcGx1cyBwYWRkaW5nIGNoYXJhY3RlciAoPSlcclxuXHR2YXIgYjY0ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiO1xyXG5cdC8vIFJlZ3VsYXIgZXhwcmVzc2lvbiB0byBjaGVjayBmb3JtYWwgY29ycmVjdG5lc3Mgb2YgYmFzZTY0IGVuY29kZWQgc3RyaW5nc1xyXG5cdHZhciBiNjRyZSA9IC9eKD86W0EtWmEtelxcZCtcXC9dezR9KSo/KD86W0EtWmEtelxcZCtcXC9dezJ9KD86PT0pP3xbQS1aYS16XFxkK1xcL117M309Pyk/JC87XHJcblx0Ly8gcmVtb3ZlIGRhdGEgdHlwZSBzaWduYXR1cmVzIGF0IHRoZSBiZWdpbmluZyBvZiB0aGUgc3RyaW5nXHJcblx0Ly8gZWcgOiAgXCJkYXRhOmF1ZGlvL21pZDtiYXNlNjQsXCJcclxuICAgXHRzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSggL14uKj9iYXNlNjQsLyAsIFwiXCIpO1xyXG4gICAgLy8gYXRvYiBjYW4gd29yayB3aXRoIHN0cmluZ3Mgd2l0aCB3aGl0ZXNwYWNlcywgZXZlbiBpbnNpZGUgdGhlIGVuY29kZWQgcGFydCxcclxuICAgIC8vIGJ1dCBvbmx5IFxcdCwgXFxuLCBcXGYsIFxcciBhbmQgJyAnLCB3aGljaCBjYW4gYmUgc3RyaXBwZWQuXHJcbiAgICBzdHJpbmcgPSBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC9bXFx0XFxuXFxmXFxyIF0rL2csIFwiXCIpO1xyXG4gICAgaWYgKCFiNjRyZS50ZXN0KHN0cmluZykpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBleGVjdXRlICdfYXRvYicgOiBUaGUgc3RyaW5nIHRvIGJlIGRlY29kZWQgaXMgbm90IGNvcnJlY3RseSBlbmNvZGVkLlwiKTtcclxuXHJcbiAgICAvLyBBZGRpbmcgdGhlIHBhZGRpbmcgaWYgbWlzc2luZywgZm9yIHNlbXBsaWNpdHlcclxuICAgIHN0cmluZyArPSBcIj09XCIuc2xpY2UoMiAtIChzdHJpbmcubGVuZ3RoICYgMykpO1xyXG4gICAgdmFyIGJpdG1hcCwgcmVzdWx0ID0gXCJcIiwgcjEsIHIyLCBpID0gMDtcclxuICAgIGZvciAoOyBpIDwgc3RyaW5nLmxlbmd0aDspIHtcclxuICAgICAgICBiaXRtYXAgPSBiNjQuaW5kZXhPZihzdHJpbmcuY2hhckF0KGkrKykpIDw8IDE4IHwgYjY0LmluZGV4T2Yoc3RyaW5nLmNoYXJBdChpKyspKSA8PCAxMlxyXG4gICAgICAgICAgICAgICAgfCAocjEgPSBiNjQuaW5kZXhPZihzdHJpbmcuY2hhckF0KGkrKykpKSA8PCA2IHwgKHIyID0gYjY0LmluZGV4T2Yoc3RyaW5nLmNoYXJBdChpKyspKSk7XHJcblxyXG4gICAgICAgIHJlc3VsdCArPSByMSA9PT0gNjQgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJpdG1hcCA+PiAxNiAmIDI1NSlcclxuICAgICAgICAgICAgICAgIDogcjIgPT09IDY0ID8gU3RyaW5nLmZyb21DaGFyQ29kZShiaXRtYXAgPj4gMTYgJiAyNTUsIGJpdG1hcCA+PiA4ICYgMjU1KVxyXG4gICAgICAgICAgICAgICAgOiBTdHJpbmcuZnJvbUNoYXJDb2RlKGJpdG1hcCA+PiAxNiAmIDI1NSwgYml0bWFwID4+IDggJiAyNTUsIGJpdG1hcCAmIDI1NSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuXHJcbnZhciBNSURJUGFyc2VyID0ge1xyXG5cdC8vIGRlYnVnIChib29sKSwgd2hlbiBlbmFibGVkIHdpbGwgbG9nIGluIGNvbnNvbGUgdW5pbXBsZW1lbnRlZCBldmVudHMgd2FybmluZ3MgYW5kIGludGVybmFsIGhhbmRsZWQgZXJyb3JzLlxyXG5cdGRlYnVnOiBmYWxzZSxcclxuXHJcblx0cGFyc2U6IGZ1bmN0aW9uKGlucHV0LCBfY2FsbGJhY2spe1xyXG5cdFx0aWYoaW5wdXQgaW5zdGFuY2VvZiBVaW50OEFycmF5KSByZXR1cm4gTUlESVBhcnNlci5VaW50OChpbnB1dCk7XHJcblx0XHRlbHNlIGlmKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHJldHVybiBNSURJUGFyc2VyLkJhc2U2NChpbnB1dCk7XHJcblx0XHRlbHNlIGlmKGlucHV0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgaW5wdXQudHlwZSA9PT0gJ2ZpbGUnKSByZXR1cm4gTUlESVBhcnNlci5hZGRMaXN0ZW5lcihpbnB1dCAsIF9jYWxsYmFjayk7XHJcblx0XHRlbHNlIHRocm93IG5ldyBFcnJvcignTUlESVBhcnNlci5wYXJzZSgpIDogSW52YWxpZCBpbnB1dCBwcm92aWRlZCcpO1xyXG5cdH0sXHJcblx0Ly8gYWRkTGlzdGVuZXIoKSBzaG91bGQgYmUgY2FsbGVkIGluIG9yZGVyIGF0dGFjaCBhIGxpc3RlbmVyIHRvIHRoZSBJTlBVVCBIVE1MIGVsZW1lbnRcclxuXHQvLyB0aGF0IHdpbGwgcHJvdmlkZSB0aGUgYmluYXJ5IGRhdGEgYXV0b21hdGluZyB0aGUgY29udmVyc2lvbiwgYW5kIHJldHVybmluZ1xyXG5cdC8vIHRoZSBzdHJ1Y3R1cmVkIGRhdGEgdG8gdGhlIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG5cdGFkZExpc3RlbmVyOiBmdW5jdGlvbihfZmlsZUVsZW1lbnQsIF9jYWxsYmFjayl7XHJcblx0XHRpZighRmlsZSB8fCAhRmlsZVJlYWRlcikgdGhyb3cgbmV3IEVycm9yKCdUaGUgRmlsZXxGaWxlUmVhZGVyIEFQSXMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyLiBVc2UgaW5zdGVhZCBNSURJUGFyc2VyLkJhc2U2NCgpIG9yIE1JRElQYXJzZXIuVWludDgoKScpO1xyXG5cclxuXHRcdC8vIHZhbGlkYXRlIHByb3ZpZGVkIGVsZW1lbnRcclxuXHRcdGlmKCBfZmlsZUVsZW1lbnQgPT09IHVuZGVmaW5lZCB8fFxyXG5cdFx0XHQhKF9maWxlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB8fFxyXG5cdFx0XHRfZmlsZUVsZW1lbnQudGFnTmFtZSAhPT0gJ0lOUFVUJyB8fFxyXG5cdFx0XHRfZmlsZUVsZW1lbnQudHlwZS50b0xvd2VyQ2FzZSgpICE9PSAnZmlsZScgKXtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ01JRElQYXJzZXIuYWRkTGlzdGVuZXIoKSA6IFByb3ZpZGVkIGVsZW1lbnQgaXMgbm90IGEgdmFsaWQgRklMRSBJTlBVVCBlbGVtZW50Jyk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0X2NhbGxiYWNrID0gX2NhbGxiYWNrIHx8IGZ1bmN0aW9uKCl7fTtcclxuXHJcblx0XHRfZmlsZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oSW5wdXRFdnQpe1x0XHRcdFx0Ly8gc2V0IHRoZSAnZmlsZSBzZWxlY3RlZCcgZXZlbnQgaGFuZGxlclxyXG5cdFx0XHRpZiAoIUlucHV0RXZ0LnRhcmdldC5maWxlcy5sZW5ndGgpIHJldHVybiBmYWxzZTtcdFx0XHRcdFx0Ly8gcmV0dXJuIGZhbHNlIGlmIG5vIGVsZW1lbnRzIHdoZXJlIHNlbGVjdGVkXHJcblx0XHRcdGNvbnNvbGUubG9nKCdNSURJUGFyc2VyLmFkZExpc3RlbmVyKCkgOiBGaWxlIGRldGVjdGVkIGluIElOUFVUIEVMRU1FTlQgcHJvY2Vzc2luZyBkYXRhLi4nKTtcclxuXHRcdFx0dmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBwcmVwYXJlIHRoZSBmaWxlIFJlYWRlclxyXG5cdFx0XHRyZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoSW5wdXRFdnQudGFyZ2V0LmZpbGVzWzBdKTtcdFx0XHRcdFx0Ly8gcmVhZCB0aGUgYmluYXJ5IGRhdGFcclxuXHRcdFx0cmVhZGVyLm9ubG9hZCA9ICBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRfY2FsbGJhY2soIE1JRElQYXJzZXIuVWludDgobmV3IFVpbnQ4QXJyYXkoZS50YXJnZXQucmVzdWx0KSkpOyBcdC8vIGVuY29kZSBkYXRhIHdpdGggVWludDhBcnJheSBhbmQgY2FsbCB0aGUgcGFyc2VyXHJcblx0XHRcdH07XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRCYXNlNjQgOiBmdW5jdGlvbihiNjRTdHJpbmcpe1xyXG5cdFx0YjY0U3RyaW5nID0gU3RyaW5nKGI2NFN0cmluZyk7XHJcblxyXG5cdFx0dmFyIHJhdyA9IF9hdG9iKGI2NFN0cmluZyk7XHJcblx0XHR2YXIgcmF3TGVuZ3RoID0gcmF3Lmxlbmd0aDtcclxuXHRcdHZhciBhcnJheSA9IG5ldyBVaW50OEFycmF5KG5ldyBBcnJheUJ1ZmZlcihyYXdMZW5ndGgpKTtcclxuXHJcblx0XHRmb3IodmFyIGk9MDsgaTxyYXdMZW5ndGg7IGkrKykgYXJyYXlbaV0gPSByYXcuY2hhckNvZGVBdChpKTtcclxuXHRcdHJldHVybiAgTUlESVBhcnNlci5VaW50OChhcnJheSkgO1xyXG5cdH0sXHJcblxyXG5cdC8vIHBhcnNlKCkgZnVuY3Rpb24gcmVhZHMgdGhlIGJpbmFyeSBkYXRhLCBpbnRlcnByZXRpbmcgYW5kIHNwbGl0aW5nIGVhY2ggY2h1Y2tcclxuXHQvLyBhbmQgcGFyc2luZyBpdCB0byBhIHN0cnVjdHVyZWQgT2JqZWN0LiBXaGVuIGpvYiBpcyBmaW5pc2VkIHJldHVybnMgdGhlIG9iamVjdFxyXG5cdC8vIG9yICdmYWxzZScgaWYgYW55IGVycm9yIHdhcyBnZW5lcmF0ZWQuXHJcblx0VWludDg6IGZ1bmN0aW9uKEZpbGVBc1VpbnQ4QXJyYXkpe1xyXG5cdFx0dmFyIGZpbGUgPSB7XHJcblx0XHRcdGRhdGE6IG51bGwsXHJcblx0XHRcdHBvaW50ZXI6IDAsXHJcblx0XHRcdG1vdmVQb2ludGVyOiBmdW5jdGlvbihfYnl0ZXMpe1x0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gbW92ZSB0aGUgcG9pbnRlciBuZWdhdGl2ZSBhbmQgcG9zaXRpdmUgZGlyZWN0aW9uXHJcblx0XHRcdFx0dGhpcy5wb2ludGVyICs9IF9ieXRlcztcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5wb2ludGVyO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZWFkSW50OiBmdW5jdGlvbihfYnl0ZXMpeyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IGludGVnZXIgZnJvbSBuZXh0IF9ieXRlcyBncm91cCAoYmlnLWVuZGlhbilcclxuXHRcdFx0XHRfYnl0ZXMgPSBNYXRoLm1pbihfYnl0ZXMsIHRoaXMuZGF0YS5ieXRlTGVuZ3RoLXRoaXMucG9pbnRlcik7XHJcblx0XHRcdFx0aWYgKF9ieXRlcyA8IDEpIHJldHVybiAtMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRU9GXHJcblx0XHRcdFx0dmFyIHZhbHVlID0gMDtcclxuXHRcdFx0XHRpZihfYnl0ZXMgPiAxKXtcclxuXHRcdFx0XHRcdGZvcih2YXIgaT0xOyBpPD0gKF9ieXRlcy0xKTsgaSsrKXtcclxuXHRcdFx0XHRcdFx0dmFsdWUgKz0gdGhpcy5kYXRhLmdldFVpbnQ4KHRoaXMucG9pbnRlcikgKiBNYXRoLnBvdygyNTYsIChfYnl0ZXMgLSBpKSk7XHJcblx0XHRcdFx0XHRcdHRoaXMucG9pbnRlcisrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YWx1ZSArPSB0aGlzLmRhdGEuZ2V0VWludDgodGhpcy5wb2ludGVyKTtcclxuXHRcdFx0XHR0aGlzLnBvaW50ZXIrKztcclxuXHRcdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHRcdH0sXHJcblx0XHRcdHJlYWRTdHI6IGZ1bmN0aW9uKF9ieXRlcyl7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIHJlYWQgYXMgQVNDSUkgY2hhcnMsIHRoZSBmb2xsb3dvaW5nIF9ieXRlc1xyXG5cdFx0XHRcdHZhciB0ZXh0ID0gJyc7XHJcblx0XHRcdFx0Zm9yKHZhciBjaGFyPTE7IGNoYXIgPD0gX2J5dGVzOyBjaGFyKyspIHRleHQgKz0gIFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5yZWFkSW50KDEpKTtcclxuXHRcdFx0XHRyZXR1cm4gdGV4dDtcclxuXHRcdFx0fSxcclxuXHRcdFx0cmVhZEludFZMVjogZnVuY3Rpb24oKXtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyByZWFkIGEgdmFyaWFibGUgbGVuZ3RoIHZhbHVlXHJcblx0XHRcdFx0dmFyIHZhbHVlID0gMDtcclxuXHRcdFx0XHRpZiAoIHRoaXMucG9pbnRlciA+PSB0aGlzLmRhdGEuYnl0ZUxlbmd0aCApe1xyXG5cdFx0XHRcdFx0cmV0dXJuIC0xO1x0XHRcdFx0XHRcdFx0XHRcdC8vIEVPRlxyXG5cdFx0XHRcdH1lbHNlIGlmKHRoaXMuZGF0YS5nZXRVaW50OCh0aGlzLnBvaW50ZXIpIDwgMTI4KXtcdFx0XHRcdFx0Ly8gLi4udmFsdWUgaW4gYSBzaW5nbGUgYnl0ZVxyXG5cdFx0XHRcdFx0dmFsdWUgPSB0aGlzLnJlYWRJbnQoMSk7XHJcblx0XHRcdFx0fWVsc2V7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gLi4udmFsdWUgaW4gbXVsdGlwbGUgYnl0ZXNcclxuXHRcdFx0XHRcdHZhciBGaXJzdEJ5dGVzID0gW107XHJcblx0XHRcdFx0XHR3aGlsZSh0aGlzLmRhdGEuZ2V0VWludDgodGhpcy5wb2ludGVyKSA+PSAxMjgpe1xyXG5cdFx0XHRcdFx0XHRGaXJzdEJ5dGVzLnB1c2godGhpcy5yZWFkSW50KDEpIC0gMTI4KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHZhciBsYXN0Qnl0ZSAgPSB0aGlzLnJlYWRJbnQoMSk7XHJcblx0XHRcdFx0XHRmb3IodmFyIGR0ID0gMTsgZHQgPD0gRmlyc3RCeXRlcy5sZW5ndGg7IGR0Kyspe1xyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IEZpcnN0Qnl0ZXNbRmlyc3RCeXRlcy5sZW5ndGggLSBkdF0gKiBNYXRoLnBvdygxMjgsIGR0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHZhbHVlICs9IGxhc3RCeXRlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0ZmlsZS5kYXRhID0gbmV3IERhdGFWaWV3KEZpbGVBc1VpbnQ4QXJyYXkuYnVmZmVyLCBGaWxlQXNVaW50OEFycmF5LmJ5dGVPZmZzZXQsIEZpbGVBc1VpbnQ4QXJyYXkuYnl0ZUxlbmd0aCk7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIDggYml0cyBieXRlcyBmaWxlIGRhdGEgYXJyYXlcclxuXHRcdC8vICAqKiByZWFkIEZJTEUgSEVBREVSXHJcblx0XHRpZihmaWxlLnJlYWRJbnQoNCkgIT09IDB4NEQ1NDY4NjQpe1xyXG5cdFx0XHRjb25zb2xlLndhcm4oJ0hlYWRlciB2YWxpZGF0aW9uIGZhaWxlZCAobm90IE1JREkgc3RhbmRhcmQgb3IgZmlsZSBjb3JydXB0LiknKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlOyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSGVhZGVyIHZhbGlkYXRpb24gZmFpbGVkIChub3QgTUlESSBzdGFuZGFyZCBvciBmaWxlIGNvcnJ1cHQuKVxyXG5cdFx0fVxyXG5cdFx0dmFyIGhlYWRlclNpemUgXHRcdFx0PSBmaWxlLnJlYWRJbnQoNCk7XHRcdFx0XHRcdFx0XHRcdC8vIGhlYWRlciBzaXplICh1bnVzZWQgdmFyKSwgZ2V0dGVkIGp1c3QgZm9yIHJlYWQgcG9pbnRlciBtb3ZlbWVudFxyXG5cdFx0dmFyIE1JREkgXHRcdFx0XHQ9IHt9O1x0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjcmVhdGUgbmV3IG1pZGkgb2JqZWN0XHJcblx0XHRNSURJLmZvcm1hdFR5cGUgICBcdFx0PSBmaWxlLnJlYWRJbnQoMik7XHRcdFx0XHRcdFx0XHRcdC8vIGdldCBNSURJIEZvcm1hdCBUeXBlXHJcblx0XHRNSURJLnRyYWNrcyBcdFx0XHQ9IGZpbGUucmVhZEludCgyKTtcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IGFtbW91bnQgb2YgdHJhY2sgY2h1bmtzXHJcblx0XHRNSURJLnRyYWNrXHRcdFx0XHQ9IFtdO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjcmVhdGUgYXJyYXkga2V5IGZvciB0cmFjayBkYXRhIHN0b3JpbmdcclxuXHRcdHZhciB0aW1lRGl2aXNpb25CeXRlMSAgID0gZmlsZS5yZWFkSW50KDEpO1x0XHRcdFx0XHRcdFx0XHQvLyBnZXQgVGltZSBEaXZpc2lvbiBmaXJzdCBieXRlXHJcblx0XHR2YXIgdGltZURpdmlzaW9uQnl0ZTIgICA9IGZpbGUucmVhZEludCgxKTtcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IFRpbWUgRGl2aXNpb24gc2Vjb25kIGJ5dGVcclxuXHRcdGlmKHRpbWVEaXZpc2lvbkJ5dGUxID49IDEyOCl7IFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBkaXNjb3ZlciBUaW1lIERpdmlzaW9uIG1vZGUgKGZwcyBvciB0cGYpXHJcblx0XHRcdE1JREkudGltZURpdmlzaW9uICAgID0gW107XHJcblx0XHRcdE1JREkudGltZURpdmlzaW9uWzBdID0gdGltZURpdmlzaW9uQnl0ZTEgLSAxMjg7XHRcdFx0XHRcdFx0Ly8gZnJhbWVzIHBlciBzZWNvbmQgTU9ERSAgKDFzdCBieXRlKVxyXG5cdFx0XHRNSURJLnRpbWVEaXZpc2lvblsxXSA9IHRpbWVEaXZpc2lvbkJ5dGUyO1x0XHRcdFx0XHRcdFx0Ly8gdGlja3MgaW4gZWFjaCBmcmFtZSAgICAgKDJuZCBieXRlKVxyXG5cdFx0fWVsc2UgTUlESS50aW1lRGl2aXNpb24gID0gKHRpbWVEaXZpc2lvbkJ5dGUxICogMjU2KSArIHRpbWVEaXZpc2lvbkJ5dGUyOy8vIGVsc2UuLi4gdGlja3MgcGVyIGJlYXQgTU9ERSAgKDIgYnl0ZXMgdmFsdWUpXHJcblx0XHQvLyAgKiogcmVhZCBUUkFDSyBDSFVOS1xyXG5cdFx0Zm9yKHZhciB0PTE7IHQgPD0gTUlESS50cmFja3M7IHQrKyl7XHJcblx0XHRcdE1JREkudHJhY2tbdC0xXSBcdD0ge2V2ZW50OiBbXX07XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY3JlYXRlIG5ldyBUcmFjayBlbnRyeSBpbiBBcnJheVxyXG5cdFx0XHR2YXIgaGVhZGVyVmFsaWRhdGlvbiA9IGZpbGUucmVhZEludCg0KTtcclxuXHRcdFx0aWYgKCBoZWFkZXJWYWxpZGF0aW9uID09PSAtMSApIGJyZWFrO1x0XHRcdFx0XHRcdFx0Ly8gRU9GXHJcblx0XHRcdGlmKGhlYWRlclZhbGlkYXRpb24gIT09IDB4NEQ1NDcyNkIpIHJldHVybiBmYWxzZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcmFjayBjaHVuayBoZWFkZXIgdmFsaWRhdGlvbiBmYWlsZWQuXHJcblx0XHRcdGZpbGUucmVhZEludCg0KTtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIG1vdmUgcG9pbnRlci4gZ2V0IGNodW5rIHNpemUgKGJ5dGVzIGxlbmd0aClcclxuXHRcdFx0dmFyIGVcdFx0ICBcdFx0PSAwO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBpbml0IGV2ZW50IGNvdW50ZXJcclxuXHRcdFx0dmFyIGVuZE9mVHJhY2sgXHRcdD0gZmFsc2U7XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBGTEFHIGZvciB0cmFjayByZWFkaW5nIHNlY3VlbmNlIGJyZWFraW5nXHJcblx0XHRcdC8vICoqIHJlYWQgRVZFTlQgQ0hVTktcclxuXHRcdFx0dmFyIHN0YXR1c0J5dGU7XHJcblx0XHRcdHZhciBsYXN0c3RhdHVzQnl0ZTtcclxuXHRcdFx0d2hpbGUoIWVuZE9mVHJhY2spe1xyXG5cdFx0XHRcdGUrKztcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBpbmNyZWFzZSBieSAxIGV2ZW50IGNvdW50ZXJcclxuXHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXSA9IHt9O1x0IFx0XHRcdFx0XHRcdFx0Ly8gY3JlYXRlIG5ldyBldmVudCBvYmplY3QsIGluIGV2ZW50cyBhcnJheVxyXG5cdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRlbHRhVGltZSAgPSBmaWxlLnJlYWRJbnRWTFYoKTtcdFx0Ly8gZ2V0IERFTFRBIFRJTUUgT0YgTUlESSBldmVudCAoVmFyaWFibGUgTGVuZ3RoIFZhbHVlKVxyXG5cdFx0XHRcdHN0YXR1c0J5dGUgPSBmaWxlLnJlYWRJbnQoMSk7XHRcdFx0XHRcdFx0XHRcdFx0Ly8gcmVhZCBFVkVOVCBUWVBFIChTVEFUVVMgQllURSlcclxuXHRcdFx0XHRpZihzdGF0dXNCeXRlID09PSAtMSkgYnJlYWs7XHRcdFx0XHRcdFx0XHRcdFx0Ly8gRU9GXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHN0YXR1c0J5dGUgPj0gMTI4KSBsYXN0c3RhdHVzQnl0ZSA9IHN0YXR1c0J5dGU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5FVyBTVEFUVVMgQllURSBERVRFQ1RFRFxyXG5cdFx0XHRcdGVsc2V7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gJ1JVTk5JTkcgU1RBVFVTJyBzaXR1YXRpb24gZGV0ZWN0ZWRcclxuXHRcdFx0XHRcdHN0YXR1c0J5dGUgPSBsYXN0c3RhdHVzQnl0ZTtcdFx0XHRcdFx0XHRcdFx0Ly8gYXBwbHkgbGFzdCBsb29wLCBTdGF0dXMgQnl0ZVxyXG5cdFx0XHRcdFx0ZmlsZS5tb3ZlUG9pbnRlcigtMSk7IFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gbW92ZSBiYWNrIHRoZSBwb2ludGVyIChjYXVzZSByZWFkZWQgYnl0ZSBpcyBub3Qgc3RhdHVzIGJ5dGUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vICoqIElkZW50aWZ5IEVWRU5UXHJcblx0XHRcdFx0aWYoc3RhdHVzQnl0ZSA9PT0gMHhGRil7IFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTWV0YSBFdmVudCB0eXBlXHJcblx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS50eXBlID0gMHhGRjtcdFx0XHRcdFx0XHQvLyBhc3NpZ24gbWV0YUV2ZW50IGNvZGUgdG8gYXJyYXlcclxuXHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLm1ldGFUeXBlID0gIGZpbGUucmVhZEludCgxKTtcdFx0Ly8gYXNzaWduIG1ldGFFdmVudCBzdWJ0eXBlXHJcblx0XHRcdFx0XHR2YXIgbWV0YUV2ZW50TGVuZ3RoID0gZmlsZS5yZWFkSW50VkxWKCk7XHRcdFx0XHRcdC8vIGdldCB0aGUgbWV0YUV2ZW50IGxlbmd0aFxyXG5cdFx0XHRcdFx0c3dpdGNoKE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLm1ldGFUeXBlKXtcclxuXHRcdFx0XHRcdFx0Y2FzZSAweDJGOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGVuZCBvZiB0cmFjaywgaGFzIG5vIGRhdGEgYnl0ZVxyXG5cdFx0XHRcdFx0XHRjYXNlIC0xOlx0XHRcdFx0XHRcdFx0XHRcdC8vIEVPRlxyXG5cdFx0XHRcdFx0XHRcdGVuZE9mVHJhY2sgPSB0cnVlO1x0XHRcdFx0XHRcdFx0XHRcdC8vIGNoYW5nZSBGTEFHIHRvIGZvcmNlIHRyYWNrIHJlYWRpbmcgbG9vcCBicmVha2luZ1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDB4MDE6IFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFRleHQgRXZlbnRcclxuXHRcdFx0XHRcdFx0Y2FzZSAweDAyOiAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIENvcHlyaWdodCBOb3RpY2VcclxuXHRcdFx0XHRcdFx0Y2FzZSAweDAzOiAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFNlcXVlbmNlL1RyYWNrIE5hbWUgKGRvY3VtZW50YXRpb246IGh0dHA6Ly93d3cudGE3LmRlL3R4dC9tdXNpay9tdXNpMDAwNi5odG0pXHJcblx0XHRcdFx0XHRcdGNhc2UgMHgwNjogIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBNYXJrZXJcclxuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkU3RyKG1ldGFFdmVudExlbmd0aCk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMHgyMTogXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTUlESSBQT1JUXHJcblx0XHRcdFx0XHRcdGNhc2UgMHg1OTogXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gS2V5IFNpZ25hdHVyZVxyXG5cdFx0XHRcdFx0XHRjYXNlIDB4NTE6XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gU2V0IFRlbXBvXHJcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IGZpbGUucmVhZEludChtZXRhRXZlbnRMZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDB4NTQ6IFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFNNUFRFIE9mZnNldFxyXG5cdFx0XHRcdFx0XHRjYXNlIDB4NTg6IFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFRpbWUgU2lnbmF0dXJlXHJcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVx0ICAgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzBdID0gZmlsZS5yZWFkSW50KDEpO1xyXG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbMV0gPSBmaWxlLnJlYWRJbnQoMSk7XHJcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVsyXSA9IGZpbGUucmVhZEludCgxKTtcclxuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzNdID0gZmlsZS5yZWFkSW50KDEpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRkZWZhdWx0IDpcclxuXHRcdFx0XHRcdFx0XHRmaWxlLnJlYWRJbnQobWV0YUV2ZW50TGVuZ3RoKTtcclxuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkSW50KG1ldGFFdmVudExlbmd0aCk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuZGVidWcpIGNvbnNvbGUuaW5mbygnVW5pbXBsZW1lbnRlZCAweEZGIGV2ZW50ISBkYXRhIGJsb2NrIHJlYWRlZCBhcyBJbnRlZ2VyJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2V7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTUlESSBDb250cm9sIEV2ZW50cyBPUiBTeXN0ZW0gRXhjbHVzaXZlIEV2ZW50c1xyXG5cdFx0XHRcdFx0c3RhdHVzQnl0ZSA9IHN0YXR1c0J5dGUudG9TdHJpbmcoMTYpLnNwbGl0KCcnKTtcdFx0XHRcdC8vIHNwbGl0IHRoZSBzdGF0dXMgYnl0ZSBIRVggcmVwcmVzZW50YXRpb24sIHRvIG9idGFpbiA0IGJpdHMgdmFsdWVzXHJcblx0XHRcdFx0XHRpZighc3RhdHVzQnl0ZVsxXSkgc3RhdHVzQnl0ZS51bnNoaWZ0KCcwJyk7XHRcdFx0XHRcdC8vIGZvcmNlIDIgZGlnaXRzXHJcblx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS50eXBlID0gcGFyc2VJbnQoc3RhdHVzQnl0ZVswXSwgMTYpOy8vIGZpcnN0IGJ5dGUgaXMgRVZFTlQgVFlQRSBJRFxyXG5cdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uY2hhbm5lbCA9IHBhcnNlSW50KHN0YXR1c0J5dGVbMV0sIDE2KTsvLyBzZWNvbmQgYnl0ZSBpcyBjaGFubmVsXHJcblx0XHRcdFx0XHRzd2l0Y2goTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0udHlwZSl7XHJcblx0XHRcdFx0XHRcdGNhc2UgMHhGOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFN5c3RlbSBFeGNsdXNpdmUgRXZlbnRzXHJcblx0XHRcdFx0XHRcdFx0dmFyIGV2ZW50X2xlbmd0aCA9IGZpbGUucmVhZEludFZMVigpO1xyXG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBmaWxlLnJlYWRJbnQoZXZlbnRfbGVuZ3RoKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5kZWJ1ZykgY29uc29sZS5pbmZvKCdVbmltcGxlbWVudGVkIDB4RiBleGNsdXNpdmUgZXZlbnRzISBkYXRhIGJsb2NrIHJlYWRlZCBhcyBJbnRlZ2VyJyk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMHhBOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIE5vdGUgQWZ0ZXJ0b3VjaFxyXG5cdFx0XHRcdFx0XHRjYXNlIDB4QjpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBDb250cm9sbGVyXHJcblx0XHRcdFx0XHRcdGNhc2UgMHhFOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFBpdGNoIEJlbmQgRXZlbnRcclxuXHRcdFx0XHRcdFx0Y2FzZSAweDg6XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTm90ZSBvZmZcclxuXHRcdFx0XHRcdFx0Y2FzZSAweDk6XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTm90ZSBPblxyXG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzBdID0gZmlsZS5yZWFkSW50KDEpO1xyXG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbMV0gPSBmaWxlLnJlYWRJbnQoMSk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMHhDOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFByb2dyYW0gQ2hhbmdlXHJcblx0XHRcdFx0XHRcdGNhc2UgMHhEOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIENoYW5uZWwgQWZ0ZXJ0b3VjaFxyXG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBmaWxlLnJlYWRJbnQoMSk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgLTE6XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gRU9GXHJcblx0XHRcdFx0XHRcdFx0ZW5kT2ZUcmFjayA9IHRydWU7XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2hhbmdlIEZMQUcgdG8gZm9yY2UgdHJhY2sgcmVhZGluZyBsb29wIGJyZWFraW5nXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybignVW5rbm93biBFVkVOVCBkZXRlY3RlZC4uLi4gcmVhZGluZyBjYW5jZWxsZWQhJyk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIE1JREk7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbmlmKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IE1JRElQYXJzZXI7XHJcbiIsImxldCBjaG9yZHNNYXAgPSBuZXcgTWFwKCk7XHJcblxyXG5mdW5jdGlvbiBwYXJzZU1pZGkoKSB7XHJcblx0Y29uc3QgaW5wdXRFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpbGUtaW5wdXQnKTtcclxuXHRsZXQgZmlsZSA9IGlucHV0RWxlbS5maWxlc1swXTtcclxuXHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblxyXG5cdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRsZXQgdWludDhhcnJheSA9IG5ldyBVaW50OEFycmF5KGUudGFyZ2V0LnJlc3VsdCk7XHJcblx0XHRsZXQgcGFyc2VkID0gTUlESVBhcnNlci5VaW50OCh1aW50OGFycmF5KTtcclxuXHJcblx0XHQvKmZvcih0cmFjayBvZiBwYXJzZWQudHJhY2spIHtcclxuXHJcblx0XHRcdGxldCBkZWx0YVRpbWUgPSAwO1xyXG5cdFx0XHRsZXQgbm90ZTtcclxuXHRcdFx0bGV0IGN1cnJOb3RlcyA9IFtdO1xyXG5cdFx0XHJcblx0XHRcdGZvcihldmVudCBvZiB0cmFjay5ldmVudCkge1xyXG5cdFx0XHRcdGRlbHRhVGltZSArPSBldmVudC5kZWx0YVRpbWU7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoZXZlbnQudHlwZSA9PT0gOSkge1xyXG5cclxuXHRcdFx0XHRcdG5vdGUgPSBldmVudC5kYXRhWzBdICUgMTI7XHJcblxyXG5cdFx0XHRcdFx0aWYoY2hvcmRzTWFwLmhhcyhkZWx0YVRpbWUpKSB7XHJcblx0XHRcdFx0XHRcdGlmKCFjaG9yZHNNYXAuZ2V0KGRlbHRhVGltZSkuaW5jbHVkZXMobm90ZSkpIFxyXG5cdFx0XHRcdFx0XHRcdGNob3Jkc01hcC5nZXQoZGVsdGFUaW1lKS5wdXNoKG5vdGUpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Y2hvcmRzTWFwLnNldChkZWx0YVRpbWUsIFtub3RlXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBcclxuXHRcdFx0fVxyXG5cdFx0fSovXHJcblxyXG5cdFx0bGV0IG9uZVRyYWNrID0gW107XHJcblx0XHRcclxuXHRcdHBhcnNlZC50cmFjay5mb3JFYWNoKHRyYWNrID0+IHtcclxuXHRcdFx0bGV0IGN1cnJEZWx0YVRpbWUgPSAwO1xyXG5cclxuXHRcdFx0dHJhY2suZXZlbnQuZm9yRWFjaChldmVudCA9PiB7XHJcblx0XHRcdFx0Y3VyckRlbHRhVGltZSArPSBldmVudC5kZWx0YVRpbWU7XHJcblxyXG5cdFx0XHRcdG9uZVRyYWNrLnB1c2goeyAnZXZlbnQnOiBldmVudCwgJ3RpbWUnOiBjdXJyRGVsdGFUaW1lfSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdGxldCBjdXJyTm90ZXMgPSBbXTtcclxuXHJcblx0XHRvbmVUcmFjay5zb3J0KChhLGIpID0+IGEudGltZSAtIGIudGltZSkuZm9yRWFjaChvbmVUckV2ZW50ID0+IHtcclxuXHRcdFx0bGV0IGV2ZW50ID0gb25lVHJFdmVudC5ldmVudDtcclxuXHRcdFx0bGV0IHR5cGUgPSBldmVudC50eXBlO1xyXG5cdFx0XHRsZXQgZXZlbnRUaW1lID0gb25lVHJFdmVudC50aW1lO1xyXG5cclxuXHRcdFx0aWYodHlwZSA9PT0gOSkge1xyXG5cdFx0XHRcdGxldCBub3RlID0gZXZlbnQuZGF0YVswXSAlIDEyO1xyXG5cdFx0XHRcdGlmKCFjdXJyTm90ZXMuaW5jbHVkZXMobm90ZSkpXHJcblx0XHRcdFx0XHRjdXJyTm90ZXMucHVzaChldmVudC5kYXRhWzBdICUgMTIpO1xyXG5cdFx0XHR9IGVsc2UgaWYodHlwZSA9PT0gOCkge1xyXG5cdFx0XHRcdGN1cnJOb3Rlcy5zcGxpY2UoY3Vyck5vdGVzLmluZGV4T2YoZXZlbnQuZGF0YVswXSAlIDEyKSwgMSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGN1cnJOb3Rlcy5sZW5ndGggIT0gMCkge1xyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coY3Vyck5vdGVzKTtcclxuXHRcdFx0XHRjaG9yZHNNYXAuc2V0KGV2ZW50VGltZSwgY3Vyck5vdGVzLnNsaWNlKCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQvL3Rlc3RcclxuXHJcblx0XHRjb25zb2xlLmxvZyhjaG9yZHNNYXApO1xyXG5cclxuXHRcdC8vIGxldCBhZGRlZENob3Jkc01hcCA9IHt9O1xyXG5cclxuXHRcdC8vIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhZGRlZENob3Jkc01hcCwgJ2hhc1ZhbHVlQXJyYXknLCB7XHJcblx0XHQvLyBcdGVudW1lcmFibGU6IGZhbHNlLFxyXG5cdFx0Ly8gXHR2YWx1ZTogZnVuY3Rpb24oYXJyYXkpIHtcclxuXHRcdC8vIFx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGhpcyk7XHJcblx0XHQvLyBcdFx0Y29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyh0aGlzKTtcclxuXHJcblx0XHQvLyBcdFx0Zm9yKGxldCBrZXkgb2Yga2V5cykge1xyXG5cdFx0Ly8gXHRcdFx0aWYoSlNPTi5zdHJpbmdpZnkodGhpc1trZXldLnNvcnQoKSkgPT09IEpTT04uc3RyaW5naWZ5KGFycmF5LnNvcnQoKSkpIHtcclxuXHRcdC8vIFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0aGlzW2tleV0uc29ydCgpKSArICcgICAnICsgSlNPTi5zdHJpbmdpZnkoYXJyYXkuc29ydCgpKSk7XHJcblx0XHQvLyBcdFx0XHRcdHJldHVybiBrZXk7XHJcblx0XHQvLyBcdFx0XHR9XHJcblx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcclxuXHRcdC8vIFx0XHRyZXR1cm4gLTE7XHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIH0pO1xyXG5cclxuXHRcdC8vIGxldCBwcmV2O1xyXG5cdFx0Ly8gbGV0IGV4aXN0aW5nQ2hvcmRLZXk7XHJcblx0XHQvLyBsZXQgbmJDaG9yZHMgPSAwO1xyXG5cdFx0Ly8gbGV0IG5iU2FtZUNob3JkcyA9IDA7XHJcblxyXG5cdFx0Ly8gLy9mb3IgZXZlcnkgZXZlbnQgdGltZSBpbiB0aGUgc29uZ1xyXG5cdFx0Ly8gZm9yKHZhciB0aW1lIGluIGNob3Jkc01hcCkge1xyXG5cdFx0Ly8gXHRuYkNob3JkcysrO1xyXG5cclxuXHRcdC8vIFx0Ly9pZiB0aGUgY2hvcmQgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCBmb3IgYW5vdGhlciB0aW1lLCBkb24ndCBjcmVhdGUgYSBuZXcgY2hvcmQgbWVzaFxyXG5cdFx0Ly8gXHQvL2lmKChleGlzdGluZ0Nob3JkS2V5ID0gYWRkZWRDaG9yZHNNYXAuaGFzVmFsdWVBcnJheShjaG9yZHNNYXBbdGltZV0pKSAhPSAtMSkge1xyXG5cdFx0Ly8gXHRcdC8vY29uc29sZS5sb2coZXhpc3RpbmdDaG9yZEtleSk7XHJcblx0XHQvLyBcdFx0Y2hvcmRzW3RpbWVdID0gY2hvcmRzW2V4aXN0aW5nQ2hvcmRLZXldO1xyXG5cdFx0Ly8gXHRcdG5iU2FtZUNob3JkcysrO1xyXG5cdFx0Ly8gXHQvL30gZWxzZSB7XHJcblx0XHQvLyBcdFx0bGV0IG5ld0Nob3JkID0gbmV3IENob3JkKGNob3Jkc01hcFt0aW1lXSk7XHJcblx0XHQvLyBcdFx0Ly9pZihwcmV2ID09IG51bGwgfHwgIXByZXYuZXF1YWxzKG5ld0Nob3JkKSlcclxuXHRcdC8vIFx0XHRjaG9yZHNbdGltZV0gPSBuZXdDaG9yZDtcclxuXHRcdC8vIFx0XHQvL2FkZGVkQ2hvcmRzTWFwW3RpbWVdID0gY2hvcmRzTWFwW3RpbWVdO1xyXG5cdFx0XHRcdFxyXG5cdFx0Ly8gXHRcdC8vcHJldiA9IG5ld0Nob3JkO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHRcdFxyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCduYkNob3JkcyA6ICcrbmJDaG9yZHMpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ25iU2FtZUNob3JkcyA6ICcrbmJTYW1lQ2hvcmRzKTtcclxuXHJcblxyXG5cdFx0dmFyIGtleXMgPSBBcnJheS5mcm9tKGNob3Jkc01hcC5rZXlzKCkpLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcclxuXHRcdGNyZWF0ZVNsaWRlcihrZXlzWzBdLCBrZXlzW2tleXMubGVuZ3RoLTFdKTtcclxuXHRcdC8vZHJhd0Nob3Jkcyhsb3dCb3VuZCwgdXBCb3VuZCk7XHJcblx0XHRcclxuXHR9IFxyXG5cclxuXHRyZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoZmlsZSk7IFxyXG59IiwiXHJcblxyXG5mdW5jdGlvbiB0ZXN0cHkoKSB7XHJcblx0dmFyIHJlc3VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHQnKSxcclxuICAgICAgICBzZW50X3R4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0eHQtaW5wdXQnKS52YWx1ZTtcclxuXHJcbiAgICB3cy5zZW5kKHNlbnRfdHh0KTtcclxuXHJcbiAgICB3cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICByZXN1bHQuaW5uZXJIVE1MID0gZXZlbnQuZGF0YTtcclxuXHJcbiAgICAgICAgLyp2YXIgbWVzc2FnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSxcclxuICAgICAgICAgICAgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyksXHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShldmVudC5kYXRhKTtcclxuICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICAgIG1lc3NhZ2VzLmFwcGVuZENoaWxkKG1lc3NhZ2UpOyovXHJcblxyXG4gICAgfTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdweXRob24tdGVzdCcpLmFwcGVuZENoaWxkKHJlc3VsdCk7XHJcbn0iLCIvKmZ1bmN0aW9uIG1pZGlUb1B5KCkge1xyXG5cdHZhciBpbnB1dEVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZmlsZS1pbnB1dCcpO1xyXG5cdHZhciBmaWxlID0gaW5wdXRFbGVtLmZpbGVzWzBdO1xyXG5cdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZ0KSB7XHJcblx0XHR3cy5zZW5kKGV2dC50YXJnZXQucmVzdWx0KTtcclxuXHR9XHJcblxyXG5cdHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG5cclxuXHJcbn1cclxuXHJcbndzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0Y29uc29sZS5sb2coJ3BhcnNpbmcganNvbi4uLicpO1xyXG5cdHZhciBpbnB1dENob3JkcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XHJcblx0Y29uc29sZS5sb2coJ2pzb24gcGFyc2VkJyk7XHJcblx0Y29uc29sZS5sb2coJ2NyZWF0aW5nIGNob3JkcycpO1xyXG5cdGZvcih2YXIgaUNob3JkIGluIGlucHV0Q2hvcmRzKSB7XHJcblx0XHR2YXIgY2hvcmQgPSBuZXcgQ2hvcmQoaW5wdXRDaG9yZHNbaUNob3JkXSk7XHJcblx0XHRjaG9yZHMucHVzaChjaG9yZCk7XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKCdjaG9yZHMgY3JlYXRlZCcpO1xyXG5cclxuXHRkcmF3Q2hvcmRzKDUsIDYpO1xyXG59Ki8iLCJmdW5jdGlvbiBjcmVhdGVTbGlkZXIoZnJvbSwgdG8pIHtcclxuXHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2xpZGVyJyk7XHJcblx0bGV0IGxvd0JvdW5kID0gZnJvbTtcclxuXHRsZXQgdXBCb3VuZCA9IHRvLzEwO1xyXG5cclxuXHRub1VpU2xpZGVyLmNyZWF0ZShzbGlkZXIsIHtcclxuXHRcdHN0YXJ0OiBbIDAsIDUwMCBdLFxyXG5cdFx0Y29ubmVjdDogdHJ1ZSxcclxuXHRcdHRvb2x0aXBzOiBbIHRydWUsIHRydWUgXSxcclxuXHRcdHJhbmdlOiB7XHJcblx0XHRcdCdtaW4nOiBmcm9tLFxyXG5cdFx0XHQnbWF4JzogdG9cclxuXHRcdH0sXHJcblx0XHRmb3JtYXQ6IHdOdW1iKHtcclxuXHRcdFx0ZGVjaW1hbHM6IDBcclxuXHRcdH0pXHJcblx0fSk7XHJcblxyXG5cdGRyYXdDaG9yZHMobG93Qm91bmQsIHVwQm91bmQpO1xyXG5cclxuXHRzbGlkZXIubm9VaVNsaWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24odmFsdWVzLCBoYW5kbGUpIHtcclxuXHRcdHZhciB2YWx1ZSA9IHZhbHVlc1toYW5kbGVdO1xyXG5cclxuXHRcdGlmKGhhbmRsZSA9PT0gMSkge1xyXG5cdFx0XHR1cEJvdW5kID0gcGFyc2VJbnQodmFsdWUpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bG93Qm91bmQgPSBwYXJzZUludCh2YWx1ZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGRyYXdDaG9yZHMobG93Qm91bmQsIHVwQm91bmQpO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0XHJcbn0iLCIvKiEgbm91aXNsaWRlciAtIDExLjEuMCAtIDIwMTgtMDQtMDIgMTE6MTg6MTMgKi9cclxuXHJcbiFmdW5jdGlvbihhKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLGEpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWEoKTp3aW5kb3cubm9VaVNsaWRlcj1hKCl9KGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYShhKXtyZXR1cm5cIm9iamVjdFwiPT10eXBlb2YgYSYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS50byYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS5mcm9tfWZ1bmN0aW9uIGIoYSl7YS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGEpfWZ1bmN0aW9uIGMoYSl7cmV0dXJuIG51bGwhPT1hJiZ2b2lkIDAhPT1hfWZ1bmN0aW9uIGQoYSl7YS5wcmV2ZW50RGVmYXVsdCgpfWZ1bmN0aW9uIGUoYSl7cmV0dXJuIGEuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiF0aGlzW2FdJiYodGhpc1thXT0hMCl9LHt9KX1mdW5jdGlvbiBmKGEsYil7cmV0dXJuIE1hdGgucm91bmQoYS9iKSpifWZ1bmN0aW9uIGcoYSxiKXt2YXIgYz1hLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLGQ9YS5vd25lckRvY3VtZW50LGU9ZC5kb2N1bWVudEVsZW1lbnQsZj1wKGQpO3JldHVybi93ZWJraXQuKkNocm9tZS4qTW9iaWxlL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSYmKGYueD0wKSxiP2MudG9wK2YueS1lLmNsaWVudFRvcDpjLmxlZnQrZi54LWUuY2xpZW50TGVmdH1mdW5jdGlvbiBoKGEpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiBhJiYhaXNOYU4oYSkmJmlzRmluaXRlKGEpfWZ1bmN0aW9uIGkoYSxiLGMpe2M+MCYmKG0oYSxiKSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bihhLGIpfSxjKSl9ZnVuY3Rpb24gaihhKXtyZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4oYSwxMDApLDApfWZ1bmN0aW9uIGsoYSl7cmV0dXJuIEFycmF5LmlzQXJyYXkoYSk/YTpbYV19ZnVuY3Rpb24gbChhKXthPVN0cmluZyhhKTt2YXIgYj1hLnNwbGl0KFwiLlwiKTtyZXR1cm4gYi5sZW5ndGg+MT9iWzFdLmxlbmd0aDowfWZ1bmN0aW9uIG0oYSxiKXthLmNsYXNzTGlzdD9hLmNsYXNzTGlzdC5hZGQoYik6YS5jbGFzc05hbWUrPVwiIFwiK2J9ZnVuY3Rpb24gbihhLGIpe2EuY2xhc3NMaXN0P2EuY2xhc3NMaXN0LnJlbW92ZShiKTphLmNsYXNzTmFtZT1hLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxcXFxcYilcIitiLnNwbGl0KFwiIFwiKS5qb2luKFwifFwiKStcIihcXFxcYnwkKVwiLFwiZ2lcIiksXCIgXCIpfWZ1bmN0aW9uIG8oYSxiKXtyZXR1cm4gYS5jbGFzc0xpc3Q/YS5jbGFzc0xpc3QuY29udGFpbnMoYik6bmV3IFJlZ0V4cChcIlxcXFxiXCIrYitcIlxcXFxiXCIpLnRlc3QoYS5jbGFzc05hbWUpfWZ1bmN0aW9uIHAoYSl7dmFyIGI9dm9pZCAwIT09d2luZG93LnBhZ2VYT2Zmc2V0LGM9XCJDU1MxQ29tcGF0XCI9PT0oYS5jb21wYXRNb2RlfHxcIlwiKTtyZXR1cm57eDpiP3dpbmRvdy5wYWdlWE9mZnNldDpjP2EuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ6YS5ib2R5LnNjcm9sbExlZnQseTpiP3dpbmRvdy5wYWdlWU9mZnNldDpjP2EuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDphLmJvZHkuc2Nyb2xsVG9wfX1mdW5jdGlvbiBxKCl7cmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQ/e3N0YXJ0OlwicG9pbnRlcmRvd25cIixtb3ZlOlwicG9pbnRlcm1vdmVcIixlbmQ6XCJwb2ludGVydXBcIn06d2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkP3tzdGFydDpcIk1TUG9pbnRlckRvd25cIixtb3ZlOlwiTVNQb2ludGVyTW92ZVwiLGVuZDpcIk1TUG9pbnRlclVwXCJ9OntzdGFydDpcIm1vdXNlZG93biB0b3VjaHN0YXJ0XCIsbW92ZTpcIm1vdXNlbW92ZSB0b3VjaG1vdmVcIixlbmQ6XCJtb3VzZXVwIHRvdWNoZW5kXCJ9fWZ1bmN0aW9uIHIoKXt2YXIgYT0hMTt0cnl7dmFyIGI9T2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LFwicGFzc2l2ZVwiLHtnZXQ6ZnVuY3Rpb24oKXthPSEwfX0pO3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidGVzdFwiLG51bGwsYil9Y2F0Y2goYSl7fXJldHVybiBhfWZ1bmN0aW9uIHMoKXtyZXR1cm4gd2luZG93LkNTUyYmQ1NTLnN1cHBvcnRzJiZDU1Muc3VwcG9ydHMoXCJ0b3VjaC1hY3Rpb25cIixcIm5vbmVcIil9ZnVuY3Rpb24gdChhLGIpe3JldHVybiAxMDAvKGItYSl9ZnVuY3Rpb24gdShhLGIpe3JldHVybiAxMDAqYi8oYVsxXS1hWzBdKX1mdW5jdGlvbiB2KGEsYil7cmV0dXJuIHUoYSxhWzBdPDA/YitNYXRoLmFicyhhWzBdKTpiLWFbMF0pfWZ1bmN0aW9uIHcoYSxiKXtyZXR1cm4gYiooYVsxXS1hWzBdKS8xMDArYVswXX1mdW5jdGlvbiB4KGEsYil7Zm9yKHZhciBjPTE7YT49YltjXTspYys9MTtyZXR1cm4gY31mdW5jdGlvbiB5KGEsYixjKXtpZihjPj1hLnNsaWNlKC0xKVswXSlyZXR1cm4gMTAwO3ZhciBkPXgoYyxhKSxlPWFbZC0xXSxmPWFbZF0sZz1iW2QtMV0saD1iW2RdO3JldHVybiBnK3YoW2UsZl0sYykvdChnLGgpfWZ1bmN0aW9uIHooYSxiLGMpe2lmKGM+PTEwMClyZXR1cm4gYS5zbGljZSgtMSlbMF07dmFyIGQ9eChjLGIpLGU9YVtkLTFdLGY9YVtkXSxnPWJbZC0xXTtyZXR1cm4gdyhbZSxmXSwoYy1nKSp0KGcsYltkXSkpfWZ1bmN0aW9uIEEoYSxiLGMsZCl7aWYoMTAwPT09ZClyZXR1cm4gZDt2YXIgZT14KGQsYSksZz1hW2UtMV0saD1hW2VdO3JldHVybiBjP2QtZz4oaC1nKS8yP2g6ZzpiW2UtMV0/YVtlLTFdK2YoZC1hW2UtMV0sYltlLTFdKTpkfWZ1bmN0aW9uIEIoYSxiLGMpe3ZhciBkO2lmKFwibnVtYmVyXCI9PXR5cGVvZiBiJiYoYj1bYl0pLCFBcnJheS5pc0FycmF5KGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncmFuZ2UnIGNvbnRhaW5zIGludmFsaWQgdmFsdWUuXCIpO2lmKGQ9XCJtaW5cIj09PWE/MDpcIm1heFwiPT09YT8xMDA6cGFyc2VGbG9hdChhKSwhaChkKXx8IWgoYlswXSkpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdyYW5nZScgdmFsdWUgaXNuJ3QgbnVtZXJpYy5cIik7Yy54UGN0LnB1c2goZCksYy54VmFsLnB1c2goYlswXSksZD9jLnhTdGVwcy5wdXNoKCFpc05hTihiWzFdKSYmYlsxXSk6aXNOYU4oYlsxXSl8fChjLnhTdGVwc1swXT1iWzFdKSxjLnhIaWdoZXN0Q29tcGxldGVTdGVwLnB1c2goMCl9ZnVuY3Rpb24gQyhhLGIsYyl7aWYoIWIpcmV0dXJuITA7Yy54U3RlcHNbYV09dShbYy54VmFsW2FdLGMueFZhbFthKzFdXSxiKS90KGMueFBjdFthXSxjLnhQY3RbYSsxXSk7dmFyIGQ9KGMueFZhbFthKzFdLWMueFZhbFthXSkvYy54TnVtU3RlcHNbYV0sZT1NYXRoLmNlaWwoTnVtYmVyKGQudG9GaXhlZCgzKSktMSksZj1jLnhWYWxbYV0rYy54TnVtU3RlcHNbYV0qZTtjLnhIaWdoZXN0Q29tcGxldGVTdGVwW2FdPWZ9ZnVuY3Rpb24gRChhLGIsYyl7dGhpcy54UGN0PVtdLHRoaXMueFZhbD1bXSx0aGlzLnhTdGVwcz1bY3x8ITFdLHRoaXMueE51bVN0ZXBzPVshMV0sdGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcD1bXSx0aGlzLnNuYXA9Yjt2YXIgZCxlPVtdO2ZvcihkIGluIGEpYS5oYXNPd25Qcm9wZXJ0eShkKSYmZS5wdXNoKFthW2RdLGRdKTtmb3IoZS5sZW5ndGgmJlwib2JqZWN0XCI9PXR5cGVvZiBlWzBdWzBdP2Uuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBhWzBdWzBdLWJbMF1bMF19KTplLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYVswXS1iWzBdfSksZD0wO2Q8ZS5sZW5ndGg7ZCsrKUIoZVtkXVsxXSxlW2RdWzBdLHRoaXMpO2Zvcih0aGlzLnhOdW1TdGVwcz10aGlzLnhTdGVwcy5zbGljZSgwKSxkPTA7ZDx0aGlzLnhOdW1TdGVwcy5sZW5ndGg7ZCsrKUMoZCx0aGlzLnhOdW1TdGVwc1tkXSx0aGlzKX1mdW5jdGlvbiBFKGIpe2lmKGEoYikpcmV0dXJuITA7dGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdmb3JtYXQnIHJlcXVpcmVzICd0bycgYW5kICdmcm9tJyBtZXRob2RzLlwiKX1mdW5jdGlvbiBGKGEsYil7aWYoIWgoYikpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdzdGVwJyBpcyBub3QgbnVtZXJpYy5cIik7YS5zaW5nbGVTdGVwPWJ9ZnVuY3Rpb24gRyhhLGIpe2lmKFwib2JqZWN0XCIhPXR5cGVvZiBifHxBcnJheS5pc0FycmF5KGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncmFuZ2UnIGlzIG5vdCBhbiBvYmplY3QuXCIpO2lmKHZvaWQgMD09PWIubWlufHx2b2lkIDA9PT1iLm1heCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogTWlzc2luZyAnbWluJyBvciAnbWF4JyBpbiAncmFuZ2UnLlwiKTtpZihiLm1pbj09PWIubWF4KXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncmFuZ2UnICdtaW4nIGFuZCAnbWF4JyBjYW5ub3QgYmUgZXF1YWwuXCIpO2Euc3BlY3RydW09bmV3IEQoYixhLnNuYXAsYS5zaW5nbGVTdGVwKX1mdW5jdGlvbiBIKGEsYil7aWYoYj1rKGIpLCFBcnJheS5pc0FycmF5KGIpfHwhYi5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdzdGFydCcgb3B0aW9uIGlzIGluY29ycmVjdC5cIik7YS5oYW5kbGVzPWIubGVuZ3RoLGEuc3RhcnQ9Yn1mdW5jdGlvbiBJKGEsYil7aWYoYS5zbmFwPWIsXCJib29sZWFuXCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnc25hcCcgb3B0aW9uIG11c3QgYmUgYSBib29sZWFuLlwiKX1mdW5jdGlvbiBKKGEsYil7aWYoYS5hbmltYXRlPWIsXCJib29sZWFuXCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnYW5pbWF0ZScgb3B0aW9uIG11c3QgYmUgYSBib29sZWFuLlwiKX1mdW5jdGlvbiBLKGEsYil7aWYoYS5hbmltYXRpb25EdXJhdGlvbj1iLFwibnVtYmVyXCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnYW5pbWF0aW9uRHVyYXRpb24nIG9wdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiKX1mdW5jdGlvbiBMKGEsYil7dmFyIGMsZD1bITFdO2lmKFwibG93ZXJcIj09PWI/Yj1bITAsITFdOlwidXBwZXJcIj09PWImJihiPVshMSwhMF0pLCEwPT09Ynx8ITE9PT1iKXtmb3IoYz0xO2M8YS5oYW5kbGVzO2MrKylkLnB1c2goYik7ZC5wdXNoKCExKX1lbHNle2lmKCFBcnJheS5pc0FycmF5KGIpfHwhYi5sZW5ndGh8fGIubGVuZ3RoIT09YS5oYW5kbGVzKzEpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdjb25uZWN0JyBvcHRpb24gZG9lc24ndCBtYXRjaCBoYW5kbGUgY291bnQuXCIpO2Q9Yn1hLmNvbm5lY3Q9ZH1mdW5jdGlvbiBNKGEsYil7c3dpdGNoKGIpe2Nhc2VcImhvcml6b250YWxcIjphLm9ydD0wO2JyZWFrO2Nhc2VcInZlcnRpY2FsXCI6YS5vcnQ9MTticmVhaztkZWZhdWx0OnRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnb3JpZW50YXRpb24nIG9wdGlvbiBpcyBpbnZhbGlkLlwiKX19ZnVuY3Rpb24gTihhLGIpe2lmKCFoKGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbWFyZ2luJyBvcHRpb24gbXVzdCBiZSBudW1lcmljLlwiKTtpZigwIT09YiYmKGEubWFyZ2luPWEuc3BlY3RydW0uZ2V0TWFyZ2luKGIpLCFhLm1hcmdpbikpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdtYXJnaW4nIG9wdGlvbiBpcyBvbmx5IHN1cHBvcnRlZCBvbiBsaW5lYXIgc2xpZGVycy5cIil9ZnVuY3Rpb24gTyhhLGIpe2lmKCFoKGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbGltaXQnIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMuXCIpO2lmKGEubGltaXQ9YS5zcGVjdHJ1bS5nZXRNYXJnaW4oYiksIWEubGltaXR8fGEuaGFuZGxlczwyKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbGltaXQnIG9wdGlvbiBpcyBvbmx5IHN1cHBvcnRlZCBvbiBsaW5lYXIgc2xpZGVycyB3aXRoIDIgb3IgbW9yZSBoYW5kbGVzLlwiKX1mdW5jdGlvbiBQKGEsYil7aWYoIWgoYikmJiFBcnJheS5pc0FycmF5KGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncGFkZGluZycgb3B0aW9uIG11c3QgYmUgbnVtZXJpYyBvciBhcnJheSBvZiBleGFjdGx5IDIgbnVtYmVycy5cIik7aWYoQXJyYXkuaXNBcnJheShiKSYmMiE9PWIubGVuZ3RoJiYhaChiWzBdKSYmIWgoYlsxXSkpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdwYWRkaW5nJyBvcHRpb24gbXVzdCBiZSBudW1lcmljIG9yIGFycmF5IG9mIGV4YWN0bHkgMiBudW1iZXJzLlwiKTtpZigwIT09Yil7aWYoQXJyYXkuaXNBcnJheShiKXx8KGI9W2IsYl0pLGEucGFkZGluZz1bYS5zcGVjdHJ1bS5nZXRNYXJnaW4oYlswXSksYS5zcGVjdHJ1bS5nZXRNYXJnaW4oYlsxXSldLCExPT09YS5wYWRkaW5nWzBdfHwhMT09PWEucGFkZGluZ1sxXSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3BhZGRpbmcnIG9wdGlvbiBpcyBvbmx5IHN1cHBvcnRlZCBvbiBsaW5lYXIgc2xpZGVycy5cIik7aWYoYS5wYWRkaW5nWzBdPDB8fGEucGFkZGluZ1sxXTwwKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncGFkZGluZycgb3B0aW9uIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXIocykuXCIpO2lmKGEucGFkZGluZ1swXSthLnBhZGRpbmdbMV0+PTEwMCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IG5vdCBleGNlZWQgMTAwJSBvZiB0aGUgcmFuZ2UuXCIpfX1mdW5jdGlvbiBRKGEsYil7c3dpdGNoKGIpe2Nhc2VcImx0clwiOmEuZGlyPTA7YnJlYWs7Y2FzZVwicnRsXCI6YS5kaXI9MTticmVhaztkZWZhdWx0OnRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnZGlyZWN0aW9uJyBvcHRpb24gd2FzIG5vdCByZWNvZ25pemVkLlwiKX19ZnVuY3Rpb24gUihhLGIpe2lmKFwic3RyaW5nXCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnYmVoYXZpb3VyJyBtdXN0IGJlIGEgc3RyaW5nIGNvbnRhaW5pbmcgb3B0aW9ucy5cIik7dmFyIGM9Yi5pbmRleE9mKFwidGFwXCIpPj0wLGQ9Yi5pbmRleE9mKFwiZHJhZ1wiKT49MCxlPWIuaW5kZXhPZihcImZpeGVkXCIpPj0wLGY9Yi5pbmRleE9mKFwic25hcFwiKT49MCxnPWIuaW5kZXhPZihcImhvdmVyXCIpPj0wO2lmKGUpe2lmKDIhPT1hLmhhbmRsZXMpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdmaXhlZCcgYmVoYXZpb3VyIG11c3QgYmUgdXNlZCB3aXRoIDIgaGFuZGxlc1wiKTtOKGEsYS5zdGFydFsxXS1hLnN0YXJ0WzBdKX1hLmV2ZW50cz17dGFwOmN8fGYsZHJhZzpkLGZpeGVkOmUsc25hcDpmLGhvdmVyOmd9fWZ1bmN0aW9uIFMoYSxiKXtpZighMSE9PWIpaWYoITA9PT1iKXthLnRvb2x0aXBzPVtdO2Zvcih2YXIgYz0wO2M8YS5oYW5kbGVzO2MrKylhLnRvb2x0aXBzLnB1c2goITApfWVsc2V7aWYoYS50b29sdGlwcz1rKGIpLGEudG9vbHRpcHMubGVuZ3RoIT09YS5oYW5kbGVzKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiBtdXN0IHBhc3MgYSBmb3JtYXR0ZXIgZm9yIGFsbCBoYW5kbGVzLlwiKTthLnRvb2x0aXBzLmZvckVhY2goZnVuY3Rpb24oYSl7aWYoXCJib29sZWFuXCIhPXR5cGVvZiBhJiYoXCJvYmplY3RcIiE9dHlwZW9mIGF8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIGEudG8pKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAndG9vbHRpcHMnIG11c3QgYmUgcGFzc2VkIGEgZm9ybWF0dGVyIG9yICdmYWxzZScuXCIpfSl9fWZ1bmN0aW9uIFQoYSxiKXthLmFyaWFGb3JtYXQ9YixFKGIpfWZ1bmN0aW9uIFUoYSxiKXthLmZvcm1hdD1iLEUoYil9ZnVuY3Rpb24gVihhLGIpe2lmKFwic3RyaW5nXCIhPXR5cGVvZiBiJiYhMSE9PWIpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdjc3NQcmVmaXgnIG11c3QgYmUgYSBzdHJpbmcgb3IgYGZhbHNlYC5cIik7YS5jc3NQcmVmaXg9Yn1mdW5jdGlvbiBXKGEsYil7aWYoXCJvYmplY3RcIiE9dHlwZW9mIGIpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdjc3NDbGFzc2VzJyBtdXN0IGJlIGFuIG9iamVjdC5cIik7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGEuY3NzUHJlZml4KXthLmNzc0NsYXNzZXM9e307Zm9yKHZhciBjIGluIGIpYi5oYXNPd25Qcm9wZXJ0eShjKSYmKGEuY3NzQ2xhc3Nlc1tjXT1hLmNzc1ByZWZpeCtiW2NdKX1lbHNlIGEuY3NzQ2xhc3Nlcz1ifWZ1bmN0aW9uIFgoYSl7dmFyIGI9e21hcmdpbjowLGxpbWl0OjAscGFkZGluZzowLGFuaW1hdGU6ITAsYW5pbWF0aW9uRHVyYXRpb246MzAwLGFyaWFGb3JtYXQ6Xyxmb3JtYXQ6X30sZD17c3RlcDp7cjohMSx0OkZ9LHN0YXJ0OntyOiEwLHQ6SH0sY29ubmVjdDp7cjohMCx0Okx9LGRpcmVjdGlvbjp7cjohMCx0OlF9LHNuYXA6e3I6ITEsdDpJfSxhbmltYXRlOntyOiExLHQ6Sn0sYW5pbWF0aW9uRHVyYXRpb246e3I6ITEsdDpLfSxyYW5nZTp7cjohMCx0Okd9LG9yaWVudGF0aW9uOntyOiExLHQ6TX0sbWFyZ2luOntyOiExLHQ6Tn0sbGltaXQ6e3I6ITEsdDpPfSxwYWRkaW5nOntyOiExLHQ6UH0sYmVoYXZpb3VyOntyOiEwLHQ6Un0sYXJpYUZvcm1hdDp7cjohMSx0OlR9LGZvcm1hdDp7cjohMSx0OlV9LHRvb2x0aXBzOntyOiExLHQ6U30sY3NzUHJlZml4OntyOiEwLHQ6Vn0sY3NzQ2xhc3Nlczp7cjohMCx0Old9fSxlPXtjb25uZWN0OiExLGRpcmVjdGlvbjpcImx0clwiLGJlaGF2aW91cjpcInRhcFwiLG9yaWVudGF0aW9uOlwiaG9yaXpvbnRhbFwiLGNzc1ByZWZpeDpcIm5vVWktXCIsY3NzQ2xhc3Nlczp7dGFyZ2V0OlwidGFyZ2V0XCIsYmFzZTpcImJhc2VcIixvcmlnaW46XCJvcmlnaW5cIixoYW5kbGU6XCJoYW5kbGVcIixoYW5kbGVMb3dlcjpcImhhbmRsZS1sb3dlclwiLGhhbmRsZVVwcGVyOlwiaGFuZGxlLXVwcGVyXCIsaG9yaXpvbnRhbDpcImhvcml6b250YWxcIix2ZXJ0aWNhbDpcInZlcnRpY2FsXCIsYmFja2dyb3VuZDpcImJhY2tncm91bmRcIixjb25uZWN0OlwiY29ubmVjdFwiLGNvbm5lY3RzOlwiY29ubmVjdHNcIixsdHI6XCJsdHJcIixydGw6XCJydGxcIixkcmFnZ2FibGU6XCJkcmFnZ2FibGVcIixkcmFnOlwic3RhdGUtZHJhZ1wiLHRhcDpcInN0YXRlLXRhcFwiLGFjdGl2ZTpcImFjdGl2ZVwiLHRvb2x0aXA6XCJ0b29sdGlwXCIscGlwczpcInBpcHNcIixwaXBzSG9yaXpvbnRhbDpcInBpcHMtaG9yaXpvbnRhbFwiLHBpcHNWZXJ0aWNhbDpcInBpcHMtdmVydGljYWxcIixtYXJrZXI6XCJtYXJrZXJcIixtYXJrZXJIb3Jpem9udGFsOlwibWFya2VyLWhvcml6b250YWxcIixtYXJrZXJWZXJ0aWNhbDpcIm1hcmtlci12ZXJ0aWNhbFwiLG1hcmtlck5vcm1hbDpcIm1hcmtlci1ub3JtYWxcIixtYXJrZXJMYXJnZTpcIm1hcmtlci1sYXJnZVwiLG1hcmtlclN1YjpcIm1hcmtlci1zdWJcIix2YWx1ZTpcInZhbHVlXCIsdmFsdWVIb3Jpem9udGFsOlwidmFsdWUtaG9yaXpvbnRhbFwiLHZhbHVlVmVydGljYWw6XCJ2YWx1ZS12ZXJ0aWNhbFwiLHZhbHVlTm9ybWFsOlwidmFsdWUtbm9ybWFsXCIsdmFsdWVMYXJnZTpcInZhbHVlLWxhcmdlXCIsdmFsdWVTdWI6XCJ2YWx1ZS1zdWJcIn19O2EuZm9ybWF0JiYhYS5hcmlhRm9ybWF0JiYoYS5hcmlhRm9ybWF0PWEuZm9ybWF0KSxPYmplY3Qua2V5cyhkKS5mb3JFYWNoKGZ1bmN0aW9uKGYpe2lmKCFjKGFbZl0pJiZ2b2lkIDA9PT1lW2ZdKXtpZihkW2ZdLnIpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdcIitmK1wiJyBpcyByZXF1aXJlZC5cIik7cmV0dXJuITB9ZFtmXS50KGIsYyhhW2ZdKT9hW2ZdOmVbZl0pfSksYi5waXBzPWEucGlwczt2YXIgZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGc9dm9pZCAwIT09Zi5zdHlsZS5tc1RyYW5zZm9ybSxoPXZvaWQgMCE9PWYuc3R5bGUudHJhbnNmb3JtO2IudHJhbnNmb3JtUnVsZT1oP1widHJhbnNmb3JtXCI6Zz9cIm1zVHJhbnNmb3JtXCI6XCJ3ZWJraXRUcmFuc2Zvcm1cIjt2YXIgaT1bW1wibGVmdFwiLFwidG9wXCJdLFtcInJpZ2h0XCIsXCJib3R0b21cIl1dO3JldHVybiBiLnN0eWxlPWlbYi5kaXJdW2Iub3J0XSxifWZ1bmN0aW9uIFkoYSxjLGYpe2Z1bmN0aW9uIGgoYSxiKXt2YXIgYz15YS5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3JldHVybiBiJiZtKGMsYiksYS5hcHBlbmRDaGlsZChjKSxjfWZ1bmN0aW9uIGwoYSxiKXt2YXIgZD1oKGEsYy5jc3NDbGFzc2VzLm9yaWdpbiksZT1oKGQsYy5jc3NDbGFzc2VzLmhhbmRsZSk7cmV0dXJuIGUuc2V0QXR0cmlidXRlKFwiZGF0YS1oYW5kbGVcIixiKSxlLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsXCIwXCIpLGUuc2V0QXR0cmlidXRlKFwicm9sZVwiLFwic2xpZGVyXCIpLGUuc2V0QXR0cmlidXRlKFwiYXJpYS1vcmllbnRhdGlvblwiLGMub3J0P1widmVydGljYWxcIjpcImhvcml6b250YWxcIiksMD09PWI/bShlLGMuY3NzQ2xhc3Nlcy5oYW5kbGVMb3dlcik6Yj09PWMuaGFuZGxlcy0xJiZtKGUsYy5jc3NDbGFzc2VzLmhhbmRsZVVwcGVyKSxkfWZ1bmN0aW9uIHQoYSxiKXtyZXR1cm4hIWImJmgoYSxjLmNzc0NsYXNzZXMuY29ubmVjdCl9ZnVuY3Rpb24gdShhLGIpe3ZhciBkPWgoYixjLmNzc0NsYXNzZXMuY29ubmVjdHMpO2thPVtdLGxhPVtdLGxhLnB1c2godChkLGFbMF0pKTtmb3IodmFyIGU9MDtlPGMuaGFuZGxlcztlKyspa2EucHVzaChsKGIsZSkpLHRhW2VdPWUsbGEucHVzaCh0KGQsYVtlKzFdKSl9ZnVuY3Rpb24gdihhKXttKGEsYy5jc3NDbGFzc2VzLnRhcmdldCksMD09PWMuZGlyP20oYSxjLmNzc0NsYXNzZXMubHRyKTptKGEsYy5jc3NDbGFzc2VzLnJ0bCksMD09PWMub3J0P20oYSxjLmNzc0NsYXNzZXMuaG9yaXpvbnRhbCk6bShhLGMuY3NzQ2xhc3Nlcy52ZXJ0aWNhbCksamE9aChhLGMuY3NzQ2xhc3Nlcy5iYXNlKX1mdW5jdGlvbiB3KGEsYil7cmV0dXJuISFjLnRvb2x0aXBzW2JdJiZoKGEuZmlyc3RDaGlsZCxjLmNzc0NsYXNzZXMudG9vbHRpcCl9ZnVuY3Rpb24geCgpe3ZhciBhPWthLm1hcCh3KTtRKFwidXBkYXRlXCIsZnVuY3Rpb24oYixkLGUpe2lmKGFbZF0pe3ZhciBmPWJbZF07ITAhPT1jLnRvb2x0aXBzW2RdJiYoZj1jLnRvb2x0aXBzW2RdLnRvKGVbZF0pKSxhW2RdLmlubmVySFRNTD1mfX0pfWZ1bmN0aW9uIHkoKXtRKFwidXBkYXRlXCIsZnVuY3Rpb24oYSxiLGQsZSxmKXt0YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3ZhciBiPWthW2FdLGU9VShzYSxhLDAsITAsITAsITApLGc9VShzYSxhLDEwMCwhMCwhMCwhMCksaD1mW2FdLGk9Yy5hcmlhRm9ybWF0LnRvKGRbYV0pO2IuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW1pblwiLGUudG9GaXhlZCgxKSksYi5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbWF4XCIsZy50b0ZpeGVkKDEpKSxiLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWVub3dcIixoLnRvRml4ZWQoMSkpLGIuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZXRleHRcIixpKX0pfSl9ZnVuY3Rpb24geihhLGIsYyl7aWYoXCJyYW5nZVwiPT09YXx8XCJzdGVwc1wiPT09YSlyZXR1cm4gdmEueFZhbDtpZihcImNvdW50XCI9PT1hKXtpZihiPDIpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICd2YWx1ZXMnICg+PSAyKSByZXF1aXJlZCBmb3IgbW9kZSAnY291bnQnLlwiKTt2YXIgZD1iLTEsZT0xMDAvZDtmb3IoYj1bXTtkLS07KWJbZF09ZCplO2IucHVzaCgxMDApLGE9XCJwb3NpdGlvbnNcIn1yZXR1cm5cInBvc2l0aW9uc1wiPT09YT9iLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gdmEuZnJvbVN0ZXBwaW5nKGM/dmEuZ2V0U3RlcChhKTphKX0pOlwidmFsdWVzXCI9PT1hP2M/Yi5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIHZhLmZyb21TdGVwcGluZyh2YS5nZXRTdGVwKHZhLnRvU3RlcHBpbmcoYSkpKX0pOmI6dm9pZCAwfWZ1bmN0aW9uIEEoYSxiLGMpe2Z1bmN0aW9uIGQoYSxiKXtyZXR1cm4oYStiKS50b0ZpeGVkKDcpLzF9dmFyIGY9e30sZz12YS54VmFsWzBdLGg9dmEueFZhbFt2YS54VmFsLmxlbmd0aC0xXSxpPSExLGo9ITEsaz0wO3JldHVybiBjPWUoYy5zbGljZSgpLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS1ifSkpLGNbMF0hPT1nJiYoYy51bnNoaWZ0KGcpLGk9ITApLGNbYy5sZW5ndGgtMV0hPT1oJiYoYy5wdXNoKGgpLGo9ITApLGMuZm9yRWFjaChmdW5jdGlvbihlLGcpe3ZhciBoLGwsbSxuLG8scCxxLHIscyx0LHU9ZSx2PWNbZysxXTtpZihcInN0ZXBzXCI9PT1iJiYoaD12YS54TnVtU3RlcHNbZ10pLGh8fChoPXYtdSksITEhPT11JiZ2b2lkIDAhPT12KWZvcihoPU1hdGgubWF4KGgsMWUtNyksbD11O2w8PXY7bD1kKGwsaCkpe2ZvcihuPXZhLnRvU3RlcHBpbmcobCksbz1uLWsscj1vL2Escz1NYXRoLnJvdW5kKHIpLHQ9by9zLG09MTttPD1zO20rPTEpcD1rK20qdCxmW3AudG9GaXhlZCg1KV09W1wieFwiLDBdO3E9Yy5pbmRleE9mKGwpPi0xPzE6XCJzdGVwc1wiPT09Yj8yOjAsIWcmJmkmJihxPTApLGw9PT12JiZqfHwoZltuLnRvRml4ZWQoNSldPVtsLHFdKSxrPW59fSksZn1mdW5jdGlvbiBCKGEsYixkKXtmdW5jdGlvbiBlKGEsYil7dmFyIGQ9Yj09PWMuY3NzQ2xhc3Nlcy52YWx1ZSxlPWQ/azpsLGY9ZD9pOmo7cmV0dXJuIGIrXCIgXCIrZVtjLm9ydF0rXCIgXCIrZlthXX1mdW5jdGlvbiBmKGEsZil7ZlsxXT1mWzFdJiZiP2IoZlswXSxmWzFdKTpmWzFdO3ZhciBpPWgoZywhMSk7aS5jbGFzc05hbWU9ZShmWzFdLGMuY3NzQ2xhc3Nlcy5tYXJrZXIpLGkuc3R5bGVbYy5zdHlsZV09YStcIiVcIixmWzFdJiYoaT1oKGcsITEpLGkuY2xhc3NOYW1lPWUoZlsxXSxjLmNzc0NsYXNzZXMudmFsdWUpLGkuc2V0QXR0cmlidXRlKFwiZGF0YS12YWx1ZVwiLGZbMF0pLGkuc3R5bGVbYy5zdHlsZV09YStcIiVcIixpLmlubmVyVGV4dD1kLnRvKGZbMF0pKX12YXIgZz15YS5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGk9W2MuY3NzQ2xhc3Nlcy52YWx1ZU5vcm1hbCxjLmNzc0NsYXNzZXMudmFsdWVMYXJnZSxjLmNzc0NsYXNzZXMudmFsdWVTdWJdLGo9W2MuY3NzQ2xhc3Nlcy5tYXJrZXJOb3JtYWwsYy5jc3NDbGFzc2VzLm1hcmtlckxhcmdlLGMuY3NzQ2xhc3Nlcy5tYXJrZXJTdWJdLGs9W2MuY3NzQ2xhc3Nlcy52YWx1ZUhvcml6b250YWwsYy5jc3NDbGFzc2VzLnZhbHVlVmVydGljYWxdLGw9W2MuY3NzQ2xhc3Nlcy5tYXJrZXJIb3Jpem9udGFsLGMuY3NzQ2xhc3Nlcy5tYXJrZXJWZXJ0aWNhbF07cmV0dXJuIG0oZyxjLmNzc0NsYXNzZXMucGlwcyksbShnLDA9PT1jLm9ydD9jLmNzc0NsYXNzZXMucGlwc0hvcml6b250YWw6Yy5jc3NDbGFzc2VzLnBpcHNWZXJ0aWNhbCksT2JqZWN0LmtleXMoYSkuZm9yRWFjaChmdW5jdGlvbihiKXtmKGIsYVtiXSl9KSxnfWZ1bmN0aW9uIEMoKXtuYSYmKGIobmEpLG5hPW51bGwpfWZ1bmN0aW9uIEQoYSl7QygpO3ZhciBiPWEubW9kZSxjPWEuZGVuc2l0eXx8MSxkPWEuZmlsdGVyfHwhMSxlPWEudmFsdWVzfHwhMSxmPWEuc3RlcHBlZHx8ITEsZz16KGIsZSxmKSxoPUEoYyxiLGcpLGk9YS5mb3JtYXR8fHt0bzpNYXRoLnJvdW5kfTtyZXR1cm4gbmE9cmEuYXBwZW5kQ2hpbGQoQihoLGQsaSkpfWZ1bmN0aW9uIEUoKXt2YXIgYT1qYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxiPVwib2Zmc2V0XCIrW1wiV2lkdGhcIixcIkhlaWdodFwiXVtjLm9ydF07cmV0dXJuIDA9PT1jLm9ydD9hLndpZHRofHxqYVtiXTphLmhlaWdodHx8amFbYl19ZnVuY3Rpb24gRihhLGIsZCxlKXt2YXIgZj1mdW5jdGlvbihmKXtyZXR1cm4hIShmPUcoZixlLnBhZ2VPZmZzZXQsZS50YXJnZXR8fGIpKSYmKCEocmEuaGFzQXR0cmlidXRlKFwiZGlzYWJsZWRcIikmJiFlLmRvTm90UmVqZWN0KSYmKCEobyhyYSxjLmNzc0NsYXNzZXMudGFwKSYmIWUuZG9Ob3RSZWplY3QpJiYoIShhPT09b2Euc3RhcnQmJnZvaWQgMCE9PWYuYnV0dG9ucyYmZi5idXR0b25zPjEpJiYoKCFlLmhvdmVyfHwhZi5idXR0b25zKSYmKHFhfHxmLnByZXZlbnREZWZhdWx0KCksZi5jYWxjUG9pbnQ9Zi5wb2ludHNbYy5vcnRdLHZvaWQgZChmLGUpKSkpKSl9LGc9W107cmV0dXJuIGEuc3BsaXQoXCIgXCIpLmZvckVhY2goZnVuY3Rpb24oYSl7Yi5hZGRFdmVudExpc3RlbmVyKGEsZiwhIXFhJiZ7cGFzc2l2ZTohMH0pLGcucHVzaChbYSxmXSl9KSxnfWZ1bmN0aW9uIEcoYSxiLGMpe3ZhciBkLGUsZj0wPT09YS50eXBlLmluZGV4T2YoXCJ0b3VjaFwiKSxnPTA9PT1hLnR5cGUuaW5kZXhPZihcIm1vdXNlXCIpLGg9MD09PWEudHlwZS5pbmRleE9mKFwicG9pbnRlclwiKTtpZigwPT09YS50eXBlLmluZGV4T2YoXCJNU1BvaW50ZXJcIikmJihoPSEwKSxmKXt2YXIgaT1mdW5jdGlvbihhKXtyZXR1cm4gYS50YXJnZXQ9PT1jfHxjLmNvbnRhaW5zKGEudGFyZ2V0KX07aWYoXCJ0b3VjaHN0YXJ0XCI9PT1hLnR5cGUpe3ZhciBqPUFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChhLnRvdWNoZXMsaSk7aWYoai5sZW5ndGg+MSlyZXR1cm4hMTtkPWpbMF0ucGFnZVgsZT1qWzBdLnBhZ2VZfWVsc2V7dmFyIGs9QXJyYXkucHJvdG90eXBlLmZpbmQuY2FsbChhLmNoYW5nZWRUb3VjaGVzLGkpO2lmKCFrKXJldHVybiExO2Q9ay5wYWdlWCxlPWsucGFnZVl9fXJldHVybiBiPWJ8fHAoeWEpLChnfHxoKSYmKGQ9YS5jbGllbnRYK2IueCxlPWEuY2xpZW50WStiLnkpLGEucGFnZU9mZnNldD1iLGEucG9pbnRzPVtkLGVdLGEuY3Vyc29yPWd8fGgsYX1mdW5jdGlvbiBIKGEpe3ZhciBiPWEtZyhqYSxjLm9ydCksZD0xMDAqYi9FKCk7cmV0dXJuIGQ9aihkKSxjLmRpcj8xMDAtZDpkfWZ1bmN0aW9uIEkoYSl7dmFyIGI9MTAwLGM9ITE7cmV0dXJuIGthLmZvckVhY2goZnVuY3Rpb24oZCxlKXtpZighZC5oYXNBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKSl7dmFyIGY9TWF0aC5hYnMoc2FbZV0tYSk7KGY8Ynx8MTAwPT09ZiYmMTAwPT09YikmJihjPWUsYj1mKX19KSxjfWZ1bmN0aW9uIEooYSxiKXtcIm1vdXNlb3V0XCI9PT1hLnR5cGUmJlwiSFRNTFwiPT09YS50YXJnZXQubm9kZU5hbWUmJm51bGw9PT1hLnJlbGF0ZWRUYXJnZXQmJkwoYSxiKX1mdW5jdGlvbiBLKGEsYil7aWYoLTE9PT1uYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiTVNJRSA5XCIpJiYwPT09YS5idXR0b25zJiYwIT09Yi5idXR0b25zUHJvcGVydHkpcmV0dXJuIEwoYSxiKTt2YXIgZD0oYy5kaXI/LTE6MSkqKGEuY2FsY1BvaW50LWIuc3RhcnRDYWxjUG9pbnQpO1coZD4wLDEwMCpkL2IuYmFzZVNpemUsYi5sb2NhdGlvbnMsYi5oYW5kbGVOdW1iZXJzKX1mdW5jdGlvbiBMKGEsYil7Yi5oYW5kbGUmJihuKGIuaGFuZGxlLGMuY3NzQ2xhc3Nlcy5hY3RpdmUpLHVhLT0xKSxiLmxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGEpe3phLnJlbW92ZUV2ZW50TGlzdGVuZXIoYVswXSxhWzFdKX0pLDA9PT11YSYmKG4ocmEsYy5jc3NDbGFzc2VzLmRyYWcpLF8oKSxhLmN1cnNvciYmKEFhLnN0eWxlLmN1cnNvcj1cIlwiLEFhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzZWxlY3RzdGFydFwiLGQpKSksYi5oYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24oYSl7UyhcImNoYW5nZVwiLGEpLFMoXCJzZXRcIixhKSxTKFwiZW5kXCIsYSl9KX1mdW5jdGlvbiBNKGEsYil7dmFyIGU7aWYoMT09PWIuaGFuZGxlTnVtYmVycy5sZW5ndGgpe3ZhciBmPWthW2IuaGFuZGxlTnVtYmVyc1swXV07aWYoZi5oYXNBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKSlyZXR1cm4hMTtlPWYuY2hpbGRyZW5bMF0sdWErPTEsbShlLGMuY3NzQ2xhc3Nlcy5hY3RpdmUpfWEuc3RvcFByb3BhZ2F0aW9uKCk7dmFyIGc9W10saD1GKG9hLm1vdmUsemEsSyx7dGFyZ2V0OmEudGFyZ2V0LGhhbmRsZTplLGxpc3RlbmVyczpnLHN0YXJ0Q2FsY1BvaW50OmEuY2FsY1BvaW50LGJhc2VTaXplOkUoKSxwYWdlT2Zmc2V0OmEucGFnZU9mZnNldCxoYW5kbGVOdW1iZXJzOmIuaGFuZGxlTnVtYmVycyxidXR0b25zUHJvcGVydHk6YS5idXR0b25zLGxvY2F0aW9uczpzYS5zbGljZSgpfSksaT1GKG9hLmVuZCx6YSxMLHt0YXJnZXQ6YS50YXJnZXQsaGFuZGxlOmUsbGlzdGVuZXJzOmcsZG9Ob3RSZWplY3Q6ITAsaGFuZGxlTnVtYmVyczpiLmhhbmRsZU51bWJlcnN9KSxqPUYoXCJtb3VzZW91dFwiLHphLEose3RhcmdldDphLnRhcmdldCxoYW5kbGU6ZSxsaXN0ZW5lcnM6Zyxkb05vdFJlamVjdDohMCxoYW5kbGVOdW1iZXJzOmIuaGFuZGxlTnVtYmVyc30pO2cucHVzaC5hcHBseShnLGguY29uY2F0KGksaikpLGEuY3Vyc29yJiYoQWEuc3R5bGUuY3Vyc29yPWdldENvbXB1dGVkU3R5bGUoYS50YXJnZXQpLmN1cnNvcixrYS5sZW5ndGg+MSYmbShyYSxjLmNzc0NsYXNzZXMuZHJhZyksQWEuYWRkRXZlbnRMaXN0ZW5lcihcInNlbGVjdHN0YXJ0XCIsZCwhMSkpLGIuaGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uKGEpe1MoXCJzdGFydFwiLGEpfSl9ZnVuY3Rpb24gTihhKXthLnN0b3BQcm9wYWdhdGlvbigpO3ZhciBiPUgoYS5jYWxjUG9pbnQpLGQ9SShiKTtpZighMT09PWQpcmV0dXJuITE7Yy5ldmVudHMuc25hcHx8aShyYSxjLmNzc0NsYXNzZXMudGFwLGMuYW5pbWF0aW9uRHVyYXRpb24pLGFhKGQsYiwhMCwhMCksXygpLFMoXCJzbGlkZVwiLGQsITApLFMoXCJ1cGRhdGVcIixkLCEwKSxTKFwiY2hhbmdlXCIsZCwhMCksUyhcInNldFwiLGQsITApLGMuZXZlbnRzLnNuYXAmJk0oYSx7aGFuZGxlTnVtYmVyczpbZF19KX1mdW5jdGlvbiBPKGEpe3ZhciBiPUgoYS5jYWxjUG9pbnQpLGM9dmEuZ2V0U3RlcChiKSxkPXZhLmZyb21TdGVwcGluZyhjKTtPYmplY3Qua2V5cyh4YSkuZm9yRWFjaChmdW5jdGlvbihhKXtcImhvdmVyXCI9PT1hLnNwbGl0KFwiLlwiKVswXSYmeGFbYV0uZm9yRWFjaChmdW5jdGlvbihhKXthLmNhbGwobWEsZCl9KX0pfWZ1bmN0aW9uIFAoYSl7YS5maXhlZHx8a2EuZm9yRWFjaChmdW5jdGlvbihhLGIpe0Yob2Euc3RhcnQsYS5jaGlsZHJlblswXSxNLHtoYW5kbGVOdW1iZXJzOltiXX0pfSksYS50YXAmJkYob2Euc3RhcnQsamEsTix7fSksYS5ob3ZlciYmRihvYS5tb3ZlLGphLE8se2hvdmVyOiEwfSksYS5kcmFnJiZsYS5mb3JFYWNoKGZ1bmN0aW9uKGIsZCl7aWYoITEhPT1iJiYwIT09ZCYmZCE9PWxhLmxlbmd0aC0xKXt2YXIgZT1rYVtkLTFdLGY9a2FbZF0sZz1bYl07bShiLGMuY3NzQ2xhc3Nlcy5kcmFnZ2FibGUpLGEuZml4ZWQmJihnLnB1c2goZS5jaGlsZHJlblswXSksZy5wdXNoKGYuY2hpbGRyZW5bMF0pKSxnLmZvckVhY2goZnVuY3Rpb24oYSl7RihvYS5zdGFydCxhLE0se2hhbmRsZXM6W2UsZl0saGFuZGxlTnVtYmVyczpbZC0xLGRdfSl9KX19KX1mdW5jdGlvbiBRKGEsYil7eGFbYV09eGFbYV18fFtdLHhhW2FdLnB1c2goYiksXCJ1cGRhdGVcIj09PWEuc3BsaXQoXCIuXCIpWzBdJiZrYS5mb3JFYWNoKGZ1bmN0aW9uKGEsYil7UyhcInVwZGF0ZVwiLGIpfSl9ZnVuY3Rpb24gUihhKXt2YXIgYj1hJiZhLnNwbGl0KFwiLlwiKVswXSxjPWImJmEuc3Vic3RyaW5nKGIubGVuZ3RoKTtPYmplY3Qua2V5cyh4YSkuZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgZD1hLnNwbGl0KFwiLlwiKVswXSxlPWEuc3Vic3RyaW5nKGQubGVuZ3RoKTtiJiZiIT09ZHx8YyYmYyE9PWV8fGRlbGV0ZSB4YVthXX0pfWZ1bmN0aW9uIFMoYSxiLGQpe09iamVjdC5rZXlzKHhhKS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciBmPWUuc3BsaXQoXCIuXCIpWzBdO2E9PT1mJiZ4YVtlXS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2EuY2FsbChtYSx3YS5tYXAoYy5mb3JtYXQudG8pLGIsd2Euc2xpY2UoKSxkfHwhMSxzYS5zbGljZSgpKX0pfSl9ZnVuY3Rpb24gVChhKXtyZXR1cm4gYStcIiVcIn1mdW5jdGlvbiBVKGEsYixkLGUsZixnKXtyZXR1cm4ga2EubGVuZ3RoPjEmJihlJiZiPjAmJihkPU1hdGgubWF4KGQsYVtiLTFdK2MubWFyZ2luKSksZiYmYjxrYS5sZW5ndGgtMSYmKGQ9TWF0aC5taW4oZCxhW2IrMV0tYy5tYXJnaW4pKSksa2EubGVuZ3RoPjEmJmMubGltaXQmJihlJiZiPjAmJihkPU1hdGgubWluKGQsYVtiLTFdK2MubGltaXQpKSxmJiZiPGthLmxlbmd0aC0xJiYoZD1NYXRoLm1heChkLGFbYisxXS1jLmxpbWl0KSkpLGMucGFkZGluZyYmKDA9PT1iJiYoZD1NYXRoLm1heChkLGMucGFkZGluZ1swXSkpLGI9PT1rYS5sZW5ndGgtMSYmKGQ9TWF0aC5taW4oZCwxMDAtYy5wYWRkaW5nWzFdKSkpLGQ9dmEuZ2V0U3RlcChkKSwhKChkPWooZCkpPT09YVtiXSYmIWcpJiZkfWZ1bmN0aW9uIFYoYSxiKXt2YXIgZD1jLm9ydDtyZXR1cm4oZD9iOmEpK1wiLCBcIisoZD9hOmIpfWZ1bmN0aW9uIFcoYSxiLGMsZCl7dmFyIGU9Yy5zbGljZSgpLGY9WyFhLGFdLGc9W2EsIWFdO2Q9ZC5zbGljZSgpLGEmJmQucmV2ZXJzZSgpLGQubGVuZ3RoPjE/ZC5mb3JFYWNoKGZ1bmN0aW9uKGEsYyl7dmFyIGQ9VShlLGEsZVthXStiLGZbY10sZ1tjXSwhMSk7ITE9PT1kP2I9MDooYj1kLWVbYV0sZVthXT1kKX0pOmY9Zz1bITBdO3ZhciBoPSExO2QuZm9yRWFjaChmdW5jdGlvbihhLGQpe2g9YWEoYSxjW2FdK2IsZltkXSxnW2RdKXx8aH0pLGgmJmQuZm9yRWFjaChmdW5jdGlvbihhKXtTKFwidXBkYXRlXCIsYSksUyhcInNsaWRlXCIsYSl9KX1mdW5jdGlvbiBZKGEsYil7cmV0dXJuIGMuZGlyPzEwMC1hLWI6YX1mdW5jdGlvbiBaKGEsYil7c2FbYV09Yix3YVthXT12YS5mcm9tU3RlcHBpbmcoYik7dmFyIGQ9XCJ0cmFuc2xhdGUoXCIrVihUKFkoYiwwKS1CYSksXCIwXCIpK1wiKVwiO2thW2FdLnN0eWxlW2MudHJhbnNmb3JtUnVsZV09ZCxiYShhKSxiYShhKzEpfWZ1bmN0aW9uIF8oKXt0YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3ZhciBiPXNhW2FdPjUwPy0xOjEsYz0zKyhrYS5sZW5ndGgrYiphKTtrYVthXS5zdHlsZS56SW5kZXg9Y30pfWZ1bmN0aW9uIGFhKGEsYixjLGQpe3JldHVybiExIT09KGI9VShzYSxhLGIsYyxkLCExKSkmJihaKGEsYiksITApfWZ1bmN0aW9uIGJhKGEpe2lmKGxhW2FdKXt2YXIgYj0wLGQ9MTAwOzAhPT1hJiYoYj1zYVthLTFdKSxhIT09bGEubGVuZ3RoLTEmJihkPXNhW2FdKTt2YXIgZT1kLWIsZj1cInRyYW5zbGF0ZShcIitWKFQoWShiLGUpKSxcIjBcIikrXCIpXCIsZz1cInNjYWxlKFwiK1YoZS8xMDAsXCIxXCIpK1wiKVwiO2xhW2FdLnN0eWxlW2MudHJhbnNmb3JtUnVsZV09ZitcIiBcIitnfX1mdW5jdGlvbiBjYShhLGIpe3JldHVybiBudWxsPT09YXx8ITE9PT1hfHx2b2lkIDA9PT1hP3NhW2JdOihcIm51bWJlclwiPT10eXBlb2YgYSYmKGE9U3RyaW5nKGEpKSxhPWMuZm9ybWF0LmZyb20oYSksYT12YS50b1N0ZXBwaW5nKGEpLCExPT09YXx8aXNOYU4oYSk/c2FbYl06YSl9ZnVuY3Rpb24gZGEoYSxiKXt2YXIgZD1rKGEpLGU9dm9pZCAwPT09c2FbMF07Yj12b2lkIDA9PT1ifHwhIWIsYy5hbmltYXRlJiYhZSYmaShyYSxjLmNzc0NsYXNzZXMudGFwLGMuYW5pbWF0aW9uRHVyYXRpb24pLHRhLmZvckVhY2goZnVuY3Rpb24oYSl7YWEoYSxjYShkW2FdLGEpLCEwLCExKX0pLHRhLmZvckVhY2goZnVuY3Rpb24oYSl7YWEoYSxzYVthXSwhMCwhMCl9KSxfKCksdGEuZm9yRWFjaChmdW5jdGlvbihhKXtTKFwidXBkYXRlXCIsYSksbnVsbCE9PWRbYV0mJmImJlMoXCJzZXRcIixhKX0pfWZ1bmN0aW9uIGVhKGEpe2RhKGMuc3RhcnQsYSl9ZnVuY3Rpb24gZmEoKXt2YXIgYT13YS5tYXAoYy5mb3JtYXQudG8pO3JldHVybiAxPT09YS5sZW5ndGg/YVswXTphfWZ1bmN0aW9uIGdhKCl7Zm9yKHZhciBhIGluIGMuY3NzQ2xhc3NlcyljLmNzc0NsYXNzZXMuaGFzT3duUHJvcGVydHkoYSkmJm4ocmEsYy5jc3NDbGFzc2VzW2FdKTtmb3IoO3JhLmZpcnN0Q2hpbGQ7KXJhLnJlbW92ZUNoaWxkKHJhLmZpcnN0Q2hpbGQpO2RlbGV0ZSByYS5ub1VpU2xpZGVyfWZ1bmN0aW9uIGhhKCl7cmV0dXJuIHNhLm1hcChmdW5jdGlvbihhLGIpe3ZhciBjPXZhLmdldE5lYXJieVN0ZXBzKGEpLGQ9d2FbYl0sZT1jLnRoaXNTdGVwLnN0ZXAsZj1udWxsOyExIT09ZSYmZCtlPmMuc3RlcEFmdGVyLnN0YXJ0VmFsdWUmJihlPWMuc3RlcEFmdGVyLnN0YXJ0VmFsdWUtZCksZj1kPmMudGhpc1N0ZXAuc3RhcnRWYWx1ZT9jLnRoaXNTdGVwLnN0ZXA6ITEhPT1jLnN0ZXBCZWZvcmUuc3RlcCYmZC1jLnN0ZXBCZWZvcmUuaGlnaGVzdFN0ZXAsMTAwPT09YT9lPW51bGw6MD09PWEmJihmPW51bGwpO3ZhciBnPXZhLmNvdW50U3RlcERlY2ltYWxzKCk7cmV0dXJuIG51bGwhPT1lJiYhMSE9PWUmJihlPU51bWJlcihlLnRvRml4ZWQoZykpKSxudWxsIT09ZiYmITEhPT1mJiYoZj1OdW1iZXIoZi50b0ZpeGVkKGcpKSksW2YsZV19KX1mdW5jdGlvbiBpYShhLGIpe3ZhciBkPWZhKCksZT1bXCJtYXJnaW5cIixcImxpbWl0XCIsXCJwYWRkaW5nXCIsXCJyYW5nZVwiLFwiYW5pbWF0ZVwiLFwic25hcFwiLFwic3RlcFwiLFwiZm9ybWF0XCJdO2UuZm9yRWFjaChmdW5jdGlvbihiKXt2b2lkIDAhPT1hW2JdJiYoZltiXT1hW2JdKX0pO3ZhciBnPVgoZik7ZS5mb3JFYWNoKGZ1bmN0aW9uKGIpe3ZvaWQgMCE9PWFbYl0mJihjW2JdPWdbYl0pfSksdmE9Zy5zcGVjdHJ1bSxjLm1hcmdpbj1nLm1hcmdpbixjLmxpbWl0PWcubGltaXQsYy5wYWRkaW5nPWcucGFkZGluZyxjLnBpcHMmJkQoYy5waXBzKSxzYT1bXSxkYShhLnN0YXJ0fHxkLGIpfXZhciBqYSxrYSxsYSxtYSxuYSxvYT1xKCkscGE9cygpLHFhPXBhJiZyKCkscmE9YSxzYT1bXSx0YT1bXSx1YT0wLHZhPWMuc3BlY3RydW0sd2E9W10seGE9e30seWE9YS5vd25lckRvY3VtZW50LHphPXlhLmRvY3VtZW50RWxlbWVudCxBYT15YS5ib2R5LEJhPVwicnRsXCI9PT15YS5kaXJ8fDE9PT1jLm9ydD8wOjEwMDtyZXR1cm4gdihyYSksdShjLmNvbm5lY3QsamEpLFAoYy5ldmVudHMpLGRhKGMuc3RhcnQpLG1hPXtkZXN0cm95OmdhLHN0ZXBzOmhhLG9uOlEsb2ZmOlIsZ2V0OmZhLHNldDpkYSxyZXNldDplYSxfX21vdmVIYW5kbGVzOmZ1bmN0aW9uKGEsYixjKXtXKGEsYixzYSxjKX0sb3B0aW9uczpmLHVwZGF0ZU9wdGlvbnM6aWEsdGFyZ2V0OnJhLHJlbW92ZVBpcHM6QyxwaXBzOkR9LGMucGlwcyYmRChjLnBpcHMpLGMudG9vbHRpcHMmJngoKSx5KCksbWF9ZnVuY3Rpb24gWihhLGIpe2lmKCFhfHwhYS5ub2RlTmFtZSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogY3JlYXRlIHJlcXVpcmVzIGEgc2luZ2xlIGVsZW1lbnQsIGdvdDogXCIrYSk7aWYoYS5ub1VpU2xpZGVyKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiBTbGlkZXIgd2FzIGFscmVhZHkgaW5pdGlhbGl6ZWQuXCIpO3ZhciBjPVgoYixhKSxkPVkoYSxjLGIpO3JldHVybiBhLm5vVWlTbGlkZXI9ZCxkfXZhciAkPVwiMTEuMS4wXCI7RC5wcm90b3R5cGUuZ2V0TWFyZ2luPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMueE51bVN0ZXBzWzBdO2lmKGImJmEvYiUxIT0wKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbGltaXQnLCAnbWFyZ2luJyBhbmQgJ3BhZGRpbmcnIG11c3QgYmUgZGl2aXNpYmxlIGJ5IHN0ZXAuXCIpO3JldHVybiAyPT09dGhpcy54UGN0Lmxlbmd0aCYmdSh0aGlzLnhWYWwsYSl9LEQucHJvdG90eXBlLnRvU3RlcHBpbmc9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9eSh0aGlzLnhWYWwsdGhpcy54UGN0LGEpfSxELnByb3RvdHlwZS5mcm9tU3RlcHBpbmc9ZnVuY3Rpb24oYSl7cmV0dXJuIHoodGhpcy54VmFsLHRoaXMueFBjdCxhKX0sRC5wcm90b3R5cGUuZ2V0U3RlcD1mdW5jdGlvbihhKXtyZXR1cm4gYT1BKHRoaXMueFBjdCx0aGlzLnhTdGVwcyx0aGlzLnNuYXAsYSl9LEQucHJvdG90eXBlLmdldE5lYXJieVN0ZXBzPWZ1bmN0aW9uKGEpe3ZhciBiPXgoYSx0aGlzLnhQY3QpO3JldHVybntzdGVwQmVmb3JlOntzdGFydFZhbHVlOnRoaXMueFZhbFtiLTJdLHN0ZXA6dGhpcy54TnVtU3RlcHNbYi0yXSxoaWdoZXN0U3RlcDp0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwW2ItMl19LHRoaXNTdGVwOntzdGFydFZhbHVlOnRoaXMueFZhbFtiLTFdLHN0ZXA6dGhpcy54TnVtU3RlcHNbYi0xXSxoaWdoZXN0U3RlcDp0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwW2ItMV19LHN0ZXBBZnRlcjp7c3RhcnRWYWx1ZTp0aGlzLnhWYWxbYi0wXSxzdGVwOnRoaXMueE51bVN0ZXBzW2ItMF0saGlnaGVzdFN0ZXA6dGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtiLTBdfX19LEQucHJvdG90eXBlLmNvdW50U3RlcERlY2ltYWxzPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy54TnVtU3RlcHMubWFwKGwpO3JldHVybiBNYXRoLm1heC5hcHBseShudWxsLGEpfSxELnByb3RvdHlwZS5jb252ZXJ0PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmdldFN0ZXAodGhpcy50b1N0ZXBwaW5nKGEpKX07dmFyIF89e3RvOmZ1bmN0aW9uKGEpe3JldHVybiB2b2lkIDAhPT1hJiZhLnRvRml4ZWQoMil9LGZyb206TnVtYmVyfTtyZXR1cm57dmVyc2lvbjokLGNyZWF0ZTpafX0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSkge1xyXG5cclxuICAgIGlmICggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xyXG5cclxuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXHJcbiAgICAgICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKCB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgKSB7XHJcblxyXG4gICAgICAgIC8vIE5vZGUvQ29tbW9uSlNcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHNcclxuICAgICAgICB3aW5kb3cud051bWIgPSBmYWN0b3J5KCk7XHJcbiAgICB9XHJcblxyXG59KGZ1bmN0aW9uKCl7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBGb3JtYXRPcHRpb25zID0gW1xyXG5cdCdkZWNpbWFscycsXHJcblx0J3Rob3VzYW5kJyxcclxuXHQnbWFyaycsXHJcblx0J3ByZWZpeCcsXHJcblx0J3N1ZmZpeCcsXHJcblx0J2VuY29kZXInLFxyXG5cdCdkZWNvZGVyJyxcclxuXHQnbmVnYXRpdmVCZWZvcmUnLFxyXG5cdCduZWdhdGl2ZScsXHJcblx0J2VkaXQnLFxyXG5cdCd1bmRvJ1xyXG5dO1xyXG5cclxuLy8gR2VuZXJhbFxyXG5cclxuXHQvLyBSZXZlcnNlIGEgc3RyaW5nXHJcblx0ZnVuY3Rpb24gc3RyUmV2ZXJzZSAoIGEgKSB7XHJcblx0XHRyZXR1cm4gYS5zcGxpdCgnJykucmV2ZXJzZSgpLmpvaW4oJycpO1xyXG5cdH1cclxuXHJcblx0Ly8gQ2hlY2sgaWYgYSBzdHJpbmcgc3RhcnRzIHdpdGggYSBzcGVjaWZpZWQgcHJlZml4LlxyXG5cdGZ1bmN0aW9uIHN0clN0YXJ0c1dpdGggKCBpbnB1dCwgbWF0Y2ggKSB7XHJcblx0XHRyZXR1cm4gaW5wdXQuc3Vic3RyaW5nKDAsIG1hdGNoLmxlbmd0aCkgPT09IG1hdGNoO1xyXG5cdH1cclxuXHJcblx0Ly8gQ2hlY2sgaXMgYSBzdHJpbmcgZW5kcyBpbiBhIHNwZWNpZmllZCBzdWZmaXguXHJcblx0ZnVuY3Rpb24gc3RyRW5kc1dpdGggKCBpbnB1dCwgbWF0Y2ggKSB7XHJcblx0XHRyZXR1cm4gaW5wdXQuc2xpY2UoLTEgKiBtYXRjaC5sZW5ndGgpID09PSBtYXRjaDtcclxuXHR9XHJcblxyXG5cdC8vIFRocm93IGFuIGVycm9yIGlmIGZvcm1hdHRpbmcgb3B0aW9ucyBhcmUgaW5jb21wYXRpYmxlLlxyXG5cdGZ1bmN0aW9uIHRocm93RXF1YWxFcnJvciggRiwgYSwgYiApIHtcclxuXHRcdGlmICggKEZbYV0gfHwgRltiXSkgJiYgKEZbYV0gPT09IEZbYl0pICkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBDaGVjayBpZiBhIG51bWJlciBpcyBmaW5pdGUgYW5kIG5vdCBOYU5cclxuXHRmdW5jdGlvbiBpc1ZhbGlkTnVtYmVyICggaW5wdXQgKSB7XHJcblx0XHRyZXR1cm4gdHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSggaW5wdXQgKTtcclxuXHR9XHJcblxyXG5cdC8vIFByb3ZpZGUgcm91bmRpbmctYWNjdXJhdGUgdG9GaXhlZCBtZXRob2QuXHJcblx0Ly8gQm9ycm93ZWQ6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMzIzMzMwLzc3NTI2NVxyXG5cdGZ1bmN0aW9uIHRvRml4ZWQgKCB2YWx1ZSwgZXhwICkge1xyXG5cdFx0dmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnNwbGl0KCdlJyk7XHJcblx0XHR2YWx1ZSA9IE1hdGgucm91bmQoKyh2YWx1ZVswXSArICdlJyArICh2YWx1ZVsxXSA/ICgrdmFsdWVbMV0gKyBleHApIDogZXhwKSkpO1xyXG5cdFx0dmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnNwbGl0KCdlJyk7XHJcblx0XHRyZXR1cm4gKCsodmFsdWVbMF0gKyAnZScgKyAodmFsdWVbMV0gPyAoK3ZhbHVlWzFdIC0gZXhwKSA6IC1leHApKSkudG9GaXhlZChleHApO1xyXG5cdH1cclxuXHJcblxyXG4vLyBGb3JtYXR0aW5nXHJcblxyXG5cdC8vIEFjY2VwdCBhIG51bWJlciBhcyBpbnB1dCwgb3V0cHV0IGZvcm1hdHRlZCBzdHJpbmcuXHJcblx0ZnVuY3Rpb24gZm9ybWF0VG8gKCBkZWNpbWFscywgdGhvdXNhbmQsIG1hcmssIHByZWZpeCwgc3VmZml4LCBlbmNvZGVyLCBkZWNvZGVyLCBuZWdhdGl2ZUJlZm9yZSwgbmVnYXRpdmUsIGVkaXQsIHVuZG8sIGlucHV0ICkge1xyXG5cclxuXHRcdHZhciBvcmlnaW5hbElucHV0ID0gaW5wdXQsIGlucHV0SXNOZWdhdGl2ZSwgaW5wdXRQaWVjZXMsIGlucHV0QmFzZSwgaW5wdXREZWNpbWFscyA9ICcnLCBvdXRwdXQgPSAnJztcclxuXHJcblx0XHQvLyBBcHBseSB1c2VyIGVuY29kZXIgdG8gdGhlIGlucHV0LlxyXG5cdFx0Ly8gRXhwZWN0ZWQgb3V0Y29tZTogbnVtYmVyLlxyXG5cdFx0aWYgKCBlbmNvZGVyICkge1xyXG5cdFx0XHRpbnB1dCA9IGVuY29kZXIoaW5wdXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFN0b3AgaWYgbm8gdmFsaWQgbnVtYmVyIHdhcyBwcm92aWRlZCwgdGhlIG51bWJlciBpcyBpbmZpbml0ZSBvciBOYU4uXHJcblx0XHRpZiAoICFpc1ZhbGlkTnVtYmVyKGlucHV0KSApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJvdW5kaW5nIGF3YXkgZGVjaW1hbHMgbWlnaHQgY2F1c2UgYSB2YWx1ZSBvZiAtMFxyXG5cdFx0Ly8gd2hlbiB1c2luZyB2ZXJ5IHNtYWxsIHJhbmdlcy4gUmVtb3ZlIHRob3NlIGNhc2VzLlxyXG5cdFx0aWYgKCBkZWNpbWFscyAhPT0gZmFsc2UgJiYgcGFyc2VGbG9hdChpbnB1dC50b0ZpeGVkKGRlY2ltYWxzKSkgPT09IDAgKSB7XHJcblx0XHRcdGlucHV0ID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBGb3JtYXR0aW5nIGlzIGRvbmUgb24gYWJzb2x1dGUgbnVtYmVycyxcclxuXHRcdC8vIGRlY29yYXRlZCBieSBhbiBvcHRpb25hbCBuZWdhdGl2ZSBzeW1ib2wuXHJcblx0XHRpZiAoIGlucHV0IDwgMCApIHtcclxuXHRcdFx0aW5wdXRJc05lZ2F0aXZlID0gdHJ1ZTtcclxuXHRcdFx0aW5wdXQgPSBNYXRoLmFicyhpbnB1dCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVkdWNlIHRoZSBudW1iZXIgb2YgZGVjaW1hbHMgdG8gdGhlIHNwZWNpZmllZCBvcHRpb24uXHJcblx0XHRpZiAoIGRlY2ltYWxzICE9PSBmYWxzZSApIHtcclxuXHRcdFx0aW5wdXQgPSB0b0ZpeGVkKCBpbnB1dCwgZGVjaW1hbHMgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUcmFuc2Zvcm0gdGhlIG51bWJlciBpbnRvIGEgc3RyaW5nLCBzbyBpdCBjYW4gYmUgc3BsaXQuXHJcblx0XHRpbnB1dCA9IGlucHV0LnRvU3RyaW5nKCk7XHJcblxyXG5cdFx0Ly8gQnJlYWsgdGhlIG51bWJlciBvbiB0aGUgZGVjaW1hbCBzZXBhcmF0b3IuXHJcblx0XHRpZiAoIGlucHV0LmluZGV4T2YoJy4nKSAhPT0gLTEgKSB7XHJcblx0XHRcdGlucHV0UGllY2VzID0gaW5wdXQuc3BsaXQoJy4nKTtcclxuXHJcblx0XHRcdGlucHV0QmFzZSA9IGlucHV0UGllY2VzWzBdO1xyXG5cclxuXHRcdFx0aWYgKCBtYXJrICkge1xyXG5cdFx0XHRcdGlucHV0RGVjaW1hbHMgPSBtYXJrICsgaW5wdXRQaWVjZXNbMV07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdC8vIElmIGl0IGlzbid0IHNwbGl0LCB0aGUgZW50aXJlIG51bWJlciB3aWxsIGRvLlxyXG5cdFx0XHRpbnB1dEJhc2UgPSBpbnB1dDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBHcm91cCBudW1iZXJzIGluIHNldHMgb2YgdGhyZWUuXHJcblx0XHRpZiAoIHRob3VzYW5kICkge1xyXG5cdFx0XHRpbnB1dEJhc2UgPSBzdHJSZXZlcnNlKGlucHV0QmFzZSkubWF0Y2goLy57MSwzfS9nKTtcclxuXHRcdFx0aW5wdXRCYXNlID0gc3RyUmV2ZXJzZShpbnB1dEJhc2Uuam9pbiggc3RyUmV2ZXJzZSggdGhvdXNhbmQgKSApKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBJZiB0aGUgbnVtYmVyIGlzIG5lZ2F0aXZlLCBwcmVmaXggd2l0aCBuZWdhdGlvbiBzeW1ib2wuXHJcblx0XHRpZiAoIGlucHV0SXNOZWdhdGl2ZSAmJiBuZWdhdGl2ZUJlZm9yZSApIHtcclxuXHRcdFx0b3V0cHV0ICs9IG5lZ2F0aXZlQmVmb3JlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFByZWZpeCB0aGUgbnVtYmVyXHJcblx0XHRpZiAoIHByZWZpeCApIHtcclxuXHRcdFx0b3V0cHV0ICs9IHByZWZpeDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBOb3JtYWwgbmVnYXRpdmUgb3B0aW9uIGNvbWVzIGFmdGVyIHRoZSBwcmVmaXguIERlZmF1bHRzIHRvICctJy5cclxuXHRcdGlmICggaW5wdXRJc05lZ2F0aXZlICYmIG5lZ2F0aXZlICkge1xyXG5cdFx0XHRvdXRwdXQgKz0gbmVnYXRpdmU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQXBwZW5kIHRoZSBhY3R1YWwgbnVtYmVyLlxyXG5cdFx0b3V0cHV0ICs9IGlucHV0QmFzZTtcclxuXHRcdG91dHB1dCArPSBpbnB1dERlY2ltYWxzO1xyXG5cclxuXHRcdC8vIEFwcGx5IHRoZSBzdWZmaXguXHJcblx0XHRpZiAoIHN1ZmZpeCApIHtcclxuXHRcdFx0b3V0cHV0ICs9IHN1ZmZpeDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSdW4gdGhlIG91dHB1dCB0aHJvdWdoIGEgdXNlci1zcGVjaWZpZWQgcG9zdC1mb3JtYXR0ZXIuXHJcblx0XHRpZiAoIGVkaXQgKSB7XHJcblx0XHRcdG91dHB1dCA9IGVkaXQgKCBvdXRwdXQsIG9yaWdpbmFsSW5wdXQgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBbGwgZG9uZS5cclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fVxyXG5cclxuXHQvLyBBY2NlcHQgYSBzdGluZyBhcyBpbnB1dCwgb3V0cHV0IGRlY29kZWQgbnVtYmVyLlxyXG5cdGZ1bmN0aW9uIGZvcm1hdEZyb20gKCBkZWNpbWFscywgdGhvdXNhbmQsIG1hcmssIHByZWZpeCwgc3VmZml4LCBlbmNvZGVyLCBkZWNvZGVyLCBuZWdhdGl2ZUJlZm9yZSwgbmVnYXRpdmUsIGVkaXQsIHVuZG8sIGlucHV0ICkge1xyXG5cclxuXHRcdHZhciBvcmlnaW5hbElucHV0ID0gaW5wdXQsIGlucHV0SXNOZWdhdGl2ZSwgb3V0cHV0ID0gJyc7XHJcblxyXG5cdFx0Ly8gVXNlciBkZWZpbmVkIHByZS1kZWNvZGVyLiBSZXN1bHQgbXVzdCBiZSBhIG5vbiBlbXB0eSBzdHJpbmcuXHJcblx0XHRpZiAoIHVuZG8gKSB7XHJcblx0XHRcdGlucHV0ID0gdW5kbyhpbnB1dCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVGVzdCB0aGUgaW5wdXQuIENhbid0IGJlIGVtcHR5LlxyXG5cdFx0aWYgKCAhaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJyApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElmIHRoZSBzdHJpbmcgc3RhcnRzIHdpdGggdGhlIG5lZ2F0aXZlQmVmb3JlIHZhbHVlOiByZW1vdmUgaXQuXHJcblx0XHQvLyBSZW1lbWJlciBpcyB3YXMgdGhlcmUsIHRoZSBudW1iZXIgaXMgbmVnYXRpdmUuXHJcblx0XHRpZiAoIG5lZ2F0aXZlQmVmb3JlICYmIHN0clN0YXJ0c1dpdGgoaW5wdXQsIG5lZ2F0aXZlQmVmb3JlKSApIHtcclxuXHRcdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKG5lZ2F0aXZlQmVmb3JlLCAnJyk7XHJcblx0XHRcdGlucHV0SXNOZWdhdGl2ZSA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVwZWF0IHRoZSBzYW1lIHByb2NlZHVyZSBmb3IgdGhlIHByZWZpeC5cclxuXHRcdGlmICggcHJlZml4ICYmIHN0clN0YXJ0c1dpdGgoaW5wdXQsIHByZWZpeCkgKSB7XHJcblx0XHRcdGlucHV0ID0gaW5wdXQucmVwbGFjZShwcmVmaXgsICcnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBbmQgYWdhaW4gZm9yIG5lZ2F0aXZlLlxyXG5cdFx0aWYgKCBuZWdhdGl2ZSAmJiBzdHJTdGFydHNXaXRoKGlucHV0LCBuZWdhdGl2ZSkgKSB7XHJcblx0XHRcdGlucHV0ID0gaW5wdXQucmVwbGFjZShuZWdhdGl2ZSwgJycpO1xyXG5cdFx0XHRpbnB1dElzTmVnYXRpdmUgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlbW92ZSB0aGUgc3VmZml4LlxyXG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU3RyaW5nL3NsaWNlXHJcblx0XHRpZiAoIHN1ZmZpeCAmJiBzdHJFbmRzV2l0aChpbnB1dCwgc3VmZml4KSApIHtcclxuXHRcdFx0aW5wdXQgPSBpbnB1dC5zbGljZSgwLCAtMSAqIHN1ZmZpeC5sZW5ndGgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlbW92ZSB0aGUgdGhvdXNhbmQgZ3JvdXBpbmcuXHJcblx0XHRpZiAoIHRob3VzYW5kICkge1xyXG5cdFx0XHRpbnB1dCA9IGlucHV0LnNwbGl0KHRob3VzYW5kKS5qb2luKCcnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZXQgdGhlIGRlY2ltYWwgc2VwYXJhdG9yIGJhY2sgdG8gcGVyaW9kLlxyXG5cdFx0aWYgKCBtYXJrICkge1xyXG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UobWFyaywgJy4nKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBQcmVwZW5kIHRoZSBuZWdhdGl2ZSBzeW1ib2wuXHJcblx0XHRpZiAoIGlucHV0SXNOZWdhdGl2ZSApIHtcclxuXHRcdFx0b3V0cHV0ICs9ICctJztcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBZGQgdGhlIG51bWJlclxyXG5cdFx0b3V0cHV0ICs9IGlucHV0O1xyXG5cclxuXHRcdC8vIFRyaW0gYWxsIG5vbi1udW1lcmljIGNoYXJhY3RlcnMgKGFsbG93ICcuJyBhbmQgJy0nKTtcclxuXHRcdG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKC9bXjAtOVxcLlxcLS5dL2csICcnKTtcclxuXHJcblx0XHQvLyBUaGUgdmFsdWUgY29udGFpbnMgbm8gcGFyc2UtYWJsZSBudW1iZXIuXHJcblx0XHRpZiAoIG91dHB1dCA9PT0gJycgKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBDb3ZlcnQgdG8gbnVtYmVyLlxyXG5cdFx0b3V0cHV0ID0gTnVtYmVyKG91dHB1dCk7XHJcblxyXG5cdFx0Ly8gUnVuIHRoZSB1c2VyLXNwZWNpZmllZCBwb3N0LWRlY29kZXIuXHJcblx0XHRpZiAoIGRlY29kZXIgKSB7XHJcblx0XHRcdG91dHB1dCA9IGRlY29kZXIob3V0cHV0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBDaGVjayBpcyB0aGUgb3V0cHV0IGlzIHZhbGlkLCBvdGhlcndpc2U6IHJldHVybiBmYWxzZS5cclxuXHRcdGlmICggIWlzVmFsaWROdW1iZXIob3V0cHV0KSApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fVxyXG5cclxuXHJcbi8vIEZyYW1ld29ya1xyXG5cclxuXHQvLyBWYWxpZGF0ZSBmb3JtYXR0aW5nIG9wdGlvbnNcclxuXHRmdW5jdGlvbiB2YWxpZGF0ZSAoIGlucHV0T3B0aW9ucyApIHtcclxuXHJcblx0XHR2YXIgaSwgb3B0aW9uTmFtZSwgb3B0aW9uVmFsdWUsXHJcblx0XHRcdGZpbHRlcmVkT3B0aW9ucyA9IHt9O1xyXG5cclxuXHRcdGlmICggaW5wdXRPcHRpb25zWydzdWZmaXgnXSA9PT0gdW5kZWZpbmVkICkge1xyXG5cdFx0XHRpbnB1dE9wdGlvbnNbJ3N1ZmZpeCddID0gaW5wdXRPcHRpb25zWydwb3N0Zml4J107XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICggaSA9IDA7IGkgPCBGb3JtYXRPcHRpb25zLmxlbmd0aDsgaSs9MSApIHtcclxuXHJcblx0XHRcdG9wdGlvbk5hbWUgPSBGb3JtYXRPcHRpb25zW2ldO1xyXG5cdFx0XHRvcHRpb25WYWx1ZSA9IGlucHV0T3B0aW9uc1tvcHRpb25OYW1lXTtcclxuXHJcblx0XHRcdGlmICggb3B0aW9uVmFsdWUgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcblx0XHRcdFx0Ly8gT25seSBkZWZhdWx0IGlmIG5lZ2F0aXZlQmVmb3JlIGlzbid0IHNldC5cclxuXHRcdFx0XHRpZiAoIG9wdGlvbk5hbWUgPT09ICduZWdhdGl2ZScgJiYgIWZpbHRlcmVkT3B0aW9ucy5uZWdhdGl2ZUJlZm9yZSApIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9ICctJztcclxuXHRcdFx0XHQvLyBEb24ndCBzZXQgYSBkZWZhdWx0IGZvciBtYXJrIHdoZW4gJ3Rob3VzYW5kJyBpcyBzZXQuXHJcblx0XHRcdFx0fSBlbHNlIGlmICggb3B0aW9uTmFtZSA9PT0gJ21hcmsnICYmIGZpbHRlcmVkT3B0aW9ucy50aG91c2FuZCAhPT0gJy4nICkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gJy4nO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnNbb3B0aW9uTmFtZV0gPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBGbG9hdGluZyBwb2ludHMgaW4gSlMgYXJlIHN0YWJsZSB1cCB0byA3IGRlY2ltYWxzLlxyXG5cdFx0XHR9IGVsc2UgaWYgKCBvcHRpb25OYW1lID09PSAnZGVjaW1hbHMnICkge1xyXG5cdFx0XHRcdGlmICggb3B0aW9uVmFsdWUgPj0gMCAmJiBvcHRpb25WYWx1ZSA8IDggKSB7XHJcblx0XHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnNbb3B0aW9uTmFtZV0gPSBvcHRpb25WYWx1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKG9wdGlvbk5hbWUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFRoZXNlIG9wdGlvbnMsIHdoZW4gcHJvdmlkZWQsIG11c3QgYmUgZnVuY3Rpb25zLlxyXG5cdFx0XHR9IGVsc2UgaWYgKCBvcHRpb25OYW1lID09PSAnZW5jb2RlcicgfHwgb3B0aW9uTmFtZSA9PT0gJ2RlY29kZXInIHx8IG9wdGlvbk5hbWUgPT09ICdlZGl0JyB8fCBvcHRpb25OYW1lID09PSAndW5kbycgKSB7XHJcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb3B0aW9uVmFsdWUgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnNbb3B0aW9uTmFtZV0gPSBvcHRpb25WYWx1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKG9wdGlvbk5hbWUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdC8vIE90aGVyIG9wdGlvbnMgYXJlIHN0cmluZ3MuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdGlmICggdHlwZW9mIG9wdGlvblZhbHVlID09PSAnc3RyaW5nJyApIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9IG9wdGlvblZhbHVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3Iob3B0aW9uTmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU29tZSB2YWx1ZXMgY2FuJ3QgYmUgZXh0cmFjdGVkIGZyb20gYVxyXG5cdFx0Ly8gc3RyaW5nIGlmIGNlcnRhaW4gY29tYmluYXRpb25zIGFyZSBwcmVzZW50LlxyXG5cdFx0dGhyb3dFcXVhbEVycm9yKGZpbHRlcmVkT3B0aW9ucywgJ21hcmsnLCAndGhvdXNhbmQnKTtcclxuXHRcdHRocm93RXF1YWxFcnJvcihmaWx0ZXJlZE9wdGlvbnMsICdwcmVmaXgnLCAnbmVnYXRpdmUnKTtcclxuXHRcdHRocm93RXF1YWxFcnJvcihmaWx0ZXJlZE9wdGlvbnMsICdwcmVmaXgnLCAnbmVnYXRpdmVCZWZvcmUnKTtcclxuXHJcblx0XHRyZXR1cm4gZmlsdGVyZWRPcHRpb25zO1xyXG5cdH1cclxuXHJcblx0Ly8gUGFzcyBhbGwgb3B0aW9ucyBhcyBmdW5jdGlvbiBhcmd1bWVudHNcclxuXHRmdW5jdGlvbiBwYXNzQWxsICggb3B0aW9ucywgbWV0aG9kLCBpbnB1dCApIHtcclxuXHRcdHZhciBpLCBhcmdzID0gW107XHJcblxyXG5cdFx0Ly8gQWRkIGFsbCBvcHRpb25zIGluIG9yZGVyIG9mIEZvcm1hdE9wdGlvbnNcclxuXHRcdGZvciAoIGkgPSAwOyBpIDwgRm9ybWF0T3B0aW9ucy5sZW5ndGg7IGkrPTEgKSB7XHJcblx0XHRcdGFyZ3MucHVzaChvcHRpb25zW0Zvcm1hdE9wdGlvbnNbaV1dKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBcHBlbmQgdGhlIGlucHV0LCB0aGVuIGNhbGwgdGhlIG1ldGhvZCwgcHJlc2VudGluZyBhbGxcclxuXHRcdC8vIG9wdGlvbnMgYXMgYXJndW1lbnRzLlxyXG5cdFx0YXJncy5wdXNoKGlucHV0KTtcclxuXHRcdHJldHVybiBtZXRob2QuYXBwbHkoJycsIGFyZ3MpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gd051bWIgKCBvcHRpb25zICkge1xyXG5cclxuXHRcdGlmICggISh0aGlzIGluc3RhbmNlb2Ygd051bWIpICkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IHdOdW1iICggb3B0aW9ucyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwib2JqZWN0XCIgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRvcHRpb25zID0gdmFsaWRhdGUob3B0aW9ucyk7XHJcblxyXG5cdFx0Ly8gQ2FsbCAnZm9ybWF0VG8nIHdpdGggcHJvcGVyIGFyZ3VtZW50cy5cclxuXHRcdHRoaXMudG8gPSBmdW5jdGlvbiAoIGlucHV0ICkge1xyXG5cdFx0XHRyZXR1cm4gcGFzc0FsbChvcHRpb25zLCBmb3JtYXRUbywgaW5wdXQpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBDYWxsICdmb3JtYXRGcm9tJyB3aXRoIHByb3BlciBhcmd1bWVudHMuXHJcblx0XHR0aGlzLmZyb20gPSBmdW5jdGlvbiAoIGlucHV0ICkge1xyXG5cdFx0XHRyZXR1cm4gcGFzc0FsbChvcHRpb25zLCBmb3JtYXRGcm9tLCBpbnB1dCk7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHdOdW1iO1xyXG5cclxufSkpO1xyXG4iXX0=
