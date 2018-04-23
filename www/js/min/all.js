function OnePoint(noteVal, scale) {
	var sphere = new THREE.SphereGeometry(2,50,50);
	var sphereMesh = new THREE.Mesh(sphere, RGBMaterial);

	sphereMesh.position.copy(allPoints[noteVal].clone().multiplyScalar(scale))

	return sphereMesh;
}
function ThreePoints(notes, scale) {
	this.group = new THREE.Group();

	var geometry = new THREE.Geometry();
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
	this.group.add(new CylinderFromPts(v3, v1));

	var mesh = new THREE.Mesh(geometry, transparentMaterialFront);

	this.group.add(mesh);
	//this.group.add(new PolySpheresFromNotes(notes));

	return this.group;
}
function TwoPoints(noteVal1, noteVal2, scale) {

	var v1 = allPoints[noteVal1].clone().multiplyScalar(scale);
	var v2 = allPoints[noteVal2].clone().multiplyScalar(scale);

	var cylinder = new THREE.CylinderGeometry(0.4, 0.4, v1.distanceTo(v2), 10, 0.5, true);

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
	transparent: true
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
	var cylinder = new THREE.CylinderGeometry(0.4, 0.4, v1.distanceTo(v2), 10, 0.5, true);
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
//creates spheres for each vertex of the geometry
var sphere = new THREE.SphereGeometry(2,50,50);
var sphereMesh = new THREE.Mesh(sphere, RGBMaterial);

function PolySpheres(geometry) {
	this.group = new THREE.Group();
	var mesh = sphereMesh.clone();
	for(var i=0; i<geometry.vertices.length; i++) {
		sphereMesh.position.copy(geometry.vertices[i]);
		this.group.add(sphereMesh.clone());
	}

	return this.group;
}

function PolySpheresFromNotes(notes) {
	var group = new THREE.Group();
	for(var i in notes) {
		group.add(spheres.getObjectById(notes[i]).clone());
	}
	/*console.log(group);*/

	return group;
}
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

	var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);

	var pointLight = new THREE.PointLight(0x00ff00, 1, 100);
	pointLight.position.set(x+distance, y+distance, z-distance);
	mainGroup.add(pointLight);

	var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);

	var pointLight = new THREE.PointLight(0xffff00, 1, 100);
	pointLight.position.set(x-distance, y+distance, z+distance);
	mainGroup.add(pointLight);

	var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);

	var pointLight = new THREE.PointLight(0x0000ff, 1, 100);
	pointLight.position.set(x-distance, y+distance, z-distance);
	mainGroup.add(pointLight);

	var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);


	//bottom lights
	var pointLight = new THREE.PointLight(0x00ffff, 1, 100);
	pointLight.position.set(x+distance, y-distance, z+distance);
	mainGroup.add(pointLight);

	var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);

	var pointLight = new THREE.PointLight(0xff00ff, 1, 100);
	pointLight.position.set(x+distance, y-distance, z-distance);
	mainGroup.add(pointLight);

	var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);

	var pointLight = new THREE.PointLight(0xff8888, 1, 100);
	pointLight.position.set(x-distance, y-distance, z+distance);
	mainGroup.add(pointLight);

	var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);

	var pointLight = new THREE.PointLight(0x8888ff, 1, 100);
	pointLight.position.set(x-distance, y-distance, z-distance);
	mainGroup.add(pointLight);

	var helper = new THREE.PointLightHelper(pointLight, 1);
	mainGroup.add(helper);



	//middle light
	/*var pointLight = new THREE.PointLight(0xffffff, 1, 100);
	pointLight.position.set(x, y, z);
	mainGroup.add(pointLight);

	var helper = new THREE.PointLightHelper(pointLight, 1);
	group.add(helper);*/

}
var scale = 15;

function Chord(notes) {
	this.notes = [];

	for(var i in notes) {
		this.notes.push(notes[i] % 12);
	}

	this.drawChord();
}

Chord.prototype.addNote = function(note) {
	this.notes.push(note);
}

Chord.prototype.show = function() {
	this.polyhedron.visible = true;
	for(var i in this.notes) {
		spheres.children[this.notes[i]].visible = true;
		console.log(i);
		console.log(spheres[this.notes[i]]);
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
		var geometry = new THREE.Geometry();
		
		for(var i=0; i<nbNotes; i++) {
			geometry.vertices.push(
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
		
		geometry.scale(scale,scale,scale);
		this.polyhedron = new PolyMeshes(geometry, this.notes);

	}
	this.polyhedron.visible = false;
	shapesGroup.add(this.polyhedron);
	

}
var mainGroup, shapesGroup, spheres, labels, container, camera, renderer, scene, stats;
var chords = [];
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

	var ambientLight = new THREE.AmbientLight( 0x404040 );
	scene.add( ambientLight );

	var pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
	//camera.add(pointLight);
	spheres = new THREE.Group();
	labels = new THREE.Group();

	for(var i in allPoints) {
		var point = new OnePoint(i, scale);
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

function drawChords(from, to) {
	for(var i=from; i<=to; i++) {
		//shapesGroup.children[i].visible = true;
		chords[i].show();
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

function parseMidi() {
	var inputElem = document.querySelector('#file-input');
	var file = inputElem.files[0];
	var reader = new FileReader();

	reader.onload = function(e) {
		var binary = new Uint8Array(e.target.result);
		for(var i in binary) {
			console.log(binary[i].toString(16));
		}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9uZVBvaW50LmpzIiwiVGhyZWVQb2ludHMuanMiLCJUd29Qb2ludHMuanMiLCJBbGxQb2ludHMuanMiLCJDb21iaW5hdGlvbnMuanMiLCJNYXRlcmlhbHMuanMiLCJQb2x5Q3lsaW5kZXIuanMiLCJQb2x5TWVzaGVzLmpzIiwiUG9seVNwaGVyZS5qcyIsIlRleHRTcHJpdGUuanMiLCJUcmFuc3BNZXNoR3JwLmpzIiwibWFrZUxpZ2h0cy5qcyIsImNob3JkLmpzIiwicmVuZGVyMi5qcyIsIm1pZGlQYXJzZXIuanMiLCJweXRlc3QuanMiLCJzZW5kTWlkaVRvUHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBPbmVQb2ludChub3RlVmFsLCBzY2FsZSkge1xyXG5cdHZhciBzcGhlcmUgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMiw1MCw1MCk7XHJcblx0dmFyIHNwaGVyZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChzcGhlcmUsIFJHQk1hdGVyaWFsKTtcclxuXHJcblx0c3BoZXJlTWVzaC5wb3NpdGlvbi5jb3B5KGFsbFBvaW50c1tub3RlVmFsXS5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKSlcclxuXHJcblx0cmV0dXJuIHNwaGVyZU1lc2g7XHJcbn0iLCJmdW5jdGlvbiBUaHJlZVBvaW50cyhub3Rlcywgc2NhbGUpIHtcclxuXHR0aGlzLmdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG5cdHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG5cdGZvcih2YXIgbm90ZSBpbiBub3Rlcykge1xyXG5cdFx0Z2VvbWV0cnkudmVydGljZXMucHVzaCggYWxsUG9pbnRzW25vdGVzW25vdGVdXS5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKSApO1xyXG5cdH1cclxuXHJcblx0Z2VvbWV0cnkuZmFjZXMucHVzaChuZXcgVEhSRUUuRmFjZTMoMCwxLDIpKTtcclxuXHRnZW9tZXRyeS5mYWNlcy5wdXNoKG5ldyBUSFJFRS5GYWNlMygyLDEsMCkpO1xyXG5cdGdlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscygpO1xyXG5cclxuXHR2YXIgdjEgPSBnZW9tZXRyeS52ZXJ0aWNlc1swXTtcclxuXHR2YXIgdjIgPSBnZW9tZXRyeS52ZXJ0aWNlc1sxXTtcclxuXHR2YXIgdjMgPSBnZW9tZXRyeS52ZXJ0aWNlc1syXTtcclxuXHJcblx0dGhpcy5ncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MSwgdjIpKTtcclxuXHR0aGlzLmdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYyLCB2MykpO1xyXG5cdHRoaXMuZ3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjMsIHYxKSk7XHJcblxyXG5cdHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHRyYW5zcGFyZW50TWF0ZXJpYWxGcm9udCk7XHJcblxyXG5cdHRoaXMuZ3JvdXAuYWRkKG1lc2gpO1xyXG5cdC8vdGhpcy5ncm91cC5hZGQobmV3IFBvbHlTcGhlcmVzRnJvbU5vdGVzKG5vdGVzKSk7XHJcblxyXG5cdHJldHVybiB0aGlzLmdyb3VwO1xyXG59IiwiZnVuY3Rpb24gVHdvUG9pbnRzKG5vdGVWYWwxLCBub3RlVmFsMiwgc2NhbGUpIHtcclxuXHJcblx0dmFyIHYxID0gYWxsUG9pbnRzW25vdGVWYWwxXS5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKTtcclxuXHR2YXIgdjIgPSBhbGxQb2ludHNbbm90ZVZhbDJdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cclxuXHR2YXIgY3lsaW5kZXIgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgwLjQsIDAuNCwgdjEuZGlzdGFuY2VUbyh2MiksIDEwLCAwLjUsIHRydWUpO1xyXG5cclxuXHR0aGlzLmdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG5cdC8qdmFyIHNwaGVyZUFNZXNoID0gc3BoZXJlTWVzaC5jbG9uZSgpO1xyXG5cdHNwaGVyZUFNZXNoLnBvc2l0aW9uLmNvcHkodjEpO1xyXG5cdHNwaGVyZUFNZXNoLnVwZGF0ZU1hdHJpeCgpO1xyXG5cclxuXHR2YXIgc3BoZXJlQk1lc2ggPSBzcGhlcmVNZXNoLmNsb25lKCk7XHJcblx0c3BoZXJlQk1lc2gucG9zaXRpb24uY29weSh2Mik7XHJcblx0c3BoZXJlQk1lc2gudXBkYXRlTWF0cml4KCk7Ki9cclxuXHJcblx0dmFyIGN5bGluZGVyTWVzaCA9IG5ldyBDeWxpbmRlckZyb21QdHModjEsIHYyKTtcclxuXHJcblx0Lyp0aGlzLmdyb3VwLmFkZChzcGhlcmVzW25vdGVWYWwxXSk7XHJcblx0dGhpcy5ncm91cC5hZGQoc3BoZXJlc1tub3RlVmFsMl0pOyovXHJcblx0dGhpcy5ncm91cC5hZGQoY3lsaW5kZXJNZXNoKTtcclxuXHJcblx0cmV0dXJuIHRoaXMuZ3JvdXA7XHJcbn1cdFxyXG4iLCJ2YXIgYWxsUG9pbnRzID0gW1xyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjc1OTY2MDY5MzA0NywgMC42MDQyOTI3MDQwNzksIC0wLjI0MDMwMzg4OTM1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC40ODQyNjY4NDg3NzcsIC0wLjIwNjc3NzA0NzExOSwgLTAuODUwMTM0NjE5OTA0KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC45MjAyMzc5MTgxMTQsIC0wLjM4MDY5MzM5MTgxNiwgMC4wOTA3NDUzMzMxNzk0KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjQ4NDI2MjgwNTA5MywgMC4yMDY3Nzk5NzU5NjgsIDAuODUwMTM2MjEwOTM1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjE1MTQ1MTYxOTg4LCAwLjYyNjM2ODMxNjA3MywgLTAuNzY0NjczMjIzOTY5KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjkyMDIzOTc4MjkyMiwgMC4zODA2ODk2MDYyMjksIC0wLjA5MDc0MjMwMzQ1NDUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuNTUzOTY5NTYxMDA1LCAtMC4zNDQ5NzEwNDU1NTYsIC0wLjc1NzcwMjI1MjM0NSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuMTA4MzY5NjE5OTg1LCAtMC45NjczNjg4NTUyMjcsIC0wLjIyOTAyNzM0MjAzNyksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuMTUxNDUwMDY4OTc0LCAtMC42MjYzNjk0MjA5MjcsIDAuNzY0NjcyNjI2MTE5KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjc1OTY1OTkwMDk3MSwgLTAuNjA0MjkyOTg3MzMzLCAwLjI0MDMwNTY4MDk5MSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoMC4xMDgzNzE4MDU5NjQsIDAuOTY3MzY5NzAzODYyLCAwLjIyOTAyMjcyMzE1NSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuNTUzOTcwMzI2OTM4LCAwLjM0NDk3MjQ0MTc2NywgMC43NTc3MDEwNTY2OClcclxuXTtcclxuXHJcbi8qXHJcbnZhciBhbGxQb2ludHMgPSBbXHJcblx0Wy0wLjc1OTY2MDY5MzA0NywgMC42MDQyOTI3MDQwNzksIC0wLjI0MDMwMzg4OTM1XSxcclxuXHRbLTAuNDg0MjY2ODQ4Nzc3LCAtMC4yMDY3NzcwNDcxMTksIC0wLjg1MDEzNDYxOTkwNF0sXHJcblx0Wy0wLjkyMDIzNzkxODExNCwgLTAuMzgwNjkzMzkxODE2LCAwLjA5MDc0NTMzMzE3OTRdLFxyXG5cdFswLjQ4NDI2MjgwNTA5MywgMC4yMDY3Nzk5NzU5NjgsIDAuODUwMTM2MjEwOTM1XSxcclxuXHRbMC4xNTE0NTE2MTk4OCwgMC42MjYzNjgzMTYwNzMsIC0wLjc2NDY3MzIyMzk2OV0sXHJcblx0WzAuOTIwMjM5NzgyOTIyLCAwLjM4MDY4OTYwNjIyOSwgLTAuMDkwNzQyMzAzNDU0NV0sXHJcblx0WzAuNTUzOTY5NTYxMDA1LCAtMC4zNDQ5NzEwNDU1NTYsIC0wLjc1NzcwMjI1MjM0NV0sXHJcblx0Wy0wLjEwODM2OTYxOTk4NSwgLTAuOTY3MzY4ODU1MjI3LCAtMC4yMjkwMjczNDIwMzddLFxyXG5cdFstMC4xNTE0NTAwNjg5NzQsIC0wLjYyNjM2OTQyMDkyNywgMC43NjQ2NzI2MjYxMTldLFxyXG5cdFswLjc1OTY1OTkwMDk3MSwgLTAuNjA0MjkyOTg3MzMzLCAwLjI0MDMwNTY4MDk5MV0sXHJcblx0WzAuMTA4MzcxODA1OTY0LCAwLjk2NzM2OTcwMzg2MiwgMC4yMjkwMjI3MjMxNTVdLFxyXG5cdFstMC41NTM5NzAzMjY5MzgsIDAuMzQ0OTcyNDQxNzY3LCAwLjc1NzcwMTA1NjY4XVxyXG5dO1xyXG4qLyIsImZ1bmN0aW9uKiBzdWJzZXRzKGFycmF5LCBsZW5ndGgsIHN0YXJ0ID0gMCkge1xyXG4gIGlmIChzdGFydCA+PSBhcnJheS5sZW5ndGggfHwgbGVuZ3RoIDwgMSkge1xyXG4gICAgeWllbGQgbmV3IFNldCgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3aGlsZSAoc3RhcnQgPD0gYXJyYXkubGVuZ3RoIC0gbGVuZ3RoKSB7XHJcbiAgICAgIGxldCBmaXJzdCA9IGFycmF5W3N0YXJ0XTtcclxuICAgICAgZm9yIChzdWJzZXQgb2Ygc3Vic2V0cyhhcnJheSwgbGVuZ3RoIC0gMSwgc3RhcnQgKyAxKSkge1xyXG4gICAgICAgIHN1YnNldC5hZGQoZmlyc3QpO1xyXG4gICAgICAgIHlpZWxkIHN1YnNldDtcclxuICAgICAgfVxyXG4gICAgICArK3N0YXJ0O1xyXG4gICAgfVxyXG4gIH1cclxufSIsInZhciB0cmFuc3BhcmVudE1hdGVyaWFsRnJvbnQgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCgge1xyXG5cdGNvbG9yOiAweGZmZmZmZixcclxuXHRvcGFjaXR5OiAwLjQsXHJcblx0dHJhbnNwYXJlbnQ6IHRydWVcclxufSApO1xyXG5cclxudmFyIHRyYW5zcGFyZW50TWF0ZXJpYWxCYWNrID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoIHtcclxuXHRjb2xvcjogMHhmZmZmZmYsXHJcblx0b3BhY2l0eTogMC40LFxyXG5cdHRyYW5zcGFyZW50OiB0cnVlXHJcbn0gKTtcclxuXHJcbnZhciBwb2ludHNNYXRlcmlhbCA9IG5ldyBUSFJFRS5Qb2ludHNNYXRlcmlhbCgge1xyXG5cdGNvbG9yOiAweDAwODBmZixcclxuXHRzaXplOiAxLFxyXG5cdGFscGhhVGVzdDogMC41XHJcbn0gKTtcclxuXHJcbnZhciBSR0JNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTm9ybWFsTWF0ZXJpYWwoIHtcclxuXHRjb2xvcjogMHgwMDg4ZmZcclxufSk7XHJcblxyXG52YXIgU1RETWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoIHtcclxuXHRjb2xvcjogMHgwMDg4ZmYsXHJcblx0b3BhY2l0eTogMC41XHJcbn0pO1xyXG5cclxudmFyIGZsYXRTaGFwZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCB7XHJcblx0c2lkZSA6IFRIUkVFLkRvdWJsZVNpZGUsXHJcblx0dHJhbnNwYXJlbnQgOiB0cnVlLFxyXG5cdG9wYWNpdHk6IDAuNVxyXG59KTsiLCJmdW5jdGlvbiBDeWxpbmRlckZyb21QdHModjEsIHYyKSB7XHJcblx0dmFyIGN5bGluZGVyID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC40LCAwLjQsIHYxLmRpc3RhbmNlVG8odjIpLCAxMCwgMC41LCB0cnVlKTtcclxuXHR2YXIgY3lsaW5kZXJNZXNoID0gbmV3IFRIUkVFLk1lc2goY3lsaW5kZXIsIFJHQk1hdGVyaWFsKTtcclxuXHRjeWxpbmRlck1lc2gucG9zaXRpb24uY29weSh2MS5jbG9uZSgpLmxlcnAodjIsIC41KSk7XHJcblxyXG5cdC8vY3JlYXRlcyBxdWF0ZXJuaW9uIGZyb20gc3BoZXJlcyBwb3NpdGlvbiB0byByb3RhdGUgdGhlIGN5bGluZGVyXHJcblx0dmFyIHEgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xyXG5cdHEuc2V0RnJvbVVuaXRWZWN0b3JzKG5ldyBUSFJFRS5WZWN0b3IzKDAsMSwwKSwgbmV3IFRIUkVFLlZlY3RvcjMoKS5zdWJWZWN0b3JzKHYxLCB2Mikubm9ybWFsaXplKCkpO1xyXG5cdGN5bGluZGVyTWVzaC5zZXRSb3RhdGlvbkZyb21RdWF0ZXJuaW9uKHEpO1xyXG5cdHJldHVybiBjeWxpbmRlck1lc2g7XHJcbn0iLCJmdW5jdGlvbiBQb2x5TWVzaGVzKGdlb21ldHJ5LCBub3Rlcykge1xyXG5cdHRoaXMuZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcblx0dGhpcy5ncm91cC5hZGQobmV3IFRyYW5zcE1lc2hHcnAoZ2VvbWV0cnkpKTtcclxuXHQvL3RoaXMuZ3JvdXAuYWRkKG5ldyBQb2x5U3BoZXJlc0Zyb21Ob3Rlcyhub3RlcykpO1xyXG5cdHJldHVybiB0aGlzLmdyb3VwO1xyXG59XHJcblxyXG5Qb2x5TWVzaGVzLnByb3RvdHlwZS5zZXRQb3MgPSBmdW5jdGlvbih4LHkseikge1xyXG5cdHRoaXMuZ3JvdXAucG9zaXRpb24ueCA9IHg7XHJcblx0dGhpcy5ncm91cC5wb3NpdGlvbi55ID0geTtcclxuXHR0aGlzLmdyb3VwLnBvc2l0aW9uLnogPSB6O1xyXG59IiwiLy9jcmVhdGVzIHNwaGVyZXMgZm9yIGVhY2ggdmVydGV4IG9mIHRoZSBnZW9tZXRyeVxyXG52YXIgc3BoZXJlID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDIsNTAsNTApO1xyXG52YXIgc3BoZXJlTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHNwaGVyZSwgUkdCTWF0ZXJpYWwpO1xyXG5cclxuZnVuY3Rpb24gUG9seVNwaGVyZXMoZ2VvbWV0cnkpIHtcclxuXHR0aGlzLmdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblx0dmFyIG1lc2ggPSBzcGhlcmVNZXNoLmNsb25lKCk7XHJcblx0Zm9yKHZhciBpPTA7IGk8Z2VvbWV0cnkudmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHNwaGVyZU1lc2gucG9zaXRpb24uY29weShnZW9tZXRyeS52ZXJ0aWNlc1tpXSk7XHJcblx0XHR0aGlzLmdyb3VwLmFkZChzcGhlcmVNZXNoLmNsb25lKCkpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXMuZ3JvdXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFBvbHlTcGhlcmVzRnJvbU5vdGVzKG5vdGVzKSB7XHJcblx0dmFyIGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblx0Zm9yKHZhciBpIGluIG5vdGVzKSB7XHJcblx0XHRncm91cC5hZGQoc3BoZXJlcy5nZXRPYmplY3RCeUlkKG5vdGVzW2ldKS5jbG9uZSgpKTtcclxuXHR9XHJcblx0Lypjb25zb2xlLmxvZyhncm91cCk7Ki9cclxuXHJcblx0cmV0dXJuIGdyb3VwO1xyXG59IiwiLypmdW5jdGlvbiBtYWtlVGV4dFNwcml0ZSggbm90ZSwgc2NhbGUsIHBhcmFtZXRlcnMgKVxyXG57XHJcblx0dmFyIG1lc3NhZ2U7XHJcblxyXG5cdGlmKG5vdGUgPT0gMCkge1xyXG5cdFx0bWVzc2FnZSA9ICdDJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSAxKSB7XHJcblx0XHRtZXNzYWdlID0gJ0MjJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSAyKSB7XHJcblx0XHRtZXNzYWdlID0gJ0QnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDMpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRCMnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDQpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRSc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gNSkge1xyXG5cdFx0bWVzc2FnZSA9ICdGJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSA2KSB7XHJcblx0XHRtZXNzYWdlID0gJ0YjJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSA3KSB7XHJcblx0XHRtZXNzYWdlID0gJ0cnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDgpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRyMnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDkpIHtcclxuXHRcdG1lc3NhZ2UgPSAnQSc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gMTApIHtcclxuXHRcdG1lc3NhZ2UgPSAnQSMnO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRtZXNzYWdlID0gJ0InO1xyXG5cdH1cclxuXHJcblxyXG5cdGlmICggcGFyYW1ldGVycyA9PT0gdW5kZWZpbmVkICkgcGFyYW1ldGVycyA9IHt9O1xyXG5cdFxyXG5cdHZhciBmb250ZmFjZSA9IHBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkoXCJmb250ZmFjZVwiKSA/IFxyXG5cdFx0cGFyYW1ldGVyc1tcImZvbnRmYWNlXCJdIDogXCJBcmlhbFwiO1xyXG5cdFxyXG5cdHZhciBmb250c2l6ZSA9IHBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkoXCJmb250c2l6ZVwiKSA/IFxyXG5cdFx0cGFyYW1ldGVyc1tcImZvbnRzaXplXCJdIDogMTg7XHJcblx0XHJcblx0dmFyIGJvcmRlclRoaWNrbmVzcyA9IHBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkoXCJib3JkZXJUaGlja25lc3NcIikgPyBcclxuXHRcdHBhcmFtZXRlcnNbXCJib3JkZXJUaGlja25lc3NcIl0gOiA0O1xyXG5cdFxyXG5cdHZhciBib3JkZXJDb2xvciA9IHBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkoXCJib3JkZXJDb2xvclwiKSA/XHJcblx0XHRwYXJhbWV0ZXJzW1wiYm9yZGVyQ29sb3JcIl0gOiB7IHI6MCwgZzowLCBiOjAsIGE6MS4wIH07XHJcblx0XHJcblx0dmFyIGJhY2tncm91bmRDb2xvciA9IHBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkoXCJiYWNrZ3JvdW5kQ29sb3JcIikgP1xyXG5cdFx0cGFyYW1ldGVyc1tcImJhY2tncm91bmRDb2xvclwiXSA6IHsgcjoyNTUsIGc6MjU1LCBiOjI1NSwgYToxLjAgfTtcclxuXHJcblx0Ly92YXIgc3ByaXRlQWxpZ25tZW50ID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImFsaWdubWVudFwiKSA/XHJcblx0Ly9cdHBhcmFtZXRlcnNbXCJhbGlnbm1lbnRcIl0gOiBUSFJFRS5TcHJpdGVBbGlnbm1lbnQudG9wTGVmdDtcclxuXHJcblx0dmFyIHNwcml0ZUFsaWdubWVudCA9IFRIUkVFLlNwcml0ZUFsaWdubWVudC50b3BMZWZ0O1xyXG5cdFx0XHJcblxyXG5cdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuXHR2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cdGNvbnRleHQuZm9udCA9IFwiQm9sZCBcIiArIGZvbnRzaXplICsgXCJweCBcIiArIGZvbnRmYWNlO1xyXG4gICAgXHJcblx0Ly8gZ2V0IHNpemUgZGF0YSAoaGVpZ2h0IGRlcGVuZHMgb25seSBvbiBmb250IHNpemUpXHJcblx0dmFyIG1ldHJpY3MgPSBjb250ZXh0Lm1lYXN1cmVUZXh0KCBtZXNzYWdlICk7XHJcblx0dmFyIHRleHRXaWR0aCA9IG1ldHJpY3Mud2lkdGg7XHJcblx0XHJcblx0Ly8gYmFja2dyb3VuZCBjb2xvclxyXG5cdGNvbnRleHQuZmlsbFN0eWxlICAgPSBcInJnYmEoXCIgKyBiYWNrZ3JvdW5kQ29sb3IuciArIFwiLFwiICsgYmFja2dyb3VuZENvbG9yLmcgKyBcIixcIlxyXG5cdFx0XHRcdFx0XHRcdFx0ICArIGJhY2tncm91bmRDb2xvci5iICsgXCIsXCIgKyBiYWNrZ3JvdW5kQ29sb3IuYSArIFwiKVwiO1xyXG5cdC8vIGJvcmRlciBjb2xvclxyXG5cdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcInJnYmEoXCIgKyBib3JkZXJDb2xvci5yICsgXCIsXCIgKyBib3JkZXJDb2xvci5nICsgXCIsXCJcclxuXHRcdFx0XHRcdFx0XHRcdCAgKyBib3JkZXJDb2xvci5iICsgXCIsXCIgKyBib3JkZXJDb2xvci5hICsgXCIpXCI7XHJcblxyXG5cdGNvbnRleHQubGluZVdpZHRoID0gYm9yZGVyVGhpY2tuZXNzO1xyXG5cdHJvdW5kUmVjdChjb250ZXh0LCBib3JkZXJUaGlja25lc3MvMiwgYm9yZGVyVGhpY2tuZXNzLzIsIHRleHRXaWR0aCArIGJvcmRlclRoaWNrbmVzcywgZm9udHNpemUgKiAxLjQgKyBib3JkZXJUaGlja25lc3MsIDYpO1xyXG5cdC8vIDEuNCBpcyBleHRyYSBoZWlnaHQgZmFjdG9yIGZvciB0ZXh0IGJlbG93IGJhc2VsaW5lOiBnLGoscCxxLlxyXG5cdFxyXG5cdC8vIHRleHQgY29sb3JcclxuXHRjb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAxLjApXCI7XHJcblxyXG5cdGNvbnRleHQuZmlsbFRleHQoIG1lc3NhZ2UsIGJvcmRlclRoaWNrbmVzcywgZm9udHNpemUgKyBib3JkZXJUaGlja25lc3MpO1xyXG5cdFxyXG5cdC8vIGNhbnZhcyBjb250ZW50cyB3aWxsIGJlIHVzZWQgZm9yIGEgdGV4dHVyZVxyXG5cdHZhciB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoY2FudmFzKSBcclxuXHR0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuXHJcblx0dmFyIHNwcml0ZU1hdGVyaWFsID0gbmV3IFRIUkVFLlNwcml0ZU1hdGVyaWFsKCBcclxuXHRcdHsgbWFwOiB0ZXh0dXJlLCB1c2VTY3JlZW5Db29yZGluYXRlczogZmFsc2UsIGFsaWdubWVudDogc3ByaXRlQWxpZ25tZW50IH0gKTtcclxuXHR2YXIgc3ByaXRlID0gbmV3IFRIUkVFLlNwcml0ZSggc3ByaXRlTWF0ZXJpYWwgKTtcclxuXHRzcHJpdGUuc2NhbGUuc2V0KDEwMCw1MCwxLjApO1xyXG5cdHNwcml0ZS5wb3NpdGlvbi5jb3B5KGFsbFBvaW50c1tub3RlVmFsXS5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKSlcclxuXHRyZXR1cm4gc3ByaXRlO1x0XHJcbn1cclxuXHJcbi8vIGZ1bmN0aW9uIGZvciBkcmF3aW5nIHJvdW5kZWQgcmVjdGFuZ2xlc1xyXG5mdW5jdGlvbiByb3VuZFJlY3QoY3R4LCB4LCB5LCB3LCBoLCByKSBcclxue1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4Lm1vdmVUbyh4K3IsIHkpO1xyXG4gICAgY3R4LmxpbmVUbyh4K3ctciwgeSk7XHJcbiAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4K3csIHksIHgrdywgeStyKTtcclxuICAgIGN0eC5saW5lVG8oeCt3LCB5K2gtcik7XHJcbiAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4K3csIHkraCwgeCt3LXIsIHkraCk7XHJcbiAgICBjdHgubGluZVRvKHgrciwgeStoKTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHkraCwgeCwgeStoLXIpO1xyXG4gICAgY3R4LmxpbmVUbyh4LCB5K3IpO1xyXG4gICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCwgeSwgeCtyLCB5KTtcclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgIGN0eC5maWxsKCk7XHJcblx0Y3R4LnN0cm9rZSgpOyAgIFxyXG59Ki8iLCIvL2NyZWF0ZXMgYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgdHdvIG1lc2hlcyB0byBjcmVhdGUgdHJhbnNwYXJlbmN5XHJcbmZ1bmN0aW9uIFRyYW5zcE1lc2hHcnAoZ2VvbWV0cnkpIHtcclxuXHR2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHR2YXIgbWVzaEdlb21ldHJ5ID0gbmV3IFRIUkVFLkNvbnZleEJ1ZmZlckdlb21ldHJ5KGdlb21ldHJ5LnZlcnRpY2VzKTtcclxuXHJcblx0dmFyIGZhY2VzID0gbWVzaEdlb21ldHJ5LmZhY2VzO1xyXG5cdGZvcih2YXIgZmFjZSBpbiBmYWNlcykge1xyXG5cdFx0Zm9yKHZhciBpPTA7IGk8MzsgaSsrKSB7XHJcblx0XHRcdHZhciB2MSA9IGZhY2VzW2ZhY2VdLmdldEVkZ2UoaSkuaGVhZCgpO1xyXG5cdFx0XHR2YXIgdjIgPSBmYWNlc1tmYWNlXS5nZXRFZGdlKGkpLnRhaWwoKTtcclxuXHRcdFx0Z3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjEucG9pbnQsIHYyLnBvaW50KSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKG1lc2hHZW9tZXRyeSwgdHJhbnNwYXJlbnRNYXRlcmlhbEJhY2spO1xyXG5cdG1lc2gubWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkJhY2tTaWRlOyAvLyBiYWNrIGZhY2VzXHJcblx0bWVzaC5yZW5kZXJPcmRlciA9IDA7XHJcblxyXG5cdHZhciBtZXNoMiA9IG5ldyBUSFJFRS5NZXNoKG1lc2hHZW9tZXRyeSwgdHJhbnNwYXJlbnRNYXRlcmlhbEZyb250LmNsb25lKCkpO1xyXG5cdG1lc2gyLm1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Gcm9udFNpZGU7IC8vIGZyb250IGZhY2VzXHJcblx0bWVzaDIucmVuZGVyT3JkZXIgPSAxO1xyXG5cclxuXHRncm91cC5hZGQobWVzaCk7XHJcblx0Z3JvdXAuYWRkKG1lc2gyKTtcclxuXHJcblx0cmV0dXJuIGdyb3VwO1xyXG59XHJcblxyXG4vKmZ1bmN0aW9uIG1ha2VUcmFuc3BhcmVudChnZW9tZXRyeSwgZ3JvdXApIHtcclxuXHQvL2dlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XHJcblx0Ly9nZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTtcclxuXHRncm91cC5hZGQobmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHRyYW5zcGFyZW50TWF0ZXJpYWxGcm9udCkpO1xyXG59Ki8iLCJmdW5jdGlvbiBtYWtlTGlnaHRzKCkge1xyXG5cdHZhciB4ID0gMDtcclxuXHR2YXIgeSA9IDA7XHJcblx0dmFyIHogPSAwO1xyXG5cclxuXHR2YXIgZGlzdGFuY2UgPSAzMDtcclxuXHJcblx0Ly90b3AgbGlnaHRzXHJcblx0dmFyIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweGZmMDAwMCwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0LnBvc2l0aW9uLnNldCh4K2Rpc3RhbmNlLCB5K2Rpc3RhbmNlLCB6K2Rpc3RhbmNlKTtcclxuXHRtYWluR3JvdXAuYWRkKHBvaW50TGlnaHQpO1xyXG5cclxuXHR2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpO1xyXG5cclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4MDBmZjAwLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgrZGlzdGFuY2UsIHkrZGlzdGFuY2UsIHotZGlzdGFuY2UpO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdHZhciBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0LCAxKTtcclxuXHRtYWluR3JvdXAuYWRkKGhlbHBlcik7XHJcblxyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZmZmMDAsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeC1kaXN0YW5jZSwgeStkaXN0YW5jZSwgeitkaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0dmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTtcclxuXHJcblx0dmFyIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDAwMDBmZiwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0LnBvc2l0aW9uLnNldCh4LWRpc3RhbmNlLCB5K2Rpc3RhbmNlLCB6LWRpc3RhbmNlKTtcclxuXHRtYWluR3JvdXAuYWRkKHBvaW50TGlnaHQpO1xyXG5cclxuXHR2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpO1xyXG5cclxuXHJcblx0Ly9ib3R0b20gbGlnaHRzXHJcblx0dmFyIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDAwZmZmZiwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0LnBvc2l0aW9uLnNldCh4K2Rpc3RhbmNlLCB5LWRpc3RhbmNlLCB6K2Rpc3RhbmNlKTtcclxuXHRtYWluR3JvdXAuYWRkKHBvaW50TGlnaHQpO1xyXG5cclxuXHR2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpO1xyXG5cclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmYwMGZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgrZGlzdGFuY2UsIHktZGlzdGFuY2UsIHotZGlzdGFuY2UpO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdHZhciBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0LCAxKTtcclxuXHRtYWluR3JvdXAuYWRkKGhlbHBlcik7XHJcblxyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZjg4ODgsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeC1kaXN0YW5jZSwgeS1kaXN0YW5jZSwgeitkaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0dmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTtcclxuXHJcblx0dmFyIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDg4ODhmZiwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0LnBvc2l0aW9uLnNldCh4LWRpc3RhbmNlLCB5LWRpc3RhbmNlLCB6LWRpc3RhbmNlKTtcclxuXHRtYWluR3JvdXAuYWRkKHBvaW50TGlnaHQpO1xyXG5cclxuXHR2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpO1xyXG5cclxuXHJcblxyXG5cdC8vbWlkZGxlIGxpZ2h0XHJcblx0Lyp2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmZmZmZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgsIHksIHopO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdHZhciBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0LCAxKTtcclxuXHRncm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxufSIsInZhciBzY2FsZSA9IDE1O1xyXG5cclxuZnVuY3Rpb24gQ2hvcmQobm90ZXMpIHtcclxuXHR0aGlzLm5vdGVzID0gW107XHJcblxyXG5cdGZvcih2YXIgaSBpbiBub3Rlcykge1xyXG5cdFx0dGhpcy5ub3Rlcy5wdXNoKG5vdGVzW2ldICUgMTIpO1xyXG5cdH1cclxuXHJcblx0dGhpcy5kcmF3Q2hvcmQoKTtcclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLmFkZE5vdGUgPSBmdW5jdGlvbihub3RlKSB7XHJcblx0dGhpcy5ub3Rlcy5wdXNoKG5vdGUpO1xyXG59XHJcblxyXG5DaG9yZC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMucG9seWhlZHJvbi52aXNpYmxlID0gdHJ1ZTtcclxuXHRmb3IodmFyIGkgaW4gdGhpcy5ub3Rlcykge1xyXG5cdFx0c3BoZXJlcy5jaGlsZHJlblt0aGlzLm5vdGVzW2ldXS52aXNpYmxlID0gdHJ1ZTtcclxuXHRcdGNvbnNvbGUubG9nKGkpO1xyXG5cdFx0Y29uc29sZS5sb2coc3BoZXJlc1t0aGlzLm5vdGVzW2ldXSk7XHJcblx0fVxyXG59XHJcblxyXG5DaG9yZC5wcm90b3R5cGUuZHJhd0Nob3JkID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIG5iTm90ZXMgPSB0aGlzLm5vdGVzLmxlbmd0aDtcclxuXHJcblx0aWYobmJOb3RlcyA9PSAxKSB7XHJcblx0XHR0aGlzLnBvbHloZWRyb24gPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcclxuXHR9IGVsc2UgaWYobmJOb3RlcyA9PSAyKSB7XHJcblx0XHR0aGlzLnBvbHloZWRyb24gPSBuZXcgVHdvUG9pbnRzKHRoaXMubm90ZXNbMF0sIHRoaXMubm90ZXNbMV0sIHNjYWxlKTtcclxuXHR9IGVsc2UgaWYobmJOb3RlcyA9PSAzKSB7XHJcblx0XHR0aGlzLnBvbHloZWRyb24gPSBuZXcgVGhyZWVQb2ludHModGhpcy5ub3Rlcywgc2NhbGUpO1xyXG5cdH1lbHNlIHtcclxuXHRcdHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIGk9MDsgaTxuYk5vdGVzOyBpKyspIHtcclxuXHRcdFx0Z2VvbWV0cnkudmVydGljZXMucHVzaChcclxuXHRcdFx0XHRhbGxQb2ludHNbdGhpcy5ub3Rlc1tpXV0uY2xvbmUoKVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHZhciBzdWJzID0gc3Vic2V0cyh0aGlzLm5vdGVzLCAzKTtcclxuXHRcdC8vIHZhciBwb2ludElkcztcclxuXHRcdC8vIHZhciBwb2ludElkMSwgcG9pbnRJZDIsIHBvaW50SWQzO1xyXG5cdFx0Ly8gdmFyIGZhY2U7XHJcblxyXG5cdFx0Ly8gZm9yKHN1YiBvZiBzdWJzKSB7XHJcblx0XHQvLyBcdHBvaW50SWRzID0gc3ViLmVudHJpZXMoKTtcclxuXHRcdFx0XHJcblx0XHQvLyBcdC8vZ2V0IHRoZSBmYWNlJ3MgMyB2ZXJ0aWNlcyBpbmRleFxyXG5cdFx0Ly8gXHRwb2ludElkMSA9IHBvaW50SWRzLm5leHQoKS52YWx1ZVswXS52YWx1ZTtcclxuXHRcdC8vIFx0cG9pbnRJZDIgPSBwb2ludElkcy5uZXh0KCkudmFsdWVbMF0udmFsdWU7XHJcblx0XHQvLyBcdHBvaW50SWQzID0gcG9pbnRJZHMubmV4dCgpLnZhbHVlWzBdLnZhbHVlO1xyXG5cclxuXHRcdC8vIFx0ZmFjZSA9IG5ldyBUSFJFRS5GYWNlMyhwb2ludElkMSxwb2ludElkMixwb2ludElkMyk7XHJcblx0XHQvLyBcdGdlb21ldHJ5LmZhY2VzLnB1c2goZmFjZSk7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0Ly8gdmFyIG1lc2hHZW9tZXRyeSA9IG5ldyBUSFJFRS5Db252ZXhCdWZmZXJHZW9tZXRyeShnZW9tZXRyeS52ZXJ0aWNlcyk7XHJcblx0XHRcclxuXHRcdGdlb21ldHJ5LnNjYWxlKHNjYWxlLHNjYWxlLHNjYWxlKTtcclxuXHRcdHRoaXMucG9seWhlZHJvbiA9IG5ldyBQb2x5TWVzaGVzKGdlb21ldHJ5LCB0aGlzLm5vdGVzKTtcclxuXHJcblx0fVxyXG5cdHRoaXMucG9seWhlZHJvbi52aXNpYmxlID0gZmFsc2U7XHJcblx0c2hhcGVzR3JvdXAuYWRkKHRoaXMucG9seWhlZHJvbik7XHJcblx0XHJcblxyXG59IiwidmFyIG1haW5Hcm91cCwgc2hhcGVzR3JvdXAsIHNwaGVyZXMsIGxhYmVscywgY29udGFpbmVyLCBjYW1lcmEsIHJlbmRlcmVyLCBzY2VuZSwgc3RhdHM7XG52YXIgY2hvcmRzID0gW107XG52YXIgbW91c2VYID0gMCwgbW91c2VZID0gMDtcbnZhciB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbnZhciB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG4vL3ZhciB3cyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovLzEyNy4wLjAuMTo1Njc4L1wiKTtcbnZhciBjdWJlO1xuXG5pbml0KCk7XG5hbmltYXRlKCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cdGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG5cdGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGgvd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApO1xuXHRjYW1lcmEucG9zaXRpb24ueiA9IDUwO1xuXG5cdHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cdHNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoIDB4MDAwMDAwICk7XG5cblx0cmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuXHQvL3JlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuXHRyZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXG5cdHZhciBjb250cm9scyA9IG5ldyBUSFJFRS5PcmJpdENvbnRyb2xzKCBjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQgKTtcblx0Y29udHJvbHMubWluRGlzdGFuY2UgPSA1O1xuXHRjb250cm9scy5tYXhEaXN0YW5jZSA9IDIwMDtcblx0Y29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEk7XG5cblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKCByZW5kZXJlci5kb21FbGVtZW50ICk7XG5cblx0bWFpbkdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG5cdHNoYXBlc0dyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG5cdHNjZW5lLmFkZChzaGFwZXNHcm91cCk7XG5cdHNjZW5lLmFkZChtYWluR3JvdXApO1xuXG5cdHZhciBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KCAweDQwNDA0MCApO1xuXHRzY2VuZS5hZGQoIGFtYmllbnRMaWdodCApO1xuXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoIDB4ZmYwMDAwLCAxLCAxMDAgKTtcblx0Ly9jYW1lcmEuYWRkKHBvaW50TGlnaHQpO1xuXHRzcGhlcmVzID0gbmV3IFRIUkVFLkdyb3VwKCk7XG5cdGxhYmVscyA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXG5cdGZvcih2YXIgaSBpbiBhbGxQb2ludHMpIHtcblx0XHR2YXIgcG9pbnQgPSBuZXcgT25lUG9pbnQoaSwgc2NhbGUpO1xuXHRcdHBvaW50LnZpc2libGUgPSBmYWxzZTtcblx0XHRzcGhlcmVzLmFkZChwb2ludCk7XG5cblx0XHQvKnZhciBsYWJlbCA9IG5ldyBtYWtlVGV4dFNwcml0ZShpLCBzY2FsZSk7XG5cdFx0bGFiZWxzLmFkZChsYWJlbCk7XHRcdCovXG5cdH1cblx0c2NlbmUuYWRkKHNwaGVyZXMpO1xuXHQvL3NjZW5lLmFkZChsYWJlbHMpO1xuXG5cdG1ha2VMaWdodHMoKTtcblxuXHRzdGF0cyA9IG5ldyBTdGF0cygpO1xuXHQvL2NvbnRhaW5lci5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UgKTtcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG5cdHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xuXHR3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG5cdGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcblx0Y2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblx0cmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xufVxuXG5mdW5jdGlvbiBkcmF3Q2hvcmRzKGZyb20sIHRvKSB7XG5cdGZvcih2YXIgaT1mcm9tOyBpPD10bzsgaSsrKSB7XG5cdFx0Ly9zaGFwZXNHcm91cC5jaGlsZHJlbltpXS52aXNpYmxlID0gdHJ1ZTtcblx0XHRjaG9yZHNbaV0uc2hvdygpO1xuXHR9XG5cdHJlbmRlcigpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGFuaW1hdGUgKTtcblx0cmVuZGVyKCk7XG5cdHN0YXRzLnVwZGF0ZSgpO1xufVxuXG5mdW5jdGlvbiByZW5kZXIoKSB7XG5cdHJlbmRlcmVyLnJlbmRlciggc2NlbmUsIGNhbWVyYSApO1xufVxuIiwiZnVuY3Rpb24gcGFyc2VNaWRpKCkge1xuXHR2YXIgaW5wdXRFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpbGUtaW5wdXQnKTtcblx0dmFyIGZpbGUgPSBpbnB1dEVsZW0uZmlsZXNbMF07XG5cdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG5cdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG5cdFx0dmFyIGJpbmFyeSA9IG5ldyBVaW50OEFycmF5KGUudGFyZ2V0LnJlc3VsdCk7XG5cdFx0Zm9yKHZhciBpIGluIGJpbmFyeSkge1xuXHRcdFx0Y29uc29sZS5sb2coYmluYXJ5W2ldLnRvU3RyaW5nKDE2KSk7XG5cdFx0fVxuXHR9IFxuXG5cdHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihmaWxlKTsgXG59IiwiXHJcblxyXG5mdW5jdGlvbiB0ZXN0cHkoKSB7XHJcblx0dmFyIHJlc3VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHQnKSxcclxuICAgICAgICBzZW50X3R4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0eHQtaW5wdXQnKS52YWx1ZTtcclxuXHJcbiAgICB3cy5zZW5kKHNlbnRfdHh0KTtcclxuXHJcbiAgICB3cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICByZXN1bHQuaW5uZXJIVE1MID0gZXZlbnQuZGF0YTtcclxuXHJcbiAgICAgICAgLyp2YXIgbWVzc2FnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSxcclxuICAgICAgICAgICAgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyksXHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShldmVudC5kYXRhKTtcclxuICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICAgIG1lc3NhZ2VzLmFwcGVuZENoaWxkKG1lc3NhZ2UpOyovXHJcblxyXG4gICAgfTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdweXRob24tdGVzdCcpLmFwcGVuZENoaWxkKHJlc3VsdCk7XHJcbn0iLCIvKmZ1bmN0aW9uIG1pZGlUb1B5KCkge1xuXHR2YXIgaW5wdXRFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpbGUtaW5wdXQnKTtcblx0dmFyIGZpbGUgPSBpbnB1dEVsZW0uZmlsZXNbMF07XG5cdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG5cdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldnQpIHtcblx0XHR3cy5zZW5kKGV2dC50YXJnZXQucmVzdWx0KTtcblx0fVxuXG5cdHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuXG5cbn1cblxud3Mub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0Y29uc29sZS5sb2coJ3BhcnNpbmcganNvbi4uLicpO1xuXHR2YXIgaW5wdXRDaG9yZHMgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuXHRjb25zb2xlLmxvZygnanNvbiBwYXJzZWQnKTtcblx0Y29uc29sZS5sb2coJ2NyZWF0aW5nIGNob3JkcycpO1xuXHRmb3IodmFyIGlDaG9yZCBpbiBpbnB1dENob3Jkcykge1xuXHRcdHZhciBjaG9yZCA9IG5ldyBDaG9yZChpbnB1dENob3Jkc1tpQ2hvcmRdKTtcblx0XHRjaG9yZHMucHVzaChjaG9yZCk7XG5cdH1cblx0Y29uc29sZS5sb2coJ2Nob3JkcyBjcmVhdGVkJyk7XG5cblx0ZHJhd0Nob3Jkcyg1LCA2KTtcbn0qLyJdfQ==
