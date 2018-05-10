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