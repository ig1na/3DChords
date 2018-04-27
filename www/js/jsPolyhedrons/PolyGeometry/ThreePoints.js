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
		positions.push(allPoints[notes[note]].clone().x * scale);
		positions.push(allPoints[notes[note]].clone().y * scale);
		positions.push(allPoints[notes[note]].clone().z * scale);
	}

	normals.push(0,1,2);
	normals.push(2,1,0);

	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );

	var mesh = new THREE.Mesh(geometry, transparentMaterialFront);

	this.group.add(mesh);
	//this.group.add(new PolySpheresFromNotes(notes));

	return this.group;
}