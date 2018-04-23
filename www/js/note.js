function Note(value) {
	this.value = value;
}

Note.prototype.createMesh = function() {
	var geometry = new THREE.SphereGeometry( 2, 30, 30);
	return geometry;
}