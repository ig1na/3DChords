// Creates a sphere from one vector3
function OnePoint(point, scale) {
	let group = new THREE.Group();		// creates the group that will contain the mesh and the note label
	let sphere = new THREE.SphereBufferGeometry(2,50,50);
	let sphereMesh = new THREE.Mesh(sphere, RGBMaterial);
	let label = new TextSprite(point, scale);		// creates the label

	sphereMesh.position.copy(point.clone().multiplyScalar(scale));

	group.add(sphereMesh);
	group.add(label);

	return group;
}
function ThreePoints(points, scale) {
	this.group = new THREE.Group();
	let mesh;
	let geometry = new THREE.BufferGeometry();
	let positions = [];
	let normals = [];
	let material = new THREE.MeshStandardMaterial( {
		opacity: 0.2,
		transparent: true,
		depthWrite: false,
		side: THREE.DoubleSide
	} );
	
	for(let point of points) {
		positions.push(point.clone().x);
		positions.push(point.clone().y);
		positions.push(point.clone().z);
		normals.push(1,1,1);
	}

	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	geometry.scale(scale, scale, scale);

	mesh = new THREE.Mesh( geometry, material.clone() );
	this.group.add( mesh );

	return this.group;
}
function TwoPoints(point1, point2, scale) {
	let v1 = point1.clone().multiplyScalar(scale);
	let v2 = point2.clone().multiplyScalar(scale);
	let cylinderMesh = new CylinderFromPts(v1, v2);
	
	this.group = new THREE.Group();
	this.group.add(cylinderMesh);

	return this.group;
}
// Creates all meshes and hides them to show them when needed. This will create a group of meshes containing all spheres,
// all cylinders and all triangular faces
function AllMeshes(givenScale) {
	this.meshById = new Map();
	this.labels = new THREE.Group();
	this.meshGroup = new THREE.Group();

	let scale = givenScale;

	// this internal function will create all possible meshes from the number of points it is made of, using the allPoints array
	// as a reference for positionning and creating those meshes
	// for example, if we want meshes with only one point, it will creates a sphere for each point in allPoints array
	function fromPtsNumber(number) {
		const gen = subsets(allPoints, number);					// creates a generator for every subset of size 'number' of allPoints array
		
		for(let subset of gen) {								// iterate through the generator
			let subArray = Array.from(subset); 					// creates an array from the iterator
			let key = KeyFromPtsArray(subArray, allPoints);		// creates a unique key based on the notes in the array

			try {
				let mesh = new MeshFromPtsArray(subArray, scale);
				mesh.visible = false;							// hides the mesh 

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
}

// This function will show the meshes that match the given array of notes
AllMeshes.prototype.showFromPtsArray = function(ptsArray, value) {
	let maxIter = ptsArray.length % 4;

	for(let i=1; i<=maxIter; i++){
		let gen = subsets(ptsArray, i);

		for(let sub of gen) {
			let subArray = Array.from(sub),
				key = keyFromPtArray(subArray);

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
//Creates a cylinder between the two given vector3
function CylinderFromPts(v1, v2) {
	let cylinder = new THREE.CylinderBufferGeometry(0.4, 0.4, v1.distanceTo(v2), 10, 0.5, true);
	let cylinderMesh = new THREE.Mesh(cylinder, RGBMaterial);
	let q = new THREE.Quaternion();																		

	cylinderMesh.position.copy(v1.clone().lerp(v2, .5));	//moves the mesh to the middle of the two points
	
	q.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3().subVectors(v1, v2).normalize());		//uses the two vectors to set the quaternion
	cylinderMesh.setRotationFromQuaternion(q);		// uses the quaternion to rotate the mesh
	
	return cylinderMesh;
}
// Creates all the global lights surounding our meshes
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
function KeyFromPtsArray(array, indexer) {
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
//	creates a mesh from an array of points (currently maximum 3 because we need triangular faces at most)
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
			throw "Can't create mesh for so much points"; // throw an error because we don't want meshes with more than 3 vectors
			break;
	}
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
// Creates a sprite to display note name
function TextSprite( point, scale )
{
	let map, sprite, material;
	let textureLoader = new THREE.TextureLoader();
	let note = allPoints.indexOf(point);

	// loads the image depending on the note number
	switch(note) {
		case 0: map = textureLoader.load('js/sprites/C.png');
				break;
		case 1: map = textureLoader.load('js/sprites/CS.png');
				break;
		case 2: map = textureLoader.load('js/sprites/D.png');
				break;
		case 3: map = textureLoader.load('js/sprites/DS.png');
				break;
		case 4: map = textureLoader.load('js/sprites/E.png');
				break;
		case 5: map = textureLoader.load('js/sprites/F.png');
				break;
		case 6: map = textureLoader.load('js/sprites/FS.png');
				break;
		case 7: map = textureLoader.load('js/sprites/G.png');
				break;
		case 8: map = textureLoader.load('js/sprites/GS.png');
				break;
		case 9: map = textureLoader.load('js/sprites/A.png');
				break;
		case 10: map = textureLoader.load('js/sprites/AS.png');
				break;
		case 11: map = textureLoader.load('js/sprites/B.png');
				break;
	}

	material = new THREE.SpriteMaterial( { map: map, color: 0xffffff });	// creates a material and maps the image to it

	sprite = new THREE.Sprite(material);	//creates the sprite from the material

	sprite.position.copy(point.clone().multiplyScalar(scale+5));
	sprite.scale.set(5,5,9);	// scale sprite to make it bigger

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

// Creates an object with two accessible maps, one containing chords by event time, the other containing keys by event time
// keys are made of the concatenation of notes values modulo 12
// this object has a function that parses midi files and fill the two maps
function MidiToChordMap() {
	this.chordsMap = new Map();
	this.keysMap = new Map();
}

// This prototype function will parse a midi file using midi-parser-js library, and then fill the two maps of this object
// chords are saved for each event time, and keys too.
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
							let key = KeyFromPtsArray(subArray);
							
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
function Note(value, start) {
	this.value = value;
	this.start = start;
	this.end = -1;
}

Note.prototype.createMesh = function() {
	var geometry = new THREE.SphereGeometry( 2, 30, 30);
	return geometry;
}

function compareStart(noteA, noteB) {
	return noteA.start - noteB.start;
}
/*! nouislider - 11.1.0 - 2018-04-02 11:18:13 */

(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.noUiSlider = factory();
    }

}(function( ){

	'use strict';

	var VERSION = '11.1.0';


	function isValidFormatter ( entry ) {
		return typeof entry === 'object' && typeof entry.to === 'function' && typeof entry.from === 'function';
	}

	function removeElement ( el ) {
		el.parentElement.removeChild(el);
	}

	function isSet ( value ) {
		return value !== null && value !== undefined;
	}

	// Bindable version
	function preventDefault ( e ) {
		e.preventDefault();
	}

	// Removes duplicates from an array.
	function unique ( array ) {
		return array.filter(function(a){
			return !this[a] ? this[a] = true : false;
		}, {});
	}

	// Round a value to the closest 'to'.
	function closest ( value, to ) {
		return Math.round(value / to) * to;
	}

	// Current position of an element relative to the document.
	function offset ( elem, orientation ) {

		var rect = elem.getBoundingClientRect();
		var doc = elem.ownerDocument;
		var docElem = doc.documentElement;
		var pageOffset = getPageOffset(doc);

		// getBoundingClientRect contains left scroll in Chrome on Android.
		// I haven't found a feature detection that proves this. Worst case
		// scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
		if ( /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) ) {
			pageOffset.x = 0;
		}

		return orientation ? (rect.top + pageOffset.y - docElem.clientTop) : (rect.left + pageOffset.x - docElem.clientLeft);
	}

	// Checks whether a value is numerical.
	function isNumeric ( a ) {
		return typeof a === 'number' && !isNaN( a ) && isFinite( a );
	}

	// Sets a class and removes it after [duration] ms.
	function addClassFor ( element, className, duration ) {
		if (duration > 0) {
		addClass(element, className);
			setTimeout(function(){
				removeClass(element, className);
			}, duration);
		}
	}

	// Limits a value to 0 - 100
	function limit ( a ) {
		return Math.max(Math.min(a, 100), 0);
	}

	// Wraps a variable as an array, if it isn't one yet.
	// Note that an input array is returned by reference!
	function asArray ( a ) {
		return Array.isArray(a) ? a : [a];
	}

	// Counts decimals
	function countDecimals ( numStr ) {
		numStr = String(numStr);
		var pieces = numStr.split(".");
		return pieces.length > 1 ? pieces[1].length : 0;
	}

	// http://youmightnotneedjquery.com/#add_class
	function addClass ( el, className ) {
		if ( el.classList ) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	}

	// http://youmightnotneedjquery.com/#remove_class
	function removeClass ( el, className ) {
		if ( el.classList ) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	// https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
	function hasClass ( el, className ) {
		return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
	function getPageOffset ( doc ) {

		var supportPageOffset = window.pageXOffset !== undefined;
		var isCSS1Compat = ((doc.compatMode || "") === "CSS1Compat");
		var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? doc.documentElement.scrollLeft : doc.body.scrollLeft;
		var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? doc.documentElement.scrollTop : doc.body.scrollTop;

		return {
			x: x,
			y: y
		};
	}

	// we provide a function to compute constants instead
	// of accessing window.* as soon as the module needs it
	// so that we do not compute anything if not needed
	function getActions ( ) {

		// Determine the events to bind. IE11 implements pointerEvents without
		// a prefix, which breaks compatibility with the IE10 implementation.
		return window.navigator.pointerEnabled ? {
			start: 'pointerdown',
			move: 'pointermove',
			end: 'pointerup'
		} : window.navigator.msPointerEnabled ? {
			start: 'MSPointerDown',
			move: 'MSPointerMove',
			end: 'MSPointerUp'
		} : {
			start: 'mousedown touchstart',
			move: 'mousemove touchmove',
			end: 'mouseup touchend'
		};
	}

	// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
	// Issue #785
	function getSupportsPassive ( ) {

		var supportsPassive = false;

		try {

			var opts = Object.defineProperty({}, 'passive', {
				get: function() {
					supportsPassive = true;
				}
			});

			window.addEventListener('test', null, opts);

		} catch (e) {}

		return supportsPassive;
	}

	function getSupportsTouchActionNone ( ) {
		return window.CSS && CSS.supports && CSS.supports('touch-action', 'none');
	}


// Value calculation

	// Determine the size of a sub-range in relation to a full range.
	function subRangeRatio ( pa, pb ) {
		return (100 / (pb - pa));
	}

	// (percentage) How many percent is this value of this range?
	function fromPercentage ( range, value ) {
		return (value * 100) / ( range[1] - range[0] );
	}

	// (percentage) Where is this value on this range?
	function toPercentage ( range, value ) {
		return fromPercentage( range, range[0] < 0 ?
			value + Math.abs(range[0]) :
				value - range[0] );
	}

	// (value) How much is this percentage on this range?
	function isPercentage ( range, value ) {
		return ((value * ( range[1] - range[0] )) / 100) + range[0];
	}


// Range conversion

	function getJ ( value, arr ) {

		var j = 1;

		while ( value >= arr[j] ){
			j += 1;
		}

		return j;
	}

	// (percentage) Input a value, find where, on a scale of 0-100, it applies.
	function toStepping ( xVal, xPct, value ) {

		if ( value >= xVal.slice(-1)[0] ){
			return 100;
		}

		var j = getJ( value, xVal );
		var va = xVal[j-1];
		var vb = xVal[j];
		var pa = xPct[j-1];
		var pb = xPct[j];

		return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
	}

	// (value) Input a percentage, find where it is on the specified range.
	function fromStepping ( xVal, xPct, value ) {

		// There is no range group that fits 100
		if ( value >= 100 ){
			return xVal.slice(-1)[0];
		}

		var j = getJ( value, xPct );
		var va = xVal[j-1];
		var vb = xVal[j];
		var pa = xPct[j-1];
		var pb = xPct[j];

		return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
	}

	// (percentage) Get the step that applies at a certain value.
	function getStep ( xPct, xSteps, snap, value ) {

		if ( value === 100 ) {
			return value;
		}

		var j = getJ( value, xPct );
		var a = xPct[j-1];
		var b = xPct[j];

		// If 'snap' is set, steps are used as fixed points on the slider.
		if ( snap ) {

			// Find the closest position, a or b.
			if ((value - a) > ((b-a)/2)){
				return b;
			}

			return a;
		}

		if ( !xSteps[j-1] ){
			return value;
		}

		return xPct[j-1] + closest(
			value - xPct[j-1],
			xSteps[j-1]
		);
	}


// Entry parsing

	function handleEntryPoint ( index, value, that ) {

		var percentage;

		// Wrap numerical input in an array.
		if ( typeof value === "number" ) {
			value = [value];
		}

		// Reject any invalid input, by testing whether value is an array.
		if ( !Array.isArray(value) ){
			throw new Error("noUiSlider (" + VERSION + "): 'range' contains invalid value.");
		}

		// Covert min/max syntax to 0 and 100.
		if ( index === 'min' ) {
			percentage = 0;
		} else if ( index === 'max' ) {
			percentage = 100;
		} else {
			percentage = parseFloat( index );
		}

		// Check for correct input.
		if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
			throw new Error("noUiSlider (" + VERSION + "): 'range' value isn't numeric.");
		}

		// Store values.
		that.xPct.push( percentage );
		that.xVal.push( value[0] );

		// NaN will evaluate to false too, but to keep
		// logging clear, set step explicitly. Make sure
		// not to override the 'step' setting with false.
		if ( !percentage ) {
			if ( !isNaN( value[1] ) ) {
				that.xSteps[0] = value[1];
			}
		} else {
			that.xSteps.push( isNaN(value[1]) ? false : value[1] );
		}

		that.xHighestCompleteStep.push(0);
	}

	function handleStepPoint ( i, n, that ) {

		// Ignore 'false' stepping.
		if ( !n ) {
			return true;
		}

		// Factor to range ratio
		that.xSteps[i] = fromPercentage([that.xVal[i], that.xVal[i+1]], n) / subRangeRatio(that.xPct[i], that.xPct[i+1]);

		var totalSteps = (that.xVal[i+1] - that.xVal[i]) / that.xNumSteps[i];
		var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
		var step = that.xVal[i] + (that.xNumSteps[i] * highestStep);

		that.xHighestCompleteStep[i] = step;
	}


// Interface

	function Spectrum ( entry, snap, singleStep ) {

		this.xPct = [];
		this.xVal = [];
		this.xSteps = [ singleStep || false ];
		this.xNumSteps = [ false ];
		this.xHighestCompleteStep = [];

		this.snap = snap;

		var index;
		var ordered = []; // [0, 'min'], [1, '50%'], [2, 'max']

		// Map the object keys to an array.
		for ( index in entry ) {
			if ( entry.hasOwnProperty(index) ) {
				ordered.push([entry[index], index]);
			}
		}

		// Sort all entries by value (numeric sort).
		if ( ordered.length && typeof ordered[0][0] === "object" ) {
			ordered.sort(function(a, b) { return a[0][0] - b[0][0]; });
		} else {
			ordered.sort(function(a, b) { return a[0] - b[0]; });
		}


		// Convert all entries to subranges.
		for ( index = 0; index < ordered.length; index++ ) {
			handleEntryPoint(ordered[index][1], ordered[index][0], this);
		}

		// Store the actual step values.
		// xSteps is sorted in the same order as xPct and xVal.
		this.xNumSteps = this.xSteps.slice(0);

		// Convert all numeric steps to the percentage of the subrange they represent.
		for ( index = 0; index < this.xNumSteps.length; index++ ) {
			handleStepPoint(index, this.xNumSteps[index], this);
		}
	}

	Spectrum.prototype.getMargin = function ( value ) {

		var step = this.xNumSteps[0];

		if ( step && ((value / step) % 1) !== 0 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'limit', 'margin' and 'padding' must be divisible by step.");
		}

		return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
	};

	Spectrum.prototype.toStepping = function ( value ) {

		value = toStepping( this.xVal, this.xPct, value );

		return value;
	};

	Spectrum.prototype.fromStepping = function ( value ) {

		return fromStepping( this.xVal, this.xPct, value );
	};

	Spectrum.prototype.getStep = function ( value ) {

		value = getStep(this.xPct, this.xSteps, this.snap, value );

		return value;
	};

	Spectrum.prototype.getNearbySteps = function ( value ) {

		var j = getJ(value, this.xPct);

		return {
			stepBefore: { startValue: this.xVal[j-2], step: this.xNumSteps[j-2], highestStep: this.xHighestCompleteStep[j-2] },
			thisStep: { startValue: this.xVal[j-1], step: this.xNumSteps[j-1], highestStep: this.xHighestCompleteStep[j-1] },
			stepAfter: { startValue: this.xVal[j-0], step: this.xNumSteps[j-0], highestStep: this.xHighestCompleteStep[j-0] }
		};
	};

	Spectrum.prototype.countStepDecimals = function () {
		var stepDecimals = this.xNumSteps.map(countDecimals);
		return Math.max.apply(null, stepDecimals);
	};

	// Outside testing
	Spectrum.prototype.convert = function ( value ) {
		return this.getStep(this.toStepping(value));
	};

/*	Every input option is tested and parsed. This'll prevent
	endless validation in internal methods. These tests are
	structured with an item for every option available. An
	option can be marked as required by setting the 'r' flag.
	The testing function is provided with three arguments:
		- The provided value for the option;
		- A reference to the options object;
		- The name for the option;

	The testing function returns false when an error is detected,
	or true when everything is OK. It can also modify the option
	object, to make sure all values can be correctly looped elsewhere. */

	var defaultFormatter = { 'to': function( value ){
		return value !== undefined && value.toFixed(2);
	}, 'from': Number };

	function validateFormat ( entry ) {

		// Any object with a to and from method is supported.
		if ( isValidFormatter(entry) ) {
			return true;
		}

		throw new Error("noUiSlider (" + VERSION + "): 'format' requires 'to' and 'from' methods.");
	}

	function testStep ( parsed, entry ) {

		if ( !isNumeric( entry ) ) {
			throw new Error("noUiSlider (" + VERSION + "): 'step' is not numeric.");
		}

		// The step option can still be used to set stepping
		// for linear sliders. Overwritten if set in 'range'.
		parsed.singleStep = entry;
	}

	function testRange ( parsed, entry ) {

		// Filter incorrect input.
		if ( typeof entry !== 'object' || Array.isArray(entry) ) {
			throw new Error("noUiSlider (" + VERSION + "): 'range' is not an object.");
		}

		// Catch missing start or end.
		if ( entry.min === undefined || entry.max === undefined ) {
			throw new Error("noUiSlider (" + VERSION + "): Missing 'min' or 'max' in 'range'.");
		}

		// Catch equal start or end.
		if ( entry.min === entry.max ) {
			throw new Error("noUiSlider (" + VERSION + "): 'range' 'min' and 'max' cannot be equal.");
		}

		parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.singleStep);
	}

	function testStart ( parsed, entry ) {

		entry = asArray(entry);

		// Validate input. Values aren't tested, as the public .val method
		// will always provide a valid location.
		if ( !Array.isArray( entry ) || !entry.length ) {
			throw new Error("noUiSlider (" + VERSION + "): 'start' option is incorrect.");
		}

		// Store the number of handles.
		parsed.handles = entry.length;

		// When the slider is initialized, the .val method will
		// be called with the start options.
		parsed.start = entry;
	}

	function testSnap ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.snap = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider (" + VERSION + "): 'snap' option must be a boolean.");
		}
	}

	function testAnimate ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.animate = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider (" + VERSION + "): 'animate' option must be a boolean.");
		}
	}

	function testAnimationDuration ( parsed, entry ) {

		parsed.animationDuration = entry;

		if ( typeof entry !== 'number' ){
			throw new Error("noUiSlider (" + VERSION + "): 'animationDuration' option must be a number.");
		}
	}

	function testConnect ( parsed, entry ) {

		var connect = [false];
		var i;

		// Map legacy options
		if ( entry === 'lower' ) {
			entry = [true, false];
		}

		else if ( entry === 'upper' ) {
			entry = [false, true];
		}

		// Handle boolean options
		if ( entry === true || entry === false ) {

			for ( i = 1; i < parsed.handles; i++ ) {
				connect.push(entry);
			}

			connect.push(false);
		}

		// Reject invalid input
		else if ( !Array.isArray( entry ) || !entry.length || entry.length !== parsed.handles + 1 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'connect' option doesn't match handle count.");
		}

		else {
			connect = entry;
		}

		parsed.connect = connect;
	}

	function testOrientation ( parsed, entry ) {

		// Set orientation to an a numerical value for easy
		// array selection.
		switch ( entry ){
			case 'horizontal':
				parsed.ort = 0;
				break;
			case 'vertical':
				parsed.ort = 1;
				break;
			default:
				throw new Error("noUiSlider (" + VERSION + "): 'orientation' option is invalid.");
		}
	}

	function testMargin ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider (" + VERSION + "): 'margin' option must be numeric.");
		}

		// Issue #582
		if ( entry === 0 ) {
			return;
		}

		parsed.margin = parsed.spectrum.getMargin(entry);

		if ( !parsed.margin ) {
			throw new Error("noUiSlider (" + VERSION + "): 'margin' option is only supported on linear sliders.");
		}
	}

	function testLimit ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider (" + VERSION + "): 'limit' option must be numeric.");
		}

		parsed.limit = parsed.spectrum.getMargin(entry);

		if ( !parsed.limit || parsed.handles < 2 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'limit' option is only supported on linear sliders with 2 or more handles.");
		}
	}

	function testPadding ( parsed, entry ) {

		if ( !isNumeric(entry) && !Array.isArray(entry) ){
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers.");
		}

		if ( Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1])) ) {
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers.");
		}

		if ( entry === 0 ) {
			return;
		}

		if ( !Array.isArray(entry) ) {
			entry = [entry, entry];
		}

		// 'getMargin' returns false for invalid values.
		parsed.padding = [parsed.spectrum.getMargin(entry[0]), parsed.spectrum.getMargin(entry[1])];

		if ( parsed.padding[0] === false || parsed.padding[1] === false ) {
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option is only supported on linear sliders.");
		}

		if ( parsed.padding[0] < 0 || parsed.padding[1] < 0 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be a positive number(s).");
		}

		if ( parsed.padding[0] + parsed.padding[1] >= 100 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option must not exceed 100% of the range.");
		}
	}

	function testDirection ( parsed, entry ) {

		// Set direction as a numerical value for easy parsing.
		// Invert connection for RTL sliders, so that the proper
		// handles get the connect/background classes.
		switch ( entry ) {
			case 'ltr':
				parsed.dir = 0;
				break;
			case 'rtl':
				parsed.dir = 1;
				break;
			default:
				throw new Error("noUiSlider (" + VERSION + "): 'direction' option was not recognized.");
		}
	}

	function testBehaviour ( parsed, entry ) {

		// Make sure the input is a string.
		if ( typeof entry !== 'string' ) {
			throw new Error("noUiSlider (" + VERSION + "): 'behaviour' must be a string containing options.");
		}

		// Check if the string contains any keywords.
		// None are required.
		var tap = entry.indexOf('tap') >= 0;
		var drag = entry.indexOf('drag') >= 0;
		var fixed = entry.indexOf('fixed') >= 0;
		var snap = entry.indexOf('snap') >= 0;
		var hover = entry.indexOf('hover') >= 0;

		if ( fixed ) {

			if ( parsed.handles !== 2 ) {
				throw new Error("noUiSlider (" + VERSION + "): 'fixed' behaviour must be used with 2 handles");
			}

			// Use margin to enforce fixed state
			testMargin(parsed, parsed.start[1] - parsed.start[0]);
		}

		parsed.events = {
			tap: tap || snap,
			drag: drag,
			fixed: fixed,
			snap: snap,
			hover: hover
		};
	}

	function testTooltips ( parsed, entry ) {

		if ( entry === false ) {
			return;
		}

		else if ( entry === true ) {

			parsed.tooltips = [];

			for ( var i = 0; i < parsed.handles; i++ ) {
				parsed.tooltips.push(true);
			}
		}

		else {

			parsed.tooltips = asArray(entry);

			if ( parsed.tooltips.length !== parsed.handles ) {
				throw new Error("noUiSlider (" + VERSION + "): must pass a formatter for all handles.");
			}

			parsed.tooltips.forEach(function(formatter){
				if ( typeof formatter !== 'boolean' && (typeof formatter !== 'object' || typeof formatter.to !== 'function') ) {
					throw new Error("noUiSlider (" + VERSION + "): 'tooltips' must be passed a formatter or 'false'.");
				}
			});
		}
	}

	function testAriaFormat ( parsed, entry ) {
		parsed.ariaFormat = entry;
		validateFormat(entry);
	}

	function testFormat ( parsed, entry ) {
		parsed.format = entry;
		validateFormat(entry);
	}

	function testCssPrefix ( parsed, entry ) {

		if ( typeof entry !== 'string' && entry !== false ) {
			throw new Error("noUiSlider (" + VERSION + "): 'cssPrefix' must be a string or `false`.");
		}

		parsed.cssPrefix = entry;
	}

	function testCssClasses ( parsed, entry ) {

		if ( typeof entry !== 'object' ) {
			throw new Error("noUiSlider (" + VERSION + "): 'cssClasses' must be an object.");
		}

		if ( typeof parsed.cssPrefix === 'string' ) {
			parsed.cssClasses = {};

			for ( var key in entry ) {
				if ( !entry.hasOwnProperty(key) ) { continue; }

				parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
			}
		} else {
			parsed.cssClasses = entry;
		}
	}

	// Test all developer settings and parse to assumption-safe values.
	function testOptions ( options ) {

		// To prove a fix for #537, freeze options here.
		// If the object is modified, an error will be thrown.
		// Object.freeze(options);

		var parsed = {
			margin: 0,
			limit: 0,
			padding: 0,
			animate: true,
			animationDuration: 300,
			ariaFormat: defaultFormatter,
			format: defaultFormatter
		};

		// Tests are executed in the order they are presented here.
		var tests = {
			'step': { r: false, t: testStep },
			'start': { r: true, t: testStart },
			'connect': { r: true, t: testConnect },
			'direction': { r: true, t: testDirection },
			'snap': { r: false, t: testSnap },
			'animate': { r: false, t: testAnimate },
			'animationDuration': { r: false, t: testAnimationDuration },
			'range': { r: true, t: testRange },
			'orientation': { r: false, t: testOrientation },
			'margin': { r: false, t: testMargin },
			'limit': { r: false, t: testLimit },
			'padding': { r: false, t: testPadding },
			'behaviour': { r: true, t: testBehaviour },
			'ariaFormat': { r: false, t: testAriaFormat },
			'format': { r: false, t: testFormat },
			'tooltips': { r: false, t: testTooltips },
			'cssPrefix': { r: true, t: testCssPrefix },
			'cssClasses': { r: true, t: testCssClasses }
		};

		var defaults = {
			'connect': false,
			'direction': 'ltr',
			'behaviour': 'tap',
			'orientation': 'horizontal',
			'cssPrefix' : 'noUi-',
			'cssClasses': {
				target: 'target',
				base: 'base',
				origin: 'origin',
				handle: 'handle',
				handleLower: 'handle-lower',
				handleUpper: 'handle-upper',
				horizontal: 'horizontal',
				vertical: 'vertical',
				background: 'background',
				connect: 'connect',
				connects: 'connects',
				ltr: 'ltr',
				rtl: 'rtl',
				draggable: 'draggable',
				drag: 'state-drag',
				tap: 'state-tap',
				active: 'active',
				tooltip: 'tooltip',
				pips: 'pips',
				pipsHorizontal: 'pips-horizontal',
				pipsVertical: 'pips-vertical',
				marker: 'marker',
				markerHorizontal: 'marker-horizontal',
				markerVertical: 'marker-vertical',
				markerNormal: 'marker-normal',
				markerLarge: 'marker-large',
				markerSub: 'marker-sub',
				value: 'value',
				valueHorizontal: 'value-horizontal',
				valueVertical: 'value-vertical',
				valueNormal: 'value-normal',
				valueLarge: 'value-large',
				valueSub: 'value-sub'
			}
		};

		// AriaFormat defaults to regular format, if any.
		if ( options.format && !options.ariaFormat ) {
			options.ariaFormat = options.format;
		}

		// Run all options through a testing mechanism to ensure correct
		// input. It should be noted that options might get modified to
		// be handled properly. E.g. wrapping integers in arrays.
		Object.keys(tests).forEach(function( name ){

			// If the option isn't set, but it is required, throw an error.
			if ( !isSet(options[name]) && defaults[name] === undefined ) {

				if ( tests[name].r ) {
					throw new Error("noUiSlider (" + VERSION + "): '" + name + "' is required.");
				}

				return true;
			}

			tests[name].t( parsed, !isSet(options[name]) ? defaults[name] : options[name] );
		});

		// Forward pips options
		parsed.pips = options.pips;

		// All recent browsers accept unprefixed transform.
		// We need -ms- for IE9 and -webkit- for older Android;
		// Assume use of -webkit- if unprefixed and -ms- are not supported.
		// https://caniuse.com/#feat=transforms2d
		var d = document.createElement("div");
		var msPrefix = d.style.msTransform !== undefined;
		var noPrefix = d.style.transform !== undefined;

		parsed.transformRule = noPrefix ? 'transform' : (msPrefix ? 'msTransform' : 'webkitTransform');

		// Pips don't move, so we can place them using left/top.
		var styles = [['left', 'top'], ['right', 'bottom']];

		parsed.style = styles[parsed.dir][parsed.ort];

		return parsed;
	}


function scope ( target, options, originalOptions ){

	var actions = getActions();
	var supportsTouchActionNone = getSupportsTouchActionNone();
	var supportsPassive = supportsTouchActionNone && getSupportsPassive();

	// All variables local to 'scope' are prefixed with 'scope_'
	var scope_Target = target;
	var scope_Locations = [];
	var scope_Base;
	var scope_Handles;
	var scope_HandleNumbers = [];
	var scope_ActiveHandlesCount = 0;
	var scope_Connects;
	var scope_Spectrum = options.spectrum;
	var scope_Values = [];
	var scope_Events = {};
	var scope_Self;
	var scope_Pips;
	var scope_Document = target.ownerDocument;
	var scope_DocumentElement = scope_Document.documentElement;
	var scope_Body = scope_Document.body;


	// For horizontal sliders in standard ltr documents,
	// make .noUi-origin overflow to the left so the document doesn't scroll.
	var scope_DirOffset = (scope_Document.dir === 'rtl') || (options.ort === 1) ? 0 : 100;

/*! In this file: Construction of DOM elements; */

	// Creates a node, adds it to target, returns the new node.
	function addNodeTo ( addTarget, className ) {

		var div = scope_Document.createElement('div');

		if ( className ) {
			addClass(div, className);
		}

		addTarget.appendChild(div);

		return div;
	}

	// Append a origin to the base
	function addOrigin ( base, handleNumber ) {

		var origin = addNodeTo(base, options.cssClasses.origin);
		var handle = addNodeTo(origin, options.cssClasses.handle);

		handle.setAttribute('data-handle', handleNumber);

		// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
		// 0 = focusable and reachable
		handle.setAttribute('tabindex', '0');
		handle.setAttribute('role', 'slider');
		handle.setAttribute('aria-orientation', options.ort ? 'vertical' : 'horizontal');

		if ( handleNumber === 0 ) {
			addClass(handle, options.cssClasses.handleLower);
		}

		else if ( handleNumber === options.handles - 1 ) {
			addClass(handle, options.cssClasses.handleUpper);
		}

		return origin;
	}

	// Insert nodes for connect elements
	function addConnect ( base, add ) {

		if ( !add ) {
			return false;
		}

		return addNodeTo(base, options.cssClasses.connect);
	}

	// Add handles to the slider base.
	function addElements ( connectOptions, base ) {

		var connectBase = addNodeTo(base, options.cssClasses.connects);

		scope_Handles = [];
		scope_Connects = [];

		scope_Connects.push(addConnect(connectBase, connectOptions[0]));

		// [::::O====O====O====]
		// connectOptions = [0, 1, 1, 1]

		for ( var i = 0; i < options.handles; i++ ) {
			// Keep a list of all added handles.
			scope_Handles.push(addOrigin(base, i));
			scope_HandleNumbers[i] = i;
			scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
		}
	}

	// Initialize a single slider.
	function addSlider ( addTarget ) {

		// Apply classes and data to the target.
		addClass(addTarget, options.cssClasses.target);

		if ( options.dir === 0 ) {
			addClass(addTarget, options.cssClasses.ltr);
		} else {
			addClass(addTarget, options.cssClasses.rtl);
		}

		if ( options.ort === 0 ) {
			addClass(addTarget, options.cssClasses.horizontal);
		} else {
			addClass(addTarget, options.cssClasses.vertical);
		}

		scope_Base = addNodeTo(addTarget, options.cssClasses.base);
	}


	function addTooltip ( handle, handleNumber ) {

		if ( !options.tooltips[handleNumber] ) {
			return false;
		}

		return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
	}

	// The tooltips option is a shorthand for using the 'update' event.
	function tooltips ( ) {

		// Tooltips are added with options.tooltips in original order.
		var tips = scope_Handles.map(addTooltip);

		bindEvent('update', function(values, handleNumber, unencoded) {

			if ( !tips[handleNumber] ) {
				return;
			}

			var formattedValue = values[handleNumber];

			if ( options.tooltips[handleNumber] !== true ) {
				formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
			}

			tips[handleNumber].innerHTML = formattedValue;
		});
	}


	function aria ( ) {

		bindEvent('update', function ( values, handleNumber, unencoded, tap, positions ) {

			// Update Aria Values for all handles, as a change in one changes min and max values for the next.
			scope_HandleNumbers.forEach(function( index ){

				var handle = scope_Handles[index];

				var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
				var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);

				var now = positions[index];
				var text = options.ariaFormat.to(unencoded[index]);

				handle.children[0].setAttribute('aria-valuemin', min.toFixed(1));
				handle.children[0].setAttribute('aria-valuemax', max.toFixed(1));
				handle.children[0].setAttribute('aria-valuenow', now.toFixed(1));
				handle.children[0].setAttribute('aria-valuetext', text);
			});
		});
	}


	function getGroup ( mode, values, stepped ) {

		// Use the range.
		if ( mode === 'range' || mode === 'steps' ) {
			return scope_Spectrum.xVal;
		}

		if ( mode === 'count' ) {

			if ( values < 2 ) {
				throw new Error("noUiSlider (" + VERSION + "): 'values' (>= 2) required for mode 'count'.");
			}

			// Divide 0 - 100 in 'count' parts.
			var interval = values - 1;
			var spread = ( 100 / interval );

			values = [];

			// List these parts and have them handled as 'positions'.
			while ( interval-- ) {
				values[ interval ] = ( interval * spread );
			}

			values.push(100);

			mode = 'positions';
		}

		if ( mode === 'positions' ) {

			// Map all percentages to on-range values.
			return values.map(function( value ){
				return scope_Spectrum.fromStepping( stepped ? scope_Spectrum.getStep( value ) : value );
			});
		}

		if ( mode === 'values' ) {

			// If the value must be stepped, it needs to be converted to a percentage first.
			if ( stepped ) {

				return values.map(function( value ){

					// Convert to percentage, apply step, return to value.
					return scope_Spectrum.fromStepping( scope_Spectrum.getStep( scope_Spectrum.toStepping( value ) ) );
				});

			}

			// Otherwise, we can simply use the values.
			return values;
		}
	}

	function generateSpread ( density, mode, group ) {

		function safeIncrement(value, increment) {
			// Avoid floating point variance by dropping the smallest decimal places.
			return (value + increment).toFixed(7) / 1;
		}

		var indexes = {};
		var firstInRange = scope_Spectrum.xVal[0];
		var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length-1];
		var ignoreFirst = false;
		var ignoreLast = false;
		var prevPct = 0;

		// Create a copy of the group, sort it and filter away all duplicates.
		group = unique(group.slice().sort(function(a, b){ return a - b; }));

		// Make sure the range starts with the first element.
		if ( group[0] !== firstInRange ) {
			group.unshift(firstInRange);
			ignoreFirst = true;
		}

		// Likewise for the last one.
		if ( group[group.length - 1] !== lastInRange ) {
			group.push(lastInRange);
			ignoreLast = true;
		}

		group.forEach(function ( current, index ) {

			// Get the current step and the lower + upper positions.
			var step;
			var i;
			var q;
			var low = current;
			var high = group[index+1];
			var newPct;
			var pctDifference;
			var pctPos;
			var type;
			var steps;
			var realSteps;
			var stepsize;

			// When using 'steps' mode, use the provided steps.
			// Otherwise, we'll step on to the next subrange.
			if ( mode === 'steps' ) {
				step = scope_Spectrum.xNumSteps[ index ];
			}

			// Default to a 'full' step.
			if ( !step ) {
				step = high-low;
			}

			// Low can be 0, so test for false. If high is undefined,
			// we are at the last subrange. Index 0 is already handled.
			if ( low === false || high === undefined ) {
				return;
			}

			// Make sure step isn't 0, which would cause an infinite loop (#654)
			step = Math.max(step, 0.0000001);

			// Find all steps in the subrange.
			for ( i = low; i <= high; i = safeIncrement(i, step) ) {

				// Get the percentage value for the current step,
				// calculate the size for the subrange.
				newPct = scope_Spectrum.toStepping( i );
				pctDifference = newPct - prevPct;

				steps = pctDifference / density;
				realSteps = Math.round(steps);

				// This ratio represents the amount of percentage-space a point indicates.
				// For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
				// Round the percentage offset to an even number, then divide by two
				// to spread the offset on both sides of the range.
				stepsize = pctDifference/realSteps;

				// Divide all points evenly, adding the correct number to this subrange.
				// Run up to <= so that 100% gets a point, event if ignoreLast is set.
				for ( q = 1; q <= realSteps; q += 1 ) {

					// The ratio between the rounded value and the actual size might be ~1% off.
					// Correct the percentage offset by the number of points
					// per subrange. density = 1 will result in 100 points on the
					// full range, 2 for 50, 4 for 25, etc.
					pctPos = prevPct + ( q * stepsize );
					indexes[pctPos.toFixed(5)] = ['x', 0];
				}

				// Determine the point type.
				type = (group.indexOf(i) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );

				// Enforce the 'ignoreFirst' option by overwriting the type for 0.
				if ( !index && ignoreFirst ) {
					type = 0;
				}

				if ( !(i === high && ignoreLast)) {
					// Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
					indexes[newPct.toFixed(5)] = [i, type];
				}

				// Update the percentage count.
				prevPct = newPct;
			}
		});

		return indexes;
	}

	function addMarking ( spread, filterFunc, formatter ) {

		var element = scope_Document.createElement('div');

		var valueSizeClasses = [
			options.cssClasses.valueNormal,
			options.cssClasses.valueLarge,
			options.cssClasses.valueSub
		];
		var markerSizeClasses = [
			options.cssClasses.markerNormal,
			options.cssClasses.markerLarge,
			options.cssClasses.markerSub
		];
		var valueOrientationClasses = [
			options.cssClasses.valueHorizontal,
			options.cssClasses.valueVertical
		];
		var markerOrientationClasses = [
			options.cssClasses.markerHorizontal,
			options.cssClasses.markerVertical
		];

		addClass(element, options.cssClasses.pips);
		addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);

		function getClasses( type, source ){
			var a = source === options.cssClasses.value;
			var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
			var sizeClasses = a ? valueSizeClasses : markerSizeClasses;

			return source + ' ' + orientationClasses[options.ort] + ' ' + sizeClasses[type];
		}

		function addSpread ( offset, values ){

			// Apply the filter function, if it is set.
			values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];

			// Add a marker for every point
			var node = addNodeTo(element, false);
				node.className = getClasses(values[1], options.cssClasses.marker);
				node.style[options.style] = offset + '%';

			// Values are only appended for points marked '1' or '2'.
			if ( values[1] ) {
				node = addNodeTo(element, false);
				node.className = getClasses(values[1], options.cssClasses.value);
				node.setAttribute('data-value', values[0]);
				node.style[options.style] = offset + '%';
				node.innerText = formatter.to(values[0]);
			}
		}

		// Append all points.
		Object.keys(spread).forEach(function(a){
			addSpread(a, spread[a]);
		});

		return element;
	}

	function removePips ( ) {
		if ( scope_Pips ) {
			removeElement(scope_Pips);
			scope_Pips = null;
		}
	}

	function pips ( grid ) {

		// Fix #669
		removePips();

		var mode = grid.mode;
		var density = grid.density || 1;
		var filter = grid.filter || false;
		var values = grid.values || false;
		var stepped = grid.stepped || false;
		var group = getGroup( mode, values, stepped );
		var spread = generateSpread( density, mode, group );
		var format = grid.format || {
			to: Math.round
		};

		scope_Pips = scope_Target.appendChild(addMarking(
			spread,
			filter,
			format
		));

		return scope_Pips;
	}

/*! In this file: Browser events (not slider events like slide, change); */

	// Shorthand for base dimensions.
	function baseSize ( ) {
		var rect = scope_Base.getBoundingClientRect();
		var alt = 'offset' + ['Width', 'Height'][options.ort];
		return options.ort === 0 ? (rect.width||scope_Base[alt]) : (rect.height||scope_Base[alt]);
	}

	// Handler for attaching events trough a proxy.
	function attachEvent ( events, element, callback, data ) {

		// This function can be used to 'filter' events to the slider.
		// element is a node, not a nodeList

		var method = function ( e ){

			e = fixEvent(e, data.pageOffset, data.target || element);

			// fixEvent returns false if this event has a different target
			// when handling (multi-) touch events;
			if ( !e ) {
				return false;
			}

			// doNotReject is passed by all end events to make sure released touches
			// are not rejected, leaving the slider "stuck" to the cursor;
			if ( scope_Target.hasAttribute('disabled') && !data.doNotReject ) {
				return false;
			}

			// Stop if an active 'tap' transition is taking place.
			if ( hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject ) {
				return false;
			}

			// Ignore right or middle clicks on start #454
			if ( events === actions.start && e.buttons !== undefined && e.buttons > 1 ) {
				return false;
			}

			// Ignore right or middle clicks on start #454
			if ( data.hover && e.buttons ) {
				return false;
			}

			// 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
			// iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
			// touch-action: manipulation, but that allows panning, which breaks
			// sliders after zooming/on non-responsive pages.
			// See: https://bugs.webkit.org/show_bug.cgi?id=133112
			if ( !supportsPassive ) {
				e.preventDefault();
			}

			e.calcPoint = e.points[ options.ort ];

			// Call the event handler with the event [ and additional data ].
			callback ( e, data );
		};

		var methods = [];

		// Bind a closure on the target for every event type.
		events.split(' ').forEach(function( eventName ){
			element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
			methods.push([eventName, method]);
		});

		return methods;
	}

	// Provide a clean event with standardized offset values.
	function fixEvent ( e, pageOffset, eventTarget ) {

		// Filter the event to register the type, which can be
		// touch, mouse or pointer. Offset changes need to be
		// made on an event specific basis.
		var touch = e.type.indexOf('touch') === 0;
		var mouse = e.type.indexOf('mouse') === 0;
		var pointer = e.type.indexOf('pointer') === 0;

		var x;
		var y;

		// IE10 implemented pointer events with a prefix;
		if ( e.type.indexOf('MSPointer') === 0 ) {
			pointer = true;
		}

		// In the event that multitouch is activated, the only thing one handle should be concerned
		// about is the touches that originated on top of it.
		if ( touch ) {

			// Returns true if a touch originated on the target.
			var isTouchOnTarget = function (checkTouch) {
				return checkTouch.target === eventTarget || eventTarget.contains(checkTouch.target);
			};

			// In the case of touchstart events, we need to make sure there is still no more than one
			// touch on the target so we look amongst all touches.
			if (e.type === 'touchstart') {

				var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);

				// Do not support more than one touch per handle.
				if ( targetTouches.length > 1 ) {
					return false;
				}

				x = targetTouches[0].pageX;
				y = targetTouches[0].pageY;

			} else {

				// In the other cases, find on changedTouches is enough.
				var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);

				// Cancel if the target touch has not moved.
				if ( !targetTouch ) {
					return false;
				}

				x = targetTouch.pageX;
				y = targetTouch.pageY;
			}
		}

		pageOffset = pageOffset || getPageOffset(scope_Document);

		if ( mouse || pointer ) {
			x = e.clientX + pageOffset.x;
			y = e.clientY + pageOffset.y;
		}

		e.pageOffset = pageOffset;
		e.points = [x, y];
		e.cursor = mouse || pointer; // Fix #435

		return e;
	}

	// Translate a coordinate in the document to a percentage on the slider
	function calcPointToPercentage ( calcPoint ) {
		var location = calcPoint - offset(scope_Base, options.ort);
		var proposal = ( location * 100 ) / baseSize();

		// Clamp proposal between 0% and 100%
		// Out-of-bound coordinates may occur when .noUi-base pseudo-elements
		// are used (e.g. contained handles feature)
		proposal = limit(proposal);

		return options.dir ? 100 - proposal : proposal;
	}

	// Find handle closest to a certain percentage on the slider
	function getClosestHandle ( proposal ) {

		var closest = 100;
		var handleNumber = false;

		scope_Handles.forEach(function(handle, index){

			// Disabled handles are ignored
			if ( handle.hasAttribute('disabled') ) {
				return;
			}

			var pos = Math.abs(scope_Locations[index] - proposal);

			if ( pos < closest || (pos === 100 && closest === 100) ) {
				handleNumber = index;
				closest = pos;
			}
		});

		return handleNumber;
	}

	// Fire 'end' when a mouse or pen leaves the document.
	function documentLeave ( event, data ) {
		if ( event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null ){
			eventEnd (event, data);
		}
	}

	// Handle movement on document for handle and range drag.
	function eventMove ( event, data ) {

		// Fix #498
		// Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
		// https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
		// IE9 has .buttons and .which zero on mousemove.
		// Firefox breaks the spec MDN defines.
		if ( navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0 ) {
			return eventEnd(event, data);
		}

		// Check if we are moving up or down
		var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);

		// Convert the movement into a percentage of the slider width/height
		var proposal = (movement * 100) / data.baseSize;

		moveHandles(movement > 0, proposal, data.locations, data.handleNumbers);
	}

	// Unbind move events on document, call callbacks.
	function eventEnd ( event, data ) {

		// The handle is no longer active, so remove the class.
		if ( data.handle ) {
			removeClass(data.handle, options.cssClasses.active);
			scope_ActiveHandlesCount -= 1;
		}

		// Unbind the move and end events, which are added on 'start'.
		data.listeners.forEach(function( c ) {
			scope_DocumentElement.removeEventListener(c[0], c[1]);
		});

		if ( scope_ActiveHandlesCount === 0 ) {
			// Remove dragging class.
			removeClass(scope_Target, options.cssClasses.drag);
			setZindex();

			// Remove cursor styles and text-selection events bound to the body.
			if ( event.cursor ) {
				scope_Body.style.cursor = '';
				scope_Body.removeEventListener('selectstart', preventDefault);
			}
		}

		data.handleNumbers.forEach(function(handleNumber){
			fireEvent('change', handleNumber);
			fireEvent('set', handleNumber);
			fireEvent('end', handleNumber);
		});
	}

	// Bind move events on document.
	function eventStart ( event, data ) {

		var handle;
		if ( data.handleNumbers.length === 1 ) {

			var handleOrigin = scope_Handles[data.handleNumbers[0]];

			// Ignore 'disabled' handles
			if ( handleOrigin.hasAttribute('disabled') ) {
				return false;
			}

			handle = handleOrigin.children[0];
			scope_ActiveHandlesCount += 1;

			// Mark the handle as 'active' so it can be styled.
			addClass(handle, options.cssClasses.active);
		}

		// A drag should never propagate up to the 'tap' event.
		event.stopPropagation();

		// Record the event listeners.
		var listeners = [];

		// Attach the move and end events.
		var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
			// The event target has changed so we need to propagate the original one so that we keep
			// relying on it to extract target touches.
			target: event.target,
			handle: handle,
			listeners: listeners,
			startCalcPoint: event.calcPoint,
			baseSize: baseSize(),
			pageOffset: event.pageOffset,
			handleNumbers: data.handleNumbers,
			buttonsProperty: event.buttons,
			locations: scope_Locations.slice()
		});

		var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
			target: event.target,
			handle: handle,
			listeners: listeners,
			doNotReject: true,
			handleNumbers: data.handleNumbers
		});

		var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
			target: event.target,
			handle: handle,
			listeners: listeners,
			doNotReject: true,
			handleNumbers: data.handleNumbers
		});

		// We want to make sure we pushed the listeners in the listener list rather than creating
		// a new one as it has already been passed to the event handlers.
		listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));

		// Text selection isn't an issue on touch devices,
		// so adding cursor styles can be skipped.
		if ( event.cursor ) {

			// Prevent the 'I' cursor and extend the range-drag cursor.
			scope_Body.style.cursor = getComputedStyle(event.target).cursor;

			// Mark the target with a dragging state.
			if ( scope_Handles.length > 1 ) {
				addClass(scope_Target, options.cssClasses.drag);
			}

			// Prevent text selection when dragging the handles.
			// In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
			// which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
			// meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
			// The 'cursor' flag is false.
			// See: http://caniuse.com/#search=selectstart
			scope_Body.addEventListener('selectstart', preventDefault, false);
		}

		data.handleNumbers.forEach(function(handleNumber){
			fireEvent('start', handleNumber);
		});
	}

	// Move closest handle to tapped location.
	function eventTap ( event ) {

		// The tap event shouldn't propagate up
		event.stopPropagation();

		var proposal = calcPointToPercentage(event.calcPoint);
		var handleNumber = getClosestHandle(proposal);

		// Tackle the case that all handles are 'disabled'.
		if ( handleNumber === false ) {
			return false;
		}

		// Flag the slider as it is now in a transitional state.
		// Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
		if ( !options.events.snap ) {
			addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
		}

		setHandle(handleNumber, proposal, true, true);

		setZindex();

		fireEvent('slide', handleNumber, true);
		fireEvent('update', handleNumber, true);
		fireEvent('change', handleNumber, true);
		fireEvent('set', handleNumber, true);

		if ( options.events.snap ) {
			eventStart(event, { handleNumbers: [handleNumber] });
		}
	}

	// Fires a 'hover' event for a hovered mouse/pen position.
	function eventHover ( event ) {

		var proposal = calcPointToPercentage(event.calcPoint);

		var to = scope_Spectrum.getStep(proposal);
		var value = scope_Spectrum.fromStepping(to);

		Object.keys(scope_Events).forEach(function( targetEvent ) {
			if ( 'hover' === targetEvent.split('.')[0] ) {
				scope_Events[targetEvent].forEach(function( callback ) {
					callback.call( scope_Self, value );
				});
			}
		});
	}

	// Attach events to several slider parts.
	function bindSliderEvents ( behaviour ) {

		// Attach the standard drag event to the handles.
		if ( !behaviour.fixed ) {

			scope_Handles.forEach(function( handle, index ){

				// These events are only bound to the visual handle
				// element, not the 'real' origin element.
				attachEvent ( actions.start, handle.children[0], eventStart, {
					handleNumbers: [index]
				});
			});
		}

		// Attach the tap event to the slider base.
		if ( behaviour.tap ) {
			attachEvent (actions.start, scope_Base, eventTap, {});
		}

		// Fire hover events
		if ( behaviour.hover ) {
			attachEvent (actions.move, scope_Base, eventHover, { hover: true });
		}

		// Make the range draggable.
		if ( behaviour.drag ){

			scope_Connects.forEach(function( connect, index ){

				if ( connect === false || index === 0 || index === scope_Connects.length - 1 ) {
					return;
				}

				var handleBefore = scope_Handles[index - 1];
				var handleAfter = scope_Handles[index];
				var eventHolders = [connect];

				addClass(connect, options.cssClasses.draggable);

				// When the range is fixed, the entire range can
				// be dragged by the handles. The handle in the first
				// origin will propagate the start event upward,
				// but it needs to be bound manually on the other.
				if ( behaviour.fixed ) {
					eventHolders.push(handleBefore.children[0]);
					eventHolders.push(handleAfter.children[0]);
				}

				eventHolders.forEach(function( eventHolder ) {
					attachEvent ( actions.start, eventHolder, eventStart, {
						handles: [handleBefore, handleAfter],
						handleNumbers: [index - 1, index]
					});
				});
			});
		}
	}

/*! In this file: Slider events (not browser events); */

	// Attach an event to this slider, possibly including a namespace
	function bindEvent ( namespacedEvent, callback ) {
		scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
		scope_Events[namespacedEvent].push(callback);

		// If the event bound is 'update,' fire it immediately for all handles.
		if ( namespacedEvent.split('.')[0] === 'update' ) {
			scope_Handles.forEach(function(a, index){
				fireEvent('update', index);
			});
		}
	}

	// Undo attachment of event
	function removeEvent ( namespacedEvent ) {

		var event = namespacedEvent && namespacedEvent.split('.')[0];
		var namespace = event && namespacedEvent.substring(event.length);

		Object.keys(scope_Events).forEach(function( bind ){

			var tEvent = bind.split('.')[0];
			var tNamespace = bind.substring(tEvent.length);

			if ( (!event || event === tEvent) && (!namespace || namespace === tNamespace) ) {
				delete scope_Events[bind];
			}
		});
	}

	// External event handling
	function fireEvent ( eventName, handleNumber, tap ) {

		Object.keys(scope_Events).forEach(function( targetEvent ) {

			var eventType = targetEvent.split('.')[0];

			if ( eventName === eventType ) {
				scope_Events[targetEvent].forEach(function( callback ) {

					callback.call(
						// Use the slider public API as the scope ('this')
						scope_Self,
						// Return values as array, so arg_1[arg_2] is always valid.
						scope_Values.map(options.format.to),
						// Handle index, 0 or 1
						handleNumber,
						// Unformatted slider values
						scope_Values.slice(),
						// Event is fired by tap, true or false
						tap || false,
						// Left offset of the handle, in relation to the slider
						scope_Locations.slice()
					);
				});
			}
		});
	}

/*! In this file: Mechanics for slider operation */

	function toPct ( pct ) {
		return pct + '%';
	}

	// Split out the handle positioning logic so the Move event can use it, too
	function checkHandlePosition ( reference, handleNumber, to, lookBackward, lookForward, getValue ) {

		// For sliders with multiple handles, limit movement to the other handle.
		// Apply the margin option by adding it to the handle positions.
		if ( scope_Handles.length > 1 ) {

			if ( lookBackward && handleNumber > 0 ) {
				to = Math.max(to, reference[handleNumber - 1] + options.margin);
			}

			if ( lookForward && handleNumber < scope_Handles.length - 1 ) {
				to = Math.min(to, reference[handleNumber + 1] - options.margin);
			}
		}

		// The limit option has the opposite effect, limiting handles to a
		// maximum distance from another. Limit must be > 0, as otherwise
		// handles would be unmoveable.
		if ( scope_Handles.length > 1 && options.limit ) {

			if ( lookBackward && handleNumber > 0 ) {
				to = Math.min(to, reference[handleNumber - 1] + options.limit);
			}

			if ( lookForward && handleNumber < scope_Handles.length - 1 ) {
				to = Math.max(to, reference[handleNumber + 1] - options.limit);
			}
		}

		// The padding option keeps the handles a certain distance from the
		// edges of the slider. Padding must be > 0.
		if ( options.padding ) {

			if ( handleNumber === 0 ) {
				to = Math.max(to, options.padding[0]);
			}

			if ( handleNumber === scope_Handles.length - 1 ) {
				to = Math.min(to, 100 - options.padding[1]);
			}
		}

		to = scope_Spectrum.getStep(to);

		// Limit percentage to the 0 - 100 range
		to = limit(to);

		// Return false if handle can't move
		if ( to === reference[handleNumber] && !getValue ) {
			return false;
		}

		return to;
	}

	// Uses slider orientation to create CSS rules. a = base value;
	function inRuleOrder ( v, a ) {
		var o = options.ort;
		return (o?a:v) + ', ' + (o?v:a);
	}

	// Moves handle(s) by a percentage
	// (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
	function moveHandles ( upward, proposal, locations, handleNumbers ) {

		var proposals = locations.slice();

		var b = [!upward, upward];
		var f = [upward, !upward];

		// Copy handleNumbers so we don't change the dataset
		handleNumbers = handleNumbers.slice();

		// Check to see which handle is 'leading'.
		// If that one can't move the second can't either.
		if ( upward ) {
			handleNumbers.reverse();
		}

		// Step 1: get the maximum percentage that any of the handles can move
		if ( handleNumbers.length > 1 ) {

			handleNumbers.forEach(function(handleNumber, o) {

				var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], false);

				// Stop if one of the handles can't move.
				if ( to === false ) {
					proposal = 0;
				} else {
					proposal = to - proposals[handleNumber];
					proposals[handleNumber] = to;
				}
			});
		}

		// If using one handle, check backward AND forward
		else {
			b = f = [true];
		}

		var state = false;

		// Step 2: Try to set the handles with the found percentage
		handleNumbers.forEach(function(handleNumber, o) {
			state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o]) || state;
		});

		// Step 3: If a handle moved, fire events
		if ( state ) {
			handleNumbers.forEach(function(handleNumber){
				fireEvent('update', handleNumber);
				fireEvent('slide', handleNumber);
			});
		}
	}

	// Takes a base value and an offset. This offset is used for the connect bar size.
	// In the initial design for this feature, the origin element was 1% wide.
	// Unfortunately, a rounding bug in Chrome makes it impossible to implement this feature
	// in this manner: https://bugs.chromium.org/p/chromium/issues/detail?id=798223
	function transformDirection ( a, b ) {
		return options.dir ? 100 - a - b : a;
	}

	// Updates scope_Locations and scope_Values, updates visual state
	function updateHandlePosition ( handleNumber, to ) {

		// Update locations.
		scope_Locations[handleNumber] = to;

		// Convert the value to the slider stepping/range.
		scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);

		var rule = 'translate(' + inRuleOrder(toPct(transformDirection(to, 0) - scope_DirOffset), '0') + ')';
		scope_Handles[handleNumber].style[options.transformRule] = rule;

		updateConnect(handleNumber);
		updateConnect(handleNumber + 1);
	}

	// Handles before the slider middle are stacked later = higher,
	// Handles after the middle later is lower
	// [[7] [8] .......... | .......... [5] [4]
	function setZindex ( ) {

		scope_HandleNumbers.forEach(function(handleNumber){
			var dir = (scope_Locations[handleNumber] > 50 ? -1 : 1);
			var zIndex = 3 + (scope_Handles.length + (dir * handleNumber));
			scope_Handles[handleNumber].style.zIndex = zIndex;
		});
	}

	// Test suggested values and apply margin, step.
	function setHandle ( handleNumber, to, lookBackward, lookForward ) {

		to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false);

		if ( to === false ) {
			return false;
		}

		updateHandlePosition(handleNumber, to);

		return true;
	}

	// Updates style attribute for connect nodes
	function updateConnect ( index ) {

		// Skip connects set to false
		if ( !scope_Connects[index] ) {
			return;
		}

		var l = 0;
		var h = 100;

		if ( index !== 0 ) {
			l = scope_Locations[index - 1];
		}

		if ( index !== scope_Connects.length - 1 ) {
			h = scope_Locations[index];
		}

		// We use two rules:
		// 'translate' to change the left/top offset;
		// 'scale' to change the width of the element;
		// As the element has a width of 100%, a translation of 100% is equal to 100% of the parent (.noUi-base)
		var connectWidth = h - l;
		var translateRule = 'translate(' + inRuleOrder(toPct(transformDirection(l, connectWidth)), '0') + ')';
		var scaleRule = 'scale(' + inRuleOrder(connectWidth / 100, '1') + ')';

		scope_Connects[index].style[options.transformRule] = translateRule + ' ' + scaleRule;
	}

/*! In this file: All methods eventually exposed in slider.noUiSlider... */

	// Parses value passed to .set method. Returns current value if not parse-able.
	function resolveToValue ( to, handleNumber ) {

		// Setting with null indicates an 'ignore'.
		// Inputting 'false' is invalid.
		if ( to === null || to === false || to === undefined ) {
			return scope_Locations[handleNumber];
		}

		// If a formatted number was passed, attempt to decode it.
		if ( typeof to === 'number' ) {
			to = String(to);
		}

		to = options.format.from(to);
		to = scope_Spectrum.toStepping(to);

		// If parsing the number failed, use the current value.
		if ( to === false || isNaN(to) ) {
			return scope_Locations[handleNumber];
		}

		return to;
	}

	// Set the slider value.
	function valueSet ( input, fireSetEvent ) {

		var values = asArray(input);
		var isInit = scope_Locations[0] === undefined;

		// Event fires by default
		fireSetEvent = (fireSetEvent === undefined ? true : !!fireSetEvent);

		// Animation is optional.
		// Make sure the initial values were set before using animated placement.
		if ( options.animate && !isInit ) {
			addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
		}

		// First pass, without lookAhead but with lookBackward. Values are set from left to right.
		scope_HandleNumbers.forEach(function(handleNumber){
			setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false);
		});

		// Second pass. Now that all base values are set, apply constraints
		scope_HandleNumbers.forEach(function(handleNumber){
			setHandle(handleNumber, scope_Locations[handleNumber], true, true);
		});

		setZindex();

		scope_HandleNumbers.forEach(function(handleNumber){

			fireEvent('update', handleNumber);

			// Fire the event only for handles that received a new value, as per #579
			if ( values[handleNumber] !== null && fireSetEvent ) {
				fireEvent('set', handleNumber);
			}
		});
	}

	// Reset slider to initial values
	function valueReset ( fireSetEvent ) {
		valueSet(options.start, fireSetEvent);
	}

	// Get the slider value.
	function valueGet ( ) {

		var values = scope_Values.map(options.format.to);

		// If only one handle is used, return a single value.
		if ( values.length === 1 ){
			return values[0];
		}

		return values;
	}

	// Removes classes from the root and empties it.
	function destroy ( ) {

		for ( var key in options.cssClasses ) {
			if ( !options.cssClasses.hasOwnProperty(key) ) { continue; }
			removeClass(scope_Target, options.cssClasses[key]);
		}

		while (scope_Target.firstChild) {
			scope_Target.removeChild(scope_Target.firstChild);
		}

		delete scope_Target.noUiSlider;
	}

	// Get the current step size for the slider.
	function getCurrentStep ( ) {

		// Check all locations, map them to their stepping point.
		// Get the step point, then find it in the input list.
		return scope_Locations.map(function( location, index ){

			var nearbySteps = scope_Spectrum.getNearbySteps( location );
			var value = scope_Values[index];
			var increment = nearbySteps.thisStep.step;
			var decrement = null;

			// If the next value in this step moves into the next step,
			// the increment is the start of the next step - the current value
			if ( increment !== false ) {
				if ( value + increment > nearbySteps.stepAfter.startValue ) {
					increment = nearbySteps.stepAfter.startValue - value;
				}
			}


			// If the value is beyond the starting point
			if ( value > nearbySteps.thisStep.startValue ) {
				decrement = nearbySteps.thisStep.step;
			}

			else if ( nearbySteps.stepBefore.step === false ) {
				decrement = false;
			}

			// If a handle is at the start of a step, it always steps back into the previous step first
			else {
				decrement = value - nearbySteps.stepBefore.highestStep;
			}


			// Now, if at the slider edges, there is not in/decrement
			if ( location === 100 ) {
				increment = null;
			}

			else if ( location === 0 ) {
				decrement = null;
			}

			// As per #391, the comparison for the decrement step can have some rounding issues.
			var stepDecimals = scope_Spectrum.countStepDecimals();

			// Round per #391
			if ( increment !== null && increment !== false ) {
				increment = Number(increment.toFixed(stepDecimals));
			}

			if ( decrement !== null && decrement !== false ) {
				decrement = Number(decrement.toFixed(stepDecimals));
			}

			return [decrement, increment];
		});
	}

	// Updateable: margin, limit, padding, step, range, animate, snap
	function updateOptions ( optionsToUpdate, fireSetEvent ) {

		// Spectrum is created using the range, snap, direction and step options.
		// 'snap' and 'step' can be updated.
		// If 'snap' and 'step' are not passed, they should remain unchanged.
		var v = valueGet();

		var updateAble = ['margin', 'limit', 'padding', 'range', 'animate', 'snap', 'step', 'format'];

		// Only change options that we're actually passed to update.
		updateAble.forEach(function(name){
			if ( optionsToUpdate[name] !== undefined ) {
				originalOptions[name] = optionsToUpdate[name];
			}
		});

		var newOptions = testOptions(originalOptions);

		// Load new options into the slider state
		updateAble.forEach(function(name){
			if ( optionsToUpdate[name] !== undefined ) {
				options[name] = newOptions[name];
			}
		});

		scope_Spectrum = newOptions.spectrum;

		// Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
		options.margin = newOptions.margin;
		options.limit = newOptions.limit;
		options.padding = newOptions.padding;

		// Update pips, removes existing.
		if ( options.pips ) {
			pips(options.pips);
		}

		// Invalidate the current positioning so valueSet forces an update.
		scope_Locations = [];
		valueSet(optionsToUpdate.start || v, fireSetEvent);
	}

/*! In this file: Calls to functions. All other scope_ files define functions only; */

	// Create the base element, initialize HTML and set classes.
	// Add handles and connect elements.
	addSlider(scope_Target);
	addElements(options.connect, scope_Base);

	// Attach user events.
	bindSliderEvents(options.events);

	// Use the public value method to set the start values.
	valueSet(options.start);

	scope_Self = {
		destroy: destroy,
		steps: getCurrentStep,
		on: bindEvent,
		off: removeEvent,
		get: valueGet,
		set: valueSet,
		reset: valueReset,
		// Exposed for unit testing, don't use this in your application.
		__moveHandles: function(a, b, c) { moveHandles(a, b, scope_Locations, c); },
		options: originalOptions, // Issue #600, #678
		updateOptions: updateOptions,
		target: scope_Target, // Issue #597
		removePips: removePips,
		pips: pips // Issue #594
	};

	if ( options.pips ) {
		pips(options.pips);
	}

	if ( options.tooltips ) {
		tooltips();
	}

	aria();

	return scope_Self;

}


	// Run the standard initializer
	function initialize ( target, originalOptions ) {

		if ( !target || !target.nodeName ) {
			throw new Error("noUiSlider (" + VERSION + "): create requires a single element, got: " + target);
		}

		// Throw an error if the slider was already initialized.
		if ( target.noUiSlider ) {
			throw new Error("noUiSlider (" + VERSION + "): Slider was already initialized.");
		}

		// Test the options and create the slider environment;
		var options = testOptions( originalOptions, target );
		var api = scope( target, options, originalOptions );

		target.noUiSlider = api;

		return api;
	}

	// Use an object instead of a function for future expandability;
	return {
		version: VERSION,
		create: initialize
	};

}));
/*! nouislider - 11.1.0 - 2018-04-02 11:18:13 */

!function(a){"function"==typeof define&&define.amd?define([],a):"object"==typeof exports?module.exports=a():window.noUiSlider=a()}(function(){"use strict";function a(a){return"object"==typeof a&&"function"==typeof a.to&&"function"==typeof a.from}function b(a){a.parentElement.removeChild(a)}function c(a){return null!==a&&void 0!==a}function d(a){a.preventDefault()}function e(a){return a.filter(function(a){return!this[a]&&(this[a]=!0)},{})}function f(a,b){return Math.round(a/b)*b}function g(a,b){var c=a.getBoundingClientRect(),d=a.ownerDocument,e=d.documentElement,f=p(d);return/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(f.x=0),b?c.top+f.y-e.clientTop:c.left+f.x-e.clientLeft}function h(a){return"number"==typeof a&&!isNaN(a)&&isFinite(a)}function i(a,b,c){c>0&&(m(a,b),setTimeout(function(){n(a,b)},c))}function j(a){return Math.max(Math.min(a,100),0)}function k(a){return Array.isArray(a)?a:[a]}function l(a){a=String(a);var b=a.split(".");return b.length>1?b[1].length:0}function m(a,b){a.classList?a.classList.add(b):a.className+=" "+b}function n(a,b){a.classList?a.classList.remove(b):a.className=a.className.replace(new RegExp("(^|\\b)"+b.split(" ").join("|")+"(\\b|$)","gi")," ")}function o(a,b){return a.classList?a.classList.contains(b):new RegExp("\\b"+b+"\\b").test(a.className)}function p(a){var b=void 0!==window.pageXOffset,c="CSS1Compat"===(a.compatMode||"");return{x:b?window.pageXOffset:c?a.documentElement.scrollLeft:a.body.scrollLeft,y:b?window.pageYOffset:c?a.documentElement.scrollTop:a.body.scrollTop}}function q(){return window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"}}function r(){var a=!1;try{var b=Object.defineProperty({},"passive",{get:function(){a=!0}});window.addEventListener("test",null,b)}catch(a){}return a}function s(){return window.CSS&&CSS.supports&&CSS.supports("touch-action","none")}function t(a,b){return 100/(b-a)}function u(a,b){return 100*b/(a[1]-a[0])}function v(a,b){return u(a,a[0]<0?b+Math.abs(a[0]):b-a[0])}function w(a,b){return b*(a[1]-a[0])/100+a[0]}function x(a,b){for(var c=1;a>=b[c];)c+=1;return c}function y(a,b,c){if(c>=a.slice(-1)[0])return 100;var d=x(c,a),e=a[d-1],f=a[d],g=b[d-1],h=b[d];return g+v([e,f],c)/t(g,h)}function z(a,b,c){if(c>=100)return a.slice(-1)[0];var d=x(c,b),e=a[d-1],f=a[d],g=b[d-1];return w([e,f],(c-g)*t(g,b[d]))}function A(a,b,c,d){if(100===d)return d;var e=x(d,a),g=a[e-1],h=a[e];return c?d-g>(h-g)/2?h:g:b[e-1]?a[e-1]+f(d-a[e-1],b[e-1]):d}function B(a,b,c){var d;if("number"==typeof b&&(b=[b]),!Array.isArray(b))throw new Error("noUiSlider ("+$+"): 'range' contains invalid value.");if(d="min"===a?0:"max"===a?100:parseFloat(a),!h(d)||!h(b[0]))throw new Error("noUiSlider ("+$+"): 'range' value isn't numeric.");c.xPct.push(d),c.xVal.push(b[0]),d?c.xSteps.push(!isNaN(b[1])&&b[1]):isNaN(b[1])||(c.xSteps[0]=b[1]),c.xHighestCompleteStep.push(0)}function C(a,b,c){if(!b)return!0;c.xSteps[a]=u([c.xVal[a],c.xVal[a+1]],b)/t(c.xPct[a],c.xPct[a+1]);var d=(c.xVal[a+1]-c.xVal[a])/c.xNumSteps[a],e=Math.ceil(Number(d.toFixed(3))-1),f=c.xVal[a]+c.xNumSteps[a]*e;c.xHighestCompleteStep[a]=f}function D(a,b,c){this.xPct=[],this.xVal=[],this.xSteps=[c||!1],this.xNumSteps=[!1],this.xHighestCompleteStep=[],this.snap=b;var d,e=[];for(d in a)a.hasOwnProperty(d)&&e.push([a[d],d]);for(e.length&&"object"==typeof e[0][0]?e.sort(function(a,b){return a[0][0]-b[0][0]}):e.sort(function(a,b){return a[0]-b[0]}),d=0;d<e.length;d++)B(e[d][1],e[d][0],this);for(this.xNumSteps=this.xSteps.slice(0),d=0;d<this.xNumSteps.length;d++)C(d,this.xNumSteps[d],this)}function E(b){if(a(b))return!0;throw new Error("noUiSlider ("+$+"): 'format' requires 'to' and 'from' methods.")}function F(a,b){if(!h(b))throw new Error("noUiSlider ("+$+"): 'step' is not numeric.");a.singleStep=b}function G(a,b){if("object"!=typeof b||Array.isArray(b))throw new Error("noUiSlider ("+$+"): 'range' is not an object.");if(void 0===b.min||void 0===b.max)throw new Error("noUiSlider ("+$+"): Missing 'min' or 'max' in 'range'.");if(b.min===b.max)throw new Error("noUiSlider ("+$+"): 'range' 'min' and 'max' cannot be equal.");a.spectrum=new D(b,a.snap,a.singleStep)}function H(a,b){if(b=k(b),!Array.isArray(b)||!b.length)throw new Error("noUiSlider ("+$+"): 'start' option is incorrect.");a.handles=b.length,a.start=b}function I(a,b){if(a.snap=b,"boolean"!=typeof b)throw new Error("noUiSlider ("+$+"): 'snap' option must be a boolean.")}function J(a,b){if(a.animate=b,"boolean"!=typeof b)throw new Error("noUiSlider ("+$+"): 'animate' option must be a boolean.")}function K(a,b){if(a.animationDuration=b,"number"!=typeof b)throw new Error("noUiSlider ("+$+"): 'animationDuration' option must be a number.")}function L(a,b){var c,d=[!1];if("lower"===b?b=[!0,!1]:"upper"===b&&(b=[!1,!0]),!0===b||!1===b){for(c=1;c<a.handles;c++)d.push(b);d.push(!1)}else{if(!Array.isArray(b)||!b.length||b.length!==a.handles+1)throw new Error("noUiSlider ("+$+"): 'connect' option doesn't match handle count.");d=b}a.connect=d}function M(a,b){switch(b){case"horizontal":a.ort=0;break;case"vertical":a.ort=1;break;default:throw new Error("noUiSlider ("+$+"): 'orientation' option is invalid.")}}function N(a,b){if(!h(b))throw new Error("noUiSlider ("+$+"): 'margin' option must be numeric.");if(0!==b&&(a.margin=a.spectrum.getMargin(b),!a.margin))throw new Error("noUiSlider ("+$+"): 'margin' option is only supported on linear sliders.")}function O(a,b){if(!h(b))throw new Error("noUiSlider ("+$+"): 'limit' option must be numeric.");if(a.limit=a.spectrum.getMargin(b),!a.limit||a.handles<2)throw new Error("noUiSlider ("+$+"): 'limit' option is only supported on linear sliders with 2 or more handles.")}function P(a,b){if(!h(b)&&!Array.isArray(b))throw new Error("noUiSlider ("+$+"): 'padding' option must be numeric or array of exactly 2 numbers.");if(Array.isArray(b)&&2!==b.length&&!h(b[0])&&!h(b[1]))throw new Error("noUiSlider ("+$+"): 'padding' option must be numeric or array of exactly 2 numbers.");if(0!==b){if(Array.isArray(b)||(b=[b,b]),a.padding=[a.spectrum.getMargin(b[0]),a.spectrum.getMargin(b[1])],!1===a.padding[0]||!1===a.padding[1])throw new Error("noUiSlider ("+$+"): 'padding' option is only supported on linear sliders.");if(a.padding[0]<0||a.padding[1]<0)throw new Error("noUiSlider ("+$+"): 'padding' option must be a positive number(s).");if(a.padding[0]+a.padding[1]>=100)throw new Error("noUiSlider ("+$+"): 'padding' option must not exceed 100% of the range.")}}function Q(a,b){switch(b){case"ltr":a.dir=0;break;case"rtl":a.dir=1;break;default:throw new Error("noUiSlider ("+$+"): 'direction' option was not recognized.")}}function R(a,b){if("string"!=typeof b)throw new Error("noUiSlider ("+$+"): 'behaviour' must be a string containing options.");var c=b.indexOf("tap")>=0,d=b.indexOf("drag")>=0,e=b.indexOf("fixed")>=0,f=b.indexOf("snap")>=0,g=b.indexOf("hover")>=0;if(e){if(2!==a.handles)throw new Error("noUiSlider ("+$+"): 'fixed' behaviour must be used with 2 handles");N(a,a.start[1]-a.start[0])}a.events={tap:c||f,drag:d,fixed:e,snap:f,hover:g}}function S(a,b){if(!1!==b)if(!0===b){a.tooltips=[];for(var c=0;c<a.handles;c++)a.tooltips.push(!0)}else{if(a.tooltips=k(b),a.tooltips.length!==a.handles)throw new Error("noUiSlider ("+$+"): must pass a formatter for all handles.");a.tooltips.forEach(function(a){if("boolean"!=typeof a&&("object"!=typeof a||"function"!=typeof a.to))throw new Error("noUiSlider ("+$+"): 'tooltips' must be passed a formatter or 'false'.")})}}function T(a,b){a.ariaFormat=b,E(b)}function U(a,b){a.format=b,E(b)}function V(a,b){if("string"!=typeof b&&!1!==b)throw new Error("noUiSlider ("+$+"): 'cssPrefix' must be a string or `false`.");a.cssPrefix=b}function W(a,b){if("object"!=typeof b)throw new Error("noUiSlider ("+$+"): 'cssClasses' must be an object.");if("string"==typeof a.cssPrefix){a.cssClasses={};for(var c in b)b.hasOwnProperty(c)&&(a.cssClasses[c]=a.cssPrefix+b[c])}else a.cssClasses=b}function X(a){var b={margin:0,limit:0,padding:0,animate:!0,animationDuration:300,ariaFormat:_,format:_},d={step:{r:!1,t:F},start:{r:!0,t:H},connect:{r:!0,t:L},direction:{r:!0,t:Q},snap:{r:!1,t:I},animate:{r:!1,t:J},animationDuration:{r:!1,t:K},range:{r:!0,t:G},orientation:{r:!1,t:M},margin:{r:!1,t:N},limit:{r:!1,t:O},padding:{r:!1,t:P},behaviour:{r:!0,t:R},ariaFormat:{r:!1,t:T},format:{r:!1,t:U},tooltips:{r:!1,t:S},cssPrefix:{r:!0,t:V},cssClasses:{r:!0,t:W}},e={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal",cssPrefix:"noUi-",cssClasses:{target:"target",base:"base",origin:"origin",handle:"handle",handleLower:"handle-lower",handleUpper:"handle-upper",horizontal:"horizontal",vertical:"vertical",background:"background",connect:"connect",connects:"connects",ltr:"ltr",rtl:"rtl",draggable:"draggable",drag:"state-drag",tap:"state-tap",active:"active",tooltip:"tooltip",pips:"pips",pipsHorizontal:"pips-horizontal",pipsVertical:"pips-vertical",marker:"marker",markerHorizontal:"marker-horizontal",markerVertical:"marker-vertical",markerNormal:"marker-normal",markerLarge:"marker-large",markerSub:"marker-sub",value:"value",valueHorizontal:"value-horizontal",valueVertical:"value-vertical",valueNormal:"value-normal",valueLarge:"value-large",valueSub:"value-sub"}};a.format&&!a.ariaFormat&&(a.ariaFormat=a.format),Object.keys(d).forEach(function(f){if(!c(a[f])&&void 0===e[f]){if(d[f].r)throw new Error("noUiSlider ("+$+"): '"+f+"' is required.");return!0}d[f].t(b,c(a[f])?a[f]:e[f])}),b.pips=a.pips;var f=document.createElement("div"),g=void 0!==f.style.msTransform,h=void 0!==f.style.transform;b.transformRule=h?"transform":g?"msTransform":"webkitTransform";var i=[["left","top"],["right","bottom"]];return b.style=i[b.dir][b.ort],b}function Y(a,c,f){function h(a,b){var c=ya.createElement("div");return b&&m(c,b),a.appendChild(c),c}function l(a,b){var d=h(a,c.cssClasses.origin),e=h(d,c.cssClasses.handle);return e.setAttribute("data-handle",b),e.setAttribute("tabindex","0"),e.setAttribute("role","slider"),e.setAttribute("aria-orientation",c.ort?"vertical":"horizontal"),0===b?m(e,c.cssClasses.handleLower):b===c.handles-1&&m(e,c.cssClasses.handleUpper),d}function t(a,b){return!!b&&h(a,c.cssClasses.connect)}function u(a,b){var d=h(b,c.cssClasses.connects);ka=[],la=[],la.push(t(d,a[0]));for(var e=0;e<c.handles;e++)ka.push(l(b,e)),ta[e]=e,la.push(t(d,a[e+1]))}function v(a){m(a,c.cssClasses.target),0===c.dir?m(a,c.cssClasses.ltr):m(a,c.cssClasses.rtl),0===c.ort?m(a,c.cssClasses.horizontal):m(a,c.cssClasses.vertical),ja=h(a,c.cssClasses.base)}function w(a,b){return!!c.tooltips[b]&&h(a.firstChild,c.cssClasses.tooltip)}function x(){var a=ka.map(w);Q("update",function(b,d,e){if(a[d]){var f=b[d];!0!==c.tooltips[d]&&(f=c.tooltips[d].to(e[d])),a[d].innerHTML=f}})}function y(){Q("update",function(a,b,d,e,f){ta.forEach(function(a){var b=ka[a],e=U(sa,a,0,!0,!0,!0),g=U(sa,a,100,!0,!0,!0),h=f[a],i=c.ariaFormat.to(d[a]);b.children[0].setAttribute("aria-valuemin",e.toFixed(1)),b.children[0].setAttribute("aria-valuemax",g.toFixed(1)),b.children[0].setAttribute("aria-valuenow",h.toFixed(1)),b.children[0].setAttribute("aria-valuetext",i)})})}function z(a,b,c){if("range"===a||"steps"===a)return va.xVal;if("count"===a){if(b<2)throw new Error("noUiSlider ("+$+"): 'values' (>= 2) required for mode 'count'.");var d=b-1,e=100/d;for(b=[];d--;)b[d]=d*e;b.push(100),a="positions"}return"positions"===a?b.map(function(a){return va.fromStepping(c?va.getStep(a):a)}):"values"===a?c?b.map(function(a){return va.fromStepping(va.getStep(va.toStepping(a)))}):b:void 0}function A(a,b,c){function d(a,b){return(a+b).toFixed(7)/1}var f={},g=va.xVal[0],h=va.xVal[va.xVal.length-1],i=!1,j=!1,k=0;return c=e(c.slice().sort(function(a,b){return a-b})),c[0]!==g&&(c.unshift(g),i=!0),c[c.length-1]!==h&&(c.push(h),j=!0),c.forEach(function(e,g){var h,l,m,n,o,p,q,r,s,t,u=e,v=c[g+1];if("steps"===b&&(h=va.xNumSteps[g]),h||(h=v-u),!1!==u&&void 0!==v)for(h=Math.max(h,1e-7),l=u;l<=v;l=d(l,h)){for(n=va.toStepping(l),o=n-k,r=o/a,s=Math.round(r),t=o/s,m=1;m<=s;m+=1)p=k+m*t,f[p.toFixed(5)]=["x",0];q=c.indexOf(l)>-1?1:"steps"===b?2:0,!g&&i&&(q=0),l===v&&j||(f[n.toFixed(5)]=[l,q]),k=n}}),f}function B(a,b,d){function e(a,b){var d=b===c.cssClasses.value,e=d?k:l,f=d?i:j;return b+" "+e[c.ort]+" "+f[a]}function f(a,f){f[1]=f[1]&&b?b(f[0],f[1]):f[1];var i=h(g,!1);i.className=e(f[1],c.cssClasses.marker),i.style[c.style]=a+"%",f[1]&&(i=h(g,!1),i.className=e(f[1],c.cssClasses.value),i.setAttribute("data-value",f[0]),i.style[c.style]=a+"%",i.innerText=d.to(f[0]))}var g=ya.createElement("div"),i=[c.cssClasses.valueNormal,c.cssClasses.valueLarge,c.cssClasses.valueSub],j=[c.cssClasses.markerNormal,c.cssClasses.markerLarge,c.cssClasses.markerSub],k=[c.cssClasses.valueHorizontal,c.cssClasses.valueVertical],l=[c.cssClasses.markerHorizontal,c.cssClasses.markerVertical];return m(g,c.cssClasses.pips),m(g,0===c.ort?c.cssClasses.pipsHorizontal:c.cssClasses.pipsVertical),Object.keys(a).forEach(function(b){f(b,a[b])}),g}function C(){na&&(b(na),na=null)}function D(a){C();var b=a.mode,c=a.density||1,d=a.filter||!1,e=a.values||!1,f=a.stepped||!1,g=z(b,e,f),h=A(c,b,g),i=a.format||{to:Math.round};return na=ra.appendChild(B(h,d,i))}function E(){var a=ja.getBoundingClientRect(),b="offset"+["Width","Height"][c.ort];return 0===c.ort?a.width||ja[b]:a.height||ja[b]}function F(a,b,d,e){var f=function(f){return!!(f=G(f,e.pageOffset,e.target||b))&&(!(ra.hasAttribute("disabled")&&!e.doNotReject)&&(!(o(ra,c.cssClasses.tap)&&!e.doNotReject)&&(!(a===oa.start&&void 0!==f.buttons&&f.buttons>1)&&((!e.hover||!f.buttons)&&(qa||f.preventDefault(),f.calcPoint=f.points[c.ort],void d(f,e))))))},g=[];return a.split(" ").forEach(function(a){b.addEventListener(a,f,!!qa&&{passive:!0}),g.push([a,f])}),g}function G(a,b,c){var d,e,f=0===a.type.indexOf("touch"),g=0===a.type.indexOf("mouse"),h=0===a.type.indexOf("pointer");if(0===a.type.indexOf("MSPointer")&&(h=!0),f){var i=function(a){return a.target===c||c.contains(a.target)};if("touchstart"===a.type){var j=Array.prototype.filter.call(a.touches,i);if(j.length>1)return!1;d=j[0].pageX,e=j[0].pageY}else{var k=Array.prototype.find.call(a.changedTouches,i);if(!k)return!1;d=k.pageX,e=k.pageY}}return b=b||p(ya),(g||h)&&(d=a.clientX+b.x,e=a.clientY+b.y),a.pageOffset=b,a.points=[d,e],a.cursor=g||h,a}function H(a){var b=a-g(ja,c.ort),d=100*b/E();return d=j(d),c.dir?100-d:d}function I(a){var b=100,c=!1;return ka.forEach(function(d,e){if(!d.hasAttribute("disabled")){var f=Math.abs(sa[e]-a);(f<b||100===f&&100===b)&&(c=e,b=f)}}),c}function J(a,b){"mouseout"===a.type&&"HTML"===a.target.nodeName&&null===a.relatedTarget&&L(a,b)}function K(a,b){if(-1===navigator.appVersion.indexOf("MSIE 9")&&0===a.buttons&&0!==b.buttonsProperty)return L(a,b);var d=(c.dir?-1:1)*(a.calcPoint-b.startCalcPoint);W(d>0,100*d/b.baseSize,b.locations,b.handleNumbers)}function L(a,b){b.handle&&(n(b.handle,c.cssClasses.active),ua-=1),b.listeners.forEach(function(a){za.removeEventListener(a[0],a[1])}),0===ua&&(n(ra,c.cssClasses.drag),_(),a.cursor&&(Aa.style.cursor="",Aa.removeEventListener("selectstart",d))),b.handleNumbers.forEach(function(a){S("change",a),S("set",a),S("end",a)})}function M(a,b){var e;if(1===b.handleNumbers.length){var f=ka[b.handleNumbers[0]];if(f.hasAttribute("disabled"))return!1;e=f.children[0],ua+=1,m(e,c.cssClasses.active)}a.stopPropagation();var g=[],h=F(oa.move,za,K,{target:a.target,handle:e,listeners:g,startCalcPoint:a.calcPoint,baseSize:E(),pageOffset:a.pageOffset,handleNumbers:b.handleNumbers,buttonsProperty:a.buttons,locations:sa.slice()}),i=F(oa.end,za,L,{target:a.target,handle:e,listeners:g,doNotReject:!0,handleNumbers:b.handleNumbers}),j=F("mouseout",za,J,{target:a.target,handle:e,listeners:g,doNotReject:!0,handleNumbers:b.handleNumbers});g.push.apply(g,h.concat(i,j)),a.cursor&&(Aa.style.cursor=getComputedStyle(a.target).cursor,ka.length>1&&m(ra,c.cssClasses.drag),Aa.addEventListener("selectstart",d,!1)),b.handleNumbers.forEach(function(a){S("start",a)})}function N(a){a.stopPropagation();var b=H(a.calcPoint),d=I(b);if(!1===d)return!1;c.events.snap||i(ra,c.cssClasses.tap,c.animationDuration),aa(d,b,!0,!0),_(),S("slide",d,!0),S("update",d,!0),S("change",d,!0),S("set",d,!0),c.events.snap&&M(a,{handleNumbers:[d]})}function O(a){var b=H(a.calcPoint),c=va.getStep(b),d=va.fromStepping(c);Object.keys(xa).forEach(function(a){"hover"===a.split(".")[0]&&xa[a].forEach(function(a){a.call(ma,d)})})}function P(a){a.fixed||ka.forEach(function(a,b){F(oa.start,a.children[0],M,{handleNumbers:[b]})}),a.tap&&F(oa.start,ja,N,{}),a.hover&&F(oa.move,ja,O,{hover:!0}),a.drag&&la.forEach(function(b,d){if(!1!==b&&0!==d&&d!==la.length-1){var e=ka[d-1],f=ka[d],g=[b];m(b,c.cssClasses.draggable),a.fixed&&(g.push(e.children[0]),g.push(f.children[0])),g.forEach(function(a){F(oa.start,a,M,{handles:[e,f],handleNumbers:[d-1,d]})})}})}function Q(a,b){xa[a]=xa[a]||[],xa[a].push(b),"update"===a.split(".")[0]&&ka.forEach(function(a,b){S("update",b)})}function R(a){var b=a&&a.split(".")[0],c=b&&a.substring(b.length);Object.keys(xa).forEach(function(a){var d=a.split(".")[0],e=a.substring(d.length);b&&b!==d||c&&c!==e||delete xa[a]})}function S(a,b,d){Object.keys(xa).forEach(function(e){var f=e.split(".")[0];a===f&&xa[e].forEach(function(a){a.call(ma,wa.map(c.format.to),b,wa.slice(),d||!1,sa.slice())})})}function T(a){return a+"%"}function U(a,b,d,e,f,g){return ka.length>1&&(e&&b>0&&(d=Math.max(d,a[b-1]+c.margin)),f&&b<ka.length-1&&(d=Math.min(d,a[b+1]-c.margin))),ka.length>1&&c.limit&&(e&&b>0&&(d=Math.min(d,a[b-1]+c.limit)),f&&b<ka.length-1&&(d=Math.max(d,a[b+1]-c.limit))),c.padding&&(0===b&&(d=Math.max(d,c.padding[0])),b===ka.length-1&&(d=Math.min(d,100-c.padding[1]))),d=va.getStep(d),!((d=j(d))===a[b]&&!g)&&d}function V(a,b){var d=c.ort;return(d?b:a)+", "+(d?a:b)}function W(a,b,c,d){var e=c.slice(),f=[!a,a],g=[a,!a];d=d.slice(),a&&d.reverse(),d.length>1?d.forEach(function(a,c){var d=U(e,a,e[a]+b,f[c],g[c],!1);!1===d?b=0:(b=d-e[a],e[a]=d)}):f=g=[!0];var h=!1;d.forEach(function(a,d){h=aa(a,c[a]+b,f[d],g[d])||h}),h&&d.forEach(function(a){S("update",a),S("slide",a)})}function Y(a,b){return c.dir?100-a-b:a}function Z(a,b){sa[a]=b,wa[a]=va.fromStepping(b);var d="translate("+V(T(Y(b,0)-Ba),"0")+")";ka[a].style[c.transformRule]=d,ba(a),ba(a+1)}function _(){ta.forEach(function(a){var b=sa[a]>50?-1:1,c=3+(ka.length+b*a);ka[a].style.zIndex=c})}function aa(a,b,c,d){return!1!==(b=U(sa,a,b,c,d,!1))&&(Z(a,b),!0)}function ba(a){if(la[a]){var b=0,d=100;0!==a&&(b=sa[a-1]),a!==la.length-1&&(d=sa[a]);var e=d-b,f="translate("+V(T(Y(b,e)),"0")+")",g="scale("+V(e/100,"1")+")";la[a].style[c.transformRule]=f+" "+g}}function ca(a,b){return null===a||!1===a||void 0===a?sa[b]:("number"==typeof a&&(a=String(a)),a=c.format.from(a),a=va.toStepping(a),!1===a||isNaN(a)?sa[b]:a)}function da(a,b){var d=k(a),e=void 0===sa[0];b=void 0===b||!!b,c.animate&&!e&&i(ra,c.cssClasses.tap,c.animationDuration),ta.forEach(function(a){aa(a,ca(d[a],a),!0,!1)}),ta.forEach(function(a){aa(a,sa[a],!0,!0)}),_(),ta.forEach(function(a){S("update",a),null!==d[a]&&b&&S("set",a)})}function ea(a){da(c.start,a)}function fa(){var a=wa.map(c.format.to);return 1===a.length?a[0]:a}function ga(){for(var a in c.cssClasses)c.cssClasses.hasOwnProperty(a)&&n(ra,c.cssClasses[a]);for(;ra.firstChild;)ra.removeChild(ra.firstChild);delete ra.noUiSlider}function ha(){return sa.map(function(a,b){var c=va.getNearbySteps(a),d=wa[b],e=c.thisStep.step,f=null;!1!==e&&d+e>c.stepAfter.startValue&&(e=c.stepAfter.startValue-d),f=d>c.thisStep.startValue?c.thisStep.step:!1!==c.stepBefore.step&&d-c.stepBefore.highestStep,100===a?e=null:0===a&&(f=null);var g=va.countStepDecimals();return null!==e&&!1!==e&&(e=Number(e.toFixed(g))),null!==f&&!1!==f&&(f=Number(f.toFixed(g))),[f,e]})}function ia(a,b){var d=fa(),e=["margin","limit","padding","range","animate","snap","step","format"];e.forEach(function(b){void 0!==a[b]&&(f[b]=a[b])});var g=X(f);e.forEach(function(b){void 0!==a[b]&&(c[b]=g[b])}),va=g.spectrum,c.margin=g.margin,c.limit=g.limit,c.padding=g.padding,c.pips&&D(c.pips),sa=[],da(a.start||d,b)}var ja,ka,la,ma,na,oa=q(),pa=s(),qa=pa&&r(),ra=a,sa=[],ta=[],ua=0,va=c.spectrum,wa=[],xa={},ya=a.ownerDocument,za=ya.documentElement,Aa=ya.body,Ba="rtl"===ya.dir||1===c.ort?0:100;return v(ra),u(c.connect,ja),P(c.events),da(c.start),ma={destroy:ga,steps:ha,on:Q,off:R,get:fa,set:da,reset:ea,__moveHandles:function(a,b,c){W(a,b,sa,c)},options:f,updateOptions:ia,target:ra,removePips:C,pips:D},c.pips&&D(c.pips),c.tooltips&&x(),y(),ma}function Z(a,b){if(!a||!a.nodeName)throw new Error("noUiSlider ("+$+"): create requires a single element, got: "+a);if(a.noUiSlider)throw new Error("noUiSlider ("+$+"): Slider was already initialized.");var c=X(b,a),d=Y(a,c,b);return a.noUiSlider=d,d}var $="11.1.0";D.prototype.getMargin=function(a){var b=this.xNumSteps[0];if(b&&a/b%1!=0)throw new Error("noUiSlider ("+$+"): 'limit', 'margin' and 'padding' must be divisible by step.");return 2===this.xPct.length&&u(this.xVal,a)},D.prototype.toStepping=function(a){return a=y(this.xVal,this.xPct,a)},D.prototype.fromStepping=function(a){return z(this.xVal,this.xPct,a)},D.prototype.getStep=function(a){return a=A(this.xPct,this.xSteps,this.snap,a)},D.prototype.getNearbySteps=function(a){var b=x(a,this.xPct);return{stepBefore:{startValue:this.xVal[b-2],step:this.xNumSteps[b-2],highestStep:this.xHighestCompleteStep[b-2]},thisStep:{startValue:this.xVal[b-1],step:this.xNumSteps[b-1],highestStep:this.xHighestCompleteStep[b-1]},stepAfter:{startValue:this.xVal[b-0],step:this.xNumSteps[b-0],highestStep:this.xHighestCompleteStep[b-0]}}},D.prototype.countStepDecimals=function(){var a=this.xNumSteps.map(l);return Math.max.apply(null,a)},D.prototype.convert=function(a){return this.getStep(this.toStepping(a))};var _={to:function(a){return void 0!==a&&a.toFixed(2)},from:Number};return{version:$,create:Z}});
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9uZVBvaW50LmpzIiwiVGhyZWVQb2ludHMuanMiLCJUd29Qb2ludHMuanMiLCJBbGxNZXNoZXMuanMiLCJBbGxQb2ludHMuanMiLCJDb21iaW5hdGlvbnMuanMiLCJDeWxpbmRlckZyb21QdHMuanMiLCJHbG9iYWxMaWdodHMuanMiLCJLZXlGcm9tUHRzQXJyYXkuanMiLCJNYXRlcmlhbHMuanMiLCJNZXNoRnJvbVB0c0FycmF5LmpzIiwiUG9seVNwaGVyZS5qcy5vbGQiLCJUZXh0U3ByaXRlLmpzIiwiVHJhbnNwTWVzaEdycC5qcy5vbGQiLCJtaWRpLXBhcnNlci5qcyIsIk1pZGlUb0Nob3JkTWFwLmpzIiwiY2hvcmQuanMiLCJub3RlLmpzIiwibm91aXNsaWRlci5qcyIsIm5vdWlzbGlkZXIubWluLmpzIiwicmVuZGVyLmpzIiwiU2xpZGVyLmpzIiwid051bWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMXlFQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENyZWF0ZXMgYSBzcGhlcmUgZnJvbSBvbmUgdmVjdG9yM1xyXG5mdW5jdGlvbiBPbmVQb2ludChwb2ludCwgc2NhbGUpIHtcclxuXHRsZXQgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcdFx0Ly8gY3JlYXRlcyB0aGUgZ3JvdXAgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIG1lc2ggYW5kIHRoZSBub3RlIGxhYmVsXHJcblx0bGV0IHNwaGVyZSA9IG5ldyBUSFJFRS5TcGhlcmVCdWZmZXJHZW9tZXRyeSgyLDUwLDUwKTtcclxuXHRsZXQgc3BoZXJlTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHNwaGVyZSwgUkdCTWF0ZXJpYWwpO1xyXG5cdGxldCBsYWJlbCA9IG5ldyBUZXh0U3ByaXRlKHBvaW50LCBzY2FsZSk7XHRcdC8vIGNyZWF0ZXMgdGhlIGxhYmVsXHJcblxyXG5cdHNwaGVyZU1lc2gucG9zaXRpb24uY29weShwb2ludC5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKSk7XHJcblxyXG5cdGdyb3VwLmFkZChzcGhlcmVNZXNoKTtcclxuXHRncm91cC5hZGQobGFiZWwpO1xyXG5cclxuXHRyZXR1cm4gZ3JvdXA7XHJcbn0iLCJmdW5jdGlvbiBUaHJlZVBvaW50cyhwb2ludHMsIHNjYWxlKSB7XHJcblx0dGhpcy5ncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cdGxldCBtZXNoO1xyXG5cdGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xyXG5cdGxldCBwb3NpdGlvbnMgPSBbXTtcclxuXHRsZXQgbm9ybWFscyA9IFtdO1xyXG5cdGxldCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCgge1xyXG5cdFx0b3BhY2l0eTogMC4yLFxyXG5cdFx0dHJhbnNwYXJlbnQ6IHRydWUsXHJcblx0XHRkZXB0aFdyaXRlOiBmYWxzZSxcclxuXHRcdHNpZGU6IFRIUkVFLkRvdWJsZVNpZGVcclxuXHR9ICk7XHJcblx0XHJcblx0Zm9yKGxldCBwb2ludCBvZiBwb2ludHMpIHtcclxuXHRcdHBvc2l0aW9ucy5wdXNoKHBvaW50LmNsb25lKCkueCk7XHJcblx0XHRwb3NpdGlvbnMucHVzaChwb2ludC5jbG9uZSgpLnkpO1xyXG5cdFx0cG9zaXRpb25zLnB1c2gocG9pbnQuY2xvbmUoKS56KTtcclxuXHRcdG5vcm1hbHMucHVzaCgxLDEsMSk7XHJcblx0fVxyXG5cclxuXHRnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICdwb3NpdGlvbicsIG5ldyBUSFJFRS5GbG9hdDMyQnVmZmVyQXR0cmlidXRlKCBwb3NpdGlvbnMsIDMgKSApO1xyXG5cdGdlb21ldHJ5LnNjYWxlKHNjYWxlLCBzY2FsZSwgc2NhbGUpO1xyXG5cclxuXHRtZXNoID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbC5jbG9uZSgpICk7XHJcblx0dGhpcy5ncm91cC5hZGQoIG1lc2ggKTtcclxuXHJcblx0cmV0dXJuIHRoaXMuZ3JvdXA7XHJcbn0iLCJmdW5jdGlvbiBUd29Qb2ludHMocG9pbnQxLCBwb2ludDIsIHNjYWxlKSB7XHJcblx0bGV0IHYxID0gcG9pbnQxLmNsb25lKCkubXVsdGlwbHlTY2FsYXIoc2NhbGUpO1xyXG5cdGxldCB2MiA9IHBvaW50Mi5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKTtcclxuXHRsZXQgY3lsaW5kZXJNZXNoID0gbmV3IEN5bGluZGVyRnJvbVB0cyh2MSwgdjIpO1xyXG5cdFxyXG5cdHRoaXMuZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHR0aGlzLmdyb3VwLmFkZChjeWxpbmRlck1lc2gpO1xyXG5cclxuXHRyZXR1cm4gdGhpcy5ncm91cDtcclxufSIsIi8vIENyZWF0ZXMgYWxsIG1lc2hlcyBhbmQgaGlkZXMgdGhlbSB0byBzaG93IHRoZW0gd2hlbiBuZWVkZWQuIFRoaXMgd2lsbCBjcmVhdGUgYSBncm91cCBvZiBtZXNoZXMgY29udGFpbmluZyBhbGwgc3BoZXJlcyxcclxuLy8gYWxsIGN5bGluZGVycyBhbmQgYWxsIHRyaWFuZ3VsYXIgZmFjZXNcclxuZnVuY3Rpb24gQWxsTWVzaGVzKGdpdmVuU2NhbGUpIHtcclxuXHR0aGlzLm1lc2hCeUlkID0gbmV3IE1hcCgpO1xyXG5cdHRoaXMubGFiZWxzID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblx0dGhpcy5tZXNoR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcblx0bGV0IHNjYWxlID0gZ2l2ZW5TY2FsZTtcclxuXHJcblx0Ly8gdGhpcyBpbnRlcm5hbCBmdW5jdGlvbiB3aWxsIGNyZWF0ZSBhbGwgcG9zc2libGUgbWVzaGVzIGZyb20gdGhlIG51bWJlciBvZiBwb2ludHMgaXQgaXMgbWFkZSBvZiwgdXNpbmcgdGhlIGFsbFBvaW50cyBhcnJheVxyXG5cdC8vIGFzIGEgcmVmZXJlbmNlIGZvciBwb3NpdGlvbm5pbmcgYW5kIGNyZWF0aW5nIHRob3NlIG1lc2hlc1xyXG5cdC8vIGZvciBleGFtcGxlLCBpZiB3ZSB3YW50IG1lc2hlcyB3aXRoIG9ubHkgb25lIHBvaW50LCBpdCB3aWxsIGNyZWF0ZXMgYSBzcGhlcmUgZm9yIGVhY2ggcG9pbnQgaW4gYWxsUG9pbnRzIGFycmF5XHJcblx0ZnVuY3Rpb24gZnJvbVB0c051bWJlcihudW1iZXIpIHtcclxuXHRcdGNvbnN0IGdlbiA9IHN1YnNldHMoYWxsUG9pbnRzLCBudW1iZXIpO1x0XHRcdFx0XHQvLyBjcmVhdGVzIGEgZ2VuZXJhdG9yIGZvciBldmVyeSBzdWJzZXQgb2Ygc2l6ZSAnbnVtYmVyJyBvZiBhbGxQb2ludHMgYXJyYXlcclxuXHRcdFxyXG5cdFx0Zm9yKGxldCBzdWJzZXQgb2YgZ2VuKSB7XHRcdFx0XHRcdFx0XHRcdC8vIGl0ZXJhdGUgdGhyb3VnaCB0aGUgZ2VuZXJhdG9yXHJcblx0XHRcdGxldCBzdWJBcnJheSA9IEFycmF5LmZyb20oc3Vic2V0KTsgXHRcdFx0XHRcdC8vIGNyZWF0ZXMgYW4gYXJyYXkgZnJvbSB0aGUgaXRlcmF0b3JcclxuXHRcdFx0bGV0IGtleSA9IEtleUZyb21QdHNBcnJheShzdWJBcnJheSwgYWxsUG9pbnRzKTtcdFx0Ly8gY3JlYXRlcyBhIHVuaXF1ZSBrZXkgYmFzZWQgb24gdGhlIG5vdGVzIGluIHRoZSBhcnJheVxyXG5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRsZXQgbWVzaCA9IG5ldyBNZXNoRnJvbVB0c0FycmF5KHN1YkFycmF5LCBzY2FsZSk7XHJcblx0XHRcdFx0bWVzaC52aXNpYmxlID0gZmFsc2U7XHRcdFx0XHRcdFx0XHQvLyBoaWRlcyB0aGUgbWVzaCBcclxuXHJcblx0XHRcdFx0dGhpcy5tZXNoQnlJZC5zZXQoa2V5LCBtZXNoKTtcclxuXHJcblx0XHRcdFx0dGhpcy5tZXNoR3JvdXAuYWRkKG1lc2gpO1xyXG5cdFx0XHR9IGNhdGNoKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZyb21QdHNOdW1iZXIuY2FsbCh0aGlzLDEpO1xyXG5cdGZyb21QdHNOdW1iZXIuY2FsbCh0aGlzLDIpO1xyXG5cdGZyb21QdHNOdW1iZXIuY2FsbCh0aGlzLDMpO1xyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgc2hvdyB0aGUgbWVzaGVzIHRoYXQgbWF0Y2ggdGhlIGdpdmVuIGFycmF5IG9mIG5vdGVzXHJcbkFsbE1lc2hlcy5wcm90b3R5cGUuc2hvd0Zyb21QdHNBcnJheSA9IGZ1bmN0aW9uKHB0c0FycmF5LCB2YWx1ZSkge1xyXG5cdGxldCBtYXhJdGVyID0gcHRzQXJyYXkubGVuZ3RoICUgNDtcclxuXHJcblx0Zm9yKGxldCBpPTE7IGk8PW1heEl0ZXI7IGkrKyl7XHJcblx0XHRsZXQgZ2VuID0gc3Vic2V0cyhwdHNBcnJheSwgaSk7XHJcblxyXG5cdFx0Zm9yKGxldCBzdWIgb2YgZ2VuKSB7XHJcblx0XHRcdGxldCBzdWJBcnJheSA9IEFycmF5LmZyb20oc3ViKSxcclxuXHRcdFx0XHRrZXkgPSBrZXlGcm9tUHRBcnJheShzdWJBcnJheSk7XHJcblxyXG5cdFx0XHRpZih0aGlzLm1lc2hCeUlkLmhhcyhrZXkpKSB7XHJcblx0XHRcdFx0dGhpcy5tZXNoQnlJZC5nZXQoa2V5KS52aXNpYmxlID0gdmFsdWU7XHRcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuQWxsTWVzaGVzLnByb3RvdHlwZS5zaG93RnJvbUtleSA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuXHRpZih0aGlzLm1lc2hCeUlkLmhhcyhrZXkpKVxyXG5cdFx0dGhpcy5tZXNoQnlJZC5nZXQoa2V5KS52aXNpYmxlID0gdmFsdWU7XHJcbn0iLCJjb25zdCBhbGxQb2ludHMgPSBbXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoLTAuNzU5NjYwNjkzMDQ3LCAwLjYwNDI5MjcwNDA3OSwgLTAuMjQwMzAzODg5MzUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjQ4NDI2Njg0ODc3NywgLTAuMjA2Nzc3MDQ3MTE5LCAtMC44NTAxMzQ2MTk5MDQpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKC0wLjkyMDIzNzkxODExNCwgLTAuMzgwNjkzMzkxODE2LCAwLjA5MDc0NTMzMzE3OTQpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuNDg0MjYyODA1MDkzLCAwLjIwNjc3OTk3NTk2OCwgMC44NTAxMzYyMTA5MzUpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuMTUxNDUxNjE5ODgsIDAuNjI2MzY4MzE2MDczLCAtMC43NjQ2NzMyMjM5NjkpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuOTIwMjM5NzgyOTIyLCAwLjM4MDY4OTYwNjIyOSwgLTAuMDkwNzQyMzAzNDU0NSksXHJcblx0bmV3IFRIUkVFLlZlY3RvcjMoMC41NTM5Njk1NjEwMDUsIC0wLjM0NDk3MTA0NTU1NiwgLTAuNzU3NzAyMjUyMzQ1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC4xMDgzNjk2MTk5ODUsIC0wLjk2NzM2ODg1NTIyNywgLTAuMjI5MDI3MzQyMDM3KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC4xNTE0NTAwNjg5NzQsIC0wLjYyNjM2OTQyMDkyNywgMC43NjQ2NzI2MjYxMTkpLFxyXG5cdG5ldyBUSFJFRS5WZWN0b3IzKDAuNzU5NjU5OTAwOTcxLCAtMC42MDQyOTI5ODczMzMsIDAuMjQwMzA1NjgwOTkxKSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygwLjEwODM3MTgwNTk2NCwgMC45NjczNjk3MDM4NjIsIDAuMjI5MDIyNzIzMTU1KSxcclxuXHRuZXcgVEhSRUUuVmVjdG9yMygtMC41NTM5NzAzMjY5MzgsIDAuMzQ0OTcyNDQxNzY3LCAwLjc1NzcwMTA1NjY4KVxyXG5dO1xyXG5cclxuLypcclxudmFyIGFsbFBvaW50cyA9IFtcclxuXHRbLTAuNzU5NjYwNjkzMDQ3LCAwLjYwNDI5MjcwNDA3OSwgLTAuMjQwMzAzODg5MzVdLFxyXG5cdFstMC40ODQyNjY4NDg3NzcsIC0wLjIwNjc3NzA0NzExOSwgLTAuODUwMTM0NjE5OTA0XSxcclxuXHRbLTAuOTIwMjM3OTE4MTE0LCAtMC4zODA2OTMzOTE4MTYsIDAuMDkwNzQ1MzMzMTc5NF0sXHJcblx0WzAuNDg0MjYyODA1MDkzLCAwLjIwNjc3OTk3NTk2OCwgMC44NTAxMzYyMTA5MzVdLFxyXG5cdFswLjE1MTQ1MTYxOTg4LCAwLjYyNjM2ODMxNjA3MywgLTAuNzY0NjczMjIzOTY5XSxcclxuXHRbMC45MjAyMzk3ODI5MjIsIDAuMzgwNjg5NjA2MjI5LCAtMC4wOTA3NDIzMDM0NTQ1XSxcclxuXHRbMC41NTM5Njk1NjEwMDUsIC0wLjM0NDk3MTA0NTU1NiwgLTAuNzU3NzAyMjUyMzQ1XSxcclxuXHRbLTAuMTA4MzY5NjE5OTg1LCAtMC45NjczNjg4NTUyMjcsIC0wLjIyOTAyNzM0MjAzN10sXHJcblx0Wy0wLjE1MTQ1MDA2ODk3NCwgLTAuNjI2MzY5NDIwOTI3LCAwLjc2NDY3MjYyNjExOV0sXHJcblx0WzAuNzU5NjU5OTAwOTcxLCAtMC42MDQyOTI5ODczMzMsIDAuMjQwMzA1NjgwOTkxXSxcclxuXHRbMC4xMDgzNzE4MDU5NjQsIDAuOTY3MzY5NzAzODYyLCAwLjIyOTAyMjcyMzE1NV0sXHJcblx0Wy0wLjU1Mzk3MDMyNjkzOCwgMC4zNDQ5NzI0NDE3NjcsIDAuNzU3NzAxMDU2NjhdXHJcbl07XHJcbiovIiwiZnVuY3Rpb24qIHN1YnNldHMoYXJyYXksIGxlbmd0aCwgc3RhcnQgPSAwKSB7XHJcbiAgaWYgKHN0YXJ0ID49IGFycmF5Lmxlbmd0aCB8fCBsZW5ndGggPCAxKSB7XHJcbiAgICB5aWVsZCBuZXcgU2V0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdoaWxlIChzdGFydCA8PSBhcnJheS5sZW5ndGggLSBsZW5ndGgpIHtcclxuICAgICAgbGV0IGZpcnN0ID0gYXJyYXlbc3RhcnRdO1xyXG4gICAgICBmb3IgKHN1YnNldCBvZiBzdWJzZXRzKGFycmF5LCBsZW5ndGggLSAxLCBzdGFydCArIDEpKSB7XHJcbiAgICAgICAgc3Vic2V0LmFkZChmaXJzdCk7XHJcbiAgICAgICAgeWllbGQgc3Vic2V0O1xyXG4gICAgICB9XHJcbiAgICAgICsrc3RhcnQ7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy9DcmVhdGVzIGEgY3lsaW5kZXIgYmV0d2VlbiB0aGUgdHdvIGdpdmVuIHZlY3RvcjNcclxuZnVuY3Rpb24gQ3lsaW5kZXJGcm9tUHRzKHYxLCB2Mikge1xyXG5cdGxldCBjeWxpbmRlciA9IG5ldyBUSFJFRS5DeWxpbmRlckJ1ZmZlckdlb21ldHJ5KDAuNCwgMC40LCB2MS5kaXN0YW5jZVRvKHYyKSwgMTAsIDAuNSwgdHJ1ZSk7XHJcblx0bGV0IGN5bGluZGVyTWVzaCA9IG5ldyBUSFJFRS5NZXNoKGN5bGluZGVyLCBSR0JNYXRlcmlhbCk7XHJcblx0bGV0IHEgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cclxuXHRjeWxpbmRlck1lc2gucG9zaXRpb24uY29weSh2MS5jbG9uZSgpLmxlcnAodjIsIC41KSk7XHQvL21vdmVzIHRoZSBtZXNoIHRvIHRoZSBtaWRkbGUgb2YgdGhlIHR3byBwb2ludHNcclxuXHRcclxuXHRxLnNldEZyb21Vbml0VmVjdG9ycyhuZXcgVEhSRUUuVmVjdG9yMygwLDEsMCksIG5ldyBUSFJFRS5WZWN0b3IzKCkuc3ViVmVjdG9ycyh2MSwgdjIpLm5vcm1hbGl6ZSgpKTtcdFx0Ly91c2VzIHRoZSB0d28gdmVjdG9ycyB0byBzZXQgdGhlIHF1YXRlcm5pb25cclxuXHRjeWxpbmRlck1lc2guc2V0Um90YXRpb25Gcm9tUXVhdGVybmlvbihxKTtcdFx0Ly8gdXNlcyB0aGUgcXVhdGVybmlvbiB0byByb3RhdGUgdGhlIG1lc2hcclxuXHRcclxuXHRyZXR1cm4gY3lsaW5kZXJNZXNoO1xyXG59IiwiLy8gQ3JlYXRlcyBhbGwgdGhlIGdsb2JhbCBsaWdodHMgc3Vyb3VuZGluZyBvdXIgbWVzaGVzXHJcbmZ1bmN0aW9uIEdsb2JhbExpZ2h0cyhkaXN0RnJvbU1pZCkge1xyXG5cdGNvbnN0IGRpc3RhbmNlID0gZGlzdEZyb21NaWQ7XHJcblx0Y29uc3QgbGlnaHRzR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcblx0Ly90b3AgbGlnaHRzXHJcblx0bGV0IHBvaW50TGlnaHQxID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhmZjAwMDAsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodDEucG9zaXRpb24uc2V0KGRpc3RhbmNlLCBkaXN0YW5jZSwgZGlzdGFuY2UpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChwb2ludExpZ2h0MSk7XHJcblxyXG5cdC8qbGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQxLCAxKTtcclxuXHRsaWdodHNHcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHRsZXQgcG9pbnRMaWdodDIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDAwZmYwMCwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0Mi5wb3NpdGlvbi5zZXQoZGlzdGFuY2UsIGRpc3RhbmNlLCAtZGlzdGFuY2UpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChwb2ludExpZ2h0Mik7XHJcblxyXG5cdC8qbGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQyLCAxKTtcclxuXHRsaWdodHNHcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHRsZXQgcG9pbnRMaWdodDMgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweGZmZmYwMCwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0My5wb3NpdGlvbi5zZXQoLWRpc3RhbmNlLCBkaXN0YW5jZSwgZGlzdGFuY2UpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChwb2ludExpZ2h0Myk7XHJcblxyXG5cdC8qbGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQzLCAxKTtcclxuXHRsaWdodHNHcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHRsZXQgcG9pbnRMaWdodDQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDAwMDBmZiwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0NC5wb3NpdGlvbi5zZXQoLWRpc3RhbmNlLCBkaXN0YW5jZSwgLWRpc3RhbmNlKTtcclxuXHRsaWdodHNHcm91cC5hZGQocG9pbnRMaWdodDQpO1xyXG5cclxuXHQvKmxldCBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0NCwgMSk7XHJcblx0bGlnaHRzR3JvdXAuYWRkKGhlbHBlcik7Ki9cclxuXHJcblxyXG5cdC8vYm90dG9tIGxpZ2h0c1xyXG5cdGxldCBwb2ludExpZ2h0NSA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4MDBmZmZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQ1LnBvc2l0aW9uLnNldChkaXN0YW5jZSwgLWRpc3RhbmNlLCBkaXN0YW5jZSk7XHJcblx0bGlnaHRzR3JvdXAuYWRkKHBvaW50TGlnaHQ1KTtcclxuXHJcblx0LypsZXQgaGVscGVyID0gbmV3IFRIUkVFLlBvaW50TGlnaHRIZWxwZXIocG9pbnRMaWdodDUsIDEpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChoZWxwZXIpOyovXHJcblxyXG5cdGxldCBwb2ludExpZ2h0NiA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4ZmYwMGZmLCAxLCAxMDApO1xyXG5cdHBvaW50TGlnaHQ2LnBvc2l0aW9uLnNldChkaXN0YW5jZSwgLWRpc3RhbmNlLCAtZGlzdGFuY2UpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChwb2ludExpZ2h0Nik7XHJcblxyXG5cdC8qbGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQ2LCAxKTtcclxuXHRsaWdodHNHcm91cC5hZGQoaGVscGVyKTtcclxuKi9cclxuXHRsZXQgcG9pbnRMaWdodDcgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweGZmODg4OCwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0Ny5wb3NpdGlvbi5zZXQoLWRpc3RhbmNlLCAtZGlzdGFuY2UsIGRpc3RhbmNlKTtcclxuXHRsaWdodHNHcm91cC5hZGQocG9pbnRMaWdodDcpO1xyXG5cclxuXHQvKmxldCBoZWxwZXIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodEhlbHBlcihwb2ludExpZ2h0NywgMSk7XHJcblx0bGlnaHRzR3JvdXAuYWRkKGhlbHBlcik7Ki9cclxuXHJcblx0bGV0IHBvaW50TGlnaHQ4ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHg4ODg4ZmYsIDEsIDEwMCk7XHJcblx0cG9pbnRMaWdodDgucG9zaXRpb24uc2V0KC1kaXN0YW5jZSwgLWRpc3RhbmNlLCAtZGlzdGFuY2UpO1xyXG5cdGxpZ2h0c0dyb3VwLmFkZChwb2ludExpZ2h0OCk7XHJcblxyXG5cdC8qbGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQ4LCAxKTtcclxuXHRsaWdodHNHcm91cC5hZGQoaGVscGVyKTsqL1xyXG5cclxuXHJcblxyXG5cdC8vbWlkZGxlIGxpZ2h0XHJcblx0LypsZXQgcG9pbnRMaWdodDkgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweGZmZmZmZiwgMSwgMTAwKTtcclxuXHRwb2ludExpZ2h0OS5wb3NpdGlvbi5zZXQoeCwgeSwgeik7XHJcblx0bGlnaHRzR3JvdXAuYWRkKHBvaW50TGlnaHQ5KTtcclxuXHJcblx0bGV0IGhlbHBlciA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0SGVscGVyKHBvaW50TGlnaHQ5LCAxKTtcclxuXHRncm91cC5hZGQoaGVscGVyKTsqL1xyXG5cdHJldHVybiBsaWdodHNHcm91cDtcclxufSIsImZ1bmN0aW9uIEtleUZyb21QdHNBcnJheShhcnJheSwgaW5kZXhlcikge1xyXG5cdGxldCBrZXkgPSAnJztcclxuXHRsZXQgaW5kZXg7XHJcblx0bGV0IHNvcnRlZDtcclxuXHRsZXQgaXNJbmRleGVkID0gKGluZGV4ZXIgIT0gbnVsbCk7XHJcblxyXG5cdGlmKGlzSW5kZXhlZCkge1xyXG5cdFx0c29ydGVkID0gYXJyYXkuc29ydCgoYSwgYikgPT4gaW5kZXhlci5pbmRleE9mKGEpIC0gaW5kZXhlci5pbmRleE9mKGIpKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c29ydGVkID0gYXJyYXkuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG5cdH1cclxuXHJcblx0Zm9yKGxldCBwb2ludCBvZiBzb3J0ZWQpIHtcclxuXHRcdGlmKGlzSW5kZXhlZClcclxuXHRcdFx0aW5kZXggPSBpbmRleGVyLmluZGV4T2YocG9pbnQpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpbmRleCA9IHBvaW50O1xyXG5cclxuXHRcdGtleSArPSAnLicrU3RyaW5nKGluZGV4KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBrZXk7XHJcbn0iLCJjb25zdCB0cmFuc3BhcmVudE1hdGVyaWFsRnJvbnQgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCgge1xyXG5cdGNvbG9yOiAweGZmZmZmZixcclxuXHRvcGFjaXR5OiAwLjQsXHJcblx0dHJhbnNwYXJlbnQ6IHRydWUsXHJcblx0c2lkZTogVEhSRUUuRG91YmxlU2lkZVxyXG59ICk7XHJcblxyXG5jb25zdCB0cmFuc3BhcmVudE1hdGVyaWFsQmFjayA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKCB7XHJcblx0Y29sb3I6IDB4ZmZmZmZmLFxyXG5cdG9wYWNpdHk6IDAuNCxcclxuXHR0cmFuc3BhcmVudDogdHJ1ZVxyXG59ICk7XHJcblxyXG5jb25zdCBwb2ludHNNYXRlcmlhbCA9IG5ldyBUSFJFRS5Qb2ludHNNYXRlcmlhbCgge1xyXG5cdGNvbG9yOiAweDAwODBmZixcclxuXHRzaXplOiAxLFxyXG5cdGFscGhhVGVzdDogMC41XHJcbn0gKTtcclxuXHJcbmNvbnN0IFJHQk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hOb3JtYWxNYXRlcmlhbCgge1xyXG5cdGNvbG9yOiAweDAwODhmZixcclxuXHRzaWRlOiBUSFJFRS5Eb3VibGVTaWRlXHJcbn0pO1xyXG5cclxuY29uc3QgU1RETWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoIHtcclxuXHRjb2xvcjogMHgwMDg4ZmZcclxufSk7XHJcblxyXG5jb25zdCBmbGF0U2hhcGVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgge1xyXG5cdHNpZGUgOiBUSFJFRS5Eb3VibGVTaWRlLFxyXG5cdHRyYW5zcGFyZW50IDogdHJ1ZSxcclxuXHRvcGFjaXR5OiAwLjVcclxufSk7IiwiLy9cdGNyZWF0ZXMgYSBtZXNoIGZyb20gYW4gYXJyYXkgb2YgcG9pbnRzIChjdXJyZW50bHkgbWF4aW11bSAzIGJlY2F1c2Ugd2UgbmVlZCB0cmlhbmd1bGFyIGZhY2VzIGF0IG1vc3QpXHJcbmZ1bmN0aW9uIE1lc2hGcm9tUHRzQXJyYXkocHRzQXJyYXksIHNjYWxlKSB7XHJcblx0bGV0IGxlbiA9IHB0c0FycmF5Lmxlbmd0aDtcclxuXHRcclxuXHRzd2l0Y2gobGVuKSB7XHJcblx0XHRjYXNlIDE6XHJcblx0XHRcdHJldHVybiBuZXcgT25lUG9pbnQocHRzQXJyYXlbMF0sIHNjYWxlKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIDI6XHJcblx0XHRcdHJldHVybiBuZXcgVHdvUG9pbnRzKHB0c0FycmF5WzBdLCBwdHNBcnJheVsxXSwgc2NhbGUpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgMzpcclxuXHRcdFx0cmV0dXJuIG5ldyBUaHJlZVBvaW50cyhwdHNBcnJheSwgc2NhbGUpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdHRocm93IFwiQ2FuJ3QgY3JlYXRlIG1lc2ggZm9yIHNvIG11Y2ggcG9pbnRzXCI7IC8vIHRocm93IGFuIGVycm9yIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCBtZXNoZXMgd2l0aCBtb3JlIHRoYW4gMyB2ZWN0b3JzXHJcblx0XHRcdGJyZWFrO1xyXG5cdH1cclxufSIsIi8vIC8vY3JlYXRlcyBzcGhlcmVzIGZvciBlYWNoIHZlcnRleCBvZiB0aGUgZ2VvbWV0cnlcclxuLy8gdmFyIHNwaGVyZSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgyLDUwLDUwKTtcclxuLy8gdmFyIHNwaGVyZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChzcGhlcmUsIFJHQk1hdGVyaWFsKTtcclxuXHJcbi8vIGZ1bmN0aW9uIFBvbHlTcGhlcmVzKGdlb21ldHJ5KSB7XHJcbi8vIFx0dGhpcy5ncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4vLyBcdHZhciBtZXNoID0gc3BoZXJlTWVzaC5jbG9uZSgpO1xyXG4vLyBcdGZvcih2YXIgaT0wOyBpPGdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbi8vIFx0XHRzcGhlcmVNZXNoLnBvc2l0aW9uLmNvcHkoZ2VvbWV0cnkudmVydGljZXNbaV0pO1xyXG4vLyBcdFx0dGhpcy5ncm91cC5hZGQoc3BoZXJlTWVzaC5jbG9uZSgpKTtcclxuLy8gXHR9XHJcblxyXG4vLyBcdHJldHVybiB0aGlzLmdyb3VwO1xyXG4vLyB9XHJcblxyXG4vLyBmdW5jdGlvbiBQb2x5U3BoZXJlc0Zyb21Ob3Rlcyhub3Rlcykge1xyXG4vLyBcdHZhciBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4vLyBcdGZvcih2YXIgaSBpbiBub3Rlcykge1xyXG4vLyBcdFx0Z3JvdXAuYWRkKHNwaGVyZXMuZ2V0T2JqZWN0QnlJZChub3Rlc1tpXSkuY2xvbmUoKSk7XHJcbi8vIFx0fVxyXG4vLyBcdC8qY29uc29sZS5sb2coZ3JvdXApOyovXHJcblxyXG4vLyBcdHJldHVybiBncm91cDtcclxuLy8gfSIsIi8vIENyZWF0ZXMgYSBzcHJpdGUgdG8gZGlzcGxheSBub3RlIG5hbWVcclxuZnVuY3Rpb24gVGV4dFNwcml0ZSggcG9pbnQsIHNjYWxlIClcclxue1xyXG5cdGxldCBtYXAsIHNwcml0ZSwgbWF0ZXJpYWw7XHJcblx0bGV0IHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xyXG5cdGxldCBub3RlID0gYWxsUG9pbnRzLmluZGV4T2YocG9pbnQpO1xyXG5cclxuXHQvLyBsb2FkcyB0aGUgaW1hZ2UgZGVwZW5kaW5nIG9uIHRoZSBub3RlIG51bWJlclxyXG5cdHN3aXRjaChub3RlKSB7XHJcblx0XHRjYXNlIDA6IG1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCgnanMvc3ByaXRlcy9DLnBuZycpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAxOiBtYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ2pzL3Nwcml0ZXMvQ1MucG5nJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIDI6IG1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCgnanMvc3ByaXRlcy9ELnBuZycpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAzOiBtYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ2pzL3Nwcml0ZXMvRFMucG5nJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIDQ6IG1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCgnanMvc3ByaXRlcy9FLnBuZycpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSA1OiBtYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ2pzL3Nwcml0ZXMvRi5wbmcnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdGNhc2UgNjogbWFwID0gdGV4dHVyZUxvYWRlci5sb2FkKCdqcy9zcHJpdGVzL0ZTLnBuZycpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSA3OiBtYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ2pzL3Nwcml0ZXMvRy5wbmcnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdGNhc2UgODogbWFwID0gdGV4dHVyZUxvYWRlci5sb2FkKCdqcy9zcHJpdGVzL0dTLnBuZycpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSA5OiBtYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ2pzL3Nwcml0ZXMvQS5wbmcnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdGNhc2UgMTA6IG1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCgnanMvc3ByaXRlcy9BUy5wbmcnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdGNhc2UgMTE6IG1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCgnanMvc3ByaXRlcy9CLnBuZycpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdH1cclxuXHJcblx0bWF0ZXJpYWwgPSBuZXcgVEhSRUUuU3ByaXRlTWF0ZXJpYWwoIHsgbWFwOiBtYXAsIGNvbG9yOiAweGZmZmZmZiB9KTtcdC8vIGNyZWF0ZXMgYSBtYXRlcmlhbCBhbmQgbWFwcyB0aGUgaW1hZ2UgdG8gaXRcclxuXHJcblx0c3ByaXRlID0gbmV3IFRIUkVFLlNwcml0ZShtYXRlcmlhbCk7XHQvL2NyZWF0ZXMgdGhlIHNwcml0ZSBmcm9tIHRoZSBtYXRlcmlhbFxyXG5cclxuXHRzcHJpdGUucG9zaXRpb24uY29weShwb2ludC5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHNjYWxlKzUpKTtcclxuXHRzcHJpdGUuc2NhbGUuc2V0KDUsNSw5KTtcdC8vIHNjYWxlIHNwcml0ZSB0byBtYWtlIGl0IGJpZ2dlclxyXG5cclxuXHRyZXR1cm4gc3ByaXRlO1x0XHJcbn0iLCIvL2NyZWF0ZXMgYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgdHdvIG1lc2hlcyB0byBjcmVhdGUgdHJhbnNwYXJlbmN5XHJcbmZ1bmN0aW9uIFRyYW5zcE1lc2hHcnAoZ2VvbWV0cnkpIHtcclxuXHR2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHR2YXIgbWVzaEdlb21ldHJ5ID0gbmV3IFRIUkVFLkNvbnZleEJ1ZmZlckdlb21ldHJ5KGdlb21ldHJ5LnZlcnRpY2VzKTtcclxuXHJcblx0dmFyIGZhY2VzID0gbWVzaEdlb21ldHJ5LmZhY2VzO1xyXG5cdGZvcih2YXIgZmFjZSBpbiBmYWNlcykge1xyXG5cdFx0Zm9yKHZhciBpPTA7IGk8MzsgaSsrKSB7XHJcblx0XHRcdHZhciB2MSA9IGZhY2VzW2ZhY2VdLmdldEVkZ2UoaSkuaGVhZCgpO1xyXG5cdFx0XHR2YXIgdjIgPSBmYWNlc1tmYWNlXS5nZXRFZGdlKGkpLnRhaWwoKTtcclxuXHRcdFx0Z3JvdXAuYWRkKG5ldyBDeWxpbmRlckZyb21QdHModjEucG9pbnQsIHYyLnBvaW50KSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKG1lc2hHZW9tZXRyeSwgdHJhbnNwYXJlbnRNYXRlcmlhbEJhY2spO1xyXG5cdG1lc2gubWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkJhY2tTaWRlOyAvLyBiYWNrIGZhY2VzXHJcblx0bWVzaC5yZW5kZXJPcmRlciA9IDA7XHJcblxyXG5cdHZhciBtZXNoMiA9IG5ldyBUSFJFRS5NZXNoKG1lc2hHZW9tZXRyeSwgdHJhbnNwYXJlbnRNYXRlcmlhbEZyb250LmNsb25lKCkpO1xyXG5cdG1lc2gyLm1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Gcm9udFNpZGU7IC8vIGZyb250IGZhY2VzXHJcblx0bWVzaDIucmVuZGVyT3JkZXIgPSAxO1xyXG5cclxuXHRncm91cC5hZGQobWVzaCk7XHJcblx0Z3JvdXAuYWRkKG1lc2gyKTtcclxuXHJcblx0cmV0dXJuIGdyb3VwO1xyXG59IiwiLypcbiAgICBQcm9qZWN0IE5hbWU6IG1pZGktcGFyc2VyLWpzXG4gICAgQXV0aG9yOiBjb2x4aVxuICAgIEF1dGhvciBVUkk6IGh0dHA6Ly93d3cuY29seGkuaW5mby9cbiAgICBEZXNjcmlwdGlvbjogTUlESVBhcnNlciBsaWJyYXJ5IHJlYWRzIC5NSUQgYmluYXJ5IGZpbGVzLCBCYXNlNjQgZW5jb2RlZCBNSURJIERhdGEsXG4gICAgb3IgVUludDggQXJyYXlzLCBhbmQgb3V0cHV0cyBhcyBhIHJlYWRhYmxlIGFuZCBzdHJ1Y3R1cmVkIEpTIG9iamVjdC5cblxuICAgIC0tLSAgICAgVXNhZ2UgTWV0aG9kcyAgICAgIC0tLVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgKiBPUFRJT04gMSBORVchIChNSURJUGFyc2VyLnBhcnNlKVxuICAgIFdpbGwgYXV0b2RldGVjdCB0aGUgc291cmNlIGFuZCBwcm9jY2VzcyB0aGUgZGF0YSwgdXNpbmcgdGhlIHN1aXRhYmxlIG1ldGhvZC5cblxuICAgICogT1BUSU9OIDIgKE1JRElQYXJzZXIuYWRkTGlzdGVuZXIpXG4gICAgSU5QVVQgRUxFTUVOVCBMSVNURU5FUiA6IGNhbGwgTUlESVBhcnNlci5hZGRMaXN0ZW5lcihmaWxlSW5wdXRFbGVtZW50LGNhbGxiYWNGdW5jdGlvbikgZnVuY3Rpb24sIHNldHRpbmcgdGhlXG4gICAgSW5wdXQgRmlsZSBIVE1MIGVsZW1lbnQgdGhhdCB3aWxsIGhhbmRsZSB0aGUgZmlsZS5taWQgb3BlbmluZywgYW5kIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgdGhhdCB3aWxsIHJlY2lldmUgdGhlIHJlc3VsdGluZyBPYmplY3QgZm9ybWF0ZWQsIHNldCBvZiBkYXRhLlxuXG4gICAgKiBPUFRJT04gMyAoTUlESVBhcnNlci5VaW50OClcbiAgICBQcm92aWRlIHlvdXIgb3duIFVJbnQ4IEFycmF5IHRvIE1JRElQYXJzZXIuVWludDgoKSwgdG8gZ2V0IGFuIE9iamVjdCBmb3JtYXRlZCwgc2V0IG9mIGRhdGFcblxuICAgICogT1BUSU9OIDQgKE1JRElQYXJzZXIuQmFzZTY0KVxuICAgIFByb3ZpZGUgYSBCYXNlNjQgZW5jb2RlZCBEYXRhIHRvIE1JRElQYXJzZXIuQmFzZTY0KCksICwgdG8gZ2V0IGFuIE9iamVjdCBmb3JtYXRlZCwgc2V0IG9mIGRhdGFcblxuXG4gICAgLS0tICBPdXRwdXQgT2JqZWN0IFNwZWNzICAgLS0tXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBNSURJT2JqZWN0e1xuICAgICAgICBmb3JtYXRUeXBlOiAwfDF8MiwgICAgICAgICAgICAgICAgICAvLyBNaWRpIGZvcm1hdCB0eXBlXG4gICAgICAgIHRpbWVEaXZpc2lvbjogKGludCksICAgICAgICAgICAgICAgIC8vIHNvbmcgdGVtcG8gKGJwbSlcbiAgICAgICAgdHJhY2tzOiAoaW50KSwgICAgICAgICAgICAgICAgICAgICAgLy8gdG90YWwgdHJhY2tzIGNvdW50XG4gICAgICAgIHRyYWNrOiBBcnJheVtcbiAgICAgICAgICAgIFswXTogT2JqZWN0eyAgICAgICAgICAgICAgICAgICAgLy8gVFJBQ0sgMSFcbiAgICAgICAgICAgICAgICBldmVudDogQXJyYXlbICAgICAgICAgICAgICAgLy8gTWlkaSBldmVudHMgaW4gdHJhY2sgMVxuICAgICAgICAgICAgICAgICAgICBbMF0gOiBPYmplY3R7ICAgICAgICAgICAvLyBFVkVOVCAxXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAoc3RyaW5nKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhVGltZTogKGludCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhVHlwZTogKGludCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAoaW50KSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgWzFdIDogT2JqZWN0ey4uLn0gICAgICAgLy8gRVZFTlQgMlxuICAgICAgICAgICAgICAgICAgICBbMl0gOiBPYmplY3R7Li4ufSAgICAgICAvLyBFVkVOVCAzXG4gICAgICAgICAgICAgICAgICAgIC4uLlxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBbMV0gOiBPYmplY3R7Li4ufVxuICAgICAgICAgICAgWzJdIDogT2JqZWN0ey4uLn1cbiAgICAgICAgICAgIC4uLlxuICAgICAgICBdXG4gICAgfVxuXG5EYXRhIGZyb20gRXZlbnQgMTIgb2YgVHJhY2sgMiBjb3VsZCBiZSBlYXNpbGx5IHJlYWRlZCB3aXRoOlxuT3V0cHV0T2JqZWN0LnRyYWNrWzJdLmV2ZW50WzEyXS5kYXRhO1xuXG4qL1xuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gQ1JPU1NCUk9XU0VSICYgTk9ERWpzIFBPTFlGSUxMIGZvciBBVE9CKCkgLSBCeTogaHR0cHM6Ly9naXRodWIuY29tL01heEFydDI1MDEgKG1vZGlmaWVkKVxuY29uc3QgX2F0b2IgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAvLyBiYXNlNjQgY2hhcmFjdGVyIHNldCwgcGx1cyBwYWRkaW5nIGNoYXJhY3RlciAoPSlcbiAgICBsZXQgYjY0ID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JztcbiAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb24gdG8gY2hlY2sgZm9ybWFsIGNvcnJlY3RuZXNzIG9mIGJhc2U2NCBlbmNvZGVkIHN0cmluZ3NcbiAgICBsZXQgYjY0cmUgPSAvXig/OltBLVphLXpcXGQrXFwvXXs0fSkqPyg/OltBLVphLXpcXGQrXFwvXXsyfSg/Oj09KT98W0EtWmEtelxcZCtcXC9dezN9PT8pPyQvO1xuICAgIC8vIHJlbW92ZSBkYXRhIHR5cGUgc2lnbmF0dXJlcyBhdCB0aGUgYmVnaW5pbmcgb2YgdGhlIHN0cmluZ1xuICAgIC8vIGVnIDogIFwiZGF0YTphdWRpby9taWQ7YmFzZTY0LFwiXG4gICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoIC9eLio/YmFzZTY0LC8gLCAnJyk7XG4gICAgLy8gYXRvYiBjYW4gd29yayB3aXRoIHN0cmluZ3Mgd2l0aCB3aGl0ZXNwYWNlcywgZXZlbiBpbnNpZGUgdGhlIGVuY29kZWQgcGFydCxcbiAgICAvLyBidXQgb25seSBcXHQsIFxcbiwgXFxmLCBcXHIgYW5kICcgJywgd2hpY2ggY2FuIGJlIHN0cmlwcGVkLlxuICAgIHN0cmluZyA9IFN0cmluZyhzdHJpbmcpLnJlcGxhY2UoL1tcXHRcXG5cXGZcXHIgXSsvZywgJycpO1xuICAgIGlmICghYjY0cmUudGVzdChzdHJpbmcpKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGYWlsZWQgdG8gZXhlY3V0ZSBfYXRvYigpIDogVGhlIHN0cmluZyB0byBiZSBkZWNvZGVkIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC4nKTtcblxuICAgIC8vIEFkZGluZyB0aGUgcGFkZGluZyBpZiBtaXNzaW5nLCBmb3Igc2VtcGxpY2l0eVxuICAgIHN0cmluZyArPSAnPT0nLnNsaWNlKDIgLSAoc3RyaW5nLmxlbmd0aCAmIDMpKTtcbiAgICBsZXQgYml0bWFwLCByZXN1bHQgPSAnJztcbiAgICBsZXQgcjEsIHIyLCBpID0gMDtcbiAgICBmb3IgKDsgaSA8IHN0cmluZy5sZW5ndGg7KSB7XG4gICAgICAgIGJpdG1hcCA9IGI2NC5pbmRleE9mKHN0cmluZy5jaGFyQXQoaSsrKSkgPDwgMTggfCBiNjQuaW5kZXhPZihzdHJpbmcuY2hhckF0KGkrKykpIDw8IDEyXG4gICAgICAgICAgICAgICAgfCAocjEgPSBiNjQuaW5kZXhPZihzdHJpbmcuY2hhckF0KGkrKykpKSA8PCA2IHwgKHIyID0gYjY0LmluZGV4T2Yoc3RyaW5nLmNoYXJBdChpKyspKSk7XG5cbiAgICAgICAgcmVzdWx0ICs9IHIxID09PSA2NCA/IFN0cmluZy5mcm9tQ2hhckNvZGUoYml0bWFwID4+IDE2ICYgMjU1KVxuICAgICAgICAgICAgICAgIDogcjIgPT09IDY0ID8gU3RyaW5nLmZyb21DaGFyQ29kZShiaXRtYXAgPj4gMTYgJiAyNTUsIGJpdG1hcCA+PiA4ICYgMjU1KVxuICAgICAgICAgICAgICAgIDogU3RyaW5nLmZyb21DaGFyQ29kZShiaXRtYXAgPj4gMTYgJiAyNTUsIGJpdG1hcCA+PiA4ICYgMjU1LCBiaXRtYXAgJiAyNTUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuY29uc3QgTUlESVBhcnNlciA9IHtcbiAgICAvLyBkZWJ1ZyAoYm9vbCksIHdoZW4gZW5hYmxlZCB3aWxsIGxvZyBpbiBjb25zb2xlIHVuaW1wbGVtZW50ZWQgZXZlbnRzXG4gICAgLy8gd2FybmluZ3MgYW5kIGludGVybmFsIGhhbmRsZWQgZXJyb3JzLlxuICAgIGRlYnVnOiBmYWxzZSxcblxuICAgIHBhcnNlOiBmdW5jdGlvbihpbnB1dCwgX2NhbGxiYWNrKXtcbiAgICAgICAgaWYoaW5wdXQgaW5zdGFuY2VvZiBVaW50OEFycmF5KSByZXR1cm4gTUlESVBhcnNlci5VaW50OChpbnB1dCk7XG4gICAgICAgIGVsc2UgaWYodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykgcmV0dXJuIE1JRElQYXJzZXIuQmFzZTY0KGlucHV0KTtcbiAgICAgICAgZWxzZSBpZihpbnB1dCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGlucHV0LnR5cGUgPT09ICdmaWxlJykgcmV0dXJuIE1JRElQYXJzZXIuYWRkTGlzdGVuZXIoaW5wdXQgLCBfY2FsbGJhY2spO1xuICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvcignTUlESVBhcnNlci5wYXJzZSgpIDogSW52YWxpZCBpbnB1dCBwcm92aWRlZCcpO1xuICAgIH0sXG4gICAgLy8gYWRkTGlzdGVuZXIoKSBzaG91bGQgYmUgY2FsbGVkIGluIG9yZGVyIGF0dGFjaCBhIGxpc3RlbmVyIHRvIHRoZSBJTlBVVCBIVE1MIGVsZW1lbnRcbiAgICAvLyB0aGF0IHdpbGwgcHJvdmlkZSB0aGUgYmluYXJ5IGRhdGEgYXV0b21hdGluZyB0aGUgY29udmVyc2lvbiwgYW5kIHJldHVybmluZ1xuICAgIC8vIHRoZSBzdHJ1Y3R1cmVkIGRhdGEgdG8gdGhlIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgIGFkZExpc3RlbmVyOiBmdW5jdGlvbihfZmlsZUVsZW1lbnQsIF9jYWxsYmFjayl7XG4gICAgICAgIGlmKCFGaWxlIHx8ICFGaWxlUmVhZGVyKSB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBGaWxlfEZpbGVSZWFkZXIgQVBJcyBhcmUgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXIuIFVzZSBpbnN0ZWFkIE1JRElQYXJzZXIuQmFzZTY0KCkgb3IgTUlESVBhcnNlci5VaW50OCgpJyk7XG5cbiAgICAgICAgLy8gdmFsaWRhdGUgcHJvdmlkZWQgZWxlbWVudFxuICAgICAgICBpZiggX2ZpbGVFbGVtZW50ID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICEoX2ZpbGVFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8XG4gICAgICAgICAgICBfZmlsZUVsZW1lbnQudGFnTmFtZSAhPT0gJ0lOUFVUJyB8fFxuICAgICAgICAgICAgX2ZpbGVFbGVtZW50LnR5cGUudG9Mb3dlckNhc2UoKSAhPT0gJ2ZpbGUnICl7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdNSURJUGFyc2VyLmFkZExpc3RlbmVyKCkgOiBQcm92aWRlZCBlbGVtZW50IGlzIG5vdCBhIHZhbGlkIEZJTEUgSU5QVVQgZWxlbWVudCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBfY2FsbGJhY2sgPSBfY2FsbGJhY2sgfHwgZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgIF9maWxlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihJbnB1dEV2dCl7ICAgICAgICAgICAgIC8vIHNldCB0aGUgJ2ZpbGUgc2VsZWN0ZWQnIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIGlmICghSW5wdXRFdnQudGFyZ2V0LmZpbGVzLmxlbmd0aCkgcmV0dXJuIGZhbHNlOyAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIGZhbHNlIGlmIG5vIGVsZW1lbnRzIHdoZXJlIHNlbGVjdGVkXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTUlESVBhcnNlci5hZGRMaXN0ZW5lcigpIDogRmlsZSBkZXRlY3RlZCBpbiBJTlBVVCBFTEVNRU5UIHByb2Nlc3NpbmcgZGF0YS4uJyk7XG4gICAgICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByZXBhcmUgdGhlIGZpbGUgUmVhZGVyXG4gICAgICAgICAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoSW5wdXRFdnQudGFyZ2V0LmZpbGVzWzBdKTsgICAgICAgICAgICAgICAgIC8vIHJlYWQgdGhlIGJpbmFyeSBkYXRhXG4gICAgICAgICAgICByZWFkZXIub25sb2FkID0gIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIF9jYWxsYmFjayggTUlESVBhcnNlci5VaW50OChuZXcgVWludDhBcnJheShlLnRhcmdldC5yZXN1bHQpKSk7ICAvLyBlbmNvZGUgZGF0YSB3aXRoIFVpbnQ4QXJyYXkgYW5kIGNhbGwgdGhlIHBhcnNlclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIGNvbnZlcnQgYmFzZXQ0IHN0cmluZyBpbnRvIHVpbnQ4IGFycmF5IGJ1ZmZlciwgYmVmb3JlIHBlcmZvcm1pbmcgdGhlXG4gICAgLy8gcGFyc2luZyBzdWJyb3V0aW5lLlxuICAgIEJhc2U2NCA6IGZ1bmN0aW9uKGI2NFN0cmluZyl7XG4gICAgICAgIGI2NFN0cmluZyA9IFN0cmluZyhiNjRTdHJpbmcpO1xuXG4gICAgICAgIGxldCByYXcgPSBfYXRvYihiNjRTdHJpbmcpO1xuICAgICAgICBsZXQgcmF3TGVuZ3RoID0gcmF3Lmxlbmd0aDtcbiAgICAgICAgbGV0IHRfYXJyYXkgPSBuZXcgVWludDhBcnJheShuZXcgQXJyYXlCdWZmZXIocmF3TGVuZ3RoKSk7XG5cbiAgICAgICAgZm9yKGxldCBpPTA7IGk8cmF3TGVuZ3RoOyBpKyspIHRfYXJyYXlbaV0gPSByYXcuY2hhckNvZGVBdChpKTtcbiAgICAgICAgcmV0dXJuICBNSURJUGFyc2VyLlVpbnQ4KHRfYXJyYXkpIDtcbiAgICB9LFxuXG4gICAgLy8gcGFyc2UoKSBmdW5jdGlvbiByZWFkcyB0aGUgYmluYXJ5IGRhdGEsIGludGVycHJldGluZyBhbmQgc3BsaXRpbmcgZWFjaCBjaHVja1xuICAgIC8vIGFuZCBwYXJzaW5nIGl0IHRvIGEgc3RydWN0dXJlZCBPYmplY3QuIFdoZW4gam9iIGlzIGZpbmlzZWQgcmV0dXJucyB0aGUgb2JqZWN0XG4gICAgLy8gb3IgJ2ZhbHNlJyBpZiBhbnkgZXJyb3Igd2FzIGdlbmVyYXRlZC5cbiAgICBVaW50ODogZnVuY3Rpb24oRmlsZUFzVWludDhBcnJheSl7XG4gICAgICAgIGxldCBmaWxlID0ge1xuICAgICAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgICAgIHBvaW50ZXI6IDAsXG4gICAgICAgICAgICBtb3ZlUG9pbnRlcjogZnVuY3Rpb24oX2J5dGVzKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1vdmUgdGhlIHBvaW50ZXIgbmVnYXRpdmUgYW5kIHBvc2l0aXZlIGRpcmVjdGlvblxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlciArPSBfYnl0ZXM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWFkSW50OiBmdW5jdGlvbihfYnl0ZXMpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBpbnRlZ2VyIGZyb20gbmV4dCBfYnl0ZXMgZ3JvdXAgKGJpZy1lbmRpYW4pXG4gICAgICAgICAgICAgICAgX2J5dGVzID0gTWF0aC5taW4oX2J5dGVzLCB0aGlzLmRhdGEuYnl0ZUxlbmd0aC10aGlzLnBvaW50ZXIpO1xuICAgICAgICAgICAgICAgIGlmIChfYnl0ZXMgPCAxKSByZXR1cm4gLTE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVPRlxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgaWYoX2J5dGVzID4gMSl7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaT0xOyBpPD0gKF9ieXRlcy0xKTsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICs9IHRoaXMuZGF0YS5nZXRVaW50OCh0aGlzLnBvaW50ZXIpICogTWF0aC5wb3coMjU2LCAoX2J5dGVzIC0gaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gdGhpcy5kYXRhLmdldFVpbnQ4KHRoaXMucG9pbnRlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyKys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlYWRTdHI6IGZ1bmN0aW9uKF9ieXRlcyl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVhZCBhcyBBU0NJSSBjaGFycywgdGhlIGZvbGxvd29pbmcgX2J5dGVzXG4gICAgICAgICAgICAgICAgbGV0IHRleHQgPSAnJztcbiAgICAgICAgICAgICAgICBmb3IobGV0IGNoYXI9MTsgY2hhciA8PSBfYnl0ZXM7IGNoYXIrKykgdGV4dCArPSAgU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLnJlYWRJbnQoMSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlYWRJbnRWTFY6IGZ1bmN0aW9uKCl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVhZCBhIHZhcmlhYmxlIGxlbmd0aCB2YWx1ZVxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLnBvaW50ZXIgPj0gdGhpcy5kYXRhLmJ5dGVMZW5ndGggKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRU9GXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5kYXRhLmdldFVpbnQ4KHRoaXMucG9pbnRlcikgPCAxMjgpeyAgICAgICAgICAgICAgIC8vIC4uLnZhbHVlIGluIGEgc2luZ2xlIGJ5dGVcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnJlYWRJbnQoMSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC4uLnZhbHVlIGluIG11bHRpcGxlIGJ5dGVzXG4gICAgICAgICAgICAgICAgICAgIGxldCBGaXJzdEJ5dGVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlKHRoaXMuZGF0YS5nZXRVaW50OCh0aGlzLnBvaW50ZXIpID49IDEyOCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBGaXJzdEJ5dGVzLnB1c2godGhpcy5yZWFkSW50KDEpIC0gMTI4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdEJ5dGUgID0gdGhpcy5yZWFkSW50KDEpO1xuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGR0ID0gMTsgZHQgPD0gRmlyc3RCeXRlcy5sZW5ndGg7IGR0Kyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgKz0gRmlyc3RCeXRlc1tGaXJzdEJ5dGVzLmxlbmd0aCAtIGR0XSAqIE1hdGgucG93KDEyOCwgZHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlICs9IGxhc3RCeXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZmlsZS5kYXRhID0gbmV3IERhdGFWaWV3KEZpbGVBc1VpbnQ4QXJyYXkuYnVmZmVyLCBGaWxlQXNVaW50OEFycmF5LmJ5dGVPZmZzZXQsIEZpbGVBc1VpbnQ4QXJyYXkuYnl0ZUxlbmd0aCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA4IGJpdHMgYnl0ZXMgZmlsZSBkYXRhIGFycmF5XG4gICAgICAgIC8vICAqKiByZWFkIEZJTEUgSEVBREVSXG4gICAgICAgIGlmKGZpbGUucmVhZEludCg0KSAhPT0gMHg0RDU0Njg2NCl7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0hlYWRlciB2YWxpZGF0aW9uIGZhaWxlZCAobm90IE1JREkgc3RhbmRhcmQgb3IgZmlsZSBjb3JydXB0LiknKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGVhZGVyIHZhbGlkYXRpb24gZmFpbGVkIChub3QgTUlESSBzdGFuZGFyZCBvciBmaWxlIGNvcnJ1cHQuKVxuICAgICAgICB9XG4gICAgICAgIGxldCBoZWFkZXJTaXplICAgICAgICAgID0gZmlsZS5yZWFkSW50KDQpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhlYWRlciBzaXplICh1bnVzZWQgdmFyKSwgZ2V0dGVkIGp1c3QgZm9yIHJlYWQgcG9pbnRlciBtb3ZlbWVudFxuICAgICAgICBsZXQgTUlESSAgICAgICAgICAgICAgICA9IHt9OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgbmV3IG1pZGkgb2JqZWN0XG4gICAgICAgIE1JREkuZm9ybWF0VHlwZSAgICAgICAgID0gZmlsZS5yZWFkSW50KDIpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBNSURJIEZvcm1hdCBUeXBlXG4gICAgICAgIE1JREkudHJhY2tzICAgICAgICAgICAgID0gZmlsZS5yZWFkSW50KDIpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBhbW1vdW50IG9mIHRyYWNrIGNodW5rc1xuICAgICAgICBNSURJLnRyYWNrICAgICAgICAgICAgICA9IFtdOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgYXJyYXkga2V5IGZvciB0cmFjayBkYXRhIHN0b3JpbmdcbiAgICAgICAgbGV0IHRpbWVEaXZpc2lvbkJ5dGUxICAgPSBmaWxlLnJlYWRJbnQoMSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IFRpbWUgRGl2aXNpb24gZmlyc3QgYnl0ZVxuICAgICAgICBsZXQgdGltZURpdmlzaW9uQnl0ZTIgICA9IGZpbGUucmVhZEludCgxKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgVGltZSBEaXZpc2lvbiBzZWNvbmQgYnl0ZVxuICAgICAgICBpZih0aW1lRGl2aXNpb25CeXRlMSA+PSAxMjgpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkaXNjb3ZlciBUaW1lIERpdmlzaW9uIG1vZGUgKGZwcyBvciB0cGYpXG4gICAgICAgICAgICBNSURJLnRpbWVEaXZpc2lvbiAgICA9IFtdO1xuICAgICAgICAgICAgTUlESS50aW1lRGl2aXNpb25bMF0gPSB0aW1lRGl2aXNpb25CeXRlMSAtIDEyODsgICAgICAgICAgICAgICAgICAgICAvLyBmcmFtZXMgcGVyIHNlY29uZCBNT0RFICAoMXN0IGJ5dGUpXG4gICAgICAgICAgICBNSURJLnRpbWVEaXZpc2lvblsxXSA9IHRpbWVEaXZpc2lvbkJ5dGUyOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRpY2tzIGluIGVhY2ggZnJhbWUgICAgICgybmQgYnl0ZSlcbiAgICAgICAgfWVsc2UgTUlESS50aW1lRGl2aXNpb24gID0gKHRpbWVEaXZpc2lvbkJ5dGUxICogMjU2KSArIHRpbWVEaXZpc2lvbkJ5dGUyOy8vIGVsc2UuLi4gdGlja3MgcGVyIGJlYXQgTU9ERSAgKDIgYnl0ZXMgdmFsdWUpXG5cbiAgICAgICAgLy8gICoqIHJlYWQgVFJBQ0sgQ0hVTktcbiAgICAgICAgZm9yKGxldCB0PTE7IHQgPD0gTUlESS50cmFja3M7IHQrKyl7XG4gICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0gICAgID0ge2V2ZW50OiBbXX07ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBuZXcgVHJhY2sgZW50cnkgaW4gQXJyYXlcbiAgICAgICAgICAgIGxldCBoZWFkZXJWYWxpZGF0aW9uID0gZmlsZS5yZWFkSW50KDQpO1xuICAgICAgICAgICAgaWYgKCBoZWFkZXJWYWxpZGF0aW9uID09PSAtMSApIGJyZWFrOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFT0ZcbiAgICAgICAgICAgIGlmKGhlYWRlclZhbGlkYXRpb24gIT09IDB4NEQ1NDcyNkIpIHJldHVybiBmYWxzZTsgICAgICAgICAgICAgICAgICAgLy8gVHJhY2sgY2h1bmsgaGVhZGVyIHZhbGlkYXRpb24gZmFpbGVkLlxuICAgICAgICAgICAgZmlsZS5yZWFkSW50KDQpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtb3ZlIHBvaW50ZXIuIGdldCBjaHVuayBzaXplIChieXRlcyBsZW5ndGgpXG4gICAgICAgICAgICBsZXQgZSAgICAgICAgICAgICAgID0gMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluaXQgZXZlbnQgY291bnRlclxuICAgICAgICAgICAgbGV0IGVuZE9mVHJhY2sgICAgICA9IGZhbHNlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGTEFHIGZvciB0cmFjayByZWFkaW5nIHNlY3VlbmNlIGJyZWFraW5nXG4gICAgICAgICAgICAvLyAqKiByZWFkIEVWRU5UIENIVU5LXG4gICAgICAgICAgICBsZXQgc3RhdHVzQnl0ZTtcbiAgICAgICAgICAgIGxldCBsYXN0c3RhdHVzQnl0ZTtcbiAgICAgICAgICAgIHdoaWxlKCFlbmRPZlRyYWNrKXtcbiAgICAgICAgICAgICAgICBlKys7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5jcmVhc2UgYnkgMSBldmVudCBjb3VudGVyXG4gICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0gPSB7fTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBuZXcgZXZlbnQgb2JqZWN0LCBpbiBldmVudHMgYXJyYXlcbiAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kZWx0YVRpbWUgID0gZmlsZS5yZWFkSW50VkxWKCk7ICAgICAgLy8gZ2V0IERFTFRBIFRJTUUgT0YgTUlESSBldmVudCAoVmFyaWFibGUgTGVuZ3RoIFZhbHVlKVxuICAgICAgICAgICAgICAgIHN0YXR1c0J5dGUgPSBmaWxlLnJlYWRJbnQoMSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWFkIEVWRU5UIFRZUEUgKFNUQVRVUyBCWVRFKVxuICAgICAgICAgICAgICAgIGlmKHN0YXR1c0J5dGUgPT09IC0xKSBicmVhazsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFT0ZcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHN0YXR1c0J5dGUgPj0gMTI4KSBsYXN0c3RhdHVzQnl0ZSA9IHN0YXR1c0J5dGU7ICAgICAgICAgLy8gTkVXIFNUQVRVUyBCWVRFIERFVEVDVEVEXG4gICAgICAgICAgICAgICAgZWxzZXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICdSVU5OSU5HIFNUQVRVUycgc2l0dWF0aW9uIGRldGVjdGVkXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c0J5dGUgPSBsYXN0c3RhdHVzQnl0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFwcGx5IGxhc3QgbG9vcCwgU3RhdHVzIEJ5dGVcbiAgICAgICAgICAgICAgICAgICAgZmlsZS5tb3ZlUG9pbnRlcigtMSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbW92ZSBiYWNrIHRoZSBwb2ludGVyIChjYXVzZSByZWFkZWQgYnl0ZSBpcyBub3Qgc3RhdHVzIGJ5dGUpXG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vICoqIElTIE1FVEEgRVZFTlRcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIGlmKHN0YXR1c0J5dGUgPT09IDB4RkYpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNZXRhIEV2ZW50IHR5cGVcbiAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0udHlwZSA9IDB4RkY7ICAgICAgICAgICAgICAgICAgICAgLy8gYXNzaWduIG1ldGFFdmVudCBjb2RlIHRvIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLm1ldGFUeXBlID0gIGZpbGUucmVhZEludCgxKTsgICAgIC8vIGFzc2lnbiBtZXRhRXZlbnQgc3VidHlwZVxuICAgICAgICAgICAgICAgICAgICBsZXQgbWV0YUV2ZW50TGVuZ3RoID0gZmlsZS5yZWFkSW50VkxWKCk7ICAgICAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIG1ldGFFdmVudCBsZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoKE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLm1ldGFUeXBlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHgyRjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZW5kIG9mIHRyYWNrLCBoYXMgbm8gZGF0YSBieXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVPRlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZE9mVHJhY2sgPSB0cnVlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFuZ2UgRkxBRyB0byBmb3JjZSB0cmFjayByZWFkaW5nIGxvb3AgYnJlYWtpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHgwMTogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGV4dCBFdmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDAyOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3B5cmlnaHQgTm90aWNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDM6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlcXVlbmNlL1RyYWNrIE5hbWUgKGRvY3VtZW50YXRpb246IGh0dHA6Ly93d3cudGE3LmRlL3R4dC9tdXNpay9tdXNpMDAwNi5odG0pXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDY6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hcmtlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBmaWxlLnJlYWRTdHIobWV0YUV2ZW50TGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHgyMTogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTUlESSBQT1JUXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4NTk6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtleSBTaWduYXR1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHg1MTogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2V0IFRlbXBvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IGZpbGUucmVhZEludChtZXRhRXZlbnRMZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweDU0OiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTTVBURSBPZmZzZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhICAgID0gW107ICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVswXSA9IGZpbGUucmVhZEludCgxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzFdID0gZmlsZS5yZWFkSW50KDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbMl0gPSBmaWxlLnJlYWRJbnQoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVszXSA9IGZpbGUucmVhZEludCgxKTsgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbNF0gPSBmaWxlLnJlYWRJbnQoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4NTg6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpbWUgU2lnbmF0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSAgICA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbMF0gPSBmaWxlLnJlYWRJbnQoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVsxXSA9IGZpbGUucmVhZEludCgxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzJdID0gZmlsZS5yZWFkSW50KDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGFbM10gPSBmaWxlLnJlYWRJbnQoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB1c2VyIHByb3ZpZGVkIGEgY3VzdG9tIGludGVycHJldGVyLCBjYWxsIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIGFzc2lnbiB0byBldmVudCB0aGUgcmV0dXJuZWQgZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmN1c3RvbUludGVycHJldGVyICE9PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IHRoaXMuY3VzdG9tSW50ZXJwcmV0ZXIoIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLm1ldGFUeXBlLCBmaWxlLCBtZXRhRXZlbnRMZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBubyBjdXN0b21JbnRlcnByZXRyIGlzIHByb3ZpZGVkLCBvciByZXR1cm5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZhbHNlICg9YXBwbHkgZGVmYXVsdCksIHBlcmZvcm0gZGVmYXVsdCBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmN1c3RvbUludGVycHJldGVyID09PSBudWxsIHx8IE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPT09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZS5yZWFkSW50KG1ldGFFdmVudExlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLmRhdGEgPSBmaWxlLnJlYWRJbnQobWV0YUV2ZW50TGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVidWcpIGNvbnNvbGUuaW5mbygnVW5pbXBsZW1lbnRlZCAweEZGIG1ldGEgZXZlbnQhIGRhdGEgYmxvY2sgcmVhZGVkIGFzIEludGVnZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIElTIFJFR1VMQVIgRVZFTlRcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIGVsc2V7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1JREkgQ29udHJvbCBFdmVudHMgT1IgU3lzdGVtIEV4Y2x1c2l2ZSBFdmVudHNcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzQnl0ZSA9IHN0YXR1c0J5dGUudG9TdHJpbmcoMTYpLnNwbGl0KCcnKTsgICAgICAgICAgICAgLy8gc3BsaXQgdGhlIHN0YXR1cyBieXRlIEhFWCByZXByZXNlbnRhdGlvbiwgdG8gb2J0YWluIDQgYml0cyB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgaWYoIXN0YXR1c0J5dGVbMV0pIHN0YXR1c0J5dGUudW5zaGlmdCgnMCcpOyAgICAgICAgICAgICAgICAgLy8gZm9yY2UgMiBkaWdpdHNcbiAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0udHlwZSA9IHBhcnNlSW50KHN0YXR1c0J5dGVbMF0sIDE2KTsvLyBmaXJzdCBieXRlIGlzIEVWRU5UIFRZUEUgSURcbiAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uY2hhbm5lbCA9IHBhcnNlSW50KHN0YXR1c0J5dGVbMV0sIDE2KTsvLyBzZWNvbmQgYnl0ZSBpcyBjaGFubmVsXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaChNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS50eXBlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHhGOnsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN5c3RlbSBFeGNsdXNpdmUgRXZlbnRzXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB1c2VyIHByb3ZpZGVkIGEgY3VzdG9tIGludGVycHJldGVyLCBjYWxsIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIGFzc2lnbiB0byBldmVudCB0aGUgcmV0dXJuZWQgZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmN1c3RvbUludGVycHJldGVyICE9PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IHRoaXMuY3VzdG9tSW50ZXJwcmV0ZXIoIE1JREkudHJhY2tbdC0xXS5ldmVudFtlLTFdLnR5cGUsIGZpbGUgLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgbm8gY3VzdG9tSW50ZXJwcmV0ciBpcyBwcm92aWRlZCwgb3IgcmV0dXJuZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmYWxzZSAoPWFwcGx5IGRlZmF1bHQpLCBwZXJmb3JtIGRlZmF1bHQgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5jdXN0b21JbnRlcnByZXRlciA9PT0gbnVsbCB8fCBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBldmVudF9sZW5ndGggPSBmaWxlLnJlYWRJbnRWTFYoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YSA9IGZpbGUucmVhZEludChldmVudF9sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWJ1ZykgY29uc29sZS5pbmZvKCdVbmltcGxlbWVudGVkIDB4RiBleGNsdXNpdmUgZXZlbnRzISBkYXRhIGJsb2NrIHJlYWRlZCBhcyBJbnRlZ2VyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweEE6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3RlIEFmdGVydG91Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMHhCOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29udHJvbGxlclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweEU6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQaXRjaCBCZW5kIEV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4ODogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdGUgb2ZmXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDB4OTogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdGUgT25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0uZGF0YVswXSA9IGZpbGUucmVhZEludCgxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhWzFdID0gZmlsZS5yZWFkSW50KDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweEM6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcm9ncmFtIENoYW5nZVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAweEQ6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGFubmVsIEFmdGVydG91Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gZmlsZS5yZWFkSW50KDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAtMTogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFT0ZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRPZlRyYWNrID0gdHJ1ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hhbmdlIEZMQUcgdG8gZm9yY2UgdHJhY2sgcmVhZGluZyBsb29wIGJyZWFraW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHVzZXIgcHJvdmlkZWQgYSBjdXN0b20gaW50ZXJwcmV0ZXIsIGNhbGwgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgYXNzaWduIHRvIGV2ZW50IHRoZSByZXR1cm5lZCBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMuY3VzdG9tSW50ZXJwcmV0ZXIgIT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID0gdGhpcy5jdXN0b21JbnRlcnByZXRlciggTUlESS50cmFja1t0LTFdLmV2ZW50W2UtMV0ubWV0YVR5cGUsIGZpbGUgLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgbm8gY3VzdG9tSW50ZXJwcmV0ciBpcyBwcm92aWRlZCwgb3IgcmV0dXJuZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmYWxzZSAoPWFwcGx5IGRlZmF1bHQpLCBwZXJmb3JtIGRlZmF1bHQgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5jdXN0b21JbnRlcnByZXRlciA9PT0gbnVsbCB8fCBNSURJLnRyYWNrW3QtMV0uZXZlbnRbZS0xXS5kYXRhID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVbmtub3duIEVWRU5UIGRldGVjdGVkLi4uIHJlYWRpbmcgY2FuY2VsbGVkIScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNSURJO1xuICAgIH0sXG5cbiAgICAvLyBjdXN0b20gZnVuY3Rpb24gdCBoYW5kbGUgdW5pbXAsZW1lbnRlZCwgb3IgY3VzdG9tIG1pZGkgbWVzc2FnZXMuSWYgbWVzc2FnZVxuICAgIC8vIGlzIGEgbWV0YWV2ZW50LCB0aGUgdmFsdWUgb2YgbWV0YUV2ZW50TGVuZ3RoIHdpbGwgYmUgPjAuXG4gICAgLy8gRnVuY3Rpb24gbXVzdCByZXR1cm4gdGhlIHZhbHVlIHRvIHN0b3JlLCBhbmQgcG9pbnRlciBvZiBkYXRhVmlldyBpbmNyZXNlZFxuICAgIC8vIElmIGRlZmF1bHQgYWN0aW9uIHdhbnRzIHRvIGJlIHBlcmZvcm1lZCwgcmV0dXJuIGZhbHNlXG4gICAgY3VzdG9tSW50ZXJwcmV0ZXIgOiBudWxsIC8vIGZ1bmN0aW9uKCBlX3R5cGUgLCBhcnJheUJ5ZmZlciwgbWV0YUV2ZW50TGVuZ3RoKXsgcmV0dXJuIGVfZGF0YV9pbnQgfVxufTtcblxuXG5pZih0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBNSURJUGFyc2VyO1xuIiwiLy8gQ3JlYXRlcyBhbiBvYmplY3Qgd2l0aCB0d28gYWNjZXNzaWJsZSBtYXBzLCBvbmUgY29udGFpbmluZyBjaG9yZHMgYnkgZXZlbnQgdGltZSwgdGhlIG90aGVyIGNvbnRhaW5pbmcga2V5cyBieSBldmVudCB0aW1lXHJcbi8vIGtleXMgYXJlIG1hZGUgb2YgdGhlIGNvbmNhdGVuYXRpb24gb2Ygbm90ZXMgdmFsdWVzIG1vZHVsbyAxMlxyXG4vLyB0aGlzIG9iamVjdCBoYXMgYSBmdW5jdGlvbiB0aGF0IHBhcnNlcyBtaWRpIGZpbGVzIGFuZCBmaWxsIHRoZSB0d28gbWFwc1xyXG5mdW5jdGlvbiBNaWRpVG9DaG9yZE1hcCgpIHtcclxuXHR0aGlzLmNob3Jkc01hcCA9IG5ldyBNYXAoKTtcclxuXHR0aGlzLmtleXNNYXAgPSBuZXcgTWFwKCk7XHJcbn1cclxuXHJcbi8vIFRoaXMgcHJvdG90eXBlIGZ1bmN0aW9uIHdpbGwgcGFyc2UgYSBtaWRpIGZpbGUgdXNpbmcgbWlkaS1wYXJzZXItanMgbGlicmFyeSwgYW5kIHRoZW4gZmlsbCB0aGUgdHdvIG1hcHMgb2YgdGhpcyBvYmplY3RcclxuLy8gY2hvcmRzIGFyZSBzYXZlZCBmb3IgZWFjaCBldmVudCB0aW1lLCBhbmQga2V5cyB0b28uXHJcbk1pZGlUb0Nob3JkTWFwLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKGRvbUZpbGVJbnB1dCwgY2FsbGJhY2spIHtcclxuXHRjb25zdCBmaWxlID0gZG9tRmlsZUlucHV0LmZpbGVzWzBdO1xyXG5cdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cdGxldCB0aGlzT2JqID0gdGhpcztcclxuXHJcblx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGxldCB1aW50OGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoZS50YXJnZXQucmVzdWx0KTtcclxuXHRcdC8vIGxldCBoZXhBcnJheSA9IFtdO1xyXG5cdFx0Ly8gdWludDhhcnJheS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG5cdFx0Ly8gXHRoZXhBcnJheS5wdXNoKENvbnZlcnRCYXNlLmRlYzJoZXgoZWxlbWVudCkpO1xyXG5cdFx0Ly8gfSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnaGV4QXJyYXknLCBoZXhBcnJheSk7XHJcblx0XHRsZXQgcGFyc2VkID0gTUlESVBhcnNlci5wYXJzZSh1aW50OGFycmF5KSxcclxuXHRcdFx0b25lVHJhY2sgPSBbXSxcclxuXHRcdFx0c29ydGVkT25lVHJrID0gW10sXHJcblx0XHRcdGN1cnJOb3RlcyA9IFtdLFxyXG5cdFx0XHRwcmV2VGltZSA9IC0xLFxyXG5cdFx0XHRldmVudFRpbWUgPSAtMTtcclxuXHJcblx0XHRwYXJzZWQudHJhY2suZm9yRWFjaCh0cmFjayA9PiB7XHJcblx0XHRcdGxldCBjdXJyRGVsdGFUaW1lID0gMDtcclxuXHJcblx0XHRcdHRyYWNrLmV2ZW50LmZvckVhY2goZXZlbnQgPT4ge1xyXG5cdFx0XHRcdGN1cnJEZWx0YVRpbWUgKz0gZXZlbnQuZGVsdGFUaW1lO1xyXG5cclxuXHRcdFx0XHRvbmVUcmFjay5wdXNoKHsgJ2V2ZW50JzogZXZlbnQsICd0aW1lJzogY3VyckRlbHRhVGltZX0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vY29uc29sZS5sb2cob25lVHJhY2suc29ydCgoYSxiKSA9PiBhLnRpbWUgLSBiLnRpbWUpLnNvcnQoKGEsYikgPT4gYS5ldmVudC50eXBlIC0gYi5ldmVudC50eXBlKSk7XHJcblx0XHRzb3J0ZWRPbmVUcmsgPSBvbmVUcmFjay5zb3J0KChhLGIpID0+IChhLnRpbWUgKyBhLmV2ZW50LnR5cGUpIC0gKGIudGltZSArIGIuZXZlbnQudHlwZSkpO1x0XHJcblxyXG5cdFx0c29ydGVkT25lVHJrLmZvckVhY2gob25lVHJFdmVudCA9PiB7XHJcblx0XHRcdGxldCBldiA9IG9uZVRyRXZlbnQuZXZlbnQ7XHJcblx0XHRcdGxldCB0eXBlID0gZXYudHlwZTtcclxuXHRcdFx0aWYodHlwZSA9PT0gOSB8fCB0eXBlID09PSA4KSB7XHJcblx0XHRcdFx0bGV0IG5vdGUgPSBldi5kYXRhWzBdICUgMTI7XHJcblx0XHRcdFx0bGV0IHZlbG9jaXR5ID0gZXYuZGF0YVsxXTtcclxuXHRcdFx0XHRldmVudFRpbWUgPSBvbmVUckV2ZW50LnRpbWU7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYocHJldlRpbWUgPT09IC0xKVxyXG5cdFx0XHRcdFx0cHJldlRpbWUgPSBldmVudFRpbWU7XHJcblxyXG5cdFx0XHRcdGlmKHByZXZUaW1lICE9IGV2ZW50VGltZSAmJiBjdXJyTm90ZXMubGVuZ3RoICE9IDApIHtcclxuXHRcdFx0XHRcdGxldCBub3Rlc0FycmF5ID0gQXJyYXkuZnJvbShuZXcgU2V0KGN1cnJOb3RlcykpO1xyXG5cdFx0XHRcdFx0bGV0IGtleXMgPSBbXTtcclxuXHJcblx0XHRcdFx0XHRmb3IobGV0IGk9MTsgaTw9MzsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGxldCBnZW4gPSBzdWJzZXRzKG5vdGVzQXJyYXksIGkpO1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IHN1YiBvZiBnZW4pIHtcclxuXHRcdFx0XHRcdFx0XHRsZXQgc3ViQXJyYXkgPSBBcnJheS5mcm9tKHN1Yik7XHJcblx0XHRcdFx0XHRcdFx0bGV0IGtleSA9IEtleUZyb21QdHNBcnJheShzdWJBcnJheSk7XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vbGV0IHNvcnRlZCA9IG5vdGVzQXJyYXkuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG5cclxuXHRcdFx0XHRcdHRoaXNPYmouY2hvcmRzTWFwLnNldChldmVudFRpbWUsIG5vdGVzQXJyYXkpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR0aGlzT2JqLmtleXNNYXAuc2V0KGV2ZW50VGltZSwga2V5cyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHR5cGUgPT09IDggfHwgKHR5cGUgPT09IDkgJiYgdmVsb2NpdHkgPT09IDApKSB7XHJcblx0XHRcdFx0XHRjdXJyTm90ZXMuc3BsaWNlKGN1cnJOb3Rlcy5pbmRleE9mKG5vdGUpLCAxKTtcclxuXHJcblx0XHRcdFx0fSBlbHNlIGlmKHR5cGUgPT09IDkgJiYgdmVsb2NpdHkgPiAwKSB7XHJcblx0XHRcdFx0XHRjdXJyTm90ZXMucHVzaChub3RlKTtcclxuXHRcdFx0XHR9IFxyXG5cdFx0XHR9XHJcblx0XHRcdHByZXZUaW1lID0gZXZlbnRUaW1lO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Y2FsbGJhY2soKTtcclxuXHR9IFxyXG5cclxuXHRyZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoZmlsZSk7IFxyXG59IiwiY29uc3Qgc2NhbGUgPSAxNTtcclxubGV0IGNob3JkR2VvbWV0cnk7XHJcblxyXG5mdW5jdGlvbiBDaG9yZChub3Rlcykge1xyXG5cdHRoaXMubm90ZXMgPSBbXTtcclxuXHJcblx0Zm9yKHZhciBpIGluIG5vdGVzKSB7XHJcblx0XHRsZXQgZmluYWxOb3RlID0gbm90ZXNbaV0gJSAxMjtcclxuXHRcdGlmKHRoaXMubm90ZXMuaW5kZXhPZihmaW5hbE5vdGUpID09IC0xKSBcclxuXHRcdFx0dGhpcy5ub3Rlcy5wdXNoKGZpbmFsTm90ZSk7XHJcblx0fVxyXG5cclxuXHR0aGlzLmRyYXdDaG9yZCgpO1xyXG59XHJcblxyXG5DaG9yZC5wcm90b3R5cGUuYWRkTm90ZSA9IGZ1bmN0aW9uKG5vdGUpIHtcclxuXHR0aGlzLm5vdGVzLnB1c2gobm90ZSAlIDEyKTtcclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbihib29sKSB7XHJcblx0dGhpcy5wb2x5aGVkcm9uLnZpc2libGUgPSBib29sO1xyXG5cdGZvcih2YXIgaSBpbiB0aGlzLm5vdGVzKSB7XHJcblx0XHRzcGhlcmVzLmNoaWxkcmVuW3RoaXMubm90ZXNbaV1dLnZpc2libGUgPSBib29sO1xyXG5cdH1cclxufVxyXG5cclxuQ2hvcmQucHJvdG90eXBlLmRyYXdDaG9yZCA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBuYk5vdGVzID0gdGhpcy5ub3Rlcy5sZW5ndGg7XHJcblxyXG5cdGlmKG5iTm90ZXMgPT0gMSkge1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XHJcblx0fSBlbHNlIGlmKG5iTm90ZXMgPT0gMikge1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFR3b1BvaW50cyh0aGlzLm5vdGVzWzBdLCB0aGlzLm5vdGVzWzFdLCBzY2FsZSk7XHJcblx0fSBlbHNlIGlmKG5iTm90ZXMgPT0gMykge1xyXG5cdFx0dGhpcy5wb2x5aGVkcm9uID0gbmV3IFRocmVlUG9pbnRzKHRoaXMubm90ZXMsIHNjYWxlKTtcclxuXHR9ZWxzZSB7XHJcblx0XHRjaG9yZEdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcblx0XHRcclxuXHRcdGZvcih2YXIgaT0wOyBpPG5iTm90ZXM7IGkrKykge1xyXG5cdFx0XHRjaG9yZEdlb21ldHJ5LnZlcnRpY2VzLnB1c2goXHJcblx0XHRcdFx0YWxsUG9pbnRzW3RoaXMubm90ZXNbaV1dLmNsb25lKClcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyB2YXIgc3VicyA9IHN1YnNldHModGhpcy5ub3RlcywgMyk7XHJcblx0XHQvLyB2YXIgcG9pbnRJZHM7XHJcblx0XHQvLyB2YXIgcG9pbnRJZDEsIHBvaW50SWQyLCBwb2ludElkMztcclxuXHRcdC8vIHZhciBmYWNlO1xyXG5cclxuXHRcdC8vIGZvcihzdWIgb2Ygc3Vicykge1xyXG5cdFx0Ly8gXHRwb2ludElkcyA9IHN1Yi5lbnRyaWVzKCk7XHJcblx0XHRcdFxyXG5cdFx0Ly8gXHQvL2dldCB0aGUgZmFjZSdzIDMgdmVydGljZXMgaW5kZXhcclxuXHRcdC8vIFx0cG9pbnRJZDEgPSBwb2ludElkcy5uZXh0KCkudmFsdWVbMF0udmFsdWU7XHJcblx0XHQvLyBcdHBvaW50SWQyID0gcG9pbnRJZHMubmV4dCgpLnZhbHVlWzBdLnZhbHVlO1xyXG5cdFx0Ly8gXHRwb2ludElkMyA9IHBvaW50SWRzLm5leHQoKS52YWx1ZVswXS52YWx1ZTtcclxuXHJcblx0XHQvLyBcdGZhY2UgPSBuZXcgVEhSRUUuRmFjZTMocG9pbnRJZDEscG9pbnRJZDIscG9pbnRJZDMpO1xyXG5cdFx0Ly8gXHRnZW9tZXRyeS5mYWNlcy5wdXNoKGZhY2UpO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdC8vIHZhciBtZXNoR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29udmV4QnVmZmVyR2VvbWV0cnkoZ2VvbWV0cnkudmVydGljZXMpO1xyXG5cdFx0Y2hvcmRHZW9tZXRyeS5zY2FsZShzY2FsZSxzY2FsZSxzY2FsZSk7XHJcblx0XHR0aGlzLnBvbHloZWRyb24gPSBuZXcgUG9seU1lc2hlcyhjaG9yZEdlb21ldHJ5LCB0aGlzLm5vdGVzKTtcclxuXHJcblx0fVxyXG5cdHRoaXMucG9seWhlZHJvbi52aXNpYmxlID0gZmFsc2U7XHJcblx0c2hhcGVzR3JvdXAuYWRkKHRoaXMucG9seWhlZHJvbik7XHJcblx0XHJcblxyXG59XHJcblxyXG5DaG9yZC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oY2hvcmQpIHtcclxuXHRpZih0aGlzLm5vdGVzLmxlbmd0aCAhPSBjaG9yZC5ub3Rlcy5sZW5ndGgpXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdGZvcihsZXQgbm90ZSBpbiBjaG9yZC5ub3Rlcykge1xyXG5cdFx0aWYodGhpcy5ub3Rlc1tub3RlXSAhPSBjaG9yZC5ub3Rlc1tub3RlXSlcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRydWU7XHJcbn0iLCJmdW5jdGlvbiBOb3RlKHZhbHVlLCBzdGFydCkge1xyXG5cdHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuXHR0aGlzLnN0YXJ0ID0gc3RhcnQ7XHJcblx0dGhpcy5lbmQgPSAtMTtcclxufVxyXG5cclxuTm90ZS5wcm90b3R5cGUuY3JlYXRlTWVzaCA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSggMiwgMzAsIDMwKTtcclxuXHRyZXR1cm4gZ2VvbWV0cnk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbXBhcmVTdGFydChub3RlQSwgbm90ZUIpIHtcclxuXHRyZXR1cm4gbm90ZUEuc3RhcnQgLSBub3RlQi5zdGFydDtcclxufSIsIi8qISBub3Vpc2xpZGVyIC0gMTEuMS4wIC0gMjAxOC0wNC0wMiAxMToxODoxMyAqL1xyXG5cclxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XHJcblxyXG4gICAgaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XHJcblxyXG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuICAgICAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcclxuXHJcbiAgICAgICAgLy8gTm9kZS9Db21tb25KU1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xyXG4gICAgICAgIHdpbmRvdy5ub1VpU2xpZGVyID0gZmFjdG9yeSgpO1xyXG4gICAgfVxyXG5cclxufShmdW5jdGlvbiggKXtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR2YXIgVkVSU0lPTiA9ICcxMS4xLjAnO1xyXG5cclxuXG5cdGZ1bmN0aW9uIGlzVmFsaWRGb3JtYXR0ZXIgKCBlbnRyeSApIHtcblx0XHRyZXR1cm4gdHlwZW9mIGVudHJ5ID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgZW50cnkudG8gPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGVudHJ5LmZyb20gPT09ICdmdW5jdGlvbic7XG5cdH1cblxuXHRmdW5jdGlvbiByZW1vdmVFbGVtZW50ICggZWwgKSB7XG5cdFx0ZWwucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChlbCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpc1NldCAoIHZhbHVlICkge1xuXHRcdHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gQmluZGFibGUgdmVyc2lvblxuXHRmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdCAoIGUgKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG5cblx0Ly8gUmVtb3ZlcyBkdXBsaWNhdGVzIGZyb20gYW4gYXJyYXkuXG5cdGZ1bmN0aW9uIHVuaXF1ZSAoIGFycmF5ICkge1xuXHRcdHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24oYSl7XG5cdFx0XHRyZXR1cm4gIXRoaXNbYV0gPyB0aGlzW2FdID0gdHJ1ZSA6IGZhbHNlO1xuXHRcdH0sIHt9KTtcblx0fVxuXG5cdC8vIFJvdW5kIGEgdmFsdWUgdG8gdGhlIGNsb3Nlc3QgJ3RvJy5cblx0ZnVuY3Rpb24gY2xvc2VzdCAoIHZhbHVlLCB0byApIHtcblx0XHRyZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAvIHRvKSAqIHRvO1xuXHR9XG5cblx0Ly8gQ3VycmVudCBwb3NpdGlvbiBvZiBhbiBlbGVtZW50IHJlbGF0aXZlIHRvIHRoZSBkb2N1bWVudC5cblx0ZnVuY3Rpb24gb2Zmc2V0ICggZWxlbSwgb3JpZW50YXRpb24gKSB7XG5cblx0XHR2YXIgcmVjdCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0dmFyIGRvYyA9IGVsZW0ub3duZXJEb2N1bWVudDtcblx0XHR2YXIgZG9jRWxlbSA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0dmFyIHBhZ2VPZmZzZXQgPSBnZXRQYWdlT2Zmc2V0KGRvYyk7XG5cblx0XHQvLyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgY29udGFpbnMgbGVmdCBzY3JvbGwgaW4gQ2hyb21lIG9uIEFuZHJvaWQuXG5cdFx0Ly8gSSBoYXZlbid0IGZvdW5kIGEgZmVhdHVyZSBkZXRlY3Rpb24gdGhhdCBwcm92ZXMgdGhpcy4gV29yc3QgY2FzZVxuXHRcdC8vIHNjZW5hcmlvIG9uIG1pcy1tYXRjaDogdGhlICd0YXAnIGZlYXR1cmUgb24gaG9yaXpvbnRhbCBzbGlkZXJzIGJyZWFrcy5cblx0XHRpZiAoIC93ZWJraXQuKkNocm9tZS4qTW9iaWxlL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSApIHtcblx0XHRcdHBhZ2VPZmZzZXQueCA9IDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9yaWVudGF0aW9uID8gKHJlY3QudG9wICsgcGFnZU9mZnNldC55IC0gZG9jRWxlbS5jbGllbnRUb3ApIDogKHJlY3QubGVmdCArIHBhZ2VPZmZzZXQueCAtIGRvY0VsZW0uY2xpZW50TGVmdCk7XG5cdH1cblxuXHQvLyBDaGVja3Mgd2hldGhlciBhIHZhbHVlIGlzIG51bWVyaWNhbC5cblx0ZnVuY3Rpb24gaXNOdW1lcmljICggYSApIHtcblx0XHRyZXR1cm4gdHlwZW9mIGEgPT09ICdudW1iZXInICYmICFpc05hTiggYSApICYmIGlzRmluaXRlKCBhICk7XG5cdH1cblxuXHQvLyBTZXRzIGEgY2xhc3MgYW5kIHJlbW92ZXMgaXQgYWZ0ZXIgW2R1cmF0aW9uXSBtcy5cblx0ZnVuY3Rpb24gYWRkQ2xhc3NGb3IgKCBlbGVtZW50LCBjbGFzc05hbWUsIGR1cmF0aW9uICkge1xuXHRcdGlmIChkdXJhdGlvbiA+IDApIHtcblx0XHRhZGRDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRyZW1vdmVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpO1xuXHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdH1cblx0fVxuXG5cdC8vIExpbWl0cyBhIHZhbHVlIHRvIDAgLSAxMDBcblx0ZnVuY3Rpb24gbGltaXQgKCBhICkge1xuXHRcdHJldHVybiBNYXRoLm1heChNYXRoLm1pbihhLCAxMDApLCAwKTtcblx0fVxuXG5cdC8vIFdyYXBzIGEgdmFyaWFibGUgYXMgYW4gYXJyYXksIGlmIGl0IGlzbid0IG9uZSB5ZXQuXG5cdC8vIE5vdGUgdGhhdCBhbiBpbnB1dCBhcnJheSBpcyByZXR1cm5lZCBieSByZWZlcmVuY2UhXG5cdGZ1bmN0aW9uIGFzQXJyYXkgKCBhICkge1xuXHRcdHJldHVybiBBcnJheS5pc0FycmF5KGEpID8gYSA6IFthXTtcblx0fVxuXG5cdC8vIENvdW50cyBkZWNpbWFsc1xuXHRmdW5jdGlvbiBjb3VudERlY2ltYWxzICggbnVtU3RyICkge1xuXHRcdG51bVN0ciA9IFN0cmluZyhudW1TdHIpO1xuXHRcdHZhciBwaWVjZXMgPSBudW1TdHIuc3BsaXQoXCIuXCIpO1xuXHRcdHJldHVybiBwaWVjZXMubGVuZ3RoID4gMSA/IHBpZWNlc1sxXS5sZW5ndGggOiAwO1xuXHR9XG5cblx0Ly8gaHR0cDovL3lvdW1pZ2h0bm90bmVlZGpxdWVyeS5jb20vI2FkZF9jbGFzc1xuXHRmdW5jdGlvbiBhZGRDbGFzcyAoIGVsLCBjbGFzc05hbWUgKSB7XG5cdFx0aWYgKCBlbC5jbGFzc0xpc3QgKSB7XG5cdFx0XHRlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsLmNsYXNzTmFtZSArPSAnICcgKyBjbGFzc05hbWU7XG5cdFx0fVxuXHR9XG5cblx0Ly8gaHR0cDovL3lvdW1pZ2h0bm90bmVlZGpxdWVyeS5jb20vI3JlbW92ZV9jbGFzc1xuXHRmdW5jdGlvbiByZW1vdmVDbGFzcyAoIGVsLCBjbGFzc05hbWUgKSB7XG5cdFx0aWYgKCBlbC5jbGFzc0xpc3QgKSB7XG5cdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyhefFxcXFxiKScgKyBjbGFzc05hbWUuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKFxcXFxifCQpJywgJ2dpJyksICcgJyk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gaHR0cHM6Ly9wbGFpbmpzLmNvbS9qYXZhc2NyaXB0L2F0dHJpYnV0ZXMvYWRkaW5nLXJlbW92aW5nLWFuZC10ZXN0aW5nLWZvci1jbGFzc2VzLTkvXG5cdGZ1bmN0aW9uIGhhc0NsYXNzICggZWwsIGNsYXNzTmFtZSApIHtcblx0XHRyZXR1cm4gZWwuY2xhc3NMaXN0ID8gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkgOiBuZXcgUmVnRXhwKCdcXFxcYicgKyBjbGFzc05hbWUgKyAnXFxcXGInKS50ZXN0KGVsLmNsYXNzTmFtZSk7XG5cdH1cblxuXHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93L3Njcm9sbFkjTm90ZXNcblx0ZnVuY3Rpb24gZ2V0UGFnZU9mZnNldCAoIGRvYyApIHtcblxuXHRcdHZhciBzdXBwb3J0UGFnZU9mZnNldCA9IHdpbmRvdy5wYWdlWE9mZnNldCAhPT0gdW5kZWZpbmVkO1xuXHRcdHZhciBpc0NTUzFDb21wYXQgPSAoKGRvYy5jb21wYXRNb2RlIHx8IFwiXCIpID09PSBcIkNTUzFDb21wYXRcIik7XG5cdFx0dmFyIHggPSBzdXBwb3J0UGFnZU9mZnNldCA/IHdpbmRvdy5wYWdlWE9mZnNldCA6IGlzQ1NTMUNvbXBhdCA/IGRvYy5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCA6IGRvYy5ib2R5LnNjcm9sbExlZnQ7XG5cdFx0dmFyIHkgPSBzdXBwb3J0UGFnZU9mZnNldCA/IHdpbmRvdy5wYWdlWU9mZnNldCA6IGlzQ1NTMUNvbXBhdCA/IGRvYy5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIDogZG9jLmJvZHkuc2Nyb2xsVG9wO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHg6IHgsXG5cdFx0XHR5OiB5XG5cdFx0fTtcblx0fVxuXHJcblx0Ly8gd2UgcHJvdmlkZSBhIGZ1bmN0aW9uIHRvIGNvbXB1dGUgY29uc3RhbnRzIGluc3RlYWRcclxuXHQvLyBvZiBhY2Nlc3Npbmcgd2luZG93LiogYXMgc29vbiBhcyB0aGUgbW9kdWxlIG5lZWRzIGl0XHJcblx0Ly8gc28gdGhhdCB3ZSBkbyBub3QgY29tcHV0ZSBhbnl0aGluZyBpZiBub3QgbmVlZGVkXHJcblx0ZnVuY3Rpb24gZ2V0QWN0aW9ucyAoICkge1xyXG5cclxuXHRcdC8vIERldGVybWluZSB0aGUgZXZlbnRzIHRvIGJpbmQuIElFMTEgaW1wbGVtZW50cyBwb2ludGVyRXZlbnRzIHdpdGhvdXRcclxuXHRcdC8vIGEgcHJlZml4LCB3aGljaCBicmVha3MgY29tcGF0aWJpbGl0eSB3aXRoIHRoZSBJRTEwIGltcGxlbWVudGF0aW9uLlxyXG5cdFx0cmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQgPyB7XHJcblx0XHRcdHN0YXJ0OiAncG9pbnRlcmRvd24nLFxyXG5cdFx0XHRtb3ZlOiAncG9pbnRlcm1vdmUnLFxyXG5cdFx0XHRlbmQ6ICdwb2ludGVydXAnXHJcblx0XHR9IDogd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkID8ge1xyXG5cdFx0XHRzdGFydDogJ01TUG9pbnRlckRvd24nLFxyXG5cdFx0XHRtb3ZlOiAnTVNQb2ludGVyTW92ZScsXHJcblx0XHRcdGVuZDogJ01TUG9pbnRlclVwJ1xyXG5cdFx0fSA6IHtcclxuXHRcdFx0c3RhcnQ6ICdtb3VzZWRvd24gdG91Y2hzdGFydCcsXHJcblx0XHRcdG1vdmU6ICdtb3VzZW1vdmUgdG91Y2htb3ZlJyxcclxuXHRcdFx0ZW5kOiAnbW91c2V1cCB0b3VjaGVuZCdcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9FdmVudExpc3RlbmVyT3B0aW9ucy9ibG9iL2doLXBhZ2VzL2V4cGxhaW5lci5tZFxyXG5cdC8vIElzc3VlICM3ODVcclxuXHRmdW5jdGlvbiBnZXRTdXBwb3J0c1Bhc3NpdmUgKCApIHtcclxuXHJcblx0XHR2YXIgc3VwcG9ydHNQYXNzaXZlID0gZmFsc2U7XHJcblxyXG5cdFx0dHJ5IHtcclxuXHJcblx0XHRcdHZhciBvcHRzID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAncGFzc2l2ZScsIHtcclxuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0c3VwcG9ydHNQYXNzaXZlID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Rlc3QnLCBudWxsLCBvcHRzKTtcclxuXHJcblx0XHR9IGNhdGNoIChlKSB7fVxyXG5cclxuXHRcdHJldHVybiBzdXBwb3J0c1Bhc3NpdmU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRTdXBwb3J0c1RvdWNoQWN0aW9uTm9uZSAoICkge1xyXG5cdFx0cmV0dXJuIHdpbmRvdy5DU1MgJiYgQ1NTLnN1cHBvcnRzICYmIENTUy5zdXBwb3J0cygndG91Y2gtYWN0aW9uJywgJ25vbmUnKTtcclxuXHR9XHJcblxyXG5cclxuLy8gVmFsdWUgY2FsY3VsYXRpb25cclxuXHJcblx0Ly8gRGV0ZXJtaW5lIHRoZSBzaXplIG9mIGEgc3ViLXJhbmdlIGluIHJlbGF0aW9uIHRvIGEgZnVsbCByYW5nZS5cclxuXHRmdW5jdGlvbiBzdWJSYW5nZVJhdGlvICggcGEsIHBiICkge1xyXG5cdFx0cmV0dXJuICgxMDAgLyAocGIgLSBwYSkpO1xyXG5cdH1cclxuXHJcblx0Ly8gKHBlcmNlbnRhZ2UpIEhvdyBtYW55IHBlcmNlbnQgaXMgdGhpcyB2YWx1ZSBvZiB0aGlzIHJhbmdlP1xyXG5cdGZ1bmN0aW9uIGZyb21QZXJjZW50YWdlICggcmFuZ2UsIHZhbHVlICkge1xyXG5cdFx0cmV0dXJuICh2YWx1ZSAqIDEwMCkgLyAoIHJhbmdlWzFdIC0gcmFuZ2VbMF0gKTtcclxuXHR9XHJcblxyXG5cdC8vIChwZXJjZW50YWdlKSBXaGVyZSBpcyB0aGlzIHZhbHVlIG9uIHRoaXMgcmFuZ2U/XHJcblx0ZnVuY3Rpb24gdG9QZXJjZW50YWdlICggcmFuZ2UsIHZhbHVlICkge1xyXG5cdFx0cmV0dXJuIGZyb21QZXJjZW50YWdlKCByYW5nZSwgcmFuZ2VbMF0gPCAwID9cclxuXHRcdFx0dmFsdWUgKyBNYXRoLmFicyhyYW5nZVswXSkgOlxyXG5cdFx0XHRcdHZhbHVlIC0gcmFuZ2VbMF0gKTtcclxuXHR9XHJcblxyXG5cdC8vICh2YWx1ZSkgSG93IG11Y2ggaXMgdGhpcyBwZXJjZW50YWdlIG9uIHRoaXMgcmFuZ2U/XHJcblx0ZnVuY3Rpb24gaXNQZXJjZW50YWdlICggcmFuZ2UsIHZhbHVlICkge1xyXG5cdFx0cmV0dXJuICgodmFsdWUgKiAoIHJhbmdlWzFdIC0gcmFuZ2VbMF0gKSkgLyAxMDApICsgcmFuZ2VbMF07XHJcblx0fVxyXG5cclxuXHJcbi8vIFJhbmdlIGNvbnZlcnNpb25cclxuXHJcblx0ZnVuY3Rpb24gZ2V0SiAoIHZhbHVlLCBhcnIgKSB7XHJcblxyXG5cdFx0dmFyIGogPSAxO1xyXG5cclxuXHRcdHdoaWxlICggdmFsdWUgPj0gYXJyW2pdICl7XHJcblx0XHRcdGogKz0gMTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gajtcclxuXHR9XHJcblxyXG5cdC8vIChwZXJjZW50YWdlKSBJbnB1dCBhIHZhbHVlLCBmaW5kIHdoZXJlLCBvbiBhIHNjYWxlIG9mIDAtMTAwLCBpdCBhcHBsaWVzLlxyXG5cdGZ1bmN0aW9uIHRvU3RlcHBpbmcgKCB4VmFsLCB4UGN0LCB2YWx1ZSApIHtcclxuXHJcblx0XHRpZiAoIHZhbHVlID49IHhWYWwuc2xpY2UoLTEpWzBdICl7XHJcblx0XHRcdHJldHVybiAxMDA7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGogPSBnZXRKKCB2YWx1ZSwgeFZhbCApO1xyXG5cdFx0dmFyIHZhID0geFZhbFtqLTFdO1xyXG5cdFx0dmFyIHZiID0geFZhbFtqXTtcclxuXHRcdHZhciBwYSA9IHhQY3Rbai0xXTtcclxuXHRcdHZhciBwYiA9IHhQY3Rbal07XHJcblxyXG5cdFx0cmV0dXJuIHBhICsgKHRvUGVyY2VudGFnZShbdmEsIHZiXSwgdmFsdWUpIC8gc3ViUmFuZ2VSYXRpbyAocGEsIHBiKSk7XHJcblx0fVxyXG5cclxuXHQvLyAodmFsdWUpIElucHV0IGEgcGVyY2VudGFnZSwgZmluZCB3aGVyZSBpdCBpcyBvbiB0aGUgc3BlY2lmaWVkIHJhbmdlLlxyXG5cdGZ1bmN0aW9uIGZyb21TdGVwcGluZyAoIHhWYWwsIHhQY3QsIHZhbHVlICkge1xyXG5cclxuXHRcdC8vIFRoZXJlIGlzIG5vIHJhbmdlIGdyb3VwIHRoYXQgZml0cyAxMDBcclxuXHRcdGlmICggdmFsdWUgPj0gMTAwICl7XHJcblx0XHRcdHJldHVybiB4VmFsLnNsaWNlKC0xKVswXTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaiA9IGdldEooIHZhbHVlLCB4UGN0ICk7XHJcblx0XHR2YXIgdmEgPSB4VmFsW2otMV07XHJcblx0XHR2YXIgdmIgPSB4VmFsW2pdO1xyXG5cdFx0dmFyIHBhID0geFBjdFtqLTFdO1xyXG5cdFx0dmFyIHBiID0geFBjdFtqXTtcclxuXHJcblx0XHRyZXR1cm4gaXNQZXJjZW50YWdlKFt2YSwgdmJdLCAodmFsdWUgLSBwYSkgKiBzdWJSYW5nZVJhdGlvIChwYSwgcGIpKTtcclxuXHR9XHJcblxyXG5cdC8vIChwZXJjZW50YWdlKSBHZXQgdGhlIHN0ZXAgdGhhdCBhcHBsaWVzIGF0IGEgY2VydGFpbiB2YWx1ZS5cclxuXHRmdW5jdGlvbiBnZXRTdGVwICggeFBjdCwgeFN0ZXBzLCBzbmFwLCB2YWx1ZSApIHtcclxuXHJcblx0XHRpZiAoIHZhbHVlID09PSAxMDAgKSB7XHJcblx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaiA9IGdldEooIHZhbHVlLCB4UGN0ICk7XHJcblx0XHR2YXIgYSA9IHhQY3Rbai0xXTtcclxuXHRcdHZhciBiID0geFBjdFtqXTtcclxuXHJcblx0XHQvLyBJZiAnc25hcCcgaXMgc2V0LCBzdGVwcyBhcmUgdXNlZCBhcyBmaXhlZCBwb2ludHMgb24gdGhlIHNsaWRlci5cclxuXHRcdGlmICggc25hcCApIHtcclxuXHJcblx0XHRcdC8vIEZpbmQgdGhlIGNsb3Nlc3QgcG9zaXRpb24sIGEgb3IgYi5cclxuXHRcdFx0aWYgKCh2YWx1ZSAtIGEpID4gKChiLWEpLzIpKXtcclxuXHRcdFx0XHRyZXR1cm4gYjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGE7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCAheFN0ZXBzW2otMV0gKXtcclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB4UGN0W2otMV0gKyBjbG9zZXN0KFxyXG5cdFx0XHR2YWx1ZSAtIHhQY3Rbai0xXSxcclxuXHRcdFx0eFN0ZXBzW2otMV1cclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHJcbi8vIEVudHJ5IHBhcnNpbmdcclxuXHJcblx0ZnVuY3Rpb24gaGFuZGxlRW50cnlQb2ludCAoIGluZGV4LCB2YWx1ZSwgdGhhdCApIHtcclxuXHJcblx0XHR2YXIgcGVyY2VudGFnZTtcclxuXHJcblx0XHQvLyBXcmFwIG51bWVyaWNhbCBpbnB1dCBpbiBhbiBhcnJheS5cclxuXHRcdGlmICggdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiICkge1xyXG5cdFx0XHR2YWx1ZSA9IFt2YWx1ZV07XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVqZWN0IGFueSBpbnZhbGlkIGlucHV0LCBieSB0ZXN0aW5nIHdoZXRoZXIgdmFsdWUgaXMgYW4gYXJyYXkuXHJcblx0XHRpZiAoICFBcnJheS5pc0FycmF5KHZhbHVlKSApe1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdyYW5nZScgY29udGFpbnMgaW52YWxpZCB2YWx1ZS5cIik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ292ZXJ0IG1pbi9tYXggc3ludGF4IHRvIDAgYW5kIDEwMC5cclxuXHRcdGlmICggaW5kZXggPT09ICdtaW4nICkge1xyXG5cdFx0XHRwZXJjZW50YWdlID0gMDtcclxuXHRcdH0gZWxzZSBpZiAoIGluZGV4ID09PSAnbWF4JyApIHtcclxuXHRcdFx0cGVyY2VudGFnZSA9IDEwMDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHBlcmNlbnRhZ2UgPSBwYXJzZUZsb2F0KCBpbmRleCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENoZWNrIGZvciBjb3JyZWN0IGlucHV0LlxyXG5cdFx0aWYgKCAhaXNOdW1lcmljKCBwZXJjZW50YWdlICkgfHwgIWlzTnVtZXJpYyggdmFsdWVbMF0gKSApIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAncmFuZ2UnIHZhbHVlIGlzbid0IG51bWVyaWMuXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFN0b3JlIHZhbHVlcy5cclxuXHRcdHRoYXQueFBjdC5wdXNoKCBwZXJjZW50YWdlICk7XHJcblx0XHR0aGF0LnhWYWwucHVzaCggdmFsdWVbMF0gKTtcclxuXHJcblx0XHQvLyBOYU4gd2lsbCBldmFsdWF0ZSB0byBmYWxzZSB0b28sIGJ1dCB0byBrZWVwXHJcblx0XHQvLyBsb2dnaW5nIGNsZWFyLCBzZXQgc3RlcCBleHBsaWNpdGx5LiBNYWtlIHN1cmVcclxuXHRcdC8vIG5vdCB0byBvdmVycmlkZSB0aGUgJ3N0ZXAnIHNldHRpbmcgd2l0aCBmYWxzZS5cclxuXHRcdGlmICggIXBlcmNlbnRhZ2UgKSB7XHJcblx0XHRcdGlmICggIWlzTmFOKCB2YWx1ZVsxXSApICkge1xyXG5cdFx0XHRcdHRoYXQueFN0ZXBzWzBdID0gdmFsdWVbMV07XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoYXQueFN0ZXBzLnB1c2goIGlzTmFOKHZhbHVlWzFdKSA/IGZhbHNlIDogdmFsdWVbMV0gKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGF0LnhIaWdoZXN0Q29tcGxldGVTdGVwLnB1c2goMCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBoYW5kbGVTdGVwUG9pbnQgKCBpLCBuLCB0aGF0ICkge1xyXG5cclxuXHRcdC8vIElnbm9yZSAnZmFsc2UnIHN0ZXBwaW5nLlxyXG5cdFx0aWYgKCAhbiApIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRmFjdG9yIHRvIHJhbmdlIHJhdGlvXHJcblx0XHR0aGF0LnhTdGVwc1tpXSA9IGZyb21QZXJjZW50YWdlKFt0aGF0LnhWYWxbaV0sIHRoYXQueFZhbFtpKzFdXSwgbikgLyBzdWJSYW5nZVJhdGlvKHRoYXQueFBjdFtpXSwgdGhhdC54UGN0W2krMV0pO1xyXG5cclxuXHRcdHZhciB0b3RhbFN0ZXBzID0gKHRoYXQueFZhbFtpKzFdIC0gdGhhdC54VmFsW2ldKSAvIHRoYXQueE51bVN0ZXBzW2ldO1xyXG5cdFx0dmFyIGhpZ2hlc3RTdGVwID0gTWF0aC5jZWlsKE51bWJlcih0b3RhbFN0ZXBzLnRvRml4ZWQoMykpIC0gMSk7XHJcblx0XHR2YXIgc3RlcCA9IHRoYXQueFZhbFtpXSArICh0aGF0LnhOdW1TdGVwc1tpXSAqIGhpZ2hlc3RTdGVwKTtcclxuXHJcblx0XHR0aGF0LnhIaWdoZXN0Q29tcGxldGVTdGVwW2ldID0gc3RlcDtcclxuXHR9XHJcblxyXG5cclxuLy8gSW50ZXJmYWNlXHJcblxyXG5cdGZ1bmN0aW9uIFNwZWN0cnVtICggZW50cnksIHNuYXAsIHNpbmdsZVN0ZXAgKSB7XHJcblxyXG5cdFx0dGhpcy54UGN0ID0gW107XHJcblx0XHR0aGlzLnhWYWwgPSBbXTtcclxuXHRcdHRoaXMueFN0ZXBzID0gWyBzaW5nbGVTdGVwIHx8IGZhbHNlIF07XHJcblx0XHR0aGlzLnhOdW1TdGVwcyA9IFsgZmFsc2UgXTtcclxuXHRcdHRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXAgPSBbXTtcclxuXHJcblx0XHR0aGlzLnNuYXAgPSBzbmFwO1xyXG5cclxuXHRcdHZhciBpbmRleDtcclxuXHRcdHZhciBvcmRlcmVkID0gW107IC8vIFswLCAnbWluJ10sIFsxLCAnNTAlJ10sIFsyLCAnbWF4J11cclxuXHJcblx0XHQvLyBNYXAgdGhlIG9iamVjdCBrZXlzIHRvIGFuIGFycmF5LlxyXG5cdFx0Zm9yICggaW5kZXggaW4gZW50cnkgKSB7XHJcblx0XHRcdGlmICggZW50cnkuaGFzT3duUHJvcGVydHkoaW5kZXgpICkge1xyXG5cdFx0XHRcdG9yZGVyZWQucHVzaChbZW50cnlbaW5kZXhdLCBpbmRleF0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU29ydCBhbGwgZW50cmllcyBieSB2YWx1ZSAobnVtZXJpYyBzb3J0KS5cclxuXHRcdGlmICggb3JkZXJlZC5sZW5ndGggJiYgdHlwZW9mIG9yZGVyZWRbMF1bMF0gPT09IFwib2JqZWN0XCIgKSB7XHJcblx0XHRcdG9yZGVyZWQuc29ydChmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhWzBdWzBdIC0gYlswXVswXTsgfSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRvcmRlcmVkLnNvcnQoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYVswXSAtIGJbMF07IH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBDb252ZXJ0IGFsbCBlbnRyaWVzIHRvIHN1YnJhbmdlcy5cclxuXHRcdGZvciAoIGluZGV4ID0gMDsgaW5kZXggPCBvcmRlcmVkLmxlbmd0aDsgaW5kZXgrKyApIHtcclxuXHRcdFx0aGFuZGxlRW50cnlQb2ludChvcmRlcmVkW2luZGV4XVsxXSwgb3JkZXJlZFtpbmRleF1bMF0sIHRoaXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFN0b3JlIHRoZSBhY3R1YWwgc3RlcCB2YWx1ZXMuXHJcblx0XHQvLyB4U3RlcHMgaXMgc29ydGVkIGluIHRoZSBzYW1lIG9yZGVyIGFzIHhQY3QgYW5kIHhWYWwuXHJcblx0XHR0aGlzLnhOdW1TdGVwcyA9IHRoaXMueFN0ZXBzLnNsaWNlKDApO1xyXG5cclxuXHRcdC8vIENvbnZlcnQgYWxsIG51bWVyaWMgc3RlcHMgdG8gdGhlIHBlcmNlbnRhZ2Ugb2YgdGhlIHN1YnJhbmdlIHRoZXkgcmVwcmVzZW50LlxyXG5cdFx0Zm9yICggaW5kZXggPSAwOyBpbmRleCA8IHRoaXMueE51bVN0ZXBzLmxlbmd0aDsgaW5kZXgrKyApIHtcclxuXHRcdFx0aGFuZGxlU3RlcFBvaW50KGluZGV4LCB0aGlzLnhOdW1TdGVwc1tpbmRleF0sIHRoaXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0U3BlY3RydW0ucHJvdG90eXBlLmdldE1hcmdpbiA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XHJcblxyXG5cdFx0dmFyIHN0ZXAgPSB0aGlzLnhOdW1TdGVwc1swXTtcclxuXHJcblx0XHRpZiAoIHN0ZXAgJiYgKCh2YWx1ZSAvIHN0ZXApICUgMSkgIT09IDAgKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ2xpbWl0JywgJ21hcmdpbicgYW5kICdwYWRkaW5nJyBtdXN0IGJlIGRpdmlzaWJsZSBieSBzdGVwLlwiKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy54UGN0Lmxlbmd0aCA9PT0gMiA/IGZyb21QZXJjZW50YWdlKHRoaXMueFZhbCwgdmFsdWUpIDogZmFsc2U7XHJcblx0fTtcclxuXHJcblx0U3BlY3RydW0ucHJvdG90eXBlLnRvU3RlcHBpbmcgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xyXG5cclxuXHRcdHZhbHVlID0gdG9TdGVwcGluZyggdGhpcy54VmFsLCB0aGlzLnhQY3QsIHZhbHVlICk7XHJcblxyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdH07XHJcblxyXG5cdFNwZWN0cnVtLnByb3RvdHlwZS5mcm9tU3RlcHBpbmcgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xyXG5cclxuXHRcdHJldHVybiBmcm9tU3RlcHBpbmcoIHRoaXMueFZhbCwgdGhpcy54UGN0LCB2YWx1ZSApO1xyXG5cdH07XHJcblxyXG5cdFNwZWN0cnVtLnByb3RvdHlwZS5nZXRTdGVwID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcclxuXHJcblx0XHR2YWx1ZSA9IGdldFN0ZXAodGhpcy54UGN0LCB0aGlzLnhTdGVwcywgdGhpcy5zbmFwLCB2YWx1ZSApO1xyXG5cclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHR9O1xyXG5cclxuXHRTcGVjdHJ1bS5wcm90b3R5cGUuZ2V0TmVhcmJ5U3RlcHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xyXG5cclxuXHRcdHZhciBqID0gZ2V0Sih2YWx1ZSwgdGhpcy54UGN0KTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRzdGVwQmVmb3JlOiB7IHN0YXJ0VmFsdWU6IHRoaXMueFZhbFtqLTJdLCBzdGVwOiB0aGlzLnhOdW1TdGVwc1tqLTJdLCBoaWdoZXN0U3RlcDogdGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtqLTJdIH0sXHJcblx0XHRcdHRoaXNTdGVwOiB7IHN0YXJ0VmFsdWU6IHRoaXMueFZhbFtqLTFdLCBzdGVwOiB0aGlzLnhOdW1TdGVwc1tqLTFdLCBoaWdoZXN0U3RlcDogdGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtqLTFdIH0sXHJcblx0XHRcdHN0ZXBBZnRlcjogeyBzdGFydFZhbHVlOiB0aGlzLnhWYWxbai0wXSwgc3RlcDogdGhpcy54TnVtU3RlcHNbai0wXSwgaGlnaGVzdFN0ZXA6IHRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXBbai0wXSB9XHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdFNwZWN0cnVtLnByb3RvdHlwZS5jb3VudFN0ZXBEZWNpbWFscyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBzdGVwRGVjaW1hbHMgPSB0aGlzLnhOdW1TdGVwcy5tYXAoY291bnREZWNpbWFscyk7XHJcblx0XHRyZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgc3RlcERlY2ltYWxzKTtcclxuXHR9O1xyXG5cclxuXHQvLyBPdXRzaWRlIHRlc3RpbmdcclxuXHRTcGVjdHJ1bS5wcm90b3R5cGUuY29udmVydCA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRTdGVwKHRoaXMudG9TdGVwcGluZyh2YWx1ZSkpO1xyXG5cdH07XHJcblxyXG4vKlx0RXZlcnkgaW5wdXQgb3B0aW9uIGlzIHRlc3RlZCBhbmQgcGFyc2VkLiBUaGlzJ2xsIHByZXZlbnRcblx0ZW5kbGVzcyB2YWxpZGF0aW9uIGluIGludGVybmFsIG1ldGhvZHMuIFRoZXNlIHRlc3RzIGFyZVxuXHRzdHJ1Y3R1cmVkIHdpdGggYW4gaXRlbSBmb3IgZXZlcnkgb3B0aW9uIGF2YWlsYWJsZS4gQW5cblx0b3B0aW9uIGNhbiBiZSBtYXJrZWQgYXMgcmVxdWlyZWQgYnkgc2V0dGluZyB0aGUgJ3InIGZsYWcuXG5cdFRoZSB0ZXN0aW5nIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuXHRcdC0gVGhlIHByb3ZpZGVkIHZhbHVlIGZvciB0aGUgb3B0aW9uO1xuXHRcdC0gQSByZWZlcmVuY2UgdG8gdGhlIG9wdGlvbnMgb2JqZWN0O1xuXHRcdC0gVGhlIG5hbWUgZm9yIHRoZSBvcHRpb247XG5cblx0VGhlIHRlc3RpbmcgZnVuY3Rpb24gcmV0dXJucyBmYWxzZSB3aGVuIGFuIGVycm9yIGlzIGRldGVjdGVkLFxuXHRvciB0cnVlIHdoZW4gZXZlcnl0aGluZyBpcyBPSy4gSXQgY2FuIGFsc28gbW9kaWZ5IHRoZSBvcHRpb25cblx0b2JqZWN0LCB0byBtYWtlIHN1cmUgYWxsIHZhbHVlcyBjYW4gYmUgY29ycmVjdGx5IGxvb3BlZCBlbHNld2hlcmUuICovXG5cblx0dmFyIGRlZmF1bHRGb3JtYXR0ZXIgPSB7ICd0byc6IGZ1bmN0aW9uKCB2YWx1ZSApe1xuXHRcdHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlLnRvRml4ZWQoMik7XG5cdH0sICdmcm9tJzogTnVtYmVyIH07XG5cblx0ZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQgKCBlbnRyeSApIHtcblxuXHRcdC8vIEFueSBvYmplY3Qgd2l0aCBhIHRvIGFuZCBmcm9tIG1ldGhvZCBpcyBzdXBwb3J0ZWQuXG5cdFx0aWYgKCBpc1ZhbGlkRm9ybWF0dGVyKGVudHJ5KSApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ2Zvcm1hdCcgcmVxdWlyZXMgJ3RvJyBhbmQgJ2Zyb20nIG1ldGhvZHMuXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gdGVzdFN0ZXAgKCBwYXJzZWQsIGVudHJ5ICkge1xuXG5cdFx0aWYgKCAhaXNOdW1lcmljKCBlbnRyeSApICkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAnc3RlcCcgaXMgbm90IG51bWVyaWMuXCIpO1xuXHRcdH1cblxuXHRcdC8vIFRoZSBzdGVwIG9wdGlvbiBjYW4gc3RpbGwgYmUgdXNlZCB0byBzZXQgc3RlcHBpbmdcblx0XHQvLyBmb3IgbGluZWFyIHNsaWRlcnMuIE92ZXJ3cml0dGVuIGlmIHNldCBpbiAncmFuZ2UnLlxuXHRcdHBhcnNlZC5zaW5nbGVTdGVwID0gZW50cnk7XG5cdH1cblxuXHRmdW5jdGlvbiB0ZXN0UmFuZ2UgKCBwYXJzZWQsIGVudHJ5ICkge1xuXG5cdFx0Ly8gRmlsdGVyIGluY29ycmVjdCBpbnB1dC5cblx0XHRpZiAoIHR5cGVvZiBlbnRyeSAhPT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheShlbnRyeSkgKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdyYW5nZScgaXMgbm90IGFuIG9iamVjdC5cIik7XG5cdFx0fVxuXG5cdFx0Ly8gQ2F0Y2ggbWlzc2luZyBzdGFydCBvciBlbmQuXG5cdFx0aWYgKCBlbnRyeS5taW4gPT09IHVuZGVmaW5lZCB8fCBlbnRyeS5tYXggPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogTWlzc2luZyAnbWluJyBvciAnbWF4JyBpbiAncmFuZ2UnLlwiKTtcblx0XHR9XG5cblx0XHQvLyBDYXRjaCBlcXVhbCBzdGFydCBvciBlbmQuXG5cdFx0aWYgKCBlbnRyeS5taW4gPT09IGVudHJ5Lm1heCApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ3JhbmdlJyAnbWluJyBhbmQgJ21heCcgY2Fubm90IGJlIGVxdWFsLlwiKTtcblx0XHR9XG5cblx0XHRwYXJzZWQuc3BlY3RydW0gPSBuZXcgU3BlY3RydW0oZW50cnksIHBhcnNlZC5zbmFwLCBwYXJzZWQuc2luZ2xlU3RlcCk7XG5cdH1cblxuXHRmdW5jdGlvbiB0ZXN0U3RhcnQgKCBwYXJzZWQsIGVudHJ5ICkge1xuXG5cdFx0ZW50cnkgPSBhc0FycmF5KGVudHJ5KTtcblxuXHRcdC8vIFZhbGlkYXRlIGlucHV0LiBWYWx1ZXMgYXJlbid0IHRlc3RlZCwgYXMgdGhlIHB1YmxpYyAudmFsIG1ldGhvZFxuXHRcdC8vIHdpbGwgYWx3YXlzIHByb3ZpZGUgYSB2YWxpZCBsb2NhdGlvbi5cblx0XHRpZiAoICFBcnJheS5pc0FycmF5KCBlbnRyeSApIHx8ICFlbnRyeS5sZW5ndGggKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdzdGFydCcgb3B0aW9uIGlzIGluY29ycmVjdC5cIik7XG5cdFx0fVxuXG5cdFx0Ly8gU3RvcmUgdGhlIG51bWJlciBvZiBoYW5kbGVzLlxuXHRcdHBhcnNlZC5oYW5kbGVzID0gZW50cnkubGVuZ3RoO1xuXG5cdFx0Ly8gV2hlbiB0aGUgc2xpZGVyIGlzIGluaXRpYWxpemVkLCB0aGUgLnZhbCBtZXRob2Qgd2lsbFxuXHRcdC8vIGJlIGNhbGxlZCB3aXRoIHRoZSBzdGFydCBvcHRpb25zLlxuXHRcdHBhcnNlZC5zdGFydCA9IGVudHJ5O1xuXHR9XG5cblx0ZnVuY3Rpb24gdGVzdFNuYXAgKCBwYXJzZWQsIGVudHJ5ICkge1xuXG5cdFx0Ly8gRW5mb3JjZSAxMDAlIHN0ZXBwaW5nIHdpdGhpbiBzdWJyYW5nZXMuXG5cdFx0cGFyc2VkLnNuYXAgPSBlbnRyeTtcblxuXHRcdGlmICggdHlwZW9mIGVudHJ5ICE9PSAnYm9vbGVhbicgKXtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ3NuYXAnIG9wdGlvbiBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gdGVzdEFuaW1hdGUgKCBwYXJzZWQsIGVudHJ5ICkge1xuXG5cdFx0Ly8gRW5mb3JjZSAxMDAlIHN0ZXBwaW5nIHdpdGhpbiBzdWJyYW5nZXMuXG5cdFx0cGFyc2VkLmFuaW1hdGUgPSBlbnRyeTtcblxuXHRcdGlmICggdHlwZW9mIGVudHJ5ICE9PSAnYm9vbGVhbicgKXtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ2FuaW1hdGUnIG9wdGlvbiBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gdGVzdEFuaW1hdGlvbkR1cmF0aW9uICggcGFyc2VkLCBlbnRyeSApIHtcblxuXHRcdHBhcnNlZC5hbmltYXRpb25EdXJhdGlvbiA9IGVudHJ5O1xuXG5cdFx0aWYgKCB0eXBlb2YgZW50cnkgIT09ICdudW1iZXInICl7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdhbmltYXRpb25EdXJhdGlvbicgb3B0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHRlc3RDb25uZWN0ICggcGFyc2VkLCBlbnRyeSApIHtcblxuXHRcdHZhciBjb25uZWN0ID0gW2ZhbHNlXTtcblx0XHR2YXIgaTtcblxuXHRcdC8vIE1hcCBsZWdhY3kgb3B0aW9uc1xuXHRcdGlmICggZW50cnkgPT09ICdsb3dlcicgKSB7XG5cdFx0XHRlbnRyeSA9IFt0cnVlLCBmYWxzZV07XG5cdFx0fVxuXG5cdFx0ZWxzZSBpZiAoIGVudHJ5ID09PSAndXBwZXInICkge1xuXHRcdFx0ZW50cnkgPSBbZmFsc2UsIHRydWVdO1xuXHRcdH1cblxuXHRcdC8vIEhhbmRsZSBib29sZWFuIG9wdGlvbnNcblx0XHRpZiAoIGVudHJ5ID09PSB0cnVlIHx8IGVudHJ5ID09PSBmYWxzZSApIHtcblxuXHRcdFx0Zm9yICggaSA9IDE7IGkgPCBwYXJzZWQuaGFuZGxlczsgaSsrICkge1xuXHRcdFx0XHRjb25uZWN0LnB1c2goZW50cnkpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25uZWN0LnB1c2goZmFsc2UpO1xuXHRcdH1cblxuXHRcdC8vIFJlamVjdCBpbnZhbGlkIGlucHV0XG5cdFx0ZWxzZSBpZiAoICFBcnJheS5pc0FycmF5KCBlbnRyeSApIHx8ICFlbnRyeS5sZW5ndGggfHwgZW50cnkubGVuZ3RoICE9PSBwYXJzZWQuaGFuZGxlcyArIDEgKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdjb25uZWN0JyBvcHRpb24gZG9lc24ndCBtYXRjaCBoYW5kbGUgY291bnQuXCIpO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXHRcdFx0Y29ubmVjdCA9IGVudHJ5O1xuXHRcdH1cblxuXHRcdHBhcnNlZC5jb25uZWN0ID0gY29ubmVjdDtcblx0fVxuXG5cdGZ1bmN0aW9uIHRlc3RPcmllbnRhdGlvbiAoIHBhcnNlZCwgZW50cnkgKSB7XG5cblx0XHQvLyBTZXQgb3JpZW50YXRpb24gdG8gYW4gYSBudW1lcmljYWwgdmFsdWUgZm9yIGVhc3lcblx0XHQvLyBhcnJheSBzZWxlY3Rpb24uXG5cdFx0c3dpdGNoICggZW50cnkgKXtcblx0XHRcdGNhc2UgJ2hvcml6b250YWwnOlxuXHRcdFx0XHRwYXJzZWQub3J0ID0gMDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICd2ZXJ0aWNhbCc6XG5cdFx0XHRcdHBhcnNlZC5vcnQgPSAxO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ29yaWVudGF0aW9uJyBvcHRpb24gaXMgaW52YWxpZC5cIik7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gdGVzdE1hcmdpbiAoIHBhcnNlZCwgZW50cnkgKSB7XG5cblx0XHRpZiAoICFpc051bWVyaWMoZW50cnkpICl7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdtYXJnaW4nIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMuXCIpO1xuXHRcdH1cblxuXHRcdC8vIElzc3VlICM1ODJcblx0XHRpZiAoIGVudHJ5ID09PSAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHBhcnNlZC5tYXJnaW4gPSBwYXJzZWQuc3BlY3RydW0uZ2V0TWFyZ2luKGVudHJ5KTtcblxuXHRcdGlmICggIXBhcnNlZC5tYXJnaW4gKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdtYXJnaW4nIG9wdGlvbiBpcyBvbmx5IHN1cHBvcnRlZCBvbiBsaW5lYXIgc2xpZGVycy5cIik7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gdGVzdExpbWl0ICggcGFyc2VkLCBlbnRyeSApIHtcblxuXHRcdGlmICggIWlzTnVtZXJpYyhlbnRyeSkgKXtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ2xpbWl0JyBvcHRpb24gbXVzdCBiZSBudW1lcmljLlwiKTtcblx0XHR9XG5cblx0XHRwYXJzZWQubGltaXQgPSBwYXJzZWQuc3BlY3RydW0uZ2V0TWFyZ2luKGVudHJ5KTtcblxuXHRcdGlmICggIXBhcnNlZC5saW1pdCB8fCBwYXJzZWQuaGFuZGxlcyA8IDIgKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdsaW1pdCcgb3B0aW9uIGlzIG9ubHkgc3VwcG9ydGVkIG9uIGxpbmVhciBzbGlkZXJzIHdpdGggMiBvciBtb3JlIGhhbmRsZXMuXCIpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHRlc3RQYWRkaW5nICggcGFyc2VkLCBlbnRyeSApIHtcblxuXHRcdGlmICggIWlzTnVtZXJpYyhlbnRyeSkgJiYgIUFycmF5LmlzQXJyYXkoZW50cnkpICl7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdwYWRkaW5nJyBvcHRpb24gbXVzdCBiZSBudW1lcmljIG9yIGFycmF5IG9mIGV4YWN0bHkgMiBudW1iZXJzLlwiKTtcblx0XHR9XG5cblx0XHRpZiAoIEFycmF5LmlzQXJyYXkoZW50cnkpICYmICEoZW50cnkubGVuZ3RoID09PSAyIHx8IGlzTnVtZXJpYyhlbnRyeVswXSkgfHwgaXNOdW1lcmljKGVudHJ5WzFdKSkgKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdwYWRkaW5nJyBvcHRpb24gbXVzdCBiZSBudW1lcmljIG9yIGFycmF5IG9mIGV4YWN0bHkgMiBudW1iZXJzLlwiKTtcblx0XHR9XG5cblx0XHRpZiAoIGVudHJ5ID09PSAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggIUFycmF5LmlzQXJyYXkoZW50cnkpICkge1xuXHRcdFx0ZW50cnkgPSBbZW50cnksIGVudHJ5XTtcblx0XHR9XG5cblx0XHQvLyAnZ2V0TWFyZ2luJyByZXR1cm5zIGZhbHNlIGZvciBpbnZhbGlkIHZhbHVlcy5cblx0XHRwYXJzZWQucGFkZGluZyA9IFtwYXJzZWQuc3BlY3RydW0uZ2V0TWFyZ2luKGVudHJ5WzBdKSwgcGFyc2VkLnNwZWN0cnVtLmdldE1hcmdpbihlbnRyeVsxXSldO1xuXG5cdFx0aWYgKCBwYXJzZWQucGFkZGluZ1swXSA9PT0gZmFsc2UgfHwgcGFyc2VkLnBhZGRpbmdbMV0gPT09IGZhbHNlICkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAncGFkZGluZycgb3B0aW9uIGlzIG9ubHkgc3VwcG9ydGVkIG9uIGxpbmVhciBzbGlkZXJzLlwiKTtcblx0XHR9XG5cblx0XHRpZiAoIHBhcnNlZC5wYWRkaW5nWzBdIDwgMCB8fCBwYXJzZWQucGFkZGluZ1sxXSA8IDAgKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdwYWRkaW5nJyBvcHRpb24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcihzKS5cIik7XG5cdFx0fVxuXG5cdFx0aWYgKCBwYXJzZWQucGFkZGluZ1swXSArIHBhcnNlZC5wYWRkaW5nWzFdID49IDEwMCApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IG5vdCBleGNlZWQgMTAwJSBvZiB0aGUgcmFuZ2UuXCIpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHRlc3REaXJlY3Rpb24gKCBwYXJzZWQsIGVudHJ5ICkge1xuXG5cdFx0Ly8gU2V0IGRpcmVjdGlvbiBhcyBhIG51bWVyaWNhbCB2YWx1ZSBmb3IgZWFzeSBwYXJzaW5nLlxuXHRcdC8vIEludmVydCBjb25uZWN0aW9uIGZvciBSVEwgc2xpZGVycywgc28gdGhhdCB0aGUgcHJvcGVyXG5cdFx0Ly8gaGFuZGxlcyBnZXQgdGhlIGNvbm5lY3QvYmFja2dyb3VuZCBjbGFzc2VzLlxuXHRcdHN3aXRjaCAoIGVudHJ5ICkge1xuXHRcdFx0Y2FzZSAnbHRyJzpcblx0XHRcdFx0cGFyc2VkLmRpciA9IDA7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAncnRsJzpcblx0XHRcdFx0cGFyc2VkLmRpciA9IDE7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAnZGlyZWN0aW9uJyBvcHRpb24gd2FzIG5vdCByZWNvZ25pemVkLlwiKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiB0ZXN0QmVoYXZpb3VyICggcGFyc2VkLCBlbnRyeSApIHtcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGUgaW5wdXQgaXMgYSBzdHJpbmcuXG5cdFx0aWYgKCB0eXBlb2YgZW50cnkgIT09ICdzdHJpbmcnICkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAnYmVoYXZpb3VyJyBtdXN0IGJlIGEgc3RyaW5nIGNvbnRhaW5pbmcgb3B0aW9ucy5cIik7XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIHN0cmluZyBjb250YWlucyBhbnkga2V5d29yZHMuXG5cdFx0Ly8gTm9uZSBhcmUgcmVxdWlyZWQuXG5cdFx0dmFyIHRhcCA9IGVudHJ5LmluZGV4T2YoJ3RhcCcpID49IDA7XG5cdFx0dmFyIGRyYWcgPSBlbnRyeS5pbmRleE9mKCdkcmFnJykgPj0gMDtcblx0XHR2YXIgZml4ZWQgPSBlbnRyeS5pbmRleE9mKCdmaXhlZCcpID49IDA7XG5cdFx0dmFyIHNuYXAgPSBlbnRyeS5pbmRleE9mKCdzbmFwJykgPj0gMDtcblx0XHR2YXIgaG92ZXIgPSBlbnRyeS5pbmRleE9mKCdob3ZlcicpID49IDA7XG5cblx0XHRpZiAoIGZpeGVkICkge1xuXG5cdFx0XHRpZiAoIHBhcnNlZC5oYW5kbGVzICE9PSAyICkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdmaXhlZCcgYmVoYXZpb3VyIG11c3QgYmUgdXNlZCB3aXRoIDIgaGFuZGxlc1wiKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVXNlIG1hcmdpbiB0byBlbmZvcmNlIGZpeGVkIHN0YXRlXG5cdFx0XHR0ZXN0TWFyZ2luKHBhcnNlZCwgcGFyc2VkLnN0YXJ0WzFdIC0gcGFyc2VkLnN0YXJ0WzBdKTtcblx0XHR9XG5cblx0XHRwYXJzZWQuZXZlbnRzID0ge1xuXHRcdFx0dGFwOiB0YXAgfHwgc25hcCxcblx0XHRcdGRyYWc6IGRyYWcsXG5cdFx0XHRmaXhlZDogZml4ZWQsXG5cdFx0XHRzbmFwOiBzbmFwLFxuXHRcdFx0aG92ZXI6IGhvdmVyXG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRlc3RUb29sdGlwcyAoIHBhcnNlZCwgZW50cnkgKSB7XG5cblx0XHRpZiAoIGVudHJ5ID09PSBmYWxzZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRlbHNlIGlmICggZW50cnkgPT09IHRydWUgKSB7XG5cblx0XHRcdHBhcnNlZC50b29sdGlwcyA9IFtdO1xuXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBwYXJzZWQuaGFuZGxlczsgaSsrICkge1xuXHRcdFx0XHRwYXJzZWQudG9vbHRpcHMucHVzaCh0cnVlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRlbHNlIHtcblxuXHRcdFx0cGFyc2VkLnRvb2x0aXBzID0gYXNBcnJheShlbnRyeSk7XG5cblx0XHRcdGlmICggcGFyc2VkLnRvb2x0aXBzLmxlbmd0aCAhPT0gcGFyc2VkLmhhbmRsZXMgKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogbXVzdCBwYXNzIGEgZm9ybWF0dGVyIGZvciBhbGwgaGFuZGxlcy5cIik7XG5cdFx0XHR9XG5cblx0XHRcdHBhcnNlZC50b29sdGlwcy5mb3JFYWNoKGZ1bmN0aW9uKGZvcm1hdHRlcil7XG5cdFx0XHRcdGlmICggdHlwZW9mIGZvcm1hdHRlciAhPT0gJ2Jvb2xlYW4nICYmICh0eXBlb2YgZm9ybWF0dGVyICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgZm9ybWF0dGVyLnRvICE9PSAnZnVuY3Rpb24nKSApIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICd0b29sdGlwcycgbXVzdCBiZSBwYXNzZWQgYSBmb3JtYXR0ZXIgb3IgJ2ZhbHNlJy5cIik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHRlc3RBcmlhRm9ybWF0ICggcGFyc2VkLCBlbnRyeSApIHtcblx0XHRwYXJzZWQuYXJpYUZvcm1hdCA9IGVudHJ5O1xuXHRcdHZhbGlkYXRlRm9ybWF0KGVudHJ5KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRlc3RGb3JtYXQgKCBwYXJzZWQsIGVudHJ5ICkge1xuXHRcdHBhcnNlZC5mb3JtYXQgPSBlbnRyeTtcblx0XHR2YWxpZGF0ZUZvcm1hdChlbnRyeSk7XG5cdH1cblxuXHRmdW5jdGlvbiB0ZXN0Q3NzUHJlZml4ICggcGFyc2VkLCBlbnRyeSApIHtcblxuXHRcdGlmICggdHlwZW9mIGVudHJ5ICE9PSAnc3RyaW5nJyAmJiBlbnRyeSAhPT0gZmFsc2UgKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdjc3NQcmVmaXgnIG11c3QgYmUgYSBzdHJpbmcgb3IgYGZhbHNlYC5cIik7XG5cdFx0fVxuXG5cdFx0cGFyc2VkLmNzc1ByZWZpeCA9IGVudHJ5O1xuXHR9XG5cblx0ZnVuY3Rpb24gdGVzdENzc0NsYXNzZXMgKCBwYXJzZWQsIGVudHJ5ICkge1xuXG5cdFx0aWYgKCB0eXBlb2YgZW50cnkgIT09ICdvYmplY3QnICkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAnY3NzQ2xhc3NlcycgbXVzdCBiZSBhbiBvYmplY3QuXCIpO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIHBhcnNlZC5jc3NQcmVmaXggPT09ICdzdHJpbmcnICkge1xuXHRcdFx0cGFyc2VkLmNzc0NsYXNzZXMgPSB7fTtcblxuXHRcdFx0Zm9yICggdmFyIGtleSBpbiBlbnRyeSApIHtcblx0XHRcdFx0aWYgKCAhZW50cnkuaGFzT3duUHJvcGVydHkoa2V5KSApIHsgY29udGludWU7IH1cblxuXHRcdFx0XHRwYXJzZWQuY3NzQ2xhc3Nlc1trZXldID0gcGFyc2VkLmNzc1ByZWZpeCArIGVudHJ5W2tleV07XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcnNlZC5jc3NDbGFzc2VzID0gZW50cnk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gVGVzdCBhbGwgZGV2ZWxvcGVyIHNldHRpbmdzIGFuZCBwYXJzZSB0byBhc3N1bXB0aW9uLXNhZmUgdmFsdWVzLlxuXHRmdW5jdGlvbiB0ZXN0T3B0aW9ucyAoIG9wdGlvbnMgKSB7XG5cblx0XHQvLyBUbyBwcm92ZSBhIGZpeCBmb3IgIzUzNywgZnJlZXplIG9wdGlvbnMgaGVyZS5cblx0XHQvLyBJZiB0aGUgb2JqZWN0IGlzIG1vZGlmaWVkLCBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cblx0XHQvLyBPYmplY3QuZnJlZXplKG9wdGlvbnMpO1xuXG5cdFx0dmFyIHBhcnNlZCA9IHtcblx0XHRcdG1hcmdpbjogMCxcblx0XHRcdGxpbWl0OiAwLFxuXHRcdFx0cGFkZGluZzogMCxcblx0XHRcdGFuaW1hdGU6IHRydWUsXG5cdFx0XHRhbmltYXRpb25EdXJhdGlvbjogMzAwLFxuXHRcdFx0YXJpYUZvcm1hdDogZGVmYXVsdEZvcm1hdHRlcixcblx0XHRcdGZvcm1hdDogZGVmYXVsdEZvcm1hdHRlclxuXHRcdH07XG5cblx0XHQvLyBUZXN0cyBhcmUgZXhlY3V0ZWQgaW4gdGhlIG9yZGVyIHRoZXkgYXJlIHByZXNlbnRlZCBoZXJlLlxuXHRcdHZhciB0ZXN0cyA9IHtcblx0XHRcdCdzdGVwJzogeyByOiBmYWxzZSwgdDogdGVzdFN0ZXAgfSxcblx0XHRcdCdzdGFydCc6IHsgcjogdHJ1ZSwgdDogdGVzdFN0YXJ0IH0sXG5cdFx0XHQnY29ubmVjdCc6IHsgcjogdHJ1ZSwgdDogdGVzdENvbm5lY3QgfSxcblx0XHRcdCdkaXJlY3Rpb24nOiB7IHI6IHRydWUsIHQ6IHRlc3REaXJlY3Rpb24gfSxcblx0XHRcdCdzbmFwJzogeyByOiBmYWxzZSwgdDogdGVzdFNuYXAgfSxcblx0XHRcdCdhbmltYXRlJzogeyByOiBmYWxzZSwgdDogdGVzdEFuaW1hdGUgfSxcblx0XHRcdCdhbmltYXRpb25EdXJhdGlvbic6IHsgcjogZmFsc2UsIHQ6IHRlc3RBbmltYXRpb25EdXJhdGlvbiB9LFxuXHRcdFx0J3JhbmdlJzogeyByOiB0cnVlLCB0OiB0ZXN0UmFuZ2UgfSxcblx0XHRcdCdvcmllbnRhdGlvbic6IHsgcjogZmFsc2UsIHQ6IHRlc3RPcmllbnRhdGlvbiB9LFxuXHRcdFx0J21hcmdpbic6IHsgcjogZmFsc2UsIHQ6IHRlc3RNYXJnaW4gfSxcblx0XHRcdCdsaW1pdCc6IHsgcjogZmFsc2UsIHQ6IHRlc3RMaW1pdCB9LFxuXHRcdFx0J3BhZGRpbmcnOiB7IHI6IGZhbHNlLCB0OiB0ZXN0UGFkZGluZyB9LFxuXHRcdFx0J2JlaGF2aW91cic6IHsgcjogdHJ1ZSwgdDogdGVzdEJlaGF2aW91ciB9LFxuXHRcdFx0J2FyaWFGb3JtYXQnOiB7IHI6IGZhbHNlLCB0OiB0ZXN0QXJpYUZvcm1hdCB9LFxuXHRcdFx0J2Zvcm1hdCc6IHsgcjogZmFsc2UsIHQ6IHRlc3RGb3JtYXQgfSxcblx0XHRcdCd0b29sdGlwcyc6IHsgcjogZmFsc2UsIHQ6IHRlc3RUb29sdGlwcyB9LFxuXHRcdFx0J2Nzc1ByZWZpeCc6IHsgcjogdHJ1ZSwgdDogdGVzdENzc1ByZWZpeCB9LFxuXHRcdFx0J2Nzc0NsYXNzZXMnOiB7IHI6IHRydWUsIHQ6IHRlc3RDc3NDbGFzc2VzIH1cblx0XHR9O1xuXG5cdFx0dmFyIGRlZmF1bHRzID0ge1xuXHRcdFx0J2Nvbm5lY3QnOiBmYWxzZSxcblx0XHRcdCdkaXJlY3Rpb24nOiAnbHRyJyxcblx0XHRcdCdiZWhhdmlvdXInOiAndGFwJyxcblx0XHRcdCdvcmllbnRhdGlvbic6ICdob3Jpem9udGFsJyxcblx0XHRcdCdjc3NQcmVmaXgnIDogJ25vVWktJyxcblx0XHRcdCdjc3NDbGFzc2VzJzoge1xuXHRcdFx0XHR0YXJnZXQ6ICd0YXJnZXQnLFxuXHRcdFx0XHRiYXNlOiAnYmFzZScsXG5cdFx0XHRcdG9yaWdpbjogJ29yaWdpbicsXG5cdFx0XHRcdGhhbmRsZTogJ2hhbmRsZScsXG5cdFx0XHRcdGhhbmRsZUxvd2VyOiAnaGFuZGxlLWxvd2VyJyxcblx0XHRcdFx0aGFuZGxlVXBwZXI6ICdoYW5kbGUtdXBwZXInLFxuXHRcdFx0XHRob3Jpem9udGFsOiAnaG9yaXpvbnRhbCcsXG5cdFx0XHRcdHZlcnRpY2FsOiAndmVydGljYWwnLFxuXHRcdFx0XHRiYWNrZ3JvdW5kOiAnYmFja2dyb3VuZCcsXG5cdFx0XHRcdGNvbm5lY3Q6ICdjb25uZWN0Jyxcblx0XHRcdFx0Y29ubmVjdHM6ICdjb25uZWN0cycsXG5cdFx0XHRcdGx0cjogJ2x0cicsXG5cdFx0XHRcdHJ0bDogJ3J0bCcsXG5cdFx0XHRcdGRyYWdnYWJsZTogJ2RyYWdnYWJsZScsXG5cdFx0XHRcdGRyYWc6ICdzdGF0ZS1kcmFnJyxcblx0XHRcdFx0dGFwOiAnc3RhdGUtdGFwJyxcblx0XHRcdFx0YWN0aXZlOiAnYWN0aXZlJyxcblx0XHRcdFx0dG9vbHRpcDogJ3Rvb2x0aXAnLFxuXHRcdFx0XHRwaXBzOiAncGlwcycsXG5cdFx0XHRcdHBpcHNIb3Jpem9udGFsOiAncGlwcy1ob3Jpem9udGFsJyxcblx0XHRcdFx0cGlwc1ZlcnRpY2FsOiAncGlwcy12ZXJ0aWNhbCcsXG5cdFx0XHRcdG1hcmtlcjogJ21hcmtlcicsXG5cdFx0XHRcdG1hcmtlckhvcml6b250YWw6ICdtYXJrZXItaG9yaXpvbnRhbCcsXG5cdFx0XHRcdG1hcmtlclZlcnRpY2FsOiAnbWFya2VyLXZlcnRpY2FsJyxcblx0XHRcdFx0bWFya2VyTm9ybWFsOiAnbWFya2VyLW5vcm1hbCcsXG5cdFx0XHRcdG1hcmtlckxhcmdlOiAnbWFya2VyLWxhcmdlJyxcblx0XHRcdFx0bWFya2VyU3ViOiAnbWFya2VyLXN1YicsXG5cdFx0XHRcdHZhbHVlOiAndmFsdWUnLFxuXHRcdFx0XHR2YWx1ZUhvcml6b250YWw6ICd2YWx1ZS1ob3Jpem9udGFsJyxcblx0XHRcdFx0dmFsdWVWZXJ0aWNhbDogJ3ZhbHVlLXZlcnRpY2FsJyxcblx0XHRcdFx0dmFsdWVOb3JtYWw6ICd2YWx1ZS1ub3JtYWwnLFxuXHRcdFx0XHR2YWx1ZUxhcmdlOiAndmFsdWUtbGFyZ2UnLFxuXHRcdFx0XHR2YWx1ZVN1YjogJ3ZhbHVlLXN1Yidcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Ly8gQXJpYUZvcm1hdCBkZWZhdWx0cyB0byByZWd1bGFyIGZvcm1hdCwgaWYgYW55LlxuXHRcdGlmICggb3B0aW9ucy5mb3JtYXQgJiYgIW9wdGlvbnMuYXJpYUZvcm1hdCApIHtcblx0XHRcdG9wdGlvbnMuYXJpYUZvcm1hdCA9IG9wdGlvbnMuZm9ybWF0O1xuXHRcdH1cblxuXHRcdC8vIFJ1biBhbGwgb3B0aW9ucyB0aHJvdWdoIGEgdGVzdGluZyBtZWNoYW5pc20gdG8gZW5zdXJlIGNvcnJlY3Rcblx0XHQvLyBpbnB1dC4gSXQgc2hvdWxkIGJlIG5vdGVkIHRoYXQgb3B0aW9ucyBtaWdodCBnZXQgbW9kaWZpZWQgdG9cblx0XHQvLyBiZSBoYW5kbGVkIHByb3Blcmx5LiBFLmcuIHdyYXBwaW5nIGludGVnZXJzIGluIGFycmF5cy5cblx0XHRPYmplY3Qua2V5cyh0ZXN0cykuZm9yRWFjaChmdW5jdGlvbiggbmFtZSApe1xuXG5cdFx0XHQvLyBJZiB0aGUgb3B0aW9uIGlzbid0IHNldCwgYnV0IGl0IGlzIHJlcXVpcmVkLCB0aHJvdyBhbiBlcnJvci5cblx0XHRcdGlmICggIWlzU2V0KG9wdGlvbnNbbmFtZV0pICYmIGRlZmF1bHRzW25hbWVdID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0aWYgKCB0ZXN0c1tuYW1lXS5yICkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ1wiICsgbmFtZSArIFwiJyBpcyByZXF1aXJlZC5cIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0dGVzdHNbbmFtZV0udCggcGFyc2VkLCAhaXNTZXQob3B0aW9uc1tuYW1lXSkgPyBkZWZhdWx0c1tuYW1lXSA6IG9wdGlvbnNbbmFtZV0gKTtcblx0XHR9KTtcblxuXHRcdC8vIEZvcndhcmQgcGlwcyBvcHRpb25zXG5cdFx0cGFyc2VkLnBpcHMgPSBvcHRpb25zLnBpcHM7XG5cblx0XHQvLyBBbGwgcmVjZW50IGJyb3dzZXJzIGFjY2VwdCB1bnByZWZpeGVkIHRyYW5zZm9ybS5cblx0XHQvLyBXZSBuZWVkIC1tcy0gZm9yIElFOSBhbmQgLXdlYmtpdC0gZm9yIG9sZGVyIEFuZHJvaWQ7XG5cdFx0Ly8gQXNzdW1lIHVzZSBvZiAtd2Via2l0LSBpZiB1bnByZWZpeGVkIGFuZCAtbXMtIGFyZSBub3Qgc3VwcG9ydGVkLlxuXHRcdC8vIGh0dHBzOi8vY2FuaXVzZS5jb20vI2ZlYXQ9dHJhbnNmb3JtczJkXG5cdFx0dmFyIGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdHZhciBtc1ByZWZpeCA9IGQuc3R5bGUubXNUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZDtcblx0XHR2YXIgbm9QcmVmaXggPSBkLnN0eWxlLnRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkO1xuXG5cdFx0cGFyc2VkLnRyYW5zZm9ybVJ1bGUgPSBub1ByZWZpeCA/ICd0cmFuc2Zvcm0nIDogKG1zUHJlZml4ID8gJ21zVHJhbnNmb3JtJyA6ICd3ZWJraXRUcmFuc2Zvcm0nKTtcblxuXHRcdC8vIFBpcHMgZG9uJ3QgbW92ZSwgc28gd2UgY2FuIHBsYWNlIHRoZW0gdXNpbmcgbGVmdC90b3AuXG5cdFx0dmFyIHN0eWxlcyA9IFtbJ2xlZnQnLCAndG9wJ10sIFsncmlnaHQnLCAnYm90dG9tJ11dO1xuXG5cdFx0cGFyc2VkLnN0eWxlID0gc3R5bGVzW3BhcnNlZC5kaXJdW3BhcnNlZC5vcnRdO1xuXG5cdFx0cmV0dXJuIHBhcnNlZDtcblx0fVxuXHJcblxyXG5mdW5jdGlvbiBzY29wZSAoIHRhcmdldCwgb3B0aW9ucywgb3JpZ2luYWxPcHRpb25zICl7XHJcblxyXG5cdHZhciBhY3Rpb25zID0gZ2V0QWN0aW9ucygpO1xyXG5cdHZhciBzdXBwb3J0c1RvdWNoQWN0aW9uTm9uZSA9IGdldFN1cHBvcnRzVG91Y2hBY3Rpb25Ob25lKCk7XHJcblx0dmFyIHN1cHBvcnRzUGFzc2l2ZSA9IHN1cHBvcnRzVG91Y2hBY3Rpb25Ob25lICYmIGdldFN1cHBvcnRzUGFzc2l2ZSgpO1xyXG5cclxuXHQvLyBBbGwgdmFyaWFibGVzIGxvY2FsIHRvICdzY29wZScgYXJlIHByZWZpeGVkIHdpdGggJ3Njb3BlXydcclxuXHR2YXIgc2NvcGVfVGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdHZhciBzY29wZV9Mb2NhdGlvbnMgPSBbXTtcclxuXHR2YXIgc2NvcGVfQmFzZTtcclxuXHR2YXIgc2NvcGVfSGFuZGxlcztcclxuXHR2YXIgc2NvcGVfSGFuZGxlTnVtYmVycyA9IFtdO1xyXG5cdHZhciBzY29wZV9BY3RpdmVIYW5kbGVzQ291bnQgPSAwO1xyXG5cdHZhciBzY29wZV9Db25uZWN0cztcclxuXHR2YXIgc2NvcGVfU3BlY3RydW0gPSBvcHRpb25zLnNwZWN0cnVtO1xyXG5cdHZhciBzY29wZV9WYWx1ZXMgPSBbXTtcclxuXHR2YXIgc2NvcGVfRXZlbnRzID0ge307XHJcblx0dmFyIHNjb3BlX1NlbGY7XHJcblx0dmFyIHNjb3BlX1BpcHM7XHJcblx0dmFyIHNjb3BlX0RvY3VtZW50ID0gdGFyZ2V0Lm93bmVyRG9jdW1lbnQ7XHJcblx0dmFyIHNjb3BlX0RvY3VtZW50RWxlbWVudCA9IHNjb3BlX0RvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuXHR2YXIgc2NvcGVfQm9keSA9IHNjb3BlX0RvY3VtZW50LmJvZHk7XHJcblxyXG5cclxuXHQvLyBGb3IgaG9yaXpvbnRhbCBzbGlkZXJzIGluIHN0YW5kYXJkIGx0ciBkb2N1bWVudHMsXHJcblx0Ly8gbWFrZSAubm9VaS1vcmlnaW4gb3ZlcmZsb3cgdG8gdGhlIGxlZnQgc28gdGhlIGRvY3VtZW50IGRvZXNuJ3Qgc2Nyb2xsLlxyXG5cdHZhciBzY29wZV9EaXJPZmZzZXQgPSAoc2NvcGVfRG9jdW1lbnQuZGlyID09PSAncnRsJykgfHwgKG9wdGlvbnMub3J0ID09PSAxKSA/IDAgOiAxMDA7XHJcblxyXG4vKiEgSW4gdGhpcyBmaWxlOiBDb25zdHJ1Y3Rpb24gb2YgRE9NIGVsZW1lbnRzOyAqL1xyXG5cclxuXHQvLyBDcmVhdGVzIGEgbm9kZSwgYWRkcyBpdCB0byB0YXJnZXQsIHJldHVybnMgdGhlIG5ldyBub2RlLlxyXG5cdGZ1bmN0aW9uIGFkZE5vZGVUbyAoIGFkZFRhcmdldCwgY2xhc3NOYW1lICkge1xyXG5cclxuXHRcdHZhciBkaXYgPSBzY29wZV9Eb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcblx0XHRpZiAoIGNsYXNzTmFtZSApIHtcclxuXHRcdFx0YWRkQ2xhc3MoZGl2LCBjbGFzc05hbWUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGFkZFRhcmdldC5hcHBlbmRDaGlsZChkaXYpO1xyXG5cclxuXHRcdHJldHVybiBkaXY7XHJcblx0fVxyXG5cclxuXHQvLyBBcHBlbmQgYSBvcmlnaW4gdG8gdGhlIGJhc2VcclxuXHRmdW5jdGlvbiBhZGRPcmlnaW4gKCBiYXNlLCBoYW5kbGVOdW1iZXIgKSB7XHJcblxyXG5cdFx0dmFyIG9yaWdpbiA9IGFkZE5vZGVUbyhiYXNlLCBvcHRpb25zLmNzc0NsYXNzZXMub3JpZ2luKTtcclxuXHRcdHZhciBoYW5kbGUgPSBhZGROb2RlVG8ob3JpZ2luLCBvcHRpb25zLmNzc0NsYXNzZXMuaGFuZGxlKTtcclxuXHJcblx0XHRoYW5kbGUuc2V0QXR0cmlidXRlKCdkYXRhLWhhbmRsZScsIGhhbmRsZU51bWJlcik7XHJcblxyXG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRNTC9HbG9iYWxfYXR0cmlidXRlcy90YWJpbmRleFxyXG5cdFx0Ly8gMCA9IGZvY3VzYWJsZSBhbmQgcmVhY2hhYmxlXHJcblx0XHRoYW5kbGUuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XHJcblx0XHRoYW5kbGUuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3NsaWRlcicpO1xyXG5cdFx0aGFuZGxlLnNldEF0dHJpYnV0ZSgnYXJpYS1vcmllbnRhdGlvbicsIG9wdGlvbnMub3J0ID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJyk7XHJcblxyXG5cdFx0aWYgKCBoYW5kbGVOdW1iZXIgPT09IDAgKSB7XHJcblx0XHRcdGFkZENsYXNzKGhhbmRsZSwgb3B0aW9ucy5jc3NDbGFzc2VzLmhhbmRsZUxvd2VyKTtcclxuXHRcdH1cclxuXHJcblx0XHRlbHNlIGlmICggaGFuZGxlTnVtYmVyID09PSBvcHRpb25zLmhhbmRsZXMgLSAxICkge1xyXG5cdFx0XHRhZGRDbGFzcyhoYW5kbGUsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5oYW5kbGVVcHBlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG9yaWdpbjtcclxuXHR9XHJcblxyXG5cdC8vIEluc2VydCBub2RlcyBmb3IgY29ubmVjdCBlbGVtZW50c1xyXG5cdGZ1bmN0aW9uIGFkZENvbm5lY3QgKCBiYXNlLCBhZGQgKSB7XHJcblxyXG5cdFx0aWYgKCAhYWRkICkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGFkZE5vZGVUbyhiYXNlLCBvcHRpb25zLmNzc0NsYXNzZXMuY29ubmVjdCk7XHJcblx0fVxyXG5cclxuXHQvLyBBZGQgaGFuZGxlcyB0byB0aGUgc2xpZGVyIGJhc2UuXHJcblx0ZnVuY3Rpb24gYWRkRWxlbWVudHMgKCBjb25uZWN0T3B0aW9ucywgYmFzZSApIHtcclxuXHJcblx0XHR2YXIgY29ubmVjdEJhc2UgPSBhZGROb2RlVG8oYmFzZSwgb3B0aW9ucy5jc3NDbGFzc2VzLmNvbm5lY3RzKTtcclxuXHJcblx0XHRzY29wZV9IYW5kbGVzID0gW107XHJcblx0XHRzY29wZV9Db25uZWN0cyA9IFtdO1xyXG5cclxuXHRcdHNjb3BlX0Nvbm5lY3RzLnB1c2goYWRkQ29ubmVjdChjb25uZWN0QmFzZSwgY29ubmVjdE9wdGlvbnNbMF0pKTtcclxuXHJcblx0XHQvLyBbOjo6Ok89PT09Tz09PT1PPT09PV1cclxuXHRcdC8vIGNvbm5lY3RPcHRpb25zID0gWzAsIDEsIDEsIDFdXHJcblxyXG5cdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgb3B0aW9ucy5oYW5kbGVzOyBpKysgKSB7XHJcblx0XHRcdC8vIEtlZXAgYSBsaXN0IG9mIGFsbCBhZGRlZCBoYW5kbGVzLlxyXG5cdFx0XHRzY29wZV9IYW5kbGVzLnB1c2goYWRkT3JpZ2luKGJhc2UsIGkpKTtcclxuXHRcdFx0c2NvcGVfSGFuZGxlTnVtYmVyc1tpXSA9IGk7XHJcblx0XHRcdHNjb3BlX0Nvbm5lY3RzLnB1c2goYWRkQ29ubmVjdChjb25uZWN0QmFzZSwgY29ubmVjdE9wdGlvbnNbaSArIDFdKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBJbml0aWFsaXplIGEgc2luZ2xlIHNsaWRlci5cclxuXHRmdW5jdGlvbiBhZGRTbGlkZXIgKCBhZGRUYXJnZXQgKSB7XHJcblxyXG5cdFx0Ly8gQXBwbHkgY2xhc3NlcyBhbmQgZGF0YSB0byB0aGUgdGFyZ2V0LlxyXG5cdFx0YWRkQ2xhc3MoYWRkVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMudGFyZ2V0KTtcclxuXHJcblx0XHRpZiAoIG9wdGlvbnMuZGlyID09PSAwICkge1xyXG5cdFx0XHRhZGRDbGFzcyhhZGRUYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5sdHIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YWRkQ2xhc3MoYWRkVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMucnRsKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIG9wdGlvbnMub3J0ID09PSAwICkge1xyXG5cdFx0XHRhZGRDbGFzcyhhZGRUYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5ob3Jpem9udGFsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFkZENsYXNzKGFkZFRhcmdldCwgb3B0aW9ucy5jc3NDbGFzc2VzLnZlcnRpY2FsKTtcclxuXHRcdH1cclxuXHJcblx0XHRzY29wZV9CYXNlID0gYWRkTm9kZVRvKGFkZFRhcmdldCwgb3B0aW9ucy5jc3NDbGFzc2VzLmJhc2UpO1xyXG5cdH1cclxuXHJcblxyXG5cdGZ1bmN0aW9uIGFkZFRvb2x0aXAgKCBoYW5kbGUsIGhhbmRsZU51bWJlciApIHtcclxuXHJcblx0XHRpZiAoICFvcHRpb25zLnRvb2x0aXBzW2hhbmRsZU51bWJlcl0gKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gYWRkTm9kZVRvKGhhbmRsZS5maXJzdENoaWxkLCBvcHRpb25zLmNzc0NsYXNzZXMudG9vbHRpcCk7XHJcblx0fVxyXG5cclxuXHQvLyBUaGUgdG9vbHRpcHMgb3B0aW9uIGlzIGEgc2hvcnRoYW5kIGZvciB1c2luZyB0aGUgJ3VwZGF0ZScgZXZlbnQuXHJcblx0ZnVuY3Rpb24gdG9vbHRpcHMgKCApIHtcclxuXHJcblx0XHQvLyBUb29sdGlwcyBhcmUgYWRkZWQgd2l0aCBvcHRpb25zLnRvb2x0aXBzIGluIG9yaWdpbmFsIG9yZGVyLlxyXG5cdFx0dmFyIHRpcHMgPSBzY29wZV9IYW5kbGVzLm1hcChhZGRUb29sdGlwKTtcclxuXHJcblx0XHRiaW5kRXZlbnQoJ3VwZGF0ZScsIGZ1bmN0aW9uKHZhbHVlcywgaGFuZGxlTnVtYmVyLCB1bmVuY29kZWQpIHtcclxuXHJcblx0XHRcdGlmICggIXRpcHNbaGFuZGxlTnVtYmVyXSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBmb3JtYXR0ZWRWYWx1ZSA9IHZhbHVlc1toYW5kbGVOdW1iZXJdO1xyXG5cclxuXHRcdFx0aWYgKCBvcHRpb25zLnRvb2x0aXBzW2hhbmRsZU51bWJlcl0gIT09IHRydWUgKSB7XHJcblx0XHRcdFx0Zm9ybWF0dGVkVmFsdWUgPSBvcHRpb25zLnRvb2x0aXBzW2hhbmRsZU51bWJlcl0udG8odW5lbmNvZGVkW2hhbmRsZU51bWJlcl0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aXBzW2hhbmRsZU51bWJlcl0uaW5uZXJIVE1MID0gZm9ybWF0dGVkVmFsdWU7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHRmdW5jdGlvbiBhcmlhICggKSB7XHJcblxyXG5cdFx0YmluZEV2ZW50KCd1cGRhdGUnLCBmdW5jdGlvbiAoIHZhbHVlcywgaGFuZGxlTnVtYmVyLCB1bmVuY29kZWQsIHRhcCwgcG9zaXRpb25zICkge1xyXG5cclxuXHRcdFx0Ly8gVXBkYXRlIEFyaWEgVmFsdWVzIGZvciBhbGwgaGFuZGxlcywgYXMgYSBjaGFuZ2UgaW4gb25lIGNoYW5nZXMgbWluIGFuZCBtYXggdmFsdWVzIGZvciB0aGUgbmV4dC5cclxuXHRcdFx0c2NvcGVfSGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uKCBpbmRleCApe1xyXG5cclxuXHRcdFx0XHR2YXIgaGFuZGxlID0gc2NvcGVfSGFuZGxlc1tpbmRleF07XHJcblxyXG5cdFx0XHRcdHZhciBtaW4gPSBjaGVja0hhbmRsZVBvc2l0aW9uKHNjb3BlX0xvY2F0aW9ucywgaW5kZXgsIDAsIHRydWUsIHRydWUsIHRydWUpO1xyXG5cdFx0XHRcdHZhciBtYXggPSBjaGVja0hhbmRsZVBvc2l0aW9uKHNjb3BlX0xvY2F0aW9ucywgaW5kZXgsIDEwMCwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG5cdFx0XHRcdHZhciBub3cgPSBwb3NpdGlvbnNbaW5kZXhdO1xyXG5cdFx0XHRcdHZhciB0ZXh0ID0gb3B0aW9ucy5hcmlhRm9ybWF0LnRvKHVuZW5jb2RlZFtpbmRleF0pO1xyXG5cclxuXHRcdFx0XHRoYW5kbGUuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWluJywgbWluLnRvRml4ZWQoMSkpO1xyXG5cdFx0XHRcdGhhbmRsZS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtYXgnLCBtYXgudG9GaXhlZCgxKSk7XHJcblx0XHRcdFx0aGFuZGxlLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIG5vdy50b0ZpeGVkKDEpKTtcclxuXHRcdFx0XHRoYW5kbGUuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVldGV4dCcsIHRleHQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdGZ1bmN0aW9uIGdldEdyb3VwICggbW9kZSwgdmFsdWVzLCBzdGVwcGVkICkge1xyXG5cclxuXHRcdC8vIFVzZSB0aGUgcmFuZ2UuXHJcblx0XHRpZiAoIG1vZGUgPT09ICdyYW5nZScgfHwgbW9kZSA9PT0gJ3N0ZXBzJyApIHtcclxuXHRcdFx0cmV0dXJuIHNjb3BlX1NwZWN0cnVtLnhWYWw7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBtb2RlID09PSAnY291bnQnICkge1xyXG5cclxuXHRcdFx0aWYgKCB2YWx1ZXMgPCAyICkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ3ZhbHVlcycgKD49IDIpIHJlcXVpcmVkIGZvciBtb2RlICdjb3VudCcuXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBEaXZpZGUgMCAtIDEwMCBpbiAnY291bnQnIHBhcnRzLlxyXG5cdFx0XHR2YXIgaW50ZXJ2YWwgPSB2YWx1ZXMgLSAxO1xyXG5cdFx0XHR2YXIgc3ByZWFkID0gKCAxMDAgLyBpbnRlcnZhbCApO1xyXG5cclxuXHRcdFx0dmFsdWVzID0gW107XHJcblxyXG5cdFx0XHQvLyBMaXN0IHRoZXNlIHBhcnRzIGFuZCBoYXZlIHRoZW0gaGFuZGxlZCBhcyAncG9zaXRpb25zJy5cclxuXHRcdFx0d2hpbGUgKCBpbnRlcnZhbC0tICkge1xyXG5cdFx0XHRcdHZhbHVlc1sgaW50ZXJ2YWwgXSA9ICggaW50ZXJ2YWwgKiBzcHJlYWQgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFsdWVzLnB1c2goMTAwKTtcclxuXHJcblx0XHRcdG1vZGUgPSAncG9zaXRpb25zJztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIG1vZGUgPT09ICdwb3NpdGlvbnMnICkge1xyXG5cclxuXHRcdFx0Ly8gTWFwIGFsbCBwZXJjZW50YWdlcyB0byBvbi1yYW5nZSB2YWx1ZXMuXHJcblx0XHRcdHJldHVybiB2YWx1ZXMubWFwKGZ1bmN0aW9uKCB2YWx1ZSApe1xyXG5cdFx0XHRcdHJldHVybiBzY29wZV9TcGVjdHJ1bS5mcm9tU3RlcHBpbmcoIHN0ZXBwZWQgPyBzY29wZV9TcGVjdHJ1bS5nZXRTdGVwKCB2YWx1ZSApIDogdmFsdWUgKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBtb2RlID09PSAndmFsdWVzJyApIHtcclxuXHJcblx0XHRcdC8vIElmIHRoZSB2YWx1ZSBtdXN0IGJlIHN0ZXBwZWQsIGl0IG5lZWRzIHRvIGJlIGNvbnZlcnRlZCB0byBhIHBlcmNlbnRhZ2UgZmlyc3QuXHJcblx0XHRcdGlmICggc3RlcHBlZCApIHtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlcy5tYXAoZnVuY3Rpb24oIHZhbHVlICl7XHJcblxyXG5cdFx0XHRcdFx0Ly8gQ29udmVydCB0byBwZXJjZW50YWdlLCBhcHBseSBzdGVwLCByZXR1cm4gdG8gdmFsdWUuXHJcblx0XHRcdFx0XHRyZXR1cm4gc2NvcGVfU3BlY3RydW0uZnJvbVN0ZXBwaW5nKCBzY29wZV9TcGVjdHJ1bS5nZXRTdGVwKCBzY29wZV9TcGVjdHJ1bS50b1N0ZXBwaW5nKCB2YWx1ZSApICkgKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIE90aGVyd2lzZSwgd2UgY2FuIHNpbXBseSB1c2UgdGhlIHZhbHVlcy5cclxuXHRcdFx0cmV0dXJuIHZhbHVlcztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdlbmVyYXRlU3ByZWFkICggZGVuc2l0eSwgbW9kZSwgZ3JvdXAgKSB7XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2FmZUluY3JlbWVudCh2YWx1ZSwgaW5jcmVtZW50KSB7XHJcblx0XHRcdC8vIEF2b2lkIGZsb2F0aW5nIHBvaW50IHZhcmlhbmNlIGJ5IGRyb3BwaW5nIHRoZSBzbWFsbGVzdCBkZWNpbWFsIHBsYWNlcy5cclxuXHRcdFx0cmV0dXJuICh2YWx1ZSArIGluY3JlbWVudCkudG9GaXhlZCg3KSAvIDE7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGluZGV4ZXMgPSB7fTtcclxuXHRcdHZhciBmaXJzdEluUmFuZ2UgPSBzY29wZV9TcGVjdHJ1bS54VmFsWzBdO1xyXG5cdFx0dmFyIGxhc3RJblJhbmdlID0gc2NvcGVfU3BlY3RydW0ueFZhbFtzY29wZV9TcGVjdHJ1bS54VmFsLmxlbmd0aC0xXTtcclxuXHRcdHZhciBpZ25vcmVGaXJzdCA9IGZhbHNlO1xyXG5cdFx0dmFyIGlnbm9yZUxhc3QgPSBmYWxzZTtcclxuXHRcdHZhciBwcmV2UGN0ID0gMDtcclxuXHJcblx0XHQvLyBDcmVhdGUgYSBjb3B5IG9mIHRoZSBncm91cCwgc29ydCBpdCBhbmQgZmlsdGVyIGF3YXkgYWxsIGR1cGxpY2F0ZXMuXHJcblx0XHRncm91cCA9IHVuaXF1ZShncm91cC5zbGljZSgpLnNvcnQoZnVuY3Rpb24oYSwgYil7IHJldHVybiBhIC0gYjsgfSkpO1xyXG5cclxuXHRcdC8vIE1ha2Ugc3VyZSB0aGUgcmFuZ2Ugc3RhcnRzIHdpdGggdGhlIGZpcnN0IGVsZW1lbnQuXHJcblx0XHRpZiAoIGdyb3VwWzBdICE9PSBmaXJzdEluUmFuZ2UgKSB7XHJcblx0XHRcdGdyb3VwLnVuc2hpZnQoZmlyc3RJblJhbmdlKTtcclxuXHRcdFx0aWdub3JlRmlyc3QgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIExpa2V3aXNlIGZvciB0aGUgbGFzdCBvbmUuXHJcblx0XHRpZiAoIGdyb3VwW2dyb3VwLmxlbmd0aCAtIDFdICE9PSBsYXN0SW5SYW5nZSApIHtcclxuXHRcdFx0Z3JvdXAucHVzaChsYXN0SW5SYW5nZSk7XHJcblx0XHRcdGlnbm9yZUxhc3QgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGdyb3VwLmZvckVhY2goZnVuY3Rpb24gKCBjdXJyZW50LCBpbmRleCApIHtcclxuXHJcblx0XHRcdC8vIEdldCB0aGUgY3VycmVudCBzdGVwIGFuZCB0aGUgbG93ZXIgKyB1cHBlciBwb3NpdGlvbnMuXHJcblx0XHRcdHZhciBzdGVwO1xyXG5cdFx0XHR2YXIgaTtcclxuXHRcdFx0dmFyIHE7XHJcblx0XHRcdHZhciBsb3cgPSBjdXJyZW50O1xyXG5cdFx0XHR2YXIgaGlnaCA9IGdyb3VwW2luZGV4KzFdO1xyXG5cdFx0XHR2YXIgbmV3UGN0O1xyXG5cdFx0XHR2YXIgcGN0RGlmZmVyZW5jZTtcclxuXHRcdFx0dmFyIHBjdFBvcztcclxuXHRcdFx0dmFyIHR5cGU7XHJcblx0XHRcdHZhciBzdGVwcztcclxuXHRcdFx0dmFyIHJlYWxTdGVwcztcclxuXHRcdFx0dmFyIHN0ZXBzaXplO1xyXG5cclxuXHRcdFx0Ly8gV2hlbiB1c2luZyAnc3RlcHMnIG1vZGUsIHVzZSB0aGUgcHJvdmlkZWQgc3RlcHMuXHJcblx0XHRcdC8vIE90aGVyd2lzZSwgd2UnbGwgc3RlcCBvbiB0byB0aGUgbmV4dCBzdWJyYW5nZS5cclxuXHRcdFx0aWYgKCBtb2RlID09PSAnc3RlcHMnICkge1xyXG5cdFx0XHRcdHN0ZXAgPSBzY29wZV9TcGVjdHJ1bS54TnVtU3RlcHNbIGluZGV4IF07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIERlZmF1bHQgdG8gYSAnZnVsbCcgc3RlcC5cclxuXHRcdFx0aWYgKCAhc3RlcCApIHtcclxuXHRcdFx0XHRzdGVwID0gaGlnaC1sb3c7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIExvdyBjYW4gYmUgMCwgc28gdGVzdCBmb3IgZmFsc2UuIElmIGhpZ2ggaXMgdW5kZWZpbmVkLFxyXG5cdFx0XHQvLyB3ZSBhcmUgYXQgdGhlIGxhc3Qgc3VicmFuZ2UuIEluZGV4IDAgaXMgYWxyZWFkeSBoYW5kbGVkLlxyXG5cdFx0XHRpZiAoIGxvdyA9PT0gZmFsc2UgfHwgaGlnaCA9PT0gdW5kZWZpbmVkICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gTWFrZSBzdXJlIHN0ZXAgaXNuJ3QgMCwgd2hpY2ggd291bGQgY2F1c2UgYW4gaW5maW5pdGUgbG9vcCAoIzY1NClcclxuXHRcdFx0c3RlcCA9IE1hdGgubWF4KHN0ZXAsIDAuMDAwMDAwMSk7XHJcblxyXG5cdFx0XHQvLyBGaW5kIGFsbCBzdGVwcyBpbiB0aGUgc3VicmFuZ2UuXHJcblx0XHRcdGZvciAoIGkgPSBsb3c7IGkgPD0gaGlnaDsgaSA9IHNhZmVJbmNyZW1lbnQoaSwgc3RlcCkgKSB7XHJcblxyXG5cdFx0XHRcdC8vIEdldCB0aGUgcGVyY2VudGFnZSB2YWx1ZSBmb3IgdGhlIGN1cnJlbnQgc3RlcCxcclxuXHRcdFx0XHQvLyBjYWxjdWxhdGUgdGhlIHNpemUgZm9yIHRoZSBzdWJyYW5nZS5cclxuXHRcdFx0XHRuZXdQY3QgPSBzY29wZV9TcGVjdHJ1bS50b1N0ZXBwaW5nKCBpICk7XHJcblx0XHRcdFx0cGN0RGlmZmVyZW5jZSA9IG5ld1BjdCAtIHByZXZQY3Q7XHJcblxyXG5cdFx0XHRcdHN0ZXBzID0gcGN0RGlmZmVyZW5jZSAvIGRlbnNpdHk7XHJcblx0XHRcdFx0cmVhbFN0ZXBzID0gTWF0aC5yb3VuZChzdGVwcyk7XHJcblxyXG5cdFx0XHRcdC8vIFRoaXMgcmF0aW8gcmVwcmVzZW50cyB0aGUgYW1vdW50IG9mIHBlcmNlbnRhZ2Utc3BhY2UgYSBwb2ludCBpbmRpY2F0ZXMuXHJcblx0XHRcdFx0Ly8gRm9yIGEgZGVuc2l0eSAxIHRoZSBwb2ludHMvcGVyY2VudGFnZSA9IDEuIEZvciBkZW5zaXR5IDIsIHRoYXQgcGVyY2VudGFnZSBuZWVkcyB0byBiZSByZS1kZXZpZGVkLlxyXG5cdFx0XHRcdC8vIFJvdW5kIHRoZSBwZXJjZW50YWdlIG9mZnNldCB0byBhbiBldmVuIG51bWJlciwgdGhlbiBkaXZpZGUgYnkgdHdvXHJcblx0XHRcdFx0Ly8gdG8gc3ByZWFkIHRoZSBvZmZzZXQgb24gYm90aCBzaWRlcyBvZiB0aGUgcmFuZ2UuXHJcblx0XHRcdFx0c3RlcHNpemUgPSBwY3REaWZmZXJlbmNlL3JlYWxTdGVwcztcclxuXHJcblx0XHRcdFx0Ly8gRGl2aWRlIGFsbCBwb2ludHMgZXZlbmx5LCBhZGRpbmcgdGhlIGNvcnJlY3QgbnVtYmVyIHRvIHRoaXMgc3VicmFuZ2UuXHJcblx0XHRcdFx0Ly8gUnVuIHVwIHRvIDw9IHNvIHRoYXQgMTAwJSBnZXRzIGEgcG9pbnQsIGV2ZW50IGlmIGlnbm9yZUxhc3QgaXMgc2V0LlxyXG5cdFx0XHRcdGZvciAoIHEgPSAxOyBxIDw9IHJlYWxTdGVwczsgcSArPSAxICkge1xyXG5cclxuXHRcdFx0XHRcdC8vIFRoZSByYXRpbyBiZXR3ZWVuIHRoZSByb3VuZGVkIHZhbHVlIGFuZCB0aGUgYWN0dWFsIHNpemUgbWlnaHQgYmUgfjElIG9mZi5cclxuXHRcdFx0XHRcdC8vIENvcnJlY3QgdGhlIHBlcmNlbnRhZ2Ugb2Zmc2V0IGJ5IHRoZSBudW1iZXIgb2YgcG9pbnRzXHJcblx0XHRcdFx0XHQvLyBwZXIgc3VicmFuZ2UuIGRlbnNpdHkgPSAxIHdpbGwgcmVzdWx0IGluIDEwMCBwb2ludHMgb24gdGhlXHJcblx0XHRcdFx0XHQvLyBmdWxsIHJhbmdlLCAyIGZvciA1MCwgNCBmb3IgMjUsIGV0Yy5cclxuXHRcdFx0XHRcdHBjdFBvcyA9IHByZXZQY3QgKyAoIHEgKiBzdGVwc2l6ZSApO1xyXG5cdFx0XHRcdFx0aW5kZXhlc1twY3RQb3MudG9GaXhlZCg1KV0gPSBbJ3gnLCAwXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIERldGVybWluZSB0aGUgcG9pbnQgdHlwZS5cclxuXHRcdFx0XHR0eXBlID0gKGdyb3VwLmluZGV4T2YoaSkgPiAtMSkgPyAxIDogKCBtb2RlID09PSAnc3RlcHMnID8gMiA6IDAgKTtcclxuXHJcblx0XHRcdFx0Ly8gRW5mb3JjZSB0aGUgJ2lnbm9yZUZpcnN0JyBvcHRpb24gYnkgb3ZlcndyaXRpbmcgdGhlIHR5cGUgZm9yIDAuXHJcblx0XHRcdFx0aWYgKCAhaW5kZXggJiYgaWdub3JlRmlyc3QgKSB7XHJcblx0XHRcdFx0XHR0eXBlID0gMDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICggIShpID09PSBoaWdoICYmIGlnbm9yZUxhc3QpKSB7XHJcblx0XHRcdFx0XHQvLyBNYXJrIHRoZSAndHlwZScgb2YgdGhpcyBwb2ludC4gMCA9IHBsYWluLCAxID0gcmVhbCB2YWx1ZSwgMiA9IHN0ZXAgdmFsdWUuXHJcblx0XHRcdFx0XHRpbmRleGVzW25ld1BjdC50b0ZpeGVkKDUpXSA9IFtpLCB0eXBlXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFVwZGF0ZSB0aGUgcGVyY2VudGFnZSBjb3VudC5cclxuXHRcdFx0XHRwcmV2UGN0ID0gbmV3UGN0O1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gaW5kZXhlcztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZE1hcmtpbmcgKCBzcHJlYWQsIGZpbHRlckZ1bmMsIGZvcm1hdHRlciApIHtcclxuXHJcblx0XHR2YXIgZWxlbWVudCA9IHNjb3BlX0RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cclxuXHRcdHZhciB2YWx1ZVNpemVDbGFzc2VzID0gW1xyXG5cdFx0XHRvcHRpb25zLmNzc0NsYXNzZXMudmFsdWVOb3JtYWwsXHJcblx0XHRcdG9wdGlvbnMuY3NzQ2xhc3Nlcy52YWx1ZUxhcmdlLFxyXG5cdFx0XHRvcHRpb25zLmNzc0NsYXNzZXMudmFsdWVTdWJcclxuXHRcdF07XHJcblx0XHR2YXIgbWFya2VyU2l6ZUNsYXNzZXMgPSBbXHJcblx0XHRcdG9wdGlvbnMuY3NzQ2xhc3Nlcy5tYXJrZXJOb3JtYWwsXHJcblx0XHRcdG9wdGlvbnMuY3NzQ2xhc3Nlcy5tYXJrZXJMYXJnZSxcclxuXHRcdFx0b3B0aW9ucy5jc3NDbGFzc2VzLm1hcmtlclN1YlxyXG5cdFx0XTtcclxuXHRcdHZhciB2YWx1ZU9yaWVudGF0aW9uQ2xhc3NlcyA9IFtcclxuXHRcdFx0b3B0aW9ucy5jc3NDbGFzc2VzLnZhbHVlSG9yaXpvbnRhbCxcclxuXHRcdFx0b3B0aW9ucy5jc3NDbGFzc2VzLnZhbHVlVmVydGljYWxcclxuXHRcdF07XHJcblx0XHR2YXIgbWFya2VyT3JpZW50YXRpb25DbGFzc2VzID0gW1xyXG5cdFx0XHRvcHRpb25zLmNzc0NsYXNzZXMubWFya2VySG9yaXpvbnRhbCxcclxuXHRcdFx0b3B0aW9ucy5jc3NDbGFzc2VzLm1hcmtlclZlcnRpY2FsXHJcblx0XHRdO1xyXG5cclxuXHRcdGFkZENsYXNzKGVsZW1lbnQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5waXBzKTtcclxuXHRcdGFkZENsYXNzKGVsZW1lbnQsIG9wdGlvbnMub3J0ID09PSAwID8gb3B0aW9ucy5jc3NDbGFzc2VzLnBpcHNIb3Jpem9udGFsIDogb3B0aW9ucy5jc3NDbGFzc2VzLnBpcHNWZXJ0aWNhbCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0Q2xhc3NlcyggdHlwZSwgc291cmNlICl7XHJcblx0XHRcdHZhciBhID0gc291cmNlID09PSBvcHRpb25zLmNzc0NsYXNzZXMudmFsdWU7XHJcblx0XHRcdHZhciBvcmllbnRhdGlvbkNsYXNzZXMgPSBhID8gdmFsdWVPcmllbnRhdGlvbkNsYXNzZXMgOiBtYXJrZXJPcmllbnRhdGlvbkNsYXNzZXM7XHJcblx0XHRcdHZhciBzaXplQ2xhc3NlcyA9IGEgPyB2YWx1ZVNpemVDbGFzc2VzIDogbWFya2VyU2l6ZUNsYXNzZXM7XHJcblxyXG5cdFx0XHRyZXR1cm4gc291cmNlICsgJyAnICsgb3JpZW50YXRpb25DbGFzc2VzW29wdGlvbnMub3J0XSArICcgJyArIHNpemVDbGFzc2VzW3R5cGVdO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGFkZFNwcmVhZCAoIG9mZnNldCwgdmFsdWVzICl7XHJcblxyXG5cdFx0XHQvLyBBcHBseSB0aGUgZmlsdGVyIGZ1bmN0aW9uLCBpZiBpdCBpcyBzZXQuXHJcblx0XHRcdHZhbHVlc1sxXSA9ICh2YWx1ZXNbMV0gJiYgZmlsdGVyRnVuYykgPyBmaWx0ZXJGdW5jKHZhbHVlc1swXSwgdmFsdWVzWzFdKSA6IHZhbHVlc1sxXTtcclxuXHJcblx0XHRcdC8vIEFkZCBhIG1hcmtlciBmb3IgZXZlcnkgcG9pbnRcclxuXHRcdFx0dmFyIG5vZGUgPSBhZGROb2RlVG8oZWxlbWVudCwgZmFsc2UpO1xyXG5cdFx0XHRcdG5vZGUuY2xhc3NOYW1lID0gZ2V0Q2xhc3Nlcyh2YWx1ZXNbMV0sIG9wdGlvbnMuY3NzQ2xhc3Nlcy5tYXJrZXIpO1xyXG5cdFx0XHRcdG5vZGUuc3R5bGVbb3B0aW9ucy5zdHlsZV0gPSBvZmZzZXQgKyAnJSc7XHJcblxyXG5cdFx0XHQvLyBWYWx1ZXMgYXJlIG9ubHkgYXBwZW5kZWQgZm9yIHBvaW50cyBtYXJrZWQgJzEnIG9yICcyJy5cclxuXHRcdFx0aWYgKCB2YWx1ZXNbMV0gKSB7XHJcblx0XHRcdFx0bm9kZSA9IGFkZE5vZGVUbyhlbGVtZW50LCBmYWxzZSk7XHJcblx0XHRcdFx0bm9kZS5jbGFzc05hbWUgPSBnZXRDbGFzc2VzKHZhbHVlc1sxXSwgb3B0aW9ucy5jc3NDbGFzc2VzLnZhbHVlKTtcclxuXHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScsIHZhbHVlc1swXSk7XHJcblx0XHRcdFx0bm9kZS5zdHlsZVtvcHRpb25zLnN0eWxlXSA9IG9mZnNldCArICclJztcclxuXHRcdFx0XHRub2RlLmlubmVyVGV4dCA9IGZvcm1hdHRlci50byh2YWx1ZXNbMF0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQXBwZW5kIGFsbCBwb2ludHMuXHJcblx0XHRPYmplY3Qua2V5cyhzcHJlYWQpLmZvckVhY2goZnVuY3Rpb24oYSl7XHJcblx0XHRcdGFkZFNwcmVhZChhLCBzcHJlYWRbYV0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGVsZW1lbnQ7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiByZW1vdmVQaXBzICggKSB7XHJcblx0XHRpZiAoIHNjb3BlX1BpcHMgKSB7XHJcblx0XHRcdHJlbW92ZUVsZW1lbnQoc2NvcGVfUGlwcyk7XHJcblx0XHRcdHNjb3BlX1BpcHMgPSBudWxsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcGlwcyAoIGdyaWQgKSB7XHJcblxyXG5cdFx0Ly8gRml4ICM2NjlcclxuXHRcdHJlbW92ZVBpcHMoKTtcclxuXHJcblx0XHR2YXIgbW9kZSA9IGdyaWQubW9kZTtcclxuXHRcdHZhciBkZW5zaXR5ID0gZ3JpZC5kZW5zaXR5IHx8IDE7XHJcblx0XHR2YXIgZmlsdGVyID0gZ3JpZC5maWx0ZXIgfHwgZmFsc2U7XHJcblx0XHR2YXIgdmFsdWVzID0gZ3JpZC52YWx1ZXMgfHwgZmFsc2U7XHJcblx0XHR2YXIgc3RlcHBlZCA9IGdyaWQuc3RlcHBlZCB8fCBmYWxzZTtcclxuXHRcdHZhciBncm91cCA9IGdldEdyb3VwKCBtb2RlLCB2YWx1ZXMsIHN0ZXBwZWQgKTtcclxuXHRcdHZhciBzcHJlYWQgPSBnZW5lcmF0ZVNwcmVhZCggZGVuc2l0eSwgbW9kZSwgZ3JvdXAgKTtcclxuXHRcdHZhciBmb3JtYXQgPSBncmlkLmZvcm1hdCB8fCB7XHJcblx0XHRcdHRvOiBNYXRoLnJvdW5kXHJcblx0XHR9O1xyXG5cclxuXHRcdHNjb3BlX1BpcHMgPSBzY29wZV9UYXJnZXQuYXBwZW5kQ2hpbGQoYWRkTWFya2luZyhcclxuXHRcdFx0c3ByZWFkLFxyXG5cdFx0XHRmaWx0ZXIsXHJcblx0XHRcdGZvcm1hdFxyXG5cdFx0KSk7XHJcblxyXG5cdFx0cmV0dXJuIHNjb3BlX1BpcHM7XHJcblx0fVxyXG5cclxuLyohIEluIHRoaXMgZmlsZTogQnJvd3NlciBldmVudHMgKG5vdCBzbGlkZXIgZXZlbnRzIGxpa2Ugc2xpZGUsIGNoYW5nZSk7ICovXHJcblxyXG5cdC8vIFNob3J0aGFuZCBmb3IgYmFzZSBkaW1lbnNpb25zLlxyXG5cdGZ1bmN0aW9uIGJhc2VTaXplICggKSB7XHJcblx0XHR2YXIgcmVjdCA9IHNjb3BlX0Jhc2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHR2YXIgYWx0ID0gJ29mZnNldCcgKyBbJ1dpZHRoJywgJ0hlaWdodCddW29wdGlvbnMub3J0XTtcclxuXHRcdHJldHVybiBvcHRpb25zLm9ydCA9PT0gMCA/IChyZWN0LndpZHRofHxzY29wZV9CYXNlW2FsdF0pIDogKHJlY3QuaGVpZ2h0fHxzY29wZV9CYXNlW2FsdF0pO1xyXG5cdH1cclxuXHJcblx0Ly8gSGFuZGxlciBmb3IgYXR0YWNoaW5nIGV2ZW50cyB0cm91Z2ggYSBwcm94eS5cclxuXHRmdW5jdGlvbiBhdHRhY2hFdmVudCAoIGV2ZW50cywgZWxlbWVudCwgY2FsbGJhY2ssIGRhdGEgKSB7XHJcblxyXG5cdFx0Ly8gVGhpcyBmdW5jdGlvbiBjYW4gYmUgdXNlZCB0byAnZmlsdGVyJyBldmVudHMgdG8gdGhlIHNsaWRlci5cclxuXHRcdC8vIGVsZW1lbnQgaXMgYSBub2RlLCBub3QgYSBub2RlTGlzdFxyXG5cclxuXHRcdHZhciBtZXRob2QgPSBmdW5jdGlvbiAoIGUgKXtcclxuXHJcblx0XHRcdGUgPSBmaXhFdmVudChlLCBkYXRhLnBhZ2VPZmZzZXQsIGRhdGEudGFyZ2V0IHx8IGVsZW1lbnQpO1xyXG5cclxuXHRcdFx0Ly8gZml4RXZlbnQgcmV0dXJucyBmYWxzZSBpZiB0aGlzIGV2ZW50IGhhcyBhIGRpZmZlcmVudCB0YXJnZXRcclxuXHRcdFx0Ly8gd2hlbiBoYW5kbGluZyAobXVsdGktKSB0b3VjaCBldmVudHM7XHJcblx0XHRcdGlmICggIWUgKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBkb05vdFJlamVjdCBpcyBwYXNzZWQgYnkgYWxsIGVuZCBldmVudHMgdG8gbWFrZSBzdXJlIHJlbGVhc2VkIHRvdWNoZXNcclxuXHRcdFx0Ly8gYXJlIG5vdCByZWplY3RlZCwgbGVhdmluZyB0aGUgc2xpZGVyIFwic3R1Y2tcIiB0byB0aGUgY3Vyc29yO1xyXG5cdFx0XHRpZiAoIHNjb3BlX1RhcmdldC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgJiYgIWRhdGEuZG9Ob3RSZWplY3QgKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBTdG9wIGlmIGFuIGFjdGl2ZSAndGFwJyB0cmFuc2l0aW9uIGlzIHRha2luZyBwbGFjZS5cclxuXHRcdFx0aWYgKCBoYXNDbGFzcyhzY29wZV9UYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy50YXApICYmICFkYXRhLmRvTm90UmVqZWN0ICkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gSWdub3JlIHJpZ2h0IG9yIG1pZGRsZSBjbGlja3Mgb24gc3RhcnQgIzQ1NFxyXG5cdFx0XHRpZiAoIGV2ZW50cyA9PT0gYWN0aW9ucy5zdGFydCAmJiBlLmJ1dHRvbnMgIT09IHVuZGVmaW5lZCAmJiBlLmJ1dHRvbnMgPiAxICkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gSWdub3JlIHJpZ2h0IG9yIG1pZGRsZSBjbGlja3Mgb24gc3RhcnQgIzQ1NFxyXG5cdFx0XHRpZiAoIGRhdGEuaG92ZXIgJiYgZS5idXR0b25zICkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gJ3N1cHBvcnRzUGFzc2l2ZScgaXMgb25seSB0cnVlIGlmIGEgYnJvd3NlciBhbHNvIHN1cHBvcnRzIHRvdWNoLWFjdGlvbjogbm9uZSBpbiBDU1MuXHJcblx0XHRcdC8vIGlPUyBzYWZhcmkgZG9lcyBub3QsIHNvIGl0IGRvZXNuJ3QgZ2V0IHRvIGJlbmVmaXQgZnJvbSBwYXNzaXZlIHNjcm9sbGluZy4gaU9TIGRvZXMgc3VwcG9ydFxyXG5cdFx0XHQvLyB0b3VjaC1hY3Rpb246IG1hbmlwdWxhdGlvbiwgYnV0IHRoYXQgYWxsb3dzIHBhbm5pbmcsIHdoaWNoIGJyZWFrc1xyXG5cdFx0XHQvLyBzbGlkZXJzIGFmdGVyIHpvb21pbmcvb24gbm9uLXJlc3BvbnNpdmUgcGFnZXMuXHJcblx0XHRcdC8vIFNlZTogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTEzMzExMlxyXG5cdFx0XHRpZiAoICFzdXBwb3J0c1Bhc3NpdmUgKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRlLmNhbGNQb2ludCA9IGUucG9pbnRzWyBvcHRpb25zLm9ydCBdO1xyXG5cclxuXHRcdFx0Ly8gQ2FsbCB0aGUgZXZlbnQgaGFuZGxlciB3aXRoIHRoZSBldmVudCBbIGFuZCBhZGRpdGlvbmFsIGRhdGEgXS5cclxuXHRcdFx0Y2FsbGJhY2sgKCBlLCBkYXRhICk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBtZXRob2RzID0gW107XHJcblxyXG5cdFx0Ly8gQmluZCBhIGNsb3N1cmUgb24gdGhlIHRhcmdldCBmb3IgZXZlcnkgZXZlbnQgdHlwZS5cclxuXHRcdGV2ZW50cy5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24oIGV2ZW50TmFtZSApe1xyXG5cdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBtZXRob2QsIHN1cHBvcnRzUGFzc2l2ZSA/IHsgcGFzc2l2ZTogdHJ1ZSB9IDogZmFsc2UpO1xyXG5cdFx0XHRtZXRob2RzLnB1c2goW2V2ZW50TmFtZSwgbWV0aG9kXSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gbWV0aG9kcztcclxuXHR9XHJcblxyXG5cdC8vIFByb3ZpZGUgYSBjbGVhbiBldmVudCB3aXRoIHN0YW5kYXJkaXplZCBvZmZzZXQgdmFsdWVzLlxyXG5cdGZ1bmN0aW9uIGZpeEV2ZW50ICggZSwgcGFnZU9mZnNldCwgZXZlbnRUYXJnZXQgKSB7XHJcblxyXG5cdFx0Ly8gRmlsdGVyIHRoZSBldmVudCB0byByZWdpc3RlciB0aGUgdHlwZSwgd2hpY2ggY2FuIGJlXHJcblx0XHQvLyB0b3VjaCwgbW91c2Ugb3IgcG9pbnRlci4gT2Zmc2V0IGNoYW5nZXMgbmVlZCB0byBiZVxyXG5cdFx0Ly8gbWFkZSBvbiBhbiBldmVudCBzcGVjaWZpYyBiYXNpcy5cclxuXHRcdHZhciB0b3VjaCA9IGUudHlwZS5pbmRleE9mKCd0b3VjaCcpID09PSAwO1xyXG5cdFx0dmFyIG1vdXNlID0gZS50eXBlLmluZGV4T2YoJ21vdXNlJykgPT09IDA7XHJcblx0XHR2YXIgcG9pbnRlciA9IGUudHlwZS5pbmRleE9mKCdwb2ludGVyJykgPT09IDA7XHJcblxyXG5cdFx0dmFyIHg7XHJcblx0XHR2YXIgeTtcclxuXHJcblx0XHQvLyBJRTEwIGltcGxlbWVudGVkIHBvaW50ZXIgZXZlbnRzIHdpdGggYSBwcmVmaXg7XHJcblx0XHRpZiAoIGUudHlwZS5pbmRleE9mKCdNU1BvaW50ZXInKSA9PT0gMCApIHtcclxuXHRcdFx0cG9pbnRlciA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSW4gdGhlIGV2ZW50IHRoYXQgbXVsdGl0b3VjaCBpcyBhY3RpdmF0ZWQsIHRoZSBvbmx5IHRoaW5nIG9uZSBoYW5kbGUgc2hvdWxkIGJlIGNvbmNlcm5lZFxyXG5cdFx0Ly8gYWJvdXQgaXMgdGhlIHRvdWNoZXMgdGhhdCBvcmlnaW5hdGVkIG9uIHRvcCBvZiBpdC5cclxuXHRcdGlmICggdG91Y2ggKSB7XHJcblxyXG5cdFx0XHQvLyBSZXR1cm5zIHRydWUgaWYgYSB0b3VjaCBvcmlnaW5hdGVkIG9uIHRoZSB0YXJnZXQuXHJcblx0XHRcdHZhciBpc1RvdWNoT25UYXJnZXQgPSBmdW5jdGlvbiAoY2hlY2tUb3VjaCkge1xyXG5cdFx0XHRcdHJldHVybiBjaGVja1RvdWNoLnRhcmdldCA9PT0gZXZlbnRUYXJnZXQgfHwgZXZlbnRUYXJnZXQuY29udGFpbnMoY2hlY2tUb3VjaC50YXJnZXQpO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gSW4gdGhlIGNhc2Ugb2YgdG91Y2hzdGFydCBldmVudHMsIHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoZXJlIGlzIHN0aWxsIG5vIG1vcmUgdGhhbiBvbmVcclxuXHRcdFx0Ly8gdG91Y2ggb24gdGhlIHRhcmdldCBzbyB3ZSBsb29rIGFtb25nc3QgYWxsIHRvdWNoZXMuXHJcblx0XHRcdGlmIChlLnR5cGUgPT09ICd0b3VjaHN0YXJ0Jykge1xyXG5cclxuXHRcdFx0XHR2YXIgdGFyZ2V0VG91Y2hlcyA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChlLnRvdWNoZXMsIGlzVG91Y2hPblRhcmdldCk7XHJcblxyXG5cdFx0XHRcdC8vIERvIG5vdCBzdXBwb3J0IG1vcmUgdGhhbiBvbmUgdG91Y2ggcGVyIGhhbmRsZS5cclxuXHRcdFx0XHRpZiAoIHRhcmdldFRvdWNoZXMubGVuZ3RoID4gMSApIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHggPSB0YXJnZXRUb3VjaGVzWzBdLnBhZ2VYO1xyXG5cdFx0XHRcdHkgPSB0YXJnZXRUb3VjaGVzWzBdLnBhZ2VZO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0Ly8gSW4gdGhlIG90aGVyIGNhc2VzLCBmaW5kIG9uIGNoYW5nZWRUb3VjaGVzIGlzIGVub3VnaC5cclxuXHRcdFx0XHR2YXIgdGFyZ2V0VG91Y2ggPSBBcnJheS5wcm90b3R5cGUuZmluZC5jYWxsKGUuY2hhbmdlZFRvdWNoZXMsIGlzVG91Y2hPblRhcmdldCk7XHJcblxyXG5cdFx0XHRcdC8vIENhbmNlbCBpZiB0aGUgdGFyZ2V0IHRvdWNoIGhhcyBub3QgbW92ZWQuXHJcblx0XHRcdFx0aWYgKCAhdGFyZ2V0VG91Y2ggKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR4ID0gdGFyZ2V0VG91Y2gucGFnZVg7XHJcblx0XHRcdFx0eSA9IHRhcmdldFRvdWNoLnBhZ2VZO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cGFnZU9mZnNldCA9IHBhZ2VPZmZzZXQgfHwgZ2V0UGFnZU9mZnNldChzY29wZV9Eb2N1bWVudCk7XHJcblxyXG5cdFx0aWYgKCBtb3VzZSB8fCBwb2ludGVyICkge1xyXG5cdFx0XHR4ID0gZS5jbGllbnRYICsgcGFnZU9mZnNldC54O1xyXG5cdFx0XHR5ID0gZS5jbGllbnRZICsgcGFnZU9mZnNldC55O1xyXG5cdFx0fVxyXG5cclxuXHRcdGUucGFnZU9mZnNldCA9IHBhZ2VPZmZzZXQ7XHJcblx0XHRlLnBvaW50cyA9IFt4LCB5XTtcclxuXHRcdGUuY3Vyc29yID0gbW91c2UgfHwgcG9pbnRlcjsgLy8gRml4ICM0MzVcclxuXHJcblx0XHRyZXR1cm4gZTtcclxuXHR9XHJcblxyXG5cdC8vIFRyYW5zbGF0ZSBhIGNvb3JkaW5hdGUgaW4gdGhlIGRvY3VtZW50IHRvIGEgcGVyY2VudGFnZSBvbiB0aGUgc2xpZGVyXHJcblx0ZnVuY3Rpb24gY2FsY1BvaW50VG9QZXJjZW50YWdlICggY2FsY1BvaW50ICkge1xyXG5cdFx0dmFyIGxvY2F0aW9uID0gY2FsY1BvaW50IC0gb2Zmc2V0KHNjb3BlX0Jhc2UsIG9wdGlvbnMub3J0KTtcclxuXHRcdHZhciBwcm9wb3NhbCA9ICggbG9jYXRpb24gKiAxMDAgKSAvIGJhc2VTaXplKCk7XHJcblxyXG5cdFx0Ly8gQ2xhbXAgcHJvcG9zYWwgYmV0d2VlbiAwJSBhbmQgMTAwJVxyXG5cdFx0Ly8gT3V0LW9mLWJvdW5kIGNvb3JkaW5hdGVzIG1heSBvY2N1ciB3aGVuIC5ub1VpLWJhc2UgcHNldWRvLWVsZW1lbnRzXHJcblx0XHQvLyBhcmUgdXNlZCAoZS5nLiBjb250YWluZWQgaGFuZGxlcyBmZWF0dXJlKVxyXG5cdFx0cHJvcG9zYWwgPSBsaW1pdChwcm9wb3NhbCk7XHJcblxyXG5cdFx0cmV0dXJuIG9wdGlvbnMuZGlyID8gMTAwIC0gcHJvcG9zYWwgOiBwcm9wb3NhbDtcclxuXHR9XHJcblxyXG5cdC8vIEZpbmQgaGFuZGxlIGNsb3Nlc3QgdG8gYSBjZXJ0YWluIHBlcmNlbnRhZ2Ugb24gdGhlIHNsaWRlclxyXG5cdGZ1bmN0aW9uIGdldENsb3Nlc3RIYW5kbGUgKCBwcm9wb3NhbCApIHtcclxuXHJcblx0XHR2YXIgY2xvc2VzdCA9IDEwMDtcclxuXHRcdHZhciBoYW5kbGVOdW1iZXIgPSBmYWxzZTtcclxuXHJcblx0XHRzY29wZV9IYW5kbGVzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlLCBpbmRleCl7XHJcblxyXG5cdFx0XHQvLyBEaXNhYmxlZCBoYW5kbGVzIGFyZSBpZ25vcmVkXHJcblx0XHRcdGlmICggaGFuZGxlLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBwb3MgPSBNYXRoLmFicyhzY29wZV9Mb2NhdGlvbnNbaW5kZXhdIC0gcHJvcG9zYWwpO1xyXG5cclxuXHRcdFx0aWYgKCBwb3MgPCBjbG9zZXN0IHx8IChwb3MgPT09IDEwMCAmJiBjbG9zZXN0ID09PSAxMDApICkge1xyXG5cdFx0XHRcdGhhbmRsZU51bWJlciA9IGluZGV4O1xyXG5cdFx0XHRcdGNsb3Nlc3QgPSBwb3M7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBoYW5kbGVOdW1iZXI7XHJcblx0fVxyXG5cclxuXHQvLyBGaXJlICdlbmQnIHdoZW4gYSBtb3VzZSBvciBwZW4gbGVhdmVzIHRoZSBkb2N1bWVudC5cclxuXHRmdW5jdGlvbiBkb2N1bWVudExlYXZlICggZXZlbnQsIGRhdGEgKSB7XHJcblx0XHRpZiAoIGV2ZW50LnR5cGUgPT09IFwibW91c2VvdXRcIiAmJiBldmVudC50YXJnZXQubm9kZU5hbWUgPT09IFwiSFRNTFwiICYmIGV2ZW50LnJlbGF0ZWRUYXJnZXQgPT09IG51bGwgKXtcclxuXHRcdFx0ZXZlbnRFbmQgKGV2ZW50LCBkYXRhKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIEhhbmRsZSBtb3ZlbWVudCBvbiBkb2N1bWVudCBmb3IgaGFuZGxlIGFuZCByYW5nZSBkcmFnLlxyXG5cdGZ1bmN0aW9uIGV2ZW50TW92ZSAoIGV2ZW50LCBkYXRhICkge1xyXG5cclxuXHRcdC8vIEZpeCAjNDk4XHJcblx0XHQvLyBDaGVjayB2YWx1ZSBvZiAuYnV0dG9ucyBpbiAnc3RhcnQnIHRvIHdvcmsgYXJvdW5kIGEgYnVnIGluIElFMTAgbW9iaWxlIChkYXRhLmJ1dHRvbnNQcm9wZXJ0eSkuXHJcblx0XHQvLyBodHRwczovL2Nvbm5lY3QubWljcm9zb2Z0LmNvbS9JRS9mZWVkYmFjay9kZXRhaWxzLzkyNzAwNS9tb2JpbGUtaWUxMC13aW5kb3dzLXBob25lLWJ1dHRvbnMtcHJvcGVydHktb2YtcG9pbnRlcm1vdmUtZXZlbnQtYWx3YXlzLXplcm9cclxuXHRcdC8vIElFOSBoYXMgLmJ1dHRvbnMgYW5kIC53aGljaCB6ZXJvIG9uIG1vdXNlbW92ZS5cclxuXHRcdC8vIEZpcmVmb3ggYnJlYWtzIHRoZSBzcGVjIE1ETiBkZWZpbmVzLlxyXG5cdFx0aWYgKCBuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiTVNJRSA5XCIpID09PSAtMSAmJiBldmVudC5idXR0b25zID09PSAwICYmIGRhdGEuYnV0dG9uc1Byb3BlcnR5ICE9PSAwICkge1xyXG5cdFx0XHRyZXR1cm4gZXZlbnRFbmQoZXZlbnQsIGRhdGEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENoZWNrIGlmIHdlIGFyZSBtb3ZpbmcgdXAgb3IgZG93blxyXG5cdFx0dmFyIG1vdmVtZW50ID0gKG9wdGlvbnMuZGlyID8gLTEgOiAxKSAqIChldmVudC5jYWxjUG9pbnQgLSBkYXRhLnN0YXJ0Q2FsY1BvaW50KTtcclxuXHJcblx0XHQvLyBDb252ZXJ0IHRoZSBtb3ZlbWVudCBpbnRvIGEgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHdpZHRoL2hlaWdodFxyXG5cdFx0dmFyIHByb3Bvc2FsID0gKG1vdmVtZW50ICogMTAwKSAvIGRhdGEuYmFzZVNpemU7XHJcblxyXG5cdFx0bW92ZUhhbmRsZXMobW92ZW1lbnQgPiAwLCBwcm9wb3NhbCwgZGF0YS5sb2NhdGlvbnMsIGRhdGEuaGFuZGxlTnVtYmVycyk7XHJcblx0fVxyXG5cclxuXHQvLyBVbmJpbmQgbW92ZSBldmVudHMgb24gZG9jdW1lbnQsIGNhbGwgY2FsbGJhY2tzLlxyXG5cdGZ1bmN0aW9uIGV2ZW50RW5kICggZXZlbnQsIGRhdGEgKSB7XHJcblxyXG5cdFx0Ly8gVGhlIGhhbmRsZSBpcyBubyBsb25nZXIgYWN0aXZlLCBzbyByZW1vdmUgdGhlIGNsYXNzLlxyXG5cdFx0aWYgKCBkYXRhLmhhbmRsZSApIHtcclxuXHRcdFx0cmVtb3ZlQ2xhc3MoZGF0YS5oYW5kbGUsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5hY3RpdmUpO1xyXG5cdFx0XHRzY29wZV9BY3RpdmVIYW5kbGVzQ291bnQgLT0gMTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBVbmJpbmQgdGhlIG1vdmUgYW5kIGVuZCBldmVudHMsIHdoaWNoIGFyZSBhZGRlZCBvbiAnc3RhcnQnLlxyXG5cdFx0ZGF0YS5saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiggYyApIHtcclxuXHRcdFx0c2NvcGVfRG9jdW1lbnRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoY1swXSwgY1sxXSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAoIHNjb3BlX0FjdGl2ZUhhbmRsZXNDb3VudCA9PT0gMCApIHtcclxuXHRcdFx0Ly8gUmVtb3ZlIGRyYWdnaW5nIGNsYXNzLlxyXG5cdFx0XHRyZW1vdmVDbGFzcyhzY29wZV9UYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5kcmFnKTtcclxuXHRcdFx0c2V0WmluZGV4KCk7XHJcblxyXG5cdFx0XHQvLyBSZW1vdmUgY3Vyc29yIHN0eWxlcyBhbmQgdGV4dC1zZWxlY3Rpb24gZXZlbnRzIGJvdW5kIHRvIHRoZSBib2R5LlxyXG5cdFx0XHRpZiAoIGV2ZW50LmN1cnNvciApIHtcclxuXHRcdFx0XHRzY29wZV9Cb2R5LnN0eWxlLmN1cnNvciA9ICcnO1xyXG5cdFx0XHRcdHNjb3BlX0JvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2VsZWN0c3RhcnQnLCBwcmV2ZW50RGVmYXVsdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRkYXRhLmhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVOdW1iZXIpe1xyXG5cdFx0XHRmaXJlRXZlbnQoJ2NoYW5nZScsIGhhbmRsZU51bWJlcik7XHJcblx0XHRcdGZpcmVFdmVudCgnc2V0JywgaGFuZGxlTnVtYmVyKTtcclxuXHRcdFx0ZmlyZUV2ZW50KCdlbmQnLCBoYW5kbGVOdW1iZXIpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyBCaW5kIG1vdmUgZXZlbnRzIG9uIGRvY3VtZW50LlxyXG5cdGZ1bmN0aW9uIGV2ZW50U3RhcnQgKCBldmVudCwgZGF0YSApIHtcclxuXHJcblx0XHR2YXIgaGFuZGxlO1xyXG5cdFx0aWYgKCBkYXRhLmhhbmRsZU51bWJlcnMubGVuZ3RoID09PSAxICkge1xyXG5cclxuXHRcdFx0dmFyIGhhbmRsZU9yaWdpbiA9IHNjb3BlX0hhbmRsZXNbZGF0YS5oYW5kbGVOdW1iZXJzWzBdXTtcclxuXHJcblx0XHRcdC8vIElnbm9yZSAnZGlzYWJsZWQnIGhhbmRsZXNcclxuXHRcdFx0aWYgKCBoYW5kbGVPcmlnaW4uaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpICkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aGFuZGxlID0gaGFuZGxlT3JpZ2luLmNoaWxkcmVuWzBdO1xyXG5cdFx0XHRzY29wZV9BY3RpdmVIYW5kbGVzQ291bnQgKz0gMTtcclxuXHJcblx0XHRcdC8vIE1hcmsgdGhlIGhhbmRsZSBhcyAnYWN0aXZlJyBzbyBpdCBjYW4gYmUgc3R5bGVkLlxyXG5cdFx0XHRhZGRDbGFzcyhoYW5kbGUsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5hY3RpdmUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEEgZHJhZyBzaG91bGQgbmV2ZXIgcHJvcGFnYXRlIHVwIHRvIHRoZSAndGFwJyBldmVudC5cclxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuXHRcdC8vIFJlY29yZCB0aGUgZXZlbnQgbGlzdGVuZXJzLlxyXG5cdFx0dmFyIGxpc3RlbmVycyA9IFtdO1xyXG5cclxuXHRcdC8vIEF0dGFjaCB0aGUgbW92ZSBhbmQgZW5kIGV2ZW50cy5cclxuXHRcdHZhciBtb3ZlRXZlbnQgPSBhdHRhY2hFdmVudChhY3Rpb25zLm1vdmUsIHNjb3BlX0RvY3VtZW50RWxlbWVudCwgZXZlbnRNb3ZlLCB7XHJcblx0XHRcdC8vIFRoZSBldmVudCB0YXJnZXQgaGFzIGNoYW5nZWQgc28gd2UgbmVlZCB0byBwcm9wYWdhdGUgdGhlIG9yaWdpbmFsIG9uZSBzbyB0aGF0IHdlIGtlZXBcclxuXHRcdFx0Ly8gcmVseWluZyBvbiBpdCB0byBleHRyYWN0IHRhcmdldCB0b3VjaGVzLlxyXG5cdFx0XHR0YXJnZXQ6IGV2ZW50LnRhcmdldCxcclxuXHRcdFx0aGFuZGxlOiBoYW5kbGUsXHJcblx0XHRcdGxpc3RlbmVyczogbGlzdGVuZXJzLFxyXG5cdFx0XHRzdGFydENhbGNQb2ludDogZXZlbnQuY2FsY1BvaW50LFxyXG5cdFx0XHRiYXNlU2l6ZTogYmFzZVNpemUoKSxcclxuXHRcdFx0cGFnZU9mZnNldDogZXZlbnQucGFnZU9mZnNldCxcclxuXHRcdFx0aGFuZGxlTnVtYmVyczogZGF0YS5oYW5kbGVOdW1iZXJzLFxyXG5cdFx0XHRidXR0b25zUHJvcGVydHk6IGV2ZW50LmJ1dHRvbnMsXHJcblx0XHRcdGxvY2F0aW9uczogc2NvcGVfTG9jYXRpb25zLnNsaWNlKClcclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciBlbmRFdmVudCA9IGF0dGFjaEV2ZW50KGFjdGlvbnMuZW5kLCBzY29wZV9Eb2N1bWVudEVsZW1lbnQsIGV2ZW50RW5kLCB7XHJcblx0XHRcdHRhcmdldDogZXZlbnQudGFyZ2V0LFxyXG5cdFx0XHRoYW5kbGU6IGhhbmRsZSxcclxuXHRcdFx0bGlzdGVuZXJzOiBsaXN0ZW5lcnMsXHJcblx0XHRcdGRvTm90UmVqZWN0OiB0cnVlLFxyXG5cdFx0XHRoYW5kbGVOdW1iZXJzOiBkYXRhLmhhbmRsZU51bWJlcnNcclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciBvdXRFdmVudCA9IGF0dGFjaEV2ZW50KFwibW91c2VvdXRcIiwgc2NvcGVfRG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudExlYXZlLCB7XHJcblx0XHRcdHRhcmdldDogZXZlbnQudGFyZ2V0LFxyXG5cdFx0XHRoYW5kbGU6IGhhbmRsZSxcclxuXHRcdFx0bGlzdGVuZXJzOiBsaXN0ZW5lcnMsXHJcblx0XHRcdGRvTm90UmVqZWN0OiB0cnVlLFxyXG5cdFx0XHRoYW5kbGVOdW1iZXJzOiBkYXRhLmhhbmRsZU51bWJlcnNcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFdlIHdhbnQgdG8gbWFrZSBzdXJlIHdlIHB1c2hlZCB0aGUgbGlzdGVuZXJzIGluIHRoZSBsaXN0ZW5lciBsaXN0IHJhdGhlciB0aGFuIGNyZWF0aW5nXHJcblx0XHQvLyBhIG5ldyBvbmUgYXMgaXQgaGFzIGFscmVhZHkgYmVlbiBwYXNzZWQgdG8gdGhlIGV2ZW50IGhhbmRsZXJzLlxyXG5cdFx0bGlzdGVuZXJzLnB1c2guYXBwbHkobGlzdGVuZXJzLCBtb3ZlRXZlbnQuY29uY2F0KGVuZEV2ZW50LCBvdXRFdmVudCkpO1xyXG5cclxuXHRcdC8vIFRleHQgc2VsZWN0aW9uIGlzbid0IGFuIGlzc3VlIG9uIHRvdWNoIGRldmljZXMsXHJcblx0XHQvLyBzbyBhZGRpbmcgY3Vyc29yIHN0eWxlcyBjYW4gYmUgc2tpcHBlZC5cclxuXHRcdGlmICggZXZlbnQuY3Vyc29yICkge1xyXG5cclxuXHRcdFx0Ly8gUHJldmVudCB0aGUgJ0knIGN1cnNvciBhbmQgZXh0ZW5kIHRoZSByYW5nZS1kcmFnIGN1cnNvci5cclxuXHRcdFx0c2NvcGVfQm9keS5zdHlsZS5jdXJzb3IgPSBnZXRDb21wdXRlZFN0eWxlKGV2ZW50LnRhcmdldCkuY3Vyc29yO1xyXG5cclxuXHRcdFx0Ly8gTWFyayB0aGUgdGFyZ2V0IHdpdGggYSBkcmFnZ2luZyBzdGF0ZS5cclxuXHRcdFx0aWYgKCBzY29wZV9IYW5kbGVzLmxlbmd0aCA+IDEgKSB7XHJcblx0XHRcdFx0YWRkQ2xhc3Moc2NvcGVfVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMuZHJhZyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFByZXZlbnQgdGV4dCBzZWxlY3Rpb24gd2hlbiBkcmFnZ2luZyB0aGUgaGFuZGxlcy5cclxuXHRcdFx0Ly8gSW4gbm9VaVNsaWRlciA8PSA5LjIuMCwgdGhpcyB3YXMgaGFuZGxlZCBieSBjYWxsaW5nIHByZXZlbnREZWZhdWx0IG9uIG1vdXNlL3RvdWNoIHN0YXJ0L21vdmUsXHJcblx0XHRcdC8vIHdoaWNoIGlzIHNjcm9sbCBibG9ja2luZy4gVGhlIHNlbGVjdHN0YXJ0IGV2ZW50IGlzIHN1cHBvcnRlZCBieSBGaXJlRm94IHN0YXJ0aW5nIGZyb20gdmVyc2lvbiA1MixcclxuXHRcdFx0Ly8gbWVhbmluZyB0aGUgb25seSBob2xkb3V0IGlzIGlPUyBTYWZhcmkuIFRoaXMgZG9lc24ndCBtYXR0ZXI6IHRleHQgc2VsZWN0aW9uIGlzbid0IHRyaWdnZXJlZCB0aGVyZS5cclxuXHRcdFx0Ly8gVGhlICdjdXJzb3InIGZsYWcgaXMgZmFsc2UuXHJcblx0XHRcdC8vIFNlZTogaHR0cDovL2Nhbml1c2UuY29tLyNzZWFyY2g9c2VsZWN0c3RhcnRcclxuXHRcdFx0c2NvcGVfQm9keS5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3RzdGFydCcsIHByZXZlbnREZWZhdWx0LCBmYWxzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZGF0YS5oYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlTnVtYmVyKXtcclxuXHRcdFx0ZmlyZUV2ZW50KCdzdGFydCcsIGhhbmRsZU51bWJlcik7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vIE1vdmUgY2xvc2VzdCBoYW5kbGUgdG8gdGFwcGVkIGxvY2F0aW9uLlxyXG5cdGZ1bmN0aW9uIGV2ZW50VGFwICggZXZlbnQgKSB7XHJcblxyXG5cdFx0Ly8gVGhlIHRhcCBldmVudCBzaG91bGRuJ3QgcHJvcGFnYXRlIHVwXHJcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcblx0XHR2YXIgcHJvcG9zYWwgPSBjYWxjUG9pbnRUb1BlcmNlbnRhZ2UoZXZlbnQuY2FsY1BvaW50KTtcclxuXHRcdHZhciBoYW5kbGVOdW1iZXIgPSBnZXRDbG9zZXN0SGFuZGxlKHByb3Bvc2FsKTtcclxuXHJcblx0XHQvLyBUYWNrbGUgdGhlIGNhc2UgdGhhdCBhbGwgaGFuZGxlcyBhcmUgJ2Rpc2FibGVkJy5cclxuXHRcdGlmICggaGFuZGxlTnVtYmVyID09PSBmYWxzZSApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZsYWcgdGhlIHNsaWRlciBhcyBpdCBpcyBub3cgaW4gYSB0cmFuc2l0aW9uYWwgc3RhdGUuXHJcblx0XHQvLyBUcmFuc2l0aW9uIHRha2VzIGEgY29uZmlndXJhYmxlIGFtb3VudCBvZiBtcyAoZGVmYXVsdCAzMDApLiBSZS1lbmFibGUgdGhlIHNsaWRlciBhZnRlciB0aGF0LlxyXG5cdFx0aWYgKCAhb3B0aW9ucy5ldmVudHMuc25hcCApIHtcclxuXHRcdFx0YWRkQ2xhc3NGb3Ioc2NvcGVfVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMudGFwLCBvcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uKTtcclxuXHRcdH1cclxuXHJcblx0XHRzZXRIYW5kbGUoaGFuZGxlTnVtYmVyLCBwcm9wb3NhbCwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG5cdFx0c2V0WmluZGV4KCk7XHJcblxyXG5cdFx0ZmlyZUV2ZW50KCdzbGlkZScsIGhhbmRsZU51bWJlciwgdHJ1ZSk7XHJcblx0XHRmaXJlRXZlbnQoJ3VwZGF0ZScsIGhhbmRsZU51bWJlciwgdHJ1ZSk7XHJcblx0XHRmaXJlRXZlbnQoJ2NoYW5nZScsIGhhbmRsZU51bWJlciwgdHJ1ZSk7XHJcblx0XHRmaXJlRXZlbnQoJ3NldCcsIGhhbmRsZU51bWJlciwgdHJ1ZSk7XHJcblxyXG5cdFx0aWYgKCBvcHRpb25zLmV2ZW50cy5zbmFwICkge1xyXG5cdFx0XHRldmVudFN0YXJ0KGV2ZW50LCB7IGhhbmRsZU51bWJlcnM6IFtoYW5kbGVOdW1iZXJdIH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gRmlyZXMgYSAnaG92ZXInIGV2ZW50IGZvciBhIGhvdmVyZWQgbW91c2UvcGVuIHBvc2l0aW9uLlxyXG5cdGZ1bmN0aW9uIGV2ZW50SG92ZXIgKCBldmVudCApIHtcclxuXHJcblx0XHR2YXIgcHJvcG9zYWwgPSBjYWxjUG9pbnRUb1BlcmNlbnRhZ2UoZXZlbnQuY2FsY1BvaW50KTtcclxuXHJcblx0XHR2YXIgdG8gPSBzY29wZV9TcGVjdHJ1bS5nZXRTdGVwKHByb3Bvc2FsKTtcclxuXHRcdHZhciB2YWx1ZSA9IHNjb3BlX1NwZWN0cnVtLmZyb21TdGVwcGluZyh0byk7XHJcblxyXG5cdFx0T2JqZWN0LmtleXMoc2NvcGVfRXZlbnRzKS5mb3JFYWNoKGZ1bmN0aW9uKCB0YXJnZXRFdmVudCApIHtcclxuXHRcdFx0aWYgKCAnaG92ZXInID09PSB0YXJnZXRFdmVudC5zcGxpdCgnLicpWzBdICkge1xyXG5cdFx0XHRcdHNjb3BlX0V2ZW50c1t0YXJnZXRFdmVudF0uZm9yRWFjaChmdW5jdGlvbiggY2FsbGJhY2sgKSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKCBzY29wZV9TZWxmLCB2YWx1ZSApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vIEF0dGFjaCBldmVudHMgdG8gc2V2ZXJhbCBzbGlkZXIgcGFydHMuXHJcblx0ZnVuY3Rpb24gYmluZFNsaWRlckV2ZW50cyAoIGJlaGF2aW91ciApIHtcclxuXHJcblx0XHQvLyBBdHRhY2ggdGhlIHN0YW5kYXJkIGRyYWcgZXZlbnQgdG8gdGhlIGhhbmRsZXMuXHJcblx0XHRpZiAoICFiZWhhdmlvdXIuZml4ZWQgKSB7XHJcblxyXG5cdFx0XHRzY29wZV9IYW5kbGVzLmZvckVhY2goZnVuY3Rpb24oIGhhbmRsZSwgaW5kZXggKXtcclxuXHJcblx0XHRcdFx0Ly8gVGhlc2UgZXZlbnRzIGFyZSBvbmx5IGJvdW5kIHRvIHRoZSB2aXN1YWwgaGFuZGxlXHJcblx0XHRcdFx0Ly8gZWxlbWVudCwgbm90IHRoZSAncmVhbCcgb3JpZ2luIGVsZW1lbnQuXHJcblx0XHRcdFx0YXR0YWNoRXZlbnQgKCBhY3Rpb25zLnN0YXJ0LCBoYW5kbGUuY2hpbGRyZW5bMF0sIGV2ZW50U3RhcnQsIHtcclxuXHRcdFx0XHRcdGhhbmRsZU51bWJlcnM6IFtpbmRleF1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQXR0YWNoIHRoZSB0YXAgZXZlbnQgdG8gdGhlIHNsaWRlciBiYXNlLlxyXG5cdFx0aWYgKCBiZWhhdmlvdXIudGFwICkge1xyXG5cdFx0XHRhdHRhY2hFdmVudCAoYWN0aW9ucy5zdGFydCwgc2NvcGVfQmFzZSwgZXZlbnRUYXAsIHt9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBGaXJlIGhvdmVyIGV2ZW50c1xyXG5cdFx0aWYgKCBiZWhhdmlvdXIuaG92ZXIgKSB7XHJcblx0XHRcdGF0dGFjaEV2ZW50IChhY3Rpb25zLm1vdmUsIHNjb3BlX0Jhc2UsIGV2ZW50SG92ZXIsIHsgaG92ZXI6IHRydWUgfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTWFrZSB0aGUgcmFuZ2UgZHJhZ2dhYmxlLlxyXG5cdFx0aWYgKCBiZWhhdmlvdXIuZHJhZyApe1xyXG5cclxuXHRcdFx0c2NvcGVfQ29ubmVjdHMuZm9yRWFjaChmdW5jdGlvbiggY29ubmVjdCwgaW5kZXggKXtcclxuXHJcblx0XHRcdFx0aWYgKCBjb25uZWN0ID09PSBmYWxzZSB8fCBpbmRleCA9PT0gMCB8fCBpbmRleCA9PT0gc2NvcGVfQ29ubmVjdHMubGVuZ3RoIC0gMSApIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBoYW5kbGVCZWZvcmUgPSBzY29wZV9IYW5kbGVzW2luZGV4IC0gMV07XHJcblx0XHRcdFx0dmFyIGhhbmRsZUFmdGVyID0gc2NvcGVfSGFuZGxlc1tpbmRleF07XHJcblx0XHRcdFx0dmFyIGV2ZW50SG9sZGVycyA9IFtjb25uZWN0XTtcclxuXHJcblx0XHRcdFx0YWRkQ2xhc3MoY29ubmVjdCwgb3B0aW9ucy5jc3NDbGFzc2VzLmRyYWdnYWJsZSk7XHJcblxyXG5cdFx0XHRcdC8vIFdoZW4gdGhlIHJhbmdlIGlzIGZpeGVkLCB0aGUgZW50aXJlIHJhbmdlIGNhblxyXG5cdFx0XHRcdC8vIGJlIGRyYWdnZWQgYnkgdGhlIGhhbmRsZXMuIFRoZSBoYW5kbGUgaW4gdGhlIGZpcnN0XHJcblx0XHRcdFx0Ly8gb3JpZ2luIHdpbGwgcHJvcGFnYXRlIHRoZSBzdGFydCBldmVudCB1cHdhcmQsXHJcblx0XHRcdFx0Ly8gYnV0IGl0IG5lZWRzIHRvIGJlIGJvdW5kIG1hbnVhbGx5IG9uIHRoZSBvdGhlci5cclxuXHRcdFx0XHRpZiAoIGJlaGF2aW91ci5maXhlZCApIHtcclxuXHRcdFx0XHRcdGV2ZW50SG9sZGVycy5wdXNoKGhhbmRsZUJlZm9yZS5jaGlsZHJlblswXSk7XHJcblx0XHRcdFx0XHRldmVudEhvbGRlcnMucHVzaChoYW5kbGVBZnRlci5jaGlsZHJlblswXSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRldmVudEhvbGRlcnMuZm9yRWFjaChmdW5jdGlvbiggZXZlbnRIb2xkZXIgKSB7XHJcblx0XHRcdFx0XHRhdHRhY2hFdmVudCAoIGFjdGlvbnMuc3RhcnQsIGV2ZW50SG9sZGVyLCBldmVudFN0YXJ0LCB7XHJcblx0XHRcdFx0XHRcdGhhbmRsZXM6IFtoYW5kbGVCZWZvcmUsIGhhbmRsZUFmdGVyXSxcclxuXHRcdFx0XHRcdFx0aGFuZGxlTnVtYmVyczogW2luZGV4IC0gMSwgaW5kZXhdXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuLyohIEluIHRoaXMgZmlsZTogU2xpZGVyIGV2ZW50cyAobm90IGJyb3dzZXIgZXZlbnRzKTsgKi9cclxuXHJcblx0Ly8gQXR0YWNoIGFuIGV2ZW50IHRvIHRoaXMgc2xpZGVyLCBwb3NzaWJseSBpbmNsdWRpbmcgYSBuYW1lc3BhY2VcclxuXHRmdW5jdGlvbiBiaW5kRXZlbnQgKCBuYW1lc3BhY2VkRXZlbnQsIGNhbGxiYWNrICkge1xyXG5cdFx0c2NvcGVfRXZlbnRzW25hbWVzcGFjZWRFdmVudF0gPSBzY29wZV9FdmVudHNbbmFtZXNwYWNlZEV2ZW50XSB8fCBbXTtcclxuXHRcdHNjb3BlX0V2ZW50c1tuYW1lc3BhY2VkRXZlbnRdLnB1c2goY2FsbGJhY2spO1xyXG5cclxuXHRcdC8vIElmIHRoZSBldmVudCBib3VuZCBpcyAndXBkYXRlLCcgZmlyZSBpdCBpbW1lZGlhdGVseSBmb3IgYWxsIGhhbmRsZXMuXHJcblx0XHRpZiAoIG5hbWVzcGFjZWRFdmVudC5zcGxpdCgnLicpWzBdID09PSAndXBkYXRlJyApIHtcclxuXHRcdFx0c2NvcGVfSGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uKGEsIGluZGV4KXtcclxuXHRcdFx0XHRmaXJlRXZlbnQoJ3VwZGF0ZScsIGluZGV4KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBVbmRvIGF0dGFjaG1lbnQgb2YgZXZlbnRcclxuXHRmdW5jdGlvbiByZW1vdmVFdmVudCAoIG5hbWVzcGFjZWRFdmVudCApIHtcclxuXHJcblx0XHR2YXIgZXZlbnQgPSBuYW1lc3BhY2VkRXZlbnQgJiYgbmFtZXNwYWNlZEV2ZW50LnNwbGl0KCcuJylbMF07XHJcblx0XHR2YXIgbmFtZXNwYWNlID0gZXZlbnQgJiYgbmFtZXNwYWNlZEV2ZW50LnN1YnN0cmluZyhldmVudC5sZW5ndGgpO1xyXG5cclxuXHRcdE9iamVjdC5rZXlzKHNjb3BlX0V2ZW50cykuZm9yRWFjaChmdW5jdGlvbiggYmluZCApe1xyXG5cclxuXHRcdFx0dmFyIHRFdmVudCA9IGJpbmQuc3BsaXQoJy4nKVswXTtcclxuXHRcdFx0dmFyIHROYW1lc3BhY2UgPSBiaW5kLnN1YnN0cmluZyh0RXZlbnQubGVuZ3RoKTtcclxuXHJcblx0XHRcdGlmICggKCFldmVudCB8fCBldmVudCA9PT0gdEV2ZW50KSAmJiAoIW5hbWVzcGFjZSB8fCBuYW1lc3BhY2UgPT09IHROYW1lc3BhY2UpICkge1xyXG5cdFx0XHRcdGRlbGV0ZSBzY29wZV9FdmVudHNbYmluZF07XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gRXh0ZXJuYWwgZXZlbnQgaGFuZGxpbmdcclxuXHRmdW5jdGlvbiBmaXJlRXZlbnQgKCBldmVudE5hbWUsIGhhbmRsZU51bWJlciwgdGFwICkge1xyXG5cclxuXHRcdE9iamVjdC5rZXlzKHNjb3BlX0V2ZW50cykuZm9yRWFjaChmdW5jdGlvbiggdGFyZ2V0RXZlbnQgKSB7XHJcblxyXG5cdFx0XHR2YXIgZXZlbnRUeXBlID0gdGFyZ2V0RXZlbnQuc3BsaXQoJy4nKVswXTtcclxuXHJcblx0XHRcdGlmICggZXZlbnROYW1lID09PSBldmVudFR5cGUgKSB7XHJcblx0XHRcdFx0c2NvcGVfRXZlbnRzW3RhcmdldEV2ZW50XS5mb3JFYWNoKGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcclxuXHJcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKFxyXG5cdFx0XHRcdFx0XHQvLyBVc2UgdGhlIHNsaWRlciBwdWJsaWMgQVBJIGFzIHRoZSBzY29wZSAoJ3RoaXMnKVxyXG5cdFx0XHRcdFx0XHRzY29wZV9TZWxmLFxyXG5cdFx0XHRcdFx0XHQvLyBSZXR1cm4gdmFsdWVzIGFzIGFycmF5LCBzbyBhcmdfMVthcmdfMl0gaXMgYWx3YXlzIHZhbGlkLlxyXG5cdFx0XHRcdFx0XHRzY29wZV9WYWx1ZXMubWFwKG9wdGlvbnMuZm9ybWF0LnRvKSxcclxuXHRcdFx0XHRcdFx0Ly8gSGFuZGxlIGluZGV4LCAwIG9yIDFcclxuXHRcdFx0XHRcdFx0aGFuZGxlTnVtYmVyLFxyXG5cdFx0XHRcdFx0XHQvLyBVbmZvcm1hdHRlZCBzbGlkZXIgdmFsdWVzXHJcblx0XHRcdFx0XHRcdHNjb3BlX1ZhbHVlcy5zbGljZSgpLFxyXG5cdFx0XHRcdFx0XHQvLyBFdmVudCBpcyBmaXJlZCBieSB0YXAsIHRydWUgb3IgZmFsc2VcclxuXHRcdFx0XHRcdFx0dGFwIHx8IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHQvLyBMZWZ0IG9mZnNldCBvZiB0aGUgaGFuZGxlLCBpbiByZWxhdGlvbiB0byB0aGUgc2xpZGVyXHJcblx0XHRcdFx0XHRcdHNjb3BlX0xvY2F0aW9ucy5zbGljZSgpXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG4vKiEgSW4gdGhpcyBmaWxlOiBNZWNoYW5pY3MgZm9yIHNsaWRlciBvcGVyYXRpb24gKi9cclxuXHJcblx0ZnVuY3Rpb24gdG9QY3QgKCBwY3QgKSB7XHJcblx0XHRyZXR1cm4gcGN0ICsgJyUnO1xyXG5cdH1cclxuXHJcblx0Ly8gU3BsaXQgb3V0IHRoZSBoYW5kbGUgcG9zaXRpb25pbmcgbG9naWMgc28gdGhlIE1vdmUgZXZlbnQgY2FuIHVzZSBpdCwgdG9vXHJcblx0ZnVuY3Rpb24gY2hlY2tIYW5kbGVQb3NpdGlvbiAoIHJlZmVyZW5jZSwgaGFuZGxlTnVtYmVyLCB0bywgbG9va0JhY2t3YXJkLCBsb29rRm9yd2FyZCwgZ2V0VmFsdWUgKSB7XHJcblxyXG5cdFx0Ly8gRm9yIHNsaWRlcnMgd2l0aCBtdWx0aXBsZSBoYW5kbGVzLCBsaW1pdCBtb3ZlbWVudCB0byB0aGUgb3RoZXIgaGFuZGxlLlxyXG5cdFx0Ly8gQXBwbHkgdGhlIG1hcmdpbiBvcHRpb24gYnkgYWRkaW5nIGl0IHRvIHRoZSBoYW5kbGUgcG9zaXRpb25zLlxyXG5cdFx0aWYgKCBzY29wZV9IYW5kbGVzLmxlbmd0aCA+IDEgKSB7XHJcblxyXG5cdFx0XHRpZiAoIGxvb2tCYWNrd2FyZCAmJiBoYW5kbGVOdW1iZXIgPiAwICkge1xyXG5cdFx0XHRcdHRvID0gTWF0aC5tYXgodG8sIHJlZmVyZW5jZVtoYW5kbGVOdW1iZXIgLSAxXSArIG9wdGlvbnMubWFyZ2luKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBsb29rRm9yd2FyZCAmJiBoYW5kbGVOdW1iZXIgPCBzY29wZV9IYW5kbGVzLmxlbmd0aCAtIDEgKSB7XHJcblx0XHRcdFx0dG8gPSBNYXRoLm1pbih0bywgcmVmZXJlbmNlW2hhbmRsZU51bWJlciArIDFdIC0gb3B0aW9ucy5tYXJnaW4pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVGhlIGxpbWl0IG9wdGlvbiBoYXMgdGhlIG9wcG9zaXRlIGVmZmVjdCwgbGltaXRpbmcgaGFuZGxlcyB0byBhXHJcblx0XHQvLyBtYXhpbXVtIGRpc3RhbmNlIGZyb20gYW5vdGhlci4gTGltaXQgbXVzdCBiZSA+IDAsIGFzIG90aGVyd2lzZVxyXG5cdFx0Ly8gaGFuZGxlcyB3b3VsZCBiZSB1bm1vdmVhYmxlLlxyXG5cdFx0aWYgKCBzY29wZV9IYW5kbGVzLmxlbmd0aCA+IDEgJiYgb3B0aW9ucy5saW1pdCApIHtcclxuXHJcblx0XHRcdGlmICggbG9va0JhY2t3YXJkICYmIGhhbmRsZU51bWJlciA+IDAgKSB7XHJcblx0XHRcdFx0dG8gPSBNYXRoLm1pbih0bywgcmVmZXJlbmNlW2hhbmRsZU51bWJlciAtIDFdICsgb3B0aW9ucy5saW1pdCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggbG9va0ZvcndhcmQgJiYgaGFuZGxlTnVtYmVyIDwgc2NvcGVfSGFuZGxlcy5sZW5ndGggLSAxICkge1xyXG5cdFx0XHRcdHRvID0gTWF0aC5tYXgodG8sIHJlZmVyZW5jZVtoYW5kbGVOdW1iZXIgKyAxXSAtIG9wdGlvbnMubGltaXQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVGhlIHBhZGRpbmcgb3B0aW9uIGtlZXBzIHRoZSBoYW5kbGVzIGEgY2VydGFpbiBkaXN0YW5jZSBmcm9tIHRoZVxyXG5cdFx0Ly8gZWRnZXMgb2YgdGhlIHNsaWRlci4gUGFkZGluZyBtdXN0IGJlID4gMC5cclxuXHRcdGlmICggb3B0aW9ucy5wYWRkaW5nICkge1xyXG5cclxuXHRcdFx0aWYgKCBoYW5kbGVOdW1iZXIgPT09IDAgKSB7XHJcblx0XHRcdFx0dG8gPSBNYXRoLm1heCh0bywgb3B0aW9ucy5wYWRkaW5nWzBdKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBoYW5kbGVOdW1iZXIgPT09IHNjb3BlX0hhbmRsZXMubGVuZ3RoIC0gMSApIHtcclxuXHRcdFx0XHR0byA9IE1hdGgubWluKHRvLCAxMDAgLSBvcHRpb25zLnBhZGRpbmdbMV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dG8gPSBzY29wZV9TcGVjdHJ1bS5nZXRTdGVwKHRvKTtcclxuXHJcblx0XHQvLyBMaW1pdCBwZXJjZW50YWdlIHRvIHRoZSAwIC0gMTAwIHJhbmdlXHJcblx0XHR0byA9IGxpbWl0KHRvKTtcclxuXHJcblx0XHQvLyBSZXR1cm4gZmFsc2UgaWYgaGFuZGxlIGNhbid0IG1vdmVcclxuXHRcdGlmICggdG8gPT09IHJlZmVyZW5jZVtoYW5kbGVOdW1iZXJdICYmICFnZXRWYWx1ZSApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0bztcclxuXHR9XHJcblxyXG5cdC8vIFVzZXMgc2xpZGVyIG9yaWVudGF0aW9uIHRvIGNyZWF0ZSBDU1MgcnVsZXMuIGEgPSBiYXNlIHZhbHVlO1xyXG5cdGZ1bmN0aW9uIGluUnVsZU9yZGVyICggdiwgYSApIHtcclxuXHRcdHZhciBvID0gb3B0aW9ucy5vcnQ7XHJcblx0XHRyZXR1cm4gKG8/YTp2KSArICcsICcgKyAobz92OmEpO1xyXG5cdH1cclxuXHJcblx0Ly8gTW92ZXMgaGFuZGxlKHMpIGJ5IGEgcGVyY2VudGFnZVxyXG5cdC8vIChib29sLCAlIHRvIG1vdmUsIFslIHdoZXJlIGhhbmRsZSBzdGFydGVkLCAuLi5dLCBbaW5kZXggaW4gc2NvcGVfSGFuZGxlcywgLi4uXSlcclxuXHRmdW5jdGlvbiBtb3ZlSGFuZGxlcyAoIHVwd2FyZCwgcHJvcG9zYWwsIGxvY2F0aW9ucywgaGFuZGxlTnVtYmVycyApIHtcclxuXHJcblx0XHR2YXIgcHJvcG9zYWxzID0gbG9jYXRpb25zLnNsaWNlKCk7XHJcblxyXG5cdFx0dmFyIGIgPSBbIXVwd2FyZCwgdXB3YXJkXTtcclxuXHRcdHZhciBmID0gW3Vwd2FyZCwgIXVwd2FyZF07XHJcblxyXG5cdFx0Ly8gQ29weSBoYW5kbGVOdW1iZXJzIHNvIHdlIGRvbid0IGNoYW5nZSB0aGUgZGF0YXNldFxyXG5cdFx0aGFuZGxlTnVtYmVycyA9IGhhbmRsZU51bWJlcnMuc2xpY2UoKTtcclxuXHJcblx0XHQvLyBDaGVjayB0byBzZWUgd2hpY2ggaGFuZGxlIGlzICdsZWFkaW5nJy5cclxuXHRcdC8vIElmIHRoYXQgb25lIGNhbid0IG1vdmUgdGhlIHNlY29uZCBjYW4ndCBlaXRoZXIuXHJcblx0XHRpZiAoIHVwd2FyZCApIHtcclxuXHRcdFx0aGFuZGxlTnVtYmVycy5yZXZlcnNlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU3RlcCAxOiBnZXQgdGhlIG1heGltdW0gcGVyY2VudGFnZSB0aGF0IGFueSBvZiB0aGUgaGFuZGxlcyBjYW4gbW92ZVxyXG5cdFx0aWYgKCBoYW5kbGVOdW1iZXJzLmxlbmd0aCA+IDEgKSB7XHJcblxyXG5cdFx0XHRoYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlTnVtYmVyLCBvKSB7XHJcblxyXG5cdFx0XHRcdHZhciB0byA9IGNoZWNrSGFuZGxlUG9zaXRpb24ocHJvcG9zYWxzLCBoYW5kbGVOdW1iZXIsIHByb3Bvc2Fsc1toYW5kbGVOdW1iZXJdICsgcHJvcG9zYWwsIGJbb10sIGZbb10sIGZhbHNlKTtcclxuXHJcblx0XHRcdFx0Ly8gU3RvcCBpZiBvbmUgb2YgdGhlIGhhbmRsZXMgY2FuJ3QgbW92ZS5cclxuXHRcdFx0XHRpZiAoIHRvID09PSBmYWxzZSApIHtcclxuXHRcdFx0XHRcdHByb3Bvc2FsID0gMDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cHJvcG9zYWwgPSB0byAtIHByb3Bvc2Fsc1toYW5kbGVOdW1iZXJdO1xyXG5cdFx0XHRcdFx0cHJvcG9zYWxzW2hhbmRsZU51bWJlcl0gPSB0bztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElmIHVzaW5nIG9uZSBoYW5kbGUsIGNoZWNrIGJhY2t3YXJkIEFORCBmb3J3YXJkXHJcblx0XHRlbHNlIHtcclxuXHRcdFx0YiA9IGYgPSBbdHJ1ZV07XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHN0YXRlID0gZmFsc2U7XHJcblxyXG5cdFx0Ly8gU3RlcCAyOiBUcnkgdG8gc2V0IHRoZSBoYW5kbGVzIHdpdGggdGhlIGZvdW5kIHBlcmNlbnRhZ2VcclxuXHRcdGhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVOdW1iZXIsIG8pIHtcclxuXHRcdFx0c3RhdGUgPSBzZXRIYW5kbGUoaGFuZGxlTnVtYmVyLCBsb2NhdGlvbnNbaGFuZGxlTnVtYmVyXSArIHByb3Bvc2FsLCBiW29dLCBmW29dKSB8fCBzdGF0ZTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFN0ZXAgMzogSWYgYSBoYW5kbGUgbW92ZWQsIGZpcmUgZXZlbnRzXHJcblx0XHRpZiAoIHN0YXRlICkge1xyXG5cdFx0XHRoYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlTnVtYmVyKXtcclxuXHRcdFx0XHRmaXJlRXZlbnQoJ3VwZGF0ZScsIGhhbmRsZU51bWJlcik7XHJcblx0XHRcdFx0ZmlyZUV2ZW50KCdzbGlkZScsIGhhbmRsZU51bWJlcik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gVGFrZXMgYSBiYXNlIHZhbHVlIGFuZCBhbiBvZmZzZXQuIFRoaXMgb2Zmc2V0IGlzIHVzZWQgZm9yIHRoZSBjb25uZWN0IGJhciBzaXplLlxyXG5cdC8vIEluIHRoZSBpbml0aWFsIGRlc2lnbiBmb3IgdGhpcyBmZWF0dXJlLCB0aGUgb3JpZ2luIGVsZW1lbnQgd2FzIDElIHdpZGUuXHJcblx0Ly8gVW5mb3J0dW5hdGVseSwgYSByb3VuZGluZyBidWcgaW4gQ2hyb21lIG1ha2VzIGl0IGltcG9zc2libGUgdG8gaW1wbGVtZW50IHRoaXMgZmVhdHVyZVxyXG5cdC8vIGluIHRoaXMgbWFubmVyOiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD03OTgyMjNcclxuXHRmdW5jdGlvbiB0cmFuc2Zvcm1EaXJlY3Rpb24gKCBhLCBiICkge1xyXG5cdFx0cmV0dXJuIG9wdGlvbnMuZGlyID8gMTAwIC0gYSAtIGIgOiBhO1xyXG5cdH1cclxuXHJcblx0Ly8gVXBkYXRlcyBzY29wZV9Mb2NhdGlvbnMgYW5kIHNjb3BlX1ZhbHVlcywgdXBkYXRlcyB2aXN1YWwgc3RhdGVcclxuXHRmdW5jdGlvbiB1cGRhdGVIYW5kbGVQb3NpdGlvbiAoIGhhbmRsZU51bWJlciwgdG8gKSB7XHJcblxyXG5cdFx0Ly8gVXBkYXRlIGxvY2F0aW9ucy5cclxuXHRcdHNjb3BlX0xvY2F0aW9uc1toYW5kbGVOdW1iZXJdID0gdG87XHJcblxyXG5cdFx0Ly8gQ29udmVydCB0aGUgdmFsdWUgdG8gdGhlIHNsaWRlciBzdGVwcGluZy9yYW5nZS5cclxuXHRcdHNjb3BlX1ZhbHVlc1toYW5kbGVOdW1iZXJdID0gc2NvcGVfU3BlY3RydW0uZnJvbVN0ZXBwaW5nKHRvKTtcclxuXHJcblx0XHR2YXIgcnVsZSA9ICd0cmFuc2xhdGUoJyArIGluUnVsZU9yZGVyKHRvUGN0KHRyYW5zZm9ybURpcmVjdGlvbih0bywgMCkgLSBzY29wZV9EaXJPZmZzZXQpLCAnMCcpICsgJyknO1xyXG5cdFx0c2NvcGVfSGFuZGxlc1toYW5kbGVOdW1iZXJdLnN0eWxlW29wdGlvbnMudHJhbnNmb3JtUnVsZV0gPSBydWxlO1xyXG5cclxuXHRcdHVwZGF0ZUNvbm5lY3QoaGFuZGxlTnVtYmVyKTtcclxuXHRcdHVwZGF0ZUNvbm5lY3QoaGFuZGxlTnVtYmVyICsgMSk7XHJcblx0fVxyXG5cclxuXHQvLyBIYW5kbGVzIGJlZm9yZSB0aGUgc2xpZGVyIG1pZGRsZSBhcmUgc3RhY2tlZCBsYXRlciA9IGhpZ2hlcixcclxuXHQvLyBIYW5kbGVzIGFmdGVyIHRoZSBtaWRkbGUgbGF0ZXIgaXMgbG93ZXJcclxuXHQvLyBbWzddIFs4XSAuLi4uLi4uLi4uIHwgLi4uLi4uLi4uLiBbNV0gWzRdXHJcblx0ZnVuY3Rpb24gc2V0WmluZGV4ICggKSB7XHJcblxyXG5cdFx0c2NvcGVfSGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZU51bWJlcil7XHJcblx0XHRcdHZhciBkaXIgPSAoc2NvcGVfTG9jYXRpb25zW2hhbmRsZU51bWJlcl0gPiA1MCA/IC0xIDogMSk7XHJcblx0XHRcdHZhciB6SW5kZXggPSAzICsgKHNjb3BlX0hhbmRsZXMubGVuZ3RoICsgKGRpciAqIGhhbmRsZU51bWJlcikpO1xyXG5cdFx0XHRzY29wZV9IYW5kbGVzW2hhbmRsZU51bWJlcl0uc3R5bGUuekluZGV4ID0gekluZGV4O1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyBUZXN0IHN1Z2dlc3RlZCB2YWx1ZXMgYW5kIGFwcGx5IG1hcmdpbiwgc3RlcC5cclxuXHRmdW5jdGlvbiBzZXRIYW5kbGUgKCBoYW5kbGVOdW1iZXIsIHRvLCBsb29rQmFja3dhcmQsIGxvb2tGb3J3YXJkICkge1xyXG5cclxuXHRcdHRvID0gY2hlY2tIYW5kbGVQb3NpdGlvbihzY29wZV9Mb2NhdGlvbnMsIGhhbmRsZU51bWJlciwgdG8sIGxvb2tCYWNrd2FyZCwgbG9va0ZvcndhcmQsIGZhbHNlKTtcclxuXHJcblx0XHRpZiAoIHRvID09PSBmYWxzZSApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHVwZGF0ZUhhbmRsZVBvc2l0aW9uKGhhbmRsZU51bWJlciwgdG8pO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0Ly8gVXBkYXRlcyBzdHlsZSBhdHRyaWJ1dGUgZm9yIGNvbm5lY3Qgbm9kZXNcclxuXHRmdW5jdGlvbiB1cGRhdGVDb25uZWN0ICggaW5kZXggKSB7XHJcblxyXG5cdFx0Ly8gU2tpcCBjb25uZWN0cyBzZXQgdG8gZmFsc2VcclxuXHRcdGlmICggIXNjb3BlX0Nvbm5lY3RzW2luZGV4XSApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBsID0gMDtcclxuXHRcdHZhciBoID0gMTAwO1xyXG5cclxuXHRcdGlmICggaW5kZXggIT09IDAgKSB7XHJcblx0XHRcdGwgPSBzY29wZV9Mb2NhdGlvbnNbaW5kZXggLSAxXTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIGluZGV4ICE9PSBzY29wZV9Db25uZWN0cy5sZW5ndGggLSAxICkge1xyXG5cdFx0XHRoID0gc2NvcGVfTG9jYXRpb25zW2luZGV4XTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBXZSB1c2UgdHdvIHJ1bGVzOlxyXG5cdFx0Ly8gJ3RyYW5zbGF0ZScgdG8gY2hhbmdlIHRoZSBsZWZ0L3RvcCBvZmZzZXQ7XHJcblx0XHQvLyAnc2NhbGUnIHRvIGNoYW5nZSB0aGUgd2lkdGggb2YgdGhlIGVsZW1lbnQ7XHJcblx0XHQvLyBBcyB0aGUgZWxlbWVudCBoYXMgYSB3aWR0aCBvZiAxMDAlLCBhIHRyYW5zbGF0aW9uIG9mIDEwMCUgaXMgZXF1YWwgdG8gMTAwJSBvZiB0aGUgcGFyZW50ICgubm9VaS1iYXNlKVxyXG5cdFx0dmFyIGNvbm5lY3RXaWR0aCA9IGggLSBsO1xyXG5cdFx0dmFyIHRyYW5zbGF0ZVJ1bGUgPSAndHJhbnNsYXRlKCcgKyBpblJ1bGVPcmRlcih0b1BjdCh0cmFuc2Zvcm1EaXJlY3Rpb24obCwgY29ubmVjdFdpZHRoKSksICcwJykgKyAnKSc7XHJcblx0XHR2YXIgc2NhbGVSdWxlID0gJ3NjYWxlKCcgKyBpblJ1bGVPcmRlcihjb25uZWN0V2lkdGggLyAxMDAsICcxJykgKyAnKSc7XHJcblxyXG5cdFx0c2NvcGVfQ29ubmVjdHNbaW5kZXhdLnN0eWxlW29wdGlvbnMudHJhbnNmb3JtUnVsZV0gPSB0cmFuc2xhdGVSdWxlICsgJyAnICsgc2NhbGVSdWxlO1xyXG5cdH1cclxuXHJcbi8qISBJbiB0aGlzIGZpbGU6IEFsbCBtZXRob2RzIGV2ZW50dWFsbHkgZXhwb3NlZCBpbiBzbGlkZXIubm9VaVNsaWRlci4uLiAqL1xyXG5cclxuXHQvLyBQYXJzZXMgdmFsdWUgcGFzc2VkIHRvIC5zZXQgbWV0aG9kLiBSZXR1cm5zIGN1cnJlbnQgdmFsdWUgaWYgbm90IHBhcnNlLWFibGUuXHJcblx0ZnVuY3Rpb24gcmVzb2x2ZVRvVmFsdWUgKCB0bywgaGFuZGxlTnVtYmVyICkge1xyXG5cclxuXHRcdC8vIFNldHRpbmcgd2l0aCBudWxsIGluZGljYXRlcyBhbiAnaWdub3JlJy5cclxuXHRcdC8vIElucHV0dGluZyAnZmFsc2UnIGlzIGludmFsaWQuXHJcblx0XHRpZiAoIHRvID09PSBudWxsIHx8IHRvID09PSBmYWxzZSB8fCB0byA9PT0gdW5kZWZpbmVkICkge1xyXG5cdFx0XHRyZXR1cm4gc2NvcGVfTG9jYXRpb25zW2hhbmRsZU51bWJlcl07XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWYgYSBmb3JtYXR0ZWQgbnVtYmVyIHdhcyBwYXNzZWQsIGF0dGVtcHQgdG8gZGVjb2RlIGl0LlxyXG5cdFx0aWYgKCB0eXBlb2YgdG8gPT09ICdudW1iZXInICkge1xyXG5cdFx0XHR0byA9IFN0cmluZyh0byk7XHJcblx0XHR9XHJcblxyXG5cdFx0dG8gPSBvcHRpb25zLmZvcm1hdC5mcm9tKHRvKTtcclxuXHRcdHRvID0gc2NvcGVfU3BlY3RydW0udG9TdGVwcGluZyh0byk7XHJcblxyXG5cdFx0Ly8gSWYgcGFyc2luZyB0aGUgbnVtYmVyIGZhaWxlZCwgdXNlIHRoZSBjdXJyZW50IHZhbHVlLlxyXG5cdFx0aWYgKCB0byA9PT0gZmFsc2UgfHwgaXNOYU4odG8pICkge1xyXG5cdFx0XHRyZXR1cm4gc2NvcGVfTG9jYXRpb25zW2hhbmRsZU51bWJlcl07XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRvO1xyXG5cdH1cclxuXHJcblx0Ly8gU2V0IHRoZSBzbGlkZXIgdmFsdWUuXHJcblx0ZnVuY3Rpb24gdmFsdWVTZXQgKCBpbnB1dCwgZmlyZVNldEV2ZW50ICkge1xyXG5cclxuXHRcdHZhciB2YWx1ZXMgPSBhc0FycmF5KGlucHV0KTtcclxuXHRcdHZhciBpc0luaXQgPSBzY29wZV9Mb2NhdGlvbnNbMF0gPT09IHVuZGVmaW5lZDtcclxuXHJcblx0XHQvLyBFdmVudCBmaXJlcyBieSBkZWZhdWx0XHJcblx0XHRmaXJlU2V0RXZlbnQgPSAoZmlyZVNldEV2ZW50ID09PSB1bmRlZmluZWQgPyB0cnVlIDogISFmaXJlU2V0RXZlbnQpO1xyXG5cclxuXHRcdC8vIEFuaW1hdGlvbiBpcyBvcHRpb25hbC5cclxuXHRcdC8vIE1ha2Ugc3VyZSB0aGUgaW5pdGlhbCB2YWx1ZXMgd2VyZSBzZXQgYmVmb3JlIHVzaW5nIGFuaW1hdGVkIHBsYWNlbWVudC5cclxuXHRcdGlmICggb3B0aW9ucy5hbmltYXRlICYmICFpc0luaXQgKSB7XHJcblx0XHRcdGFkZENsYXNzRm9yKHNjb3BlX1RhcmdldCwgb3B0aW9ucy5jc3NDbGFzc2VzLnRhcCwgb3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRmlyc3QgcGFzcywgd2l0aG91dCBsb29rQWhlYWQgYnV0IHdpdGggbG9va0JhY2t3YXJkLiBWYWx1ZXMgYXJlIHNldCBmcm9tIGxlZnQgdG8gcmlnaHQuXHJcblx0XHRzY29wZV9IYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlTnVtYmVyKXtcclxuXHRcdFx0c2V0SGFuZGxlKGhhbmRsZU51bWJlciwgcmVzb2x2ZVRvVmFsdWUodmFsdWVzW2hhbmRsZU51bWJlcl0sIGhhbmRsZU51bWJlciksIHRydWUsIGZhbHNlKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFNlY29uZCBwYXNzLiBOb3cgdGhhdCBhbGwgYmFzZSB2YWx1ZXMgYXJlIHNldCwgYXBwbHkgY29uc3RyYWludHNcclxuXHRcdHNjb3BlX0hhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVOdW1iZXIpe1xyXG5cdFx0XHRzZXRIYW5kbGUoaGFuZGxlTnVtYmVyLCBzY29wZV9Mb2NhdGlvbnNbaGFuZGxlTnVtYmVyXSwgdHJ1ZSwgdHJ1ZSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZXRaaW5kZXgoKTtcclxuXHJcblx0XHRzY29wZV9IYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlTnVtYmVyKXtcclxuXHJcblx0XHRcdGZpcmVFdmVudCgndXBkYXRlJywgaGFuZGxlTnVtYmVyKTtcclxuXHJcblx0XHRcdC8vIEZpcmUgdGhlIGV2ZW50IG9ubHkgZm9yIGhhbmRsZXMgdGhhdCByZWNlaXZlZCBhIG5ldyB2YWx1ZSwgYXMgcGVyICM1NzlcclxuXHRcdFx0aWYgKCB2YWx1ZXNbaGFuZGxlTnVtYmVyXSAhPT0gbnVsbCAmJiBmaXJlU2V0RXZlbnQgKSB7XHJcblx0XHRcdFx0ZmlyZUV2ZW50KCdzZXQnLCBoYW5kbGVOdW1iZXIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vIFJlc2V0IHNsaWRlciB0byBpbml0aWFsIHZhbHVlc1xyXG5cdGZ1bmN0aW9uIHZhbHVlUmVzZXQgKCBmaXJlU2V0RXZlbnQgKSB7XHJcblx0XHR2YWx1ZVNldChvcHRpb25zLnN0YXJ0LCBmaXJlU2V0RXZlbnQpO1xyXG5cdH1cclxuXHJcblx0Ly8gR2V0IHRoZSBzbGlkZXIgdmFsdWUuXHJcblx0ZnVuY3Rpb24gdmFsdWVHZXQgKCApIHtcclxuXHJcblx0XHR2YXIgdmFsdWVzID0gc2NvcGVfVmFsdWVzLm1hcChvcHRpb25zLmZvcm1hdC50byk7XHJcblxyXG5cdFx0Ly8gSWYgb25seSBvbmUgaGFuZGxlIGlzIHVzZWQsIHJldHVybiBhIHNpbmdsZSB2YWx1ZS5cclxuXHRcdGlmICggdmFsdWVzLmxlbmd0aCA9PT0gMSApe1xyXG5cdFx0XHRyZXR1cm4gdmFsdWVzWzBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB2YWx1ZXM7XHJcblx0fVxyXG5cclxuXHQvLyBSZW1vdmVzIGNsYXNzZXMgZnJvbSB0aGUgcm9vdCBhbmQgZW1wdGllcyBpdC5cclxuXHRmdW5jdGlvbiBkZXN0cm95ICggKSB7XHJcblxyXG5cdFx0Zm9yICggdmFyIGtleSBpbiBvcHRpb25zLmNzc0NsYXNzZXMgKSB7XHJcblx0XHRcdGlmICggIW9wdGlvbnMuY3NzQ2xhc3Nlcy5oYXNPd25Qcm9wZXJ0eShrZXkpICkgeyBjb250aW51ZTsgfVxyXG5cdFx0XHRyZW1vdmVDbGFzcyhzY29wZV9UYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlc1trZXldKTtcclxuXHRcdH1cclxuXHJcblx0XHR3aGlsZSAoc2NvcGVfVGFyZ2V0LmZpcnN0Q2hpbGQpIHtcclxuXHRcdFx0c2NvcGVfVGFyZ2V0LnJlbW92ZUNoaWxkKHNjb3BlX1RhcmdldC5maXJzdENoaWxkKTtcclxuXHRcdH1cclxuXHJcblx0XHRkZWxldGUgc2NvcGVfVGFyZ2V0Lm5vVWlTbGlkZXI7XHJcblx0fVxyXG5cclxuXHQvLyBHZXQgdGhlIGN1cnJlbnQgc3RlcCBzaXplIGZvciB0aGUgc2xpZGVyLlxyXG5cdGZ1bmN0aW9uIGdldEN1cnJlbnRTdGVwICggKSB7XHJcblxyXG5cdFx0Ly8gQ2hlY2sgYWxsIGxvY2F0aW9ucywgbWFwIHRoZW0gdG8gdGhlaXIgc3RlcHBpbmcgcG9pbnQuXHJcblx0XHQvLyBHZXQgdGhlIHN0ZXAgcG9pbnQsIHRoZW4gZmluZCBpdCBpbiB0aGUgaW5wdXQgbGlzdC5cclxuXHRcdHJldHVybiBzY29wZV9Mb2NhdGlvbnMubWFwKGZ1bmN0aW9uKCBsb2NhdGlvbiwgaW5kZXggKXtcclxuXHJcblx0XHRcdHZhciBuZWFyYnlTdGVwcyA9IHNjb3BlX1NwZWN0cnVtLmdldE5lYXJieVN0ZXBzKCBsb2NhdGlvbiApO1xyXG5cdFx0XHR2YXIgdmFsdWUgPSBzY29wZV9WYWx1ZXNbaW5kZXhdO1xyXG5cdFx0XHR2YXIgaW5jcmVtZW50ID0gbmVhcmJ5U3RlcHMudGhpc1N0ZXAuc3RlcDtcclxuXHRcdFx0dmFyIGRlY3JlbWVudCA9IG51bGw7XHJcblxyXG5cdFx0XHQvLyBJZiB0aGUgbmV4dCB2YWx1ZSBpbiB0aGlzIHN0ZXAgbW92ZXMgaW50byB0aGUgbmV4dCBzdGVwLFxyXG5cdFx0XHQvLyB0aGUgaW5jcmVtZW50IGlzIHRoZSBzdGFydCBvZiB0aGUgbmV4dCBzdGVwIC0gdGhlIGN1cnJlbnQgdmFsdWVcclxuXHRcdFx0aWYgKCBpbmNyZW1lbnQgIT09IGZhbHNlICkge1xyXG5cdFx0XHRcdGlmICggdmFsdWUgKyBpbmNyZW1lbnQgPiBuZWFyYnlTdGVwcy5zdGVwQWZ0ZXIuc3RhcnRWYWx1ZSApIHtcclxuXHRcdFx0XHRcdGluY3JlbWVudCA9IG5lYXJieVN0ZXBzLnN0ZXBBZnRlci5zdGFydFZhbHVlIC0gdmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0Ly8gSWYgdGhlIHZhbHVlIGlzIGJleW9uZCB0aGUgc3RhcnRpbmcgcG9pbnRcclxuXHRcdFx0aWYgKCB2YWx1ZSA+IG5lYXJieVN0ZXBzLnRoaXNTdGVwLnN0YXJ0VmFsdWUgKSB7XHJcblx0XHRcdFx0ZGVjcmVtZW50ID0gbmVhcmJ5U3RlcHMudGhpc1N0ZXAuc3RlcDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZWxzZSBpZiAoIG5lYXJieVN0ZXBzLnN0ZXBCZWZvcmUuc3RlcCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0ZGVjcmVtZW50ID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIElmIGEgaGFuZGxlIGlzIGF0IHRoZSBzdGFydCBvZiBhIHN0ZXAsIGl0IGFsd2F5cyBzdGVwcyBiYWNrIGludG8gdGhlIHByZXZpb3VzIHN0ZXAgZmlyc3RcclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0ZGVjcmVtZW50ID0gdmFsdWUgLSBuZWFyYnlTdGVwcy5zdGVwQmVmb3JlLmhpZ2hlc3RTdGVwO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0Ly8gTm93LCBpZiBhdCB0aGUgc2xpZGVyIGVkZ2VzLCB0aGVyZSBpcyBub3QgaW4vZGVjcmVtZW50XHJcblx0XHRcdGlmICggbG9jYXRpb24gPT09IDEwMCApIHtcclxuXHRcdFx0XHRpbmNyZW1lbnQgPSBudWxsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRlbHNlIGlmICggbG9jYXRpb24gPT09IDAgKSB7XHJcblx0XHRcdFx0ZGVjcmVtZW50ID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQXMgcGVyICMzOTEsIHRoZSBjb21wYXJpc29uIGZvciB0aGUgZGVjcmVtZW50IHN0ZXAgY2FuIGhhdmUgc29tZSByb3VuZGluZyBpc3N1ZXMuXHJcblx0XHRcdHZhciBzdGVwRGVjaW1hbHMgPSBzY29wZV9TcGVjdHJ1bS5jb3VudFN0ZXBEZWNpbWFscygpO1xyXG5cclxuXHRcdFx0Ly8gUm91bmQgcGVyICMzOTFcclxuXHRcdFx0aWYgKCBpbmNyZW1lbnQgIT09IG51bGwgJiYgaW5jcmVtZW50ICE9PSBmYWxzZSApIHtcclxuXHRcdFx0XHRpbmNyZW1lbnQgPSBOdW1iZXIoaW5jcmVtZW50LnRvRml4ZWQoc3RlcERlY2ltYWxzKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggZGVjcmVtZW50ICE9PSBudWxsICYmIGRlY3JlbWVudCAhPT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0ZGVjcmVtZW50ID0gTnVtYmVyKGRlY3JlbWVudC50b0ZpeGVkKHN0ZXBEZWNpbWFscykpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gW2RlY3JlbWVudCwgaW5jcmVtZW50XTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gVXBkYXRlYWJsZTogbWFyZ2luLCBsaW1pdCwgcGFkZGluZywgc3RlcCwgcmFuZ2UsIGFuaW1hdGUsIHNuYXBcclxuXHRmdW5jdGlvbiB1cGRhdGVPcHRpb25zICggb3B0aW9uc1RvVXBkYXRlLCBmaXJlU2V0RXZlbnQgKSB7XHJcblxyXG5cdFx0Ly8gU3BlY3RydW0gaXMgY3JlYXRlZCB1c2luZyB0aGUgcmFuZ2UsIHNuYXAsIGRpcmVjdGlvbiBhbmQgc3RlcCBvcHRpb25zLlxyXG5cdFx0Ly8gJ3NuYXAnIGFuZCAnc3RlcCcgY2FuIGJlIHVwZGF0ZWQuXHJcblx0XHQvLyBJZiAnc25hcCcgYW5kICdzdGVwJyBhcmUgbm90IHBhc3NlZCwgdGhleSBzaG91bGQgcmVtYWluIHVuY2hhbmdlZC5cclxuXHRcdHZhciB2ID0gdmFsdWVHZXQoKTtcclxuXHJcblx0XHR2YXIgdXBkYXRlQWJsZSA9IFsnbWFyZ2luJywgJ2xpbWl0JywgJ3BhZGRpbmcnLCAncmFuZ2UnLCAnYW5pbWF0ZScsICdzbmFwJywgJ3N0ZXAnLCAnZm9ybWF0J107XHJcblxyXG5cdFx0Ly8gT25seSBjaGFuZ2Ugb3B0aW9ucyB0aGF0IHdlJ3JlIGFjdHVhbGx5IHBhc3NlZCB0byB1cGRhdGUuXHJcblx0XHR1cGRhdGVBYmxlLmZvckVhY2goZnVuY3Rpb24obmFtZSl7XHJcblx0XHRcdGlmICggb3B0aW9uc1RvVXBkYXRlW25hbWVdICE9PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0b3JpZ2luYWxPcHRpb25zW25hbWVdID0gb3B0aW9uc1RvVXBkYXRlW25hbWVdO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgbmV3T3B0aW9ucyA9IHRlc3RPcHRpb25zKG9yaWdpbmFsT3B0aW9ucyk7XHJcblxyXG5cdFx0Ly8gTG9hZCBuZXcgb3B0aW9ucyBpbnRvIHRoZSBzbGlkZXIgc3RhdGVcclxuXHRcdHVwZGF0ZUFibGUuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcclxuXHRcdFx0aWYgKCBvcHRpb25zVG9VcGRhdGVbbmFtZV0gIT09IHVuZGVmaW5lZCApIHtcclxuXHRcdFx0XHRvcHRpb25zW25hbWVdID0gbmV3T3B0aW9uc1tuYW1lXTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2NvcGVfU3BlY3RydW0gPSBuZXdPcHRpb25zLnNwZWN0cnVtO1xyXG5cclxuXHRcdC8vIExpbWl0LCBtYXJnaW4gYW5kIHBhZGRpbmcgZGVwZW5kIG9uIHRoZSBzcGVjdHJ1bSBidXQgYXJlIHN0b3JlZCBvdXRzaWRlIG9mIGl0LiAoIzY3NylcclxuXHRcdG9wdGlvbnMubWFyZ2luID0gbmV3T3B0aW9ucy5tYXJnaW47XHJcblx0XHRvcHRpb25zLmxpbWl0ID0gbmV3T3B0aW9ucy5saW1pdDtcclxuXHRcdG9wdGlvbnMucGFkZGluZyA9IG5ld09wdGlvbnMucGFkZGluZztcclxuXHJcblx0XHQvLyBVcGRhdGUgcGlwcywgcmVtb3ZlcyBleGlzdGluZy5cclxuXHRcdGlmICggb3B0aW9ucy5waXBzICkge1xyXG5cdFx0XHRwaXBzKG9wdGlvbnMucGlwcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSW52YWxpZGF0ZSB0aGUgY3VycmVudCBwb3NpdGlvbmluZyBzbyB2YWx1ZVNldCBmb3JjZXMgYW4gdXBkYXRlLlxyXG5cdFx0c2NvcGVfTG9jYXRpb25zID0gW107XHJcblx0XHR2YWx1ZVNldChvcHRpb25zVG9VcGRhdGUuc3RhcnQgfHwgdiwgZmlyZVNldEV2ZW50KTtcclxuXHR9XHJcblxyXG4vKiEgSW4gdGhpcyBmaWxlOiBDYWxscyB0byBmdW5jdGlvbnMuIEFsbCBvdGhlciBzY29wZV8gZmlsZXMgZGVmaW5lIGZ1bmN0aW9ucyBvbmx5OyAqL1xyXG5cclxuXHQvLyBDcmVhdGUgdGhlIGJhc2UgZWxlbWVudCwgaW5pdGlhbGl6ZSBIVE1MIGFuZCBzZXQgY2xhc3Nlcy5cclxuXHQvLyBBZGQgaGFuZGxlcyBhbmQgY29ubmVjdCBlbGVtZW50cy5cclxuXHRhZGRTbGlkZXIoc2NvcGVfVGFyZ2V0KTtcclxuXHRhZGRFbGVtZW50cyhvcHRpb25zLmNvbm5lY3QsIHNjb3BlX0Jhc2UpO1xyXG5cclxuXHQvLyBBdHRhY2ggdXNlciBldmVudHMuXHJcblx0YmluZFNsaWRlckV2ZW50cyhvcHRpb25zLmV2ZW50cyk7XHJcblxyXG5cdC8vIFVzZSB0aGUgcHVibGljIHZhbHVlIG1ldGhvZCB0byBzZXQgdGhlIHN0YXJ0IHZhbHVlcy5cclxuXHR2YWx1ZVNldChvcHRpb25zLnN0YXJ0KTtcclxuXHJcblx0c2NvcGVfU2VsZiA9IHtcclxuXHRcdGRlc3Ryb3k6IGRlc3Ryb3ksXHJcblx0XHRzdGVwczogZ2V0Q3VycmVudFN0ZXAsXHJcblx0XHRvbjogYmluZEV2ZW50LFxyXG5cdFx0b2ZmOiByZW1vdmVFdmVudCxcclxuXHRcdGdldDogdmFsdWVHZXQsXHJcblx0XHRzZXQ6IHZhbHVlU2V0LFxyXG5cdFx0cmVzZXQ6IHZhbHVlUmVzZXQsXHJcblx0XHQvLyBFeHBvc2VkIGZvciB1bml0IHRlc3RpbmcsIGRvbid0IHVzZSB0aGlzIGluIHlvdXIgYXBwbGljYXRpb24uXHJcblx0XHRfX21vdmVIYW5kbGVzOiBmdW5jdGlvbihhLCBiLCBjKSB7IG1vdmVIYW5kbGVzKGEsIGIsIHNjb3BlX0xvY2F0aW9ucywgYyk7IH0sXHJcblx0XHRvcHRpb25zOiBvcmlnaW5hbE9wdGlvbnMsIC8vIElzc3VlICM2MDAsICM2NzhcclxuXHRcdHVwZGF0ZU9wdGlvbnM6IHVwZGF0ZU9wdGlvbnMsXHJcblx0XHR0YXJnZXQ6IHNjb3BlX1RhcmdldCwgLy8gSXNzdWUgIzU5N1xyXG5cdFx0cmVtb3ZlUGlwczogcmVtb3ZlUGlwcyxcclxuXHRcdHBpcHM6IHBpcHMgLy8gSXNzdWUgIzU5NFxyXG5cdH07XHJcblxyXG5cdGlmICggb3B0aW9ucy5waXBzICkge1xyXG5cdFx0cGlwcyhvcHRpb25zLnBpcHMpO1xyXG5cdH1cclxuXHJcblx0aWYgKCBvcHRpb25zLnRvb2x0aXBzICkge1xyXG5cdFx0dG9vbHRpcHMoKTtcclxuXHR9XHJcblxyXG5cdGFyaWEoKTtcclxuXHJcblx0cmV0dXJuIHNjb3BlX1NlbGY7XHJcblxyXG59XHJcblxyXG5cclxuXHQvLyBSdW4gdGhlIHN0YW5kYXJkIGluaXRpYWxpemVyXHJcblx0ZnVuY3Rpb24gaW5pdGlhbGl6ZSAoIHRhcmdldCwgb3JpZ2luYWxPcHRpb25zICkge1xyXG5cclxuXHRcdGlmICggIXRhcmdldCB8fCAhdGFyZ2V0Lm5vZGVOYW1lICkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6IGNyZWF0ZSByZXF1aXJlcyBhIHNpbmdsZSBlbGVtZW50LCBnb3Q6IFwiICsgdGFyZ2V0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUaHJvdyBhbiBlcnJvciBpZiB0aGUgc2xpZGVyIHdhcyBhbHJlYWR5IGluaXRpYWxpemVkLlxyXG5cdFx0aWYgKCB0YXJnZXQubm9VaVNsaWRlciApIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiBTbGlkZXIgd2FzIGFscmVhZHkgaW5pdGlhbGl6ZWQuXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRlc3QgdGhlIG9wdGlvbnMgYW5kIGNyZWF0ZSB0aGUgc2xpZGVyIGVudmlyb25tZW50O1xyXG5cdFx0dmFyIG9wdGlvbnMgPSB0ZXN0T3B0aW9ucyggb3JpZ2luYWxPcHRpb25zLCB0YXJnZXQgKTtcclxuXHRcdHZhciBhcGkgPSBzY29wZSggdGFyZ2V0LCBvcHRpb25zLCBvcmlnaW5hbE9wdGlvbnMgKTtcclxuXHJcblx0XHR0YXJnZXQubm9VaVNsaWRlciA9IGFwaTtcclxuXHJcblx0XHRyZXR1cm4gYXBpO1xyXG5cdH1cclxuXHJcblx0Ly8gVXNlIGFuIG9iamVjdCBpbnN0ZWFkIG9mIGEgZnVuY3Rpb24gZm9yIGZ1dHVyZSBleHBhbmRhYmlsaXR5O1xyXG5cdHJldHVybiB7XHJcblx0XHR2ZXJzaW9uOiBWRVJTSU9OLFxyXG5cdFx0Y3JlYXRlOiBpbml0aWFsaXplXHJcblx0fTtcclxuXHJcbn0pKTsiLCIvKiEgbm91aXNsaWRlciAtIDExLjEuMCAtIDIwMTgtMDQtMDIgMTE6MTg6MTMgKi9cclxuXHJcbiFmdW5jdGlvbihhKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLGEpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWEoKTp3aW5kb3cubm9VaVNsaWRlcj1hKCl9KGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYShhKXtyZXR1cm5cIm9iamVjdFwiPT10eXBlb2YgYSYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS50byYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS5mcm9tfWZ1bmN0aW9uIGIoYSl7YS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGEpfWZ1bmN0aW9uIGMoYSl7cmV0dXJuIG51bGwhPT1hJiZ2b2lkIDAhPT1hfWZ1bmN0aW9uIGQoYSl7YS5wcmV2ZW50RGVmYXVsdCgpfWZ1bmN0aW9uIGUoYSl7cmV0dXJuIGEuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiF0aGlzW2FdJiYodGhpc1thXT0hMCl9LHt9KX1mdW5jdGlvbiBmKGEsYil7cmV0dXJuIE1hdGgucm91bmQoYS9iKSpifWZ1bmN0aW9uIGcoYSxiKXt2YXIgYz1hLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLGQ9YS5vd25lckRvY3VtZW50LGU9ZC5kb2N1bWVudEVsZW1lbnQsZj1wKGQpO3JldHVybi93ZWJraXQuKkNocm9tZS4qTW9iaWxlL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSYmKGYueD0wKSxiP2MudG9wK2YueS1lLmNsaWVudFRvcDpjLmxlZnQrZi54LWUuY2xpZW50TGVmdH1mdW5jdGlvbiBoKGEpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiBhJiYhaXNOYU4oYSkmJmlzRmluaXRlKGEpfWZ1bmN0aW9uIGkoYSxiLGMpe2M+MCYmKG0oYSxiKSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bihhLGIpfSxjKSl9ZnVuY3Rpb24gaihhKXtyZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4oYSwxMDApLDApfWZ1bmN0aW9uIGsoYSl7cmV0dXJuIEFycmF5LmlzQXJyYXkoYSk/YTpbYV19ZnVuY3Rpb24gbChhKXthPVN0cmluZyhhKTt2YXIgYj1hLnNwbGl0KFwiLlwiKTtyZXR1cm4gYi5sZW5ndGg+MT9iWzFdLmxlbmd0aDowfWZ1bmN0aW9uIG0oYSxiKXthLmNsYXNzTGlzdD9hLmNsYXNzTGlzdC5hZGQoYik6YS5jbGFzc05hbWUrPVwiIFwiK2J9ZnVuY3Rpb24gbihhLGIpe2EuY2xhc3NMaXN0P2EuY2xhc3NMaXN0LnJlbW92ZShiKTphLmNsYXNzTmFtZT1hLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxcXFxcYilcIitiLnNwbGl0KFwiIFwiKS5qb2luKFwifFwiKStcIihcXFxcYnwkKVwiLFwiZ2lcIiksXCIgXCIpfWZ1bmN0aW9uIG8oYSxiKXtyZXR1cm4gYS5jbGFzc0xpc3Q/YS5jbGFzc0xpc3QuY29udGFpbnMoYik6bmV3IFJlZ0V4cChcIlxcXFxiXCIrYitcIlxcXFxiXCIpLnRlc3QoYS5jbGFzc05hbWUpfWZ1bmN0aW9uIHAoYSl7dmFyIGI9dm9pZCAwIT09d2luZG93LnBhZ2VYT2Zmc2V0LGM9XCJDU1MxQ29tcGF0XCI9PT0oYS5jb21wYXRNb2RlfHxcIlwiKTtyZXR1cm57eDpiP3dpbmRvdy5wYWdlWE9mZnNldDpjP2EuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ6YS5ib2R5LnNjcm9sbExlZnQseTpiP3dpbmRvdy5wYWdlWU9mZnNldDpjP2EuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDphLmJvZHkuc2Nyb2xsVG9wfX1mdW5jdGlvbiBxKCl7cmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQ/e3N0YXJ0OlwicG9pbnRlcmRvd25cIixtb3ZlOlwicG9pbnRlcm1vdmVcIixlbmQ6XCJwb2ludGVydXBcIn06d2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkP3tzdGFydDpcIk1TUG9pbnRlckRvd25cIixtb3ZlOlwiTVNQb2ludGVyTW92ZVwiLGVuZDpcIk1TUG9pbnRlclVwXCJ9OntzdGFydDpcIm1vdXNlZG93biB0b3VjaHN0YXJ0XCIsbW92ZTpcIm1vdXNlbW92ZSB0b3VjaG1vdmVcIixlbmQ6XCJtb3VzZXVwIHRvdWNoZW5kXCJ9fWZ1bmN0aW9uIHIoKXt2YXIgYT0hMTt0cnl7dmFyIGI9T2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LFwicGFzc2l2ZVwiLHtnZXQ6ZnVuY3Rpb24oKXthPSEwfX0pO3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidGVzdFwiLG51bGwsYil9Y2F0Y2goYSl7fXJldHVybiBhfWZ1bmN0aW9uIHMoKXtyZXR1cm4gd2luZG93LkNTUyYmQ1NTLnN1cHBvcnRzJiZDU1Muc3VwcG9ydHMoXCJ0b3VjaC1hY3Rpb25cIixcIm5vbmVcIil9ZnVuY3Rpb24gdChhLGIpe3JldHVybiAxMDAvKGItYSl9ZnVuY3Rpb24gdShhLGIpe3JldHVybiAxMDAqYi8oYVsxXS1hWzBdKX1mdW5jdGlvbiB2KGEsYil7cmV0dXJuIHUoYSxhWzBdPDA/YitNYXRoLmFicyhhWzBdKTpiLWFbMF0pfWZ1bmN0aW9uIHcoYSxiKXtyZXR1cm4gYiooYVsxXS1hWzBdKS8xMDArYVswXX1mdW5jdGlvbiB4KGEsYil7Zm9yKHZhciBjPTE7YT49YltjXTspYys9MTtyZXR1cm4gY31mdW5jdGlvbiB5KGEsYixjKXtpZihjPj1hLnNsaWNlKC0xKVswXSlyZXR1cm4gMTAwO3ZhciBkPXgoYyxhKSxlPWFbZC0xXSxmPWFbZF0sZz1iW2QtMV0saD1iW2RdO3JldHVybiBnK3YoW2UsZl0sYykvdChnLGgpfWZ1bmN0aW9uIHooYSxiLGMpe2lmKGM+PTEwMClyZXR1cm4gYS5zbGljZSgtMSlbMF07dmFyIGQ9eChjLGIpLGU9YVtkLTFdLGY9YVtkXSxnPWJbZC0xXTtyZXR1cm4gdyhbZSxmXSwoYy1nKSp0KGcsYltkXSkpfWZ1bmN0aW9uIEEoYSxiLGMsZCl7aWYoMTAwPT09ZClyZXR1cm4gZDt2YXIgZT14KGQsYSksZz1hW2UtMV0saD1hW2VdO3JldHVybiBjP2QtZz4oaC1nKS8yP2g6ZzpiW2UtMV0/YVtlLTFdK2YoZC1hW2UtMV0sYltlLTFdKTpkfWZ1bmN0aW9uIEIoYSxiLGMpe3ZhciBkO2lmKFwibnVtYmVyXCI9PXR5cGVvZiBiJiYoYj1bYl0pLCFBcnJheS5pc0FycmF5KGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncmFuZ2UnIGNvbnRhaW5zIGludmFsaWQgdmFsdWUuXCIpO2lmKGQ9XCJtaW5cIj09PWE/MDpcIm1heFwiPT09YT8xMDA6cGFyc2VGbG9hdChhKSwhaChkKXx8IWgoYlswXSkpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdyYW5nZScgdmFsdWUgaXNuJ3QgbnVtZXJpYy5cIik7Yy54UGN0LnB1c2goZCksYy54VmFsLnB1c2goYlswXSksZD9jLnhTdGVwcy5wdXNoKCFpc05hTihiWzFdKSYmYlsxXSk6aXNOYU4oYlsxXSl8fChjLnhTdGVwc1swXT1iWzFdKSxjLnhIaWdoZXN0Q29tcGxldGVTdGVwLnB1c2goMCl9ZnVuY3Rpb24gQyhhLGIsYyl7aWYoIWIpcmV0dXJuITA7Yy54U3RlcHNbYV09dShbYy54VmFsW2FdLGMueFZhbFthKzFdXSxiKS90KGMueFBjdFthXSxjLnhQY3RbYSsxXSk7dmFyIGQ9KGMueFZhbFthKzFdLWMueFZhbFthXSkvYy54TnVtU3RlcHNbYV0sZT1NYXRoLmNlaWwoTnVtYmVyKGQudG9GaXhlZCgzKSktMSksZj1jLnhWYWxbYV0rYy54TnVtU3RlcHNbYV0qZTtjLnhIaWdoZXN0Q29tcGxldGVTdGVwW2FdPWZ9ZnVuY3Rpb24gRChhLGIsYyl7dGhpcy54UGN0PVtdLHRoaXMueFZhbD1bXSx0aGlzLnhTdGVwcz1bY3x8ITFdLHRoaXMueE51bVN0ZXBzPVshMV0sdGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcD1bXSx0aGlzLnNuYXA9Yjt2YXIgZCxlPVtdO2ZvcihkIGluIGEpYS5oYXNPd25Qcm9wZXJ0eShkKSYmZS5wdXNoKFthW2RdLGRdKTtmb3IoZS5sZW5ndGgmJlwib2JqZWN0XCI9PXR5cGVvZiBlWzBdWzBdP2Uuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBhWzBdWzBdLWJbMF1bMF19KTplLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYVswXS1iWzBdfSksZD0wO2Q8ZS5sZW5ndGg7ZCsrKUIoZVtkXVsxXSxlW2RdWzBdLHRoaXMpO2Zvcih0aGlzLnhOdW1TdGVwcz10aGlzLnhTdGVwcy5zbGljZSgwKSxkPTA7ZDx0aGlzLnhOdW1TdGVwcy5sZW5ndGg7ZCsrKUMoZCx0aGlzLnhOdW1TdGVwc1tkXSx0aGlzKX1mdW5jdGlvbiBFKGIpe2lmKGEoYikpcmV0dXJuITA7dGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdmb3JtYXQnIHJlcXVpcmVzICd0bycgYW5kICdmcm9tJyBtZXRob2RzLlwiKX1mdW5jdGlvbiBGKGEsYil7aWYoIWgoYikpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdzdGVwJyBpcyBub3QgbnVtZXJpYy5cIik7YS5zaW5nbGVTdGVwPWJ9ZnVuY3Rpb24gRyhhLGIpe2lmKFwib2JqZWN0XCIhPXR5cGVvZiBifHxBcnJheS5pc0FycmF5KGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncmFuZ2UnIGlzIG5vdCBhbiBvYmplY3QuXCIpO2lmKHZvaWQgMD09PWIubWlufHx2b2lkIDA9PT1iLm1heCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogTWlzc2luZyAnbWluJyBvciAnbWF4JyBpbiAncmFuZ2UnLlwiKTtpZihiLm1pbj09PWIubWF4KXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncmFuZ2UnICdtaW4nIGFuZCAnbWF4JyBjYW5ub3QgYmUgZXF1YWwuXCIpO2Euc3BlY3RydW09bmV3IEQoYixhLnNuYXAsYS5zaW5nbGVTdGVwKX1mdW5jdGlvbiBIKGEsYil7aWYoYj1rKGIpLCFBcnJheS5pc0FycmF5KGIpfHwhYi5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdzdGFydCcgb3B0aW9uIGlzIGluY29ycmVjdC5cIik7YS5oYW5kbGVzPWIubGVuZ3RoLGEuc3RhcnQ9Yn1mdW5jdGlvbiBJKGEsYil7aWYoYS5zbmFwPWIsXCJib29sZWFuXCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnc25hcCcgb3B0aW9uIG11c3QgYmUgYSBib29sZWFuLlwiKX1mdW5jdGlvbiBKKGEsYil7aWYoYS5hbmltYXRlPWIsXCJib29sZWFuXCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnYW5pbWF0ZScgb3B0aW9uIG11c3QgYmUgYSBib29sZWFuLlwiKX1mdW5jdGlvbiBLKGEsYil7aWYoYS5hbmltYXRpb25EdXJhdGlvbj1iLFwibnVtYmVyXCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnYW5pbWF0aW9uRHVyYXRpb24nIG9wdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiKX1mdW5jdGlvbiBMKGEsYil7dmFyIGMsZD1bITFdO2lmKFwibG93ZXJcIj09PWI/Yj1bITAsITFdOlwidXBwZXJcIj09PWImJihiPVshMSwhMF0pLCEwPT09Ynx8ITE9PT1iKXtmb3IoYz0xO2M8YS5oYW5kbGVzO2MrKylkLnB1c2goYik7ZC5wdXNoKCExKX1lbHNle2lmKCFBcnJheS5pc0FycmF5KGIpfHwhYi5sZW5ndGh8fGIubGVuZ3RoIT09YS5oYW5kbGVzKzEpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdjb25uZWN0JyBvcHRpb24gZG9lc24ndCBtYXRjaCBoYW5kbGUgY291bnQuXCIpO2Q9Yn1hLmNvbm5lY3Q9ZH1mdW5jdGlvbiBNKGEsYil7c3dpdGNoKGIpe2Nhc2VcImhvcml6b250YWxcIjphLm9ydD0wO2JyZWFrO2Nhc2VcInZlcnRpY2FsXCI6YS5vcnQ9MTticmVhaztkZWZhdWx0OnRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnb3JpZW50YXRpb24nIG9wdGlvbiBpcyBpbnZhbGlkLlwiKX19ZnVuY3Rpb24gTihhLGIpe2lmKCFoKGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbWFyZ2luJyBvcHRpb24gbXVzdCBiZSBudW1lcmljLlwiKTtpZigwIT09YiYmKGEubWFyZ2luPWEuc3BlY3RydW0uZ2V0TWFyZ2luKGIpLCFhLm1hcmdpbikpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdtYXJnaW4nIG9wdGlvbiBpcyBvbmx5IHN1cHBvcnRlZCBvbiBsaW5lYXIgc2xpZGVycy5cIil9ZnVuY3Rpb24gTyhhLGIpe2lmKCFoKGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbGltaXQnIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMuXCIpO2lmKGEubGltaXQ9YS5zcGVjdHJ1bS5nZXRNYXJnaW4oYiksIWEubGltaXR8fGEuaGFuZGxlczwyKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbGltaXQnIG9wdGlvbiBpcyBvbmx5IHN1cHBvcnRlZCBvbiBsaW5lYXIgc2xpZGVycyB3aXRoIDIgb3IgbW9yZSBoYW5kbGVzLlwiKX1mdW5jdGlvbiBQKGEsYil7aWYoIWgoYikmJiFBcnJheS5pc0FycmF5KGIpKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncGFkZGluZycgb3B0aW9uIG11c3QgYmUgbnVtZXJpYyBvciBhcnJheSBvZiBleGFjdGx5IDIgbnVtYmVycy5cIik7aWYoQXJyYXkuaXNBcnJheShiKSYmMiE9PWIubGVuZ3RoJiYhaChiWzBdKSYmIWgoYlsxXSkpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdwYWRkaW5nJyBvcHRpb24gbXVzdCBiZSBudW1lcmljIG9yIGFycmF5IG9mIGV4YWN0bHkgMiBudW1iZXJzLlwiKTtpZigwIT09Yil7aWYoQXJyYXkuaXNBcnJheShiKXx8KGI9W2IsYl0pLGEucGFkZGluZz1bYS5zcGVjdHJ1bS5nZXRNYXJnaW4oYlswXSksYS5zcGVjdHJ1bS5nZXRNYXJnaW4oYlsxXSldLCExPT09YS5wYWRkaW5nWzBdfHwhMT09PWEucGFkZGluZ1sxXSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3BhZGRpbmcnIG9wdGlvbiBpcyBvbmx5IHN1cHBvcnRlZCBvbiBsaW5lYXIgc2xpZGVycy5cIik7aWYoYS5wYWRkaW5nWzBdPDB8fGEucGFkZGluZ1sxXTwwKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAncGFkZGluZycgb3B0aW9uIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXIocykuXCIpO2lmKGEucGFkZGluZ1swXSthLnBhZGRpbmdbMV0+PTEwMCl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IG5vdCBleGNlZWQgMTAwJSBvZiB0aGUgcmFuZ2UuXCIpfX1mdW5jdGlvbiBRKGEsYil7c3dpdGNoKGIpe2Nhc2VcImx0clwiOmEuZGlyPTA7YnJlYWs7Y2FzZVwicnRsXCI6YS5kaXI9MTticmVhaztkZWZhdWx0OnRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnZGlyZWN0aW9uJyBvcHRpb24gd2FzIG5vdCByZWNvZ25pemVkLlwiKX19ZnVuY3Rpb24gUihhLGIpe2lmKFwic3RyaW5nXCIhPXR5cGVvZiBiKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnYmVoYXZpb3VyJyBtdXN0IGJlIGEgc3RyaW5nIGNvbnRhaW5pbmcgb3B0aW9ucy5cIik7dmFyIGM9Yi5pbmRleE9mKFwidGFwXCIpPj0wLGQ9Yi5pbmRleE9mKFwiZHJhZ1wiKT49MCxlPWIuaW5kZXhPZihcImZpeGVkXCIpPj0wLGY9Yi5pbmRleE9mKFwic25hcFwiKT49MCxnPWIuaW5kZXhPZihcImhvdmVyXCIpPj0wO2lmKGUpe2lmKDIhPT1hLmhhbmRsZXMpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdmaXhlZCcgYmVoYXZpb3VyIG11c3QgYmUgdXNlZCB3aXRoIDIgaGFuZGxlc1wiKTtOKGEsYS5zdGFydFsxXS1hLnN0YXJ0WzBdKX1hLmV2ZW50cz17dGFwOmN8fGYsZHJhZzpkLGZpeGVkOmUsc25hcDpmLGhvdmVyOmd9fWZ1bmN0aW9uIFMoYSxiKXtpZighMSE9PWIpaWYoITA9PT1iKXthLnRvb2x0aXBzPVtdO2Zvcih2YXIgYz0wO2M8YS5oYW5kbGVzO2MrKylhLnRvb2x0aXBzLnB1c2goITApfWVsc2V7aWYoYS50b29sdGlwcz1rKGIpLGEudG9vbHRpcHMubGVuZ3RoIT09YS5oYW5kbGVzKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiBtdXN0IHBhc3MgYSBmb3JtYXR0ZXIgZm9yIGFsbCBoYW5kbGVzLlwiKTthLnRvb2x0aXBzLmZvckVhY2goZnVuY3Rpb24oYSl7aWYoXCJib29sZWFuXCIhPXR5cGVvZiBhJiYoXCJvYmplY3RcIiE9dHlwZW9mIGF8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIGEudG8pKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAndG9vbHRpcHMnIG11c3QgYmUgcGFzc2VkIGEgZm9ybWF0dGVyIG9yICdmYWxzZScuXCIpfSl9fWZ1bmN0aW9uIFQoYSxiKXthLmFyaWFGb3JtYXQ9YixFKGIpfWZ1bmN0aW9uIFUoYSxiKXthLmZvcm1hdD1iLEUoYil9ZnVuY3Rpb24gVihhLGIpe2lmKFwic3RyaW5nXCIhPXR5cGVvZiBiJiYhMSE9PWIpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdjc3NQcmVmaXgnIG11c3QgYmUgYSBzdHJpbmcgb3IgYGZhbHNlYC5cIik7YS5jc3NQcmVmaXg9Yn1mdW5jdGlvbiBXKGEsYil7aWYoXCJvYmplY3RcIiE9dHlwZW9mIGIpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdjc3NDbGFzc2VzJyBtdXN0IGJlIGFuIG9iamVjdC5cIik7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGEuY3NzUHJlZml4KXthLmNzc0NsYXNzZXM9e307Zm9yKHZhciBjIGluIGIpYi5oYXNPd25Qcm9wZXJ0eShjKSYmKGEuY3NzQ2xhc3Nlc1tjXT1hLmNzc1ByZWZpeCtiW2NdKX1lbHNlIGEuY3NzQ2xhc3Nlcz1ifWZ1bmN0aW9uIFgoYSl7dmFyIGI9e21hcmdpbjowLGxpbWl0OjAscGFkZGluZzowLGFuaW1hdGU6ITAsYW5pbWF0aW9uRHVyYXRpb246MzAwLGFyaWFGb3JtYXQ6Xyxmb3JtYXQ6X30sZD17c3RlcDp7cjohMSx0OkZ9LHN0YXJ0OntyOiEwLHQ6SH0sY29ubmVjdDp7cjohMCx0Okx9LGRpcmVjdGlvbjp7cjohMCx0OlF9LHNuYXA6e3I6ITEsdDpJfSxhbmltYXRlOntyOiExLHQ6Sn0sYW5pbWF0aW9uRHVyYXRpb246e3I6ITEsdDpLfSxyYW5nZTp7cjohMCx0Okd9LG9yaWVudGF0aW9uOntyOiExLHQ6TX0sbWFyZ2luOntyOiExLHQ6Tn0sbGltaXQ6e3I6ITEsdDpPfSxwYWRkaW5nOntyOiExLHQ6UH0sYmVoYXZpb3VyOntyOiEwLHQ6Un0sYXJpYUZvcm1hdDp7cjohMSx0OlR9LGZvcm1hdDp7cjohMSx0OlV9LHRvb2x0aXBzOntyOiExLHQ6U30sY3NzUHJlZml4OntyOiEwLHQ6Vn0sY3NzQ2xhc3Nlczp7cjohMCx0Old9fSxlPXtjb25uZWN0OiExLGRpcmVjdGlvbjpcImx0clwiLGJlaGF2aW91cjpcInRhcFwiLG9yaWVudGF0aW9uOlwiaG9yaXpvbnRhbFwiLGNzc1ByZWZpeDpcIm5vVWktXCIsY3NzQ2xhc3Nlczp7dGFyZ2V0OlwidGFyZ2V0XCIsYmFzZTpcImJhc2VcIixvcmlnaW46XCJvcmlnaW5cIixoYW5kbGU6XCJoYW5kbGVcIixoYW5kbGVMb3dlcjpcImhhbmRsZS1sb3dlclwiLGhhbmRsZVVwcGVyOlwiaGFuZGxlLXVwcGVyXCIsaG9yaXpvbnRhbDpcImhvcml6b250YWxcIix2ZXJ0aWNhbDpcInZlcnRpY2FsXCIsYmFja2dyb3VuZDpcImJhY2tncm91bmRcIixjb25uZWN0OlwiY29ubmVjdFwiLGNvbm5lY3RzOlwiY29ubmVjdHNcIixsdHI6XCJsdHJcIixydGw6XCJydGxcIixkcmFnZ2FibGU6XCJkcmFnZ2FibGVcIixkcmFnOlwic3RhdGUtZHJhZ1wiLHRhcDpcInN0YXRlLXRhcFwiLGFjdGl2ZTpcImFjdGl2ZVwiLHRvb2x0aXA6XCJ0b29sdGlwXCIscGlwczpcInBpcHNcIixwaXBzSG9yaXpvbnRhbDpcInBpcHMtaG9yaXpvbnRhbFwiLHBpcHNWZXJ0aWNhbDpcInBpcHMtdmVydGljYWxcIixtYXJrZXI6XCJtYXJrZXJcIixtYXJrZXJIb3Jpem9udGFsOlwibWFya2VyLWhvcml6b250YWxcIixtYXJrZXJWZXJ0aWNhbDpcIm1hcmtlci12ZXJ0aWNhbFwiLG1hcmtlck5vcm1hbDpcIm1hcmtlci1ub3JtYWxcIixtYXJrZXJMYXJnZTpcIm1hcmtlci1sYXJnZVwiLG1hcmtlclN1YjpcIm1hcmtlci1zdWJcIix2YWx1ZTpcInZhbHVlXCIsdmFsdWVIb3Jpem9udGFsOlwidmFsdWUtaG9yaXpvbnRhbFwiLHZhbHVlVmVydGljYWw6XCJ2YWx1ZS12ZXJ0aWNhbFwiLHZhbHVlTm9ybWFsOlwidmFsdWUtbm9ybWFsXCIsdmFsdWVMYXJnZTpcInZhbHVlLWxhcmdlXCIsdmFsdWVTdWI6XCJ2YWx1ZS1zdWJcIn19O2EuZm9ybWF0JiYhYS5hcmlhRm9ybWF0JiYoYS5hcmlhRm9ybWF0PWEuZm9ybWF0KSxPYmplY3Qua2V5cyhkKS5mb3JFYWNoKGZ1bmN0aW9uKGYpe2lmKCFjKGFbZl0pJiZ2b2lkIDA9PT1lW2ZdKXtpZihkW2ZdLnIpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICdcIitmK1wiJyBpcyByZXF1aXJlZC5cIik7cmV0dXJuITB9ZFtmXS50KGIsYyhhW2ZdKT9hW2ZdOmVbZl0pfSksYi5waXBzPWEucGlwczt2YXIgZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGc9dm9pZCAwIT09Zi5zdHlsZS5tc1RyYW5zZm9ybSxoPXZvaWQgMCE9PWYuc3R5bGUudHJhbnNmb3JtO2IudHJhbnNmb3JtUnVsZT1oP1widHJhbnNmb3JtXCI6Zz9cIm1zVHJhbnNmb3JtXCI6XCJ3ZWJraXRUcmFuc2Zvcm1cIjt2YXIgaT1bW1wibGVmdFwiLFwidG9wXCJdLFtcInJpZ2h0XCIsXCJib3R0b21cIl1dO3JldHVybiBiLnN0eWxlPWlbYi5kaXJdW2Iub3J0XSxifWZ1bmN0aW9uIFkoYSxjLGYpe2Z1bmN0aW9uIGgoYSxiKXt2YXIgYz15YS5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3JldHVybiBiJiZtKGMsYiksYS5hcHBlbmRDaGlsZChjKSxjfWZ1bmN0aW9uIGwoYSxiKXt2YXIgZD1oKGEsYy5jc3NDbGFzc2VzLm9yaWdpbiksZT1oKGQsYy5jc3NDbGFzc2VzLmhhbmRsZSk7cmV0dXJuIGUuc2V0QXR0cmlidXRlKFwiZGF0YS1oYW5kbGVcIixiKSxlLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsXCIwXCIpLGUuc2V0QXR0cmlidXRlKFwicm9sZVwiLFwic2xpZGVyXCIpLGUuc2V0QXR0cmlidXRlKFwiYXJpYS1vcmllbnRhdGlvblwiLGMub3J0P1widmVydGljYWxcIjpcImhvcml6b250YWxcIiksMD09PWI/bShlLGMuY3NzQ2xhc3Nlcy5oYW5kbGVMb3dlcik6Yj09PWMuaGFuZGxlcy0xJiZtKGUsYy5jc3NDbGFzc2VzLmhhbmRsZVVwcGVyKSxkfWZ1bmN0aW9uIHQoYSxiKXtyZXR1cm4hIWImJmgoYSxjLmNzc0NsYXNzZXMuY29ubmVjdCl9ZnVuY3Rpb24gdShhLGIpe3ZhciBkPWgoYixjLmNzc0NsYXNzZXMuY29ubmVjdHMpO2thPVtdLGxhPVtdLGxhLnB1c2godChkLGFbMF0pKTtmb3IodmFyIGU9MDtlPGMuaGFuZGxlcztlKyspa2EucHVzaChsKGIsZSkpLHRhW2VdPWUsbGEucHVzaCh0KGQsYVtlKzFdKSl9ZnVuY3Rpb24gdihhKXttKGEsYy5jc3NDbGFzc2VzLnRhcmdldCksMD09PWMuZGlyP20oYSxjLmNzc0NsYXNzZXMubHRyKTptKGEsYy5jc3NDbGFzc2VzLnJ0bCksMD09PWMub3J0P20oYSxjLmNzc0NsYXNzZXMuaG9yaXpvbnRhbCk6bShhLGMuY3NzQ2xhc3Nlcy52ZXJ0aWNhbCksamE9aChhLGMuY3NzQ2xhc3Nlcy5iYXNlKX1mdW5jdGlvbiB3KGEsYil7cmV0dXJuISFjLnRvb2x0aXBzW2JdJiZoKGEuZmlyc3RDaGlsZCxjLmNzc0NsYXNzZXMudG9vbHRpcCl9ZnVuY3Rpb24geCgpe3ZhciBhPWthLm1hcCh3KTtRKFwidXBkYXRlXCIsZnVuY3Rpb24oYixkLGUpe2lmKGFbZF0pe3ZhciBmPWJbZF07ITAhPT1jLnRvb2x0aXBzW2RdJiYoZj1jLnRvb2x0aXBzW2RdLnRvKGVbZF0pKSxhW2RdLmlubmVySFRNTD1mfX0pfWZ1bmN0aW9uIHkoKXtRKFwidXBkYXRlXCIsZnVuY3Rpb24oYSxiLGQsZSxmKXt0YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3ZhciBiPWthW2FdLGU9VShzYSxhLDAsITAsITAsITApLGc9VShzYSxhLDEwMCwhMCwhMCwhMCksaD1mW2FdLGk9Yy5hcmlhRm9ybWF0LnRvKGRbYV0pO2IuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW1pblwiLGUudG9GaXhlZCgxKSksYi5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbWF4XCIsZy50b0ZpeGVkKDEpKSxiLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWVub3dcIixoLnRvRml4ZWQoMSkpLGIuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZXRleHRcIixpKX0pfSl9ZnVuY3Rpb24geihhLGIsYyl7aWYoXCJyYW5nZVwiPT09YXx8XCJzdGVwc1wiPT09YSlyZXR1cm4gdmEueFZhbDtpZihcImNvdW50XCI9PT1hKXtpZihiPDIpdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIrJCtcIik6ICd2YWx1ZXMnICg+PSAyKSByZXF1aXJlZCBmb3IgbW9kZSAnY291bnQnLlwiKTt2YXIgZD1iLTEsZT0xMDAvZDtmb3IoYj1bXTtkLS07KWJbZF09ZCplO2IucHVzaCgxMDApLGE9XCJwb3NpdGlvbnNcIn1yZXR1cm5cInBvc2l0aW9uc1wiPT09YT9iLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gdmEuZnJvbVN0ZXBwaW5nKGM/dmEuZ2V0U3RlcChhKTphKX0pOlwidmFsdWVzXCI9PT1hP2M/Yi5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIHZhLmZyb21TdGVwcGluZyh2YS5nZXRTdGVwKHZhLnRvU3RlcHBpbmcoYSkpKX0pOmI6dm9pZCAwfWZ1bmN0aW9uIEEoYSxiLGMpe2Z1bmN0aW9uIGQoYSxiKXtyZXR1cm4oYStiKS50b0ZpeGVkKDcpLzF9dmFyIGY9e30sZz12YS54VmFsWzBdLGg9dmEueFZhbFt2YS54VmFsLmxlbmd0aC0xXSxpPSExLGo9ITEsaz0wO3JldHVybiBjPWUoYy5zbGljZSgpLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS1ifSkpLGNbMF0hPT1nJiYoYy51bnNoaWZ0KGcpLGk9ITApLGNbYy5sZW5ndGgtMV0hPT1oJiYoYy5wdXNoKGgpLGo9ITApLGMuZm9yRWFjaChmdW5jdGlvbihlLGcpe3ZhciBoLGwsbSxuLG8scCxxLHIscyx0LHU9ZSx2PWNbZysxXTtpZihcInN0ZXBzXCI9PT1iJiYoaD12YS54TnVtU3RlcHNbZ10pLGh8fChoPXYtdSksITEhPT11JiZ2b2lkIDAhPT12KWZvcihoPU1hdGgubWF4KGgsMWUtNyksbD11O2w8PXY7bD1kKGwsaCkpe2ZvcihuPXZhLnRvU3RlcHBpbmcobCksbz1uLWsscj1vL2Escz1NYXRoLnJvdW5kKHIpLHQ9by9zLG09MTttPD1zO20rPTEpcD1rK20qdCxmW3AudG9GaXhlZCg1KV09W1wieFwiLDBdO3E9Yy5pbmRleE9mKGwpPi0xPzE6XCJzdGVwc1wiPT09Yj8yOjAsIWcmJmkmJihxPTApLGw9PT12JiZqfHwoZltuLnRvRml4ZWQoNSldPVtsLHFdKSxrPW59fSksZn1mdW5jdGlvbiBCKGEsYixkKXtmdW5jdGlvbiBlKGEsYil7dmFyIGQ9Yj09PWMuY3NzQ2xhc3Nlcy52YWx1ZSxlPWQ/azpsLGY9ZD9pOmo7cmV0dXJuIGIrXCIgXCIrZVtjLm9ydF0rXCIgXCIrZlthXX1mdW5jdGlvbiBmKGEsZil7ZlsxXT1mWzFdJiZiP2IoZlswXSxmWzFdKTpmWzFdO3ZhciBpPWgoZywhMSk7aS5jbGFzc05hbWU9ZShmWzFdLGMuY3NzQ2xhc3Nlcy5tYXJrZXIpLGkuc3R5bGVbYy5zdHlsZV09YStcIiVcIixmWzFdJiYoaT1oKGcsITEpLGkuY2xhc3NOYW1lPWUoZlsxXSxjLmNzc0NsYXNzZXMudmFsdWUpLGkuc2V0QXR0cmlidXRlKFwiZGF0YS12YWx1ZVwiLGZbMF0pLGkuc3R5bGVbYy5zdHlsZV09YStcIiVcIixpLmlubmVyVGV4dD1kLnRvKGZbMF0pKX12YXIgZz15YS5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGk9W2MuY3NzQ2xhc3Nlcy52YWx1ZU5vcm1hbCxjLmNzc0NsYXNzZXMudmFsdWVMYXJnZSxjLmNzc0NsYXNzZXMudmFsdWVTdWJdLGo9W2MuY3NzQ2xhc3Nlcy5tYXJrZXJOb3JtYWwsYy5jc3NDbGFzc2VzLm1hcmtlckxhcmdlLGMuY3NzQ2xhc3Nlcy5tYXJrZXJTdWJdLGs9W2MuY3NzQ2xhc3Nlcy52YWx1ZUhvcml6b250YWwsYy5jc3NDbGFzc2VzLnZhbHVlVmVydGljYWxdLGw9W2MuY3NzQ2xhc3Nlcy5tYXJrZXJIb3Jpem9udGFsLGMuY3NzQ2xhc3Nlcy5tYXJrZXJWZXJ0aWNhbF07cmV0dXJuIG0oZyxjLmNzc0NsYXNzZXMucGlwcyksbShnLDA9PT1jLm9ydD9jLmNzc0NsYXNzZXMucGlwc0hvcml6b250YWw6Yy5jc3NDbGFzc2VzLnBpcHNWZXJ0aWNhbCksT2JqZWN0LmtleXMoYSkuZm9yRWFjaChmdW5jdGlvbihiKXtmKGIsYVtiXSl9KSxnfWZ1bmN0aW9uIEMoKXtuYSYmKGIobmEpLG5hPW51bGwpfWZ1bmN0aW9uIEQoYSl7QygpO3ZhciBiPWEubW9kZSxjPWEuZGVuc2l0eXx8MSxkPWEuZmlsdGVyfHwhMSxlPWEudmFsdWVzfHwhMSxmPWEuc3RlcHBlZHx8ITEsZz16KGIsZSxmKSxoPUEoYyxiLGcpLGk9YS5mb3JtYXR8fHt0bzpNYXRoLnJvdW5kfTtyZXR1cm4gbmE9cmEuYXBwZW5kQ2hpbGQoQihoLGQsaSkpfWZ1bmN0aW9uIEUoKXt2YXIgYT1qYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxiPVwib2Zmc2V0XCIrW1wiV2lkdGhcIixcIkhlaWdodFwiXVtjLm9ydF07cmV0dXJuIDA9PT1jLm9ydD9hLndpZHRofHxqYVtiXTphLmhlaWdodHx8amFbYl19ZnVuY3Rpb24gRihhLGIsZCxlKXt2YXIgZj1mdW5jdGlvbihmKXtyZXR1cm4hIShmPUcoZixlLnBhZ2VPZmZzZXQsZS50YXJnZXR8fGIpKSYmKCEocmEuaGFzQXR0cmlidXRlKFwiZGlzYWJsZWRcIikmJiFlLmRvTm90UmVqZWN0KSYmKCEobyhyYSxjLmNzc0NsYXNzZXMudGFwKSYmIWUuZG9Ob3RSZWplY3QpJiYoIShhPT09b2Euc3RhcnQmJnZvaWQgMCE9PWYuYnV0dG9ucyYmZi5idXR0b25zPjEpJiYoKCFlLmhvdmVyfHwhZi5idXR0b25zKSYmKHFhfHxmLnByZXZlbnREZWZhdWx0KCksZi5jYWxjUG9pbnQ9Zi5wb2ludHNbYy5vcnRdLHZvaWQgZChmLGUpKSkpKSl9LGc9W107cmV0dXJuIGEuc3BsaXQoXCIgXCIpLmZvckVhY2goZnVuY3Rpb24oYSl7Yi5hZGRFdmVudExpc3RlbmVyKGEsZiwhIXFhJiZ7cGFzc2l2ZTohMH0pLGcucHVzaChbYSxmXSl9KSxnfWZ1bmN0aW9uIEcoYSxiLGMpe3ZhciBkLGUsZj0wPT09YS50eXBlLmluZGV4T2YoXCJ0b3VjaFwiKSxnPTA9PT1hLnR5cGUuaW5kZXhPZihcIm1vdXNlXCIpLGg9MD09PWEudHlwZS5pbmRleE9mKFwicG9pbnRlclwiKTtpZigwPT09YS50eXBlLmluZGV4T2YoXCJNU1BvaW50ZXJcIikmJihoPSEwKSxmKXt2YXIgaT1mdW5jdGlvbihhKXtyZXR1cm4gYS50YXJnZXQ9PT1jfHxjLmNvbnRhaW5zKGEudGFyZ2V0KX07aWYoXCJ0b3VjaHN0YXJ0XCI9PT1hLnR5cGUpe3ZhciBqPUFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChhLnRvdWNoZXMsaSk7aWYoai5sZW5ndGg+MSlyZXR1cm4hMTtkPWpbMF0ucGFnZVgsZT1qWzBdLnBhZ2VZfWVsc2V7dmFyIGs9QXJyYXkucHJvdG90eXBlLmZpbmQuY2FsbChhLmNoYW5nZWRUb3VjaGVzLGkpO2lmKCFrKXJldHVybiExO2Q9ay5wYWdlWCxlPWsucGFnZVl9fXJldHVybiBiPWJ8fHAoeWEpLChnfHxoKSYmKGQ9YS5jbGllbnRYK2IueCxlPWEuY2xpZW50WStiLnkpLGEucGFnZU9mZnNldD1iLGEucG9pbnRzPVtkLGVdLGEuY3Vyc29yPWd8fGgsYX1mdW5jdGlvbiBIKGEpe3ZhciBiPWEtZyhqYSxjLm9ydCksZD0xMDAqYi9FKCk7cmV0dXJuIGQ9aihkKSxjLmRpcj8xMDAtZDpkfWZ1bmN0aW9uIEkoYSl7dmFyIGI9MTAwLGM9ITE7cmV0dXJuIGthLmZvckVhY2goZnVuY3Rpb24oZCxlKXtpZighZC5oYXNBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKSl7dmFyIGY9TWF0aC5hYnMoc2FbZV0tYSk7KGY8Ynx8MTAwPT09ZiYmMTAwPT09YikmJihjPWUsYj1mKX19KSxjfWZ1bmN0aW9uIEooYSxiKXtcIm1vdXNlb3V0XCI9PT1hLnR5cGUmJlwiSFRNTFwiPT09YS50YXJnZXQubm9kZU5hbWUmJm51bGw9PT1hLnJlbGF0ZWRUYXJnZXQmJkwoYSxiKX1mdW5jdGlvbiBLKGEsYil7aWYoLTE9PT1uYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiTVNJRSA5XCIpJiYwPT09YS5idXR0b25zJiYwIT09Yi5idXR0b25zUHJvcGVydHkpcmV0dXJuIEwoYSxiKTt2YXIgZD0oYy5kaXI/LTE6MSkqKGEuY2FsY1BvaW50LWIuc3RhcnRDYWxjUG9pbnQpO1coZD4wLDEwMCpkL2IuYmFzZVNpemUsYi5sb2NhdGlvbnMsYi5oYW5kbGVOdW1iZXJzKX1mdW5jdGlvbiBMKGEsYil7Yi5oYW5kbGUmJihuKGIuaGFuZGxlLGMuY3NzQ2xhc3Nlcy5hY3RpdmUpLHVhLT0xKSxiLmxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGEpe3phLnJlbW92ZUV2ZW50TGlzdGVuZXIoYVswXSxhWzFdKX0pLDA9PT11YSYmKG4ocmEsYy5jc3NDbGFzc2VzLmRyYWcpLF8oKSxhLmN1cnNvciYmKEFhLnN0eWxlLmN1cnNvcj1cIlwiLEFhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzZWxlY3RzdGFydFwiLGQpKSksYi5oYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24oYSl7UyhcImNoYW5nZVwiLGEpLFMoXCJzZXRcIixhKSxTKFwiZW5kXCIsYSl9KX1mdW5jdGlvbiBNKGEsYil7dmFyIGU7aWYoMT09PWIuaGFuZGxlTnVtYmVycy5sZW5ndGgpe3ZhciBmPWthW2IuaGFuZGxlTnVtYmVyc1swXV07aWYoZi5oYXNBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKSlyZXR1cm4hMTtlPWYuY2hpbGRyZW5bMF0sdWErPTEsbShlLGMuY3NzQ2xhc3Nlcy5hY3RpdmUpfWEuc3RvcFByb3BhZ2F0aW9uKCk7dmFyIGc9W10saD1GKG9hLm1vdmUsemEsSyx7dGFyZ2V0OmEudGFyZ2V0LGhhbmRsZTplLGxpc3RlbmVyczpnLHN0YXJ0Q2FsY1BvaW50OmEuY2FsY1BvaW50LGJhc2VTaXplOkUoKSxwYWdlT2Zmc2V0OmEucGFnZU9mZnNldCxoYW5kbGVOdW1iZXJzOmIuaGFuZGxlTnVtYmVycyxidXR0b25zUHJvcGVydHk6YS5idXR0b25zLGxvY2F0aW9uczpzYS5zbGljZSgpfSksaT1GKG9hLmVuZCx6YSxMLHt0YXJnZXQ6YS50YXJnZXQsaGFuZGxlOmUsbGlzdGVuZXJzOmcsZG9Ob3RSZWplY3Q6ITAsaGFuZGxlTnVtYmVyczpiLmhhbmRsZU51bWJlcnN9KSxqPUYoXCJtb3VzZW91dFwiLHphLEose3RhcmdldDphLnRhcmdldCxoYW5kbGU6ZSxsaXN0ZW5lcnM6Zyxkb05vdFJlamVjdDohMCxoYW5kbGVOdW1iZXJzOmIuaGFuZGxlTnVtYmVyc30pO2cucHVzaC5hcHBseShnLGguY29uY2F0KGksaikpLGEuY3Vyc29yJiYoQWEuc3R5bGUuY3Vyc29yPWdldENvbXB1dGVkU3R5bGUoYS50YXJnZXQpLmN1cnNvcixrYS5sZW5ndGg+MSYmbShyYSxjLmNzc0NsYXNzZXMuZHJhZyksQWEuYWRkRXZlbnRMaXN0ZW5lcihcInNlbGVjdHN0YXJ0XCIsZCwhMSkpLGIuaGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uKGEpe1MoXCJzdGFydFwiLGEpfSl9ZnVuY3Rpb24gTihhKXthLnN0b3BQcm9wYWdhdGlvbigpO3ZhciBiPUgoYS5jYWxjUG9pbnQpLGQ9SShiKTtpZighMT09PWQpcmV0dXJuITE7Yy5ldmVudHMuc25hcHx8aShyYSxjLmNzc0NsYXNzZXMudGFwLGMuYW5pbWF0aW9uRHVyYXRpb24pLGFhKGQsYiwhMCwhMCksXygpLFMoXCJzbGlkZVwiLGQsITApLFMoXCJ1cGRhdGVcIixkLCEwKSxTKFwiY2hhbmdlXCIsZCwhMCksUyhcInNldFwiLGQsITApLGMuZXZlbnRzLnNuYXAmJk0oYSx7aGFuZGxlTnVtYmVyczpbZF19KX1mdW5jdGlvbiBPKGEpe3ZhciBiPUgoYS5jYWxjUG9pbnQpLGM9dmEuZ2V0U3RlcChiKSxkPXZhLmZyb21TdGVwcGluZyhjKTtPYmplY3Qua2V5cyh4YSkuZm9yRWFjaChmdW5jdGlvbihhKXtcImhvdmVyXCI9PT1hLnNwbGl0KFwiLlwiKVswXSYmeGFbYV0uZm9yRWFjaChmdW5jdGlvbihhKXthLmNhbGwobWEsZCl9KX0pfWZ1bmN0aW9uIFAoYSl7YS5maXhlZHx8a2EuZm9yRWFjaChmdW5jdGlvbihhLGIpe0Yob2Euc3RhcnQsYS5jaGlsZHJlblswXSxNLHtoYW5kbGVOdW1iZXJzOltiXX0pfSksYS50YXAmJkYob2Euc3RhcnQsamEsTix7fSksYS5ob3ZlciYmRihvYS5tb3ZlLGphLE8se2hvdmVyOiEwfSksYS5kcmFnJiZsYS5mb3JFYWNoKGZ1bmN0aW9uKGIsZCl7aWYoITEhPT1iJiYwIT09ZCYmZCE9PWxhLmxlbmd0aC0xKXt2YXIgZT1rYVtkLTFdLGY9a2FbZF0sZz1bYl07bShiLGMuY3NzQ2xhc3Nlcy5kcmFnZ2FibGUpLGEuZml4ZWQmJihnLnB1c2goZS5jaGlsZHJlblswXSksZy5wdXNoKGYuY2hpbGRyZW5bMF0pKSxnLmZvckVhY2goZnVuY3Rpb24oYSl7RihvYS5zdGFydCxhLE0se2hhbmRsZXM6W2UsZl0saGFuZGxlTnVtYmVyczpbZC0xLGRdfSl9KX19KX1mdW5jdGlvbiBRKGEsYil7eGFbYV09eGFbYV18fFtdLHhhW2FdLnB1c2goYiksXCJ1cGRhdGVcIj09PWEuc3BsaXQoXCIuXCIpWzBdJiZrYS5mb3JFYWNoKGZ1bmN0aW9uKGEsYil7UyhcInVwZGF0ZVwiLGIpfSl9ZnVuY3Rpb24gUihhKXt2YXIgYj1hJiZhLnNwbGl0KFwiLlwiKVswXSxjPWImJmEuc3Vic3RyaW5nKGIubGVuZ3RoKTtPYmplY3Qua2V5cyh4YSkuZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgZD1hLnNwbGl0KFwiLlwiKVswXSxlPWEuc3Vic3RyaW5nKGQubGVuZ3RoKTtiJiZiIT09ZHx8YyYmYyE9PWV8fGRlbGV0ZSB4YVthXX0pfWZ1bmN0aW9uIFMoYSxiLGQpe09iamVjdC5rZXlzKHhhKS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciBmPWUuc3BsaXQoXCIuXCIpWzBdO2E9PT1mJiZ4YVtlXS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2EuY2FsbChtYSx3YS5tYXAoYy5mb3JtYXQudG8pLGIsd2Euc2xpY2UoKSxkfHwhMSxzYS5zbGljZSgpKX0pfSl9ZnVuY3Rpb24gVChhKXtyZXR1cm4gYStcIiVcIn1mdW5jdGlvbiBVKGEsYixkLGUsZixnKXtyZXR1cm4ga2EubGVuZ3RoPjEmJihlJiZiPjAmJihkPU1hdGgubWF4KGQsYVtiLTFdK2MubWFyZ2luKSksZiYmYjxrYS5sZW5ndGgtMSYmKGQ9TWF0aC5taW4oZCxhW2IrMV0tYy5tYXJnaW4pKSksa2EubGVuZ3RoPjEmJmMubGltaXQmJihlJiZiPjAmJihkPU1hdGgubWluKGQsYVtiLTFdK2MubGltaXQpKSxmJiZiPGthLmxlbmd0aC0xJiYoZD1NYXRoLm1heChkLGFbYisxXS1jLmxpbWl0KSkpLGMucGFkZGluZyYmKDA9PT1iJiYoZD1NYXRoLm1heChkLGMucGFkZGluZ1swXSkpLGI9PT1rYS5sZW5ndGgtMSYmKGQ9TWF0aC5taW4oZCwxMDAtYy5wYWRkaW5nWzFdKSkpLGQ9dmEuZ2V0U3RlcChkKSwhKChkPWooZCkpPT09YVtiXSYmIWcpJiZkfWZ1bmN0aW9uIFYoYSxiKXt2YXIgZD1jLm9ydDtyZXR1cm4oZD9iOmEpK1wiLCBcIisoZD9hOmIpfWZ1bmN0aW9uIFcoYSxiLGMsZCl7dmFyIGU9Yy5zbGljZSgpLGY9WyFhLGFdLGc9W2EsIWFdO2Q9ZC5zbGljZSgpLGEmJmQucmV2ZXJzZSgpLGQubGVuZ3RoPjE/ZC5mb3JFYWNoKGZ1bmN0aW9uKGEsYyl7dmFyIGQ9VShlLGEsZVthXStiLGZbY10sZ1tjXSwhMSk7ITE9PT1kP2I9MDooYj1kLWVbYV0sZVthXT1kKX0pOmY9Zz1bITBdO3ZhciBoPSExO2QuZm9yRWFjaChmdW5jdGlvbihhLGQpe2g9YWEoYSxjW2FdK2IsZltkXSxnW2RdKXx8aH0pLGgmJmQuZm9yRWFjaChmdW5jdGlvbihhKXtTKFwidXBkYXRlXCIsYSksUyhcInNsaWRlXCIsYSl9KX1mdW5jdGlvbiBZKGEsYil7cmV0dXJuIGMuZGlyPzEwMC1hLWI6YX1mdW5jdGlvbiBaKGEsYil7c2FbYV09Yix3YVthXT12YS5mcm9tU3RlcHBpbmcoYik7dmFyIGQ9XCJ0cmFuc2xhdGUoXCIrVihUKFkoYiwwKS1CYSksXCIwXCIpK1wiKVwiO2thW2FdLnN0eWxlW2MudHJhbnNmb3JtUnVsZV09ZCxiYShhKSxiYShhKzEpfWZ1bmN0aW9uIF8oKXt0YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3ZhciBiPXNhW2FdPjUwPy0xOjEsYz0zKyhrYS5sZW5ndGgrYiphKTtrYVthXS5zdHlsZS56SW5kZXg9Y30pfWZ1bmN0aW9uIGFhKGEsYixjLGQpe3JldHVybiExIT09KGI9VShzYSxhLGIsYyxkLCExKSkmJihaKGEsYiksITApfWZ1bmN0aW9uIGJhKGEpe2lmKGxhW2FdKXt2YXIgYj0wLGQ9MTAwOzAhPT1hJiYoYj1zYVthLTFdKSxhIT09bGEubGVuZ3RoLTEmJihkPXNhW2FdKTt2YXIgZT1kLWIsZj1cInRyYW5zbGF0ZShcIitWKFQoWShiLGUpKSxcIjBcIikrXCIpXCIsZz1cInNjYWxlKFwiK1YoZS8xMDAsXCIxXCIpK1wiKVwiO2xhW2FdLnN0eWxlW2MudHJhbnNmb3JtUnVsZV09ZitcIiBcIitnfX1mdW5jdGlvbiBjYShhLGIpe3JldHVybiBudWxsPT09YXx8ITE9PT1hfHx2b2lkIDA9PT1hP3NhW2JdOihcIm51bWJlclwiPT10eXBlb2YgYSYmKGE9U3RyaW5nKGEpKSxhPWMuZm9ybWF0LmZyb20oYSksYT12YS50b1N0ZXBwaW5nKGEpLCExPT09YXx8aXNOYU4oYSk/c2FbYl06YSl9ZnVuY3Rpb24gZGEoYSxiKXt2YXIgZD1rKGEpLGU9dm9pZCAwPT09c2FbMF07Yj12b2lkIDA9PT1ifHwhIWIsYy5hbmltYXRlJiYhZSYmaShyYSxjLmNzc0NsYXNzZXMudGFwLGMuYW5pbWF0aW9uRHVyYXRpb24pLHRhLmZvckVhY2goZnVuY3Rpb24oYSl7YWEoYSxjYShkW2FdLGEpLCEwLCExKX0pLHRhLmZvckVhY2goZnVuY3Rpb24oYSl7YWEoYSxzYVthXSwhMCwhMCl9KSxfKCksdGEuZm9yRWFjaChmdW5jdGlvbihhKXtTKFwidXBkYXRlXCIsYSksbnVsbCE9PWRbYV0mJmImJlMoXCJzZXRcIixhKX0pfWZ1bmN0aW9uIGVhKGEpe2RhKGMuc3RhcnQsYSl9ZnVuY3Rpb24gZmEoKXt2YXIgYT13YS5tYXAoYy5mb3JtYXQudG8pO3JldHVybiAxPT09YS5sZW5ndGg/YVswXTphfWZ1bmN0aW9uIGdhKCl7Zm9yKHZhciBhIGluIGMuY3NzQ2xhc3NlcyljLmNzc0NsYXNzZXMuaGFzT3duUHJvcGVydHkoYSkmJm4ocmEsYy5jc3NDbGFzc2VzW2FdKTtmb3IoO3JhLmZpcnN0Q2hpbGQ7KXJhLnJlbW92ZUNoaWxkKHJhLmZpcnN0Q2hpbGQpO2RlbGV0ZSByYS5ub1VpU2xpZGVyfWZ1bmN0aW9uIGhhKCl7cmV0dXJuIHNhLm1hcChmdW5jdGlvbihhLGIpe3ZhciBjPXZhLmdldE5lYXJieVN0ZXBzKGEpLGQ9d2FbYl0sZT1jLnRoaXNTdGVwLnN0ZXAsZj1udWxsOyExIT09ZSYmZCtlPmMuc3RlcEFmdGVyLnN0YXJ0VmFsdWUmJihlPWMuc3RlcEFmdGVyLnN0YXJ0VmFsdWUtZCksZj1kPmMudGhpc1N0ZXAuc3RhcnRWYWx1ZT9jLnRoaXNTdGVwLnN0ZXA6ITEhPT1jLnN0ZXBCZWZvcmUuc3RlcCYmZC1jLnN0ZXBCZWZvcmUuaGlnaGVzdFN0ZXAsMTAwPT09YT9lPW51bGw6MD09PWEmJihmPW51bGwpO3ZhciBnPXZhLmNvdW50U3RlcERlY2ltYWxzKCk7cmV0dXJuIG51bGwhPT1lJiYhMSE9PWUmJihlPU51bWJlcihlLnRvRml4ZWQoZykpKSxudWxsIT09ZiYmITEhPT1mJiYoZj1OdW1iZXIoZi50b0ZpeGVkKGcpKSksW2YsZV19KX1mdW5jdGlvbiBpYShhLGIpe3ZhciBkPWZhKCksZT1bXCJtYXJnaW5cIixcImxpbWl0XCIsXCJwYWRkaW5nXCIsXCJyYW5nZVwiLFwiYW5pbWF0ZVwiLFwic25hcFwiLFwic3RlcFwiLFwiZm9ybWF0XCJdO2UuZm9yRWFjaChmdW5jdGlvbihiKXt2b2lkIDAhPT1hW2JdJiYoZltiXT1hW2JdKX0pO3ZhciBnPVgoZik7ZS5mb3JFYWNoKGZ1bmN0aW9uKGIpe3ZvaWQgMCE9PWFbYl0mJihjW2JdPWdbYl0pfSksdmE9Zy5zcGVjdHJ1bSxjLm1hcmdpbj1nLm1hcmdpbixjLmxpbWl0PWcubGltaXQsYy5wYWRkaW5nPWcucGFkZGluZyxjLnBpcHMmJkQoYy5waXBzKSxzYT1bXSxkYShhLnN0YXJ0fHxkLGIpfXZhciBqYSxrYSxsYSxtYSxuYSxvYT1xKCkscGE9cygpLHFhPXBhJiZyKCkscmE9YSxzYT1bXSx0YT1bXSx1YT0wLHZhPWMuc3BlY3RydW0sd2E9W10seGE9e30seWE9YS5vd25lckRvY3VtZW50LHphPXlhLmRvY3VtZW50RWxlbWVudCxBYT15YS5ib2R5LEJhPVwicnRsXCI9PT15YS5kaXJ8fDE9PT1jLm9ydD8wOjEwMDtyZXR1cm4gdihyYSksdShjLmNvbm5lY3QsamEpLFAoYy5ldmVudHMpLGRhKGMuc3RhcnQpLG1hPXtkZXN0cm95OmdhLHN0ZXBzOmhhLG9uOlEsb2ZmOlIsZ2V0OmZhLHNldDpkYSxyZXNldDplYSxfX21vdmVIYW5kbGVzOmZ1bmN0aW9uKGEsYixjKXtXKGEsYixzYSxjKX0sb3B0aW9uczpmLHVwZGF0ZU9wdGlvbnM6aWEsdGFyZ2V0OnJhLHJlbW92ZVBpcHM6QyxwaXBzOkR9LGMucGlwcyYmRChjLnBpcHMpLGMudG9vbHRpcHMmJngoKSx5KCksbWF9ZnVuY3Rpb24gWihhLGIpe2lmKCFhfHwhYS5ub2RlTmFtZSl0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiskK1wiKTogY3JlYXRlIHJlcXVpcmVzIGEgc2luZ2xlIGVsZW1lbnQsIGdvdDogXCIrYSk7aWYoYS5ub1VpU2xpZGVyKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiBTbGlkZXIgd2FzIGFscmVhZHkgaW5pdGlhbGl6ZWQuXCIpO3ZhciBjPVgoYixhKSxkPVkoYSxjLGIpO3JldHVybiBhLm5vVWlTbGlkZXI9ZCxkfXZhciAkPVwiMTEuMS4wXCI7RC5wcm90b3R5cGUuZ2V0TWFyZ2luPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMueE51bVN0ZXBzWzBdO2lmKGImJmEvYiUxIT0wKXRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiKyQrXCIpOiAnbGltaXQnLCAnbWFyZ2luJyBhbmQgJ3BhZGRpbmcnIG11c3QgYmUgZGl2aXNpYmxlIGJ5IHN0ZXAuXCIpO3JldHVybiAyPT09dGhpcy54UGN0Lmxlbmd0aCYmdSh0aGlzLnhWYWwsYSl9LEQucHJvdG90eXBlLnRvU3RlcHBpbmc9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9eSh0aGlzLnhWYWwsdGhpcy54UGN0LGEpfSxELnByb3RvdHlwZS5mcm9tU3RlcHBpbmc9ZnVuY3Rpb24oYSl7cmV0dXJuIHoodGhpcy54VmFsLHRoaXMueFBjdCxhKX0sRC5wcm90b3R5cGUuZ2V0U3RlcD1mdW5jdGlvbihhKXtyZXR1cm4gYT1BKHRoaXMueFBjdCx0aGlzLnhTdGVwcyx0aGlzLnNuYXAsYSl9LEQucHJvdG90eXBlLmdldE5lYXJieVN0ZXBzPWZ1bmN0aW9uKGEpe3ZhciBiPXgoYSx0aGlzLnhQY3QpO3JldHVybntzdGVwQmVmb3JlOntzdGFydFZhbHVlOnRoaXMueFZhbFtiLTJdLHN0ZXA6dGhpcy54TnVtU3RlcHNbYi0yXSxoaWdoZXN0U3RlcDp0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwW2ItMl19LHRoaXNTdGVwOntzdGFydFZhbHVlOnRoaXMueFZhbFtiLTFdLHN0ZXA6dGhpcy54TnVtU3RlcHNbYi0xXSxoaWdoZXN0U3RlcDp0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwW2ItMV19LHN0ZXBBZnRlcjp7c3RhcnRWYWx1ZTp0aGlzLnhWYWxbYi0wXSxzdGVwOnRoaXMueE51bVN0ZXBzW2ItMF0saGlnaGVzdFN0ZXA6dGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtiLTBdfX19LEQucHJvdG90eXBlLmNvdW50U3RlcERlY2ltYWxzPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy54TnVtU3RlcHMubWFwKGwpO3JldHVybiBNYXRoLm1heC5hcHBseShudWxsLGEpfSxELnByb3RvdHlwZS5jb252ZXJ0PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmdldFN0ZXAodGhpcy50b1N0ZXBwaW5nKGEpKX07dmFyIF89e3RvOmZ1bmN0aW9uKGEpe3JldHVybiB2b2lkIDAhPT1hJiZhLnRvRml4ZWQoMil9LGZyb206TnVtYmVyfTtyZXR1cm57dmVyc2lvbjokLGNyZWF0ZTpafX0pOyIsImluaXQoKTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcblx0bGV0IG1haW5Hcm91cCwgYWxsTWVzaGVzO1xyXG5cdGxldCByZW5kZXJlciwgc2NlbmUsIGNhbWVyYSwgb3JiaXRDb250cm9scztcclxuXHRsZXQgdmFsaWRCdXR0b24sIGZpbGVJbnB1dDtcclxuXHRsZXQgd2luZG93SGFsZlgsIHdpbmRvd0hhbGZZO1xyXG5cdGxldCBzbGlkZXI7XHJcblx0bGV0IG1pZGlUb0Nob3JkO1xyXG5cdGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoIDB4NDA0MDQwICksXHJcblx0XHQgIHBvaW50TGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCggMHhmZjAwMDAsIDEsIDEwMCApXHJcblx0XHQgIGdsb2JhbExpZ2h0cyA9IG5ldyBHbG9iYWxMaWdodHMoMjApO1xyXG5cdGNvbnN0IHNjYWxlID0gMTU7XHRcclxuXHRcclxuXHRhbGxNZXNoZXMgPSBuZXcgQWxsTWVzaGVzKHNjYWxlKTtcclxuXHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1pbnB1dCcpO1xyXG5cdHZhbGlkQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZhbGlkLWJ0bicpO1xyXG5cdHZhbGlkQnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuXHRcdG1pZGlUb0Nob3JkID0gbmV3IE1pZGlUb0Nob3JkTWFwKCk7XHJcblx0XHRtaWRpVG9DaG9yZC5wYXJzZShmaWxlSW5wdXQsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzbGlkZXIgPSBuZXcgU2xpZGVyKGZpbGVJbnB1dCwgYWxsTWVzaGVzLCBtaWRpVG9DaG9yZC5rZXlzTWFwKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGgvd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApO1xyXG5cdGNhbWVyYS5wb3NpdGlvbi56ID0gNTA7XHJcblxyXG5cdHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcblx0c2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvciggMHhmZmZmZmYgKTtcclxuXHJcblx0cmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xyXG5cdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xyXG5cdHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcblxyXG5cdG9yYml0Q29udHJvbHMgPSBuZXcgVEhSRUUuT3JiaXRDb250cm9scyggY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50ICk7XHJcblx0b3JiaXRDb250cm9scy5taW5EaXN0YW5jZSA9IDU7XHJcblx0b3JiaXRDb250cm9scy5tYXhEaXN0YW5jZSA9IDIwMDtcclxuXHRvcmJpdENvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJO1xyXG5cclxuXHRzY2VuZS5hZGQoIGFtYmllbnRMaWdodCApO1xyXG5cdGNhbWVyYS5hZGQocG9pbnRMaWdodCk7XHJcblxyXG5cdG1haW5Hcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cdHNjZW5lLmFkZChtYWluR3JvdXApO1xyXG5cdG1haW5Hcm91cC5hZGQoZ2xvYmFsTGlnaHRzKTtcclxuXHRtYWluR3JvdXAuYWRkKGFsbE1lc2hlcy5tZXNoR3JvdXApO1xyXG5cclxuXHRzdGF0cyA9IG5ldyBTdGF0cygpO1xyXG5cdC8vY29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XHJcblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKCByZW5kZXJlci5kb21FbGVtZW50ICk7XHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplLCBmYWxzZSApO1xyXG5cclxuXHRmdW5jdGlvbiBhbmltYXRlKCkge1xyXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBhbmltYXRlICk7XHJcblx0XHRyZW5kZXIoKTtcclxuXHRcdHN0YXRzLnVwZGF0ZSgpO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiByZW5kZXIoKSB7XHJcblx0XHRyZW5kZXJlci5yZW5kZXIoIHNjZW5lLCBjYW1lcmEgKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xyXG5cdFx0d2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XHJcblx0XHR3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XHJcblx0XHRjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblx0XHRjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG5cdFx0cmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xyXG5cdH1cclxuXHJcblx0YW5pbWF0ZSgpO1x0XHJcbn1cclxuIiwiZnVuY3Rpb24gU2xpZGVyKGRvbUVsZW0sIGFsbE1lc2hlcywgY2hvcmRzTWFwKSB7XHJcblx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsaWRlcicpO1xyXG5cdGxldCB0aW1lc0FycmF5ID0gQXJyYXkuZnJvbShjaG9yZHNNYXAua2V5cygpKS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcblx0bGV0IGxvd0JvdW5kID0gdGltZXNBcnJheVswXTtcclxuXHRsZXQgdXBCb3VuZCA9IHRpbWVzQXJyYXlbdGltZXNBcnJheS5sZW5ndGggLSAxXTtcclxuXHRsZXQgdXAgPSB1cEJvdW5kO1xyXG5cdGxldCBsb3cgPSBsb3dCb3VuZDtcclxuXHJcblx0Y29uc29sZS5sb2coJ2Nob3Jkc01hcCcsIGNob3Jkc01hcCk7XHJcblx0Y29uc29sZS5sb2coJ3VwQm91bmQnLCB1cEJvdW5kKTtcclxuXHRjb25zb2xlLmxvZygnbG93Qm91bmQnLCBsb3dCb3VuZCk7XHJcblxyXG5cdGlmKHNsaWRlci5ub1VpU2xpZGVyICE9IG51bGwpXHJcblx0XHRzbGlkZXIubm9VaVNsaWRlci5kZXN0cm95KCk7XHJcblxyXG5cdG5vVWlTbGlkZXIuY3JlYXRlKHNsaWRlciwge1xyXG5cdFx0c3RhcnQ6IFsgMCwgNTAwIF0sXHJcblx0XHRjb25uZWN0OiB0cnVlLFxyXG5cdFx0c3RlcDogMSxcclxuXHRcdHRvb2x0aXBzOiBbIHRydWUsIHRydWUgXSxcclxuXHRcdHJhbmdlOiB7XHJcblx0XHRcdCdtaW4nOiBsb3dCb3VuZCxcclxuXHRcdFx0J21heCc6IHVwQm91bmRcclxuXHRcdH0sXHJcblx0XHRmb3JtYXQ6IHdOdW1iKHtcclxuXHRcdFx0ZGVjaW1hbHM6IDBcclxuXHRcdH0pXHJcblx0fSk7XHJcblxyXG5cdGNvbnNvbGUubG9nKGNob3Jkc01hcCk7XHJcblxyXG5cdHNsaWRlci5ub1VpU2xpZGVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbih2YWx1ZXMsIGhhbmRsZSkge1xyXG5cdFx0bGV0IHZhbHVlID0gdmFsdWVzW2hhbmRsZV07XHJcblx0XHRpZihoYW5kbGUgPT09IDEpIHtcclxuXHRcdFx0dXAgPSBwYXJzZUludCh2YWx1ZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsb3cgPSBwYXJzZUludCh2YWx1ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yKGxldCBtZXNoIG9mIGFsbE1lc2hlcy5tZXNoQnlJZC52YWx1ZXMoKSkge1xyXG5cdFx0XHRtZXNoLnZpc2libGUgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Zm9yKGxldCBpPWxvdzsgaTx1cDsgaSsrKSB7XHJcblx0XHRcdGlmKGNob3Jkc01hcC5oYXMoaSkpIHtcclxuXHRcdFx0XHQvL2FsbE1lc2hlcy5zaG93RnJvbVB0c0FycmF5KGNob3Jkc01hcC5nZXQoaSksIHRydWUpO1xyXG5cdFx0XHRcdGxldCBrZXlzID0gY2hvcmRzTWFwLmdldChpKTtcclxuXHRcdFx0XHRmb3IobGV0IGtleSBvZiBrZXlzKSB7XHJcblx0XHRcdFx0XHRhbGxNZXNoZXMuc2hvd0Zyb21LZXkoa2V5LCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBmb3IobGV0IG1lc2ggb2YgYWxsTWVzaGVzLm1lc2hCeUlkLnZhbHVlcygpKXtcclxuXHRcdC8vIFx0bWVzaC52aXNpYmxlID0gdHJ1ZTtcclxuXHRcdC8vIH1cclxuXHR9KTtcclxuXHJcblxyXG5cdFxyXG59IiwiKGZ1bmN0aW9uIChmYWN0b3J5KSB7XHJcblxyXG4gICAgaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XHJcblxyXG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuICAgICAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcclxuXHJcbiAgICAgICAgLy8gTm9kZS9Db21tb25KU1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xyXG4gICAgICAgIHdpbmRvdy53TnVtYiA9IGZhY3RvcnkoKTtcclxuICAgIH1cclxuXHJcbn0oZnVuY3Rpb24oKXtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm1hdE9wdGlvbnMgPSBbXHJcblx0J2RlY2ltYWxzJyxcclxuXHQndGhvdXNhbmQnLFxyXG5cdCdtYXJrJyxcclxuXHQncHJlZml4JyxcclxuXHQnc3VmZml4JyxcclxuXHQnZW5jb2RlcicsXHJcblx0J2RlY29kZXInLFxyXG5cdCduZWdhdGl2ZUJlZm9yZScsXHJcblx0J25lZ2F0aXZlJyxcclxuXHQnZWRpdCcsXHJcblx0J3VuZG8nXHJcbl07XHJcblxyXG4vLyBHZW5lcmFsXHJcblxyXG5cdC8vIFJldmVyc2UgYSBzdHJpbmdcclxuXHRmdW5jdGlvbiBzdHJSZXZlcnNlICggYSApIHtcclxuXHRcdHJldHVybiBhLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJyk7XHJcblx0fVxyXG5cclxuXHQvLyBDaGVjayBpZiBhIHN0cmluZyBzdGFydHMgd2l0aCBhIHNwZWNpZmllZCBwcmVmaXguXHJcblx0ZnVuY3Rpb24gc3RyU3RhcnRzV2l0aCAoIGlucHV0LCBtYXRjaCApIHtcclxuXHRcdHJldHVybiBpbnB1dC5zdWJzdHJpbmcoMCwgbWF0Y2gubGVuZ3RoKSA9PT0gbWF0Y2g7XHJcblx0fVxyXG5cclxuXHQvLyBDaGVjayBpcyBhIHN0cmluZyBlbmRzIGluIGEgc3BlY2lmaWVkIHN1ZmZpeC5cclxuXHRmdW5jdGlvbiBzdHJFbmRzV2l0aCAoIGlucHV0LCBtYXRjaCApIHtcclxuXHRcdHJldHVybiBpbnB1dC5zbGljZSgtMSAqIG1hdGNoLmxlbmd0aCkgPT09IG1hdGNoO1xyXG5cdH1cclxuXHJcblx0Ly8gVGhyb3cgYW4gZXJyb3IgaWYgZm9ybWF0dGluZyBvcHRpb25zIGFyZSBpbmNvbXBhdGlibGUuXHJcblx0ZnVuY3Rpb24gdGhyb3dFcXVhbEVycm9yKCBGLCBhLCBiICkge1xyXG5cdFx0aWYgKCAoRlthXSB8fCBGW2JdKSAmJiAoRlthXSA9PT0gRltiXSkgKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihhKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIENoZWNrIGlmIGEgbnVtYmVyIGlzIGZpbml0ZSBhbmQgbm90IE5hTlxyXG5cdGZ1bmN0aW9uIGlzVmFsaWROdW1iZXIgKCBpbnB1dCApIHtcclxuXHRcdHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInICYmIGlzRmluaXRlKCBpbnB1dCApO1xyXG5cdH1cclxuXHJcblx0Ly8gUHJvdmlkZSByb3VuZGluZy1hY2N1cmF0ZSB0b0ZpeGVkIG1ldGhvZC5cclxuXHQvLyBCb3Jyb3dlZDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjEzMjMzMzAvNzc1MjY1XHJcblx0ZnVuY3Rpb24gdG9GaXhlZCAoIHZhbHVlLCBleHAgKSB7XHJcblx0XHR2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJ2UnKTtcclxuXHRcdHZhbHVlID0gTWF0aC5yb3VuZCgrKHZhbHVlWzBdICsgJ2UnICsgKHZhbHVlWzFdID8gKCt2YWx1ZVsxXSArIGV4cCkgOiBleHApKSk7XHJcblx0XHR2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJ2UnKTtcclxuXHRcdHJldHVybiAoKyh2YWx1ZVswXSArICdlJyArICh2YWx1ZVsxXSA/ICgrdmFsdWVbMV0gLSBleHApIDogLWV4cCkpKS50b0ZpeGVkKGV4cCk7XHJcblx0fVxyXG5cclxuXHJcbi8vIEZvcm1hdHRpbmdcclxuXHJcblx0Ly8gQWNjZXB0IGEgbnVtYmVyIGFzIGlucHV0LCBvdXRwdXQgZm9ybWF0dGVkIHN0cmluZy5cclxuXHRmdW5jdGlvbiBmb3JtYXRUbyAoIGRlY2ltYWxzLCB0aG91c2FuZCwgbWFyaywgcHJlZml4LCBzdWZmaXgsIGVuY29kZXIsIGRlY29kZXIsIG5lZ2F0aXZlQmVmb3JlLCBuZWdhdGl2ZSwgZWRpdCwgdW5kbywgaW5wdXQgKSB7XHJcblxyXG5cdFx0dmFyIG9yaWdpbmFsSW5wdXQgPSBpbnB1dCwgaW5wdXRJc05lZ2F0aXZlLCBpbnB1dFBpZWNlcywgaW5wdXRCYXNlLCBpbnB1dERlY2ltYWxzID0gJycsIG91dHB1dCA9ICcnO1xyXG5cclxuXHRcdC8vIEFwcGx5IHVzZXIgZW5jb2RlciB0byB0aGUgaW5wdXQuXHJcblx0XHQvLyBFeHBlY3RlZCBvdXRjb21lOiBudW1iZXIuXHJcblx0XHRpZiAoIGVuY29kZXIgKSB7XHJcblx0XHRcdGlucHV0ID0gZW5jb2RlcihpbnB1dCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU3RvcCBpZiBubyB2YWxpZCBudW1iZXIgd2FzIHByb3ZpZGVkLCB0aGUgbnVtYmVyIGlzIGluZmluaXRlIG9yIE5hTi5cclxuXHRcdGlmICggIWlzVmFsaWROdW1iZXIoaW5wdXQpICkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUm91bmRpbmcgYXdheSBkZWNpbWFscyBtaWdodCBjYXVzZSBhIHZhbHVlIG9mIC0wXHJcblx0XHQvLyB3aGVuIHVzaW5nIHZlcnkgc21hbGwgcmFuZ2VzLiBSZW1vdmUgdGhvc2UgY2FzZXMuXHJcblx0XHRpZiAoIGRlY2ltYWxzICE9PSBmYWxzZSAmJiBwYXJzZUZsb2F0KGlucHV0LnRvRml4ZWQoZGVjaW1hbHMpKSA9PT0gMCApIHtcclxuXHRcdFx0aW5wdXQgPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZvcm1hdHRpbmcgaXMgZG9uZSBvbiBhYnNvbHV0ZSBudW1iZXJzLFxyXG5cdFx0Ly8gZGVjb3JhdGVkIGJ5IGFuIG9wdGlvbmFsIG5lZ2F0aXZlIHN5bWJvbC5cclxuXHRcdGlmICggaW5wdXQgPCAwICkge1xyXG5cdFx0XHRpbnB1dElzTmVnYXRpdmUgPSB0cnVlO1xyXG5cdFx0XHRpbnB1dCA9IE1hdGguYWJzKGlucHV0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZWR1Y2UgdGhlIG51bWJlciBvZiBkZWNpbWFscyB0byB0aGUgc3BlY2lmaWVkIG9wdGlvbi5cclxuXHRcdGlmICggZGVjaW1hbHMgIT09IGZhbHNlICkge1xyXG5cdFx0XHRpbnB1dCA9IHRvRml4ZWQoIGlucHV0LCBkZWNpbWFscyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRyYW5zZm9ybSB0aGUgbnVtYmVyIGludG8gYSBzdHJpbmcsIHNvIGl0IGNhbiBiZSBzcGxpdC5cclxuXHRcdGlucHV0ID0gaW5wdXQudG9TdHJpbmcoKTtcclxuXHJcblx0XHQvLyBCcmVhayB0aGUgbnVtYmVyIG9uIHRoZSBkZWNpbWFsIHNlcGFyYXRvci5cclxuXHRcdGlmICggaW5wdXQuaW5kZXhPZignLicpICE9PSAtMSApIHtcclxuXHRcdFx0aW5wdXRQaWVjZXMgPSBpbnB1dC5zcGxpdCgnLicpO1xyXG5cclxuXHRcdFx0aW5wdXRCYXNlID0gaW5wdXRQaWVjZXNbMF07XHJcblxyXG5cdFx0XHRpZiAoIG1hcmsgKSB7XHJcblx0XHRcdFx0aW5wdXREZWNpbWFscyA9IG1hcmsgKyBpbnB1dFBpZWNlc1sxXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0Ly8gSWYgaXQgaXNuJ3Qgc3BsaXQsIHRoZSBlbnRpcmUgbnVtYmVyIHdpbGwgZG8uXHJcblx0XHRcdGlucHV0QmFzZSA9IGlucHV0O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEdyb3VwIG51bWJlcnMgaW4gc2V0cyBvZiB0aHJlZS5cclxuXHRcdGlmICggdGhvdXNhbmQgKSB7XHJcblx0XHRcdGlucHV0QmFzZSA9IHN0clJldmVyc2UoaW5wdXRCYXNlKS5tYXRjaCgvLnsxLDN9L2cpO1xyXG5cdFx0XHRpbnB1dEJhc2UgPSBzdHJSZXZlcnNlKGlucHV0QmFzZS5qb2luKCBzdHJSZXZlcnNlKCB0aG91c2FuZCApICkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElmIHRoZSBudW1iZXIgaXMgbmVnYXRpdmUsIHByZWZpeCB3aXRoIG5lZ2F0aW9uIHN5bWJvbC5cclxuXHRcdGlmICggaW5wdXRJc05lZ2F0aXZlICYmIG5lZ2F0aXZlQmVmb3JlICkge1xyXG5cdFx0XHRvdXRwdXQgKz0gbmVnYXRpdmVCZWZvcmU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUHJlZml4IHRoZSBudW1iZXJcclxuXHRcdGlmICggcHJlZml4ICkge1xyXG5cdFx0XHRvdXRwdXQgKz0gcHJlZml4O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIE5vcm1hbCBuZWdhdGl2ZSBvcHRpb24gY29tZXMgYWZ0ZXIgdGhlIHByZWZpeC4gRGVmYXVsdHMgdG8gJy0nLlxyXG5cdFx0aWYgKCBpbnB1dElzTmVnYXRpdmUgJiYgbmVnYXRpdmUgKSB7XHJcblx0XHRcdG91dHB1dCArPSBuZWdhdGl2ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBcHBlbmQgdGhlIGFjdHVhbCBudW1iZXIuXHJcblx0XHRvdXRwdXQgKz0gaW5wdXRCYXNlO1xyXG5cdFx0b3V0cHV0ICs9IGlucHV0RGVjaW1hbHM7XHJcblxyXG5cdFx0Ly8gQXBwbHkgdGhlIHN1ZmZpeC5cclxuXHRcdGlmICggc3VmZml4ICkge1xyXG5cdFx0XHRvdXRwdXQgKz0gc3VmZml4O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJ1biB0aGUgb3V0cHV0IHRocm91Z2ggYSB1c2VyLXNwZWNpZmllZCBwb3N0LWZvcm1hdHRlci5cclxuXHRcdGlmICggZWRpdCApIHtcclxuXHRcdFx0b3V0cHV0ID0gZWRpdCAoIG91dHB1dCwgb3JpZ2luYWxJbnB1dCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFsbCBkb25lLlxyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9XHJcblxyXG5cdC8vIEFjY2VwdCBhIHN0aW5nIGFzIGlucHV0LCBvdXRwdXQgZGVjb2RlZCBudW1iZXIuXHJcblx0ZnVuY3Rpb24gZm9ybWF0RnJvbSAoIGRlY2ltYWxzLCB0aG91c2FuZCwgbWFyaywgcHJlZml4LCBzdWZmaXgsIGVuY29kZXIsIGRlY29kZXIsIG5lZ2F0aXZlQmVmb3JlLCBuZWdhdGl2ZSwgZWRpdCwgdW5kbywgaW5wdXQgKSB7XHJcblxyXG5cdFx0dmFyIG9yaWdpbmFsSW5wdXQgPSBpbnB1dCwgaW5wdXRJc05lZ2F0aXZlLCBvdXRwdXQgPSAnJztcclxuXHJcblx0XHQvLyBVc2VyIGRlZmluZWQgcHJlLWRlY29kZXIuIFJlc3VsdCBtdXN0IGJlIGEgbm9uIGVtcHR5IHN0cmluZy5cclxuXHRcdGlmICggdW5kbyApIHtcclxuXHRcdFx0aW5wdXQgPSB1bmRvKGlucHV0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUZXN0IHRoZSBpbnB1dC4gQ2FuJ3QgYmUgZW1wdHkuXHJcblx0XHRpZiAoICFpbnB1dCB8fCB0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnICkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWYgdGhlIHN0cmluZyBzdGFydHMgd2l0aCB0aGUgbmVnYXRpdmVCZWZvcmUgdmFsdWU6IHJlbW92ZSBpdC5cclxuXHRcdC8vIFJlbWVtYmVyIGlzIHdhcyB0aGVyZSwgdGhlIG51bWJlciBpcyBuZWdhdGl2ZS5cclxuXHRcdGlmICggbmVnYXRpdmVCZWZvcmUgJiYgc3RyU3RhcnRzV2l0aChpbnB1dCwgbmVnYXRpdmVCZWZvcmUpICkge1xyXG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UobmVnYXRpdmVCZWZvcmUsICcnKTtcclxuXHRcdFx0aW5wdXRJc05lZ2F0aXZlID0gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZXBlYXQgdGhlIHNhbWUgcHJvY2VkdXJlIGZvciB0aGUgcHJlZml4LlxyXG5cdFx0aWYgKCBwcmVmaXggJiYgc3RyU3RhcnRzV2l0aChpbnB1dCwgcHJlZml4KSApIHtcclxuXHRcdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKHByZWZpeCwgJycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFuZCBhZ2FpbiBmb3IgbmVnYXRpdmUuXHJcblx0XHRpZiAoIG5lZ2F0aXZlICYmIHN0clN0YXJ0c1dpdGgoaW5wdXQsIG5lZ2F0aXZlKSApIHtcclxuXHRcdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKG5lZ2F0aXZlLCAnJyk7XHJcblx0XHRcdGlucHV0SXNOZWdhdGl2ZSA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVtb3ZlIHRoZSBzdWZmaXguXHJcblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TdHJpbmcvc2xpY2VcclxuXHRcdGlmICggc3VmZml4ICYmIHN0ckVuZHNXaXRoKGlucHV0LCBzdWZmaXgpICkge1xyXG5cdFx0XHRpbnB1dCA9IGlucHV0LnNsaWNlKDAsIC0xICogc3VmZml4Lmxlbmd0aCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVtb3ZlIHRoZSB0aG91c2FuZCBncm91cGluZy5cclxuXHRcdGlmICggdGhvdXNhbmQgKSB7XHJcblx0XHRcdGlucHV0ID0gaW5wdXQuc3BsaXQodGhvdXNhbmQpLmpvaW4oJycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNldCB0aGUgZGVjaW1hbCBzZXBhcmF0b3IgYmFjayB0byBwZXJpb2QuXHJcblx0XHRpZiAoIG1hcmsgKSB7XHJcblx0XHRcdGlucHV0ID0gaW5wdXQucmVwbGFjZShtYXJrLCAnLicpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFByZXBlbmQgdGhlIG5lZ2F0aXZlIHN5bWJvbC5cclxuXHRcdGlmICggaW5wdXRJc05lZ2F0aXZlICkge1xyXG5cdFx0XHRvdXRwdXQgKz0gJy0nO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFkZCB0aGUgbnVtYmVyXHJcblx0XHRvdXRwdXQgKz0gaW5wdXQ7XHJcblxyXG5cdFx0Ly8gVHJpbSBhbGwgbm9uLW51bWVyaWMgY2hhcmFjdGVycyAoYWxsb3cgJy4nIGFuZCAnLScpO1xyXG5cdFx0b3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL1teMC05XFwuXFwtLl0vZywgJycpO1xyXG5cclxuXHRcdC8vIFRoZSB2YWx1ZSBjb250YWlucyBubyBwYXJzZS1hYmxlIG51bWJlci5cclxuXHRcdGlmICggb3V0cHV0ID09PSAnJyApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENvdmVydCB0byBudW1iZXIuXHJcblx0XHRvdXRwdXQgPSBOdW1iZXIob3V0cHV0KTtcclxuXHJcblx0XHQvLyBSdW4gdGhlIHVzZXItc3BlY2lmaWVkIHBvc3QtZGVjb2Rlci5cclxuXHRcdGlmICggZGVjb2RlciApIHtcclxuXHRcdFx0b3V0cHV0ID0gZGVjb2RlcihvdXRwdXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENoZWNrIGlzIHRoZSBvdXRwdXQgaXMgdmFsaWQsIG90aGVyd2lzZTogcmV0dXJuIGZhbHNlLlxyXG5cdFx0aWYgKCAhaXNWYWxpZE51bWJlcihvdXRwdXQpICkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9XHJcblxyXG5cclxuLy8gRnJhbWV3b3JrXHJcblxyXG5cdC8vIFZhbGlkYXRlIGZvcm1hdHRpbmcgb3B0aW9uc1xyXG5cdGZ1bmN0aW9uIHZhbGlkYXRlICggaW5wdXRPcHRpb25zICkge1xyXG5cclxuXHRcdHZhciBpLCBvcHRpb25OYW1lLCBvcHRpb25WYWx1ZSxcclxuXHRcdFx0ZmlsdGVyZWRPcHRpb25zID0ge307XHJcblxyXG5cdFx0aWYgKCBpbnB1dE9wdGlvbnNbJ3N1ZmZpeCddID09PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdGlucHV0T3B0aW9uc1snc3VmZml4J10gPSBpbnB1dE9wdGlvbnNbJ3Bvc3RmaXgnXTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKCBpID0gMDsgaSA8IEZvcm1hdE9wdGlvbnMubGVuZ3RoOyBpKz0xICkge1xyXG5cclxuXHRcdFx0b3B0aW9uTmFtZSA9IEZvcm1hdE9wdGlvbnNbaV07XHJcblx0XHRcdG9wdGlvblZhbHVlID0gaW5wdXRPcHRpb25zW29wdGlvbk5hbWVdO1xyXG5cclxuXHRcdFx0aWYgKCBvcHRpb25WYWx1ZSA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuXHRcdFx0XHQvLyBPbmx5IGRlZmF1bHQgaWYgbmVnYXRpdmVCZWZvcmUgaXNuJ3Qgc2V0LlxyXG5cdFx0XHRcdGlmICggb3B0aW9uTmFtZSA9PT0gJ25lZ2F0aXZlJyAmJiAhZmlsdGVyZWRPcHRpb25zLm5lZ2F0aXZlQmVmb3JlICkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gJy0nO1xyXG5cdFx0XHRcdC8vIERvbid0IHNldCBhIGRlZmF1bHQgZm9yIG1hcmsgd2hlbiAndGhvdXNhbmQnIGlzIHNldC5cclxuXHRcdFx0XHR9IGVsc2UgaWYgKCBvcHRpb25OYW1lID09PSAnbWFyaycgJiYgZmlsdGVyZWRPcHRpb25zLnRob3VzYW5kICE9PSAnLicgKSB7XHJcblx0XHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnNbb3B0aW9uTmFtZV0gPSAnLic7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEZsb2F0aW5nIHBvaW50cyBpbiBKUyBhcmUgc3RhYmxlIHVwIHRvIDcgZGVjaW1hbHMuXHJcblx0XHRcdH0gZWxzZSBpZiAoIG9wdGlvbk5hbWUgPT09ICdkZWNpbWFscycgKSB7XHJcblx0XHRcdFx0aWYgKCBvcHRpb25WYWx1ZSA+PSAwICYmIG9wdGlvblZhbHVlIDwgOCApIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9IG9wdGlvblZhbHVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3Iob3B0aW9uTmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gVGhlc2Ugb3B0aW9ucywgd2hlbiBwcm92aWRlZCwgbXVzdCBiZSBmdW5jdGlvbnMuXHJcblx0XHRcdH0gZWxzZSBpZiAoIG9wdGlvbk5hbWUgPT09ICdlbmNvZGVyJyB8fCBvcHRpb25OYW1lID09PSAnZGVjb2RlcicgfHwgb3B0aW9uTmFtZSA9PT0gJ2VkaXQnIHx8IG9wdGlvbk5hbWUgPT09ICd1bmRvJyApIHtcclxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvcHRpb25WYWx1ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9IG9wdGlvblZhbHVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3Iob3B0aW9uTmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gT3RoZXIgb3B0aW9ucyBhcmUgc3RyaW5ncy5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb3B0aW9uVmFsdWUgPT09ICdzdHJpbmcnICkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gb3B0aW9uVmFsdWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihvcHRpb25OYW1lKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBTb21lIHZhbHVlcyBjYW4ndCBiZSBleHRyYWN0ZWQgZnJvbSBhXHJcblx0XHQvLyBzdHJpbmcgaWYgY2VydGFpbiBjb21iaW5hdGlvbnMgYXJlIHByZXNlbnQuXHJcblx0XHR0aHJvd0VxdWFsRXJyb3IoZmlsdGVyZWRPcHRpb25zLCAnbWFyaycsICd0aG91c2FuZCcpO1xyXG5cdFx0dGhyb3dFcXVhbEVycm9yKGZpbHRlcmVkT3B0aW9ucywgJ3ByZWZpeCcsICduZWdhdGl2ZScpO1xyXG5cdFx0dGhyb3dFcXVhbEVycm9yKGZpbHRlcmVkT3B0aW9ucywgJ3ByZWZpeCcsICduZWdhdGl2ZUJlZm9yZScpO1xyXG5cclxuXHRcdHJldHVybiBmaWx0ZXJlZE9wdGlvbnM7XHJcblx0fVxyXG5cclxuXHQvLyBQYXNzIGFsbCBvcHRpb25zIGFzIGZ1bmN0aW9uIGFyZ3VtZW50c1xyXG5cdGZ1bmN0aW9uIHBhc3NBbGwgKCBvcHRpb25zLCBtZXRob2QsIGlucHV0ICkge1xyXG5cdFx0dmFyIGksIGFyZ3MgPSBbXTtcclxuXHJcblx0XHQvLyBBZGQgYWxsIG9wdGlvbnMgaW4gb3JkZXIgb2YgRm9ybWF0T3B0aW9uc1xyXG5cdFx0Zm9yICggaSA9IDA7IGkgPCBGb3JtYXRPcHRpb25zLmxlbmd0aDsgaSs9MSApIHtcclxuXHRcdFx0YXJncy5wdXNoKG9wdGlvbnNbRm9ybWF0T3B0aW9uc1tpXV0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFwcGVuZCB0aGUgaW5wdXQsIHRoZW4gY2FsbCB0aGUgbWV0aG9kLCBwcmVzZW50aW5nIGFsbFxyXG5cdFx0Ly8gb3B0aW9ucyBhcyBhcmd1bWVudHMuXHJcblx0XHRhcmdzLnB1c2goaW5wdXQpO1xyXG5cdFx0cmV0dXJuIG1ldGhvZC5hcHBseSgnJywgYXJncyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB3TnVtYiAoIG9wdGlvbnMgKSB7XHJcblxyXG5cdFx0aWYgKCAhKHRoaXMgaW5zdGFuY2VvZiB3TnVtYikgKSB7XHJcblx0XHRcdHJldHVybiBuZXcgd051bWIgKCBvcHRpb25zICk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0eXBlb2Ygb3B0aW9ucyAhPT0gXCJvYmplY3RcIiApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdG9wdGlvbnMgPSB2YWxpZGF0ZShvcHRpb25zKTtcclxuXHJcblx0XHQvLyBDYWxsICdmb3JtYXRUbycgd2l0aCBwcm9wZXIgYXJndW1lbnRzLlxyXG5cdFx0dGhpcy50byA9IGZ1bmN0aW9uICggaW5wdXQgKSB7XHJcblx0XHRcdHJldHVybiBwYXNzQWxsKG9wdGlvbnMsIGZvcm1hdFRvLCBpbnB1dCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIENhbGwgJ2Zvcm1hdEZyb20nIHdpdGggcHJvcGVyIGFyZ3VtZW50cy5cclxuXHRcdHRoaXMuZnJvbSA9IGZ1bmN0aW9uICggaW5wdXQgKSB7XHJcblx0XHRcdHJldHVybiBwYXNzQWxsKG9wdGlvbnMsIGZvcm1hdEZyb20sIGlucHV0KTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gd051bWI7XHJcblxyXG59KSk7XHJcbiJdfQ==
