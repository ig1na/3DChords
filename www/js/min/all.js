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
function makeTextSprite( note, scale, parameters )
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

/*function makeTransparent(geometry, group) {
	//geometry.computeVertexNormals();
	//geometry.computeFaceNormals();
	group.add(new THREE.Mesh(geometry, transparentMaterialFront));
}*/
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
		var binary = e.target.result;
		console.log(binary);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9uZVBvaW50LmpzIiwiVGhyZWVQb2ludHMuanMiLCJUd29Qb2ludHMuanMiLCJBbGxQb2ludHMuanMiLCJDb21iaW5hdGlvbnMuanMiLCJtYWtlTGlnaHRzLmpzIiwiTWF0ZXJpYWxzLmpzIiwiUG9seUN5bGluZGVyLmpzIiwiUG9seU1lc2hlcy5qcyIsIlBvbHlTcGhlcmUuanMiLCJUZXh0U3ByaXRlLmpzIiwiVHJhbnNwTWVzaEdycC5qcyIsImNob3JkLmpzIiwicmVuZGVyMi5qcyIsIm1pZGlQYXJzZXIuanMiLCJweXRlc3QuanMiLCJzZW5kTWlkaVRvUHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIE9uZVBvaW50KG5vdGVWYWwsIHNjYWxlKSB7XHJcblx0dmFyIHNwaGVyZSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgyLDUwLDUwKTtcclxuXHR2YXIgc3BoZXJlTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHNwaGVyZSwgUkdCTWF0ZXJpYWwpO1xyXG5cclxuXHRzcGhlcmVNZXNoLnBvc2l0aW9uLmNvcHkoYWxsUG9pbnRzW25vdGVWYWxdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpKVxyXG5cclxuXHRyZXR1cm4gc3BoZXJlTWVzaDtcclxufSIsImZ1bmN0aW9uIFRocmVlUG9pbnRzKG5vdGVzLCBzY2FsZSkge1xyXG5cdHRoaXMuZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcblx0dmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcblx0Zm9yKHZhciBub3RlIGluIG5vdGVzKSB7XHJcblx0XHRnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKCBhbGxQb2ludHNbbm90ZXNbbm90ZV1dLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpICk7XHJcblx0fVxyXG5cclxuXHRnZW9tZXRyeS5mYWNlcy5wdXNoKG5ldyBUSFJFRS5GYWNlMygwLDEsMikpO1xyXG5cdGdlb21ldHJ5LmZhY2VzLnB1c2gobmV3IFRIUkVFLkZhY2UzKDIsMSwwKSk7XHJcblx0Z2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XHJcblxyXG5cdHZhciB2MSA9IGdlb21ldHJ5LnZlcnRpY2VzWzBdO1xyXG5cdHZhciB2MiA9IGdlb21ldHJ5LnZlcnRpY2VzWzFdO1xyXG5cdHZhciB2MyA9IGdlb21ldHJ5LnZlcnRpY2VzWzJdO1xyXG5cclxuXHR0aGlzLmdyb3VwLmFkZChuZXcgQ3lsaW5kZXJGcm9tUHRzKHYxLCB2MikpO1xyXG5cdHRoaXMuZ3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjIsIHYzKSk7XHJcblx0dGhpcy5ncm91cC5hZGQobmV3IEN5bGluZGVyRnJvbVB0cyh2MywgdjEpKTtcclxuXHJcblx0dmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgdHJhbnNwYXJlbnRNYXRlcmlhbEZyb250KTtcclxuXHJcblx0dGhpcy5ncm91cC5hZGQobWVzaCk7XHJcblx0Ly90aGlzLmdyb3VwLmFkZChuZXcgUG9seVNwaGVyZXNGcm9tTm90ZXMobm90ZXMpKTtcclxuXHJcblx0cmV0dXJuIHRoaXMuZ3JvdXA7XHJcbn0iLCJmdW5jdGlvbiBUd29Qb2ludHMobm90ZVZhbDEsIG5vdGVWYWwyLCBzY2FsZSkge1xyXG5cclxuXHR2YXIgdjEgPSBhbGxQb2ludHNbbm90ZVZhbDFdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cdHZhciB2MiA9IGFsbFBvaW50c1tub3RlVmFsMl0uY2xvbmUoKS5tdWx0aXBseVNjYWxhcihzY2FsZSk7XHJcblxyXG5cdHZhciBjeWxpbmRlciA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDAuNCwgMC40LCB2MS5kaXN0YW5jZVRvKHYyKSwgMTAsIDAuNSwgdHJ1ZSk7XHJcblxyXG5cdHRoaXMuZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcblx0Lyp2YXIgc3BoZXJlQU1lc2ggPSBzcGhlcmVNZXNoLmNsb25lKCk7XHJcblx0c3BoZXJlQU1lc2gucG9zaXRpb24uY29weSh2MSk7XHJcblx0c3BoZXJlQU1lc2gudXBkYXRlTWF0cml4KCk7XHJcblxyXG5cdHZhciBzcGhlcmVCTWVzaCA9IHNwaGVyZU1lc2guY2xvbmUoKTtcclxuXHRzcGhlcmVCTWVzaC5wb3NpdGlvbi5jb3B5KHYyKTtcclxuXHRzcGhlcmVCTWVzaC51cGRhdGVNYXRyaXgoKTsqL1xyXG5cclxuXHR2YXIgY3lsaW5kZXJNZXNoID0gbmV3IEN5bGluZGVyRnJvbVB0cyh2MSwgdjIpO1xyXG5cclxuXHQvKnRoaXMuZ3JvdXAuYWRkKHNwaGVyZXNbbm90ZVZhbDFdKTtcclxuXHR0aGlzLmdyb3VwLmFkZChzcGhlcmVzW25vdGVWYWwyXSk7Ki9cclxuXHR0aGlzLmdyb3VwLmFkZChjeWxpbmRlck1lc2gpO1xyXG5cclxuXHRyZXR1cm4gdGhpcy5ncm91cDtcclxufVx0XHJcbiIsInZhciBhbGxQb2ludHMgPSBbXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuNzU5NjYwNjkzMDQ3LCAwLjYwNDI5MjcwNDA3OSwgLTAuMjQwMzAzODg5MzUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjQ4NDI2Njg0ODc3NywgLTAuMjA2Nzc3MDQ3MTE5LCAtMC44NTAxMzQ2MTk5MDQpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjkyMDIzNzkxODExNCwgLTAuMzgwNjkzMzkxODE2LCAwLjA5MDc0NTMzMzE3OTQpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuNDg0MjYyODA1MDkzLCAwLjIwNjc3OTk3NTk2OCwgMC44NTAxMzYyMTA5MzUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuMTUxNDUxNjE5ODgsIDAuNjI2MzY4MzE2MDczLCAtMC43NjQ2NzMyMjM5NjkpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuOTIwMjM5NzgyOTIyLCAwLjM4MDY4OTYwNjIyOSwgLTAuMDkwNzQyMzAzNDU0NSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoMC41NTM5Njk1NjEwMDUsIC0wLjM0NDk3MTA0NTU1NiwgLTAuNzU3NzAyMjUyMzQ1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC4xMDgzNjk2MTk5ODUsIC0wLjk2NzM2ODg1NTIyNywgLTAuMjI5MDI3MzQyMDM3KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC4xNTE0NTAwNjg5NzQsIC0wLjYyNjM2OTQyMDkyNywgMC43NjQ2NzI2MjYxMTkpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuNzU5NjU5OTAwOTcxLCAtMC42MDQyOTI5ODczMzMsIDAuMjQwMzA1NjgwOTkxKSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjEwODM3MTgwNTk2NCwgMC45NjczNjk3MDM4NjIsIDAuMjI5MDIyNzIzMTU1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC41NTM5NzAzMjY5MzgsIDAuMzQ0OTcyNDQxNzY3LCAwLjc1NzcwMTA1NjY4KVxyXG5dO1xyXG5cclxuLypcclxudmFyIGFsbFBvaW50cyA9IFtcclxuXHRbLTAuNzU5NjYwNjkzMDQ3LCAwLjYwNDI5MjcwNDA3OSwgLTAuMjQwMzAzODg5MzVdLFxyXG5cdFstMC40ODQyNjY4NDg3NzcsIC0wLjIwNjc3NzA0NzExOSwgLTAuODUwMTM0NjE5OTA0XSxcclxuXHRbLTAuOTIwMjM3OTE4MTE0LCAtMC4zODA2OTMzOTE4MTYsIDAuMDkwNzQ1MzMzMTc5NF0sXHJcblx0WzAuNDg0MjYyODA1MDkzLCAwLjIwNjc3OTk3NTk2OCwgMC44NTAxMzYyMTA5MzVdLFxyXG5cdFswLjE1MTQ1MTYxOTg4LCAwLjYyNjM2ODMxNjA3MywgLTAuNzY0NjczMjIzOTY5XSxcclxuXHRbMC45MjAyMzk3ODI5MjIsIDAuMzgwNjg5NjA2MjI5LCAtMC4wOTA3NDIzMDM0NTQ1XSxcclxuXHRbMC41NTM5Njk1NjEwMDUsIC0wLjM0NDk3MTA0NTU1NiwgLTAuNzU3NzAyMjUyMzQ1XSxcclxuXHRbLTAuMTA4MzY5NjE5OTg1LCAtMC45NjczNjg4NTUyMjcsIC0wLjIyOTAyNzM0MjAzN10sXHJcblx0Wy0wLjE1MTQ1MDA2ODk3NCwgLTAuNjI2MzY5NDIwOTI3LCAwLjc2NDY3MjYyNjExOV0sXHJcblx0WzAuNzU5NjU5OTAwOTcxLCAtMC42MDQyOTI5ODczMzMsIDAuMjQwMzA1NjgwOTkxXSxcclxuXHRbMC4xMDgzNzE4MDU5NjQsIDAuOTY3MzY5NzAzODYyLCAwLjIyOTAyMjcyMzE1NV0sXHJcblx0Wy0wLjU1Mzk3MDMyNjkzOCwgMC4zNDQ5NzI0NDE3NjcsIDAuNzU3NzAxMDU2NjhdXHJcbl07XHJcbiovIiwiZnVuY3Rpb24qIHN1YnNldHMoYXJyYXksIGxlbmd0aCwgc3RhcnQgPSAwKSB7XHJcbiAgaWYgKHN0YXJ0ID49IGFycmF5Lmxlbmd0aCB8fCBsZW5ndGggPCAxKSB7XHJcbiAgICB5aWVsZCBuZXcgU2V0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdoaWxlIChzdGFydCA8PSBhcnJheS5sZW5ndGggLSBsZW5ndGgpIHtcclxuICAgICAgbGV0IGZpcnN0ID0gYXJyYXlbc3RhcnRdO1xyXG4gICAgICBmb3IgKHN1YnNldCBvZiBzdWJzZXRzKGFycmF5LCBsZW5ndGggLSAxLCBzdGFydCArIDEpKSB7XHJcbiAgICAgICAgc3Vic2V0LmFkZChmaXJzdCk7XHJcbiAgICAgICAgeWllbGQgc3Vic2V0O1xyXG4gICAgICB9XHJcbiAgICAgICsrc3RhcnQ7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiZnVuY3Rpb24gbWFrZUxpZ2h0cygpIHtcclxuXHR2YXIgeCA9IDA7XHJcblx0dmFyIHkgPSAwO1xyXG5cdHZhciB6ID0gMDtcclxuXHJcblx0dmFyIGRpc3RhbmNlID0gMzA7XHJcblxyXG5cdC8vdG9wIGxpZ2h0c1xyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZjAwMDAsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeCtkaXN0YW5jZSwgeStkaXN0YW5jZSwgeitkaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0dmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTtcclxuXHJcblx0dmFyIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDAwZmYwMCwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0LnBvc2l0aW9uLnNldCh4K2Rpc3RhbmNlLCB5K2Rpc3RhbmNlLCB6LWRpc3RhbmNlKTtcclxuXHRtYWluR3JvdXAuYWRkKHBvaW50TGlnaHQpO1xyXG5cclxuXHR2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpO1xyXG5cclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmZmZjAwLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgtZGlzdGFuY2UsIHkrZGlzdGFuY2UsIHorZGlzdGFuY2UpO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdHZhciBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0LCAxKTtcclxuXHRtYWluR3JvdXAuYWRkKGhlbHBlcik7XHJcblxyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHgwMDAwZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeC1kaXN0YW5jZSwgeStkaXN0YW5jZSwgei1kaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0dmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTtcclxuXHJcblxyXG5cdC8vYm90dG9tIGxpZ2h0c1xyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHgwMGZmZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeCtkaXN0YW5jZSwgeS1kaXN0YW5jZSwgeitkaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0dmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTtcclxuXHJcblx0dmFyIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweGZmMDBmZiwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0LnBvc2l0aW9uLnNldCh4K2Rpc3RhbmNlLCB5LWRpc3RhbmNlLCB6LWRpc3RhbmNlKTtcclxuXHRtYWluR3JvdXAuYWRkKHBvaW50TGlnaHQpO1xyXG5cclxuXHR2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0bWFpbkdyb3VwLmFkZChoZWxwZXIpO1xyXG5cclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmY4ODg4LCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQucG9zaXRpb24uc2V0KHgtZGlzdGFuY2UsIHktZGlzdGFuY2UsIHorZGlzdGFuY2UpO1xyXG5cdG1haW5Hcm91cC5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdHZhciBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0LCAxKTtcclxuXHRtYWluR3JvdXAuYWRkKGhlbHBlcik7XHJcblxyXG5cdHZhciBwb2ludExpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHg4ODg4ZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodC5wb3NpdGlvbi5zZXQoeC1kaXN0YW5jZSwgeS1kaXN0YW5jZSwgei1kaXN0YW5jZSk7XHJcblx0bWFpbkdyb3VwLmFkZChwb2ludExpZ2h0KTtcclxuXHJcblx0dmFyIGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQsIDEpO1xyXG5cdG1haW5Hcm91cC5hZGQoaGVscGVyKTtcclxuXHJcblxyXG5cclxuXHQvL21pZGRsZSBsaWdodFxyXG5cdC8qdmFyIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweGZmZmZmZiwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0LnBvc2l0aW9uLnNldCh4LCB5LCB6KTtcclxuXHRtYWluR3JvdXAuYWRkKHBvaW50TGlnaHQpO1xyXG5cclxuXHR2YXIgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodCwgMSk7XHJcblx0Z3JvdXAuYWRkKGhlbHBlcik7Ki9cclxuXHJcbn0iLCJ2YXIgdHJhbnNwYXJlbnRNYXRlcmlhbEZyb250ID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoIHtcclxuXHRjb2xvcjogMHhmZmZmZmYsXHJcblx0b3BhY2l0eTogMC40LFxyXG5cdHRyYW5zcGFyZW50OiB0cnVlXHJcbn0gKTtcclxuXHJcbnZhciB0cmFuc3BhcmVudE1hdGVyaWFsQmFjayA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4ZmZmZmZmLFxyXG5cdG9wYWNpdHk6IDAuNCxcclxuXHR0cmFuc3BhcmVudDogdHJ1ZVxyXG59ICk7XHJcblxyXG52YXIgcG9pbnRzTWF0ZXJpYWwgPSBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoIHtcclxuXHRjb2xvcjogMHgwMDgwZmYsXHJcblx0c2l6ZTogMSxcclxuXHRhbHBoYVRlc3Q6IDAuNVxyXG59ICk7XHJcblxyXG52YXIgUkdCTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaE5vcm1hbE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4MDA4OGZmXHJcbn0pO1xyXG5cclxudmFyIFNURE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4MDA4OGZmLFxyXG5cdG9wYWNpdHk6IDAuNVxyXG59KTtcclxuXHJcbnZhciBmbGF0U2hhcGVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgge1xyXG5cdHNpZGUgOiBUSFJFRS5Eb3VibGVTaWRlLFxyXG5cdHRyYW5zcGFyZW50IDogdHJ1ZSxcclxuXHRvcGFjaXR5OiAwLjVcclxufSk7IiwiZnVuY3Rpb24gQ3lsaW5kZXJGcm9tUHRzKHYxLCB2Mikge1xyXG5cdHZhciBjeWxpbmRlciA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDAuNCwgMC40LCB2MS5kaXN0YW5jZVRvKHYyKSwgMTAsIDAuNSwgdHJ1ZSk7XHJcblx0dmFyIGN5bGluZGVyTWVzaCA9IG5ldyBUSFJFRS5NZXNoKGN5bGluZGVyLCBSR0JNYXRlcmlhbCk7XHJcblx0Y3lsaW5kZXJNZXNoLnBvc2l0aW9uLmNvcHkodjEuY2xvbmUoKS5sZXJwKHYyLCAuNSkpO1xyXG5cclxuXHQvL2NyZWF0ZXMgcXVhdGVybmlvbiBmcm9tIHNwaGVyZXMgcG9zaXRpb24gdG8gcm90YXRlIHRoZSBjeWxpbmRlclxyXG5cdHZhciBxID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKTtcclxuXHRxLnNldEZyb21Vbml0VmVjdG9ycyhuZXcgVEhSRUUuVmVjdG9yMygwLDEsMCksIG5ldyBUSFJFRS5WZWN0b3IzKCkuc3ViVmVjdG9ycyh2MSwgdjIpLm5vcm1hbGl6ZSgpKTtcclxuXHRjeWxpbmRlck1lc2guc2V0Um90YXRpb25Gcm9tUXVhdGVybmlvbihxKTtcclxuXHRyZXR1cm4gY3lsaW5kZXJNZXNoO1xyXG59IiwiZnVuY3Rpb24gUG9seU1lc2hlcyhnZW9tZXRyeSwgbm90ZXMpIHtcclxuXHR0aGlzLmdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG5cdHRoaXMuZ3JvdXAuYWRkKG5ldyBUcmFuc3BNZXNoR3JwKGdlb21ldHJ5KSk7XHJcblx0Ly90aGlzLmdyb3VwLmFkZChuZXcgUG9seVNwaGVyZXNGcm9tTm90ZXMobm90ZXMpKTtcclxuXHRyZXR1cm4gdGhpcy5ncm91cDtcclxufVxyXG5cclxuUG9seU1lc2hlcy5wcm90b3R5cGUuc2V0UG9zID0gZnVuY3Rpb24oeCx5LHopIHtcclxuXHR0aGlzLmdyb3VwLnBvc2l0aW9uLnggPSB4O1xyXG5cdHRoaXMuZ3JvdXAucG9zaXRpb24ueSA9IHk7XHJcblx0dGhpcy5ncm91cC5wb3NpdGlvbi56ID0gejtcclxufSIsIi8vY3JlYXRlcyBzcGhlcmVzIGZvciBlYWNoIHZlcnRleCBvZiB0aGUgZ2VvbWV0cnlcclxudmFyIHNwaGVyZSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgyLDUwLDUwKTtcclxudmFyIHNwaGVyZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChzcGhlcmUsIFJHQk1hdGVyaWFsKTtcclxuXHJcbmZ1bmN0aW9uIFBvbHlTcGhlcmVzKGdlb21ldHJ5KSB7XHJcblx0dGhpcy5ncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cdHZhciBtZXNoID0gc3BoZXJlTWVzaC5jbG9uZSgpO1xyXG5cdGZvcih2YXIgaT0wOyBpPGdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRzcGhlcmVNZXNoLnBvc2l0aW9uLmNvcHkoZ2VvbWV0cnkudmVydGljZXNbaV0pO1xyXG5cdFx0dGhpcy5ncm91cC5hZGQoc3BoZXJlTWVzaC5jbG9uZSgpKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzLmdyb3VwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBQb2x5U3BoZXJlc0Zyb21Ob3Rlcyhub3Rlcykge1xyXG5cdHZhciBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cdGZvcih2YXIgaSBpbiBub3Rlcykge1xyXG5cdFx0Z3JvdXAuYWRkKHNwaGVyZXMuZ2V0T2JqZWN0QnlJZChub3Rlc1tpXSkuY2xvbmUoKSk7XHJcblx0fVxyXG5cdC8qY29uc29sZS5sb2coZ3JvdXApOyovXHJcblxyXG5cdHJldHVybiBncm91cDtcclxufSIsImZ1bmN0aW9uIG1ha2VUZXh0U3ByaXRlKCBub3RlLCBzY2FsZSwgcGFyYW1ldGVycyApXHJcbntcclxuXHR2YXIgbWVzc2FnZTtcclxuXHJcblx0aWYobm90ZSA9PSAwKSB7XHJcblx0XHRtZXNzYWdlID0gJ0MnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDEpIHtcclxuXHRcdG1lc3NhZ2UgPSAnQyMnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDIpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRCc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gMykge1xyXG5cdFx0bWVzc2FnZSA9ICdEIyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gNCkge1xyXG5cdFx0bWVzc2FnZSA9ICdFJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSA1KSB7XHJcblx0XHRtZXNzYWdlID0gJ0YnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDYpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRiMnO1xyXG5cdH0gZWxzZSBpZihub3RlID09IDcpIHtcclxuXHRcdG1lc3NhZ2UgPSAnRyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gOCkge1xyXG5cdFx0bWVzc2FnZSA9ICdHIyc7XHJcblx0fSBlbHNlIGlmKG5vdGUgPT0gOSkge1xyXG5cdFx0bWVzc2FnZSA9ICdBJztcclxuXHR9IGVsc2UgaWYobm90ZSA9PSAxMCkge1xyXG5cdFx0bWVzc2FnZSA9ICdBIyc7XHJcblx0fSBlbHNlIHtcclxuXHRcdG1lc3NhZ2UgPSAnQic7XHJcblx0fVxyXG5cclxuXHJcblx0aWYgKCBwYXJhbWV0ZXJzID09PSB1bmRlZmluZWQgKSBwYXJhbWV0ZXJzID0ge307XHJcblx0XHJcblx0dmFyIGZvbnRmYWNlID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImZvbnRmYWNlXCIpID8gXHJcblx0XHRwYXJhbWV0ZXJzW1wiZm9udGZhY2VcIl0gOiBcIkFyaWFsXCI7XHJcblx0XHJcblx0dmFyIGZvbnRzaXplID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImZvbnRzaXplXCIpID8gXHJcblx0XHRwYXJhbWV0ZXJzW1wiZm9udHNpemVcIl0gOiAxODtcclxuXHRcclxuXHR2YXIgYm9yZGVyVGhpY2tuZXNzID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImJvcmRlclRoaWNrbmVzc1wiKSA/IFxyXG5cdFx0cGFyYW1ldGVyc1tcImJvcmRlclRoaWNrbmVzc1wiXSA6IDQ7XHJcblx0XHJcblx0dmFyIGJvcmRlckNvbG9yID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImJvcmRlckNvbG9yXCIpID9cclxuXHRcdHBhcmFtZXRlcnNbXCJib3JkZXJDb2xvclwiXSA6IHsgcjowLCBnOjAsIGI6MCwgYToxLjAgfTtcclxuXHRcclxuXHR2YXIgYmFja2dyb3VuZENvbG9yID0gcGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKSA/XHJcblx0XHRwYXJhbWV0ZXJzW1wiYmFja2dyb3VuZENvbG9yXCJdIDogeyByOjI1NSwgZzoyNTUsIGI6MjU1LCBhOjEuMCB9O1xyXG5cclxuXHQvL3ZhciBzcHJpdGVBbGlnbm1lbnQgPSBwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwiYWxpZ25tZW50XCIpID9cclxuXHQvL1x0cGFyYW1ldGVyc1tcImFsaWdubWVudFwiXSA6IFRIUkVFLlNwcml0ZUFsaWdubWVudC50b3BMZWZ0O1xyXG5cclxuXHR2YXIgc3ByaXRlQWxpZ25tZW50ID0gVEhSRUUuU3ByaXRlQWxpZ25tZW50LnRvcExlZnQ7XHJcblx0XHRcclxuXHJcblx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0Y29udGV4dC5mb250ID0gXCJCb2xkIFwiICsgZm9udHNpemUgKyBcInB4IFwiICsgZm9udGZhY2U7XHJcbiAgICBcclxuXHQvLyBnZXQgc2l6ZSBkYXRhIChoZWlnaHQgZGVwZW5kcyBvbmx5IG9uIGZvbnQgc2l6ZSlcclxuXHR2YXIgbWV0cmljcyA9IGNvbnRleHQubWVhc3VyZVRleHQoIG1lc3NhZ2UgKTtcclxuXHR2YXIgdGV4dFdpZHRoID0gbWV0cmljcy53aWR0aDtcclxuXHRcclxuXHQvLyBiYWNrZ3JvdW5kIGNvbG9yXHJcblx0Y29udGV4dC5maWxsU3R5bGUgICA9IFwicmdiYShcIiArIGJhY2tncm91bmRDb2xvci5yICsgXCIsXCIgKyBiYWNrZ3JvdW5kQ29sb3IuZyArIFwiLFwiXHJcblx0XHRcdFx0XHRcdFx0XHQgICsgYmFja2dyb3VuZENvbG9yLmIgKyBcIixcIiArIGJhY2tncm91bmRDb2xvci5hICsgXCIpXCI7XHJcblx0Ly8gYm9yZGVyIGNvbG9yXHJcblx0Y29udGV4dC5zdHJva2VTdHlsZSA9IFwicmdiYShcIiArIGJvcmRlckNvbG9yLnIgKyBcIixcIiArIGJvcmRlckNvbG9yLmcgKyBcIixcIlxyXG5cdFx0XHRcdFx0XHRcdFx0ICArIGJvcmRlckNvbG9yLmIgKyBcIixcIiArIGJvcmRlckNvbG9yLmEgKyBcIilcIjtcclxuXHJcblx0Y29udGV4dC5saW5lV2lkdGggPSBib3JkZXJUaGlja25lc3M7XHJcblx0cm91bmRSZWN0KGNvbnRleHQsIGJvcmRlclRoaWNrbmVzcy8yLCBib3JkZXJUaGlja25lc3MvMiwgdGV4dFdpZHRoICsgYm9yZGVyVGhpY2tuZXNzLCBmb250c2l6ZSAqIDEuNCArIGJvcmRlclRoaWNrbmVzcywgNik7XHJcblx0Ly8gMS40IGlzIGV4dHJhIGhlaWdodCBmYWN0b3IgZm9yIHRleHQgYmVsb3cgYmFzZWxpbmU6IGcsaixwLHEuXHJcblx0XHJcblx0Ly8gdGV4dCBjb2xvclxyXG5cdGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDEuMClcIjtcclxuXHJcblx0Y29udGV4dC5maWxsVGV4dCggbWVzc2FnZSwgYm9yZGVyVGhpY2tuZXNzLCBmb250c2l6ZSArIGJvcmRlclRoaWNrbmVzcyk7XHJcblx0XHJcblx0Ly8gY2FudmFzIGNvbnRlbnRzIHdpbGwgYmUgdXNlZCBmb3IgYSB0ZXh0dXJlXHJcblx0dmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShjYW52YXMpIFxyXG5cdHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG5cclxuXHR2YXIgc3ByaXRlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuU3ByaXRlTWF0ZXJpYWwoIFxyXG5cdFx0eyBtYXA6IHRleHR1cmUsIHVzZVNjcmVlbkNvb3JkaW5hdGVzOiBmYWxzZSwgYWxpZ25tZW50OiBzcHJpdGVBbGlnbm1lbnQgfSApO1xyXG5cdHZhciBzcHJpdGUgPSBuZXcgVEhSRUUuU3ByaXRlKCBzcHJpdGVNYXRlcmlhbCApO1xyXG5cdHNwcml0ZS5zY2FsZS5zZXQoMTAwLDUwLDEuMCk7XHJcblx0c3ByaXRlLnBvc2l0aW9uLmNvcHkoYWxsUG9pbnRzW25vdGVWYWxdLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpKVxyXG5cdHJldHVybiBzcHJpdGU7XHRcclxufVxyXG5cclxuLy8gZnVuY3Rpb24gZm9yIGRyYXdpbmcgcm91bmRlZCByZWN0YW5nbGVzXHJcbmZ1bmN0aW9uIHJvdW5kUmVjdChjdHgsIHgsIHksIHcsIGgsIHIpIFxyXG57XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKHgrciwgeSk7XHJcbiAgICBjdHgubGluZVRvKHgrdy1yLCB5KTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgrdywgeSwgeCt3LCB5K3IpO1xyXG4gICAgY3R4LmxpbmVUbyh4K3csIHkraC1yKTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgrdywgeStoLCB4K3ctciwgeStoKTtcclxuICAgIGN0eC5saW5lVG8oeCtyLCB5K2gpO1xyXG4gICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCwgeStoLCB4LCB5K2gtcik7XHJcbiAgICBjdHgubGluZVRvKHgsIHkrcik7XHJcbiAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4K3IsIHkpO1xyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuXHRjdHguc3Ryb2tlKCk7ICAgXHJcbn0iLCIvL2NyZWF0ZXMgYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgdHdvIG1lc2hlcyB0byBjcmVhdGUgdHJhbnNwYXJlbmN5XHJcbmZ1bmN0aW9uIFRyYW5zcE1lc2hHcnAoZ2VvbWV0cnkpIHtcclxuXHR2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHR2YXIgbWVzaEdlb21ldHJ5ID0gbmV3IFRIUkVFLkNvbnZleEJ1ZmZlckdlb21ldHJ5KGdlb21ldHJ5LnZlcnRpY2VzKTtcclxuXHJcblx0dmFyIGZhY2VzID0gbWVzaEdlb21ldHJ5LmZhY2VzO1xyXG5cdGZvcih2YXIgZmFjZSBpbiBmYWNlcykge1xyXG5cdFx0Zm9yKHZhciBpPTA7IGk8MzsgaSsrKSB7XHJcblx0XHRcdHZhciB2MSA9IGZhY2VzW2ZhY2VdLmdldEVkZ2UoaSkuaGVhZCgpO1xyXG5cdFx0XHR2YXIgdjIgPSBmYWNlc1tmYWNlXS5nZXRFZGdlKGkpLnRhaWwoKTtcclxuXHRcdFx0Z3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjEucG9pbnQsIHYyLnBvaW50KSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKG1lc2hHZW9tZXRyeSwgdHJhbnNwYXJlbnRNYXRlcmlhbEJhY2spO1xyXG5cdG1lc2gubWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkJhY2tTaWRlOyAvLyBiYWNrIGZhY2VzXHJcblx0bWVzaC5yZW5kZXJPcmRlciA9IDA7XHJcblxyXG5cdHZhciBtZXNoMiA9IG5ldyBUSFJFRS5NZXNoKG1lc2hHZW9tZXRyeSwgdHJhbnNwYXJlbnRNYXRlcmlhbEZyb250LmNsb25lKCkpO1xyXG5cdG1lc2gyLm1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Gcm9udFNpZGU7IC8vIGZyb250IGZhY2VzXHJcblx0bWVzaDIucmVuZGVyT3JkZXIgPSAxO1xyXG5cclxuXHRncm91cC5hZGQobWVzaCk7XHJcblx0Z3JvdXAuYWRkKG1lc2gyKTtcclxuXHJcblx0cmV0dXJuIGdyb3VwO1xyXG59XHJcblxyXG4vKmZ1bmN0aW9uIG1ha2VUcmFuc3BhcmVudChnZW9tZXRyeSwgZ3JvdXApIHtcclxuXHQvL2dlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XHJcblx0Ly9nZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTtcclxuXHRncm91cC5hZGQobmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHRyYW5zcGFyZW50TWF0ZXJpYWxGcm9udCkpO1xyXG59Ki8iLCJ2YXIgc2NhbGUgPSAxNTtcclxuXHJcbmZ1bmN0aW9uIENob3JkKG5vdGVzKSB7XHJcblx0dGhpcy5ub3RlcyA9IFtdO1xyXG5cclxuXHRmb3IodmFyIGkgaW4gbm90ZXMpIHtcclxuXHRcdHRoaXMubm90ZXMucHVzaChub3Rlc1tpXSAlIDEyKTtcclxuXHR9XHJcblxyXG5cdHRoaXMuZHJhd0Nob3JkKCk7XHJcbn1cclxuXHJcbkNob3JkLnByb3RvdHlwZS5hZGROb3RlID0gZnVuY3Rpb24obm90ZSkge1xyXG5cdHRoaXMubm90ZXMucHVzaChub3RlKTtcclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLnBvbHloZWRyb24udmlzaWJsZSA9IHRydWU7XHJcblx0Zm9yKHZhciBpIGluIHRoaXMubm90ZXMpIHtcclxuXHRcdHNwaGVyZXMuY2hpbGRyZW5bdGhpcy5ub3Rlc1tpXV0udmlzaWJsZSA9IHRydWU7XHJcblx0XHRjb25zb2xlLmxvZyhpKTtcclxuXHRcdGNvbnNvbGUubG9nKHNwaGVyZXNbdGhpcy5ub3Rlc1tpXV0pO1xyXG5cdH1cclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLmRyYXdDaG9yZCA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBuYk5vdGVzID0gdGhpcy5ub3Rlcy5sZW5ndGg7XHJcblxyXG5cdGlmKG5iTm90ZXMgPT0gMSkge1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XHJcblx0fSBlbHNlIGlmKG5iTm90ZXMgPT0gMikge1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFR3b1BvaW50cyh0aGlzLm5vdGVzWzBdLCB0aGlzLm5vdGVzWzFdLCBzY2FsZSk7XHJcblx0fSBlbHNlIGlmKG5iTm90ZXMgPT0gMykge1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFRocmVlUG9pbnRzKHRoaXMubm90ZXMsIHNjYWxlKTtcclxuXHR9ZWxzZSB7XHJcblx0XHR2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBpPTA7IGk8bmJOb3RlczsgaSsrKSB7XHJcblx0XHRcdGdlb21ldHJ5LnZlcnRpY2VzLnB1c2goXHJcblx0XHRcdFx0YWxsUG9pbnRzW3RoaXMubm90ZXNbaV1dLmNsb25lKClcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyB2YXIgc3VicyA9IHN1YnNldHModGhpcy5ub3RlcywgMyk7XHJcblx0XHQvLyB2YXIgcG9pbnRJZHM7XHJcblx0XHQvLyB2YXIgcG9pbnRJZDEsIHBvaW50SWQyLCBwb2ludElkMztcclxuXHRcdC8vIHZhciBmYWNlO1xyXG5cclxuXHRcdC8vIGZvcihzdWIgb2Ygc3Vicykge1xyXG5cdFx0Ly8gXHRwb2ludElkcyA9IHN1Yi5lbnRyaWVzKCk7XHJcblx0XHRcdFxyXG5cdFx0Ly8gXHQvL2dldCB0aGUgZmFjZSdzIDMgdmVydGljZXMgaW5kZXhcclxuXHRcdC8vIFx0cG9pbnRJZDEgPSBwb2ludElkcy5uZXh0KCkudmFsdWVbMF0udmFsdWU7XHJcblx0XHQvLyBcdHBvaW50SWQyID0gcG9pbnRJZHMubmV4dCgpLnZhbHVlWzBdLnZhbHVlO1xyXG5cdFx0Ly8gXHRwb2ludElkMyA9IHBvaW50SWRzLm5leHQoKS52YWx1ZVswXS52YWx1ZTtcclxuXHJcblx0XHQvLyBcdGZhY2UgPSBuZXcgVEhSRUUuRmFjZTMocG9pbnRJZDEscG9pbnRJZDIscG9pbnRJZDMpO1xyXG5cdFx0Ly8gXHRnZW9tZXRyeS5mYWNlcy5wdXNoKGZhY2UpO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdC8vIHZhciBtZXNoR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29udmV4QnVmZmVyR2VvbWV0cnkoZ2VvbWV0cnkudmVydGljZXMpO1xyXG5cdFx0XHJcblx0XHRnZW9tZXRyeS5zY2FsZShzY2FsZSxzY2FsZSxzY2FsZSk7XHJcblx0XHR0aGlzLnBvbHloZWRyb24gPSBuZXcgUG9seU1lc2hlcyhnZW9tZXRyeSwgdGhpcy5ub3Rlcyk7XHJcblxyXG5cdH1cclxuXHR0aGlzLnBvbHloZWRyb24udmlzaWJsZSA9IGZhbHNlO1xyXG5cdHNoYXBlc0dyb3VwLmFkZCh0aGlzLnBvbHloZWRyb24pO1xyXG5cdFxyXG5cclxufSIsInZhciBtYWluR3JvdXAsIHNoYXBlc0dyb3VwLCBzcGhlcmVzLCBsYWJlbHMsIGNvbnRhaW5lciwgY2FtZXJhLCByZW5kZXJlciwgc2NlbmUsIHN0YXRzO1xyXG52YXIgY2hvcmRzID0gW107XHJcbnZhciBtb3VzZVggPSAwLCBtb3VzZVkgPSAwO1xyXG52YXIgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XHJcbnZhciB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XHJcbi8vdmFyIHdzID0gbmV3IFdlYlNvY2tldChcIndzOi8vMTI3LjAuMC4xOjU2NzgvXCIpO1xyXG52YXIgY3ViZTtcclxuXHJcbmluaXQoKTtcclxuYW5pbWF0ZSgpO1xyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcblx0Y2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aC93aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCk7XHJcblx0Y2FtZXJhLnBvc2l0aW9uLnogPSA1MDtcclxuXHJcblx0c2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHRzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKCAweDAwMDAwMCApO1xyXG5cclxuXHRyZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XHJcblx0Ly9yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcclxuXHRyZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG5cclxuXHR2YXIgY29udHJvbHMgPSBuZXcgVEhSRUUuT3JiaXRDb250cm9scyggY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50ICk7XHJcblx0Y29udHJvbHMubWluRGlzdGFuY2UgPSA1O1xyXG5cdGNvbnRyb2xzLm1heERpc3RhbmNlID0gMjAwO1xyXG5cdGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJO1xyXG5cclxuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQoIHJlbmRlcmVyLmRvbUVsZW1lbnQgKTtcclxuXHJcblx0bWFpbkdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblx0c2hhcGVzR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHRzY2VuZS5hZGQoc2hhcGVzR3JvdXApO1xyXG5cdHNjZW5lLmFkZChtYWluR3JvdXApO1xyXG5cclxuXHR2YXIgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCggMHg0MDQwNDAgKTtcclxuXHRzY2VuZS5hZGQoIGFtYmllbnRMaWdodCApO1xyXG5cclxuXHR2YXIgcG9pbnRMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KCAweGZmMDAwMCwgMSwgMTAwICk7XHJcblx0Ly9jYW1lcmEuYWRkKHBvaW50TGlnaHQpO1xyXG5cdHNwaGVyZXMgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHRsYWJlbHMgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcblx0Zm9yKHZhciBpIGluIGFsbFBvaW50cykge1xyXG5cdFx0dmFyIHBvaW50ID0gbmV3IE9uZVBvaW50KGksIHNjYWxlKTtcclxuXHRcdHBvaW50LnZpc2libGUgPSBmYWxzZTtcclxuXHRcdHNwaGVyZXMuYWRkKHBvaW50KTtcclxuXHJcblx0XHQvKnZhciBsYWJlbCA9IG5ldyBtYWtlVGV4dFNwcml0ZShpLCBzY2FsZSk7XHJcblx0XHRsYWJlbHMuYWRkKGxhYmVsKTtcdFx0Ki9cclxuXHR9XHJcblx0c2NlbmUuYWRkKHNwaGVyZXMpO1xyXG5cdC8vc2NlbmUuYWRkKGxhYmVscyk7XHJcblxyXG5cdG1ha2VMaWdodHMoKTtcclxuXHJcblx0c3RhdHMgPSBuZXcgU3RhdHMoKTtcclxuXHQvL2NvbnRhaW5lci5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuXHJcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XHJcblx0d2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XHJcblx0d2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xyXG5cdGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHRjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG5cdHJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0Nob3Jkcyhmcm9tLCB0bykge1xyXG5cdGZvcih2YXIgaT1mcm9tOyBpPD10bzsgaSsrKSB7XHJcblx0XHQvL3NoYXBlc0dyb3VwLmNoaWxkcmVuW2ldLnZpc2libGUgPSB0cnVlO1xyXG5cdFx0Y2hvcmRzW2ldLnNob3coKTtcclxuXHR9XHJcblx0cmVuZGVyKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XHJcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBhbmltYXRlICk7XHJcblx0cmVuZGVyKCk7XHJcblx0c3RhdHMudXBkYXRlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpIHtcclxuXHRyZW5kZXJlci5yZW5kZXIoIHNjZW5lLCBjYW1lcmEgKTtcclxufVxyXG4iLCJmdW5jdGlvbiBwYXJzZU1pZGkoKSB7XHJcblx0dmFyIGlucHV0RWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmaWxlLWlucHV0Jyk7XHJcblx0dmFyIGZpbGUgPSBpbnB1dEVsZW0uZmlsZXNbMF07XHJcblx0dmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XHJcblx0XHR2YXIgYmluYXJ5ID0gZS50YXJnZXQucmVzdWx0O1xyXG5cdFx0Y29uc29sZS5sb2coYmluYXJ5KTtcclxuXHR9IFxyXG5cclxuXHRyZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoZmlsZSk7IFxyXG59IiwiXHJcblxyXG5mdW5jdGlvbiB0ZXN0cHkoKSB7XHJcblx0dmFyIHJlc3VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHQnKSxcclxuICAgICAgICBzZW50X3R4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0eHQtaW5wdXQnKS52YWx1ZTtcclxuXHJcbiAgICB3cy5zZW5kKHNlbnRfdHh0KTtcclxuXHJcbiAgICB3cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICByZXN1bHQuaW5uZXJIVE1MID0gZXZlbnQuZGF0YTtcclxuXHJcbiAgICAgICAgLyp2YXIgbWVzc2FnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSxcclxuICAgICAgICAgICAgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyksXHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShldmVudC5kYXRhKTtcclxuICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICAgIG1lc3NhZ2VzLmFwcGVuZENoaWxkKG1lc3NhZ2UpOyovXHJcblxyXG4gICAgfTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdweXRob24tdGVzdCcpLmFwcGVuZENoaWxkKHJlc3VsdCk7XHJcbn0iLCIvKmZ1bmN0aW9uIG1pZGlUb1B5KCkge1xyXG5cdHZhciBpbnB1dEVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZmlsZS1pbnB1dCcpO1xyXG5cdHZhciBmaWxlID0gaW5wdXRFbGVtLmZpbGVzWzBdO1xyXG5cdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZ0KSB7XHJcblx0XHR3cy5zZW5kKGV2dC50YXJnZXQucmVzdWx0KTtcclxuXHR9XHJcblxyXG5cdHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG5cclxuXHJcbn1cclxuXHJcbndzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0Y29uc29sZS5sb2coJ3BhcnNpbmcganNvbi4uLicpO1xyXG5cdHZhciBpbnB1dENob3JkcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XHJcblx0Y29uc29sZS5sb2coJ2pzb24gcGFyc2VkJyk7XHJcblx0Y29uc29sZS5sb2coJ2NyZWF0aW5nIGNob3JkcycpO1xyXG5cdGZvcih2YXIgaUNob3JkIGluIGlucHV0Q2hvcmRzKSB7XHJcblx0XHR2YXIgY2hvcmQgPSBuZXcgQ2hvcmQoaW5wdXRDaG9yZHNbaUNob3JkXSk7XHJcblx0XHRjaG9yZHMucHVzaChjaG9yZCk7XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKCdjaG9yZHMgY3JlYXRlZCcpO1xyXG5cclxuXHRkcmF3Q2hvcmRzKDUsIDYpO1xyXG59Ki8iXX0=
