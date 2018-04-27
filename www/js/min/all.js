function OnePoint(noteVal, scale) {
	var sphere = new THREE.SphereBufferGeometry(2,50,50);
	var sphereMesh = new THREE.Mesh(sphere, RGBMaterial);

	sphereMesh.position.copy(allPoints[noteVal].clone().multiplyScalar(scale))

	return sphereMesh;
}
function ThreePoints(notes, scale) {
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
	
	for(let note in notes) {
		positions.push(allPoints[notes[note]].clone().x);
		positions.push(allPoints[notes[note]].clone().y);
		positions.push(allPoints[notes[note]].clone().z);
		normals.push(0,1,2);
	}

	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );

	geometry.computeFaceNormals();

	geometry.scale(scale, scale, scale);

	var mesh = new THREE.Mesh(geometry, transparentMaterialFront);

	this.group.add(mesh);
	//this.group.add(new PolySpheresFromNotes(notes));

	const v1 = allPoints[notes[0]].clone().multiplyScalar(scale);
	const v2 = allPoints[notes[1]].clone().multiplyScalar(scale);
	const v3 = allPoints[notes[2]].clone().multiplyScalar(scale);

	this.group.add(new CylinderFromPts(v1, v2));
	this.group.add(new CylinderFromPts(v2, v3));
	this.group.add(new CylinderFromPts(v3, v1));

	return this.group;
}
function TwoPoints(noteVal1, noteVal2, scale) {

	var v1 = allPoints[noteVal1].clone().multiplyScalar(scale);
	var v2 = allPoints[noteVal2].clone().multiplyScalar(scale);

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

var allPoints = [
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

/*function makeTransparent(geometry, group) {
	//geometry.computeVertexNormals();
	//geometry.computeFaceNormals();
	group.add(new THREE.Mesh(geometry, transparentMaterialFront));
}*/
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
var mainGroup, shapesGroup, spheres, labels, container, camera, renderer, scene, stats;
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
	spheres = new THREE.Group();
	labels = new THREE.Group();

	for(let i in allPoints) {
		let point = new OnePoint(i, scale);
		point.visible = false;
		spheres.add(point);

		/*var label = new makeTextSprite(i, scale);
		labels.add(label);		*/
	}
	scene.add(spheres);
	//scene.add(labels);

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
	//console.log(chords);
	for(let chord in chords) {
		chords[chord].show(false);
	}
	for(var iTime=low; iTime<=upp; iTime++) {
		if(iTime in chords) {
			chords[iTime].show(true);
		}
	}
	render();
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

function parseMidi() {
	var inputElem = document.querySelector('#file-input');
	var file = inputElem.files[0];
	var reader = new FileReader();
	var chordsMap = {};

	reader.onload = function(e) {
		var uint8array = new Uint8Array(e.target.result);
		var parsed = MIDIParser.Uint8(uint8array);

		for(track of parsed.track) {

			var deltaTime = 0;
			for(event of track.event) {
				deltaTime += event.deltaTime;

				if(event.type === 9) {
					if(deltaTime in chordsMap) {
						chordsMap[deltaTime].push(event.data[0]);
					} else {
						chordsMap[deltaTime] = [event.data[0]];
					}

				} 
			}
		}

		console.log(chordsMap);

		let addedChordsMap = {};

		Object.defineProperty(addedChordsMap, 'hasValueArray', {
			enumerable: false,
			value: function(array) {
				const keys = Object.keys(this);
				const values = Object.values(this);

				for(let key of keys) {
					if(JSON.stringify(this[key].sort()) === JSON.stringify(array.sort())) {
						//console.log(JSON.stringify(this[key].sort()) + '   ' + JSON.stringify(array.sort()));
						return key;
					}
				}
			
				return -1;
			}
		});

		let prev;
		let existingChordKey;
		let nbChords = 0;
		let nbSameChords = 0;

		//for every event time in the song
		for(var time in chordsMap) {
			nbChords++;

			//if the chord has already been added for another time, don't create a new chord mesh
			if((existingChordKey = addedChordsMap.hasValueArray(chordsMap[time])) != -1) {
				//console.log(existingChordKey);
				chords[time] = chords[existingChordKey];
				nbSameChords++;
			} else {
				let newChord = new Chord(chordsMap[time]);
				//if(prev == null || !prev.equals(newChord))
				chords[time] = newChord;
				addedChordsMap[time] = chordsMap[time];
				
				//prev = newChord;
			}
			
		}

		console.log('nbChords : '+nbChords);
		console.log('nbSameChords : '+nbSameChords);


		var keys = Object.keys(chords);
		createSlider(parseInt(keys[0]), parseInt(keys[keys.length-1]));
		console.log(chords);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9uZVBvaW50LmpzIiwiVGhyZWVQb2ludHMuanMiLCJUd29Qb2ludHMuanMiLCJBbGxQb2ludHMuanMiLCJDb21iaW5hdGlvbnMuanMiLCJNYXRlcmlhbHMuanMiLCJQb2x5Q3lsaW5kZXIuanMiLCJQb2x5TWVzaGVzLmpzIiwiUG9seVNwaGVyZS5qcyIsIlRleHRTcHJpdGUuanMiLCJUcmFuc3BNZXNoR3JwLmpzIiwibWFrZUxpZ2h0cy5qcyIsImNob3JkLmpzIiwicmVuZGVyMi5qcyIsImJhc2VDb252ZXJ0ZXIuanMiLCJtaWRpLXBhcnNlci5qcy50eHQiLCJtaWRpUGFyc2VyLmpzIiwicHl0ZXN0LmpzIiwic2VuZE1pZGlUb1B5LmpzIiwidGltZWxpbmUuanMiLCJub3Vpc2xpZGVyLm1pbi5qcyIsIndOdW1iLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIE9uZVBvaW50KG5vdGVWYWwsIHNjYWxlKSB7XHJcblx0dmFyIHNwaGVyZSA9IG5ldyBUSFJFRS5TcGhlcmVCdWZmZXJHZW9tZXRyeSgyLDUwLDUwKTtcclxuXHR2YXIgc3BoZXJlTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHNwaGVyZSwgUkdCTWF0ZXJpYWwpO1xyXG5cclxuXHRzcGhlcmVNZXNoLnBvc2l0aW9uLmNvcHkoYWxsUG9pbnRzW25vdGVWYWxdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpKVxyXG5cclxuXHRyZXR1cm4gc3BoZXJlTWVzaDtcclxufSIsImZ1bmN0aW9uIFRocmVlUG9pbnRzKG5vdGVzLCBzY2FsZSkge1xyXG5cdHRoaXMuZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcblx0Lyp2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuXHRmb3IodmFyIG5vdGUgaW4gbm90ZXMpIHtcclxuXHRcdGdlb21ldHJ5LnZlcnRpY2VzLnB1c2goIGFsbFBvaW50c1tub3Rlc1tub3RlXV0uY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSkgKTtcclxuXHR9XHJcblxyXG5cdGdlb21ldHJ5LmZhY2VzLnB1c2gobmV3IFRIUkVFLkZhY2UzKDAsMSwyKSk7XHJcblx0Z2VvbWV0cnkuZmFjZXMucHVzaChuZXcgVEhSRUUuRmFjZTMoMiwxLDApKTtcclxuXHRnZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTtcclxuXHJcblx0dmFyIHYxID0gZ2VvbWV0cnkudmVydGljZXNbMF07XHJcblx0dmFyIHYyID0gZ2VvbWV0cnkudmVydGljZXNbMV07XHJcblx0dmFyIHYzID0gZ2VvbWV0cnkudmVydGljZXNbMl07XHJcblxyXG5cdHRoaXMuZ3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjEsIHYyKSk7XHJcblx0dGhpcy5ncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MiwgdjMpKTtcclxuXHR0aGlzLmdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYzLCB2MSkpOyovXHJcblxyXG5cdGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdGxldCBwb3NpdGlvbnMgPSBbXTtcclxuXHRsZXQgbm9ybWFscyA9IFtdO1xyXG5cdFxyXG5cdGZvcihsZXQgbm90ZSBpbiBub3Rlcykge1xyXG5cdFx0cG9zaXRpb25zLnB1c2goYWxsUG9pbnRzW25vdGVzW25vdGVdXS5jbG9uZSgpLngpO1xyXG5cdFx0cG9zaXRpb25zLnB1c2goYWxsUG9pbnRzW25vdGVzW25vdGVdXS5jbG9uZSgpLnkpO1xyXG5cdFx0cG9zaXRpb25zLnB1c2goYWxsUG9pbnRzW25vdGVzW25vdGVdXS5jbG9uZSgpLnopO1xyXG5cdFx0bm9ybWFscy5wdXNoKDAsMSwyKTtcclxuXHR9XHJcblxyXG5cdGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoIHBvc2l0aW9ucywgMyApICk7XHJcblx0Z2VvbWV0cnkuYWRkQXR0cmlidXRlKCAnbm9ybWFsJywgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoIG5vcm1hbHMsIDMgKSApO1xyXG5cclxuXHRnZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTtcclxuXHJcblx0Z2VvbWV0cnkuc2NhbGUoc2NhbGUsIHNjYWxlLCBzY2FsZSk7XHJcblxyXG5cdHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHRyYW5zcGFyZW50TWF0ZXJpYWxGcm9udCk7XHJcblxyXG5cdHRoaXMuZ3JvdXAuYWRkKG1lc2gpO1xyXG5cdC8vdGhpcy5ncm91cC5hZGQobmV3IFBvbHlTcGhlcmVzRnJvbU5vdGVzKG5vdGVzKSk7XHJcblxyXG5cdGNvbnN0IHYxID0gYWxsUG9pbnRzW25vdGVzWzBdXS5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKTtcclxuXHRjb25zdCB2MiA9IGFsbFBvaW50c1tub3Rlc1sxXV0uY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSk7XHJcblx0Y29uc3QgdjMgPSBhbGxQb2ludHNbbm90ZXNbMl1dLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cclxuXHR0aGlzLmdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYxLCB2MikpO1xyXG5cdHRoaXMuZ3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjIsIHYzKSk7XHJcblx0dGhpcy5ncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MywgdjEpKTtcclxuXHJcblx0cmV0dXJuIHRoaXMuZ3JvdXA7XHJcbn0iLCJmdW5jdGlvbiBUd29Qb2ludHMobm90ZVZhbDEsIG5vdGVWYWwyLCBzY2FsZSkge1xyXG5cclxuXHR2YXIgdjEgPSBhbGxQb2ludHNbbm90ZVZhbDFdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cdHZhciB2MiA9IGFsbFBvaW50c1tub3RlVmFsMl0uY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSk7XHJcblxyXG5cdC8vIHZhciBjeWxpbmRlciA9IG5ldyBUSFJFRS5DeWxpbmRlckJ1ZmZlckdlb21ldHJ5KDAuNCwgMC40LCB2MS5kaXN0YW5jZVRvKHYyKSwgMTAsIDAuNSwgdHJ1ZSk7XHJcblxyXG5cdHRoaXMuZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcblx0Lyp2YXIgc3BoZXJlQU1lc2ggPSBzcGhlcmVNZXNoLmNsb25lKCk7XHJcblx0c3BoZXJlQU1lc2gucG9zaXRpb24uY29weSh2MSk7XHJcblx0c3BoZXJlQU1lc2gudXBkYXRlTWF0cml4KCk7XHJcblxyXG5cdHZhciBzcGhlcmVCTWVzaCA9IHNwaGVyZU1lc2guY2xvbmUoKTtcclxuXHRzcGhlcmVCTWVzaC5wb3NpdGlvbi5jb3B5KHYyKTtcclxuXHRzcGhlcmVCTWVzaC51cGRhdGVNYXRyaXgoKTsqL1xyXG5cclxuXHR2YXIgY3lsaW5kZXJNZXNoID0gbmV3IEN5bGluZGVyRnJvbVB0cyh2MSwgdjIpO1xyXG5cclxuXHQvKnRoaXMuZ3JvdXAuYWRkKHNwaGVyZXNbbm90ZVZhbDFdKTtcclxuXHR0aGlzLmdyb3VwLmFkZChzcGhlcmVzW25vdGVWYWwyXSk7Ki9cclxuXHR0aGlzLmdyb3VwLmFkZChjeWxpbmRlck1lc2gpO1xyXG5cclxuXHRyZXR1cm4gdGhpcy5ncm91cDtcclxufVx0XHJcbiIsInZhciBhbGxQb2ludHMgPSBbXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuNzU5NjYwNjkzMDQ3LCAwLjYwNDI5MjcwNDA3OSwgLTAuMjQwMzAzODg5MzUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjQ4NDI2Njg0ODc3NywgLTAuMjA2Nzc3MDQ3MTE5LCAtMC44NTAxMzQ2MTk5MDQpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjkyMDIzNzkxODExNCwgLTAuMzgwNjkzMzkxODE2LCAwLjA5MDc0NTMzMzE3OTQpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuNDg0MjYyODA1MDkzLCAwLjIwNjc3OTk3NTk2OCwgMC44NTAxMzYyMTA5MzUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuMTUxNDUxNjE5ODgsIDAuNjI2MzY4MzE2MDczLCAtMC43NjQ2NzMyMjM5NjkpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuOTIwMjM5NzgyOTIyLCAwLjM4MDY4OTYwNjIyOSwgLTAuMDkwNzQyMzAzNDU0NSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoMC41NTM5Njk1NjEwMDUsIC0wLjM0NDk3MTA0NTU1NiwgLTAuNzU3NzAyMjUyMzQ1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC4xMDgzNjk2MTk5ODUsIC0wLjk2NzM2ODg1NTIyNywgLTAuMjI5MDI3MzQyMDM3KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC4xNTE0NTAwNjg5NzQsIC0wLjYyNjM2OTQyMDkyNywgMC43NjQ2NzI2MjYxMTkpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuNzU5NjU5OTAwOTcxLCAtMC42MDQyOTI5ODczMzMsIDAuMjQwMzA1NjgwOTkxKSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjEwODM3MTgwNTk2NCwgMC45NjczNjk3MDM4NjIsIDAuMjI5MDIyNzIzMTU1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC41NTM5NzAzMjY5MzgsIDAuMzQ0OTcyNDQxNzY3LCAwLjc1NzcwMTA1NjY4KVxyXG5dO1xyXG5cclxuLypcclxudmFyIGFsbFBvaW50cyA9IFtcclxuXHRbLTAuNzU5NjYwNjkzMDQ3LCAwLjYwNDI5MjcwNDA3OSwgLTAuMjQwMzAzODg5MzVdLFxyXG5cdFstMC40ODQyNjY4NDg3NzcsIC0wLjIwNjc3NzA0NzExOSwgLTAuODUwMTM0NjE5OTA0XSxcclxuXHRbLTAuOTIwMjM3OTE4MTE0LCAtMC4zODA2OTMzOTE4MTYsIDAuMDkwNzQ1MzMzMTc5NF0sXHJcblx0WzAuNDg0MjYyODA1MDkzLCAwLjIwNjc3OTk3NTk2OCwgMC44NTAxMzYyMTA5MzVdLFxyXG5cdFswLjE1MTQ1MTYxOTg4LCAwLjYyNjM2ODMxNjA3MywgLTAuNzY0NjczMjIzOTY5XSxcclxuXHRbMC45MjAyMzk3ODI5MjIsIDAuMzgwNjg5NjA2MjI5LCAtMC4wOTA3NDIzMDM0NTQ1XSxcclxuXHRbMC41NTM5Njk1NjEwMDUsIC0wLjM0NDk3MTA0NTU1NiwgLTAuNzU3NzAyMjUyMzQ1XSxcclxuXHRbLTAuMTA4MzY5NjE5OTg1LCAtMC45NjczNjg4NTUyMjcsIC0wLjIyOTAyNzM0MjAzN10sXHJcblx0Wy0wLjE1MTQ1MDA2ODk3NCwgLTAuNjI2MzY5NDIwOTI3LCAwLjc2NDY3MjYyNjExOV0sXHJcblx0WzAuNzU5NjU5OTAwOTcxLCAtMC42MDQyOTI5ODczMzMsIDAuMjQwMzA1NjgwOTkxXSxcclxuXHRbMC4xMDgzNzE4MDU5NjQsIDAuOTY3MzY5NzAzODYyLCAwLjIyOTAyMjcyMzE1NV0sXHJcblx0Wy0wLjU1Mzk3MDMyNjkzOCwgMC4zNDQ5NzI0NDE3NjcsIDAuNzU3NzAxMDU2NjhdXHJcbl07XHJcbiovIiwiZnVuY3Rpb24qIHN1YnNldHMoYXJyYXksIGxlbmd0aCwgc3RhcnQgPSAwKSB7XHJcbiAgaWYgKHN0YXJ0ID49IGFycmF5Lmxlbmd0aCB8fCBsZW5ndGggPCAxKSB7XHJcbiAgICB5aWVsZCBuZXcgU2V0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdoaWxlIChzdGFydCA8PSBhcnJheS5sZW5ndGggLSBsZW5ndGgpIHtcclxuICAgICAgbGV0IGZpcnN0ID0gYXJyYXlbc3RhcnRdO1xyXG4gICAgICBmb3IgKHN1YnNldCBvZiBzdWJzZXRzKGFycmF5LCBsZW5ndGggLSAxLCBzdGFydCArIDEpKSB7XHJcbiAgICAgICAgc3Vic2V0LmFkZChmaXJzdCk7XHJcbiAgICAgICAgeWllbGQgc3Vic2V0O1xyXG4gICAgICB9XHJcbiAgICAgICsrc3RhcnQ7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwidmFyIHRyYW5zcGFyZW50TWF0ZXJpYWxGcm9udCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4ZmZmZmZmLFxyXG5cdG9wYWNpdHk6IDAuNCxcclxuXHR0cmFuc3BhcmVudDogdHJ1ZSxcclxuXHRzaWRlOiBUSFJFRS5Eb3VibGVTaWRlXHJcbn0gKTtcclxuXHJcbnZhciB0cmFuc3BhcmVudE1hdGVyaWFsQmFjayA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4ZmZmZmZmLFxyXG5cdG9wYWNpdHk6IDAuNCxcclxuXHR0cmFuc3BhcmVudDogdHJ1ZVxyXG59ICk7XHJcblxyXG52YXIgcG9pbnRzTWF0ZXJpYWwgPSBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoIHtcclxuXHRjb2xvcjogMHgwMDgwZmYsXHJcblx0c2l6ZTogMSxcclxuXHRhbHBoYVRlc3Q6IDAuNVxyXG59ICk7XHJcblxyXG52YXIgUkdCTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaE5vcm1hbE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4MDA4OGZmXHJcbn0pO1xyXG5cclxudmFyIFNURE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4MDA4OGZmLFxyXG5cdG9wYWNpdHk6IDAuNVxyXG59KTtcclxuXHJcbnZhciBmbGF0U2hhcGVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgge1xyXG5cdHNpZGUgOiBUSFJFRS5Eb3VibGVTaWRlLFxyXG5cdHRyYW5zcGFyZW50IDogdHJ1ZSxcclxuXHRvcGFjaXR5OiAwLjVcclxufSk7IiwiZnVuY3Rpb24gQ3lsaW5kZXJGcm9tUHRzKHYxLCB2Mikge1xyXG5cdHZhciBjeWxpbmRlciA9IG5ldyBUSFJFRS5DeWxpbmRlckJ1ZmZlckdlb21ldHJ5KDAuNCwgMC40LCB2MS5kaXN0YW5jZVRvKHYyKSwgMTAsIDAuNSwgdHJ1ZSk7XHJcblx0dmFyIGN5bGluZGVyTWVzaCA9IG5ldyBUSFJFRS5NZXNoKGN5bGluZGVyLCBSR0JNYXRlcmlhbCk7XHJcblx0Y3lsaW5kZXJNZXNoLnBvc2l0aW9uLmNvcHkodjEuY2xvbmUoKS5sZXJwKHYyLCAuNSkpO1xyXG5cclxuXHQvL2NyZWF0ZXMgcXVhdGVybmlvbiBmcm9tIHNwaGVyZXMgcG9zaXRpb24gdG8gcm90YXRlIHRoZSBjeWxpbmRlclxyXG5cdHZhciBxID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKTtcclxuXHRxLnNldEZyb21Vbml0VmVjdG9ycyhuZXcgVEhSRUUuVmVjdG9yMygwLDEsMCksIG5ldyBUSFJFRS5WZWN0b3IzKCkuc3ViVmVjdG9ycyh2MSwgdjIpLm5vcm1hbGl6ZSgpKTtcclxuXHRjeWxpbmRlck1lc2guc2V0Um90YXRpb25Gcm9tUXVhdGVybmlvbihxKTtcclxuXHRyZXR1cm4gY3lsaW5kZXJNZXNoO1xyXG59IiwiZnVuY3Rpb24gUG9seU1lc2hlcyhnZW9tZXRyeSwgbm90ZXMpIHtcclxuXHR0aGlzLmdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG5cdHRoaXMuZ3JvdXAuYWRkKG5ldyBUcmFuc3BNZXNoR3JwKGdlb21ldHJ5KSk7XHJcblx0Ly90aGlzLmdyb3VwLmFkZChuZXcgUG9seVNwaGVyZXNGcm9tTm90ZXMobm90ZXMpKTtcclxuXHRyZXR1cm4gdGhpcy5ncm91cDtcclxufVxyXG5cclxuUG9seU1lc2hlcy5wcm90b3R5cGUuc2V0UG9zID0gZnVuY3Rpb24oeCx5LHopIHtcclxuXHR0aGlzLmdyb3VwLnBvc2l0aW9uLnggPSB4O1xyXG5cdHRoaXMuZ3JvdXAucG9zaXRpb24ueSA9IHk7XHJcblx0dGhpcy5ncm91cC5wb3NpdGlvbi56ID0gejtcclxufSIsIi8vIC8vY3JlYXRlcyBzcGhlcmVzIGZvciBlYWNoIHZlcnRleCBvZiB0aGUgZ2VvbWV0cnlcclxuLy8gdmFyIHNwaGVyZSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgyLDUwLDUwKTtcclxuLy8gdmFyIHNwaGVyZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChzcGhlcmUsIFJHQk1hdGVyaWFsKTtcclxuXHJcbi8vIGZ1bmN0aW9uIFBvbHlTcGhlcmVzKGdlb21ldHJ5KSB7XHJcbi8vIFx0dGhpcy5ncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4vLyBcdHZhciBtZXNoID0gc3BoZXJlTWVzaC5jbG9uZSgpO1xyXG4vLyBcdGZvcih2YXIgaT0wOyBpPGdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbi8vIFx0XHRzcGhlcmVNZXNoLnBvc2l0aW9uLmNvcHkoZ2VvbWV0cnkudmVydGljZXNbaV0pO1xyXG4vLyBcdFx0dGhpcy5ncm91cC5hZGQoc3BoZXJlTWVzaC5jbG9uZSgpKTtcclxuLy8gXHR9XHJcblxyXG4vLyBcdHJldHVybiB0aGlzLmdyb3VwO1xyXG4vLyB9XHJcblxyXG4vLyBmdW5jdGlvbiBQb2x5U3BoZXJlc0Zyb21Ob3Rlcyhub3Rlcykge1xyXG4vLyBcdHZhciBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4vLyBcdGZvcih2YXIgaSBpbiBub3Rlcykge1xyXG4vLyBcdFx0Z3JvdXAuYWRkKHNwaGVyZXMuZ2V0T2JqZWN0QnlJZChub3Rlc1tpXSkuY2xvbmUoKSk7XHJcbi8vIFx0fVxyXG4vLyBcdC8qY29uc29sZS5sb2coZ3JvdXApOyovXHJcblxyXG4vLyBcdHJldHVybiBncm91cDtcclxuLy8gfSIsIi8qZnVuY3Rpb24gbWFrZVRleHRTcHJpdGUoIG5vdGUsIHNjYWxlLCBwYXJhbWV0ZXJzIClcclxue1xyXG5cdHZhciBtZXNzYWdlO1xyXG5cclxuXHRpZihub3RlID09IDApIHtcclxuXHRcdG1lc3NhZ2UgPSAnQyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gMSkge1xyXG5cdFx0bWVzc2FnZSA9ICdDIyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gMikge1xyXG5cdFx0bWVzc2FnZSA9ICdEJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSAzKSB7XHJcblx0XHRtZXNzYWdlID0gJ0QjJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSA0KSB7XHJcblx0XHRtZXNzYWdlID0gJ0UnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDUpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRic7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gNikge1xyXG5cdFx0bWVzc2FnZSA9ICdGIyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gNykge1xyXG5cdFx0bWVzc2FnZSA9ICdHJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSA4KSB7XHJcblx0XHRtZXNzYWdlID0gJ0cjJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSA5KSB7XHJcblx0XHRtZXNzYWdlID0gJ0EnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDEwKSB7XHJcblx0XHRtZXNzYWdlID0gJ0EjJztcclxuXHR9IGVsc2Uge1xyXG5cdFx0bWVzc2FnZSA9ICdCJztcclxuXHR9XHJcblxyXG5cclxuXHRpZiAoIHBhcmFtZXRlcnMgPT09IHVuZGVmaW5lZCApIHBhcmFtZXRlcnMgPSB7fTtcclxuXHRcclxuXHR2YXIgZm9udGZhY2UgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiZm9udGZhY2VcIikgPyBcclxuXHRcdHBhcmFtZXRlcnNbXCJmb250ZmFjZVwiXSA6IFwiQXJpYWxcIjtcclxuXHRcclxuXHR2YXIgZm9udHNpemUgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiZm9udHNpemVcIikgPyBcclxuXHRcdHBhcmFtZXRlcnNbXCJmb250c2l6ZVwiXSA6IDE4O1xyXG5cdFxyXG5cdHZhciBib3JkZXJUaGlja25lc3MgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiYm9yZGVyVGhpY2tuZXNzXCIpID8gXHJcblx0XHRwYXJhbWV0ZXJzW1wiYm9yZGVyVGhpY2tuZXNzXCJdIDogNDtcclxuXHRcclxuXHR2YXIgYm9yZGVyQ29sb3IgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiYm9yZGVyQ29sb3JcIikgP1xyXG5cdFx0cGFyYW1ldGVyc1tcImJvcmRlckNvbG9yXCJdIDogeyByOjAsIGc6MCwgYjowLCBhOjEuMCB9O1xyXG5cdFxyXG5cdHZhciBiYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpID9cclxuXHRcdHBhcmFtZXRlcnNbXCJiYWNrZ3JvdW5kQ29sb3JcIl0gOiB7IHI6MjU1LCBnOjI1NSwgYjoyNTUsIGE6MS4wIH07XHJcblxyXG5cdC8vdmFyIHNwcml0ZUFsaWdubWVudCA9IHBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkoXCJhbGlnbm1lbnRcIikgP1xyXG5cdC8vXHRwYXJhbWV0ZXJzW1wiYWxpZ25tZW50XCJdIDogVEhSRUUuU3ByaXRlQWxpZ25tZW50LnRvcExlZnQ7XHJcblxyXG5cdHZhciBzcHJpdGVBbGlnbm1lbnQgPSBUSFJFRS5TcHJpdGVBbGlnbm1lbnQudG9wTGVmdDtcclxuXHRcdFxyXG5cclxuXHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcblx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHRjb250ZXh0LmZvbnQgPSBcIkJvbGQgXCIgKyBmb250c2l6ZSArIFwicHggXCIgKyBmb250ZmFjZTtcclxuICAgIFxyXG5cdC8vIGdldCBzaXplIGRhdGEgKGhlaWdodCBkZXBlbmRzIG9ubHkgb24gZm9udCBzaXplKVxyXG5cdHZhciBtZXRyaWNzID0gY29udGV4dC5tZWFzdXJlVGV4dCggbWVzc2FnZSApO1xyXG5cdHZhciB0ZXh0V2lkdGggPSBtZXRyaWNzLndpZHRoO1xyXG5cdFxyXG5cdC8vIGJhY2tncm91bmQgY29sb3JcclxuXHRjb250ZXh0LmZpbGxTdHlsZSAgID0gXCJyZ2JhKFwiICsgYmFja2dyb3VuZENvbG9yLnIgKyBcIixcIiArIGJhY2tncm91bmRDb2xvci5nICsgXCIsXCJcclxuXHRcdFx0XHRcdFx0XHRcdCAgKyBiYWNrZ3JvdW5kQ29sb3IuYiArIFwiLFwiICsgYmFja2dyb3VuZENvbG9yLmEgKyBcIilcIjtcclxuXHQvLyBib3JkZXIgY29sb3JcclxuXHRjb250ZXh0LnN0cm9rZVN0eWxlID0gXCJyZ2JhKFwiICsgYm9yZGVyQ29sb3IuciArIFwiLFwiICsgYm9yZGVyQ29sb3IuZyArIFwiLFwiXHJcblx0XHRcdFx0XHRcdFx0XHQgICsgYm9yZGVyQ29sb3IuYiArIFwiLFwiICsgYm9yZGVyQ29sb3IuYSArIFwiKVwiO1xyXG5cclxuXHRjb250ZXh0LmxpbmVXaWR0aCA9IGJvcmRlclRoaWNrbmVzcztcclxuXHRyb3VuZFJlY3QoY29udGV4dCwgYm9yZGVyVGhpY2tuZXNzLzIsIGJvcmRlclRoaWNrbmVzcy8yLCB0ZXh0V2lkdGggKyBib3JkZXJUaGlja25lc3MsIGZvbnRzaXplICogMS40ICsgYm9yZGVyVGhpY2tuZXNzLCA2KTtcclxuXHQvLyAxLjQgaXMgZXh0cmEgaGVpZ2h0IGZhY3RvciBmb3IgdGV4dCBiZWxvdyBiYXNlbGluZTogZyxqLHAscS5cclxuXHRcclxuXHQvLyB0ZXh0IGNvbG9yXHJcblx0Y29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoMCwgMCwgMCwgMS4wKVwiO1xyXG5cclxuXHRjb250ZXh0LmZpbGxUZXh0KCBtZXNzYWdlLCBib3JkZXJUaGlja25lc3MsIGZvbnRzaXplICsgYm9yZGVyVGhpY2tuZXNzKTtcclxuXHRcclxuXHQvLyBjYW52YXMgY29udGVudHMgd2lsbCBiZSB1c2VkIGZvciBhIHRleHR1cmVcclxuXHR2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGNhbnZhcykgXHJcblx0dGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcblxyXG5cdHZhciBzcHJpdGVNYXRlcmlhbCA9IG5ldyBUSFJFRS5TcHJpdGVNYXRlcmlhbCggXHJcblx0XHR7IG1hcDogdGV4dHVyZSwgdXNlU2NyZWVuQ29vcmRpbmF0ZXM6IGZhbHNlLCBhbGlnbm1lbnQ6IHNwcml0ZUFsaWdubWVudCB9ICk7XHJcblx0dmFyIHNwcml0ZSA9IG5ldyBUSFJFRS5TcHJpdGUoIHNwcml0ZU1hdGVyaWFsICk7XHJcblx0c3ByaXRlLnNjYWxlLnNldCgxMDAsNTAsMS4wKTtcclxuXHRzcHJpdGUucG9zaXRpb24uY29weShhbGxQb2ludHNbbm90ZVZhbF0uY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSkpXHJcblx0cmV0dXJuIHNwcml0ZTtcdFxyXG59XHJcblxyXG4vLyBmdW5jdGlvbiBmb3IgZHJhd2luZyByb3VuZGVkIHJlY3RhbmdsZXNcclxuZnVuY3Rpb24gcm91bmRSZWN0KGN0eCwgeCwgeSwgdywgaCwgcikgXHJcbntcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5tb3ZlVG8oeCtyLCB5KTtcclxuICAgIGN0eC5saW5lVG8oeCt3LXIsIHkpO1xyXG4gICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCt3LCB5LCB4K3csIHkrcik7XHJcbiAgICBjdHgubGluZVRvKHgrdywgeStoLXIpO1xyXG4gICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCt3LCB5K2gsIHgrdy1yLCB5K2gpO1xyXG4gICAgY3R4LmxpbmVUbyh4K3IsIHkraCk7XHJcbiAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5K2gsIHgsIHkraC1yKTtcclxuICAgIGN0eC5saW5lVG8oeCwgeStyKTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHgrciwgeSk7XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBjdHguZmlsbCgpO1xyXG5cdGN0eC5zdHJva2UoKTsgICBcclxufSovIiwiLy9jcmVhdGVzIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIHR3byBtZXNoZXMgdG8gY3JlYXRlIHRyYW5zcGFyZW5jeVxyXG5mdW5jdGlvbiBUcmFuc3BNZXNoR3JwKGdlb21ldHJ5KSB7XHJcblx0dmFyIGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblx0dmFyIG1lc2hHZW9tZXRyeSA9IG5ldyBUSFJFRS5Db252ZXhCdWZmZXJHZW9tZXRyeShnZW9tZXRyeS52ZXJ0aWNlcyk7XHJcblxyXG5cdHZhciBmYWNlcyA9IG1lc2hHZW9tZXRyeS5mYWNlcztcclxuXHRmb3IodmFyIGZhY2UgaW4gZmFjZXMpIHtcclxuXHRcdGZvcih2YXIgaT0wOyBpPDM7IGkrKykge1xyXG5cdFx0XHR2YXIgdjEgPSBmYWNlc1tmYWNlXS5nZXRFZGdlKGkpLmhlYWQoKTtcclxuXHRcdFx0dmFyIHYyID0gZmFjZXNbZmFjZV0uZ2V0RWRnZShpKS50YWlsKCk7XHJcblx0XHRcdGdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYxLnBvaW50LCB2Mi5wb2ludCkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChtZXNoR2VvbWV0cnksIHRyYW5zcGFyZW50TWF0ZXJpYWxCYWNrKTtcclxuXHRtZXNoLm1hdGVyaWFsLnNpZGUgPSBUSFJFRS5CYWNrU2lkZTsgLy8gYmFjayBmYWNlc1xyXG5cdG1lc2gucmVuZGVyT3JkZXIgPSAwO1xyXG5cclxuXHR2YXIgbWVzaDIgPSBuZXcgVEhSRUUuTWVzaChtZXNoR2VvbWV0cnksIHRyYW5zcGFyZW50TWF0ZXJpYWxGcm9udC5jbG9uZSgpKTtcclxuXHRtZXNoMi5tYXRlcmlhbC5zaWRlID0gVEhSRUUuRnJvbnRTaWRlOyAvLyBmcm9udCBmYWNlc1xyXG5cdG1lc2gyLnJlbmRlck9yZGVyID0gMTtcclxuXHJcblx0Z3JvdXAuYWRkKG1lc2gpO1xyXG5cdGdyb3VwLmFkZChtZXNoMik7XHJcblxyXG5cdHJldHVybiBncm91cDtcclxufVxyXG5cclxuLypmdW5jdGlvbiBtYWtlVHJhbnNwYXJlbnQoZ2VvbWV0cnksIGdyb3VwKSB7XHJcblx0Ly9nZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xyXG5cdC8vZ2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XHJcblx0Z3JvdXAuYWRkKG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCB0cmFuc3BhcmVudE1hdGVyaWFsRnJvbnQpKTtcclxufSovIiwiZnVuY3Rpb24gbWFrZUxpZ2h0cygpIHtcclxuXHR2YXIgeCA9IDA7XHJcblx0dmFyIHkgPSAwO1xyXG5cdHZhciB6ID0gMDtcclxuXHJcblx0dmFyIGRpc3RhbmNlID0gMzA7XHJcblxyXG5cdC8vdG9wIGxpZ2h0c1xyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZjAwMDAsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeCtkaXN0YW5jZSwgeStkaXN0YW5jZSwgeitkaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0Lyp2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHgwMGZmMDAsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeCtkaXN0YW5jZSwgeStkaXN0YW5jZSwgei1kaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0Lyp2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZmZmMDAsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeC1kaXN0YW5jZSwgeStkaXN0YW5jZSwgeitkaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0Lyp2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHgwMDAwZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeC1kaXN0YW5jZSwgeStkaXN0YW5jZSwgei1kaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0Lyp2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cclxuXHQvL2JvdHRvbSBsaWdodHNcclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4MDBmZmZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgrZGlzdGFuY2UsIHktZGlzdGFuY2UsIHorZGlzdGFuY2UpO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdC8qdmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmYwMGZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgrZGlzdGFuY2UsIHktZGlzdGFuY2UsIHotZGlzdGFuY2UpO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdC8qdmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTtcclxuKi9cclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmY4ODg4LCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgtZGlzdGFuY2UsIHktZGlzdGFuY2UsIHorZGlzdGFuY2UpO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdC8qdmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ODg4OGZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgtZGlzdGFuY2UsIHktZGlzdGFuY2UsIHotZGlzdGFuY2UpO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdC8qdmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHJcblxyXG5cdC8vbWlkZGxlIGxpZ2h0XHJcblx0Lyp2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmZmZmZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgsIHksIHopO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdHZhciBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0LCAxKTtcclxuXHRncm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxufSIsImNvbnN0IHNjYWxlID0gMTU7XHJcbmxldCBjaG9yZEdlb21ldHJ5O1xyXG5cclxuZnVuY3Rpb24gQ2hvcmQobm90ZXMpIHtcclxuXHR0aGlzLm5vdGVzID0gW107XHJcblxyXG5cdGZvcih2YXIgaSBpbiBub3Rlcykge1xyXG5cdFx0bGV0IGZpbmFsTm90ZSA9IG5vdGVzW2ldICUgMTI7XHJcblx0XHRpZih0aGlzLm5vdGVzLmluZGV4T2YoZmluYWxOb3RlKSA9PSAtMSkgXHJcblx0XHRcdHRoaXMubm90ZXMucHVzaChmaW5hbE5vdGUpO1xyXG5cdH1cclxuXHJcblx0dGhpcy5kcmF3Q2hvcmQoKTtcclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLmFkZE5vdGUgPSBmdW5jdGlvbihub3RlKSB7XHJcblx0dGhpcy5ub3Rlcy5wdXNoKG5vdGUgJSAxMik7XHJcbn1cclxuXHJcbkNob3JkLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oYm9vbCkge1xyXG5cdHRoaXMucG9seWhlZHJvbi52aXNpYmxlID0gYm9vbDtcclxuXHRmb3IodmFyIGkgaW4gdGhpcy5ub3Rlcykge1xyXG5cdFx0c3BoZXJlcy5jaGlsZHJlblt0aGlzLm5vdGVzW2ldXS52aXNpYmxlID0gYm9vbDtcclxuXHR9XHJcbn1cclxuXHJcbkNob3JkLnByb3RvdHlwZS5kcmF3Q2hvcmQgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbmJOb3RlcyA9IHRoaXMubm90ZXMubGVuZ3RoO1xyXG5cclxuXHRpZihuYk5vdGVzID09IDEpIHtcclxuXHRcdHRoaXMucG9seWhlZHJvbiA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xyXG5cdH0gZWxzZSBpZihuYk5vdGVzID09IDIpIHtcclxuXHRcdHRoaXMucG9seWhlZHJvbiA9IG5ldyBUd29Qb2ludHModGhpcy5ub3Rlc1swXSwgdGhpcy5ub3Rlc1sxXSwgc2NhbGUpO1xyXG5cdH0gZWxzZSBpZihuYk5vdGVzID09IDMpIHtcclxuXHRcdHRoaXMucG9seWhlZHJvbiA9IG5ldyBUaHJlZVBvaW50cyh0aGlzLm5vdGVzLCBzY2FsZSk7XHJcblx0fWVsc2Uge1xyXG5cdFx0Y2hvcmRHZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIGk9MDsgaTxuYk5vdGVzOyBpKyspIHtcclxuXHRcdFx0Y2hvcmRHZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKFxyXG5cdFx0XHRcdGFsbFBvaW50c1t0aGlzLm5vdGVzW2ldXS5jbG9uZSgpXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdmFyIHN1YnMgPSBzdWJzZXRzKHRoaXMubm90ZXMsIDMpO1xyXG5cdFx0Ly8gdmFyIHBvaW50SWRzO1xyXG5cdFx0Ly8gdmFyIHBvaW50SWQxLCBwb2ludElkMiwgcG9pbnRJZDM7XHJcblx0XHQvLyB2YXIgZmFjZTtcclxuXHJcblx0XHQvLyBmb3Ioc3ViIG9mIHN1YnMpIHtcclxuXHRcdC8vIFx0cG9pbnRJZHMgPSBzdWIuZW50cmllcygpO1xyXG5cdFx0XHRcclxuXHRcdC8vIFx0Ly9nZXQgdGhlIGZhY2UncyAzIHZlcnRpY2VzIGluZGV4XHJcblx0XHQvLyBcdHBvaW50SWQxID0gcG9pbnRJZHMubmV4dCgpLnZhbHVlWzBdLnZhbHVlO1xyXG5cdFx0Ly8gXHRwb2ludElkMiA9IHBvaW50SWRzLm5leHQoKS52YWx1ZVswXS52YWx1ZTtcclxuXHRcdC8vIFx0cG9pbnRJZDMgPSBwb2ludElkcy5uZXh0KCkudmFsdWVbMF0udmFsdWU7XHJcblxyXG5cdFx0Ly8gXHRmYWNlID0gbmV3IFRIUkVFLkZhY2UzKHBvaW50SWQxLHBvaW50SWQyLHBvaW50SWQzKTtcclxuXHRcdC8vIFx0Z2VvbWV0cnkuZmFjZXMucHVzaChmYWNlKTtcclxuXHRcdC8vIH1cclxuXHJcblx0XHQvLyB2YXIgbWVzaEdlb21ldHJ5ID0gbmV3IFRIUkVFLkNvbnZleEJ1ZmZlckdlb21ldHJ5KGdlb21ldHJ5LnZlcnRpY2VzKTtcclxuXHRcdGNob3JkR2VvbWV0cnkuc2NhbGUoc2NhbGUsc2NhbGUsc2NhbGUpO1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFBvbHlNZXNoZXMoY2hvcmRHZW9tZXRyeSwgdGhpcy5ub3Rlcyk7XHJcblxyXG5cdH1cclxuXHR0aGlzLnBvbHloZWRyb24udmlzaWJsZSA9IGZhbHNlO1xyXG5cdHNoYXBlc0dyb3VwLmFkZCh0aGlzLnBvbHloZWRyb24pO1xyXG5cdFxyXG5cclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKGNob3JkKSB7XHJcblx0aWYodGhpcy5ub3Rlcy5sZW5ndGggIT0gY2hvcmQubm90ZXMubGVuZ3RoKVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRmb3IobGV0IG5vdGUgaW4gY2hvcmQubm90ZXMpIHtcclxuXHRcdGlmKHRoaXMubm90ZXNbbm90ZV0gIT0gY2hvcmQubm90ZXNbbm90ZV0pXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB0cnVlO1xyXG59IiwidmFyIG1haW5Hcm91cCwgc2hhcGVzR3JvdXAsIHNwaGVyZXMsIGxhYmVscywgY29udGFpbmVyLCBjYW1lcmEsIHJlbmRlcmVyLCBzY2VuZSwgc3RhdHM7XG52YXIgY2hvcmRzID0ge307XG52YXIgbm90ZXMgPSBbXTtcbnZhciBtb3VzZVggPSAwLCBtb3VzZVkgPSAwO1xudmFyIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xudmFyIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbi8vdmFyIHdzID0gbmV3IFdlYlNvY2tldChcIndzOi8vMTI3LjAuMC4xOjU2NzgvXCIpO1xudmFyIGN1YmU7XG5cblxuaW5pdCgpO1xuYW5pbWF0ZSgpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuXHRjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoL3dpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKTtcblx0Y2FtZXJhLnBvc2l0aW9uLnogPSA1MDtcblxuXHRzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXHRzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKCAweDAwMDAwMCApO1xuXG5cdHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcblx0Ly9yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcblx0cmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcblxuXHR2YXIgY29udHJvbHMgPSBuZXcgVEhSRUUuT3JiaXRDb250cm9scyggY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50ICk7XG5cdGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gNTtcblx0Y29udHJvbHMubWF4RGlzdGFuY2UgPSAyMDA7XG5cdGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJO1xuXG5cdGNvbnRhaW5lci5hcHBlbmRDaGlsZCggcmVuZGVyZXIuZG9tRWxlbWVudCApO1xuXG5cdG1haW5Hcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXHRzaGFwZXNHcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXHRzY2VuZS5hZGQoc2hhcGVzR3JvdXApO1xuXHRzY2VuZS5hZGQobWFpbkdyb3VwKTtcblxuXHRjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KCAweDQwNDA0MCApO1xuXHRzY2VuZS5hZGQoIGFtYmllbnRMaWdodCApO1xuXG5cdGNvbnN0IHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCggMHhmZjAwMDAsIDEsIDEwMCApO1xuXHQvL2NhbWVyYS5hZGQocG9pbnRMaWdodCk7XG5cdHNwaGVyZXMgPSBuZXcgVEhSRUUuR3JvdXAoKTtcblx0bGFiZWxzID0gbmV3IFRIUkVFLkdyb3VwKCk7XG5cblx0Zm9yKGxldCBpIGluIGFsbFBvaW50cykge1xuXHRcdGxldCBwb2ludCA9IG5ldyBPbmVQb2ludChpLCBzY2FsZSk7XG5cdFx0cG9pbnQudmlzaWJsZSA9IGZhbHNlO1xuXHRcdHNwaGVyZXMuYWRkKHBvaW50KTtcblxuXHRcdC8qdmFyIGxhYmVsID0gbmV3IG1ha2VUZXh0U3ByaXRlKGksIHNjYWxlKTtcblx0XHRsYWJlbHMuYWRkKGxhYmVsKTtcdFx0Ki9cblx0fVxuXHRzY2VuZS5hZGQoc3BoZXJlcyk7XG5cdC8vc2NlbmUuYWRkKGxhYmVscyk7XG5cblx0bWFrZUxpZ2h0cygpO1xuXG5cdHN0YXRzID0gbmV3IFN0YXRzKCk7XG5cdC8vY29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplLCBmYWxzZSApO1xufVxuXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcblx0d2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5cdHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcblx0Y2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuXHRjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXHRyZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XG59XG5cbmZ1bmN0aW9uIGRyYXdDaG9yZHMobG93LCB1cHApIHtcblx0Ly9jb25zb2xlLmxvZyhjaG9yZHMpO1xuXHRmb3IobGV0IGNob3JkIGluIGNob3Jkcykge1xuXHRcdGNob3Jkc1tjaG9yZF0uc2hvdyhmYWxzZSk7XG5cdH1cblx0Zm9yKHZhciBpVGltZT1sb3c7IGlUaW1lPD11cHA7IGlUaW1lKyspIHtcblx0XHRpZihpVGltZSBpbiBjaG9yZHMpIHtcblx0XHRcdGNob3Jkc1tpVGltZV0uc2hvdyh0cnVlKTtcblx0XHR9XG5cdH1cblx0cmVuZGVyKCk7XG59XG5cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBhbmltYXRlICk7XG5cdHJlbmRlcigpO1xuXHRzdGF0cy51cGRhdGUoKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRyZW5kZXJlci5yZW5kZXIoIHNjZW5lLCBjYW1lcmEgKTtcbn1cbiIsIi8qKlxuKiBDb252ZXJ0IEZyb20vVG8gQmluYXJ5L0RlY2ltYWwvSGV4YWRlY2ltYWwgaW4gSmF2YVNjcmlwdFxuKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9mYWlzYWxtYW5cbipcbiogQ29weXJpZ2h0IDIwMTItMjAxNSwgRmFpc2FsbWFuIDxmeXpsbWFuQGdtYWlsLmNvbT5cbiogTGljZW5zZWQgdW5kZXIgVGhlIE1JVCBMaWNlbnNlXG4qIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiovXG5cbihmdW5jdGlvbigpe1xuXG4gICAgdmFyIENvbnZlcnRCYXNlID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZnJvbSA6IGZ1bmN0aW9uIChiYXNlRnJvbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRvIDogZnVuY3Rpb24gKGJhc2VUbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG51bSwgYmFzZUZyb20pLnRvU3RyaW5nKGJhc2VUbyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG4gICAgICAgIFxuICAgIC8vIGJpbmFyeSB0byBkZWNpbWFsXG4gICAgQ29udmVydEJhc2UuYmluMmRlYyA9IGZ1bmN0aW9uIChudW0pIHtcbiAgICAgICAgcmV0dXJuIENvbnZlcnRCYXNlKG51bSkuZnJvbSgyKS50bygxMCk7XG4gICAgfTtcbiAgICBcbiAgICAvLyBiaW5hcnkgdG8gaGV4YWRlY2ltYWxcbiAgICBDb252ZXJ0QmFzZS5iaW4yaGV4ID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICByZXR1cm4gQ29udmVydEJhc2UobnVtKS5mcm9tKDIpLnRvKDE2KTtcbiAgICB9O1xuICAgIFxuICAgIC8vIGRlY2ltYWwgdG8gYmluYXJ5XG4gICAgQ29udmVydEJhc2UuZGVjMmJpbiA9IGZ1bmN0aW9uIChudW0pIHtcbiAgICAgICAgcmV0dXJuIENvbnZlcnRCYXNlKG51bSkuZnJvbSgxMCkudG8oMik7XG4gICAgfTtcbiAgICBcbiAgICAvLyBkZWNpbWFsIHRvIGhleGFkZWNpbWFsXG4gICAgQ29udmVydEJhc2UuZGVjMmhleCA9IGZ1bmN0aW9uIChudW0pIHtcbiAgICAgICAgcmV0dXJuIENvbnZlcnRCYXNlKG51bSkuZnJvbSgxMCkudG8oMTYpO1xuICAgIH07XG4gICAgXG4gICAgLy8gaGV4YWRlY2ltYWwgdG8gYmluYXJ5XG4gICAgQ29udmVydEJhc2UuaGV4MmJpbiA9IGZ1bmN0aW9uIChudW0pIHtcbiAgICAgICAgcmV0dXJuIENvbnZlcnRCYXNlKG51bSkuZnJvbSgxNikudG8oMik7XG4gICAgfTtcbiAgICBcbiAgICAvLyBoZXhhZGVjaW1hbCB0byBkZWNpbWFsXG4gICAgQ29udmVydEJhc2UuaGV4MmRlYyA9IGZ1bmN0aW9uIChudW0pIHtcbiAgICAgICAgcmV0dXJuIENvbnZlcnRCYXNlKG51bSkuZnJvbSgxNikudG8oMTApO1xuICAgIH07XG4gICAgXG4gICAgdGhpcy5Db252ZXJ0QmFzZSA9IENvbnZlcnRCYXNlO1xuICAgIFxufSkodGhpcyk7XG5cbi8qXG4qIFVzYWdlIGV4YW1wbGU6XG4qIENvbnZlcnRCYXNlLmJpbjJkZWMoJzExMScpOyAvLyAnNydcbiogQ29udmVydEJhc2UuZGVjMmhleCgnNDInKTsgLy8gJzJhJ1xuKiBDb252ZXJ0QmFzZS5oZXgyYmluKCdmOCcpOyAvLyAnMTExMTEwMDAnXG4qIENvbnZlcnRCYXNlLmRlYzJiaW4oJzIyJyk7IC8vICcxMDExMCdcbiovXG4iLCIvKlxuXHRQcm9qZWN0IE5hbWU6IG1pZGktcGFyc2VyLWpzXG5cdEF1dGhvcjogY29seGlcblx0QXV0aG9yIFVSSTogaHR0cDovL3d3dy5jb2x4aS5pbmZvL1xuXHREZXNjcmlwdGlvbjogTUlESVBhcnNlciBsaWJyYXJ5IHJlYWRzIC5NSUQgYmluYXJ5IGZpbGVzLCBCYXNlNjQgZW5jb2RlZCBNSURJIERhdGEsXG5cdG9yIFVJbnQ4IEFycmF5cywgYW5kIG91dHB1dHMgYXMgYSByZWFkYWJsZSBhbmQgc3RydWN0dXJlZCBKUyBvYmplY3QuXG5cblx0LS0tICAgICBVc2FnZSBNZXRob2RzIFx0ICAgLS0tXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdCogT1BUSU9OIDEgTkVXISAoTUlESVBhcnNlci5wYXJzZSlcblx0V2lsbCBhdXRvZGV0ZWN0IHRoZSBzb3VyY2UgYW5kIHByb2NjZXNzIHRoZSBkYXRhLCB1c2luZyB0aGUgc3VpdGFibGUgbWV0aG9kLlxuXG5cdCogT1BUSU9OIDIgKE1JRElQYXJzZXIuYWRkTGlzdGVuZXIpXG5cdElOUFVUIEVMRU1FTlQgTElTVEVORVIgOiBjYWxsIE1JRElQYXJzZXIuYWRkTGlzdGVuZXIoZmlsZUlucHV0RWxlbWVudCxjYWxsYmFjRnVuY3Rpb24pIGZ1bmN0aW9uLCBzZXR0aW5nIHRoZVxuXHRJbnB1dCBGaWxlIEhUTUwgZWxlbWVudCB0aGF0IHdpbGwgaGFuZGxlIHRoZSBmaWxlLm1pZCBvcGVuaW5nLCBhbmQgY2FsbGJhY2sgZnVuY3Rpb25cblx0dGhhdCB3aWxsIHJlY2lldmUgdGhlIHJlc3VsdGluZyBPYmplY3QgZm9ybWF0ZWQsIHNldCBvZiBkYXRhLlxuXG5cdCogT1BUSU9OIDMgKE1JRElQYXJzZXIuVWludDgpXG5cdFByb3ZpZGUgeW91ciBvd24gVUludDggQXJyYXkgdG8gTUlESVBhcnNlci5VaW50OCgpLCB0byBnZXQgYW4gT2JqZWN0IGZvcm1hdGVkLCBzZXQgb2YgZGF0YVxuXG5cdCogT1BUSU9OIDQgKE1JRElQYXJzZXIuQmFzZTY0KVxuXHRQcm92aWRlIGEgQmFzZTY0IGVuY29kZWQgRGF0YSB0byBNSURJUGFyc2VyLkJhc2U2NCgpLCAsIHRvIGdldCBhbiBPYmplY3QgZm9ybWF0ZWQsIHNldCBvZiBkYXRhXG5cblxuXHQtLS0gIE91dHB1dCBPYmplY3QgU3BlY3MgICAtLS1cblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0TUlESU9iamVjdHtcblx0XHRmb3JtYXRUeXBlOiAwfDF8MiwgXHRcdFx0XHRcdC8vIE1pZGkgZm9ybWF0IHR5cGVcblx0XHR0aW1lRGl2aXNpb246IChpbnQpLFx0XHRcdFx0Ly8gc29uZyB0ZW1wbyAoYnBtKVxuXHRcdHRyYWNrczogKGludCksIFx0XHRcdFx0XHRcdC8vIHRvdGFsIHRyYWNrcyBjb3VudFxuXHRcdHRyYWNrOiBBcnJheVtcblx0XHRcdFswXTogT2JqZWN0e1x0XHRcdFx0XHQvLyBUUkFDSyAxIVxuXHRcdFx0XHRldmVudDogQXJyYXlbXHRcdFx0XHQvLyBNaWRpIGV2ZW50cyBpbiB0cmFjayAxXG5cdFx0XHRcdFx0WzBdIDogT2JqZWN0e1x0XHRcdC8vIEVWRU5UIDFcblx0XHRcdFx0XHRcdGRhdGE6IChzdHJpbmcpLFxuXHRcdFx0XHRcdFx0ZGVsdGFUaW1lOiAoaW50KSxcblx0XHRcdFx0XHRcdG1ldGFUeXBlOiAoaW50KSxcblx0XHRcdFx0XHRcdHR5cGU6IChpbnQpLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0WzFdIDogT2JqZWN0ey4uLn1cdFx0Ly8gRVZFTlQgMlxuXHRcdFx0XHRcdFsyXSA6IE9iamVjdHsuLi59XHRcdC8vIEVWRU5UIDNcblx0XHRcdFx0XHQuLi5cblx0XHRcdFx0XVxuXHRcdFx0fSxcblx0XHRcdFsxXSA6IE9iamVjdHsuLi59XG5cdFx0XHRbMl0gOiBPYmplY3R7Li4ufVxuXHRcdFx0Li4uXG5cdFx0XVxuXHR9XG5cbkRhdGEgZnJvbSBFdmVudCAxMiBvZiBUcmFjayAyIGNvdWxkIGJlIGVhc2lsbHkgcmVhZGVkIHdpdGg6XG5PdXRwdXRPYmplY3QudHJhY2tbMl0uZXZlbnRbMTJdLmRhdGE7XG5cbiovXG5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBDUk9TU0JST1dTRVIgJiBOT0RFanMgUE9MWUZJTEwgZm9yIEFUT0IoKSAtIEJ5OiBodHRwczovL2dpdGh1Yi5jb20vTWF4QXJ0MjUwMSAobW9kaWZpZWQpXG52YXIgX2F0b2IgPSBmdW5jdGlvbihzdHJpbmcpIHtcblx0Ly8gYmFzZTY0IGNoYXJhY3RlciBzZXQsIHBsdXMgcGFkZGluZyBjaGFyYWN0ZXIgKD0pXG5cdHZhciBiNjQgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XCI7XG5cdC8vIFJlZ3VsYXIgZXhwcmVzc2lvbiB0byBjaGVjayBmb3JtYWwgY29ycmVjdG5lc3Mgb2YgYmFzZTY0IGVuY29kZWQgc3RyaW5nc1xuXHR2YXIgYjY0cmUgPSAvXig/OltBLVphLXpcXGQrXFwvXXs0fSkqPyg/OltBLVphLXpcXGQrXFwvXXsyfSg/Oj09KT98W0EtWmEtelxcZCtcXC9dezN9PT8pPyQvO1xuXHQvLyByZW1vdmUgZGF0YSB0eXBlIHNpZ25hdHVyZXMgYXQgdGhlIGJlZ2luaW5nIG9mIHRoZSBzdHJpbmdcblx0Ly8gZWcgOiAgXCJkYXRhOmF1ZGlvL21pZDtiYXNlNjQsXCJcbiAgIFx0c3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoIC9eLio/YmFzZTY0LC8gLCBcIlwiKTtcbiAgICAvLyBhdG9iIGNhbiB3b3JrIHdpdGggc3RyaW5ncyB3aXRoIHdoaXRlc3BhY2VzLCBldmVuIGluc2lkZSB0aGUgZW5jb2RlZCBwYXJ0LFxuICAgIC8vIGJ1dCBvbmx5IFxcdCwgXFxuLCBcXGYsIFxcciBhbmQgJyAnLCB3aGljaCBjYW4gYmUgc3RyaXBwZWQuXG4gICAgc3RyaW5nID0gU3RyaW5nKHN0cmluZykucmVwbGFjZSgvW1xcdFxcblxcZlxcciBdKy9nLCBcIlwiKTtcbiAgICBpZiAoIWI2NHJlLnRlc3Qoc3RyaW5nKSlcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBleGVjdXRlICdfYXRvYicgOiBUaGUgc3RyaW5nIHRvIGJlIGRlY29kZWQgaXMgbm90IGNvcnJlY3RseSBlbmNvZGVkLlwiKTtcblxuICAgIC8vIEFkZGluZyB0aGUgcGFkZGluZyBpZiBtaXNzaW5nLCBmb3Igc2VtcGxpY2l0eVxuICAgIHN0cmluZyArPSBcIj09XCIuc2xpY2UoMiAtIChzdHJpbmcubGVuZ3RoICYgMykpO1xuICAgIHZhciBiaXRtYXAsIHJlc3VsdCA9IFwiXCIsIHIxLCByMiwgaSA9IDA7XG4gICAgZm9yICg7IGkgPCBzdHJpbmcubGVuZ3RoOykge1xuICAgICAgICBiaXRtYXAgPSBiNjQuaW5kZXhPZihzdHJpbmcuY2hhckF0KGkrKykpIDw8IDE4IHwgYjY0LmluZGV4T2Yoc3RyaW5nLmNoYXJBdChpKyspKSA8PCAxMlxuICAgICAgICAgICAgICAgIHwgKHIxID0gYjY0LmluZGV4T2Yoc3RyaW5nLmNoYXJBdChpKyspKSkgPDwgNiB8IChyMiA9IGI2NC5pbmRleE9mKHN0cmluZy5jaGFyQXQoaSsrKSkpO1xuXG4gICAgICAgIHJlc3VsdCArPSByMSA9PT0gNjQgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJpdG1hcCA+PiAxNiAmIDI1NSlcbiAgICAgICAgICAgICAgICA6IHIyID09PSA2NCA/IFN0cmluZy5mcm9tQ2hhckNvZGUoYml0bWFwID4+IDE2ICYgMjU1LCBiaXRtYXAgPj4gOCAmIDI1NSlcbiAgICAgICAgICAgICAgICA6IFN0cmluZy5mcm9tQ2hhckNvZGUoYml0bWFwID4+IDE2ICYgMjU1LCBiaXRtYXAgPj4gOCAmIDI1NSwgYml0bWFwICYgMjU1KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxudmFyIE1JRElQYXJzZXIgPSB7XG5cdC8vIGRlYnVnIChib29sKSwgd2hlbiBlbmFibGVkIHdpbGwgbG9nIGluIGNvbnNvbGUgdW5pbXBsZW1lbnRlZCBldmVudHMgd2FybmluZ3MgYW5kIGludGVybmFsIGhhbmRsZWQgZXJyb3JzLlxuXHRkZWJ1ZzogZmFsc2UsXG5cblx0cGFyc2U6IGZ1bmN0aW9uKGlucHV0LCBfY2FsbGJhY2spe1xuXHRcdGlmKGlucHV0IGluc3RhbmNlb2YgVWludDhBcnJheSkgcmV0dXJuIE1JRElQYXJzZXIuVWludDgoaW5wdXQpO1xuXHRcdGVsc2UgaWYodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykgcmV0dXJuIE1JRElQYXJzZXIuQmFzZTY0KGlucHV0KTtcblx0XHRlbHNlIGlmKGlucHV0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgaW5wdXQudHlwZSA9PT0gJ2ZpbGUnKSByZXR1cm4gTUlESVBhcnNlci5hZGRMaXN0ZW5lcihpbnB1dCAsIF9jYWxsYmFjayk7XG5cdFx0ZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ01JRElQYXJzZXIucGFyc2UoKSA6IEludmFsaWQgaW5wdXQgcHJvdmlkZWQnKTtcblx0fSxcblx0Ly8gYWRkTGlzdGVuZXIoKSBzaG91bGQgYmUgY2FsbGVkIGluIG9yZGVyIGF0dGFjaCBhIGxpc3RlbmVyIHRvIHRoZSBJTlBVVCBIVE1MIGVsZW1lbnRcblx0Ly8gdGhhdCB3aWxsIHByb3ZpZGUgdGhlIGJpbmFyeSBkYXRhIGF1dG9tYXRpbmcgdGhlIGNvbnZlcnNpb24sIGFuZCByZXR1cm5pbmdcblx0Ly8gdGhlIHN0cnVjdHVyZWQgZGF0YSB0byB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdGFkZExpc3RlbmVyOiBmdW5jdGlvbihfZmlsZUVsZW1lbnQsIF9jYWxsYmFjayl7XG5cdFx0aWYoIUZpbGUgfHwgIUZpbGVSZWFkZXIpIHRocm93IG5ldyBFcnJvcignVGhlIEZpbGV8RmlsZVJlYWRlciBBUElzIGFyZSBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3Nlci4gVXNlIGluc3RlYWQgTUlESVBhcnNlci5CYXNlNjQoKSBvciBNSURJUGFyc2VyLlVpbnQ4KCknKTtcblxuXHRcdC8vIHZhbGlkYXRlIHByb3ZpZGVkIGVsZW1lbnRcblx0XHRpZiggX2ZpbGVFbGVtZW50ID09PSB1bmRlZmluZWQgfHxcblx0XHRcdCEoX2ZpbGVFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8XG5cdFx0XHRfZmlsZUVsZW1lbnQudGFnTmFtZSAhPT0gJ0lOUFVUJyB8fFxuXHRcdFx0X2ZpbGVFbGVtZW50LnR5cGUudG9Mb3dlckNhc2UoKSAhPT0gJ2ZpbGUnICl7XG5cdFx0XHRcdGNvbnNvbGUud2FybignTUlESVBhcnNlci5hZGRMaXN0ZW5lcigpIDogUHJvdmlkZWQgZWxlbWVudCBpcyBub3QgYSB2YWxpZCBGSUxFIElOUFVUIGVsZW1lbnQnKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRfY2FsbGJhY2sgPSBfY2FsbGJhY2sgfHwgZnVuY3Rpb24oKXt9O1xuXG5cdFx0X2ZpbGVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKElucHV0RXZ0KXtcdFx0XHRcdC8vIHNldCB0aGUgJ2ZpbGUgc2VsZWN0ZWQnIGV2ZW50IGhhbmRsZXJcblx0XHRcdGlmICghSW5wdXRFdnQudGFyZ2V0LmZpbGVzLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1x0XHRcdFx0XHQvLyByZXR1cm4gZmFsc2UgaWYgbm8gZWxlbWVudHMgd2hlcmUgc2VsZWN0ZWRcblx0XHRcdGNvbnNvbGUubG9nKCdNSURJUGFyc2VyLmFkZExpc3RlbmVyKCkgOiBGaWxlIGRldGVjdGVkIGluIElOUFVUIEVMRU1FTlQgcHJvY2Vzc2luZyBkYXRhLi4nKTtcblx0XHRcdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1x0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gcHJlcGFyZSB0aGUgZmlsZSBSZWFkZXJcblx0XHRcdHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihJbnB1dEV2dC50YXJnZXQuZmlsZXNbMF0pO1x0XHRcdFx0XHQvLyByZWFkIHRoZSBiaW5hcnkgZGF0YVxuXHRcdFx0cmVhZGVyLm9ubG9hZCA9ICBmdW5jdGlvbihlKXtcblx0XHRcdFx0X2NhbGxiYWNrKCBNSURJUGFyc2VyLlVpbnQ4KG5ldyBVaW50OEFycmF5KGUudGFyZ2V0LnJlc3VsdCkpKTsgXHQvLyBlbmNvZGUgZGF0YSB3aXRoIFVpbnQ4QXJyYXkgYW5kIGNhbGwgdGhlIHBhcnNlclxuXHRcdFx0fTtcblx0XHR9KTtcblx0fSxcblxuXHRCYXNlNjQgOiBmdW5jdGlvbihiNjRTdHJpbmcpe1xuXHRcdGI2NFN0cmluZyA9IFN0cmluZyhiNjRTdHJpbmcpO1xuXG5cdFx0dmFyIHJhdyA9IF9hdG9iKGI2NFN0cmluZyk7XG5cdFx0dmFyIHJhd0xlbmd0aCA9IHJhdy5sZW5ndGg7XG5cdFx0dmFyIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkobmV3IEFycmF5QnVmZmVyKHJhd0xlbmd0aCkpO1xuXG5cdFx0Zm9yKHZhciBpPTA7IGk8cmF3TGVuZ3RoOyBpKyspIGFycmF5W2ldID0gcmF3LmNoYXJDb2RlQXQoaSk7XG5cdFx0cmV0dXJuICBNSURJUGFyc2VyLlVpbnQ4KGFycmF5KSA7XG5cdH0sXG5cblx0Ly8gcGFyc2UoKSBmdW5jdGlvbiByZWFkcyB0aGUgYmluYXJ5IGRhdGEsIGludGVycHJldGluZyBhbmQgc3BsaXRpbmcgZWFjaCBjaHVja1xuXHQvLyBhbmQgcGFyc2luZyBpdCB0byBhIHN0cnVjdHVyZWQgT2JqZWN0LiBXaGVuIGpvYiBpcyBmaW5pc2VkIHJldHVybnMgdGhlIG9iamVjdFxuXHQvLyBvciAnZmFsc2UnIGlmIGFueSBlcnJvciB3YXMgZ2VuZXJhdGVkLlxuXHRVaW50ODogZnVuY3Rpb24oRmlsZUFzVWludDhBcnJheSl7XG5cdFx0dmFyIGZpbGUgPSB7XG5cdFx0XHRkYXRhOiBudWxsLFxuXHRcdFx0cG9pbnRlcjogMCxcblx0XHRcdG1vdmVQb2ludGVyOiBmdW5jdGlvbihfYnl0ZXMpe1x0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gbW92ZSB0aGUgcG9pbnRlciBuZWdhdGl2ZSBhbmQgcG9zaXRpdmUgZGlyZWN0aW9uXG5cdFx0XHRcdHRoaXMucG9pbnRlciArPSBfYnl0ZXM7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBvaW50ZXI7XG5cdFx0XHR9LFxuXHRcdFx0cmVhZEludDogZnVuY3Rpb24oX2J5dGVzKXsgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGdldCBpbnRlZ2VyIGZyb20gbmV4dCBfYnl0ZXMgZ3JvdXAgKGJpZy1lbmRpYW4pXG5cdFx0XHRcdF9ieXRlcyA9IE1hdGgubWluKF9ieXRlcywgdGhpcy5kYXRhLmJ5dGVMZW5ndGgtdGhpcy5wb2ludGVyKTtcblx0XHRcdFx0aWYgKF9ieXRlcyA8IDEpIHJldHVybiAtMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRU9GXG5cdFx0XHRcdHZhciB2YWx1ZSA9IDA7XG5cdFx0XHRcdGlmKF9ieXRlcyA+IDEpe1xuXHRcdFx0XHRcdGZvcih2YXIgaT0xOyBpPD0gKF9ieXRlcy0xKTsgaSsrKXtcblx0XHRcdFx0XHRcdHZhbHVlICs9IHRoaXMuZGF0YS5nZXRVaW50OCh0aGlzLnBvaW50ZXIpICogTWF0aC5wb3coMjU2LCAoX2J5dGVzIC0gaSkpO1xuXHRcdFx0XHRcdFx0dGhpcy5wb2ludGVyKys7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHZhbHVlICs9IHRoaXMuZGF0YS5nZXRVaW50OCh0aGlzLnBvaW50ZXIpO1xuXHRcdFx0XHR0aGlzLnBvaW50ZXIrKztcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fSxcblx0XHRcdHJlYWRTdHI6IGZ1bmN0aW9uKF9ieXRlcyl7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIHJlYWQgYXMgQVNDSUkgY2hhcnMsIHRoZSBmb2xsb3dvaW5nIF9ieXRlc1xuXHRcdFx0XHR2YXIgdGV4dCA9ICcnO1xuXHRcdFx0XHRmb3IodmFyIGNoYXI9MTsgY2hhciA8PSBfYnl0ZXM7IGNoYXIrKykgdGV4dCArPSAgU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLnJlYWRJbnQoMSkpO1xuXHRcdFx0XHRyZXR1cm4gdGV4dDtcblx0XHRcdH0sXG5cdFx0XHRyZWFkSW50VkxWOiBmdW5jdGlvbigpe1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIHJlYWQgYSB2YXJpYWJsZSBsZW5ndGggdmFsdWVcblx0XHRcdFx0dmFyIHZhbHVlID0gMDtcblx0XHRcdFx0aWYgKCB0aGlzLnBvaW50ZXIgPj0gdGhpcy5kYXRhLmJ5dGVMZW5ndGggKXtcblx0XHRcdFx0XHRyZXR1cm4gLTE7XHRcdFx0XHRcdFx0XHRcdFx0Ly8gRU9GXG5cdFx0XHRcdH1lbHNlIGlmKHRoaXMuZGF0YS5nZXRVaW50OCh0aGlzLnBvaW50ZXIpIDwgMTI4KXtcdFx0XHRcdFx0Ly8gLi4udmFsdWUgaW4gYSBzaW5nbGUgYnl0ZVxuXHRcdFx0XHRcdHZhbHVlID0gdGhpcy5yZWFkSW50KDEpO1xuXHRcdFx0XHR9ZWxzZXtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAuLi52YWx1ZSBpbiBtdWx0aXBsZSBieXRlc1xuXHRcdFx0XHRcdHZhciBGaXJzdEJ5dGVzID0gW107XG5cdFx0XHRcdFx0d2hpbGUodGhpcy5kYXRhLmdldFVpbnQ4KHRoaXMucG9pbnRlcikgPj0gMTI4KXtcblx0XHRcdFx0XHRcdEZpcnN0Qnl0ZXMucHVzaCh0aGlzLnJlYWRJbnQoMSkgLSAxMjgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgbGFzdEJ5dGUgID0gdGhpcy5yZWFkSW50KDEpO1xuXHRcdFx0XHRcdGZvcih2YXIgZHQgPSAxOyBkdCA8PSBGaXJzdEJ5dGVzLmxlbmd0aDsgZHQrKyl7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IEZpcnN0Qnl0ZXNbRmlyc3RCeXRlcy5sZW5ndGggLSBkdF0gKiBNYXRoLnBvdygxMjgsIGR0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFsdWUgKz0gbGFzdEJ5dGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRmaWxlLmRhdGEgPSBuZXcgRGF0YVZpZXcoRmlsZUFzVWludDhBcnJheS5idWZmZXIsIEZpbGVBc1VpbnQ4QXJyYXkuYnl0ZU9mZnNldCwgRmlsZUFzVWludDhBcnJheS5ieXRlTGVuZ3RoKTtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gOCBiaXRzIGJ5dGVzIGZpbGUgZGF0YSBhcnJheVxuXHRcdC8vICAqKiByZWFkIEZJTEUgSEVBREVSXG5cdFx0aWYoZmlsZS5yZWFkSW50KDQpICE9PSAweDRENTQ2ODY0KXtcblx0XHRcdGNvbnNvbGUud2FybignSGVhZGVyIHZhbGlkYXRpb24gZmFpbGVkIChub3QgTUlESSBzdGFuZGFyZCBvciBmaWxlIGNvcnJ1cHQuKScpO1xuXHRcdFx0cmV0dXJuIGZhbHNlOyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSGVhZGVyIHZhbGlkYXRpb24gZmFpbGVkIChub3QgTUlESSBzdGFuZGFyZCBvciBmaWxlIGNvcnJ1cHQuKVxuXHRcdH1cblx0XHR2YXIgaGVhZGVyU2l6ZSBcdFx0XHQ9IGZpbGUucmVhZEludCg0KTtcdFx0XHRcdFx0XHRcdFx0Ly8gaGVhZGVyIHNpemUgKHVudXNlZCB2YXIpLCBnZXR0ZWQganVzdCBmb3IgcmVhZCBwb2ludGVyIG1vdmVtZW50XG5cdFx0dmFyIE1JREkgXHRcdFx0XHQ9IHt9O1x0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjcmVhdGUgbmV3IG1pZGkgb2JqZWN0XG5cdFx0TUlESS5mb3JtYXRUeXBlICAgXHRcdD0gZmlsZS5yZWFkSW50KDIpO1x0XHRcdFx0XHRcdFx0XHQvLyBnZXQgTUlESSBGb3JtYXQgVHlwZVxuXHRcdE1JREkudHJhY2tzIFx0XHRcdD0gZmlsZS5yZWFkSW50KDIpO1x0XHRcdFx0XHRcdFx0XHQvLyBnZXQgYW1tb3VudCBvZiB0cmFjayBjaHVua3Ncblx0XHRNSURJLnRyYWNrXHRcdFx0XHQ9IFtdO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjcmVhdGUgYXJyYXkga2V5IGZvciB0cmFjayBkYXRhIHN0b3Jpbmdcblx0XHR2YXIgdGltZURpdmlzaW9uQnl0ZTEgICA9IGZpbGUucmVhZEludCgxKTtcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IFRpbWUgRGl2aXNpb24gZmlyc3QgYnl0ZVxuXHRcdHZhciB0aW1lRGl2aXNpb25CeXRlMiAgID0gZmlsZS5yZWFkSW50KDEpO1x0XHRcdFx0XHRcdFx0XHQvLyBnZXQgVGltZSBEaXZpc2lvbiBzZWNvbmQgYnl0ZVxuXHRcdGlmKHRpbWVEaXZpc2lvbkJ5dGUxID49IDEyOCl7IFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBkaXNjb3ZlciBUaW1lIERpdmlzaW9uIG1vZGUgKGZwcyBvciB0cGYpXG5cdFx0XHRNSURJLnRpbWVEaXZpc2lvbiAgICA9IFtdO1xuXHRcdFx0TUlESS50aW1lRGl2aXNpb25bMF0gPSB0aW1lRGl2aXNpb25CeXRlMSAtIDEyODtcdFx0XHRcdFx0XHQvLyBmcmFtZXMgcGVyIHNlY29uZCBNT0RFICAoMXN0IGJ5dGUpXG5cdFx0XHRNSURJLnRpbWVEaXZpc2lvblsxXSA9IHRpbWVEaXZpc2lvbkJ5dGUyO1x0XHRcdFx0XHRcdFx0Ly8gdGlja3MgaW4gZWFjaCBmcmFtZSAgICAgKDJuZCBieXRlKVxuXHRcdH1lbHNlIE1JREkudGltZURpdmlzaW9uICA9ICh0aW1lRGl2aXNpb25CeXRlMSAqIDI1NikgKyB0aW1lRGl2aXNpb25CeXRlMjsvLyBlbHNlLi4uIHRpY2tzIHBlciBiZWF0IE1PREUgICgyIGJ5dGVzIHZhbHVlKVxuXHRcdC8vICAqKiByZWFkIFRSQUNLIENIVU5LXG5cdFx0Zm9yKHZhciB0PTE7IHQgPD0gTUlESS50cmFja3M7IHQrKyl7XG5cdFx0XHRNSURJLnRyYWNrW3QtMV0gXHQ9IHtldmVudDogW119O1x0XHRcdFx0XHRcdFx0XHRcdC8vIGNyZWF0ZSBuZXcgVHJhY2sgZW50cnkgaW4gQXJyYXlcblx0XHRcdHZhciBoZWFkZXJWYWxpZGF0aW9uID0gZmlsZS5yZWFkSW50KDQpO1xuXHRcdFx0aWYgKCBoZWFkZXJWYWxpZGF0aW9uID09PSAtMSApIGJyZWFrO1x0XHRcdFx0XHRcdFx0Ly8gRU9GXG5cdFx0XHRpZihoZWFkZXJWYWxpZGF0aW9uICE9PSAweDRENTQ3MjZCKSByZXR1cm4gZmFsc2U7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJhY2sgY2h1bmsgaGVhZGVyIHZhbGlkYXRpb24gZmFpbGVkLlxuXHRcdFx0ZmlsZS5yZWFkSW50KDQpO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gbW92ZSBwb2ludGVyLiBnZXQgY2h1bmsgc2l6ZSAoYnl0ZXMgbGVuZ3RoKVxuXHRcdFx0dmFyIGVcdFx0ICBcdFx0PSAwO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBpbml0IGV2ZW50IGNvdW50ZXJcblx0XHRcdHZhciBlbmRPZlRyYWNrIFx0XHQ9IGZhbHNlO1x0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gRkxBRyBmb3IgdHJhY2sgcmVhZGluZyBzZWN1ZW5jZSBicmVha2luZ1xuXHRcdFx0Ly8gKiogcmVhZCBFVkVOVCBDSFVOS1xuXHRcdFx0dmFyIHN0YXR1c0J5dGU7XG5cdFx0XHR2YXIgbGFzdHN0YXR1c0J5dGU7XG5cdFx0XHR3aGlsZSghZW5kT2ZUcmFjayl7XG5cdFx0XHRcdGUrKztcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBpbmNyZWFzZSBieSAxIGV2ZW50IGNvdW50ZXJcblx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0gPSB7fTtcdCBcdFx0XHRcdFx0XHRcdC8vIGNyZWF0ZSBuZXcgZXZlbnQgb2JqZWN0LCBpbiBldmVudHMgYXJyYXlcblx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGVsdGFUaW1lICA9IGZpbGUucmVhZEludFZMVigpO1x0XHQvLyBnZXQgREVMVEEgVElNRSBPRiBNSURJIGV2ZW50IChWYXJpYWJsZSBMZW5ndGggVmFsdWUpXG5cdFx0XHRcdHN0YXR1c0J5dGUgPSBmaWxlLnJlYWRJbnQoMSk7XHRcdFx0XHRcdFx0XHRcdFx0Ly8gcmVhZCBFVkVOVCBUWVBFIChTVEFUVVMgQllURSlcblx0XHRcdFx0aWYoc3RhdHVzQnl0ZSA9PT0gLTEpIGJyZWFrO1x0XHRcdFx0XHRcdFx0XHRcdC8vIEVPRlxuICAgICAgICAgICAgICAgIGVsc2UgaWYoc3RhdHVzQnl0ZSA+PSAxMjgpIGxhc3RzdGF0dXNCeXRlID0gc3RhdHVzQnl0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTkVXIFNUQVRVUyBCWVRFIERFVEVDVEVEXG5cdFx0XHRcdGVsc2V7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gJ1JVTk5JTkcgU1RBVFVTJyBzaXR1YXRpb24gZGV0ZWN0ZWRcblx0XHRcdFx0XHRzdGF0dXNCeXRlID0gbGFzdHN0YXR1c0J5dGU7XHRcdFx0XHRcdFx0XHRcdC8vIGFwcGx5IGxhc3QgbG9vcCwgU3RhdHVzIEJ5dGVcblx0XHRcdFx0XHRmaWxlLm1vdmVQb2ludGVyKC0xKTsgXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBtb3ZlIGJhY2sgdGhlIHBvaW50ZXIgKGNhdXNlIHJlYWRlZCBieXRlIGlzIG5vdCBzdGF0dXMgYnl0ZSlcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyAqKiBJZGVudGlmeSBFVkVOVFxuXHRcdFx0XHRpZihzdGF0dXNCeXRlID09PSAweEZGKXsgXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBNZXRhIEV2ZW50IHR5cGVcblx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS50eXBlID0gMHhGRjtcdFx0XHRcdFx0XHQvLyBhc3NpZ24gbWV0YUV2ZW50IGNvZGUgdG8gYXJyYXlcblx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5tZXRhVHlwZSA9ICBmaWxlLnJlYWRJbnQoMSk7XHRcdC8vIGFzc2lnbiBtZXRhRXZlbnQgc3VidHlwZVxuXHRcdFx0XHRcdHZhciBtZXRhRXZlbnRMZW5ndGggPSBmaWxlLnJlYWRJbnRWTFYoKTtcdFx0XHRcdFx0Ly8gZ2V0IHRoZSBtZXRhRXZlbnQgbGVuZ3RoXG5cdFx0XHRcdFx0c3dpdGNoKE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLm1ldGFUeXBlKXtcblx0XHRcdFx0XHRcdGNhc2UgMHgyRjpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBlbmQgb2YgdHJhY2ssIGhhcyBubyBkYXRhIGJ5dGVcblx0XHRcdFx0XHRcdGNhc2UgLTE6XHRcdFx0XHRcdFx0XHRcdFx0Ly8gRU9GXG5cdFx0XHRcdFx0XHRcdGVuZE9mVHJhY2sgPSB0cnVlO1x0XHRcdFx0XHRcdFx0XHRcdC8vIGNoYW5nZSBGTEFHIHRvIGZvcmNlIHRyYWNrIHJlYWRpbmcgbG9vcCBicmVha2luZ1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMHgwMTogXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gVGV4dCBFdmVudFxuXHRcdFx0XHRcdFx0Y2FzZSAweDAyOiAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIENvcHlyaWdodCBOb3RpY2Vcblx0XHRcdFx0XHRcdGNhc2UgMHgwMzogIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBTZXF1ZW5jZS9UcmFjayBOYW1lIChkb2N1bWVudGF0aW9uOiBodHRwOi8vd3d3LnRhNy5kZS90eHQvbXVzaWsvbXVzaTAwMDYuaHRtKVxuXHRcdFx0XHRcdFx0Y2FzZSAweDA2OiAgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIE1hcmtlclxuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkU3RyKG1ldGFFdmVudExlbmd0aCk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAweDIxOiBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBNSURJIFBPUlRcblx0XHRcdFx0XHRcdGNhc2UgMHg1OTogXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gS2V5IFNpZ25hdHVyZVxuXHRcdFx0XHRcdFx0Y2FzZSAweDUxOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFNldCBUZW1wb1xuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkSW50KG1ldGFFdmVudExlbmd0aCk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAweDU0OiBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBTTVBURSBPZmZzZXRcblx0XHRcdFx0XHRcdGNhc2UgMHg1ODogXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gVGltZSBTaWduYXR1cmVcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVx0ICAgPSBbXTtcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVswXSA9IGZpbGUucmVhZEludCgxKTtcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVsxXSA9IGZpbGUucmVhZEludCgxKTtcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVsyXSA9IGZpbGUucmVhZEludCgxKTtcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVszXSA9IGZpbGUucmVhZEludCgxKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0IDpcblx0XHRcdFx0XHRcdFx0ZmlsZS5yZWFkSW50KG1ldGFFdmVudExlbmd0aCk7XG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBmaWxlLnJlYWRJbnQobWV0YUV2ZW50TGVuZ3RoKTtcblx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuZGVidWcpIGNvbnNvbGUuaW5mbygnVW5pbXBsZW1lbnRlZCAweEZGIGV2ZW50ISBkYXRhIGJsb2NrIHJlYWRlZCBhcyBJbnRlZ2VyJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZXtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBNSURJIENvbnRyb2wgRXZlbnRzIE9SIFN5c3RlbSBFeGNsdXNpdmUgRXZlbnRzXG5cdFx0XHRcdFx0c3RhdHVzQnl0ZSA9IHN0YXR1c0J5dGUudG9TdHJpbmcoMTYpLnNwbGl0KCcnKTtcdFx0XHRcdC8vIHNwbGl0IHRoZSBzdGF0dXMgYnl0ZSBIRVggcmVwcmVzZW50YXRpb24sIHRvIG9idGFpbiA0IGJpdHMgdmFsdWVzXG5cdFx0XHRcdFx0aWYoIXN0YXR1c0J5dGVbMV0pIHN0YXR1c0J5dGUudW5zaGlmdCgnMCcpO1x0XHRcdFx0XHQvLyBmb3JjZSAyIGRpZ2l0c1xuXHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLnR5cGUgPSBwYXJzZUludChzdGF0dXNCeXRlWzBdLCAxNik7Ly8gZmlyc3QgYnl0ZSBpcyBFVkVOVCBUWVBFIElEXG5cdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uY2hhbm5lbCA9IHBhcnNlSW50KHN0YXR1c0J5dGVbMV0sIDE2KTsvLyBzZWNvbmQgYnl0ZSBpcyBjaGFubmVsXG5cdFx0XHRcdFx0c3dpdGNoKE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLnR5cGUpe1xuXHRcdFx0XHRcdFx0Y2FzZSAweEY6XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gU3lzdGVtIEV4Y2x1c2l2ZSBFdmVudHNcblx0XHRcdFx0XHRcdFx0dmFyIGV2ZW50X2xlbmd0aCA9IGZpbGUucmVhZEludFZMVigpO1xuXHRcdFx0XHRcdFx0XHRNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkSW50KGV2ZW50X2xlbmd0aCk7XG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLmRlYnVnKSBjb25zb2xlLmluZm8oJ1VuaW1wbGVtZW50ZWQgMHhGIGV4Y2x1c2l2ZSBldmVudHMhIGRhdGEgYmxvY2sgcmVhZGVkIGFzIEludGVnZXInKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDB4QTpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBOb3RlIEFmdGVydG91Y2hcblx0XHRcdFx0XHRcdGNhc2UgMHhCOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIENvbnRyb2xsZXJcblx0XHRcdFx0XHRcdGNhc2UgMHhFOlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFBpdGNoIEJlbmQgRXZlbnRcblx0XHRcdFx0XHRcdGNhc2UgMHg4Olx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIE5vdGUgb2ZmXG5cdFx0XHRcdFx0XHRjYXNlIDB4OTpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBOb3RlIE9uXG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBbXTtcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVswXSA9IGZpbGUucmVhZEludCgxKTtcblx0XHRcdFx0XHRcdFx0TUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVsxXSA9IGZpbGUucmVhZEludCgxKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDB4QzpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBQcm9ncmFtIENoYW5nZVxuXHRcdFx0XHRcdFx0Y2FzZSAweEQ6XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gQ2hhbm5lbCBBZnRlcnRvdWNoXG5cdFx0XHRcdFx0XHRcdE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBmaWxlLnJlYWRJbnQoMSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAtMTpcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBFT0Zcblx0XHRcdFx0XHRcdFx0ZW5kT2ZUcmFjayA9IHRydWU7XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2hhbmdlIEZMQUcgdG8gZm9yY2UgdHJhY2sgcmVhZGluZyBsb29wIGJyZWFraW5nXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybignVW5rbm93biBFVkVOVCBkZXRlY3RlZC4uLi4gcmVhZGluZyBjYW5jZWxsZWQhJyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIE1JREk7XG5cdH1cbn07XG5cblxuaWYodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gTUlESVBhcnNlcjtcbiIsImZ1bmN0aW9uIHBhcnNlTWlkaSgpIHtcblx0dmFyIGlucHV0RWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmaWxlLWlucHV0Jyk7XG5cdHZhciBmaWxlID0gaW5wdXRFbGVtLmZpbGVzWzBdO1xuXHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0dmFyIGNob3Jkc01hcCA9IHt9O1xuXG5cdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG5cdFx0dmFyIHVpbnQ4YXJyYXkgPSBuZXcgVWludDhBcnJheShlLnRhcmdldC5yZXN1bHQpO1xuXHRcdHZhciBwYXJzZWQgPSBNSURJUGFyc2VyLlVpbnQ4KHVpbnQ4YXJyYXkpO1xuXG5cdFx0Zm9yKHRyYWNrIG9mIHBhcnNlZC50cmFjaykge1xuXG5cdFx0XHR2YXIgZGVsdGFUaW1lID0gMDtcblx0XHRcdGZvcihldmVudCBvZiB0cmFjay5ldmVudCkge1xuXHRcdFx0XHRkZWx0YVRpbWUgKz0gZXZlbnQuZGVsdGFUaW1lO1xuXG5cdFx0XHRcdGlmKGV2ZW50LnR5cGUgPT09IDkpIHtcblx0XHRcdFx0XHRpZihkZWx0YVRpbWUgaW4gY2hvcmRzTWFwKSB7XG5cdFx0XHRcdFx0XHRjaG9yZHNNYXBbZGVsdGFUaW1lXS5wdXNoKGV2ZW50LmRhdGFbMF0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjaG9yZHNNYXBbZGVsdGFUaW1lXSA9IFtldmVudC5kYXRhWzBdXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zb2xlLmxvZyhjaG9yZHNNYXApO1xuXG5cdFx0bGV0IGFkZGVkQ2hvcmRzTWFwID0ge307XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoYWRkZWRDaG9yZHNNYXAsICdoYXNWYWx1ZUFycmF5Jywge1xuXHRcdFx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24oYXJyYXkpIHtcblx0XHRcdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpO1xuXHRcdFx0XHRjb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKHRoaXMpO1xuXG5cdFx0XHRcdGZvcihsZXQga2V5IG9mIGtleXMpIHtcblx0XHRcdFx0XHRpZihKU09OLnN0cmluZ2lmeSh0aGlzW2tleV0uc29ydCgpKSA9PT0gSlNPTi5zdHJpbmdpZnkoYXJyYXkuc29ydCgpKSkge1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0aGlzW2tleV0uc29ydCgpKSArICcgICAnICsgSlNPTi5zdHJpbmdpZnkoYXJyYXkuc29ydCgpKSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4ga2V5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGxldCBwcmV2O1xuXHRcdGxldCBleGlzdGluZ0Nob3JkS2V5O1xuXHRcdGxldCBuYkNob3JkcyA9IDA7XG5cdFx0bGV0IG5iU2FtZUNob3JkcyA9IDA7XG5cblx0XHQvL2ZvciBldmVyeSBldmVudCB0aW1lIGluIHRoZSBzb25nXG5cdFx0Zm9yKHZhciB0aW1lIGluIGNob3Jkc01hcCkge1xuXHRcdFx0bmJDaG9yZHMrKztcblxuXHRcdFx0Ly9pZiB0aGUgY2hvcmQgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCBmb3IgYW5vdGhlciB0aW1lLCBkb24ndCBjcmVhdGUgYSBuZXcgY2hvcmQgbWVzaFxuXHRcdFx0aWYoKGV4aXN0aW5nQ2hvcmRLZXkgPSBhZGRlZENob3Jkc01hcC5oYXNWYWx1ZUFycmF5KGNob3Jkc01hcFt0aW1lXSkpICE9IC0xKSB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coZXhpc3RpbmdDaG9yZEtleSk7XG5cdFx0XHRcdGNob3Jkc1t0aW1lXSA9IGNob3Jkc1tleGlzdGluZ0Nob3JkS2V5XTtcblx0XHRcdFx0bmJTYW1lQ2hvcmRzKys7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXQgbmV3Q2hvcmQgPSBuZXcgQ2hvcmQoY2hvcmRzTWFwW3RpbWVdKTtcblx0XHRcdFx0Ly9pZihwcmV2ID09IG51bGwgfHwgIXByZXYuZXF1YWxzKG5ld0Nob3JkKSlcblx0XHRcdFx0Y2hvcmRzW3RpbWVdID0gbmV3Q2hvcmQ7XG5cdFx0XHRcdGFkZGVkQ2hvcmRzTWFwW3RpbWVdID0gY2hvcmRzTWFwW3RpbWVdO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly9wcmV2ID0gbmV3Q2hvcmQ7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9XG5cblx0XHRjb25zb2xlLmxvZygnbmJDaG9yZHMgOiAnK25iQ2hvcmRzKTtcblx0XHRjb25zb2xlLmxvZygnbmJTYW1lQ2hvcmRzIDogJytuYlNhbWVDaG9yZHMpO1xuXG5cblx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKGNob3Jkcyk7XG5cdFx0Y3JlYXRlU2xpZGVyKHBhcnNlSW50KGtleXNbMF0pLCBwYXJzZUludChrZXlzW2tleXMubGVuZ3RoLTFdKSk7XG5cdFx0Y29uc29sZS5sb2coY2hvcmRzKTtcblx0XHQvL2RyYXdDaG9yZHMobG93Qm91bmQsIHVwQm91bmQpO1xuXHRcdFxuXHR9IFxuXG5cdHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihmaWxlKTsgXG59IiwiXHJcblxyXG5mdW5jdGlvbiB0ZXN0cHkoKSB7XHJcblx0dmFyIHJlc3VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHQnKSxcclxuICAgICAgICBzZW50X3R4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0eHQtaW5wdXQnKS52YWx1ZTtcclxuXHJcbiAgICB3cy5zZW5kKHNlbnRfdHh0KTtcclxuXHJcbiAgICB3cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICByZXN1bHQuaW5uZXJIVE1MID0gZXZlbnQuZGF0YTtcclxuXHJcbiAgICAgICAgLyp2YXIgbWVzc2FnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSxcclxuICAgICAgICAgICAgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyksXHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShldmVudC5kYXRhKTtcclxuICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICAgIG1lc3NhZ2VzLmFwcGVuZENoaWxkKG1lc3NhZ2UpOyovXHJcblxyXG4gICAgfTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdweXRob24tdGVzdCcpLmFwcGVuZENoaWxkKHJlc3VsdCk7XHJcbn0iLCIvKmZ1bmN0aW9uIG1pZGlUb1B5KCkge1xuXHR2YXIgaW5wdXRFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpbGUtaW5wdXQnKTtcblx0dmFyIGZpbGUgPSBpbnB1dEVsZW0uZmlsZXNbMF07XG5cdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG5cdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldnQpIHtcblx0XHR3cy5zZW5kKGV2dC50YXJnZXQucmVzdWx0KTtcblx0fVxuXG5cdHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuXG5cbn1cblxud3Mub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0Y29uc29sZS5sb2coJ3BhcnNpbmcganNvbi4uLicpO1xuXHR2YXIgaW5wdXRDaG9yZHMgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuXHRjb25zb2xlLmxvZygnanNvbiBwYXJzZWQnKTtcblx0Y29uc29sZS5sb2coJ2NyZWF0aW5nIGNob3JkcycpO1xuXHRmb3IodmFyIGlDaG9yZCBpbiBpbnB1dENob3Jkcykge1xuXHRcdHZhciBjaG9yZCA9IG5ldyBDaG9yZChpbnB1dENob3Jkc1tpQ2hvcmRdKTtcblx0XHRjaG9yZHMucHVzaChjaG9yZCk7XG5cdH1cblx0Y29uc29sZS5sb2coJ2Nob3JkcyBjcmVhdGVkJyk7XG5cblx0ZHJhd0Nob3Jkcyg1LCA2KTtcbn0qLyIsImZ1bmN0aW9uIGNyZWF0ZVNsaWRlcihmcm9tLCB0bykge1xyXG5cdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzbGlkZXInKTtcclxuXHRsZXQgbG93Qm91bmQgPSBmcm9tO1xyXG5cdGxldCB1cEJvdW5kID0gdG8vMTA7XHJcblxyXG5cdG5vVWlTbGlkZXIuY3JlYXRlKHNsaWRlciwge1xyXG5cdFx0c3RhcnQ6IFsgMCwgNTAwIF0sXHJcblx0XHRjb25uZWN0OiB0cnVlLFxyXG5cdFx0dG9vbHRpcHM6IFsgdHJ1ZSwgdHJ1ZSBdLFxyXG5cdFx0cmFuZ2U6IHtcclxuXHRcdFx0J21pbic6IGZyb20sXHJcblx0XHRcdCdtYXgnOiB0b1xyXG5cdFx0fSxcclxuXHRcdGZvcm1hdDogd051bWIoe1xyXG5cdFx0XHRkZWNpbWFsczogMFxyXG5cdFx0fSlcclxuXHR9KTtcclxuXHJcblx0ZHJhd0Nob3Jkcyhsb3dCb3VuZCwgdXBCb3VuZCk7XHJcblxyXG5cdHNsaWRlci5ub1VpU2xpZGVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbih2YWx1ZXMsIGhhbmRsZSkge1xyXG5cdFx0dmFyIHZhbHVlID0gdmFsdWVzW2hhbmRsZV07XHJcblxyXG5cdFx0aWYoaGFuZGxlID09PSAxKSB7XHJcblx0XHRcdHVwQm91bmQgPSBwYXJzZUludCh2YWx1ZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsb3dCb3VuZCA9IHBhcnNlSW50KHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0ZHJhd0Nob3Jkcyhsb3dCb3VuZCwgdXBCb3VuZCk7XHJcblx0fSk7XHJcblxyXG5cclxuXHRcclxufSIsIi8qISBub3Vpc2xpZGVyIC0gMTEuMS4wIC0gMjAxOC0wNC0wMiAxMToxODoxMyAqL1xuXG4hZnVuY3Rpb24oYSl7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxhKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1hKCk6d2luZG93Lm5vVWlTbGlkZXI9YSgpfShmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGEoYSl7cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIGEmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEudG8mJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEuZnJvbX1mdW5jdGlvbiBiKGEpe2EucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChhKX1mdW5jdGlvbiBjKGEpe3JldHVybiBudWxsIT09YSYmdm9pZCAwIT09YX1mdW5jdGlvbiBkKGEpe2EucHJldmVudERlZmF1bHQoKX1mdW5jdGlvbiBlKGEpe3JldHVybiBhLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4hdGhpc1thXSYmKHRoaXNbYV09ITApfSx7fSl9ZnVuY3Rpb24gZihhLGIpe3JldHVybiBNYXRoLnJvdW5kKGEvYikqYn1mdW5jdGlvbiBnKGEsYil7dmFyIGM9YS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxkPWEub3duZXJEb2N1bWVudCxlPWQuZG9jdW1lbnRFbGVtZW50LGY9cChkKTtyZXR1cm4vd2Via2l0LipDaHJvbWUuKk1vYmlsZS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkmJihmLng9MCksYj9jLnRvcCtmLnktZS5jbGllbnRUb3A6Yy5sZWZ0K2YueC1lLmNsaWVudExlZnR9ZnVuY3Rpb24gaChhKXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgYSYmIWlzTmFOKGEpJiZpc0Zpbml0ZShhKX1mdW5jdGlvbiBpKGEsYixjKXtjPjAmJihtKGEsYiksc2V0VGltZW91dChmdW5jdGlvbigpe24oYSxiKX0sYykpfWZ1bmN0aW9uIGooYSl7cmV0dXJuIE1hdGgubWF4KE1hdGgubWluKGEsMTAwKSwwKX1mdW5jdGlvbiBrKGEpe3JldHVybiBBcnJheS5pc0FycmF5KGEpP2E6W2FdfWZ1bmN0aW9uIGwoYSl7YT1TdHJpbmcoYSk7dmFyIGI9YS5zcGxpdChcIi5cIik7cmV0dXJuIGIubGVuZ3RoPjE/YlsxXS5sZW5ndGg6MH1mdW5jdGlvbiBtKGEsYil7YS5jbGFzc0xpc3Q/YS5jbGFzc0xpc3QuYWRkKGIpOmEuY2xhc3NOYW1lKz1cIiBcIitifWZ1bmN0aW9uIG4oYSxiKXthLmNsYXNzTGlzdD9hLmNsYXNzTGlzdC5yZW1vdmUoYik6YS5jbGFzc05hbWU9YS5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58XFxcXGIpXCIrYi5zcGxpdChcIiBcIikuam9pbihcInxcIikrXCIoXFxcXGJ8JClcIixcImdpXCIpLFwiIFwiKX1mdW5jdGlvbiBvKGEsYil7cmV0dXJuIGEuY2xhc3NMaXN0P2EuY2xhc3NMaXN0LmNvbnRhaW5zKGIpOm5ldyBSZWdFeHAoXCJcXFxcYlwiK2IrXCJcXFxcYlwiKS50ZXN0KGEuY2xhc3NOYW1lKX1mdW5jdGlvbiBwKGEpe3ZhciBiPXZvaWQgMCE9PXdpbmRvdy5wYWdlWE9mZnNldCxjPVwiQ1NTMUNvbXBhdFwiPT09KGEuY29tcGF0TW9kZXx8XCJcIik7cmV0dXJue3g6Yj93aW5kb3cucGFnZVhPZmZzZXQ6Yz9hLmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0OmEuYm9keS5zY3JvbGxMZWZ0LHk6Yj93aW5kb3cucGFnZVlPZmZzZXQ6Yz9hLmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A6YS5ib2R5LnNjcm9sbFRvcH19ZnVuY3Rpb24gcSgpe3JldHVybiB3aW5kb3cubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkP3tzdGFydDpcInBvaW50ZXJkb3duXCIsbW92ZTpcInBvaW50ZXJtb3ZlXCIsZW5kOlwicG9pbnRlcnVwXCJ9OndpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZD97c3RhcnQ6XCJNU1BvaW50ZXJEb3duXCIsbW92ZTpcIk1TUG9pbnRlck1vdmVcIixlbmQ6XCJNU1BvaW50ZXJVcFwifTp7c3RhcnQ6XCJtb3VzZWRvd24gdG91Y2hzdGFydFwiLG1vdmU6XCJtb3VzZW1vdmUgdG91Y2htb3ZlXCIsZW5kOlwibW91c2V1cCB0b3VjaGVuZFwifX1mdW5jdGlvbiByKCl7dmFyIGE9ITE7dHJ5e3ZhciBiPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSxcInBhc3NpdmVcIix7Z2V0OmZ1bmN0aW9uKCl7YT0hMH19KTt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRlc3RcIixudWxsLGIpfWNhdGNoKGEpe31yZXR1cm4gYX1mdW5jdGlvbiBzKCl7cmV0dXJuIHdpbmRvdy5DU1MmJkNTUy5zdXBwb3J0cyYmQ1NTLnN1cHBvcnRzKFwidG91Y2gtYWN0aW9uXCIsXCJub25lXCIpfWZ1bmN0aW9uIHQoYSxiKXtyZXR1cm4gMTAwLyhiLWEpfWZ1bmN0aW9uIHUoYSxiKXtyZXR1cm4gMTAwKmIvKGFbMV0tYVswXSl9ZnVuY3Rpb24gdihhLGIpe3JldHVybiB1KGEsYVswXTwwP2IrTWF0aC5hYnMoYVswXSk6Yi1hWzBdKX1mdW5jdGlvbiB3KGEsYil7cmV0dXJuIGIqKGFbMV0tYVswXSkvMTAwK2FbMF19ZnVuY3Rpb24geChhLGIpe2Zvcih2YXIgYz0xO2E+PWJbY107KWMrPTE7cmV0dXJuIGN9ZnVuY3Rpb24geShhLGIsYyl7aWYoYz49YS5zbGljZSgtMSlbMF0pcmV0dXJuIDEwMDt2YXIgZD14KGMsYSksZT1hW2QtMV0sZj1hW2RdLGc9YltkLTFdLGg9YltkXTtyZXR1cm4gZyt2KFtlLGZdLGMpL3QoZyxoKX1mdW5jdGlvbiB6KGEsYixjKXtpZihjPj0xMDApcmV0dXJuIGEuc2xpY2UoLTEpWzBdO3ZhciBkPXgoYyxiKSxlPWFbZC0xXSxmPWFbZF0sZz1iW2QtMV07cmV0dXJuIHcoW2UsZl0sKGMtZykqdChnLGJbZF0pKX1mdW5jdGlvbiBBKGEsYixjLGQpe2lmKDEwMD09PWQpcmV0dXJuIGQ7dmFyIGU9eChkLGEpLGc9YVtlLTFdLGg9YVtlXTtyZXR1cm4gYz9kLWc+KGgtZykvMj9oOmc6YltlLTFdP2FbZS0xXStmKGQtYVtlLTFdLGJbZS0xXSk6ZH1mdW5jdGlvbiBCKGEsYixjKXt2YXIgZDtpZihcIm51bWJlclwiPT10eXBlb2YgYiYmKGI9W2JdKSwhQXJyYXkuaXNBcnJheShiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3JhbmdlJyBjb250YWlucyBpbnZhbGlkIHZhbHVlLlwiKTtpZihkPVwibWluXCI9PT1hPzA6XCJtYXhcIj09PWE/MTAwOnBhcnNlRmxvYXQoYSksIWgoZCl8fCFoKGJbMF0pKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncmFuZ2UnIHZhbHVlIGlzbid0IG51bWVyaWMuXCIpO2MueFBjdC5wdXNoKGQpLGMueFZhbC5wdXNoKGJbMF0pLGQ/Yy54U3RlcHMucHVzaCghaXNOYU4oYlsxXSkmJmJbMV0pOmlzTmFOKGJbMV0pfHwoYy54U3RlcHNbMF09YlsxXSksYy54SGlnaGVzdENvbXBsZXRlU3RlcC5wdXNoKDApfWZ1bmN0aW9uIEMoYSxiLGMpe2lmKCFiKXJldHVybiEwO2MueFN0ZXBzW2FdPXUoW2MueFZhbFthXSxjLnhWYWxbYSsxXV0sYikvdChjLnhQY3RbYV0sYy54UGN0W2ErMV0pO3ZhciBkPShjLnhWYWxbYSsxXS1jLnhWYWxbYV0pL2MueE51bVN0ZXBzW2FdLGU9TWF0aC5jZWlsKE51bWJlcihkLnRvRml4ZWQoMykpLTEpLGY9Yy54VmFsW2FdK2MueE51bVN0ZXBzW2FdKmU7Yy54SGlnaGVzdENvbXBsZXRlU3RlcFthXT1mfWZ1bmN0aW9uIEQoYSxiLGMpe3RoaXMueFBjdD1bXSx0aGlzLnhWYWw9W10sdGhpcy54U3RlcHM9W2N8fCExXSx0aGlzLnhOdW1TdGVwcz1bITFdLHRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXA9W10sdGhpcy5zbmFwPWI7dmFyIGQsZT1bXTtmb3IoZCBpbiBhKWEuaGFzT3duUHJvcGVydHkoZCkmJmUucHVzaChbYVtkXSxkXSk7Zm9yKGUubGVuZ3RoJiZcIm9iamVjdFwiPT10eXBlb2YgZVswXVswXT9lLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYVswXVswXS1iWzBdWzBdfSk6ZS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGFbMF0tYlswXX0pLGQ9MDtkPGUubGVuZ3RoO2QrKylCKGVbZF1bMV0sZVtkXVswXSx0aGlzKTtmb3IodGhpcy54TnVtU3RlcHM9dGhpcy54U3RlcHMuc2xpY2UoMCksZD0wO2Q8dGhpcy54TnVtU3RlcHMubGVuZ3RoO2QrKylDKGQsdGhpcy54TnVtU3RlcHNbZF0sdGhpcyl9ZnVuY3Rpb24gRShiKXtpZihhKGIpKXJldHVybiEwO3Rocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnZm9ybWF0JyByZXF1aXJlcyAndG8nIGFuZCAnZnJvbScgbWV0aG9kcy5cIil9ZnVuY3Rpb24gRihhLGIpe2lmKCFoKGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnc3RlcCcgaXMgbm90IG51bWVyaWMuXCIpO2Euc2luZ2xlU3RlcD1ifWZ1bmN0aW9uIEcoYSxiKXtpZihcIm9iamVjdFwiIT10eXBlb2YgYnx8QXJyYXkuaXNBcnJheShiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3JhbmdlJyBpcyBub3QgYW4gb2JqZWN0LlwiKTtpZih2b2lkIDA9PT1iLm1pbnx8dm9pZCAwPT09Yi5tYXgpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6IE1pc3NpbmcgJ21pbicgb3IgJ21heCcgaW4gJ3JhbmdlJy5cIik7aWYoYi5taW49PT1iLm1heCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3JhbmdlJyAnbWluJyBhbmQgJ21heCcgY2Fubm90IGJlIGVxdWFsLlwiKTthLnNwZWN0cnVtPW5ldyBEKGIsYS5zbmFwLGEuc2luZ2xlU3RlcCl9ZnVuY3Rpb24gSChhLGIpe2lmKGI9ayhiKSwhQXJyYXkuaXNBcnJheShiKXx8IWIubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnc3RhcnQnIG9wdGlvbiBpcyBpbmNvcnJlY3QuXCIpO2EuaGFuZGxlcz1iLmxlbmd0aCxhLnN0YXJ0PWJ9ZnVuY3Rpb24gSShhLGIpe2lmKGEuc25hcD1iLFwiYm9vbGVhblwiIT10eXBlb2YgYil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3NuYXAnIG9wdGlvbiBtdXN0IGJlIGEgYm9vbGVhbi5cIil9ZnVuY3Rpb24gSihhLGIpe2lmKGEuYW5pbWF0ZT1iLFwiYm9vbGVhblwiIT10eXBlb2YgYil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2FuaW1hdGUnIG9wdGlvbiBtdXN0IGJlIGEgYm9vbGVhbi5cIil9ZnVuY3Rpb24gSyhhLGIpe2lmKGEuYW5pbWF0aW9uRHVyYXRpb249YixcIm51bWJlclwiIT10eXBlb2YgYil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2FuaW1hdGlvbkR1cmF0aW9uJyBvcHRpb24gbXVzdCBiZSBhIG51bWJlci5cIil9ZnVuY3Rpb24gTChhLGIpe3ZhciBjLGQ9WyExXTtpZihcImxvd2VyXCI9PT1iP2I9WyEwLCExXTpcInVwcGVyXCI9PT1iJiYoYj1bITEsITBdKSwhMD09PWJ8fCExPT09Yil7Zm9yKGM9MTtjPGEuaGFuZGxlcztjKyspZC5wdXNoKGIpO2QucHVzaCghMSl9ZWxzZXtpZighQXJyYXkuaXNBcnJheShiKXx8IWIubGVuZ3RofHxiLmxlbmd0aCE9PWEuaGFuZGxlcysxKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnY29ubmVjdCcgb3B0aW9uIGRvZXNuJ3QgbWF0Y2ggaGFuZGxlIGNvdW50LlwiKTtkPWJ9YS5jb25uZWN0PWR9ZnVuY3Rpb24gTShhLGIpe3N3aXRjaChiKXtjYXNlXCJob3Jpem9udGFsXCI6YS5vcnQ9MDticmVhaztjYXNlXCJ2ZXJ0aWNhbFwiOmEub3J0PTE7YnJlYWs7ZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ29yaWVudGF0aW9uJyBvcHRpb24gaXMgaW52YWxpZC5cIil9fWZ1bmN0aW9uIE4oYSxiKXtpZighaChiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ21hcmdpbicgb3B0aW9uIG11c3QgYmUgbnVtZXJpYy5cIik7aWYoMCE9PWImJihhLm1hcmdpbj1hLnNwZWN0cnVtLmdldE1hcmdpbihiKSwhYS5tYXJnaW4pKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbWFyZ2luJyBvcHRpb24gaXMgb25seSBzdXBwb3J0ZWQgb24gbGluZWFyIHNsaWRlcnMuXCIpfWZ1bmN0aW9uIE8oYSxiKXtpZighaChiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2xpbWl0JyBvcHRpb24gbXVzdCBiZSBudW1lcmljLlwiKTtpZihhLmxpbWl0PWEuc3BlY3RydW0uZ2V0TWFyZ2luKGIpLCFhLmxpbWl0fHxhLmhhbmRsZXM8Mil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2xpbWl0JyBvcHRpb24gaXMgb25seSBzdXBwb3J0ZWQgb24gbGluZWFyIHNsaWRlcnMgd2l0aCAyIG9yIG1vcmUgaGFuZGxlcy5cIil9ZnVuY3Rpb24gUChhLGIpe2lmKCFoKGIpJiYhQXJyYXkuaXNBcnJheShiKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMgb3IgYXJyYXkgb2YgZXhhY3RseSAyIG51bWJlcnMuXCIpO2lmKEFycmF5LmlzQXJyYXkoYikmJjIhPT1iLmxlbmd0aCYmIWgoYlswXSkmJiFoKGJbMV0pKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncGFkZGluZycgb3B0aW9uIG11c3QgYmUgbnVtZXJpYyBvciBhcnJheSBvZiBleGFjdGx5IDIgbnVtYmVycy5cIik7aWYoMCE9PWIpe2lmKEFycmF5LmlzQXJyYXkoYil8fChiPVtiLGJdKSxhLnBhZGRpbmc9W2Euc3BlY3RydW0uZ2V0TWFyZ2luKGJbMF0pLGEuc3BlY3RydW0uZ2V0TWFyZ2luKGJbMV0pXSwhMT09PWEucGFkZGluZ1swXXx8ITE9PT1hLnBhZGRpbmdbMV0pdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdwYWRkaW5nJyBvcHRpb24gaXMgb25seSBzdXBwb3J0ZWQgb24gbGluZWFyIHNsaWRlcnMuXCIpO2lmKGEucGFkZGluZ1swXTwwfHxhLnBhZGRpbmdbMV08MCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyKHMpLlwiKTtpZihhLnBhZGRpbmdbMF0rYS5wYWRkaW5nWzFdPj0xMDApdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdwYWRkaW5nJyBvcHRpb24gbXVzdCBub3QgZXhjZWVkIDEwMCUgb2YgdGhlIHJhbmdlLlwiKX19ZnVuY3Rpb24gUShhLGIpe3N3aXRjaChiKXtjYXNlXCJsdHJcIjphLmRpcj0wO2JyZWFrO2Nhc2VcInJ0bFwiOmEuZGlyPTE7YnJlYWs7ZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2RpcmVjdGlvbicgb3B0aW9uIHdhcyBub3QgcmVjb2duaXplZC5cIil9fWZ1bmN0aW9uIFIoYSxiKXtpZihcInN0cmluZ1wiIT10eXBlb2YgYil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2JlaGF2aW91cicgbXVzdCBiZSBhIHN0cmluZyBjb250YWluaW5nIG9wdGlvbnMuXCIpO3ZhciBjPWIuaW5kZXhPZihcInRhcFwiKT49MCxkPWIuaW5kZXhPZihcImRyYWdcIik+PTAsZT1iLmluZGV4T2YoXCJmaXhlZFwiKT49MCxmPWIuaW5kZXhPZihcInNuYXBcIik+PTAsZz1iLmluZGV4T2YoXCJob3ZlclwiKT49MDtpZihlKXtpZigyIT09YS5oYW5kbGVzKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnZml4ZWQnIGJlaGF2aW91ciBtdXN0IGJlIHVzZWQgd2l0aCAyIGhhbmRsZXNcIik7TihhLGEuc3RhcnRbMV0tYS5zdGFydFswXSl9YS5ldmVudHM9e3RhcDpjfHxmLGRyYWc6ZCxmaXhlZDplLHNuYXA6Zixob3ZlcjpnfX1mdW5jdGlvbiBTKGEsYil7aWYoITEhPT1iKWlmKCEwPT09Yil7YS50b29sdGlwcz1bXTtmb3IodmFyIGM9MDtjPGEuaGFuZGxlcztjKyspYS50b29sdGlwcy5wdXNoKCEwKX1lbHNle2lmKGEudG9vbHRpcHM9ayhiKSxhLnRvb2x0aXBzLmxlbmd0aCE9PWEuaGFuZGxlcyl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogbXVzdCBwYXNzIGEgZm9ybWF0dGVyIGZvciBhbGwgaGFuZGxlcy5cIik7YS50b29sdGlwcy5mb3JFYWNoKGZ1bmN0aW9uKGEpe2lmKFwiYm9vbGVhblwiIT10eXBlb2YgYSYmKFwib2JqZWN0XCIhPXR5cGVvZiBhfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBhLnRvKSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3Rvb2x0aXBzJyBtdXN0IGJlIHBhc3NlZCBhIGZvcm1hdHRlciBvciAnZmFsc2UnLlwiKX0pfX1mdW5jdGlvbiBUKGEsYil7YS5hcmlhRm9ybWF0PWIsRShiKX1mdW5jdGlvbiBVKGEsYil7YS5mb3JtYXQ9YixFKGIpfWZ1bmN0aW9uIFYoYSxiKXtpZihcInN0cmluZ1wiIT10eXBlb2YgYiYmITEhPT1iKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnY3NzUHJlZml4JyBtdXN0IGJlIGEgc3RyaW5nIG9yIGBmYWxzZWAuXCIpO2EuY3NzUHJlZml4PWJ9ZnVuY3Rpb24gVyhhLGIpe2lmKFwib2JqZWN0XCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnY3NzQ2xhc3NlcycgbXVzdCBiZSBhbiBvYmplY3QuXCIpO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBhLmNzc1ByZWZpeCl7YS5jc3NDbGFzc2VzPXt9O2Zvcih2YXIgYyBpbiBiKWIuaGFzT3duUHJvcGVydHkoYykmJihhLmNzc0NsYXNzZXNbY109YS5jc3NQcmVmaXgrYltjXSl9ZWxzZSBhLmNzc0NsYXNzZXM9Yn1mdW5jdGlvbiBYKGEpe3ZhciBiPXttYXJnaW46MCxsaW1pdDowLHBhZGRpbmc6MCxhbmltYXRlOiEwLGFuaW1hdGlvbkR1cmF0aW9uOjMwMCxhcmlhRm9ybWF0Ol8sZm9ybWF0Ol99LGQ9e3N0ZXA6e3I6ITEsdDpGfSxzdGFydDp7cjohMCx0Okh9LGNvbm5lY3Q6e3I6ITAsdDpMfSxkaXJlY3Rpb246e3I6ITAsdDpRfSxzbmFwOntyOiExLHQ6SX0sYW5pbWF0ZTp7cjohMSx0Okp9LGFuaW1hdGlvbkR1cmF0aW9uOntyOiExLHQ6S30scmFuZ2U6e3I6ITAsdDpHfSxvcmllbnRhdGlvbjp7cjohMSx0Ok19LG1hcmdpbjp7cjohMSx0Ok59LGxpbWl0OntyOiExLHQ6T30scGFkZGluZzp7cjohMSx0OlB9LGJlaGF2aW91cjp7cjohMCx0OlJ9LGFyaWFGb3JtYXQ6e3I6ITEsdDpUfSxmb3JtYXQ6e3I6ITEsdDpVfSx0b29sdGlwczp7cjohMSx0OlN9LGNzc1ByZWZpeDp7cjohMCx0OlZ9LGNzc0NsYXNzZXM6e3I6ITAsdDpXfX0sZT17Y29ubmVjdDohMSxkaXJlY3Rpb246XCJsdHJcIixiZWhhdmlvdXI6XCJ0YXBcIixvcmllbnRhdGlvbjpcImhvcml6b250YWxcIixjc3NQcmVmaXg6XCJub1VpLVwiLGNzc0NsYXNzZXM6e3RhcmdldDpcInRhcmdldFwiLGJhc2U6XCJiYXNlXCIsb3JpZ2luOlwib3JpZ2luXCIsaGFuZGxlOlwiaGFuZGxlXCIsaGFuZGxlTG93ZXI6XCJoYW5kbGUtbG93ZXJcIixoYW5kbGVVcHBlcjpcImhhbmRsZS11cHBlclwiLGhvcml6b250YWw6XCJob3Jpem9udGFsXCIsdmVydGljYWw6XCJ2ZXJ0aWNhbFwiLGJhY2tncm91bmQ6XCJiYWNrZ3JvdW5kXCIsY29ubmVjdDpcImNvbm5lY3RcIixjb25uZWN0czpcImNvbm5lY3RzXCIsbHRyOlwibHRyXCIscnRsOlwicnRsXCIsZHJhZ2dhYmxlOlwiZHJhZ2dhYmxlXCIsZHJhZzpcInN0YXRlLWRyYWdcIix0YXA6XCJzdGF0ZS10YXBcIixhY3RpdmU6XCJhY3RpdmVcIix0b29sdGlwOlwidG9vbHRpcFwiLHBpcHM6XCJwaXBzXCIscGlwc0hvcml6b250YWw6XCJwaXBzLWhvcml6b250YWxcIixwaXBzVmVydGljYWw6XCJwaXBzLXZlcnRpY2FsXCIsbWFya2VyOlwibWFya2VyXCIsbWFya2VySG9yaXpvbnRhbDpcIm1hcmtlci1ob3Jpem9udGFsXCIsbWFya2VyVmVydGljYWw6XCJtYXJrZXItdmVydGljYWxcIixtYXJrZXJOb3JtYWw6XCJtYXJrZXItbm9ybWFsXCIsbWFya2VyTGFyZ2U6XCJtYXJrZXItbGFyZ2VcIixtYXJrZXJTdWI6XCJtYXJrZXItc3ViXCIsdmFsdWU6XCJ2YWx1ZVwiLHZhbHVlSG9yaXpvbnRhbDpcInZhbHVlLWhvcml6b250YWxcIix2YWx1ZVZlcnRpY2FsOlwidmFsdWUtdmVydGljYWxcIix2YWx1ZU5vcm1hbDpcInZhbHVlLW5vcm1hbFwiLHZhbHVlTGFyZ2U6XCJ2YWx1ZS1sYXJnZVwiLHZhbHVlU3ViOlwidmFsdWUtc3ViXCJ9fTthLmZvcm1hdCYmIWEuYXJpYUZvcm1hdCYmKGEuYXJpYUZvcm1hdD1hLmZvcm1hdCksT2JqZWN0LmtleXMoZCkuZm9yRWFjaChmdW5jdGlvbihmKXtpZighYyhhW2ZdKSYmdm9pZCAwPT09ZVtmXSl7aWYoZFtmXS5yKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnXCIrZitcIicgaXMgcmVxdWlyZWQuXCIpO3JldHVybiEwfWRbZl0udChiLGMoYVtmXSk/YVtmXTplW2ZdKX0pLGIucGlwcz1hLnBpcHM7dmFyIGY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxnPXZvaWQgMCE9PWYuc3R5bGUubXNUcmFuc2Zvcm0saD12b2lkIDAhPT1mLnN0eWxlLnRyYW5zZm9ybTtiLnRyYW5zZm9ybVJ1bGU9aD9cInRyYW5zZm9ybVwiOmc/XCJtc1RyYW5zZm9ybVwiOlwid2Via2l0VHJhbnNmb3JtXCI7dmFyIGk9W1tcImxlZnRcIixcInRvcFwiXSxbXCJyaWdodFwiLFwiYm90dG9tXCJdXTtyZXR1cm4gYi5zdHlsZT1pW2IuZGlyXVtiLm9ydF0sYn1mdW5jdGlvbiBZKGEsYyxmKXtmdW5jdGlvbiBoKGEsYil7dmFyIGM9eWEuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm4gYiYmbShjLGIpLGEuYXBwZW5kQ2hpbGQoYyksY31mdW5jdGlvbiBsKGEsYil7dmFyIGQ9aChhLGMuY3NzQ2xhc3Nlcy5vcmlnaW4pLGU9aChkLGMuY3NzQ2xhc3Nlcy5oYW5kbGUpO3JldHVybiBlLnNldEF0dHJpYnV0ZShcImRhdGEtaGFuZGxlXCIsYiksZS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLFwiMFwiKSxlLnNldEF0dHJpYnV0ZShcInJvbGVcIixcInNsaWRlclwiKSxlLnNldEF0dHJpYnV0ZShcImFyaWEtb3JpZW50YXRpb25cIixjLm9ydD9cInZlcnRpY2FsXCI6XCJob3Jpem9udGFsXCIpLDA9PT1iP20oZSxjLmNzc0NsYXNzZXMuaGFuZGxlTG93ZXIpOmI9PT1jLmhhbmRsZXMtMSYmbShlLGMuY3NzQ2xhc3Nlcy5oYW5kbGVVcHBlciksZH1mdW5jdGlvbiB0KGEsYil7cmV0dXJuISFiJiZoKGEsYy5jc3NDbGFzc2VzLmNvbm5lY3QpfWZ1bmN0aW9uIHUoYSxiKXt2YXIgZD1oKGIsYy5jc3NDbGFzc2VzLmNvbm5lY3RzKTtrYT1bXSxsYT1bXSxsYS5wdXNoKHQoZCxhWzBdKSk7Zm9yKHZhciBlPTA7ZTxjLmhhbmRsZXM7ZSsrKWthLnB1c2gobChiLGUpKSx0YVtlXT1lLGxhLnB1c2godChkLGFbZSsxXSkpfWZ1bmN0aW9uIHYoYSl7bShhLGMuY3NzQ2xhc3Nlcy50YXJnZXQpLDA9PT1jLmRpcj9tKGEsYy5jc3NDbGFzc2VzLmx0cik6bShhLGMuY3NzQ2xhc3Nlcy5ydGwpLDA9PT1jLm9ydD9tKGEsYy5jc3NDbGFzc2VzLmhvcml6b250YWwpOm0oYSxjLmNzc0NsYXNzZXMudmVydGljYWwpLGphPWgoYSxjLmNzc0NsYXNzZXMuYmFzZSl9ZnVuY3Rpb24gdyhhLGIpe3JldHVybiEhYy50b29sdGlwc1tiXSYmaChhLmZpcnN0Q2hpbGQsYy5jc3NDbGFzc2VzLnRvb2x0aXApfWZ1bmN0aW9uIHgoKXt2YXIgYT1rYS5tYXAodyk7UShcInVwZGF0ZVwiLGZ1bmN0aW9uKGIsZCxlKXtpZihhW2RdKXt2YXIgZj1iW2RdOyEwIT09Yy50b29sdGlwc1tkXSYmKGY9Yy50b29sdGlwc1tkXS50byhlW2RdKSksYVtkXS5pbm5lckhUTUw9Zn19KX1mdW5jdGlvbiB5KCl7UShcInVwZGF0ZVwiLGZ1bmN0aW9uKGEsYixkLGUsZil7dGEuZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgYj1rYVthXSxlPVUoc2EsYSwwLCEwLCEwLCEwKSxnPVUoc2EsYSwxMDAsITAsITAsITApLGg9ZlthXSxpPWMuYXJpYUZvcm1hdC50byhkW2FdKTtiLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWVtaW5cIixlLnRvRml4ZWQoMSkpLGIuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW1heFwiLGcudG9GaXhlZCgxKSksYi5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbm93XCIsaC50b0ZpeGVkKDEpKSxiLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWV0ZXh0XCIsaSl9KX0pfWZ1bmN0aW9uIHooYSxiLGMpe2lmKFwicmFuZ2VcIj09PWF8fFwic3RlcHNcIj09PWEpcmV0dXJuIHZhLnhWYWw7aWYoXCJjb3VudFwiPT09YSl7aWYoYjwyKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAndmFsdWVzJyAoPj0gMikgcmVxdWlyZWQgZm9yIG1vZGUgJ2NvdW50Jy5cIik7dmFyIGQ9Yi0xLGU9MTAwL2Q7Zm9yKGI9W107ZC0tOyliW2RdPWQqZTtiLnB1c2goMTAwKSxhPVwicG9zaXRpb25zXCJ9cmV0dXJuXCJwb3NpdGlvbnNcIj09PWE/Yi5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIHZhLmZyb21TdGVwcGluZyhjP3ZhLmdldFN0ZXAoYSk6YSl9KTpcInZhbHVlc1wiPT09YT9jP2IubWFwKGZ1bmN0aW9uKGEpe3JldHVybiB2YS5mcm9tU3RlcHBpbmcodmEuZ2V0U3RlcCh2YS50b1N0ZXBwaW5nKGEpKSl9KTpiOnZvaWQgMH1mdW5jdGlvbiBBKGEsYixjKXtmdW5jdGlvbiBkKGEsYil7cmV0dXJuKGErYikudG9GaXhlZCg3KS8xfXZhciBmPXt9LGc9dmEueFZhbFswXSxoPXZhLnhWYWxbdmEueFZhbC5sZW5ndGgtMV0saT0hMSxqPSExLGs9MDtyZXR1cm4gYz1lKGMuc2xpY2UoKS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEtYn0pKSxjWzBdIT09ZyYmKGMudW5zaGlmdChnKSxpPSEwKSxjW2MubGVuZ3RoLTFdIT09aCYmKGMucHVzaChoKSxqPSEwKSxjLmZvckVhY2goZnVuY3Rpb24oZSxnKXt2YXIgaCxsLG0sbixvLHAscSxyLHMsdCx1PWUsdj1jW2crMV07aWYoXCJzdGVwc1wiPT09YiYmKGg9dmEueE51bVN0ZXBzW2ddKSxofHwoaD12LXUpLCExIT09dSYmdm9pZCAwIT09dilmb3IoaD1NYXRoLm1heChoLDFlLTcpLGw9dTtsPD12O2w9ZChsLGgpKXtmb3Iobj12YS50b1N0ZXBwaW5nKGwpLG89bi1rLHI9by9hLHM9TWF0aC5yb3VuZChyKSx0PW8vcyxtPTE7bTw9czttKz0xKXA9ayttKnQsZltwLnRvRml4ZWQoNSldPVtcInhcIiwwXTtxPWMuaW5kZXhPZihsKT4tMT8xOlwic3RlcHNcIj09PWI/MjowLCFnJiZpJiYocT0wKSxsPT09diYmanx8KGZbbi50b0ZpeGVkKDUpXT1bbCxxXSksaz1ufX0pLGZ9ZnVuY3Rpb24gQihhLGIsZCl7ZnVuY3Rpb24gZShhLGIpe3ZhciBkPWI9PT1jLmNzc0NsYXNzZXMudmFsdWUsZT1kP2s6bCxmPWQ/aTpqO3JldHVybiBiK1wiIFwiK2VbYy5vcnRdK1wiIFwiK2ZbYV19ZnVuY3Rpb24gZihhLGYpe2ZbMV09ZlsxXSYmYj9iKGZbMF0sZlsxXSk6ZlsxXTt2YXIgaT1oKGcsITEpO2kuY2xhc3NOYW1lPWUoZlsxXSxjLmNzc0NsYXNzZXMubWFya2VyKSxpLnN0eWxlW2Muc3R5bGVdPWErXCIlXCIsZlsxXSYmKGk9aChnLCExKSxpLmNsYXNzTmFtZT1lKGZbMV0sYy5jc3NDbGFzc2VzLnZhbHVlKSxpLnNldEF0dHJpYnV0ZShcImRhdGEtdmFsdWVcIixmWzBdKSxpLnN0eWxlW2Muc3R5bGVdPWErXCIlXCIsaS5pbm5lclRleHQ9ZC50byhmWzBdKSl9dmFyIGc9eWEuY3JlYXRlRWxlbWVudChcImRpdlwiKSxpPVtjLmNzc0NsYXNzZXMudmFsdWVOb3JtYWwsYy5jc3NDbGFzc2VzLnZhbHVlTGFyZ2UsYy5jc3NDbGFzc2VzLnZhbHVlU3ViXSxqPVtjLmNzc0NsYXNzZXMubWFya2VyTm9ybWFsLGMuY3NzQ2xhc3Nlcy5tYXJrZXJMYXJnZSxjLmNzc0NsYXNzZXMubWFya2VyU3ViXSxrPVtjLmNzc0NsYXNzZXMudmFsdWVIb3Jpem9udGFsLGMuY3NzQ2xhc3Nlcy52YWx1ZVZlcnRpY2FsXSxsPVtjLmNzc0NsYXNzZXMubWFya2VySG9yaXpvbnRhbCxjLmNzc0NsYXNzZXMubWFya2VyVmVydGljYWxdO3JldHVybiBtKGcsYy5jc3NDbGFzc2VzLnBpcHMpLG0oZywwPT09Yy5vcnQ/Yy5jc3NDbGFzc2VzLnBpcHNIb3Jpem9udGFsOmMuY3NzQ2xhc3Nlcy5waXBzVmVydGljYWwpLE9iamVjdC5rZXlzKGEpLmZvckVhY2goZnVuY3Rpb24oYil7ZihiLGFbYl0pfSksZ31mdW5jdGlvbiBDKCl7bmEmJihiKG5hKSxuYT1udWxsKX1mdW5jdGlvbiBEKGEpe0MoKTt2YXIgYj1hLm1vZGUsYz1hLmRlbnNpdHl8fDEsZD1hLmZpbHRlcnx8ITEsZT1hLnZhbHVlc3x8ITEsZj1hLnN0ZXBwZWR8fCExLGc9eihiLGUsZiksaD1BKGMsYixnKSxpPWEuZm9ybWF0fHx7dG86TWF0aC5yb3VuZH07cmV0dXJuIG5hPXJhLmFwcGVuZENoaWxkKEIoaCxkLGkpKX1mdW5jdGlvbiBFKCl7dmFyIGE9amEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksYj1cIm9mZnNldFwiK1tcIldpZHRoXCIsXCJIZWlnaHRcIl1bYy5vcnRdO3JldHVybiAwPT09Yy5vcnQ/YS53aWR0aHx8amFbYl06YS5oZWlnaHR8fGphW2JdfWZ1bmN0aW9uIEYoYSxiLGQsZSl7dmFyIGY9ZnVuY3Rpb24oZil7cmV0dXJuISEoZj1HKGYsZS5wYWdlT2Zmc2V0LGUudGFyZ2V0fHxiKSkmJighKHJhLmhhc0F0dHJpYnV0ZShcImRpc2FibGVkXCIpJiYhZS5kb05vdFJlamVjdCkmJighKG8ocmEsYy5jc3NDbGFzc2VzLnRhcCkmJiFlLmRvTm90UmVqZWN0KSYmKCEoYT09PW9hLnN0YXJ0JiZ2b2lkIDAhPT1mLmJ1dHRvbnMmJmYuYnV0dG9ucz4xKSYmKCghZS5ob3Zlcnx8IWYuYnV0dG9ucykmJihxYXx8Zi5wcmV2ZW50RGVmYXVsdCgpLGYuY2FsY1BvaW50PWYucG9pbnRzW2Mub3J0XSx2b2lkIGQoZixlKSkpKSkpfSxnPVtdO3JldHVybiBhLnNwbGl0KFwiIFwiKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2IuYWRkRXZlbnRMaXN0ZW5lcihhLGYsISFxYSYme3Bhc3NpdmU6ITB9KSxnLnB1c2goW2EsZl0pfSksZ31mdW5jdGlvbiBHKGEsYixjKXt2YXIgZCxlLGY9MD09PWEudHlwZS5pbmRleE9mKFwidG91Y2hcIiksZz0wPT09YS50eXBlLmluZGV4T2YoXCJtb3VzZVwiKSxoPTA9PT1hLnR5cGUuaW5kZXhPZihcInBvaW50ZXJcIik7aWYoMD09PWEudHlwZS5pbmRleE9mKFwiTVNQb2ludGVyXCIpJiYoaD0hMCksZil7dmFyIGk9ZnVuY3Rpb24oYSl7cmV0dXJuIGEudGFyZ2V0PT09Y3x8Yy5jb250YWlucyhhLnRhcmdldCl9O2lmKFwidG91Y2hzdGFydFwiPT09YS50eXBlKXt2YXIgaj1BcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoYS50b3VjaGVzLGkpO2lmKGoubGVuZ3RoPjEpcmV0dXJuITE7ZD1qWzBdLnBhZ2VYLGU9alswXS5wYWdlWX1lbHNle3ZhciBrPUFycmF5LnByb3RvdHlwZS5maW5kLmNhbGwoYS5jaGFuZ2VkVG91Y2hlcyxpKTtpZighaylyZXR1cm4hMTtkPWsucGFnZVgsZT1rLnBhZ2VZfX1yZXR1cm4gYj1ifHxwKHlhKSwoZ3x8aCkmJihkPWEuY2xpZW50WCtiLngsZT1hLmNsaWVudFkrYi55KSxhLnBhZ2VPZmZzZXQ9YixhLnBvaW50cz1bZCxlXSxhLmN1cnNvcj1nfHxoLGF9ZnVuY3Rpb24gSChhKXt2YXIgYj1hLWcoamEsYy5vcnQpLGQ9MTAwKmIvRSgpO3JldHVybiBkPWooZCksYy5kaXI/MTAwLWQ6ZH1mdW5jdGlvbiBJKGEpe3ZhciBiPTEwMCxjPSExO3JldHVybiBrYS5mb3JFYWNoKGZ1bmN0aW9uKGQsZSl7aWYoIWQuaGFzQXR0cmlidXRlKFwiZGlzYWJsZWRcIikpe3ZhciBmPU1hdGguYWJzKHNhW2VdLWEpOyhmPGJ8fDEwMD09PWYmJjEwMD09PWIpJiYoYz1lLGI9Zil9fSksY31mdW5jdGlvbiBKKGEsYil7XCJtb3VzZW91dFwiPT09YS50eXBlJiZcIkhUTUxcIj09PWEudGFyZ2V0Lm5vZGVOYW1lJiZudWxsPT09YS5yZWxhdGVkVGFyZ2V0JiZMKGEsYil9ZnVuY3Rpb24gSyhhLGIpe2lmKC0xPT09bmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIk1TSUUgOVwiKSYmMD09PWEuYnV0dG9ucyYmMCE9PWIuYnV0dG9uc1Byb3BlcnR5KXJldHVybiBMKGEsYik7dmFyIGQ9KGMuZGlyPy0xOjEpKihhLmNhbGNQb2ludC1iLnN0YXJ0Q2FsY1BvaW50KTtXKGQ+MCwxMDAqZC9iLmJhc2VTaXplLGIubG9jYXRpb25zLGIuaGFuZGxlTnVtYmVycyl9ZnVuY3Rpb24gTChhLGIpe2IuaGFuZGxlJiYobihiLmhhbmRsZSxjLmNzc0NsYXNzZXMuYWN0aXZlKSx1YS09MSksYi5saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihhKXt6YS5yZW1vdmVFdmVudExpc3RlbmVyKGFbMF0sYVsxXSl9KSwwPT09dWEmJihuKHJhLGMuY3NzQ2xhc3Nlcy5kcmFnKSxfKCksYS5jdXJzb3ImJihBYS5zdHlsZS5jdXJzb3I9XCJcIixBYS5yZW1vdmVFdmVudExpc3RlbmVyKFwic2VsZWN0c3RhcnRcIixkKSkpLGIuaGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uKGEpe1MoXCJjaGFuZ2VcIixhKSxTKFwic2V0XCIsYSksUyhcImVuZFwiLGEpfSl9ZnVuY3Rpb24gTShhLGIpe3ZhciBlO2lmKDE9PT1iLmhhbmRsZU51bWJlcnMubGVuZ3RoKXt2YXIgZj1rYVtiLmhhbmRsZU51bWJlcnNbMF1dO2lmKGYuaGFzQXR0cmlidXRlKFwiZGlzYWJsZWRcIikpcmV0dXJuITE7ZT1mLmNoaWxkcmVuWzBdLHVhKz0xLG0oZSxjLmNzc0NsYXNzZXMuYWN0aXZlKX1hLnN0b3BQcm9wYWdhdGlvbigpO3ZhciBnPVtdLGg9RihvYS5tb3ZlLHphLEsse3RhcmdldDphLnRhcmdldCxoYW5kbGU6ZSxsaXN0ZW5lcnM6ZyxzdGFydENhbGNQb2ludDphLmNhbGNQb2ludCxiYXNlU2l6ZTpFKCkscGFnZU9mZnNldDphLnBhZ2VPZmZzZXQsaGFuZGxlTnVtYmVyczpiLmhhbmRsZU51bWJlcnMsYnV0dG9uc1Byb3BlcnR5OmEuYnV0dG9ucyxsb2NhdGlvbnM6c2Euc2xpY2UoKX0pLGk9RihvYS5lbmQsemEsTCx7dGFyZ2V0OmEudGFyZ2V0LGhhbmRsZTplLGxpc3RlbmVyczpnLGRvTm90UmVqZWN0OiEwLGhhbmRsZU51bWJlcnM6Yi5oYW5kbGVOdW1iZXJzfSksaj1GKFwibW91c2VvdXRcIix6YSxKLHt0YXJnZXQ6YS50YXJnZXQsaGFuZGxlOmUsbGlzdGVuZXJzOmcsZG9Ob3RSZWplY3Q6ITAsaGFuZGxlTnVtYmVyczpiLmhhbmRsZU51bWJlcnN9KTtnLnB1c2guYXBwbHkoZyxoLmNvbmNhdChpLGopKSxhLmN1cnNvciYmKEFhLnN0eWxlLmN1cnNvcj1nZXRDb21wdXRlZFN0eWxlKGEudGFyZ2V0KS5jdXJzb3Isa2EubGVuZ3RoPjEmJm0ocmEsYy5jc3NDbGFzc2VzLmRyYWcpLEFhLmFkZEV2ZW50TGlzdGVuZXIoXCJzZWxlY3RzdGFydFwiLGQsITEpKSxiLmhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbihhKXtTKFwic3RhcnRcIixhKX0pfWZ1bmN0aW9uIE4oYSl7YS5zdG9wUHJvcGFnYXRpb24oKTt2YXIgYj1IKGEuY2FsY1BvaW50KSxkPUkoYik7aWYoITE9PT1kKXJldHVybiExO2MuZXZlbnRzLnNuYXB8fGkocmEsYy5jc3NDbGFzc2VzLnRhcCxjLmFuaW1hdGlvbkR1cmF0aW9uKSxhYShkLGIsITAsITApLF8oKSxTKFwic2xpZGVcIixkLCEwKSxTKFwidXBkYXRlXCIsZCwhMCksUyhcImNoYW5nZVwiLGQsITApLFMoXCJzZXRcIixkLCEwKSxjLmV2ZW50cy5zbmFwJiZNKGEse2hhbmRsZU51bWJlcnM6W2RdfSl9ZnVuY3Rpb24gTyhhKXt2YXIgYj1IKGEuY2FsY1BvaW50KSxjPXZhLmdldFN0ZXAoYiksZD12YS5mcm9tU3RlcHBpbmcoYyk7T2JqZWN0LmtleXMoeGEpLmZvckVhY2goZnVuY3Rpb24oYSl7XCJob3ZlclwiPT09YS5zcGxpdChcIi5cIilbMF0mJnhhW2FdLmZvckVhY2goZnVuY3Rpb24oYSl7YS5jYWxsKG1hLGQpfSl9KX1mdW5jdGlvbiBQKGEpe2EuZml4ZWR8fGthLmZvckVhY2goZnVuY3Rpb24oYSxiKXtGKG9hLnN0YXJ0LGEuY2hpbGRyZW5bMF0sTSx7aGFuZGxlTnVtYmVyczpbYl19KX0pLGEudGFwJiZGKG9hLnN0YXJ0LGphLE4se30pLGEuaG92ZXImJkYob2EubW92ZSxqYSxPLHtob3ZlcjohMH0pLGEuZHJhZyYmbGEuZm9yRWFjaChmdW5jdGlvbihiLGQpe2lmKCExIT09YiYmMCE9PWQmJmQhPT1sYS5sZW5ndGgtMSl7dmFyIGU9a2FbZC0xXSxmPWthW2RdLGc9W2JdO20oYixjLmNzc0NsYXNzZXMuZHJhZ2dhYmxlKSxhLmZpeGVkJiYoZy5wdXNoKGUuY2hpbGRyZW5bMF0pLGcucHVzaChmLmNoaWxkcmVuWzBdKSksZy5mb3JFYWNoKGZ1bmN0aW9uKGEpe0Yob2Euc3RhcnQsYSxNLHtoYW5kbGVzOltlLGZdLGhhbmRsZU51bWJlcnM6W2QtMSxkXX0pfSl9fSl9ZnVuY3Rpb24gUShhLGIpe3hhW2FdPXhhW2FdfHxbXSx4YVthXS5wdXNoKGIpLFwidXBkYXRlXCI9PT1hLnNwbGl0KFwiLlwiKVswXSYma2EuZm9yRWFjaChmdW5jdGlvbihhLGIpe1MoXCJ1cGRhdGVcIixiKX0pfWZ1bmN0aW9uIFIoYSl7dmFyIGI9YSYmYS5zcGxpdChcIi5cIilbMF0sYz1iJiZhLnN1YnN0cmluZyhiLmxlbmd0aCk7T2JqZWN0LmtleXMoeGEpLmZvckVhY2goZnVuY3Rpb24oYSl7dmFyIGQ9YS5zcGxpdChcIi5cIilbMF0sZT1hLnN1YnN0cmluZyhkLmxlbmd0aCk7YiYmYiE9PWR8fGMmJmMhPT1lfHxkZWxldGUgeGFbYV19KX1mdW5jdGlvbiBTKGEsYixkKXtPYmplY3Qua2V5cyh4YSkuZm9yRWFjaChmdW5jdGlvbihlKXt2YXIgZj1lLnNwbGl0KFwiLlwiKVswXTthPT09ZiYmeGFbZV0uZm9yRWFjaChmdW5jdGlvbihhKXthLmNhbGwobWEsd2EubWFwKGMuZm9ybWF0LnRvKSxiLHdhLnNsaWNlKCksZHx8ITEsc2Euc2xpY2UoKSl9KX0pfWZ1bmN0aW9uIFQoYSl7cmV0dXJuIGErXCIlXCJ9ZnVuY3Rpb24gVShhLGIsZCxlLGYsZyl7cmV0dXJuIGthLmxlbmd0aD4xJiYoZSYmYj4wJiYoZD1NYXRoLm1heChkLGFbYi0xXStjLm1hcmdpbikpLGYmJmI8a2EubGVuZ3RoLTEmJihkPU1hdGgubWluKGQsYVtiKzFdLWMubWFyZ2luKSkpLGthLmxlbmd0aD4xJiZjLmxpbWl0JiYoZSYmYj4wJiYoZD1NYXRoLm1pbihkLGFbYi0xXStjLmxpbWl0KSksZiYmYjxrYS5sZW5ndGgtMSYmKGQ9TWF0aC5tYXgoZCxhW2IrMV0tYy5saW1pdCkpKSxjLnBhZGRpbmcmJigwPT09YiYmKGQ9TWF0aC5tYXgoZCxjLnBhZGRpbmdbMF0pKSxiPT09a2EubGVuZ3RoLTEmJihkPU1hdGgubWluKGQsMTAwLWMucGFkZGluZ1sxXSkpKSxkPXZhLmdldFN0ZXAoZCksISgoZD1qKGQpKT09PWFbYl0mJiFnKSYmZH1mdW5jdGlvbiBWKGEsYil7dmFyIGQ9Yy5vcnQ7cmV0dXJuKGQ/YjphKStcIiwgXCIrKGQ/YTpiKX1mdW5jdGlvbiBXKGEsYixjLGQpe3ZhciBlPWMuc2xpY2UoKSxmPVshYSxhXSxnPVthLCFhXTtkPWQuc2xpY2UoKSxhJiZkLnJldmVyc2UoKSxkLmxlbmd0aD4xP2QuZm9yRWFjaChmdW5jdGlvbihhLGMpe3ZhciBkPVUoZSxhLGVbYV0rYixmW2NdLGdbY10sITEpOyExPT09ZD9iPTA6KGI9ZC1lW2FdLGVbYV09ZCl9KTpmPWc9WyEwXTt2YXIgaD0hMTtkLmZvckVhY2goZnVuY3Rpb24oYSxkKXtoPWFhKGEsY1thXStiLGZbZF0sZ1tkXSl8fGh9KSxoJiZkLmZvckVhY2goZnVuY3Rpb24oYSl7UyhcInVwZGF0ZVwiLGEpLFMoXCJzbGlkZVwiLGEpfSl9ZnVuY3Rpb24gWShhLGIpe3JldHVybiBjLmRpcj8xMDAtYS1iOmF9ZnVuY3Rpb24gWihhLGIpe3NhW2FdPWIsd2FbYV09dmEuZnJvbVN0ZXBwaW5nKGIpO3ZhciBkPVwidHJhbnNsYXRlKFwiK1YoVChZKGIsMCktQmEpLFwiMFwiKStcIilcIjtrYVthXS5zdHlsZVtjLnRyYW5zZm9ybVJ1bGVdPWQsYmEoYSksYmEoYSsxKX1mdW5jdGlvbiBfKCl7dGEuZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgYj1zYVthXT41MD8tMToxLGM9Mysoa2EubGVuZ3RoK2IqYSk7a2FbYV0uc3R5bGUuekluZGV4PWN9KX1mdW5jdGlvbiBhYShhLGIsYyxkKXtyZXR1cm4hMSE9PShiPVUoc2EsYSxiLGMsZCwhMSkpJiYoWihhLGIpLCEwKX1mdW5jdGlvbiBiYShhKXtpZihsYVthXSl7dmFyIGI9MCxkPTEwMDswIT09YSYmKGI9c2FbYS0xXSksYSE9PWxhLmxlbmd0aC0xJiYoZD1zYVthXSk7dmFyIGU9ZC1iLGY9XCJ0cmFuc2xhdGUoXCIrVihUKFkoYixlKSksXCIwXCIpK1wiKVwiLGc9XCJzY2FsZShcIitWKGUvMTAwLFwiMVwiKStcIilcIjtsYVthXS5zdHlsZVtjLnRyYW5zZm9ybVJ1bGVdPWYrXCIgXCIrZ319ZnVuY3Rpb24gY2EoYSxiKXtyZXR1cm4gbnVsbD09PWF8fCExPT09YXx8dm9pZCAwPT09YT9zYVtiXTooXCJudW1iZXJcIj09dHlwZW9mIGEmJihhPVN0cmluZyhhKSksYT1jLmZvcm1hdC5mcm9tKGEpLGE9dmEudG9TdGVwcGluZyhhKSwhMT09PWF8fGlzTmFOKGEpP3NhW2JdOmEpfWZ1bmN0aW9uIGRhKGEsYil7dmFyIGQ9ayhhKSxlPXZvaWQgMD09PXNhWzBdO2I9dm9pZCAwPT09Ynx8ISFiLGMuYW5pbWF0ZSYmIWUmJmkocmEsYy5jc3NDbGFzc2VzLnRhcCxjLmFuaW1hdGlvbkR1cmF0aW9uKSx0YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2FhKGEsY2EoZFthXSxhKSwhMCwhMSl9KSx0YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2FhKGEsc2FbYV0sITAsITApfSksXygpLHRhLmZvckVhY2goZnVuY3Rpb24oYSl7UyhcInVwZGF0ZVwiLGEpLG51bGwhPT1kW2FdJiZiJiZTKFwic2V0XCIsYSl9KX1mdW5jdGlvbiBlYShhKXtkYShjLnN0YXJ0LGEpfWZ1bmN0aW9uIGZhKCl7dmFyIGE9d2EubWFwKGMuZm9ybWF0LnRvKTtyZXR1cm4gMT09PWEubGVuZ3RoP2FbMF06YX1mdW5jdGlvbiBnYSgpe2Zvcih2YXIgYSBpbiBjLmNzc0NsYXNzZXMpYy5jc3NDbGFzc2VzLmhhc093blByb3BlcnR5KGEpJiZuKHJhLGMuY3NzQ2xhc3Nlc1thXSk7Zm9yKDtyYS5maXJzdENoaWxkOylyYS5yZW1vdmVDaGlsZChyYS5maXJzdENoaWxkKTtkZWxldGUgcmEubm9VaVNsaWRlcn1mdW5jdGlvbiBoYSgpe3JldHVybiBzYS5tYXAoZnVuY3Rpb24oYSxiKXt2YXIgYz12YS5nZXROZWFyYnlTdGVwcyhhKSxkPXdhW2JdLGU9Yy50aGlzU3RlcC5zdGVwLGY9bnVsbDshMSE9PWUmJmQrZT5jLnN0ZXBBZnRlci5zdGFydFZhbHVlJiYoZT1jLnN0ZXBBZnRlci5zdGFydFZhbHVlLWQpLGY9ZD5jLnRoaXNTdGVwLnN0YXJ0VmFsdWU/Yy50aGlzU3RlcC5zdGVwOiExIT09Yy5zdGVwQmVmb3JlLnN0ZXAmJmQtYy5zdGVwQmVmb3JlLmhpZ2hlc3RTdGVwLDEwMD09PWE/ZT1udWxsOjA9PT1hJiYoZj1udWxsKTt2YXIgZz12YS5jb3VudFN0ZXBEZWNpbWFscygpO3JldHVybiBudWxsIT09ZSYmITEhPT1lJiYoZT1OdW1iZXIoZS50b0ZpeGVkKGcpKSksbnVsbCE9PWYmJiExIT09ZiYmKGY9TnVtYmVyKGYudG9GaXhlZChnKSkpLFtmLGVdfSl9ZnVuY3Rpb24gaWEoYSxiKXt2YXIgZD1mYSgpLGU9W1wibWFyZ2luXCIsXCJsaW1pdFwiLFwicGFkZGluZ1wiLFwicmFuZ2VcIixcImFuaW1hdGVcIixcInNuYXBcIixcInN0ZXBcIixcImZvcm1hdFwiXTtlLmZvckVhY2goZnVuY3Rpb24oYil7dm9pZCAwIT09YVtiXSYmKGZbYl09YVtiXSl9KTt2YXIgZz1YKGYpO2UuZm9yRWFjaChmdW5jdGlvbihiKXt2b2lkIDAhPT1hW2JdJiYoY1tiXT1nW2JdKX0pLHZhPWcuc3BlY3RydW0sYy5tYXJnaW49Zy5tYXJnaW4sYy5saW1pdD1nLmxpbWl0LGMucGFkZGluZz1nLnBhZGRpbmcsYy5waXBzJiZEKGMucGlwcyksc2E9W10sZGEoYS5zdGFydHx8ZCxiKX12YXIgamEsa2EsbGEsbWEsbmEsb2E9cSgpLHBhPXMoKSxxYT1wYSYmcigpLHJhPWEsc2E9W10sdGE9W10sdWE9MCx2YT1jLnNwZWN0cnVtLHdhPVtdLHhhPXt9LHlhPWEub3duZXJEb2N1bWVudCx6YT15YS5kb2N1bWVudEVsZW1lbnQsQWE9eWEuYm9keSxCYT1cInJ0bFwiPT09eWEuZGlyfHwxPT09Yy5vcnQ/MDoxMDA7cmV0dXJuIHYocmEpLHUoYy5jb25uZWN0LGphKSxQKGMuZXZlbnRzKSxkYShjLnN0YXJ0KSxtYT17ZGVzdHJveTpnYSxzdGVwczpoYSxvbjpRLG9mZjpSLGdldDpmYSxzZXQ6ZGEscmVzZXQ6ZWEsX19tb3ZlSGFuZGxlczpmdW5jdGlvbihhLGIsYyl7VyhhLGIsc2EsYyl9LG9wdGlvbnM6Zix1cGRhdGVPcHRpb25zOmlhLHRhcmdldDpyYSxyZW1vdmVQaXBzOkMscGlwczpEfSxjLnBpcHMmJkQoYy5waXBzKSxjLnRvb2x0aXBzJiZ4KCkseSgpLG1hfWZ1bmN0aW9uIFooYSxiKXtpZighYXx8IWEubm9kZU5hbWUpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6IGNyZWF0ZSByZXF1aXJlcyBhIHNpbmdsZSBlbGVtZW50LCBnb3Q6IFwiK2EpO2lmKGEubm9VaVNsaWRlcil0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogU2xpZGVyIHdhcyBhbHJlYWR5IGluaXRpYWxpemVkLlwiKTt2YXIgYz1YKGIsYSksZD1ZKGEsYyxiKTtyZXR1cm4gYS5ub1VpU2xpZGVyPWQsZH12YXIgJD1cIjExLjEuMFwiO0QucHJvdG90eXBlLmdldE1hcmdpbj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLnhOdW1TdGVwc1swXTtpZihiJiZhL2IlMSE9MCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ2xpbWl0JywgJ21hcmdpbicgYW5kICdwYWRkaW5nJyBtdXN0IGJlIGRpdmlzaWJsZSBieSBzdGVwLlwiKTtyZXR1cm4gMj09PXRoaXMueFBjdC5sZW5ndGgmJnUodGhpcy54VmFsLGEpfSxELnByb3RvdHlwZS50b1N0ZXBwaW5nPWZ1bmN0aW9uKGEpe3JldHVybiBhPXkodGhpcy54VmFsLHRoaXMueFBjdCxhKX0sRC5wcm90b3R5cGUuZnJvbVN0ZXBwaW5nPWZ1bmN0aW9uKGEpe3JldHVybiB6KHRoaXMueFZhbCx0aGlzLnhQY3QsYSl9LEQucHJvdG90eXBlLmdldFN0ZXA9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9QSh0aGlzLnhQY3QsdGhpcy54U3RlcHMsdGhpcy5zbmFwLGEpfSxELnByb3RvdHlwZS5nZXROZWFyYnlTdGVwcz1mdW5jdGlvbihhKXt2YXIgYj14KGEsdGhpcy54UGN0KTtyZXR1cm57c3RlcEJlZm9yZTp7c3RhcnRWYWx1ZTp0aGlzLnhWYWxbYi0yXSxzdGVwOnRoaXMueE51bVN0ZXBzW2ItMl0saGlnaGVzdFN0ZXA6dGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtiLTJdfSx0aGlzU3RlcDp7c3RhcnRWYWx1ZTp0aGlzLnhWYWxbYi0xXSxzdGVwOnRoaXMueE51bVN0ZXBzW2ItMV0saGlnaGVzdFN0ZXA6dGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtiLTFdfSxzdGVwQWZ0ZXI6e3N0YXJ0VmFsdWU6dGhpcy54VmFsW2ItMF0sc3RlcDp0aGlzLnhOdW1TdGVwc1tiLTBdLGhpZ2hlc3RTdGVwOnRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXBbYi0wXX19fSxELnByb3RvdHlwZS5jb3VudFN0ZXBEZWNpbWFscz1mdW5jdGlvbigpe3ZhciBhPXRoaXMueE51bVN0ZXBzLm1hcChsKTtyZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCxhKX0sRC5wcm90b3R5cGUuY29udmVydD1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5nZXRTdGVwKHRoaXMudG9TdGVwcGluZyhhKSl9O3ZhciBfPXt0bzpmdW5jdGlvbihhKXtyZXR1cm4gdm9pZCAwIT09YSYmYS50b0ZpeGVkKDIpfSxmcm9tOk51bWJlcn07cmV0dXJue3ZlcnNpb246JCxjcmVhdGU6Wn19KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpIHtcblxuICAgIGlmICggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuXG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcblxuICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcblxuICAgICAgICAvLyBOb2RlL0NvbW1vbkpTXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICAgICAgd2luZG93LndOdW1iID0gZmFjdG9yeSgpO1xuICAgIH1cblxufShmdW5jdGlvbigpe1xuXG5cdCd1c2Ugc3RyaWN0JztcblxudmFyIEZvcm1hdE9wdGlvbnMgPSBbXG5cdCdkZWNpbWFscycsXG5cdCd0aG91c2FuZCcsXG5cdCdtYXJrJyxcblx0J3ByZWZpeCcsXG5cdCdzdWZmaXgnLFxuXHQnZW5jb2RlcicsXG5cdCdkZWNvZGVyJyxcblx0J25lZ2F0aXZlQmVmb3JlJyxcblx0J25lZ2F0aXZlJyxcblx0J2VkaXQnLFxuXHQndW5kbydcbl07XG5cbi8vIEdlbmVyYWxcblxuXHQvLyBSZXZlcnNlIGEgc3RyaW5nXG5cdGZ1bmN0aW9uIHN0clJldmVyc2UgKCBhICkge1xuXHRcdHJldHVybiBhLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJyk7XG5cdH1cblxuXHQvLyBDaGVjayBpZiBhIHN0cmluZyBzdGFydHMgd2l0aCBhIHNwZWNpZmllZCBwcmVmaXguXG5cdGZ1bmN0aW9uIHN0clN0YXJ0c1dpdGggKCBpbnB1dCwgbWF0Y2ggKSB7XG5cdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCBtYXRjaC5sZW5ndGgpID09PSBtYXRjaDtcblx0fVxuXG5cdC8vIENoZWNrIGlzIGEgc3RyaW5nIGVuZHMgaW4gYSBzcGVjaWZpZWQgc3VmZml4LlxuXHRmdW5jdGlvbiBzdHJFbmRzV2l0aCAoIGlucHV0LCBtYXRjaCApIHtcblx0XHRyZXR1cm4gaW5wdXQuc2xpY2UoLTEgKiBtYXRjaC5sZW5ndGgpID09PSBtYXRjaDtcblx0fVxuXG5cdC8vIFRocm93IGFuIGVycm9yIGlmIGZvcm1hdHRpbmcgb3B0aW9ucyBhcmUgaW5jb21wYXRpYmxlLlxuXHRmdW5jdGlvbiB0aHJvd0VxdWFsRXJyb3IoIEYsIGEsIGIgKSB7XG5cdFx0aWYgKCAoRlthXSB8fCBGW2JdKSAmJiAoRlthXSA9PT0gRltiXSkgKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgYSBudW1iZXIgaXMgZmluaXRlIGFuZCBub3QgTmFOXG5cdGZ1bmN0aW9uIGlzVmFsaWROdW1iZXIgKCBpbnB1dCApIHtcblx0XHRyZXR1cm4gdHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSggaW5wdXQgKTtcblx0fVxuXG5cdC8vIFByb3ZpZGUgcm91bmRpbmctYWNjdXJhdGUgdG9GaXhlZCBtZXRob2QuXG5cdC8vIEJvcnJvd2VkOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTMyMzMzMC83NzUyNjVcblx0ZnVuY3Rpb24gdG9GaXhlZCAoIHZhbHVlLCBleHAgKSB7XG5cdFx0dmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnNwbGl0KCdlJyk7XG5cdFx0dmFsdWUgPSBNYXRoLnJvdW5kKCsodmFsdWVbMF0gKyAnZScgKyAodmFsdWVbMV0gPyAoK3ZhbHVlWzFdICsgZXhwKSA6IGV4cCkpKTtcblx0XHR2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJ2UnKTtcblx0XHRyZXR1cm4gKCsodmFsdWVbMF0gKyAnZScgKyAodmFsdWVbMV0gPyAoK3ZhbHVlWzFdIC0gZXhwKSA6IC1leHApKSkudG9GaXhlZChleHApO1xuXHR9XG5cblxuLy8gRm9ybWF0dGluZ1xuXG5cdC8vIEFjY2VwdCBhIG51bWJlciBhcyBpbnB1dCwgb3V0cHV0IGZvcm1hdHRlZCBzdHJpbmcuXG5cdGZ1bmN0aW9uIGZvcm1hdFRvICggZGVjaW1hbHMsIHRob3VzYW5kLCBtYXJrLCBwcmVmaXgsIHN1ZmZpeCwgZW5jb2RlciwgZGVjb2RlciwgbmVnYXRpdmVCZWZvcmUsIG5lZ2F0aXZlLCBlZGl0LCB1bmRvLCBpbnB1dCApIHtcblxuXHRcdHZhciBvcmlnaW5hbElucHV0ID0gaW5wdXQsIGlucHV0SXNOZWdhdGl2ZSwgaW5wdXRQaWVjZXMsIGlucHV0QmFzZSwgaW5wdXREZWNpbWFscyA9ICcnLCBvdXRwdXQgPSAnJztcblxuXHRcdC8vIEFwcGx5IHVzZXIgZW5jb2RlciB0byB0aGUgaW5wdXQuXG5cdFx0Ly8gRXhwZWN0ZWQgb3V0Y29tZTogbnVtYmVyLlxuXHRcdGlmICggZW5jb2RlciApIHtcblx0XHRcdGlucHV0ID0gZW5jb2RlcihpbnB1dCk7XG5cdFx0fVxuXG5cdFx0Ly8gU3RvcCBpZiBubyB2YWxpZCBudW1iZXIgd2FzIHByb3ZpZGVkLCB0aGUgbnVtYmVyIGlzIGluZmluaXRlIG9yIE5hTi5cblx0XHRpZiAoICFpc1ZhbGlkTnVtYmVyKGlucHV0KSApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBSb3VuZGluZyBhd2F5IGRlY2ltYWxzIG1pZ2h0IGNhdXNlIGEgdmFsdWUgb2YgLTBcblx0XHQvLyB3aGVuIHVzaW5nIHZlcnkgc21hbGwgcmFuZ2VzLiBSZW1vdmUgdGhvc2UgY2FzZXMuXG5cdFx0aWYgKCBkZWNpbWFscyAhPT0gZmFsc2UgJiYgcGFyc2VGbG9hdChpbnB1dC50b0ZpeGVkKGRlY2ltYWxzKSkgPT09IDAgKSB7XG5cdFx0XHRpbnB1dCA9IDA7XG5cdFx0fVxuXG5cdFx0Ly8gRm9ybWF0dGluZyBpcyBkb25lIG9uIGFic29sdXRlIG51bWJlcnMsXG5cdFx0Ly8gZGVjb3JhdGVkIGJ5IGFuIG9wdGlvbmFsIG5lZ2F0aXZlIHN5bWJvbC5cblx0XHRpZiAoIGlucHV0IDwgMCApIHtcblx0XHRcdGlucHV0SXNOZWdhdGl2ZSA9IHRydWU7XG5cdFx0XHRpbnB1dCA9IE1hdGguYWJzKGlucHV0KTtcblx0XHR9XG5cblx0XHQvLyBSZWR1Y2UgdGhlIG51bWJlciBvZiBkZWNpbWFscyB0byB0aGUgc3BlY2lmaWVkIG9wdGlvbi5cblx0XHRpZiAoIGRlY2ltYWxzICE9PSBmYWxzZSApIHtcblx0XHRcdGlucHV0ID0gdG9GaXhlZCggaW5wdXQsIGRlY2ltYWxzICk7XG5cdFx0fVxuXG5cdFx0Ly8gVHJhbnNmb3JtIHRoZSBudW1iZXIgaW50byBhIHN0cmluZywgc28gaXQgY2FuIGJlIHNwbGl0LlxuXHRcdGlucHV0ID0gaW5wdXQudG9TdHJpbmcoKTtcblxuXHRcdC8vIEJyZWFrIHRoZSBudW1iZXIgb24gdGhlIGRlY2ltYWwgc2VwYXJhdG9yLlxuXHRcdGlmICggaW5wdXQuaW5kZXhPZignLicpICE9PSAtMSApIHtcblx0XHRcdGlucHV0UGllY2VzID0gaW5wdXQuc3BsaXQoJy4nKTtcblxuXHRcdFx0aW5wdXRCYXNlID0gaW5wdXRQaWVjZXNbMF07XG5cblx0XHRcdGlmICggbWFyayApIHtcblx0XHRcdFx0aW5wdXREZWNpbWFscyA9IG1hcmsgKyBpbnB1dFBpZWNlc1sxXTtcblx0XHRcdH1cblxuXHRcdH0gZWxzZSB7XG5cblx0XHQvLyBJZiBpdCBpc24ndCBzcGxpdCwgdGhlIGVudGlyZSBudW1iZXIgd2lsbCBkby5cblx0XHRcdGlucHV0QmFzZSA9IGlucHV0O1xuXHRcdH1cblxuXHRcdC8vIEdyb3VwIG51bWJlcnMgaW4gc2V0cyBvZiB0aHJlZS5cblx0XHRpZiAoIHRob3VzYW5kICkge1xuXHRcdFx0aW5wdXRCYXNlID0gc3RyUmV2ZXJzZShpbnB1dEJhc2UpLm1hdGNoKC8uezEsM30vZyk7XG5cdFx0XHRpbnB1dEJhc2UgPSBzdHJSZXZlcnNlKGlucHV0QmFzZS5qb2luKCBzdHJSZXZlcnNlKCB0aG91c2FuZCApICkpO1xuXHRcdH1cblxuXHRcdC8vIElmIHRoZSBudW1iZXIgaXMgbmVnYXRpdmUsIHByZWZpeCB3aXRoIG5lZ2F0aW9uIHN5bWJvbC5cblx0XHRpZiAoIGlucHV0SXNOZWdhdGl2ZSAmJiBuZWdhdGl2ZUJlZm9yZSApIHtcblx0XHRcdG91dHB1dCArPSBuZWdhdGl2ZUJlZm9yZTtcblx0XHR9XG5cblx0XHQvLyBQcmVmaXggdGhlIG51bWJlclxuXHRcdGlmICggcHJlZml4ICkge1xuXHRcdFx0b3V0cHV0ICs9IHByZWZpeDtcblx0XHR9XG5cblx0XHQvLyBOb3JtYWwgbmVnYXRpdmUgb3B0aW9uIGNvbWVzIGFmdGVyIHRoZSBwcmVmaXguIERlZmF1bHRzIHRvICctJy5cblx0XHRpZiAoIGlucHV0SXNOZWdhdGl2ZSAmJiBuZWdhdGl2ZSApIHtcblx0XHRcdG91dHB1dCArPSBuZWdhdGl2ZTtcblx0XHR9XG5cblx0XHQvLyBBcHBlbmQgdGhlIGFjdHVhbCBudW1iZXIuXG5cdFx0b3V0cHV0ICs9IGlucHV0QmFzZTtcblx0XHRvdXRwdXQgKz0gaW5wdXREZWNpbWFscztcblxuXHRcdC8vIEFwcGx5IHRoZSBzdWZmaXguXG5cdFx0aWYgKCBzdWZmaXggKSB7XG5cdFx0XHRvdXRwdXQgKz0gc3VmZml4O1xuXHRcdH1cblxuXHRcdC8vIFJ1biB0aGUgb3V0cHV0IHRocm91Z2ggYSB1c2VyLXNwZWNpZmllZCBwb3N0LWZvcm1hdHRlci5cblx0XHRpZiAoIGVkaXQgKSB7XG5cdFx0XHRvdXRwdXQgPSBlZGl0ICggb3V0cHV0LCBvcmlnaW5hbElucHV0ICk7XG5cdFx0fVxuXG5cdFx0Ly8gQWxsIGRvbmUuXG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cdC8vIEFjY2VwdCBhIHN0aW5nIGFzIGlucHV0LCBvdXRwdXQgZGVjb2RlZCBudW1iZXIuXG5cdGZ1bmN0aW9uIGZvcm1hdEZyb20gKCBkZWNpbWFscywgdGhvdXNhbmQsIG1hcmssIHByZWZpeCwgc3VmZml4LCBlbmNvZGVyLCBkZWNvZGVyLCBuZWdhdGl2ZUJlZm9yZSwgbmVnYXRpdmUsIGVkaXQsIHVuZG8sIGlucHV0ICkge1xuXG5cdFx0dmFyIG9yaWdpbmFsSW5wdXQgPSBpbnB1dCwgaW5wdXRJc05lZ2F0aXZlLCBvdXRwdXQgPSAnJztcblxuXHRcdC8vIFVzZXIgZGVmaW5lZCBwcmUtZGVjb2Rlci4gUmVzdWx0IG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nLlxuXHRcdGlmICggdW5kbyApIHtcblx0XHRcdGlucHV0ID0gdW5kbyhpbnB1dCk7XG5cdFx0fVxuXG5cdFx0Ly8gVGVzdCB0aGUgaW5wdXQuIENhbid0IGJlIGVtcHR5LlxuXHRcdGlmICggIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlIHN0cmluZyBzdGFydHMgd2l0aCB0aGUgbmVnYXRpdmVCZWZvcmUgdmFsdWU6IHJlbW92ZSBpdC5cblx0XHQvLyBSZW1lbWJlciBpcyB3YXMgdGhlcmUsIHRoZSBudW1iZXIgaXMgbmVnYXRpdmUuXG5cdFx0aWYgKCBuZWdhdGl2ZUJlZm9yZSAmJiBzdHJTdGFydHNXaXRoKGlucHV0LCBuZWdhdGl2ZUJlZm9yZSkgKSB7XG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UobmVnYXRpdmVCZWZvcmUsICcnKTtcblx0XHRcdGlucHV0SXNOZWdhdGl2ZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gUmVwZWF0IHRoZSBzYW1lIHByb2NlZHVyZSBmb3IgdGhlIHByZWZpeC5cblx0XHRpZiAoIHByZWZpeCAmJiBzdHJTdGFydHNXaXRoKGlucHV0LCBwcmVmaXgpICkge1xuXHRcdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKHByZWZpeCwgJycpO1xuXHRcdH1cblxuXHRcdC8vIEFuZCBhZ2FpbiBmb3IgbmVnYXRpdmUuXG5cdFx0aWYgKCBuZWdhdGl2ZSAmJiBzdHJTdGFydHNXaXRoKGlucHV0LCBuZWdhdGl2ZSkgKSB7XG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UobmVnYXRpdmUsICcnKTtcblx0XHRcdGlucHV0SXNOZWdhdGl2ZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBzdWZmaXguXG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU3RyaW5nL3NsaWNlXG5cdFx0aWYgKCBzdWZmaXggJiYgc3RyRW5kc1dpdGgoaW5wdXQsIHN1ZmZpeCkgKSB7XG5cdFx0XHRpbnB1dCA9IGlucHV0LnNsaWNlKDAsIC0xICogc3VmZml4Lmxlbmd0aCk7XG5cdFx0fVxuXG5cdFx0Ly8gUmVtb3ZlIHRoZSB0aG91c2FuZCBncm91cGluZy5cblx0XHRpZiAoIHRob3VzYW5kICkge1xuXHRcdFx0aW5wdXQgPSBpbnB1dC5zcGxpdCh0aG91c2FuZCkuam9pbignJyk7XG5cdFx0fVxuXG5cdFx0Ly8gU2V0IHRoZSBkZWNpbWFsIHNlcGFyYXRvciBiYWNrIHRvIHBlcmlvZC5cblx0XHRpZiAoIG1hcmsgKSB7XG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UobWFyaywgJy4nKTtcblx0XHR9XG5cblx0XHQvLyBQcmVwZW5kIHRoZSBuZWdhdGl2ZSBzeW1ib2wuXG5cdFx0aWYgKCBpbnB1dElzTmVnYXRpdmUgKSB7XG5cdFx0XHRvdXRwdXQgKz0gJy0nO1xuXHRcdH1cblxuXHRcdC8vIEFkZCB0aGUgbnVtYmVyXG5cdFx0b3V0cHV0ICs9IGlucHV0O1xuXG5cdFx0Ly8gVHJpbSBhbGwgbm9uLW51bWVyaWMgY2hhcmFjdGVycyAoYWxsb3cgJy4nIGFuZCAnLScpO1xuXHRcdG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKC9bXjAtOVxcLlxcLS5dL2csICcnKTtcblxuXHRcdC8vIFRoZSB2YWx1ZSBjb250YWlucyBubyBwYXJzZS1hYmxlIG51bWJlci5cblx0XHRpZiAoIG91dHB1dCA9PT0gJycgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gQ292ZXJ0IHRvIG51bWJlci5cblx0XHRvdXRwdXQgPSBOdW1iZXIob3V0cHV0KTtcblxuXHRcdC8vIFJ1biB0aGUgdXNlci1zcGVjaWZpZWQgcG9zdC1kZWNvZGVyLlxuXHRcdGlmICggZGVjb2RlciApIHtcblx0XHRcdG91dHB1dCA9IGRlY29kZXIob3V0cHV0KTtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBpcyB0aGUgb3V0cHV0IGlzIHZhbGlkLCBvdGhlcndpc2U6IHJldHVybiBmYWxzZS5cblx0XHRpZiAoICFpc1ZhbGlkTnVtYmVyKG91dHB1dCkgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cbi8vIEZyYW1ld29ya1xuXG5cdC8vIFZhbGlkYXRlIGZvcm1hdHRpbmcgb3B0aW9uc1xuXHRmdW5jdGlvbiB2YWxpZGF0ZSAoIGlucHV0T3B0aW9ucyApIHtcblxuXHRcdHZhciBpLCBvcHRpb25OYW1lLCBvcHRpb25WYWx1ZSxcblx0XHRcdGZpbHRlcmVkT3B0aW9ucyA9IHt9O1xuXG5cdFx0aWYgKCBpbnB1dE9wdGlvbnNbJ3N1ZmZpeCddID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRpbnB1dE9wdGlvbnNbJ3N1ZmZpeCddID0gaW5wdXRPcHRpb25zWydwb3N0Zml4J107XG5cdFx0fVxuXG5cdFx0Zm9yICggaSA9IDA7IGkgPCBGb3JtYXRPcHRpb25zLmxlbmd0aDsgaSs9MSApIHtcblxuXHRcdFx0b3B0aW9uTmFtZSA9IEZvcm1hdE9wdGlvbnNbaV07XG5cdFx0XHRvcHRpb25WYWx1ZSA9IGlucHV0T3B0aW9uc1tvcHRpb25OYW1lXTtcblxuXHRcdFx0aWYgKCBvcHRpb25WYWx1ZSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdC8vIE9ubHkgZGVmYXVsdCBpZiBuZWdhdGl2ZUJlZm9yZSBpc24ndCBzZXQuXG5cdFx0XHRcdGlmICggb3B0aW9uTmFtZSA9PT0gJ25lZ2F0aXZlJyAmJiAhZmlsdGVyZWRPcHRpb25zLm5lZ2F0aXZlQmVmb3JlICkge1xuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9ICctJztcblx0XHRcdFx0Ly8gRG9uJ3Qgc2V0IGEgZGVmYXVsdCBmb3IgbWFyayB3aGVuICd0aG91c2FuZCcgaXMgc2V0LlxuXHRcdFx0XHR9IGVsc2UgaWYgKCBvcHRpb25OYW1lID09PSAnbWFyaycgJiYgZmlsdGVyZWRPcHRpb25zLnRob3VzYW5kICE9PSAnLicgKSB7XG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gJy4nO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdC8vIEZsb2F0aW5nIHBvaW50cyBpbiBKUyBhcmUgc3RhYmxlIHVwIHRvIDcgZGVjaW1hbHMuXG5cdFx0XHR9IGVsc2UgaWYgKCBvcHRpb25OYW1lID09PSAnZGVjaW1hbHMnICkge1xuXHRcdFx0XHRpZiAoIG9wdGlvblZhbHVlID49IDAgJiYgb3B0aW9uVmFsdWUgPCA4ICkge1xuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9IG9wdGlvblZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihvcHRpb25OYW1lKTtcblx0XHRcdFx0fVxuXG5cdFx0XHQvLyBUaGVzZSBvcHRpb25zLCB3aGVuIHByb3ZpZGVkLCBtdXN0IGJlIGZ1bmN0aW9ucy5cblx0XHRcdH0gZWxzZSBpZiAoIG9wdGlvbk5hbWUgPT09ICdlbmNvZGVyJyB8fCBvcHRpb25OYW1lID09PSAnZGVjb2RlcicgfHwgb3B0aW9uTmFtZSA9PT0gJ2VkaXQnIHx8IG9wdGlvbk5hbWUgPT09ICd1bmRvJyApIHtcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb3B0aW9uVmFsdWUgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gb3B0aW9uVmFsdWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKG9wdGlvbk5hbWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdC8vIE90aGVyIG9wdGlvbnMgYXJlIHN0cmluZ3MuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGlmICggdHlwZW9mIG9wdGlvblZhbHVlID09PSAnc3RyaW5nJyApIHtcblx0XHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnNbb3B0aW9uTmFtZV0gPSBvcHRpb25WYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3Iob3B0aW9uTmFtZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTb21lIHZhbHVlcyBjYW4ndCBiZSBleHRyYWN0ZWQgZnJvbSBhXG5cdFx0Ly8gc3RyaW5nIGlmIGNlcnRhaW4gY29tYmluYXRpb25zIGFyZSBwcmVzZW50LlxuXHRcdHRocm93RXF1YWxFcnJvcihmaWx0ZXJlZE9wdGlvbnMsICdtYXJrJywgJ3Rob3VzYW5kJyk7XG5cdFx0dGhyb3dFcXVhbEVycm9yKGZpbHRlcmVkT3B0aW9ucywgJ3ByZWZpeCcsICduZWdhdGl2ZScpO1xuXHRcdHRocm93RXF1YWxFcnJvcihmaWx0ZXJlZE9wdGlvbnMsICdwcmVmaXgnLCAnbmVnYXRpdmVCZWZvcmUnKTtcblxuXHRcdHJldHVybiBmaWx0ZXJlZE9wdGlvbnM7XG5cdH1cblxuXHQvLyBQYXNzIGFsbCBvcHRpb25zIGFzIGZ1bmN0aW9uIGFyZ3VtZW50c1xuXHRmdW5jdGlvbiBwYXNzQWxsICggb3B0aW9ucywgbWV0aG9kLCBpbnB1dCApIHtcblx0XHR2YXIgaSwgYXJncyA9IFtdO1xuXG5cdFx0Ly8gQWRkIGFsbCBvcHRpb25zIGluIG9yZGVyIG9mIEZvcm1hdE9wdGlvbnNcblx0XHRmb3IgKCBpID0gMDsgaSA8IEZvcm1hdE9wdGlvbnMubGVuZ3RoOyBpKz0xICkge1xuXHRcdFx0YXJncy5wdXNoKG9wdGlvbnNbRm9ybWF0T3B0aW9uc1tpXV0pO1xuXHRcdH1cblxuXHRcdC8vIEFwcGVuZCB0aGUgaW5wdXQsIHRoZW4gY2FsbCB0aGUgbWV0aG9kLCBwcmVzZW50aW5nIGFsbFxuXHRcdC8vIG9wdGlvbnMgYXMgYXJndW1lbnRzLlxuXHRcdGFyZ3MucHVzaChpbnB1dCk7XG5cdFx0cmV0dXJuIG1ldGhvZC5hcHBseSgnJywgYXJncyk7XG5cdH1cblxuXHRmdW5jdGlvbiB3TnVtYiAoIG9wdGlvbnMgKSB7XG5cblx0XHRpZiAoICEodGhpcyBpbnN0YW5jZW9mIHdOdW1iKSApIHtcblx0XHRcdHJldHVybiBuZXcgd051bWIgKCBvcHRpb25zICk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2Ygb3B0aW9ucyAhPT0gXCJvYmplY3RcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRvcHRpb25zID0gdmFsaWRhdGUob3B0aW9ucyk7XG5cblx0XHQvLyBDYWxsICdmb3JtYXRUbycgd2l0aCBwcm9wZXIgYXJndW1lbnRzLlxuXHRcdHRoaXMudG8gPSBmdW5jdGlvbiAoIGlucHV0ICkge1xuXHRcdFx0cmV0dXJuIHBhc3NBbGwob3B0aW9ucywgZm9ybWF0VG8sIGlucHV0KTtcblx0XHR9O1xuXG5cdFx0Ly8gQ2FsbCAnZm9ybWF0RnJvbScgd2l0aCBwcm9wZXIgYXJndW1lbnRzLlxuXHRcdHRoaXMuZnJvbSA9IGZ1bmN0aW9uICggaW5wdXQgKSB7XG5cdFx0XHRyZXR1cm4gcGFzc0FsbChvcHRpb25zLCBmb3JtYXRGcm9tLCBpbnB1dCk7XG5cdFx0fTtcblx0fVxuXG5cdHJldHVybiB3TnVtYjtcblxufSkpO1xuIl19
