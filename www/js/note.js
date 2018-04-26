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