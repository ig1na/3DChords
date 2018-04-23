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