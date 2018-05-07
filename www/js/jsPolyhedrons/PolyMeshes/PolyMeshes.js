function PolyMeshes(geometry, notes) {
	this.group = new THREE.Group();

	this.group.add(new TranspMeshGrp(geometry));
	//this.group.add(new PolySpheresFromNotes(notes));
	return this.group;
}

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
			throw "Can't create mesh for so much points";
			break;
	}
}

PolyMeshes.prototype.setPos = function(x,y,z) {
	this.group.position.x = x;
	this.group.position.y = y;
	this.group.position.z = z;
}